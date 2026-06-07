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

  const handleClose = (action: string) => {
    setIsOpen(false);
    if (action === "joined") {
      localStorage.setItem("arcade_popup_seen", "true");
    }
    if (action === "later") {
      sessionStorage.setItem("arcade_popup_seen", "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* === MAIN MODAL CONTAINER === */}
      <div className="relative w-full max-w-[340px] bg-white rounded-2xl border border-gray-200 shadow-2xl p-5 animate-in zoom-in-95 duration-300 font-sans">
        
        {/* Close Button */}
        <button 
          onClick={() => handleClose("later")}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors focus:outline-none border border-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* HEADER */}
        <div className="text-center mt-2 mb-4">
          <h2 className="text-[1.15rem] font-bold text-gray-800 leading-tight">Arcade Program '26</h2>
          <p className="text-gray-500 text-xs mt-1">Get instant updates on WhatsApp</p>
        </div>

        {/* HIGHLIGHTED CARD (Channel + QR) */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-3 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {/* WA Logo */}
              <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0 border border-[#1fae51] shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-sm leading-none">WhatsApp Channel</h3>
                <p className="text-[#1da851] text-[10px] font-medium mt-1">Quick Updates Only</p>
              </div>
            </div>
            
            {/* QR CODE Box */}
            <div className="bg-white p-1 rounded-lg border border-gray-300 shadow-sm">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(WHATSAPP_LINK)}`}
                 alt="QR Code" 
                 className="w-9 h-9 object-cover rounded-md" 
               />
            </div>
          </div>

          {/* Follow Channel Button (Solid Green with Thin Border) */}
          <a 
            href={WHATSAPP_LINK} 
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-lg border border-[#1fae51] shadow-sm transition-all focus:outline-none"
          >
            Follow Channel
          </a>
        </div>

        {/* Divider text */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Join Community</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* WhatsApp Group ONLY (Solid Darker Green for Contrast, Thin Border) */}
        <div className="mb-6">
          <a 
            href={WHATSAPP_LINK} 
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-semibold rounded-lg border border-[#0b6b5f] shadow-sm transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            WhatsApp Group
          </a>
        </div>

        {/* BOTTOM ACTIONS (Solid Colors & Thin Borders) */}
        <div className="flex items-center gap-2">
          {/* Don't Show Again Button */}
          <button 
            onClick={() => handleClose("joined")}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium rounded-xl border border-gray-900 shadow-sm transition-all"
          >
            Don't Show Again
          </button>
          
          {/* Remind Later Button */}
          <button 
            onClick={() => handleClose("later")}
            className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-xl border border-gray-300 shadow-sm transition-all"
          >
            Remind Later
          </button>
        </div>

      </div>
    </div>
  );
}