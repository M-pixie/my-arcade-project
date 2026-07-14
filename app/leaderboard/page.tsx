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
  
  const currentUserRef = useRef<HTMLTableRowElement>(null as any);
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

  // 🔥 AUTO-SCROLL LOGIC 🔥
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
  
  const searchResults = leaders.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserData = leaders.find((l) => isExactCurrentUser(l));
  const currentUserRank = currentUserData?.rank;

  // Render list: either search results or the full leaders list
  const displayList = isSearching ? searchResults : leaders;

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pt-16 pb-12 relative overflow-hidden">
        
        <style>{`
          /* 🔥 CLEAR & PROMINENT BLINK ANIMATION 🔥 */
          @keyframes blink-bg {
            0%, 100% { background-color: #ceead6; }
            50% { background-color: #a8dabb; }
          }
          .animate-blink-user { 
            animation: blink-bg 1.2s ease-in-out infinite; 
          }

          /* Custom Scrollbar for Mobile Horizontal Scroll */
          .custom-scrollbar::-webkit-scrollbar { height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #dadce0; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9aa0a6; }
        `}</style>

        <Navbar />

        {/* 🔥 LAYOUT WIDER: max-w-[1350px] ADDED 🔥 */}
        <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 relative z-10">
          
          {/* ================= 🔥 FULL PAGE ADMIN STYLE TABLE (ALL RANKS INCLUDED) 🔥 ================= */}
          <div className="w-full flex flex-col gap-2 mt-4">
            
            {/* 🔥 HEADING CENTERED 🔥 */}
            <h2 className="text-2xl font-extrabold text-[#202124] mb-5 flex items-center justify-center gap-2 w-full text-center">
              User Points Leaderboard
              {isSearching && <span className="text-lg font-medium text-[#5f6368]"> - Search Results</span>}
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-[#dadce0] w-full overflow-hidden">
              <div className="w-full overflow-x-auto custom-scrollbar">
                
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-[#0f9d58]">
                    
                    {/* 🔥 SEARCH & RANKS MERGED INSIDE THE GREEN HEADER 🔥 */}
                    <tr>
                      <th colSpan={3} className="px-6 py-5 border-b border-[#0b8043]">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                          
                          <div className="w-full sm:w-80 shrink-0 relative">
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
                                className="w-full bg-white border-0 text-slate-900 placeholder-slate-400 rounded-lg py-3 pl-11 pr-10 focus:outline-none focus:ring-2 focus:ring-white transition-all text-[14px] font-bold shadow-sm"
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

                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="w-full sm:w-auto px-5 py-3 bg-[#0b8043] rounded-lg flex items-center justify-center gap-2 shadow-sm">
                              <span className="text-[13px] font-bold text-green-100">Total Members:</span>
                              <span className="text-[15px] font-black text-white">{leaders.length}</span>
                            </div>
                            
                            <button 
                              onClick={() => {
                                if (currentUserRef.current) {
                                  currentUserRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }}
                              className="w-full sm:w-auto px-5 py-3 bg-white text-[#0f9d58] hover:bg-green-50 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <span className="text-[13px] font-bold">Your Rank:</span>
                              <span className="text-[15px] font-black">{currentUserRank ? currentUserRank : "--"}</span>
                            </button>
                          </div>
                        </div>
                      </th>
                    </tr>

                    {/* 🔥 COLUMN HEADERS 🔥 */}
                    <tr>
                      <th className="px-6 py-4 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043] border-b border-[#0b8043] w-24 text-center">Rank</th>
                      <th className="px-6 py-4 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043] border-b border-[#0b8043]">User Name</th>
                      <th className="px-6 py-4 text-[15px] font-black text-white uppercase tracking-wider text-center border-b border-[#0b8043] w-36">Points</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#e8eaed]">
                    {displayList.length > 0 ? (
                      displayList.map((user) => (
                        <LeaderTableRow 
                          key={user.id} 
                          user={user} 
                          isCurrentUser={isExactCurrentUser(user)} 
                          innerRef={isExactCurrentUser(user) ? currentUserRef : null} 
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-16 text-center bg-white">
                          {isSearching ? (
                            <>
                              <div className="text-5xl mb-4 opacity-50">🔍</div>
                              <p className="text-[#5f6368] text-[15px] font-bold">No player found with that name.</p>
                            </>
                          ) : (
                            <p className="text-[#5f6368] text-[15px] font-bold">Waiting for players to join the battle... ⚔️</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          </div>

          <div className="text-center pt-8 pb-4">
            <p className="text-xs font-bold text-[#9aa0a6] uppercase flex items-center justify-center gap-2 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></span>
              Leaderboard updates in real-time
            </p>
          </div>

        </main>
      </div>
    </>
  );
}

// 🔥 ROW COMPONENT FOR ADMIN STYLE TABLE WITH DARK COLORS FOR TOP 3 🔥
function LeaderTableRow({ user, isCurrentUser = false, innerRef = null }: { user: Leader; isCurrentUser?: boolean; innerRef?: any }) {
  
  let rowBg = "bg-white hover:bg-[#f8f9fa]";
  let textColor = "text-[#202124]";
  let rankColor = "text-[#5f6368]";
  let borderClass = "border-[#e8eaed]";

  // 🔥 CUSTOM STYLES FOR TOP 3 RANKS 🔥
  if (user.rank === 1) {
    rowBg = "bg-[#4a148c] hover:bg-[#6a1b9a]"; // Dark Purple
    textColor = "text-white";
    rankColor = "text-white";
    borderClass = "border-[#380b6b]";
  } else if (user.rank === 2) {
    rowBg = "bg-[#4e342e] hover:bg-[#5d4037]"; // Dark Brown
    textColor = "text-white";
    rankColor = "text-white";
    borderClass = "border-[#3e2723]";
  } else if (user.rank === 3) {
    rowBg = "bg-[#d89b00] hover:bg-[#f5b300]"; // Dark Yellow/Gold
    textColor = "text-white";
    rankColor = "text-white";
    borderClass = "border-[#b07d00]";
  } else if (isCurrentUser) {
    rowBg = "animate-blink-user";
    textColor = "text-[#0f9d58]";
    rankColor = "text-[#0f9d58]";
  }

  return (
    <tr 
      ref={innerRef}
      className={`transition-colors duration-300 ${rowBg}`}
    >
      <td className={`px-6 py-4 text-[16px] font-black text-center border-r ${borderClass} ${rankColor}`}>
        {user.rank}
        {user.rank <= 3 && (
          <div className="text-[10px] uppercase font-bold mt-1 opacity-80">
            {user.rank === 1 ? '🥇 1st' : user.rank === 2 ? '🥈 2nd' : '🥉 3rd'}
          </div>
        )}
      </td>
      
      <td className={`px-6 py-4 border-r ${borderClass}`}>
        <div className="flex items-center gap-4">
          <img 
            src={user.photoURL || "/avatar.png"} 
            alt={user.name} 
            className={`w-10 h-10 rounded-full object-cover shrink-0 shadow-sm border border-white/20 ${isCurrentUser && user.rank > 3 ? "border-2 border-[#0f9d58]" : ""}`} 
          />
          <span className={`text-[15px] font-bold truncate max-w-[150px] sm:max-w-[300px] ${textColor}`}>
            {user.name || "Anonymous"}
          </span>
          {isCurrentUser && (
            <span className={`ml-2 px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider shadow-sm ${user.rank <= 3 ? "bg-white text-black" : "bg-[#0f9d58] text-white"}`}>
              You
            </span>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 text-center">
        <span className={`text-[17px] font-black ${textColor}`}>
          {user.points?.toLocaleString() ?? 0}
        </span>
      </td>
    </tr>
  );
}