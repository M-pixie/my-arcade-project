"use client";

import { useState, useEffect } from "react";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage
    const hasSeenModal = localStorage.getItem("arcade_popup_seen");
    
    // 1 second delay ke baad open hoga
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (action: string) => {
    setIsOpen(false);
    if (action === "joined") {
      localStorage.setItem("arcade_popup_seen", "true"); // Permanent close
    }
    if (action === "later") {
      sessionStorage.setItem("arcade_popup_seen", "true"); // Temporary close
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* === MODAL CONTAINER === */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl p-6 md:p-8 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Close Button (Top Right) */}
        <button 
          onClick={() => handleClose("later")}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* HEADER SECTION */}
        <div className="flex items-start gap-4 mb-2">
          {/* Blue Bell Icon */}
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
          </div>
          <div className="mt-1">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Stay Updated - Arcade 2026</h2>
            <p className="text-slate-500 text-sm mt-1">Join our channels for real-time announcements.</p>
          </div>
        </div>

        {/* Blue Divider Line */}
        <div className="h-1 w-16 bg-blue-600 rounded-full mt-5 mb-8"></div>

        {/* WHITE CARD (Shadow Box) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* WhatsApp Logo */}
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm">Official Channel</h3>
              <p className="text-slate-400 text-xs">Announcements only</p>
            </div>
          </div>
          
          {/* QR CODE */}
          <div className="w-12 h-12 bg-slate-50 p-1 rounded-lg border border-slate-100">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" alt="QR" className="w-full h-full object-cover rounded" />
          </div>
        </div>

        {/* GRID BUTTONS (2 Columns) */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* 1. Follow Channel (Blue) */}
          <a 
            href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" 
            target="_blank"
            className="col-span-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
            Follow Channel
          </a>

          {/* 2. Close Later (Light Gray) */}
          <button 
            onClick={() => handleClose("later")}
            className="col-span-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl border border-slate-100 transition-all"
          >
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Close ("later")
          </button>

          {/* 3. WhatsApp Group (Light Gray) */}
          <a 
            href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" 
            target="_blank"
            className="col-span-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-100 transition-all"
          >
            <div className="w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            WhatsApp Group
          </a>

          {/* 4. Telegram Group (Light Gray) */}
          <a 
            href="https://t.me/..." 
            target="_blank"
            className="col-span-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-100 transition-all"
          >
            <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram/...
          </a>

        </div>

      </div>
    </div>
  );
}