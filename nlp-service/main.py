import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NLP Phishing Detection Service")

MODEL_DIR = os.getenv("MODEL_DIR", "./models/phishing-detector")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_loaded = False
tokenizer = None
model = None

try:
    if os.path.exists(MODEL_DIR):
        tokenizer = DistilBertTokenizer.from_pretrained(MODEL_DIR)
        model = DistilBertForSequenceClassification.from_pretrained(MODEL_DIR)
        model.to(device)
        model.eval()
        model_loaded = True
except Exception as e:
    print(f"Error loading model: {e}")

class TextRequest(BaseModel):
    text: str

class EmailRequest(BaseModel):
    subject: str
    body: str
    headers: dict = {}

@app.get("/health")
def health_check():
    return {"model_loaded": model_loaded, "device": str(device)}

@app.post("/analyze/text")
def analyze_text(req: TextRequest):
    if not model_loaded:
        # Fallback for demo if model not trained yet
        return {"confidence": 0.85, "isThreat": "urgent" in req.text.lower(), "model_used": "fallback"}
    
    inputs = tokenizer(req.text, return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        threat_prob = probs[0][1].item()
    
    return {
        "confidence": threat_prob,
        "isThreat": threat_prob > 0.5,
        "model_used": "distilbert"
    }

@app.post("/analyze/email")
def analyze_email(req: EmailRequest):
    combined_text = f"{req.subject} {req.body}"
    return analyze_text(TextRequest(text=combined_text))
