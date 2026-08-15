"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { subscribeLeaderboard } from "@/lib/leaderboard";
import { 
  Trophy, Search, Bell, Medal, Users, Award, Shield
} from "lucide-react";

type Leader = {
  id: string;
  rank: number;
  name?: string;
  photoURL?: string;
  points?: number;
  profileUrl?: string;
  badges?: string; 
  milestone?: string;
};

// 124 Active Members Data
const RAW_ACTIVE_MEMBERS = [
  { name: "AADITYA VARDHAN", skill: 51, game: 11, milestone: "Milestone 3" },
  { name: "ADITYA MONDAL", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "ADITYA RAJ", skill: 0, game: 1, milestone: "Not Yet" },
  { name: "AISHWARYA KANCHU", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "AJIT CHAUDHARY", skill: 38, game: 1, milestone: "Not Yet" },
  { name: "AJITKUMAR MAURYA", skill: 5, game: 2, milestone: "Not Yet" },
  { name: "AMAN KUSHWAHA", skill: 6, game: 2, milestone: "Not Yet" },
  { name: "AMAN SINGH CHAUHAN", skill: 1, game: 2, milestone: "Not Yet" },
  { name: "AMISH RAJ", skill: 6, game: 0, milestone: "Not Yet" },
  { name: "AMISHA KUMARI", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "ANIKA CHOUDHURY", skill: 66, game: 11, milestone: "Milestone 3" },
  { name: "ANUSHKA SINGH", skill: 0, game: 3, milestone: "Not Yet" },
  { name: "APURVA LAKHE", skill: 10, game: 1, milestone: "Not Yet" },
  { name: "ARPIT DUBEY", skill: 40, game: 7, milestone: "Milestone 1" },
  { name: "ASBAB KHAN", skill: 39, game: 5, milestone: "Not Yet" },
  { name: "ASHUTOSH SUBHASH MINDE", skill: 24, game: 6, milestone: "Milestone 1" },
  { name: "AYUSHA SANJUKTHA CHEKKA", skill: 22, game: 6, milestone: "Milestone 1" },
  { name: "BALRAM", skill: 7, game: 0, milestone: "Not Yet" },
  { name: "BERNARDO RIFFO", skill: 32, game: 7, milestone: "Milestone 1" },
  { name: "BIJOY BISWAS", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "BRAJESH KUMAR", skill: 1, game: 1, milestone: "Not Yet" },
  { name: "CHEEPURUPALLI SATWIK", skill: 50, game: 9, milestone: "Milestone 2" },
  { name: "CHIRAG VAISHNAV", skill: 2, game: 0, milestone: "Not Yet" },
  { name: "DHARMALA MONALI REDDY", skill: 6, game: 1, milestone: "Not Yet" },
  { name: "DHARSHINI V", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "DIPIKA VAMAN KANTAPPA POOJARI", skill: 48, game: 5, milestone: "Not Yet" },
  { name: "DIVYAM AGRAWAL", skill: 26, game: 6, milestone: "Milestone 1" },
  { name: "DIYA MANDAL", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "E SANTHOSH KUMAR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "ESHAMA ARA", skill: 19, game: 6, milestone: "Milestone 1" },
  { name: "G.PAVANI", skill: 12, game: 6, milestone: "Not Yet" },
  { name: "GAGANDEEP KAUR", skill: 18, game: 3, milestone: "Not Yet" },
  { name: "GAUTAM KUMAR", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "GHANSHYAM KUMAR", skill: 50, game: 5, milestone: "Not Yet" },
  { name: "GULAM MOHAMMAD", skill: 8, game: 2, milestone: "Not Yet" },
  { name: "GUNJAN KUMARI", skill: 21, game: 1, milestone: "Not Yet" },
  { name: "HAJARE AYUSH", skill: 37, game: 8, milestone: "Milestone 2" },
  { name: "HARDIK GUPTA", skill: 0, game: 5, milestone: "Not Yet" },
  { name: "HARSH PANDA", skill: 15, game: 6, milestone: "Not Yet" },
  { name: "HARSH SHARMA", skill: 60, game: 11, milestone: "Milestone 3" },
  { name: "HARSHVARDHAN PANDEY", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "HIMANI TYAGI", skill: 7, game: 2, milestone: "Not Yet" },
  { name: "HIMANSHU SHARMA", skill: 38, game: 6, milestone: "Milestone 1" },
  { name: "INDRAJIT MISHRA", skill: 52, game: 11, milestone: "Milestone 3" },
  { name: "JANANI SURYA KALA", skill: 6, game: 0, milestone: "Not Yet" },
  { name: "JANHAVI TALODHIKAR", skill: 9, game: 0, milestone: "Not Yet" },
  { name: "JAYASHREE MANDAL", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "KARNATI PRAGNA SRI", skill: 2, game: 0, milestone: "Not Yet" },
  { name: "KARTHEEK THANGELLA", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "KAUSHAL DUBEY", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "KAUSHAL LOYA", skill: 17, game: 5, milestone: "Not Yet" },
  { name: "KAVETI RISHI TEJA", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "KISHOUR J", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "KKESHAV LOYA", skill: 1, game: 1, milestone: "Not Yet" },
  { name: "KONDA BHASKAR REDDY", skill: 59, game: 4, milestone: "Not Yet" },
  { name: "KRISHNA", skill: 7, game: 0, milestone: "Not Yet" },
  { name: "KUNAL KUMAR", skill: 1, game: 4, milestone: "Not Yet" },
  { name: "LOKESH KUMAR SAH", skill: 0, game: 1, milestone: "Not Yet" },
  { name: "LOVELY KUMARI", skill: 18, game: 1, milestone: "Not Yet" },
  { name: "MADHUMITHA S", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "MANDEEP KAUR", skill: 22, game: 6, milestone: "Milestone 1" },
  { name: "MANISH KUMAR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "MANSI THAKUR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "MASUM ANAND", skill: 2, game: 0, milestone: "Not Yet" },
  { name: "MD SAMSE ALAM", skill: 1, game: 1, milestone: "Not Yet" },
  { name: "MD TANVEER HUSSAIN", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "MEGHA DALAL", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "MILAN DEORI", skill: 0, game: 1, milestone: "Not Yet" },
  { name: "MOHAMMAD TAUFIQUE", skill: 18, game: 7, milestone: "Milestone 1" },
  { name: "MONISHA MONDAL", skill: 4, game: 3, milestone: "Not Yet" },
  { name: "MONU KUMAR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "MUNNA KUMAR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "NAMPALLY HARISH", skill: 69, game: 12, milestone: "Ultimate Milestone" },
  { name: "NEERAJ KUMAR", skill: 52, game: 10, milestone: "Milestone 3" },
  { name: "NIHARIKA", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "NIHARIKA SANGAM", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "NIKHIL", skill: 2, game: 0, milestone: "Not Yet" },
  { name: "NIKHIL KUMAR", skill: 1, game: 1, milestone: "Not Yet" },
  { name: "NIKHIL KUMAR", skill: 15, game: 0, milestone: "Not Yet" },
  { name: "NITYAY SANJAY JIWTODE", skill: 18, game: 4, milestone: "Not Yet" },
  { name: "NOURAN MUHAMMAD ABDELHAKIM MUHAMMAD", skill: 13, game: 3, milestone: "Not Yet" },
  { name: "NUVVULA VARUN KRISHNA", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "PARI GUPTA", skill: 0, game: 5, milestone: "Not Yet" },
  { name: "PIYUSH KUMAR", skill: 20, game: 4, milestone: "Not Yet" },
  { name: "PRATIKSHA DESHMUKH", skill: 24, game: 8, milestone: "Milestone 1" },
  { name: "PRATIKSHA RAMCHANDRA KHADE", skill: 8, game: 2, milestone: "Not Yet" },
  { name: "PRITHA ROY", skill: 11, game: 6, milestone: "Not Yet" },
  { name: "PRITHVI KUMAR", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "PRIYANSH NARANG", skill: 4, game: 3, milestone: "Not Yet" },
  { name: "PRIYANSHU KUMAR", skill: 2, game: 0, milestone: "Not Yet" },
  { name: "PRIYLATA", skill: 7, game: 0, milestone: "Not Yet" },
  { name: "PROVINCE KUMAR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "PULLAGURA CHARANMAYEE", skill: 1, game: 4, milestone: "Not Yet" },
  { name: "RADHA", skill: 3, game: 0, milestone: "Not Yet" },
  { name: "RAHUL YADAV", skill: 3, game: 1, milestone: "Not Yet" },
  { name: "RAJ GUPTA", skill: 0, game: 2, milestone: "Not Yet" },
  { name: "RAJKUMAR DAS", skill: 66, game: 12, milestone: "Ultimate Milestone" },
  { name: "RAMANDEEP RIMPY", skill: 42, game: 6, milestone: "Milestone 1" },
  { name: "RAUSHAN KUMAR", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "RITU BHARTI", skill: 8, game: 0, milestone: "Not Yet" },
  { name: "ROHIT KUMAR BHARDWAJ", skill: 2, game: 0, milestone: "Not Yet" },
  { name: "SAMIRA SAMROSE", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "SAMRATH GUPTA", skill: 16, game: 0, milestone: "Not Yet" },
  { name: "SANIKA KESHAV DHOKARE", skill: 1, game: 4, milestone: "Not Yet" },
  { name: "SANTOSH KUMAR MALLICK", skill: 35, game: 9, milestone: "Milestone 2" },
  { name: "SAURABH KUMAR", skill: 62, game: 0, milestone: "Not Yet" },
  { name: "SHABNAM RAZA", skill: 0, game: 1, milestone: "Not Yet" },
  { name: "SHREYA GUPTA", skill: 0, game: 5, milestone: "Not Yet" },
  { name: "SHRUTI KUMARI", skill: 9, game: 0, milestone: "Not Yet" },
  { name: "SHUBHAM", skill: 40, game: 10, milestone: "Milestone 2" },
  { name: "SOHOM NATH", skill: 11, game: 6, milestone: "Not Yet" },
  { name: "SONU KUMAR", skill: 1, game: 1, milestone: "Not Yet" },
  { name: "SPARSH KOTIYA", skill: 77, game: 11, milestone: "Milestone 3" },
  { name: "SURUCHI KUMARI", skill: 4, game: 4, milestone: "Not Yet" },
  { name: "TANUSHKA DAS", skill: 5, game: 0, milestone: "Not Yet" },
  { name: "THANNEERU DINESH", skill: 1, game: 0, milestone: "Not Yet" },
  { name: "UJJWAL RAJ", skill: 9, game: 0, milestone: "Not Yet" },
  { name: "VAISHNAVI PRASAD RAMANNAVAR", skill: 32, game: 11, milestone: "Milestone 1" },
  { name: "VARSHA KUMARI", skill: 6, game: 1, milestone: "Not Yet" },
  { name: "VEDANT BHAUMIK", skill: 6, game: 0, milestone: "Not Yet" },
  { name: "VICKY KUMAR", skill: 36, game: 5, milestone: "Not Yet" },
  { name: "VIKAS", skill: 67, game: 12, milestone: "Ultimate Milestone" },
  { name: "VISHAL KUMAR", skill: 23, game: 8, milestone: "Milestone 1" },
  { name: "VISHAL KUMAR", skill: 1, game: 0, milestone: "Not Yet" }
];

// Helper to determine sorting value under the hood
function getSortScore(skill: number, game: number, milestone: string) {
  let base = 0;
  if (milestone.includes("Ultimate")) base = 40000;
  else if (milestone.includes("Milestone 3")) base = 30000;
  else if (milestone.includes("Milestone 2")) base = 20000;
  else if (milestone.includes("Milestone 1")) base = 10000;
  return base + (skill * 10) + (game * 50);
}

export default function LeaderboardPage() {
  const [arcadeLeaders, setArcadeLeaders] = useState<Leader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"arcade" | "facilitator">("arcade");
  
  const [currentUserName, setCurrentUserName] = useState<string | null>(null); 
  const [currentUserUniqueId, setCurrentUserUniqueId] = useState<string | null>(null);
  const currentUserRef = useRef<HTMLTableRowElement>(null as any);

  // Generate the full 343 members list with internal sorting
  const facilitatorLeaders = useMemo(() => {
    const active = RAW_ACTIVE_MEMBERS.map(m => ({
      name: m.name, skill: m.skill, game: m.game, milestone: m.milestone,
      score: getSortScore(m.skill, m.game, m.milestone)
    }));

    // Generating remaining 219 inactive members
    const inactive = Array.from({ length: 219 }).map((_, i) => ({
      name: `Inactive Member ${i + 1}`, skill: 0, game: 0, milestone: "Not Yet",
      score: -1 
    }));

    const combined = [...active, ...inactive].sort((a, b) => b.score - a.score);

    return combined.map((member, index) => ({
      id: `fac_${index}`,
      rank: index + 1,
      name: member.name,
      badges: `${member.skill} Skill • ${member.game} Game`,
      milestone: member.milestone
    }));
  }, []);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setArcadeLeaders(data); 
    });
    try {
      const savedData = localStorage.getItem("arcade_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.userName) setCurrentUserName(parsed.userName);
        if (parsed.userUniqueId) setCurrentUserUniqueId(parsed.userUniqueId);
      }
    } catch (e) {
      console.error("Error reading user data", e);
    }
    return () => unsub();
  }, []);

  const isExactCurrentUser = (user: Leader) => {
    if (!currentUserName) return false;
    if (currentUserUniqueId && user.profileUrl) return user.profileUrl.includes(currentUserUniqueId);
    return user.name === currentUserName;
  };

  const currentList = activeTab === "arcade" ? arcadeLeaders : facilitatorLeaders;
  const displayList = searchTerm.trim().length > 0 
    ? currentList.filter((user) => user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : currentList;

  const currentUserData = arcadeLeaders.find((l) => isExactCurrentUser(l));

  useEffect(() => {
    if (activeTab === "arcade" && currentUserRef.current && arcadeLeaders.length > 0) {
      setTimeout(() => currentUserRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 600);
    }
  }, [arcadeLeaders, activeTab]);

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fc] text-[#202124] font-sans overflow-hidden">
      
      {/* PREMIUM MINIMAL TOP NAVBAR */}
      <header className="h-[64px] bg-white border-b border-[#dadce0] flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="font-bold text-[16px] md:text-[18px] tracking-tight text-[#1a73e8] flex items-center gap-2">
            <Trophy className="w-5 h-5" /> <span className="hidden sm:inline">ARCADE HUB</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#5f6368]">
            <Link href="/" className="hover:text-[#1a73e8] transition-colors">Home</Link>
            <Link href="/calculator" className="hover:text-[#1a73e8] transition-colors">Calculator</Link>
            <span className="text-[#1a73e8] border-b-[3px] border-[#1a73e8] pb-1 cursor-default pt-1">Leaderboard</span>
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button className="text-[#5f6368] hover:text-[#202124] bg-[#f1f3f4] p-2 rounded-full transition-colors">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-5 border-l border-[#dadce0]">
            <img 
              src={currentUserData?.photoURL || "/avatar.png"} 
              alt="Profile" 
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-[#dadce0] bg-[#f8f9fc]"
            />
            <span className="font-semibold text-[13px] md:text-[14px] text-[#3c4043] hidden sm:inline">
              {currentUserData?.name || currentUserName || "Guest"}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 overflow-y-auto w-full max-w-[1300px] mx-auto p-4 md:p-8">
        
        {/* UNIFIED SINGLE-LINE PREMIUM PANEL (RESPONSIVE) */}
        <div className="bg-white rounded-[16px] border border-[#dadce0] shadow-sm p-4 mb-6 w-full flex flex-col xl:flex-row items-center gap-4 xl:gap-6 justify-between">
          
          {/* 1. Title */}
          <div className="w-full xl:w-[220px] shrink-0 flex flex-col text-center xl:text-left">
            <h1 className="text-[20px] font-black tracking-tight text-[#202124] leading-tight">Rankings</h1>
            <p className="text-[#5f6368] font-medium text-[12px] mt-0.5">Tracking all active performers.</p>
          </div>

          {/* 2. Search Box */}
          <div className="relative w-full xl:flex-1 xl:max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input 
              type="text" 
              placeholder="Search for a player..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9fc] border border-[#e8eaed] rounded-[12px] xl:rounded-full py-2.5 pl-11 pr-4 text-[14px] font-medium focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] focus:bg-white outline-none transition-all placeholder:text-[#9aa0a6]"
            />
          </div>
          
          {/* 3. Stats Block */}
          <div className="flex items-center justify-center gap-4 md:gap-6 w-full xl:w-auto shrink-0 bg-[#f8f9fc] px-4 md:px-5 py-2.5 rounded-[12px] xl:rounded-full border border-[#e8eaed]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#5f6368] uppercase tracking-wider">Members</span>
              <span className="text-[16px] font-black text-[#1a73e8] leading-none">{currentList.length}</span>
            </div>
            <div className="w-px h-5 bg-[#dadce0]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#5f6368] uppercase tracking-wider">Your Rank</span>
              <span className="text-[16px] font-black text-[#1a73e8] leading-none">{currentUserData?.rank || "--"}</span>
            </div>
          </div>

          {/* 4. Premium Toggles */}
          <div className="flex items-center w-full xl:w-auto bg-[#f1f3f4] p-1 rounded-[12px] xl:rounded-full border border-[#dadce0] shrink-0">
            <button 
              onClick={() => setActiveTab("arcade")}
              className={`flex-1 xl:flex-none flex justify-center items-center gap-2 px-5 py-2 rounded-[10px] xl:rounded-full text-[13px] font-bold transition-all ${
                activeTab === "arcade" ? "bg-[#1a73e8] text-white shadow-md" : "text-[#5f6368] hover:text-[#202124]"
              }`}
            >
              <Medal className="w-4 h-4" /> Arcade
            </button>
            <button 
              onClick={() => setActiveTab("facilitator")}
              className={`flex-1 xl:flex-none flex justify-center items-center gap-2 px-5 py-2 rounded-[10px] xl:rounded-full text-[13px] font-bold transition-all ${
                activeTab === "facilitator" ? "bg-[#1a73e8] text-white shadow-md" : "text-[#5f6368] hover:text-[#202124]"
              }`}
            >
              <Users className="w-4 h-4" /> Facilitator
            </button>
          </div>
        </div>

        {/* DATA TABLE WRAPPER WITH OVERFLOW FOR MOBILE SCROLL */}
        <div className="w-full overflow-x-auto border border-[#dadce0] rounded-[16px] bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#dadce0]">
                <th className="px-4 md:px-6 py-4 text-[12px] font-bold text-[#5f6368] uppercase tracking-wider w-20 text-center">Rank</th>
                <th className="px-4 md:px-6 py-4 text-[12px] font-bold text-[#5f6368] uppercase tracking-wider">Player Name</th>
                
                {activeTab === "arcade" ? (
                  <th className="px-4 md:px-6 py-4 text-[12px] font-bold text-[#5f6368] uppercase tracking-wider text-right w-40 whitespace-nowrap">Total Points</th>
                ) : (
                  <>
                    <th className="px-4 md:px-6 py-4 text-[12px] font-bold text-[#5f6368] uppercase tracking-wider whitespace-nowrap">Badges</th>
                    <th className="px-4 md:px-6 py-4 text-[12px] font-bold text-[#5f6368] uppercase tracking-wider text-right whitespace-nowrap">Milestone Achieved</th>
                  </>
                )}
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
                    tab={activeTab}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === "facilitator" ? 4 : 3} className="p-16 text-center text-[#5f6368] font-semibold text-[15px]">
                    {searchTerm ? "No matching player found." : "Loading leaderboard data..."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

// PREMIUM TABLE ROW COMPONENT
function LeaderTableRow({ 
  user, 
  isCurrentUser = false, 
  innerRef = null,
  tab
}: { 
  user: Leader; 
  isCurrentUser?: boolean; 
  innerRef?: any;
  tab: "arcade" | "facilitator";
}) {
  const isTop3 = user.rank <= 3;
  
  let rankIcon = <span className="text-[#5f6368] font-bold text-[15px]">{user.rank}</span>;
  if (user.rank === 1) rankIcon = <span className="text-[#fbbc04] font-black flex justify-center items-center gap-1.5"><Trophy className="w-4 h-4"/> 1</span>;
  if (user.rank === 2) rankIcon = <span className="text-[#9aa0a6] font-black flex justify-center items-center gap-1.5"><Trophy className="w-4 h-4"/> 2</span>;
  if (user.rank === 3) rankIcon = <span className="text-[#d87c53] font-black flex justify-center items-center gap-1.5"><Trophy className="w-4 h-4"/> 3</span>;

  return (
    <tr 
      ref={innerRef} 
      className={`transition-colors hover:bg-[#f8f9fc] ${isCurrentUser ? 'bg-[#e8f0fe]' : 'bg-white'}`}
    >
      <td className="px-4 md:px-6 py-4 md:py-5 text-center w-20 align-middle">
        {rankIcon}
      </td>
      
      <td className="px-4 md:px-6 py-4 md:py-5 align-middle min-w-[200px]">
        <div className="flex items-center gap-3 md:gap-4">
          <img 
            src={user.photoURL || "/avatar.png"} 
            alt={user.name} 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0 border border-[#dadce0] bg-[#f8f9fc]" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=e8f0fe&color=1a73e8`;
            }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[14px] md:text-[15px] font-bold whitespace-nowrap ${isTop3 ? 'text-[#202124]' : 'text-[#3c4043]'}`}>
              {user.name || "Anonymous"}
            </span>
            {isCurrentUser && (
              <span className="bg-[#1a73e8] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                You
              </span>
            )}
          </div>
        </div>
      </td>

      {tab === "facilitator" ? (
        <>
          <td className="px-4 md:px-6 py-4 md:py-5 align-middle whitespace-nowrap">
            <div className="flex items-center gap-2 text-[#5f6368] font-bold text-[12px] md:text-[13px]">
              <Award className="w-4 h-4 text-[#1a73e8]" />
              {user.badges}
            </div>
          </td>
          <td className="px-4 md:px-6 py-4 md:py-5 text-right align-middle whitespace-nowrap">
            <span className={`inline-flex items-center gap-1.5 text-[11px] md:text-[12px] font-bold px-3 py-1.5 rounded-full ${
              user.milestone?.includes("Ultimate") ? "bg-[#fff8e1] text-[#e37400] ring-1 ring-[#fce8b2]" :
              user.milestone?.includes("Milestone 3") ? "bg-[#e6f4ea] text-[#0d652d] ring-1 ring-[#ceead6]" :
              user.milestone?.includes("Milestone 2") ? "bg-[#e8f0fe] text-[#1a73e8] ring-1 ring-[#d2e3fc]" :
              user.milestone?.includes("Milestone 1") ? "bg-[#f8f9fc] text-[#5f6368] ring-1 ring-[#dadce0]" :
              "bg-transparent text-[#9aa0a6]"
            }`}>
              {user.milestone?.includes("Ultimate") && <Shield className="w-3 h-3 md:w-3.5 md:h-3.5" />}
              {user.milestone}
            </span>
          </td>
        </>
      ) : (
        <td className="px-4 md:px-6 py-4 md:py-5 text-right align-middle whitespace-nowrap">
          <span className={`text-[15px] md:text-[16px] font-black ${isTop3 ? 'text-[#1a73e8]' : 'text-[#202124]'}`}>
            {user.points?.toLocaleString() ?? 0}
          </span>
        </td>
      )}
    </tr>
  );
}