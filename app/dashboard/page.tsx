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

  useEffect(() => {
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

  const aprilLabs = [
    {
      id: 'voyage', title: 'Arcade Voyage', subtitle: 'Practice as you go.', image: 'https://services.google.com/fh/files/misc/voyuge-july.png', accessCode: '1q-bucket-58231', points: 1, link: 'https://www.skills.google/games/7315', matchStrings: ['Arcade Voyage: Cloud Storage and Data Governance']
    },
    {
      id: 'adventure', title: 'Arcade Adventure', subtitle: 'Play. Explore. Learn.', image: 'https://services.google.com/fh/files/misc/adv-july.png', accessCode: '1q-lowcode-92316', points: 1,  link: 'https://www.skills.google/games/7314', matchStrings: ['Arcade Adventure: Low-Code Development']
    },
    {
      id: 'trail', title: 'Arcade Trail', subtitle: 'Build through hands-on.', image: 'https://services.google.com/fh/files/misc/trail-july.png', accessCode: '1q-workspace-31069', points: 1,  link: 'https://www.skills.google/games/7316', matchStrings: ['Arcade Trail: Google Workspace Administration']
    },
    {
      id: 'basecamp', title: 'Arcade Base Camp', subtitle: 'Gain essential Google Cloud skills', image: 'https://services.google.com/fh/files/misc/basecamp-july.png', accessCode: '1q-basecamp-07511', points: 1,  link: 'https://www.skills.google/games/7314', matchStrings: ['Arcade Base Camp July 2026']
    },
    {
      id: 'data mesh', title: 'Arcade Simulator: Data Mesh Architect', subtitle: 'Data Mesh Architect !', image: 'https://services.google.com/fh/files/misc/special-july.png', accessCode: '1q-datamesh-16451', points: 1,  link: 'https://www.skills.google/games/7317', matchStrings: ['Arcade Simulator: Data Mesh Architect']
    },
    {
      id: 'safe', title: 'Safe Spaces', subtitle: 'Google Skills', image: 'https://services.google.com/fh/files/misc/new-special-game.png', accessCode: '1q-security-19110', points: 1,  link: 'https://www.skills.google/games/7318', matchStrings: ['Safe Spaces']
    }
  ];

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

  const pendingLabs = aprilLabs.filter(lab => !isLabCompleted(lab.matchStrings));
  const completedLabs = aprilLabs.filter(lab => isLabCompleted(lab.matchStrings));

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
        localStorage.removeItem("current_processing_url");
      } else {
        fetchDataAndCalculate(targetUrl);
      }
    } else if (cachedData) {
      setProfileUrl(cachedData.profileUrl);
      loadDataFromCache(cachedData);
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

  const fetchDataAndCalculate = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points.");
        setLoading(false);
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
      setError("Please check your internet connection and try again.");
    } finally {
      setLoading(false);
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
    
    return isGame && aprilLabs.some(lab => 
      lab.matchStrings.some(match => lower.includes(match.toLowerCase()))
    );
  }).length;

  const facilitatorSkillBadgesCount = history.filter(item => {
    const isBadge = item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge');
    if (!isBadge) return false;

    const earnedDate = new Date(item.date);
    const targetStartDate = new Date("2026-07-16T00:00:00");
    return earnedDate > targetStartDate;
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

  // Premium Backgrounds for Milestone Cards
  const premiumCardStyles = [
    "bg-gradient-to-br from-[#ffffff] to-[#f8f9fa] border-[#e8eaed]", // Card 1: Clean White/Silver
    "bg-gradient-to-br from-[#f8fbff] to-[#e8f0fe] border-[#d2e3fc]", // Card 2: Premium Soft Blue
    "bg-gradient-to-br from-[#fdfefe] to-[#e6f4ea] border-[#ceead6]", // Card 3: Premium Soft Green
    "bg-gradient-to-br from-[#fffdf8] to-[#fef7e0] border-[#fce8e6]"  // Card 4: Premium Soft Gold
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      <Navbar />

      <main className="w-full mx-auto px-6 pt-24 pb-16 flex flex-col items-center">
        
        <div className="w-full max-w-[1350px]">
          {points !== null && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative animate-fade-in-up">
              
              <div className="lg:col-span-4 flex flex-col w-full lg:border-r lg:border-[#dadce0] lg:pr-6">
                
                {/* 🔥 LEFT CARD: SQUARE BORDER 🔥 */}
                 <div className="bg-white rounded-xl shadow-sm border border-[#e8eaed] overflow-hidden relative flex flex-col transition-shadow duration-300 w-full min-h-[640px]">                  <div className="bg-[#1a73e8] py-5 text-center relative overflow-hidden">
                    <h3 className="font-bold text-[36px] sm:text-[39px] tracking-normal relative z-10 text-white">
                      Arcade Points: {points}
                    </h3>
                  </div>
                  
                  <div className="px-8 pt-8 pb-10 flex flex-col items-center relative flex-grow">
                    <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-md flex items-center justify-center overflow-hidden mb-5 relative bg-[#137333] ring-4 ring-[#e6f4ea] transform transition-transform hover:scale-105">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl text-white font-bold">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                      )}
                    </div>
                    
                    <h2 className="text-[26px] font-black text-[#202124] mb-4 text-center tracking-tight leading-tight">
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
                        <div className="text-[28px] font-black text-[#202124]">{history.filter(item => item.type !== 'Skill Badge').length}</div>
                        <div className="text-[13px] font-bold text-[#202124] uppercase tracking-wide mt-1">All Games</div>
                      </div>
                      <div className="w-px h-full bg-[#dadce0] mx-2"></div>
                      <div 
                        onClick={() => router.push('/resources#completed-section')} 
                        className="cursor-pointer text-center group transition-transform hover:scale-105"
                      >
                        <div className="text-[28px] font-black text-[#202124]">{totalSkillBadgesCount}</div>
                        <div className="text-[13px] font-bold text-[#202124] uppercase tracking-wide mt-1">Skill Badges</div>
                      </div>
                    </div>

                    <div className="text-center font-bold text-lg mb-6 text-[#b8860b]">
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

                    <div className="text-sm font-black text-[#1a73e8] border-t border-[#e8eaed] pt-8 w-full text-center mt-auto tracking-wide uppercase drop-shadow-sm">
                      Member since <span className="text-[#1a73e8] font-black">{getMemberSinceYear()}</span>
                    </div>
                  </div>
                </div>

              <div className="mt-6 bg-white rounded-xl shadow-sm border border-[#dadce0] p-6 text-center flex flex-col justify-center transition-all hover:shadow-md">                  <h4 className="text-[13px] font-black text-[#5f6368] uppercase tracking-widest mb-3">
                    Facilitator Progress
                  </h4>
                  <div className="inline-flex items-center justify-center gap-2">
                    {achievedMilestone ? (
                      <>
                        <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xl font-bold text-[#137333]">{milestoneText}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-[#ea4335] bg-[#fce8e6] px-4 py-1.5 rounded-none">
                        {milestoneText}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Side: Facilitator Program & Quick Actions */}
              <div className="lg:col-span-8 flex flex-col w-full h-full">
                
                <div className="mb-8 w-full flex-grow">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 w-full gap-4">
                    <h2 className="text-[28px] font-bold text-black tracking-normal">Facilitator Progress</h2>
                    
                    <div className="flex items-center justify-between sm:justify-start gap-3 bg-white border border-[#dadce0] py-2 px-4 rounded-lg shadow-sm w-full sm:w-auto">
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase font-bold text-[#5f6368] leading-none mb-1">Referral Code</span>
                        <span className="text-[16px] font-black text-black leading-none tracking-wide">GCAF26-IN-9SC-AE9</span>
                      </div>
                      <button 
                        onClick={handleCopyReferral} 
                        className="text-[#5f6368] hover:text-black transition-colors ml-2 bg-gray-50 hover:bg-gray-100 p-2 rounded-md" 
                        title="Copy Referral Code"
                      >
                        {copiedReferral ? (
                           <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative w-full">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                      {facilitatorMilestones.map((milestone, index) => {
                        const arcadeProgress = Math.min(100, (facilitatorArcadeGamesCount / milestone.targetArcade) * 100);
                        const skillsProgress = Math.min(100, (facilitatorSkillBadgesCount / milestone.targetSkills) * 100);
                        const isAchieved = facilitatorArcadeGamesCount >= milestone.targetArcade && facilitatorSkillBadgesCount >= milestone.targetSkills;
                        const totalPercent = Math.floor((arcadeProgress + skillsProgress) / 2);

                        // 🔥 DIFFERENT PREMIUM COLORS FOR CARDS 🔥
                        const cardStyle = premiumCardStyles[index % premiumCardStyles.length];

                        return (
                          // 🔥 CARDS SQUARE SHAPE 🔥
                          <div key={milestone.id} className={`${cardStyle} border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex justify-between items-center mb-5">
                              <h3 className="font-bold text-lg text-[#202124] leading-none">{milestone.title}</h3>
                              <span className="text-[14px] font-bold text-[#202124]">
                                {isAchieved ? '100%' : `${totalPercent}%`}
                              </span>
                            </div>

                            <div className="space-y-4 mb-6">
                              <div>
                                <div className="flex justify-between text-[15px] font-bold mb-2">
                                  <span className="text-[#202124]">Arcade Games (July Only)</span> 
                                  <span className="text-[#202124]">{Math.min(facilitatorArcadeGamesCount, milestone.targetArcade)} / {milestone.targetArcade}</span>
                                </div>
                                {/* 🔥 PROGRESS BAR: SQUARE + BLUE 🔥 */}
                                <div className="w-full bg-[#e5e7eb] h-2.5 rounded-none overflow-hidden border border-[#dadce0]">
                                  <div className="bg-[#1a73e8] h-full rounded-none transition-all duration-1000 ease-out" style={{ width: `${arcadeProgress}%` }}></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[15px] font-bold mb-2">
                                  <span className="text-[#202124]">Skill Badges (Post-July 16)</span> 
                                  <span className="text-[#202124]">{Math.min(facilitatorSkillBadgesCount, milestone.targetSkills)} / {milestone.targetSkills}</span>
                                </div>
                                {/* 🔥 PROGRESS BAR: SQUARE + GREEN 🔥 */}
                                <div className="w-full bg-[#e5e7eb] h-2.5 rounded-none overflow-hidden border border-[#dadce0]">
                                  <div className="bg-[#34a853] h-full rounded-none transition-all duration-1000 ease-out" style={{ width: `${skillsProgress}%` }}></div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-[#f1f3f4] flex justify-between items-center min-h-[50px]">
                              <span className="font-bold text-[#202124] text-[14px] lg:text-[15px]">Milestone Rewards</span>
                              {isAchieved ? (
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-end">
                                    <span className="text-[15px] md:text-[17px] font-extrabold text-[#137333] leading-tight">
                                      +{milestone.points} Bonus Pts
                                    </span>
                                    <span className="text-[12px] font-bold text-[#5f6368] leading-none mt-0.5">
                                      + {milestone.targetArcade} Game Pts
                                    </span>
                                  </div>
                                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-[#34a853] shadow-md flex items-center justify-center bg-[#137333]">
                                    {userAvatar ? (
                                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-white font-bold text-lg">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="font-bold text-[#202124] text-[15px]">Not Yet</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full mt-auto pt-6 flex flex-col items-center">
                  
                  <div className="text-center mb-11 w-full">
                    <p className="text-[#137333] font-bold text-[16px] md:text-[18px] leading-snug">
                      Complete the Ultimate + 10 Bonus Milestone to earn 90 points.{' '}
                      <a 
                        href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#1a73e8] hover:underline ml-1"
                      >
                        See Eligibility Criteria
                      </a>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <button onClick={() => router.push('/calculator')} className="w-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#e8f0fe] text-[#202124] font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      Points Calculator
                    </button>
                    <button onClick={() => router.push('/chat')} className="w-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#e8f0fe] text-[#202124] font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      Arcade Chatbot
                    </button>
                    <button onClick={() => router.push('/facilitator')} className="w-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#e8f0fe] text-[#202124] font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      Arcade Facilitator
                    </button>

                    <button onClick={shareToWhatsApp} className="w-full bg-white border border-[#dadce0] hover:border-[#25D366] hover:bg-[#f0fbf4] text-[#202124] font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.002 0h-.004C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.543 5.867L.085 23.316l5.59-1.464C7.382 22.84 9.614 23.4 12 23.4c6.627 0 12-5.373 12-12S18.627 0 12.002 0zm0 21.45c-1.802 0-3.535-.466-5.1-1.348l-.366-.217-3.793.994.996-3.698-.238-.378A9.452 9.452 0 012.55 12c0-5.215 4.236-9.45 9.452-9.45s9.45 4.235 9.45 9.45-4.234 9.45-9.45 9.45zm5.198-6.85c-.285-.143-1.685-.83-1.946-.925-.262-.095-.453-.143-.643.143-.19.285-.736.925-.903 1.115-.166.19-.333.214-.618.071-.286-.143-1.203-.443-2.292-1.25-.848-.628-1.42-1.405-1.586-1.69-.167-.285-.018-.439.125-.582.129-.128.286-.333.428-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.643-1.552-.88-2.124-.233-.556-.47-.48-.643-.489-.166-.008-.357-.008-.547-.008-.19 0-.5.071-.762.357-.262.285-1 .975-1 2.378s1.024 2.758 1.167 2.948c.143.19 2.012 3.072 4.872 4.306.68.293 1.213.468 1.626.598.683.214 1.305.183 1.794.111.547-.08 1.685-.688 1.923-1.353.238-.665.238-1.235.166-1.353-.071-.119-.262-.19-.547-.333z"/></svg>
                      Share Points
                    </button>
                    <button onClick={() => router.push('/leaderboard')} className="w-full bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#e8f0fe] text-[#202124] font-bold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center text-sm gap-2">
                      <svg className="w-4 h-4 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" /></svg>
                      View Top Rank
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
            <div className="bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.21s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b border-[#dadce0] pb-4">
                <h4 className="text-2xl font-extrabold text-[#202124] tracking-tight flex items-center gap-3">
                  Arcade Prize Tiers
                </h4>
                <span className="text-[#202124] text-base font-medium">
                   <span className="font-bold">{getCurrentTier()}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {arcadeTiersData.map((tier, idx) => {
                  const progressPercentage = Math.min(100, (points / tier.target) * 100);
                  const isAchieved = points >= tier.target;
                  
                  return (
                    <div key={idx} className={`bg-[#353840] border rounded-xl py-8 px-5 flex flex-col items-center relative overflow-hidden shadow-md hover:shadow-lg transition-all group ${isAchieved ? 'border-[#34a853]' : 'border-[#5f6368]'}`}>
                      
                      <div className="w-32 h-32 mb-6 mt-2 flex items-center justify-center relative">
                        <img src={tier.image} alt={tier.name} className="max-h-full object-contain z-10 group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      
                      <h5 className="text-xl font-bold text-white mb-4 text-center">{tier.name}</h5>
                      
                      <div className="w-full mt-auto flex flex-col gap-2">
                        <div className="w-full h-2.5 bg-[#202124] rounded-full overflow-hidden border border-black/50 shadow-inner">
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

              <div className="mt-8 flex flex-col lg:flex-row justify-between items-center text-sm font-semibold text-[#5f6368] gap-4">
                <div className="flex items-center gap-2 lg:w-1/3">
                  <svg className="w-4 h-4 text-[#80868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Last refreshed: {lastRefreshed || "Just now"}
                </div>
                <div className="text-center lg:w-1/3 flex justify-center">
                  <span className="inline-flex items-center justify-center bg-[#1a73e8] text-white px-6 py-2.5 rounded-full text-[15px] font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap tracking-wide">
                     {getCurrentTier()}
                  </span>
                </div>
                <div className="text-center lg:text-right lg:w-1/3">
                  Explore Arcade Tier details <a href="https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline font-bold">here.</a>
                </div>
              </div>
            </div>
          )}

          {points !== null && (
            <div className="bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.22s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h4 className="text-sm sm:text-base font-black text-[#5f6368] uppercase tracking-widest flex items-center gap-2">
                  <span className="text-xl"></span> JuLY Labs
                </h4>
              </div>

              <div className="relative flex items-center justify-between w-full px-2 sm:px-4 mt-6 mb-8">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-[#f1f3f4] rounded-full z-0"></div>
                
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-[#34a853] to-[#137333] rounded-full z-0 transition-all duration-1000" 
                  style={{ width: `${(completedLabs.length / 6) * 100}%` }}
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
                            ? 'border-[#fbbc04] bg-white scale-110 ring-2 ring-[#fbbc04]/30' 
                            : 'border-[#dadce0] bg-[#f8f9fa]'
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
                        isCompleted ? 'text-[#137333]' : isCurrent ? 'text-[#f29900]' : 'text-[#9aa0a6]'
                      }`}>
                        {isCompleted ? 'Completed' : isCurrent ? 'Current' : `Lab ${index + 1}`}
                      </span>

                      <span className="absolute -bottom-8 text-[11px] md:text-xs font-medium text-[#5f6368] text-center w-full leading-tight hidden sm:block">
                        {shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-10 sm:mt-12 w-full text-center border-t border-[#dadce0] pt-4">
                <span className="text-sm sm:text-base font-bold text-black">
                  {completedLabs.length} / 6 JULY Labs Completed
                </span>
              </div>
            </div>
          )}


          {points !== null && (
            <div className="bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '0.25s' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#dadce0] pb-4">
                <h4 className="text-2xl font-extrabold text-[#202124] tracking-tight flex items-center gap-3">
                  JULY LABS LIVE !
                </h4>
              </div>
              
              {pendingLabs.length > 0 && (
                <div className="mb-10">
                  <h5 className="text-sm font-black text-[#5f6368] uppercase tracking-widest mb-6 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#ea4335]"></span>
                     Pending Labs ({pendingLabs.length})
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {pendingLabs.map((lab) => (
                      <div key={`pending-${lab.id}`} className="flex flex-col items-center">
                        <h5 className="text-[20px] lg:text-[22px] font-bold text-black mb-2 text-center">{lab.title}</h5>
                        <p className="text-[14px] text-[#5f6368] font-bold mb-4 text-center">{lab.subtitle}</p>

                        <div className="mb-5 w-full max-w-[340px] flex justify-center items-center relative group">
                          <img 
                            src={lab.image} 
                            alt={lab.title} 
                            className="w-full object-contain rounded-[12px] shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 z-10" 
                          />
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-2 w-full">
                           <p className="text-[14px] md:text-[15px] font-bold text-[#3c4043] text-center m-0">
                             Access code: {lab.accessCode}
                           </p>
                           <button onClick={() => handleCopyCode(lab.accessCode)} className="text-[#5f6368] hover:text-[#1a73e8] transition-colors" title="Copy Code">
                             {copiedCode === lab.accessCode ? (
                                <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                             ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                             )}
                           </button>
                        </div>
                        
                        <p className="text-[14px] md:text-[15px] font-bold text-[#3c4043] mb-5 text-center">
                          Arcade points: {lab.points}
                        </p>

                        <a 
                          href={lab.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-[#f8f9fa] text-[#1a73e8] font-bold text-[15px] py-2 px-8 rounded-full border border-[#dadce0] transition-all shadow-sm inline-block text-center"
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
                  <h5 className={`text-sm font-black text-[#137333] uppercase tracking-widest mb-6 flex items-center gap-2 ${pendingLabs.length > 0 ? 'pt-6 border-t border-[#dadce0]' : ''}`}>
                    <span className="w-2 h-2 rounded-full bg-[#34a853]"></span>
                    Completed Labs ({completedLabs.length})
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {completedLabs.map((lab) => (
                      <div key={`completed-${lab.id}`} className="flex flex-col items-center group">
                        <h5 className="text-[20px] lg:text-[22px] font-bold text-black mb-2 text-center">{lab.title}</h5>
                        <p className="text-[14px] text-[#5f6368] font-bold mb-4 text-center">{lab.subtitle}</p>

                        <div className="mb-5 w-full max-w-[340px] flex justify-center items-center relative group">
                           <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px] z-20 flex items-center justify-center rounded-[12px] m-[1px]">
                              <div className="w-14 h-14 bg-[#137333] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                                 <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              </div>
                           </div>
                          <img 
                            src={lab.image} 
                            alt={lab.title} 
                            className="w-full object-contain rounded-[12px] shadow-sm z-10" 
                          />
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-2 w-full">
                           <p className="text-[14px] md:text-[15px] font-bold text-[#3c4043] text-center m-0">
                             Access code: {lab.accessCode}
                           </p>
                           <button onClick={() => handleCopyCode(lab.accessCode)} className="text-[#5f6368] hover:text-[#1a73e8] transition-colors" title="Copy Code">
                             {copiedCode === lab.accessCode ? (
                                <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                             ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                             )}
                           </button>
                        </div>
                        
                        <p className="text-[14px] md:text-[15px] font-bold text-[#3c4043] mb-5 text-center">
                          Arcade points: {lab.points}
                        </p>

                        <a 
                          href={lab.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-[#f4fbf7] text-[#137333] font-bold text-[15px] py-2 px-8 rounded-full border border-[#dadce0] transition-all shadow-sm inline-block text-center"
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
            <div id="history-section" className="animate-fade-in-up scroll-mt-24" style={{animationDelay: '0.3s'}}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                
                <h4 className="text-base font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center whitespace-nowrap">
                  Completion Badges History
                </h4>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1 lg:justify-end">
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end mr-0 sm:mr-4">
                     <span className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm">
                       Arcade Games: {totalArcadeGamesCount}
                     </span>

                     <span className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm">
                       Skill Badges: {totalSkillBadgesCount}
                     </span>
                  </div>

                  <div className="relative w-full sm:w-56">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                      type="text"
                      placeholder="Search labs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#dadce0] rounded-lg text-sm font-semibold text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative w-full sm:w-44">
                    <select
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value)}
                      className="w-full appearance-none pl-4 pr-10 py-2 bg-white border border-[#dadce0] rounded-lg text-sm font-bold text-[#3c4043] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all shadow-sm cursor-pointer"
                    >
                      <option value="All Games">All Games</option>
                      <option value="Arcade Games">Arcade Games</option>
                      <option value="Skill Badges">Skill Badges</option>
                      <option value="Labs free course">Labs Free Course</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#5f6368] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>

                  
                </div>
              </div>
              
              <div className="bg-white border border-[#dadce0] rounded-lg overflow-hidden shadow-sm p-4">
                <div className="max-h-[2000px] overflow-y-auto custom-scrollbar pr-2">
                  {filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {filteredHistory.map((item, i) => (
                        <div key={i} className="flex flex-col items-center bg-white p-4 rounded-xl border border-transparent hover:border-[#dadce0] hover:shadow-md transition-all group">
                          
                          <div className="w-full h-40 mb-4 flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                              />
                            ) : (
                              <div className="w-20 h-20 bg-[#f8f9fa] border border-[#dadce0] rounded-full flex items-center justify-center text-3xl shadow-sm">🏅</div>
                            )}
                          </div>
                          
                          <h5 className="text-[16px] font-bold text-center text-[#202124] mb-1 line-clamp-2">
                            {item.name}
                          </h5>
                          
                          <p className="text-[14px] text-[#5f6368] text-center mb-3">
                            {item.date.toLowerCase().includes('earned') ? item.date : `Earned ${item.date}`}
                          </p>
                          
                          <div className="mt-auto pt-2">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white border border-[#dadce0] shadow-sm ${item.points >= 2 ? 'text-[#137333]' : item.points === 1 ? 'text-[#1a73e8]' : 'text-[#9334e6]'}`}>
                              +{item.points} {item.points > 1 ? 'Points' : 'Point'}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-[#9aa0a6] font-medium text-lg">
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
              className="text-[#5f6368] font-medium text-sm cursor-default hover:text-[#5f6368] no-underline"
            >
              You can also explore full Arcade Prize Tiers details here.
            </a>
          </div>
        </div>

      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #dadce0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #bdc1c6; }
        
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

        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 4.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}