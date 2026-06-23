"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 
import { savePublicUserToLeaderboard } from "@/lib/leaderboard";

// 🔥 TIME AGO UPDATED: "Just now" wapas add kar diya
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
  }, []);

  const handleAutoCalcToggle = () => {
    if (!autoCalculate) {
      setShowAutoCalcModal(true);
    } else {
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

  const proceedToDashboard = async (overrideUrl?: string | any, isAutoRun: boolean = false) => {
    const targetUrl = typeof overrideUrl === 'string' ? overrideUrl.trim() : profileUrl.trim();

    setError(null);
    setHideRedLine(false);

    if (typeof overrideUrl === 'string') {
      setProfileUrl(targetUrl);
    }

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

      // Save to leaderboard
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
            /* 🔥 SLOW FILL PROGRESS BAR 🔥 */
            @keyframes slow-fill {
              0% { width: 0%; }
              20% { width: 30%; }
              50% { width: 65%; }
              80% { width: 85%; }
              100% { width: 95%; } 
            }
            .animate-slow-fill {
              animation: slow-fill 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
              position: absolute;
              left: 0;
              top: 0;
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

            /* 🔥 PREMIUM URL ID WAVE ANIMATION 🔥 */
            @keyframes text-wave-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2.5px); }
            }
            .wave-char-slow {
              display: inline-block;
              animation: text-wave-slow 1.2s infinite ease-in-out;
            }
          `}</style>

          <div className="p-8 md:p-12 mt-1">
            
            {/* 🔥 DYNAMIC TEXT & TOP RIGHT POINTS 🔥 */}
            <div className="relative mb-8">
              <p className="text-sm md:text-base text-left w-2/3 text-[#202124] font-bold">
                Paste your public profile url here
              </p>
              
              {userPoints !== null && (
                <div 
                  onClick={() => router.push('/dashboard')}
                  className="absolute right-0 top-0 text-sm md:text-base font-bold text-[#202124] hover:underline cursor-pointer"
                  title="View Dashboard"
                >
                  {userName || "Arcade Player"} : {userPoints} Points
                </div>
              )}
            </div>

            {/* 🔥 CLASSIC MATERIAL OUTLINE INPUT BOX 🔥 */}
            <div className="mb-6">
              <div 
                onAnimationEnd={() => setIsShaking(false)}
                className={`relative border-2 rounded-lg transition-colors duration-75 ${
                  isShaking ? 'animate-fast-shake' : ''
                } ${
                  error && !hideRedLine
                    ? "border-[#d93025]"
                    : "border-[#dadce0] focus-within:border-[#1a73e8]"
                }`}
              >
                {/* 🎯 Single Smooth Loader Line in Premium Brown Color */}
                {loading && !error && (
                  <div className="absolute -bottom-[2px] left-2 right-2 h-[2px] bg-transparent overflow-hidden z-0">
                    <div className="h-full bg-[#5d4037] animate-slow-fill rounded-full"></div>
                  </div>
                )}

                {/* 🎯 PERMANENT NAME LABEL */}
                <label className={`absolute -top-3 left-3 bg-white px-1 text-sm font-bold transition-all duration-300 ease-in-out z-10 ${
                  error && !hideRedLine 
                    ? "text-[#d93025]" 
                    : userName 
                    ? "text-[#4e342e]" 
                    : "text-[#1a73e8]"
                }`}>
                  {userName ? `Hi, ${userName}` : "Enter Public Profile Url"}
                </label>
                
                {/* 🔥 MAGIC URL LOADING WAVE TEXT (Matching input text style) 🔥 */}
                {loading ? (
                  <div className="w-full h-[56px] px-4 py-4 text-base text-[#202124] bg-transparent relative z-10 flex items-center overflow-hidden whitespace-nowrap">
                    {profileUrl.startsWith("https://www.skills.google/public_profiles/") ? (
                      <>
                        <span>https://www.skills.google/public_profiles/</span>
                        <span>
                          {profileUrl.replace("https://www.skills.google/public_profiles/", "").split("").map((char, index) => (
                            <span 
                              key={index} 
                              className="wave-char-slow" 
                              style={{ animationDelay: `${index * 0.04}s` }}
                            >
                              {char}
                            </span>
                          ))}
                        </span>
                      </>
                    ) : (
                      <span>
                        {profileUrl.split("").map((char, index) => (
                          <span 
                            key={index} 
                            className="wave-char-slow" 
                            style={{ animationDelay: `${index * 0.04}s` }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                ) : (
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
                    spellCheck="false"
                    className="w-full px-4 py-4 text-base text-[#202124] placeholder-[#9aa0a6] bg-transparent outline-none relative z-10"
                  />
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

            {/* 🔥 REMEMBER ME & DYNAMIC LAST CALCULATE 🔥 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  {/* 🔥 BLACK CHECKBOX 🔥 */}
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="w-4 h-4 text-[#202124] border-[#dadce0] rounded-sm focus:ring-[#202124] focus:ring-offset-0 cursor-pointer" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  <label htmlFor="remember-me" className="ml-3 text-sm font-medium text-[#3c4043] cursor-pointer select-none">Don't forget me next time</label>
                </div>
              </div>

              <div className="text-sm font-medium text-[#3c4043] md:text-right">
                Last Calculate : {recentUrls.length > 0 ? timeAgo(recentUrls[0].time) : "Never"}
              </div>
            </div>

            {/* 🔥 PREMIUM COMPACT BUTTON (With mt-12 spacing and text below) 🔥 */}
            <div className="flex flex-col items-center justify-center w-full mb-6 mt-12">
              <button 
                onClick={proceedToDashboard} 
                disabled={loading} 
                className="w-[90%] sm:w-[400px] md:w-[1000px] bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white text-[16px] font-semibold py-3.5 rounded-full transition-all disabled:opacity-90 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    See you on the dashboard
                  </>
                ) : (
                  "Calculate Arcade Points"
                )}
              </button>
              
              {/* 🔥 NEW FULLY BLACK CLICKABLE LINK 🔥 */}
              <div className="mt-8 text-center">
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[13.5px] font-bold text-[#202124] tracking-wide hover:underline inline-block"
                >
                  Subscribe to Google Skills Arcade to receive updates and perks.
                </a>
              </div>
            </div>

            {/* 🔥 CLEAN AUTO CALCULATE & CHATBOT SECTION 🔥 */}
            <div className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#dadce0] gap-6">
              
              {/* 🌟 AUTO CALCULATE SECTION (LEFT ALIGNED LIKE ORIGINAL) 🌟 */}
              <div>
                <h4 className="text-[15px] font-bold text-[#202124]">Auto Calculate</h4>
                <p className="text-[13px] text-[#5f6368] mt-0.5">Automatically calculate points when you open the page</p>
              </div>

              {/* 🌟 CHATBOT HELP (JUST BESIDE THE AUTO CALCULATE ICON) 🌟 */}
              <div className="flex items-center gap-5 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                
                <button 
                  onClick={() => router.push('/chat')}
                  className="flex items-center gap-1.5 text-[14px] sm:text-[15px] font-bold text-[#202124] hover:text-[#1a73e8] transition-all whitespace-nowrap cursor-pointer"
                  title="Arcade Chatbot Help"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Arcade chat
                </button>
                
                {/* THE TOGGLE ICON */}
                <label className="flex items-center cursor-pointer select-none group shrink-0">
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

            </div>

            {/* 🔥 RECENT PROFILES HISTORY 🔥 */}
            {recentUrls.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#f1f3f4] animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  {/* 🔥 RECENT PROFILES TEXT UPDATED 🔥 */}
                  <p className="text-base font-bold text-[#202124]">
                    Recent Profiles History
                  </p>
                  
                  <button onClick={clearHistory} className="flex items-center gap-2 text-sm text-[#202124] hover:text-black hover:bg-[#f1f3f4] bg-transparent px-4 py-2 rounded-lg font-bold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Clear History
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-x-8 gap-y-6 ml-2 md:ml-5">
                  {recentUrls.map((item, idx) => {
                    const shortId = item.url.split("/").pop()?.substring(0, 16) || "Profile";
                    return (
                      <div key={idx} className="flex flex-col items-end relative w-auto">
                        <button 
                          onClick={() => handleHistoryClick(item.url, idx)} 
                          className={`relative w-full min-w-[240px] inline-flex items-center justify-between gap-3 py-2 pr-5 pl-9 bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#f8f9fa] rounded-xl transition-all shadow-sm hover:shadow-md ${copiedIndex === idx ? 'border-[#34a853] bg-[#e6f4ea]' : ''}`}
                          title={item.url}
                        >
                          {copiedIndex === idx && (
                            <div className="absolute -top-11 left-1/2 z-50 bg-white border border-[#dadce0] shadow-[0_4px_12px_rgba(0,0,0,0.12)] rounded-md px-3 py-1.5 flex items-center gap-1.5 animate-tooltip-pop whitespace-nowrap">
                              <svg className="w-3.5 h-3.5 text-[#137333]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              <span className="text-[#3c4043] text-[12px] font-bold">Profile Copied</span>
                            </div>
                          )}

                          {/* 🎯 STATIC AVATAR */}
                          <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-10">
                            <div className="w-10 h-10 rounded-full bg-white border-[2px] border-[#f1f3f4] overflow-hidden flex items-center justify-center shadow-sm relative">
                              {copiedIndex === idx ? (
                                 <svg className="w-4 h-4 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
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
                          
                          {/* 🎯 BOLD, LARGER BLACK POINTS */}
                          <div className="border-l border-[#dadce0] pl-4 flex items-center justify-center">
                            {item.points !== undefined && (
                              <span className="text-[16px] md:text-[18px] font-black text-black tracking-tight">
                                {item.points} <span className="text-[12px] font-bold text-[#5f6368]">Pts</span>
                              </span>
                            )}
                          </div>
                        </button>
                        
                        {/* 🔥 INDIVIDUAL ITEM TIMING REMOVED FROM HERE 🔥 */}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 SEPARATOR LINE ADDED HERE 🔥 */}
        <div className="mt-12 mb-10 max-w-5xl mx-auto border-t border-[#dadce0] pt-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#202124] flex items-center justify-center gap-3">
              Make Public Profile
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


          </div>
        </div>

      </main>
    </div>
  );
}