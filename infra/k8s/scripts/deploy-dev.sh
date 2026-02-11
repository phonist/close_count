#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"

CLUSTER_NAME="${CLUSTER_NAME:-closecount}"
KIND_CONFIG="${KIND_CONFIG:-${REPO_ROOT}/infra/k8s/kind-config.yaml}"
OVERLAY_DIR="${REPO_ROOT}/infra/k8s/overlays/dev"
NAMESPACE="${NAMESPACE:-closecount}"

SKIP_CLUSTER_CREATE=0
SKIP_INGRESS_NGINX=0
SKIP_BUILD=1
SKIP_LOAD=0

info() { printf '[deploy-dev] %s\n' "$*"; }
warn() { printf '[deploy-dev] WARN: %s\n' "$*\n"; }
err() { printf '[deploy-dev] ERROR: %s\n' "$*" >&2; }

die() { err "$*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--skip-cluster-create] [--skip-ingress-nginx] [--skip-build] [--skip-load]

Default flow:
  1) Ensure kind cluster exists ($CLUSTER_NAME)
  2) Install ingress-nginx (for closecount.local ingress)
  3) Build images close-count-{client,server}:dev
  4) Load images into kind
  5) Apply kustomize overlay ($OVERLAY_DIR)

Options:
  --skip-cluster-create  Don't create a kind cluster.
  --skip-ingress-nginx   Don't install ingress-nginx.
  --skip-build           Don't docker build images.
  --skip-load            Don't kind load images.

Environment:
  CLUSTER_NAME=<name>    kind cluster name (default: closecount)
  KIND_CONFIG=<path>     kind config file (default: infra/k8s/kind-config.yaml)
  NAMESPACE=<name>       Namespace to deploy into (default: closecount)
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-cluster-create) SKIP_CLUSTER_CREATE=1; shift ;;
    --skip-ingress-nginx) SKIP_INGRESS_NGINX=1; shift ;;
    --skip-build) SKIP_BUILD=1; shift ;;
    --skip-load) SKIP_LOAD=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1 (use --help)" ;;
  esac
done

require_cmd kubectl
require_cmd kind
require_cmd docker

if [[ ! -d "$OVERLAY_DIR" ]]; then
  die "Overlay dir not found: $OVERLAY_DIR"
fi

if [[ "$SKIP_CLUSTER_CREATE" -ne 1 ]]; then
  if kind get clusters 2>/dev/null | grep -qx "$CLUSTER_NAME"; then
    info "kind cluster already exists: $CLUSTER_NAME"
  else
    info "Creating kind cluster: $CLUSTER_NAME"
    [[ -f "$KIND_CONFIG" ]] || die "Kind config not found: $KIND_CONFIG"
    kind create cluster --name "$CLUSTER_NAME" --config "$KIND_CONFIG"
  fi
fi

ctx="kind-$CLUSTER_NAME"
info "Using context: $ctx"
kubectl config use-context "$ctx" >/dev/null 2>&1 || die "Failed to use context $ctx. Does the kind cluster '$CLUSTER_NAME' exist?"

# Verify connectivity
kubectl cluster-info >/dev/null 2>&1 || die "Cannot reach cluster using context $ctx"

if [[ "$SKIP_INGRESS_NGINX" -ne 1 ]]; then
  if kubectl get ns ingress-nginx >/dev/null 2>&1; then
    info "ingress-nginx namespace exists; skipping install"
  else
    info "Installing ingress-nginx (kind)"
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
  fi

  info "Waiting for ingress-nginx controller"
  kubectl wait --namespace ingress-nginx \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=120s || warn "ingress-nginx controller not ready yet. Ingress may not work until it becomes ready."
fi

if [[ "$SKIP_BUILD" -ne 1 ]]; then
  info "Building images"
  docker build -t close-count-client:dev "${REPO_ROOT}/client"
  docker build -t close-count-server:dev "${REPO_ROOT}/server"
fi

if [[ "$SKIP_LOAD" -ne 1 ]]; then
  info "Loading images into kind"
  kind load docker-image close-count-client:dev --name "$CLUSTER_NAME"
  kind load docker-image close-count-server:dev --name "$CLUSTER_NAME"
fi

# Host resolution check (best-effort)
if command -v getent >/dev/null 2>&1; then
  if ! getent hosts closecount.local >/dev/null 2>&1; then
    warn "closecount.local does not resolve. Add to /etc/hosts: 127.0.0.1 closecount.local"
  fi
else
  warn "getent not found; cannot check /etc/hosts. Ensure closecount.local resolves to 127.0.0.1"
fi

info "kubectl diff (may exit 1 when differences exist)"
if ! kubectl diff -k "$OVERLAY_DIR"; then
  warn "diff reported changes (or diff not supported). Continuing to apply."
fi

info "Applying: kubectl apply -k $OVERLAY_DIR"
kubectl apply -k "$OVERLAY_DIR"

info "Waiting for rollouts in namespace: $NAMESPACE"
kubectl -n "$NAMESPACE" rollout status deploy/closecount-mongodb --timeout=180s || warn "Mongo rollout not complete yet. Check pods/events."
kubectl -n "$NAMESPACE" rollout status deploy/closecount-server --timeout=180s || warn "Server rollout not complete yet. Check pods/events."
kubectl -n "$NAMESPACE" rollout status deploy/closecount-client --timeout=180s || warn "Client rollout not complete yet. Check pods/events."

info "Current status:"
kubectl -n "$NAMESPACE" get all
kubectl -n "$NAMESPACE" get ingress || true
kubectl -n "$NAMESPACE" get pvc,pv || true

info "Open: http://closecount.local"
