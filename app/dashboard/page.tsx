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
  const [lastRefreshed, setLastRefreshed] = useState<string>("12:04 AM");

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
  const [showAiOverview, setShowAiOverview] = useState(false); 

  const [isDark, setIsDark] = useState(false);

  // NEW STATES FOR ASK AI CHATBOT & LANGUAGE TOGGLE
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiLanguage, setAiLanguage] = useState<"English" | "Hinglish">("English");

  useEffect(() => {
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

  useEffect(() => {
    let intervalId: any;
    if (profileUrl) {
      intervalId = setInterval(() => {
        fetchDataAndCalculate(profileUrl, true);
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [profileUrl]);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("arcade_theme", newTheme ? "dark" : "light");
  };

  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes: any = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  };

  const handleRefreshClick = () => {
    if (loading) return; 
    setLastRefreshed(formatTime());
    fetchDataAndCalculate(profileUrl || "", false);
  };

  const julyLabs = [
    { id: 'voyage', title: 'Arcade Voyage', subtitle: 'Practice as you go.', image: 'https://services.google.com/fh/files/misc/sepvoy.png', accessCode: ' 1q-microservice-9210', points: 1, link: 'https://www.skills.google/games/7442', matchStrings: ['Arcade Voyage: App Modernization'] },
    { id: 'adventure', title: 'Arcade Adventure', subtitle: 'Play. Explore. Learn.', image: 'https://services.google.com/fh/files/misc/advsep.png', accessCode: '1q-architecture-01381', points: 1, link: 'https://www.skills.google/games/7441', matchStrings: ['Arcade Adventure: Modern Cloud Architecture'] },
    { id: 'trail', title: 'Arcade Trail', subtitle: 'Build through hands-on.', image: 'https://services.google.com/fh/files/misc/septrail.png', accessCode: '1q-vpcpeering-3469', points: 1, link: 'https://www.skills.google/games/7443', matchStrings: ['Arcade Trail: Data Engineering and Security'] },
    { id: 'basecamp', title: 'Arcade Base Camp', subtitle: 'Gain essential Google Cloud skills', image: 'https://services.google.com/fh/files/misc/bcsep.png', accessCode: '1q-basecamp-09304', points: 1, link: 'https://www.skills.google/games/7444', matchStrings: ['Arcade Base Camp September 2026'] },
    { id: 'data mesh', title: 'Arcade Simulator: DevOps Engineer', subtitle: 'Data Mesh Architect !', image: 'https://services.google.com/fh/files/misc/simulatorsep.png', accessCode: '1q-devops-065131', points: 1, link: 'https://www.skills.google/games/7445', matchStrings: ['Arcade Simulator: DevOps Engineer'] },
    { id: 'safe', title: 'Pitch Perfect', subtitle: 'Google Skills', image: 'https://services.google.com/fh/files/misc/specialsepo.png', accessCode: '1q-analysis-5026', points: 1, link: 'https://www.skills.google/games/7446', matchStrings: ['Pitch Perfect'] }
  ];

  const augustLabs: any[] = [];
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
    return history.some(item => matchStrings.some(match => item.name.toLowerCase().includes(match.toLowerCase())));
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
    setLoading(false);
  };

  useEffect(() => {
    const targetUrl = localStorage.getItem("current_processing_url");
    const cachedDataString = localStorage.getItem("arcade_user_data");
    let cachedData = null;

    if (cachedDataString) {
      try { cachedData = JSON.parse(cachedDataString); } catch (e) {}
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
      if (me && me.rank) setRealRank(me.rank);
      else setRealRank(null);
    });
    return () => unsub();
  }, [userUniqueId, points]);

  const fetchDataAndCalculate = async (url: string, isSilent: boolean = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate", { 
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: url.trim() }),
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
      if (!isSilent) setLastRefreshed(formatTime());

      const cacheObj = {
        profileUrl: url.trim(), points: data.totalPoints, breakdown: data.breakdown,
        history: data.completionHistory || [], userName: data.userName || null,
        userAvatar: data.userAvatar || null, userUniqueId: extractedId
      };
      localStorage.setItem("arcade_user_data", JSON.stringify(cacheObj));

      try {
        await savePublicUserToLeaderboard({
          name: data.userName || "Arcade Player", photoURL: data.userAvatar || "/avatar.png",
          points: data.totalPoints, profileUrl: url.trim()
        });
      } catch (saveErr) {}

    } catch (err) {
      if (!isSilent) setError("Please check your internet connection.");
    } finally {
      if (!isSilent) setLoading(false);
      localStorage.removeItem("current_processing_url"); 
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = `🔥 Yooo! I just reached *${points} points* on the Google Cloud Arcade 2026! 🚀\n\n👤 *Name:* ${userName || "Arcade Player"}\n🎯 *Points:* ${points}\n🔗 *My Public Profile:* ${profileUrl}\n\nCheck your own points and track your swags easily using this awesome Calculator:\nhttps://arcade-calculator.vercel.app/calculator`;
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
      return !(item.type === 'Skill Badge' || lowerName.includes('badge')) && !(item.type === 'Course' || lowerName.includes('course'));
    }
    if (historyFilter === "Skill Badges") return item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge');
    if (historyFilter === "Labs free course") return item.type === 'Course' || item.name.toLowerCase().includes('course');
    if (historyFilter === "Facilitator Progress History") {
      const lowerName = item.name.toLowerCase();
      const isBadge = item.type === 'Skill Badge' || lowerName.includes('badge');
      const isGame = !isBadge && !(item.type === 'Course' || lowerName.includes('course'));
      const earnedDate = new Date(item.date.replace(/Earned/i, '').trim());
      if (isBadge || isGame) return earnedDate >= new Date("2026-07-13T00:00:00");
      return false; 
    }
    return true; 
  });

  const totalArcadeGamesCount = history.filter(item => {
    const lower = item.name.toLowerCase();
    return !(item.type === 'Skill Badge' || lower.includes('badge')) && !(item.type === 'Course' || lower.includes('course'));
  }).length;
  const totalSkillBadgesCount = breakdown?.skills || history.filter(item => item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge')).length;

  const facilitatorArcadeGamesCount = history.filter(item => {
    const lower = item.name.toLowerCase();
    const isGame = !(item.type === 'Skill Badge' || lower.includes('badge')) && !(item.type === 'Course' || lower.includes('course'));
    if (!isGame) return false;
    return new Date(item.date.replace(/Earned/i, '').trim()) >= new Date("2026-07-13T00:00:00");
  }).length;

  const facilitatorSkillBadgesCount = history.filter(item => {
    const isBadge = item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge');
    if (!isBadge) return false;
    return new Date(item.date.replace(/Earned/i, '').trim()) >= new Date("2026-07-13T00:00:00");
  }).length;

  const arcadeOnlyGamesCount = Math.max(0, totalArcadeGamesCount - facilitatorArcadeGamesCount);
  const arcadeOnlySkillBadgesCount = Math.max(0, totalSkillBadgesCount - facilitatorSkillBadgesCount);

  const facilitatorMilestones = [
    { id: 1, title: 'Milestone 1', targetArcade: 6, targetSkills: 18, points: 5, colorClass: 'bg-[#1a73e8]', textClass: 'text-[#1a73e8]', lightBg: 'bg-[#e8f0fe] border-[#d2e3fc]' },
    { id: 2, title: 'Milestone 2', targetArcade: 8, targetSkills: 34, points: 15, colorClass: 'bg-[#fbbc04]', textClass: 'text-[#f29900]', lightBg: 'bg-[#fef7e0] border-[#fde293]' },
    { id: 3, title: 'Milestone 3', targetArcade: 10, targetSkills: 50, points: 25, colorClass: 'bg-[#34a853]', textClass: 'text-[#137333]', lightBg: 'bg-[#e6f4ea] border-[#ceead6]' },
    { id: 4, title: 'Ultimate', targetArcade: 12, targetSkills: 66, points: 35, colorClass: 'bg-[#ea4335]', textClass: 'text-[#c5221f]', lightBg: 'bg-[#fce8e6] border-[#fad2cf]' }
  ];

  const achievedMilestone = [...facilitatorMilestones].reverse().find(
    (m) => facilitatorArcadeGamesCount >= m.targetArcade && facilitatorSkillBadgesCount >= m.targetSkills
  );

  // EXTREMELY STRICT AI PROMPT TO PREVENT ESSAYS & SCREENSHOT REQUESTS
  const handleAskAi = async () => {
    if (!chatInput.trim()) return;
    
    const newMsg = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const sysPrompt = `IGNORE ALL PREVIOUS INSTRUCTIONS. You are strictly a Dashboard Stats Assistant for ${userName || "Player"}. 
      DO NOT ask for screenshots, console logs, or images under any circumstances.
      
      Provide ONLY the requested dashboard stats using this live data:
      - Points: ${points || 0}
      - Tier: ${getCurrentTier()}
      - Arcade Games: ${totalArcadeGamesCount}
      - Skill Badges: ${totalSkillBadgesCount}
      - Pending Labs: ${pendingLabs.length}
      
      STRICT RULES:
      1. Language MUST BE ${aiLanguage}.
      2. Format using simple bullet points (use '-' or '•'). Make sure there is a line break between points.
      3. NO LONG PARAGRAPHS OR ESSAYS. Keep it extremely brief and clean.
      4. ABSOLUTELY NO ASTERISKS (**). Do not use markdown bolding or formatting. Just plain text.
      5. Only answer what is asked. Do not add extra fluff.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMsg],
          systemContext: sysPrompt
        }),
      });
      
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans relative transition-colors duration-300 ${isDark ? 'bg-[#0a0a0b] text-gray-200' : 'bg-[#f4f7f9] text-[#202124]'}`}>
      <Navbar />

      <main className="w-full mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col items-center">
        
        <div className="w-full max-w-[1350px]">
          {points !== null && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative animate-fade-in-up">
              
              {/* Left Side: Premium Profile Card */}
              <div className="lg:col-span-3 xl:col-span-3 flex flex-col w-full">
                <div className={`rounded-2xl shadow-sm border overflow-hidden relative flex flex-col transition-all h-full ${isDark ? 'bg-[#15171b] border-[#2a2d32]' : 'bg-white border-[#e8eaed]'}`}>
                  
                  {/* Top Gradient Header */}
                  <div className="flex bg-gradient-to-r from-[#4285F4] to-[#8A2BE2] text-white divide-x divide-white/20">
                    <div className="flex-1 py-5 text-center flex flex-col justify-center items-center">
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1">Arcade Points</span>
                      <span className="text-3xl font-black leading-none">{points}</span>
                    </div>
                    {/* Rank is Clickable -> Leaderboard */}
                    <div onClick={() => router.push('/leaderboard')} className="flex-1 py-5 text-center flex flex-col justify-center items-center cursor-pointer hover:bg-white/10 transition-colors" title="View Leaderboard">
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1">Rank</span>
                      <span className="text-3xl font-black leading-none">#{realRank || "-"}</span>
                    </div>
                  </div>

                  {/* Profile Avatar & Name */}
                  <div className="px-6 pt-8 pb-6 flex flex-col items-center flex-grow">
                    <div className="w-[100px] h-[100px] rounded-full p-1 mb-4 shadow-md bg-white dark:bg-[#1a1b1e] relative cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(66,133,244,0.4)] transition-all duration-300">
                      <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${isDark ? 'bg-[#2a2d32]' : 'bg-[#0f9d58]'}`}>
                        {userAvatar ? (
                          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-white">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                        )}
                      </div>
                    </div>
                    
                    <h2 className={`text-xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                      {userName || "Arcade Player"}
                    </h2>

                    {/* Earned vs Bonus Box */}
                    <div className={`w-full flex rounded-xl border divide-x mb-6 ${isDark ? 'bg-[#202124] border-[#3c4043] divide-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0] divide-[#dadce0]'}`}>
                      <div className="flex-1 py-3 text-center">
                        <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Earned</div>
                        <div className={`text-lg font-black ${isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]'}`}>{(points || 0) - (breakdown?.bonus || 0)}</div>
                      </div>
                      <div className="flex-1 py-3 text-center">
                        <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Bonus</div>
                        <div className={`text-lg font-black ${isDark ? 'text-[#c58af9]' : 'text-[#9334e6]'}`}>{breakdown?.bonus || 0}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full mt-auto space-y-3">
                      <button onClick={handleCopyProfile} className={`w-full py-2.5 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-[#34a853] text-white' : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-sm'}`}>
                        {copied ? '✓ Copied URL' : 'Copy Profile URL'}
                      </button>
                      <button onClick={shareToWhatsApp} className={`w-full py-2.5 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 border ${isDark ? 'bg-transparent border-[#3c4043] text-gray-300 hover:bg-[#202124]' : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-gray-50 shadow-sm'}`}>
                        Share Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Control Bar + Main Dashboard */}
              <div className="lg:col-span-9 xl:col-span-9 flex flex-col w-full gap-5">
                
                {/* RELATIVE WRAPPER FOR FLOATING AI OVERVIEW TO NOT PUSH CONTENT DOWN */}
                <div className="relative w-full z-30">

                  {/* 1. Top Control Bar (Responsive) */}
                  <div className={`flex flex-col md:flex-row justify-between items-center px-4 md:px-5 py-3 rounded-2xl border shadow-sm ${isDark ? 'bg-[#15171b] border-[#2a2d32]' : 'bg-white border-[#e8eaed]'}`}>
                     
                     {/* Left side: Status Indicator & AI Overview Button */}
                     <div className="flex items-center gap-2 mb-3 md:mb-0 w-full md:w-auto justify-center md:justify-start">
                       <div className="w-2 h-2 rounded-full bg-[#34a853] shadow-sm"></div>
                       <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span className={`text-[13px] sm:text-[14px] font-medium ${isDark ? 'text-gray-300' : 'text-[#3c4043]'}`}>
                         Last synced <span className="font-bold tracking-wide">{lastRefreshed}</span>
                       </span>

                       {/* AI Overview Button */}
                       <div className="relative ml-2 sm:ml-4">
                         <button
                           onClick={() => setShowAiOverview(true)}
                           className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4285F4] via-[#9b72cb] to-[#d96570] text-white text-[13px] font-bold shadow-md hover:shadow-lg transition-transform hover:scale-105"
                         >
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
                           AI Summary
                         </button>
                         <span className="absolute -top-2.5 -right-2 bg-[#ff3366] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-[1.5px] border-white shadow-sm flex items-center gap-1">
                           <span className="w-1.5 h-1.5 bg-white rounded-full"></span>NEW
                         </span>
                       </div>

                       {/* NEW ASK AI BUTTON (With Gemini Spin Hover) */}
                       <div className="relative ml-2">
                         <button
                           onClick={() => setShowAiChat(true)}
                           className={`group flex items-center gap-1.5 px-4 py-1.5 rounded-full border shadow-sm transition-all hover:scale-105 text-[13px] font-bold ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-[#8ab4f8]' : 'bg-white border-[#dadce0] text-[#1a73e8]'}`}
                         >
                           <svg className="w-4 h-4 transition-all duration-700 group-hover:rotate-180 group-hover:scale-125 group-hover:text-[#c58af9]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
                           </svg>
                           Ask AI
                         </button>
                       </div>
                     </div>

                     {/* Right side: Links & Action Buttons */}
                     <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end flex-wrap mt-3 md:mt-0">
                       <button onClick={() => router.push('/calculator')} className={`text-[13px] sm:text-[14px] font-bold transition-colors ${isDark ? 'text-gray-300 hover:text-[#8ab4f8]' : 'text-[#5f6368] hover:text-[#1a73e8]'}`}>
                         Calculator
                       </button>
                       <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#5f6368]' : 'bg-[#dadce0]'}`}></div>
                       
                       <button onClick={() => router.push('/leaderboard')} className={`text-[13px] sm:text-[14px] font-bold transition-colors ${isDark ? 'text-gray-300 hover:text-[#8ab4f8]' : 'text-[#5f6368] hover:text-[#1a73e8]'}`}>
                         Leaderboard
                       </button>
                       <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#5f6368]' : 'bg-[#dadce0]'}`}></div>
                       
                       <button onClick={() => router.push('/resources')} className={`text-[13px] sm:text-[14px] font-bold transition-colors ${isDark ? 'text-gray-300 hover:text-[#8ab4f8]' : 'text-[#5f6368] hover:text-[#1a73e8]'}`}>
                         Skill Badges
                       </button>
                       
                       <div className={`hidden sm:block w-px h-5 mx-1 ${isDark ? 'bg-[#3c4043]' : 'bg-[#dadce0]'}`}></div>
                       
                       {/* Dark Mode Toggle */}
                       <button onClick={toggleDarkMode} className={`p-1.5 rounded transition-colors flex items-center justify-center ${isDark ? 'hover:bg-[#2a2d32] text-gray-200' : 'hover:bg-[#f1f3f4] text-[#fbbc04]'}`}>
                         {isDark ? (
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                         ) : (
                            <svg className="w-5 h-5 text-[#fbbc04]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                         )}
                       </button>

                       <button onClick={handleRefreshClick} disabled={loading} className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg border font-bold text-[13px] sm:text-sm transition-colors shadow-sm ${isDark ? 'border-[#3c4043] text-[#8ab4f8] hover:bg-[#2a2d32] bg-[#1a1b1e]' : 'border-[#e8eaed] text-[#1a73e8] hover:bg-[#f8f9fa] bg-white'}`}>
                         <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         {loading ? 'Refreshing' : 'Refresh'}
                       </button>
                     </div>
                  </div>
                    {/* AI Overview Panel (Floating On Top) */}
                  {showAiOverview && (
                    <div className="absolute top-[calc(100%+12px)] left-0 w-full z-50 animate-fade-in-up shadow-2xl rounded-[16px] p-[1.5px] overflow-hidden group">
                      
                      {/* GEMINI STYLE ANIMATED GLOWING BORDER */}
                      <div className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#9b72cb_30%,#4285F4_50%,transparent_70%)] opacity-70"></div>
                      
                      {/* INNER CONTENT BOX */}
                      <div className={`relative w-full h-full rounded-[15px] p-5 flex flex-col sm:flex-row gap-4 transition-all duration-200 ${isDark ? 'bg-[#15171b]' : 'bg-[#f8f9fa]'}`}>
                        
                        {/* FAST CLOSE 'X' BUTTON */}
                        <button onClick={() => setShowAiOverview(false)} className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors z-50 ${isDark ? 'hover:bg-[#3c4043] text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="mt-1 flex-shrink-0 hidden sm:block">
                          <svg className="w-7 h-7 text-[#9b72cb] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
                        </div>
                        
                        {/* HIGHLIGHTED POINT-WISE SUMMARY (PROFESSIONAL GREY & THIN FONT) */}
                        <div className="flex flex-col gap-3 w-full pr-6">
                          <h3 className={`font-bold text-[17px] flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                             <svg className="w-5 h-5 sm:hidden text-[#9b72cb] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
                             AI Summary for {userName || "Player"}
                          </h3>
                          
                          <div className={`grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-[14px] font-medium leading-relaxed mt-1 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                            <div className="flex flex-col gap-3">
                              <p className="flex items-center gap-2">🎯 Total Points: <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{points || 0}</span></p>
                              <p className="flex items-center gap-2">🏆 Current Prize: <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{getCurrentTier()}</span></p>
                              <p className="flex items-center gap-2">⏳ Pending Sept Labs: <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{pendingLabs.length}</span></p>
                            </div>
                            <div className="flex flex-col gap-3">
                              <p className="flex flex-wrap items-center gap-1.5">🎮 Lifetime: <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{totalArcadeGamesCount} Games</span> <span className="opacity-70">&</span> <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{totalSkillBadgesCount} Badges</span></p>
                              <p className="flex flex-wrap items-center gap-1.5">🚀 Facilitator: <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{facilitatorArcadeGamesCount} Games</span> <span className="opacity-70">&</span> <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{facilitatorSkillBadgesCount} Badges</span></p>
                              <p className="flex items-center gap-2">🏅 Milestone: <span className={`font-semibold px-2.5 py-0.5 rounded-md shadow-sm border ${isDark ? 'bg-[#2a2d32] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#3c4043]'}`}>{achievedMilestone ? achievedMilestone.title : "Not Yet"}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* 2. Main Stats (Arcade 30% | Facilitator 70%) */}
                <div className={`rounded-2xl shadow-sm border flex flex-col md:flex-row flex-grow p-4 sm:p-6 ${isDark ? 'bg-[#15171b] border-[#2a2d32]' : 'bg-white border-[#dadce0]'}`}>
                  
                   {/* Left: The Arcade (~30% width) */}
                   <div className={`w-full md:w-[32%] flex flex-col items-center justify-start px-2 md:pr-6 pb-6 md:pb-0 md:border-r ${isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'}`}>
                     <h3 className={`font-black text-[26px] tracking-tight text-center mt-2 ${isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]'}`}>The Arcade</h3>
                     <span className={`text-[11px] font-bold uppercase tracking-wider mt-1 text-center ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Jan 2026 - Dec 2026</span>
                     
                     <img src="https://cdn.qwiklabs.com/assets/leagues/silver_sm_new-deaa0090c8b38c1cde7cbc34bb895870009e6fee.png" alt="Arcade Level" className="h-20 my-4 object-contain filter drop-shadow-md" />

                     {arcadeOnlyGamesCount === 0 && arcadeOnlySkillBadgesCount === 0 ? (
                        <div className="mt-2 text-[13px] text-center font-bold text-gray-500 dark:text-gray-400 px-2 leading-relaxed">
                          No labs completed between January and July 13.
                        </div>
                     ) : (
                        <div className="flex justify-center gap-6 sm:gap-10 w-full mt-2">
                           <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                 <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]"></span>Arcade Games
                              </div>
                              <span className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-[#202124]'}`}>{arcadeOnlyGamesCount}</span>
                           </div>
                           <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                 <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]"></span>Skill Badges
                              </div>
                              <span className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-[#202124]'}`}>{arcadeOnlySkillBadgesCount}</span>
                           </div>
                        </div>
                     )}

                     {/* Achieved Prize Tier Inside Arcade Box (Green Bordered Blue Button) */}
                     <div className="mt-8 flex flex-col items-center w-full">
                       <div className={`px-4 py-2.5 w-full text-center rounded-lg shadow-sm font-black text-[14px] sm:text-[15px] bg-[#1a73e8] text-white border-2 border-[#34a853]`}>
                         🏆 {getCurrentTier()}
                       </div>
                     </div>
                   </div>

                   {/* Right: Facilitator Program (~68% width) */}
                   <div className="w-full md:w-[68%] flex flex-col px-2 md:pl-8 pt-6 md:pt-0">
                     
                     <div className="flex flex-col items-center mb-6 w-full">
                        <h3 className={`font-black text-[24px] sm:text-[28px] tracking-tight text-center ${isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]'}`}>Facilitator Progress</h3>
                        <span className={`text-[10px] sm:text-[12px] font-bold uppercase tracking-wider mt-1 block text-center ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Jul 13, 2026 - Sept 14, 2026</span>
                     </div>
                     
                     {/* Centered Games & Skill Badges */}
                     <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap justify-center w-full">
                        <div className={`text-[15px] sm:text-[18px] font-extrabold tracking-wide ${isDark ? 'text-gray-300' : 'text-[#3c4043]'}`}>
                           Games: <span className={isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]'}>{facilitatorArcadeGamesCount}</span> <span className="opacity-40 mx-2 text-lg sm:text-xl">•</span> Skill Badges: <span className={isDark ? 'text-[#81c995]' : 'text-[#137333]'}>{facilitatorSkillBadgesCount}</span>
                        </div>
                     </div>

                     {/* SMALL COMPACT PREMIUM BANNER INSTALLED HERE */}
                     {achievedMilestone ? (
                       <div className="w-full mb-8 flex flex-col sm:flex-row gap-0 rounded-lg overflow-hidden shadow-sm border border-[#e8eaed] dark:border-[#3c4043] animate-fade-in-up">
                         {/* Left half: Achieved Block - Changed to Blue Gradient */}
                         <div className="flex-1 bg-gradient-to-r from-[#1a73e8] to-[#4285f4] py-3 px-4 text-white flex justify-between items-center border-b sm:border-b-0 sm:border-r border-white/20">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl drop-shadow-md">👑</span>
                              <div className="font-black text-[15px] tracking-tight uppercase leading-tight flex items-center h-full">
                                 {achievedMilestone.title}
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-center h-full">
                               <div className="text-xl font-black leading-none drop-shadow-sm">✓</div>
                            </div>
                         </div>

                         {/* Right half: Bonus Points Block */}
                         <div className="flex-1 bg-gradient-to-r from-[#c084fc] to-[#9333ea] py-3 px-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl drop-shadow-md">⭐</span>
                              <div className="font-black text-[15px] tracking-tight leading-tight flex items-center h-full">
                                 Bonus Points
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-center h-full">
                               <div className="text-xl font-black leading-none drop-shadow-sm">+{achievedMilestone.points}</div>
                            </div>
                         </div>
                       </div>
                     ) : (
                        <div className="mb-6"></div>
                     )}

                     {/* 4-Color Milestone Progress Bar (Free floating without box border) */}
                     <div className={`mt-auto p-2 sm:p-3 flex flex-row items-start justify-between divide-x w-full overflow-x-auto custom-scrollbar ${isDark ? 'divide-[#3c4043]' : 'divide-[#dadce0]'}`}>
                       {facilitatorMilestones.map((m) => {
                         const arcadePerc = Math.min(100, (facilitatorArcadeGamesCount / m.targetArcade) * 100);
                         const skillPerc = Math.min(100, (facilitatorSkillBadgesCount / m.targetSkills) * 100);
                         const totalPerc = Math.floor((arcadePerc + skillPerc) / 2);

                         return (
                           <div key={m.id} className="flex-1 flex flex-col items-center px-2 sm:px-4 min-w-[70px]">
                             <span className={`text-[13px] sm:text-[16px] font-black mb-2 sm:mb-3 whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-[#3c4043]'}`}>
                               {m.title === 'Ultimate' ? 'Ultimate' : m.title}
                             </span>
                             
                             <div className={`w-full h-2.5 sm:h-3 rounded-full overflow-hidden ${isDark ? 'bg-[#3c4043]' : 'bg-[#e8eaed]'}`}>
                               <div className={`h-full rounded-full ${m.colorClass} transition-all duration-1000 ease-out`} style={{ width: `${totalPerc}%` }}></div>
                             </div>
                             
                             <span className={`text-[13px] sm:text-[15px] font-black mt-2 sm:mt-3 tracking-wide ${isDark ? (totalPerc > 0 ? m.textClass : 'text-gray-500') : m.textClass}`}>
                               {totalPerc}%
                             </span>

                             {/* Explicit counts underneath without Bonus Points */}
                             <div className="flex flex-col text-[10px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-bold mt-1.5 sm:mt-2 leading-tight text-center uppercase tracking-wider">
                                <span>G: {Math.min(facilitatorArcadeGamesCount, m.targetArcade)}/{m.targetArcade}</span>
                                <span className="mt-0.5">S: {Math.min(facilitatorSkillBadgesCount, m.targetSkills)}/{m.targetSkills}</span>
                             </div>
                           </div>
                         );
                       })}
                     </div>

                   </div>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[1350px] mt-12 space-y-12">
          
          {points !== null && (
            <div id="tiers-section" className="w-full animate-fade-in-up scroll-mt-24" style={{ animationDelay: '0.21s' }}>
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
                  <span className="text-xl"></span> September Labs
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
                  {completedLabs.length} / 6 September Labs Completed
                </span>
              </div>
            </div>
          )}

          {points !== null && (
            <div className="w-full animate-fade-in-up relative" style={{ animationDelay: '0.25s' }}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-4 ${isDark ? 'border-[#2a2d32]' : 'border-[#dadce0]'}`}>
                <h4 className={`text-2xl font-extrabold tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  September Labs
                </h4>
              </div>
              
              {pendingLabs.length > 0 && (
                <div className="mb-10">
                  <h5 className={`text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                     <span className="w-2 h-2 rounded-full bg-[#ea4335]"></span>
                     Pending Labs ({pendingLabs.length})
                  </h5>
                  
                  {/* PREMIUM GRID BORDER WRAPPER ADDED HERE */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l rounded-2xl overflow-hidden shadow-sm ${isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'}`}>
                    {pendingLabs.map((lab) => (
                      <div key={`pending-${lab.id}`} className={`flex flex-col items-center p-6 border-b border-r transition-colors ${isDark ? 'border-[#3c4043] bg-[#15171b] hover:bg-[#1e1e24]' : 'border-[#dadce0] bg-white hover:bg-gray-50'}`}>
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
                  
                  {/* PREMIUM GRID BORDER WRAPPER ADDED HERE */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l rounded-2xl overflow-hidden shadow-sm ${isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'}`}>
                    {completedLabs.map((lab) => (
                      <div key={`completed-${lab.id}`} className={`flex flex-col items-center p-6 border-b border-r transition-colors ${isDark ? 'border-[#3c4043] bg-[#15171b] hover:bg-[#1e1e24]' : 'border-[#dadce0] bg-white hover:bg-gray-50'}`}>
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
                          className={`font-bold text-[15px] py-2 px-8 rounded-full border transition-all shadow-sm inline-block text-center text-white ${isDark ? 'bg-[#137333] border-[#1e3b29] hover:bg-[#0f5c29]' : 'bg-[#34a853] border-[#137333] hover:bg-[#2b8c45]'}`}
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
                       className={`px-4 py-1.5 rounded-full text-[13px] sm:text-sm font-bold whitespace-nowrap shadow-sm transition-all cursor-pointer ${
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

              <div className="flex justify-end mt-2">
                 <button onClick={downloadCSV} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${isDark ? 'bg-[#2a2d32] border-[#3c4043] hover:bg-[#3c4043] text-gray-300' : 'bg-white border-[#dadce0] hover:bg-gray-50 text-gray-700'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download CSV
                 </button>
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

        {/* --- PREMIUM AI CHAT MODAL --- */}
        {showAiChat && (
          <div className={`fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl flex flex-col z-[100] border overflow-hidden transition-all animate-fade-in-up ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>
            
            {/* Header with Title and Language Toggle */}
            <div className={`flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-[#4285F4] to-[#8A2BE2] text-white`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-sm"></span>
                <h3 className="font-bold text-[15px] tracking-wide">
                  {userName ? userName.split(' ')[0] + "'s Assistant" : "Arcade Assistant"}
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center p-0.5 rounded-full ${isDark ? 'bg-black/30' : 'bg-white/20'}`}>
                  <button onClick={() => setAiLanguage('English')} className={`px-2.5 py-1 text-[10px] font-black tracking-wider rounded-full transition-all ${aiLanguage === 'English' ? 'bg-white text-[#4285F4] shadow-sm' : 'text-white'}`}>EN</button>
                  <button onClick={() => setAiLanguage('Hinglish')} className={`px-2.5 py-1 text-[10px] font-black tracking-wider rounded-full transition-all ${aiLanguage === 'Hinglish' ? 'bg-white text-[#4285F4] shadow-sm' : 'text-white'}`}>HI</button>
                </div>
                <button onClick={() => setShowAiChat(false)} className="p-1.5 rounded-full transition-colors hover:bg-white/20 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Messages (whitespace-pre-wrap ADDED HERE FOR BULLETS) */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              <div className={`whitespace-pre-wrap leading-relaxed p-3 rounded-2xl rounded-tl-sm text-[13px] self-start max-w-[85%] shadow-sm ${isDark ? 'bg-[#2a2d32] text-gray-200' : 'bg-white border border-[#dadce0] text-[#3c4043]'}`}>
                Hi {userName?.split(' ')[0] || 'Player'}! Main tumhare stats dekh sakta hu. Tumhare paas abhi {points || 0} points hain. Bolo, dashboard ke baare me kya janna hai?
              </div>
              
              {messages.map((msg, idx) => (
                <div key={idx} className={`whitespace-pre-wrap leading-relaxed p-3 rounded-2xl text-[13px] max-w-[85%] shadow-sm ${msg.role === 'user' ? 'self-end bg-[#1a73e8] text-white rounded-tr-sm' : `self-start rounded-tl-sm ${isDark ? 'bg-[#2a2d32] text-gray-200' : 'bg-white border border-[#dadce0] text-[#3c4043]'}`}`}>
                  {/* .replace is added to ensure AI bold markdown ** is stripped if it disobeys */}
                  {msg.content.replace(/\*\*/g, '')}
                </div>
              ))}
              
              {isTyping && (
                <div className={`p-3 rounded-2xl rounded-tl-sm text-[13px] self-start w-16 flex justify-center gap-1 shadow-sm ${isDark ? 'bg-[#2a2d32]' : 'bg-white border border-[#dadce0]'}`}>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              )}
            </div>

            {/* Input Field */}
            <div className={`p-3 border-t ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                  placeholder="Ask anything..." 
                  className={`w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-colors border ${isDark ? 'bg-[#2a2d32] text-white placeholder-gray-500 border-[#3c4043] focus:border-[#8ab4f8]' : 'bg-[#f1f3f4] text-[#202124] placeholder-gray-500 border-transparent focus:border-[#1a73e8]'}`}
                />
                <button onClick={handleAskAi} disabled={isTyping || !chatInput.trim()} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-transform hover:scale-110 disabled:opacity-50 ${isDark ? 'text-[#8ab4f8]' : 'text-[#1a73e8]'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDark ? '#3c4043' : '#dadce0'}; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${isDark ? '#5f6368' : '#bdc1c6'}; }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}