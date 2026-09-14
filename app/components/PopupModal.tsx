"use client";

import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Make sure this path is correct for your project

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // की (Key) का नाम बदल दिया है ताकि यह सभी यूज़र्स के लिए रीसेट हो जाए और फिर से दिखे
  const POPUP_STORAGE_KEY = "arcade_feedback_popup_seen_reset_1"; 

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(POPUP_STORAGE_KEY);

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // रेटिंग को Firebase में सेव करने का फंक्शन
  const handleRate = async (score: number) => {
    // 1. तुरंत पॉपअप बंद करें और लोकल स्टोरेज अपडेट करें (ताकि यूजर को इंतज़ार न करना पड़े)
    setIsOpen(false);
    localStorage.setItem(POPUP_STORAGE_KEY, "true");

    // 2. बैकग्राउंड में Firebase पर डेटा भेज दें
    try {
      if (db) {
        await addDoc(collection(db, "platform_feedback"), {
          rating: score, // 1 (😞) से 5 (😀) तक का स्कोर
          source: "popup_modal", // Footer से अलग पहचानने के लिए
          timestamp: Date.now(),
          date: new Date().toLocaleDateString('en-IN')
        });
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  if (!isOpen) return null;

  const emojis = ['😞', '😟', '😐', '🙂', '😀'];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300">
        
        <div className="px-6 py-10 sm:px-8 text-center">
          
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            Arcade Nexus
            <span className="block mt-1 text-sm font-medium text-gray-500">Welcome</span>
          </h2>
          
          <div className="mt-4 inline-block rounded-lg bg-blue-50 py-2.5 px-5">
            <p className="text-[15px] font-bold text-blue-700">
              Arcade Facilitator Program 2026
            </p>
            <p className="mt-0.5 text-xs font-semibold text-blue-600/80">
              (13 July - 14 Sept)
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center border-t border-gray-100 pt-7">
            <h3 className="text-[14px] font-bold text-gray-800">Overall, how helpful is this platform?</h3>
            
            <div className="mt-5 flex w-full max-w-[280px] justify-between px-2">
              {emojis.map((emoji, index) => (
                <button 
                  key={index} 
                  // index 0 से शुरू होता है, इसलिए +1 करके 1,2,3,4,5 स्कोर भेज रहे हैं
                  onClick={() => handleRate(index + 1)} 
                  className="text-3xl grayscale transition-all duration-200 hover:scale-110 hover:grayscale-0 active:scale-95 focus:outline-none"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div className="mt-3 flex w-full max-w-[280px] justify-between px-2 text-[11px] font-medium text-gray-400">
              <span>Very unhelpful</span>
              <span>Very helpful</span>
            </div>

            <p className="mt-6 text-[12px] font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              Rate experience & continue
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}