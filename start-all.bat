@echo off
echo Starting PhishGuard AI System...

start "NLP Service (Port 8001)" cmd /k "cd nlp-service && call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8001 --reload"
start "URL Service (Port 8002)" cmd /k "cd url-service && call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8002 --reload"
start "Visual Service (Port 8003)" cmd /k "cd visual-service && call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8003 --reload"
start "Detection API (Port 3001)" cmd /k "cd detection-api && npm run dev"
start "API Gateway (Port 8080)" cmd /k "cd api-gateway && npm run dev"
start "Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo All services started in separate windows!
