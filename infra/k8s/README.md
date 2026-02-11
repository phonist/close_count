# CloseCount on kind

This is a dev-friendly Kubernetes setup that mirrors `docker-compose.yml`.

## Prereqs
- `kind`
- `kubectl`
- `docker`

## 1) Create a kind cluster
```bash
kind create cluster --name closecount --config infra/k8s/kind-config.yaml
```

## 2) Install ingress-nginx
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

## 3) Build images and load into kind
```bash
docker build -t close-count-client:dev ./client
docker build -t close-count-server:dev ./server. 
kind load docker-image close-count-client:dev --name closecount
kind load docker-image close-count-server:dev --name closecount
```

## 4) Deploy
```bash
kubectl apply -k infra/k8s
```

## 5) Add local DNS entry
Add this line to `/etc/hosts`:
```
127.0.0.1 closecount.local
```

Then open:
- http://closecount.local

## 6) Cleanup
```bash
kubectl delete -k infra/k8s
kind delete cluster --name closecount
```
