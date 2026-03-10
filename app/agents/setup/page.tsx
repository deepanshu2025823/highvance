"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBrain, faSave, faBullseye, faVolumeUp, 
  faClock, faMemory, faTrash, faCheckCircle, 
  faMicrophone, faNetworkWired, faWaveSquare, faServer, faKey,
  faPlus,
  faPhoneAlt
} from "@fortawesome/free-solid-svg-icons";

export default function AgentSetup() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [config, setConfig] = useState({
    name: "AI Lead Architect",
    goal: "appointment_booking",
    ttsProvider: "cartesia",
    telephony: "signalwire",
    llmProvider: "gpt-4o",
    hasMemory: true
  });

  const [followUps, setFollowUps] = useState([
    { id: 1, time: "2 hours", channel: "WhatsApp" },
    { id: 2, time: "24 hours", channel: "AI Call" }
  ]);

  const addFollowUp = () => {
    setFollowUps([...followUps, { id: Date.now(), time: "48 hours", channel: "WhatsApp" }]);
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch("/api/agents/setup", {
      method: "POST",
      body: JSON.stringify({ ...config, followUpPlan: followUps }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.success) alert("Agent Core Synchronized with Cloud!");
    setIsInitializing(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans relative overflow-hidden flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col custom-scrollbar">
        
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 md:px-10 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/20">
              <FontAwesomeIcon icon={faBrain} className="text-blue-400 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Orchestration Studio</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Neural Agent Deployment</p>
            </div>
          </div>
          <button 
            onClick={handleInitialize}
            disabled={isInitializing}
            className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-50 active:scale-95"
          >
            <FontAwesomeIcon icon={isInitializing ? faCheckCircle : faServer} className={isInitializing ? "animate-spin" : ""} />
            {isInitializing ? "Deploying..." : "Deploy Agent"}
          </button>
        </div>

        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><FontAwesomeIcon icon={faBullseye} /></div>
                  <h2 className="font-black text-slate-900 uppercase tracking-widest text-sm">Mission Directive</h2>
                </div>
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
              </div>
              
              <div className="space-y-6">
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 rounded-2xl p-5 font-black text-slate-800 text-xl outline-none transition-all placeholder:text-slate-300"
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  placeholder="e.g., Outbound Sales Terminator"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "appointment_booking", label: "Appointment", desc: "Sync & Book Calendars", icon: faClock },
                    { id: "queries_support", label: "Support AI", desc: "Resolve Tech Queries", icon: faBrain },
                    { id: "qualify_lead", label: "Qualification", desc: "Filter & Score Leads", icon: faCheckCircle }
                  ].map((g) => (
                    <button 
                      key={g.id}
                      onClick={() => setConfig({...config, goal: g.id})}
                      className={`relative p-5 rounded-3xl border-2 text-left transition-all overflow-hidden group ${config.goal === g.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                    >
                      <FontAwesomeIcon icon={g.icon} className={`absolute right-4 top-4 text-2xl opacity-10 transition-transform group-hover:scale-125 ${config.goal === g.id ? 'text-blue-600 opacity-20' : ''}`} />
                      <p className={`font-black text-xs uppercase tracking-wider z-10 relative ${config.goal === g.id ? 'text-blue-700' : 'text-slate-700'}`}>{g.label}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1.5 z-10 relative">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><FontAwesomeIcon icon={faNetworkWired} /></div>
                <h2 className="font-black text-slate-900 uppercase tracking-widest text-sm">Neural & Telephony Stack</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                    <span>Voice Synthesis (TTS)</span>
                    <FontAwesomeIcon icon={faVolumeUp} />
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => setConfig({...config, ttsProvider: "cartesia"})}
                      className={`flex flex-col p-5 rounded-2xl border-2 transition-all ${config.ttsProvider === "cartesia" ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 bg-white hover:border-orange-200'}`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className={`font-black text-sm ${config.ttsProvider === "cartesia" ? 'text-orange-600' : 'text-slate-700'}`}>Cartesia AI</span>
                        <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-2 py-1 rounded uppercase">Sonic-3</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold text-left">90ms Ultra-low latency streaming for natural interruptions.</p>
                    </button>

                    <button 
                      onClick={() => setConfig({...config, ttsProvider: "eleven_labs"})}
                      className={`flex flex-col p-5 rounded-2xl border-2 transition-all ${config.ttsProvider === "eleven_labs" ? 'border-slate-900 bg-slate-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className={`font-black text-sm ${config.ttsProvider === "eleven_labs" ? 'text-slate-900' : 'text-slate-700'}`}>ElevenLabs</span>
                        <span className="text-[9px] font-black bg-slate-200 text-slate-700 px-2 py-1 rounded uppercase">Turbo v2.5</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold text-left">Highest fidelity and emotional resonance for complex queries.</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                    <span>Telephony Gateway</span>
                    <FontAwesomeIcon icon={faPhoneAlt} />
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => setConfig({...config, telephony: "signalwire"})}
                      className={`flex flex-col p-5 rounded-2xl border-2 transition-all ${config.telephony === "signalwire" ? 'border-purple-600 bg-purple-50' : 'border-slate-100 bg-white hover:border-purple-200'}`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className={`font-black text-sm ${config.telephony === "signalwire" ? 'text-purple-700' : 'text-slate-700'}`}>SignalWire</span>
                        <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase">Enterprise</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold text-left">Programmable SIP and high-throughput real-time APIs.</p>
                    </button>

                    <button 
                      onClick={() => setConfig({...config, telephony: "vobiz"})}
                      className={`flex flex-col p-5 rounded-2xl border-2 transition-all ${config.telephony === "vobiz" ? 'border-amber-500 bg-amber-50' : 'border-slate-100 bg-white hover:border-amber-200'}`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className={`font-black text-sm ${config.telephony === "vobiz" ? 'text-amber-600' : 'text-slate-700'}`}>Vobiz</span>
                        <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-1 rounded uppercase">SIP Trunk</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold text-left">Direct Voice XML & low-cost seamless telephony integration.</p>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between group overflow-hidden relative shadow-2xl">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMicrophone} /> Core STT Engine
                  </p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-black text-xl tracking-tight">Deepgram Nova-2</h3>
                    <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[9px] font-bold border border-white/20">LOCKED</span>
                  </div>
                </div>
                <FontAwesomeIcon icon={faWaveSquare} className="text-white/5 text-7xl absolute -right-4 top-1/2 -translate-y-1/2 group-hover:text-blue-500/10 transition-all" />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <section className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/30 transition-all" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><FontAwesomeIcon icon={faMemory} /></div>
                    <h2 className="font-black uppercase tracking-widest text-xs">Neural Memory</h2>
                  </div>
                  <button 
                    onClick={() => setConfig({...config, hasMemory: !config.hasMemory})}
                    className={`w-12 h-6 rounded-full transition-all relative p-1 shadow-inner ${config.hasMemory ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all ${config.hasMemory ? 'ml-6' : 'ml-0'}`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-5 font-medium relative z-10">
                  Enabling memory allows the agent to recall <span className="text-emerald-400 font-bold">past booking attempts</span> and specific lead preferences across Voice & Chat.
                </p>
             </section>

             <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><FontAwesomeIcon icon={faClock} /></div>
                    <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Automation Flow</h2>
                  </div>
                  <button onClick={addFollowUp} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-all flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlus} /> ADD
                  </button>
                </div>
                
                <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent space-y-4">
                  {followUps.map((f, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <span className="text-[10px] font-black">{i+1}</span>
                      </div>
                      
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-all shadow-sm flex justify-between items-center group-hover:shadow-md">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Wait {f.time}</p>
                          <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            {f.channel} Ping
                          </p>
                        </div>
                        <button 
                          onClick={() => setFollowUps(followUps.filter(item => item.id !== f.id))}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <FontAwesomeIcon icon={faTrash} size="xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </section>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}