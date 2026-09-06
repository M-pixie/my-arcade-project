"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard";
// 🔥 Firebase imports for actual Live Online tracking 🔥
import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Star, Calculator, LayoutGrid, BarChart3, BadgeCheck, UserPlus,
  CircleDollarSign, BookOpen, MessageCircle, Linkedin, Download,
  Eye, UserRoundPlus, ChartNoAxesCombined, Radio, ShieldCheck, Clock3, Heart,
} from "lucide-react";

export default function Footer() {
  const router = useRouter();
  const lastUpdated = "03 SEPTEMBER 2026 10:31 IST";
  
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
    <footer className="w-full">
      {/* ================= PREMIUM COSMIC FOOTER UI ================= */}
      <div className="relative w-full overflow-hidden border-t border-white/10 bg-[#0f172a] font-sans text-white">

        {/* Ambient cosmic background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-600/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_20%_30%,white_0.7px,transparent_0.8px),radial-gradient(circle_at_70%_20%,white_0.6px,transparent_0.7px),radial-gradient(circle_at_85%_75%,white_0.7px,transparent_0.8px),radial-gradient(circle_at_35%_85%,white_0.5px,transparent_0.6px)] [background-size:170px_170px,230px_230px,190px_190px,260px_260px]" />
        </div>

        <div className="relative mx-auto max-w-[1480px] px-5 py-12 sm:px-8 lg:px-10 lg:py-14">

          {/* ================= MAIN HORIZONTAL PANEL ================= */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">

            {/* subtle glow lines */}
            <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full border border-blue-400/10 blur-[1px]" />
            <div className="pointer-events-none absolute -left-12 top-16 h-36 w-36 rounded-full border border-indigo-400/10" />
            <div className="pointer-events-none absolute right-10 top-0 h-px w-64 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            <div className="grid grid-cols-1 gap-0 xl:grid-cols-[1.05fr_0.9fr_1.45fr]">

              {/* ================= BRAND ================= */}
              <div className="relative p-7 sm:p-9 lg:p-10">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/[0.06] shadow-[0_0_35px_rgba(59,130,246,0.18)]">
                    <div className="absolute inset-1 rounded-full border border-blue-300/20" />
                    <div className="absolute -inset-2 rounded-full border border-white/[0.04]" />
                    <svg className="relative h-7 w-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-300/80">Community Platform</p>
                    <h2 className="mt-1 text-[25px] font-extrabold tracking-tight text-white sm:text-[28px]">
                      Arcade Nexus
                    </h2>
                  </div>
                </div>

                <p className="mt-7 max-w-[430px] text-[14px] font-medium leading-7 text-slate-300/90 sm:text-[15px]">
                  An independent, community-driven platform designed by <span className="font-bold text-white">Manish</span> and <span className="font-bold text-white">Anjali</span>. Built to help Google Cloud Arcade learners effortlessly track progress, analyze achievements, and stay connected.
                </p>

                {/* Connect */}
                <div className="mt-7">
                  <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Connect</h3>
                  <div className="flex gap-2.5">
                    <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300" title="WhatsApp Community">
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/arcade-nexus/" target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-300" title="LinkedIn">
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-indigo-300" title="Download Android App">
                      <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* ================= NAVIGATION ================= */}
              <div className="grid grid-cols-2 gap-8 border-y border-white/[0.07] p-7 sm:p-9 lg:border-y-0 lg:border-x lg:p-10">
                <div>
                  <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Platform</h3>
                  <ul className="space-y-4">
                    <li>
                      <button onClick={() => router.push("/calculator")} className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Calculator
                      </button>
                    </li>
                    <li>
                      <button onClick={() => router.push("/dashboard")} className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z" /></svg>
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button onClick={() => router.push("/leaderboard")} className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Leaderboard
                      </button>
                    </li>
                    <li>
                      <button onClick={() => router.push("/resources")} className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        Skill Badges
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Resources</h3>
                  <ul className="space-y-4">
                    <li>
                      <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        Enrollment
                      </a>
                    </li>
                    <li>
                      <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Points System
                      </a>
                    </li>
                    <li>
                      <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[14px] font-medium text-slate-300 transition-all hover:translate-x-1 hover:text-white">
                        <svg className="h-[18px] w-[18px] text-slate-500 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Syllabus
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ================= METRICS ================= */}
              <div className="p-6 sm:p-8 lg:p-9">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                  <div className="group relative overflow-hidden rounded-2xl border border-blue-400/25 bg-gradient-to-br from-blue-500/[0.10] to-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/45 hover:shadow-[0_12px_35px_rgba(59,130,246,0.12)] sm:p-5">
                    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08] text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.10)]">
                        <Eye className="h-[19px] w-[19px]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Total Visitors</p>
                      <div className="mt-1 text-[25px] font-black tracking-tight text-white sm:text-[29px]"><VisitCounter /></div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-500/[0.08] to-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/45 hover:shadow-[0_12px_35px_rgba(56,189,248,0.10)] sm:p-5">
                    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sky-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.08] text-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.10)]">
                        <UserRoundPlus className="h-[19px] w-[19px]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Users Enrolled</p>
                      <div className="mt-1 text-[25px] font-black tracking-tight text-white sm:text-[29px]">{leaderboardCount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/[0.08] to-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/45 hover:shadow-[0_12px_35px_rgba(99,102,241,0.10)] sm:p-5">
                    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl" />
                    <div className="relative">
                      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/[0.08] text-indigo-300 shadow-[0_0_18px_rgba(99,102,241,0.10)]">
                        <ChartNoAxesCombined className="h-[19px] w-[19px]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Profiles Analyzed</p>
                      <div className="mt-1 text-[25px] font-black tracking-tight text-white sm:text-[29px]">{profilesAnalyzed.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/35 bg-gradient-to-br from-cyan-500/[0.12] to-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_12px_35px_rgba(6,182,212,0.15)] sm:p-5">
                    <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-500/15 blur-2xl" />
                    <div className="relative">
                      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                        <Radio className="h-[18px] w-[18px] animate-pulse" strokeWidth={1.8} />
                      </div>
                      <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-cyan-300">
                        Live Online
                      </p>
                      <div className="mt-1 text-[25px] font-black tracking-tight text-white sm:text-[29px]">{onlineUsers}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DISCLAIMER ================= */}
            <div className="border-t border-white/[0.07] px-7 py-5 sm:px-9 lg:px-10">
              <p className="text-[11px] font-medium leading-6 text-slate-500 sm:text-[12px]">
                <span className="font-bold text-slate-300">Disclaimer: </span> Arcade Nexus is an independent, community-driven platform for Google Cloud Arcade learners and is not affiliated with or endorsed by Google. All trademarks belong to their respective owners.
              </p>
            </div>

            {/* ================= BOTTOM BAR ================= */}
            <div className="flex flex-col gap-5 border-t border-white/[0.07] px-7 py-5 sm:px-9 md:flex-row md:items-center md:justify-between lg:px-10">
              <div className="text-[11px] font-medium text-slate-500 sm:text-[12px]">
                © {new Date().getFullYear()} Arcade Nexus. All rights reserved.
              </div>

              <div className="order-first rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-medium text-slate-500 md:order-none sm:text-[11px]">
                Last updated: <span className="font-bold text-slate-300">{lastUpdated}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Developed by</span>
                <div className="flex -space-x-2">
                  <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" title="Manish" className="relative transition-transform duration-300 hover:z-10 hover:scale-110">
                    <img
                      src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg"
                      alt="Manish"
                      className="h-9 w-9 rounded-full object-cover object-top border-2 border-[#0f172a] ring-1 ring-white/15 shadow-lg sm:h-10 sm:w-10"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" title="Anjali Patel" className="relative transition-transform duration-300 hover:z-10 hover:scale-110">
                    <img
                      src="https://i.postimg.cc/Nf2ykWb1/1000111442.png"
                      alt="Anjali Patel"
                      className="h-9 w-9 rounded-full object-cover object-top border-2 border-[#0f172a] ring-1 ring-white/15 shadow-lg sm:h-10 sm:w-10"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}