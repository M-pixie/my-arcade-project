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
      {/* GOOGLE STYLE BACKGROUND */}
      <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans pt-16 pb-12">
        <Navbar />

        {/* ================= HEADER SECTION ================= */}
        <header className="bg-white border-b border-[#dadce0] py-12 px-6 text-center shadow-sm">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="inline-flex items-center justify-center p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-sm mb-3">
              <span className="text-2xl leading-none">🏆</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight">
              Leaderboard
            </h1>
            <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto">
              See who is leading the charts in the Arcade.
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          {/* ================= TOP 3 (PODIUM CARDS) ================= */}
          <div className="flex flex-col md:flex-row justify-center items-end gap-6">
            
            {podiumOrder.map((user) => {
              if (!user) return null;
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const isThird = user.rank === 3;

              return (
                <div
                  key={user.id}
                  className={`relative flex flex-col items-center w-full md:w-1/3 bg-white rounded-sm shadow-sm border border-[#dadce0] overflow-hidden transition-all hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] duration-300
                    ${isFirst ? "order-1 md:order-2 z-10 md:-mt-8 shadow-md border-[#fbbc04]/30" : ""}
                    ${isSecond ? "order-2 md:order-1" : ""}
                    ${isThird ? "order-3 md:order-3" : ""}
                  `}
                >
                  {/* Decorative Top Bar for Ranks */}
                  {isFirst && <div className="w-full h-2 bg-[#fbbc04]"></div>}
                  {isSecond && <div className="w-full h-1.5 bg-[#9aa0a6]"></div>}
                  {isThird && <div className="w-full h-1.5 bg-[#ce8f6f]"></div>}

                  <div className="p-8 text-center w-full flex flex-col items-center">
                    {/* Rank Badge */}
                    <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-sm text-xs font-bold mb-5 border
                      ${isFirst ? "bg-[#fef7e0] text-[#b06000] border-[#fde293]" : "bg-[#f8f9fa] text-[#5f6368] border-[#dadce0]"}
                    `}>
                      #{user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="relative inline-block mb-2">
                      <img
                        src={user.photoURL || "/avatar.png"}
                        alt={user.name}
                        className={`rounded-full object-cover border border-[#dadce0] p-1 bg-[#f8f9fa]
                          ${isFirst ? "w-28 h-28" : "w-20 h-20"}
                        `}
                      />
                      {isFirst && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-[#dadce0] shadow-sm flex items-center justify-center">
                          <span className="text-lg leading-none">🥇</span>
                        </div>
                      )}
                    </div>

                    {/* Name & Points */}
                    <div className="mt-4 space-y-1 w-full">
                      <h3 className="text-lg font-medium text-[#202124] truncate px-2">
                        {user.name || "Anonymous"}
                      </h3>
                      <p className={`text-xl font-normal ${isFirst ? "text-[#1a73e8]" : "text-[#5f6368]"}`}>
                        {user.points?.toLocaleString() ?? 0}
                        <span className="text-xs text-[#80868b] ml-1 font-medium uppercase tracking-wider">pts</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= THE LIST (RANK 4+) ================= */}
          <div className="bg-white rounded-sm border border-[#dadce0] shadow-sm overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-[#dadce0] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-7">User</div>
              <div className="col-span-3 text-right">Total Points</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#dadce0]">
              {restLeaders.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#f8f9fa] transition-colors duration-150"
                >
                  {/* Rank */}
                  <div className="col-span-2 text-center text-sm font-medium text-[#5f6368]">
                    #{user.rank}
                  </div>

                  {/* User Profile */}
                  <div className="col-span-7 flex items-center gap-4">
                    <img
                      src={user.photoURL || "/avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-[#dadce0] p-0.5 object-cover"
                    />
                    <span className="text-sm font-medium text-[#202124] truncate">
                      {user.name || "Anonymous"}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="col-span-3 text-right">
                    <span className="text-sm font-medium text-[#1a73e8]">
                      {user.points?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              ))}

              {restLeaders.length === 0 && (
                <div className="p-10 text-center text-[#5f6368] text-sm">
                  Waiting for more players to join...
                </div>
              )}
            </div>
            
            {/* Table Footer */}
            <div className="bg-[#f8f9fa] px-6 py-3 border-t border-[#dadce0] text-center">
              <p className="text-xs font-medium text-[#80868b] uppercase tracking-widest">
                Leaderboard updates in real-time
              </p>
            </div>

          </div>

        </main>
      </div>
    </AuthGuard>
  );
}