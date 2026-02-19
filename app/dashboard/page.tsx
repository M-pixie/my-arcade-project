"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { subscribeLeaderboard, getUserHistory } from "@/lib/leaderboard";

/* ================= LOGIC SECTION (UNCHANGED) ================= */
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

  // FIXED: Added type 'any[]' to data to solve Vercel build error
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

  /* ================= UI SECTION (GOOGLE ENTERPRISE STYLE) ================= */
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans pt-16 pb-12">
        <Navbar />

        {/* --- HEADER --- */}
        <header className="bg-white border-b border-[#dadce0] pt-12 pb-10 px-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row md:items-end justify-between gap-8">
            
            {/* Page Title */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight">
                Dashboard
              </h1>
              <p className="text-[#5f6368] mt-2 text-base">
                Overview of your Arcade performance and activity.
              </p>
            </div>

            {/* Profile Section: Avatar Circle with Name Below */}
            {user && (
              <div className="flex flex-col items-center md:items-end justify-center">
                <div className="w-16 h-16 rounded-full border border-[#dadce0] bg-[#e8f0fe] p-0.5 shadow-sm mb-3 flex-shrink-0">
                  <img
                    src={user.photoURL || "/avatar.png"}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-base font-medium text-[#202124] leading-tight">
                  {user.displayName || "Arcade User"}
                </span>
                <span className="text-xs text-[#5f6368] mt-0.5">
                  {user.email}
                </span>
              </div>
            )}
            
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          
          {/* --- TOP STATS ROW --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-white p-6 rounded-sm border border-[#dadce0] shadow-sm hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-200">
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Total Points</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-light text-[#1a73e8] tracking-tight">{totalPoints}</span>
              </div>
            </div>
            
            {/* Box 2 */}
            <div className="bg-white p-6 rounded-sm border border-[#dadce0] shadow-sm hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-200">
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Best Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-light text-[#188038] tracking-tight">{bestScore}</span>
                <span className="text-sm font-medium text-[#80868b] uppercase">pts</span>
              </div>
            </div>
            
            {/* Box 3 */}
            <div className="bg-white p-6 rounded-sm border border-[#dadce0] shadow-sm hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-200">
              <div className="text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Total Attempts</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-light text-[#e37400] tracking-tight">{totalAttempts}</span>
                <span className="text-sm font-medium text-[#80868b] uppercase">runs</span>
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Recent Activity */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-normal text-[#202124]">Recent Activity</h2>
              
              <div className="bg-white border border-[#dadce0] rounded-sm shadow-sm overflow-hidden">
                {history.length === 0 ? (
                  <div className="p-12 text-center bg-[#f8f9fa]">
                    <div className="text-[#5f6368] text-sm">No activity recorded yet. Time to calculate your first score!</div>
                  </div>
                ) : (
                  <div className="divide-y divide-[#dadce0]">
                    {history.map((item, idx) => (
                      <div key={idx} className="p-5 flex items-center justify-between hover:bg-[#f8f9fa] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#e8f0fe] border border-[#d2e3fc] p-2.5 rounded-sm">
                            <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#202124]">Points Calculated</p>
                            <p className="text-xs text-[#5f6368] mt-0.5">{timeAgo(item.createdAt)}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#1a73e8] bg-[#e8f0fe] border border-[#d2e3fc] px-3 py-1 rounded-sm">
                          +{item.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Ranking */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-normal text-[#202124]">Ranking</h2>
              
              <div className="bg-white border border-[#dadce0] rounded-sm shadow-sm p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#f8f9fa] border border-[#dadce0] rounded-sm flex items-center justify-center mb-6">
                  <span className="text-2xl">🏆</span>
                </div>
                
                <h3 className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Current Rank</h3>
                
                <div className="my-4">
                  <span className="text-6xl font-light text-[#202124] tracking-tight">
                    {userRank ? `#${userRank}` : "-"}
                  </span>
                  <p className="text-sm text-[#5f6368] mt-2 font-medium">
                    out of <span className="text-[#1a73e8]">{totalUsers}</span> players
                  </p>
                </div>
                
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="w-full mt-6 bg-white text-[#1a73e8] border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#1a73e8] font-medium py-2.5 rounded-sm transition-all duration-200 text-sm focus:outline-none"
                >
                  View Leaderboard
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </AuthGuard>
  );
}