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
  profileUrl?: string; 
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserUniqueId, setCurrentUserUniqueId] = useState<string | null>(null);
  
  const currentUserRef = useRef<HTMLDivElement>(null);
  const [showUserPlaceholder, setShowUserPlaceholder] = useState(false);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaders(data);
    });

    try {
      const savedData = localStorage.getItem("arcade_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed) {
          if (parsed.userName) setCurrentUserName(parsed.userName);
          if (parsed.userUniqueId) setCurrentUserUniqueId(parsed.userUniqueId);
        }
      }
    } catch (e) {
      console.error("Error reading user data", e);
    }

    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentUserRef.current && leaders.length > 0) {
      setTimeout(() => {
        currentUserRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    }
  }, [leaders, currentUserName, currentUserUniqueId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowUserPlaceholder((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isExactCurrentUser = (user: Leader) => {
    if (!currentUserName) return false;
    if (currentUserUniqueId && user.profileUrl) {
      return user.profileUrl.includes(currentUserUniqueId);
    }
    return user.name === currentUserName;
  };

  const isSearching = searchTerm.trim().length > 0;
  
  const topThree = leaders.slice(0, 3);
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean); 
  const restLeaders = leaders.slice(3);

  const searchResults = leaders.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserData = leaders.find((l) => isExactCurrentUser(l));
  const currentUserRank = currentUserData?.rank;

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pt-16 pb-12 relative overflow-hidden">
        
        <style>{`
          /* 🔥 ANIMATION FIXED: Avatar movement reduced to just 2px for very subtle float 🔥 */
          @keyframes float-avatar {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
          .animate-avatar { animation: float-avatar 3s ease-in-out infinite; }
        `}</style>

        <Navbar />

        <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
          
          {!isSearching && (
            <>
              {/* ================= 🔥 CLEAN PODIUM (TOP 3) 🔥 ================= */}
              <div className="flex flex-row justify-center items-end gap-4 sm:gap-8 md:gap-16 pt-2 pb-8 relative">
                {podiumOrder.map((user) => {
                  if (!user) return null;
                  const isFirst = user.rank === 1;
                  const isSecond = user.rank === 2;
                  const isExactUser = isExactCurrentUser(user);

                  return (
                    <div 
                      key={user.id} 
                      ref={isExactUser ? currentUserRef : null} 
                      /* 🔥 FADING PULSE REMOVED, ADDED CLEAR STYLES 🔥 */
                      className={`relative flex flex-col items-center group transition-transform ${isFirst ? 'z-20 -translate-y-6' : 'z-10 -translate-y-2'} ${isExactUser ? "bg-[#4E342E]/5 border border-[#4E342E]/30 rounded-xl p-3 shadow-sm scale-[1.02]" : "p-3"}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl md:text-3xl font-bold leading-none mb-1 ${isFirst ? "text-yellow-500" : isSecond ? "text-slate-400" : "text-orange-400"}`}>
                          {user.rank}
                        </span>
                        
                        <img
                          src={user.photoURL || "/avatar.png"}
                          alt={user.name}
                          className={`rounded-full object-cover bg-slate-100 shadow-md border-2 border-white
                            ${isFirst ? "w-20 h-20 md:w-28 md:h-28" : "w-16 h-16 md:w-20 md:h-20"}
                            ${isExactUser ? "animate-avatar" : ""}
                          `}
                        />
                      </div>

                      <div className="flex flex-col items-center text-center mt-2">
                        <h3 className="text-sm md:text-base font-semibold text-slate-800 max-w-[120px] md:max-w-[160px] truncate">
                          {user.name || "Anonymous"}
                        </h3>
                        <p className="text-sm md:text-base font-bold text-black leading-tight">
                          {user.points?.toLocaleString() ?? 0} pts
                        </p>
                        
                        {/* 🔥 DARK BROWN (YOU) 🔥 */}
                        {isExactUser && (
                          <div className="mt-1.5">
                            <span className="bg-[#4E342E] text-white px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider shadow-sm">
                              You
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ================= 🔥 SEARCH & RANK ACTION BAR 🔥 ================= */}
          <div className="mt-2 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="w-full sm:w-80 shrink-0 relative z-20">
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400 group-focus-within:text-[#5f6368] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={
                    showUserPlaceholder && currentUserName 
                      ? `${currentUserName.split(" ")[0]} You` 
                      : "Search player name..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg py-3.5 pl-12 pr-12 focus:outline-none focus:border-[#5f6368] focus:ring-1 focus:ring-[#5f6368] transition-all text-sm font-medium shadow-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Your Rank Button */}
            <button 
              onClick={() => {
                if (currentUserRef.current) {
                  currentUserRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#dadce0] hover:border-[#1a73e8] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all group cursor-pointer"
            >
              <span className="text-[14px] font-bold text-[#5f6368] group-hover:text-[#202124] transition-colors">Your Rank :</span>
              <span className="text-[16px] font-black text-[#1a73e8]">{currentUserRank ? currentUserRank : "--"}</span>
            </button>
          </div>

          {!isSearching ? (
            <>
              {/* ================= THE LIST (RANK 4+) ================= */}
              <div className="space-y-2">
                {restLeaders.map((user) => (
                  <LeaderRow 
                    key={user.id} 
                    user={user} 
                    isCurrentUser={isExactCurrentUser(user)} 
                    innerRef={isExactCurrentUser(user) ? currentUserRef : null} 
                  />
                ))}
                {restLeaders.length === 0 && (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-slate-500 text-lg font-medium">Waiting for more players to join the battle... ⚔️</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ================= SEARCH RESULTS SECTION ================= */
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 px-4 border-l-4 border-[#4E342E] py-1 inline-block">
                Search Results for "{searchTerm}"
              </h2>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <LeaderRow 
                    key={user.id} 
                    user={user} 
                    highlight={true} 
                    isCurrentUser={isExactCurrentUser(user)} 
                  />
                ))
              ) : (
                <div className="p-16 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="text-5xl mb-4 opacity-50">🔍</div>
                  <p className="text-slate-500 text-lg font-medium">No player found with that name.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center pt-12 pb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
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
      /* 🔥 PULSE REMOVED, HIGHLIGHT & SCALE RETAINED 🔥 */
      className={`group flex items-center justify-between px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
        ${isCurrentUser 
          ? "bg-[#4E342E] shadow-lg scale-[1.02] z-10" 
          : highlight 
            ? "bg-slate-100 border border-slate-300 scale-[1.01]" 
            : "bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"}
      `}
    >

      <div className="flex items-center gap-3 sm:gap-5 pl-1">
        <div className="w-8 sm:w-10 text-center">
          <span className={`text-base sm:text-lg font-semibold ${isCurrentUser ? "text-white" : highlight ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>
            {user.rank}
          </span>
        </div>
        <img
          src={user.photoURL || "/avatar.png"}
          alt={user.name}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover transition-colors 
            ${isCurrentUser ? "animate-avatar shadow-sm border border-white/20" : highlight ? "border border-slate-400" : "border border-slate-200"}
          `}
        />
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-base font-medium truncate max-w-[100px] sm:max-w-[200px] md:max-w-[350px] ${isCurrentUser ? "text-white" : "text-slate-800"}`}>
            {user.name || "Anonymous"}
          </span>
          {isCurrentUser && (
            <span className="bg-white text-[#4E342E] px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
              You
            </span>
          )}
        </div>
      </div>

      <div className="text-right flex items-center gap-3">
        <div>
          <span className={`text-base sm:text-lg font-semibold ${isCurrentUser ? "text-white" : "text-black"}`}>
            {user.points?.toLocaleString() ?? 0}
          </span>
          <span className={`text-[10px] sm:text-xs ml-1 font-medium ${isCurrentUser ? "text-[#D7CCC8]" : "text-slate-500"}`}>pts</span>
        </div>
      </div>
    </div>
  );
}