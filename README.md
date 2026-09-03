# OpsDesk

OpsDesk is a production-style Node.js Incident and Service Request Management API. The project will be containerized with Docker and deployed to Kubernetes using Helm.

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

## Docker Test Result

A `POST /api/incidents` request successfully created a P2 incident from the Docker container.

## Current Limitation

Incident data is currently stored in application memory. It will be moved to PostgreSQL in a later phase.