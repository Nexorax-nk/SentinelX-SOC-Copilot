import json
import os
import requests
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel

# Load environment variables from .env file
load_dotenv()

# Initialize our sleek dark/orange/red terminal UI
console = Console()

# --- ⚙️ CONFIGURATION (Loaded from .env) ---
KIBANA_URL = os.getenv("KIBANA_URL")
API_KEY = os.getenv("API_KEY")

if not KIBANA_URL or not API_KEY:
    console.print("[bold red]ERROR: Missing environment variables. Ensure .env file exists with KIBANA_URL and API_KEY.[/bold red]")
    exit(1)

HEADERS = {
    "Content-Type": "application/json",
    "kbn-xsrf": "true", # Required for all Kibana APIs
    "Authorization": f"ApiKey {API_KEY}"
}

# --- 🧠 ELASTIC AGENT API CALLER ---
def ask_agent(agent_id, message):
    """Sends a message to a specific Agent in Elastic and returns its JSON response."""
    # Programmatic Agent Builder converse endpoint
    endpoint = f"{KIBANA_URL}/api/agent_builder/converse"
    
    payload = {
        "input": message,
        "agent_id": agent_id
    }
    
    try:
        response = requests.post(endpoint, headers=HEADERS, json=payload)
        response.raise_for_status() 
        
        data = response.json()
        
        # Extract response message
        reply_text = data.get("response", {}).get("message", "")
        if not reply_text:
            reply_text = data.get("message", data.get("answer", ""))
            
        # Clean markdown formatting
        reply_text = str(reply_text).strip("` \n")
        if reply_text.lower().startswith("json"):
            reply_text = reply_text[4:].strip(" \n")
            
        return json.loads(reply_text)
        
    except requests.exceptions.HTTPError as e:
        console.print(f"[bold red]API Error communicating with {agent_id}:[/bold red] {e}")
        return {"error": "HTTP Error"}
    except json.JSONDecodeError:
        console.print(f"[bold red]Failed to parse JSON from {agent_id}.[/bold red]")
        return {"error": "JSON Parse Error"}
    except Exception as e:
        console.print(f"[bold red]Unexpected Error:[/bold red] {str(e)}")
        return {"error": "System Error"}

# --- 🚀 THE MAS ORCHESTRATOR ---
def process_security_log(raw_log):
    console.print(Panel(f"[bold white]{raw_log}[/bold white]", title="[bold cyan]Incoming Telemetry[/bold cyan]", border_style="cyan"))
    
    # --- STAGE 1: TRIAGE ---
    console.print("\n[bold dark_orange]>> [STAGE 1] Initiating Threat Triage Engine...[/bold dark_orange]")
    triage_data = ask_agent("sentinel-x-triage", raw_log)
    
    if "error" in triage_data:
        return
        
    score = triage_data.get("confidence_score", 0)
    threat = triage_data.get("threat_type", "Unknown")
    rec = triage_data.get("recommendation", "MONITOR")
    source_ip = triage_data.get("source_ip", "Unknown")
    
    console.print(f"[bold red]🚨 DETECTED:[/bold red] {threat} (Confidence: {score}%)")
    
    # --- STAGE 2: ENFORCEMENT ---
    if rec == "BLOCK":
        console.print(f"\n[bold dark_orange]>> [STAGE 2] Routing to Active Response Enforcer...[/bold dark_orange]")
        
        # FIX: Instead of sending the whole JSON, send a clear instruction string
        enforcer_instruction = f"The Triage Engine detected a {threat} from IP {source_ip} and recommends a BLOCK. Execute the enforcement action."
        enforcer_data = ask_agent("active-response-enforcer", enforcer_instruction)
        
        if "error" in enforcer_data:
            return

        console.print(f"[bold green]🛡️ ENFORCEMENT SUCCESS:[/bold green] {enforcer_data.get('action_taken')}")
        
        # --- STAGE 3: COMPLIANCE ---
        console.print(f"\n[bold dark_orange]>> [STAGE 3] Routing to Compliance Audit Tracker...[/bold dark_orange]")
        
        # Pass both results as a simple summary string to Agent 3
        clerk_instruction = f"Triage Result: {json.dumps(triage_data)}. Enforcement Result: {json.dumps(enforcer_data)}. Generate the formal ticket."
        clerk_data = ask_agent("compliance-audit-tracker", clerk_instruction)
        
        if "error" not in clerk_data:
            ticket_str = json.dumps(clerk_data, indent=2)
            console.print(Panel(f"[bold green]{ticket_str}[/bold green]", title=f"Jira Ticket: {clerk_data.get('incident_id')}", border_style="green"))

    else:
        console.print(f"\n[bold green]✅ No critical action required. Status: {rec}[/bold green]")
if __name__ == "__main__":
    console.print("[bold red]=== 🦅 SENTINEL-X MULTI-AGENT SOC ONLINE ===[/bold red]\n")
    sample_log = '[24/Feb/2026:19:34:12 +0000] "POST /login HTTP/1.1" 401 534 "-" src_ip="185.15.58.22" msg="Failed password for root" attempts=450 geo="RU"'
    process_security_log(sample_log)