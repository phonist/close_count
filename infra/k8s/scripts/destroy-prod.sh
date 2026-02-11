#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"

OVERLAY_DIR="${REPO_ROOT}/infra/k8s/overlays/prod"
NAMESPACE="${NAMESPACE:-closecount}"
DELETE_PVCS=0
DELETE_NAMESPACE=0
ASSUME_YES=0

info() { printf '[destroy-prod] %s\n' "$*"; }
warn() { printf '[destroy-prod] WARN: %s\n' "$*"; }
err() { printf '[destroy-prod] ERROR: %s\n' "$*" >&2; }

die() { err "$*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--delete-pvcs] [--delete-namespace] [--yes]

Deletes resources from kustomize overlay: $OVERLAY_DIR

Options:
  --delete-pvcs        Also delete PVCs in namespace '$NAMESPACE' (data loss).
  --delete-namespace   Also delete the namespace '$NAMESPACE' (deletes everything in it).
  --yes                Skip confirmation prompt.

Environment:
  NAMESPACE=<name>     Namespace to operate on (default: closecount)
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --delete-pvcs) DELETE_PVCS=1; shift ;;
    --delete-namespace) DELETE_NAMESPACE=1; shift ;;
    --yes) ASSUME_YES=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1 (use --help)" ;;
  esac
done

require_cmd kubectl

ctx="$(kubectl config current-context 2>/dev/null || true)"
if [[ -z "$ctx" ]]; then
  die "kubectl has no current context. Run: kubectl config get-contexts && kubectl config use-context <context>"
fi

info "Using context: $ctx"

if ! kubectl cluster-info >/dev/null 2>&1; then
  die "Cannot reach cluster with current kubeconfig/context."
fi

if [[ "$ASSUME_YES" -ne 1 ]]; then
  info "About to delete kustomize overlay resources: $OVERLAY_DIR"
  if [[ "$DELETE_PVCS" -eq 1 ]]; then
    warn "--delete-pvcs enabled: this will delete PVCs in namespace '$NAMESPACE' (data loss)."
  fi
  if [[ "$DELETE_NAMESPACE" -eq 1 ]]; then
    warn "--delete-namespace enabled: this will delete namespace '$NAMESPACE' (deletes everything inside it)."
  fi

  printf "Type '%s' to continue: " "$NAMESPACE"
  read -r confirm
  if [[ "$confirm" != "$NAMESPACE" ]]; then
    die "Confirmation did not match. Aborting."
  fi
fi

info "Deleting overlay resources"
# Ignore not-found errors for idempotency
kubectl delete -k "$OVERLAY_DIR" --ignore-not-found

if [[ "$DELETE_PVCS" -eq 1 ]]; then
  info "Deleting PVCs in namespace: $NAMESPACE"
  kubectl -n "$NAMESPACE" delete pvc --all --ignore-not-found || true
fi

if [[ "$DELETE_NAMESPACE" -eq 1 ]]; then
  info "Deleting namespace: $NAMESPACE"
  kubectl delete namespace "$NAMESPACE" --ignore-not-found || true
fi

info "Remaining objects (best-effort):"
kubectl -n "$NAMESPACE" get all 2>/dev/null || true
kubectl -n "$NAMESPACE" get pvc 2>/dev/null || true
