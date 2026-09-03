# OpsDesk

OpsDesk is a production-style Node.js Incident and Service Request Management API. The project is containerized with Docker and deployed to Kubernetes using Helm.

## Phase 1: Local API and Health Checks

Completed:

- Node.js Express API created
- `GET /health` endpoint added
- `GET /ready` endpoint added
- `GET /api/incidents` endpoint added
- `POST /api/incidents` endpoint added
- Local API tested in browser and PowerShell

## Run Locally

```powershell
npm.cmd install
node .\app.js
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Liveness health check |
| GET | `/ready` | Readiness health check |
| GET | `/api/incidents` | View all incidents |
| POST | `/api/incidents` | Create a new incident |

## Phase 2: Docker Container

Completed:

- Created a Dockerfile for the Node.js API
- Built Docker image: `opsdesk-api:1.0`
- Ran the application as a Docker container
- Tested `/health` and incident creation through the container

## Run with Docker

```powershell
docker build -t opsdesk-api:1.0 .
docker run -d --name opsdesk-api -p 3001:3000 opsdesk-api:1.0
```

Open `http://localhost:3001/health` in a browser.

## Phase 3: Kubernetes Deployment and Service

Completed:

- Created the `opsdesk` Kubernetes namespace
- Deployed two replicas of the OpsDesk API
- Used labels and selectors to connect the Deployment, Pods, and Service
- Created a ClusterIP Service on port `80` that forwards traffic to container port `3000`
- Loaded the local Docker image into Minikube
- Tested the API through the Kubernetes Service

## Deploy to Kubernetes

```powershell
minikube image load opsdesk-api:1.0
kubectl apply -f .\k8s\namespace.yaml
kubectl apply -f .\k8s\deployment.yaml
kubectl apply -f .\k8s\service.yaml
```

## Verify Kubernetes Resources

```powershell
kubectl get all -n opsdesk
kubectl get pods -n opsdesk -l app.kubernetes.io/name=opsdesk-api --show-labels
kubectl get endpoints opsdesk-api -n opsdesk
kubectl port-forward service/opsdesk-api -n opsdesk 8081:80
```

## Phase 4: Helm Chart Packaging

Completed:

- Created a reusable Helm chart in `helm/opsdesk`
- Added configurable `values.yaml` for replica count, image, and Service ports
- Created Helm templates for the OpsDesk Deployment and Service
- Validated the chart with `helm lint`
- Rendered Kubernetes YAML with `helm template`
- Installed the chart as Helm release `opsdesk`
- Verified Helm release revision 1 and tested the API through the Helm-managed Service

## Deploy with Helm

```powershell
helm lint .\helm\opsdesk
helm install opsdesk .\helm\opsdesk --namespace opsdesk --wait --timeout 2m
helm list -n opsdesk
kubectl port-forward service/opsdesk-api -n opsdesk 8082:80
```

Open `http://localhost:8082/health` in a browser.

## Current Limitation

Incident data is currently stored in application memory. PostgreSQL persistence, probes, resource limits, and Ingress will be added in later phases.