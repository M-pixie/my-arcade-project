"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 
import { subscribeLeaderboard, savePublicUserToLeaderboard } from "@/lib/leaderboard"; 
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]); 
  
  const [historyFilter, setHistoryFilter] = useState("All Games");
  const [searchQuery, setSearchQuery] = useState("");

  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userUniqueId, setUserUniqueId] = useState<string | null>(null); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [realRank, setRealRank] = useState<number | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null); 
  const [copiedReferral, setCopiedReferral] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const [showYouText, setShowYouText] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [hideModals, setHideModals] = useState(false);

  // 🔥 PREMIUM DARK MODE STATE 🔥
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load Dark Mode Preference
    const savedTheme = localStorage.getItem("arcade_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    }

    if (localStorage.getItem("hide_arcade_banners") === "true") {
      setHideModals(true);
    }

    const intervalText = setInterval(() => {
      setShowYouText((prev) => !prev);
    }, 1000);
    
    const intervalSub = setInterval(() => {
      setShowSubscribe((prev) => !prev);
    }, 5000);

    return () => {
      clearInterval(intervalText);
      clearInterval(intervalSub);
    };
  }, []);

  // Toggle Function for Dark Mode
  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("arcade_theme", newTheme ? "dark" : "light");
  };

  const julyLabs = [
    {
      id: 'voyage', title: 'Arcade Voyage', subtitle: 'Practice as you go.', image: 'https://services.google.com/fh/files/misc/voyuge-aug.png', accessCode: '1q-sheets-29185', points: 1, link: 'https://www.skills.google/games/7398', matchStrings: ['Arcade Voyage: Google Sheets']
    },
    {
      id: 'adventure', title: 'Arcade Adventure', subtitle: 'Play. Explore. Learn.', image: 'https://services.google.com/fh/files/misc/adv-aug.png', accessCode: '1q-datamgt-92372', points: 1,  link: 'https://www.skills.google/games/7395', matchStrings: ['Arcade Adventure: Data Vault']
    },
    {
      id: 'trail', title: 'Arcade Trail', subtitle: 'Build through hands-on.', image: 'https://services.google.com/fh/files/misc/trail-aug.png', accessCode: '1q-delivery-31058', points: 1,  link: 'https://www.skills.google/games/7396', matchStrings: ['Arcade Trail: Cloud Delivery Systems']
    },
    {
      id: 'basecamp', title: 'Arcade Base Camp', subtitle: 'Gain essential Google Cloud skills', image: 'https://services.google.com/fh/files/misc/bc-aug.png', accessCode: '1q-basecamp-10219', points: 1,  link: 'https://www.skills.google/games/7394', matchStrings: ['Arcade Base Camp August 2026']
    },
    {
      id: 'data mesh', title: 'Arcade Simulator: Network Security', subtitle: 'Data Mesh Architect !', image: 'https://services.google.com/fh/files/misc/simulater-aug.png', accessCode: '1q-network-51470', points: 1,  link: 'https://www.skills.google/games/7397', matchStrings: ['Arcade Simulator: Network Security Engineer']
    },
    {
      id: 'safe', title: 'Spans and Plans', subtitle: 'Google Skills', image: 'https://services.google.com/fh/files/misc/special-aug.png', accessCode: '1q-schema-27083', points: 1,  link: 'https://www.skills.google/games/7399', matchStrings: ['Spans and Plans']

    },
    {
      id: 're trail', title: 'Arcade Re-Trail: Vaults & Vectors', subtitle: 'Arcade Re-trail', image: 'https://services.google.com/fh/files/misc/arcade_retrail_aug2026.png', accessCode: '1q-vaults-39213', points: 1,  link: 'https://www.skills.google/games/7426', matchStrings: ['Arcade Re-Trail: Vaults & Vectors']

    }

  ];

  const augustLabs = [];

  const allFacilitatorLabs = [...julyLabs, ...augustLabs];

  const arcadeTiersData = [
    { name: 'Arcade Trooper', target: 50, image: 'https://services.google.com/fh/files/misc/arcade-trooper.svg', gradient: 'from-[#8ab4f8] to-[#1a73e8]', spots: '6000 spots' },
    { name: 'Arcade Ranger', target: 75, image: 'https://services.google.com/fh/files/misc/arcade-ranger.svg', gradient: 'from-[#81c995] to-[#34a853]', spots: '4000 spots' },
    { name: 'Arcade Champion', target: 95, image: 'https://services.google.com/fh/files/misc/arcade-champion.svg', gradient: 'from-[#fde293] to-[#f9ab00]', spots: '3000 spots' },
    { name: 'Arcade Legend', target: 120, image: 'https://services.google.com/fh/files/misc/arcade-legend.svg', gradient: 'from-[#f28b82] to-[#ea4335]', spots: '2500 spots' }
  ];

  const getCurrentTier = () => {
    if (points === null || points < 50) return "Swag Eligibility Pending";
    const achieved = [...arcadeTiersData].reverse().find(t => points >= t.target);
    return achieved ? achieved.name : "Swag Eligibility Pending";
  };

  const isLabCompleted = (matchStrings: string[]) => {
    if (!history || history.length === 0) return false;
    return history.some(item =>
      matchStrings.some(match => item.name.toLowerCase().includes(match.toLowerCase()))
    );
  };

  const pendingLabs = julyLabs.filter(lab => !isLabCompleted(lab.matchStrings));
  const completedLabs = julyLabs.filter(lab => isLabCompleted(lab.matchStrings));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("GCAF26-IN-9SC-AE9");
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const loadDataFromCache = (data: any) => {
    setPoints(data.points);
    setBreakdown(data.breakdown);
    setHistory(data.history || []);
    setUserName(data.userName);
    setUserAvatar(data.userAvatar);
    setUserUniqueId(data.userUniqueId);
    setLastRefreshed(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setLoading(false);
  };

  useEffect(() => {
    const targetUrl = localStorage.getItem("current_processing_url");
    const cachedDataString = localStorage.getItem("arcade_user_data");
    let cachedData = null;

    if (cachedDataString) {
      try {
        cachedData = JSON.parse(cachedDataString);
      } catch (e) {
        console.error("Failed to parse cached data");
      }
    }

    if (targetUrl) {
      setProfileUrl(targetUrl);
      if (cachedData && cachedData.profileUrl === targetUrl) {
        loadDataFromCache(cachedData);
        fetchDataAndCalculate(targetUrl, true);
      } else {
        fetchDataAndCalculate(targetUrl, false);
      }
    } else if (cachedData) {
      setProfileUrl(cachedData.profileUrl);
      loadDataFromCache(cachedData);
      fetchDataAndCalculate(cachedData.profileUrl, true);
    } else {
      router.push("/calculator"); 
    }
  }, []);

  useEffect(() => {
    if (!userUniqueId) {
      setRealRank(null);
      return;
    }
    const unsub = subscribeLeaderboard((leaders: any[]) => {
      setLeaderboardData(leaders); 
      const me = leaders.find((l: any) => l.id === userUniqueId);
      if (me && me.rank) {
        setRealRank(me.rank);
      } else {
        setRealRank(null);
      }
    });
    return () => unsub();
  }, [userUniqueId, points]);

  const fetchDataAndCalculate = async (url: string, isSilent: boolean = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch("/api/calculate", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (!isSilent) setError(data.error || "Failed to calculate points.");
        if (!isSilent) setLoading(false);
        return;
      }

      setPoints(data.totalPoints);
      setBreakdown(data.breakdown);
      if (data.completionHistory) setHistory(data.completionHistory);
      if (data.userName) setUserName(data.userName);
      if (data.userAvatar) setUserAvatar(data.userAvatar);
      
      const extractedId = url.trim().split('/').pop() || null;
      setUserUniqueId(extractedId);
      setLastRefreshed(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

      const cacheObj = {
        profileUrl: url.trim(),
        points: data.totalPoints,
        breakdown: data.breakdown,
        history: data.completionHistory || [],
        userName: data.userName || null,
        userAvatar: data.userAvatar || null,
        userUniqueId: extractedId
      };
      localStorage.setItem("arcade_user_data", JSON.stringify(cacheObj));

      try {
        await savePublicUserToLeaderboard({
          name: data.userName || "Arcade Player",
          photoURL: data.userAvatar || "/avatar.png",
          points: data.totalPoints,
          profileUrl: url.trim()
        });
      } catch (saveErr) {
        console.error("Leaderboard Auto-Save Failed:", saveErr);
      }

    } catch (err) {
      if (!isSilent) setError("Please check your internet connection and try again.");
    } finally {
      if (!isSilent) setLoading(false);
      localStorage.removeItem("current_processing_url"); 
    }
  };

  const getMemberSinceYear = () => {
    if (!history || history.length === 0) return "2026";
    const years = history.map(h => new Date(h.date).getFullYear()).filter(y => !isNaN(y));
    return years.length > 0 ? Math.min(...years).toString() : "2026";
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const websiteUrl = "https://arcade-calculator.vercel.app/calculator"; 

  const shareToWhatsApp = () => {
    const text = `🔥 Yooo! I just reached *${points} points* on the Google Cloud Arcade 2026! 🚀\n\n👤 *Name:* ${userName || "Arcade Player"}\n🎯 *Points:* ${points}\n🔗 *My Public Profile:* ${profileUrl}\n\nCheck your own points and track your swags easily using this awesome Calculator:\n${websiteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const downloadCSV = () => {
    if (history.length === 0) return;
    let csv = "Serial,Lab / Badge Name,Earned Date,Points\n";
    history.forEach((item, i) => {
      const safeName = item.name.replace(/"/g, '""');
      csv += `${i + 1},"${safeName}","${item.date}",${item.points}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${userName ? userName.replace(/\s+/g, '_') : 'Arcade'}_History_2026.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (historyFilter === "Arcade Games") {
      const lowerName = item.name.toLowerCase();
      const isSkillBadge = item.type === 'Skill Badge' || lowerName.includes('badge');
      const isCourse = item.type === 'Course' || lowerName.includes('course');
      return !isSkillBadge && !isCourse;
    }
    
    if (historyFilter === "Skill Badges") {
      return item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge');
    }
    
    if (historyFilter === "Labs free course") {
      return item.type === 'Course' || item.name.toLowerCase().includes('course');
    }

    if (historyFilter === "Facilitator Progress History") {
      const lowerName = item.name.toLowerCase();
      const isBadge = item.type === 'Skill Badge' || lowerName.includes('badge');
      const isCourse = item.type === 'Course' || lowerName.includes('course');
      const isGame = !isBadge && !isCourse;
      
      const cleanDate = item.date.replace(/Earned/i, '').trim();
      const earnedDate = new Date(cleanDate);
      const targetStartDate = new Date("2026-07-14T00:00:00");
      
      if (isBadge || isGame) {
        return earnedDate >= targetStartDate; 
      }
      return false; 
    }

    return true; 
  });

  const totalSkillBadgesCount = breakdown?.skills || history.filter(item => item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge')).length;
  const totalArcadeGamesCount = history.filter(item => {
    const lower = item.name.toLowerCase();
    const isBadge = item.type === 'Skill Badge' || lower.includes('badge');
    const isCourse = item.type === 'Course' || lower.includes('course');
    return !isBadge && !isCourse;
  }).length;

  const facilitatorArcadeGamesCount = history.filter(item => {
    const lower = item.name.toLowerCase();
    const isBadge = item.type === 'Skill Badge' || lower.includes('badge');
    const isCourse = item.type === 'Course' || lower.includes('course');
    const isGame = !isBadge && !isCourse;
    
    if (!isGame) return false;

    const cleanDate = item.date.replace(/Earned/i, '').trim();
    const earnedDate = new Date(cleanDate);
    const targetStartDate = new Date("2026-07-14T00:00:00");
    return earnedDate >= targetStartDate;
  }).length;

  const facilitatorSkillBadgesCount = history.filter(item => {
    const isBadge = item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge');
    if (!isBadge) return false;

    const cleanDate = item.date.replace(/Earned/i, '').trim();
    const earnedDate = new Date(cleanDate);
    const targetStartDate = new Date("2026-07-14T00:00:00");
    return earnedDate >= targetStartDate;
  }).length;

  const facilitatorMilestones = [
    { id: 1, title: 'Milestone 1', targetArcade: 6, targetSkills: 18, points: 5 },
    { id: 2, title: 'Milestone 2', targetArcade: 8, targetSkills: 34, points: 15 },
    { id: 3, title: 'Milestone 3', targetArcade: 10, targetSkills: 50, points: 25 },
    { id: 4, title: 'Ultimate Milestone', targetArcade: 12, targetSkills: 66, points: 35 }
  ];

  const achievedMilestone = [...facilitatorMilestones].reverse().find(
    (m) => facilitatorArcadeGamesCount >= m.targetArcade && facilitatorSkillBadgesCount >= m.targetSkills
  );
  
  const milestoneText = achievedMilestone ? achievedMilestone.title : "No Milestones Yet";

  const nextMilestone = facilitatorMilestones.find(
    (m) => facilitatorArcadeGamesCount < m.targetArcade || facilitatorSkillBadgesCount < m.targetSkills
  );

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans relative transition-colors duration-300 ${isDark ? 'bg-[#0a0a0b] text-gray-200' : 'bg-[#f8f9fa] text-[#202124]'}`}>
      <Navbar />

      <main className="w-full mx-auto px-6 pt-24 pb-16 flex flex-col items-center">
        
        <div className="w-full max-w-[1350px]">
          {points !== null && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative animate-fade-in-up">
              
              <div className="lg:col-span-4 flex flex-col w-full lg:pr-6">
                
                 <div className={`rounded-xl shadow-sm border overflow-hidden relative flex flex-col transition-all duration-300 w-full min-h-[640px] ${isDark ? 'bg-[#15171b] border-[#2a2d32]' : 'bg-white border-[#e8eaed]'}`}>
                 
                 {/* 🔥 UPDATED TO SOLID PREMIUM BLUE GRADIENT 🔥 */}
                 <div className="bg-gradient-to-r from-[#4285F4] to-[#1a73e8] py-5 text-center relative overflow-hidden">
                   <h3 className="font-bold text-[36px] sm:text-[39px] tracking-normal relative z-10 text-white drop-shadow-md">
                     Arcade Points: {points}
                   </h3>
                 </div>
                 
                 <div className="px-8 pt-8 pb-10 flex flex-col items-center relative flex-grow">
                   
                   <div className="w-[120px] h-[120px] rounded-full p-[4px] mb-5 relative transform transition-transform hover:scale-105 shadow-md flex items-center justify-center" style={{ background: 'conic-gradient(#4285F4 0deg 90deg, #DB4437 90deg 180deg, #F4B400 180deg 270deg, #0F9D58 270deg 360deg)' }}>
                     <div className={`w-full h-full rounded-full border-[4px] flex items-center justify-center overflow-hidden ${isDark ? 'bg-[#1a1b1e] border-[#1a1b1e]' : 'bg-[#1a73e8] border-white'}`}>
                       {userAvatar ? (
                         <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-5xl font-bold text-white">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                       )}
                     </div>
                   </div>
                   
                   <h2 className={`text-[26px] font-black mb-4 text-center tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                     {userName || "Arcade Player"}
                   </h2>

                   <button 
                     onClick={handleCopyProfile}
                     className={`text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2 mb-8 w-max mx-auto ${copied ? 'bg-[#34a853] text-white ring-2 ring-[#ceead6]' : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'}`}
                   >
                     {copied ? (
                       <>Copied <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></>
                     ) : (
                       <>Copy Profile <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></>
                     )}
                   </button>

                   <div className="flex justify-around w-full mb-8">
                     <div 
                       onClick={() => document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} 
                       className="cursor-pointer text-center group transition-transform hover:scale-105"
                     >
                       <div className={`text-[28px] font-black ${isDark ? 'text-white' : 'text-[#202124]'}`}>{history.filter(item => item.type !== 'Skill Badge').length}</div>
                       <div className={`text-[13px] font-bold uppercase tracking-wide mt-1 ${isDark ? 'text-[#8e949c]' : 'text-[#202124]'}`}>All Games</div>
                     </div>
                     <div className={`w-px h-full mx-2 ${isDark ? 'bg-[#2a2d32]' : 'bg-[#dadce0]'}`}></div>
                     <div 
                       onClick={() => router.push('/resources#completed-section')} 
                       className="cursor-pointer text-center group transition-transform hover:scale-105"
                     >
                       <div className={`text-[28px] font-black ${isDark ? 'text-white' : 'text-[#202124]'}`}>{totalSkillBadgesCount}</div>
                       <div className={`text-[13px] font-bold uppercase tracking-wide mt-1 ${isDark ? 'text-[#8e949c]' : 'text-[#202124]'}`}>Skill Badges</div>
                     </div>
                   </div>

                   <div className={`text-center font-bold text-lg mb-6 ${isDark ? 'text-[#fbbc04]' : 'text-[#b8860b]'}`}>
                     {points !== null && points >= 50 ? getCurrentTier() : "User Progress Report"}
                   </div>

                   <div className="flex w-full gap-3 mb-6">
                     <button 
                       onClick={() => router.push('/leaderboard')}
                       className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold py-2.5 px-4 rounded-full shadow-sm transition-all text-sm flex items-center justify-center"
                     >
                       Rank {realRank || "-"}
                     </button>
                   </div>

                   <div className={`text-[16px] md:text-[17px] font-black text-[#1a73e8] border-t pt-8 w-full text-center mt-auto tracking-wide uppercase drop-shadow-sm ${isDark ? 'border-[#2a2d32]' : 'border-[#e8eaed]'}`}>
                     {(breakdown?.bonus && breakdown.bonus > 0) ? (
                       <>Total : <span className="text-[#1a73e8] font-black">{(points || 0) - breakdown.bonus}</span> + <span className="text-[#1a73e8] font-black">{breakdown.bonus}</span> Bonus Points</>
                     ) : (
                       <>Member since <span className="text-[#1a73e8] font-black">{getMemberSinceYear()}</span></>
                     )}
                   </div>
                 </div>
                </div>

              <div className={`mt-6 rounded-xl shadow-sm border p-6 text-center flex flex-col justify-center transition-all hover:shadow-md ${isDark ? 'bg-[#15171b] border-[#2a2d32]' : 'bg-white border-[#dadce0]'}`}>
                 <h4 className={`text-[13px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                   Facilitator Progress
                 </h4>
                 <div className="flex flex-col items-center justify-center gap-1.5">
                   <div className="inline-flex items-center justify-center gap-2">
                     {achievedMilestone ? (
                       <>
                         <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         <span className={`text-xl font-bold ${isDark ? 'text-[#81c995]' : 'text-[#137333]'}`}>{milestoneText}</span>
                       </>
                     ) : (
                       <span className={`text-sm font-bold px-4 py-1.5 rounded-none ${isDark ? 'text-[#f28b82] bg-[#3c1e1e]' : 'text-[#ea4335] bg-[#fce8e6]'}`}>
                         {milestoneText}
                       </span>
                     )}
                   </div>
                   {achievedMilestone && (
                     <span className={`text-[14px] font-extrabold tracking-wide ${isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]'}`}>
                       +{achievedMilestone.points} Bonus Points
                     </span>
                   )}
                 </div>
               </div>

              </div>

              {/* Right Side: Facilitator Program & Quick Actions */}
              <div className="lg:col-span-8 flex flex-col w-full h-full">
                
                <div className="mb-8 w-full flex-grow">
                  
                  <div className={`mb-6 p-5 sm:p-6 rounded-2xl border shadow-sm relative overflow-hidden flex flex-col justify-between gap-4 transition-all hover:shadow-md ${isDark ? 'bg-[#15171b] border-[#2a2d32]' : 'bg-white border-[#dadce0]'}`}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      {/* Left Header Info */}
                      <div className="flex-1 w-full">
                        <div className="flex-1 w-full">
                      <h3
                        className={`text-base font-medium mb-2 ${
                        isDark ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`}
                             >Facilitator progress</h3>
                          </div>
                        
                        <h2 className={`text-base md:text-lg font-bold flex items-center flex-wrap gap-2 ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                          {achievedMilestone ? (
                            <>
                              Congratulations <span className="px-3 py-0.5 rounded-full text-sm font-normal shadow-sm bg-[#1a73e8] text-white">{achievedMilestone.title}</span>
                            </>
                          ) : (
                            <>
                             Keep Moving Forward <span className="px-3 py-0.5 rounded-full text-sm font-normal shadow-sm bg-[#1a73e8] text-white">{nextMilestone?.title}</span> 
                            </>
                          )}
                        </h2>
                      </div>

                      {/* Right Action Buttons */}
                      <div className={`shrink-0 flex items-center gap-3 p-1.5 rounded-full border shadow-sm ${isDark ? 'bg-[#1a1c21] border-[#3c4043]' : 'bg-gray-50 border-[#e8eaed]'}`}>
                        <button 
                          onClick={() => {
                            if (profileUrl) {
                              fetchDataAndCalculate(profileUrl, false);
                            } else {
                              window.location.reload();
                            }
                          }}
                          disabled={loading}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-[#2a2d32]' : 'hover:bg-[#e8eaed]'}`}
                          title="Click to refresh progress"
                        >
                          <svg className={`w-4 h-4 ${loading ? 'animate-spin text-[#0284c7]' : 'text-[#34a853]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className={`text-[11px] font-bold ${loading ? 'text-[#0284c7]' : (isDark ? 'text-[#81c995]' : 'text-[#137333]')}`}>
                            {loading ? 'Refreshing' : 'Synced'}
                          </span>
                        </button>
                        <div className={`w-px h-4 ${isDark ? 'bg-[#3c4043]' : 'bg-[#dadce0]'}`}></div>
                        <button
                          onClick={toggleDarkMode}
                          className={`p-1.5 mr-1 rounded-full transition-colors ${isDark ? 'hover:bg-[#3c4043] text-gray-200' : 'hover:bg-[#dadce0] text-orange-500'}`}
                          title="Toggle Dark Mode"
                        >
                          {isDark ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className={`w-full h-px ${isDark ? 'bg-[#2a2d32]' : 'bg-[#f1f3f4]'}`}></div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
                      {/* Games, Badges & Milestone Compact Grid */}
                      <div className="flex items-center gap-5 shrink-0 w-full lg:w-auto justify-center lg:justify-start">
                        <div className="flex flex-col items-center lg:items-start">
                          <span className={`text-[22px] font-black leading-none ${isDark ? 'text-white' : 'text-[#202124]'}`}>{facilitatorArcadeGamesCount}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Games</span>
                        </div>
                        <div className={`w-px h-8 ${isDark ? 'bg-[#3c4043]' : 'bg-[#e8eaed]'}`}></div>
                        <div className="flex flex-col items-center lg:items-start">
                          <span className={`text-[22px] font-black leading-none ${isDark ? 'text-white' : 'text-[#202124]'}`}>{facilitatorSkillBadgesCount}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Badges</span>
                        </div>
                        <div className={`w-px h-8 ${isDark ? 'bg-[#3c4043]' : 'bg-[#e8eaed]'}`}></div>
                        <div className="flex flex-col items-center lg:items-start">
                          <span className={`text-[15px] font-bold text-[#1a73e8] leading-tight`}>{achievedMilestone ? achievedMilestone.title : "None Yet"}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Milestone</span>
                        </div>
                      </div>

                      {/* Middle: Points & Swags */}
                      <div className="flex items-center justify-center gap-5 flex-1 w-full lg:w-auto border-y py-3 lg:border-y-0 lg:py-0 border-dashed border-[#dadce0] dark:border-[#3c4043]">
                        <div className="flex flex-col text-center">
                          <span className="text-[10px] uppercase tracking-wider opacity-70">Total Points</span>
                          <span className={`text-[17px] font-black ${isDark ? 'text-white' : 'text-black'}`}>{points || 0}</span>
                        </div>
                        <div className={`w-px h-8 ${isDark ? 'bg-[#3c4043]' : 'bg-[#dadce0]'}`}></div>
                        <div className="flex flex-col text-center">
                          <span className="text-[10px] uppercase tracking-wider opacity-70">Swags Tier</span>
                          <span className={`text-[17px] font-black ${isDark ? 'text-[#81c995]' : 'text-[#137333]'}`}>{points !== null && points >= 50 ? getCurrentTier() : "Pending"}</span>
                        </div>
                      </div>

                      {/* Right Side: Avatar + Name (Google style) */}
                      <div className="flex items-center justify-center lg:justify-end gap-3 shrink-0 w-full lg:w-auto">
                        <span className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-[#202124]'}`}>{userName || "Arcade Player"}</span>
                        <div className="w-10 h-10 rounded-full p-[2.5px] shadow-sm flex items-center justify-center" style={{ background: 'conic-gradient(#4285F4 0deg 90deg, #DB4437 90deg 180deg, #F4B400 180deg 270deg, #0F9D58 270deg 360deg)' }}>
                          <div className={`w-full h-full rounded-full border-[2px] overflow-hidden flex items-center justify-center ${isDark ? 'bg-[#1a1b1e] border-[#1a1b1e]' : 'bg-white border-white'}`}>
                            {userAvatar ? (
                               <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                               <span className="text-white font-bold text-sm bg-[#1a73e8] w-full h-full flex items-center justify-center">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Required Tag */}
                    {!achievedMilestone && nextMilestone && (
                      <div className={`text-[11px] font-semibold flex flex-wrap justify-center lg:justify-end gap-1.5 items-center mt-2 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                        <span className="text-[#0284c7]">Action Required:</span> 
                        {facilitatorArcadeGamesCount < nextMilestone.targetArcade && (
                          <span className="text-[#ea4335] bg-[#fce8e6] dark:bg-[#ea4335]/10 px-1.5 py-0.5 rounded border border-[#fce8e6] dark:border-[#ea4335]/20">
                            {nextMilestone.targetArcade - facilitatorArcadeGamesCount} Games
                          </span>
                        )}
                        {facilitatorSkillBadgesCount < nextMilestone.targetSkills && (
                          <span className="text-[#ea4335] bg-[#fce8e6] dark:bg-[#ea4335]/10 px-1.5 py-0.5 rounded border border-[#fce8e6] dark:border-[#ea4335]/20">
                            {nextMilestone.targetSkills - facilitatorSkillBadgesCount} Badges
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                  
                  <div className="relative w-full">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                      {facilitatorMilestones.map((milestone, index) => {
                        const arcadeProgress = Math.min(100, (facilitatorArcadeGamesCount / milestone.targetArcade) * 100);
                        const skillsProgress = Math.min(100, (facilitatorSkillBadgesCount / milestone.targetSkills) * 100);
                        const isAchieved = facilitatorArcadeGamesCount >= milestone.targetArcade && facilitatorSkillBadgesCount >= milestone.targetSkills;
                        const totalPercent = Math.floor((arcadeProgress + skillsProgress) / 2);
                        
                        const isHighestAchieved = achievedMilestone && achievedMilestone.id === milestone.id;
                        const isPreviouslyAchieved = isAchieved && !isHighestAchieved;

                       const cardStyle = isAchieved ? (isDark ? 'bg-[#15171b] border-2 border-[#7f8489]' : 'bg-white border-2 border-[#9aa0a6]') 
                      : (isDark ? 'bg-[#15171b] border border-[#3c4043]' : 'bg-white border border-[#dadce0]');

                        return (
                          <div key={milestone.id} className={`${cardStyle} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex justify-between items-center mb-5">
                              <h3 className={`font-bold text-lg leading-none ${isDark ? 'text-gray-100' : 'text-[#202124]'}`}>{milestone.title}</h3>
                              <span className={`text-[12px] font-bold px-3 py-1 rounded-full border shadow-sm ${isDark ? 'bg-[#0d2214] text-[#81c995] border-[#1e3b29]' : 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'}`}>
                                {isAchieved ? '100%' : `${totalPercent}%`}
                              </span>
                            </div>

                            <div className="space-y-4 mb-6">
                              <div>
                                <div className="flex justify-between text-[15px] font-bold mb-2">
                                  <span className={isDark ? 'text-gray-300' : 'text-[#202124]'}>Arcade Games</span> 
                                  <span className={isDark ? 'text-gray-300' : 'text-[#202124]'}>{Math.min(facilitatorArcadeGamesCount, milestone.targetArcade)} / {milestone.targetArcade}</span>
                                </div>
                                <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDark ? 'bg-[#2a2d32] border-[#3c4043]' : 'bg-[#e5e7eb] border-[#dadce0]'}`}>
                                  <div className="bg-[#1a73e8] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${arcadeProgress}%` }}></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[15px] font-bold mb-2">
                                  <span className={isDark ? 'text-gray-300' : 'text-[#202124]'}>Skill Badges </span> 
                                  <span className={isDark ? 'text-gray-300' : 'text-[#202124]'}>{Math.min(facilitatorSkillBadgesCount, milestone.targetSkills)} / {milestone.targetSkills}</span>
                                </div>
                                <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDark ? 'bg-[#2a2d32] border-[#3c4043]' : 'bg-[#e5e7eb] border-[#dadce0]'}`}>
                                  <div className="bg-[#34a853] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${skillsProgress}%` }}></div>
                                </div>
                              </div>
                            </div>

                            <div className={`pt-4 border-t flex justify-between items-center min-h-[50px] ${isDark ? 'border-[#3c4043]' : 'border-[#f1f3f4]'}`}>
                              <span className={`font-bold text-[14px] lg:text-[15px] ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>Milestone Rewards</span>
                              
                              {isHighestAchieved ? (
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-end">
                                    <span className={`text-[15px] md:text-[17px] font-extrabold leading-tight ${isDark ? 'text-[#81c995]' : 'text-[#137333]'}`}>
                                      +{milestone.points} Bonus Pts
                                    </span>
                                    <span className={`text-[12px] font-bold leading-none mt-0.5 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                                      + {milestone.targetArcade} Game Pts
                                    </span>
                                  </div>
                                  <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ring-2 shadow-md flex items-center justify-center ${isDark ? 'border-[#1a1b1e] ring-[#81c995] bg-[#0d47a1]' : 'border-white ring-[#34a853] bg-[#137333]'}`}>
                                    {userAvatar ? (
                                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-white font-bold text-lg">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                                    )}
                                  </div>
                                </div>
                              ) : isPreviouslyAchieved ? (
                                <span className={`font-bold text-[15px] ${isDark ? 'text-gray-400' : 'text-[#202124]'}`}>{milestone.title} Done</span>
                              ) : (
                                <span className={`font-bold text-[15px] ${isDark ? 'text-gray-400' : 'text-[#202124]'}`}>Not Yet</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 🔥 UPDATED TO 3 RESPONSIVE BLUE BUTTONS 🔥 */}
                <div className="w-full mt-auto pt-8 flex flex-col items-center">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <button onClick={() => router.push('/calculator')} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      Points Calculator
                    </button>

                    <button onClick={shareToWhatsApp} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.002 0h-.004C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.543 5.867L.085 23.316l5.59-1.464C7.382 22.84 9.614 23.4 12 23.4c6.627 0 12-5.373 12-12S18.627 0 12.002 0zm0 21.45c-1.802 0-3.535-.466-5.1-1.348l-.366-.217-3.793.994.996-3.698-.238-.378A9.452 9.452 0 012.55 12c0-5.215 4.236-9.45 9.452-9.45s9.45 4.235 9.45 9.45-4.234 9.45-9.45 9.45zm5.198-6.85c-.285-.143-1.685-.83-1.946-.925-.262-.095-.453-.143-.643.143-.19.285-.736.925-.903 1.115-.166.19-.333.214-.618.071-.286-.143-1.203-.443-2.292-1.25-.848-.628-1.42-1.405-1.586-1.69-.167-.285-.018-.439.125-.582.129-.128.286-.333.428-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.643-1.552-.88-2.124-.233-.556-.47-.48-.643-.489-.166-.008-.357-.008-.547-.008-.19 0-.5.071-.762.357-.262.285-1 .975-1 2.378s1.024 2.758 1.167 2.948c.143.19 2.012 3.072 4.872 4.306.68.293 1.213.468 1.626.598.683.214 1.305.183 1.794.111.547-.08 1.685-.688 1.923-1.353.238-.665.238-1.235.166-1.353-.071-.119-.262-.19-.547-.333z"/></svg>
                      Share Points
                    </button>
                    
                    <button onClick={() => router.push('/resources')} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" /></svg>
                      Skill Badges List
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[1350px] mt-12 space-y-12">
          
          {points !== null && (
            <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.21s' }}>
              <div className={`flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b pb-4 ${isDark ? 'border-[#2a2d32]' : 'border-[#dadce0]'}`}>
                <h4 className={`text-2xl font-extrabold tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  Arcade Prize Tiers
                </h4>
                <span className={`text-base font-medium ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                   <span className="font-bold">{getCurrentTier()}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {arcadeTiersData.map((tier, idx) => {
                  const progressPercentage = Math.min(100, (points / tier.target) * 100);
                  const isAchieved = points >= tier.target;
                  
                  return (
                    <div key={idx} className={`border rounded-xl py-8 px-5 flex flex-col items-center relative overflow-hidden shadow-md hover:shadow-lg transition-all group ${isAchieved ? 'border-[#34a853]' : (isDark ? 'border-[#3c4043]' : 'border-[#5f6368]')} ${isDark ? 'bg-[#1e1e24]' : 'bg-[#353840]'}`}>
                      
                      <div className="w-32 h-32 mb-6 mt-2 flex items-center justify-center relative">
                        <img src={tier.image} alt={tier.name} className="max-h-full object-contain z-10 group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      
                      <h5 className="text-xl font-bold text-white mb-4 text-center">{tier.name}</h5>
                      
                      <div className="w-full mt-auto flex flex-col gap-2">
                        <div className={`w-full h-2.5 rounded-full overflow-hidden border shadow-inner ${isDark ? 'bg-[#15171b] border-black/80' : 'bg-[#202124] border-black/50'}`}>
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${tier.gradient} transition-all duration-1000 ease-out`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px] font-extrabold uppercase tracking-wide w-full">
                           <span className={isAchieved ? "text-[#81c995]" : "text-[#9aa0a6]"}>
                             {isAchieved ? "Achieved" : "In Progress"}
                           </span>
                           <span className="text-[#e8eaed]">{points} / {tier.target} pts</span>
                        </div>
                        
                        <div className="mt-3 text-center w-full">
                          <span className="text-xs font-bold text-[#fbbc04] bg-[#fbbc04]/10 px-3 py-1.5 rounded-full border border-[#fbbc04]/20 tracking-wide block">
                             {tier.spots}
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {points !== null && (
            <div className="w-full animate-fade-in-up relative" style={{ animationDelay: '0.22s' }}>
              
              <div className={`w-full h-px mb-8 ${isDark ? 'bg-[#3c4043]' : 'bg-[#dadce0]'}`}></div>

              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h4 className={`text-sm sm:text-base font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  <span className="text-xl"></span> August Labs
                </h4>
              </div>

              <div className="relative flex items-center justify-between w-full px-2 sm:px-4 mt-6 mb-8">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 rounded-full z-0 ${isDark ? 'bg-[#2a2d32]' : 'bg-[#f1f3f4]'}`}></div>
                
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-[#34a853] to-[#137333] rounded-full z-0 transition-all duration-1000" 
                  style={{ width: `${(completedLabs.length / 7) * 100}%` }}
                ></div>

                {[...completedLabs, ...pendingLabs].map((lab, index) => {
                  const isCompleted = isLabCompleted(lab.matchStrings);
                  const isCurrent = !isCompleted && index === completedLabs.length;
                  
                  let shortName = lab.title;
                  if (lab.id === 'voyage') shortName = 'Arcade Voyage';
                  if (lab.id === 'adventure') shortName = 'Arcade Adventure';
                  if (lab.id === 'trail') shortName = 'Arcade Trail';
                  if (lab.id === 'basecamp') shortName = 'Arcade BaseCamp';
                  if (lab.id === 'Expressive') shortName = 'Expressive Efficiency';
                  if (lab.id === 'Skillup') shortName = 'Skill Up Summer';

                  return (
                    <div key={lab.id} className="relative z-10 flex flex-col items-center gap-2 px-1 w-1/6">
                      
                      <div className={`w-5 h-5 md:w-7 md:h-7 rounded-full border-[4px] shadow-sm flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'border-[#34a853] bg-[#e6f4ea]' 
                          : isCurrent 
                            ? (isDark ? 'border-[#fbbc04] bg-[#15171b] scale-110 ring-2 ring-[#fbbc04]/30' : 'border-[#fbbc04] bg-white scale-110 ring-2 ring-[#fbbc04]/30') 
                            : (isDark ? 'border-[#3c4043] bg-[#2a2d32]' : 'border-[#dadce0] bg-[#f8f9fa]')
                      }`}>
                        {isCompleted && (
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-[#137333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        
                        {isCurrent && (
                          <div className="relative flex items-center justify-center w-full h-full">
                             <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-[#fbbc04] rounded-full animate-ping opacity-60"></div>
                             <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#fbbc04] rounded-full relative z-10"></div>
                          </div>
                        )}
                      </div>

                      <span className={`absolute -top-6 text-xs md:text-sm font-medium whitespace-nowrap ${
                        isCompleted ? (isDark ? 'text-[#81c995]' : 'text-[#137333]') : isCurrent ? 'text-[#f29900]' : (isDark ? 'text-[#9aa0a6]' : 'text-[#9aa0a6]')
                      }`}>
                        {isCompleted ? 'Completed' : isCurrent ? 'Current' : `Lab ${index + 1}`}
                      </span>

                      <span className={`absolute -bottom-8 text-[11px] md:text-xs font-medium text-center w-full leading-tight hidden sm:block ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                        {shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className={`mt-10 sm:mt-12 w-full text-center border-t pt-4 ${isDark ? 'border-[#2a2d32]' : 'border-[#dadce0]'}`}>
                <span className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {completedLabs.length} / 7 August Labs Completed
                </span>
              </div>
            </div>
          )}

          {points !== null && (
            <div className="w-full animate-fade-in-up relative" style={{ animationDelay: '0.25s' }}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-4 ${isDark ? 'border-[#2a2d32]' : 'border-[#dadce0]'}`}>
                <h4 className={`text-2xl font-extrabold tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  August Labs
                </h4>
              </div>
              
              {pendingLabs.length > 0 && (
                <div className="mb-10">
                  <h5 className={`text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                     <span className="w-2 h-2 rounded-full bg-[#ea4335]"></span>
                     Pending Labs ({pendingLabs.length})
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {pendingLabs.map((lab) => (
                      <div key={`pending-${lab.id}`} className="flex flex-col items-center">
                        <h5 className={`text-[20px] lg:text-[22px] font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-black'}`}>{lab.title}</h5>
                        <p className={`text-[14px] font-bold mb-4 text-center ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>{lab.subtitle}</p>

                        <div className="mb-5 w-full max-w-[340px] flex justify-center items-center relative group">
                          <img 
                            src={lab.image} 
                            alt={lab.title} 
                            className="w-full object-contain rounded-[12px] shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 z-10" 
                          />
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-2 w-full">
                           <p className={`text-[14px] md:text-[15px] font-bold text-center m-0 ${isDark ? 'text-gray-300' : 'text-[#3c4043]'}`}>
                             Access code: {lab.accessCode}
                           </p>
                           <button onClick={() => handleCopyCode(lab.accessCode)} className={`transition-colors ${isDark ? 'text-[#9aa0a6] hover:text-[#8ab4f8]' : 'text-[#5f6368] hover:text-[#1a73e8]'}`} title="Copy Code">
                             {copiedCode === lab.accessCode ? (
                                <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                             ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                             )}
                           </button>
                        </div>
                        
                        <p className={`text-[14px] md:text-[15px] font-bold mb-5 text-center ${isDark ? 'text-gray-300' : 'text-[#3c4043]'}`}>
                          Arcade points: {lab.points}
                        </p>

                        <a 
                          href={lab.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[15px] py-2 px-8 rounded-full border transition-all shadow-sm inline-block text-center text-white bg-[#1a73e8] hover:bg-[#1557b0] border-[#1557b0]"
                        >
                          Start Lab
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedLabs.length > 0 && (
                <div>
                  <h5 className={`text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 ${isDark ? 'text-[#81c995]' : 'text-[#137333]'} ${pendingLabs.length > 0 ? (isDark ? 'pt-6 border-t border-[#2a2d32]' : 'pt-6 border-t border-[#dadce0]') : ''}`}>
                    <span className="w-2 h-2 rounded-full bg-[#34a853]"></span>
                    Completed Labs ({completedLabs.length})
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {completedLabs.map((lab) => (
                      <div key={`completed-${lab.id}`} className="flex flex-col items-center group">
                        <h5 className={`text-[20px] lg:text-[22px] font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-black'}`}>{lab.title}</h5>
                        <p className={`text-[14px] font-bold mb-4 text-center ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>{lab.subtitle}</p>

                        <div className="mb-5 w-full max-w-[340px] flex justify-center items-center relative group">
                          <img 
                            src={lab.image} 
                            alt={lab.title} 
                            className="w-full object-contain rounded-[12px] shadow-sm z-10" 
                          />
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-2 w-full">
                           <p className={`text-[14px] md:text-[15px] font-bold text-center m-0 ${isDark ? 'text-gray-300' : 'text-[#3c4043]'}`}>
                             Access code: {lab.accessCode}
                           </p>
                           <button 
  onClick={() => handleCopyCode(lab.accessCode)} 
  className={`transition-all flex items-center justify-center p-1.5 rounded-md ${isDark ? 'text-[#9aa0a6] hover:text-[#8ab4f8] hover:bg-[#2a2d32]' : 'text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe]'}`} 
  title="Copy Code"
>
  {copiedCode === lab.accessCode ? (
    <svg className="w-4 h-4 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  )}
</button>
                        </div>
                          
                        <p className={`text-[14px] md:text-[15px] font-bold mb-5 text-center ${isDark ? 'text-gray-300' : 'text-[#3c4043]'}`}>
                          Arcade points: {lab.points}
                        </p>

                        <a 
                          href={lab.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-bold text-[15px] py-2 px-8 rounded-full border transition-all shadow-sm inline-block text-center animate-pulse text-white ${isDark ? 'bg-[#137333] border-[#1e3b29] hover:bg-[#0f5c29]' : 'bg-[#34a853] border-[#137333] hover:bg-[#2b8c45]'}`}
                        >
                          COMPLETED
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {points !== null && (
            <div id="history-section" className="animate-fade-in-up scroll-mt-24 w-full" style={{animationDelay: '0.3s'}}>
              
              <div className={`w-full h-px mt-4 mb-10 ${isDark ? 'bg-[#3c4043]' : 'bg-[#dadce0]'}`}></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                
                <h4 className={`text-base font-extrabold uppercase tracking-wider flex items-center whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-[#3c4043]'}`}>
                  Completion Badges History
                </h4>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1 lg:justify-end">
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end mr-0 sm:mr-4">
                     <span className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm hidden md:inline-block">
                       Arcade Games: {totalArcadeGamesCount}
                     </span>
                     <span className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm hidden md:inline-block">
                       Skill Badges: {totalSkillBadgesCount}
                     </span>
                     
                     <button 
                       onClick={() => setHistoryFilter(historyFilter === "Facilitator Progress History" ? "All Games" : "Facilitator Progress History")}
                       className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm transition-all cursor-pointer ${
                         historyFilter === "Facilitator Progress History" 
                           ? "bg-[#137333] text-white ring-2 ring-[#34a853]" 
                           : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                       }`}
                     >
                       Facilitator Progress History
                     </button>
                  </div>

                  <div className="relative w-full sm:w-56">
                    <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                      type="text"
                      placeholder="Search labs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#1a73e8] transition-all shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043] text-white focus:border-[#1a73e8]' : 'bg-white border-[#dadce0] text-[#202124] focus:border-[#1a73e8]'}`}
                    />
                  </div>

                  <div className="relative w-full sm:w-44">
                    <select
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value)}
                      className={`w-full appearance-none pl-4 pr-10 py-2 border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#1a73e8] transition-all shadow-sm cursor-pointer ${isDark ? 'bg-[#15171b] border-[#3c4043] text-gray-200 focus:border-[#1a73e8]' : 'bg-white border-[#dadce0] text-[#3c4043] focus:border-[#1a73e8]'}`}
                    >
                      <option value="All Games">All Games</option>
                      <option value="Arcade Games">Arcade Games</option>
                      <option value="Skill Badges">Skill Badges</option>
                      <option value="Labs free course">Labs Free Course</option>
                      <option value="Facilitator Progress History">Facilitator Progress</option>
                    </select>
                    <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>

                </div>
              </div>
              
              <div className="w-full mt-4">
                <div className="max-h-[2000px] overflow-y-auto custom-scrollbar pr-2">
                  {filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {filteredHistory.map((item, i) => (
                        <div key={i} className="flex flex-col items-center p-2 transition-all group hover:-translate-y-1">
                          
                          <div className="w-full h-40 mb-4 flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                              />
                            ) : (
                              <div className={`w-20 h-20 border rounded-full flex items-center justify-center text-3xl shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>🏅</div>
                            )}
                          </div>
                          
                          <h5 className={`text-[16px] font-bold text-center mb-1 line-clamp-2 ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                            {item.name}
                          </h5>
                          
                          <p className={`text-[14px] text-center mb-3 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                            {item.date.toLowerCase().includes('earned') ? item.date : `Earned ${item.date}`}
                          </p>
                          
                          <div className="mt-auto pt-2">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'} ${item.points >= 2 ? (isDark ? 'text-[#81c995]' : 'text-[#137333]') : item.points === 1 ? (isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]') : 'text-[#9334e6]'}`}>
                              +{item.points} {item.points > 1 ? 'Points' : 'Point'}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-12 text-center font-medium text-lg ${isDark ? 'text-[#9aa0a6]' : 'text-[#9aa0a6]'}`}>
                      No labs found matching your filter criteria.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 mb-4 text-center w-full animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <a 
              href="https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`font-medium text-sm cursor-default no-underline ${isDark ? 'text-[#9aa0a6] hover:text-[#9aa0a6]' : 'text-[#5f6368] hover:text-[#5f6368]'}`}
            >
              You can also explore full Arcade Prize Tiers details here.
            </a>
          </div>
        </div>

      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDark ? '#3c4043' : '#dadce0'}; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${isDark ? '#5f6368' : '#bdc1c6'}; }
        
        .banner-slide-down {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideDown {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(1px, -2px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0px, 2px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2px, -1px); }
        }

        @keyframes wiggle-sunglasses {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          50% { transform: rotate(5deg) translateY(-3px); }
        }
        .animate-cool-emoji {
          display: inline-block;
          animation: wiggle-sunglasses 2s ease-in-out infinite;
        }

        @keyframes sad-wiggle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }
        .animate-sad-emoji {
          display: inline-block;
          animation: sad-wiggle 3s ease-in-out infinite;
        }

        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 4.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}