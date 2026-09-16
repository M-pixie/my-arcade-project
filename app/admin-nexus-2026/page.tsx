"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: string;
  name?: string;
  photoURL?: string;
  profileUrl?: string;
  points?: number;
  calculationCount?: number;
  updatedAt?: any;
  [key: string]: any;
};

type AdminFeedback = {
  id: string;
  rating?: number;
  date?: any;
  timestamp?: any;
  createdAt?: any;
  updatedAt?: any;
  name?: string;
  email?: string;
  message?: string;
  feedback?: string;
  comment?: string;
  review?: string;
  text?: string;
  source?: string;
  [key: string]: any;
};

type RangeFilter = "all" | "today" | "7d" | "30d";

const AUTHORIZED_EMAILS = [
  "vy7manish@gmail.com",
  "patelanjali0801@gmail.com",
  "rohit.geca.kr@gmail.com",
];

const numberValue = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getDate = (value: any): Date | null => {
  if (!value) return null;

  try {
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

    if (value instanceof Timestamp) {
      const d = value.toDate();
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value?.toDate === "function") {
      const d = value.toDate();
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value === "number") {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof value === "string") {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
  } catch {
    return null;
  }

  return null;
};

const formatDate = (value: any) => {
  const d = getDate(value);
  if (!d) return "N/A";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const escapeCsv = (value: any) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

const getFeedbackDate = (feedback: AdminFeedback) =>
  getDate(feedback.timestamp || feedback.createdAt || feedback.updatedAt) ||
  getDate(feedback.date);

const getFeedbackText = (feedback: AdminFeedback) =>
  String(
    feedback.message ??
      feedback.feedback ??
      feedback.comment ??
      feedback.review ??
      feedback.text ??
      "No written feedback provided."
  ).trim();

const formatFeedbackValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "—";

  const date = getDate(value);
  if (date && (value instanceof Timestamp || typeof value?.toDate === "function")) {
    return formatDate(value);
  }

  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
};

const getFeedbackIdentity = (feedback: AdminFeedback) =>
  String(feedback.name ?? feedback.email ?? "Anonymous").trim() || "Anonymous";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("all");
  const [sortBy, setSortBy] = useState<
    "points" | "calculations" | "updatedAt" | "name"
  >("points");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [analyticsUser, setAnalyticsUser] = useState<AdminUser | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedback | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email && AUTHORIZED_EMAILS.includes(user.email)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    setIsConnected(false);

    const usersQuery = query(
      collection(db, "leaderboard"),
      orderBy("points", "desc")
    );

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const nextUsers: AdminUser[] = [];

        snapshot.forEach((doc) => {
          nextUsers.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setUsers(nextUsers);
        setLoading(false);
        setIsConnected(true);
        setError("");
      },
      (err) => {
        console.error("Error fetching admin data:", err);
        setLoading(false);
        setIsConnected(false);
        setError("Failed to sync live data.");
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setFeedbackLoading(true);
    setFeedbackError("");

    // Read the complete collection without orderBy so no extra Firestore index is required.
    const feedbackCollection = collection(db, "platform_feedback");

    const unsubscribe = onSnapshot(
      feedbackCollection,
      (snapshot) => {
        const nextFeedback: AdminFeedback[] = [];

        snapshot.forEach((doc) => {
          nextFeedback.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        nextFeedback.sort((a, b) =>
          (getFeedbackDate(b)?.getTime() ?? 0) - (getFeedbackDate(a)?.getTime() ?? 0)
        );

        setFeedbacks(nextFeedback);
        setFeedbackLoading(false);
        setFeedbackError("");
      },
      (err) => {
        console.error("Error fetching feedback data:", err);
        setFeedbackLoading(false);
        setFeedbackError("Unable to load platform feedback.");
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  const login = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email && AUTHORIZED_EMAILS.includes(email)) {
        setIsAuthenticated(true);
        setError("");
        setShake(false);
        return;
      }

      await signOut(auth);
      setError("Unauthorized Admin Email.");
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please try again.");
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
    }
  };

  const logout = async () => {
    await signOut(getAuth());
    setIsAuthenticated(false);
  };

  const openUser = (user: AdminUser, rank: number) => {
    setSelectedUser({ ...user, rank });
    setIsDrawerOpen(true);
  };

  const openAnalytics = (user: AdminUser, rank: number) => {
    setAnalyticsUser({ ...user, rank });
    setIsAnalyticsOpen(true);
  };

  const copyProfile = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setError("Unable to copy the profile link.");
    }
  };

  const filteredUsers = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    const now = Date.now();

    const rangeMs: Record<Exclude<RangeFilter, "all">, number> = {
      today: 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    const result = users.filter((user) => {
      const matchesSearch =
        !search ||
        String(user.name ?? "").toLowerCase().includes(search) ||
        String(user.profileUrl ?? "").toLowerCase().includes(search);

      const updatedTime = getDate(user.updatedAt)?.getTime() ?? 0;
      const matchesRange =
        rangeFilter === "all"
          ? true
          : updatedTime > 0 && now - updatedTime <= rangeMs[rangeFilter];

      return matchesSearch && matchesRange;
    });

    result.sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      if (sortBy === "points") {
        aValue = numberValue(a.points);
        bValue = numberValue(b.points);
      } else if (sortBy === "calculations") {
        aValue = numberValue(a.calculationCount || 1);
        bValue = numberValue(b.calculationCount || 1);
      } else if (sortBy === "updatedAt") {
        aValue = getDate(a.updatedAt)?.getTime() ?? 0;
        bValue = getDate(b.updatedAt)?.getTime() ?? 0;
      } else {
        aValue = String(a.name ?? "").toLowerCase();
        bValue = String(b.name ?? "").toLowerCase();
      }

      const comparison =
        typeof aValue === "string" && typeof bValue === "string"
          ? aValue.localeCompare(bValue)
          : Number(aValue) - Number(bValue);

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return result;
  }, [users, searchQuery, rangeFilter, sortBy, sortDirection]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalPoints = users.reduce(
      (sum, user) => sum + numberValue(user.points),
      0
    );
    const totalCalculations = users.reduce(
      (sum, user) => sum + numberValue(user.calculationCount || 1),
      0
    );

    const now = Date.now();
    const activeToday = users.filter((user) => {
      const time = getDate(user.updatedAt)?.getTime() ?? 0;
      return time > 0 && now - time <= 24 * 60 * 60 * 1000;
    }).length;

    const profilesLinked = users.filter(
      (user) => String(user.profileUrl ?? "").trim().length > 0
    ).length;

    return {
      totalUsers,
      totalPoints,
      totalCalculations,
      activeToday,
      profilesLinked,
      averagePoints: totalUsers ? Math.round(totalPoints / totalUsers) : 0,
      averageCalculations: totalUsers
        ? Math.round((totalCalculations / totalUsers) * 10) / 10
        : 0,
      missingProfiles: totalUsers - profilesLinked,
    };
  }, [users]);

  const topUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => numberValue(b.points) - numberValue(a.points))
        .slice(0, 5),
    [users]
  );

  const activityUsers = useMemo(
    () =>
      [...users]
        .filter((u) => getDate(u.updatedAt))
        .sort(
          (a, b) =>
            (getDate(b.updatedAt)?.getTime() ?? 0) -
            (getDate(a.updatedAt)?.getTime() ?? 0)
        )
        .slice(0, 6),
    [users]
  );

  const maxPoints = useMemo(
    () => Math.max(...users.map((u) => numberValue(u.points)), 1),
    [users]
  );

  const maxCalculations = useMemo(
    () =>
      Math.max(
        ...users.map((u) => numberValue(u.calculationCount || 1)),
        1
      ),
    [users]
  );

  const pointsBands = useMemo(() => {
    const bands = [
      { label: "0–99", min: 0, max: 99, count: 0 },
      { label: "100–499", min: 100, max: 499, count: 0 },
      { label: "500–999", min: 500, max: 999, count: 0 },
      { label: "1000+", min: 1000, max: Infinity, count: 0 },
    ];

    users.forEach((user) => {
      const points = numberValue(user.points);
      const band = bands.find((item) => points >= item.min && points <= item.max);
      if (band) band.count += 1;
    });

    return bands;
  }, [users]);


  const topCalculators = useMemo(
    () =>
      [...users]
        .sort(
          (a, b) =>
            numberValue(b.calculationCount || 1) -
            numberValue(a.calculationCount || 1)
        )
        .slice(0, 10),
    [users]
  );

  const topPointsUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => numberValue(b.points) - numberValue(a.points))
        .slice(0, 10),
    [users]
  );

  const activityBuckets = useMemo(() => {
    const now = Date.now();
    const bucket = [
      { label: "0–24h", min: 0, max: 24 * 60 * 60 * 1000, count: 0 },
      { label: "1–7d", min: 24 * 60 * 60 * 1000, max: 7 * 24 * 60 * 60 * 1000, count: 0 },
      { label: "8–30d", min: 7 * 24 * 60 * 60 * 1000, max: 30 * 24 * 60 * 60 * 1000, count: 0 },
      { label: "30d+", min: 30 * 24 * 60 * 60 * 1000, max: Infinity, count: 0 },
    ];

    users.forEach((user) => {
      const updated = getDate(user.updatedAt)?.getTime() ?? 0;
      if (!updated) return;
      const age = Math.max(0, now - updated);
      const match = bucket.find((item) => age >= item.min && age < item.max);
      if (match) match.count += 1;
    });

    return bucket;
  }, [users]);

  const analyticsSummary = useMemo(() => {
    const active = users.filter((user) => {
      const t = getDate(user.updatedAt)?.getTime() ?? 0;
      return t > 0 && Date.now() - t <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    const total = users.length;
    const activeRate = total ? Math.round((active / total) * 100) : 0;
    const totalCalcs = users.reduce(
      (sum, user) => sum + numberValue(user.calculationCount || 1),
      0
    );
    const medianPoints = (() => {
      const values = users
        .map((u) => numberValue(u.points))
        .sort((a, b) => a - b);
      if (!values.length) return 0;
      const mid = Math.floor(values.length / 2);
      return values.length % 2
        ? values[mid]
        : Math.round((values[mid - 1] + values[mid]) / 2);
    })();

    return {
      active,
      activeRate,
      totalCalcs,
      medianPoints,
    };
  }, [users]);

  const filteredFeedbacks = useMemo(() => {
    const search = feedbackSearch.trim().toLowerCase();
    if (!search) return feedbacks;

    return feedbacks.filter((feedback) => {
      const haystack = [
        getFeedbackIdentity(feedback),
        feedback.email,
        feedback.source,
        getFeedbackText(feedback),
        feedback.id,
      ]
        .map((value) => String(value ?? "").toLowerCase())
        .join(" ");

      return haystack.includes(search);
    });
  }, [feedbacks, feedbackSearch]);

  const feedbackSummary = useMemo(() => {
    const ratings = feedbacks
      .map((feedback) => numberValue(feedback.rating))
      .filter((rating) => rating > 0);

    const averageRating = ratings.length
      ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
      : 0;

    const fiveStar = ratings.filter((rating) => rating === 5).length;
    const fourPlus = ratings.filter((rating) => rating >= 4).length;
    const sourceCount = new Set(
      feedbacks.map((feedback) => String(feedback.source ?? "Unknown").trim() || "Unknown")
    ).size;

    return {
      total: feedbacks.length,
      averageRating,
      fiveStar,
      fourPlus,
      sourceCount,
    };
  }, [feedbacks]);

  const feedbackRatingBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: feedbacks.filter((feedback) => numberValue(feedback.rating) === rating).length,
    }));
  }, [feedbacks]);

  const openFeedback = (feedback: AdminFeedback) => {
    setSelectedFeedback(feedback);
    setIsFeedbackOpen(true);
  };

  const closeFeedback = () => {
    setIsFeedbackOpen(false);
    setSelectedFeedback(null);
  };

  const resetFeedbackSearch = () => setFeedbackSearch("");

  const toggleSort = (
    key: "points" | "calculations" | "updatedAt" | "name"
  ) => {
    if (sortBy === key) {
      setSortDirection((current) => (current === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(key);
      setSortDirection(key === "name" ? "asc" : "desc");
    }
  };

  const exportCsv = () => {
    const rows = [
      ["Rank", "Name", "Points", "Calculations", "Profile", "Last Update"],
      ...filteredUsers.map((user, index) => [
        index + 1,
        user.name || "Unknown Player",
        numberValue(user.points),
        numberValue(user.calculationCount || 1),
        user.profileUrl || "",
        formatDate(user.updatedAt),
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `arcade-nexus-users-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRangeFilter("all");
    setSortBy("points");
    setSortDirection("desc");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="google-spinner">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none" />
          </svg>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#1a1b1e] border border-[#2a2d32] rounded-2xl shadow-2xl w-full max-w-[420px] p-8">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M21.6 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.37a4.6 4.6 0 0 1-1.99 3.02v2.52h3.23c1.89-1.74 2.99-4.3 2.99-7.57Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 4.97-.89 6.61-2.42l-3.23-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.6A10 10 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M6.41 13.9A6.02 6.02 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.5H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.5l3.33-2.6Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.97 3.01 14.7 2 12 2a10 10 0 0 0-8.92 5.5l3.33 2.6C7.2 7.74 9.4 5.98 12 5.98Z"
                fill="#EA4335"
              />
            </svg>
          </div>

          <h1 className="text-[22px] font-bold text-white text-center tracking-tight">
            Arcade Nexus Admin
          </h1>
          <p className="text-[#8e949c] text-[14px] text-center mt-2 mb-6 leading-relaxed">
            Secure access to the Arcade Nexus moderation and analytics panel.
          </p>

          <button
            onClick={login}
            className={`w-full flex items-center justify-between px-4 py-3.5 bg-white text-[#202124] rounded-xl hover:bg-[#f1f3f4] transition-all shadow-sm font-bold ${
              shake ? "animate-hard-shake" : ""
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border border-[#dadce0] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.95h5.23a4.5 4.5 0 0 1-1.94 2.95v2.45h3.13c1.84-1.69 2.93-4.18 2.93-7.26Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 21.9c2.63 0 4.84-.87 6.45-2.37l-3.13-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.7-1.72-5.47-4.04H3.3v2.53A9.75 9.75 0 0 0 12 21.9Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.53 13.97A5.94 5.94 0 0 1 6.22 12c0-.69.12-1.36.31-1.97V7.5H3.3A9.8 9.8 0 0 0 2.25 12c0 1.62.39 3.15 1.05 4.5l3.23-2.53Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.99c1.44 0 2.74.5 3.76 1.48l2.82-2.82C16.83 3 14.62 2 12 2a9.75 9.75 0 0 0-8.7 5.5l3.23 2.53C7.3 7.71 9.45 5.99 12 5.99Z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              <span>Sign in with Google</span>
            </span>
            <span className="text-xs text-[#5f6368]">Admin only</span>
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/20 text-[#b42318] text-[13px] font-bold text-center">
              {error}
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes hardShake {
            0%,
            100% {
              transform: translateX(0);
            }
            20%,
            60% {
              transform: translateX(-6px);
            }
            40%,
            80% {
              transform: translateX(6px);
            }
          }

          .animate-hard-shake {
            animation: hardShake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#f7f7f8] overflow-y-auto font-sans text-[#111827] custom-scrollbar selection:bg-[#dbeafe] selection:text-[#1d4ed8]">
      <div className="w-full max-w-[1480px] mx-auto px-4 md:px-7 lg:px-9 py-6 md:py-8 pb-24">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-[#dadce0] pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[25px] font-bold tracking-tight">
                Arcade Nexus Admin
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isConnected
                    ? "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]"
                    : "bg-[#fce8e6] text-[#c5221f] border-[#f6aea8]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? "bg-[#3b82f6]" : "bg-[#ea4335]"
                  }`}
                />
                {isConnected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#5f6368]">
              Real-time user data, performance analytics and activity monitoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAnalytics((v) => !v)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                showAnalytics
                  ? "bg-[#202124] text-white border-[#202124]"
                  : "bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]"
              }`}
            >
              {showAnalytics ? "Hide Analytics" : "Analytics"}
            </button>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-full text-sm font-bold bg-white text-[#5f6368] border border-[#dadce0] hover:bg-[#f1f3f4] transition-all"
            >
              ← Back
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-full text-sm font-bold bg-[#ea4335] text-white hover:bg-[#d32f2f] transition-all shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-4 rounded-xl border border-[#f6aea8] bg-[#fce8e6] px-4 py-3 text-sm font-semibold text-[#c5221f]">
            {error}
          </div>
        )}

        {/* KPI CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 mt-7">
          {[
            ["Total Users", stats.totalUsers, "#1a73e8"],
            ["Active Today", stats.activeToday, "#3b82f6"],
            ["Total Points", stats.totalPoints, "#9334e6"],
            ["Calculations", stats.totalCalculations, "#ea4335"],
            ["Avg Points", stats.averagePoints, "#f29900"],
            ["Profiles Linked", stats.profilesLinked, "#00897b"],
          ].map(([label, value, accent]) => (
            <div
              key={String(label)}
              className="bg-white border border-[#dadce0] rounded-2xl p-4 shadow-sm"
            >
              <div
                className="w-8 h-1 rounded-full mb-3"
                style={{ background: accent as string }}
              />
              <p className="text-[11px] uppercase tracking-wider font-bold text-[#80868b]">
                {label}
              </p>
              <p className="text-[25px] leading-none font-bold mt-2 text-[#202124]">
                {formatNumber(Number(value))}
              </p>
            </div>
          ))}
        </section>

        {/* ANALYTICS */}
        {showAnalytics && (
          <section className="mt-5 space-y-5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[19px] font-semibold tracking-tight">Analytics</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] text-[10px] font-bold uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <p className="text-[12px] text-[#6b7280] mt-1">
                  Derived from the current Firebase leaderboard snapshot — no mock history.
                </p>
              </div>
              <div className="text-[11px] text-[#9aa0a6]">
                Updated in real time
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ["7D Active", `${analyticsSummary.activeRate}%`, `${analyticsSummary.active} users`],
                ["Median Points", formatNumber(analyticsSummary.medianPoints), "middle user"],
                ["Total Calculations", formatNumber(analyticsSummary.totalCalcs), "all users"],
                ["Top Points", formatNumber(maxPoints), "highest user"],
                ["Max Calculations", formatNumber(maxCalculations), "single user"],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-2xl bg-white border border-[#e5e7eb] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">{label}</p>
                  <p className="text-[22px] font-semibold tracking-tight mt-2 text-[#111827]">{value}</p>
                  <p className="text-[11px] text-[#6b7280] mt-1">{hint}</p>
                </div>
              ))}
            </div>

            <div className="grid xl:grid-cols-[1.1fr_1fr] gap-5">
              <div className="rounded-2xl bg-white border border-[#e5e7eb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-[15px] font-semibold">Activity Recency</h3>
                    <p className="text-[11px] text-[#9aa0a6] mt-1">
                      Users grouped by their latest <code className="font-mono text-[10px]">updatedAt</code>.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {activityBuckets.map((bucket) => {
                    const percentage = users.length
                      ? Math.round((bucket.count / users.length) * 100)
                      : 0;

                    return (
                      <div key={bucket.label}>
                        <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                          <span className="text-[#374151]">{bucket.label}</span>
                          <span className="text-[#6b7280]">{bucket.count} · {percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#2563eb] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-3 text-[11px] text-[#6b7280] leading-relaxed">
                  This panel reflects real timestamps that already exist in your documents. It does not fabricate hourly or daily events.
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#e5e7eb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-semibold">Top 10 · Maximum Calculations</h3>
                    <p className="text-[11px] text-[#9aa0a6] mt-1">
                      Users with the highest calculation count.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] px-2.5 py-1">
                    Top 10
                  </span>
                </div>

                <div className="space-y-1.5">
                  {topCalculators.length ? (
                    topCalculators.map((user, index) => {
                      const calc = numberValue(user.calculationCount || 1);
                      const width = Math.max(4, (calc / Math.max(maxCalculations, 1)) * 100);

                      return (
                        <button
                          key={user.id}
                          onClick={() => openUser(user, index + 1)}
                          className="w-full text-left rounded-xl p-2.5 hover:bg-[#f9fafb] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-[10px] font-bold text-[#9aa0a6] text-center">
                              {index + 1}
                            </span>
                            <img
                              src={user.photoURL || "/avatar.png"}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-[#e5e7eb]"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[12px] font-semibold truncate text-[#111827]">
                                {user.name || "Unknown Player"}
                              </span>
                              <span className="block text-[10px] text-[#9aa0a6] mt-0.5 truncate">
                                {numberValue(user.points)} points
                              </span>
                            </span>
                            <span className="text-[12px] font-semibold text-[#2563eb]">
                              {formatNumber(calc)}
                            </span>
                          </div>
                          <div className="mt-2 ml-8 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#60a5fa] group-hover:bg-[#2563eb] transition-all duration-300"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-10 text-center text-xs text-[#9aa0a6]">
                      No calculation data available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#e5e7eb] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-[15px] font-semibold">Top 10 · Points Leaderboard</h3>
                  <p className="text-[11px] text-[#9aa0a6] mt-1">
                    Current points ranking from the live collection.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                {topPointsUsers.map((user, index) => {
                  const points = numberValue(user.points);
                  const width = Math.max(4, (points / Math.max(maxPoints, 1)) * 100);

                  return (
                    <button
                      key={user.id}
                      onClick={() => openUser(user, index + 1)}
                      className="w-full text-left rounded-xl p-2.5 hover:bg-[#f9fafb] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#9aa0a6] w-5 text-center">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
                          {user.name || "Unknown Player"}
                        </span>
                        <span className="text-[12px] font-semibold text-[#111827]">
                          {formatNumber(points)}
                        </span>
                      </div>
                      <div className="mt-1.5 ml-8 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2563eb]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* USERS */}
        <section className="mt-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[19px] font-bold">User Data House</h2>
              <p className="text-[12px] text-[#80868b] mt-1">
                Showing {filteredUsers.length} of {users.length} users.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-[#dadce0] rounded-full p-1">
                {(["all", "today", "7d", "30d"] as RangeFilter[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setRangeFilter(range)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                      rangeFilter === range
                        ? "bg-[#202124] text-white"
                        : "text-[#5f6368] hover:bg-[#f1f3f4]"
                    }`}
                  >
                    {range === "all"
                      ? "All"
                      : range === "today"
                      ? "Today"
                      : range.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-white border border-[#dadce0] rounded-full px-3 py-2">
                <svg
                  className="w-4 h-4 text-[#80868b] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                  />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or profile..."
                  className="bg-transparent outline-none w-52 text-[12px] font-medium"
                />
              </div>

              <select
                value={`${sortBy}:${sortDirection}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split(":") as [
                    "points" | "calculations" | "updatedAt" | "name",
                    "desc" | "asc"
                  ];
                  setSortBy(key);
                  setSortDirection(direction);
                }}
                className="bg-white border border-[#dadce0] rounded-full px-3 py-2 text-[12px] font-bold text-[#5f6368] outline-none"
              >
                <option value="points:desc">Points ↓</option>
                <option value="points:asc">Points ↑</option>
                <option value="calculations:desc">Calculations ↓</option>
                <option value="calculations:asc">Calculations ↑</option>
                <option value="updatedAt:desc">Latest ↓</option>
                <option value="updatedAt:asc">Oldest ↑</option>
                <option value="name:asc">Name A–Z</option>
                <option value="name:desc">Name Z–A</option>
              </select>

              <button
                onClick={exportCsv}
                className="px-4 py-2 rounded-full bg-[#2563eb] text-white text-[12px] font-bold hover:bg-[#1d4ed8] transition-all"
              >
                Export CSV
              </button>

              {(searchQuery || rangeFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 rounded-full bg-white border border-[#dadce0] text-[12px] font-bold text-[#5f6368] hover:bg-[#f1f3f4]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#dadce0] overflow-hidden">
            <div className="w-full overflow-x-auto max-h-[720px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center p-20">
                  <div className="google-spinner">
                    <svg viewBox="25 25 50 50">
                      <circle cx="50" cy="50" r="20" fill="none" />
                    </svg>
                  </div>
                </div>
              ) : filteredUsers.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="sticky top-0 z-20 bg-[#2563eb]">
                    <tr>
                      <th className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold text-center">
                        Rank
                      </th>
                      <th
                        className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold cursor-pointer"
                        onClick={() => toggleSort("name")}
                      >
                        User
                      </th>
                      <th className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold">
                        Public Profile
                      </th>
                      <th
                        className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold text-center cursor-pointer"
                        onClick={() => toggleSort("points")}
                      >
                        Points
                      </th>
                      <th
                        className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold text-center cursor-pointer"
                        onClick={() => toggleSort("calculations")}
                      >
                        Calculations
                      </th>
                      <th
                        className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold cursor-pointer"
                        onClick={() => toggleSort("updatedAt")}
                      >
                        Last Update
                      </th>
                      <th className="px-5 py-4 text-[11px] text-white uppercase tracking-wider font-bold text-center">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#e8eaed]">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-[#f8f9fa] transition-colors"
                      >
                        <td className="px-5 py-4 text-sm font-bold text-[#80868b] text-center">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => openUser(user, index + 1)}
                            className="flex items-center gap-3 text-left"
                          >
                            <img
                              src={user.photoURL || "/avatar.png"}
                              alt=""
                              className="w-9 h-9 rounded-full border border-[#dadce0] object-cover"
                            />
                            <span>
                              <span className="block text-[14px] font-bold text-[#202124] hover:text-[#1a73e8]">
                                {user.name || "Unknown Player"}
                              </span>
                              <span className="block text-[11px] text-[#80868b] mt-0.5">
                                ID: {user.id.slice(0, 10)}
                                {user.id.length > 10 ? "…" : ""}
                              </span>
                            </span>
                          </button>
                        </td>

                        <td className="px-5 py-4 max-w-[240px]">
                          {user.profileUrl ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  copyProfile(user.id, user.profileUrl as string)
                                }
                                className="shrink-0 p-1.5 rounded-lg hover:bg-[#e8f0fe] text-[#5f6368] hover:text-[#1a73e8]"
                                title="Copy profile"
                              >
                                {copiedId === user.id ? "✓" : "⧉"}
                              </button>
                              <a
                                href={user.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-[12px] text-[#5f6368] hover:text-[#1a73e8] hover:underline"
                              >
                                {user.profileUrl}
                              </a>
                            </div>
                          ) : (
                            <span className="text-[12px] italic text-[#9aa0a6]">
                              No profile linked
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex min-w-16 justify-center px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] text-[12px] font-bold">
                            {formatNumber(numberValue(user.points))}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="text-[13px] font-bold text-[#3c4043]">
                            {formatNumber(numberValue(user.calculationCount || 1))}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-[12px] font-medium text-[#5f6368]">
                          {formatDate(user.updatedAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => openAnalytics(user, index + 1)}
                              className="p-2 rounded-lg text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe]"
                              title="View analytics"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 19V5m0 14h16M8 16v-3m4 3V8m4 8v-6"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => openUser(user, index + 1)}
                              className="p-2 rounded-lg text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                              title="View user"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#f1f3f4] mx-auto flex items-center justify-center text-xl">
                    🔎
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#3c4043]">
                    No users found
                  </p>
                  <p className="mt-1 text-xs text-[#80868b]">
                    Try clearing the search or date filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-5">
          <div className="bg-white border border-[#dadce0] rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[16px] font-bold">Recent Activity</h3>
                <p className="text-[12px] text-[#80868b] mt-1">
                  Latest `updatedAt` values from the live leaderboard.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1d4ed8] bg-[#eff6ff] px-2.5 py-1.5 rounded-full">
                Live
              </span>
            </div>

            <div className="space-y-2">
              {activityUsers.length ? (
                activityUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      const rank =
                        users
                          .slice()
                          .sort(
                            (a, b) =>
                              numberValue(b.points) - numberValue(a.points)
                          )
                          .findIndex((item) => item.id === user.id) + 1;
                      openUser(user, rank || 1);
                    }}
                    className="w-full flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#f8f9fa] text-left"
                  >
                    <img
                      src={user.photoURL || "/avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-full border border-[#dadce0] object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-bold truncate">
                        {user.name || "Unknown Player"}
                      </span>
                      <span className="block text-[11px] text-[#80868b] mt-0.5">
                        {formatDate(user.updatedAt)}
                      </span>
                    </span>
                    <span className="text-[12px] font-bold text-[#2563eb]">
                      {formatNumber(numberValue(user.points))} pts
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#80868b]">
                  No activity timestamps available.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#dadce0] rounded-2xl shadow-sm p-5">
            <h3 className="text-[16px] font-bold">System Snapshot</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-[#f8f9fa] border border-[#e8eaed] p-4">
                <p className="text-[11px] font-bold uppercase text-[#80868b]">
                  Firebase
                </p>
                <p
                  className={`mt-1 text-[16px] font-bold ${
                    isConnected ? "text-[#1d4ed8]" : "text-[#c5221f]"
                  }`}
                >
                  {isConnected ? "Connected" : "Not Connected"}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f9fa] border border-[#e8eaed] p-4">
                <p className="text-[11px] font-bold uppercase text-[#80868b]">
                  Data Source
                </p>
                <p className="mt-1 text-[16px] font-bold">leaderboard</p>
              </div>

              <div className="rounded-xl bg-[#f8f9fa] border border-[#e8eaed] p-4">
                <p className="text-[11px] font-bold uppercase text-[#80868b]">
                  Top Points
                </p>
                <p className="mt-1 text-[16px] font-bold text-[#1a73e8]">
                  {formatNumber(maxPoints)}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f9fa] border border-[#e8eaed] p-4">
                <p className="text-[11px] font-bold uppercase text-[#80868b]">
                  Max Calculations
                </p>
                <p className="mt-1 text-[16px] font-bold text-[#ea4335]">
                  {formatNumber(maxCalculations)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

        {/* PLATFORM FEEDBACK */}
        <section className="mt-6">
          <div className="bg-white border border-[#dadce0] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[#e5e7eb]">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-[19px] font-bold tracking-tight">Platform Feedback</h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Live
                    </span>
                  </div>
                  <p className="text-[12px] text-[#80868b] mt-1.5">
                    All feedback stored in your Firebase <code className="font-mono text-[10px]">platform_feedback</code> collection. Click any entry to open full insights.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-white border border-[#dadce0] rounded-full px-3 py-2 min-w-[220px]">
                    <svg
                      className="w-4 h-4 text-[#80868b] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                      />
                    </svg>
                    <input
                      value={feedbackSearch}
                      onChange={(e) => setFeedbackSearch(e.target.value)}
                      placeholder="Search feedback..."
                      className="bg-transparent outline-none w-full text-[12px] font-medium"
                    />
                  </div>
                  {feedbackSearch && (
                    <button
                      onClick={resetFeedbackSearch}
                      className="px-3 py-2 rounded-full bg-white border border-[#dadce0] text-[12px] font-bold text-[#5f6368] hover:bg-[#f1f3f4]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">Total Feedback</p>
                  <p className="text-[24px] font-semibold mt-2 text-[#111827]">{formatNumber(feedbackSummary.total)}</p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">Average Rating</p>
                  <p className="text-[24px] font-semibold mt-2 text-[#f59e0b]">{feedbackSummary.averageRating || "—"}<span className="text-[14px] ml-1 text-[#9aa0a6]">/ 5</span></p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">5-Star</p>
                  <p className="text-[24px] font-semibold mt-2 text-[#2563eb]">{formatNumber(feedbackSummary.fiveStar)}</p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">Sources</p>
                  <p className="text-[24px] font-semibold mt-2 text-[#111827]">{formatNumber(feedbackSummary.sourceCount)}</p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {feedbackLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="google-spinner">
                    <svg viewBox="25 25 50 50">
                      <circle cx="50" cy="50" r="20" fill="none" />
                    </svg>
                  </div>
                </div>
              ) : feedbackError ? (
                <div className="rounded-2xl border border-[#f6aea8] bg-[#fce8e6] px-4 py-5 text-center">
                  <p className="text-sm font-bold text-[#c5221f]">{feedbackError}</p>
                  <p className="text-xs text-[#8b1e1e] mt-1">Check Firestore permissions for the <code className="font-mono">platform_feedback</code> collection.</p>
                </div>
              ) : filteredFeedbacks.length ? (
                <div className="space-y-2.5 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredFeedbacks.map((feedback, index) => {
                    const rating = Math.min(5, Math.max(0, numberValue(feedback.rating)));
                    const text = getFeedbackText(feedback);
                    const identity = getFeedbackIdentity(feedback);
                    const feedbackDate = getFeedbackDate(feedback);

                    return (
                      <button
                        key={feedback.id}
                        onClick={() => openFeedback(feedback)}
                        className="w-full text-left rounded-2xl border border-[#e5e7eb] bg-white p-4 md:p-5 hover:border-[#bfdbfe] hover:bg-[#f8fbff] hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-bold text-sm border border-[#dbeafe]">
                            {identity.slice(0, 1).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-[#202124] truncate">{identity}</p>
                                <p className="text-[10px] text-[#9aa0a6] mt-0.5 truncate">
                                  {feedback.email ? feedback.email : `Feedback #${formatNumber(filteredFeedbacks.length - index)}`}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] font-bold text-[#f59e0b] tracking-[0.08em]">
                                  {"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}
                                </span>
                                <span className="text-[10px] font-bold text-[#6b7280]">{rating ? `${rating}/5` : "No rating"}</span>
                              </div>
                            </div>

                            <p className="mt-3 text-[12px] leading-5 text-[#4b5563] line-clamp-2">
                              {text}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#80868b]">
                              {feedback.source && (
                                <span className="px-2 py-1 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] font-semibold">
                                  {String(feedback.source)}
                                </span>
                              )}
                              {feedbackDate && <span>{formatDate(feedbackDate)}</span>}
                              <span className="ml-auto text-[#2563eb] font-bold opacity-0 group-hover:opacity-100 transition-opacity">View insights →</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-14 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#f1f3f4] mx-auto flex items-center justify-center text-xl">
                    💬
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#3c4043]">No feedback found</p>
                  <p className="mt-1 text-xs text-[#80868b]">{feedbackSearch ? "Try a different search." : "No documents are available in platform_feedback yet."}</p>
                </div>
              )}
            </div>
          </div>
        </section>


      {/* USER DRAWER */}
      {isDrawerOpen && selectedUser && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="fixed top-0 right-0 z-[210] h-full w-full sm:w-[410px] bg-white shadow-2xl border-l border-[#dadce0] flex flex-col">
            <div className="p-5 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#80868b]">
                  User Profile
                </p>
                <h2 className="text-[18px] font-bold mt-0.5">User Details</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-[#e8eaed] text-[#5f6368]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser.photoURL || "/avatar.png"}
                  alt=""
                  className="w-24 h-24 rounded-full border-4 border-[#e8f0fe] object-cover shadow-sm"
                />
                <h3 className="mt-4 text-[21px] font-bold text-center">
                  {selectedUser.name || "Unknown Player"}
                </h3>
                <span className="mt-1 text-[12px] text-[#80868b]">
                  Rank #{selectedUser.rank}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-7">
                <div className="rounded-2xl bg-[#eff6ff] p-4">
                  <p className="text-[11px] font-bold uppercase text-[#1d4ed8]">
                    Points
                  </p>
                  <p className="text-[25px] font-bold mt-1 text-[#2563eb]">
                    {formatNumber(numberValue(selectedUser.points))}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#e8f0fe] p-4">
                  <p className="text-[11px] font-bold uppercase text-[#1a73e8]">
                    Rank
                  </p>
                  <p className="text-[25px] font-bold mt-1 text-[#1a73e8]">
                    #{selectedUser.rank}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#fce8e6] p-4 col-span-2">
                  <p className="text-[11px] font-bold uppercase text-[#c5221f]">
                    Calculations
                  </p>
                  <p className="text-[23px] font-bold mt-1 text-[#ea4335]">
                    {formatNumber(
                      numberValue(selectedUser.calculationCount || 1)
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#80868b]">
                    Last Update
                  </p>
                  <p className="text-[14px] font-medium mt-1">
                    {formatDate(selectedUser.updatedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#80868b]">
                    User ID
                  </p>
                  <p className="text-[13px] font-mono break-all mt-1 text-[#3c4043]">
                    {selectedUser.id}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#80868b]">
                    Public Profile
                  </p>
                  {selectedUser.profileUrl ? (
                    <a
                      href={selectedUser.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[13px] text-[#1a73e8] hover:underline break-all mt-1"
                    >
                      {selectedUser.profileUrl}
                    </a>
                  ) : (
                    <p className="text-[13px] text-[#9aa0a6] mt-1">
                      No profile linked
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#dadce0] bg-[#f8f9fa] space-y-2.5">
              {selectedUser.profileUrl && (
                <>
                  <a
                    href={selectedUser.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 rounded-xl bg-[#1a73e8] text-white font-bold hover:bg-[#1557b0]"
                  >
                    Open Profile
                  </a>
                  <button
                    onClick={() =>
                      copyProfile(
                        selectedUser.id,
                        selectedUser.profileUrl as string
                      )
                    }
                    className="w-full py-3 rounded-xl bg-white border border-[#dadce0] font-bold text-[#5f6368] hover:bg-[#f1f3f4]"
                  >
                    {copiedId === selectedUser.id
                      ? "Copied!"
                      : "Copy Profile Link"}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  openAnalytics(selectedUser, selectedUser.rank || 1);
                }}
                className="w-full py-3 rounded-xl bg-[#202124] text-white font-bold hover:bg-black"
              >
                View Analytics
              </button>
            </div>
          </aside>
        </>
      )}

      {/* USER ANALYTICS MODAL */}
      {isAnalyticsOpen && analyticsUser && (
        <div className="fixed inset-0 z-[300] bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#e5e7eb] shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e5e7eb] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#9aa0a6]">User analytics</p>
                <h2 className="text-[18px] font-semibold tracking-tight mt-1">
                  {analyticsUser.name || "Unknown Player"}
                </h2>
              </div>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-[#f3f4f6] text-[#6b7280] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Points", formatNumber(numberValue(analyticsUser.points))],
                  ["Calculations", formatNumber(numberValue(analyticsUser.calculationCount || 1))],
                  ["Rank", `#${analyticsUser.rank}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#9aa0a6]">{label}</p>
                    <p className="text-[23px] font-semibold tracking-tight mt-2">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#e5e7eb] p-4">
                  <div className="flex justify-between text-[11px] font-medium mb-2">
                    <span>Points vs #1</span>
                    <span>
                      {maxPoints
                        ? Math.round((numberValue(analyticsUser.points) / maxPoints) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563eb]"
                      style={{
                        width: `${
                          maxPoints
                            ? Math.max(
                                2,
                                Math.min(100, (numberValue(analyticsUser.points) / maxPoints) * 100)
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e5e7eb] p-4">
                  <div className="flex justify-between text-[11px] font-medium mb-2">
                    <span>Calculations vs max</span>
                    <span>
                      {maxCalculations
                        ? Math.round(
                            (numberValue(analyticsUser.calculationCount || 1) /
                              maxCalculations) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#60a5fa]"
                      style={{
                        width: `${
                          maxCalculations
                            ? Math.max(
                                2,
                                Math.min(
                                  100,
                                  (numberValue(analyticsUser.calculationCount || 1) /
                                    maxCalculations) *
                                    100
                                )
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#e5e7eb] p-4 bg-white">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#9aa0a6]">Points / calc</p>
                  <p className="text-[18px] font-semibold mt-1 text-[#2563eb]">
                    {formatNumber(
                      Math.round(
                        numberValue(analyticsUser.points) /
                          Math.max(1, numberValue(analyticsUser.calculationCount || 1))
                      )
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] p-4 bg-white">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#9aa0a6]">Last update</p>
                  <p className="text-[12px] font-semibold mt-2">{formatDate(analyticsUser.updatedAt)}</p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] p-4 bg-white">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#9aa0a6]">Profile</p>
                  <p className="text-[12px] font-semibold mt-2">
                    {analyticsUser.profileUrl ? "Linked" : "Missing"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#f7f7f8] border border-[#e5e7eb] p-4">
                <p className="text-[11px] leading-relaxed text-[#6b7280]">
                  Analytics are computed from the fields currently present in this user's
                  <code className="font-mono mx-1 text-[10px]">leaderboard</code>
                  document. Historical daily activity is shown only when the database actually stores historical timestamps/events.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#e5e7eb] bg-[#fafafa] flex flex-col sm:flex-row gap-2">
              {analyticsUser.profileUrl && (
                <a
                  href={analyticsUser.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-black transition-colors"
                >
                  Open Profile
                </a>
              )}
              <button
                onClick={() => {
                  setIsAnalyticsOpen(false);
                  openUser(analyticsUser, analyticsUser.rank || 1);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#d1d5db] bg-white text-[#374151] text-[12px] font-semibold hover:bg-[#f3f4f6] transition-colors"
              >
                Open User Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK INSIGHTS MODAL */}
      {isFeedbackOpen && selectedFeedback && (
        <div
          className="fixed inset-0 z-[400] bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFeedback();
          }}
        >
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl border border-[#e5e7eb] shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[#e5e7eb] flex items-start justify-between gap-4 bg-[#fafafa]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#9aa0a6]">Feedback insights</p>
                <h2 className="text-[19px] font-semibold tracking-tight mt-1 truncate">
                  {getFeedbackIdentity(selectedFeedback)}
                </h2>
                {selectedFeedback.email && (
                  <p className="text-[11px] text-[#80868b] mt-1 truncate">{selectedFeedback.email}</p>
                )}
              </div>

              <button
                onClick={closeFeedback}
                className="w-9 h-9 shrink-0 rounded-full hover:bg-[#e5e7eb] text-[#6b7280] transition-colors"
                aria-label="Close feedback insights"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fffaf0] p-4 col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#9aa0a6]">Rating</p>
                  <p className="text-[21px] font-semibold mt-2 text-[#f59e0b]">
                    {numberValue(selectedFeedback.rating) > 0 ? `${numberValue(selectedFeedback.rating)}/5` : "—"}
                  </p>
                  <p className="text-[11px] mt-1 tracking-[0.08em] text-[#f59e0b]">
                    {"★".repeat(Math.min(5, Math.max(0, numberValue(selectedFeedback.rating))))}
                    {"☆".repeat(Math.max(0, 5 - Math.min(5, Math.max(0, numberValue(selectedFeedback.rating)))))}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#9aa0a6]">Source</p>
                  <p className="text-[13px] font-semibold mt-2 break-words">{formatFeedbackValue(selectedFeedback.source)}</p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#9aa0a6]">Submitted</p>
                  <p className="text-[12px] font-semibold mt-2 leading-5">
                    {getFeedbackDate(selectedFeedback) ? formatDate(getFeedbackDate(selectedFeedback)) : formatFeedbackValue(selectedFeedback.date)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#1d4ed8]">User message</p>
                  <span className="text-[10px] font-semibold text-[#93a3b8]">Document: {selectedFeedback.id}</span>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[#374151] whitespace-pre-wrap break-words">
                  {getFeedbackText(selectedFeedback)}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold">Rating distribution</h3>
                    <p className="text-[10px] text-[#9aa0a6] mt-1">Across all feedback currently in Firebase.</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#2563eb]">{formatNumber(feedbackSummary.total)} total</span>
                </div>

                <div className="space-y-2.5">
                  {feedbackRatingBreakdown.map((item) => {
                    const percentage = feedbackSummary.total
                      ? Math.round((item.count / feedbackSummary.total) * 100)
                      : 0;

                    return (
                      <div key={item.rating}>
                        <div className="flex items-center justify-between text-[10px] font-semibold mb-1.5">
                          <span className="text-[#4b5563]">{item.rating} star</span>
                          <span className="text-[#6b7280]">{item.count} · {percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#f59e0b] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold">Stored fields</h3>
                    <p className="text-[10px] text-[#9aa0a6] mt-1">Everything saved in this feedback document.</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">Raw data</span>
                </div>

                <div className="rounded-2xl border border-[#e5e7eb] overflow-hidden">
                  {Object.entries(selectedFeedback)
                    .filter(([key]) => key !== "message" && key !== "feedback" && key !== "comment" && key !== "review" && key !== "text")
                    .map(([key, value], index, entries) => (
                      <div
                        key={key}
                        className={`grid grid-cols-[120px_minmax(0,1fr)] gap-4 px-4 py-3 text-[11px] ${
                          index !== entries.length - 1 ? "border-b border-[#eef0f2]" : ""
                        }`}
                      >
                        <span className="font-bold text-[#6b7280] break-words">{key}</span>
                        <span className="text-[#202124] break-words">{formatFeedbackValue(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#e5e7eb] bg-[#fafafa] flex items-center justify-end">
              <button
                onClick={closeFeedback}
                className="px-4 py-2.5 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-black transition-colors"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dadce0;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9aa0a6;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
          }
          100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
          }
        }

        .google-spinner {
          width: 50px;
          height: 50px;
          animation: rotate 2s linear infinite;
        }

        .google-spinner circle {
          stroke: #2563eb;
          stroke-width: 4;
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
          animation: dash 1.5s ease-in-out infinite;
          stroke-linecap: round;
        }

        @keyframes hardShake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-6px);
          }
          40%,
          80% {
            transform: translateX(6px);
          }
        }

        .animate-hard-shake {
          animation: hardShake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
