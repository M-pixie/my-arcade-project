"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 
import { savePublicUserToLeaderboard } from "@/lib/leaderboard";

// 🔥 TIME AGO UPDATED
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

// 🔥 DYNAMIC THEME HELPER FOR HISTORY CARDS
const getCardTheme = (name: string) => {
  const cardColors = ["#34a853", "#ea4335", "#9333ea", "#f9ab00", "#1a73e8"];
  if (!name) return cardColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return cardColors[Math.abs(hash) % cardColors.length];
}

interface RecentProfile {
  url: string;
  time: string;
  name?: string;
  avatar?: string | null;
  points?: number; 
}

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  // 🔥 PAUSE/RESUME STATE (idle, loading, paused)
  const [calcState, setCalcState] = useState<'idle' | 'loading' | 'paused'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  const [error, setError] = useState<string | null>(null);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [hideRedLine, setHideRedLine] = useState(false);
  
  const [recentUrls, setRecentUrls] = useState<RecentProfile[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // 🔥 STATES FOR TIMER 🔥
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  const [isShaking, setIsShaking] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null); 
  const [userName, setUserName] = useState<string | null>(null); 

  const [autoCalculate, setAutoCalculate] = useState(false);
  const [showAutoCalcModal, setShowAutoCalcModal] = useState(false);
  
  // 🔥 NEW STATES FOR RESET MODAL & ANIMATION PHASES
  const [showResetModal, setShowResetModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'wave' | 'collide'>('wave');

  // 🔥 DARK MODE STATE 🔥
  const [isDark, setIsDark] = useState(false);

  const router = useRouter();

  // 🔥 TIMER EFFECT 🔥
  useEffect(() => {
    setIsMounted(true);
    // Target date: 13 July 2026, 17:00:00 IST
    const targetDate = new Date("July 13, 2026 17:00:00 GMT+0530").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load Dark Mode Preference
    const savedTheme = localStorage.getItem("arcade_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    }

    const savedAuto = localStorage.getItem("arcade_auto_calc") === "true";
    if (savedAuto) setAutoCalculate(true);

    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
      
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

    const savedData = localStorage.getItem("arcade_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed) {
          if (typeof parsed.points === 'number') setUserPoints(parsed.points);
          if (parsed.userAvatar) setUserAvatar(parsed.userAvatar);
          if (parsed.userName) setUserName(parsed.userName);
        }
      } catch (e) {
        console.error("Error parsing arcade_user_data", e);
      }
    }
  }, []);

  // Toggle Function for Dark Mode
  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("arcade_theme", newTheme ? "dark" : "light");
  };

  // 🔥 ANIMATION PHASE CONTROLLER 🔥
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (calcState === 'loading') {
      setLoadingStep('wave'); // Start with slow wave
      timer = setTimeout(() => {
        setLoadingStep('collide'); // Shift to fast Gemini collide after 1.2s
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [calcState]);

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

  const handleResetData = () => {
    localStorage.removeItem("arcade_url");
    localStorage.removeItem("recent_arcade_urls_v3");
    localStorage.removeItem("arcade_user_data");
    localStorage.removeItem("current_processing_url");
    localStorage.removeItem("arcade_auto_calc");

    setProfileUrl("");
    setRecentUrls([]);
    setUserPoints(null);
    setUserAvatar(null);
    setUserName(null);
    setAutoCalculate(false);
    setRememberMe(false);
    setError(null);
    setCalcState('idle');

    setShowResetModal(false);
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

  // 🔥 CORE CALCULATE FUNCTION 🔥
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

    // 🔥 PREPARE FOR FETCH & ABORT CONTROLLER
    setCalcState('loading'); 
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
        signal // Attach the signal to allow aborting
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points. Check URL.");
        setCalcState('idle');
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

    } catch (err: any) {
      // Ignore error if we intentionally aborted it (Paused)
      if (err.name === 'AbortError') {
        console.log('Calculation Paused');
        return;
      }

      setError("Connection failed. Check your internet and retry.");
      setCalcState('idle');
      triggerShake(); 
    }
  };

  // 🔥 HANDLER FOR MAIN BUTTON CLICKS (PLAY/PAUSE/RESUME) 🔥
  const handleMainButtonClick = () => {
    if (calcState === 'idle') {
      proceedToDashboard();
    } else if (calcState === 'loading') {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Cancel network request
      }
      setCalcState('paused');
    } else if (calcState === 'paused') {
      proceedToDashboard();
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

  const isLoading = calcState === 'loading';
  const isPaused = calcState === 'paused';

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-300 ${isDark ? 'bg-[#0a0a0b] text-gray-200' : 'bg-[#f8f9fa] text-[#202124]'}`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        
        {/* 🔥 MODAL FOR AUTO CALCULATE 🔥 */}
        {showAutoCalcModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-modal">
            <div className={`rounded-lg shadow-xl w-full max-w-sm p-6 animate-scale-up-modal ${isDark ? 'bg-[#1a1b1e] border border-[#3c4043]' : 'bg-white'}`}>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>Enable Auto Calculate?</h3>
              <p className={`text-[14px] mb-6 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                Points will calculate automatically when you open the page.
              </p>
              <div className="flex gap-3">
                <button onClick={cancelAutoCalc} className={`flex-1 font-semibold py-2 rounded-md transition-colors border ${isDark ? 'bg-transparent border-[#3c4043] text-gray-300 hover:bg-[#2a2d32]' : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]'}`}>
                  Cancel
                </button>
                <button onClick={confirmAutoCalc} className={`flex-1 font-semibold py-2 rounded-md transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                  Yes, Enable
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 MODAL FOR RESET DATA 🔥 */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-modal">
            <div className={`rounded-lg shadow-xl w-full max-w-sm p-6 animate-scale-up-modal ${isDark ? 'bg-[#1a1b1e] border border-[#3c4043]' : 'bg-white'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-[#3c1e1e] text-[#f28b82]' : 'bg-[#fce8e6] text-[#d93025]'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#202124]'}`}>Reset Data?</h3>
              </div>
              <p className={`text-[14px] mb-6 pl-[52px] ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                Are you sure you want to reset all data and history? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetModal(false)} className={`flex-1 font-semibold py-2 rounded-md transition-colors border ${isDark ? 'bg-transparent border-[#3c4043] text-gray-300 hover:bg-[#2a2d32]' : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]'}`}>
                  Cancel
                </button>
                <button onClick={handleResetData} className={`flex-1 font-semibold py-2 rounded-md transition-colors ${isDark ? 'bg-[#d93025] text-white hover:bg-[#b3261e]' : 'bg-[#d93025] text-white hover:bg-[#b3261e]'}`}>
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-10 flex justify-center items-center">
          <h1 className={`text-3xl md:text-5xl font-medium tracking-tight leading-tight px-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
            Arcade Calculator
          </h1>
        </div>

        {/* 🔥 MAIN CARD 🔥 */}
        <div className={`rounded-xl border shadow-sm overflow-hidden mb-8 relative transition-all duration-1000 ease-in-out ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
          
          <style>{`
            @keyframes slow-fill { 0% { width: 0%; } 20% { width: 30%; } 50% { width: 65%; } 80% { width: 85%; } 100% { width: 95%; } }
            .animate-slow-fill { animation: slow-fill 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; position: absolute; left: 0; top: 0; }
            @keyframes tooltip-pop { 0% { opacity: 0; transform: translate(-50%, 10px) scale(0.95); } 15% { opacity: 1; transform: translate(-50%, 0) scale(1); } 85% { opacity: 1; transform: translate(-50%, 0) scale(1); } 100% { opacity: 0; transform: translate(-50%, -5px) scale(0.95); } }
            .animate-tooltip-pop { animation: tooltip-pop 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; pointer-events: none; }
            @keyframes fast-shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-8px); } 80% { transform: translateX(8px); } }
            .animate-fast-shake { animation: fast-shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
            @keyframes fade-in-modal { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scale-up-modal { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in-modal { animation: fade-in-modal 0.2s ease-out forwards; }
            .animate-scale-up-modal { animation: scale-up-modal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            
            /* 🔥 PHASE 1: INITIAL WAVE ANIMATION 🔥 */
            @keyframes wave-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.4; }
              50% { transform: translateY(-3.5px); opacity: 1; }
            }
            .dot-wave-1 { animation: wave-bounce 1s infinite ease-in-out; animation-delay: 0s; }
            .dot-wave-2 { animation: wave-bounce 1s infinite ease-in-out; animation-delay: 0.15s; }
            .dot-wave-3 { animation: wave-bounce 1s infinite ease-in-out; animation-delay: 0.3s; }

            /* 🔥 PHASE 2: FAST GEMINI TRIANGULAR COLLISION 🔥 */
            @keyframes rotate-gemini {
              0% { transform: rotate(0deg) scale(0.9); }
              100% { transform: rotate(360deg) scale(0.9); }
            }
            @keyframes collide-1 {
              0%, 100% { transform: translate(0, 0) scale(0.8); }
              50% { transform: translate(0, 4px) scale(1.3); }
            }
            @keyframes collide-2 {
              0%, 100% { transform: translate(0, 0) scale(0.8); }
              50% { transform: translate(3.5px, -2.5px) scale(1.3); }
            }
            @keyframes collide-3 {
              0%, 100% { transform: translate(0, 0) scale(0.8); }
              50% { transform: translate(-3.5px, -2.5px) scale(1.3); }
            }
            
            .gem-container {
              width: 14px;
              height: 14px;
              position: relative;
              animation: rotate-gemini 1s linear infinite;
            }
            
            .gem-dot {
              position: absolute;
              width: 4.5px;
              height: 4.5px;
              border-radius: 50%;
            }
            
            .gem-dot-1 { top: 0px; left: 4.75px; animation: collide-1 0.6s ease-in-out infinite; }
            .gem-dot-2 { top: 8px; left: 0px; animation: collide-2 0.6s ease-in-out infinite; }
            .gem-dot-3 { top: 8px; left: 9.5px; animation: collide-3 0.6s ease-in-out infinite; }

            /* 🔥 SIMPLE PROGRESSIVE DOTS FOR CALCULATING... 🔥 */
            @keyframes dots-step {
              0% { content: ""; }
              25% { content: "."; }
              50% { content: ".."; }
              75% { content: "..."; }
              100% { content: ""; }
            }
            .progressive-dots::after {
              content: "";
              display: inline-block;
              width: 14px;
              text-align: left;
              animation: dots-step 1.5s infinite step-start;
            }
          `}</style>

          <div className="p-4 sm:p-8 md:p-12 mt-1">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <p className={`text-sm md:text-base font-bold sm:mt-2 ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                Paste your public profile url here
              </p>
              
              <div className="flex items-center gap-2 sm:mt-2 w-full sm:w-auto justify-end">
                {/* 🔥 SMART CLICKABLE THEME ICON 🔥 */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${isDark ? 'bg-[#2a2d32] text-white hover:bg-[#3c4043]' : 'bg-[#e8eaed] text-[#202124] hover:bg-[#dadce0]'}`}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? (
                    // Moon Icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    // Sun Icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>

                {/* 🔥 SMART CLICKABLE AUTO CALCULATE ICON 🔥 */}
                <button
                  onClick={handleAutoCalcToggle}
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${autoCalculate ? (isDark ? 'bg-[#2a2d32] text-green-400' : 'bg-[#e8eaed] text-green-600') : (isDark ? 'bg-transparent text-[#5f6368] hover:bg-[#2a2d32] hover:text-white' : 'bg-transparent text-[#9aa0a6] hover:bg-[#e8eaed] hover:text-black')}`}
                  title={autoCalculate ? "Auto Calculate Enabled" : "Enable Auto Calculate"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 🔥 NEW LAYOUT: INPUT & PREMIUM BUTTON INTEGRATED IN ONE BOX 🔥 */}
            <div className="mb-6">
              <div 
                onAnimationEnd={() => setIsShaking(false)}
                
                className={`group relative min-w-0 border-2 rounded-xl transition-colors duration-200 p-1.5 flex flex-row items-center shadow-sm w-full h-[60px] sm:h-[68px] ${isShaking ? 'animate-fast-shake' : ''} ${error && !hideRedLine ? "border-[#d93025]" : (isDark ? "bg-transparent border-[#3c4043] focus-within:border-[#8ab4f8]" : "bg-transparent border-[#dadce0] focus-within:border-blue-600")}`}
              >
                {isLoading && !error && userPoints === null && (
                  <div className="absolute -bottom-[2px] left-6 right-6 h-[2px] bg-transparent overflow-hidden z-0">
                    <div className={`h-full animate-slow-fill rounded-b-lg ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                  </div>
                )}

                {/* 🔥 LABEL BACKGROUND PERFECTLY MATCHES PARENT CARD BACKGROUND 🔥 */}
                <label className={`absolute -top-3 left-6 px-2 text-xs sm:text-sm font-bold flex items-center transition-all duration-300 ease-in-out z-10 ${isDark ? 'bg-[#15171b]' : 'bg-white'} ${error && !hideRedLine ? (isDark ? "text-[#f28b82]" : "text-[#d93025]") : (userName && !isLoading && !isPaused) ? (isDark ? "text-[#e8eaed] group-focus-within:text-[#8ab4f8]" : "text-[#4e342e] group-focus-within:text-blue-600") : (isDark ? "text-white group-focus-within:text-[#8ab4f8]" : "text-black group-focus-within:text-blue-600")}`}>
                  {isLoading ? (
                    loadingStep === 'wave' ? (
                      <div className="flex items-center gap-[3px] h-5 px-1">
                        <div className={`w-[5px] h-[5px] rounded-full dot-wave-1 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                        <div className={`w-[5px] h-[5px] rounded-full dot-wave-2 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                        <div className={`w-[5px] h-[5px] rounded-full dot-wave-3 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                      </div>
                    ) : (
                      <div className="flex items-center h-5 px-1">
                        <div className="gem-container" style={{ transform: 'scale(0.7)' }}>
                          <div className={`gem-dot gem-dot-1 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                          <div className={`gem-dot gem-dot-2 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                          <div className={`gem-dot gem-dot-3 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                        </div>
                      </div>
                    )
                  ) : isPaused ? (
                    "Calculation Paused"
                  ) : (
                    userName ? `Hi, ${userName}` : "Enter Public Profile Url"
                  )}
                </label>
                
                {calcState !== 'idle' ? (
                  <div className={`flex-1 h-full px-4 sm:px-6 flex items-center justify-between overflow-hidden whitespace-nowrap min-w-0 ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                    <span className="truncate text-sm sm:text-base font-medium">{profileUrl}</span>
                    {isPaused && (
                      <button 
                        onClick={() => setCalcState('idle')}
                        title="Cancel Calculation"
                        className={`ml-2 transition-colors p-1 shrink-0 ${isDark ? 'text-[#9aa0a6] hover:text-white' : 'text-[#9aa0a6] hover:text-black'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="https://www.skills.google/public_profiles/..."
                    value={profileUrl}
                    onChange={(e) => { setProfileUrl(e.target.value); setError(null); setHideRedLine(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') proceedToDashboard(); }}
                    spellCheck="false"
                    className={`flex-1 h-full px-4 sm:px-6 text-sm sm:text-base bg-transparent outline-none relative z-10 w-full min-w-0 font-medium ${isDark ? 'text-white placeholder-[#5f6368]' : 'text-[#202124] placeholder-[#9aa0a6]'}`}
                  />
                )}

                {/* 🔥 BLUE PREMIUM BUTTON INSIDE THE BOX WITH UPDATED ARROW 🔥 */}
                <button 
                  onClick={handleMainButtonClick}
                  disabled={calcState !== 'idle' && calcState !== 'paused'}
                  className={`h-full px-5 sm:px-8 shrink-0 rounded-lg text-[15px] sm:text-[16px] font-bold tracking-wide transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2.5 whitespace-nowrap shadow-sm disabled:opacity-70 bg-blue-600 text-white hover:bg-blue-700`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      Wait<span className="progressive-dots"></span>
                    </span>
                  ) : isPaused ? (
                    "Resume"
                  ) : (
                    <>
                      Calculate
                      {/* Exact matching sleek arrow design like the screenshot */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex flex-col pl-2">
                <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-[#f28b82]' : 'text-[#d93025]'}`}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
                <div className={`text-[12px] sm:text-[13px] font-medium pl-6 pt-1 flex flex-col gap-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p>• Please make your public profile visible again in your settings.</p>
                  <p>• Your profile has extra characters at the start or end.</p>
                  <p>• Please check your internet connections.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center pl-2">
                  <input id="remember-me" type="checkbox" className={`w-4 h-4 rounded-sm cursor-pointer ${isDark ? 'border-[#5f6368] bg-[#202124] text-white focus:ring-white' : 'border-[#dadce0] text-black focus:ring-black focus:ring-offset-0'}`} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <label htmlFor="remember-me" className={`ml-3 text-sm font-medium cursor-pointer select-none ${isDark ? 'text-[#9aa0a6]' : 'text-[#3c4043]'}`}>Remember Me</label>
                </div>
              </div>

              <div className="flex flex-col w-full md:w-auto md:flex-1 max-w-[340px] mx-auto md:mx-0 items-start md:items-center justify-center pl-2 md:pl-0">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" target="_blank" rel="noopener noreferrer" className={`text-[14px] font-bold tracking-wide hover:underline inline-block transition-colors ${isDark ? 'text-white' : 'text-black'}`}>
                  Subscribe to Google Arcade
                </a>
              </div>

              <div className={`text-sm font-medium pl-2 md:pl-0 md:text-right ${isDark ? 'text-[#9aa0a6]' : 'text-[#3c4043]'}`}>
                Last Calculate : {recentUrls.length > 0 ? timeAgo(recentUrls[0].time) : "Never"}
              </div>
            </div>

            {/* 🔥 COMPACT RECENT PROFILES SECTION 🔥 */}
            {recentUrls.length > 0 && (
              <div className={`mt-4 pt-5 border-t animate-fade-in-up ${isDark ? 'border-[#3c4043]' : 'border-[#f1f3f4]'}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recent Profiles
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <button onClick={clearHistory} className={`flex items-center gap-1.5 text-[12px] bg-transparent px-2 py-1 rounded-md font-bold transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#2a2d32]' : 'text-gray-500 hover:text-black hover:bg-[#f1f3f4]'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear
                    </button>
                    
                    <button onClick={() => setShowResetModal(true)} className={`flex items-center gap-1.5 text-[12px] bg-transparent px-2 py-1 rounded-md font-bold transition-colors ${isDark ? 'text-[#f28b82] hover:text-[#d93025] hover:bg-[#3c1e1e]' : 'text-[#d93025] hover:text-[#b3261e] hover:bg-[#fce8e6]'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
                
                {/* 🔥 RESPONSIVE COMPACT HISTORY GRID 🔥 */}
                <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 gap-2.5 w-full">
                  {recentUrls.map((item, idx) => {
                    const themeColor = getCardTheme(item.name || "Arcade");
                    
                    return (
                      <div key={idx} className="relative w-full">
                        <button 
                          onClick={() => handleHistoryClick(item.url, idx)} 
                          className={`relative w-full h-[44px] flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full transition-all overflow-hidden group focus:outline-none hover:shadow-md hover:scale-[1.02] border ${isDark ? 'bg-[#1a1b1e] border-[#3c4043] hover:bg-[#202124]' : 'bg-white border-[#f1f3f4] hover:border-[#dadce0]'}`}
                          title={item.url}
                        >
                          <div className={`w-7 h-7 rounded-full shrink-0 shadow-sm overflow-hidden relative z-10 ${isDark ? 'bg-[#202124]' : 'bg-gray-100'}`}>
                            {copiedIndex === idx ? (
                              <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#1a1b1e]' : 'bg-white'}`}>
                                <svg className="w-3.5 h-3.5" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              item.avatar ? (
                                <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-medium text-[12px]" style={{ backgroundColor: themeColor }}>
                                  {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                                </div>
                              )
                            )}
                          </div>
                          
                          <div className="flex flex-col items-start justify-center z-10 overflow-hidden w-full">
                            <span className={`text-[12px] font-bold truncate max-w-full tracking-tight leading-tight ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                              {item.name || "Arcade Player"}
                            </span>
                            {item.points !== undefined && (
                              <span className={`text-[10px] font-semibold mt-[1px] leading-none ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                                {item.points} Pts
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      
        <div className={`mt-6 mb-10 w-full border-t pt-8 ${isDark ? 'border-[#2a2d32]' : 'border-[#dadce0]'}`}>
          <div className="relative w-full">
            <div className={`hidden md:block absolute left-6 top-6 bottom-10 w-[2px] ${isDark ? 'bg-[#3c4043]' : 'bg-[#e8eaed]'}`}></div>
            
            <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-12 w-full">
              <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shadow-md md:mt-0 mt-2 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>1</div>
              <div className={`flex-1 w-full border rounded-2xl p-5 md:p-8 shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
                <h3 className={`text-xl md:text-2xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  <span className={`text-lg md:text-xl font-extrabold ${isDark ? 'text-white' : 'text-black'}`}>➔</span> Sign in to Google Skills
                </h3>
                <p className={`mb-5 text-[14px] md:text-[15px] leading-relaxed ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  Access the Google Skills platform and sign in with your Google account.<br className="hidden md:block"/>Navigate to the Google Skills website and sign in with your Google account to access your profile.
                </p>
                <a href="https://www.skills.google/" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-colors mb-6 md:mb-8 shadow-sm text-sm md:text-base ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Go to Google Skills
                </a>
                <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-[#3c4043] bg-[#1a1b1e]' : 'border-[#dadce0] bg-[#f8f9fa]'}`}>
                  {/* 🔥 IMAGE OVERFLOW FIXED 🔥 */}
                  <img src="https://i.ibb.co/R4bb64LP/find-ppu-ss-s-1.png" alt="Step 1 Guide" className="w-full h-auto object-cover rounded-b-xl" />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-12 w-full">
              <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shadow-md md:mt-0 mt-2 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>2</div>
              <div className={`flex-1 w-full border rounded-2xl p-5 md:p-8 shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
                <h3 className={`text-xl md:text-2xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  <span className={`text-base md:text-lg flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full border-2 ${isDark ? 'border-white text-white' : 'border-black text-black'}`}>👤</span> Access Your Public Profile
                </h3>
                <p className={`mb-5 text-[14px] md:text-[15px] leading-relaxed ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  After logging in navigate to the following link to access your Google Skills account settings.<br className="hidden md:block"/>On this Account Settings page scroll down to 'Public Profile' section.
                </p>
                <a href="https://www.skills.google/my_account/profile" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-colors mb-6 md:mb-8 shadow-sm text-sm md:text-base ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Go to Account Settings
                </a>
                <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-[#3c4043] bg-[#1a1b1e]' : 'border-[#dadce0] bg-[#f8f9fa]'}`}>
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