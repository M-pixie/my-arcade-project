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

        {/* ================= HERO SECTION (PREMIUM & ANIMATED) ================= */}
        <section className="relative pt-32 pb-24 px-6 border-b border-[#dadce0] bg-white overflow-hidden">
          
          {/* Custom Animations injected via standard style block */}
          <style>{`
            @keyframes float-robot {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            .animate-float-robot {
              animation: float-robot 4s ease-in-out infinite;
            }
            @keyframes typing-left {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-8deg) translateY(6px); }
            }
            .animate-typing-left {
              animation: typing-left 0.4s ease-in-out infinite;
              transform-origin: top right;
            }
            @keyframes typing-right {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(8deg) translateY(6px); }
            }
            .animate-typing-right {
              animation: typing-right 0.5s ease-in-out infinite;
              transform-origin: top left;
            }
            @keyframes blink-eye {
              0%, 45%, 55%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(0.1); }
            }
            .animate-blink {
              animation: blink-eye 4s infinite;
              transform-origin: center;
            }
            /* 🔥 NEW: Smooth Floating Animation for Premium Bubble 🔥 */
            @keyframes smooth-float-bubble {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            .animate-smooth-bubble {
              animation: smooth-float-bubble 3s ease-in-out infinite;
            }
          `}</style>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 relative z-10">
            
            {/* ================= LEFT CONTENT ================= */}
            <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
              
              {/* Animated APRIL LABS Badge */}
              <div className="group relative inline-flex items-center gap-2.5 px-5 py-2 bg-[#fef7e0] border border-[#fde293] text-[#b06000] text-[13px] font-extrabold mb-8 uppercase tracking-widest rounded-full shadow-sm cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea4335] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ea4335]"></span>
                </span>
                <span className="relative z-10">April Month Labs Live !</span>
              </div>

              {/* MAIN HEADING (bold, black, smaller) */}
              <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-[#202124] mb-6 leading-[1.1]">
                Arcade Points <br className="hidden md:block" />
                <span className="relative inline-block mt-2">
                  Calculator
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-[#5f6368] max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                The professional dashboard to calculate your Google Cloud Arcade points, 
                monitor leaderboard rankings & track your growth in real-time.
              </p>

              {/* Standard Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
                <button
                  onClick={() => router.push("/calculator")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] text-white font-medium text-base rounded-xl hover:bg-[#1557b0] hover:shadow-md transition-all duration-200 focus:outline-none"
                >
                  Open Calculator
                </button>
                
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1a73e8] border border-[#dadce0] font-medium text-base rounded-xl hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-all duration-200 focus:outline-none"
                >
                  View Dashboard
                </button>
              </div>

              {/* LONG BUTTON FOR ARCADE */}
              <a
                href="https://go.cloudskillsboost.google/arcade"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full lg:w-max flex items-center justify-center gap-3 px-8 py-4 bg-[#34a853] hover:bg-[#2b8a44] text-white font-bold text-[15px] sm:text-base rounded-xl shadow-[0_4px_14px_rgba(52,168,83,0.3)] hover:shadow-[0_6px_20px_rgba(52,168,83,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Open Google Cloud Arcade Labs
              </a>
              
              {/* Trust Badge */}
              <p className="mt-12 text-[11px] font-bold text-[#80868b] tracking-widest uppercase">
                Trusted by thousands of cloud enthusiasts
              </p>
            </div>

            {/* ================= RIGHT CONTENT: ANIMATED ROBOT ================= */}
            <div className="flex-1 w-full flex justify-center lg:justify-end items-center relative mt-12 lg:mt-0">
              
              {/* Soft background glow behind robot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#e8f0fe] rounded-full blur-[80px] opacity-70 z-0 pointer-events-none"></div>

              {/* SVG Robot Image */}
              <div className="relative z-10 w-full max-w-[450px] animate-float-robot pointer-events-none">
                
                {/* 🔥 Added overflow-visible and adjusted viewBox so nothing cuts off 🔥 */}
                <svg viewBox="0 -20 500 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl overflow-visible">
                  
                  <defs>
                    {/* Premium Soft Shadow for Bubble */}
                    <filter id="premium-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.12" floodColor="#1a73e8" />
                    </filter>
                  </defs>

                  {/* Table/Desk */}
                  <path d="M50 350 L450 350 L480 400 L20 400 Z" fill="#f1f3f4" stroke="#dadce0" strokeWidth="2" />
                  <rect x="20" y="400" width="460" height="15" fill="#dadce0" />

                  {/* Robot Body */}
                  <rect x="200" y="150" width="100" height="150" rx="30" fill="#f8f9fa" stroke="#dadce0" strokeWidth="4"/>

                  {/* Robot Head */}
                  <rect x="180" y="40" width="140" height="100" rx="20" fill="#ffffff" stroke="#dadce0" strokeWidth="4"/>
                  
                  {/* Antenna */}
                  <rect x="245" y="10" width="10" height="30" fill="#dadce0" />
                  <circle cx="250" cy="10" r="8" fill="#ea4335" className="animate-pulse" />
                  
                  {/* Eyes */}
                  <circle cx="220" cy="90" r="12" fill="#1a73e8" className="animate-blink" />
                  <circle cx="280" cy="90" r="12" fill="#1a73e8" className="animate-blink" />
                  
                  {/* Smile */}
                  <path d="M 230 115 Q 250 125 270 115" stroke="#5f6368" strokeWidth="4" fill="transparent" strokeLinecap="round" />

                  {/* 🔥 NEW: Premium Sleek Bubble on the LEFT side with Shadow 🔥 */}
                  <g className="animate-smooth-bubble" filter="url(#premium-shadow)"> 
                    {/* Pill Shape Background */}
                    <rect x="10" y="30" width="170" height="46" rx="23" fill="#ffffff" />
                    {/* Tail pointing exactly to Robot's cheek */}
                    <path d="M 145 68 L 175 85 L 155 60 Z" fill="#ffffff" />
                    
                    {/* Red Live Indicator Dot */}
                    <circle cx="35" cy="53" r="4.5" fill="#ea4335" className="animate-pulse" />
                    
                    {/* Premium Typography */}
                    <text x="50" y="58" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#202124" letterSpacing="0.5">
                      APRIL LABS <tspan fill="#1a73e8">LIVE!</tspan>
                    </text>
                  </g>

                  {/* Laptop Screen (Back) */}
                  <rect x="120" y="200" width="260" height="150" rx="15" fill="#ffffff" stroke="#dadce0" strokeWidth="4"/>
                  {/* Laptop Base */}
                  <path d="M90 350 L410 350 L430 380 L70 380 Z" fill="#e8eaed" stroke="#dadce0" strokeWidth="2"/>
                  <rect x="70" y="380" width="360" height="8" rx="4" fill="#9aa0a6" />

                  {/* Laptop Logo (Google 'G') & Arcade Text */}
                  <circle cx="250" cy="250" r="28" fill="#e8f0fe" />
                  <g transform="translate(238, 238) scale(0.25)">
                    <path d="M96.06 50.51c0-3.37-.29-6.62-.83-9.76H50v18.47h25.83c-1.11 5.99-4.5 11.07-9.59 14.49v12.03h15.53c9.08-8.36 14.32-20.67 14.32-35.23z" fill="#4285F4"/>
                    <path d="M50 97c12.7 0 23.33-4.2 31.11-11.39L65.58 73.58c-4.33 2.9-9.87 4.61-15.58 4.61-12 0-22.16-8.11-25.79-19.01H8.16v12.43C16.03 87.32 32.08 97 50 97z" fill="#34A853"/>
                    <path d="M24.21 59.18c-.92-2.74-1.45-5.67-1.45-8.68s.53-5.94 1.45-8.68V29.39H8.16C4.41 36.9 2.29 45.41 2.29 50.5s2.12 13.6 5.87 21.11l16.05-12.43z" fill="#FBBC05"/>
                    <path d="M50 23.8c6.91 0 13.11 2.37 18 6.99l13.49-13.49C73.31 9.38 62.69 5 50 5 32.08 5 16.03 14.68 8.16 30.2l16.05 12.43C27.84 31.91 37.99 23.8 50 23.8z" fill="#EA4335"/>
                  </g>
                  <text x="250" y="310" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="#1a73e8" letterSpacing="1.5">GOOGLE CLOUD</text>
                  <text x="250" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="18" fontWeight="900" fill="#ea4335" letterSpacing="2">ARCADE</text>
                  
                  {/* Floating Points/Badges Elements */}
                  <g className="animate-[pulse_3s_infinite]">
                    <circle cx="90" cy="140" r="18" fill="#fbbc04" opacity="0.9" />
                    <text x="90" y="146" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#fff">+</text>
                  </g>
                  <g className="animate-[pulse_2s_infinite]" style={{ animationDelay: '1s' }}>
                    <circle cx="410" cy="110" r="24" fill="#34a853" opacity="0.9" />
                    <text x="410" y="117" textAnchor="middle" fontFamily="sans-serif" fontSize="18" fontWeight="bold" fill="#fff">⭐</text>
                  </g>
                  <g className="animate-[pulse_2.5s_infinite]" style={{ animationDelay: '0.5s' }}>
                    <circle cx="380" cy="220" r="14" fill="#ea4335" opacity="0.9" />
                  </g>

                </svg>
              </div>

            </div>
          </div>
        </section>


        {/* ================= HOW TO GET STARTED (PREMIUM SLEEK RECTANGULAR BOX) ================= */}
        <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          {/* 🔥 Width reduced to max-w-3xl to make it look slimmer and more premium 🔥 */}
          <div className="max-w-3xl mx-auto px-6">
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight mb-4">
                How to Start Your Journey?
              </h2>
              <p className="text-[#5f6368] text-base max-w-xl mx-auto leading-relaxed">
                Follow these simple steps to kickstart your Google Cloud Arcade experience.
              </p>
            </div>

            {/* 🔥 SINGLE SLEEK PREMIUM RECTANGULAR BOX 🔥 */}
            <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-[#dadce0]">
                {[
                  { link: "https://share.google/mn0xUfmd49TA9RPc1", title: "Sign in Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile." },
                  { link: "https://share.google/45EC3J4RjWLzgbkGy", title: "Registration", desc: "Enroll in Arcade to unlock labs, points and challenges." },
                  { link: "https://share.google/Ojw8FgQpGhPI1sXyt", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards." },
                  { link: "https://share.google/JRMVQ9xd8tTwx8Mol", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards." },
                ].map((step, idx) => (
                  <div key={idx} className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                    
                    {/* Text Content (Without Number Badge) */}
                    <div className="flex-1">
                      <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">{step.title}</h3>
                      <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">{step.desc}</p>
                    </div>

                    {/* 🔥 LONG GREEN "CLICK HERE" BUTTON 🔥 */}
                    <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                      <a 
                        href={step.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full md:w-40 py-3 px-5 bg-[#34a853] hover:bg-[#2b8a44] text-white text-[14px] font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                      >
                        Click Here
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ================= FEATURES (PREMIUM SLEEK RECTANGULAR BOX) ================= */}
        <section className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
          {/* 🔥 Width reduced to max-w-3xl to match the sleek design of the previous section 🔥 */}
          <div className="max-w-3xl mx-auto px-6">
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] tracking-tight mb-4">
                Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Win Arcade</span>
              </h2>
              <p className="text-[#5f6368] text-base max-w-xl mx-auto leading-relaxed">
                Powerful tools and resources designed to help you track, calculate, and boost your Arcade points.
              </p>
            </div>

            {/* 🔥 SINGLE SLEEK PREMIUM RECTANGULAR BOX 🔥 */}
            <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-[#dadce0]">
                {[
                  { title: "Points Calculator", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator" },
                  { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard" },
                  { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard" },
                  { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator" },
                ].map((feature, idx) => (
                  <div key={idx} className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                    
                    {/* Text Content (Without Icon Badge) */}
                    <div className="flex-1">
                      <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">{feature.title}</h3>
                      <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">{feature.desc}</p>
                    </div>

                    {/* 🔥 LONG BLUE "TRY IT OUT" BUTTON 🔥 */}
                    <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                      <button 
                        onClick={() => router.push(feature.link)}
                        className="flex items-center justify-center gap-2 w-full md:w-40 py-3 px-5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                      >
                        Try it out
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </section>

          
{/* ================= 🔥 PREMIUM REWARDS SECTION (CLEAR BORDER, NO ZOOM) 🔥 ================= */}
<section className="relative z-10 py-24 bg-gradient-to-b from-white to-[#f8f9fa] border-b border-[#dadce0] overflow-hidden">
  <div className="max-w-6xl mx-auto px-6">
    
    {/* 🔥 Updated Heading and Paragraph Intro (BADA ANTIMATED GIF) 🔥 */}
    <div className="text-center mb-16 relative z-10 flex flex-col items-center">
      
      {/* Container holding icon and text, background aur border hata diya */}
      <div className="inline-flex items-center gap-4 text-[#b06000] mb-8 cursor-default">
        
        {/* 🔥 FIXED: BADA GIF SYMBOL (6xl) + UNIQUE FLOAT/SPIN ANIMATION 🔥 */}
        <span className="text-6xl block animate-[smooth-float-spin_3s_ease-in-out_infinite] origin-center">
          🎁
        </span>
        
        {/* Text styling updated to look good with the big icon */}
        <span className="text-lg font-extrabold uppercase tracking-widest mt-1">
          Google Swags
        </span>
      </div>
      
      {/* Baaki heading aur paragraph untouched */}
      <h2 className="text-4xl md:text-5xl font-semibold text-[#202124] tracking-tight mb-5">
        claim your google swags
      </h2>
      
      <p className="text-[#5f6368] text-lg max-w-2xl mx-auto leading-relaxed font-medium">
        Level up your cloud skills and unlock exclusive, premium Google Cloud gear. The more badges you collect, the bigger the rewards.
      </p>
    </div>

    {/* Single, Central Image Container */}
    {/* 🔥 FIXED: p-[4px] kar diya taaki border ki motai badhe aur animation ekdum clear dikhe 🔥 */}
    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] transition-all duration-500 ease-out p-[4px] bg-[#f8f9fa] mx-auto max-w-5xl">
      
      {/* Moving Border Animation background (Hamesha ghumega taaki clear dikhe) */}
      <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_75%,#a855f7_100%)] animate-[spin_2.5s_linear_infinite] opacity-100 z-0 pointer-events-none"></div>

      {/* Actual Content Wrapper (Andar wale edges round kiye taaki border smooth dikhe) */}
      <div className="relative w-full h-full bg-white rounded-[13px] z-10 overflow-hidden">
        
        {/* 🔥 FIXED: Image ka scale/zoom aur dark overlay dono hata diya 🔥 */}
        <img 
          src="https://i.postimg.cc/MT50zzG8/1775382064372.png" 
          alt="Premium Swags Showcase" 
          className="w-full h-auto block"
        />

      </div>
    </div>

  </div>
</section>

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
        <div className="mt-20 max-w-3xl mx-auto mb-20 px-6">
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


        {/* ================= PREMIUM HOW IT WORKS (CLEAN & SLEEK THEME) ================= */}
        <section className="relative z-10 py-32 bg-[#f8f9fa] border-b border-[#dadce0] overflow-hidden">
          
          {/* Subtle Background Animated Blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#e8f0fe] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-[pulse_6s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-[#e6f4ea] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
          </div>

          <style>{`
            @keyframes float-card {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            .animate-float-card {
              animation: float-card 5s ease-in-out infinite;
            }
            .glass-panel {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(12px);
            }
          `}</style>

          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            
            {/* Header - Clean, No Gradient, No Bold */}
            <div className="inline-block mb-24">
              <h2 className="text-3xl md:text-5xl font-medium text-[#202124] tracking-tight mb-4">
                How it works?
              </h2>
              <p className="text-[#5f6368] text-lg max-w-xl mx-auto">
                Get your Google Cloud Arcade points calculated in three simple, seamless steps.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-4 relative">
              
              {/* ================= STEP 1 ================= */}
              <div className="relative z-10 flex flex-col items-center group flex-1 w-full md:w-auto animate-float-card" style={{ animationDelay: '0s' }}>
                {/* Changed rounded-3xl to rounded-xl (Halka curve) */}
                <div className="glass-panel w-24 h-24 border border-[#dadce0] rounded-xl flex items-center justify-center mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group-hover:shadow-[0_15px_30px_rgba(26,115,232,0.1)] group-hover:-translate-y-2 group-hover:border-[#1a73e8] transition-all duration-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0fe] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <svg className="w-10 h-10 relative z-10 transform group-hover:scale-110 transition-transform duration-400" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.85-6.85C35.9 1.84 30.3 0 24 0 14.64 0 6.51 5.38 2.56 13.22l7.98 6.19C12.4 13.4 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.67-.15-3.27-.43-4.82H24v9.13h12.4c-.53 2.86-2.13 5.29-4.53 6.92l7.01 5.45C43.5 36.6 46.1 31.1 46.1 24.5z" />
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.43-.76-2.95-.76-4.59s.28-3.16.76-4.59l-7.98-6.19C.92 16.36 0 20.04 0 24c0 3.96.92 7.64 2.56 10.78l7.98-6.19z" />
                    <path fill="#34A853" d="M24 48c6.3 0 11.6-2.08 15.47-5.67l-7.01-5.45c-1.95 1.31-4.45 2.08-8.46 2.08-6.26 0-11.6-3.9-13.46-9.26l-7.98 6.19C6.51 42.62 14.64 48 24 48z" />
                  </svg>
                </div>
                <div className="bg-white px-4 py-1 rounded-full border border-[#dadce0] text-xs font-bold text-[#1a73e8] mb-4 shadow-sm group-hover:bg-[#1a73e8] group-hover:text-white transition-colors duration-300">
                  STEP 01
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-2 group-hover:text-[#1a73e8] transition-colors">Login with Google</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-[220px]">Securely sign in using your Google account to access the tools.</p>
              </div>

              {/* ================= BOLD ARROW 1 ================= */}
              <div className="hidden md:flex flex-col items-center justify-center w-16 lg:w-24 -mt-32 text-[#dadce0]">
                <svg className="w-10 h-10 text-[#bdc1c6] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              {/* Mobile Down Arrow */}
              <div className="md:hidden text-[#bdc1c6] my-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              {/* ================= STEP 2 ================= */}
              <div className="relative z-10 flex flex-col items-center group flex-1 w-full md:w-auto animate-float-card" style={{ animationDelay: '0.2s' }}>
                {/* Changed rounded-3xl to rounded-xl (Halka curve) */}
                <div className="glass-panel w-24 h-24 border border-[#dadce0] rounded-xl flex items-center justify-center mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group-hover:shadow-[0_15px_30px_rgba(52,168,83,0.1)] group-hover:-translate-y-2 group-hover:border-[#34a853] transition-all duration-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e6f4ea] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <svg className="w-10 h-10 text-[#5f6368] group-hover:text-[#34a853] relative z-10 transform group-hover:scale-110 transition-transform duration-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <div className="bg-white px-4 py-1 rounded-full border border-[#dadce0] text-xs font-bold text-[#34a853] mb-4 shadow-sm group-hover:bg-[#34a853] group-hover:text-white transition-colors duration-300">
                  STEP 02
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-2 group-hover:text-[#34a853] transition-colors">Paste Public URL</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-[220px]">Simply drop your Google Cloud Arcade profile link to analyze.</p>
              </div>

              {/* ================= BOLD ARROW 2 ================= */}
              <div className="hidden md:flex flex-col items-center justify-center w-16 lg:w-24 -mt-32 text-[#dadce0]">
                <svg className="w-10 h-10 text-[#bdc1c6] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              {/* Mobile Down Arrow */}
              <div className="md:hidden text-[#bdc1c6] my-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              {/* ================= STEP 3 ================= */}
              <div className="relative z-10 flex flex-col items-center group flex-1 w-full md:w-auto animate-float-card" style={{ animationDelay: '0.4s' }}>
                {/* Changed rounded-3xl to rounded-xl (Halka curve) */}
                <div className="glass-panel w-24 h-24 border border-[#dadce0] rounded-xl flex items-center justify-center mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group-hover:shadow-[0_15px_30px_rgba(251,188,4,0.15)] group-hover:-translate-y-2 group-hover:border-[#fbbc04] transition-all duration-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fef7e0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="text-4xl relative z-10 transform group-hover:scale-110 transition-transform duration-400">
                    🏆
                  </div>
                </div>
                <div className="bg-white px-4 py-1 rounded-full border border-[#dadce0] text-xs font-bold text-[#ea4335] mb-4 shadow-sm group-hover:bg-[#ea4335] group-hover:text-white transition-colors duration-300">
                  STEP 03
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-2 group-hover:text-[#ea4335] transition-colors">Get Arcade Points</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-[220px]">Instantly view your total points, history, and real-time rank.</p>
              </div>
              
            </div>
          </div>
        </section>

        {/* ================= PREMIUM BASE POINTS SYSTEM ================= */}
        <section className="relative z-10 py-32 bg-[#f8f9fa] border-b border-[#dadce0]">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#202124 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          <div className="max-w-5xl mx-auto px-6 relative z-10">
            
            {/* Header Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-medium text-[#202124] tracking-tight mb-4">
                Arcade Points <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#34a853]">System</span>
              </h2>
              <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Understand exactly how your effort translates to your final score. Collect badges across different tracks to maximize your rewards.
              </p>
            </div>

            {/* Stacked Premium Cards Container */}
            <div className="flex flex-col gap-4">
              
              {/* ================= CARD 1: ARCADE ADVENTURE ================= */}
              <div className="group relative bg-white border border-[#dadce0] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(52,168,83,0.08)] hover:border-[#34a853]/40 transition-all duration-400 overflow-hidden cursor-default">
                {/* Subtle Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#e6f4ea]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Left: Icon & Title */}
                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center border border-[#ceead6] group-hover:scale-110 transition-transform duration-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#202124]">Arcade Adventure</h4>
                    <p className="text-sm text-[#5f6368] mt-0.5">Standard track progression</p>
                  </div>
                </div>

                {/* Middle: Formula Box */}
                <div className="relative z-10 w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg px-5 py-2.5 group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <span className="text-[#5f6368] text-sm font-medium">x1 game badge</span>
                    <svg className="w-4 h-4 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[#137333] text-sm font-bold">1 point</span>
                  </div>
                </div>

                {/* Right: Final Tag */}
                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <div className="inline-block px-5 py-2.5 bg-[#137333] text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">
                    1 Point Each
                  </div>
                </div>
              </div>

              {/* ================= CARD 2: ARCADE VOYAGE ================= */}
              <div className="group relative bg-white border border-[#dadce0] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(26,115,232,0.08)] hover:border-[#1a73e8]/40 transition-all duration-400 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-[#e8f0fe]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center border border-[#d2e3fc] group-hover:scale-110 transition-transform duration-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#202124]">Arcade Voyage</h4>
                    <p className="text-sm text-[#5f6368] mt-0.5">Intermediate cloud challenges</p>
                  </div>
                </div>

                <div className="relative z-10 w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg px-5 py-2.5 group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <span className="text-[#5f6368] text-sm font-medium">x1 game badge</span>
                    <svg className="w-4 h-4 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[#1a73e8] text-sm font-bold">1 point</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <div className="inline-block px-5 py-2.5 bg-[#1a73e8] text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">
                    1 Point Each
                  </div>
                </div>
              </div>

              {/* ================= CARD 3: ARCADE TRAIL ================= */}
              <div className="group relative bg-white border border-[#dadce0] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(18,181,203,0.08)] hover:border-[#12b5cb]/40 transition-all duration-400 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-[#e4f7fb]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#e4f7fb] text-[#0d8293] flex items-center justify-center border border-[#cbf0f8] group-hover:scale-110 transition-transform duration-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#202124]">Arcade Trail</h4>
                    <p className="text-sm text-[#5f6368] mt-0.5">Advanced guided paths</p>
                  </div>
                </div>

                <div className="relative z-10 w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg px-5 py-2.5 group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <span className="text-[#5f6368] text-sm font-medium">x1 game badge</span>
                    <svg className="w-4 h-4 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[#0d8293] text-sm font-bold">1 point</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <div className="inline-block px-5 py-2.5 bg-[#0d8293] text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">
                    1 Point Each
                  </div>
                </div>
              </div>

              {/* ================= CARD 4: TRIVIA & SPRINT ================= */}
              <div className="group relative bg-white border border-[#dadce0] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(251,188,4,0.08)] hover:border-[#fbbc04]/40 transition-all duration-400 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-[#fef7e0]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#fef7e0] text-[#ea8600] flex items-center justify-center border border-[#fde293] group-hover:scale-110 transition-transform duration-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#202124]">Trivia & SPRINT</h4>
                    <p className="text-sm text-[#5f6368] mt-0.5">Quick knowledge tests</p>
                  </div>
                </div>

                <div className="relative z-10 w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg px-5 py-2.5 group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <span className="text-[#5f6368] text-sm font-medium">x1 game badge</span>
                    <svg className="w-4 h-4 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[#ea8600] text-sm font-bold">1 point</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <div className="inline-block px-5 py-2.5 bg-[#ea8600] text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">
                    1 Point Each
                  </div>
                </div>
              </div>

              {/* ================= CARD 5: SKILL BADGES (UPDATED TO x2 = 1) ================= */}
              <div className="group relative bg-white border border-[#dadce0] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(161,66,244,0.08)] hover:border-[#a142f4]/40 transition-all duration-400 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f3e8fd]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#f3e8fd] text-[#8430ce] flex items-center justify-center border border-[#d7aefb] group-hover:scale-110 transition-transform duration-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#202124]">Skill Badges</h4>
                    <p className="text-sm text-[#5f6368] mt-0.5">90+ Skills Badges available</p>
                  </div>
                </div>

                <div className="relative z-10 w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg px-5 py-2.5 group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <span className="text-[#5f6368] text-sm font-medium">x2 badges</span>
                    <svg className="w-4 h-4 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[#8430ce] text-sm font-bold">1 point</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <div className="inline-block px-5 py-2.5 bg-[#8430ce] text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">
                    Needs 2 Badges
                  </div>
                </div>
              </div>

              {/* ================= CARD 6: SPECIAL BADGES ================= */}
              <div className="group relative bg-[#fce8e6]/30 border border-[#dadce0] rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(234,67,53,0.08)] hover:border-[#ea4335]/40 transition-all duration-400 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-[#fce8e6]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#fce8e6] text-[#c5221f] flex items-center justify-center border border-[#f8c1cb] group-hover:scale-110 transition-transform duration-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#202124]">Special Badges</h4>
                    <p className="text-sm text-[#c5221f] font-medium mt-0.5">Limited-time exclusive</p>
                  </div>
                </div>

                <div className="relative z-10 w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white border border-[#dadce0] rounded-lg px-5 py-2.5 shadow-sm">
                    <span className="text-[#5f6368] text-sm font-medium">x1 game badge</span>
                    <svg className="w-4 h-4 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[#c5221f] text-sm font-bold">2 points</span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <div className="inline-block px-5 py-2.5 bg-[#ea4335] text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow animate-[pulse_3s_ease-in-out_infinite]">
                    2 Points
                  </div>
                </div>
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

        
      </main>
    </>
  );
}