import { NextResponse } from 'next/server';
import { askAgent } from '@/lib/elastic';

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  
  try {
    const { log } = await req.json();
    if (!log) return NextResponse.json({ error: "No log provided" }, { status: 400 });

    // STAGE 1: TRIAGE (The Judge)
    // Upgrade: We wrap the log in a system-level directive to ensure JSON precision.
    const triage = await askAgent('sentinel-x-triage', `Analyze this telemetry: ${log}`);
    
    // STAGE 2: ENFORCER (The Muscle)
    let enforcer = null;
    if (triage.recommendation === 'BLOCK') {
      // Upgrade: Don't just send the IP. Send the 'Reasoning' so the Enforcer can 
      // validate the severity before executing the 'firewall' block.
      const enforcerContext = {
        target: triage.source_ip,
        threat_type: triage.threat_type,
        judge_reasoning: triage.reasoning,
        action: "EXECUTE_BLOCK"
      };
      
      enforcer = await askAgent('active-response-enforcer', enforcerContext);
    }

    // STAGE 3: COMPLIANCE (The Clerk)
    // Upgrade: We send a 'Consolidated Incident Context' to ensure the ticket 
    // is high-fidelity and contains the full audit trail.
    const incidentContext = {
      event_timestamp: timestamp,
      raw_telemetry: log,
      analysis: triage,
      remediation: enforcer || { status: "SKIPPED", reason: "Recommendation was MONITOR" }
    };

    const compliance = await askAgent('compliance-audit-tracker', incidentContext);

    // Final Response: Structured for the Next.js Dashboard
    return NextResponse.json({ 
      success: true,
      incident_id: compliance.incident_id,
      stages: { triage, enforcer, compliance } 
    });

  } catch (error: any) {
    console.error(`[SENTINEL-X ERROR]: ${error.message}`);
    
    // Upgrade: Graceful failure return. Even if AI fails, the UI shouldn't crash.
    return NextResponse.json({ 
      success: false, 
      error: "Orchestration Pipeline Interrupted",
      details: error.message 
    }, { status: 500 });
  }
}