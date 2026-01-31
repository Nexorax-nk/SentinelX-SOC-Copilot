import json
import random
from datetime import datetime

# --- MOCK DATABASE ---
DATABASE = {
    "user_101": {"name": "Alice Admin", "status": "ACTIVE", "role": "admin", "tokens": ["tok_123", "tok_456"]},
    "user_404": {"name": "John Doe", "status": "ACTIVE", "role": "viewer", "tokens": ["tok_999"]},
    "blocked_ips": [],
    "jira_tickets": []
}

# --- TOOL 1: SENTINEL DETECTIVE ---
def analyze_login_event(log_json: str):
    """
    DETECTIVE: Analyzes raw logs for anomalies.
    Input: JSON string of the log.
    """
    print(f"🕵️ DETECTIVE AGENT: Scanning log stream...")
    try:
        data = json.loads(log_json) if isinstance(log_json, str) else log_json
        location = data.get("location", "Unknown")
        user = data.get("user_id", "Unknown")
        
        # Risk Logic
        risk_score = 0
        reasons = []
        
        if location.lower() in ["russia", "north korea"]:
            risk_score += 90
            reasons.append("Geo-fencing Violation")
        
        if "midnight" in str(data.get("timestamp", "")).lower():
             risk_score += 20
             reasons.append("Anomalous Time")

        return {
            "analysis_id": f"ANA-{random.randint(1000,9999)}",
            "user_id": user,
            "risk_score": risk_score,
            "anomalies": reasons
        }
    except Exception as e:
        return {"error": str(e)}

# --- TOOL 2: THREAT JUDGE ---
def judge_threat_level(risk_score: int, anomalies: list):
    """
    JUDGE: Decides the severity based on the Detective's findings.
    """
    print(f"⚖️ JUDGE AGENT: Evaluating Risk Score {risk_score}...")
    
    if risk_score >= 90:
        return {"verdict": "CRITICAL", "action_required": "IMMEDIATE_LOCKDOWN"}
    elif risk_score >= 50:
        return {"verdict": "HIGH", "action_required": "ENHANCED_MONITORING"}
    else:
        return {"verdict": "LOW", "action_required": "LOG_ONLY"}

# --- TOOL 3: ENFORCEMENT OFFICER ---
def execute_enforcement_protocol(user_id: str, verdict: str):
    """
    ENFORCER: Executes the Kill Switch.
    """
    clean_uid = user_id.strip().lower()
    print(f"👮 ENFORCER AGENT: Executing Protocol for {clean_uid} (Verdict: {verdict})...")
    
    if verdict == "CRITICAL":
        if clean_uid in DATABASE:
            # 1. Lock Account
            DATABASE[clean_uid]["status"] = "LOCKED"
            # 2. Revoke Tokens
            revoked_tokens = DATABASE[clean_uid]["tokens"]
            DATABASE[clean_uid]["tokens"] = []
            
            return {
                "status": "SUCCESS",
                "actions": [
                    f"Account {clean_uid} LOCKED",
                    f"Revoked {len(revoked_tokens)} active tokens",
                    "IP Address added to Blacklist"
                ],
                "enforcement_time": datetime.now().isoformat()
            }
    return {"status": "SKIPPED", "reason": "Verdict below threshold"}

# --- TOOL 4: COMPLIANCE CLERK ---
def generate_compliance_package(user_id: str, enforcement_data: dict):
    """
    CLERK: Generates the Jira Ticket and Audit Report.
    """
    print(f"📝 COMPLIANCE AGENT: Generating Paperwork...")
    
    # 1. Create Jira Ticket
    ticket_id = f"SEC-{random.randint(10000,99999)}"
    ticket = {
        "id": ticket_id,
        "summary": f"Security Incident: {user_id}",
        "severity": "CRITICAL",
        "assignee": "SOC_Team"
    }
    DATABASE["jira_tickets"].append(ticket)
    
    # 2. Send Alert (Mock)
    email_status = f"Alert sent to ciso@company.com re: {ticket_id}"
    
    return {
        "audit_report_id": f"AUDIT-{datetime.now().strftime('%Y%m%d')}-{user_id}",
        "jira_ticket": ticket_id,
        "communications": [email_status],
        "final_status": "COMPLIANT"
    }

# --- LOCAL TEST ---
if __name__ == "__main__":
    # Simulate the chain
    log = '{"user_id": "user_404", "location": "Russia", "timestamp": "midnight"}'
    analysis = analyze_login_event(log)
    judgment = judge_threat_level(analysis["risk_score"], analysis["anomalies"])
    enforcement = execute_enforcement_protocol(analysis["user_id"], judgment["verdict"])
    compliance = generate_compliance_package(analysis["user_id"], enforcement)
    print(compliance)