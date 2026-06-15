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
  
  // 🔥 NEW STATE FOR HISTORY FILTER & SEARCH
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

  const cardRef = useRef<HTMLDivElement>(null);

  const [showYouText, setShowYouText] = useState(true);
  const [showZeroLabsModal, setShowZeroLabsModal] = useState(false);
  const [showAllCompletedModal, setShowAllCompletedModal] = useState(false);
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

  useEffect(() => {
    if (showZeroLabsModal && !hideModals) {
      const timer = setTimeout(() => setShowZeroLabsModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showZeroLabsModal, hideModals]);

  useEffect(() => {
    if (showAllCompletedModal && !hideModals) {
      const timer = setTimeout(() => setShowAllCompletedModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAllCompletedModal, hideModals]);

  const aprilLabs = [
    {
      id: 'voyage',
      title: 'Arcade Voyage',
      subtitle: 'Practice as you go.',
      image: 'https://services.google.com/fh/files/misc/arcade_voy.png',
      accessCode: '1q-permission-2296',
      points: 1,
      deadline: '30/06/26, 11:59 PM',
      link: 'https://www.skills.google/games/7223',
      matchStrings: ['Arcade Voyage: Identity Management and Pre-trained AI APIs']
    },
    {
      id: 'adventure',
      title: 'Arcade Adventure',
      subtitle: 'Play. Explore. Learn.',
      image: 'https://services.google.com/fh/files/misc/arcade_adv.png',
      accessCode: '1q-observe-07175',
      points: 1,
      deadline: '30/06/26, 11:59 PM',
      link: 'https://www.skills.google/games/7222',
      matchStrings: ['Arcade Adventure: App Dev and Cloud Observability']
    },
    {
      id: 'trail',
      title: 'Arcade Trail',
      subtitle: 'Build through hands-on.',
      image: 'https://services.google.com/fh/files/misc/arcade_trail.png',
      accessCode: '1q-dataset-72501',
      points: 1,
      deadline: '30/06/26, 11:59 PM',
      link: 'https://www.skills.google/games/7224',
      matchStrings: ['Arcade Trail: Data Engineering and Information Protection']
    },
    {
      id: 'basecamp',
      title: 'Arcade Base Camp',
      subtitle: 'Gain essential Google Cloud skills',
      image: 'https://services.google.com/fh/files/misc/arcade_bc.png',
      accessCode: '1q-basecamp-0626',
      points: 1,
      deadline: '30/06/26, 11:59 PM',
      link: 'https://www.skills.google/games/7225',
      matchStrings: ['Arcade Base Camp June 2026']
    },
    {
      id: 'cloud canvas',
      title: 'Work Meets Play: Cloud Canvas',
      subtitle: 'Precision in Expression!',
      image: 'https://services.google.com/fh/files/misc/arcade_work.png',
      accessCode: '1q-worknplay-2557',
      points: 1,
      deadline: '30/06/26, 11:59 PM',
      link: 'https://www.skills.google/games/7227',
      matchStrings: ['Work Meets Play: Cloud Canvas']
    },
    {
      id: 'logic',
      title: 'Logic Log',
      subtitle: 'Google Skills',
      image: 'https://services.google.com/fh/files/misc/arcade_logic.png',
      accessCode: '1q-lookml-25118',
      points: 1,
      deadline: '30/06/26, 11:59 PM',
      link: 'https://www.skills.google/games/7226',
      matchStrings: ['Logic Log']
    }
  ];

  const arcadeTiersData = [
    { name: 'Arcade Trooper', target: 50, image: 'https://services.google.com/fh/files/misc/arcade-trooper.svg', gradient: 'from-[#8ab4f8] to-[#1a73e8]' },
    { name: 'Arcade Ranger', target: 75, image: 'https://services.google.com/fh/files/misc/arcade-ranger.svg', gradient: 'from-[#81c995] to-[#34a853]' },
    { name: 'Arcade Champion', target: 95, image: 'https://services.google.com/fh/files/misc/arcade-champion.svg', gradient: 'from-[#fde293] to-[#f9ab00]' },
    { name: 'Arcade Legend', target: 120, image: 'https://services.google.com/fh/files/misc/arcade-legend.svg', gradient: 'from-[#f28b82] to-[#ea4335]' }
  ];

  // 🔥 Helper Function to get the Current Tier
  const getCurrentTier = () => {
    if (points === null || points < 50) return "No Tier Yet";
    const achieved = [...arcadeTiersData].reverse().find(t => points >= t.target);
    return achieved ? achieved.name : "No Tier Yet";
  };

  const isLabCompleted = (matchStrings: string[]) => {
    if (!history || history.length === 0) return false;
    return history.some(item =>
      matchStrings.some(match => item.name.toLowerCase().includes(match.toLowerCase()))
    );
  };

  const pendingLabs = aprilLabs.filter(lab => !isLabCompleted(lab.matchStrings));
  const completedLabs = aprilLabs.filter(lab => isLabCompleted(lab.matchStrings));

  useEffect(() => {
    if (!loading && points !== null && history) {
      if (completedLabs.length === 0) {
        setShowZeroLabsModal(true);
      } else if (completedLabs.length === aprilLabs.length) {
        setShowAllCompletedModal(true);
      }
    }
  }, [loading, points, history, completedLabs.length, aprilLabs.length]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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

  // 🔥 FILTER LOGIC FOR HISTORY SECTION
  const filteredHistory = history.filter((item) => {
    // Search Query Match
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Dropdown Category Match
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
    // "All Games" shows everything matching search
    return true; 
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      <Navbar />

      {/* 1. Zero Completed Labs Banner */}
      {!hideModals && showZeroLabsModal && (
        <div className="fixed top-20 left-0 right-0 z-[150] flex justify-center px-4 banner-slide-down">
          <div className="w-full max-w-[1100px] bg-[#d93025] rounded-md shadow-md flex items-center justify-between p-4 px-6 border border-[#b3261e]">
            <span className="text-white font-medium text-sm md:text-base">
              You have not completed any June labs yet. Complete challenges, earn points & unlock rewards.
            </span>
            <div className="flex items-center gap-4 ml-4 flex-shrink-0">
              <button
                onClick={() => {
                  localStorage.setItem("hide_arcade_banners", "true");
                  setHideModals(true);
                  setShowZeroLabsModal(false);
                }}
                className="text-white/80 hover:text-white text-xs font-semibold underline whitespace-nowrap transition-colors"
              >
                Don't show again
              </button>
              <button
                onClick={() => setShowZeroLabsModal(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. All Labs Completed Banner */}
      {!hideModals && showAllCompletedModal && (
        <div className="fixed top-20 left-0 right-0 z-[150] flex justify-center px-4 banner-slide-down">
          <div className="w-full max-w-[1100px] bg-[#1a73e8] rounded-md shadow-md flex items-center justify-between p-4 px-6 border border-[#1557b0]">
            <span className="text-white font-medium text-sm md:text-base">
              Congratulations! 🎉 You have successfully completed all labs for this month. Stay tuned for the upcoming challenges!
            </span>
            <div className="flex items-center gap-4 ml-4 flex-shrink-0">
              <button
                onClick={() => {
                  localStorage.setItem("hide_arcade_banners", "true");
                  setHideModals(true);
                  setShowAllCompletedModal(false);
                }}
                className="text-white/80 hover:text-white text-xs font-semibold underline whitespace-nowrap transition-colors"
              >
                Don't show again
              </button>
              <button
                onClick={() => setShowAllCompletedModal(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 FLEX CONTAINER FOR PROPER ALIGNMENT 🔥 */}
      <main className="w-full mx-auto px-6 pt-24 pb-16 flex flex-col items-center">
        
        {/* ================= 🔥 TOP SECTION (NORMAL SIZE: max-w-6xl) 🔥 ================= */}
        <div className="w-full max-w-6xl space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-fade-in-up w-full relative">
              
             {/* LEFT: Avatar properly kept left without stretching */}
             <div className="flex items-center gap-3 md:gap-4 z-10 shrink-0">
               {userName && (
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-sm border border-[#dadce0] flex items-center justify-center bg-[#1a73e8] text-white font-bold text-xl shrink-0">
                   {userAvatar ? (
                     <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     userName.charAt(0).toUpperCase()
                   )}
                 </div>
               )}
               <h1 className="text-3xl md:text-4xl font-bold text-[#202124] tracking-tight whitespace-nowrap">
                 {userName || "Your Dashboard"}
               </h1>
             </div>

             {/* MIDDLE: Perfect Green Splat with Points (rotating very slowly, absolutely centered on large screens) */}
             <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center z-0 my-4 sm:my-0">
               {points !== null && (
                 <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                   {/* Perfect symmetric rounded 6-pointed star using heavy polygon stroke */}
                   <svg 
                     className="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite]" 
                     viewBox="0 0 100 100"
                     style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                   >
                     <polygon 
                       points="50,12 63,27.5 83,31 76,50 83,69 63,72.5 50,88 37,72.5 17,69 24,50 17,31 37,27.5"
                       fill="#0f9d58"
                       stroke="#0f9d58"
                       strokeWidth="11"
                       strokeLinejoin="round"
                     />
                   </svg>
                   {/* Points in White Text */}
                   <span className="relative z-10 text-white font-black text-lg md:text-xl drop-shadow-md">
                     {points}
                   </span>
                 </div>
               )}
             </div>
             
             {/* RIGHT: Chatbot & Calculator Buttons pushed to right edge, slim & premium */}
             <div className="flex flex-col sm:flex-row gap-3 z-10 sm:ml-auto">
               <button 
                 onClick={() => router.push('/chat')} 
                 className="inline-flex justify-center items-center gap-2 text-[#5f6368] font-bold px-5 py-2.5 bg-white border border-[#dadce0] rounded-lg shadow-sm hover:bg-[#f1f3f4] hover:text-[#202124] transition-all whitespace-nowrap"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                 Arcade ChatBot ?
               </button>
               <button 
                 onClick={() => router.push('/calculator')} 
                 className="inline-flex justify-center items-center gap-2 text-white font-bold px-5 py-2.5 bg-[#1a73e8] rounded-lg shadow-sm hover:bg-[#1557b0] transition-all whitespace-nowrap"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 Calculate Points
               </button>
             </div>
          </div>

          {points !== null && (
            <div className="bg-[#f4f7fb] border border-[#dadce0] p-6 md:p-10 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-5 self-start bg-white rounded-xl shadow-md border border-[#e8eaed] overflow-hidden relative flex flex-col group transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] py-5 text-center relative overflow-hidden">
                    <h3 className="text-white font-black text-3xl sm:text-4xl tracking-wide relative z-10">
                      Arcade Points: {points}
                    </h3>
                  </div>
                  
                  <div className="px-8 pt-8 pb-6 flex flex-col items-center relative bg-gradient-to-b from-[#f8f9fa] to-transparent flex-grow">
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
                      className={`text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2 mb-7 ${copied ? 'bg-[#34a853] text-white ring-2 ring-[#ceead6]' : 'bg-gradient-to-r from-[#8ab4f8] to-[#4285f4] hover:from-[#669df6] hover:to-[#1a73e8] text-white'}`}
                    >
                      {copied ? (
                        <>Copied! <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></>
                      ) : (
                        <>Public Profile <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></>
                      )}
                    </button>

                    <div className="mb-6 drop-shadow-sm">
                      <svg width="75" height="75" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 85L50 70L75 85V45H25V85Z" fill="#d35400"/>
                        <circle cx="50" cy="40" r="34" fill="#f39c12"/>
                        <circle cx="50" cy="40" r="26" fill="#e67e22"/>
                        <path d="M50 22L54 32.5H65L56 39L59.5 49L50 43L40.5 49L44 39L35 32.5H46L50 22Z" fill="#fffaf0"/>
                      </svg>
                    </div>

                    <div className="flex w-full gap-3 mb-5">
                      <button 
                        onClick={() => router.push('/leaderboard')}
                        className="flex-1 bg-white border border-[#dadce0] text-[#202124] font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-[#f8f9fa] transition-all text-sm flex items-center justify-center"
                      >
                        Rank {realRank || "-"}
                      </button>
                      <a 
                        href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#202124] text-white font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-[#3c4043] transition-all text-sm flex items-center justify-center text-center"
                      >
                        Subscribe
                      </a>
                    </div>

                    <div className="text-black text-center font-bold text-lg mb-6">
  {points !== null && points >= 50 ? getCurrentTier() : "User Progress Report"}
</div>

                    <div className="text-sm font-bold text-[#80868b] border-t border-[#e8eaed] pt-5 w-full text-center mt-auto tracking-wide uppercase">
                      Member since <span className="text-[#3c4043]">{getMemberSinceYear()}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6 pl-0 lg:pl-4 mt-8 lg:mt-0">
                  
                  {leaderboardData.length > 0 && userUniqueId && (
                    <div className="relative w-full min-h-[200px] flex flex-col justify-center mb-2 border border-[#dadce0] rounded-xl bg-white shadow-sm p-4 overflow-hidden">
                        
                       <button 
                          onClick={() => router.push('/leaderboard')}
                          className="absolute top-3 right-3 bg-[#e8eaed]/60 hover:bg-[#dadce0]/80 text-[#3c4043] text-xs font-semibold px-3 py-1.5 rounded transition-colors z-30 border border-[#d5d7db]"
                       >
                          View Rank
                       </button>

                       {(() => {
                          const uIdx = leaderboardData.findIndex((l: any) => l.id === userUniqueId);
                          if (uIdx === -1) return null;

                          const prevUser = uIdx > 0 ? leaderboardData[uIdx - 1] : null;
                          const meUser = leaderboardData[uIdx];
                          const nextUser = uIdx < leaderboardData.length - 1 ? leaderboardData[uIdx + 1] : null;

                          return (
                              <div className="relative w-full h-full mx-auto flex items-end justify-center gap-4 sm:gap-8 pt-6">
                                
                                {prevUser && (
                                   <div className="flex flex-col items-center animate-float-1 z-10 w-[85px] sm:w-[100px]">
                                      <div className="text-[12px] font-black text-[#202124] mb-1 whitespace-nowrap">Rank {prevUser.rank}</div>
                                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white shadow-sm border border-[#dadce0]">
                                         <img src={prevUser.photoURL || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="text-sm font-black text-[#202124] mt-1 truncate w-full text-center">{prevUser.name?.split(' ')[0] || "Player"}</div>
                                      <div className="text-[12px] font-black text-[#202124]">{prevUser.points} pts</div>
                                   </div>
                                )}

                                {meUser && (
                                   <div 
                                      onClick={() => router.push('/leaderboard')}
                                      className="flex flex-col items-center animate-float-2 z-20 w-[90px] sm:w-[110px] cursor-pointer hover:scale-105 transition-transform"
                                      title="Click to view full leaderboard"
                                   >
                                      <div className="text-[14px] font-black text-[#202124] mb-1 whitespace-nowrap">Rank {meUser.rank}</div>
                                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white shadow-md border-[3px] border-[#1a73e8]">
                                         <img src={meUser.photoURL || userAvatar || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                                      </div>
                                      <div className={`text-[16px] font-black mt-1 truncate w-full text-center transition-colors duration-300 ${showYouText ? 'text-[#1a73e8]' : 'text-[#202124]'}`}>
                                         {showYouText ? "You" : (meUser.name?.split(' ')[0] || "Player")}
                                      </div>
                                      <div className="text-[14px] font-black text-[#202124]">{meUser.points} pts</div>
                                   </div>
                                )}

                                {nextUser && (
                                   <div className="flex flex-col items-center animate-float-3 z-10 w-[85px] sm:w-[100px]">
                                      <div className="text-[12px] font-black text-[#202124] mb-1 whitespace-nowrap">Rank {nextUser.rank}</div>
                                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white shadow-sm border border-[#dadce0]">
                                         <img src={nextUser.photoURL || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="text-sm font-black text-[#202124] mt-1 truncate w-full text-center">{nextUser.name?.split(' ')[0] || "Player"}</div>
                                      <div className="text-[12px] font-black text-[#202124]">{nextUser.points} pts</div>
                                   </div>
                                )}
                              </div>
                          );
                       })()}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-5 w-full">
                    {/* 🔥 1. All Games Box -> Bright Purple & Auto-Scrolls to History */}
                    <div 
                      onClick={() => document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="bg-[#a142f4] px-6 py-5 rounded-xl border border-[#9334e6] flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <span className="text-4xl font-black text-white leading-none mb-2 drop-shadow-sm">
                        {history.filter(item => item.type !== 'Skill Badge').length}
                      </span>
                      <span className="text-[13px] text-white/95 font-bold uppercase tracking-wider text-center drop-shadow-sm">All Games</span>
                    </div>

                    {/* 🔥 2. Skill Badges Box -> Bright Green & Auto-Navigates to Completed Badges in Resources */}
                    <div 
                      onClick={() => router.push('/resources#completed-section')}
                      className="bg-[#0f9d58] px-6 py-5 rounded-xl border border-[#0b8043] flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <span className="text-4xl font-black text-white leading-none mb-2 drop-shadow-sm">
                        {breakdown?.skills || 0}
                      </span>
                      <span className="text-[13px] text-white/95 font-bold uppercase tracking-wider text-center drop-shadow-sm">Skill Badges</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 w-full mt-2">
                    
                    <button 
                      onClick={() => router.push('/leaderboard')} 
                      className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                    >
                      <span>View Top Rank</span>
                      <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                        </svg>
                      </span>
                    </button>

                    <button onClick={shareToWhatsApp} className="relative w-full group bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.002 0h-.004C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.543 5.867L.085 23.316l5.59-1.464C7.382 22.84 9.614 23.4 12 23.4c6.627 0 12-5.373 12-12S18.627 0 12.002 0zm0 21.45c-1.802 0-3.535-.466-5.1-1.348l-.366-.217-3.793.994.996-3.698-.238-.378A9.452 9.452 0 012.55 12c0-5.215 4.236-9.45 9.452-9.45s9.45 4.235 9.45 9.45-4.234 9.45-9.45 9.45zm5.198-6.85c-.285-.143-1.685-.83-1.946-.925-.262-.095-.453-.143-.643.143-.19.285-.736.925-.903 1.115-.166.19-.333.214-.618.071-.286-.143-1.203-.443-2.292-1.25-.848-.628-1.42-1.405-1.586-1.69-.167-.285-.018-.439.125-.582.129-.128.286-.333.428-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.643-1.552-.88-2.124-.233-.556-.47-.48-.643-.489-.166-.008-.357-.008-.547-.008-.19 0-.5.071-.762.357-.262.285-1 .975-1 2.378s1.024 2.758 1.167 2.948c.143.19 2.012 3.072 4.872 4.306.68.293 1.213.468 1.626.598.683.214 1.305.183 1.794.111.547-.08 1.685-.688 1.923-1.353.238-.665.238-1.235.166-1.353-.071-.119-.262-.19-.547-.333z"/>
                        </svg>
                        Share your points
                      </span>
                    </button>

                    <button 
                      onClick={() => router.push('/resources')}
                      className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                    >
                      <span>Skill badges List here</span>
                      <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                        </svg>
                      </span>
                    </button>

                    <button 
                      onClick={() => router.push('/facilitator')}
                      className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                    >
                      <span>Facilitator Program 26</span>
                      <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                        </svg>
                      </span>
                    </button>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= 🔥 BOTTOM SECTION (WIDER SIZE: max-w-[1350px]) 🔥 ================= */}
        <div className="w-full max-w-[1350px] mt-12 space-y-12">
          
          {/* 🔥 NEW ARCADE TIERS SECTION 🔥 */}
          {points !== null && (
            <div className="bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.21s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b border-[#dadce0] pb-4">
                <h4 className="text-2xl font-extrabold text-[#202124] tracking-tight flex items-center gap-3">
                  Arcade Prize Tiers
                </h4>
                <span className="text-[#202124] text-base font-medium">
                  Current Status : <span className="font-bold">{getCurrentTier()}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {arcadeTiersData.map((tier, idx) => {
                  const progressPercentage = Math.min(100, (points / tier.target) * 100);
                  const isAchieved = points >= tier.target;
                  
                  return (
                    <div key={idx} className={`bg-[#f8f9fa] border rounded-lg p-5 flex flex-col items-center relative overflow-hidden shadow-sm hover:shadow-md transition-all group ${isAchieved ? 'border-[#34a853]' : 'border-[#dadce0]'}`}>
                      <div className="w-24 h-24 mb-4 flex items-center justify-center relative">
                        <img src={tier.image} alt={tier.name} className="max-h-full object-contain z-10 group-hover:scale-105 transition-transform duration-500" />
                        {isAchieved && (
                           <div className="absolute inset-0 bg-white/20 rounded-full blur-md z-0"></div>
                        )}
                      </div>
                      
                      <h5 className="text-lg font-bold text-[#202124] mb-3 text-center">{tier.name}</h5>
                      
                      {/* Premium Progress Bar */}
                      <div className="w-full mt-auto flex flex-col gap-2">
                        <div className="w-full h-2.5 bg-[#e8eaed] rounded-full overflow-hidden border border-[#dadce0]/50 shadow-inner">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${tier.gradient} transition-all duration-1000 ease-out`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-extrabold uppercase tracking-wide w-full">
                           <span className={isAchieved ? "text-[#137333]" : "text-[#5f6368]"}>
                             {isAchieved ? "Achieved" : "In Progress"}
                           </span>
                           <span className="text-[#3c4043]">{points} / {tier.target} pts</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer text & links */}
              <div className="mt-8 flex flex-col lg:flex-row justify-between items-center text-sm font-semibold text-[#5f6368] gap-4">
                <div className="flex items-center gap-2 lg:w-1/3">
                  <svg className="w-4 h-4 text-[#80868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Last refreshed: {lastRefreshed || "Just now"}
                </div>
                <div className="text-[#202124] text-[15px] font-medium text-center lg:w-1/3">
                  Current Status : <span className="font-bold">{getCurrentTier()}</span>
                </div>
                <div className="text-center lg:text-right lg:w-1/3">
                  You can also explore full Arcade Tier details <a href="https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline font-bold">here.</a>
                </div>
              </div>
            </div>
          )}

          {points !== null && (
            <div className="bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.22s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h4 className="text-sm sm:text-base font-black text-[#5f6368] uppercase tracking-widest flex items-center gap-2">
                  <span className="text-xl"></span> June Labs
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

                      <span className={`absolute -top-6 text-[8px] md:text-[10px] font-extrabold uppercase whitespace-nowrap ${
                        isCompleted ? 'text-[#137333]' : isCurrent ? 'text-[#f29900]' : 'text-[#9aa0a6]'
                      }`}>
                        {isCompleted ? 'Completed' : isCurrent ? 'Current' : `Lab ${index + 1}`}
                      </span>

                      <span className="absolute -bottom-8 text-[9px] md:text-[11px] font-extrabold text-[#5f6368] text-center w-full leading-tight hidden sm:block">
                        {shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-10 sm:mt-12 w-full text-center border-t border-[#dadce0] pt-4">
                <span className="text-[11px] sm:text-xs font-bold text-[#5f6368]">
                  {completedLabs.length} / 6 June Labs Completed
                </span>
              </div>
            </div>
          )}

          {points !== null && (
            <div className="animate-fade-in-up bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden" style={{ animationDelay: '0.25s' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#dadce0] pb-4">
                <h4 className="text-2xl font-extrabold text-[#202124] tracking-tight flex items-center gap-3">
                  <span className="text-3xl"></span> June Labs Live !
                </h4>
                <span className="bg-[#e8f0fe] text-[#1a73e8] text-xs font-black px-4 py-1.5 rounded-md uppercase tracking-widest border border-[#d2e3fc]">
                  Your Labs Status
                </span>
              </div>
              
              {pendingLabs.length > 0 && (
                <div className="mb-10">
                  <h5 className="text-sm font-black text-[#5f6368] uppercase tracking-widest mb-5 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#ea4335]"></span>
                     Pending Labs ({pendingLabs.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {pendingLabs.map((lab) => (
                      <div key={`pending-${lab.id}`} className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex flex-col overflow-hidden shadow-sm hover:border-[#1a73e8] hover:shadow-md transition-all group">
                        <div className="h-48 bg-[#202124] border-b border-[#dadce0] p-4 flex items-center justify-center relative overflow-hidden">
                          <img src={lab.image} alt={lab.title} className="max-h-full object-contain z-10 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                          <h5 className="text-lg font-bold text-[#202124] leading-tight mb-1">{lab.title}</h5>
                          <p className="text-xs text-[#5f6368] font-medium mb-4">{lab.subtitle}</p>

                          <div className="mt-auto">
                            <p className="text-[11px] font-bold text-[#80868b] uppercase tracking-wider mb-1.5">Access Code</p>
                            
                            <div className="flex items-center justify-between bg-white border border-[#dadce0] rounded-md overflow-hidden mb-4 shadow-sm">
                              <code className="text-[#1a73e8] px-3 py-2 text-[15px] font-bold tracking-wide flex-1">
                                {lab.accessCode}
                              </code>
                              <button 
                                onClick={() => handleCopyCode(lab.accessCode)}
                                className="p-2.5 bg-[#f8f9fa] border-l border-[#dadce0] text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors flex-shrink-0"
                                title="Copy Code"
                              >
                                {copiedCode === lab.accessCode ? (
                                  <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2"></path>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 text-xs font-bold text-[#5f6368] border-t border-[#dadce0] pt-3 mb-4">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              Deadline: {lab.deadline}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-[#fbbc04]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                              Arcade Point: {lab.points}
                            </div>
                          </div>

                          <a 
                            href={lab.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-[#1a73e8] text-white hover:bg-[#1557b0] transition-colors flex items-center justify-center gap-2 shadow-sm"
                          >
                            Start Learning
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedLabs.length > 0 && (
                <div>
                  <h5 className="text-sm font-black text-[#137333] uppercase tracking-widest mb-5 flex items-center gap-2 pt-6 border-t border-[#f1f3f4]">
                    <span className="w-2 h-2 rounded-full bg-[#34a853]"></span>
                    Completed Labs ({completedLabs.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {completedLabs.map((lab) => (
                      <div key={`completed-${lab.id}`} className="bg-white border border-[#ceead6] rounded-xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow group opacity-90">
                        <div className="h-48 bg-[#202124] border-b border-[#dadce0] p-4 flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center">
                              <div className="w-14 h-14 bg-[#137333] rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_15px_rgba(19,115,51,0.8)] animate-pulse">
                                 <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              </div>
                           </div>
                          <img src={lab.image} alt={lab.title} className="max-h-full object-contain z-10 opacity-60" />
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                          <h5 className="text-lg font-bold text-[#202124] leading-tight mb-1">{lab.title}</h5>
                          <p className="text-xs text-[#5f6368] font-medium mb-4">{lab.subtitle}</p>

                          <div className="mt-auto">
                            <p className="text-[11px] font-bold text-[#80868b] uppercase tracking-wider mb-1">Access Code</p>
                            <div className="flex items-center gap-2 mb-4 opacity-70">
                              <code className="text-[#5f6368] bg-[#f8f9fa] px-2 py-1 rounded text-sm font-bold tracking-wide border border-[#dadce0]">
                                {lab.accessCode}
                              </code>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 text-xs font-bold text-[#5f6368] border-t border-[#f1f3f4] pt-3 mb-4">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              Deadline: {lab.deadline}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-[#fbbc04]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                              Arcade Point: {lab.points}
                            </div>
                          </div>

                          <a 
                            href={lab.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-[#137333] text-white hover:bg-[#0d5023] transition-colors flex items-center justify-center gap-2 shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            Completed
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🔥 HISTORY SECTION WITH NEW SEARCH, FILTER & COUNTS 🔥 */}
          {points !== null && (
            <div id="history-section" className="animate-fade-in-up scroll-mt-24" style={{animationDelay: '0.3s'}}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                
                {/* Header Title */}
                <h4 className="text-base font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
                  <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  Labs Completion History
                </h4>
                
                {/* 🔥 NEW CONTROLS: Counts, Search, Dropdown & Export */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1 lg:justify-end">
                  
                  {/* Left Side Counts for Games and Badges */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-start sm:justify-end mr-0 sm:mr-4">
                     <span className="text-sm font-extrabold text-[#5f6368] uppercase tracking-wider whitespace-nowrap">
                       Arcade Games ({history.filter(item => {
                         const lower = item.name.toLowerCase();
                         const isBadge = item.type === 'Skill Badge' || lower.includes('badge');
                         const isCrse = item.type === 'Course' || lower.includes('course');
                         return !isBadge && !isCrse;
                       }).length})
                     </span>
                     <span className="text-sm font-extrabold text-[#5f6368] uppercase tracking-wider whitespace-nowrap">
                       Skill Badges ({breakdown?.skills || history.filter(item => item.type === 'Skill Badge' || item.name.toLowerCase().includes('badge')).length})
                     </span>
                  </div>

                  {/* Search Box */}
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

                  {/* Dropdown Filter */}
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

                  {/* Export CSV */}
                  <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all w-full sm:w-auto whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4-4m4 4V4" /></svg>
                    Export
                  </button>
                </div>
              </div>
              
              <div className="bg-white border border-[#dadce0] rounded-lg overflow-hidden shadow-sm">
                <div className="max-h-[1400px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[#f8f9fa] sticky top-0 z-10 border-b border-[#dadce0] shadow-sm">
                      <tr>
                        <th className="px-5 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider text-center whitespace-nowrap border-r border-[#f1f3f4]">
                           All ({filteredHistory.length})
                        </th>
                        <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider">Labs / Skill Badges</th>
                        <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider whitespace-nowrap border-l border-[#f1f3f4]">Earned Date</th>
                        <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider text-center border-l border-[#f1f3f4]">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f3f4]">
                      {filteredHistory.length > 0 ? (
                        filteredHistory.map((item, i) => (
                          <tr key={i} className="hover:bg-[#f8f9fa] transition-colors group">
                            <td className="px-5 py-4 text-base font-bold text-[#80868b] text-center border-r border-[#f1f3f4]">{i + 1}</td>
                            <td className="px-6 py-4"><p className="text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">{item.name}</p></td>
                            <td className="px-6 py-4 whitespace-nowrap border-l border-[#f1f3f4]"><p className="text-base text-[#5f6368] font-semibold">{item.date}</p></td>
                            <td className="px-6 py-4 text-center border-l border-[#f1f3f4]">
                              <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-black shadow-sm ${item.points >= 2 ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]' : item.points === 1 ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]' : 'bg-[#f3e8fd] text-[#8430ce] border border-[#d7aefb]'}`}>
                                +{item.points}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-[#9aa0a6] font-medium text-lg">
                            No labs found matching your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
        
        .banner-slide-down {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideDown {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(4px, -6px); }
          66% { transform: translate(-4px, 4px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-5px, -5px); }
          66% { transform: translate(5px, 5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(5px, 5px); }
          66% { transform: translate(-5px, -5px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 4.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}