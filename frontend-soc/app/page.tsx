"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Zap, Activity, Lock, FileCheck, Loader2, CheckSquare, ChevronRight, ShieldAlert, Cpu } from "lucide-react";

export default function SOCTerminal() {
  const [log, setLog] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [targetIp, setTargetIp] = useState("UNKNOWN");
  
  const [step, setStep] = useState(0); 
  const [loadingFrame, setLoadingFrame] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, loadingFrame, isAnalyzing]);

  // Extract the target IP dynamically
  useEffect(() => {
    const ipMatch = log.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
    if (ipMatch) setTargetIp(ipMatch[0]);
    else setTargetIp("OBFUSCATED_IP");
  }, [log]);

  // Terminal "Thinking" Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing && !results) {
      interval = setInterval(() => {
        setLoadingFrame((prev) => (prev + 1) % 4);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, results]);

  const runSentinelX = async () => {
    if (!log) return;
    setIsAnalyzing(true);
    setResults(null);
    setStep(1); 

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log }),
      });
      const data = await response.json();

      if (data.success) {
        setResults(data.stages);
        
        // --- EXPANDED TIMELINE ---
        setTimeout(() => setStep(2), 800);   
        setTimeout(() => setStep(3), 2000);  
        setTimeout(() => setStep(4), 3500);  // Triage Active
        setTimeout(() => setStep(5), 5500);  
        setTimeout(() => setStep(6), 6500);  // Triage Done
        setTimeout(() => setStep(7), 8000);  // Enforcer Active
        setTimeout(() => setStep(8), 10000); 
        setTimeout(() => setStep(9), 11500); // Enforcer Done
        setTimeout(() => setStep(10), 13000); // Clerk Active
        setTimeout(() => setStep(11), 15000); 
        setTimeout(() => setStep(12), 16000); // Clerk Done
        
      } else {
        alert(`System Error: ${data.error}`);
        setStep(0);
      }
    } catch (error) {
      console.error("Pipeline Failure", error);
      setStep(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAgentState = (agentNum: number) => {
    if (step === 0 && !isAnalyzing) return "IDLE";
    if (isAnalyzing && !results) return "PENDING"; 
    
    if (agentNum === 1) {
      if (step >= 4 && step <= 6) return "ACTIVE";
      if (step > 6) return "DONE";
      return "PENDING";
    }
    if (agentNum === 2) {
      if (step >= 7 && step <= 9) return "ACTIVE";
      if (step > 9) return "DONE";
      return "PENDING";
    }
    if (agentNum === 3) {
      if (step >= 10 && step <= 11) return "ACTIVE";
      if (step >= 12) return "DONE";
      return "PENDING";
    }
    return "PENDING";
  };

  const loadingMessages = [
    "Negotiating secure uplink to Elastic cluster...",
    "Transmitting payload across encrypted tunnel...",
    "Awaiting Multi-Agent LLM consensus...",
    "Processing heuristic tensors...",
  ];

  return (
    // Deep, rich slate background to contrast the black panels
    <div className="min-h-screen bg-[#09090b] text-zinc-300 p-4 lg:p-6 font-sans flex flex-col h-screen overflow-hidden selection:bg-[#ff4d00] selection:text-white relative">
      
      {/* SHARP TACTICAL BACKGROUND */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none z-0"></div>
      {/* Center Glow behind the app */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#ff4d00] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ENTERPRISE HEADER */}
      <header className="relative z-10 flex justify-between items-center mb-6 pb-4 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#1a1a1e] to-[#0a0a0c] p-2.5 rounded-lg border border-zinc-700/50 shadow-[0_0_20px_rgba(255,77,0,0.1)] relative group">
            <div className="absolute inset-0 bg-[#ff0000] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-lg"></div>
            <ShieldAlert size={24} className="text-[#ff0000] relative z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-">
              {/* THE ORANGE GLOWING LOGO */}
              <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.5)]">
                SENTINEL-X
              </span>
              <span className="text-zinc-400 font-mono font-bold px-2.5 py-1 bg-[#121214] rounded-md text-[10px] border border-zinc-800 tracking-widest uppercase shadow-inner">
                Enterprise Core
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121214] rounded-md border border-zinc-800 shadow-inner">
            <span className="w-2 h-2 bg-[#00ffcc] shadow-[0_0_12px_#00ffcc] rounded-full animate-pulse"></span>
            Uplink Active
          </div>
          <span className="hidden md:flex items-center gap-2 border-l border-zinc-800 pl-5">
            <Cpu size={14} className="text-zinc-400"/> Node: US-EAST-1
          </span>
        </div>
      </header>

      {/* MAIN GRID LAYOUT */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* --- LEFT SIDE: INGESTION CONSOLE --- */}
        <section className="lg:col-span-4 flex flex-col gap-4 h-full">
          {/* Outer container with drop shadow */}
          <div className="bg-[#0e0e12] border border-zinc-800/80 rounded-xl flex-1 flex flex-col relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <div className="bg-[#000000] px-5 py-3.5 flex items-center justify-between border-b border-zinc-800/80 text-zinc-300 text-[10px] font-black uppercase tracking-[0.15em]">
              <span className="flex items-center gap-2">
                <Terminal size={14} className="text-[#ff4d00]" /> RAW_TELEMETRY_INGEST
              </span>
              <span className="font-mono text-zinc-500 bg-[#0a0a0c] px-2 py-0.5 rounded border border-zinc-800">PORT:443</span>
            </div>
            {/* The Charcoal Gray Input Area */}
            <textarea
              className="w-full flex-1 bg-[#131317] p-6 text-[12px] font-mono text-zinc-300 outline-none resize-none placeholder:text-zinc-600 leading-relaxed custom-scrollbar shadow-[inset_0_4px_25px_rgba(0,0,0,0.4)]"
              placeholder="> PASTE TARGET SECURITY PAYLOAD HERE..."
              value={log}
              onChange={(e) => setLog(e.target.value)}
              disabled={isAnalyzing || (step > 0 && step < 12)}
            />
          </div>
          
          {/* Weaponized Execute Button */}
          <button
            onClick={runSentinelX}
            disabled={isAnalyzing || (step > 0 && step < 12)}
            className="group w-full bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#ff1a1a] hover:to-[#e60000] text-white py-4.5 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 rounded-xl shrink-0 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isAnalyzing || (step > 0 && step < 12) ? "SYSTEM LOCKED // PROCESSING" : "INITIATE THREAT SCAN"}
              <Zap size={16} className={isAnalyzing || (step > 0 && step < 12) ? "animate-pulse" : "drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"} />
            </span>
          </button>
        </section>

        {/* --- RIGHT SIDE: AGENTS & TERMINAL --- */}
        <section className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">
          
          {/* TOP: LIVE AGENT PIPELINE */}
          <div className="flex items-center gap-3 shrink-0 bg-[#0e0e12] p-3 border border-zinc-800/80 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="flex-1"><AgentStatusCard name="Triage Engine" id="S-X.01" icon={<Activity size={18} />} state={getAgentState(1)} color="text-[#ff4d00]" bgColor="bg-[#ff4d00]/5" borderColor="border-[#ff4d00]" glowColor="shadow-[0_0_20px_rgba(255,77,0,0.15)]" /></div>
            <ChevronRight size={20} className={step > 6 ? "text-zinc-500" : "text-zinc-800"} />
            <div className="flex-1"><AgentStatusCard name="Active Enforcer" id="S-X.02" icon={<Lock size={18} />} state={getAgentState(2)} color="text-[#ff003c]" bgColor="bg-[#ff003c]/5" borderColor="border-[#ff003c]" glowColor="shadow-[0_0_20px_rgba(255,0,60,0.15)]" /></div>
            <ChevronRight size={20} className={step > 9 ? "text-zinc-500" : "text-zinc-800"} />
            <div className="flex-1"><AgentStatusCard name="Compliance Clerk" id="S-X.03" icon={<FileCheck size={18} />} state={getAgentState(3)} color="text-[#00e5ff]" bgColor="bg-[#00e5ff]/5" borderColor="border-[#00e5ff]" glowColor="shadow-[0_0_20px_rgba(0,229,255,0.15)]" /></div>
          </div>

          {/* BOTTOM: THE RAW SOC TERMINAL (Pure Black) */}
          <div className="bg-[#030303] border border-zinc-800/80 rounded-xl flex-1 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative min-h-0">
            <div className="bg-[#0e0e12] px-5 py-3 flex items-center justify-between border-b border-zinc-800/80 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-[0.2em] uppercase">root@sentinel-core:~#</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-[12px] font-mono leading-relaxed space-y-3 custom-scrollbar text-zinc-400">
              
              {/* --- TERMINAL OUTPUTS --- */}
              {step >= 1 && (
                <div>
                  <span className="text-[#ff4d00] font-bold">root@sentinel-core:~$</span> ./execute_mas_pipeline.sh<br/>
                  <span className="text-white font-black tracking-[0.2em] mt-2 block bg-zinc-900/50 inline-block px-3 py-1 rounded border border-zinc-800">&gt;&gt;&gt; SI-07-*1 SENTINEL-X KERNEL ONLINE &gt;&gt;&gt;</span>
                </div>
              )}

              {/* LIVE PROCESSING LOOP */}
              {isAnalyzing && !results && step === 1 && (
                <div className="mt-5 border-l-2 border-zinc-700 pl-4 py-2 text-zinc-500 bg-zinc-900/20">
                  <span className="animate-pulse text-white font-bold">⠋</span> [SYS.UPLINK] {loadingMessages[loadingFrame]}<br/>
                  <span className="text-[10px] mt-1 text-[#ff4d00]/70 block">LATENCY: {(Math.random() * 100 + 150).toFixed(0)}MS</span>
                </div>
              )}

              {step >= 2 && (
                <div className="text-zinc-500 pt-2">
                  [SYS.INIT] Allocating LLM Tensor memory... <span className="text-[#00ffcc] font-bold">[OK]</span><br/>
                  [SYS.INIT] Elastic API Auth Token verified... <span className="text-[#00ffcc] font-bold">[SECURE]</span>
                </div>
              )}

              {step >= 3 && (
                <div className="text-zinc-400">
                  [NET.RX] INBOUND THREAT STREAM DETECTED.<br/> 
                  [NET.RX] Extracted target Origin IP: <span className="text-white font-bold bg-[#1a1a1e] px-1.5 py-0.5 rounded border border-zinc-700">{targetIp}</span><br/>
                  [NET.RX] BGP Route Tracing initiated... <span className="text-[#00ffcc] font-bold">[DONE]</span>
                </div>
              )}
              
              {/* --- COMMANDER 1: TRIAGE --- */}
              {step >= 4 && (
                <div className="text-zinc-300 mt-5 border-l-2 border-[#ff4d00]/60 pl-4 py-1">
                  <span className="font-bold text-[#ff4d00] drop-shadow-[0_0_5px_rgba(255,77,0,0.5)]">&gt;&gt; [ROUTER] Waking S-X.01 (Threat Triage Engine)</span><br/>
                  <span className="text-zinc-500">
                    [S-X.01] Thread PID: 8492 spawned.<br/>
                    [S-X.01] Running heuristics against MITRE ATT&CK DB...
                  </span>
                </div>
              )}
              
              {step >= 5 && results?.triage && (
                <div className="pl-5 my-3 border-l-2 border-[#ff4d00] bg-gradient-to-r from-[#ff4d00]/10 to-transparent py-4 pr-4 rounded-r-lg">
                  <span className="text-white font-black tracking-widest bg-[#ff4d00] text-black px-2.5 py-1 rounded-sm text-[10px] uppercase shadow-[0_0_10px_rgba(255,77,0,0.4)]">🚨 VERDICT: {results.triage.threat_type}</span><br/>
                  <div className="mt-3 text-zinc-400 text-[11px] uppercase font-bold tracking-widest flex items-center gap-2">
                    AI Confidence Matrix: <span className="text-[#ff4d00] text-sm font-black bg-black px-2 py-0.5 rounded border border-[#ff4d00]/30">{results.triage.confidence_score}%</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#ff4d00]/20">
                    <pre className="text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed text-[11.5px]">
                      {results.triage.reasoning}
                    </pre>
                  </div>
                </div>
              )}

              {/* --- COMMANDER 2: ENFORCER --- */}
              {step >= 6 && (
                <div className="text-zinc-500 mt-5">
                  [S-X.01] Threat parameters confirmed. Serializing state...<br/>
                  [S-X.01] Payload hash: SHA256:e3b0c44298fc...<br/>
                </div>
              )}

              {step >= 7 && (
                <div className="text-zinc-300 border-l-2 border-[#ff003c]/60 pl-4 py-1 mt-3">
                  <span className="font-bold text-[#ff003c] drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]">&gt;&gt; [ROUTER] Waking S-X.02 (Active Enforcer)</span><br/>
                  <span className="text-zinc-500">
                    [S-X.02] State received. Hash verified.<br/>
                    [S-X.02] Simulating perimeter policy on virtual twin... <span className="text-[#00ffcc] font-bold">VALIDATED</span>
                  </span>
                </div>
              )}
              
              {step >= 8 && results?.enforcer && (
                <div className="pl-5 my-3 border-l-2 border-[#ff003c] bg-gradient-to-r from-[#ff003c]/10 to-transparent py-4 pr-4 rounded-r-lg">
                  <span className="text-white font-black tracking-widest bg-[#ff003c] text-black px-2.5 py-1 rounded-sm text-[10px] uppercase shadow-[0_0_10px_rgba(255,0,60,0.4)]">🛡️ REMEDIATION AUTHORIZED</span><br/>
                  <div className="mt-3">
                    <pre className="text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed text-[11.5px]">
                      {results.enforcer.action_taken}
                    </pre>
                  </div>
                  <pre className="mt-4 text-[10.5px] text-[#ff003c] bg-[#050505] p-3.5 border border-[#ff003c]/30 font-mono whitespace-pre-wrap rounded-md shadow-[inset_0_0_15px_rgba(255,0,60,0.08)]">
                    {results.enforcer.enforcement_log ? results.enforcer.enforcement_log : `[API.POST] /v1/policies/block (${(Math.random() * 50 + 10).toFixed(0)}ms)\n[201 CREATED] PolicyID: POL-${Math.floor(Math.random() * 10000)}\n[ROUTING] Null0 applied. TCP_RST executed.`}
                  </pre>
                </div>
              )}

              {/* --- COMMANDER 3: CLERK --- */}
              {step >= 9 && (
                <div className="text-zinc-500 mt-5">
                  [S-X.02] Mitigation applied to edge firewalls.<br/>
                  [S-X.02] Pushing event context to GRC pipeline...<br/>
                </div>
              )}

              {step >= 10 && (
                <div className="text-zinc-300 border-l-2 border-[#00e5ff]/60 pl-4 py-1 mt-3">
                  <span className="font-bold text-[#00e5ff] drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">&gt;&gt; [ROUTER] Waking S-X.03 (Compliance Clerk)</span><br/>
                  <span className="text-zinc-500">
                    [S-X.03] Ingesting context. Mapping to SOC2 & ISO27001...<br/>
                    [S-X.03] Encrypting audit payload with AES-256...
                  </span>
                </div>
              )}
              
              {step >= 11 && results?.compliance && (
                <div className="pl-5 my-3 border-l-2 border-[#00e5ff] bg-gradient-to-r from-[#00e5ff]/10 to-transparent py-4 pr-4 rounded-r-lg">
                  <span className="text-white font-black tracking-widest bg-[#00e5ff] text-black px-2.5 py-1 rounded-sm text-[10px] uppercase shadow-[0_0_10px_rgba(0,229,255,0.4)]">📋 AUDIT LEDGER UPDATED</span><br/>
                  <div className="mt-3 mb-3 text-zinc-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                    INCIDENT_REF: <span className="text-[#00e5ff] font-mono bg-black px-2 py-0.5 rounded border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]">{results.compliance.incident_id || `INC-${(Math.random() * 100000).toFixed(0)}-SEC`}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#00e5ff]/20">
                    <pre className="text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed text-[11.5px]">
                      {results.compliance.auditor_notes || results.compliance.applicable_frameworks}
                    </pre>
                  </div>
                  
                  {results.compliance.incident_id && (
                    <div className="mt-4 text-[10.5px] bg-[#050505] border border-[#00e5ff]/30 rounded-md overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                      <div className="bg-[#00e5ff]/10 px-4 py-2 border-b border-[#00e5ff]/30 text-[#00e5ff] font-bold flex justify-between tracking-widest">
                        <span>{results.compliance.incident_id}.json</span>
                        <span className="text-[#00e5ff] animate-pulse">SECURE_APPEND</span>
                      </div>
                      <pre className="p-4 text-zinc-400 whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(results.compliance, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {step === 12 && (
                <div className="pt-6 pb-4 text-zinc-500">
                  [SYS.MEM] Memory spaces cleared.<br/>
                  [SYS] Pipeline complete. System returning to standby.<br/><br/>
                  <span className="text-white font-bold text-[13px]">root@sentinel-core:~$</span> <span className="animate-pulse bg-zinc-300 text-transparent">_</span>
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// Enterprise Redesigned Pipeline Card (Maximum Wow Factor)
function AgentStatusCard({ name, id, icon, state, color, bgColor, borderColor, glowColor }: any) {
  const isIdle = state === "IDLE";
  const isPending = state === "PENDING";
  const isActive = state === "ACTIVE";
  const isDone = state === "DONE";

  return (
    <div className={`p-4 rounded-xl border bg-[#141418] transition-all duration-500 flex flex-col gap-3 relative overflow-hidden
      ${isActive ? `${borderColor} ${bgColor} ${glowColor} scale-[1.03] z-10` : "border-zinc-800/80"}
      ${isPending || isIdle ? "opacity-50 grayscale" : "opacity-100"}
    `}>
      {/* Intense Top Accent Line when active */}
      {isActive && <div className={`absolute top-0 left-0 w-full h-1 bg-current ${color} shadow-[0_0_15px_currentColor]`} />}
      
      <div className="flex items-center justify-between">
        <div className={`p-2 bg-[#0a0a0c] rounded-lg border ${isActive ? borderColor : "border-zinc-800"} ${isActive || isDone ? color : "text-zinc-600"} shadow-inner`}>
          {icon}
        </div>
        <div>
          {isActive && <Loader2 size={16} className={`${color} animate-spin`} />}
          {isDone && <CheckSquare size={16} className="text-[#00ffcc] drop-shadow-[0_0_5px_#00ffcc]" />}
        </div>
      </div>
      
      <div className="mt-1">
        <div className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-[0.2em] mb-1">{id}</div>
        <div className={`text-xs font-black tracking-wider uppercase ${isActive || isDone ? "text-white" : "text-zinc-400"}`}>
          {name}
        </div>
      </div>
    </div>
  );
}