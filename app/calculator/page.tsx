"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 
import { savePublicUserToLeaderboard } from "@/lib/leaderboard";

// 🔥 TIME AGO UPDATED: "14m" -> "14 mins ago"
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)} years ago`;
}

// Interface Updated
interface RecentProfile {
  url: string;
  time: string;
  name?: string;
  avatar?: string | null;
  points?: number; 
}

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [hideRedLine, setHideRedLine] = useState(false);
  
  const [recentUrls, setRecentUrls] = useState<RecentProfile[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // 🔥 NEW STATE FOR 3-SECOND AUTO CHANGE HINT
  const [showCopyHint, setShowCopyHint] = useState(false);

  // 🔥 NEW STATE FOR 3-SECOND TEXT TOGGLE
  const [showCoinAvatar, setShowCoinAvatar] = useState(false);

  // 🔥 SHAKE KE LIYE NAYA STATE
  const [isShaking, setIsShaking] = useState(false);

  // 🔥 NEW STATES FOR HEADER USER DATA 🔥
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null); 
  const [userName, setUserName] = useState<string | null>(null); 

  // 🔥 NEW STATES FOR AUTO CALCULATE & MODAL
  const [autoCalculate, setAutoCalculate] = useState(false);
  const [showAutoCalcModal, setShowAutoCalcModal] = useState(false);

  const router = useRouter();

  const whatsappHelpMessage = encodeURIComponent("Hello Facilitator Manish! 👋\n\nI am reaching out regarding the Google Cloud Arcade program. I need some guidance with my profile and points calculation. Could you please help me out?");
  const whatsappHelpUrl = `https://api.whatsapp.com/send?phone=918538980608&text=${whatsappHelpMessage}`;

  useEffect(() => {
    // Check auto calculate preference first
    const savedAuto = localStorage.getItem("arcade_auto_calc") === "true";
    if (savedAuto) setAutoCalculate(true);

    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
      
      // Trigger Auto Calculate if toggle is ON
      if (savedAuto) {
        setTimeout(() => {
          // Passing `true` as isAutoRun flag to fix Remember Me bug
          proceedToDashboard(savedUrl, true);
        }, 600);
      }
    }
    
    const savedRecentUrls = localStorage.getItem("recent_arcade_urls_v3"); 
    if (savedRecentUrls) {
      setRecentUrls(JSON.parse(savedRecentUrls));
    }

    // 🔥 FETCH POINTS, AVATAR, AND NAME FOR HEADER 🔥
    const savedData = localStorage.getItem("arcade_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed) {
          if (typeof parsed.points === 'number') {
            setUserPoints(parsed.points);
          }
          if (parsed.userAvatar) {
            setUserAvatar(parsed.userAvatar);
          }
          if (parsed.userName) {
            setUserName(parsed.userName);
          }
        }
      } catch (e) {
        console.error("Error parsing arcade_user_data", e);
      }
    }

    const hintInterval = setInterval(() => {
      setShowCopyHint((prev) => !prev);
    }, 3000);

    const avatarInterval = setInterval(() => {
      setShowCoinAvatar((prev) => !prev);
    }, 3000);

    return () => {
      clearInterval(hintInterval);
      clearInterval(avatarInterval);
    };
  }, []);

  const handleAutoCalcToggle = () => {
    if (!autoCalculate) {
      // Show modal when turning ON
      setShowAutoCalcModal(true);
    } else {
      // Turn OFF immediately without modal
      setAutoCalculate(false);
      localStorage.setItem("arcade_auto_calc", "false");
    }
  };

  const confirmAutoCalc = () => {
    setAutoCalculate(true);
    localStorage.setItem("arcade_auto_calc", "true");
    setShowAutoCalcModal(false);
  };

  const cancelAutoCalc = () => {
    setShowAutoCalcModal(false);
  };

  const saveToHistory = (urlToSave: string, name?: string, avatar?: string | null, points?: number) => {
    setRecentUrls((prevUrls) => {
      const filtered = prevUrls.filter((u) => u.url !== urlToSave);
      const newItem: RecentProfile = { 
        url: urlToSave, 
        time: new Date().toISOString(),
        name: name || "Arcade Player",
        avatar: avatar || null,
        points: points
      };
      const updatedUrls = [newItem, ...filtered].slice(0, 5); 
      localStorage.setItem("recent_arcade_urls_v3", JSON.stringify(updatedUrls));
      return updatedUrls;
    });
  };

  const clearHistory = () => {
    setRecentUrls([]);
    localStorage.removeItem("recent_arcade_urls_v3");
  };

  const triggerBlink = async () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); await delay(150);
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); await delay(150);
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); 
  };

  const triggerShake = () => {
    setIsShaking(false);
    setTimeout(() => {
      setIsShaking(true);
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); 
      }
    }, 10);
  };

  // 🔥 UPDATED: Added isAutoRun flag to fix Remember Me state bug 🔥
  const proceedToDashboard = async (overrideUrl?: string | any, isAutoRun: boolean = false) => {
    const targetUrl = typeof overrideUrl === 'string' ? overrideUrl.trim() : profileUrl.trim();

    setError(null);
    setHideRedLine(false);

    if (typeof overrideUrl === 'string') {
      setProfileUrl(targetUrl);
    }

    // State hasn't batched yet on load, so we enforce true if it's an auto-run
    const shouldRemember = isAutoRun ? true : rememberMe;
    
    if (shouldRemember) {
      localStorage.setItem("arcade_url", targetUrl);
    } else {
      localStorage.removeItem("arcade_url");
    }

    const urlPattern = /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;
    if (!targetUrl || !urlPattern.test(targetUrl)) {
      setError("Please enter a valid Public Profile URL.");
      triggerShake(); 
      triggerBlink(); 
      return;
    }

    setLoading(true); 
    
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points. Check URL.");
        setLoading(false);
        triggerShake(); 
        return;
      }

      saveToHistory(targetUrl, data.userName, data.userAvatar, data.totalPoints);

      const extractedId = targetUrl.split('/').pop() || null;
      const cacheObj = {
        profileUrl: targetUrl,
        points: data.totalPoints,
        breakdown: data.breakdown,
        history: data.completionHistory || [],
        userName: data.userName || null,
        userAvatar: data.userAvatar || null,
        userUniqueId: extractedId
      };
      
      localStorage.setItem("arcade_user_data", JSON.stringify(cacheObj));
      localStorage.setItem("current_processing_url", targetUrl);

      try {
        await savePublicUserToLeaderboard({
          name: data.userName || "Arcade Player",
          photoURL: data.userAvatar || "/avatar.png",
          points: data.totalPoints,
          profileUrl: targetUrl
        });
      } catch (saveErr) {
        console.error("Leaderboard Save Error:", saveErr);
      }
      
      router.push("/dashboard");

    } catch (err) {
      setError("Connection failed. Check your internet and retry.");
      setLoading(false);
      triggerShake(); 
    }
  };

  const handleHistoryClick = (url: string, index: number) => {
    setProfileUrl(url);
    setError(null);
    setHideRedLine(false);
    
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);

    proceedToDashboard(url);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        
        {/* 🔥 MODAL FOR AUTO CALCULATE 🔥 */}
        {showAutoCalcModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-modal">
            <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-sm p-6 animate-scale-up-modal">
              <h3 className="text-xl font-bold text-[#202124] mb-2">Enable Auto Calculate?</h3>
              <p className="text-[14px] text-[#5f6368] mb-6">
                Points will calculate automatically when you open the page.
              </p>
              <div className="flex gap-3">
                <button onClick={cancelAutoCalc} className="flex-1 bg-white border border-[#dadce0] text-[#3c4043] font-semibold py-2 rounded-md hover:bg-[#f8f9fa] transition-colors">
                  Cancel
                </button>
                <button onClick={confirmAutoCalc} className="flex-1 bg-[#1a73e8] text-white font-semibold py-2 rounded-md hover:bg-[#1557b0] transition-colors">
                  Yes, Enable
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 CLEAN STATIC HEADING 🔥 */}
        <div className="text-center mb-10 flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-[#202124]">
            Arcade Calculator
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden mb-8 relative">
          
          <style>{`
            @keyframes real-loading {
              0% { left: -30%; width: 10%; }
              50% { left: 30%; width: 60%; }
              100% { left: 100%; width: 10%; }
            }
            .animate-real-loading {
              animation: real-loading 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
              position: absolute;
            }

            @keyframes tooltip-pop {
              0% { opacity: 0; transform: translate(-50%, 10px) scale(0.95); }
              15% { opacity: 1; transform: translate(-50%, 0) scale(1); }
              85% { opacity: 1; transform: translate(-50%, 0) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -5px) scale(0.95); }
            }
            .animate-tooltip-pop {
              animation: tooltip-pop 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              pointer-events: none;
            }

            @keyframes fast-shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-8px); }
              80% { transform: translateX(8px); }
            }
            .animate-fast-shake {
              animation: fast-shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
            }

            @keyframes fade-in-modal { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scale-up-modal { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in-modal { animation: fade-in-modal 0.2s ease-out forwards; }
            .animate-scale-up-modal { animation: scale-up-modal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

            /* 🔥 BOUNCING WAVE TEXT ANIMATION (Normal Color, Faster) 🔥 */
            @keyframes text-wave-bounce {
              0%, 40%, 100% { transform: translateY(0); }
              20% { transform: translateY(-4px); }
            }
            .wave-char {
              display: inline-block;
              animation: text-wave-bounce 1s infinite ease-in-out;
            }
          `}</style>

          <div className="p-8 md:p-12 mt-1">
            
            {/* 🔥 REVERTED ORIGINAL TEXT LAYOUT WITH NEW WAVE ANIMATION (Normal Font, Normal Weight) 🔥 */}
            <div className="relative mb-8">
              <p className="text-sm md:text-base text-left w-3/4 text-[#202124]">
                {"Paste your public profile url here".split("").map((char, index) => (
                  <span 
                    key={index} 
                    className="wave-char" 
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute right-0 top-0 text-sm md:text-base font-bold text-[#202124] hover:underline cursor-pointer"
              >
                Subscribe here.
              </a>
            </div>

            <div className="mb-6">
              <div 
                onAnimationEnd={() => setIsShaking(false)}
                className={`relative border-2 rounded-lg transition-colors duration-75 ${isShaking ? 'animate-fast-shake' : ''} ${error ? (hideRedLine ? "border-[#dadce0]" : "border-[#d93025]") : "border-[#dadce0] focus-within:border-[#1a73e8]"}`}
              >
                {/* 🔥 LABEL RESTORED EXACTLY AS ORIGINAL (-top-3) 🔥 */}
                <label className={`absolute -top-3 left-3 bg-white px-1 text-sm font-bold transition-colors duration-75 z-10 ${error ? (hideRedLine ? "text-[#5f6368]" : "text-[#d93025]") : "text-[#1a73e8]"}`}>
                  Enter Public Profile Url
                </label>
                <input
                  type="text"
                  placeholder="https://www.skills.google/public_profiles/..."
                  value={profileUrl}
                  onChange={(e) => {
                    setProfileUrl(e.target.value);
                    setError(null);
                    setHideRedLine(false); 
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      proceedToDashboard();
                    }
                  }}
                  className="w-full px-4 py-4 text-base text-[#202124] bg-transparent outline-none rounded-lg relative z-10"
                />
                
                {/* 🔥 LOADER FIXED: left-3 right-3 to prevent overlapping into curved corners 🔥 */}
                {loading && (
                  <div className="absolute -bottom-[2px] left-3 right-3 h-[2px] bg-transparent overflow-hidden z-0">
                    <div className="h-full bg-[#5f6368] animate-real-loading rounded-full"></div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 mt-2 text-[#d93025] text-sm font-medium">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="w-4 h-4 text-[#1a73e8] border-[#dadce0] rounded-sm focus:ring-[#1a73e8] focus:ring-offset-0 cursor-pointer" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <label htmlFor="remember-me" className="ml-3 text-sm font-medium text-[#3c4043] cursor-pointer select-none">Remember me</label>
                </div>
              </div>

              {/* 🔥 NAME & POINTS ADDED IN THE MIDDLE (Clickable & Underline on Hover) 🔥 */}
              {userPoints !== null && (
                <div 
                  onClick={() => router.push('/dashboard')}
                  className="text-black font-bold text-[15px] md:text-center flex-1 cursor-pointer hover:underline"
                  title="View Dashboard"
                >
                  {userName || "Arcade Player"} : {userPoints} Points
                </div>
              )}

              <div className="text-sm font-medium text-[#3c4043] md:text-right">
                Last update: 15/06/2026 at 10:00 IST
              </div>
            </div>

            {/* 🔥 BUTTON PADDING UPDATED TO py-4 FOR THICKER LOOK 🔥 */}
            <button onClick={proceedToDashboard} disabled={loading} className="w-full bg-[#1e8e3e] hover:bg-[#137333] active:bg-[#0d5023] text-white text-[16px] font-semibold py-4 rounded-lg transition-all disabled:opacity-90 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  See you on the dashboard.
                </>
              ) : (
                "Calculate Arcade Points"
              )}
            </button>

            {/* 🔥 NOTE, AVATAR & HELP COMBINED 🔥 */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-6 px-1">
              <div className="flex items-center gap-3">
                {userPoints !== null && (
                  <div 
                    onClick={() => router.push('/dashboard')}
                    className="w-10 h-10 shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
                    title="View Dashboard"
                  >
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-full border-[2px] border-[#dadce0] shadow-sm" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white border-[2px] border-[#dadce0] shadow-sm flex items-center justify-center">
                        <span className="text-[18px] font-black text-[#1a73e8]">
                          {userName ? userName.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[13.5px] font-bold text-[#5d4037] leading-snug tracking-wide text-left">
                  Set your profile to Public to enable badge access.
                </p>
              </div>

              <a href={whatsappHelpUrl} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors mt-3 sm:mt-0 whitespace-nowrap">
                Need Help ?
              </a>
            </div>

            {/* 🔥 MOVED AUTO CALCULATE TOGGLE (ABOVE RECENT PROFILES) 🔥 */}
            <div className="mt-8 pt-6 flex items-center justify-between border-t border-[#dadce0]">
              <div>
                <h4 className="text-[15px] font-bold text-[#202124]">Auto Calculate</h4>
                <p className="text-[13px] text-[#5f6368] mt-0.5">Automatically calculate points when you open the page</p>
              </div>
              <label className="flex items-center cursor-pointer select-none group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={autoCalculate} 
                    onChange={handleAutoCalcToggle} 
                  />
                  <div className={`block w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${autoCalculate ? 'bg-[#1a73e8]' : 'bg-[#dadce0] group-hover:bg-[#d1d5db]'}`}></div>
                  <div 
                    className={`dot absolute left-[3px] top-[3px] bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm ${autoCalculate ? 'transform translate-x-5' : ''}`} 
                    style={{ width: '18px', height: '18px' }}
                  ></div>
                </div>
              </label>
            </div>

            {/* 🔥 RECENT PROFILES (Width reduced for sleeker premium feel) 🔥 */}
            {recentUrls.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#f1f3f4] animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-extrabold text-[#3c4043] tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recent Profiles History
                  </p>
                  
                  <button onClick={clearHistory} className="flex items-center gap-2 text-sm text-[#202124] hover:text-black hover:bg-[#f1f3f4] bg-transparent px-4 py-2 rounded-lg font-bold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Clear History
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-x-8 gap-y-5 ml-2 md:ml-5">
                  {recentUrls.map((item, idx) => {
                    const shortId = item.url.split("/").pop()?.substring(0, 16) || "Profile";
                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleHistoryClick(item.url, idx)} 
                        className={`relative w-auto min-w-[240px] inline-flex items-center justify-between gap-3 py-2 pr-5 pl-9 bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#f8f9fa] rounded-xl transition-all shadow-sm hover:shadow-md ${copiedIndex === idx ? 'border-[#34a853] bg-[#e6f4ea]' : ''}`}
                        title={item.url}
                      >
                        {copiedIndex === idx && (
                          <div className="absolute -top-11 left-1/2 z-50 bg-white border border-[#dadce0] shadow-[0_4px_12px_rgba(0,0,0,0.12)] rounded-md px-3 py-1.5 flex items-center gap-1.5 animate-tooltip-pop whitespace-nowrap">
                            <svg className="w-3.5 h-3.5 text-[#137333]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            <span className="text-[#3c4043] text-[12px] font-bold">Profile Copied</span>
                          </div>
                        )}

                        <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-10">
                          {/* 🔥 REMOVED animate-float-avatar SO IT STAYS STATIC 🔥 */}
                          <div className="w-10 h-10 rounded-full bg-white border-[2px] border-[#f1f3f4] overflow-hidden flex items-center justify-center shadow-sm relative">
                            {copiedIndex === idx ? (
                               <svg className="w-4 h-4 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            ) : item.points !== undefined ? (
                              <>
                                <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${showCoinAvatar ? 'opacity-0' : 'opacity-100'}`}>
                                  {item.avatar ? (
                                    <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[15px] font-black text-[#1a73e8]">
                                      {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                                    </span>
                                  )}
                                </div>
                                
                                <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-[#f8f9fa] transition-opacity duration-500 ease-in-out ${showCoinAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDE047] via-[#D4AF37] to-[#996515] shadow-[inset_-2px_-2px_4px_rgba(153,101,21,0.6),inset_2px_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center relative">
                                    <div className="absolute w-[75%] h-[75%] rounded-full bg-gradient-to-br from-[#D4AF37] via-[#FDE047] to-[#B8860B] border border-white/20 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center">
                                      <span className="text-[#4A2E00] text-[11px] font-black tracking-tighter" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.4)' }}>
                                        {item.points}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white">
                                {item.avatar ? (
                                  <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[15px] font-black text-[#1a73e8]">
                                    {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start leading-tight text-left min-w-[120px]">
                          <span className="text-[14px] font-black text-[#202124] tracking-tight">{item.name || "Arcade Player"}</span>
                          <span className="text-[10px] text-[#5f6368] font-bold opacity-90 mt-0.5">
                            ID: {shortId}...
                          </span>
                        </div>
                        
                        <div className="border-l border-[#dadce0] pl-3 flex items-center">
                          <span className="text-[9px] font-extrabold text-[#80868b] bg-[#f1f3f4] px-1.5 py-1 rounded tracking-wide">
                            {timeAgo(item.time)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 GUIDE BOXES LAYOUT INCREASED FOR PREMIUM HORIZONTAL LOOK 🔥 */}
        <div className="mt-12 mb-10 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#202124] flex items-center justify-center gap-3">
              Get Public Profile ?
            </h2>
            <p className="text-[#5f6368] mt-2 text-[15px]">Follow these simple steps to find your public profile URL</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-6 top-10 bottom-10 w-[2px] bg-[#e8eaed]"></div>

            <div className="relative flex flex-col md:flex-row gap-6 mb-12">
              <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold shadow-md md:mt-0 mt-2">
                1
              </div>
              
              <div className="flex-1 bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-[#202124] mb-3 flex items-center gap-2">
                  <span className="text-[#3b82f6] text-xl font-extrabold">➔</span> Sign in to Google Skills
                </h3>
                <p className="text-[#5f6368] mb-5 text-[15px] leading-relaxed">
                  Access the Google Skills platform and sign in with your Google account.<br className="hidden md:block"/>
                  Navigate to the Google Skills website and sign in with your Google account to access your profile.
                </p>
                <a href="https://www.skills.google/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-8 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Go to Google Skills
                </a>
                
                <div className="rounded-xl overflow-hidden border border-[#dadce0] bg-[#f8f9fa]">
                  <img src="https://i.ibb.co/R4bb64LP/find-ppu-ss-s-1.png" alt="Step 1 Guide" className="w-[102%] max-w-none h-auto object-cover -mb-[5%]" />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-6 mb-12">
              <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold shadow-md md:mt-0 mt-2">
                2
              </div>

              <div className="flex-1 bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-[#202124] mb-3 flex items-center gap-2">
                  <span className="text-[#10b981] text-lg flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#10b981]">👤</span> Access Your Public Profile
                </h3>
                <p className="text-[#5f6368] mb-5 text-[15px] leading-relaxed">
                  After logging in navigate to the following link to access your Google Skills account settings.<br className="hidden md:block"/>
                  On this Account Settings page scroll down to 'Public Profile' section.
                </p>
                <a href="https://www.skills.google/my_account/profile" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-8 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Go to Account Settings
                </a>

                <div className="rounded-xl overflow-hidden border border-[#dadce0] bg-[#f8f9fa]">
                  <img src="https://i.ibb.co/99DTpv3Q/find-ppu-ss-s-2.png" alt="Step 2 Guide" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-6">
              <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold shadow-md md:mt-0 mt-2">
                3
              </div>

              <div className="flex-1 bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-[#202124] mb-3 flex items-center gap-2">
                  <span className="text-[#a855f7] text-2xl"></span> Copy Your Profile URL
                </h3>
                <p className="text-[#5f6368] mb-6 text-[15px] leading-relaxed">
                  Select and copy the URL - this is your public profile URL.
                </p>

                <div className="bg-[#fff9e6] border border-[#ffecb3] rounded-xl p-4 flex gap-3 items-start">
                  <svg className="w-5 h-5 text-[#b06000] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <span className="font-bold text-[#b06000] block mb-1">Important:</span>
                    <span className="text-[#b06000] text-[14px]">Make sure your profile is set to <strong className="font-bold">public</strong> so the calculator can access your badge information.</span>
                  </div>
                </div>

                {/* 🔥 MERGED "PUBLIC PROFILE FORMAT" INSIDE STEP 3 🔥 */}
                <div className="mt-8 pt-6 border-t border-[#e8eaed]">
                  <h4 className="text-[16px] font-bold text-[#202124] mb-5">Your URL should look like this..</h4>
                  
                  <div className="bg-[#1e8e3e] rounded-xl p-4 md:p-5 border border-[#137333] mb-4 w-full overflow-hidden flex items-center justify-center shadow-inner">
                    <p className="text-white font-mono text-[14px] md:text-[16px] break-all text-center tracking-wide">
                      https://www.skills.google/public_profiles/<span className="font-extrabold">PROFILE_ID</span>
                    </p>
                  </div>
                  
                  <p className="text-[#5f6368] text-[15px] leading-relaxed text-center">
                    The unique ID at the end is specific to your profile and allows the calculator to access your badge information.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}