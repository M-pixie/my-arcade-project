"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard";

export default function Footer() {
  const router = useRouter();
  const lastUpdated = "15 AUGUST 2026 14:16 IST";
  
  const [leaderboardCount, setLeaderboardCount] = useState(0);
  const [profilesAnalyzed, setProfilesAnalyzed] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(15);

  useEffect(() => {
    // Fetching Leaderboard & Profile Analyzed Stats
    const unsub = subscribeLeaderboard((data) => {
      setLeaderboardCount(data.length);
      
      const totalAnalyzed = data.reduce((acc: number, user: any) => {
        return acc + (user.calculationCount || 1);
      }, 0);
      setProfilesAnalyzed(totalAnalyzed);
    });

    // Simulated Live Online Users Logic
    setOnlineUsers(Math.floor(Math.random() * 12) + 20);
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const fluctuation = Math.floor(Math.random() * 5) - 2;
        const newVal = prev + fluctuation;
        return newVal < 8 ? 8 : (newVal > 65 ? 65 : newVal);
      });
    }, 12000); 

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="bg-white border-t border-[#e8eaed] pt-14 pb-8 font-sans w-full mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* 1. BRAND & DESCRIPTION & CONNECT (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-6">
            <div className="flex items-center gap-2.5 mb-4">
              <svg className="w-6 h-6 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span className="text-[20px] font-black tracking-tight text-[#202124]">Arcade Nexus</span>
            </div>
            
            <p className="text-[13px] text-[#5f6368] leading-relaxed mb-6 font-medium">
              An independent, community-driven platform designed by <span className="font-bold text-[#202124]">Manish</span> and <span className="font-bold text-[#202124]">Anjali</span>. Built to help Google Cloud Arcade learners effortlessly track progress, analyze achievements, and stay connected.
            </p>

            {/* Connect Moved Here for Better Balance */}
            <div>
              <h3 className="text-[11px] font-black text-[#202124] uppercase tracking-wider mb-3">Connect</h3>
              <div className="flex gap-3">
                <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all" title="WhatsApp Community">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/arcade-nexus/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all" title="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-white hover:bg-[#1a73e8] hover:border-[#1a73e8] transition-all" title="Download Android App">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* 2. NAVIGATION LINKS (Col Span 4) - Combined wrapper for better alignment */}
          <div className="lg:col-span-4 flex justify-between sm:justify-start sm:gap-20 lg:gap-12 pl-0 lg:pl-6">
            
            {/* Platform Links */}
            <div>
              <h3 className="text-[11px] font-black text-[#202124] uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => router.push("/calculator")} className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/dashboard")} className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z" /></svg>
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/leaderboard")} className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Leaderboard
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/resources")} className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    Skill Badges
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-[11px] font-black text-[#202124] uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors inline-flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Enrollment
                  </a>
                </li>
                <li>
                  <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors inline-flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Points System
                  </a>
                </li>
                <li>
                  <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors inline-flex items-center gap-2.5 group">
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6] group-hover:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    Syllabus
                  </a>
                </li>
              </ul>
            </div>
            
          </div>

          {/* 3. METRICS CARDS (Col Span 4) - Sleek & Compact */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              
              {/* Card 1 */}
              <div className="bg-[#f8f9fc] border border-[#e8eaed] rounded-xl p-4 transition-colors hover:border-[#dadce0]">
                <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider mb-1.5">Total Visitors</p>
                <div className="text-[20px] font-black text-[#202124] leading-none">
                  <VisitCounter />
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-[#f8f9fc] border border-[#e8eaed] rounded-xl p-4 transition-colors hover:border-[#dadce0]">
                <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider mb-1.5">Users Enrolled</p>
                <div className="text-[20px] font-black text-[#202124] leading-none">
                  {leaderboardCount.toLocaleString()}
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#f8f9fc] border border-[#e8eaed] rounded-xl p-4 transition-colors hover:border-[#dadce0]">
                <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider mb-1.5">Profiles Analyzed</p>
                <div className="text-[20px] font-black text-[#202124] leading-none">
                  {profilesAnalyzed.toLocaleString()}
                </div>
              </div>

              {/* Card 4 - Clean Live Online */}
              <div className="bg-[#f8f9fc] border border-[#e8eaed] rounded-xl p-4 transition-colors hover:border-[#dadce0]">
                <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
                  Online
                </p>
                <div className="text-[20px] font-black text-[#202124] leading-none">
                  {onlineUsers}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTIONS ================= */}
        
        {/* DISCLAIMER */}
        <div className="py-5 border-t border-[#e8eaed]">
          <p className="text-[12px] text-[#5f6368] text-center sm:text-left font-medium">
            <span className="font-bold text-[#202124]">Disclaimer:</span> This website is an independent, community-built tool and is not an official website of Google. All trademarks belong to their respective owners.
          </p>
        </div>

        {/* COPYRIGHT & CREDITS */}
        <div className="border-t border-[#e8eaed] pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-[12px] font-medium text-[#5f6368]">
            © {new Date().getFullYear()} Arcade Nexus. All rights reserved.
          </div>
          
          <div className="text-[12px] text-[#5f6368] font-medium">
            Last updated: <span className="font-bold text-[#202124]">{lastUpdated}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[12px] text-[#5f6368] font-bold">Developed by</span>
            <div className="flex -space-x-1.5">
              <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" title="Manish" className="hover:z-10 transition-transform hover:scale-110">
                <img 
                  src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" 
                  alt="Manish" 
                  className="w-7 h-7 rounded-full object-cover object-top border-2 border-white ring-1 ring-[#e8eaed] shadow-sm" 
                />
              </a>
              <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" title="Anjali Patel" className="hover:z-10 transition-transform hover:scale-110">
                <img 
                  src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" 
                  alt="Anjali Patel" 
                  className="w-7 h-7 rounded-full object-cover object-top border-2 border-white ring-1 ring-[#e8eaed] shadow-sm" 
                />
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}