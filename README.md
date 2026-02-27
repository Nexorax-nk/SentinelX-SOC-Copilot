# SentinelX-SOC-Copilot
SentinelX is an autonomous SOC Copilot . It investigates security incidents, classifies risk, and enforces real-time remediation actions like account lockdown, token revocation, and audit logging
 sample logs 
 
https://sentinel-x-d9fb65.kb.us-central1.gcp.elastic.cloud/app/agent_builder

[25/Feb/2026:10:12:44 +0000] "SSH-2.0-OpenSSH_8.2p1" 401 0 "-" src_ip="185.156.74.55" msg="Failed password for root from 185.156.74.55 port 54332 ssh2" attempts=842 geo="RU"
[25/Feb/2026:10:15:02 +0000] "POST /api/v1/auth/login HTTP/1.1" 401 124 "https://your-app.com/login" src_ip="45.33.22.11" user_agent="Mozilla/5.0 (compatible; HeadlessChrome/121.0.0.0)" msg="Auth failure for user: admin@company.com" attempts=12
[25/Feb/2026:11:45:10 +0000] "GET /.env HTTP/1.1" 404 0 "-" src_ip="192.168.1.105" msg="Directory traversal attempt detected" pattern="sensitive_file_access"