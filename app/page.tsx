"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect } from "react"; 

// 🔥 FIREBASE IMPORTS 🔥
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
// 🔥 LEADERBOARD IMPORT FOR AVATARS 🔥
import { subscribeLeaderboard } from "@/lib/leaderboard";

export default function HomePage() {
  const router = useRouter();

  // 🔥 State for Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags Delivery / Issue");
  const [formSubCategory, setFormSubCategory] = useState(""); 
  const [formMessage, setFormMessage] = useState("");

  // 🔥 Tab State for Premium Guide Section
  const [activeGuideTab, setActiveGuideTab] = useState('start');

  // 🔥 COUNTDOWN TIMER STATE
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  // 🔥 LOCAL STATES
  const [printoVote, setPrintoVote] = useState<"received" | "not_received" | null>(null);
  const [whiteSquareVote, setWhiteSquareVote] = useState<"received" | "not_received" | null>(null);
  
  // 🔥 Review Inputs
  const [reviewName, setReviewName] = useState("");
  const [reviewVendor, setReviewVendor] = useState("Printo");
  const [reviewText, setReviewText] = useState("");

  // 🔥 GLOBAL FIREBASE STATES
  const [reviews, setReviews] = useState<{name: string, time: string, text: string, vendor: string}[]>([]); 
  const [globalPrinto, setGlobalPrinto] = useState({ received: 0, not_received: 0 });
  const [globalWs, setGlobalWs] = useState({ received: 0, not_received: 0 });

  // 🔥 LEADERBOARD STATES
  const [leaders, setLeaders] = useState<any[]>([]);
  
  // 🔥 NEW: State for Current User Profile
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const refreshUserData = () => {
    try {
      const savedData = localStorage.getItem("arcade_user_data") || localStorage.getItem("arcadeUserData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const newName = parsed.userName || parsed.name;
        if (newName) {
          setCurrentUserName(newName);
        }
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

    // TIMER LOGIC: Targeting 14 September 2026, 23:59 GMT+5:30
    const targetDate = new Date("2026-09-14T23:59:00+05:30").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

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
      clearInterval(interval);
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Hi Manish, I am ${formName}.\n\nI have a query regarding: *${formCategory}*`;
    if (formSubCategory) text += `\nSpecifics: *${formSubCategory}*`;
    text += `\n\nMessage:\n${formMessage}`;
    const whatsappUrl = `https://wa.me/918538980608?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setFormName("");
    setFormMessage("");
    setFormSubCategory("");
  };

  return (
    <>
      <PopupModal />
      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden selection:bg-blue-500/20 selection:text-blue-900 font-sans relative">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-24 md:pt-28 pb-12 overflow-hidden min-h-[85vh] flex items-center">
          
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
          `}</style>

          <div className="w-full relative z-10">
            <div className="max-w-[85rem] mx-auto px-6 w-full flex flex-col gap-10">
              
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-10 w-full mt-8 md:mt-8">
                
                {/* 🌟 LEFT COLUMN 🌟 */}
                <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left pt-6 lg:pt-12 relative z-20">
                  
                  <h1 className="text-[40px] md:text-[64px] font-black text-[#0f172a] tracking-tight m-0 leading-[1.15] md:leading-[1.1]">
                    Arcade <span className="text-blue-600 drop-shadow-sm">Nexus</span>
                  </h1>
                  
                  {/* Arcade tak Blue line, Nexus tak Black line (Ab exact 's' tak jayega) */}
                  <div className="flex w-[270px] md:w-[425px] mt-3 mb-6 mx-auto lg:mx-0 shadow-sm rounded-full overflow-hidden">
                    <div className="h-1.5 bg-blue-600 w-[55%]"></div>
                    <div className="h-1.5 bg-[#0f172a] w-[45%]"></div>
                  </div>

                  <p className="text-slate-600 text-[16px] md:text-[20px] max-w-lg font-medium leading-relaxed mb-8 px-2 md:px-0">
                    Crunch points, track live leaderboards, and own your Arcade journey in one seamless dashboard.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 w-full max-w-2xl">
                    <button onClick={() => router.push('/calculator')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-2.5 w-full sm:w-auto justify-center">
                      <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      Arcade Calculator
                    </button>
                    
                    <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-blue-600 font-bold text-[14px] rounded-lg border border-blue-200 shadow-sm hover:border-blue-400 hover:text-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2.5 w-full sm:w-auto justify-center">
                      <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                      Start Labs here
                    </a>

                    {/* Pink hatakar Minimal dark theme apply kar diya */}
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform?pli=1" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-[14px] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-2.5 w-full sm:w-auto justify-center">
                      <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.898 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      Subscribe for Arcade
                    </a>
                  </div>

                  <div className="flex flex-col gap-2 text-center lg:text-left w-full max-w-lg mt-2 px-6 py-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-[18px] md:text-[20px] font-bold text-[#0f172a] tracking-tight flex items-center gap-2 justify-center lg:justify-start">
                      <span className="text-[#2563eb]">⚡</span> Arcade Facilitator Program
                    </h3>
                    <p className="text-slate-600 font-medium text-[13px] md:text-[14px] mb-1">
                      Lead your community and unlock exclusive Arcade rewards.
                    </p>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScjkkpNBMs0xR_EvqwLFQZRRVXccQQTLl-pUA37NvzvUQ3NJQ/viewform" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center lg:justify-start gap-1.5 text-[#2563eb] hover:text-[#1d4ed8] font-bold transition-all w-full lg:w-fit text-[14px]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      Facilitator Registration Form
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>
                  </div>

                </div>

                {/* 🌟 PREMIUM BUTTON GRID & TIMER (RIGHT SIDE) 🌟 */}
                <div className="relative z-20 w-full lg:w-[50%] flex flex-col justify-center mt-12 lg:mt-0 lg:pl-10 pb-8 lg:pb-0">
                  
                  <div className="pb-6 w-full">
                    <h3 className="text-[#0f172a] font-black text-[22px] md:text-[26px] tracking-tight">
                      Quick Access
                    </h3>
                  </div>

                  {/* Slim Premium Button Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {[
                      { name: "Points Calculator", link: "/calculator", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/> },
                      { name: "Live Leaderboard", link: "/leaderboard", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h4v6H4zm6-6h4v12h-4zm6-4h4v16h-4z"/> },
                      { name: "AI Chat Assistant", link: "/chat", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/> },
                      { name: "Skill Badges Guide", link: "/resources", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.898 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/> },
                      { name: "Milestone Tracking", link: "/dashboard", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143z"/> },
                      { name: "Community Posts", link: "/post", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/> },
                      { name: "Admin Panel", link: "/admin-nexus-2026", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/> },
                      { name: "About Platform", link: "/about", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> },
                    ].map((item, idx) => (
                      <div key={idx} className="w-full">
                        {item.link ? (
                          <a
                            href={item.link}
                            onClick={(e) => {
                              if (item.link?.startsWith('/')) {
                                e.preventDefault();
                                router.push(item.link);
                              }
                            }}
                            className="flex items-center gap-3 py-2.5 px-3.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all cursor-pointer group"
                          >
                            <div className="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                {item.icon}
                              </svg>
                            </div>
                            <span className="font-semibold text-[13px] leading-snug text-slate-700 group-hover:text-blue-700 transition-colors duration-300">
                              {item.name}
                            </span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 py-2.5 px-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="bg-slate-100 text-slate-500 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                {item.icon}
                              </svg>
                            </div>
                            <span className="font-semibold text-[13px] leading-snug text-slate-500">
                              {item.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 🔥 TIMER SECTION 🔥 */}
                  <div className="mt-8 w-full">
                    <h4 className="text-[#e11d48] text-[14px] md:text-[15px] font-bold mb-3 flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48] animate-pulse"></span>
                      Program Ending In
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow w-full">
                      <div className="flex flex-col items-center w-16">
                        <span className="text-3xl md:text-4xl font-black text-[#0f172a] tabular-nums tracking-tight">{timeLeft.days}</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase mt-1">Days</span>
                      </div>
                      <span className="text-2xl font-black text-slate-300 pb-4">:</span>
                      <div className="flex flex-col items-center w-16">
                        <span className="text-3xl md:text-4xl font-black text-[#0f172a] tabular-nums tracking-tight">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase mt-1">Hrs</span>
                      </div>
                      <span className="text-2xl font-black text-slate-300 pb-4">:</span>
                      <div className="flex flex-col items-center w-16">
                        <span className="text-3xl md:text-4xl font-black text-[#0f172a] tabular-nums tracking-tight">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase mt-1">Mins</span>
                      </div>
                      <span className="text-2xl font-black text-slate-300 pb-4">:</span>
                      <div className="flex flex-col items-center w-16">
                        <span className="text-3xl md:text-4xl font-black text-[#e11d48] tabular-nums tracking-tight drop-shadow-sm">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-[#e11d48] uppercase mt-1">Secs</span>
                      </div>
                    </div>
                    
                    {/* User Name displayed below timer as requested */}
                    <div className="mt-4 flex justify-center sm:justify-end pr-2">
                      <span className="font-bold text-[#0f172a] text-[15px]">
                        Current User : {currentUserName || "User Profile"}
                      </span>
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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}