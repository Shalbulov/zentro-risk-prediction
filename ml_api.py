import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import logging
from typing import List, Optional
from io import StringIO
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml_api")

# Constants
MODEL_PATH = os.path.join("ml_zentro", "zentro_rf_pipeline.joblib")
REQUIRED_FEATURES = [
    'age',
    'income',
    'loan_amount',
    'credit_history',
    'employment_length',
    'debt_to_income'
]

# Initialize FastAPI app
app = FastAPI(
    title="Zentro Credit Risk Prediction API",
    description="API for credit risk scoring using the trained RandomForest model",
    version="1.0",
    docs_url="/docs"
)

# Load model at startup
model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        model = joblib.load(MODEL_PATH)
        logger.info(f"✅ Model loaded successfully from {MODEL_PATH}")
        logger.info(f"Model expects {model.n_features_in_} features")
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise RuntimeError(f"Model loading failed: {str(e)}")

# Pydantic models
class CreditApplication(BaseModel):
    age: float
    income: float
    loan_amount: float
    credit_history: float
    employment_length: float
    debt_to_income: float

class PredictionResult(BaseModel):
    default_probability: float
    risk_level: str
    risk_score: int

class BatchResult(BaseModel):
    total_records: int
    high_risk: int
    medium_risk: int
    low_risk: int
    download_link: str

# Helper functions
def calculate_risk(probability: float) -> tuple:
    if probability >= 0.7:
        return ("high", 3)
    elif probability >= 0.4:
        return ("medium", 2)
    return ("low", 1)

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Zentro Credit Risk Prediction API"}

@app.get("/model-info")
async def model_info():
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_type": "RandomForestClassifier",
        "expected_features": model.n_features_in_,
        "required_features": REQUIRED_FEATURES
    }

@app.post("/predict", response_model=PredictionResult)
async def predict(application: CreditApplication):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert to DataFrame with correct feature order
        input_data = pd.DataFrame([[
            application.age,
            application.income,
            application.loan_amount,
            application.credit_history,
            application.employment_length,
            application.debt_to_income
        ]], columns=REQUIRED_FEATURES)
        
        # Get prediction
        proba = model.predict_proba(input_data)[0][1]
        risk_level, risk_score = calculate_risk(proba)
        
        return {
            "default_probability": float(proba),
            "risk_level": risk_level,
            "risk_score": risk_score
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/batch-predict", response_model=BatchResult)
async def batch_predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    temp_file_path = None
    
    try:
        # Read and validate CSV
        contents = await file.read()
        csv_data = StringIO(contents.decode('utf-8'))
        input_df = pd.read_csv(csv_data)
        
        # Check required columns
        missing_cols = set(REQUIRED_FEATURES) - set(input_df.columns)
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        # Keep only needed columns in correct order
        input_df = input_df[REQUIRED_FEATURES].copy()
        
        # Predict
        probabilities = model.predict_proba(input_df)[:, 1]
        input_df['default_probability'] = probabilities
        input_df['risk_level'] = input_df['default_probability'].apply(
            lambda x: calculate_risk(x)[0]
        )
        
        # Calculate stats
        risk_counts = input_df['risk_level'].value_counts()
        
        # Save results to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            temp_file_path = tmp.name
            input_df.to_csv(tmp, index=False)
        
        return {
            "total_records": len(input_df),
            "high_risk": int(risk_counts.get('high', 0)),
            "medium_risk": int(risk_counts.get('medium', 0)),
            "low_risk": int(risk_counts.get('low', 0)),
            "download_link": f"/download-results?path={temp_file_path}"
        }
        
    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        logger.error(f"Batch prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/download-results")
async def download_results(path: str):
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Results file not found")
    
    try:
        return FileResponse(
            path,
            media_type="text/csv",
            filename="credit_risk_results.csv",
            headers={"Content-Disposition": "attachment"}
        )
    finally:
        if os.path.exists(path):
            os.unlink(path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)