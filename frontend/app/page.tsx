"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Lock, FileText, CheckCircle, AlertTriangle, Search, Zap, User, Key, ShieldCheck, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SentinelIntercept() {
  const [data, setData] = useState<any>({});
  const [stage, setStage] = useState("LISTENING"); // LISTENING, DETECTED, LOCKED
  const [isGlitching, setIsGlitching] = useState(false);

  // Poll for the "Rich Event Data" from the backend
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:8000/events");
        const logs = await res.json();
        
        if (logs.length > 0) {
          // Process logs
          const detective = logs.find((l: any) => l.stage === "DETECTIVE")?.data;
          const judge = logs.find((l: any) => l.stage === "JUDGE")?.data;
          const enforcer = logs.find((l: any) => l.stage === "ENFORCER")?.data;
          const clerk = logs.find((l: any) => l.stage === "CLERK")?.data;

          setData({ detective, judge, enforcer, clerk });

          // State Transition Logic
          if (enforcer?.status === "SUCCESS" && stage !== "LOCKED") {
            triggerLockdown();
          } else if (detective && stage === "LISTENING") {
            setStage("DETECTED");
          }
        }
      } catch (e) { console.error("Backend offline"); }
    }, 500);
    return () => clearInterval(interval);
  }, [stage]);

  // Special Visual Effect for Lockdown
  const triggerLockdown = () => {
    setStage("LOCKED");
    setIsGlitching(true);
    // Stop glitching after 1 second for readability
    setTimeout(() => setIsGlitching(false), 800);
  };

  return (
    <div className="min-h-screen h-screen bg-[#020202] text-white font-mono p-4 flex flex-col items-center relative overflow-hidden">
      
      {/* CYBER BACKGROUND EFFECT */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.5)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black pointer-events-none"></div>

      {/* HEADER */}
      <div className="relative z-10 w-full max-w-7xl flex justify-between items-center border-b border-white/10 pb-4 mb-6 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg border transition-all duration-500 ${stage === "LOCKED" ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "border-emerald-500/20 bg-emerald-900/10"}`}>
            <ShieldAlert className={`w-6 h-6 ${stage === "LOCKED" ? "text-red-500 animate-pulse" : "text-emerald-400"}`} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.2em]">SENTINEL<span className={stage === "LOCKED" ? "text-red-500" : "text-emerald-500"}>X</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">Autonomous Breach Containment</p>
          </div>
        </div>
        <div className="text-right">
            <div className={`text-[10px] px-3 py-1 rounded-full border flex items-center gap-2 ${stage === "LISTENING" ? "border-emerald-500/50 text-emerald-400" : "border-red-500/50 text-red-400 animate-pulse bg-red-950/30"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${stage === "LISTENING" ? "bg-emerald-400 animate-pulse" : "bg-red-500"}`}></div>
                {stage === "LISTENING" ? "LIVE THREAT FEED ACTIVE" : "INCIDENT RESPONSE ENGAGED"}
            </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* =======================================================
            LEFT PANEL: THE HACKER VIEW (User_404)
           ======================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-2 h-full">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <User className="w-3 h-3" /> Target Endpoint View
            </div>
            
            <div className="relative group perspective-1000 flex-1 min-h-0">
                {/* Glow Effect */}
                <div className={`absolute -inset-1 rounded-2xl blur opacity-20 transition duration-1000 ${stage === "LOCKED" ? "bg-red-600 opacity-50" : "bg-blue-600"}`}></div>
                
                <div className={`relative bg-[#0F172A] border border-slate-700 rounded-xl h-full overflow-hidden flex flex-col shadow-2xl transition-transform ${isGlitching ? "translate-x-1 translate-y-1" : ""}`}>
                    
                    {/* Fake Browser Bar */}
                    <div className="bg-slate-800 p-2 flex items-center gap-2 border-b border-slate-700 shrink-0">
                        <div className="flex gap-1.5 opacity-50"><div className="w-2 h-2 rounded-full bg-red-500"/><div className="w-2 h-2 rounded-full bg-yellow-500"/><div className="w-2 h-2 rounded-full bg-green-500"/></div>
                        <div className="bg-slate-900/50 text-slate-400 text-[10px] px-2 py-1 rounded-md flex-1 text-center font-sans tracking-wide truncate">
                            🔒 secure.bank-enterprise.com/auth/login
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                        <AnimatePresence mode="wait">
                            {stage === "LOCKED" ? (
                                /* --- LOCKED STATE (HACKER CAUGHT) --- */
                                <motion.div 
                                    key="locked"
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-red-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
                                >
                                    <motion.div 
                                        animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }} 
                                        transition={{ duration: 0.4 }}
                                        className="mb-6 relative"
                                    >
                                        <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 animate-pulse"></div>
                                        <Lock className="w-20 h-20 text-red-500 relative z-10" />
                                    </motion.div>
                                    
                                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">ACCESS DENIED</h1>
                                    
                                    <div className="bg-red-500/20 border border-red-500/50 px-4 py-1.5 rounded-full mb-8">
                                        <p className="text-red-300 text-[10px] font-bold tracking-[0.2em] uppercase">Identity Compromised</p>
                                    </div>
                                    
                                    <div className="text-left bg-black/60 p-4 rounded-lg border border-red-900/50 text-[10px] text-red-400 font-mono space-y-2 w-full shadow-inner">
                                        <p className="flex justify-between"><span>ERROR_CODE:</span> <span className="text-white">0xSEC_VIOLATION</span></p>
                                        <p className="flex justify-between"><span>REASON:</span> <span className="text-white">AI_AUTO_BLOCK</span></p>
                                        <p className="flex justify-between"><span>ACTION:</span> <span className="text-red-500 font-bold">IMMEDIATE_LOCK</span></p>
                                    </div>
                                </motion.div>
                            ) : (
                                /* --- NORMAL STATE (LISTENING) --- */
                                <motion.div 
                                    key="normal"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="w-full space-y-6"
                                >
                                    <div className="text-center mb-10">
                                        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 transform rotate-3">
                                            <ShieldCheck className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Portal</h2>
                                        <p className="text-slate-400 text-xs mt-1">Secure Employee Access</p>
                                    </div>
                                    <div className="space-y-4 opacity-70 pointer-events-none">
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                            <input type="text" value="user_404" readOnly className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2.5 pl-10 text-slate-300 text-sm font-sans" />
                                        </div>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                            <input type="password" value="********" readOnly className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2.5 pl-10 text-slate-300 text-sm font-sans" />
                                        </div>
                                        <button className="w-full bg-blue-600/50 text-white font-bold py-2.5 rounded-lg text-sm mt-2 flex items-center justify-center gap-2">
                                            <Activity className="w-4 h-4 animate-spin" /> Authenticating...
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>


        {/* =======================================================
            RIGHT PANEL: SENTINEL INTELLIGENCE
           ======================================================= */}
        <div className="lg:col-span-8 flex flex-col gap-2 h-full min-h-0">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" /> SentinelX Intelligence Core
            </div>

             {/* --- LISTENING STATE (New Radar Animation) --- */}
            {stage === "LISTENING" && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20 relative overflow-hidden"
                >
                    {/* Upgraded Radar Sweep */}
                    <div className="absolute w-150 h-150 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_220deg,#10b981_360deg)] opacity-10 rounded-full animate-spin"></div>
                    <div className="absolute w-100 h-100 border border-emerald-500/10 rounded-full"></div>
                    <div className="absolute w-50 h-50 border border-emerald-500/10 rounded-full"></div>
                    
                    <Search className="w-16 h-16 text-emerald-500/50 mb-6 relative z-10 animate-pulse" />
                    <p className="text-emerald-500 tracking-[0.2em] font-mono text-sm relative z-10">AWAITING TELEMETRY...</p>
                    
                    <div className="flex gap-8 text-[10px] text-slate-600 font-mono mt-8 relative z-10">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> API GATEWAY</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-75"></div> DB FIREWALL</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-150"></div> IAM LOGS</span>
                    </div>
                </motion.div>
            )}

            {/* --- DETECTED / LOCKED STATE --- */}
            {(stage === "DETECTED" || stage === "LOCKED") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-0">
                    
                    {/* COLUMN 1: LIVE THREAT FEED */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900/40 border border-slate-700 rounded-xl p-6 relative overflow-hidden flex flex-col backdrop-blur-sm h-full"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500 to-transparent animate-[scan_2s_linear_infinite]" />
                        
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h2 className="text-red-500 font-bold flex items-center gap-2 text-sm tracking-wide">
                                <AlertTriangle className="w-4 h-4" /> THREAT SIGNATURES
                            </h2>
                            <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded border border-red-900/50">LIVE</span>
                        </div>
                        
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                            <div className="bg-black/40 p-3 rounded border border-slate-800 flex justify-between items-center">
                                <span className="text-slate-500 text-[10px] uppercase tracking-wider">Target Identity</span>
                                <span className="text-white font-mono text-sm bg-slate-800 px-2 py-0.5 rounded">{data.detective?.target_entity || "Unknown"}</span>
                            </div>

                            <div className="space-y-2 mt-4">
                                {data.detective?.detected_signals?.map((signal: string, i: number) => (
                                    <motion.div 
                                        key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 bg-red-950/20 p-2.5 rounded border-l-2 border-red-500 hover:bg-red-900/30 transition"
                                    >
                                        <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                        <span className="text-red-100 text-xs font-mono">{signal}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-end shrink-0">
                            <span className="text-slate-500 text-[10px] uppercase">Calculated Risk</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-red-500 tracking-tighter">{data.detective?.risk_score}</span>
                                <span className="text-xs text-slate-500">/100</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* COLUMN 2: VERDICT & ENFORCEMENT */}
                    <div className="flex flex-col gap-4 h-full">
                        
                        {/* AI VERDICT CARD */}
                        {data.judge && (
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                                className="bg-slate-900/40 border border-slate-700 rounded-xl p-5 backdrop-blur-sm shrink-0"
                            >
                                <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> AI Verdict Engine
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div className="bg-red-600 text-white font-black px-4 py-2 rounded-lg text-lg shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                                        {data.judge.verdict}
                                    </div>
                                    <span className="text-slate-300 text-[10px] font-mono tracking-wider border border-slate-700 px-3 py-1 rounded-full truncate max-w-30">
                                        {data.judge.containment_level}
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* ENFORCEMENT LOG (Green Checks) */}
                        {stage === "LOCKED" && (
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
                                className="bg-linear-to-br from-red-950/30 to-black border border-red-500/50 rounded-xl p-6 relative flex-1 flex flex-col justify-center min-h-0"
                            >
                                <div className="absolute -top-2 left-6 bg-black px-3 py-0.5 text-red-500 text-[10px] font-bold border border-red-500 rounded shadow-sm">
                                    AUTOMATED RESPONSE
                                </div>

                                <div className="space-y-3 mt-2 overflow-y-auto">
                                    {data.enforcer?.actions_taken?.map((action: string, i: number) => (
                                        <motion.div 
                                            key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span className="text-slate-200 font-mono text-xs">{action}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {data.clerk && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                                        className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-slate-400 text-xs shrink-0"
                                    >
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span>Ticket Created: <span className="text-blue-300 font-mono bg-blue-900/20 px-1 rounded">{data.clerk.ticket_id}</span></span>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}