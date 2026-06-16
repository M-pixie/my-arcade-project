"use client";

import { useEffect, useState, useRef } from "react"; 
import Navbar from "@/app/components/Navbar";
import { subscribeLeaderboard } from "@/lib/leaderboard";

type Leader = {
  id: string;
  rank: number;
  name?: string;
  photoURL?: string;
  points?: number;
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🔥 NEW STATE FOR CURRENT USER HIGHLIGHT
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const currentUserRef = useRef<HTMLDivElement>(null);

  // 🔥 NEW STATE FOR AVATAR ROTATION INDEX
  const [avatarStartIndex, setAvatarStartIndex] = useState(0);

  // 🔥 NEW STATE FOR PLACEHOLDER TOGGLE
  const [showUserPlaceholder, setShowUserPlaceholder] = useState(false);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaders(data);
    });

    // 🔥 LOCALSTORAGE SE CURRENT USER FETCH KAR RAHE HAIN
    try {
      const savedData = localStorage.getItem("arcade_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.userName) {
          setCurrentUserName(parsed.userName);
        }
      }
    } catch (e) {
      console.error("Error reading user data", e);
    }

    return () => unsub();
  }, []);

  // 🔥 AUTO SCROLL EFFECT LOGIC
  useEffect(() => {
    if (currentUserRef.current && leaders.length > 0) {
      setTimeout(() => {
        currentUserRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600); // 600ms delay taaki page pehle pura render ho jaye
    }
  }, [leaders, currentUserName]);

  // 🔥 ALL PLAYERS ROTATION LOGIC (SEQUENTIAL CYCLING)
  useEffect(() => {
    if (leaders.length === 0) return;

    // Har 3.5 seconds me array aage badhega, taaki har player dikhe
    const interval = setInterval(() => {
      setAvatarStartIndex((prev) => (prev + 3) % leaders.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [leaders.length]);

  // 🔥 PLACEHOLDER TOGGLE LOGIC (EVERY 5 SECONDS)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowUserPlaceholder((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= LOGIC: SORT & SEARCH =================
  const isSearching = searchTerm.trim().length > 0;
  
  const topThree = leaders.slice(0, 3);
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean); 
  const restLeaders = leaders.slice(3);

  const searchResults = leaders.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔥 Get current user rank for header display 🔥
  const currentUserRank = leaders.find((l) => l.name === currentUserName)?.rank;

  // 🔥 GET 10 AVATARS FOR DISPLAY 🔥
  let displayAvatars: string[] = [];
  if (leaders.length > 0) {
    const allUrls = leaders.map(l => l.photoURL || "/avatar.png");
    for (let i = 0; i < 10; i++) {
      displayAvatars.push(allUrls[(avatarStartIndex + i) % allUrls.length]);
    }
    // Duplicate URLs hata dete hain agar list choti hui to
    displayAvatars = Array.from(new Set(displayAvatars)).slice(0, 10);
  }

  return (
    <>
      {/* 🌌 PREMIUM NAVY BLUE BACKGROUND 🌌 */}
      <div className="min-h-screen bg-gradient-to-b from-[#050b14] via-[#0a1229] to-[#050b14] text-white font-sans pt-16 pb-12 relative overflow-hidden">
        
        {/* Custom Animations for Ribbons, Cup & Avatars */}
        <style>{`
          @keyframes float-ribbon-1 {
            0%, 100% { transform: translate(0, 0) rotate(-15deg) scale(1); opacity: 0.85; }
            50% { transform: translate(-10px, -15px) rotate(-5deg) scale(1.05); opacity: 1; }
          }
          @keyframes float-ribbon-2 {
            0%, 100% { transform: translate(0, 0) rotate(15deg) scale(1); opacity: 0.85; }
            50% { transform: translate(15px, -15px) rotate(20deg) scale(1.05); opacity: 1; }
          }
          @keyframes float-cup {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-8px) scale(1.02); }
          }
          @keyframes float-avatar {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes podium-bg-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-ribbon-1 { animation: float-ribbon-1 4s ease-in-out infinite; }
          .animate-ribbon-2 { animation: float-ribbon-2 5s ease-in-out infinite; }
          .animate-cup { animation: float-cup 4s ease-in-out infinite; }
          .animate-avatar { animation: float-avatar 3s ease-in-out infinite; }
          .animate-podium-bg {
            background: linear-gradient(270deg, rgba(78,52,46,0.6), rgba(26,115,232,0.6), rgba(255,74,125,0.6), rgba(76,175,80,0.6), rgba(142,36,170,0.6), rgba(78,52,46,0.6));
            background-size: 300% 300%;
            animation: podium-bg-shift 6s ease infinite;
          }
        `}</style>

        {/* Ambient Glowing Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <Navbar />

        {/* ================= HEADER SECTION (FLEX LAYOUT) ================= */}
        {/* 🔥 CHANGED: max-w-[75rem] and px-4 md:px-6 to make it slightly longer left and right 🔥 */}
        <header className="pt-12 pb-6 px-4 md:px-6 relative z-20 max-w-[75rem] mx-auto">
          {/* 🔥 CHANGED: Increased horizontal padding inside the box (md:px-10) for wider look 🔥 */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-[#121c38]/40 border border-white/5 p-6 md:py-8 md:px-10 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden lg:overflow-visible">
            
            {displayAvatars.length > 0 && (
              <div className="absolute top-1.5 right-3 flex -space-x-3 z-30">
                {displayAvatars.map((url, idx) => (
                  <img 
                    key={`${url}-${idx}`}
                    src={url}
                    alt="player avatar"
                    className="w-8 h-8 rounded-full object-cover relative transition-transform hover:scale-110" 
                    style={{ border: "none", zIndex: 10 - idx }} 
                  />
                ))}
              </div>
            )}

            {/* Left Side: Animated Cup + Title */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto relative z-10">
              
              {/* 🏆 REALISTIC ANIMATED CUP WITH FLYING RIBBONS 🏆 */}
              <div className="relative inline-flex items-center justify-center w-32 h-32 md:w-36 md:h-36 shrink-0">
                
                <div className="absolute inset-[-20px] bg-blue-500/20 blur-[25px] rounded-full pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/40 via-yellow-400/20 to-transparent blur-2xl rounded-full animate-pulse"></div>

                {/* Flying Ribbon 1 (Red/Gold) */}
                <svg className="absolute w-20 h-20 -left-6 top-2 animate-ribbon-1 z-20 pointer-events-none filter drop-shadow-[0_5px_10px_rgba(239,68,68,0.5)]" viewBox="0 0 100 100" fill="none">
                  <path d="M 10 90 C 20 40, 80 80, 90 10" stroke="url(#redGrad)" strokeWidth="12" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Flying Ribbon 2 (Blue/Gold) */}
                <svg className="absolute w-16 h-16 -right-4 bottom-6 animate-ribbon-2 z-0 pointer-events-none filter drop-shadow-[0_5px_10px_rgba(59,130,246,0.5)]" viewBox="0 0 100 100" fill="none">
                  <path d="M 10 90 C 30 10, 80 60, 90 20" stroke="url(#blueGrad)" strokeWidth="10" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="text-[80px] md:text-[90px] animate-cup relative z-10 filter drop-shadow-[0_10px_20px_rgba(250,204,21,0.4)] contrast-125 saturate-150">
                  🏆
                </div>
                
                <div className="absolute top-0 right-2 text-yellow-300 animate-ping text-lg z-20">✨</div>
                <div className="absolute bottom-4 left-2 text-yellow-200 animate-[ping_3s_infinite] text-xl z-20">✨</div>
              </div>

              {/* Title Content */}
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 drop-shadow-sm mb-2 relative z-10">
                  Your Rank {currentUserRank ? currentUserRank : "--"}
                </h1>
                <p className="text-blue-200/70 text-sm md:text-base max-w-sm font-medium relative z-10">
                  See who is leading the charts and dominating the Arcade.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0 relative z-20 mt-6 lg:mt-0">
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400 group-focus-within:text-white transition-colors drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={
                    showUserPlaceholder && currentUserName 
                      ? `${currentUserName.split(" ")[0]} (You)` 
                      : "Search player name..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#151f32]/90 border border-[#2a3855] text-white placeholder-slate-400/70 rounded-lg py-3.5 pl-12 pr-12 focus:outline-none focus:border-blue-500/70 focus:bg-[#1a253c] focus:ring-1 focus:ring-blue-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] text-sm font-medium tracking-wide"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded-full p-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>

          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
          
          {!isSearching ? (
            <>
              {/* ================= 🔥 THE REAL PODIUM (TOP 3) 🔥 ================= */}
              <div className="flex flex-row justify-center items-end gap-2 sm:gap-4 md:gap-8 pt-8 mt-4 relative">
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-blue-500/20 blur-2xl rounded-full pointer-events-none"></div>

                {podiumOrder.map((user) => {
                  if (!user) return null;
                  const isFirst = user.rank === 1;
                  const isSecond = user.rank === 2;
                  const isThird = user.rank === 3;
                  const isCurrentUser = user.name === currentUserName; 

                  let heightClass = "";
                  if (isFirst) heightClass = "h-[240px] sm:h-[280px] md:h-[340px]";
                  else if (isSecond) heightClass = "h-[200px] sm:h-[230px] md:h-[280px]";
                  else heightClass = "h-[170px] sm:h-[200px] md:h-[240px]";

                  return (
                    <div 
                      key={user.id} 
                      ref={isCurrentUser ? currentUserRef : null} 
                      className={`relative flex flex-col items-center w-28 sm:w-36 md:w-56 group ${isFirst ? 'z-20' : 'z-10'}`}
                    >
                      {isCurrentUser && (
                        <div className="absolute -top-16 md:-top-20 bg-blue-500 border border-blue-300 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full animate-bounce shadow-[0_0_15px_rgba(59,130,246,0.8)] z-50 tracking-wider">
                          YOU
                        </div>
                      )}
                      
                      <div className="relative mb-[-30px] md:mb-[-40px] z-30 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2">
                        
                        {(isFirst || isSecond || isThird) && (
                          <div className={`absolute z-40 animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]
                            ${isFirst ? "-top-10 md:-top-[75px] text-5xl md:text-6xl" : "-top-10 md:-top-[60px] text-4xl md:text-5xl"}
                          `}>
                            👑
                          </div>
                        )}
                        
                        <img
                          src={user.photoURL || "/avatar.png"}
                          alt={user.name}
                          className={`rounded-full object-cover bg-[#0a1229] animate-avatar
                            ${isFirst ? "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shadow-[0_0_25px_rgba(250,204,21,0.6)]" : ""}
                            ${isSecond ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shadow-[0_0_15px_rgba(203,213,225,0.4)]" : ""}
                            ${isThird ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shadow-[0_0_15px_rgba(249,115,22,0.4)]" : ""}
                            ${isCurrentUser ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-[#0a1229]" : ""} 
                          `}
                        />
                      </div>

                      <div className={`w-full rounded-t-2xl border-t-2 border-x-2 border-white/20 flex flex-col items-center pb-4 md:pb-8 px-2 text-center transition-all duration-300 overflow-hidden relative animate-podium-bg shadow-[0_-10px_30px_rgba(0,0,0,0.3)]
                        ${heightClass} 
                        ${isCurrentUser ? "before:absolute before:inset-0 before:bg-blue-500/10 before:animate-pulse" : ""}
                      `}>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                        
                        <div className="flex-1 flex items-center justify-center w-full relative z-10 mt-6 md:mt-8">
                          <div className={`text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-md
                            ${isFirst ? "text-yellow-400" : ""}
                            ${isSecond ? "text-slate-200" : ""}
                            ${isThird ? "text-orange-400" : ""}
                          `}>
                            {user.rank}
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-end relative z-10 w-full">
                          <h3 className="text-xs sm:text-sm md:text-lg font-bold text-white truncate w-full drop-shadow-md mb-1 px-1">
                            {user.name || "Anonymous"}
                          </h3>
                          
                          <p className={`text-base sm:text-xl md:text-3xl font-black drop-shadow-[0_0_10px_currentColor]
                            ${isFirst ? "text-yellow-400" : ""}
                            ${isSecond ? "text-slate-200" : ""}
                            ${isThird ? "text-orange-400" : ""}
                          `}>
                            {user.points?.toLocaleString() ?? 0} 
                            <span className="block md:inline-block text-[9px] sm:text-[10px] md:text-sm text-white/70 ml-0 md:ml-1 mt-1 md:mt-0 font-bold uppercase tracking-widest">pts</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= THE LIST (RANK 4+) ================= */}
              <div className="mt-16 space-y-3">
                {restLeaders.map((user) => (
                  <LeaderRow 
                    key={user.id} 
                    user={user} 
                    isCurrentUser={user.name === currentUserName} 
                    innerRef={user.name === currentUserName ? currentUserRef : null} 
                  />
                ))}
                {restLeaders.length === 0 && (
                  <div className="p-12 text-center bg-[#121c38]/60 border border-white/5 rounded-xl backdrop-blur-sm">
                    <p className="text-blue-200/50 text-lg font-medium">Waiting for more players to join the battle... ⚔️</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ================= SEARCH RESULTS SECTION ================= */
            <div className="mt-4 space-y-3">
              <h2 className="text-xl font-bold text-blue-300 mb-6 px-4 border-l-4 border-blue-500 bg-blue-500/10 py-2 rounded-r-lg inline-block backdrop-blur-sm">
                Search Results for <span className="text-white">"{searchTerm}"</span>
              </h2>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <LeaderRow 
                    key={user.id} 
                    user={user} 
                    highlight={true} 
                    isCurrentUser={user.name === currentUserName} 
                  />
                ))
              ) : (
                <div className="p-16 text-center bg-[#121c38]/60 border border-white/5 rounded-xl backdrop-blur-sm">
                  <div className="text-5xl mb-4 opacity-50 drop-shadow-lg">🔍</div>
                  <p className="text-blue-200/60 text-lg font-medium">No player found with that name.</p>
                </div>
              )}
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center pt-12 pb-4">
            <p className="text-xs font-bold text-blue-300/30 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
              Leaderboard updates in real-time
            </p>
          </div>

        </main>
      </div>
    </>
  );
}

// Reusable component for the list rows
function LeaderRow({ user, highlight = false, isCurrentUser = false, innerRef = null }: { user: Leader; highlight?: boolean; isCurrentUser?: boolean; innerRef?: any }) {
  return (
    <div
      ref={innerRef}
      className={`group flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border rounded-xl backdrop-blur-sm transition-all duration-300 relative overflow-hidden
        ${isCurrentUser 
          ? "bg-[#1d4ed8]/20 border-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-[pulse_2.5s_infinite] scale-[1.01] z-10" 
          : highlight 
            ? "bg-[#1a264a]/80 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.25)] scale-[1.01]" 
            : "bg-[#121c38]/60 border-white/5 hover:bg-[#1a264a] hover:border-blue-400/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"}
      `}
    >

      <div className="flex items-center gap-3 sm:gap-5 pl-1">
        <div className="w-8 sm:w-10 text-center">
          <span className={`text-lg sm:text-xl font-black transition-colors ${isCurrentUser ? "text-blue-300" : highlight ? "text-blue-400" : "text-white/30 group-hover:text-blue-400"}`}>
            {user.rank}
          </span>
        </div>
        <img
          src={user.photoURL || "/avatar.png"}
          alt={user.name}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border object-cover transition-colors animate-avatar 
            ${isCurrentUser ? "border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : highlight ? "border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-white/10 group-hover:border-blue-400"}
          `}
        />
        <span className={`text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-[250px] md:max-w-[400px] transition-colors ${isCurrentUser ? "text-white" : highlight ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
          {user.name || "Anonymous"}
        </span>
      </div>

      <div className="text-right flex items-center gap-3">
        {isCurrentUser && (
          <span className="hidden sm:inline-block bg-blue-500/20 border border-blue-400/50 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
            You
          </span>
        )}
        <div>
          <span className={`text-lg sm:text-xl font-bold transition-colors ${isCurrentUser ? "text-blue-300" : highlight ? "text-blue-400" : "text-blue-300 group-hover:text-blue-400"}`}>
            {user.points?.toLocaleString() ?? 0}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 ml-1 font-medium uppercase">pts</span>
        </div>
      </div>
    </div>
  );
}