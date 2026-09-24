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
  ChevronDown,
  X,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  CornerDownRight,
} from "lucide-react";

import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

type Interaction = {
  type: "like" | "comment";
  byName: string;
  timestamp: number;
};

type Leader = {
  id: string;
  rank: number;
  name?: string;
  photoURL?: string;
  points?: number;
  likesCount?: number;
  likedBy?: string[];
  lastInteraction?: Interaction;
  hasNewLikes?: boolean;
  calculationCount?: number;
  profileUrl?: string;
  createdAt?: number | string | { seconds?: number };
  updatedAt?: number | string | { seconds?: number };
};

type CommentReply = {
  id: string;
  authorName: string;
  authorPhoto: string;
  text: string;
  timestamp: number;
};

type Comment = {
  id: string;
  authorName: string;
  authorPhoto: string;
  text: string;
  timestamp: number;
  replies?: CommentReply[];
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

function FloatingHearts() {
  return (
    <div className="absolute left-1/2 bottom-full -translate-x-1/2 pointer-events-none z-50 w-[40px] h-[40px]">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="absolute text-red-500 animate-float-heart drop-shadow-sm whitespace-nowrap"
          style={{
            left: `${-5 + Math.random() * 20}px`,
            bottom: `0px`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: `3s`,
            fontSize: `${14 + Math.random() * 6}px`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [arcadeLeaders, setArcadeLeaders] = useState<Leader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserUniqueId, setCurrentUserUniqueId] = useState<string | null>(null);
  const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortMode, setSortMode] = useState<
    "points-desc" | "points-asc" | "latest" | "oldest"
  >("points-desc");

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
        if (parsed.photoURL) setCurrentUserPhoto(parsed.photoURL);
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

  const currentUserData = arcadeLeaders.find((user) => isExactCurrentUser(user));

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

    if (!query) list = [...rankedArcade];

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

  return (
    <div className="flex flex-col h-screen bg-[#f7f9fc] text-[#202124] overflow-hidden font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif] relative">
      <header className="h-[66px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 md:px-7 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-5 md:gap-9">
          <div className="font-bold text-[15px] md:text-[17px] tracking-tight text-[#202124] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Trophy className="w-[17px] h-[17px] text-blue-600" />
            </div>
            <span className="hidden sm:inline">ARCADE HUB</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 md:gap-4">
          <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all">
            <Bell className="w-[17px] h-[17px]" />
          </button>
          <div className="flex items-center gap-2.5 pl-3 md:pl-4 border-l border-gray-200">
            <img
              src={currentUserData?.photoURL || currentUserPhoto || "/avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-gray-100"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full max-w-[1000px] mx-auto p-4 md:p-8">
          <section className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-5 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.15em] mb-1">
                  Arcade Rankings
                </p>
                <h1 className="text-[26px] font-semibold tracking-tight text-gray-900">
                  Leaderboard
                </h1>
                <p className="text-[13px] text-gray-500 mt-1">
                  Live community standings and activity.
                </p>
              </div>

              <div className="flex flex-1 w-full md:w-auto items-center gap-4 justify-end">
                <div className="relative w-full max-w-[320px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-full py-2.5 pl-11 pr-10 text-[13px] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="hidden lg:flex items-center gap-5 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Members</span>
                    <span className="text-[14px] font-bold text-blue-600">{arcadeLeaders.length}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Your Rank</span>
                    <span className="text-[14px] font-bold text-blue-600">{currentRankedUser?.rank || "--"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {arcadeLeaders.length > 0 && (
            <section className="bg-white border border-gray-100 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                <h2 className="text-[16px] font-semibold text-gray-900">
                  Community Standings
                </h2>
                
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex items-center gap-2 h-9 rounded-full border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <span>
                      {sortMode === "points-desc" ? "Points ↓" : sortMode === "points-asc" ? "Points ↑" : sortMode === "latest" ? "Latest ↓" : "Oldest ↑"}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isSortOpen && (
                    <div className="absolute right-0 top-[44px] z-50 w-[150px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg py-1">
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
                          onClick={() => { setSortMode(value); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${sortMode === value ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-20 text-center">Rank</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center w-40">Interact</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {displayList.map((user) => (
                      <LeaderTableRow
                        key={user.id}
                        user={user}
                        isCurrentUser={isExactCurrentUser(user)}
                        currentSessionId={currentUserUniqueId || "guest"}
                        currentSessionName={currentUserName || "Guest"}
                        currentSessionPhoto={currentUserPhoto || currentUserData?.photoURL || "/avatar.png"}
                        innerRef={isExactCurrentUser(user) ? currentUserRef : undefined}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        
        @keyframes floatHeart {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 1; transform: translateY(-10px) scale(1.1); }
          80% { opacity: 0.8; }
          100% { transform: translateY(-60px) scale(1); opacity: 0; }
        }
        .animate-float-heart {
          animation: floatHeart cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes tooltipFadeUp {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-tooltip {
          animation: tooltipFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

function LeaderTableRow({
  user,
  isCurrentUser = false,
  currentSessionId,
  currentSessionName,
  currentSessionPhoto,
  innerRef,
}: {
  user: Leader;
  isCurrentUser?: boolean;
  currentSessionId: string;
  currentSessionName: string;
  currentSessionPhoto: string;
  innerRef?: React.RefObject<HTMLTableRowElement | null>;
}) {
  const isTop3 = user.rank <= 3;
  
  const hasLiked = (user.likedBy || []).includes(currentSessionId);
  const likesCount = user.likesCount || 0; 
  
  const [showRowHearts, setShowRowHearts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentsCount, setCommentsCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // State to track if someone interacted with YOUR profile recently
  const [recentInteraction, setRecentInteraction] = useState<Interaction | null>(null);

  // Check for recent interactions on the current user's profile
  useEffect(() => {
    if (isCurrentUser && user.lastInteraction) {
      const interaction = user.lastInteraction;
      const timeDiff = Date.now() - interaction.timestamp;
      
      // If within 1.5 minutes (90,000 ms) and it wasn't done by the user themselves
      if (timeDiff < 90000 && interaction.byName !== currentSessionName) {
        setRecentInteraction(interaction);
        const timer = setTimeout(() => {
          setRecentInteraction(null);
        }, 90000);
        return () => clearTimeout(timer);
      }
    }
  }, [user.lastInteraction, isCurrentUser, currentSessionName]);

  useEffect(() => {
    if (!showComments) return;
    const commentsRef = collection(db, "leaderboard", user.id, "comments");
    const q = query(commentsRef, orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      setComments(fetchedComments);
      
      let total = fetchedComments.length;
      fetchedComments.forEach(c => {
        if (c.replies) total += c.replies.length;
      });
      setCommentsCount(total);
    });

    return () => unsubscribe();
  }, [showComments, user.id]);

  useEffect(() => {
    const commentsRef = collection(db, "leaderboard", user.id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      let total = snapshot.size;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.replies) total += data.replies.length;
      });
      setCommentsCount(total);
    });
    return () => unsubscribe();
  }, [user.id]);

  const handleLike = async () => {
    if (isCurrentUser) return; 

    try {
      const userRef = doc(db, "leaderboard", user.id);
      
      if (hasLiked) {
        await updateDoc(userRef, {
          likedBy: arrayRemove(currentSessionId),
          likesCount: increment(-1)
        });
      } else {
        await updateDoc(userRef, {
          likedBy: arrayUnion(currentSessionId),
          likesCount: increment(1),
          lastInteraction: {
            type: "like",
            byName: currentSessionName,
            timestamp: Date.now()
          }
        });
        
        setShowRowHearts(true);
        setTimeout(() => setShowRowHearts(false), 3000);
      }
    } catch (error) {
      console.error("Error updating likes", error);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const textToSubmit = commentText;
    setCommentText("");
    setShowComments(false);
    
    try {
      if (replyingTo) {
        const commentRef = doc(db, "leaderboard", user.id, "comments", replyingTo);
        const newReply: CommentReply = {
          id: Date.now().toString(),
          authorName: currentSessionName,
          authorPhoto: currentSessionPhoto,
          text: textToSubmit,
          timestamp: Date.now(),
        };
        await updateDoc(commentRef, {
          replies: arrayUnion(newReply)
        });
        setReplyingTo(null);
      } else {
        const newComment = {
          authorName: currentSessionName,
          authorPhoto: currentSessionPhoto,
          text: textToSubmit,
          timestamp: Date.now(),
          replies: []
        };
        const commentsRef = collection(db, "leaderboard", user.id, "comments");
        await addDoc(commentsRef, newComment);
      }

      if (!isCurrentUser) {
        await updateDoc(doc(db, "leaderboard", user.id), {
          lastInteraction: {
            type: "comment",
            byName: currentSessionName,
            timestamp: Date.now()
          }
        });
      }
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const commentRef = doc(db, "leaderboard", user.id, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const handleDeleteReply = async (parentId: string, replyObj: CommentReply) => {
    try {
      const commentRef = doc(db, "leaderboard", user.id, "comments", parentId);
      await updateDoc(commentRef, {
        replies: arrayRemove(replyObj)
      });
    } catch (error) {
      console.error("Error deleting reply", error);
    }
  };

  let rankIcon = <span className="text-gray-500 font-semibold text-[14px]">{user.rank}</span>;
  if (user.rank === 1) rankIcon = <span className="text-amber-500 font-bold flex items-center justify-center gap-1"><Trophy className="w-4 h-4" />1</span>;
  if (user.rank === 2) rankIcon = <span className="text-slate-400 font-bold flex items-center justify-center gap-1"><Trophy className="w-4 h-4" />2</span>;
  if (user.rank === 3) rankIcon = <span className="text-amber-700 font-bold flex items-center justify-center gap-1"><Trophy className="w-4 h-4" />3</span>;

  return (
    <>
      <tr 
        ref={innerRef}
        className={`transition-colors relative group hover:bg-gray-50/50 ${isCurrentUser ? "bg-blue-50/30" : "bg-white"} ${showComments ? 'border-b-0' : ''}`}
      >
        <td className="px-6 py-4 align-middle text-center w-20 relative">
          {rankIcon}
        </td>

        <td className="px-6 py-4 align-middle relative">
          {/* Clean, Tooltip-style Notification attached directly to the user's row */}
          {isCurrentUser && recentInteraction && (
            <div className="absolute left-6 -top-10 z-50 animate-tooltip pointer-events-none">
              <div className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 whitespace-nowrap">
                {recentInteraction.type === 'like' ? (
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                ) : (
                  <MessageCircle className="w-3.5 h-3.5 text-blue-400 fill-current" />
                )}
                <span>
                  <span className="font-semibold">{recentInteraction.byName}</span>{' '}
                  {recentInteraction.type === 'like' ? 'liked your profile!' : 'commented!'}
                </span>
                {/* Tooltip arrow pointing down at the user */}
                <div className="absolute -bottom-1 left-6 w-2.5 h-2.5 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || "/avatar.png"}
              alt={user.name || "Player"}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/avatar.png"; }}
            />
            <div className="min-w-0">
              <div className="flex items-center">
                <span className={`text-[14px] font-semibold truncate ${isTop3 ? "text-gray-900" : "text-gray-700"}`}>
                  {user.name || "Anonymous"}
                </span>
                {isCurrentUser && (
                  <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                    You
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 align-middle text-center">
          <div className="flex items-center justify-center gap-1.5">
            <div className="relative">
              <button 
                onClick={handleLike}
                disabled={isCurrentUser}
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-all px-3 py-1.5 rounded-full 
                  ${isCurrentUser ? 'opacity-50 cursor-not-allowed text-gray-400' : 
                    hasLiked ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100'}`}
                title={isCurrentUser ? "You cannot like your own profile" : "Like this profile"}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>
              {showRowHearts && <FloatingHearts />}
            </div>
            
            <button 
              onClick={() => {
                setShowComments(!showComments);
                setReplyingTo(null);
              }}
              className={`flex items-center gap-1.5 text-[13px] font-medium transition-all px-3 py-1.5 rounded-full ${showComments ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{commentsCount}</span>
            </button>
          </div>
        </td>

        <td className="px-6 py-4 text-right align-middle">
          <span className={`text-[15px] font-bold ${isTop3 ? "text-blue-600" : "text-gray-800"}`}>
            {formatNumber(safeNumber(user.points))}
          </span>
        </td>
      </tr>

      {showComments && (
        <tr className="bg-gray-50/50 border-b border-gray-100">
          <td colSpan={4} className="p-0">
            <div className="px-8 py-5 pl-[84px] max-w-2xl">
              <form onSubmit={handlePostComment} className="flex gap-3 mb-5">
                <img src={currentSessionPhoto} alt="You" className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" />
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={replyingTo ? "Write a reply..." : "Add a friendly comment..."}
                    className="w-full bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-[13px] shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button type="submit" disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 disabled:text-gray-300 hover:bg-blue-50 rounded-full transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {replyingTo && (
                  <button 
                    type="button" 
                    onClick={() => setReplyingTo(null)} 
                    className="text-[12px] text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="text-[13px]">
                    <div className="flex gap-3 group">
                      <img src={comment.authorPhoto} alt="User" className="w-8 h-8 rounded-full border border-gray-200 shrink-0" onError={(e) => (e.currentTarget.src = "/avatar.png")} />
                      <div className="flex-1">
                        <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm inline-block">
                          <span className="font-semibold text-gray-900 mr-2">{comment.authorName}</span>
                          <span className="text-gray-700">{comment.text}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 ml-2">
                          <button 
                            onClick={() => {
                              setReplyingTo(comment.id);
                              setCommentText("");
                            }} 
                            className="text-[11px] font-medium text-gray-500 hover:text-blue-600"
                          >
                            Reply
                          </button>
                          {comment.authorName === currentSessionName && (
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-[11px] font-medium text-gray-400 hover:text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-11 mt-3 space-y-3">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2.5 group">
                            <CornerDownRight className="w-4 h-4 text-gray-300 shrink-0 mt-1.5" />
                            <img src={reply.authorPhoto} alt="User" className="w-6 h-6 rounded-full border border-gray-200 shrink-0" onError={(e) => (e.currentTarget.src = "/avatar.png")} />
                            <div className="flex-1">
                              <div className="bg-white border border-gray-100 px-3.5 py-2 rounded-[14px] rounded-tl-sm shadow-sm inline-block">
                                <span className="font-semibold text-gray-900 mr-2 text-[12px]">{reply.authorName}</span>
                                <span className="text-gray-700 text-[12px]">{reply.text}</span>
                              </div>
                              {reply.authorName === currentSessionName && (
                                <div className="mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleDeleteReply(comment.id, reply)} className="text-[10px] font-medium text-gray-400 hover:text-red-500 flex items-center gap-1">
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-[13px] text-gray-400 italic">No comments yet. Start the conversation!</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}