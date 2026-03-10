// app/campaigns/page.tsx

"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faPlus, faFilter, faBullhorn, faChartLine, 
  faPlay, faPause, faEllipsisV, faRobot, faEnvelope, faPhoneAlt, faCheckDouble, faTimes, faSave,
  faEdit, faCopy, faTrash, faArrowTrendUp
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"; 

export default function CampaignsHub() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const [newCampaign, setNewCampaign] = useState({ name: "", type: "AI Voice", total: 1000 });
  const [isSaving, setIsSaving] = useState(false);

  const [campaigns, setCampaigns] = useState([
    {
      id: "CMP-9082",
      name: "Q3 B2B Tech Outreach",
      type: "AI Voice",
      icon: faRobot,
      color: "blue",
      status: "Active",
      progress: 68,
      sent: 340,
      total: 500,
      conversion: "12.5%",
      lastActive: "Just now"
    },
    {
      id: "CMP-7741",
      name: "Abandoned Cart Recovery",
      type: "WhatsApp",
      icon: faWhatsapp,
      color: "emerald",
      status: "Active",
      progress: 92,
      sent: 1840,
      total: 2000,
      conversion: "24.1%",
      lastActive: "2 mins ago"
    },
    {
      id: "CMP-3329",
      name: "Webinar Follow-up Invites",
      type: "Email",
      icon: faEnvelope,
      color: "purple",
      status: "Paused",
      progress: 45,
      sent: 450,
      total: 1000,
      conversion: "8.2%",
      lastActive: "Yesterday"
    }
  ]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const iconMap: any = { "AI Voice": faRobot, "WhatsApp": faWhatsapp, "Email": faEnvelope };
    const colorMap: any = { "AI Voice": "blue", "WhatsApp": "emerald", "Email": "purple" };

    const newCmp = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCampaign.name,
      type: newCampaign.type,
      icon: iconMap[newCampaign.type],
      color: colorMap[newCampaign.type],
      status: "Draft",
      progress: 0,
      sent: 0,
      total: newCampaign.total,
      conversion: "0.0%",
      lastActive: "Just created"
    };

    setCampaigns([newCmp, ...campaigns]);
    setIsCreateModalOpen(false);
    setNewCampaign({ name: "", type: "AI Voice", total: 1000 });
    setIsSaving(false);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: currentStatus === "Active" ? "Paused" : "Active" } : c
    ));
  };

  const handleEditCampaign = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); 
    alert(`Configuration builder opening for: ${name}\n(Demo Feature)`);
    setOpenDropdownId(null);
  };

  const handleDuplicateCampaign = (e: React.MouseEvent, campaign: any) => {
    e.stopPropagation();
    const duplicated = {
      ...campaign,
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${campaign.name} (Copy)`,
      status: "Draft", 
      progress: 0,
      sent: 0,
      conversion: "0.0%",
      lastActive: "Just duplicated"
    };
    setCampaigns([duplicated, ...campaigns]); 
    setOpenDropdownId(null);
  };

  const handleDeleteCampaign = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    const isConfirmed = window.confirm(`Are you sure you want to permanently delete ${name}?`);
    if (isConfirmed) {
      setCampaigns(campaigns.filter(c => c.id !== id));
      setOpenDropdownId(null);
    }
  };

  const filteredCampaigns = activeTab === "all" 
    ? campaigns 
    : campaigns.filter(c => c.status.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans relative overflow-hidden flex-col md:flex-row" onClick={() => setOpenDropdownId(null)}>
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col custom-scrollbar">
        
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 md:px-10 py-5 flex flex-col md:flex-row md:justify-between md:items-center sticky top-0 z-30 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Campaign Hub</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">Multi-channel Orchestration</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsAnalyticsOpen(true); }}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faChartLine} />
              <span className="hidden sm:inline">Global Analytics</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><FontAwesomeIcon icon={faBullhorn} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Runs</p>
                <p className="text-2xl font-black text-slate-900">{campaigns.filter(c=>c.status==='Active').length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><FontAwesomeIcon icon={faCheckDouble} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sent</p>
                <p className="text-2xl font-black text-slate-900">2,180</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg"><FontAwesomeIcon icon={faPhoneAlt} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Minutes</p>
                <p className="text-2xl font-black text-slate-900">342</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg"><FontAwesomeIcon icon={faChartLine} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Conversion</p>
                <p className="text-2xl font-black text-slate-900">18.3%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200/60 shadow-sm inline-flex">
              {['all', 'active', 'paused', 'draft'].map(tab => (
                <button 
                  key={tab}
                  onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                  className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="w-full md:w-64 bg-white border border-slate-200/60 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pb-20">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group flex flex-col lg:flex-row lg:items-center gap-6">
                
                <div className="flex items-center gap-5 lg:w-1/3">
                  <div className={`w-14 h-14 rounded-2xl bg-${campaign.color}-50 text-${campaign.color}-600 flex items-center justify-center text-xl shrink-0 shadow-inner border border-${campaign.color}-100`}>
                    <FontAwesomeIcon icon={campaign.icon} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-slate-900">{campaign.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border
                        ${campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                          campaign.status === 'Paused' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                          'bg-slate-100 text-slate-500 border-slate-200'}`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{campaign.type} • ID: {campaign.id}</p>
                  </div>
                </div>

                <div className="lg:flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                    <p className="text-xs font-bold text-slate-700">{campaign.sent} / {campaign.total}</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden
                        ${campaign.status === 'Active' ? `bg-${campaign.color}-500` : 'bg-slate-400'}`}
                      style={{ width: `${campaign.progress}%` }}
                    >
                      {campaign.status === 'Active' && (
                        <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]"></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:w-1/4 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Conversion</p>
                    <p className="text-lg font-black text-slate-800">{campaign.conversion}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 relative">
                    {campaign.status !== 'Draft' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(campaign.id, campaign.status); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          campaign.status === 'Active' 
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        }`} 
                        title={campaign.status === 'Active' ? "Pause Campaign" : "Resume Campaign"}
                      >
                        <FontAwesomeIcon icon={campaign.status === 'Active' ? faPause : faPlay} className={campaign.status !== 'Active' ? "ml-0.5" : ""} />
                      </button>
                    )}
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === campaign.id ? null : campaign.id); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${openDropdownId === campaign.id ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      
                      {openDropdownId === campaign.id && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-fade-in origin-top-right"
                          onClick={(e) => e.stopPropagation()} // Stop bubbling inside the menu
                        >
                          <button 
                            onClick={(e) => handleEditCampaign(e, campaign.name)}
                            className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-3" /> Edit Configuration
                          </button>
                          <button 
                            onClick={(e) => handleDuplicateCampaign(e, campaign)}
                            className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center gap-3"
                          >
                            <FontAwesomeIcon icon={faCopy} className="w-3" /> Duplicate Campaign
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-3"></div>
                          <button 
                            onClick={(e) => handleDeleteCampaign(e, campaign.id, campaign.name)}
                            className="w-full text-left px-5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-3" /> Delete Permanently
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            ))}
            {filteredCampaigns.length === 0 && (
              <div className="text-center p-12 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm">
                <p className="text-slate-500 font-bold">No campaigns found in this status.</p>
              </div>
            )}
          </div>

        </div>

        {isAnalyticsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsAnalyticsOpen(false)}></div>
            <div className="bg-white w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col animate-slide-in-right border-l border-slate-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
                  Performance Insights
                </h2>
                <button onClick={() => setIsAnalyticsOpen(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm flex items-center justify-center transition-colors active:scale-95">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                
                <div className="bg-slate-900 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 blur-[40px] rounded-full"></div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 relative z-10">Total Revenue Generated</p>
                  <h3 className="text-4xl font-black text-white relative z-10">$124,500</h3>
                  <div className="flex items-center gap-2 mt-4 relative z-10">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1">
                      <FontAwesomeIcon icon={faArrowTrendUp} /> +24% vs last month
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Channel Performance</h4>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-2"><FontAwesomeIcon icon={faRobot} className="text-blue-600"/> AI Voice</span>
                      <span className="text-sm font-black text-slate-900">42%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full" style={{width: '42%'}}></div></div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-2"><FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600"/> WhatsApp</span>
                      <span className="text-sm font-black text-slate-900">38%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '38%'}}></div></div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope} className="text-purple-600"/> Email</span>
                      <span className="text-sm font-black text-slate-900">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: '20%'}}></div></div>
                  </div>

                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-800">
                    <span className="font-black">Insights:</span> AI Voice is outperforming other channels by 2x in booking high-ticket appointments.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900">New Campaign</h2>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors active:scale-95">
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateCampaign} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Campaign Name</label>
                    <input required type="text" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="e.g. Winter Sales Boost" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Target Channel</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["AI Voice", "WhatsApp", "Email"].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewCampaign({...newCampaign, type})}
                          className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${newCampaign.type === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Total Leads</label>
                    <input required type="number" min="1" value={newCampaign.total} onChange={e => setNewCampaign({...newCampaign, total: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  
                  <button disabled={isSaving} type="submit" className="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-xl mt-8 hover:bg-blue-600 transition-all flex justify-center items-center gap-2 active:scale-95">
                    {isSaving ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <FontAwesomeIcon icon={faSave} />}
                    {isSaving ? "Deploying..." : "Deploy Campaign"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}