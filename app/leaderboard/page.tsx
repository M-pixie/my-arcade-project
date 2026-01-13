"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import Navbar from "@/app/components/Navbar";
import { subscribeLeaderboard } from "@/lib/leaderboard";

type Leader = {
  id: string;
  rank: number;
  name?: string;
  photoURL?: string;
  points?: number;
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaders(data);
    });
    return () => unsub();
  }, []);

  // ================= LOGIC: SORT TOP 3 FOR PODIUM (UNCHANGED) =================
  const topThree = leaders.slice(0, 3);
  // Order: [Rank 2, Rank 1, Rank 3] for visual center display
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean); 
  const restLeaders = leaders.slice(3);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans">
        <Navbar />

        {/* ================= HEADER SECTION ================= */}
        <header className="bg-white border-b border-gray-200 py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-50 rounded-full mb-2">
              <span className="text-2xl">🏆</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
              Leaderboard
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              See who is leading the charts in the Arcade.
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">

          {/* ================= TOP 3 (PODIUM CARDS) ================= */}
          {/* Note: Logic preserves the 2-1-3 order, but we style it professionally */}
          <div className="flex flex-col md:flex-row justify-center items-end gap-6">
            
            {podiumOrder.map((user) => {
              if (!user) return null;
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const isThird = user.rank === 3;

              return (
                <div
                  key={user.id}
                  className={`relative flex flex-col items-center w-full md:w-1/3 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] border border-gray-100 overflow-hidden transition-transform hover:-translate-y-1 duration-300
                    ${isFirst ? "order-1 md:order-2 z-10 md:-mt-8 ring-4 ring-yellow-50 shadow-xl" : ""}
                    ${isSecond ? "order-2 md:order-1" : ""}
                    ${isThird ? "order-3 md:order-3" : ""}
                  `}
                >
                  {/* Decorative Top Bar for Rank 1 */}
                  {isFirst && <div className="w-full h-2 bg-[#FBBC04]"></div>}
                  {isSecond && <div className="w-full h-1.5 bg-[#9AA0A6]"></div>}
                  {isThird && <div className="w-full h-1.5 bg-[#CE8F6F]"></div>}

                  <div className="p-8 text-center w-full">
                    {/* Rank Badge */}
                    <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold mb-4
                      ${isFirst ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"}
                    `}>
                      #{user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="relative inline-block">
                      <img
                        src={user.photoURL || "/avatar.png"}
                        alt={user.name}
                        className={`rounded-full object-cover border-4 border-white shadow-md
                          ${isFirst ? "w-28 h-28" : "w-20 h-20"}
                        `}
                      />
                      {isFirst && (
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                          <span className="text-xl">🥇</span>
                        </div>
                      )}
                    </div>

                    {/* Name & Points */}
                    <div className="mt-4 space-y-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate px-2">
                        {user.name || "Anonymous"}
                      </h3>
                      <p className={`text-xl font-normal ${isFirst ? "text-[#1a73e8]" : "text-gray-600"}`}>
                        {user.points?.toLocaleString() ?? 0}
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= THE LIST (RANK 4+) ================= */}
          <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] border border-gray-100 overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-7">User</div>
              <div className="col-span-3 text-right">Total Points</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {restLeaders.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-blue-50/50 transition-colors duration-150"
                >
                  {/* Rank */}
                  <div className="col-span-2 text-center text-sm font-medium text-gray-500">
                    #{user.rank}
                  </div>

                  {/* User Profile */}
                  <div className="col-span-7 flex items-center gap-4">
                    <img
                      src={user.photoURL || "/avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.name || "Anonymous"}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="col-span-3 text-right">
                    <span className="text-sm font-semibold text-[#1a73e8]">
                      {user.points?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              ))}

              {restLeaders.length === 0 && (
                <div className="p-10 text-center text-gray-500 text-sm">
                  Waiting for more players to join...
                </div>
              )}
            </div>
            
            {/* Optional Footer for Table */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">
                Leaderboard updates in real-time.
              </p>
            </div>

          </div>

        </main>
      </div>
    </AuthGuard>
  );
}