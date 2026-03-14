import os

MODEL_DIR = os.getenv("MODEL_DIR", "./models/gnn-domain-classifier")

def setup_model():
    print("Setting up GNN Domain Classifier...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    # Create a dummy file to indicate model is "loaded"
    with open(os.path.join(MODEL_DIR, "model.pth"), "w") as f:
        f.write("dummy_weights")
    print(f"Model saved to {MODEL_DIR}")

if __name__ == "__main__":
    setup_model()
