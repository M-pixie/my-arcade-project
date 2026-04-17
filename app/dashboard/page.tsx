"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { subscribeLeaderboard, getUserHistory } from "@/lib/leaderboard";

/* ================= LOGIC SECTION ================= */
function timeAgo(date: any) {
  if (!date) return "";
  const now = new Date();
  const past = date.toDate ? date.toDate() : new Date(date);
  const diff = now.getTime() - past.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

type HistoryItem = {
  points: number;
  createdAt?: any;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeLeaderboard((leaders: any[]) => {
      setTotalUsers(leaders.length);
      const me = leaders.find((l: any) => l.id === user.uid);
      if (me) {
        setUserRank(me.rank);
        setTotalPoints(me.points || 0);
        if ((me as any).attemptsCount !== undefined) {
          setTotalAttempts((me as any).attemptsCount);
        }
      }
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getUserHistory(user.uid).then((data: any[]) => {
      setHistory(data);
      setTotalAttempts((prev) => (prev > 0 ? prev : data.length));
    }).catch(err => console.error(err));
  }, [user]);

  const bestScore =
    history.length > 0
      ? Math.max(...history.map((h) => h.points))
      : 0;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  /* ================= UI SECTION ================= */
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans pt-16 pb-12">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          
          {/* --- UNIFIED TOP HEADER: PROFILE + STATS + LOGOUT --- */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Left: Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full lg:w-auto text-center sm:text-left">
              <div className="w-20 h-20 rounded-full border border-gray-200 p-1 shadow-sm flex-shrink-0 relative bg-white">
                <img
                  src={user?.photoURL || "/avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  {user?.displayName || "Arcade User"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5 font-medium">
                  {user?.email}
                </p>
                <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Player Active
                </div>
              </div>
            </div>

            {/* Right: Stats & Logout */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 z-10 w-full lg:w-auto">
              <div className="bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-xl text-center min-w-[100px]">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Points</div>
                <div className="text-2xl font-extrabold text-blue-600 leading-none">{totalPoints}</div>
              </div>

              <div className="bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-xl text-center min-w-[100px]">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Best</div>
                <div className="text-2xl font-extrabold text-green-600 leading-none">{bestScore}</div>
              </div>

              <div className="relative flex items-center group ml-2">
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl shadow-sm transition-all duration-200 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-medium px-2.5 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Logout
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT GRID (ACTIVITY & RANK) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left: Recent Activity */}
            <div className="flex flex-col space-y-4 h-full">
              <h2 className="text-lg font-bold text-gray-700 ml-1">Recent Activity</h2>
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex-grow overflow-hidden flex flex-col h-[340px]">
                {history.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-3">
                      <span className="text-xl opacity-40">🕹️</span>
                    </div>
                    <p className="text-gray-500 font-medium text-sm">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-grow">
                    {history.map((item, idx) => (
                      <div key={idx} className="bg-gray-50/50 p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-white border border-gray-200 text-gray-400 p-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">Points Calculated</p>
                            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                          +{item.points}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Ranking Section */}
            <div className="flex flex-col space-y-4 h-full">
              <h2 className="text-lg font-bold text-gray-700 ml-1">Your Current Rank</h2>
              <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center relative overflow-hidden flex-grow h-[340px]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500 rounded-full blur-[70px] opacity-30 pointer-events-none"></div>
                <div className="w-20 h-20 mb-4 relative">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="text-6xl animate-bounce relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">🏆</div>
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700/50 bg-slate-800/50 px-3 py-1 rounded-md">Global Rank</h3>
                <div className="my-4 relative z-10">
                  <span className="text-6xl font-extrabold text-white tracking-tighter drop-shadow-lg leading-none">
                    {userRank ? `#${userRank}` : "-"}
                  </span>
                  <p className="text-xs text-slate-300 mt-3 font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    out of <span className="text-yellow-400 font-bold">{totalUsers}</span> players
                  </p>
                </div>
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="w-full mt-2 bg-blue-600 text-white border border-blue-500 font-bold py-3 rounded-xl shadow-md hover:bg-blue-500 hover:shadow-blue-500/25 transition-all text-sm"
                >
                  View Full Leaderboard
                </button>
              </div>
            </div>

          </div>

          {/* ================= ARCADE SEASON & PRIZES ================= */}
          <div className="space-y-6 pt-4">
            
            {/* Top Row: Season Details & Facilitator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* The Arcade Season */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-blue-600">Arcade Program 2026</h3>
                  <p className="text-xs text-gray-500 mt-1">January 2026 - Dec 2026</p>
                </div>
                
                {/* Premium Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full flex overflow-hidden mb-6">
                  <div className="bg-blue-500 h-full w-[60%]"></div>
                  <div className="bg-purple-500 h-full w-[40%]"></div>
                </div>

                {/* User Profile & Best Score Banner */}
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-gray-200 p-0.5 bg-white flex-shrink-0">
                      <img
                        src={user?.photoURL || "/avatar.png"}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{user?.displayName || "Arcade User"}</p>
                      <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mt-0.5">Season Player</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Best Score</p>
                    <p className="text-2xl font-extrabold text-green-600 leading-none">{bestScore}</p>
                  </div>
                </div>
              </div>

              {/* Facilitator Cohort */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 border border-indigo-800 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

                <h3 className="text-lg font-bold text-white mb-6 z-10">Facilitator Program 2026</h3>
                
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30 shadow-inner z-10">
                  <span className="text-2xl drop-shadow-md">🎓</span>
                </div>
                
                <p className="text-sm font-semibold text-blue-100 z-10 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                  Enrolments Opening Soon
                </p>
              </div>
            </div>

            {/* Prize Tier Summary Strip */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
                  🏆
                </div>
                <span className="font-semibold text-gray-700">Prize Tier</span>
              </div>
              
              <div className="text-center">
                <div className="text-base font-bold text-gray-800">To be announced</div>
                <div className="mt-2 inline-block bg-emerald-100 border border-emerald-300 px-4 py-1.5 rounded-xl shadow-sm">
                  <span className="text-xl font-extrabold text-emerald-700">{totalPoints}</span>
                  <span className="text-xs font-bold text-emerald-600 ml-1.5 uppercase tracking-wider">Total Arcade Points</span>
                </div>
              </div>

              <button className="px-5 py-2 bg-white border border-emerald-200 text-emerald-600 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm">
                View Rewards ↓
              </button>
            </div>

            {/* Prize Tiers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Novice */}
              <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <h4 className="font-bold text-gray-800 mb-4">Novice</h4>
                <div className="w-full h-40 bg-white/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                   <img 
                    src="https://cdn.jsdelivr.net/gh/iamarghamallick/arcade-points-calculator-jsdelivr@main/images/swags/nobg/25-nobg.png" 
                    alt="Novice Swag" 
                    className="w-full h-full object-contain p-2" 
                   />
                </div>
                <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-pink-100 shadow-sm">25 Points</span>
              </div>

              {/* Trooper */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <h4 className="font-bold text-gray-800 mb-4">Trooper</h4>
                <div className="w-full h-40 bg-white/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                   <img 
                    src="https://cdn.jsdelivr.net/gh/iamarghamallick/arcade-points-calculator-jsdelivr@main/images/swags/nobg/45-nobg.png" 
                    alt="Trooper Swag" 
                    className="w-full h-full object-contain p-2" 
                   />
                </div>
                <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-blue-100 shadow-sm">45 Points</span>
              </div>

              {/* Ranger */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <h4 className="font-bold text-gray-800 mb-4">Ranger</h4>
                <div className="w-full h-40 bg-white/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                   <img 
                    src="https://cdn.jsdelivr.net/gh/iamarghamallick/arcade-points-calculator-jsdelivr@main/images/swags/nobg/65-nobg.png" 
                    alt="Ranger Swag" 
                    className="w-full h-full object-contain p-2" 
                   />
                </div>
                <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">65 Points</span>
              </div>

              {/* Champion */}
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <h4 className="font-bold text-gray-800 mb-4">Champion</h4>
                <div className="w-full h-40 bg-white/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                   <img 
                    src="https://cdn.jsdelivr.net/gh/iamarghamallick/arcade-points-calculator-jsdelivr@main/images/swags/nobg/75-nobg.png" 
                    alt="Champion Swag" 
                    className="w-full h-full object-contain p-2" 
                   />
                </div>
                <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-emerald-100 shadow-sm">75 Points</span>
              </div>

              {/* Legend */}
              <div className="bg-[#fefce8] border border-[#fde047] rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <h4 className="font-bold text-gray-800 mb-4">Legend</h4>
                <div className="w-full h-40 bg-white/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                   <img 
                    src="https://cdn.jsdelivr.net/gh/iamarghamallick/arcade-points-calculator-jsdelivr@main/images/swags/nobg/95-nobg-updated.png" 
                    alt="Legend Swag" 
                    className="w-full h-full object-contain p-2" 
                   />
                </div>
                <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-yellow-100 shadow-sm">95 Points</span>
              </div>
            </div>

            {/* Bottom Alert Banner (TRANSLATED TO ENGLISH) */}
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-xl p-3 text-center shadow-sm">
              Note: These are the previous season 2025 swags. New prizes for 2026 will be revealed soon.
            </div>

          </div>

        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
      `}</style>
    </AuthGuard>
  );
}