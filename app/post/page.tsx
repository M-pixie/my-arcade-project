"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db } from "@/lib/firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function SwagDropsPage() {
  const [activeTier, setActiveTier] = useState("All Tiers");
  const [swags, setSwags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const tiers = ["All Tiers", "Trooper", "Ranger", "Champion", "Legend"];

  useEffect(() => {
    const q = query(collection(db, "swag_drops"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSwags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSwags(fetchedSwags);
      setLoading(false);
      
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }, (error) => {
      console.error("Firebase fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSwags = activeTier === "All Tiers" 
    ? swags 
    : swags.filter(swag => swag.tags && swag.tags.includes(activeTier));

  const arcadeCards = [
    { stars: "★", title: "Arcade Trooper", points: "50 Points", progress: "38%", color: "bg-red-500", spots: "3718 / 6000 spots left" },
    { stars: "★★", title: "Arcade Ranger", points: "75 Points", progress: "59%", color: "bg-blue-400", spots: "1622 / 4000 spots left" },
    { stars: "★★★", title: "Arcade Champion", points: "95 Points", progress: "74%", color: "bg-yellow-400", spots: "781 / 3000 spots left" },
    { stars: "★★★★", title: "Arcade Legend", points: "120 Points", progress: "44%", color: "bg-green-400", spots: "1397 / 2500 spots left" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-16">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 pt-28 space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <h1 className="text-3xl font-black text-[#202124]">Swag Drops</h1>
          </div>
          
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-50"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-500"></span>
              </span>
              <span>
                Synced • Last Checked:{" "}
                {lastUpdated ? `Today, ${lastUpdated}` : "Syncing..."}
              </span>
            </div>

            <a 
              href="https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#b06000] font-bold text-sm hover:underline transition-all"
            >
              How the 2026 Prize Tiers Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {arcadeCards.map((card, idx) => (
            <div key={idx} className="bg-[#2d2f34] rounded-xl p-5 flex flex-col items-center justify-between border border-gray-700 shadow-lg">
              <div className="text-[#facc15] text-lg mb-1">{card.stars}</div>
              <h3 className="text-[#facc15] font-black text-sm tracking-wide text-center uppercase font-mono">
                {card.title}
              </h3>
              
              <div className="w-full border-b-[3px] border-dashed border-[#facc15] opacity-80 my-4"></div>
              
              <div className={`text-6xl mb-4 ${card.title === 'Arcade Legend' ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' : ''}`}>
                🕹️
              </div>
              
              <div className="text-[#facc15] font-bold font-mono text-lg mb-4">
                {card.points}
              </div>
              
              <div className="w-full bg-[#404349] rounded-full h-4 mb-3 relative overflow-hidden flex items-center justify-center">
                <div 
                  className={`absolute left-0 top-0 h-full ${card.color} transition-all duration-1000`}
                  style={{ width: card.progress }}
                ></div>
                <span className="relative text-[10px] text-white font-bold z-10 font-mono">
                  {card.progress}
                </span>
              </div>
              
              <div className="text-gray-300 text-xs font-medium text-center">
                {card.spots}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-5 py-2 rounded-full text-[15px] font-bold transition-all duration-300 outline-none
                ${activeTier === tier 
                  ? "bg-[#1a73e8] text-white shadow-md scale-105" 
                  : "bg-white text-[#5f6368] border border-[#dadce0] hover:bg-gray-50"
                }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="text-center text-[#5f6368] font-medium text-sm flex items-center justify-center gap-1.5">
          Showing 
          <strong className="text-black flex items-center justify-center min-w-[20px]">
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              filteredSwags.length
            )}
          </strong> 
          swag item(s)
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-16">
             <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            
            {filteredSwags.map((swag) => (
              <div key={swag.id} className="bg-white rounded-2xl border border-[#dadce0] shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                
                {/* 
                  UPDATED IMAGE CONTAINER 
                  Fixed height to 300px (matches right box), added padding, and used object-contain 
                */}
                <div className={`w-full h-[300px] p-6 ${swag.bgColor || 'bg-[#fceda6]'} flex justify-center items-center relative`}>
                  <img 
                    src={swag.image} 
                    alt={swag.title} 
                    className="w-full h-full object-contain rounded-xl hover:scale-[1.02] transition-transform duration-500" 
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[#80868b] text-[13px] font-semibold mb-2">
                    Revealed on {swag.date}
                  </span>
                  <h3 className="text-[18px] font-bold text-[#202124] leading-snug mb-4">
                    {swag.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {swag.tags && swag.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className={`text-[12px] font-bold px-3 py-1 rounded-md
                          ${tag === 'Champion' ? 'bg-purple-100 text-purple-700' : ''}
                          ${tag === 'Legend' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${tag !== 'Champion' && tag !== 'Legend' ? 'bg-blue-50 text-blue-600' : ''}
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-2">
                    <a 
                      href={swag.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full block text-center bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Swag Drop ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden flex flex-col">
              <div className="w-full h-[300px] bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex flex-col justify-center items-center text-white p-6 relative">
                <span className="text-6xl font-thin mb-2 opacity-80">+</span>
                <h4 className="font-bold text-lg">More Swags</h4>
                <p className="text-sm font-medium opacity-90">Dropping Soon</p>
              </div>
              <div className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                <span className="text-[#80868b] text-[13px] font-semibold mb-2 w-full text-left">
                  Stay tuned!
                </span>
                <h3 className="text-[18px] font-bold text-[#202124] leading-snug mb-6 w-full text-left">
                  Exciting Prizes Ahead!
                </h3>
                
                <div className="flex flex-wrap gap-2 w-full mb-6">
                  <span className="text-[12px] font-bold px-3 py-1 rounded-md bg-blue-50 text-blue-600">
                    All Tiers
                  </span>
                </div>

                <div className="mt-auto pt-2 w-full">
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-[#f1f3f4] text-[#9aa0a6] font-bold py-3 rounded-xl cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}