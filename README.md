# 🛡️ PhishGuard — AI/ML Phishing Detection System

> A complete, real-time, full-stack SaaS application for detecting and preventing phishing attacks using Machine Learning. PhishGuard combines multiple AI models — NLP, Graph Neural Networks, and Computer Vision — to deliver multi-layered phishing protection across URLs, emails, and visual content.

🔗 **Live Demo:** [https://real-time-ai-ml-based-phishing-dete.vercel.app/](https://real-time-ai-ml-based-phishing-dete.vercel.app/)

---

## 📸 Screenshots

### 🗂️ Repository Structure
The project is organized as a monorepo containing 6 independent microservices, each responsible for a distinct detection capability. The repository follows a clean separation of concerns — frontend, gateway, and AI services are fully decoupled.


---

### 📊 Dashboard Overview
The PhishGuard dashboard provides a real-time view of all phishing detection activity. Threats are visualized with live charts, recent scan history, and system health indicators — all powered by WebSocket connections to the backend detection pipeline.

![PhishGuard Dashboard](Dashboard%20phising.png)

---

### 🔍 Threat Detection Interface
The Detection page allows users to analyze suspicious URLs, emails, or raw text through dedicated tabs. Simply paste a target URL and an optional legitimate domain for spoofing comparison, then hit **Analyze URL** — results are returned in real time using the AI/ML backend services.

![Threat Detection Interface](./Detection%20phising.png)

---

## 🏗️ Architecture

PhishGuard is built as a **microservices architecture**, where each service runs independently and communicates through the API Gateway. This design ensures high scalability and allows each ML model to be updated or replaced without affecting the rest of the system.

| Layer | Stack | Port |
|---|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts | 3000 |
| **API Gateway** | Node.js, Express | 8080 |
| **Detection API** | Node.js, Express, Socket.io | 3001 |
| **NLP Service** | Python, FastAPI, DistilBERT | 8001 |
| **URL Service** | Python, FastAPI, GNN | 8002 |
| **Visual Service** | Python, FastAPI, CNN | 8003 |

---

## 🚀 Quick Start (Windows)

```bash
# 1. Ensure you have Python 3.10+ and Node.js 18+ installed

# 2. Install all dependencies and train the ML models
setup.bat

# 3. Launch all 6 microservices
start-all.bat

# 4. Open the dashboard
http://localhost:3000
```

---

## 🧠 Services Overview

PhishGuard uses three specialized AI/ML models working in parallel, coordinated by the Detection API, to analyze threats from multiple angles simultaneously.

### `nlp-service`
Uses **DistilBERT** (a lightweight transformer model) to analyze email and SMS text for phishing patterns. It identifies urgency language, suspicious sender patterns, credential-harvesting attempts, and social engineering cues in natural language.

### `url-service`
Uses **Graph Neural Networks (GNN)** combined with domain heuristics to classify URLs. It examines domain age, entropy, lookalike characters, subdomain depth, redirect chains, and known threat intelligence feeds.

### `visual-service`
Uses **Convolutional Neural Networks (CNN)** to analyze screenshots of websites and detect brand impersonation. It compares visual layouts against known legitimate brand templates to catch pixel-perfect phishing clones.

### `detection-api`
The central orchestration layer. It coordinates calls to all three ML services, aggregates confidence scores, persists results to the SQLite database, and broadcasts live updates to connected clients via **WebSockets**.

### `api-gateway`
The entry point for all external requests. Handles API key authentication, rate limiting, request routing, and CORS — ensuring only authorized clients can interact with the detection pipeline.

### `frontend`
The **Next.js 14** dashboard for real-time monitoring. Built with shadcn/ui components and Recharts for live data visualization, it gives security teams full visibility into detection activity as it happens.

---

## 🔐 API Authentication

The API Gateway requires an API key in the request header for all protected endpoints.

```http
X-API-Key: your-api-key-here
```

**Default Dev Key:** Configured in `.env` (see `.env.example` for the full environment variable reference).

---

## 🌐 Deployment

The frontend is deployed on **Vercel** with automatic CI/CD on every push to `main`.

👉 **Live App:** [https://real-time-ai-ml-based-phishing-dete.vercel.app/](https://real-time-ai-ml-based-phishing-dete.vercel.app/)

The backend is deployed on **Render** (free tier) as a single Node.js web service running `server.ts`, which includes the Express API, WebSocket server, and SQLite database — all in one unified backend.

---

## 🛠️ Tech Stack

**Frontend**
- Vite 6, React 19, TypeScript 5.8
- Tailwind CSS, Lucide React, Recharts
- Socket.io Client

**Backend**
- Node.js 22, Express 4, TypeScript
- Socket.io 4, better-sqlite3
- tsx (TypeScript runner)

**ML Services**
- Python 3.10, FastAPI
- DistilBERT (NLP), GNN (URL), CNN (Visual)

**Database**
- SQLite (via better-sqlite3)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Source Control → GitHub
---

## 👤 Author

**Logesh-bruce** — [GitHub Profile](https://github.com/Logesh-bruce)

---

## 📄 License

This project is open source. Feel free to fork and contribute!
