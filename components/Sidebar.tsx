"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; 

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); 

  const navItems = [
    { 
      name: "Overview", 
      href: "/", 
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
    },
    { 
      name: "CRM Contacts", 
      href: "/contacts", 
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
    },
    { 
      name: "Form Studio", 
      href: "/forms/builder", 
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
    },
    { 
      name: "Agent Setup", 
      href: "/agents/setup", 
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
    },
    { 
      name: "Voice Engine", 
      href: "/agents/test", 
      icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
    },
    { 
      name: "Campaigns", 
      href: "/campaigns", 
      icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
    },
  ];

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-slate-200/60 p-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-sm">H</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Highvance</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 bg-slate-100 p-2.5 rounded-xl transition-all active:scale-95">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200/60 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)]
        transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:sticky md:top-0 md:h-screen
      `}>
        
        <div className="p-7 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Highvance</h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">Workspace</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center px-4 py-3.5 text-[13px] font-bold rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-50/50 text-blue-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                )}
                
                <div className={`mr-3.5 p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 group-hover:text-blue-500 group-hover:scale-110'}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={item.icon} />
                  </svg>
                </div>
                {item.name}

                {item.name === "Voice Engine" && (
                  <span className="ml-auto text-[8px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Live</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-5 pb-6 pt-4">
          <div className="mb-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Core Engine</span>
            <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              99.9%
            </span>
          </div>

          <div className="relative bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-2 flex items-center group">
            
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 uppercase">
              {session?.user?.name ? session.user.name.charAt(0) : "U"}
            </div>
            <div className="flex-1 min-w-0 px-3">
              
              <p className="text-xs font-black text-slate-900 leading-tight truncate">
                {session?.user?.name || "Loading..."}
              </p>
              <p className="text-[10px] text-slate-500 font-bold truncate mt-0.5">
                {session?.user?.email || "Loading..."}
              </p>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </>
  );
}