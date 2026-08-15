"use client";

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
    { title: "Points Calculator", desc: "Reliable Arcade point calculation directly from your profile URL.", link: "/calculator", icon: "🔢", badge: "Calc" },
    { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard", icon: "📊", badge: "Dash" },
    { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect with community leads.", link: "/facilitator", icon: "🤝", badge: "Lead" }
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

      <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900">
        
        {/* ================= ENTERPRISE HERO SECTION ================= */}
        <div className="bg-white pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#1d4ed8] mb-6">
                Arcade Nexus Hub
              </h1>
              <p className="text-base sm:text-lg leading-7 text-black mb-10 font-medium">
                Everything you need in one powerful platform. Calculate your points, track live leaderboards, get facilitator guidance, and claim your rewards.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="rounded-md bg-[#2563eb] px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-colors">
                  Get Started &rarr;
                </a>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-md bg-white px-6 py-2.5 text-sm font-bold text-black border border-gray-200 hover:bg-gray-50 transition-colors">
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ENTERPRISE FEATURES GRID ================= */}
        <div id="features" className="pb-16 sm:pb-24 bg-white mt-8">
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
                  <Link href={feature.link} key={idx} className="group flex flex-col relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-blue-200">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-colors">
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
              
              {/* Left Column: Resources List */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="border-b border-gray-200 bg-gray-50 flex">
                  <button onClick={() => setActiveGuideTab('start')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeGuideTab === 'start' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Getting Started</button>
                  <button onClick={() => setActiveGuideTab('tools')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeGuideTab === 'tools' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Platform Tools</button>
                  <button onClick={() => setActiveGuideTab('points')} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeGuideTab === 'points' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Points System</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-4">
                    {activeGuideTab === 'start' && startSteps.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">{item.icon}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title} <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.badge}</span></h3>
                          <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                    {activeGuideTab === 'tools' && arcadeTools.map((item, index) => (
                      <Link href={item.link} key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">{item.icon}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title} <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.badge}</span></h3>
                          <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                    {activeGuideTab === 'points' && pointsSystem.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">{item.icon}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title} <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.badge}</span></h3>
                          <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Support Form */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col h-[600px]">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Support</h3>
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
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
                  
                  <button type="submit" className="mt-auto block w-full rounded-md bg-blue-600 px-3.5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                    Submit Request
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* ================= ENTERPRISE FAQ SECTION ================= */}
        <div className="bg-white pt-16 pb-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FAQ />
          </div>
        </div>
        
      </main>

      <style jsx>{`
        /* Minimalist Scrollbar for Enterprise look */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
}