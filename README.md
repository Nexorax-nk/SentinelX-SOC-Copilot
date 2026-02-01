# SentinelX — Agentic Enforcement Squad for Security Operations

SentinelX is an autonomous Security Enforcement Squad built using **IBM watsonx Orchestrate**.

It investigates security incidents, classifies threat severity, and enforces remediation actions in real time.

---

## 🔥 Problem

Enterprises face thousands of alerts daily:

- Unauthorized logins  
- Leaked API keys  
- SQL injection attempts  
- Suspicious geo-location access  
- Malicious downloads  

SOC analysts manually investigate incidents, taking **4–8 hours per case**, causing alert fatigue and missed breaches.

---

## ✅ Solution: SentinelX

SentinelX acts as an AI Security Police Officer:

### 1. Investigate (Detective Agent)
- Correlates authentication, application, and network logs

### 2. Decide (Risk Classification Agent)
- Assigns severity: LOW / MEDIUM / HIGH / CRITICAL

### 3. Enforce (Enforcement Agent)
Automatically executes:

- Block malicious IP  
- Lock compromised accounts  
- Revoke API tokens  
- Send alerts  
- Generate compliance audit logs  
- Create Jira remediation tickets  

---

## 🏗 Architecture

Multi-agent workflow:

- Investigator Agent  
- Risk Scoring Agent  
- Enforcement Agent  

Powered by:

- IBM watsonx Orchestrate  
- watsonx.ai Llama-3.2 model  
- Enterprise integrations (Email, Jira, IAM)

---

## 🎥 Demo Scenario

Example: Impossible travel login

User normally logs in from India  
Suddenly login from Russia at midnight  

SentinelX triggers:

- CRITICAL risk  
- Account lockdown  
- Session revocation  
- Audit ticket creation  

---

## 🚀 Built With

- IBM watsonx Orchestrate  
- IBM watsonx.ai  
- Llama-3.2-90B model  
- Python tools (optional integrations)

---

## 📌 Hackathon Submission

This project was created for:

**IBM Dev Day AI Demystified Hackathon (Jan–Feb 2026)**

---
