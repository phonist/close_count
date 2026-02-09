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

Before deploy:
```bash
cp infra/k8s/overlays/prod/secrets/server-secrets.env.example \
  infra/k8s/overlays/prod/secrets/server-secrets.env
```

Then set a strong `JWT_SECRET` and deploy:
```bash
kubectl apply -k infra/k8s/overlays/prod
```

Notes:
- Prod ingress assumes `closecount.example.com` and `cert-manager` `ClusterIssuer` `letsencrypt-prod`.
- Replace image names/tags via kustomize `images` config or CI before deployment.
- See `infra/k8s/SECRET_EXTERNALIZATION_PLAN.md` for moving to external secret manager.
