// app/forms/builder/page.tsx

"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, faTrash, faSave, faCode, faGripVertical, 
  faPalette, faDesktop, faMobileAlt, faCheckCircle,
  faToggleOn, faToggleOff, faAsterisk
} from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function EnterpriseFormBuilder() {
  const [formName, setFormName] = useState("Enterprise Lead Magnet");
  const [primaryColor, setPrimaryColor] = useState("#0f172a"); 
  const [borderRadius, setBorderRadius] = useState("1.5rem");
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const [fields, setFields] = useState([
    { id: "f1", label: "Full Name", type: "text", placeholder: "e.g. John Doe", required: true },
    { id: "f2", label: "Work Email", type: "email", placeholder: "john@company.com", required: true },
  ]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFields(items);
  };

  const addField = () => {
    setFields([...fields, { 
      id: `f-${Date.now()}`, 
      label: "New Input", 
      type: "text", 
      placeholder: "Enter value...",
      required: false
    }]);
  };

  const updateField = (index: number, key: string, value: any) => {
    const updated = [...fields];
    (updated[index] as any)[key] = value;
    setFields(updated);
  };

  const publishForm = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/forms/save", {
        method: "POST",
        body: JSON.stringify({ 
          name: formName, 
          fields: fields, 
          accentColor: primaryColor, 
          borderRadius: borderRadius 
        }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setSavedId(data.formId);
        alert("Enterprise System Published Successfully!");
      }
    } catch (e) {
      alert("Database Synchronization Failed!");
    } finally {
      setIsSaving(false);
    }
  };

  const embedSnippet = savedId ? `<script src="${typeof window !== 'undefined' ? window.location.origin : ""}/api/sdk.js?id=${savedId}"></script>` : "";

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans relative overflow-hidden flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col custom-scrollbar">
        
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
              <FontAwesomeIcon icon={faPalette} />
            </div>
            <div>
              <h1 className="text-[14px] md:text-xl font-bold text-slate-900 tracking-tight leading-none">Form Studio</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Enterprise</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={publishForm} disabled={isSaving} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] md:text-base hover:bg-blue-600 shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70">
              <FontAwesomeIcon icon={isSaving ? faCheckCircle : faSave} className={isSaving ? "animate-pulse" : ""} />
              {isSaving ? "Syncing..." : "Publish"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <div className="w-full lg:w-96 bg-white border-r border-slate-200 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            <section className="space-y-5">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Brand Identity</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Accent Color</label>
                  <div className="relative flex items-center">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-11 rounded-xl cursor-pointer border-2 border-slate-50 p-1 bg-white shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Roundness</label>
                  <select 
                    value={borderRadius} 
                    onChange={(e) => setBorderRadius(e.target.value)}
                    className="w-full h-11 bg-slate-50 border-none rounded-xl text-xs font-bold px-3 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="0rem">Sharp (0px)</option>
                    <option value="0.75rem">Modern (12px)</option>
                    <option value="1.5rem">Curvy (24px)</option>
                    <option value="3rem">Pill (48px)</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Form Structure</h2>
                <button onClick={addField} className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider">+ Add Field</button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              className={`group bg-white border ${snapshot.isDragging ? 'border-blue-500 shadow-2xl scale-105 z-50' : 'border-slate-100 shadow-sm'} p-4 rounded-2xl flex flex-col gap-3 transition-all`}
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                  <FontAwesomeIcon icon={faGripVertical} />
                                </div>
                                <div className="flex-1">
                                  <input 
                                    className="bg-transparent border-none p-0 w-full text-xs font-bold text-slate-700 focus:ring-0"
                                    value={field.label}
                                    onChange={(e) => updateField(index, 'label', e.target.value)}
                                  />
                                </div>
                                <button onClick={() => updateField(index, 'required', !field.required)} className={`transition-colors ${field.required ? 'text-blue-600' : 'text-slate-300'}`}>
                                  <FontAwesomeIcon icon={field.required ? faToggleOn : faToggleOff} />
                                </button>
                                <button 
                                  onClick={() => setFields(fields.filter(f => f.id !== field.id))}
                                  className="text-slate-200 hover:text-red-500 transition-colors"
                                >
                                  <FontAwesomeIcon icon={faTrash} size="xs" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <select className="bg-slate-50 border-none rounded-lg text-[9px] font-bold p-2" value={field.type} onChange={(e) => updateField(index, 'type', e.target.value)}>
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Phone</option>
                                  <option value="number">Number</option>
                                </select>
                                <input className="bg-slate-50 border-none rounded-lg text-[9px] p-2" placeholder="Placeholder..." value={field.placeholder} onChange={(e) => updateField(index, 'placeholder', e.target.value)} />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </section>

            {savedId && (
              <section className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 space-y-4 shadow-2xl shadow-blue-900/20">
                <div className="flex items-center gap-2 text-blue-400">
                  <FontAwesomeIcon icon={faCode} className="text-xs" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy System</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 relative group">
                  <code className="text-[9px] text-slate-400 break-all font-mono block leading-relaxed overflow-hidden">
                    {embedSnippet}
                  </code>
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                    <button 
                      onClick={() => {navigator.clipboard.writeText(embedSnippet); alert("Architectural Code Copied!")}}
                      className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg"
                    >
                      Copy Snippet
                    </button>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 italic text-center leading-relaxed px-4">Place this snippet before the &lt;/body&gt; tag of your production website.</p>
              </section>
            )}
          </div>

          <div className="flex-1 bg-[#f1f5f9] p-4 md:p-12 overflow-y-auto flex flex-col items-center custom-scrollbar">
            
            <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-200 mb-10 shrink-0">
              <button 
                onClick={() => setViewMode("desktop")}
                className={`px-6 py-2.5 rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center gap-2 ${viewMode === "desktop" ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FontAwesomeIcon icon={faDesktop} /> Desktop View
              </button>
              <button 
                onClick={() => setViewMode("mobile")}
                className={`px-6 py-2.5 rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center gap-2 ${viewMode === "mobile" ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FontAwesomeIcon icon={faMobileAlt} /> Mobile View
              </button>
            </div>

            <div 
              style={{ 
                borderRadius: borderRadius,
                width: viewMode === "mobile" ? "375px" : "100%",
                maxWidth: viewMode === "mobile" ? "375px" : "600px"
              }}
              className="bg-white p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white transition-all duration-500 ease-in-out transform"
            >
              <div className="relative group">
                <input 
                  className="text-[18px] md:text-[22px] font-black text-slate-900 w-full bg-transparent border-none p-0 mb-2 focus:ring-0 cursor-edit"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-400 text-[10px] md:text-[10px] font-bold mb-10 tracking-tight flex items-center gap-2 uppercase tracking-widest">
                <span className="w-8 h-px bg-slate-200" /> Validation Protocol v2.5 Active
              </p>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {fields.map((f) => (
                  <div key={f.id} className="space-y-2 group">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">
                        {f.label} {f.required && <FontAwesomeIcon icon={faAsterisk} className="text-[7px] text-red-500 mb-1 ml-0.5" />}
                      </label>
                      {f.required && <span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Required Field</span>}
                    </div>
                    <input 
                      disabled
                      placeholder={f.placeholder}
                      style={{ borderRadius: `calc(${borderRadius} / 2.5)` }}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 outline-none text-sm font-medium transition-all group-hover:bg-slate-100/50"
                    />
                  </div>
                ))}
                
                <div className="pt-4">
                  <button 
                    style={{ backgroundColor: primaryColor, borderRadius: borderRadius }}
                    className="w-full text-white font-black py-5 shadow-2xl hover:brightness-110 active:scale-[0.99] transition-all tracking-[0.1em] uppercase text-[10px] md:text-sm"
                  >
                    Submit Information
                  </button>
                  <p className="text-[9px] text-slate-300 font-bold text-center mt-6 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} /> Secured by Highvance Cloud
                  </p>
                </div>
              </form>
            </div>
            
            <div className="h-20 shrink-0" />
          </div>

        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .cursor-edit:hover { background: #f8fafc; border-radius: 4px; }
      `}</style>
    </div>
  );
}