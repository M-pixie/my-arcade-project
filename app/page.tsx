"use client";

import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect, useRef } from "react"; 

// 🔥 FIREBASE IMPORTS 🔥
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { savePublicUserToLeaderboard } from "@/lib/leaderboard";

export default function HomePage() {
  const router = useRouter();

  // 🔥 STATE: Hero Input & Results
  const [heroUrl, setHeroUrl] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  
  const [calcResult, setCalcResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const calculationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 STATE: Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags Delivery / Issue");
  const [formSubCategory, setFormSubCategory] = useState(""); 
  const [formMessage, setFormMessage] = useState("");

  // 🔥 STATE: Premium Guide Section
  const [activeGuideTab, setActiveGuideTab] = useState('start');

  const startSteps = [
    { link: "https://share.google/mn0xUfmd49TA9RPc1", title: "Sign in Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile.", icon: "👤", badge: "Step 1" },
    { link: "https://share.google/45EC3J4RjWLzgbkGy", title: "Registration", desc: "Enroll in Arcade to unlock labs, points and challenges.", icon: "📝", badge: "Step 2" },
    { link: "https://share.google/Ojw8FgQpGhPI1sXyt", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards.", icon: "🚀", badge: "Step 3" },
    { link: "https://share.google/JRMVQ9xd8tTwx8Mol", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards.", icon: "🏅", badge: "Step 4" }
  ];

  const arcadeTools = [
    { title: "Points Calculator", desc: "Reliable Arcade point calculation directly from your profile URL.", link: "/calculator", icon: "🔢", badge: "Calc" },
    { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard", icon: "📊", badge: "Dash" },
    { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect with community leads.", link: "/facilitator", icon: "🤝", badge: "Lead" }
  ];

  const pointsSystem = [
    { title: "Arcade Adventure", desc: "Standard track progression (1 game badge = 1 point)", icon: "🗺️", badge: "1 Pt" },
    { title: "Arcade Voyage", desc: "Intermediate cloud challenges (1 game badge = 1 point)", icon: "⛵", badge: "1 Pt" },
    { title: "Arcade Trail", desc: "Advanced guided paths (1 game badge = 1 point)", icon: "🛤️", badge: "1 Pt" },
    { title: "Skill Badges", desc: "90+ Skills Badges available (2 badges = 1 point)", icon: "🏅", badge: "0.5 Pt" }
  ];

  const [reviews, setReviews] = useState<{name: string, time: string, text: string, vendor: string}[]>([]); 

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) setHeroUrl(savedUrl);

    const q = query(collection(db, "swagReviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => doc.data() as any);
      setReviews(fetchedReviews);
    });

    return () => {
      unsubReviews();
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      if (calculationIntervalRef.current) clearInterval(calculationIntervalRef.current);
    };
  }, []);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = heroUrl.trim();
    if (!targetUrl) return;

    setHeroError(null);
    setShowResult(false);
    setIsCalculating(true);
    
    // 🔥 Start the live seconds counter
    setElapsedSecs(0);
    calculationIntervalRef.current = setInterval(() => {
      setElapsedSecs(prev => prev + 1);
    }, 1000);

    const urlPattern = /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;
    if (!urlPattern.test(targetUrl)) {
      setHeroError("Please enter a valid Public Profile URL.");
      setIsCalculating(false);
      if (calculationIntervalRef.current) clearInterval(calculationIntervalRef.current);
      return;
    }

    localStorage.setItem("arcade_url", targetUrl);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setHeroError(data.error || "Failed to calculate points. Check URL.");
        setIsCalculating(false);
        if (calculationIntervalRef.current) clearInterval(calculationIntervalRef.current);
        return;
      }

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

      void savePublicUserToLeaderboard({
        name: data.userName || "Arcade Player",
        photoURL: data.userAvatar || "/avatar.png",
        points: data.totalPoints,
        profileUrl: targetUrl
      }).catch(err => console.error(err));

      // Show inline result instead of redirecting
      setCalcResult(data);
      setShowResult(true);

      // Auto-close after 1 minute
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        setShowResult(false);
      }, 60000);

    } catch (err) {
      setHeroError("Connection failed. Check your internet and retry.");
    } finally {
      // Clear calculation states and timer
      setIsCalculating(false);
      if (calculationIntervalRef.current) clearInterval(calculationIntervalRef.current);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Hi Manish, I am ${formName}.\n\nI have a query regarding: *${formCategory}*`;
    if (formSubCategory) text += `\nSpecifics: *${formSubCategory}*`;
    text += `\n\nMessage:\n${formMessage}`;
    const whatsappUrl = `https://wa.me/918538980608?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setFormName(""); setFormMessage(""); setFormSubCategory("");
  };

  return (
    <>
      <PopupModal />
      <style>{`
        .hero-aurora-bg {
          background: linear-gradient(-45deg, #130026, #3b0a66, #1c0040, #4b0a70);
          background-size: 400% 400%;
          animation: auroraBG 15s ease infinite;
          position: relative;
          overflow: hidden;
        }
        @keyframes auroraBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-aurora-bg::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(255, 0, 150, 0.15), transparent 60%),
                      radial-gradient(circle at 80% 20%, rgba(0, 200, 255, 0.15), transparent 50%);
          animation: auroraMove 20s linear infinite alternate;
          pointer-events: none;
        }
        @keyframes auroraMove {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(10deg) scale(1.1); }
        }
        @keyframes spin-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-border {
          animation: spin-border 2.5s linear infinite;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>

      <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-300 selection:text-blue-900">

        {/* ================= PREMIUM HERO SECTION ================= */}
        <div className="hero-aurora-bg pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 lg:px-8 text-center text-white relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10">
          <div className="mx-auto max-w-4xl relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-blue-500/50 bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <span className="text-blue-400 font-black text-[13px]">#1</span>
              <span className="text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase">
                Arcade Nexus Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Welcome to <span className="text-blue-400">Arcade Nexus,</span> <br className="hidden md:block"/>Arcade journey made simpler.
            </h1>

            <p className="text-sm sm:text-base text-gray-300/90 mb-12 max-w-2xl mx-auto font-medium">
              Calculate your points, track progress, discover useful resources, and stay ahead of every Arcade challenge.
            </p>

            {/* 🔥 ANIMATED INPUT WRAPPER - WHITE */}
            <div className="max-w-[700px] mx-auto w-full relative">
              <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl transition-all ${isCalculating ? 'p-[2px]' : 'p-0'}`}>
                
                {isCalculating && (
                  <div className="absolute inset-[-100%] z-0 flex items-center justify-center">
                    <div className="h-[200%] w-[200%] animate-spin-border bg-[conic-gradient(from_0deg,transparent_0_240deg,#3b82f6_360deg)]" />
                  </div>
                )}

                <form onSubmit={handleHeroSubmit} className="relative z-10 flex w-full items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-2xl transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20">
                  <div className="pl-4 pr-1 shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={heroUrl}
                    onChange={(e) => setHeroUrl(e.target.value)}
                    placeholder="Paste your public profile URL here..." 
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 px-3 placeholder:text-gray-400 text-[15px] font-medium h-10 sm:h-12 w-full disabled:opacity-50" 
                    required
                    disabled={isCalculating}
                  />
                  <button 
                    type="submit" 
                    disabled={isCalculating}
                    className="w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-all shadow-sm disabled:opacity-70"
                  >
                    {/* 🔥 LIVE SECONDS TIMER */}
                    {isCalculating ? (
                      <span className="font-bold text-sm sm:text-[15px] animate-pulse">{elapsedSecs}s</span>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-6-6l6 6-6 6" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {heroError && (
              <div className="text-red-300 text-sm mt-3 font-medium bg-red-500/10 inline-block px-4 py-1.5 rounded-lg border border-red-500/20 backdrop-blur-md shadow-sm animate-fade-in-up">
                {heroError}
              </div>
            )}

            {/* 🔥 WHITE RESULT CARD WITH CLICKABLE AVATAR */}
            {showResult && calcResult && (
              <div className="mt-6 mx-auto max-w-[700px] w-full bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-2xl relative animate-fade-in-up text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <button 
                  onClick={() => setShowResult(false)} 
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Clickable Avatar pointing to dashboard */}
                  <div 
                    onClick={() => router.push('/dashboard')}
                    title="Go to Dashboard"
                    className="w-14 h-14 shrink-0 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                  >
                    {calcResult.userAvatar ? (
                      <img src={calcResult.userAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-700">
                        {calcResult.userName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{calcResult.userName || "Arcade Player"}</h3>
                    <p className="text-blue-600 text-sm font-semibold mt-0.5">Total Points: <span className="text-xl ml-1 text-gray-900">{calcResult.totalPoints}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-5 w-full sm:w-auto justify-start sm:justify-end border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Game Badges</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{calcResult.breakdown?.games || 0}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Badges</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{calcResult.breakdown?.skills || 0}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0 flex justify-end">
                  <button 
                    onClick={() => router.push('/dashboard')} 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Full Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {!showResult && (
              <div className="mt-8 flex flex-col items-center">
                <span className="text-[#a199a0] text-[12px] mb-3 font-medium">Suggested actions</span>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="bg-[#3e2e3d]/80 border border-[#64495f] text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-colors hover:bg-[#4b384a] inline-flex items-center justify-center">
                    Start Labs Here
                  </a>
                  <button onClick={() => router.push('/dashboard')} className="bg-[#3e2e3d]/80 border border-[#64495f] text-[#d6cdd5] text-[13px] font-medium px-4 py-2 rounded-xl transition-colors hover:bg-[#4b384a]">
                    Smart Dashboard
                  </button>
                  <button onClick={() => router.push('/leaderboard')} className="bg-[#3e2e3d]/80 border border-[#64495f] text-[#d6cdd5] text-[13px] font-medium px-4 py-2 rounded-xl transition-colors hover:bg-[#4b384a]">
                    Leaderboard Rank
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ================= ENTERPRISE FEATURES GRID ================= */}
        <div id="features" className="py-16 sm:py-24 bg-white relative z-20 -mt-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
                {[
                  { title: "Points Calculator", desc: "Reliable Arcade point calculation directly from your profile URL.", link: "/calculator", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.25-4.5h.008v.008H10.5v-.008zm0 2.25h.008v.008H10.5v-.008zm0 2.25h.008v.008H10.5v-.008zm2.25-4.5h.008v.008H12.75v-.008zm0 2.25h.008v.008H12.75v-.008zM6.75 6h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V8.25A2.25 2.25 0 016.75 6z" /></svg> },
                  { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
                  { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99-2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.29 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg> },
                  { title: "Facilitator Program", desc: "Get expert guidance, FAQs, and connect with community leads.", link: "/facilitator", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
                  { title: "Skill Badges Guide", desc: "Discover available skill badges, point weightages, and the most efficient paths.", link: "/resources", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg> },
                  { title: "Swags & Community", desc: "Share unboxing experiences, check swag delivery updates, and engage.", link: "/post", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> }
                ].map((feature, idx) => (
                  <Link href={feature.link} key={idx} className="group flex flex-col relative bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all hover:border-blue-200">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 transition-all">
                        {feature.icon}
                      </div>
                      {feature.title}
                    </dt>
                    <dd className="flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.desc}</p>
                      <p className="mt-6">
                        <span className="text-sm font-semibold leading-6 text-blue-600 group-hover:text-blue-500 transition-colors">
                          Learn more <span aria-hidden="true" className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                        </span>
                      </p>
                    </dd>
                  </Link>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* ================= ENTERPRISE SUPPORT & GUIDE SECTION ================= */}
        <div className="bg-gray-50 py-24 sm:py-32 border-y border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Support & Resources</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Access quick start guides or submit a formal query to our support team. We're here to help you maximize your Google Cloud Arcade experience.
              </p>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="border-b border-gray-200 bg-gray-50 flex">
                  <button onClick={() => setActiveGuideTab('start')} className={`flex-1 py-3 sm:py-4 px-1 text-xs sm:text-sm font-semibold transition-colors ${activeGuideTab === 'start' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Getting Started</button>
                  <button onClick={() => setActiveGuideTab('tools')} className={`flex-1 py-3 sm:py-4 px-1 text-xs sm:text-sm font-semibold transition-colors ${activeGuideTab === 'tools' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Platform Tools</button>
                  <button onClick={() => setActiveGuideTab('points')} className={`flex-1 py-3 sm:py-4 px-1 text-xs sm:text-sm font-semibold transition-colors ${activeGuideTab === 'points' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Points System</button>
                </div>
                <div className="flex-1 p-4 sm:p-5">
                  <div className="space-y-3 sm:space-y-4">
                    {activeGuideTab === 'start' && startSteps.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl sm:text-2xl">{item.icon}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title} <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.badge}</span></h3>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                    {activeGuideTab === 'tools' && arcadeTools.map((item, index) => (
                      <Link href={item.link} key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl sm:text-2xl">{item.icon}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title} <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.badge}</span></h3>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                    {activeGuideTab === 'points' && pointsSystem.map((item, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl sm:text-2xl">{item.icon}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title} <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.badge}</span></h3>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Support</h3>
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                      <div className="mt-2">
                        <input type="text" id="name" required value={formName} onChange={(e) => setFormName(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" placeholder="Jane Doe" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Issue Category</label>
                      <div className="mt-2">
                        <select id="category" value={formCategory} onChange={(e) => { setFormCategory(e.target.value); setFormSubCategory(""); }} className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white">
                          <option value="Swags Delivery / Issue">Swags Delivery / Issue</option>
                          <option value="Labs Completion Issue">Labs Completion Issue</option>
                          <option value="Arcade Points Calculation">Arcade Points Calculation</option>
                          <option value="Other Queries">Other Queries</option>
                        </select>
                      </div>
                    </div>
                    
                    {(formCategory === "Swags Delivery / Issue" || formCategory === "Labs Completion Issue" || formCategory === "Arcade Points Calculation") && (
                      <div>
                        <label htmlFor="subcat" className="block text-sm font-medium leading-6 text-gray-900">Specific Details</label>
                        <div className="mt-2">
                          <select id="subcat" required value={formSubCategory} onChange={(e) => setFormSubCategory(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white">
                            <option value="" disabled hidden>Select an option</option>
                            {formCategory === "Swags Delivery / Issue" && (
                              <><option value="Printos">Printos Services</option><option value="Whitesquare">Whitesquare International</option></>
                            )}
                            {formCategory === "Labs Completion Issue" && (
                              <><option value="Arcade Monthly Labs">Arcade Monthly Labs</option><option value="Skill Badges">Skill Badges</option></>
                            )}
                            {formCategory === "Arcade Points Calculation" && (
                              <><option value="Points Count Issue">Points Count Issue</option><option value="Invalid Public Profile Issue">Invalid Public Profile Issue</option></>
                            )}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">Message</label>
                      <div className="mt-2">
                        <textarea id="message" required value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={4} className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 resize-none" placeholder="Please describe your issue in detail..."></textarea>
                      </div>
                    </div>
                  </form>
                </div>
                
                <button onClick={handleFormSubmit} type="submit" className="mt-6 block w-full rounded-md bg-blue-600 px-3.5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                  Submit Request
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ================= ENTERPRISE FAQ SECTION ================= */}
        <div className="bg-white pt-16 pb-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FAQ />
          </div>
        </div>

        {/* ================= BLUE CTA BANNER ================= */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative my-16 sm:my-24 z-20 w-full">
          <div className="w-full rounded-[2rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Base dark blue gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] opacity-95"></div>
            
            <div className="absolute inset-0 opacity-40">
               {/* Lighter blue overlay in top right */}
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3b82f6] via-transparent to-transparent opacity-70 mix-blend-screen"></div>
               {/* Background wave SVGs recolored to deep blues */}
               <svg className="absolute bottom-0 w-full h-auto text-[#172554]" viewBox="0 0 1440 320" fill="currentColor"><path fillOpacity="0.4" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,224,1152,197.3C1248,171,1344,160,1392,154.7L1440,149L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
               <svg className="absolute bottom-0 w-full h-auto text-[#1e3a8a]" viewBox="0 0 1440 320" fill="currentColor"><path fillOpacity="0.3" d="M0,160L60,149.3C120,139,240,117,360,138.7C480,160,600,224,720,234.7C840,245,960,203,1080,160C1200,117,1320,75,1380,53.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
            </div>

            <div className="relative z-10 py-12 sm:py-16 px-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Ready to level up?
              </h2>
              <a 
                href="https://go.cloudskillsboost.google/arcade" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-8 py-3.5 rounded-full font-bold text-[15px] sm:text-[17px] tracking-wide transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Labs Now
              </a>
            </div>
          </div>
        </div>
        
      </main>
    </>
  );
}