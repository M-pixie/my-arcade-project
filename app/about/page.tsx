"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  // Tab state manage karne ke liye
  const [activeTab, setActiveTab] = useState('features');

  // Tab 1: Features Data
  const featuresList = [
    { title: "Arcade Calculator", desc: "Real-time Google Cloud points calculation.", link: "/calculator", icon: "🔢", badge: "Pts" },
    { title: "Live Leaderboard", desc: "Track community rankings and top performers.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "User Dashboard", desc: "Manage your tier progression and stats.", link: "/dashboard", icon: "📊", badge: "Go" },
    { title: "Facilitator Program", desc: "Latest news & program announcements.", link: "/facilitator", icon: "📢", badge: "New" },
    { title: "Skill Badges", desc: "Curated active badges to complete.", link: "/resources", icon: "🏅", badge: "94+" },
    { title: "Smart Chatbot", desc: "24/7 AI automated help for your queries.", link: "/ChatBot", icon: "🤖", badge: "AI" }
  ];

  // Tab 2: Official Links Data
  const officialLinks = [
    { title: "The Arcade Official Platform", desc: "Hub for monthly games, trivia, and prize updates.", link: "https://go.cloudskillsboost.google/arcade", icon: "🌐", badge: "Web" },
    { title: "Cloud Skills Boost", desc: "Main portal holding all technical labs and badges.", link: "https://www.cloudskillsboost.google/", icon: "📚", badge: "Labs" },
    { title: "Official Learning Forum", desc: "Connect with learners, facilitators, and get support.", link: "https://www.googlecloudcommunity.com/", icon: "💬", badge: "Forum" }
  ];

  // Tab 3: Community Data
  const communityLinks = [
    { title: "Arcade Nexus Community 1", desc: "Join our primary WhatsApp discussion group.", link: "https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY", icon: "🟢", badge: "WA 1" },
    { title: "Arcade Nexus Community 2", desc: "Join our secondary WhatsApp discussion group.", link: "https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj", icon: "🟢", badge: "WA 2" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#202124] font-sans pt-32 pb-16 selection:bg-[#c0262c] selection:text-white">
      
      <main className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-8">
        
        {/* ================= HERO SECTION ================= */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#c0262c] mb-3">
            About Arcade Nexus
          </h1>
          <p className="text-[15px] text-[#5f6368] leading-relaxed">
            The ultimate independent community toolkit built by <strong>Manish & Anjali</strong>. 
            Join an always-on, no-cost gaming campaign to learn cloud computing and earn official Google Cloud swags.
          </p>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ================= LEFT COLUMN (TABS & LISTS) ================= */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* INTERACTIVE TABBED BOX (Light Black Border) */}
            <div className="bg-white rounded-lg shadow-sm border border-[#707070] overflow-hidden flex flex-col">
              {/* Tab Headers */}
              <div className="flex border-b border-[#707070]">
                <button 
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-3.5 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 ${activeTab === 'features' ? 'bg-[#c0262c] text-white' : 'bg-gray-50 text-[#5f6368] hover:bg-gray-100 hover:text-[#c0262c]'}`}
                >
                  Platform Features
                </button>
                <button 
                  onClick={() => setActiveTab('official')}
                  className={`flex-1 py-3.5 text-center font-bold text-[14px] sm:text-[15px] border-l border-[#707070] transition-colors duration-200 ${activeTab === 'official' ? 'bg-[#c0262c] text-white' : 'bg-gray-50 text-[#5f6368] hover:bg-gray-100 hover:text-[#c0262c]'}`}
                >
                  Official Links
                </button>
                <button 
                  onClick={() => setActiveTab('community')}
                  className={`flex-1 py-3.5 text-center font-bold text-[14px] sm:text-[15px] border-l border-[#707070] transition-colors duration-200 ${activeTab === 'community' ? 'bg-[#c0262c] text-white' : 'bg-gray-50 text-[#5f6368] hover:bg-gray-100 hover:text-[#c0262c]'}`}
                >
                  Community
                </button>
              </div>
              
              {/* Tab Content Area */}
              <div className="h-[380px] overflow-y-auto custom-scrollbar">
                
                {/* 1. Features Content */}
                {activeTab === 'features' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    {featuresList.map((item, index) => (
                      <Link 
                        href={item.title === "Smart Chatbot" ? "#" : item.link} 
                        key={index} 
                        onClick={(e) => {
                          if (item.title === "Smart Chatbot") {
                            e.preventDefault();
                            alert("Go to Bottom Right Corner Any Help ? Button");
                          }
                        }}
                        className="flex p-4 hover:bg-[#fef2f2] group transition-colors duration-200 w-full"
                      >
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e0e0e0] pr-4 mr-4">
                          <span className="text-[22px] mb-2 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                          <span className="bg-[#c0262c] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#202124] font-bold text-[16px] group-hover:text-[#c0262c] transition-colors">
                            {item.title}
                          </h3>
                          <div className="text-[#5f6368] text-[14px] mt-1 flex items-center gap-2">
                            <span className="text-[#c0262c] font-bold text-[12px]">🔗</span> {item.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* 2. Official Links Content */}
                {activeTab === 'official' && (
                  <div className="divide-y divide-[#e0e0e0] animate-fade-in">
                    {officialLinks.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-4 hover:bg-[#fef2f2] group transition-colors duration-200 w-full">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e0e0e0] pr-4 mr-4">
                          <span className="text-[22px] mb-2 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                          <span className="bg-[#202124] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#202124] font-bold text-[16px] group-hover:text-[#c0262c] transition-colors">
                            {item.title} ↗
                          </h3>
                          <div className="text-[#5f6368] text-[14px] mt-1">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* 3. Community Content */}
                {activeTab === 'community' && (
                  <div className="divide-y divide-[#e0e0e0] animate-fade-in">
                    {communityLinks.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-4 hover:bg-[#e6f4ea] group transition-colors duration-200 w-full">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e0e0e0] pr-4 mr-4">
                          <span className="text-[22px] mb-2 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                          <span className="bg-[#34a853] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#202124] font-bold text-[16px] group-hover:text-[#34a853] transition-colors">
                            {item.title} ↗
                          </h3>
                          <div className="text-[#5f6368] text-[14px] mt-1">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* WHY PLAY SECTION (Light Black Border all around) */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#707070] mt-20">
              <h3 className="text-[#c0262c] font-bold text-[16px] border-b border-[#e0e0e0] pb-3 mb-4">Why Play The Arcade?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ul className="space-y-3 text-[14px] text-[#5f6368]">
                  <li className="flex gap-2 items-center"><strong className="text-[18px]">🎮</strong> <span>Learn cloud concepts freely.</span></li>
                  <li className="flex gap-2 items-center"><strong className="text-[18px]">💸</strong> <span>100% No Cost participation.</span></li>
                </ul>
                <ul className="space-y-3 text-[14px] text-[#5f6368]">
                  <li className="flex gap-2 items-center"><strong className="text-[18px]">🛠️</strong> <span>Hands-on practice in real labs.</span></li>
                  <li className="flex gap-2 items-center"><strong className="text-[18px]">🎁</strong> <span>Convert points to swags.</span></li>
                </ul>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (HELP & LEGAL) ================= */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* HELP CENTER BOX (Light Black Border all around) */}
            <div className="bg-white rounded-lg shadow-sm border border-[#707070] overflow-hidden flex flex-col">
              <div className="bg-[#fef8eb] p-6 flex flex-col items-center justify-center relative border-b border-[#e0e0e0]">
                 <div className="bg-white rounded-full px-6 py-2 text-[14px] font-bold text-[#c0262c] mb-3 shadow-sm border border-[#e0e0e0]">
                    Help center
                 </div>
                 <div className="text-[12px] text-[#5f6368] mb-2 text-center">Can I help you?</div>
                 <div className="text-5xl drop-shadow-sm">👨‍💻</div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                 <div>
                    <p className="text-[11px] text-[#5f6368] uppercase font-bold mb-1 tracking-wider">Email Queries:</p>
                    <a href="mailto:vy7manish@gmail.com" className="text-[#c0262c] font-bold text-[16px] hover:underline flex items-center gap-2">
                      Send to Gmail
                    </a>
                 </div>
                 <div>
                    <p className="text-[11px] text-[#5f6368] uppercase font-bold mb-1 tracking-wider">WhatsApp Support:</p>
                    <a href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" target="_blank" rel="noopener noreferrer" className="text-[#34a853] font-bold text-[16px] hover:underline flex items-center gap-2">
                       Contact Website Owner
                    </a>
                 </div>
              </div>
            </div>

            {/* PRIVACY POLICY (Light Black Border all around) */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-[#707070] hover:shadow-md transition-shadow cursor-pointer flex gap-4 items-start group">
               <div className="text-4xl grayscale group-hover:grayscale-0 transition-all mt-1">🔒</div>
               <div>
                 <h3 className="text-[#202124] font-bold text-[15px] group-hover:text-[#c0262c] transition-colors mb-2">Privacy Policy</h3>
                 <p className="text-[12px] text-[#5f6368] leading-snug mb-1">We do not store personal data. Standard log files are used.</p>
                 <p className="text-[12px] text-[#5f6368] leading-snug mb-1">• No tracking cookies or pixels are utilized.</p>
                 <p className="text-[12px] text-[#5f6368] leading-snug">• Your progression data remains secure locally.</p>
               </div>
            </div>

            {/* TERMS & CONDITIONS (Light Black Border all around) */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-[#707070] hover:shadow-md transition-shadow cursor-pointer flex gap-4 items-start group">
               <div className="text-4xl grayscale group-hover:grayscale-0 transition-all mt-1">📝</div>
               <div>
                 <h3 className="text-[#202124] font-bold text-[15px] group-hover:text-[#c0262c] transition-colors mb-2">Terms & Conditions</h3>
                 <p className="text-[12px] text-[#5f6368] leading-snug mb-1">Provided "as is" to help the community. Final authority lies with Google.</p>
                 <p className="text-[12px] text-[#5f6368] leading-snug mb-1">• Unofficial toolkits carry no official warranties.</p>
                 <p className="text-[12px] text-[#5f6368] leading-snug">• Users must comply with Google Cloud guidelines at all times.</p>
               </div>
            </div>

          </div>
        </div>

        {/* ================= EXACT DISCLAIMER & COPYRIGHT ================= */}
        <div className="mt-12 pt-8 border-t border-[#d0d0d0] flex flex-col gap-6">
          <div className="bg-white border border-[#707070] rounded-lg p-6">
            <h3 className="text-[#c0262c] font-bold text-[15px] mb-3 uppercase tracking-wide">Legal Disclaimer</h3>
            
            {/* HIGHLIGHTER EFFECT ON BOLD TEXT */}
            <p className="text-[14px] font-bold text-[#111] leading-relaxed text-justify bg-[#fff59d] p-4 rounded-sm border border-[#fbc02d] shadow-sm">
              Arcade Nexus is an independent, community-built platform created for educational and informational purposes only. This website is not affiliated with, endorsed by, or officially connected to Google Cloud Arcade, Google LLC, or Alphabet Inc. Our goal is simply to help Arcade community members by providing useful resources, guides, and tools to enhance their learning experience. All trademarks, logos, and brand names belong to their respective owners and are used only for reference and educational purposes.
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <div className="bg-[#202124] text-white px-6 py-3 rounded-md text-[14px] font-bold tracking-wide shadow-sm">
              © Copyright Arcade Nexus 2026. <span className="text-red-400">Do not copy.</span>
            </div>
          </div>
        </div>

      </main>

      {/* Basic CSS for scrollbar and tab animations */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c0262c; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a02024; 
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}