"use client";

import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Official FAQ Data
const officialFaqs = [
  {
    question: "When is the Arcade Facilitator program starting?",
    answer: "The Arcade Facilitator program is an ongoing initiative. Different cohorts and milestones are announced periodically. Keep an eye on your email or the official community channels for specific start and end dates of the active cohort."
  },
  {
    question: "How do I enroll in the program?",
    answer: "You can enroll using the official enrollment form provided by Google Cloud. Ensure you have a Google Cloud Skills Boost account and a public profile URL ready before you fill out the form."
  },
  {
    question: "I completed a lab, but my points are not updating?",
    answer: "Points can take up to 24-48 hours to reflect on your profile. Ensure that you have completed the lab within the active program dates and that your public profile is correctly linked."
  },
  {
    question: "How can I claim swags?",
    answer: "Once the program cohort ends, the Google Cloud team will calculate your final points based on your milestones. If you qualify for a prize tier, you will receive an email with instructions on how to claim your swags from the prize counter."
  },
  {
    question: "What if my Google Cloud Skills Boost profile is not public?",
    answer: "If your profile is not public, your points cannot be tracked, and you will not be eligible for rewards. You must go to your profile settings in Cloud Skills Boost and ensure 'Make Profile Public' is enabled."
  },
  {
    question: "Who can participate in this program?",
    answer: "The program is generally open to anyone interested in learning Google Cloud technologies. However, you must meet the age requirements and any geographic restrictions specified in the official terms and conditions."
  }
];

