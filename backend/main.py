from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import json
import os
from datetime import datetime



app = FastAPI()

# Enable CORS so React can talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Structured Logging
os.makedirs("./out", exist_ok=True)
logger.add("./out/behavioral_data.json", format="{message}", level="INFO")

class DecisionLog(BaseModel):
    participant_id: str
    condition: str
    decision: str
    latency_ms: float
    timestamp: str
    confidence_rating: int

@app.post("/log")
async def log_experiment_data(log: DecisionLog):
    # Logging the exact JSON received to our file
    logger.info(log.model_dump_json())
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)