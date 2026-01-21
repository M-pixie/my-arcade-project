"use client";

import { useState, useEffect } from "react";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Aapka Link Variable
  const WHATSAPP_LINK = "https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY";

  useEffect(() => {
    // Sirf localStorage check karenge (Permanent memory)
    const hasSeenModal = localStorage.getItem("arcade_popup_seen");
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (action) => {
    setIsOpen(false);
    if (action === "joined") {
      // Jab user "Already Joined" bolega, to hum isse permanent save karenge
      localStorage.setItem("arcade_popup_seen", "true");
    }
    if (action === "later") {
      // Cross dabane par session storage use hoga (par useEffect isse ignore karega, to refresh pe wapas aayega)
      sessionStorage.setItem("arcade_popup_seen", "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* === MAIN MODAL CONTAINER === */}
      {/* Change: rounded-32px -> rounded-xl (Kam Round) */}
      <div className="relative w-full max-w-[440px] bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        
        {/* Close Button (Small & Sharp) */}
        <button 
          onClick={() => handleClose("later")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-4">
          {/* Bell Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Stay Updated - Arcade 2026</h2>
            <p className="text-gray-500 text-xs mt-0.5">Join community for real-time updates.</p>
          </div>
        </div>

        {/* Blue Line (Sharp) */}
        <div className="h-1 w-16 bg-blue-600 rounded-full mb-6 ml-1"></div>

        {/* MIDDLE CARD (Specific Box Design) */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* WA Logo */}
            <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Arcade Communty</h3>
              <p className="text-gray-500 text-[10px]">ACTIVE MEMBERS</p>
            </div>
          </div>
          
          {/* QR CODE Box */}
          <div className="bg-white p-1 rounded border border-gray-200">
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY")}`}
                alt="QR" 
                className="w-12 h-12 object-cover" 
             />
          </div>
        </div>

        {/* 2x2 GRID LAYOUT */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* 1. Follow Button (Blue) */}
          <a 
            href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" 
            target="_blank"
            className="col-span-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-200"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            Follow Communty
          </a>

          {/* 2. Joined/Close (Gray) - UPDATED HERE */}
          <button 
            // MAIN CHANGE: Yahan "later" ki jagah "joined" kar diya hai
            onClick={() => handleClose("joined")}
            className="col-span-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-all"
          >
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Already Joined
          </button>

          {/* 3. Whatsapp Group (Gray) */}
          <a 
            href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" 
            target="_blank"
            className="col-span-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-all"
          >
             <div className="w-4 h-4 bg-[#25D366] rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            Whatsapp Group
          </a>

          {/* 4. Telegram (Gray) */}
          <a 
            href="#" 
            target="_blank"
            className="col-span-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-all"
          >
             <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram/...
          </a>

        </div>

      </div>
    </div>
  );
}