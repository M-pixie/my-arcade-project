"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState } from "react"; // ADDED For Message Box State

export default function HomePage() {
  const router = useRouter();

  // 🔥 NEW: State for Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags");
  const [formMessage, setFormMessage] = useState("");

  // Handler to send form data directly to your WhatsApp!
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Manish, I am ${formName}.\n\nI have a query regarding: *${formCategory}*\n\nMessage:\n${formMessage}`;
    const whatsappUrl = `https://wa.me/918538980608?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optional: Clear form after sending
    setFormName("");
    setFormMessage("");
  };

  return (
    <>
      <PopupModal />
      <Navbar />

      {/* PURE WHITE BACKGROUND, GOOGLE TEXT COLORS */}
      <main className="min-h-screen bg-white text-[#202124] overflow-hidden selection:bg-[#e8f0fe] selection:text-[#1a73e8] font-sans">
        
        {/* ================= HERO SECTION (CLEAN & MINIMAL) ================= */}
        <section className="relative pt-36 pb-24 px-6 text-center border-b border-gray-200 bg-white overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            
            {/* Animated Square Badge */}
            <div className="group relative inline-flex items-center gap-2 px-4 py-1.5 bg-[#f8f9fa] border border-gray-200 text-[#5f6368] text-xs font-semibold mb-8 uppercase tracking-wider rounded-sm overflow-hidden transition-colors hover:border-[#1a73e8] hover:text-[#1a73e8] cursor-default">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-[#1a73e8] rounded-sm opacity-50"></span>
                <span className="relative inline-flex h-2 w-2 bg-[#1a73e8] rounded-sm shadow-[0_0_8px_#1a73e8]"></span>
              </span>
              <span className="relative z-10">Google Cloud Arcade</span>
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#202124] mb-6 leading-[1.1]">
              analyze when <br className="hidden md:block" />
              <span className="text-[#1a73e8] relative inline-block">
                you&apos;re ready
                
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-[#5f6368] max-w-2xl mx-auto mb-10 leading-relaxed">
              The professional dashboard to calculate your Google Cloud Arcade points, 
              monitor leaderboard rankings & track your growth in real-time.
            </p>

            {/* Square/Slightly Rounded Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/calculator")}
                className="px-8 py-3.5 bg-[#1a73e8] text-white font-medium text-base rounded-sm hover:bg-[#1557b0] hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-200"
              >
                Open Calculator
              </button>
              
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3.5 bg-white text-[#1a73e8] border border-[#dadce0] font-medium text-base rounded-sm hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-all duration-200"
              >
                View Dashboard
              </button>
            </div>
            
            {/* Trust Badge */}
            <p className="mt-12 text-xs font-medium text-[#80868b] tracking-widest uppercase">
              Trusted by thousands of cloud enthusiasts
            </p>
          </div>
        </section>

        {/* ================= HOW TO GET STARTED (PREMIUM RECTANGULAR BOX) ================= */}
          <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto px-6">
              
              <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight mb-4">
                  How to Start Your Journey?
                </h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  Follow these simple steps to kickstart your Google Cloud Arcade experience.
                </p>
              </div>

              {/* 🔥 SINGLE LONG PREMIUM RECTANGULAR BOX (Curve Reduced) 🔥 */}
              <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-[#dadce0]">
                  {[
                    { link: "https://share.google/mn0xUfmd49TA9RPc1", num: "01", title: "Create Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile." },
                    { link: "https://share.google/45EC3J4RjWLzgbkGy", num: "02", title: "Subscribe", desc: "Enroll in Arcade to unlock labs, points and challenges." },
                    { link: "https://share.google/Ojw8FgQpGhPI1sXyt", num: "03", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards." },
                    { link: "https://share.google/JRMVQ9xd8tTwx8Mol", num: "04", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards." },
                  ].map((step, idx) => (
                    <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                      
                      {/* Number Badge (Curve Reduced) */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {step.num}
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#202124] mb-2">{step.title}</h3>
                        <p className="text-[#5f6368] text-[15px] leading-relaxed">{step.desc}</p>
                      </div>

                      {/* 🔥 LONG BLUE "CLICK HERE" BUTTON (Curve Reduced) 🔥 */}
                      <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                        <a 
                          href={step.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full md:w-48 py-3.5 px-6 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[15px] font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                        >
                          Click Here
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

      {/* ================= FEATURES (PREMIUM RECTANGULAR LIST DESIGN) ================= */}
          <section className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto px-6">
              
              <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] tracking-tight mb-4">
                  Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Win Arcade</span>
                </h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  Powerful tools and resources designed to help you track, calculate, and boost your Arcade points.
                </p>
              </div>

              {/* 🔥 SINGLE LONG PREMIUM RECTANGULAR BOX 🔥 */}
              <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-[#dadce0]">
                  {[
                    { title: "Accurate Calculator", icon: "🎯", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator" },
                    { title: "Smart Dashboard", icon: "📊", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard" },
                    { title: "Live Leaderboard", icon: "🏆", desc: "Compete with others and track your position in real-time.", link: "/leaderboard" },
                    { title: "Facilitator Page", icon: "🤝", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator" },
                  ].map((feature, idx) => (
                    <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                      
                      {/* Icon Badge (Matches the Journey section style) */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {feature.icon}
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#202124] mb-2">{feature.title}</h3>
                        <p className="text-[#5f6368] text-[15px] leading-relaxed">{feature.desc}</p>
                      </div>

                      {/* 🔥 LONG BLUE "TRY IT OUT" BUTTON 🔥 */}
                      <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                        <button 
                          onClick={() => router.push(feature.link)}
                          className="flex items-center justify-center gap-2 w-full md:w-48 py-3.5 px-6 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[15px] font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                        >
                          Try it out
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </section>


        {/* ================= 🔥 PREMIUM REWARDS SECTION (UPDATED WITH PARTNERS & FORM) ================= */}
        <section className="relative z-10 py-24 bg-gradient-to-b from-white to-[#f8f9fa] border-b border-gray-200 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* Rewards Intro & Boxes */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fff8e1] border border-[#ffeb3b] text-[#f57f17] text-xs font-bold mb-4 uppercase tracking-wider rounded-sm">
                <span>⭐ Premium Swags</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight mb-4">
                Redeem your <span className="text-[#1a73e8] font-medium">Self-Earned Arcade Points</span>
              </h2>
              <p className="text-[#5f6368] text-base max-w-2xl mx-auto">
                Level up your cloud skills and unlock exclusive, premium Google Cloud gear. The more badges you collect, the bigger the rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              
              {/* Premium Box 1 */}
              <div className="group relative bg-white border border-[#dadce0] rounded-sm p-8 hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#34a853] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="h-48 w-full flex items-center justify-center mb-8 p-4">
                  <img 
                    src="https://services.google.com/fh/files/misc/gcaf25_prizes_image4.png" 
                    alt="Standard Tier Rewards" 
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="text-xl font-medium text-[#202124] mb-2">Milestone Rewards</h3>
                <p className="text-[#5f6368] text-sm leading-relaxed">
                  Kickstart your collection. Trade your initial points for essential Google Cloud standard gear.
                </p>
              </div>

              {/* Premium Box 2 */}
              <div className="group relative bg-white border border-[#dadce0] rounded-sm p-8 hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1a73e8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="h-48 w-full flex items-center justify-center mb-8 p-4">
                  <img 
                    src="https://services.google.com/fh/files/misc/gcaf25_prizes_image5.png" 
                    alt="Advanced Tier Rewards" 
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="text-xl font-medium text-[#202124] mb-2">Advanced Collection</h3>
                <p className="text-[#5f6368] text-sm leading-relaxed">
                  Step up your game. Unlock high-quality, exclusive merchandise crafted for true cloud enthusiasts.
                </p>
              </div>

              {/* Premium Box 3 */}
              <div className="group relative bg-white border border-[#dadce0] rounded-sm p-8 hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-default">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#ea4335] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="h-48 w-full flex items-center justify-center mb-8 p-4">
                  <img 
                    src="https://services.google.com/fh/files/misc/gcaf25_prizes_image6.png" 
                    alt="Champion Tier Rewards" 
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="text-xl font-medium text-[#202124] mb-2">Champion Elite</h3>
                <p className="text-[#5f6368] text-sm leading-relaxed">
                  The ultimate prize tier. Claim top-of-the-line flagship rewards reserved for Arcade champions.
                </p>
              </div>
            </div>

            {/* ================= 🔥 NEW: OFFICIAL SWAG PARTNERS ================= */}
            <div className="pt-16 border-t border-[#dadce0]">
              <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-medium text-[#202124] mb-3">Official Google Swags Partners</h3>
                <p className="text-[#5f6368] text-base max-w-xl mx-auto">
                  Having trouble tracking your rewards? Connect with the official dispatch partners directly for faster resolution.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center gap-6">
                
                {/* Printo Card */}
                <a href="mailto:printose@printo.in" className="flex items-center gap-5 p-6 bg-white border border-[#dadce0] rounded-xl hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgba(26,115,232,0.1)] transition-all group w-full md:w-[360px]">
                  <div className="w-14 h-14 bg-[#f8f9fa] text-[#5f6368] rounded-full border border-[#dadce0] flex items-center justify-center text-2xl group-hover:bg-[#1a73e8] group-hover:text-white group-hover:border-[#1a73e8] transition-colors">
                    📦
                  </div>
                  <div className="text-left">
                    <h4 className="text-[#202124] font-semibold text-lg mb-0.5">Printo Support</h4>
                    <p className="text-[#1a73e8] text-sm group-hover:underline">printose@printo.in</p>
                  </div>
                </a>

                {/* Whitesquare Card */}
                <a href="mailto:support@whitesquarein.com" className="flex items-center gap-5 p-6 bg-white border border-[#dadce0] rounded-xl hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgba(26,115,232,0.1)] transition-all group w-full md:w-[360px]">
                  <div className="w-14 h-14 bg-[#f8f9fa] text-[#5f6368] rounded-full border border-[#dadce0] flex items-center justify-center text-2xl group-hover:bg-[#1a73e8] group-hover:text-white group-hover:border-[#1a73e8] transition-colors">
                    📦
                  </div>
                  <div className="text-left">
                    <h4 className="text-[#202124] font-semibold text-lg mb-0.5">Whitesquare Int.</h4>
                    <p className="text-[#1a73e8] text-sm group-hover:underline">support@whitesquarein.com</p>
                  </div>
                </a>

              </div>
            </div>

            {/* ================= 🔥 NEW: PREMIUM PROBLEM / MESSAGE BOX ================= */}
            <div className="mt-20 max-w-3xl mx-auto">
              <div className="bg-white border border-[#dadce0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
                
                {/* Form Header */}
                <div className="bg-[#f8f9fa] border-b border-[#dadce0] p-8 md:p-10 text-center relative overflow-hidden">
                  
                  {/* Clean Single Blue Accent Line (Copyright Free) */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1a73e8]"></div>
                  
                  <h3 className="text-2xl md:text-3xl font-medium text-[#202124] mb-3">Facing Any Issues?</h3>
                  <p className="text-[#5f6368] text-base">
                    Drop a message regarding your Swags, Labs, or Arcade Points. Our community team will look into it directly.
                  </p>
                </div>

                {/* Yahan se aage tumhara form wala code shuru hota hai... */}
                
                {/* Form Body */}
                <form onSubmit={handleFormSubmit} className="p-8 md:p-10 flex flex-col gap-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-semibold text-[#3c4043]">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formName} 
                        onChange={(e) => setFormName(e.target.value)} 
                        className="px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] placeholder-[#9aa0a6]" 
                        placeholder="Enter your full name" 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-semibold text-[#3c4043]">Issue Category</label>
                      <div className="relative">
                        <select 
                          value={formCategory} 
                          onChange={(e) => setFormCategory(e.target.value)} 
                          className="w-full px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer"
                        >
                          <option value="Swags Delivery / Issue">Swags Delivery / Issue</option>
                          <option value="Labs Completion Issue">Labs Completion Issue</option>
                          <option value="Arcade Points Calculation">Arcade Points Calculation</option>
                          <option value="Other Queries">Other Queries</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Describe Your Problem</label>
                    <textarea 
                      required 
                      value={formMessage} 
                      onChange={(e) => setFormMessage(e.target.value)} 
                      rows={5} 
                      className="px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] resize-none placeholder-[#9aa0a6]" 
                      placeholder="Explain your doubt or issue in detail here..."
                    ></textarea>
                  </div>

                  {/* Submit Button routes directly to WhatsApp */}
                  <button 
                    type="submit" 
                    className="mt-2 w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-base font-semibold rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Send Request Securely
                  </button>
                  <p className="text-center text-xs text-[#80868b] mt-1">
                    * This will securely redirect your query to our official WhatsApp support channel.
                  </p>
                </form>

              </div>
            </div>

          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-[#202124] mb-16 tracking-tight">How it works?</h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 relative">
              
              {/* STEP 1 */}
              <div className="relative z-10 flex flex-col items-center group bg-[#f8f9fa] p-4 flex-1">
                <div className="w-20 h-20 bg-white border border-[#dadce0] rounded-sm flex items-center justify-center mb-6 shadow-sm group-hover:border-[#1a73e8] transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.85-6.85C35.9 1.84 30.3 0 24 0 14.64 0 6.51 5.38 2.56 13.22l7.98 6.19C12.4 13.4 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.67-.15-3.27-.43-4.82H24v9.13h12.4c-.53 2.86-2.13 5.29-4.53 6.92l7.01 5.45C43.5 36.6 46.1 31.1 46.1 24.5z" />
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.43-.76-2.95-.76-4.59s.28-3.16.76-4.59l-7.98-6.19C.92 16.36 0 20.04 0 24c0 3.96.92 7.64 2.56 10.78l7.98-6.19z" />
                    <path fill="#34A853" d="M24 48c6.3 0 11.6-2.08 15.47-5.67l-7.01-5.45c-1.95 1.31-4.45 2.08-8.46 2.08-6.26 0-11.6-3.9-13.46-9.26l-7.98 6.19C6.51 42.62 14.64 48 24 48z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#202124]">Login with Google</h3>
                <p className="mt-2 text-sm text-[#5f6368] leading-relaxed max-w-[200px]">Securely sign in using your Google account to access.</p>
              </div>

              {/* LONG ARROW 1 */}
              <div className="hidden md:flex flex-col items-center justify-center w-24 lg:w-32 -mt-16 text-[#dadce0]">
                <svg className="w-full h-8" fill="none" stroke="currentColor" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 12h96M88 4l8 8-8 8" />
                </svg>
              </div>

              {/* Down Arrow for Mobile */}
              <div className="md:hidden text-[#dadce0] my-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                 </svg>
              </div>

              {/* STEP 2 */}
              <div className="relative z-10 flex flex-col items-center group bg-[#f8f9fa] p-4 flex-1">
                <div className="w-20 h-20 bg-white border border-[#dadce0] rounded-sm flex items-center justify-center mb-6 shadow-sm text-2xl group-hover:border-[#1a73e8] transition-colors">
                  📎
                </div>
                <h3 className="text-lg font-medium text-[#202124]">Paste Public URL</h3>
                <p className="mt-2 text-sm text-[#5f6368] leading-relaxed max-w-[200px]">Add your Google Cloud Arcade profile link to calculate.</p>
              </div>

              {/* LONG ARROW 2 */}
              <div className="hidden md:flex flex-col items-center justify-center w-24 lg:w-32 -mt-16 text-[#dadce0]">
                <svg className="w-full h-8" fill="none" stroke="currentColor" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 12h96M88 4l8 8-8 8" />
                </svg>
              </div>

              {/* Down Arrow for Mobile */}
              <div className="md:hidden text-[#dadce0] my-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                 </svg>
              </div>

              {/* STEP 3 */}
              <div className="relative z-10 flex flex-col items-center group bg-[#f8f9fa] p-4 flex-1">
                <div className="w-20 h-20 bg-white border border-[#dadce0] rounded-sm flex items-center justify-center mb-6 shadow-sm text-2xl group-hover:border-[#1a73e8] transition-colors">
                  🏆
                </div>
                <h3 className="text-lg font-medium text-[#202124]">Get Arcade Points.</h3>
                <p className="mt-2 text-sm text-[#5f6368] leading-relaxed max-w-[200px]">Instantly view total points, history & leaderboard rank.</p>
              </div>
              
            </div>
          </div>
        </section>

        {/* ================= BASE POINTS SYSTEM ================= */}
        <section className="relative z-10 py-24 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-normal text-[#202124]">Arcade Points System</h2>
              <p className="text-[#5f6368] mt-2 text-sm">How your effort translates to score.</p>
            </div>

            <div className="border border-[#dadce0] rounded-sm bg-white divide-y divide-[#dadce0]">
              
              <div className="flex items-center justify-between p-5 hover:bg-[#f8f9fa] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-[#34a853] rounded-sm"></div>
                  <div>
                    <h4 className="font-medium text-[#202124]">Arcade Adventure</h4>
                    <p className="text-sm text-[#5f6368]">x1 game badge = 1 point</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#e6f4ea] text-[#137333] border border-[#ceead6] text-xs font-bold rounded-sm uppercase tracking-wide">1 Point Each</div>
              </div>
              
              <div className="flex items-center justify-between p-5 hover:bg-[#f8f9fa] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-[#fbbc04] rounded-sm"></div>
                  <div>
                    <h4 className="font-medium text-[#202124]">Trivia & SPRINT</h4>
                    <p className="text-sm text-[#5f6368]">x1 game badge = 1 point</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#fef7e0] text-[#b06000] border border-[#fde293] text-xs font-bold rounded-sm uppercase tracking-wide">1 Point Each</div>
              </div>

              <div className="flex items-center justify-between p-5 hover:bg-[#f8f9fa] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-[#a142f4] rounded-sm"></div>
                  <div>
                    <h4 className="font-medium text-[#202124]">Skill Badges</h4>
                    <p className="text-sm text-[#5f6368]">90+ Skills Badges available</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#f3e8fd] text-[#681da8] border border-[#d7aefb] text-xs font-bold rounded-sm uppercase tracking-wide">x2 = 1 Point</div>
              </div>

              <div className="flex items-center justify-between p-5 hover:bg-[#f8f9fa] transition-colors bg-[#fce8e6]/30">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-[#ea4335] rounded-sm"></div>
                  <div>
                    <h4 className="font-medium text-[#202124]">Special Badges</h4>
                    <p className="text-sm text-[#5f6368]">Limited-time exclusive Points</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#ea4335] text-white text-xs font-bold rounded-sm uppercase tracking-wide">2 Points</div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= GOOGLE STYLE CTA SECTION ================= */}
        <section className="py-24 px-6 bg-[#f8f9fa] border-b border-gray-200">
          <div className="max-w-5xl mx-auto">
            
            <div className="bg-white rounded-sm border border-[#dadce0] shadow-sm flex flex-col md:flex-row">
                
              <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-sm bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                   </div>
                   <span className="text-xs font-medium text-[#1a73e8] uppercase tracking-wider">Arcade Insights</span>
                </div>
                
                <h2 className="text-3xl font-normal text-[#202124] mb-4 leading-tight">
                  Analyze your <span className="font-medium">Arcade Points</span>
                </h2>
                
                <p className="text-[#5f6368] text-base leading-relaxed max-w-lg">
                  Join thousands of developers tracking their progress. Get your score instantly with our professional tool designed for accuracy.
                </p>
              </div>

              <div className="hidden md:block w-px bg-[#dadce0] self-stretch"></div>
              <div className="block md:hidden h-px w-full bg-[#dadce0]"></div>

              <div className="p-10 md:p-14 bg-white md:w-[400px] flex flex-col justify-center items-center gap-6">
                
                <div className="w-full bg-[#f8f9fa] p-5 rounded-sm border border-[#dadce0] flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-widest mb-1">Website Visit Count</span>
                  <div className="text-4xl font-light text-[#202124] tabular-nums tracking-tight">
                    <VisitCounter />
                  </div>
                </div>

                <button
                  onClick={() => router.push("/calculator")}
                  className="w-full group relative inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 bg-[#1a73e8] rounded-sm hover:bg-[#1557b0] hover:shadow-md focus:outline-none"
                >
                  Calculate Now
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </section>

        <FAQ />

        {/* ================= FOOTER ================= */}
        <footer className="bg-white pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
              
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-sm bg-[#1a73e8] flex items-center justify-center text-white text-lg font-medium">
                    A
                  </div>
                  <span className="text-xl font-normal text-[#202124] tracking-tight">
                    Arcade Nexus
                  </span>
                </div>
                <p className="text-[#5f6368] text-sm leading-relaxed mb-6 max-w-sm">
                  This platform is independently designed and developed to help users track, 
                  analyze, and improve their Google Cloud Arcade progress efficiently.
                </p>
                <div className="p-4 rounded-sm bg-[#f8f9fa] border border-[#dadce0]">
                  <p className="text-xs text-[#5f6368] leading-relaxed">
                    <strong className="text-[#202124]">Disclaimer:</strong> This website is an independent, community-built tool and is not 
                    an official website of Google Cloud Arcade or Google. All trademarks belong to their respective owners.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <h4 className="text-[#202124] font-medium mb-6 text-sm">Platform</h4>
                <ul className="space-y-4">
                  <li onClick={() => router.push("/calculator")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline cursor-pointer">Calculator</li>
                  <li onClick={() => router.push("/dashboard")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline cursor-pointer">Dashboard</li>
                  <li onClick={() => router.push("/leaderboard")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline cursor-pointer">Leaderboard</li>
                </ul>
              </div>

              <div className="lg:col-span-1">
                <h4 className="text-[#202124] font-medium mb-6 text-sm">Resources</h4>
                <ul className="space-y-4">
                  <li><a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline block">Enrollment</a></li>
                  <li><a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline block">Points System</a></li>
                  <li><a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline block">Syllabus</a></li>
                </ul>
              </div>

              <div className="lg:col-span-2">
                <h4 className="text-[#202124] font-medium mb-6 text-sm">Stay Connected</h4>
                <p className="text-sm text-[#5f6368] mb-6">Join our community for the latest Arcade updates, hints, and support.</p>
                <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] text-sm font-medium rounded-sm transition-colors group">
                  <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.28-.14-1.658-.817-1.914-.91-.256-.093-.442-.14-.628.14-.186.28-.721.91-.884 1.097-.163.187-.326.21-.605.07-.28-.14-1.182-.436-2.251-1.389-.828-.737-1.387-1.647-1.549-1.926-.163-.28-.017-.432.123-.571.127-.127.28-.327.419-.49.14-.163.186-.28.28-.465.093-.187.047-.35-.023-.49-.07-.14-.628-1.516-.86-2.073-.226-.543-.456-.468-.628-.477-.164-.009-.35-.011-.536-.011-.186 0-.488.07-.743.345-.256.275-.976.953-.976 2.324 0 1.372.999 2.698 1.139 2.883.14.186 1.966 3.001 4.761 4.208.665.287 1.185.459 1.587.587.671.213 1.282.183 1.767.11.542-.081 1.658-.677 1.892-1.33.232-.653.232-1.213.163-1.33-.07-.117-.256-.187-.536-.327z"/>
                  </svg>
                  <span>WhatsApp Community</span>
                </a>
              </div>
            </div>

            <div className="h-px bg-[#dadce0] mb-6"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-[#5f6368] text-sm text-center md:text-left">
                <p>© {new Date().getFullYear()} Arcade Nexus. All rights reserved.</p>
                <p className="mt-1">
                  Powered by: <span className="text-[#202124] font-medium">Manish Kumar & Anjali P.</span>
                </p>
                <p className="mt-1 text-xs text-[#80868b]">
                  Last Updated: March 28, 2026
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
                <a href="https://github.com/M-pixie" target="_blank" className="w-9 h-9 rounded-sm bg-white border border-[#dadce0] flex items-center justify-center hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-colors group">
                  <svg className="w-4 h-4 fill-[#5f6368] group-hover:fill-[#1a73e8]" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
                
                <a href="https://linkedin.com/in/manish-ui" target="_blank" className="w-9 h-9 rounded-sm bg-white border border-[#dadce0] flex items-center justify-center hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-colors group">
                  <svg className="w-4 h-4 fill-[#5f6368] group-hover:fill-[#1a73e8]" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>

                <a href="https://instagram.com/pov.pixi" target="_blank" className="w-9 h-9 rounded-sm bg-white border border-[#dadce0] flex items-center justify-center hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-colors group">
                  <svg className="w-4 h-4 fill-[#5f6368] group-hover:fill-[#1a73e8]" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>

                <a href="https://wa.me/918538980608" target="_blank" className="w-9 h-9 rounded-sm bg-white border border-[#dadce0] flex items-center justify-center hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-colors group">
                  <svg className="w-4 h-4 fill-[#5f6368] group-hover:fill-[#1a73e8]" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.28-.14-1.658-.817-1.914-.91-.256-.093-.442-.14-.628.14-.186.28-.721.91-.884 1.097-.163.187-.326.21-.605.07-.28-.14-1.182-.436-2.251-1.389-.828-.737-1.387-1.647-1.549-1.926-.163-.28-.017-.432.123-.571.127-.127.28-.327.419-.49.14-.163.186-.28.28-.465.093-.187.047-.35-.023-.49-.07-.14-.628-1.516-.86-2.073-.226-.543-.456-.468-.628-.477-.164-.009-.35-.011-.536-.011-.186 0-.488.07-.743.345-.256.275-.976.953-.976 2.324 0 1.372.999 2.698 1.139 2.883.14.186 1.966 3.001 4.761 4.208.665.287 1.185.459 1.587.587.671.213 1.282.183 1.767.11.542-.081 1.658-.677 1.892-1.33.232-.653.232-1.213.163-1.33-.07-.117-.256-.187-.536-.327z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}