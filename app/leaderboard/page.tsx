"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { subscribeLeaderboard } from "@/lib/leaderboard";
import {
  Trophy,
  Search,
  Bell,
  Medal,
  Users,
  Target,
  Activity,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";

type Leader = {
  id: string;
  rank: number;
  name?: string;
  photoURL?: string;
  points?: number;
  calculationCount?: number;
  profileUrl?: string;
  badges?: string;
  milestone?: string;
  createdAt?: number | string | { seconds?: number };
  updatedAt?: number | string | { seconds?: number };
};

const safeNumber = (value?: number) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

const toTimestamp = (value?: Leader["createdAt"] | Leader["updatedAt"]) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && typeof value.seconds === "number") {
    return value.seconds * 1000;
  }
  return 0;
};

export default function LeaderboardPage() {
  const [arcadeLeaders, setArcadeLeaders] = useState<Leader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserUniqueId, setCurrentUserUniqueId] = useState<string | null>(
    null
  );

  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortMode, setSortMode] = useState<"points-desc" | "points-asc" | "latest" | "oldest">("points-desc");
  const currentUserRef = useRef<HTMLTableRowElement>(null);


  useEffect(() => {
    const unsubscribe = subscribeLeaderboard((data) => {
      setArcadeLeaders(data);
    });

    try {
      const savedData = localStorage.getItem("arcade_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.userName) setCurrentUserName(parsed.userName);
        if (parsed.userUniqueId) setCurrentUserUniqueId(parsed.userUniqueId);
      }
    } catch (error) {
      console.error("Error reading user data", error);
    }

    return () => unsubscribe();
  }, []);

  const isExactCurrentUser = (user: Leader) => {
    if (!currentUserName) return false;

    if (currentUserUniqueId && user.profileUrl) {
      return user.profileUrl.includes(currentUserUniqueId);
    }

    return user.name === currentUserName;
  };

  const rankedArcade = useMemo(() => {
    return [...arcadeLeaders]
      .sort((a, b) => safeNumber(b.points) - safeNumber(a.points))
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [arcadeLeaders]);

  const displayList = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    let list = rankedArcade.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        String(user.points ?? "").includes(query)
      );
    });

    if (!query) {
      list = [...rankedArcade];
    }

    if (sortMode === "points-asc") {
      return list.sort((a, b) => safeNumber(a.points) - safeNumber(b.points));
    }

    if (sortMode === "latest") {
      return list.sort(
        (a, b) =>
          toTimestamp(b.createdAt ?? b.updatedAt) -
          toTimestamp(a.createdAt ?? a.updatedAt)
      );
    }

    if (sortMode === "oldest") {
      return list.sort(
        (a, b) =>
          toTimestamp(a.createdAt ?? a.updatedAt) -
          toTimestamp(b.createdAt ?? b.updatedAt)
      );
    }

    return list.sort((a, b) => safeNumber(b.points) - safeNumber(a.points));
  }, [rankedArcade, searchTerm, sortMode]);

  const currentUserData = arcadeLeaders.find((user) =>
    isExactCurrentUser(user)
  );

  const currentRankedUser = useMemo(() => {
    if (!currentUserData) return null;
    return rankedArcade.find((user) => user.id === currentUserData.id) ?? null;
  }, [currentUserData, rankedArcade]);

  useEffect(() => {
    if (!currentUserData) return;
    const timer = window.setTimeout(() => {
      currentUserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [currentUserData]);

  const nextRankUser = useMemo(() => {
    if (!currentRankedUser || currentRankedUser.rank <= 1) return null;

    return rankedArcade[currentRankedUser.rank - 2] ?? null;
  }, [currentRankedUser, rankedArcade]);

  const pointsToNextRank = useMemo(() => {
    if (!currentRankedUser || !nextRankUser) return 0;

    return Math.max(
      0,
      safeNumber(nextRankUser.points) - safeNumber(currentRankedUser.points)
    );
  }, [currentRankedUser, nextRankUser]);

  const insightStats = useMemo(() => {
    const totalPoints = arcadeLeaders.reduce(
      (sum, user) => sum + safeNumber(user.points),
      0
    );

    const totalCalculations = arcadeLeaders.reduce(
      (sum, user) => sum + safeNumber(user.calculationCount || 1),
      0
    );

    const activeCalculationUsers = arcadeLeaders.filter(
      (user) => safeNumber(user.calculationCount || 1) > 1
    ).length;

    const averagePoints = arcadeLeaders.length
      ? Math.round(totalPoints / arcadeLeaders.length)
      : 0;

    return {
      totalPoints,
      totalCalculations,
      activeCalculationUsers,
      averagePoints,
    };
  }, [arcadeLeaders]);

  const closestRace = useMemo(() => {
    if (!currentRankedUser || currentRankedUser.rank <= 1) return null;

    // Only compare the current user with the 5 users immediately above them.
    const currentIndex = rankedArcade.findIndex(
      (user) => user.id === currentRankedUser.id
    );

    if (currentIndex <= 0) return null;

    const usersAbove = rankedArcade.slice(
      Math.max(0, currentIndex - 5),
      currentIndex
    );

    if (!usersAbove.length) return null;

    const closest = usersAbove.reduce<{
      first: Leader;
      second: Leader;
      gap: number;
    } | null>((best, user) => {
      const gap = Math.abs(
        safeNumber(user.points) - safeNumber(currentRankedUser.points)
      );

      if (!best || gap < best.gap) {
        return {
          first: user,
          second: currentRankedUser,
          gap,
        };
      }

      return best;
    }, null);

    return closest;
  }, [currentRankedUser, rankedArcade]);

  return (
    <div className="flex flex-col h-screen bg-[#f7f8fa] text-[#202124] overflow-hidden font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif]">
      <header className="h-[66px] bg-white/95 backdrop-blur border-b border-[#e5e7eb] flex items-center justify-between px-4 md:px-7 shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30">
        <div className="flex items-center gap-5 md:gap-9">
          <div className="font-bold text-[15px] md:text-[17px] tracking-[-0.02em] text-[#202124] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#e8f0fe] flex items-center justify-center">
              <Trophy className="w-[17px] h-[17px] text-[#1a73e8]" />
            </div>
            <span className="hidden sm:inline">ARCADE HUB</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#6b7280]">
            <Link href="/" className="hover:text-[#1a73e8] transition-colors">
              Home
            </Link>
            <Link
              href="/calculator"
              className="hover:text-[#1a73e8] transition-colors"
            >
              Calculator
            </Link>
            <span className="text-[#1a73e8] font-semibold">Leaderboard</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 rounded-full bg-[#f5f6f8] border border-[#eceef1] flex items-center justify-center text-[#6b7280] hover:text-[#202124] hover:bg-[#eef1f5] transition-all"
          >
            <Bell className="w-[17px] h-[17px]" />
          </button>

          <div className="flex items-center gap-2.5 pl-3 md:pl-4 border-l border-[#e5e7eb]">
            <img
              src={currentUserData?.photoURL || "/avatar.png"}
              alt="Profile"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-[#e5e7eb] bg-[#f3f4f6]"
            />
            <span className="font-semibold text-[13px] text-[#374151] hidden sm:inline max-w-[140px] truncate">
              {currentUserData?.name || currentUserName || "Guest"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full max-w-[1320px] mx-auto p-4 md:p-7">
          <section className="bg-white border border-[#e5e7eb] rounded-[20px] shadow-[0_6px_24px_rgba(17,24,39,0.05)] p-4 md:p-5">
            <div className="flex flex-col xl:flex-row items-center gap-4">
              <div className="w-full xl:w-[220px] shrink-0">
                <p className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-[0.14em]">
                  Arcade Rankings
                </p>
                <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#111827] mt-1">
                  Leaderboard
                </h1>
                <p className="text-[12px] text-[#6b7280] mt-1">
                  Live community standings, activity and rank insights.
                </p>
              </div>

              <div className="relative w-full xl:flex-1 xl:max-w-[410px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e5e7eb] rounded-[13px] py-2.5 pl-11 pr-10 text-[13px] font-medium outline-none focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/10 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#eef1f5] text-[#6b7280]"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 bg-[#f8fafc] border border-[#e5e7eb] rounded-[13px] px-4 py-2.5 w-full xl:w-auto">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6b7280]" />
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                    Members
                  </span>
                  <span className="text-[15px] font-bold text-[#1a73e8]">
                    {arcadeLeaders.length}
                  </span>
                </div>

                <div className="w-px h-5 bg-[#e5e7eb]" />

                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#6b7280]" />
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                    Your Rank
                  </span>
                  <span className="text-[15px] font-bold text-[#1a73e8]">
                    {currentRankedUser?.rank || "--"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-[13px] bg-[#eef5ff] border border-[#d7e6fb] text-[#1a73e8]">
                <Medal className="w-4 h-4" />
                <span className="text-[12px] font-semibold">Arcade Leaderboard</span>
              </div>
            </div>
          </section>

          {arcadeLeaders.length > 0 && (
            <>
              <section className="mt-5 grid lg:grid-cols-2 gap-5 items-start">
                <section className="bg-white border border-[#e5e7eb] rounded-[20px] shadow-[0_8px_24px_rgba(17,24,39,0.05)] overflow-hidden min-w-0">
                  <div className="px-5 md:px-6 py-4 border-b border-[#eef0f2] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1a73e8]">
                        Arcade Community
                      </p>
                      <h2 className="text-[17px] font-semibold mt-1 text-[#111827]">
                        All Arcade Members
                      </h2>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsSortOpen((open) => !open)}
                        className="inline-flex items-center gap-2 h-9 rounded-[10px] border border-[#e1e5ea] bg-white px-3 text-[12px] font-semibold text-[#475569] hover:bg-[#f8fafc] hover:border-[#cdd5df] transition-all"
                        aria-haspopup="listbox"
                        aria-expanded={isSortOpen}
                      >
                        <span>
                          {sortMode === "points-desc"
                            ? "Points ↓"
                            : sortMode === "points-asc"
                            ? "Points ↑"
                            : sortMode === "latest"
                            ? "Latest ↓"
                            : "Oldest ↑"}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            isSortOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isSortOpen && (
                        <div className="absolute right-0 top-[42px] z-50 w-[166px] overflow-hidden rounded-[8px] border border-[#cfd5dc] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                          {(
                            [
                              ["points-desc", "Points ↓"],
                              ["points-asc", "Points ↑"],
                              ["latest", "Latest ↓"],
                              ["oldest", "Oldest ↑"],
                            ] as const
                          ).map(([value, label]) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setSortMode(value);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[12px] transition-colors ${
                                sortMode === value
                                  ? "bg-[#f3f7ff] text-[#1a73e8] font-semibold"
                                  : "text-[#475569] hover:bg-[#f8fafc]"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[560px]">
                      <thead>
                        <tr className="bg-[#fafbfc] border-b border-[#e5e7eb]">
                          <th className="px-4 md:px-5 py-3.5 text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.12em] w-16 text-center">
                            Rank
                          </th>
                          <th className="px-4 md:px-5 py-3.5 text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.12em]">
                            Member
                          </th>
                          <th className="px-4 md:px-5 py-3.5 text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.12em] text-right">
                            Points
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#f0f2f4]">
                        {displayList.length > 0 ? (
                          displayList.map((user) => (
                            <LeaderTableRow
                              key={user.id}
                              user={user}
                              isCurrentUser={isExactCurrentUser(user)}
                              innerRef={
                                isExactCurrentUser(user)
                                  ? currentUserRef
                                  : undefined
                              }
                            />
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="p-16 text-center">
                              <div className="w-10 h-10 rounded-xl bg-[#f3f4f6] mx-auto flex items-center justify-center">
                                <Search className="w-4 h-4 text-[#9ca3af]" />
                              </div>
                              <p className="mt-3 text-[14px] font-semibold text-[#374151]">
                                {searchTerm
                                  ? "No matching player found."
                                  : "Loading Arcade players..."}
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="min-h-0 max-h-[calc(100vh-102px)] overflow-y-auto overscroll-contain pr-1 custom-scrollbar lg:sticky lg:top-5">
                  <div className="space-y-4 pb-1">
                    <div className="rounded-[20px] bg-gradient-to-br from-[#0b63ce] via-[#1a73e8] to-[#5b8def] text-white p-5 md:p-6 shadow-[0_16px_36px_rgba(26,115,232,0.20)] relative overflow-hidden">
                      <div className="absolute -right-14 -top-16 w-44 h-44 rounded-full bg-white/10 blur-3xl" />
                      <div className="absolute -left-16 -bottom-20 w-44 h-44 rounded-full bg-[#9cc3ff]/20 blur-3xl" />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase font-bold tracking-[0.17em] text-blue-100">
                              Your Journey
                            </p>
                            <p className="text-[13px] text-white/85 mt-1">
                              {currentRankedUser
                                ? currentRankedUser.rank === 1
                                  ? "You're currently at the top."
                                  : "Your next rank is within reach."
                                : "Start calculating to appear on the board."}
                            </p>
                          </div>
                          <Sparkles className="w-5 h-5 text-white/80 shrink-0" />
                        </div>

                        <div className="flex items-center gap-3 mt-5">
                          <img
                            src={currentRankedUser?.photoURL || currentUserData?.photoURL || "/avatar.png"}
                            alt={currentRankedUser?.name || currentUserData?.name || currentUserName || "Profile"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/55 bg-white/15 shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
                            onError={(event) => {
                              (event.currentTarget as HTMLImageElement).src = "/avatar.png";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-[15px] font-semibold truncate">
                              {currentRankedUser?.name || currentUserData?.name || currentUserName || "Guest"}
                            </p>
                            <p className="text-[11px] text-blue-100 mt-0.5">
                              Arcade member profile
                            </p>
                          </div>
                        </div>

                        <div className="flex items-end gap-6 mt-6">
                          <div>
                            <p className="text-[10px] font-semibold text-blue-100 tracking-[0.08em]">YOUR RANK</p>
                            <p className="text-[35px] leading-none font-semibold tracking-[-0.04em] mt-1">
                              #{currentRankedUser?.rank || "--"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-blue-100 tracking-[0.08em]">POINTS</p>
                            <p className="text-[22px] font-semibold mt-1">
                              {formatNumber(safeNumber(currentRankedUser?.points))}
                            </p>
                          </div>
                        </div>

                        {currentRankedUser && nextRankUser ? (
                          <div className="mt-6">
                            <div className="flex items-center justify-between text-[11px] mb-2">
                              <span className="text-blue-100">Gap to #{nextRankUser.rank}</span>
                              <span className="font-bold text-white">
                                {formatNumber(pointsToNextRank)} pts
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                              <div
                                className="h-full bg-white/85 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(
                                    8,
                                    Math.min(
                                      100,
                                      (safeNumber(currentRankedUser.points) /
                                        Math.max(1, safeNumber(nextRankUser.points))) *
                                        100
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : currentRankedUser ? (
                          <div className="mt-5 text-[12px] text-blue-50 font-semibold">
                            #1 position secured.
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white border border-[#e5e7eb] p-5 shadow-[0_8px_22px_rgba(17,24,39,0.04)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#1a73e8]">
                            Leaderboard Insights
                          </p>
                          <p className="text-[12px] text-[#9ca3af] mt-1">
                            Live snapshot
                          </p>
                        </div>
                        <Activity className="w-5 h-5 text-[#1a73e8]" />
                      </div>
                      <div className="mt-5 space-y-4">
                        <InsightRow
                          icon={<Trophy className="w-4 h-4 text-[#1a73e8]" />}
                          label="Highest Score"
                          value={`${formatNumber(safeNumber(rankedArcade[0]?.points))} pts`}
                        />
                        <InsightRow
                          icon={<Users className="w-4 h-4 text-[#1a73e8]" />}
                          label="Total Members"
                          value={formatNumber(arcadeLeaders.length)}
                        />
                        <InsightRow
                          icon={<TrendingUp className="w-4 h-4 text-[#1a73e8]" />}
                          label="Average Points"
                          value={formatNumber(insightStats.averagePoints)}
                        />
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white border border-[#e5e7eb] p-5 shadow-[0_8px_22px_rgba(17,24,39,0.04)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#1a73e8]">
                            Closest Race
                          </p>
                          <p className="text-[12px] text-[#9ca3af] mt-1">
                            Tightest point gap
                          </p>
                        </div>
                        <Target className="w-5 h-5 text-[#1a73e8]" />
                      </div>
                      {closestRace ? (
                        <div className="mt-5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[13px] font-semibold text-[#202124] truncate">
                              #{closestRace.first.rank} {closestRace.first.name || "Player"}
                            </span>
                            <span className="text-[11px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-1 rounded-full whitespace-nowrap">
                              {closestRace.gap} pt
                            </span>
                          </div>
                          <div className="h-px bg-[#eef0f2] my-3" />
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[13px] font-semibold text-[#202124] truncate">
                              #{closestRace.second.rank} {closestRace.second.name || "Player"}
                            </span>
                            <span className="text-[11px] font-medium text-[#6b7280]">
                              {formatNumber(safeNumber(closestRace.second.points))} pts
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9ca3af] mt-4">
                            Only {closestRace.gap} point{closestRace.gap === 1 ? "" : "s"} separate these positions.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-6 text-[12px] text-[#9ca3af]">
                          More players are needed to calculate a close race.
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => setIsInsightsOpen((open) => !open)}
                        className="w-full bg-[#f8fbff] hover:bg-[#eef5ff] border border-[#d9e8fb] rounded-[15px] px-4 py-3 flex items-center justify-between transition-colors"
                        aria-expanded={isInsightsOpen}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[10px] bg-[#e8f0fe] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[#1a73e8]" />
                          </div>
                          <div className="text-left">
                            <p className="text-[12px] font-bold text-[#202124]">
                              Explore full leaderboard insights
                            </p>
                            <p className="text-[11px] text-[#6b7280] mt-0.5">
                              {isInsightsOpen ? "Hide the detailed snapshot." : "Open the detailed snapshot below."}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#1a73e8] transition-transform ${
                            isInsightsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isInsightsOpen && (
                        <div className="mt-2 rounded-[16px] border border-[#d9e8fb] bg-white p-4 shadow-[0_8px_20px_rgba(26,115,232,0.06)]">
                          <div className="grid grid-cols-2 gap-3">
                            <InsightCard
                              icon={<Users className="w-5 h-5 text-[#1a73e8]" />}
                              label="Total Players"
                              value={formatNumber(arcadeLeaders.length)}
                            />
                            <InsightCard
                              icon={<Trophy className="w-5 h-5 text-[#1a73e8]" />}
                              label="Total Points"
                              value={formatNumber(insightStats.totalPoints)}
                            />
                            <InsightCard
                              icon={<TrendingUp className="w-5 h-5 text-[#1a73e8]" />}
                              label="Average Points"
                              value={formatNumber(insightStats.averagePoints)}
                            />
                            <InsightCard
                              icon={<Target className="w-5 h-5 text-[#1a73e8]" />}
                              label="Your Rank"
                              value={currentRankedUser ? `#${currentRankedUser.rank}` : "--"}
                            />
                          </div>

                          <div className="mt-3 rounded-[14px] bg-[#f8fbff] border border-[#d9e8fb] p-3.5">
                            <p className="text-[11px] font-bold text-[#202124]">
                              Current position
                            </p>
                            <p className="text-[12px] text-[#6b7280] mt-1 leading-relaxed">
                              {currentRankedUser
                                ? `You're ranked #${currentRankedUser.rank} with ${formatNumber(safeNumber(currentRankedUser.points))} points.`
                                : "Your player profile will appear here once your Arcade data is available."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

        </div>
      </main>

      <style jsx global>{`
        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d7dce2;
          border-radius: 999px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b8c0ca;
        }

        ::selection {
          background: rgba(26, 115, 232, 0.16);
        }
      `}</style>
    </div>
  );
}

function InsightRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-[10px] bg-[#f5f8fc] border border-[#e8edf4] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-[12px] text-[#6b7280] font-medium truncate">
          {label}
        </span>
      </div>
      <span className="text-[13px] text-[#202124] font-bold whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[17px] border border-[#e5e7eb] bg-[#fafbfc] p-4">
      <div className="w-9 h-9 rounded-[11px] bg-[#e8f0fe] flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-[0.13em] font-bold text-[#8b95a1]">
        {label}
      </p>
      <p className="text-[25px] font-semibold tracking-[-0.03em] mt-1 text-[#111827]">
        {value}
      </p>
    </div>
  );
}

function LeaderTableRow({
  user,
  isCurrentUser = false,
  innerRef,
}: {
  user: Leader;
  isCurrentUser?: boolean;
  innerRef?: React.RefObject<HTMLTableRowElement | null>;
}) {
  const isTop3 = user.rank <= 3;

  let rankIcon = (
    <span className="text-[#6b7280] font-semibold text-[13px]">
      {user.rank}
    </span>
  );

  if (user.rank === 1) {
    rankIcon = (
      <span className="text-[#b78103] font-bold inline-flex items-center justify-center gap-1.5">
        <Trophy className="w-4 h-4" />1
      </span>
    );
  }

  if (user.rank === 2) {
    rankIcon = (
      <span className="text-[#7b8490] font-bold inline-flex items-center justify-center gap-1.5">
        <Trophy className="w-4 h-4" />2
      </span>
    );
  }

  if (user.rank === 3) {
    rankIcon = (
      <span className="text-[#a65b2f] font-bold inline-flex items-center justify-center gap-1.5">
        <Trophy className="w-4 h-4" />3
      </span>
    );
  }

  return (
    <tr
      id={`player-${user.id}`}
      ref={innerRef}
      className={`transition-colors ${
        isCurrentUser ? "bg-[#eef5ff]" : "bg-white hover:bg-[#fafbfc]"
      }`}
    >
      <td className="px-4 md:px-6 py-4 align-middle text-center w-20">
        {rankIcon}
      </td>

      <td className="px-4 md:px-6 py-4 align-middle">
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL || "/avatar.png"}
            alt={user.name || "Player"}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0 border border-[#e5e7eb] bg-[#f7f8fa]"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = "/avatar.png";
            }}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[13px] md:text-[14px] font-semibold whitespace-nowrap truncate max-w-[230px] ${
                  isTop3 ? "text-[#111827]" : "text-[#374151]"
                }`}
              >
                {user.name || "Anonymous"}
              </span>

              {isCurrentUser && (
                <span className="bg-[#1a73e8] text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.08em]">
                  You
                </span>
              )}
            </div>

            <span className="block text-[10px] text-[#9ca3af] mt-0.5">
              Live Arcade profile
            </span>
          </div>
        </div>
      </td>

      <td className="px-4 md:px-6 py-4 text-right align-middle whitespace-nowrap">
        <span
          className={`text-[14px] md:text-[15px] font-bold ${
            isTop3 ? "text-[#1a73e8]" : "text-[#202124]"
          }`}
        >
          {formatNumber(safeNumber(user.points))}
        </span>
      </td>
    </tr>
  );
}
