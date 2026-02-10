#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"

OVERLAY_DIR="${REPO_ROOT}/infra/k8s/overlays/prod"
NAMESPACE="${NAMESPACE:-closecount}"

info() { printf '[deploy-prod] %s\n' "$*"; }
warn() { printf '[deploy-prod] WARN: %s\n' "$*"; }
err() { printf '[deploy-prod] ERROR: %s\n' "$*" >&2; }

die() { err "$*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

require_cmd kubectl

ctx="$(kubectl config current-context 2>/dev/null || true)"
if [[ -z "$ctx" ]]; then
  die "kubectl has no current context. Run: kubectl config get-contexts && kubectl config use-context <context>"
fi

info "Using context: $ctx"

# Verify we can reach the API server (avoids localhost:8080 surprises)
if ! kubectl cluster-info >/dev/null 2>&1; then
  die "Cannot reach cluster with current kubeconfig/context. Fix kubeconfig (your errors to http://localhost:8080 indicate no valid context)."
fi

if [[ ! -d "$OVERLAY_DIR" ]]; then
  die "Overlay dir not found: $OVERLAY_DIR"
fi

secrets_env="$OVERLAY_DIR/secrets/server-secrets.env"
if [[ ! -f "$secrets_env" ]]; then
  die "Missing $secrets_env. Create it from example: cp $OVERLAY_DIR/secrets/server-secrets.env.example $secrets_env"
fi

# Basic prereq checks (warn-only; clusters vary)
if ! kubectl get ingressclass nginx >/dev/null 2>&1; then
  warn "IngressClass 'nginx' not found. Install ingress-nginx (or adjust ingressClassName in $OVERLAY_DIR/ingress.yaml)."
fi

if ! kubectl get clusterissuer letsencrypt-prod >/dev/null 2>&1; then
  warn "ClusterIssuer 'letsencrypt-prod' not found. Install cert-manager + issuer (or adjust cert-manager annotation in $OVERLAY_DIR/ingress.yaml)."
fi

if ! kubectl get storageclass >/dev/null 2>&1; then
  warn "No StorageClass found. Mongo StatefulSet PVC will stay Pending until a StorageClass/provisioner is available."
fi

info "Rendering manifests (offline) to /tmp/closecount-prod.yaml"
kubectl kustomize "$OVERLAY_DIR" > /tmp/closecount-prod.yaml

info "kubectl diff (may exit 1 when differences exist)"
if ! kubectl diff -k "$OVERLAY_DIR"; then
  warn "diff reported changes (or diff not supported). Continuing to apply."
fi

info "Applying: kubectl apply -k $OVERLAY_DIR"
kubectl apply -k "$OVERLAY_DIR"

info "Waiting for rollouts in namespace: $NAMESPACE"
kubectl -n "$NAMESPACE" rollout status deploy/closecount-server --timeout=180s || warn "Server rollout not complete yet. Check pods/events."
kubectl -n "$NAMESPACE" rollout status deploy/closecount-client --timeout=180s || warn "Client rollout not complete yet. Check pods/events."

info "Current status:"
kubectl -n "$NAMESPACE" get all
kubectl -n "$NAMESPACE" get ingress || true
kubectl -n "$NAMESPACE" get pvc || true
kubectl -n "$NAMESPACE" get hpa || true

info "If using cert-manager, check TLS readiness: kubectl -n $NAMESPACE get certificate,certificaterequest"
