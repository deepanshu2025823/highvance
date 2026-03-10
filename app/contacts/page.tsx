// app/contacts/page.tsx

"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faPlus, faFileExport, faFilter, 
  faPhone, faEnvelope, faRobot, faGlobe, faUserCircle,
  faTimes, faBrain, faHistory, faCheckCircle, faTrash
} from "@fortawesome/free-solid-svg-icons";

export default function ContactsDirectory() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

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
    fetchContacts();
  }, []);

  const downloadCSV = () => {
    if (contacts.length === 0) return alert("No leads to export!");
    
    const headers = ["ID", "Name", "Email", "Phone", "Source", "Date Added"];
    const csvRows = contacts.map(c => [
      c.id, 
      `"${c.name}"`, 
      `"${c.email || ''}"`, 
      `"${c.phone || ''}"`, 
      c.source, 
      new Date(c.createdAt).toLocaleDateString()
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Highvance_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await new Promise(r => setTimeout(r, 800));

    try {
      const fakeNewLead = {
        id: `cuid_${Date.now()}`,
        ...newLead,
        source: "MANUAL",
        createdAt: new Date().toISOString()
      };
      
      setContacts([fakeNewLead, ...contacts]);
      setIsAddModalOpen(false);
      setNewLead({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding lead", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!isConfirmed) return;

    setContacts(contacts.filter(contact => contact.id !== id));    
  };

  const handleClearAll = async () => {
    const isConfirmed = window.confirm("⚠️ WARNING: Are you sure you want to permanently delete ALL leads? This action cannot be undone.");
    if (!isConfirmed) return;

    setContacts([]);
  };

  const openViewPanel = (contact: any) => {
    setSelectedLead(contact);
    setIsViewPanelOpen(true);
  };

  const filteredContacts = contacts.filter((c: any) => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans relative overflow-hidden flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col custom-scrollbar">
        
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 md:px-10 py-5 flex flex-col md:flex-row md:justify-between md:items-center sticky top-0 z-30 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">CRM Directory</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">Lead Management</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {contacts.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 hover:border-red-200 shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span className="hidden sm:inline">Clear Data</span>
              </button>
            )}

            <button 
              onClick={downloadCSV}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faFileExport} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
          
          <div className="bg-white p-4 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads by name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <button className="px-5 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100">
              <FontAwesomeIcon icon={faFilter} /> Filters
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Info</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Added On</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <div className="inline-block w-8 h-8 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                      </td>
                    </tr>
                  ) : filteredContacts.length > 0 ? (
                    filteredContacts.map((contact: any) => (
                      <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-sm shrink-0 shadow-sm group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-700 transition-all uppercase">
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 block">{contact.name}</p>
                              <span className="text-[10px] font-mono font-bold text-slate-400">#{contact.id.slice(-6).toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="space-y-1.5">
                            {contact.email && (
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 w-3" />
                                {contact.email}
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <FontAwesomeIcon icon={faPhone} className="text-slate-400 w-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                            ${contact.source === 'API' ? 'bg-purple-100 text-purple-700' : 
                              contact.source === 'AI_AGENT' ? 'bg-emerald-100 text-emerald-700' : 
                              'bg-blue-100 text-blue-700'}`}
                          >
                            <FontAwesomeIcon icon={contact.source === 'API' ? faGlobe : contact.source === 'AI_AGENT' ? faRobot : faUserCircle} />
                            {contact.source || 'MANUAL'}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-xs font-bold text-slate-500">
                            {formatDate(contact.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openViewPanel(contact)}
                              className="text-[10px] font-black text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 px-3 py-2 rounded-lg transition-all uppercase tracking-widest active:scale-95"
                            >
                              View
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteLead(contact.id, contact.name)}
                              title="Delete Lead"
                              className="text-[10px] text-slate-400 hover:text-white border border-transparent hover:bg-red-500 px-2.5 py-2 rounded-lg transition-all active:scale-95"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                          <FontAwesomeIcon icon={faSearch} className="text-2xl" />
                        </div>
                        <p className="text-slate-900 font-black text-sm">No leads found</p>
                        <p className="text-slate-400 text-xs font-bold mt-1">Your pipeline is currently empty.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden transform transition-all">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900">Add New Lead</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                <form onSubmit={handleAddLead} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                    <input required type="text" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                    <input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
                    <input type="tel" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
                  
                  <button disabled={isSaving} type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg mt-6 hover:bg-blue-600 transition-all flex justify-center items-center gap-2">
                    {isSaving ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <FontAwesomeIcon icon={faCheckCircle} />}
                    {isSaving ? "Saving Lead..." : "Save Lead to Database"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {isViewPanelOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsViewPanelOpen(false)}></div>
            <div className="bg-white w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col animate-slide-in-right">
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Lead Profile</h2>
                <button onClick={() => setIsViewPanelOpen(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm flex items-center justify-center transition-colors">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-3xl mx-auto shadow-xl shadow-blue-500/30 uppercase mb-4">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedLead.name}</h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                    ID: {selectedLead.id.slice(-8)}
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.email || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.phone || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acquisition Source</p>
                    <p className="text-sm font-bold text-blue-600">{selectedLead.source}</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-[40px] rounded-full"></div>
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <FontAwesomeIcon icon={faBrain} className="text-emerald-400" />
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">AI Cognitive Memory</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed relative z-10 font-medium">
                    {selectedLead.source === "AI_AGENT" 
                      ? "Lead showed high interest in the product during the last call. Follow-up recommended regarding pricing."
                      : "No AI conversations recorded yet. Initiate an AI outbound call to generate memory context."}
                  </p>
                </div>

              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faRobot} />
                  Initiate AI Call
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}