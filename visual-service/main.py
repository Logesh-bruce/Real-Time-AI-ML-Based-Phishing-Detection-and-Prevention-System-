import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Visual Phishing Detection Service")

MODEL_DIR = os.getenv("MODEL_DIR", "./models/brand-classifier")
model_loaded = os.path.exists(MODEL_DIR)

class VisualRequest(BaseModel):
    url: str

@app.get("/health")
def health_check():
    return {"model_loaded": model_loaded}

@app.post("/analyze/visual")
def analyze_visual(req: VisualRequest):
    # In a real scenario, Playwright would take a screenshot here
    # and pass it through a CNN.
    
    return {
        "url": req.url,
        "confidence": 0.65,
        "isThreat": False,
        "detected_brands": ["Unknown"]
    }
