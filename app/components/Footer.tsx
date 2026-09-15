"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard";
import { doc, setDoc, deleteDoc, collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Calculator, LayoutGrid, BarChart3, BadgeCheck, UserPlus,
  CircleDollarSign, BookOpen, Eye, UserRoundPlus, ChartNoAxesCombined, Radio
} from "lucide-react";

const avatarPositions = [
  { left: "10%", duration: "6s", delay: "0s" },
  { left: "25%", duration: "5s", delay: "2s" },
  { left: "45%", duration: "7s", delay: "1s" },
  { left: "60%", duration: "6.5s", delay: "3.5s" },
  { left: "80%", duration: "5.5s", delay: "0.5s" },
  { left: "15%", duration: "6s", delay: "4s" },
  { left: "35%", duration: "7s", delay: "2.5s" },
  { left: "55%", duration: "5s", delay: "0.8s" },
  { left: "75%", duration: "6.5s", delay: "3s" },
  { left: "85%", duration: "5.5s", delay: "1.5s" },
];

export default function Footer() {
  const router = useRouter();
  const lastUpdated = "15 SEPTEMBER 2026 23:10 IST";
  
  const [leaderboardCount, setLeaderboardCount] = useState(0);
  const [profilesAnalyzed, setProfilesAnalyzed] = useState(0);
  const [leaderboardAvatars, setLeaderboardAvatars] = useState<string[]>([]);
  const [avatarStartIndex, setAvatarStartIndex] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaderboardCount(data.length);
      const totalAnalyzed = data.reduce((acc: number, user: any) => acc + (user.calculationCount || 1), 0);
      setProfilesAnalyzed(totalAnalyzed);
      const avatars = data.map((u: any) => u.photoURL || "https://i.postimg.cc/Nf2ykWb1/1000111442.png");
      setLeaderboardAvatars(avatars);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (leaderboardAvatars.length === 0) return;
    const interval = setInterval(() => {
      setAvatarStartIndex((prevIndex) => (prevIndex + 10) % leaderboardAvatars.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [leaderboardAvatars.length]);

  useEffect(() => {
    if (!db) return;
    const sessionId = Math.random().toString(36).substring(2, 15);
    const presenceRef = doc(db, 'live_users', sessionId);

    const setOnlineStatus = async () => {
      try {
        await setDoc(presenceRef, { lastActive: Date.now() }, { merge: true });
      } catch (error) {
        console.error("Live presence error:", error);
      }
    };

    setOnlineStatus();
    const heartbeat = setInterval(setOnlineStatus, 30000);

    const cleanup = () => {
      deleteDoc(presenceRef).catch(() => {});
    };
    window.addEventListener('beforeunload', cleanup);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', cleanup);
      cleanup(); 
    };
  }, []);

  useEffect(() => {
    if (!db) return;
    const liveUsersRef = collection(db, 'live_users');
    const unsub = onSnapshot(liveUsersRef, (snapshot) => {
      const now = Date.now();
      let activeCount = 0;
      snapshot.forEach(doc => {
        if (now - doc.data().lastActive < 60000) activeCount++;
      });
      setOnlineUsers(Math.max(activeCount, 1));
    });
    return () => unsub();
  }, []);

  // Footer से Firebase में फीडबैक भेजने का फंक्शन
  const handleFeedback = async (score: number) => {
    try {
      if (db) {
        await addDoc(collection(db, "platform_feedback"), {
          rating: score,
          source: "footer", 
          timestamp: Date.now(),
          date: new Date().toLocaleDateString('en-IN')
        });
      }
    } catch (error) {
      console.error("Error saving footer feedback:", error);
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 bg-white font-sans text-slate-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <style>{`
        @keyframes floatUpBubbles {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          15% { opacity: 0.9; transform: translateY(-30px) scale(0.9); }
          50% { opacity: 1; transform: translateY(-70px) scale(1.15); } 
          85% { opacity: 0.9; transform: translateY(-110px) scale(0.9); }
          100% { transform: translateY(-140px) scale(0.6); opacity: 0; }
        }
      `}</style>

      <div className="mx-auto max-w-[1480px] px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          
          {/* Brand & Connect */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Arcade Nexus Platform</span>
            </div>
            <p className="max-w-xs text-sm font-medium leading-6 text-slate-600">
An independent, community-driven platform designed by <span className="font-bold text-slate-900">Manish</span> and <span className="font-bold text-slate-900">Anjali</span> to make the Google Cloud Arcade journey simpler, smarter, and more rewarding. Built for Arcade learners and enthusiasts, Arcade Nexus helps you effortlessly calculate and track points, monitor skill badges and achievements, follow milestones, explore leaderboard progress, and stay updated with important Arcade activities. Our goal is to bring everything you need into one clean, reliable, and easy-to-use platform, helping you save time, understand your progress, and stay focused on reaching your next Arcade milestone.            </p>
            <div className="flex gap-x-5">
              <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
                <span className="sr-only">WhatsApp Community</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/arcade-nexus/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
                <span className="sr-only">Download App</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
            </div>
          </div>

          {/* Nav & Metrics Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
            
            {/* Middle Column: Links + Feedback */}
            <div className="flex flex-col">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <button onClick={() => router.push("/calculator")} className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <Calculator className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Calculator
                      </button>
                    </li>
                    <li>
                      <button onClick={() => router.push("/dashboard")} className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <LayoutGrid className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Dashboard
                      </button>
                    </li>
                    <li>
                      <button onClick={() => router.push("/leaderboard")} className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <BarChart3 className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Leaderboard
                      </button>
                    </li>
                    <li>
                      <button onClick={() => router.push("/resources")} className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <BadgeCheck className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Skill Badges
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Resources</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <UserPlus className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Enrollment
                      </a>
                    </li>
                    <li>
                      <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <CircleDollarSign className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Points System
                      </a>
                    </li>
                    <li>
                      <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                        <BookOpen className="h-4 w-4 text-slate-500 group-hover:text-slate-900" /> Syllabus
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Added Feedback UI Here - Boxed & Original Colors */}
              <div className="mt-10 rounded-2xl bg-[#F8F9FA] p-6 max-w-sm border border-slate-100">
                <h3 className="text-base font-medium text-slate-900">Overall, how helpful is this page?</h3>
                <p className="mt-1 flex items-center text-xs text-slate-600">
                  Your feedback is used to improve Arcade Nexus 
                  <svg className="ml-1 h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </p>
                
                <div className="mt-6 min-h-[50px]">
                  <div className="flex w-full justify-between px-1">
                    {['😞', '😟', '😐', '🙂', '😀'].map((emoji, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleFeedback(i + 1)} // 1 से 5 तक स्कोर जाएगा
                        className="text-3xl transition-transform hover:scale-110 active:scale-95 drop-shadow-sm focus:outline-none"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between px-1 text-[11px] font-medium text-slate-500">
                    <span>Very unhelpful</span>
                    <span>Very helpful</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 h-fit">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Visitors</span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900"><VisitCounter /></div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <UserRoundPlus className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Unique Profiles</span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">{leaderboardCount.toLocaleString()}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <ChartNoAxesCombined className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Profiles Analyzed</span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">{profilesAnalyzed.toLocaleString()}</div>
              </div>

              {/* Live Online with Avatars */}
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent)]">
                  {leaderboardAvatars.length > 0 && Array.from({ length: 10 }).map((_, i) => {
                    const avatarIndex = (avatarStartIndex + i) % leaderboardAvatars.length;
                    const avatar = leaderboardAvatars[avatarIndex];
                    const pos = avatarPositions[i];
                    return (
                      <img 
                        key={i} 
                        src={avatar} 
                        alt=""
                        className="absolute bottom-[-30px] h-6 w-6 rounded-full border border-white bg-slate-200 object-cover shadow-sm"
                        style={{ left: pos.left, animation: `floatUpBubbles ${pos.duration} linear ${pos.delay} infinite` }}
                        onError={(e) => { e.currentTarget.src = "https://i.postimg.cc/Nf2ykWb1/1000111442.png" }}
                      />
                    );
                  })}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Radio className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Live Online</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900">{onlineUsers}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-16 border-t border-slate-200 pt-8 sm:mt-20 lg:mt-24">
          <p className="mb-6 text-xs font-medium leading-5 text-slate-500">
            <strong className="font-bold text-slate-700">Disclaimer: </strong> Arcade Nexus is an independent, community-driven platform for Google Cloud Arcade learners and is not affiliated with or endorsed by Google. All trademarks belong to their respective owners.
          </p>
          
          <div className="flex flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
            <p className="text-xs font-medium leading-5 text-slate-600">
              &copy; {new Date().getFullYear()} Arcade Nexus. All rights reserved.
            </p>
            
            <div className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200">
              Last updated: <span className="text-slate-900">{lastUpdated}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Legal Links */}
<div className="flex flex-wrap items-center gap-x-5 gap-y-2">
  <button
    onClick={() => router.push("/terms")}
    className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
  >
    Terms & Conditions
  </button>

  <span className="h-3.5 w-px bg-slate-300" />

  <button
    onClick={() => router.push("/privacy")}
    className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
  >
    Privacy Policy
  </button>

  <span className="h-3.5 w-px bg-slate-300" />

  <button
    onClick={() => router.push("/aboutpage")}
    className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
  >
    About
  </button>
</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500"></span>
              <div className="flex -space-x-2">
                <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="relative hover:z-10">
                  <img src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" alt="Manish" className="h-8 w-8 rounded-full ring-2 ring-white object-cover object-top" />
                </a>
                <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" className="relative hover:z-10">
                  <img src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" alt="Anjali Patel" className="h-8 w-8 rounded-full ring-2 ring-white object-cover object-top" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}