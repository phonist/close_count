#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"

CLUSTER_NAME="${CLUSTER_NAME:-closecount}"
OVERLAY_DIR="${REPO_ROOT}/infra/k8s/overlays/dev"
NAMESPACE="${NAMESPACE:-closecount}"

DELETE_PV_PVC=1
DELETE_CLUSTER=1
ASSUME_YES=1

info() { printf '[destroy-dev] %s\n' "$*"; }
warn() { printf '[destroy-dev] WARN: %s\n' "$*"; }
err() { printf '[destroy-dev] ERROR: %s\n' "$*" >&2; }

die() { err "$*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--delete-pv-pvc] [--delete-cluster] [--yes]

Deletes resources from kustomize overlay: $OVERLAY_DIR

Options:
  --delete-pv-pvc    Also delete the dev Mongo PV+PVC (data loss).
  --delete-cluster   Also delete the kind cluster '$CLUSTER_NAME'.
  --yes              Skip confirmation prompt.

Environment:
  CLUSTER_NAME=<name>  kind cluster name (default: closecount)
  NAMESPACE=<name>     Namespace to operate on (default: closecount)
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --delete-pv-pvc) DELETE_PV_PVC=1; shift ;;
    --delete-cluster) DELETE_CLUSTER=1; shift ;;
    --yes) ASSUME_YES=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown arg: $1 (use --help)" ;;
  esac
done

require_cmd kubectl
require_cmd kind

ctx="kind-$CLUSTER_NAME"
if [[ "$ASSUME_YES" -ne 1 ]]; then
  info "About to delete dev overlay resources: $OVERLAY_DIR"
  info "Target context (if it exists): $ctx"
  if [[ "$DELETE_PV_PVC" -eq 1 ]]; then
    warn "--delete-pv-pvc enabled: deletes PV/PVC (data loss). PV uses hostPath /data/closecount-mongo inside the kind node."
  fi
  if [[ "$DELETE_CLUSTER" -eq 1 ]]; then
    warn "--delete-cluster enabled: deletes kind cluster '$CLUSTER_NAME'."
  fi

  printf "Type '%s' to continue: " "$NAMESPACE"
  read -r confirm
  if [[ "$confirm" != "$NAMESPACE" ]]; then
    die "Confirmation did not match. Aborting."
  fi
fi

# Best-effort: use kind context if present
kubectl config use-context "$ctx" >/dev/null 2>&1 || true

info "Deleting overlay resources"
kubectl delete -k "$OVERLAY_DIR" --ignore-not-found

if [[ "$DELETE_PV_PVC" -eq 1 ]]; then
  info "Deleting PVC/PV"
  kubectl -n "$NAMESPACE" delete pvc closecount-mongo-pvc --ignore-not-found || true
  kubectl delete pv closecount-mongo-pv --ignore-not-found || true
fi

info "Remaining objects (best-effort):"
kubectl -n "$NAMESPACE" get all 2>/dev/null || true
kubectl -n "$NAMESPACE" get pvc 2>/dev/null || true

if [[ "$DELETE_CLUSTER" -eq 1 ]]; then
  info "Deleting kind cluster: $CLUSTER_NAME"
  kind delete cluster --name "$CLUSTER_NAME"
fi
