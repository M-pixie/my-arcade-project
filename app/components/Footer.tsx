"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard";
// 🔥 Firebase imports for actual Live Online tracking 🔥
import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Footer() {
  const router = useRouter();
  const lastUpdated = "20 AUGUST 2026 13:01 IST";
  
  const [leaderboardCount, setLeaderboardCount] = useState(0);
  const [profilesAnalyzed, setProfilesAnalyzed] = useState(0);
  
  // 🔥 REAL-TIME ONLINE USERS STATE 🔥
  const [onlineUsers, setOnlineUsers] = useState(1);

  // 1. Leaderboard & Stats Logic
  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaderboardCount(data.length);
      
      const totalAnalyzed = data.reduce((acc: number, user: any) => {
        return acc + (user.calculationCount || 1);
      }, 0);
      setProfilesAnalyzed(totalAnalyzed);
    });
    return () => unsub();
  }, []);

  // 2. 🔥 ACTUAL LIVE ONLINE TRACKING LOGIC 🔥
  useEffect(() => {
    if (!db) return;

    // Har user ka ek unique session ID create hoga
    const sessionId = Math.random().toString(36).substring(2, 15);
    const presenceRef = doc(db, 'live_users', sessionId);

    // Database me user ki entry update karne ka function
    const setOnlineStatus = async () => {
      try {
        await setDoc(presenceRef, { lastActive: Date.now() }, { merge: true });
      } catch (error) {
        console.error("Live presence error:", error);
      }
    };

    // Pehli baar status set karo, fir har 30 sec me update karo (Heartbeat)
    setOnlineStatus();
    const heartbeat = setInterval(setOnlineStatus, 30000);

    // Jab tab close ho jaye toh database se entry uda do
    const cleanup = () => {
      deleteDoc(presenceRef).catch(() => {});
    };
    window.addEventListener('beforeunload', cleanup);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', cleanup);
      cleanup(); // Component unmount hone par bhi hatao
    };
  }, []);

  // 3. 🔥 LIVE USERS LISTENER 🔥
  useEffect(() => {
    if (!db) return;

    const liveUsersRef = collection(db, 'live_users');
    const unsub = onSnapshot(liveUsersRef, (snapshot) => {
      const now = Date.now();
      let activeCount = 0;
      
      snapshot.forEach(doc => {
        // Sirf un logo ko gino jo pichle 60 second (60000ms) me active the
        if (now - doc.data().lastActive < 60000) {
          activeCount++;
        }
      });
      
      // Kam se kam 1 count hamesha dikhega (yaani jo khud use kar raha hai)
      setOnlineUsers(Math.max(activeCount, 1));
    });

    return () => unsub();
  }, []);

  return (
    <footer className="w-full mt-10">
      
      {/* ================= DARK THEME FOOTER ================= */}
      <div className="bg-gradient-to-b from-[#1c0c28] to-[#2a1340] pt-16 pb-10 font-sans w-full relative z-10 border-t border-white/5 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* ================= MAIN CONTENT GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
            
            {/* 1. BRAND & DESCRIPTION & CONNECT (Col Span 4) */}
            <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-6">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-8 h-8 text-[#ec4899]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="text-[26px] font-black tracking-tight text-white">Arcade Nexus</span>
              </div>
              
              <p className="text-[15px] text-gray-300 leading-relaxed mb-8 font-medium">
                An independent, community-driven platform designed by <span className="font-bold text-white">Manish</span> and <span className="font-bold text-white">Anjali</span>. Built to help Google Cloud Arcade learners effortlessly track progress, analyze achievements, and stay connected.
              </p>

              {/* Connect Section */}
              <div>
                <h3 className="text-[13px] font-black text-gray-200 uppercase tracking-widest mb-5">Connect</h3>
                <div className="flex gap-4">
                  <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all shadow-md" title="WhatsApp Community">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/arcade-nexus/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all shadow-md" title="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#ec4899] hover:border-[#ec4899] transition-all shadow-md" title="Download Android App">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. NAVIGATION LINKS (Col Span 4) */}
            <div className="lg:col-span-4 flex justify-between sm:justify-start sm:gap-20 lg:gap-16 pl-0 lg:pl-6 mt-8 lg:mt-0">
              
              {/* Platform Links */}
              <div>
                <h3 className="text-[13px] font-black text-gray-200 uppercase tracking-widest mb-6">Platform</h3>
                <ul className="space-y-5">
                  <li>
                    <button onClick={() => router.push("/calculator")} className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors text-left flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Calculator
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/dashboard")} className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors text-left flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z" /></svg>
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/leaderboard")} className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors text-left flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      Leaderboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/resources")} className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors text-left flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      Skill Badges
                    </button>
                  </li>
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="text-[13px] font-black text-gray-200 uppercase tracking-widest mb-6">Resources</h3>
                <ul className="space-y-5">
                  <li>
                    <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors inline-flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      Enrollment
                    </a>
                  </li>
                  <li>
                    <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors inline-flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Points System
                    </a>
                  </li>
                  <li>
                    <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium text-gray-300 hover:text-pink-400 transition-colors inline-flex items-center gap-3 group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      Syllabus
                    </a>
                  </li>
                </ul>
              </div>
              
            </div>

            {/* 3. METRICS CARDS (Col Span 4) */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                
                {/* Card 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-sm shadow-lg">
                  <p className="text-[11px] sm:text-[12px] font-bold text-gray-300 uppercase tracking-widest mb-2.5">Total Visitors</p>
                  <div className="text-[26px] sm:text-[30px] font-black text-white leading-none">
                    <VisitCounter />
                  </div>
                </div>
                
                {/* Card 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-sm shadow-lg">
                  <p className="text-[11px] sm:text-[12px] font-bold text-gray-300 uppercase tracking-widest mb-2.5">Users Enrolled</p>
                  <div className="text-[26px] sm:text-[30px] font-black text-white leading-none">
                    {leaderboardCount.toLocaleString()}
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-sm shadow-lg">
                  <p className="text-[11px] sm:text-[12px] font-bold text-gray-300 uppercase tracking-widest mb-2.5">Profiles Analyzed</p>
                  <div className="text-[26px] sm:text-[30px] font-black text-white leading-none">
                    {profilesAnalyzed.toLocaleString()}
                  </div>
                </div>

                {/* Card 4 - 🔥 Real-time Live Online 🔥 */}
                <div className="bg-[#1c0f1c] border border-pink-500/30 rounded-2xl p-5 sm:p-6 transition-all hover:border-pink-500/50 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(236,72,153,0.05)]">
                  <p className="text-[11px] sm:text-[12px] font-bold text-pink-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                    Online
                  </p>
                  <div className="text-[26px] sm:text-[30px] font-black text-white leading-none">
                    {onlineUsers}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTIONS ================= */}
          
          {/* DISCLAIMER */}
          <div className="py-8 border-t border-white/10 mt-8">
            <p className="text-[13px] text-gray-400 text-center sm:text-left font-medium leading-relaxed max-w-4xl">
              <span className="font-bold text-gray-300">Disclaimer:</span> This website is an independent, community-built tool and is not an official website of Google. All trademarks belong to their respective owners.
            </p>
          </div>

          {/* COPYRIGHT & CREDITS */}
          <div className="border-t border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-[13px] font-medium text-gray-400">
              © {new Date().getFullYear()} Arcade Nexus. All rights reserved.
            </div>
            
            <div className="text-[13px] text-gray-400 font-medium bg-white/5 px-5 py-2 rounded-full border border-white/5">
              Last updated: <span className="font-bold text-gray-200">{lastUpdated}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">Developed by</span>
              <div className="flex -space-x-2.5">
                <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" title="Manish" className="hover:z-10 transition-transform hover:scale-110">
                  <img 
                    src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" 
                    alt="Manish" 
                    className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#1c0c28] ring-1 ring-white/20 shadow-lg" 
                  />
                </a>
                <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" title="Anjali Patel" className="hover:z-10 transition-transform hover:scale-110">
                  <img 
                    src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" 
                    alt="Anjali Patel" 
                    className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#1c0c28] ring-1 ring-white/20 shadow-lg" 
                  />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}