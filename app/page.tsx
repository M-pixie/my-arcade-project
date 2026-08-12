"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect } from "react"; 

// 🔥 FIREBASE IMPORTS 🔥
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

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

  useEffect(() => {
    const q = query(collection(db, "swagReviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => doc.data() as any);
      setReviews(fetchedReviews);
    });

    return () => {
      unsubReviews();
    };
  }, []);

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

      <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-900 font-sans relative">
        
        {/* ================= PREMIUM HERO & FEATURES SECTION ================= */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden min-h-[90vh] flex flex-col items-center justify-start text-center px-4 sm:px-6">
          
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] opacity-40 bg-[#e0e7ff] rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] opacity-40 bg-[#fae8ff] rounded-full blur-[120px]"></div>
          </div>

          <div className="w-full max-w-[85rem] mx-auto z-10 flex flex-col items-center">
            
            {/* Simple Bold Heading */}
            <h1 className="text-[38px] sm:text-[50px] lg:text-[60px] font-bold text-[#0f172a] tracking-tight leading-[1.2] mb-6 max-w-4xl mx-auto">
              Arcade Nexus Hub
            </h1>
            
            <p className="text-slate-600 text-[15px] sm:text-[16px] lg:text-[18px] max-w-3xl mx-auto font-medium leading-relaxed mb-10 px-2 sm:px-8">
              Everything you need in one powerful platform. Calculate your points, track live leaderboards, get facilitator guidance, and claim your rewards.
            </p>

            {/* 2 Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-20">
              <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold text-[15px] rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <button onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 bg-white text-[#0f172a] font-semibold text-[15px] rounded-full shadow-md hover:shadow-lg border border-slate-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center w-full sm:w-auto cursor-pointer">
                Explore Features
              </button>
            </div>

            {/* 🔥 PREMIUM FEATURES GRID 🔥 */}
            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-4 text-left">
              
              {/* Feature 1: Calculator */}
              <Link href="/calculator" className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 z-0"></div>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 relative z-10">
                  <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2 relative z-10 group-hover:text-blue-700 transition-colors">Arcade Calculator</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">Instantly calculate your Arcade points from your public profile URL with 100% accuracy and detailed breakdown.</p>
              </Link>

              {/* Feature 2: Dashboard */}
              <Link href="/dashboard" className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 z-0"></div>
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300 relative z-10">
                  <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z"/></svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2 relative z-10 group-hover:text-indigo-700 transition-colors">Smart Dashboard</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">Visualize your progress, track completed labs, and monitor your recent activities in a clean, user-friendly interface.</p>
              </Link>

              {/* Feature 3: Leaderboard */}
              <Link href="/leaderboard" className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 z-0"></div>
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300 relative z-10">
                  <svg className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2 relative z-10 group-hover:text-amber-700 transition-colors">Live Leaderboard</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">Compete with top players across the community. Check your rank globally and stay motivated to earn more badges.</p>
              </Link>

              {/* Feature 4: Facilitator Connect */}
              <Link href="/facilitator" className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 z-0"></div>
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300 relative z-10">
                  <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2 relative z-10 group-hover:text-emerald-700 transition-colors">Facilitator Program</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">Connect directly with community leads, access exclusive FAQs, and get expert guidance to ace your Arcade journey.</p>
              </Link>

              {/* Feature 5: Skill Badges */}
              <Link href="/resources" className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 z-0"></div>
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300 relative z-10">
                  <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2 relative z-10 group-hover:text-purple-700 transition-colors">Skill Badges Guide</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">Discover all available skill badges, their point weightage, and the quickest paths to maximize your rewards.</p>
              </Link>

              {/* Feature 6: Community & Support */}
              <Link href="/post" className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 z-0"></div>
                <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-500 transition-colors duration-300 relative z-10">
                  <svg className="w-7 h-7 text-rose-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-2 relative z-10 group-hover:text-rose-700 transition-colors">Swags & Community</h3>
                <p className="text-slate-500 text-[14px] leading-relaxed relative z-10">Share unboxing experiences, check swag delivery updates, and engage with a vibrant developer community.</p>
              </Link>

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