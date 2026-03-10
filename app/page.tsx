"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faRobot, faPhoneAlt, faDollarSign, 
  faCode, faCopy, faSyncAlt, faSignOutAlt, faArrowTrendUp, faCheck
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const integrationCode = `<script src="${typeof window !== 'undefined' ? window.location.origin : "https://highvance.com"}/api/sdk.js?id=crm_core"></script>`;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchContacts();
    }
  }, [status]);

  const handleCopy = () => {
    navigator.clipboard.writeText(integrationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 animate-pulse mb-4 shadow-lg shadow-blue-500/30"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Workspace...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] font-sans relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes move {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-shape-1 { animation: move 12s infinite ease-in-out; }
        .animate-shape-2 { animation: move 15s infinite ease-in-out reverse; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[100px] animate-shape-1 top-[-10%] left-[10%]"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-[100px] animate-shape-2 bottom-[-10%] right-[10%]"></div>
      </div>

      <div className="relative z-20">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 custom-scrollbar pb-10 md:pb-0">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 md:px-10 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">System Overview</h1>
            <p className="hidden md:block text-[11px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest">
              Welcome back, <span className="text-blue-600">{session?.user?.name}</span>
            </p>
          </div>
          <button 
            onClick={() => signOut()} 
            className="text-xs font-bold text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-red-100 shadow-sm flex items-center gap-2 active:scale-95"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Total Leads", val: contacts.length, trend: "+12% this week", color: "blue", icon: faUsers }, 
              { label: "Active AI Agents", val: "1", trend: "Online & Listening", color: "emerald", icon: faRobot }, 
              { label: "Automated Calls", val: "24", trend: "+5% today", color: "indigo", icon: faPhoneAlt }, 
              { label: "Pipeline Value", val: "$12.4k", trend: "High intent", color: "purple", icon: faDollarSign }
            ].map((stat, i) => (
              <div key={i} className="group bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                  <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] md:text-[11px] font-extrabold text-slate-400 mb-1 block uppercase tracking-widest">{stat.label}</span>
                  <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.val}</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 sticky top-28 group">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg"><FontAwesomeIcon icon={faCode} size="sm" /></div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Deploy Lead Capture</h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Inject this intelligent SDK into your website's &lt;head&gt; tag to sync leads into TiDB instantly.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 bg-[#0f172a] rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex gap-1.5 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <code className="text-[11px] text-blue-300 break-all leading-relaxed block font-mono">
                      {integrationCode}
                    </code>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`w-full font-black py-4 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] ${copied ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    <span>{copied ? "Snippet Copied!" : "Copy SDK Snippet"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col h-full min-h-[450px]">
                
                <div className="px-6 py-6 md:px-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Lead Pipeline</h2>
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span> Live
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={fetchContacts} disabled={loading} className="text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50">
                      <FontAwesomeIcon icon={faSyncAlt} className={loading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto flex-1 p-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Lead ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact Details</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {contacts.map((contact: any, idx) => (
                        <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                              #{contact.id.substring(contact.id.length - 6).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-xs shrink-0 group-hover:from-blue-100 group-hover:to-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
                                {contact.name.charAt(0)}
                              </div>
                              <div>
                                <span className="text-sm font-black text-slate-800 block mb-0.5">{contact.name}</span>
                                <span className="text-[11px] font-bold text-slate-500">{contact.phone || contact.email || 'No contact info'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {idx === 0 ? 'New Lead' : 'In Queue'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {contacts.length === 0 && !loading && (
                    <div className="p-16 text-center flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <FontAwesomeIcon icon={faUsers} className="text-2xl" />
                      </div>
                      <p className="text-slate-900 font-black text-sm">Pipeline is empty</p>
                      <p className="text-slate-400 text-xs font-bold mt-1">Embed the SDK to start capturing AI leads.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}