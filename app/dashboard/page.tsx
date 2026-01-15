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

  /* ================= UI SECTION (UNCHANGED) ================= */
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans pt-24 pb-10">
        <Navbar />

        <header className="bg-white border-b border-gray-200 pt-8 pb-8 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-normal text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Overview of your Arcade performance and activity.
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3 bg-[#F1F3F4] px-4 py-2 rounded-full border border-gray-200">
                 <img
                  src={user.photoURL || "/avatar.png"}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || "Arcade User"}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Points</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-normal text-[#1a73e8]">{totalPoints}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Best Score</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-normal text-[#188038]">{bestScore}</span>
                <span className="text-sm text-gray-400">pts</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Attempts</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-normal text-[#e37400]">{totalAttempts}</span>
                <span className="text-sm text-gray-400">runs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {history.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-sm">No activity recorded yet.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {history.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-50 p-2 rounded-full">
                            <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Points Calculated</p>
                            <p className="text-xs text-gray-500">{timeAgo(item.createdAt)}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#1a73e8] bg-blue-50 px-3 py-1 rounded-full">
                          +{item.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Ranking</h2>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-base font-medium text-gray-900">Current Rank</h3>
                <div className="my-4">
                  <span className="text-5xl font-normal text-gray-900">
                    {userRank ? `#${userRank}` : "-"}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    out of {totalUsers} players
                  </p>
                </div>
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="w-full mt-2 text-[#1a73e8] border border-[#1a73e8] hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors text-sm"
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