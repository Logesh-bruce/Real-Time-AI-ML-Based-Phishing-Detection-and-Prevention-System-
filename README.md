# PhishGuard AI/ML Phishing Detection System

A complete, real-time, full-stack SaaS application for detecting and preventing phishing attacks using Machine Learning.

## Architecture
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **API Gateway**: Node.js, Express (Port 8080)
- **Detection API**: Node.js, Express, Socket.io (Port 3001)
- **NLP Service**: Python, FastAPI, DistilBERT (Port 8001)
- **URL Service**: Python, FastAPI, GNN (Port 8002)
- **Visual Service**: Python, FastAPI, CNN (Port 8003)

## Quick Start (Windows)

1. Ensure you have **Python 3.10+** and **Node.js 18+** installed.
2. Run `setup.bat` to install all dependencies and train the ML models.
3. Run `start-all.bat` to launch all 6 microservices.
4. Open `http://localhost:3000` to view the dashboard.

## Services Overview

- `nlp-service`: Uses DistilBERT to analyze email and SMS text for phishing patterns.
- `url-service`: Uses Graph Neural Networks (GNN) and heuristics to classify domains.
- `visual-service`: Uses CNNs to analyze screenshots of websites for brand impersonation.
- `detection-api`: Orchestrates the ML services, saves results to the database, and broadcasts via WebSockets.
- `api-gateway`: Handles API key authentication, rate limiting, and routing.
- `frontend`: The Next.js dashboard for real-time monitoring.

## API Authentication
The API Gateway requires an API key in the `x-api-key` header.
Default Dev Key: `testkey_smoke_test_12345`
