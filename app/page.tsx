"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect, useRef } from "react"; 

// 🔥 FIREBASE IMPORTS 🔥
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
// 🔥 LEADERBOARD IMPORT FOR AVATARS 🔥
import { subscribeLeaderboard, savePublicUserToLeaderboard } from "@/lib/leaderboard";

// ==========================================
// 🔥 CALCULATOR HELPER FUNCTIONS
// ==========================================
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

export default function HomePage() {
  const router = useRouter();

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
    { title: "Points Calculator", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator", icon: "🔢", badge: "Calc" },
    { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard", icon: "📊", badge: "Dash" },
    { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator", icon: "🤝", badge: "Lead" }
  ];

  const pointsSystem = [
    { title: "Arcade Adventure", desc: "Standard track progression (1 game badge = 1 point)", icon: "🗺️", badge: "1 Pt" },
    { title: "Arcade Voyage", desc: "Intermediate cloud challenges (1 game badge = 1 point)", icon: "⛵", badge: "1 Pt" },
    { title: "Arcade Trail", desc: "Advanced guided paths (1 game badge = 1 point)", icon: "🛤️", badge: "1 Pt" },
    { title: "Skill Badges", desc: "90+ Skills Badges available (2 badges = 1 point)", icon: "🏅", badge: "0.5 Pt" },
    { title: "Special Badges", desc: "Limited-time exclusive (1 game badge = 2 points)", icon: "🌟", badge: "2 Pts" }
  ];

  // 🔥 GLOBAL FIREBASE STATES
  const [reviews, setReviews] = useState<{name: string, time: string, text: string, vendor: string}[]>([]); 
  const [leaders, setLeaders] = useState<any[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  // ==========================================
  // 🔥 CALCULATOR STATES 🔥
  // ==========================================
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
  const [loadingStep, setLoadingStep] = useState<'wave' | 'collide'>('wave');

  const refreshUserData = () => {
    try {
      const savedData = localStorage.getItem("arcade_user_data") || localStorage.getItem("arcadeUserData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const newName = parsed.userName || parsed.name;
        if (newName) setCurrentUserName(newName);
      }
    } catch (e) {
      console.error("Error reading user data", e);
    }
  };

  useEffect(() => {
    refreshUserData();
    window.addEventListener("arcadeDataUpdated", refreshUserData);
    window.addEventListener("storage", refreshUserData);
    const unsubLeaderboard = subscribeLeaderboard((data) => setLeaders(data));

    // Calculator Init
    const savedAuto = localStorage.getItem("arcade_auto_calc") === "true";
    if (savedAuto) setAutoCalculate(true);

    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
      if (savedAuto) {
        setTimeout(() => proceedToDashboard(savedUrl, true), 600);
      }
    }
    
    const savedRecentUrls = localStorage.getItem("recent_arcade_urls_v3"); 
    if (savedRecentUrls) setRecentUrls(JSON.parse(savedRecentUrls));

    const q = query(collection(db, "swagReviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => doc.data() as any);
      setReviews(fetchedReviews);
    });

    return () => {
      window.removeEventListener("arcadeDataUpdated", refreshUserData);
      window.removeEventListener("storage", refreshUserData);
      unsubLeaderboard();
      unsubReviews();
    };
  }, []);

  // 🔥 CALCULATOR EFFECTS & FUNCTIONS 🔥
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (calcState === 'loading') {
      setLoadingStep('wave');
      timer = setTimeout(() => { setLoadingStep('collide'); }, 1200);
    }
    return () => clearTimeout(timer);
  }, [calcState]);

  const handleAutoCalcToggle = () => {
    if (!autoCalculate) { setShowAutoCalcModal(true); } 
    else { setAutoCalculate(false); localStorage.setItem("arcade_auto_calc", "false"); }
  };

  const confirmAutoCalc = () => {
    setAutoCalculate(true); localStorage.setItem("arcade_auto_calc", "true"); setShowAutoCalcModal(false);
  };

  const cancelAutoCalc = () => setShowAutoCalcModal(false);

  const saveToHistory = (urlToSave: string, name?: string, avatar?: string | null, points?: number) => {
    setRecentUrls((prevUrls) => {
      const filtered = prevUrls.filter((u) => u.url !== urlToSave);
      const newItem: RecentProfile = { url: urlToSave, time: new Date().toISOString(), name: name || "Arcade Player", avatar: avatar || null, points: points };
      const updatedUrls = [newItem, ...filtered].slice(0, 5); 
      localStorage.setItem("recent_arcade_urls_v3", JSON.stringify(updatedUrls));
      return updatedUrls;
    });
  };

  const clearHistory = () => {
    setRecentUrls([]); localStorage.removeItem("recent_arcade_urls_v3");
  };

  const handleResetData = () => {
    localStorage.removeItem("arcade_url"); localStorage.removeItem("recent_arcade_urls_v3");
    localStorage.removeItem("arcade_user_data"); localStorage.removeItem("current_processing_url");
    localStorage.removeItem("arcade_auto_calc");
    setProfileUrl(""); setRecentUrls([]); setUserPoints(null); setUserAvatar(null);
    setUserName(null); setAutoCalculate(false); setRememberMe(false); setError(null);
    setCalcState('idle'); setShowResetModal(false);
  };

  const triggerBlink = async () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    setHideRedLine(true);  await delay(150); setHideRedLine(false); await delay(150);
    setHideRedLine(true);  await delay(150); setHideRedLine(false); await delay(150);
    setHideRedLine(true);  await delay(150); setHideRedLine(false); 
  };

  const triggerShake = () => {
    setIsShaking(false);
    setTimeout(() => {
      setIsShaking(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]); 
    }, 10);
  };

  const proceedToDashboard = async (overrideUrl?: string | any, isAutoRun: boolean = false) => {
    const targetUrl = typeof overrideUrl === 'string' ? overrideUrl.trim() : profileUrl.trim();
    setError(null); setHideRedLine(false);
    if (typeof overrideUrl === 'string') setProfileUrl(targetUrl);

    const shouldRemember = isAutoRun ? true : rememberMe;
    if (shouldRemember) localStorage.setItem("arcade_url", targetUrl);
    else localStorage.removeItem("arcade_url");

    const urlPattern = /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;
    if (!targetUrl || !urlPattern.test(targetUrl)) {
      setError("Please enter a valid Public Profile URL.");
      triggerShake(); triggerBlink(); 
      return;
    }

    setCalcState('loading'); 
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      const res = await fetch("/api/calculate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: targetUrl }), signal
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to calculate points. Check URL."); setCalcState('idle'); triggerShake(); return;
      }

      saveToHistory(targetUrl, data.userName, data.userAvatar, data.totalPoints);

      const extractedId = targetUrl.split('/').pop() || null;
      const cacheObj = {
        profileUrl: targetUrl, points: data.totalPoints, breakdown: data.breakdown,
        history: data.completionHistory || [], userName: data.userName || null,
        userAvatar: data.userAvatar || null, userUniqueId: extractedId
      };
      
      localStorage.setItem("arcade_user_data", JSON.stringify(cacheObj));
      localStorage.setItem("current_processing_url", targetUrl);

      try {
        await savePublicUserToLeaderboard({
          name: data.userName || "Arcade Player", photoURL: data.userAvatar || "/avatar.png",
          points: data.totalPoints, profileUrl: targetUrl
        });
      } catch (saveErr) { console.error("Leaderboard Save Error:", saveErr); }
      
      router.push("/dashboard");
    } catch (err: any) {
      if (err.name === 'AbortError') { console.log('Calculation Paused'); return; }
      setError("Connection failed. Check your internet and retry.");
      setCalcState('idle'); triggerShake(); 
    }
  };

  const handleMainButtonClick = () => {
    if (calcState === 'idle') proceedToDashboard();
    else if (calcState === 'loading') {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setCalcState('paused');
    } else if (calcState === 'paused') proceedToDashboard();
  };

  const handleHistoryClick = (url: string, index: number) => {
    setProfileUrl(url); setError(null); setHideRedLine(false);
    navigator.clipboard.writeText(url); setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
    proceedToDashboard(url);
  };

  const isLoading = calcState === 'loading';
  const isPaused = calcState === 'paused';

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
      <Navbar />

      {/* 🔥 CALCULATOR MODALS 🔥 */}
      {showAutoCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-modal">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-scale-up-modal border border-[#dadce0]">
            <h3 className="text-xl font-bold mb-2 text-[#202124]">Enable Auto Calculate?</h3>
            <p className="text-[14px] mb-6 text-[#5f6368]">Points will calculate automatically when you open the page.</p>
            <div className="flex gap-3">
              <button onClick={cancelAutoCalc} className="flex-1 font-semibold py-2 rounded-md transition-colors border bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]">Cancel</button>
              <button onClick={confirmAutoCalc} className="flex-1 font-semibold py-2 rounded-md transition-colors bg-black text-white hover:bg-gray-800">Yes, Enable</button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-modal">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-scale-up-modal border border-[#dadce0]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#fce8e6] text-[#d93025]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#202124]">Reset Data?</h3>
            </div>
            <p className="text-[14px] mb-6 pl-[52px] text-[#5f6368]">Are you sure you want to reset all data and history? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetModal(false)} className="flex-1 font-semibold py-2 rounded-md transition-colors border bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]">Cancel</button>
              <button onClick={handleResetData} className="flex-1 font-semibold py-2 rounded-md transition-colors bg-[#d93025] text-white hover:bg-[#b3261e]">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden selection:bg-blue-500/20 selection:text-blue-900 font-sans relative">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-24 md:pt-28 pb-12 overflow-hidden min-h-[85vh] flex items-center">
          
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
            @keyframes slow-fill { 0% { width: 0%; } 20% { width: 30%; } 50% { width: 65%; } 80% { width: 85%; } 100% { width: 95%; } }
            .animate-slow-fill { animation: slow-fill 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; position: absolute; left: 0; top: 0; }
            @keyframes fast-shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-8px); } 80% { transform: translateX(8px); } }
            .animate-fast-shake { animation: fast-shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
            @keyframes fade-in-modal { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scale-up-modal { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in-modal { animation: fade-in-modal 0.2s ease-out forwards; }
            .animate-scale-up-modal { animation: scale-up-modal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            
            /* 🔥 WAVE & GEMINI ANIMATIONS 🔥 */
            @keyframes wave-bounce { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-3.5px); opacity: 1; } }
            .dot-wave-1 { animation: wave-bounce 1s infinite ease-in-out; animation-delay: 0s; }
            .dot-wave-2 { animation: wave-bounce 1s infinite ease-in-out; animation-delay: 0.15s; }
            .dot-wave-3 { animation: wave-bounce 1s infinite ease-in-out; animation-delay: 0.3s; }
            @keyframes rotate-gemini { 0% { transform: rotate(0deg) scale(0.9); } 100% { transform: rotate(360deg) scale(0.9); } }
            @keyframes collide-1 { 0%, 100% { transform: translate(0, 0) scale(0.8); } 50% { transform: translate(0, 4px) scale(1.3); } }
            @keyframes collide-2 { 0%, 100% { transform: translate(0, 0) scale(0.8); } 50% { transform: translate(3.5px, -2.5px) scale(1.3); } }
            @keyframes collide-3 { 0%, 100% { transform: translate(0, 0) scale(0.8); } 50% { transform: translate(-3.5px, -2.5px) scale(1.3); } }
            .gem-container { width: 14px; height: 14px; position: relative; animation: rotate-gemini 1s linear infinite; }
            .gem-dot { position: absolute; width: 4.5px; height: 4.5px; border-radius: 50%; }
            .gem-dot-1 { top: 0px; left: 4.75px; animation: collide-1 0.6s ease-in-out infinite; }
            .gem-dot-2 { top: 8px; left: 0px; animation: collide-2 0.6s ease-in-out infinite; }
            .gem-dot-3 { top: 8px; left: 9.5px; animation: collide-3 0.6s ease-in-out infinite; }
            @keyframes dots-step { 0% { content: ""; } 25% { content: "."; } 50% { content: ".."; } 75% { content: "..."; } 100% { content: ""; } }
            .progressive-dots::after { content: ""; display: inline-block; width: 14px; text-align: left; animation: dots-step 1.5s infinite step-start; }
          `}</style>

          <div className="w-full relative z-10">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 w-full flex flex-col gap-10">
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-10 w-full mt-8 md:mt-8">
                
                {/* 🌟 LEFT COLUMN - Perfect Sizing 🌟 */}
                <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left pt-6 lg:pt-12 relative z-20">
                  
                  <h1 className="text-[40px] md:text-[64px] font-black text-[#0f172a] tracking-tight m-0 leading-[1.15] md:leading-[1.1]">
                    Arcade <span className="text-blue-600 drop-shadow-sm">Nexus</span>
                  </h1>
                  
                  <div className="flex w-[270px] md:w-[425px] mt-3 mb-6 mx-auto lg:mx-0 shadow-sm rounded-full overflow-hidden">
                    <div className="h-1.5 bg-blue-600 w-[55%]"></div>
                    <div className="h-1.5 bg-[#0f172a] w-[45%]"></div>
                  </div>

                  <p className="text-slate-600 text-[15px] sm:text-[16px] md:text-[20px] max-w-lg font-medium leading-relaxed mb-8 px-2 md:px-0">
                    Crunch points, track live leaderboards, and own your Arcade journey in one seamless dashboard.
                  </p>

                  {/* 🔥 EXACT 2x2 GRID FOR 4 BLUE BUTTONS (RESPONSIVE & EQUAL) 🔥 */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10 w-full max-w-[500px] mx-auto lg:mx-0">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform?pli=1" target="_blank" rel="noopener noreferrer" className="px-3 sm:px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] sm:text-[14px] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 w-full text-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.898 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      Subscribe
                    </a>
                    
                    <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="px-3 sm:px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] sm:text-[14px] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 w-full text-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                      Start Labs
                    </a>

                    <Link href="/facilitator" className="px-3 sm:px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] sm:text-[14px] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 w-full text-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      Facilitator
                    </Link>

                    <Link href="/resources" className="px-3 sm:px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] sm:text-[14px] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 w-full text-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      Skill Badges
                    </Link>
                  </div>

                </div>

                {/* 🌟 CALCULATOR INTEGRATION (RIGHT SIDE) - Fixed Desktop Stretching & Mobile Input Hide 🌟 */}
                <div className="relative z-20 w-full lg:w-[55%] flex flex-col justify-center mt-6 lg:mt-0 lg:pl-10 xl:pl-16 pb-8 lg:pb-0 max-w-2xl mx-auto lg:max-w-none">
                  <div className="rounded-xl border shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden w-full relative transition-all duration-1000 ease-in-out bg-white border-[#dadce0] min-h-[380px] flex flex-col justify-center">
                    
                    <div className="p-4 sm:p-8 md:p-12">
                      <div className="flex flex-row items-center justify-between mb-8 gap-4">
                        <p className="text-xl sm:text-2xl font-bold text-[#202124]">
                          Arcade Calculator
                        </p>
                        
                        <div className="flex items-center justify-end">
                          <button onClick={handleAutoCalcToggle} className={`p-2 rounded-full transition-colors flex items-center justify-center ${autoCalculate ? 'bg-[#e8eaed] text-green-600' : 'bg-transparent text-[#9aa0a6] hover:bg-[#e8eaed] hover:text-black'}`} title={autoCalculate ? "Auto Calculate Enabled" : "Enable Auto Calculate"}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* 🔥 FULLY RESPONSIVE INPUT BOX 🔥 */}
                      <div className="mb-6">
                        <div onAnimationEnd={() => setIsShaking(false)} className={`group relative min-w-0 border-2 rounded-xl transition-colors duration-200 p-1 sm:p-1.5 flex flex-row items-center shadow-sm w-full h-[56px] sm:h-[64px] ${isShaking ? 'animate-fast-shake' : ''} ${error && !hideRedLine ? "border-[#d93025]" : "bg-transparent border-[#dadce0] focus-within:border-blue-600"}`}>
                          
                          {isLoading && !error && userPoints === null && (
                            <div className="absolute -bottom-[2px] left-6 right-6 h-[2px] bg-transparent overflow-hidden z-0">
                              <div className="h-full animate-slow-fill rounded-b-lg bg-black"></div>
                            </div>
                          )}

                          <label className={`absolute -top-3 left-4 sm:left-6 px-2 text-[11px] sm:text-sm font-bold flex items-center transition-all duration-300 ease-in-out z-10 bg-white ${error && !hideRedLine ? "text-[#d93025]" : (userName && !isLoading && !isPaused) ? "text-[#4e342e] group-focus-within:text-blue-600" : "text-black group-focus-within:text-blue-600"}`}>
                            {isLoading ? (
                              loadingStep === 'wave' ? (
                                <div className="flex items-center gap-[3px] h-5 px-1">
                                  <div className="w-[5px] h-[5px] rounded-full dot-wave-1 bg-black"></div>
                                  <div className="w-[5px] h-[5px] rounded-full dot-wave-2 bg-black"></div>
                                  <div className="w-[5px] h-[5px] rounded-full dot-wave-3 bg-black"></div>
                                </div>
                              ) : (
                                <div className="flex items-center h-5 px-1">
                                  <div className="gem-container" style={{ transform: 'scale(0.7)' }}>
                                    <div className="gem-dot gem-dot-1 bg-black"></div>
                                    <div className="gem-dot gem-dot-2 bg-black"></div>
                                    <div className="gem-dot gem-dot-3 bg-black"></div>
                                  </div>
                                </div>
                              )
                            ) : isPaused ? ("Calculation Paused") : (userName ? userName : "Enter Public Profile Url")}
                          </label>
                          
                          {calcState !== 'idle' ? (
                            <div className="flex-1 h-full px-3 sm:px-5 flex items-center justify-between overflow-hidden whitespace-nowrap min-w-0 text-[#202124]">
                              <span className="truncate text-[13px] sm:text-base font-medium pr-2">{profileUrl}</span>
                              {isPaused && (
                                <button onClick={() => setCalcState('idle')} title="Cancel Calculation" className="transition-colors p-1 shrink-0 text-[#9aa0a6] hover:text-black">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              )}
                            </div>
                          ) : (
                            <input type="text" placeholder="https://www.skills.google/public_profiles/..." value={profileUrl} onChange={(e) => { setProfileUrl(e.target.value); setError(null); setHideRedLine(false); }} onKeyDown={(e) => { if (e.key === 'Enter') proceedToDashboard(); }} spellCheck="false" className="flex-1 h-full px-3 sm:px-5 text-[13px] sm:text-base bg-transparent outline-none relative z-10 w-full min-w-0 font-medium text-[#202124] placeholder-[#9aa0a6]" />
                          )}

                          <button onClick={handleMainButtonClick} disabled={calcState !== 'idle' && calcState !== 'paused'} className="h-full px-3 sm:px-6 shrink-0 rounded-lg text-[13px] sm:text-[16px] font-bold tracking-wide transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shadow-sm disabled:opacity-70 bg-blue-600 text-white hover:bg-blue-700 w-auto">
                            {isLoading ? (
                              <span className="flex items-center">Wait<span className="progressive-dots"></span></span>
                            ) : isPaused ? ("Resume") : (
                              <>Calculate<svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" /></svg></>
                            )}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="mb-6 flex flex-col pl-2">
                          <div className="flex items-center gap-2 text-[13px] sm:text-sm font-medium text-[#d93025]">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                          </div>
                          <div className="text-[11px] sm:text-[13px] font-medium pl-6 pt-1 flex flex-col gap-0.5 text-gray-600">
                            <p>• Please make your public profile visible again in your settings.</p>
                            <p>• Your profile has extra characters at the start or end.</p>
                            <p>• Please check your internet connections.</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-row items-center justify-between gap-2 mb-2 sm:mb-4">
                        <div className="flex items-center pl-1 sm:pl-2">
                          <input id="remember-me" type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm cursor-pointer border-[#dadce0] text-black focus:ring-black focus:ring-offset-0" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                          <label htmlFor="remember-me" className="ml-2 sm:ml-3 text-[12px] sm:text-sm font-medium cursor-pointer select-none text-[#3c4043]">Remember Me</label>
                        </div>
                        <div className="text-[11px] sm:text-sm font-medium text-right text-[#3c4043]">
                          Calculated: {recentUrls.length > 0 ? timeAgo(recentUrls[0].time) : "Never"}
                        </div>
                      </div>

                      {recentUrls.length > 0 && (
                        <div className="mt-4 sm:mt-5 pt-5 sm:pt-6 border-t animate-fade-in-up border-[#f1f3f4]">
                          <div className="flex flex-row items-center justify-between mb-4 sm:mb-5 gap-2">
                            <p className="text-[12px] sm:text-sm font-bold uppercase tracking-wider text-gray-500">Recent Profiles</p>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <button onClick={clearHistory} className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[12px] bg-transparent px-2 py-1 rounded-md font-bold transition-colors text-gray-500 hover:text-black hover:bg-[#f1f3f4]">
                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Clear
                              </button>
                              <button onClick={() => setShowResetModal(true)} className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[12px] bg-transparent px-2 py-1 rounded-md font-bold transition-colors text-[#d93025] hover:text-[#b3261e] hover:bg-[#fce8e6]">
                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Reset
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full">
                            {recentUrls.map((item, idx) => {
                              const themeColor = getCardTheme(item.name || "Arcade");
                              return (
                                <div key={idx} className="relative w-full">
                                  <button onClick={() => handleHistoryClick(item.url, idx)} className="relative w-full h-[42px] sm:h-[46px] flex items-center gap-2.5 sm:gap-3 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1 rounded-full transition-all overflow-hidden group focus:outline-none hover:shadow-md hover:scale-[1.02] border bg-white border-[#f1f3f4] hover:border-[#dadce0]" title={item.url}>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 shadow-sm overflow-hidden relative z-10 bg-gray-100">
                                      {copiedIndex === idx ? (
                                        <div className="w-full h-full flex items-center justify-center bg-white">
                                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                      ) : (
                                        item.avatar ? (
                                          <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-white font-medium text-[12px] sm:text-[13px]" style={{ backgroundColor: themeColor }}>
                                            {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <div className="flex flex-col items-start justify-center z-10 overflow-hidden w-full">
                                      <span className="text-[12px] sm:text-[13px] font-bold truncate max-w-full tracking-tight leading-tight text-[#202124]">{item.name || "Arcade Player"}</span>
                                      {item.points !== undefined && (
                                        <span className="text-[10px] sm:text-[11px] font-semibold mt-[1px] sm:mt-[2px] leading-none text-[#5f6368]">{item.points} Pts</span>
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
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= NEW PREMIUM TABBED GUIDE SECTION ================= */}
        <section className="relative z-10 pt-16 pb-24 border-t border-[#e2e8f0] bg-white">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight mb-5 drop-shadow-sm">
                Start Arcade Labs
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#e2e8f0] overflow-hidden flex flex-col">
              <div className="flex flex-col sm:flex-row border-b border-[#e2e8f0] bg-slate-50/50">
                <button onClick={() => setActiveGuideTab('start')} className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-all duration-200 border-b sm:border-b-0 sm:border-r border-[#e2e8f0] ${activeGuideTab === 'start' ? 'bg-white text-blue-600 border-b-[3px] border-b-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-800'}`}>Arcade Labs Start</button>
                <button onClick={() => setActiveGuideTab('tools')} className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-all duration-200 border-b sm:border-b-0 sm:border-r border-[#e2e8f0] ${activeGuideTab === 'tools' ? 'bg-white text-blue-600 border-b-[3px] border-b-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-800'}`}>Arcade Tools</button>
                <button onClick={() => setActiveGuideTab('points')} className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-all duration-200 ${activeGuideTab === 'points' ? 'bg-white text-blue-600 border-b-[3px] border-b-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-800'}`}>Points System</button>
              </div>
              
              <div className="h-[auto] max-h-[450px] overflow-y-auto custom-scrollbar">
                {activeGuideTab === 'start' && (
                  <div className="divide-y divide-[#e2e8f0] animate-fade-in grid grid-cols-1 md:grid-cols-2">
                    {startSteps.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-5 hover:bg-blue-50/50 group transition-colors duration-200 w-full border-b border-[#e2e8f0] md:border-b-0 md:[&:nth-child(1)]:border-b md:[&:nth-child(2)]:border-b md:[&:nth-child(odd)]:border-r md:border-[#e2e8f0]">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e2e8f0] pr-4 mr-5">
                          <span className="text-[26px] mb-2 transition-transform group-hover:scale-110">{item.icon}</span>
                          <span className="bg-[#0f172a] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center shadow-sm">{item.badge}</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#0f172a] font-bold text-[18px] group-hover:text-blue-600 transition-colors">{item.title} <span className="font-sans font-bold text-blue-600 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span></h3>
                          <div className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">{item.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                {activeGuideTab === 'tools' && (
                  <div className="divide-y divide-[#e2e8f0] animate-fade-in grid grid-cols-1 md:grid-cols-2">
                    {arcadeTools.map((item, index) => (
                      <Link href={item.link} key={index} className="flex p-5 hover:bg-blue-50/50 group transition-colors duration-200 w-full border-b border-[#e2e8f0] md:border-b-0 md:[&:nth-child(1)]:border-b md:[&:nth-child(2)]:border-b md:[&:nth-child(odd)]:border-r md:border-[#e2e8f0]">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e2e8f0] pr-4 mr-5">
                          <span className="text-[26px] mb-2 transition-transform group-hover:scale-110">{item.icon}</span>
                          <span className="bg-[#0f172a] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center shadow-sm">{item.badge}</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#0f172a] font-bold text-[18px] group-hover:text-blue-600 transition-colors">{item.title} <span className="font-sans font-bold text-blue-600 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span></h3>
                          <div className="text-slate-500 text-[15px] mt-1.5 flex items-center gap-2 leading-relaxed"><span className="text-blue-500 font-bold text-[14px]">🔗</span> {item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {activeGuideTab === 'points' && (
                  <div className="divide-y divide-[#e2e8f0] animate-fade-in grid grid-cols-1 md:grid-cols-2">
                    {pointsSystem.map((item, index) => (
                      <div key={index} className="flex p-5 hover:bg-blue-50/50 group transition-colors duration-200 w-full border-b border-[#e2e8f0] md:border-b-0 md:[&:nth-child(odd)]:border-r md:border-[#e2e8f0]">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e2e8f0] pr-4 mr-5">
                          <span className="text-[26px] mb-2 transition-transform group-hover:scale-110">{item.icon}</span>
                          <span className="bg-[#0f172a] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center shadow-sm">{item.badge}</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#0f172a] font-bold text-[18px] group-hover:text-blue-600 transition-colors">{item.title}</h3>
                          <div className="text-slate-500 text-[15px] mt-1.5 leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ================= PREMIUM PROBLEM / MESSAGE BOX ================= */}
        <div className="py-16 max-w-4xl mx-auto px-6 relative">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden relative z-10 transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div className="bg-slate-50/80 border-b border-[#e2e8f0] p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-3">Problem Submission Form</h3>
              <p className="text-base mt-2">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-bold inline-block border border-blue-200">
                  Drop a message regarding your Swags, Labs, or Arcade Points. Our community team will look into it directly.
                </span>
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 md:p-10 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-slate-700">Your Name</label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="px-4 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400" placeholder="Enter your full name" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-slate-700">Issue Category</label>
                  <div className="relative">
                    <select value={formCategory} onChange={(e) => { setFormCategory(e.target.value); setFormSubCategory(""); }} className="w-full px-4 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 cursor-pointer appearance-none">
                      <option value="Swags Delivery / Issue">Swags Delivery / Issue</option>
                      <option value="Labs Completion Issue">Labs Completion Issue</option>
                      <option value="Arcade Points Calculation">Arcade Points Calculation</option>
                      <option value="Other Queries">Other Queries</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {(formCategory === "Swags Delivery / Issue" || formCategory === "Labs Completion Issue" || formCategory === "Arcade Points Calculation") && (
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-slate-700">
                    {formCategory === "Swags Delivery / Issue" && "Select Vendor"}
                    {formCategory === "Labs Completion Issue" && "Select Lab Type"}
                    {formCategory === "Arcade Points Calculation" && "Select Point Issue"}
                  </label>
                  <div className="relative">
                    <select required value={formSubCategory} onChange={(e) => setFormSubCategory(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 cursor-pointer appearance-none">
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

              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-bold text-slate-700">Describe Your Problem</label>
                <textarea required value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={5} className="px-4 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 resize-none placeholder-slate-400" placeholder="Explain your doubt or issue in detail here..."></textarea>
              </div>
              <button type="submit" className="mt-2 w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-lg shadow-md transform hover:-translate-y-1 transition-all focus:outline-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                Send Request Securely
              </button>
              <p className="text-center text-xs text-slate-500 mt-2 font-medium">* This will securely redirect your query to our official WhatsApp support channel.</p>
            </form>
          </div>
        </div>

        {/* ================= WIDER FAQ SECTION ================= */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-12 pb-16 relative z-20 mt-8">
          <div className="w-full">
            <FAQ />
          </div>
        </section>
        
      </main>

      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}