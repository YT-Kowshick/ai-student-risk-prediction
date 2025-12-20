from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from typing import List
import joblib
import csv
import io
from pathlib import Path
from textblob import TextBlob

# ---------------- APP INIT ----------------
app = FastAPI(title="AI Student Risk Prediction API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
        "https://ai-student-risk-prediction-hnu1oaox3.vercel.app",  # your vercel URL
        "https://ai-student-risk-prediction.vercel.app",  
        "https://ai-student-risk-prediction-bqodygnye.vercel.app",# optional prod domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- LOAD MODEL ----------------
MODEL_PATH = Path(__file__).parent / "best_model.pkl"
model = joblib.load(MODEL_PATH)

# ---------------- IN-MEMORY STORAGE ----------------
prediction_history = []

# ---------------- SCHEMAS ----------------
class PredictionRequest(BaseModel):
    marks: float = Field(..., ge=0, le=100)
    attendance: float = Field(..., ge=0, le=100)
    feedback: str

class PredictionResponse(BaseModel):
    risk: str
    sentiment: str
    reasons: List[str]

# ---------------- UTILS ----------------
def get_sentiment(text: str) -> str:
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0:
        return "Positive"
    elif polarity < 0:
        return "Negative"
    return "Neutral"

def get_reasons(marks, attendance, sentiment):
    reasons = []
    if marks < 40:
        reasons.append("Low academic marks")
    if attendance < 60:
        reasons.append("Low attendance")
    if sentiment == "Negative":
        reasons.append("Negative teacher feedback")
    if not reasons:
        reasons.append("Overall good academic performance")
    return reasons

# ---------------- SINGLE PREDICTION ----------------
@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionRequest):
    risk = model.predict([[data.marks, data.attendance]])[0]
    sentiment = get_sentiment(data.feedback)
    reasons = get_reasons(data.marks, data.attendance, sentiment)

    record = {
        "marks": data.marks,
        "attendance": data.attendance,
        "feedback": data.feedback,
        "risk": str(risk),
        "sentiment": sentiment
    }

    prediction_history.append(record)

    return {
        "risk": str(risk),
        "sentiment": sentiment,
        "reasons": reasons
    }

# ---------------- HISTORY ----------------
@app.get("/history")
def history():
    return prediction_history

# ---------------- ANALYTICS ----------------
@app.get("/analytics")
def analytics():
    total = len(prediction_history)
    if total == 0:
        return {
            "total_students": 0,
            "at_risk_percent": 0,
            "average_marks": 0
        }

    at_risk = sum(1 for r in prediction_history if r["risk"] == "At-Risk")
    avg_marks = sum(r["marks"] for r in prediction_history) / total

    return {
        "total_students": total,
        "at_risk_percent": round((at_risk / total) * 100, 2),
        "average_marks": round(avg_marks, 2)
    }

# ---------------- CSV BULK UPLOAD ----------------
@app.post("/csv-upload")
def csv_upload(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Upload a CSV file")

    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(content))

    results = []

    for row in reader:
        marks = float(row["marks"])
        attendance = float(row["attendance"])
        feedback = row.get("feedback", "")

        risk = model.predict([[marks, attendance]])[0]
        sentiment = get_sentiment(feedback)
        reasons = get_reasons(marks, attendance, sentiment)

        record = {
            "marks": marks,
            "attendance": attendance,
            "feedback": feedback,
            "risk": str(risk),
            "sentiment": sentiment
        }

        prediction_history.append(record)
        results.append(record)

    return {
        "uploaded_students": len(results),
        "results": results
    }

# ---------------- HEALTH CHECK ----------------
@app.get("/")
def root():
    return {"status": "running", "message": "AI Student Risk Prediction API"}
