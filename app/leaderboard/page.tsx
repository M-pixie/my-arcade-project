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
  
  const currentUserRef = useRef<HTMLTableRowElement | HTMLDivElement>(null as any);
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
  
  // Normal order top 3 (1, 2, 3) for the rectangular cards
  const topThree = leaders.slice(0, 3);
  // Rank 4 onwards for the table
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

        <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
          
          {/* ================= 🔥 TOP 3 RECTANGULAR CARDS 🔥 ================= */}
          {!isSearching && topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 mt-4">
              {topThree.map((user) => {
                const isExactUser = isExactCurrentUser(user);
                
                let themeColor = "";
                let rankLabel = "";
                
                if (user.rank === 1) {
                  themeColor = "#fbc02d"; // Gold
                  rankLabel = "1st";
                } else if (user.rank === 2) {
                  themeColor = "#9aa0a6"; // Silver
                  rankLabel = "2nd";
                } else if (user.rank === 3) {
                  themeColor = "#d87c3b"; // Bronze
                  rankLabel = "3rd";
                }

                return (
                  <div key={user.id} className="relative">
                    {/* 🔥 Curve reduced using rounded-md 🔥 */}
                    <button 
                      ref={isExactUser ? (currentUserRef as any) : null}
                      className={`relative w-full h-[72px] flex items-center gap-4 px-4 py-2 border border-[#dadce0] rounded-md overflow-hidden transition-all text-left outline-none ${isExactUser ? "animate-blink-user border-[#0f9d58] shadow-md scale-[1.02] z-10" : "bg-white shadow-sm hover:shadow-md hover:border-[#bdc1c6]"}`}
                    >
                      {/* 🔥 Corner Design Removed from here 🔥 */}

                      {/* 🎯 Avatar */}
                      <div className="w-12 h-12 rounded-full shrink-0 shadow-sm border border-[#f1f3f4] overflow-hidden relative z-10 bg-white">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-[18px]" style={{ backgroundColor: themeColor }}>
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* 🎯 Name & Points Pill */}
                      <div className="flex flex-col items-start gap-1 z-10 w-full overflow-hidden">
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-[15px] font-black text-[#202124] truncate tracking-tight">
                            {user.name || "Anonymous"}
                          </span>
                          {isExactUser && (
                            <span className="bg-[#0f9d58] text-white px-2 py-[2px] rounded text-[9px] font-black uppercase tracking-wider shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center w-full mt-0.5">
                          {/* Colored Points Pill */}
                          <div className="px-2 py-[3px] rounded text-white text-[12px] font-bold shadow-sm leading-none tracking-wide" style={{ backgroundColor: themeColor }}>
                            {user.points?.toLocaleString() ?? 0} Pts
                          </div>
                          
                          {/* 🔥 Black, Bold & Pushed to Right 🔥 */}
                          <span className="text-[14px] font-black text-[#202124] ml-auto">
                            Rank - {rankLabel}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= 🔥 SEARCH & RANK ACTION BAR 🔥 ================= */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  className="w-full bg-white border border-[#dadce0] text-slate-900 placeholder-slate-400 rounded-lg py-3 pl-11 pr-10 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all text-[14px] font-bold shadow-sm"
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

            {/* 🔥 NEW: TOTAL MEMBERS BUTTON & YOUR RANK 🔥 */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-auto px-5 py-3 bg-white border border-[#dadce0] rounded-lg flex items-center justify-center gap-2 shadow-sm">
                <span className="text-[13px] font-bold text-[#5f6368]">Total Members:</span>
                <span className="text-[15px] font-black text-[#202124]">{leaders.length}</span>
              </div>
              
              <button 
                onClick={() => {
                  if (currentUserRef.current) {
                    currentUserRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-[#dadce0] hover:border-[#1a73e8] rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all group cursor-pointer"
              >
                <span className="text-[13px] font-bold text-[#5f6368] group-hover:text-[#202124] transition-colors">Your Rank:</span>
                <span className="text-[15px] font-black text-[#1a73e8]">{currentUserRank ? currentUserRank : "--"}</span>
              </button>
            </div>
          </div>

          {/* ================= 🔥 FULL PAGE ADMIN STYLE TABLE (RANK 4+) 🔥 ================= */}
          <div className="w-full flex flex-col gap-2">
            
            {/* Table Heading */}
            <h2 className="text-xl font-bold text-[#202124] mb-2 flex items-center gap-2">
              User Points Leaderboard
              {isSearching && <span className="text-sm font-medium text-[#5f6368]"> - Search Results</span>}
            </h2>

            <div className="bg-white rounded-lg shadow-sm border border-[#dadce0] w-full overflow-hidden">
              <div className="w-full overflow-x-auto custom-scrollbar">
                
                {isSearching ? (
                  searchResults.length > 0 ? (
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead className="bg-[#0f9d58] border-b border-[#0b8043]">
                        <tr>
                          <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043] w-24 text-center">Rank</th>
                          <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043]">User Name</th>
                          <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider text-center w-36">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8eaed]">
                        {searchResults.map((user) => (
                          <LeaderTableRow 
                            key={user.id} 
                            user={user} 
                            isCurrentUser={isExactCurrentUser(user)} 
                            innerRef={isExactCurrentUser(user) ? currentUserRef : null} 
                          />
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-16 text-center bg-white">
                      <div className="text-5xl mb-4 opacity-50">🔍</div>
                      <p className="text-[#5f6368] text-[15px] font-bold">No player found with that name.</p>
                    </div>
                  )
                ) : (
                  restLeaders.length > 0 ? (
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead className="bg-[#0f9d58] border-b border-[#0b8043]">
                        <tr>
                          <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043] w-24 text-center">Rank</th>
                          <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043]">User Name</th>
                          <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider text-center w-36">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8eaed]">
                        {restLeaders.map((user) => (
                          <LeaderTableRow 
                            key={user.id} 
                            user={user} 
                            isCurrentUser={isExactCurrentUser(user)} 
                            innerRef={isExactCurrentUser(user) ? currentUserRef : null} 
                          />
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center bg-white">
                      <p className="text-[#5f6368] text-[15px] font-bold">Waiting for more players to join the battle... ⚔️</p>
                    </div>
                  )
                )}

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

// 🔥 ROW COMPONENT FOR ADMIN STYLE TABLE 🔥
function LeaderTableRow({ user, isCurrentUser = false, innerRef = null }: { user: Leader; isCurrentUser?: boolean; innerRef?: any }) {
  return (
    <tr 
      ref={innerRef}
      className={`transition-colors duration-300 ${isCurrentUser ? "animate-blink-user" : "hover:bg-[#f8f9fa] bg-white"}`}
    >
      <td className={`px-6 py-4 text-[15px] font-bold text-center border-r border-[#e8eaed] ${isCurrentUser ? "text-[#0f9d58]" : "text-[#5f6368]"}`}>
        {user.rank}
      </td>
      <td className="px-6 py-4 border-r border-[#e8eaed]">
        <div className="flex items-center gap-4">
          <img 
            src={user.photoURL || "/avatar.png"} 
            alt={user.name} 
            className={`w-10 h-10 rounded-full object-cover shrink-0 border border-[#dadce0] ${isCurrentUser ? "border-2 border-[#0f9d58]" : ""}`} 
          />
          <span className={`text-[15px] font-bold truncate max-w-[150px] sm:max-w-[300px] ${isCurrentUser ? "text-[#0f9d58]" : "text-[#202124]"}`}>
            {user.name || "Anonymous"}
          </span>
          {isCurrentUser && (
            <span className="ml-2 bg-[#0f9d58] text-white px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider shadow-sm">
              You
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-[16px] font-black ${isCurrentUser ? "text-[#0f9d58]" : "text-[#202124]"}`}>
          {user.points?.toLocaleString() ?? 0}
        </span>
      </td>
    </tr>
  );
}