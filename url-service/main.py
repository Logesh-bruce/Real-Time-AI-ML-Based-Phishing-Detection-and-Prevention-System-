import os
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from dotenv import load_dotenv
import re

load_dotenv()

app = FastAPI(title="URL Phishing Detection Service")

MODEL_DIR = os.getenv("MODEL_DIR", "./models/gnn-domain-classifier")
model_loaded = os.path.exists(MODEL_DIR)

class URLRequest(BaseModel):
    url: str

@app.get("/health")
def health_check():
    return {"model_loaded": model_loaded}

@app.post("/analyze/url")
def analyze_url(req: URLRequest):
    url = req.url
    
    # Feature extraction simulation
    length = len(url)
    special_chars = len(re.findall(r'[^a-zA-Z0-9]', url))
    has_https = url.startswith('https')
    
    # Heuristic fallback
    risk_score = 0.1
    if not has_https: risk_score += 0.3
    if special_chars > 10: risk_score += 0.2
    if length > 50: risk_score += 0.2
    if "login" in url or "secure" in url or "verify" in url: risk_score += 0.3
    
    risk_score = min(0.99, risk_score)
    
    return {
        "url": url,
        "confidence": risk_score * 100,
        "isThreat": risk_score > 0.7,
        "features": {
            "length": length,
            "special_chars": special_chars,
            "ssl": has_https
        }
    }
