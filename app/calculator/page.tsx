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
};

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
      // Start calculation
      proceedToDashboard();
    } else if (calcState === 'loading') {
      // Pause calculation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Cancel network request
      }
      setCalcState('paused');
    } else if (calcState === 'paused') {
      // Resume calculation
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

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        
        {/* 🔥 MODAL FOR AUTO CALCULATE 🔥 */}
        {showAutoCalcModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-modal">
            <div className={`rounded-lg shadow-xl w-[90%] max-w-sm p-6 animate-scale-up-modal ${isDark ? 'bg-[#1a1b1e] border border-[#3c4043]' : 'bg-white'}`}>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>Enable Auto Calculate?</h3>
              <p className={`text-[14px] mb-6 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                Points will calculate automatically when you open the page.
              </p>
              <div className="flex gap-3">
                <button onClick={cancelAutoCalc} className={`flex-1 font-semibold py-2 rounded-md transition-colors border ${isDark ? 'bg-transparent border-[#3c4043] text-gray-300 hover:bg-[#2a2d32]' : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]'}`}>
                  Cancel
                </button>
                <button onClick={confirmAutoCalc} className="flex-1 bg-[#1a73e8] text-white font-semibold py-2 rounded-md hover:bg-[#1557b0] transition-colors">
                  Yes, Enable
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 MODAL FOR RESET DATA 🔥 */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-modal">
            <div className={`rounded-lg shadow-xl w-[90%] max-w-sm p-6 animate-scale-up-modal ${isDark ? 'bg-[#1a1b1e] border border-[#3c4043]' : 'bg-white'}`}>
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
          <h1 className={`text-3xl md:text-5xl font-medium tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#202124]'}`}>
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
          `}</style>

          <div className="p-8 md:p-12 mt-1">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <p className={`text-sm md:text-base font-bold mt-2 ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                Paste your public profile url here
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                {/* 🔥 PREMIUM DARK MODE TOGGLE HERE 🔥 */}
                <div className="flex items-center gap-2 border-r pr-4 border-[#dadce0] dark:border-[#3c4043]">
                  <span className={`text-sm md:text-base font-bold hidden sm:block ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                    Theme
                  </span>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none shadow-inner border ${isDark ? 'bg-[#131416] border-[#3c4043]' : 'bg-[#e8eaed] border-[#dadce0]'}`}
                    title="Toggle Dark Mode"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-1'}`}>
                      {isDark ? (
                        <svg className="w-2.5 h-2.5 text-[#1a73e8]" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                      ) : (
                        <svg className="w-2.5 h-2.5 text-[#f9ab00]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.22 15.636a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.414a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm1.414-4.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd"></path></svg>
                      )}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm md:text-base font-bold hidden sm:block ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                    Auto Calculate
                  </span>
                  <label className="flex items-center cursor-pointer select-none group shrink-0">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={autoCalculate} onChange={handleAutoCalcToggle} />
                      <div className={`block w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${autoCalculate ? 'bg-[#1a73e8]' : (isDark ? 'bg-[#3c4043] group-hover:bg-[#5f6368]' : 'bg-[#dadce0] group-hover:bg-[#d1d5db]')}`}></div>
                      <div className={`dot absolute left-[3px] top-[3px] bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm ${autoCalculate ? 'transform translate-x-5' : ''}`} style={{ width: '18px', height: '18px' }}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div 
                onAnimationEnd={() => setIsShaking(false)}
                className={`relative border-2 rounded-lg transition-colors duration-75 ${isShaking ? 'animate-fast-shake' : ''} ${error && !hideRedLine ? "border-[#d93025]" : (isDark ? "border-[#3c4043] focus-within:border-[#8ab4f8]" : "border-[#dadce0] focus-within:border-[#1a73e8]")}`}
              >
                {isLoading && !error && userPoints === null && (
                  <div className="absolute -bottom-[2px] left-2 right-2 h-[2px] bg-transparent overflow-hidden z-0">
                    <div className={`h-full animate-slow-fill rounded-full ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
                  </div>
                )}

                <label className={`absolute -top-3 left-3 px-1 text-sm font-bold flex items-center transition-all duration-300 ease-in-out z-10 ${isDark ? 'bg-[#15171b]' : 'bg-white'} ${error && !hideRedLine ? (isDark ? "text-[#f28b82]" : "text-[#d93025]") : (userName && !isLoading && !isPaused) ? (isDark ? "text-[#e8eaed]" : "text-[#4e342e]") : (isDark ? "text-[#8ab4f8]" : "text-[#1a73e8]")}`}>
                  {isLoading ? (
                    loadingStep === 'wave' ? (
                      <div className="flex items-center gap-[3px] h-5 px-1">
                        <div className={`w-[5px] h-[5px] rounded-full dot-wave-1 ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
                        <div className={`w-[5px] h-[5px] rounded-full dot-wave-2 ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
                        <div className={`w-[5px] h-[5px] rounded-full dot-wave-3 ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
                      </div>
                    ) : (
                      <div className="flex items-center h-5 px-1">
                        <div className="gem-container" style={{ transform: 'scale(0.7)' }}>
                          <div className={`gem-dot gem-dot-1 ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
                          <div className={`gem-dot gem-dot-2 ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
                          <div className={`gem-dot gem-dot-3 ${isDark ? 'bg-[#8ab4f8]' : 'bg-[#1a73e8]'}`}></div>
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
                  <div className={`w-full h-[56px] px-4 py-4 text-base bg-transparent relative z-10 flex items-center justify-between overflow-hidden whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                    <span className="truncate">{profileUrl}</span>
                    
                    {isPaused && (
                      <button 
                        onClick={() => setCalcState('idle')}
                        title="Cancel Calculation"
                        className={`ml-2 transition-colors p-1 ${isDark ? 'text-[#9aa0a6] hover:text-[#f28b82]' : 'text-[#9aa0a6] hover:text-[#d93025]'}`}
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
                    className={`w-full px-4 py-4 text-base bg-transparent outline-none relative z-10 ${isDark ? 'text-white placeholder-[#5f6368]' : 'text-[#202124] placeholder-[#9aa0a6]'}`}
                  />
                )}
              </div>
            
              {error && (
                <div className="mt-2 flex flex-col">
                  <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-[#f28b82]' : 'text-[#d93025]'}`}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                  <div className={`text-[13px] font-medium pl-6 pt-1 flex flex-col gap-0.5 ${isDark ? 'text-gray-300' : 'text-black'}`}>
                    <p>• Please make your public profile visible again in your settings.</p>
                    <p>• Your profile has extra characters at the start or end.</p>
                    <p>• Please check your internet connections.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className={`w-4 h-4 rounded-sm cursor-pointer ${isDark ? 'border-[#5f6368] bg-[#202124] text-[#8ab4f8] focus:ring-[#8ab4f8]' : 'border-[#dadce0] text-[#202124] focus:ring-[#202124] focus:ring-offset-0'}`} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <label htmlFor="remember-me" className={`ml-3 text-sm font-medium cursor-pointer select-none ${isDark ? 'text-[#9aa0a6]' : 'text-[#3c4043]'}`}>Remember Me.</label>
                </div>
              </div>

              {/* 🔥 REPLACED REFERRAL CODE WITH SUBSCRIBE LINK (NO BOX/BORDER) 🔥 */}
              <div className="flex flex-col w-full md:w-auto md:flex-1 max-w-[340px] mx-auto items-center justify-center">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" target="_blank" rel="noopener noreferrer" className={`text-[14px] font-bold tracking-wide hover:underline inline-block transition-colors ${isDark ? 'text-[#8ab4f8] hover:text-[#aecbfa]' : 'text-[#1a73e8] hover:text-[#1557b0]'}`}>
                  Subscribe to Google Arcade
                </a>
              </div>

              <div className={`text-sm font-medium md:text-right ${isDark ? 'text-[#9aa0a6]' : 'text-[#3c4043]'}`}>
                Last Calculate : {recentUrls.length > 0 ? timeAgo(recentUrls[0].time) : "Never"}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full mb-6 mt-12">
              
              {/* 🔥 PLAY / PAUSE / RESUME BUTTON 🔥 */}
              <button 
                onClick={handleMainButtonClick}
                className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[16px] font-bold py-3.5 rounded-lg transition-all duration-300 transform hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.98] flex justify-center items-center shadow-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3 h-6">
                    <svg className="w-5 h-5 fill-current opacity-80" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                    <span className="leading-none text-white">Calculating... (Pause)</span>
                    
                    {loadingStep === 'wave' ? (
                      <div className="flex items-center gap-1 relative top-[1px]">
                        <div className="w-[5px] h-[5px] bg-white rounded-full dot-wave-1"></div>
                        <div className="w-[5px] h-[5px] bg-white rounded-full dot-wave-2"></div>
                        <div className="w-[5px] h-[5px] bg-white rounded-full dot-wave-3"></div>
                      </div>
                    ) : (
                      <div className="gem-container ml-1">
                        <div className="gem-dot bg-white gem-dot-1"></div>
                        <div className="gem-dot bg-white gem-dot-2"></div>
                        <div className="gem-dot bg-white gem-dot-3"></div>
                      </div>
                    )}
                  </div>
                ) : isPaused ? (
                  <div className="flex items-center justify-center gap-2 h-6">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span className="leading-none text-white">Paused (Click to Resume)</span>
                  </div>
                ) : (
                  "Calculate Arcade Points"
                )}
              </button>
              
            </div>

            {/* 🔥 NEW COMPACT PREMIUM HISTORY CARDS 🔥 */}
            {recentUrls.length > 0 && (
              <div className={`mt-6 pt-6 border-t animate-fade-in-up ${isDark ? 'border-[#3c4043]' : 'border-[#f1f3f4]'}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                  <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                    Recent Profiles Search
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={clearHistory} className={`flex items-center gap-2 text-sm bg-transparent px-3 py-1.5 rounded-lg font-bold transition-colors ${isDark ? 'text-gray-300 hover:text-white hover:bg-[#2a2d32]' : 'text-[#202124] hover:text-black hover:bg-[#f1f3f4]'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear History
                    </button>
                    
                    <button onClick={() => setShowResetModal(true)} className={`flex items-center gap-2 text-sm bg-transparent px-3 py-1.5 rounded-lg font-bold transition-colors ${isDark ? 'text-[#f28b82] hover:text-[#d93025] hover:bg-[#3c1e1e]' : 'text-[#d93025] hover:text-[#b3261e] hover:bg-[#fce8e6]'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ml-1 w-fit">
                  {recentUrls.map((item, idx) => {
                    const themeColor = getCardTheme(item.name || "Arcade");
                    
                    return (
                      <div key={idx} className="relative">
                        {/* 🔥 REMOVED style={{ borderLeft: ... }} 🔥 */}
                        <button 
                          onClick={() => handleHistoryClick(item.url, idx)} 
                          className={`relative w-[175px] h-[54px] flex items-center gap-2.5 px-3 py-1 rounded-lg transition-all overflow-hidden group focus:outline-none hover:shadow-lg hover:scale-[1.02] ${isDark ? 'bg-[#1a1b1e] shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:bg-[#202124]' : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]'}`}
                          title={item.url}
                        >
                          <div className={`w-9 h-9 rounded-full shrink-0 shadow-sm border overflow-hidden relative z-10 ${isDark ? 'border-[#3c4043]' : 'border-[#f1f3f4]'}`}>
                            {copiedIndex === idx ? (
                              <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#1a1b1e]' : 'bg-white'}`}>
                                <svg className="w-4 h-4" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              item.avatar ? (
                                <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-medium text-[14px]" style={{ backgroundColor: themeColor }}>
                                  {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                                </div>
                              )
                            )}
                          </div>
                          
                          <div className="flex flex-col items-center justify-center z-10 w-full overflow-hidden">
                            <span className={`text-[13px] font-bold truncate w-full text-center tracking-tight ${isDark ? 'text-gray-200' : 'text-[#202124]'}`}>
                              {item.name || "Arcade Player"}
                            </span>
                            {item.points !== undefined && (
                              <span className={`text-[12px] font-semibold mt-[2px] leading-none ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
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
      
        <div className={`mt-12 mb-10 max-w-6xl mx-auto border-t pt-12 ${isDark ? 'border-[#2a2d32]' : 'border-[#dadce0]'}`}>
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold flex items-center justify-center gap-3 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
              Make Public Profile
            </h2>
            <p className={`mt-2 text-[15px] ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Follow these simple steps to find your public profile URL</p>
          </div>

          <div className="relative">
            <div className={`hidden md:block absolute left-6 top-10 bottom-10 w-[2px] ${isDark ? 'bg-[#3c4043]' : 'bg-[#e8eaed]'}`}></div>
            
            <div className="relative flex flex-col md:flex-row gap-6 mb-12">
              <div className={`relative z-10 w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-xl font-bold shadow-md md:mt-0 mt-2 ${isDark ? 'bg-[#8ab4f8] text-[#15171b]' : 'bg-[#3b82f6] text-white'}`}>1</div>
              <div className={`flex-1 border rounded-2xl p-6 md:p-8 shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  <span className={`text-xl font-extrabold ${isDark ? 'text-[#8ab4f8]' : 'text-[#3b82f6]'}`}>➔</span> Sign in to Google Skills
                </h3>
                <p className={`mb-5 text-[15px] leading-relaxed ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  Access the Google Skills platform and sign in with your Google account.<br className="hidden md:block"/>Navigate to the Google Skills website and sign in with your Google account to access your profile.
                </p>
                <a href="https://www.skills.google/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-8 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Go to Google Skills
                </a>
                <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-[#3c4043] bg-[#1a1b1e]' : 'border-[#dadce0] bg-[#f8f9fa]'}`}>
                  <img src="https://i.ibb.co/R4bb64LP/find-ppu-ss-s-1.png" alt="Step 1 Guide" className="w-[102%] max-w-none h-auto object-cover -mb-[5%]" />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-6 mb-12">
              <div className={`relative z-10 w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-xl font-bold shadow-md md:mt-0 mt-2 ${isDark ? 'bg-[#8ab4f8] text-[#15171b]' : 'bg-[#3b82f6] text-white'}`}>2</div>
              <div className={`flex-1 border rounded-2xl p-6 md:p-8 shadow-sm ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                  <span className="text-[#10b981] text-lg flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#10b981]">👤</span> Access Your Public Profile
                </h3>
                <p className={`mb-5 text-[15px] leading-relaxed ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  After logging in navigate to the following link to access your Google Skills account settings.<br className="hidden md:block"/>On this Account Settings page scroll down to 'Public Profile' section.
                </p>
                <a href="https://www.skills.google/my_account/profile" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-8 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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