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

        <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-2 pb-8 relative z-10">
          
          <div className="w-full flex flex-col gap-2 mt-0">
            
            <div className="bg-white rounded-xl shadow-sm border border-[#dadce0] w-full overflow-hidden">
              <div className="w-full overflow-x-auto custom-scrollbar">
                
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead className="bg-[#0f9d58]">
                    
                    {/* 🔥 COLUMN HEADERS WITH INLINE SEARCH & STATS 🔥 */}
                    <tr>
                      <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider border-r border-[#0b8043] border-b border-[#0b8043] w-24 text-center">Rank</th>
                      <th className="px-6 py-5 border-r border-[#0b8043] border-b border-[#0b8043]">
                        
                        <div className="flex items-center justify-between gap-6 w-full">
                          <span className="text-[15px] font-black text-white uppercase tracking-wider whitespace-nowrap">User Name</span>
                          
                          <div className="flex items-center gap-4 flex-1 justify-end md:pr-4">
                            
                            {/* 🔥 Search Box 🔥 */}
                            <div className="relative w-full max-w-[260px]">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                              </div>
                              <input
                                type="text"
                                placeholder={
                                  showUserPlaceholder && currentUserName 
                                    ? `${currentUserName.split(" ")[0]} You` 
                                    : "Search player..."
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-md py-2 pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all text-[13px] font-bold shadow-sm"
                              />
                              {searchTerm && (
                                <button 
                                  onClick={() => setSearchTerm("")}
                                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <svg className="w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full p-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* 🔥 Your Rank 🔥 */}
                            <button 
                              onClick={() => {
                                if (currentUserRef.current) {
                                  currentUserRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }}
                              className="whitespace-nowrap bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer border border-transparent hover:border-white/40"
                            >
                              Rank: <span className="text-[15px] font-black">{currentUserRank ? currentUserRank : "--"}</span>
                            </button>

                            {/* 🔥 Total Members 🔥 */}
                            <div className="whitespace-nowrap bg-[#0b8043] text-white px-4 py-2 rounded-md text-[13px] font-bold flex items-center gap-1.5 shadow-inner border border-[#096a37]">
                              Total: <span className="text-[15px] font-black">{leaders.length}</span>
                            </div>

                          </div>
                        </div>

                      </th>
                      <th className="px-6 py-5 text-[15px] font-black text-white uppercase tracking-wider text-center border-b border-[#0b8043] w-36">Points</th>
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

// 🔥 ROW COMPONENT WITH LIGHTER COLORS FOR TOP 3 🔥
function LeaderTableRow({ user, isCurrentUser = false, innerRef = null }: { user: Leader; isCurrentUser?: boolean; innerRef?: any }) {
  
  let rowBg = "bg-white hover:bg-[#f8f9fa]";
  let textColor = "text-[#202124]";
  let rankColor = "text-[#5f6368]";
  let borderClass = "border-[#e8eaed]";

  // 🔥 CUSTOM STYLES FOR TOP 3 RANKS (LIGHT SHADES) 🔥
  if (user.rank === 1) {
    rowBg = "bg-[#fff9e6] hover:bg-[#fff2cc]"; // Light Premium Gold
    textColor = "text-[#b07d00]";
    rankColor = "text-[#b07d00]";
    borderClass = "border-[#fce8b2]";
  } else if (user.rank === 2) {
    rowBg = "bg-[#f1f3f4] hover:bg-[#e8eaed]"; // Light Premium Silver
    textColor = "text-[#5f6368]";
    rankColor = "text-[#5f6368]";
    borderClass = "border-[#dadce0]";
  } else if (user.rank === 3) {
    rowBg = "bg-[#fce8e6] hover:bg-[#fad2cf]"; // Light Premium Bronze
    textColor = "text-[#c5221f]";
    rankColor = "text-[#c5221f]";
    borderClass = "border-[#f2cbcb]";
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
            className={`w-10 h-10 rounded-full object-cover shrink-0 shadow-sm border border-white/40 ${isCurrentUser && user.rank > 3 ? "border-2 border-[#0f9d58]" : ""}`} 
          />
          <span className={`text-[15px] font-bold truncate max-w-[150px] sm:max-w-[300px] ${textColor}`}>
            {user.name || "Anonymous"}
          </span>
          {isCurrentUser && (
            <span className={`ml-2 px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-wider shadow-sm ${user.rank <= 3 ? "bg-white/80 text-black" : "bg-[#0f9d58] text-white"}`}>
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