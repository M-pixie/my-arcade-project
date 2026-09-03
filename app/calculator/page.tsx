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
  previousPoints?: number | null;
  change?: number | null;
  durationMs?: number | null;
}

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [calcState, setCalcState] = useState<'idle' | 'loading' | 'paused'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [hideRedLine, setHideRedLine] = useState(false);
  const [recentUrls, setRecentUrls] = useState<RecentProfile[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [isShaking, setIsShaking] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null); 
  const [userName, setUserName] = useState<string | null>(null); 

  const [autoCalculate, setAutoCalculate] = useState(false);
  const [showAutoCalcModal, setShowAutoCalcModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [calculationMs, setCalculationMs] = useState<number | null>(null);
  const [lastCalculatedAt, setLastCalculatedAt] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("arcade_theme");
    if (savedTheme === "dark") setIsDark(true);

    const savedAuto = localStorage.getItem("arcade_auto_calc") === "true";
    if (savedAuto) setAutoCalculate(true);

    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
      if (savedAuto) {
        requestAnimationFrame(() => proceedToDashboard(savedUrl, true));
      }
    }
    
    const savedRecentUrls = localStorage.getItem("recent_arcade_urls_v3"); 
    if (savedRecentUrls) setRecentUrls(JSON.parse(savedRecentUrls));

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

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("arcade_theme", newTheme ? "dark" : "light");
  };

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

  const cancelAutoCalc = () => setShowAutoCalcModal(false);

  const saveToHistory = (
    urlToSave: string,
    name?: string,
    avatar?: string | null,
    points?: number,
    previousPoints?: number | null,
    durationMs?: number
  ) => {
    setRecentUrls((prevUrls) => {
      const filtered = prevUrls.filter((u) => u.url !== urlToSave);
      const change =
        typeof points === "number" && typeof previousPoints === "number"
          ? points - previousPoints
          : null;
      const newItem: RecentProfile = {
        url: urlToSave,
        time: new Date().toISOString(),
        name: name || "Arcade Player",
        avatar: avatar || null,
        points,
        previousPoints,
        change,
        durationMs: typeof durationMs === "number" ? durationMs : null
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
    setCalculationMs(null);
    setLastCalculatedAt(null);
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

    setCalcState('loading');
    setCalculationMs(null);
    const calculationStartedAt = performance.now();
    const previousPoints = recentUrls.find((item) => item.url === targetUrl)?.points ?? null;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
        signal
      });

      const data = await res.json();
      const elapsedMs = Math.max(1, Math.round(performance.now() - calculationStartedAt));

      if (!res.ok) {
        setError(data.error || "Failed to calculate points. Check URL.");
        setCalcState('idle');
        triggerShake(); 
        return;
      }

      saveToHistory(targetUrl, data.userName, data.userAvatar, data.totalPoints, previousPoints, elapsedMs);
      setCalculationMs(elapsedMs);
      setLastCalculatedAt(new Date().toISOString());
      setUserPoints(data.totalPoints);
      setUserAvatar(data.userAvatar || null);
      setUserName(data.userName || null);

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

      void (async () => {
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
      })();

      router.push("/dashboard");

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError("Connection failed. Check your internet and retry.");
      setCalcState('idle');
      triggerShake(); 
    }
  };

  const handleMainButtonClick = () => {
    if (calcState === 'idle') {
      proceedToDashboard();
    } else if (calcState === 'loading') {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setCalcState('paused');
    } else if (calcState === 'paused') {
      proceedToDashboard();
    }
  };

  const handleHistoryClick = (url: string, index: number) => {
    setProfileUrl(url);
    setError(null);
    setHideRedLine(false);
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
    proceedToDashboard(url);
  };

  const isLoading = calcState === 'loading';
  const isPaused = calcState === 'paused';
  const publicProfilePattern = /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;
  const normalizedProfileUrl = profileUrl.trim();
  const hasProfileUrl = normalizedProfileUrl.length > 0;
  const isValidProfileUrl = publicProfilePattern.test(normalizedProfileUrl);
  const cachedProfileMatches = isValidProfileUrl && !!userName && userPoints !== null;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-200 ${isDark ? 'bg-[#0f1115] text-gray-100' : 'bg-[#f7f7f8] text-[#202123]'}`}>
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 pb-14 pt-24 sm:px-6 sm:pt-28">
        {showAutoCalcModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDark ? 'border-[#2f3339] bg-[#17191d]' : 'border-[#e5e7eb] bg-white'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#202123]'}`}>Enable Auto Calculate?</h3>
              <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                Points will calculate automatically when you open the page.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={cancelAutoCalc} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${isDark ? 'border-[#34383f] text-[#D7CCC8] hover:bg-[#202328]' : 'border-[#dfe3e8] text-[#5D4037] hover:bg-[#f5f5f5]'}`}>
                  Cancel
                </button>
                <button onClick={confirmAutoCalc} className="flex-1 rounded-xl bg-[#343a8f] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d327e]">
                  Enable
                </button>
              </div>
            </div>
          </div>
        )}

        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDark ? 'border-[#2f3339] bg-[#17191d]' : 'border-[#e5e7eb] bg-white'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-600'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#202123]'}`}>Reset data?</h3>
                  <p className={`mt-1.5 text-sm leading-6 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                    This clears your saved profile, recent history and calculator preferences.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowResetModal(false)} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${isDark ? 'border-[#34383f] text-[#D7CCC8] hover:bg-[#202328]' : 'border-[#dfe3e8] text-[#5D4037] hover:bg-[#f5f5f5]'}`}>
                  Cancel
                </button>
                <button onClick={handleResetData} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700">
                  Reset data
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="mx-auto max-w-3xl text-center">
          <h1 className={`text-3xl font-semibold tracking-[-0.03em] sm:text-4xl ${isDark ? 'text-white' : 'text-[#202123]'}`}>
            Arcade Calculator
          </h1>
          <p className={`mx-auto mt-3 max-w-2xl text-sm leading-6 sm:text-[15px] ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
            Calculate your Google Skills Arcade points from your public profile in seconds.
          </p>
        </header>

        <section className={`mt-8 rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:mt-10 ${isDark ? 'border-[#2b2f35] bg-[#17191d]' : 'border-[#e4e7eb] bg-white'}`}>
          <style>{`
            @keyframes spin-border {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin-border {
              animation: spin-border 2.5s linear infinite;
            }
            @keyframes fast-shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-7px); }
              40% { transform: translateX(7px); }
              60% { transform: translateX(-7px); }
              80% { transform: translateX(7px); }
            }
            .animate-fast-shake { animation: fast-shake 0.3s ease both; }
          `}</style>

          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-[#202123]'}`}>Public profile URL</p>
                <p className={`mt-1 text-xs leading-5 sm:text-sm ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                  Paste your Google Skills public profile link below.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleDarkMode}
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${isDark ? 'border-[#34383f] bg-[#202328] text-gray-200 hover:bg-[#262a30]' : 'border-[#e4e7eb] bg-white text-[#4b5563] hover:bg-[#f7f7f8]'}`}
                >
                  {isDark ? (
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleAutoCalcToggle}
                  title={autoCalculate ? 'Auto calculate enabled' : 'Enable auto calculate'}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${autoCalculate ? (isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700') : (isDark ? 'border-[#34383f] text-[#D7CCC8] hover:bg-[#202328]' : 'border-[#e4e7eb] text-[#5D4037] hover:bg-[#f7f7f8]')}`}
                >
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-[#4b5563]'}`}>
                  {isLoading ? 'Calculating your points' : isPaused ? 'Calculation paused' : userName ? `Welcome back, ${userName}` : 'Enter public profile URL'}
                </span>
                {hasProfileUrl && !isLoading && !isPaused && (
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${isValidProfileUrl ? (isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700') : (isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700')}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isValidProfileUrl ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {isValidProfileUrl ? (cachedProfileMatches ? 'Profile ready' : 'Profile detected') : 'Invalid URL'}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                
                {/* 🔥 ANIMATED BORDER WRAPPER */}
                <div
                  onAnimationEnd={() => setIsShaking(false)}
                  className={`relative flex min-h-14 flex-1 items-center overflow-hidden rounded-xl transition-all ${isShaking ? 'animate-fast-shake' : ''} ${error && !hideRedLine ? 'border-[2px] border-red-500 p-0' : (isLoading ? 'p-[2px]' : (isDark ? 'border border-[#3a3f46] p-0 focus-within:border-[#8ab4f8]' : 'border border-[#d8dce1] p-0 focus-within:border-[#9ca3af]'))}`}
                >
                  {isLoading && !error && (
                    <div className="absolute inset-[-100%] z-0 flex items-center justify-center">
                      <div className={`h-[200%] w-[200%] animate-spin-border ${isDark ? 'bg-[conic-gradient(from_0deg,transparent_0_240deg,#8ab4f8_360deg)]' : 'bg-[conic-gradient(from_0deg,transparent_0_240deg,#343a8f_360deg)]'}`} />
                    </div>
                  )}

                  {/* Inner Box Content */}
                  <div className={`relative z-10 flex h-full min-h-[54px] w-full items-center justify-between rounded-[10px] px-4 ${isDark ? 'bg-[#111317]' : 'bg-white'}`}>
                    {calcState !== 'idle' ? (
                      <div className={`flex w-full items-center justify-between ${isDark ? 'text-gray-200' : 'text-[#202123]'}`}>
                        <span className="truncate text-sm sm:text-[15px]">{profileUrl}</span>
                        {isPaused && (
                          <button onClick={() => setCalcState('idle')} title="Cancel calculation" className={`ml-2 shrink-0 rounded-md p-1.5 ${isDark ? 'text-[#D7CCC8] hover:bg-[#202328] hover:text-white' : 'text-[#5D4037] hover:bg-[#f3f4f6] hover:text-[#202123]'}`}>
                            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="https://www.skills.google/public_profiles/..."
                        value={profileUrl}
                        onChange={(e) => {
                          const next = e.target.value;
                          setProfileUrl(next);
                          setError(null);
                          setHideRedLine(false);
                          setUserName(null);
                          setUserAvatar(null);
                          setUserPoints(null);
                          try {
                            const cached = JSON.parse(localStorage.getItem('arcade_user_data') || 'null');
                            if (cached?.profileUrl === next.trim()) {
                              if (cached.userName) setUserName(cached.userName);
                              if (cached.userAvatar) setUserAvatar(cached.userAvatar);
                              if (typeof cached.points === 'number') setUserPoints(cached.points);
                            }
                          } catch {}
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') proceedToDashboard(); }}
                        spellCheck="false"
                        className={`h-full w-full bg-transparent text-sm outline-none sm:text-[15px] ${isDark ? 'text-white placeholder:text-[#BCAAA4]' : 'text-[#202123] placeholder:text-[#A1887F]'}`}
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={handleMainButtonClick}
                  disabled={calcState === 'loading' || (calcState === 'idle' && !isValidProfileUrl)}
                  className="min-h-14 rounded-xl bg-[#343a8f] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2d327e] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-36"
                >
                  {isLoading ? 'Calculating…' : isPaused ? 'Resume' : 'Calculate'}
                </button>
              </div>

              {cachedProfileMatches && !isLoading && !isPaused && (
                <div className={`mt-3 flex items-center gap-3 rounded-xl border px-3.5 py-3 ${isDark ? 'border-[#2f3339] bg-[#111317]' : 'border-[#eceff2] bg-[#fafafa]'}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ${isDark ? 'bg-[#23272d]' : 'bg-[#eceff2]'}`}>
                    {userAvatar ? (
                      <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-semibold text-[#596070]">{userName?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-[#202123]'}`}>{userName}</p>
                    <p className={`mt-0.5 text-xs ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>{userPoints} points saved locally</p>
                  </div>
                  <span className={`hidden text-xs font-medium sm:block ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Ready to calculate</span>
                </div>
              )}
            </div>

            {error && (
              <div className={`mt-4 rounded-xl border px-4 py-3 ${isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'}`}>
                <div className={`flex items-start gap-2.5 text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
                <p className={`mt-2 pl-6 text-xs leading-5 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                  Check that your profile is public, the URL is correct, and your connection is stable.
                </p>
              </div>
            )}

            {(calculationMs || (userPoints !== null && userName)) && !isLoading && !isPaused && (
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {calculationMs && (
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${isDark ? 'border-[#34383f] bg-[#111317] text-[#D7CCC8]' : 'border-[#e5e7eb] bg-[#fafafa] text-[#5D4037]'}`}>
                    Calculated in {(calculationMs / 1000).toFixed(2)}s
                  </span>
                )}
                {lastCalculatedAt && (
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${isDark ? 'border-[#34383f] bg-[#111317] text-[#D7CCC8]' : 'border-[#e5e7eb] bg-white text-[#5D4037]'}`}>
                    {timeAgo(lastCalculatedAt)}
                  </span>
                )}
              </div>
            )}

            <div className={`mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-[#2b2f35]' : 'border-[#eef0f2]'}`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <label className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-[#4b5563]'}`}>
                  <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  Remember me
                </label>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" target="_blank" rel="noopener noreferrer" className={`text-sm font-medium hover:underline ${isDark ? 'text-gray-200' : 'text-[#202123]'}`}>
                  Subscribe
                </a>
              </div>
              <span className={`text-sm ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                {lastCalculatedAt ? `Calculated ${timeAgo(lastCalculatedAt)}` : recentUrls.length > 0 ? `Last used ${timeAgo(recentUrls[0].time)}` : 'Ready when you are'}
              </span>
            </div>

            {recentUrls.length > 0 && (
              <div className={`mt-6 border-t pt-6 ${isDark ? 'border-[#2b2f35]' : 'border-[#eef0f2]'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#202123]'}`}>Recent profiles</h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>Tap a profile to recalculate it.</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={clearHistory} className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${isDark ? 'text-[#D7CCC8] hover:bg-[#202328] hover:text-white' : 'text-[#5D4037] hover:bg-[#f5f5f5] hover:text-[#202123]'}`}>
                      Clear
                    </button>
                    <button onClick={() => setShowResetModal(true)} className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${isDark ? 'text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}>
                      Reset
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {recentUrls.map((item, idx) => {
                    const themeColor = getCardTheme(item.name || 'Arcade');
                    return (
                      <button
                        key={`${item.url}-${idx}`}
                        onClick={() => handleHistoryClick(item.url, idx)}
                        className={`group flex w-full items-center gap-3 rounded-xl border px-3.5 py-3.5 text-left transition-colors ${isDark ? 'border-[#2d3238] bg-[#121419] hover:border-[#424852] hover:bg-[#171a20]' : 'border-[#eceff2] bg-white hover:border-[#d8dde3] hover:bg-[#fafafa]'}`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${isDark ? 'bg-[#22262c]' : 'bg-[#eef1f4]'}`}>
                          {copiedIndex === idx ? (
                            <svg className="h-5 w-5" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : item.avatar ? (
                            <img src={item.avatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white" style={{ backgroundColor: themeColor }}>
                              {item.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className={`truncate text-sm font-semibold sm:text-[15px] ${isDark ? 'text-gray-100' : 'text-[#202123]'}`}>{item.name || 'Arcade Player'}</span>
                            {typeof item.change === 'number' && item.change !== 0 && (
                              <span className={`text-xs font-semibold ${item.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {item.change > 0 ? `↑ +${item.change}` : `↓ ${Math.abs(item.change)}`}
                              </span>
                            )}
                          </div>
                          <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                            <span>{typeof item.points === 'number' ? `${item.points} pts` : 'No points saved'}</span>
                            <span>{timeAgo(item.time)}</span>
                            {item.durationMs ? <span>{(item.durationMs / 1000).toFixed(1)}s</span> : null}
                          </div>
                        </div>

                        <svg className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={`mt-8 border-t pt-8 sm:mt-10 sm:pt-10 ${isDark ? 'border-[#2b2f35]' : 'border-[#e5e7eb]'}`}>
          <div className="mx-auto max-w-4xl">
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isDark ? 'text-[#8ab4f8]' : 'text-[#5b63b6]'}`}>Quick setup</p>
            <h2 className={`mt-2 text-xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#202123]'}`}>Get your public profile URL</h2>
            <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>Two quick steps. No screenshots or extra clutter.</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* 🔥 GRAPHIC 1: Sign in Mockup */}
              <div className={`flex flex-col overflow-hidden rounded-2xl border ${isDark ? 'border-[#2d3238] bg-[#121419]' : 'border-[#e8ebee] bg-white'}`}>
                <div className={`flex h-40 flex-col items-center justify-center border-b p-4 ${isDark ? 'border-[#2d3238] bg-[#0f1115]' : 'border-[#e8ebee] bg-[#f8f9fa]'}`}>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full shadow-sm ${isDark ? 'bg-[#1a1d24]' : 'bg-white'}`}>
                    <svg className="h-8 w-8 text-[#4285F4]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path className="text-[#34A853]" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path className="text-[#FBBC05]" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path className="text-[#EA4335]" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div className={`mt-4 rounded-full px-6 py-2 text-xs font-semibold shadow-sm ${isDark ? 'bg-[#343a8f] text-white' : 'bg-[#1a73e8] text-white'}`}>
                    Sign in to Google Skills
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isDark ? 'bg-white text-black' : 'bg-[#202123] text-white'}`}>1</span>
                    <p className={`text-sm font-semibold sm:text-[15px] ${isDark ? 'text-white' : 'text-[#202123]'}`}>Sign in</p>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                    Open Google Skills and sign in with the account you use for the Arcade.
                  </p>
                  <a href="https://www.skills.google/" target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex text-sm font-medium hover:underline ${isDark ? 'text-[#8ab4f8]' : 'text-[#4f5ab7]'}`}>
                    Open Google Skills ↗
                  </a>
                </div>
              </div>

              {/* 🔥 GRAPHIC 2: Browser Bar Mockup */}
              <div className={`flex flex-col overflow-hidden rounded-2xl border ${isDark ? 'border-[#2d3238] bg-[#121419]' : 'border-[#e8ebee] bg-white'}`}>
                <div className={`flex h-40 flex-col items-center justify-center border-b p-6 ${isDark ? 'border-[#2d3238] bg-[#0f1115]' : 'border-[#e8ebee] bg-[#f8f9fa]'}`}>
                  <div className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 shadow-sm ${isDark ? 'border-[#424852] bg-[#1a1d24]' : 'border-[#d8dce1] bg-white'}`}>
                    <svg className={`h-4 w-4 shrink-0 ${isDark ? 'text-[#8ab4f8]' : 'text-[#343a8f]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        skills.google/public_profiles/<span className="font-semibold text-blue-500">12345</span>
                      </div>
                    </div>
                    <div className={`rounded-md p-1 ${isDark ? 'bg-[#343a8f]/20 text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]'}`}>
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isDark ? 'bg-white text-black' : 'bg-[#202123] text-white'}`}>2</span>
                    <p className={`text-sm font-semibold sm:text-[15px] ${isDark ? 'text-white' : 'text-[#202123]'}`}>Copy URL</p>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-[#D7CCC8]' : 'text-[#5D4037]'}`}>
                    Go to Account Settings, find your Public Profile, and copy the link to paste here.
                  </p>
                  <a href="https://www.skills.google/my_account/profile" target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex text-sm font-medium hover:underline ${isDark ? 'text-[#8ab4f8]' : 'text-[#4f5ab7]'}`}>
                    Open Account Settings ↗
                  </a>
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-xl border px-4 py-3 text-sm leading-6 ${isDark ? 'border-[#2d3238] bg-[#121419] text-[#D7CCC8]' : 'border-[#e8ebee] bg-[#fafafa] text-[#5D4037]'}`}>
              Keep your Public Profile visible so the calculator can read it.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}