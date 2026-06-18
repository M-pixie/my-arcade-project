"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 🔥 LEADERBOARD STATES
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 🔥 SWAG POSTS STATES 🔥
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [error, setError] = useState("");
  
  // 🔥 COPY ICON TRACKING 🔥
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 🔥 SEARCH & HIGHLIGHT STATE 🔥
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // 🔥 TUMHARA SECRET PASSWORD 🔥
  const SECRET_PASSWORD = "827160"; // Ise badal lena bhai

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === SECRET_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError("Incorrect Passcode!");
      setPasscode("");
    }
  };

  // 🔥 1. REAL-TIME FIREBASE LISTENER (LEADERBOARD) 🔥
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const q = query(collection(db, "leaderboard"), orderBy("points", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(fetchedUsers);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching real-time data:", err);
      setError("Failed to sync live data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  // 🔥 2. REAL-TIME FIREBASE LISTENER (SWAG POSTS) 🔥
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoadingPosts(true);
    const postsQuery = query(collection(db, "swag_posts"));
    
    const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() });
      });
      // Reverse array to show latest first (assuming no strict timestamp field for ordering)
      setPosts(fetchedPosts.reverse());
      setLoadingPosts(false);
    }, (err) => {
      console.error("Error fetching posts data:", err);
      setLoadingPosts(false);
    });

    return () => unsubscribePosts();
  }, [isAuthenticated]);

  // 🔥 DELETE POST FUNCTION 🔥
  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "swag_posts", postId));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete the post. Please check the console for details.");
      }
    }
  };

  // 🔥 SEARCH LOGIC VARIABLES 🔥
  const lowerQuery = searchQuery.trim().toLowerCase();
  const isSearching = lowerQuery.length > 0;
  const isNoMatch = isSearching && users.length > 0 && !users.some(u => u.name?.toLowerCase().includes(lowerQuery));

  // 🔥 MANUAL SCROLL ON CLICK 🔥
  const handleSearchClick = () => {
    if (isSearching && !isNoMatch) {
      const firstMatch = users.find(u => u.name?.toLowerCase().includes(lowerQuery));
      if (firstMatch) {
        const row = document.getElementById(`user-row-${firstMatch.id}`);
        if (row) {
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";
    // Check if it's a string timestamp (from comments)
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-IN', { 
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      }
      return dateValue;
    }
    // Check if Firestore Timestamp
    if (typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleString('en-IN', { 
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    }
    return String(dateValue).split("GMT")[0].trim(); // Chhota format
  };

  // 🔥 COPY FUNCTION WITH TICK FEEDBACK 🔥
  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 🔥 1. LOGIN SCREEN 🔥
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#fbf8ee] rounded-xl shadow-md border border-[#dadce0] w-full max-w-sm overflow-hidden">
          {/* Top Section */}
          <div className="p-8 pb-6 flex flex-col items-center border-b border-[#e8eaed]">
            <h1 className="text-xl font-bold text-[#b31412] mb-4">Arcade Nexus Privacy</h1>
            <p className="text-[#5f6368] font-medium mb-3">Admin Access</p>
            <div className="text-4xl">👨‍💻</div>
          </div>
          
          {/* Bottom Section (Form) */}
          <div className="bg-white p-8 pt-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">
                  Passcode:
                </label>
                
                {/* Thin Line Border and Green Submit Button */}
                <div className="flex items-center border border-[#dadce0] rounded overflow-hidden focus-within:border-[#0f9d58] focus-within:ring-1 focus-within:ring-[#0f9d58] transition-all">
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Secret Key"
                    className="w-full px-4 py-2.5 text-sm focus:outline-none text-[#202124] font-medium"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-bold text-sm transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
              {error && <p className="text-[#b31412] text-xs font-bold">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 2. ADMIN DASHBOARD 🔥
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans text-[#202124] flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        {/* Header Setup */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-[#202124] flex items-center gap-2">
            Live Database
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#137333]"></span>
            </span>
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm font-bold text-[#d93025] hover:underline"
          >
            Lock & Exit
          </button>
        </div>

        {/* ================= LEADERBOARD SECTION ================= */}
        <div className="w-full flex flex-col gap-2">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-[#5f6368]">User Points Leaderboard</h2>
            {/* 🔥 SEARCH WITH RIGHT SIDE BUTTON IN BOX 🔥 */}
            <div className="flex justify-end px-1">
              <div className="relative flex flex-col items-end w-48 sm:w-64">
                <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-md transition-colors w-full ${
                  isNoMatch 
                    ? 'border-[#d93025] text-[#d93025] bg-[#fce8e6]' 
                    : 'text-[#5f6368] border-[#dadce0] bg-white focus-within:border-[#0f9d58]'
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                    placeholder="Search user..."
                    className={`bg-transparent border-none outline-none w-full text-sm font-bold py-1 ${
                      isNoMatch ? 'text-[#d93025] placeholder-[#d93025]' : 'text-[#202124] placeholder-[#9aa0a6]'
                    }`}
                  />
                  <button 
                    onClick={handleSearchClick}
                    className="shrink-0 p-1 hover:text-[#0f9d58] transition-colors focus:outline-none"
                    title="Click to find user"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                {isNoMatch && (
                  <span className="text-[11px] font-bold text-[#d93025] absolute top-full mt-1 right-1">
                    No user found
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* MAIN TABLE WITH FIXED HEIGHT & SCROLL */}
          <div className="bg-white rounded-lg shadow-sm border border-[#dadce0] w-full overflow-hidden">
            <div className="w-full overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-10 text-center text-[#5f6368] font-bold">Syncing live data...</div>
              ) : users.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[800px] relative">
                  <thead className="bg-[#0f9d58] sticky top-0 z-20 border-b border-[#0b8043]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043] w-20 text-center">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043]">User Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043]">Public Profile</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043] text-center w-28">Points</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Last Update</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-[#e8eaed]">
                    {users.map((user, index) => {
                      const isMatch = isSearching && user.name?.toLowerCase().includes(lowerQuery);
                      return (
                        <tr 
                          key={user.id} 
                          id={`user-row-${user.id}`}
                          className={`transition-colors duration-500 ${isMatch ? 'bg-[#ceead6]' : 'hover:bg-[#f8f9fa]'}`}
                        >
                          <td className="px-6 py-4 text-sm font-bold text-[#80868b] text-center border-r border-[#e8eaed]">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 border-r border-[#e8eaed]">
                            <div className="flex items-center gap-3">
                              <img src={user.photoURL || "/avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full border border-[#dadce0] shrink-0 object-cover" />
                              <span className="text-[15px] font-bold text-[#202124]">{user.name || "Unknown Player"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-[#e8eaed] max-w-[250px]">
                            {user.profileUrl ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleCopy(user.id, user.profileUrl)} className={`transition-colors focus:outline-none ${copiedId === user.id ? 'text-[#34a853]' : 'text-[#5f6368] hover:text-[#1a73e8]'}`} title="Copy URL">
                                  {copiedId === user.id ? (
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                  ) : (
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  )}
                                </button>
                                <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-normal text-[#5f6368] hover:text-[#1a73e8] hover:underline truncate block w-full">{user.profileUrl}</a>
                              </div>
                            ) : (
                              <span className="text-[13px] font-normal italic text-[#9aa0a6]">No profile linked</span>
                            )}
                          </td>
                          <td className="px-6 py-4 border-r border-[#e8eaed] text-center">
                            <span className="text-base font-bold text-[#202124]">{user.points}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-medium text-[#5f6368]">{formatDate(user.updatedAt)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-[#5f6368] font-bold">No user data found.</div>
              )}
            </div>
          </div>
        </div>

        {/* ================= NEW: SWAG POSTS MANAGEMENT ================= */}
        <div className="w-full flex flex-col gap-4 mt-4">
          
          <div className="flex items-center justify-between border-b border-[#dadce0] pb-2">
            <h2 className="text-2xl font-bold text-[#202124]">
              Swag Posts Moderation
            </h2>
            <span className="text-[#202124] text-[15px] font-bold">
              Total Posts: {posts.length}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {loadingPosts ? (
              <div className="p-10 bg-white rounded-lg shadow-sm border border-[#dadce0] text-center text-[#5f6368] font-bold animate-pulse">
                Fetching swag posts...
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-[#dadce0] p-5 flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">
                  
                  {/* LEFT: POST INFO, IMAGE & AUTHOR */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4 border-b border-[#f1f3f4] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e8eaed] overflow-hidden flex items-center justify-center font-bold text-[#5f6368] border border-[#dadce0]">
                          {post.authorPhotoURL || post.userAvatar ? (
                            <img src={post.authorPhotoURL || post.userAvatar} alt="Author" className="w-full h-full object-cover" />
                          ) : (
                            (post.authorName || post.name || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#202124] text-[16px]">{post.authorName || post.name || "Unknown Author"}</h3>
                          <p className="text-[11px] text-[#9aa0a6] font-bold">Author ID: {post.authorId || "N/A"}</p>
                        </div>
                      </div>
                      
                      {/* DELETE POST BUTTON */}
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-white border border-[#dadce0] text-[#d93025] hover:bg-[#fce8e6] hover:border-[#fce8e6] px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        title="Delete this post permanently"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>

                    {(post.imageUrl || post.image || post.photoURL) && (
                      <div className="w-full max-h-[350px] mb-4 rounded-xl overflow-hidden border border-[#dadce0] bg-[#f8f9fa] flex items-center justify-center">
                        <img 
                          src={post.imageUrl || post.image || post.photoURL} 
                          alt="Swag Post Attachment" 
                          className="w-full h-full object-contain max-h-[350px]"
                        />
                      </div>
                    )}

                    <div className="flex-1 mb-5">
                      <p className="text-[#3c4043] text-[15px] leading-relaxed whitespace-pre-wrap">
                        {post.about || post.text || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-bold text-[#5f6368]">
                      <span className="bg-[#f8f9fa] border border-[#dadce0] px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#d93025]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        {post.likes?.length || post.likes || 0} Likes
                      </span>
                      <span className="bg-[#f8f9fa] border border-[#dadce0] px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        {post.commentsData?.length || 0} Comments
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: COMMENTS BOX */}
                  <div className="w-full lg:w-[40%] bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-4 flex flex-col">
                    <h4 className="text-xs font-black text-[#80868b] uppercase tracking-wider mb-3 border-b border-[#dadce0] pb-2">
                      Live Comments Log
                    </h4>
                    
                    <div className="flex-1 overflow-y-auto max-h-[250px] custom-scrollbar pr-1">
                      {post.commentsData && post.commentsData.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {post.commentsData.map((cmt: any, i: number) => (
                            <div key={i} className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-sm hover:border-[#1a73e8] transition-colors">
                              <div className="flex justify-between items-start mb-1.5">
                                <span className="font-bold text-[#202124] text-[13px]">{cmt.name || "Unknown User"}</span>
                                <span className="text-[10px] font-bold text-[#9aa0a6] bg-[#f1f3f4] px-2 py-0.5 rounded">
                                  {formatDate(cmt.time)}
                                </span>
                              </div>
                              <p className="text-[#3c4043] text-[13px] leading-snug">{cmt.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[100px]">
                          <p className="text-sm font-bold text-[#9aa0a6] italic">No comments yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-10 bg-white rounded-lg shadow-sm border border-[#dadce0] text-center text-[#5f6368] font-bold">
                No swag posts found.
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #dadce0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9aa0a6;
        }
      `}</style>
    </div>
  );
}