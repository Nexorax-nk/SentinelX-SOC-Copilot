from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Any
import json
from sentinel_tools import analyze_login_event, judge_threat_level, execute_enforcement, generate_compliance_report, DATABASE

app = FastAPI()

# --- INPUT MODELS ---
class DetectiveInput(BaseModel):
    log_json: str

class JudgeInput(BaseModel):
    risk_score: int
    anomalies: List[str]

class EnforcerInput(BaseModel):
    user_id: str
    verdict: str

class ClerkInput(BaseModel):
    user_id: str
    enforcement_status: str

# --- ENDPOINTS ---
@app.post("/detective/analyze")
async def api_detective(data: DetectiveInput):
    return analyze_login_event(data.log_json)

@app.post("/judge/evaluate")
async def api_judge(data: JudgeInput):
    return judge_threat_level(data.risk_score, data.anomalies)

@app.post("/enforcer/execute")
async def api_enforcer(data: EnforcerInput):
    return execute_enforcement(data.user_id, data.verdict)

@app.post("/clerk/report")
async def api_clerk(data: ClerkInput):
    return generate_compliance_report(data.user_id, data.enforcement_status)

@app.get("/status/{user_id}")
async def api_status(user_id: str):
    return DATABASE.get(user_id.strip().lower(), {"status": "UNKNOWN"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)