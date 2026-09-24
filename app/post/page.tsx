"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function SwagDropsPage() {
  const [activeTier, setActiveTier] = useState("All Tiers");
  const [swags, setSwags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const tiers = ["All Tiers", "Trooper", "Ranger", "Champion", "Legend"];

  useEffect(() => {
    const fetchSwags = async () => {
      try {
        const q = query(collection(db, "swag_drops"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetchedSwags = querySnapshot.docs.map(doc => ({
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
      } catch (error) {
        console.error("Firebase fetch error:", error);
        setLoading(false);
      }
    };

    fetchSwags();
  }, []);

  // 🔥 REMOVED THE MANUAL HACK: Ab filter seedha Firebase ke asli tags par chalega
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes autoOpenLid {
          0%, 15%, 85%, 100% { transform: translateY(0) rotate(0) translateX(0); }
          35%, 65% { transform: translateY(-64px) rotate(-18deg) translateX(-24px); }
        }
        @keyframes autoGlow {
          0%, 25%, 75%, 100% { opacity: 0; }
          45%, 55% { opacity: 1; }
        }
        @keyframes autoSparkleMid {
          0%, 30%, 70%, 100% { opacity: 0; transform: translateY(0); }
          40%, 60% { opacity: 1; transform: translateY(-50px); }
        }
        @keyframes autoSparkleLeft {
          0%, 35%, 65%, 100% { opacity: 0; transform: translate(0, 0); }
          45%, 55% { opacity: 1; transform: translate(-30px, -40px); }
        }
        @keyframes autoSparkleRight {
          0%, 40%, 60%, 100% { opacity: 0; transform: translate(0, 0); }
          48%, 52% { opacity: 1; transform: translate(30px, -35px); }
        }
        .animate-auto-lid { animation: autoOpenLid 4s infinite ease-in-out; }
        .animate-auto-glow { animation: autoGlow 4s infinite ease-in-out; }
        .animate-auto-sparkle-m { animation: autoSparkleMid 4s infinite ease-in-out; }
        .animate-auto-sparkle-l { animation: autoSparkleLeft 4s infinite ease-in-out; }
        .animate-auto-sparkle-r { animation: autoSparkleRight 4s infinite ease-in-out; }
      `}} />

      <main className="max-w-[1200px] mx-auto px-4 pt-28 space-y-10">
        
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
            <div key={idx} className="bg-[#2d2f34] rounded-xl p-5 flex flex-col items-center justify-between border border-gray-700 shadow-lg hover:border-gray-500 transition-colors">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            
            {filteredSwags.map((swag) => {
              const isNew = swag.createdAt && (Date.now() - swag.createdAt < 24 * 60 * 60 * 1000);
              
              return (
                <div key={swag.id} className="bg-white rounded-2xl border border-[#dadce0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative">
                  
                  {isNew && (
                    <div className="absolute top-4 left-4 z-10 bg-[#ea4335] text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full shadow-md animate-bounce">
                      NEW
                    </div>
                  )}

                  <div className={`w-full h-[300px] p-2 ${swag.bgColor || 'bg-[#fceda6]'} flex justify-center items-center relative group`}>
                    <img 
                      src={swag.image} 
                      alt={swag.title} 
                      className="w-full h-full object-contain rounded-xl group-hover:scale-[1.05] transition-transform duration-500" 
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
                      {/* 🔥 REMOVED THE MANUAL HACK: Ab direct swag.tags se data aayega 🔥 */}
                      {(swag.tags || []).map((tag: string) => (
                        <span 
                          key={tag} 
                          className={`text-[12px] font-bold px-3 py-1 rounded-md
                            ${tag === 'Champion' ? 'bg-purple-100 text-purple-700' : ''}
                            ${tag === 'Legend' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${tag === 'Ranger' ? 'bg-blue-100 text-blue-700' : ''}
                            ${tag !== 'Champion' && tag !== 'Legend' && tag !== 'Ranger' ? 'bg-blue-50 text-blue-600' : ''}
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
              );
            })}

            {/* 🔥 AUTO-ANIMATED 3D "COMING SOON" BOX 🔥 */}
            <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
              <div className="w-full h-[300px] bg-slate-900 flex flex-col justify-center items-center text-white p-6 relative overflow-hidden">
                
                <div className="absolute inset-0 flex justify-center items-center opacity-40">
                  <div className="w-64 h-64 bg-fuchsia-600 rounded-full blur-[80px]"></div>
                </div>
                
                <div className="relative w-32 h-32 mt-6 z-10">
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-yellow-300 rounded-full blur-xl opacity-0 animate-auto-glow z-10"></div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 animate-auto-sparkle-m z-10 text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✨</div>
                  <div className="absolute top-14 left-4 opacity-0 animate-auto-sparkle-l z-10 text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">🌟</div>
                  <div className="absolute top-14 right-4 opacity-0 animate-auto-sparkle-r z-10 text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">🎉</div>
                  <div className="absolute bottom-0 left-2 w-28 h-20 bg-[#1e1b4b] rounded-b-lg border-t-[12px] border-[#312e81] z-0"></div>

                  <div className="absolute bottom-0 left-2 w-28 h-20 bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] rounded-b-lg z-20 shadow-[0_10px_15px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-lg"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-5 bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg"></div>
                  </div>

                  <div className="absolute bottom-16 left-0 w-32 h-9 bg-gradient-to-tr from-[#8b5cf6] to-[#d946ef] rounded-md z-30 shadow-[0_15px_25px_rgba(0,0,0,0.6)] border-b-4 border-[#7e22ce] animate-auto-lid">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-full bg-gradient-to-b from-pink-300 to-pink-500 shadow-md"></div>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex justify-center items-end">
                      <div className="w-7 h-7 bg-transparent border-[5px] border-pink-400 rounded-full -mr-1.5 shadow-sm transform -rotate-12"></div>
                      <div className="w-7 h-7 bg-transparent border-[5px] border-pink-400 rounded-full -ml-1.5 shadow-sm transform rotate-12"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow items-center justify-center text-center bg-white border-t border-gray-100">
                <span className="text-[#80868b] text-[13px] font-semibold mb-2 w-full text-left">
                  Stay tuned!
                </span>
                <h3 className="text-[18px] font-bold text-[#202124] leading-snug mb-6 w-full text-left">
                  More Exciting Prizes Ahead!
                </h3>
                
                <div className="flex flex-wrap gap-2 w-full mb-6">
                  <span className="text-[12px] font-bold px-3 py-1 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300 shadow-sm">
                    Mystery Tier 🔒
                  </span>
                </div>

                <div className="mt-auto pt-2 w-full">
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed border border-slate-200 transition-all hover:bg-slate-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Dropping Soon
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