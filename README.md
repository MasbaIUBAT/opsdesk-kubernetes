# OpsDesk: Kubernetes-Deployed Incident Management Platform

OpsDesk is a production-style IT Incident and Service Request Management application. Users can create and view incidents through a browser dashboard. The application is built with Node.js and Express, stores data in MongoDB Atlas, and is deployed to Kubernetes using Docker and Helm.

## Project Overview

OpsDesk demonstrates an end-to-end containerized application workflow:

```text
Browser Dashboard
       ↓
Kubernetes Service
       ↓
OpsDesk API Pods (2 replicas)
       ↓
MongoDB Atlas
```

MongoDB credentials are injected into Kubernetes Pods through a Kubernetes Secret. They are not stored in source code or committed to GitHub.

## Technology Stack

* Node.js and Express
* MongoDB Atlas and Mongoose
* HTML, CSS, and JavaScript browser dashboard
* Docker
* Kubernetes and Minikube
* Helm
* Git and GitHub

## Features

* Browser-based incident creation form
* Incident dashboard with severity and status
* `GET /health` liveness endpoint
* `GET /ready` readiness endpoint
* `GET /api/incidents` endpoint
* `POST /api/incidents` endpoint
* Persistent incident storage in MongoDB Atlas
* Docker containerization
* Kubernetes Deployment with two replicas
* Helm chart for reusable deployment configuration
* Kubernetes Secret for MongoDB credentials
* Liveness and readiness probes
* CPU and memory requests/limits
* Pod self-healing through Kubernetes Deployment

## API Endpoints

| Method | Endpoint         | Purpose                |
| ------ | ---------------- | ---------------------- |
| GET    | `/health`        | Liveness health check  |
| GET    | `/ready`         | Readiness health check |
| GET    | `/api/incidents` | View all incidents     |
| POST   | `/api/incidents` | Create a new incident  |

## Phase 1: Local API and Health Checks

Completed:

* Created a Node.js Express API
* Added health and readiness endpoints
* Added incident API endpoints
* Tested the local API in a browser and PowerShell

## Phase 2: Docker Containerization

Completed:

* Created a Dockerfile for the Node.js application
* Built Docker images for the application
* Tested the application in a Docker container
* Published the browser dashboard through the container

## Phase 3: Kubernetes Deployment and Service

Completed:

* Created the `opsdesk` namespace
* Deployed two API replicas
* Created a ClusterIP Service on port `80`
* Connected the Service to Pods using labels and selectors
* Loaded local Docker images into Minikube

The `k8s/` directory contains the foundational raw Kubernetes manifests used during the learning phase. The current deployment is Helm-managed.

## Phase 4: Helm Chart Packaging

Completed:

* Created a reusable Helm chart in `helm/opsdesk`
* Added configurable values for replica count, image, ports, probes, resources, and database Secret
* Created Helm templates for Deployment and Service
* Validated the chart with `helm lint`
* Deployed the application as Helm release `opsdesk`

## Phase 5: Health Probes, Resource Limits, and Self-Healing

Completed:

* Added a liveness probe using `GET /health`
* Added a readiness probe using `GET /ready`
* Configured CPU request/limit: `50m` / `100m`
* Configured memory request/limit: `64Mi` / `128Mi`
* Verified probe and resource configuration using `kubectl describe deployment`
* Deleted a running Pod and verified Kubernetes created a replacement automatically

## Phase 6: Browser Incident Dashboard

Completed:

* Added a browser-based OpsDesk dashboard
* Added an incident creation form with severity selection
* Added an incident table that loads data from the API
* Tested incident creation through the browser UI

## Phase 7: MongoDB Atlas Persistence

Completed:

* Created an external MongoDB Atlas database
* Replaced in-memory incident storage with Mongoose and MongoDB Atlas
* Added a local `.env` configuration file for local development
* Added `.env` to `.gitignore`
* Created Kubernetes Secret `opsdesk-db` from the local `.env` file
* Injected `MONGODB_URI` and `MONGODB_DB_NAME` into Pods through the Helm Deployment template
* Built and deployed image `opsdesk-api:1.2`
* Upgraded the Helm release to revision 4
* Created an incident through the Helm-managed browser dashboard
* Deleted a Pod and confirmed the incident still existed after Kubernetes created a replacement Pod

## Run Locally

Create a local `.env` file. Do not commit this file.

```env
MONGODB_URI=<your-mongodb-atlas-connection-string>
MONGODB_DB_NAME=opsdesk
```

Install dependencies and start the application:

```powershell
npm.cmd install
node .\app.js
```

Open `http://localhost:3000` in a browser.

## Run with Docker

```powershell
docker build -t opsdesk-api:1.2 .
docker run -d --name opsdesk-ui -p 3002:3000 opsdesk-api:1.2
```

Open `http://localhost:3002` in a browser.

## Deploy to Kubernetes with Helm

Start Minikube and load the image:

```powershell
minikube start --driver=docker --cpus=2 --memory=3072mb
minikube image load opsdesk-api:1.2
```

Create the namespace and MongoDB Secret from the local `.env` file:

```powershell
kubectl create namespace opsdesk
kubectl create secret generic opsdesk-db --from-env-file=.env -n opsdesk
```

Validate and deploy the Helm chart:

```powershell
helm lint .\helm\opsdesk
helm upgrade --install opsdesk .\helm\opsdesk --namespace opsdesk --wait --timeout 2m
helm list -n opsdesk
```

Access the Helm-managed dashboard:

```powershell
kubectl port-forward service/opsdesk-api -n opsdesk 8085:80
```

Open `http://localhost:8085` in a browser.

## Verify the Deployment

```powershell
kubectl get all -n opsdesk
kubectl get pods -n opsdesk
kubectl logs deployment/opsdesk-api -n opsdesk --tail=20
```

Expected application log:

```text
OpsDesk API is running on port 3000
MongoDB connected
```

## Verify Self-Healing and Persistence

```powershell
kubectl get pods -n opsdesk
kubectl delete pod <pod-name> -n opsdesk
kubectl get pods -n opsdesk
```

Kubernetes creates a replacement Pod to maintain two replicas. Refresh the dashboard after replacement; incidents remain available because they are stored in MongoDB Atlas rather than Pod memory.

## Project Structure

```text
opsdesk/
├── app.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .gitignore
├── README.md
├── public/
│   └── index.html
├── k8s/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   └── service.yaml
└── helm/
    └── opsdesk/
        ├── Chart.yaml
        ├── values.yaml
        └── templates/
            ├── deployment.yaml
            └── service.yaml
```

## Security Notes

* `.env` is excluded from Git through `.gitignore`.
* MongoDB credentials are stored in Kubernetes Secret `opsdesk-db`.
* Database passwords and connection strings must never be committed to GitHub.
* Atlas network access should be restricted to required IP addresses.

## Current Limitations

OpsDesk is a portfolio and local Kubernetes project. It does not yet include:

* User authentication and authorization
* CI/CD automation
* Public Ingress and TLS
* Incident update, delete, assignment, and notification features
