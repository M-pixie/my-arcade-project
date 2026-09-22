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
} from "lucide-react";

// TERA FIREBASE IMPORT - Isko apne project ke according adjust kar lena
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
  deleteDoc 
} from "firebase/firestore";

type Leader = {
  id: string;
  rank: number;
  name?: string;
  photoURL?: string;
  points?: number;
  likesCount?: number; 
  hasNewLikes?: boolean; 
  calculationCount?: number;
  profileUrl?: string;
  createdAt?: number | string | { seconds?: number };
  updatedAt?: number | string | { seconds?: number };
};

type Comment = {
  id: string;
  authorName: string;
  authorPhoto: string;
  text: string;
  timestamp: number;
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
    <div className="absolute left-1/2 bottom-full -translate-x-1/2 pointer-events-none z-50 w-[60px] h-[60px]">
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="absolute text-red-500 animate-float-heart drop-shadow-sm whitespace-nowrap"
          style={{
            left: `${-10 + Math.random() * 40}px`,
            bottom: `0px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
            fontSize: `${10 + Math.random() * 8}px`,
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

  const currentUserData = arcadeLeaders.find((user) => isExactCurrentUser(user));
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
    <div className="flex flex-col h-screen bg-[#f7f9fc] text-[#202124] overflow-hidden font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif]">
      <header className="h-[66px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 md:px-7 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-5 md:gap-9">
          <div className="font-bold text-[15px] md:text-[17px] tracking-tight text-[#202124] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Trophy className="w-[17px] h-[17px] text-blue-600" />
            </div>
            <span className="hidden sm:inline">ARCADE HUB</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#6b7280]">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/calculator" className="hover:text-blue-600 transition-colors">Calculator</Link>
            <span className="text-blue-600 font-semibold">Leaderboard</span>
          </nav>
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

                <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
                  <Medal className="w-4 h-4" />
                  <span className="text-[13px] font-semibold">Arcade</span>
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
                        innerRef={isExactCurrentUser(user) ? currentUserRef : undefined}
                        currentSessionName={currentUserName || "Guest"}
                        currentSessionPhoto={currentUserPhoto || currentUserData?.photoURL || "/avatar.png"}
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
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
        }
        .animate-float-heart {
          animation: floatHeart linear forwards infinite;
        }
      `}</style>
    </div>
  );
}

function LeaderTableRow({
  user,
  isCurrentUser = false,
  innerRef,
  currentSessionName,
  currentSessionPhoto,
}: {
  user: Leader;
  isCurrentUser?: boolean;
  innerRef?: React.RefObject<HTMLTableRowElement | null>;
  currentSessionName: string;
  currentSessionPhoto: string;
}) {
  const isTop3 = user.rank <= 3;
  
  // Realtime likes state
  const [likesCount, setLikesCount] = useState(user.likesCount || 0); 
  const [isLiked, setIsLiked] = useState(false);
  
  const [showRowHearts, setShowRowHearts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentsCount, setCommentsCount] = useState(0);

  // Sync likes count with Firebase live updates
  useEffect(() => {
    setLikesCount(user.likesCount || 0);
    if (user.hasNewLikes) {
      setShowRowHearts(true);
      const timer = setTimeout(() => setShowRowHearts(false), 60000);
      return () => clearTimeout(timer);
    }
  }, [user.likesCount, user.hasNewLikes]);

  // Fetch comments in realtime when the section is opened
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
      setCommentsCount(fetchedComments.length);
    });

    return () => unsubscribe();
  }, [showComments, user.id]);

  // Quick fetch just for comments count without opening
  useEffect(() => {
    const commentsRef = collection(db, "leaderboard", user.id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      setCommentsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [user.id]);

  // Handle Like - Update in Firestore
  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Optimistic local update
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    if (newLikedState) {
      setShowRowHearts(true);
      setTimeout(() => setShowRowHearts(false), 60000);
    } else {
      setShowRowHearts(false);
    }

    // Backend update
    try {
      const userRef = doc(db, "leaderboard", user.id);
      await updateDoc(userRef, {
        likesCount: increment(newLikedState ? 1 : -1),
        hasNewLikes: newLikedState // Trigger animation for everyone viewing
      });
    } catch (error) {
      console.error("Error updating likes", error);
    }
  };

  // Handle Comment - Save to Firestore
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      authorName: currentSessionName,
      authorPhoto: currentSessionPhoto,
      text: commentText,
      timestamp: Date.now(),
    };
    
    setCommentText("");
    setShowComments(false); // Immediate close after post
    
    try {
      const commentsRef = collection(db, "leaderboard", user.id, "comments");
      await addDoc(commentsRef, newComment);
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  // Delete Comment - Remove from Firestore
  const handleDeleteComment = async (commentId: string) => {
    try {
      const commentRef = doc(db, "leaderboard", user.id, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment", error);
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

        <td className="px-6 py-4 align-middle">
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
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-all px-3 py-1.5 rounded-full ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>
              {showRowHearts && <FloatingHearts />}
            </div>
            
            <button 
              onClick={() => setShowComments(!showComments)}
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
                    placeholder="Add a friendly comment..."
                    className="w-full bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-[13px] shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button type="submit" disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 disabled:text-gray-300 hover:bg-blue-50 rounded-full transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group text-[13px]">
                    <img src={comment.authorPhoto} alt="User" className="w-8 h-8 rounded-full border border-gray-200 shrink-0" onError={(e) => (e.currentTarget.src = "/avatar.png")} />
                    <div className="flex-1">
                      <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm inline-block">
                        <span className="font-semibold text-gray-900 mr-2">{comment.authorName}</span>
                        <span className="text-gray-700">{comment.text}</span>
                      </div>
                      {comment.authorName === currentSessionName && (
                        <div className="mt-1.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-[11px] font-medium text-gray-400 hover:text-red-500 flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
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