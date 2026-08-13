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

      {/* Ekdm clean white background and base black text */}
      <main className="min-h-screen bg-white text-black overflow-hidden font-sans relative">
        
        {/* ================= MINIMALIST HERO & FEATURES SECTION ================= */}
        {/* Fixed min-h issue and adjusted padding */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden flex flex-col items-center justify-start text-center px-4 sm:px-6">
          <div className="w-full max-w-[85rem] mx-auto z-10 flex flex-col items-center">
            
            {/* Heading in Blue */}
            <h1 className="text-[38px] sm:text-[50px] lg:text-[60px] font-black text-blue-700 tracking-tight leading-[1.2] mb-6 max-w-4xl mx-auto">
              Arcade Nexus Hub
            </h1>
            
            {/* Text in Black/Dark Gray for readability */}
            <p className="text-black text-[15px] sm:text-[16px] lg:text-[18px] max-w-3xl mx-auto font-medium leading-relaxed mb-10 px-2 sm:px-8">
              Everything you need in one powerful platform. Calculate your points, track live leaderboards, get facilitator guidance, and claim your rewards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-14">
              <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] rounded-md transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <button onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 bg-white text-black font-bold text-[15px] rounded-md border border-gray-300 hover:border-blue-400 transition-all duration-300 flex items-center justify-center w-full sm:w-auto cursor-pointer">
                Explore Features
              </button>
            </div>

            {/* 🔥 MINIMALIST FEATURES GRID 🔥 */}
            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl text-left">
              {[
                { title: "Arcade Calculator", desc: "Instantly calculate your Arcade points from your public profile URL with 100% accuracy.", link: "/calculator" },
                { title: "Smart Dashboard", desc: "Visualize your progress, track completed labs, and monitor your recent activities.", link: "/dashboard" },
                { title: "Live Leaderboard", desc: "Compete with top players across the community. Check your rank globally.", link: "/leaderboard" },
                { title: "Facilitator Program", desc: "Connect directly with community leads, access exclusive FAQs, and get expert guidance.", link: "/facilitator" },
                { title: "Skill Badges Guide", desc: "Discover all available skill badges, their point weightage, and the quickest paths.", link: "/resources" },
                { title: "Swags & Community", desc: "Share unboxing experiences, check swag delivery updates, and engage.", link: "/post" }
              ].map((feature, idx) => (
                <Link href={feature.link} key={idx} className="group bg-white p-8 border border-gray-200 rounded-md hover:border-blue-400 hover:shadow-sm transition-all duration-300 flex flex-col relative">
                  {/* Headings in Blue, Text in Black */}
                  <h3 className="text-[18px] font-bold text-blue-700 mb-2">{feature.title}</h3>
                  <p className="text-black text-[14px] leading-relaxed">{feature.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= INTEGRATED LABS & FORM SECTION (MINIMALIST) ================= */}
        <section className="relative z-10 pt-16 pb-24 border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-blue-700 tracking-tight mb-4">
                Hub & Support
              </h2>
              <p className="text-black text-base max-w-2xl mx-auto">Start your journey or reach out for help directly from here.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* LEFT COLUMN: The Guide (Halka Curve - rounded-md) */}
              <div className="border border-gray-200 rounded-md bg-white flex flex-col h-full overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button onClick={() => setActiveGuideTab('start')} className={`flex-1 py-4 text-center font-bold text-[14px] transition-all border-r border-gray-200 ${activeGuideTab === 'start' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-50'}`}>Start</button>
                  <button onClick={() => setActiveGuideTab('tools')} className={`flex-1 py-4 text-center font-bold text-[14px] transition-all border-r border-gray-200 ${activeGuideTab === 'tools' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-50'}`}>Tools</button>
                  <button onClick={() => setActiveGuideTab('points')} className={`flex-1 py-4 text-center font-bold text-[14px] transition-all ${activeGuideTab === 'points' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-50'}`}>Points</button>
                </div>
                
                {/* Scrollbar aur spacing ko fix kiya - items ke height aur padding badhai hai */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                  {activeGuideTab === 'start' && (
                    <div className="divide-y divide-gray-100 animate-fade-in flex-1 flex flex-col">
                      {startSteps.map((item, index) => (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex flex-1 items-center py-8 px-6 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-black border border-gray-200 rounded-sm uppercase">{item.badge}</span>
                              <h3 className="font-bold text-blue-700 text-[17px]">{item.title}</h3>
                            </div>
                            <p className="text-black text-[15px] mt-1">{item.desc}</p>
                          </div>
                          <div className="flex items-center justify-center text-3xl ml-4 opacity-80">{item.icon}</div>
                        </a>
                      ))}
                    </div>
                  )}
                  {activeGuideTab === 'tools' && (
                    <div className="divide-y divide-gray-100 animate-fade-in flex-1 flex flex-col">
                      {arcadeTools.map((item, index) => (
                        <Link href={item.link} key={index} className="flex flex-1 items-center py-8 px-6 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-black border border-gray-200 rounded-sm uppercase">{item.badge}</span>
                              <h3 className="font-bold text-blue-700 text-[17px]">{item.title}</h3>
                            </div>
                            <p className="text-black text-[15px] mt-1">{item.desc}</p>
                          </div>
                          <div className="flex items-center justify-center text-3xl ml-4 opacity-80">{item.icon}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {activeGuideTab === 'points' && (
                    <div className="divide-y divide-gray-100 animate-fade-in flex-1 flex flex-col">
                      {pointsSystem.map((item, index) => (
                        <div key={index} className="flex flex-1 items-center py-7 px-6 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-black border border-gray-200 rounded-sm uppercase">{item.badge}</span>
                              <h3 className="font-bold text-blue-700 text-[17px]">{item.title}</h3>
                            </div>
                            <p className="text-black text-[15px] mt-1">{item.desc}</p>
                          </div>
                          <div className="flex items-center justify-center text-3xl ml-4 opacity-80">{item.icon}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Minimalist Form (Halka Curve - rounded-md) */}
              <div className="border border-gray-200 rounded-md p-8 flex flex-col justify-center bg-white shadow-sm h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-blue-700 mb-2">Submit a Query</h3>
                  <p className="text-sm text-black">Need help with Swags, Labs, or Points? Drop the details below.</p>
                </div>
                
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-blue-700 uppercase tracking-wider">Your Name</label>
                    <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-black rounded-md placeholder-gray-400" placeholder="Enter your name" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-blue-700 uppercase tracking-wider">Issue Category</label>
                    <select value={formCategory} onChange={(e) => { setFormCategory(e.target.value); setFormSubCategory(""); }} className="px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-black cursor-pointer rounded-md">
                      <option value="Swags Delivery / Issue">Swags Delivery / Issue</option>
                      <option value="Labs Completion Issue">Labs Completion Issue</option>
                      <option value="Arcade Points Calculation">Arcade Points Calculation</option>
                      <option value="Other Queries">Other Queries</option>
                    </select>
                  </div>
                  
                  {(formCategory === "Swags Delivery / Issue" || formCategory === "Labs Completion Issue" || formCategory === "Arcade Points Calculation") && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-blue-700 uppercase tracking-wider">Specifics</label>
                      <select required value={formSubCategory} onChange={(e) => setFormSubCategory(e.target.value)} className="px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-black cursor-pointer rounded-md">
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
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-blue-700 uppercase tracking-wider">Description</label>
                    <textarea required value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={4} className="px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-black resize-none rounded-md placeholder-gray-400" placeholder="Explain your doubt here..."></textarea>
                  </div>
                  
                  <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-wider transition-all rounded-md">
                    Send Request Securely
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* ================= WIDER FAQ SECTION ================= */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-12 pb-16 relative z-20">
          <div className="w-full">
            <FAQ />
          </div>
        </section>
        
      </main>

      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Custom scrollbar for minimalist look */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
}