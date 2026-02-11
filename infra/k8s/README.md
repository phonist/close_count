# CloseCount Kubernetes

This directory now uses a base + overlay structure:

- `base`: shared workload and security baseline.
- `overlays/dev`: local kind deployment.
- `overlays/prod`: production-oriented baseline (TLS ingress, HPA, PDB, StatefulSet Mongo).

`infra/k8s/kustomization.yaml` points to `overlays/dev` for backward-compatible local commands.

## Dev on kind

### Prereqs
- `kind`
- `kubectl`
- `docker`

### Deploy (script)
```bash
infra/k8s/scripts/deploy-dev.sh
```

### Destroy (script)
```bash
# Deletes overlay resources
infra/k8s/scripts/destroy-dev.sh

# Also delete PV/PVC (data loss)
infra/k8s/scripts/destroy-dev.sh --delete-pv-pvc

# Also delete kind cluster
infra/k8s/scripts/destroy-dev.sh --delete-cluster
```

### Manual steps (reference)

### 1) Create cluster
```bash
kind create cluster --name closecount --config infra/k8s/kind-config.yaml
```

### 2) Install ingress-nginx
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

### 3) Build and load images
```bash
docker build -t close-count-client:dev ./client
docker build -t close-count-server:dev ./server
kind load docker-image close-count-client:dev --name closecount
kind load docker-image close-count-server:dev --name closecount
```

### 4) Deploy
```bash
kubectl apply -k infra/k8s/overlays/dev
```

Or:
```bash
kubectl apply -k infra/k8s
```

### 5) Local DNS
Add this line to `/etc/hosts`:
```
127.0.0.1 closecount.local
```

Open:
- http://closecount.local

### 6) Cleanup
```bash
kubectl delete -k infra/k8s/overlays/dev
kind delete cluster --name closecount
```

## Production baseline overlay

### Prereqs (cluster)
- A reachable kube context (`kubectl cluster-info` works).
- ingress-nginx installed (IngressClass `nginx`).
- cert-manager installed with a `ClusterIssuer` named `letsencrypt-prod` (or adjust the ingress annotation).
- A default StorageClass (Mongo StatefulSet uses a PVC without `storageClassName`).

### Configure (repo)
1) Update `infra/k8s/overlays/prod/ingress.yaml`:
   - Replace `closecount.example.com` with your real domain.
   - Ensure DNS points at your ingress controller load balancer.

2) Ensure your application env vars match your real domain:
   - Server/client deployments in `infra/k8s/base` currently use `https://closecount.example.com` and `https://closecount.example.com/api`.
   - Patch them in `infra/k8s/overlays/prod` (recommended) or edit base if you truly want it global.

3) Set server secret:
```bash
cp infra/k8s/overlays/prod/secrets/server-secrets.env.example \
  infra/k8s/overlays/prod/secrets/server-secrets.env
```

Then set a strong `JWT_SECRET` and deploy.

### Deploy (script)
```bash
infra/k8s/scripts/deploy-prod.sh
```

### Destroy (script)
```bash
# Deletes overlay resources
infra/k8s/scripts/destroy-prod.sh

# Also delete PVCs (data loss)
infra/k8s/scripts/destroy-prod.sh --delete-pvcs

# Also delete the namespace (deletes everything in it)
infra/k8s/scripts/destroy-prod.sh --delete-namespace
```

Notes:
- Prod ingress assumes `closecount.example.com` and `cert-manager` `ClusterIssuer` `letsencrypt-prod`.
- Replace image names/tags via kustomize `images` config or CI before deployment.
- See `infra/k8s/SECRET_EXTERNALIZATION_PLAN.md` for moving to external secret manager.
