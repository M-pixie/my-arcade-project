"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link"; // 🔥 Link import kiya yahan 🔥
import { subscribeLeaderboard } from "@/lib/leaderboard";
import { 
  Trophy, Home, Calculator, LayoutDashboard, 
  Award, Users, HelpCircle, Search, Bell
} from "lucide-react";

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

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaders(data); // 🔥 Hamesha original backend data hi aayega, no mock data 🔥
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

  // 🔥 AUTO-SCROLL LOGIC WAPAS ADD KIYA 🔥
  useEffect(() => {
    if (currentUserRef.current && leaders.length > 0) {
      setTimeout(() => {
        currentUserRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    }
  }, [leaders, currentUserName, currentUserUniqueId]);

  const isExactCurrentUser = (user: Leader) => {
    if (!currentUserName) return false;
    if (currentUserUniqueId && user.profileUrl) {
      return user.profileUrl.includes(currentUserUniqueId);
    }
    return user.name === currentUserName;
  };

  const searchResults = leaders.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayList = searchTerm.trim().length > 0 ? searchResults : leaders;
  
  // CURRENT USER DATA
  const currentUserData = leaders.find((l) => isExactCurrentUser(l));

  return (
    <>
      <style>{`
        /* 🔥 CARD BLINK ANIMATION 🔥 */
        @keyframes card-border-blink {
          0%, 100% { border-color: #1a73e8; box-shadow: 0 0 8px rgba(26, 115, 232, 0.4); }
          50% { border-color: #e8eaed; box-shadow: none; }
        }
        .animate-card-blink {
          animation: card-border-blink 1.5s infinite ease-in-out;
        }
      `}</style>

      <div className="flex flex-col h-screen bg-[#f8f9fc] text-[#3c4043] font-sans overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-[60px] bg-white border-b border-[#e8eaed] flex items-center justify-between px-6 shrink-0 z-10">
          <div className="font-bold text-[16px] text-[#202124] w-[260px]">
            {currentUserData?.name || currentUserName || "Loading..."}
          </div>
          
          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-[#5f6368]">
            <span className="cursor-pointer hover:text-[#202124]">Home</span>
            <span className="cursor-pointer hover:text-[#202124]">Calculator</span>
            <span className="cursor-pointer hover:text-[#202124]">Dashboard</span>
            <span className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-full cursor-pointer">Leaderboard</span>
            <span className="cursor-pointer hover:text-[#202124]">Skill Badges</span>
            <span className="cursor-pointer hover:text-[#202124]">Facilitator</span>
            <span className="cursor-pointer hover:text-[#202124]">Help</span>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-[#5f6368] hover:text-[#202124]">
              <Bell className="w-5 h-5" />
            </button>
            <img 
              src={currentUserData?.photoURL || "/avatar.png"} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-[#dadce0] bg-[#e8eaed]"
            />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-[280px] bg-white border-r border-[#e8eaed] flex flex-col justify-between overflow-y-auto hidden md:flex shrink-0">
            {/* 🔥 YAHAN TUMHARA EXACT REDIRECT LOGIC LAGAYA HAI 🔥 */}
            <nav className="flex flex-col gap-1 px-4 py-4">
              <SidebarItem icon={<Home size={18} />} label="Home" href="/" />
              <SidebarItem icon={<Calculator size={18} />} label="Calculator" href="/calculator" />
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/dashboard" />
              <SidebarItem icon={<Award size={18} />} label="Skill Badges" href="/resources" />
              <SidebarItem icon={<Users size={18} />} label="Facilitator" href="/facilitator" />
              <SidebarItem icon={<HelpCircle size={18} />} label="Help" href="/chat" />
            </nav>

            <div className="px-5 pb-6">
              {/* BLINKING CURRENT USER CARD */}
              <div className="p-5 bg-[#f8f9fc] rounded-2xl border-[2px] animate-card-blink flex flex-col items-center text-center relative transition-all">
                
                {currentUserData?.photoURL ? (
                  <img 
                    src={currentUserData.photoURL} 
                    alt={currentUserData.name || "User"} 
                    className="w-14 h-14 rounded-full object-cover mb-2 border border-[#dadce0]"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#4285f4] text-white rounded-full flex items-center justify-center text-xl font-bold mb-2">
                    {currentUserName ? currentUserName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                
                <h4 className="font-black text-[16px] text-[#202124]">
                  {currentUserData?.name || currentUserName || "User"}
                </h4>
                
                <span className="bg-[#e8f0fe] text-[#4285f4] text-[11px] font-black px-2.5 py-0.5 rounded mt-1.5 uppercase tracking-wider">
                  You
                </span>
                
                <div className="mt-4 pt-4 border-t border-[#dadce0] w-full flex justify-around">
                  <div className="flex flex-col items-center">
                    <p className="text-[12px] font-bold text-[#5f6368] mb-1">Your Rank</p>
                    <p className="font-black text-[18px] text-[#202124] flex items-center gap-1">
                      {currentUserData?.rank || "--"} <span className="text-[#fbbc04]">🏆</span>
                    </p>
                  </div>
                  <div className="w-px bg-[#dadce0] h-full"></div>
                  <div className="flex flex-col items-center">
                    <p className="text-[12px] font-bold text-[#5f6368] mb-1">Total Points</p>
                    <p className="font-black text-[18px] text-[#202124]">
                      {currentUserData?.points ?? "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto bg-white m-4 rounded-xl border border-[#e8eaed] shadow-sm flex flex-col">
            
            <div className="p-6 md:px-8 md:py-6">
              
              <div className="flex flex-col xl:flex-row items-center justify-between mb-8 gap-4 border border-[#e8eaed] p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#e8f0fe] rounded-full flex items-center justify-center shrink-0">
                    <Trophy className="w-7 h-7 text-[#4285f4]" />
                  </div>
                  <div>
                    <h1 className="text-[22px] font-bold text-[#202124]">Leaderboard</h1>
                    <p className="text-[#5f6368] text-[13px]">Top performers on the Arcade Calculator</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                  <div className="relative flex-1 xl:w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                    <input 
                      type="text" 
                      placeholder="Search player..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#f1f3f4] border-none rounded-lg py-2 pl-9 pr-4 text-[13px] focus:ring-2 focus:ring-[#1a73e8] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-[#fff8e1] border border-[#fce8b2] rounded-lg px-4 py-2 shrink-0">
                    <div className="text-[#fbbc04]"><Trophy className="w-5 h-5" fill="currentColor" /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5f6368]">Your Rank</span>
                      <span className="text-[14px] font-bold leading-none text-[#202124]">
                        {currentUserData?.rank || "--"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#f8f9fc] border border-[#e8eaed] rounded-lg px-4 py-2 shrink-0">
                    <div className="text-[#fbbc04]"><Award className="w-5 h-5" fill="currentColor" /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#5f6368]">Total Users</span>
                      <span className="text-[14px] font-bold leading-none text-[#202124]">{leaders.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e8eaed]">
                      <th className="px-4 py-3 text-[11px] font-bold text-[#5f6368] uppercase tracking-wider w-24 text-center">Rank</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Player</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#5f6368] uppercase tracking-wider text-right w-32">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f3f4]">
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
                        <td colSpan={3} className="p-8 text-center text-[#5f6368] font-medium">
                          {searchTerm ? "No player found with that name." : "Loading players..."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </main>

        </div>
      </div>
    </>
  );
}

// 🔥 YAHAN TUMHARA COMPONENT LINK ME CHANGE HUA HAI 🔥
function SidebarItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124] transition-colors text-[14px] font-medium">
      <span className="text-[#5f6368]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

// Table Row Component
function LeaderTableRow({ user, isCurrentUser = false, innerRef = null }: { user: Leader; isCurrentUser?: boolean; innerRef?: any }) {
  let rowClass = "hover:bg-[#f8f9fc] transition-colors bg-white";
  let rankDisplay = <span className="text-[#5f6368] font-bold text-[14px]">{user.rank}</span>;
  
  if (user.rank === 1) {
    rankDisplay = <span className="text-[#fbbc04] flex items-center justify-center gap-1.5 text-[14px] font-bold"><Trophy className="w-4 h-4" fill="currentColor" /> 1</span>;
  } else if (user.rank === 2) {
    rankDisplay = <span className="text-[#bdc1c6] flex items-center justify-center gap-1.5 text-[14px] font-bold"><Trophy className="w-4 h-4" fill="currentColor" /> 2</span>;
  } else if (user.rank === 3) {
    rankDisplay = <span className="text-[#d87c53] flex items-center justify-center gap-1.5 text-[14px] font-bold"><Trophy className="w-4 h-4" fill="currentColor" /> 3</span>;
  }

  return (
    <tr ref={innerRef} className={rowClass}>
      <td className="px-4 py-4 text-center w-24">
        {rankDisplay}
      </td>
      
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img 
            src={user.photoURL || "/avatar.png"} 
            alt={user.name} 
            className="w-9 h-9 rounded-full object-cover shrink-0 bg-[#e8eaed]" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`;
            }}
          />
          
          <span className={`text-[14px] font-bold ${user.rank === 1 ? 'text-[#202124]' : 'text-[#3c4043]'}`}>
            {user.name || "Anonymous"}
          </span>
          
          {isCurrentUser && (
            <span className="bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ml-1">
              You
            </span>
          )}
        </div>
      </td>
      
      <td className="px-4 py-4 text-right">
        <span className={`text-[15px] font-black ${user.rank === 1 ? 'text-[#1a73e8]' : 'text-[#202124]'}`}>
          {user.points?.toLocaleString() ?? 0}
        </span>
      </td>
    </tr>
  );
}