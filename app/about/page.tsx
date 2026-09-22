"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('features');

  // Tab 1: Features Data
  const featuresList = [
    { title: "Arcade Calculator", desc: "Real-time Google Cloud points calculation.", link: "/calculator", icon: "🔢", badge: "Pts" },
    { title: "Live Leaderboard", desc: "Track community rankings and top performers.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "User Dashboard", desc: "Manage your tier progression and stats.", link: "/dashboard", icon: "📊", badge: "Go" },
    { title: "Facilitator Program", desc: "Latest news & program announcements.", link: "/facilitator", icon: "📢", badge: "New" },
    { title: "Skill Badges", desc: "Curated active badges to complete.", link: "/resources", icon: "🏅", badge: "94+" },
    { title: "Smart Chatbot", desc: "24/7 AI automated help for your queries.", link: "/chat", icon: "🤖", badge: "AI" }
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
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans pt-28 pb-20 selection:bg-[#e8f0fe] selection:text-[#1a73e8]">
      
      <main className="px-5 sm:px-8 lg:px-12 max-w-[1200px] mx-auto space-y-10">
        
        {/* ================= HERO SECTION (Classic Minimal) ================= */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-[#202124] tracking-tight mb-4">
            About Arcade Nexus
          </h1>
          <p className="text-[16px] text-[#5f6368] leading-relaxed">
            An independent, community-driven platform crafted by <strong className="text-[#202124] font-medium">Manish & Anjali</strong>. 
            Designed to bring clarity, organization, and practical tools to your Google Cloud Arcade learning journey.
          </p>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* INTERACTIVE TABBED BOX (Classic Material Style) */}
            <div className="bg-white rounded-xl border border-[#dadce0] overflow-hidden">
              
              {/* Tab Headers */}
              <div className="flex px-2 border-b border-[#dadce0] bg-white">
                <button 
                  onClick={() => setActiveTab('features')}
                  className={`px-6 py-4 text-[14px] font-medium transition-colors relative ${activeTab === 'features' ? 'text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                >
                  Platform Features
                  {activeTab === 'features' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1a73e8] rounded-t-md"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('official')}
                  className={`px-6 py-4 text-[14px] font-medium transition-colors relative ${activeTab === 'official' ? 'text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                >
                  Official Links
                  {activeTab === 'official' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1a73e8] rounded-t-md"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('community')}
                  className={`px-6 py-4 text-[14px] font-medium transition-colors relative ${activeTab === 'community' ? 'text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                >
                  Community
                  {activeTab === 'community' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1a73e8] rounded-t-md"></div>}
                </button>
              </div>
              
              {/* Tab Content Area */}
              <div className="h-[400px] overflow-y-auto custom-scrollbar bg-white">
                
                {/* 1. Features Content */}
                {activeTab === 'features' && (
                  <div className="divide-y divide-[#f1f3f4]">
                    {featuresList.map((item, index) => (
                      <Link 
                        href={item.link} 
                        key={index} 
                        className="flex p-5 hover:bg-[#f8f9fa] transition-colors w-full items-start group"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dadce0] bg-white text-lg mr-4 shadow-sm group-hover:border-[#1a73e8] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#202124] font-medium text-[15px] group-hover:text-[#1a73e8] transition-colors flex items-center gap-2">
                            {item.title}
                            <span className="bg-[#e8f0fe] text-[#1a73e8] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              {item.badge}
                            </span>
                          </h3>
                          <p className="text-[#5f6368] text-[13px] mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* 2. Official Links Content */}
                {activeTab === 'official' && (
                  <div className="divide-y divide-[#f1f3f4] animate-fade-in">
                    {officialLinks.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-5 hover:bg-[#f8f9fa] transition-colors w-full items-start group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dadce0] bg-white text-lg mr-4 shadow-sm group-hover:border-[#1a73e8] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#202124] font-medium text-[15px] group-hover:text-[#1a73e8] transition-colors flex items-center gap-2">
                            {item.title}
                            <svg className="w-3.5 h-3.5 text-[#9aa0a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </h3>
                          <p className="text-[#5f6368] text-[13px] mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* 3. Community Content */}
                {activeTab === 'community' && (
                  <div className="divide-y divide-[#f1f3f4] animate-fade-in">
                    {communityLinks.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-5 hover:bg-[#f8f9fa] transition-colors w-full items-start group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dadce0] bg-white text-lg mr-4 shadow-sm group-hover:border-[#1a73e8] transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#202124] font-medium text-[15px] group-hover:text-[#1a73e8] transition-colors flex items-center gap-2">
                            {item.title}
                            <span className="bg-[#e6f4ea] text-[#137333] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              {item.badge}
                            </span>
                          </h3>
                          <p className="text-[#5f6368] text-[13px] mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* HIGHLIGHTS & WHY PLAY - Classic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* KEY HIGHLIGHTS */}
              <div className="bg-white rounded-xl p-6 border border-[#dadce0]">
                <h3 className="text-[#202124] font-medium text-[15px] mb-4 pb-3 border-b border-[#f1f3f4]">
                  Key Highlights
                </h3>
                <ul className="space-y-3 text-[13px] text-[#5f6368]">
                  {["Automated Points Calculation", "Real-time Leaderboard", "AI Chatbot Assistant", "93+ Skill Badges Support", "Milestone & Tier Tracking", "Community Posts & Reviews", "PWA Ready & SEO Optimized"].map((text, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <svg className="w-4 h-4 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* WHY PLAY */}
              <div className="bg-white rounded-xl p-6 border border-[#dadce0]">
                <h3 className="text-[#202124] font-medium text-[15px] mb-4 pb-3 border-b border-[#f1f3f4]">
                  Why Play The Arcade?
                </h3>
                <ul className="space-y-4 text-[13px] text-[#5f6368]">
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 text-lg">🎮</span> 
                    <span><strong className="text-[#202124] font-medium block">Learn Cloud Concepts</strong> Free, hands-on learning environment.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 text-lg">💸</span> 
                    <span><strong className="text-[#202124] font-medium block">100% No Cost</strong> Zero charges for participation or labs.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="mt-0.5 text-lg">🎁</span> 
                    <span><strong className="text-[#202124] font-medium block">Earn Swags</strong> Convert your completed points to official Google Cloud prizes.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* ================= RIGHT COLUMN (HELP & LEGAL) ================= */}
          <div className="lg:col-span-4 space-y-6">

            {/* CLASSIC FOUNDERS BOX */}
            <div className="bg-white rounded-xl border border-[#dadce0] p-6">
              <h3 className="text-[12px] font-bold text-[#5f6368] uppercase tracking-wider mb-6 text-center">Platform Creators</h3>
              
              <div className="space-y-6">
                {/* Manish */}
                <div className="flex items-center gap-4">
                  <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <img src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" alt="Manish" className="w-14 h-14 rounded-full object-cover border border-[#dadce0]" />
                  </a>
                  <div>
                    <h4 className="text-[14px] font-medium text-[#202124]">Manish Kr.</h4>
                    <p className="text-[12px] text-[#5f6368]">Founder & Developer</p>
                  </div>
                </div>

                {/* Anjali */}
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <img src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" alt="Anjali" className="w-14 h-14 rounded-full object-cover border border-[#dadce0]" />
                  </a>
                  <div>
                    <h4 className="text-[14px] font-medium text-[#202124]">Anjali Patel</h4>
                    <p className="text-[12px] text-[#5f6368]">Co-Founder & Contributor</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* HELP CENTER BOX */}
            <div className="bg-white rounded-xl border border-[#dadce0] p-6">
              <h3 className="text-[#202124] font-medium text-[15px] mb-1">Help Center</h3>
              <p className="text-[13px] text-[#5f6368] mb-5">Have an issue? Reach out to us directly.</p>
              
              <div className="space-y-3">
                 <a href="mailto:vy7manish@gmail.com" className="flex items-center justify-between p-3 rounded-lg border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors group">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#5f6368] group-hover:text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      <span className="text-[13px] font-medium text-[#202124]">Email Support</span>
                    </div>
                    <svg className="w-4 h-4 text-[#9aa0a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </a>
                 <a href="https://wa.me/918538980608" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors group">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#5f6368] group-hover:text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                      <span className="text-[13px] font-medium text-[#202124]">WhatsApp Admin</span>
                    </div>
                    <svg className="w-4 h-4 text-[#9aa0a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                 </a>
              </div>
            </div>

            {/* LEGAL POLICIES BOX */}
            <div className="bg-white rounded-xl border border-[#dadce0] p-6">
               <h3 className="text-[#202124] font-medium text-[15px] mb-4 pb-3 border-b border-[#f1f3f4]">Platform Policies</h3>
               
               <div className="space-y-4">
                 <div>
                   <h4 className="text-[13px] font-bold text-[#202124] mb-1">Privacy Policy</h4>
                   <p className="text-[12px] text-[#5f6368] leading-relaxed">No personal data is stored. No tracking cookies are utilized. Your progression data remains secure locally.</p>
                 </div>
                 <div>
                   <h4 className="text-[13px] font-bold text-[#202124] mb-1">Terms & Conditions</h4>
                   <p className="text-[12px] text-[#5f6368] leading-relaxed">Provided "as is" to aid the community. Users must comply with official Google Cloud guidelines.</p>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* ================= EXACT DISCLAIMER & COPYRIGHT ================= */}
        <div className="mt-12 pt-8 border-t border-[#dadce0] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-3xl">
            <h3 className="text-[#202124] font-bold text-[12px] mb-2 uppercase tracking-wider">Legal Disclaimer</h3>
            <p className="text-[12px] text-[#5f6368] leading-relaxed text-justify">
              Arcade Nexus is an independent, community-built platform created for educational and informational purposes only. This website is not affiliated with, endorsed by, or officially connected to Google Cloud Arcade, Google LLC, or Alphabet Inc. Our goal is simply to help Arcade community members by providing useful resources, guides, and tools to enhance their learning experience. All trademarks, logos, and brand names belong to their respective owners.
            </p>
          </div>
          
          <div className="shrink-0 text-right">
            <div className="text-[#202124] text-[13px] font-medium mb-1">
              © 2026 Arcade Nexus.
            </div>
            <div className="text-[12px] text-[#5f6368]">
              Do not copy.<br/>Educational use only.
            </div>
          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bdc1c6; }
        .animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}