export default function FacilitatorPage() {
  const router = useRouter();
  
  // NEW: State for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 🔥 UPDATED TEAM DATA ARRAY (With Correct Sequence: Manish 1st)
  const teamMembers = [
    { 
      name: "Manish", 
      role: "Arcade Facilitator", 
      image: "https://img.sanishtech.com/u/ab32bfb9414fbe6f2b7ddfa781590c28.jpg", 
      initials: "M",
      linkedin: "https://linkedin.com/in/manish-ui", 
      color: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]" 
    },
    { 
      name: "Anjali", 
      role: "Arcade Facilitator", 
      image: "https://img.sanishtech.com/u/3309659d83199a9b8ed3aba6344560cf.jpg", 
      initials: "A",
      linkedin: "https://www.linkedin.com/in/anjali-p-a2ba1419b", 
      color: "bg-[#fef7e0] text-[#b06000] border-[#fde293]" 
    },
    { 
      name: "Preeti", 
      role: "Community Lead", 
      image: "https://img.sanishtech.com/u/c1143a2a8ab3226ca5570e4498beb552.png", 
      initials: "P",
      linkedin: "https://www.linkedin.com/in/preeti-patel-a91406331", 
      color: "bg-[#e6f4ea] text-[#137333] border-[#ceead6]" 
    },
    { 
      name: "Rohit", 
      role: "Google Cloud Labs Lead", 
      image: "https://img.sanishtech.com/u/7a3f53b22b40cd0f159aeed18f4e5b6f.jpg",
      initials: "R", 
      linkedin: "https://www.linkedin.com/in/rohit-kumar-b482752ab", 
      color: "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]" 
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#202124] font-sans">
      <Navbar />

      <main className="pt-20">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative border-b border-[#dadce0] bg-[#f8f9fa] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#dadce0] text-[#5f6368] text-xs font-bold mb-6 uppercase tracking-widest rounded-sm">
                <span className="w-2 h-2 bg-[#34a853] rounded-sm"></span>
                Facilitator 2026
              </div>
              
              <h1 className="text-4xl md:text-6xl font-normal text-[#202124] tracking-tight mb-6 leading-[1.1]">
                Google Cloud Arcade <br />
                <span className="font-medium text-[#1a73e8]">Facilitator Program</span>
              </h1>
              
              <p className="text-[#5f6368] text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                Kickstart your cloud journey, learn new skills on Google Cloud Platform, and win exciting exclusive Google Cloud swags by completing milestones.
              </p>

              {/* THREE BUTTONS IN A ROW */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a 
                  href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-base font-medium rounded-sm shadow-sm transition-all text-center focus:outline-none"
                >
                  Enroll Now
                </a>
                <a 
                  href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#1a73e8] text-[#1a73e8] text-base font-medium rounded-sm transition-all text-center focus:outline-none"
                >
                  Points System
                </a>
                {/* NEW CALCULATOR BUTTON */}
                <button 
                  onClick={() => router.push("/calculator")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#1a73e8] text-[#1a73e8] text-base font-medium rounded-sm transition-all text-center focus:outline-none"
                >
                  Open Calculator
                </button>
              </div>
            </div>

            {/* ================= PREMIUM HERO GRAPHIC ================= */}
            <div className="flex-1 w-full max-w-[400px] relative z-10 hidden md:block group cursor-default lg:ml-auto mt-8 md:mt-0">
              
              {/* Premium Smooth Float Animation CSS */}
              <style>{`
                @keyframes smoothFloat {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-12px) scale(1.02); }
                }
                @keyframes smoothFloatReverse {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(12px) scale(1.02); }
                }
                .float-premium { animation: smoothFloat 6s ease-in-out infinite; }
                .float-premium-delay { animation: smoothFloatReverse 7s ease-in-out infinite; }
              `}</style>

              {/* Main Container */}
              <div className="relative w-full aspect-square">
                
                {/* BACKDROP GLASS CARD */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(26,115,232,0.15)] overflow-hidden transition-all duration-700 group-hover:shadow-[0_30px_70px_-15px_rgba(26,115,232,0.25)]">
                  
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 opacity-30" 
                       style={{ backgroundImage: 'linear-gradient(#1a73e8 1px, transparent 1px), linear-gradient(90deg, #1a73e8 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                  </div>
                  {/* Radial Gradient to fade out the grid at edges */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.9)_70%)]"></div>

                  {/* ROTATING RINGS & GLOW */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-48 h-48 bg-[#1a73e8]/20 rounded-full blur-[40px] animate-pulse"></div>
                    <div className="absolute w-72 h-72 border-[2px] border-t-[#1a73e8]/60 border-r-transparent border-b-[#34a853]/60 border-l-transparent rounded-full animate-[spin_12s_linear_infinite]"></div>
                    <div className="absolute w-52 h-52 border-[1.5px] border-dashed border-[#ea4335]/50 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                  </div>
                </div>

                {/* CENTRAL CORE CARD */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-28 h-28 bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_10px_40px_rgba(26,115,232,0.2)] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 z-20 pointer-events-auto">
                    
                    {/* Google Colorful Logo */}
                    <svg className="w-14 h-14" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>

                  </div>
                </div>

                {/* --- FLOATING CARDS --- */}
                {/* 1. Cloud Skill Boost (Top Left) */}
                <div className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-md p-2.5 pr-4 border border-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 float-premium flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#e6f4ea] to-[#ceead6] p-2 rounded-xl shadow-inner">
                    <svg className="w-5 h-5 text-[#137333]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202124]">Cloud Labs</div>
                    <div className="text-[10px] text-[#137333] font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34a853]"></span></span>
                      Active
                    </div>
                  </div>
                </div>

                {/* 2. Swag Unlocked (Top Right) */}
                <div className="absolute top-10 -right-8 bg-white/95 backdrop-blur-md p-2.5 pr-4 border border-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 float-premium-delay flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#fce8e6] to-[#fad2cf] p-2 rounded-xl shadow-inner">
                    <svg className="w-5 h-5 text-[#c5221f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.38 3.46L16 2a8 8 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202124]">Swags</div>
                    <div className="text-[10px] text-[#5f6368] font-semibold mt-0.5">Unlocked 🎉</div>
                  </div>
                </div>

                {/* 3. Arcade Points (Bottom Right) */}
                <div className="absolute bottom-16 -right-4 bg-white/95 backdrop-blur-md p-2.5 pr-4 border border-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 float-premium flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#fef7e0] to-[#fde293] p-2 rounded-xl shadow-inner">
                    <svg className="w-5 h-5 text-[#b06000]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202124]">Arcade Points</div>
                    <div className="text-[11px] text-[#b06000] font-extrabold mt-0.5">+100 PTS</div>
                  </div>
                </div>

                {/* 4. Skill Badge (Bottom Left) */}
                <div className="absolute -bottom-4 left-4 bg-white/95 backdrop-blur-md p-2.5 pr-4 border border-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 float-premium-delay flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#e8f0fe] to-[#d2e3fc] p-2 rounded-xl shadow-inner">
                    <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#202124]">Skill Badge</div>
                    <div className="text-[10px] text-[#1a73e8] font-bold mt-0.5">Verified ✓</div>
                  </div>
                </div>

              </div>
            </div>
            {/* ================= END PREMIUM HERO GRAPHIC ================= */}
          </div>
        </section>

        {/* ================= HOW IT WORKS / ABOUT ================= */}
        <section className="py-24 px-6 border-b border-[#dadce0] bg-white">
          <div className="max-w-6xl mx-auto">
            
            {/* ================= PREMIUM RECTANGULAR INTRO BOX ================= */}
            <div className="mb-16 bg-gradient-to-b from-white to-[#f8f9fa] border border-[#dadce0] rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(26,115,232,0.08)] transition-shadow duration-500">
              
              {/* Google Colors Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 flex">
                <div className="h-full bg-[#4285F4] w-1/4"></div>
                <div className="h-full bg-[#EA4335] w-1/4"></div>
                <div className="h-full bg-[#FBBC05] w-1/4"></div>
                <div className="h-full bg-[#34A853] w-1/4"></div>
              </div>

              <div className="text-center relative z-10">
                <h2 className="text-3xl font-medium text-[#202124] tracking-tight mb-8">Arcade Facilitator Program ?</h2>
                
                {/* 🔥 HIGHLIGHTED PARAGRAPH BOX */}
                <div className="max-w-4xl mx-auto bg-[#e8f0fe]/60 border border-[#d2e3fc] rounded-xl p-6 md:p-8 mb-8 shadow-sm">
                  <p className="text-[#3c4043] text-base md:text-lg leading-relaxed font-medium">
                    The Arcade Facilitator Program is an always-on, no-cost gaming campaign where technical practitioners of all levels can learn new cloud skills like computing, application development, big data & AI/ML and earn digital badges & points to use towards claiming swag prizes and Google Cloud goodies. 
                  </p>
                </div>

                {/* 🔥 PREMIUM FACILITATOR BADGE */}
                <div className="inline-flex items-center gap-2 bg-white border border-[#dadce0] px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-[#5f6368] text-sm md:text-base font-medium">Your Facilitator :</span>
                  <a 
                    href="https://linkedin.com/in/manish-ui" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-[#1a73e8] hover:text-[#1557b0] text-sm md:text-base hover:underline transition-colors flex items-center gap-1.5"
                  >
                    Mr Manish Kumar
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>

              </div>
            </div>
            {/* ================= END PREMIUM INTRO BOX ================= */}

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Learn Google Cloud Skills", icon: "📚", color: "text-[#1a73e8]", bg: "bg-[#e8f0fe]", border: "border-[#d2e3fc]", desc: "Access free Qwiklabs credits and start learning Google Cloud basics, Gen AI, and Big Data." },
                { title: "Earn Cloud Skill Badges", icon: "🎖️", color: "text-[#fbbc04]", bg: "bg-[#fef7e0]", border: "border-[#fde293]", desc: "Complete quests and skill badges on Google Cloud Skills Boost to earn Arcade Points." },
                { title: "Win Google Cloud Swags", icon: "🎁", color: "text-[#34a853]", bg: "bg-[#e6f4ea]", border: "border-[#ceead6]", desc: "Accumulate points and redeem them at the prize counter for official Google Cloud swags." }
              ].map((item, index) => (
                <div key={index} className="p-8 border border-[#dadce0] rounded-sm hover:shadow-sm transition-shadow bg-white">
                  <div className={`w-14 h-14 ${item.bg} ${item.border} border rounded-sm flex items-center justify-center text-2xl mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium text-[#202124] mb-3">{item.title}</h3>
                  <p className="text-[#5f6368] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MILESTONES & REWARDS ================= */}
        <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-normal text-[#202124] tracking-tight mb-10 text-center">Milestones & Swags</h2>
            
            <div className="bg-white border border-[#dadce0] rounded-sm shadow-sm overflow-hidden mb-6">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-[#dadce0] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                <div className="col-span-4">Users Milestone</div>
                <div className="col-span-4 text-center">Required Points</div>
                <div className="col-span-4 text-right">Expected Rewards</div>
              </div>

              <div className="divide-y divide-[#dadce0]">
                {/* Premium Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#1a73e8] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Ultimate Milestone</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#1a73e8]">40+ Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>

                {/* Premium Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#fbbc04] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Milestone 3</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#fbbc04]">25 - 39 Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>

                {/* Advanced Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#34a853] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Milestone 2</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#34a853]">15 - 24 Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>

                {/* Standard Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#ea4335] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Milestone 1</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#ea4335]">10 - 14 Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>
              </div>
            </div>
            
            {/* MOVING MARQUEE TEXT */}
            <div className="overflow-hidden bg-[#e8f0fe] border border-[#d2e3fc] rounded-sm py-2 mb-6 w-full whitespace-nowrap">
              <style>{`
                @keyframes scroll-text {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-scroll-text {
                  display: inline-block;
                  animation: scroll-text 15s linear infinite;
                  will-change: transform;
                }
              `}</style>
              
              <div className="animate-scroll-text w-full text-sm font-medium text-[#1a73e8] px-4">
                * Rewards are subject to change and availability by Google Cloud. Points must be earned in the active cohort. Please refer to official guidelines.
              </div>
            </div>
          </div>
        </section>

        {/* ================= TEAM SECTION ================= */}
        <section className="py-24 px-6 bg-white border-b border-[#dadce0]">
          <div className="max-w-6xl mx-auto relative z-10">

            {/* Premium Animations */}
            <style>{`
              @keyframes gradient-rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .animate-gradient-rotate {
                animation: gradient-rotate 8s linear infinite;
                width: 200%; 
                height: 200%;
                top: -50%;
                left: -50%;
              }
              @keyframes shimmer-text {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
              }
              .animate-shimmer-text {
                background-size: 200% auto;
                animation: shimmer-text 3s linear infinite;
              }
            `}</style>

            {/* 🔥 NEW PROFESSIONAL HEADING */}
            <div className="text-center mb-20 relative z-10">
              <h2 className="text-4xl md:text-5xl font-semibold text-[#202124] tracking-tight mb-4">
                Meet Our Arcade Team
              </h2>
              <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Connect with the people driving the Arcade Facilitator Program in our community.
              </p>
               {/* Decorative Colorful Blended Underline */}
              <div className="h-0.5 w-40 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] mx-auto rounded-full mt-6"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <a 
                  key={index} 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-2xl hover:shadow-[0_8px_30px_rgba(26,115,232,0.18)] transition-all duration-500 overflow-hidden pointer-events-auto"
                >
                  
                  {/* 🔥 CHAARO TARAF GOOGLE COLORS KA MOVE HONE WALA BORDER */}
                  <div className="absolute animate-gradient-rotate bg-[conic-gradient(from_0deg_at_50%_50%,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                  
                  {/* Inner White Box - Content */}
                  <div className="relative h-full bg-white rounded-[14px] text-center flex flex-col items-center justify-center z-10 m-[3px] pointer-events-none">
                    
                    {/* 🔥 ENLARGED FULL BOX IMAGE SECTION 🔥 */}
                    <div className="w-full aspect-square object-cover rounded-t-[14px] mb-6 overflow-hidden border-b border-[#dadce0]">
                      {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            // 🔥 Added object-top so heads don't get cut off!
                            className="w-full h-full object-cover object-top"
                          />
                      ) : (
                          <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${member.color}`}>
                            {member.initials || member.name.charAt(0)}
                          </div>
                      )}
                    </div>

                    {/* 🔥 Role Badges integrated with text block below image 🔥 */}
                    <div className="px-8 pb-8 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-[#202124] mb-2 group-hover:text-[#1a73e8] transition-colors">{member.name}</h3>

                        {member.role === "Arcade Facilitator" ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f0fe] border border-[#d2e3fc] rounded-md mb-5 shadow-sm">
                            <svg className="w-3.5 h-3.5 text-[#FBBC05] animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#1a73e8] animate-shimmer-text bg-clip-text text-transparent">
                              {member.role}
                            </span>
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${member.color} text-[10px] font-bold uppercase tracking-widest rounded-md mb-5`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                            {member.role}
                          </div>
                        )}
                    </div>

                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* ================= NEW: FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-normal text-[#202124] tracking-tight">Frequently Asked Questions</h2>
              <p className="text-[#5f6368] mt-2 text-sm">Find answers to common questions about the Arcade Facilitator Program.</p>
            </div>
            
            <div className="border border-[#dadce0] rounded-sm bg-white divide-y divide-[#dadce0] shadow-sm">
              {officialFaqs.map((faq, index) => (
                <div key={index} className="overflow-hidden bg-white">
                  <button
                    className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-[#f8f9fa] transition-colors gap-4 focus:outline-none"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="text-[#202124] font-medium text-base md:text-lg leading-snug">
                      {faq.question}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-[#5f6368] flex-shrink-0 transform transition-transform duration-300 ease-in-out ${openFaqIndex === index ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 pt-0 bg-white text-[#5f6368] text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PREMIUM FAQ BUTTON */}
            <div className="mt-10 text-center">
               <a 
                 href="https://rsvp.withgoogle.com/events/arcade-facilitator/faqs" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-sm font-medium text-[#1a73e8] bg-white border border-[#dadce0] px-6 py-3.5 rounded-xl hover:shadow-md hover:border-[#1a73e8] hover:bg-[#f8f9fa] transition-all duration-300 group"
               >
                 View all FAQs on official site
                 <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                 </svg>
               </a>
            </div>
          </div>
        </section>

      </main>

      {/* ================= MINIMAL FOOTER ================= */}
      <footer className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#5f6368] text-sm text-center md:text-left">
            <p>© {new Date().getFullYear()} Arcade Nexus. Independent Community Tool.</p>
          </div>
          <div className="flex gap-4">
            
            {/* Home Button with Tooltip */}
            <div className="relative group">
              <button onClick={() => router.push("/")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline focus:outline-none">
                Home
              </button>
              {/* Black Popup (Tooltip) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#202124] text-white text-xs font-medium whitespace-nowrap rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-md">
                Go to Homepage
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#202124]"></div>
              </div>
            </div>

            {/* Calculator Button with Tooltip */}
            <div className="relative group">
              <button onClick={() => router.push("/calculator")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline focus:outline-none">
                Calculator
              </button>
              {/* Black Popup (Tooltip) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#202124] text-white text-xs font-medium whitespace-nowrap rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-md">
                Open Calculator
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#202124]"></div>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}