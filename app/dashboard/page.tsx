"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 
import { subscribeLeaderboard, savePublicUserToLeaderboard } from "@/lib/leaderboard"; 
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
// ================= 🔥 CONFETTI IMPORTED 🔥 =================
import Confetti from 'react-confetti';

export default function DashboardPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]); 
  
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userUniqueId, setUserUniqueId] = useState<string | null>(null); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [realRank, setRealRank] = useState<number | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]); // 🔥 STATE FOR MINI LEADERBOARD
  const [copiedCode, setCopiedCode] = useState<string | null>(null); // For Access Codes

  const cardRef = useRef<HTMLDivElement>(null);

  // ================= 🔥 WELCOME CELEBRATION STATES 🔥 =================
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [showWelcomeCelebration, setShowWelcomeCelebration] = useState(false);

  // ================= 🔥 BLINKING NAME STATE (1 SECOND TOGGLE) 🔥 =================
  const [showYouText, setShowYouText] = useState(true);

  // ================= 🔥 NEW MODAL STATES 🔥 =================
  const [showZeroLabsModal, setShowZeroLabsModal] = useState(false);
  const [showAllCompletedModal, setShowAllCompletedModal] = useState(false);

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Jab dashboard load ho jaye aur points mil jayein, tab celebration trigger hoga
  useEffect(() => {
    if (!loading && points !== null) {
      setShowWelcomeCelebration(true);
      const timer = setTimeout(() => setShowWelcomeCelebration(false), 5000); // 5 seconds baad auto gayab
      return () => clearTimeout(timer);
    }
  }, [loading, points]);

  // 🔥 Name blinking effect logic (1 second interval) 🔥
  useEffect(() => {
    const interval = setInterval(() => {
      setShowYouText((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ================= 🔥 AUTO-CLOSE BANNERS LOGIC (5 SECONDS) 🔥 =================
  useEffect(() => {
    if (showZeroLabsModal) {
      const timer = setTimeout(() => setShowZeroLabsModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showZeroLabsModal]);

  useEffect(() => {
    if (showAllCompletedModal) {
      const timer = setTimeout(() => setShowAllCompletedModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAllCompletedModal]);

  // ================= 🔥 APRIL ARCADE LABS DATA 🔥 =================
  const aprilLabs = [
    {
      id: 'voyage',
      title: 'Arcade Voyage',
      subtitle: 'Practice as you go.',
      image: 'https://services.google.com/fh/files/misc/voyage-may.png',
      accessCode: '1q-firebase-29238',
      points: 1,
      deadline: '31/05/26, 10:59 PM',
      link: 'https://www.skills.google/games/7172',
      matchStrings: ['Arcade Voyage: Data Governance and Firebase Foundations']
    },
    {
      id: 'adventure',
      title: 'Arcade Adventure',
      subtitle: 'Play. Explore. Learn.',
      image: 'https://services.google.com/fh/files/misc/arcade-adv.png',
      accessCode: '1q-appdeploy-84713',
      points: 1,
      deadline: '31/05/26, 10:59 PM',
      link: 'https://www.skills.google/games/7171',
      matchStrings: ['Arcade Adventure: Modern App Deployment']
    },
    {
      id: 'trail',
      title: 'Arcade Trail',
      subtitle: 'Build through hands-on.',
      image: 'https://services.google.com/fh/files/misc/trail-may.png',
      accessCode: '1q-devops-95082',
      points: 1,
      deadline: '31/05/26, 11:09 PM',
      link: 'https://www.skills.google/games/7173',
      matchStrings: ['Arcade Trail: Cloud Security and DevOps Foundations']
    },
    {
      id: 'basecamp',
      title: 'Arcade Base Camp',
      subtitle: 'Gain essential Google Cloud skills',
      image: 'https://services.google.com/fh/files/misc/arcade-bc-may.png',
      accessCode: '1q-basecamp-05059',
      points: 1,
      deadline: '31/05/26, 10:59 PM',
      link: 'https://www.skills.google/games/7174',
      matchStrings: ['Arcade Base Camp May 2026']
    },
    {
      id: 'Expressive',
      title: 'Expressive Efficiency',
      subtitle: 'Precision in Expression!',
      image: 'https://services.google.com/fh/files/misc/wmp-may.png',
      accessCode: '1q-worknplay-35206',
      points: 1,
      deadline: '31/05/26, 11:59 PM',
      link: 'https://www.skills.google/games/7176',
      matchStrings: ['Work Meets Play: Expressive Efficiency']
    },
    {
      id: 'Skillup',
      title: 'Skill Up Summer',
      subtitle: 'Google Skills',
      image: 'https://services.google.com/fh/files/misc/specialgame-may.png',
      accessCode: '1q-summer-06031',
      points: 1,
      deadline: '31/05/26, 10:59 PM',
      link: 'https://www.skills.google/games/7175',
      matchStrings: ['Skill Up Summer']
    }
  ];

  const isLabCompleted = (matchStrings: string[]) => {
    if (!history || history.length === 0) return false;
    return history.some(item =>
      matchStrings.some(match => item.name.toLowerCase().includes(match.toLowerCase()))
    );
  };

  // 🔥 CALCULATE PENDING & COMPLETED LABS
  const pendingLabs = aprilLabs.filter(lab => !isLabCompleted(lab.matchStrings));
  const completedLabs = aprilLabs.filter(lab => isLabCompleted(lab.matchStrings));

  // Modals Trigger Logic
  useEffect(() => {
    if (!loading && points !== null && history) {
      if (completedLabs.length === 0) {
        setShowZeroLabsModal(true);
      } else if (completedLabs.length === aprilLabs.length) {
        setShowAllCompletedModal(true);
      }
    }
  }, [loading, points, history]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };


  // ================= 🔥 CACHE LOAD HELPER 🔥 =================
  const loadDataFromCache = (data: any) => {
    setPoints(data.points);
    setBreakdown(data.breakdown);
    setHistory(data.history || []);
    setUserName(data.userName);
    setUserAvatar(data.userAvatar);
    setUserUniqueId(data.userUniqueId);
    setLoading(false);
  };

  // ================= 🔥 PAGE LOAD HOTE HI FETCH/CACHE KAREGA 🔥 =================
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
      // Agar naya URL wahi hai jo pehle se cache me hai, toh bina API call ke fatak se load kardo
      if (cachedData && cachedData.profileUrl === targetUrl) {
        loadDataFromCache(cachedData);
        localStorage.removeItem("current_processing_url");
      } else {
        fetchDataAndCalculate(targetUrl);
      }
    } else if (cachedData) {
      // Direct dashboard open kiya aur data already save hai
      setProfileUrl(cachedData.profileUrl);
      loadDataFromCache(cachedData);
    } else {
      router.push("/calculator"); // Agar kuch bhi nahi mila toh calculator par bhej dega
    }
  }, []);

  useEffect(() => {
    if (!userUniqueId) {
      setRealRank(null);
      return;
    }
    const unsub = subscribeLeaderboard((leaders: any[]) => {
      setLeaderboardData(leaders); // 🔥 Added this to store all leaders for mini-leaderboard
      const me = leaders.find((l: any) => l.id === userUniqueId);
      if (me && me.rank) {
        setRealRank(me.rank);
      } else {
        setRealRank(null);
      }
    });
    return () => unsub();
  }, [userUniqueId, points]);

  // ================= 🔥 API CALL & SCRAPE LOGIC 🔥 =================
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

      // 🔥 Save completely to Local Storage (Cache)
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

      // 🔥 Auto-Save to Leaderboard & Exact Rank Fetch
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
      setError("Backend server se connect nahi ho raha. Kripya URL check karein.");
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

  // ================= 🔥 ERROR SCREEN 🔥 =================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans px-6 text-center">
         <Navbar />
         <div className="text-6xl mb-4">⚠️</div>
         <h2 className="text-2xl font-bold text-[#d93025] mb-2">Something went wrong!</h2>
         <p className="text-[#5f6368] mb-6 max-w-md">{error}</p>
         <button onClick={() => router.push('/calculator')} className="px-6 py-3 bg-[#1a73e8] text-white font-bold rounded-lg shadow hover:bg-[#1557b0]">
           Go Back to Calculator
         </button>
      </div>
    );
  }

  // ================= 🔥 MAIN DASHBOARD UI 🔥 =================
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      <Navbar />

      {/* ================= 🔥 TOP BANNER ALERTS (PREMIUM LONG) 🔥 ================= */}
      
      {/* 1. Zero Completed Labs Banner (Red) */}
      {showZeroLabsModal && (
        <div className="fixed top-20 left-0 right-0 z-[150] flex justify-center px-4 banner-slide-down">
          <div className="w-full max-w-[1100px] bg-[#d93025] rounded-md shadow-md flex items-center justify-between p-4 px-6 border border-[#b3261e]">
            <span className="text-white font-medium text-sm md:text-base">
              You have not completed any May labs yet. Complete challenges, earn points & unlock rewards.
            </span>
            <button
              onClick={() => setShowZeroLabsModal(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors flex-shrink-0 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 2. All Labs Completed Banner (Blue) */}
      {showAllCompletedModal && (
        <div className="fixed top-20 left-0 right-0 z-[150] flex justify-center px-4 banner-slide-down">
          <div className="w-full max-w-[1100px] bg-[#1a73e8] rounded-md shadow-md flex items-center justify-between p-4 px-6 border border-[#1557b0]">
            <span className="text-white font-medium text-sm md:text-base">
              Congratulations! 🎉 You have successfully completed all labs for this month. Stay tuned for the upcoming challenges!
            </span>
            <button
              onClick={() => setShowAllCompletedModal(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors flex-shrink-0 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ================= 🔥 WELCOME CONFETTI CELEBRATION 🔥 ================= */}
      {showWelcomeCelebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <Confetti 
            width={windowDimensions.width} 
            height={windowDimensions.height} 
            numberOfPieces={300} 
            gravity={0.15} 
            opacity={0.9} 
          />
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-fade-in-up">
           
           {/* 🔥 YAHAN AVATAR AUR NAME DONO SAATH ME HAIN (W/ FLOATING ANIMATION) 🔥 */}
           <div className="flex items-center gap-3 md:gap-4">
             {userName && (
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-sm border border-[#dadce0] flex items-center justify-center bg-[#1a73e8] text-white font-bold text-xl shrink-0 animate-header-avatar">
                 {userAvatar ? (
                   <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   userName.charAt(0).toUpperCase()
                 )}
               </div>
             )}
             <h1 className="text-3xl md:text-4xl font-bold text-[#202124] tracking-tight">
               {userName || "Your Dashboard"}
             </h1>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3">
             <button 
               onClick={() => {
                 localStorage.removeItem("arcade_user_data");
                 router.push('/calculator');
               }} 
               className="inline-flex justify-center items-center gap-2 text-[#5f6368] font-bold px-5 py-2.5 bg-white border border-[#dadce0] rounded-lg shadow-sm hover:bg-[#f1f3f4] hover:text-[#202124] transition-all"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               Refresh Dashboard
             </button>
             <button 
               onClick={() => router.push('/calculator')} 
               className="inline-flex justify-center items-center gap-2 text-white font-bold px-5 py-2.5 bg-[#1a73e8] rounded-lg shadow-sm hover:bg-[#1557b0] transition-all"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Calculate Points
             </button>
           </div>
        </div>

        {points !== null && (
          <div className="bg-[#f4f7fb] border border-[#dadce0] p-6 md:p-10 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Progress Report */}
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

                  <div className="relative group w-full mb-5">
                     <button 
                       onClick={() => router.push('/leaderboard')}
                       className="w-full bg-gradient-to-r from-[#fbbc04] to-[#f29900] text-white font-extrabold text-xl py-3 px-8 rounded-full shadow-sm text-center tracking-wide hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                     >
                       Rank # {realRank || "-"}
                     </button>
                  </div>

                  <div className="text-[13px] font-extrabold text-[#1a73e8] bg-[#e8f0fe] px-5 py-1.5 rounded-full uppercase tracking-wider mb-6 text-center border border-[#d2e3fc]">
                    User Progress Report
                  </div>

                  <div className="text-sm font-bold text-[#80868b] border-t border-[#e8eaed] pt-5 w-full text-center mt-auto tracking-wide uppercase">
                    Member since <span className="text-[#3c4043]">{getMemberSinceYear()}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-7 flex flex-col gap-6 pl-0 lg:pl-4 mt-8 lg:mt-0">
                
                {/* 1. 🔥 MINI LEADERBOARD WITH SERIAL ALIGNMENT & BLINKING NAME 🔥 */}
                {leaderboardData.length > 0 && userUniqueId && (
                  <div className="relative w-full min-h-[200px] flex flex-col justify-center mb-2 border border-[#dadce0] rounded-xl bg-white shadow-sm p-4 overflow-hidden">
                     
                     {/* Top Right Transparent "View Leaderboard" Button */}
                     <button 
                        onClick={() => router.push('/leaderboard')}
                        className="absolute top-3 right-3 bg-[#e8eaed]/60 hover:bg-[#dadce0]/80 text-[#3c4043] text-xs font-semibold px-3 py-1.5 rounded transition-colors z-30 border border-[#d5d7db]"
                     >
                        View Leaderboard
                     </button>

                     {(() => {
                        const uIdx = leaderboardData.findIndex((l: any) => l.id === userUniqueId);
                        if (uIdx === -1) return null;

                        const prevUser = uIdx > 0 ? leaderboardData[uIdx - 1] : null;
                        const meUser = leaderboardData[uIdx];
                        const nextUser = uIdx < leaderboardData.length - 1 ? leaderboardData[uIdx + 1] : null;

                        return (
                           <div className="relative w-full h-full mx-auto flex items-end justify-center gap-4 sm:gap-8 pt-6">
                              
                              {/* Prev User (Left side - Higher Rank) */}
                              {prevUser && (
                                 <div className="flex flex-col items-center animate-float-1 z-10 w-[85px] sm:w-[100px]">
                                    <div className="text-[12px] font-black text-[#202124] mb-1 whitespace-nowrap">Rank #{prevUser.rank}</div>
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white shadow-sm border border-[#dadce0]">
                                       <img src={prevUser.photoURL || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-sm font-black text-[#202124] mt-1 truncate w-full text-center">{prevUser.name?.split(' ')[0] || "Player"}</div>
                                    <div className="text-[12px] font-black text-[#202124]">{prevUser.points} pts</div>
                                 </div>
                              )}

                              {/* ME (Center - Clickable) */}
                              {meUser && (
                                 <div 
                                    onClick={() => router.push('/leaderboard')}
                                    className="flex flex-col items-center animate-float-2 z-20 w-[90px] sm:w-[110px] cursor-pointer hover:scale-105 transition-transform"
                                    title="Click to view full leaderboard"
                                 >
                                    <div className="text-[14px] font-black text-[#202124] mb-1 whitespace-nowrap">Rank #{meUser.rank}</div>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white shadow-md border-[3px] border-[#1a73e8]">
                                       <img src={meUser.photoURL || userAvatar || "/avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className={`text-[16px] font-black mt-1 truncate w-full text-center transition-colors duration-300 ${showYouText ? 'text-[#1a73e8]' : 'text-[#202124]'}`}>
                                       {showYouText ? "You" : (meUser.name?.split(' ')[0] || "Player")}
                                    </div>
                                    <div className="text-[14px] font-black text-[#202124]">{meUser.points} pts</div>
                                 </div>
                              )}

                              {/* Next User (Right side - Lower Rank) */}
                              {nextUser && (
                                 <div className="flex flex-col items-center animate-float-3 z-10 w-[85px] sm:w-[100px]">
                                    <div className="text-[12px] font-black text-[#202124] mb-1 whitespace-nowrap">Rank #{nextUser.rank}</div>
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

                {/* 2. --- STATS BOXES --- */}
                <div className="grid grid-cols-2 gap-5 w-full">
                  <div className="bg-white px-6 py-5 rounded-xl border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#1a73e8] hover:shadow-md transition-all">
                    <span className="text-4xl font-black text-[#202124] leading-none mb-2">
                      {history.filter(item => item.type !== 'Skill Badge').length}
                    </span>
                    <span className="text-[13px] text-[#5f6368] font-bold uppercase tracking-wider text-center">All Games</span>
                  </div>

                  <div className="bg-white px-6 py-5 rounded-xl border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#1a73e8] hover:shadow-md transition-all">
                    <span className="text-4xl font-black text-[#202124] leading-none mb-2">
                      {breakdown?.skills || 0}
                    </span>
                    <span className="text-[13px] text-[#5f6368] font-bold uppercase tracking-wider text-center">Skill Badges</span>
                  </div>
                </div>

                {/* 3. --- REORDERED ACTION BUTTONS BOX --- */}
                <div className="flex flex-col gap-4 w-full mt-2">
                  
                  {/* 1st: View Full Leaderboard */}
                  <button 
                    onClick={() => router.push('/leaderboard')} 
                    className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                  >
                    <span>View Full Leaderboard</span>
                    <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* 2nd: WhatsApp Share Button */}
                  <button onClick={shareToWhatsApp} className="relative w-full group bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.002 0h-.004C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.543 5.867L.085 23.316l5.59-1.464C7.382 22.84 9.614 23.4 12 23.4c6.627 0 12-5.373 12-12S18.627 0 12.002 0zm0 21.45c-1.802 0-3.535-.466-5.1-1.348l-.366-.217-3.793.994.996-3.698-.238-.378A9.452 9.452 0 012.55 12c0-5.215 4.236-9.45 9.452-9.45s9.45 4.235 9.45 9.45-4.234 9.45-9.45 9.45zm5.198-6.85c-.285-.143-1.685-.83-1.946-.925-.262-.095-.453-.143-.643.143-.19.285-.736.925-.903 1.115-.166.19-.333.214-.618.071-.286-.143-1.203-.443-2.292-1.25-.848-.628-1.42-1.405-1.586-1.69-.167-.285-.018-.439.125-.582.129-.128.286-.333.428-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.643-1.552-.88-2.124-.233-.556-.47-.48-.643-.489-.166-.008-.357-.008-.547-.008-.19 0-.5.071-.762.357-.262.285-1 .975-1 2.378s1.024 2.758 1.167 2.948c.143.19 2.012 3.072 4.872 4.306.68.293 1.213.468 1.626.598.683.214 1.305.183 1.794.111.547-.08 1.685-.688 1.923-1.353.238-.665.238-1.235.166-1.353-.071-.119-.262-.19-.547-.333z"/>
                      </svg>
                      Share your points
                    </span>
                  </button>

                  {/* 3rd: Skill Badges Button */}
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

                  {/* 4th: Arcade Facilitator Program Button */}
                  <button 
                    onClick={() => router.push('/facilitator')}
                    className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                  >
                    <span>Arcade Facilitator Program 2026</span>
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

        {/* ================= 🔥 APRIL ARCADE LABS LIVE (PREMIUM CARDS) 🔥 ================= */}
        {points !== null && (
          <div className="animate-fade-in-up mt-12 bg-white border border-[#dadce0] rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden" style={{ animationDelay: '0.25s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#dadce0] pb-4">
              <h4 className="text-2xl font-extrabold text-[#202124] tracking-tight flex items-center gap-3">
                <span className="text-3xl">🎮</span> May Labs Live !
              </h4>
              <span className="bg-[#e8f0fe] text-[#1a73e8] text-xs font-black px-4 py-1.5 rounded-md uppercase tracking-widest border border-[#d2e3fc]">
                Your Labs Status
              </span>
            </div>

            {/* --- SECTION 1: PENDING LABS --- */}
            
            {pendingLabs.length > 0 && (
              <div className="mb-10">
                <h5 className="text-sm font-black text-[#5f6368] uppercase tracking-widest mb-5 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#ea4335]"></span>
                   Pending Labs ({pendingLabs.length})
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* --- SECTION 2: COMPLETED LABS --- */}
            {completedLabs.length > 0 && (
              <div>
                <h5 className="text-sm font-black text-[#137333] uppercase tracking-widest mb-5 flex items-center gap-2 pt-6 border-t border-[#f1f3f4]">
                  <span className="w-2 h-2 rounded-full bg-[#34a853]"></span>
                  Completed Labs ({completedLabs.length})
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* ================= 🔥 BADGE COMPLETION HISTORY BOX 🔥 ================= */}
        {points !== null && (
          <div className="animate-fade-in-up mt-12" style={{animationDelay: '0.3s'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
              <h4 className="text-base font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Badge Completion History
              </h4>
              
              <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all w-full sm:w-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV Report
              </button>
            </div>
            
            <div className="bg-white border border-[#dadce0] rounded-lg overflow-hidden shadow-sm">
              <div className="max-h-[650px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-[#f8f9fa] sticky top-0 z-10 border-b border-[#dadce0] shadow-sm">
                    <tr>
                      <th className="px-5 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider text-center w-12 border-r border-[#f1f3f4]">#</th>
                      <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider">Lab / Badge Name</th>
                      <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider whitespace-nowrap border-l border-[#f1f3f4]">Earned Date</th>
                      <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider text-center border-l border-[#f1f3f4]">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f3f4]">
                    {history.length > 0 ? (
                      history.map((item, i) => (
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
                          No valid 2026 badges found for this profile.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

       {/* ================= 🔥 MOVED CARDS (ARCADE 2026 & FACILITATOR) 🔥 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up mt-12" style={{animationDelay: '0.4s'}}>
          
          {/* Card 1: Slim Arcade Program */}
          <div className="bg-white border border-blue-200 rounded-xl py-5 px-6 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden transition-all hover:shadow-md hover:border-blue-300">
            <div className="mb-4">
              <h3 className="text-[20px] font-black text-blue-600 tracking-tight">Arcade Program 2026</h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">January 2026 - Dec 2026</p>
            </div>
            <div className="w-full max-w-sm h-2.5 bg-gray-100 rounded-full flex overflow-hidden mb-2.5 shadow-inner">
              <div className="bg-blue-500 h-full w-[60%] animate-[pulse_2s_ease-in-out_infinite]"></div>
              <div className="bg-purple-500 h-full w-[40%]"></div>
            </div>
            <p className="text-[11px] text-gray-400 font-bold">Season is currently active</p>
          </div>

          {/* Card 2: Slim Facilitator Program */}
          <div 
            onClick={() => router.push('/facilitator')}
            className="cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 border border-indigo-800 rounded-xl py-5 px-6 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4 z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                <span className="text-lg drop-shadow-md">🎓</span>
              </div>
              <h3 className="text-[19px] font-black text-white tracking-tight">Facilitator Program 2026</h3>
            </div>
            
            <p className="text-[11px] font-bold text-blue-100 z-10 bg-white/10 px-5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm uppercase tracking-wider">
              Enrolments Opening Soon
            </p>
          </div>
        </div>

        {/* ================= PREMIUM REWARDS (SWAGS) SECTION ================= */}
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          
          {/* 1. Prize Tier System Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1a73e8] to-[#4285f4] text-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <span className="font-extrabold text-gray-800 text-lg block">Prize Tier System</span>
                <span className="text-xs text-[#1a73e8] font-bold uppercase tracking-wider">Unlock Premium Gear</span>
              </div>
            </div>
            <div className="text-center relative z-10">
              <div className="mt-2 inline-flex items-center gap-2 bg-white border border-blue-100 px-5 py-2 rounded-lg shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status:</span>
                <span className="text-sm font-black text-[#1a73e8]">To be announced</span>
              </div>
            </div>
          </div>

          {/* 2. Swags Image */}
          <img 
            src="https://i.postimg.cc/MT50zzG8/1775382064372.png" 
            alt="Premium Swags Showcase" 
            className="w-full max-w-5xl mx-auto h-auto block rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] relative z-10 transition-transform duration-700 hover:scale-[1.01] my-12" 
          />

          {/* 3. Note Banner */}
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm font-bold rounded-xl p-4 text-center shadow-sm flex items-center justify-center gap-3">
            <span className="text-xl">ℹ️</span>
            Note: These are the previous season 2025 swags. New premium prizes for 2026 will be revealed soon!
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
        /* 🔥 AVATAR FLOATING ANIMATION 🔥 */
        @keyframes header-avatar-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-header-avatar {
          animation: header-avatar-float 3s ease-in-out infinite;
        }
        
        /* 🔥 MINI LEADERBOARD FLOATING ANIMATIONS 🔥 */
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