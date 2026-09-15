"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // 🔥 LEADERBOARD STATES
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false); 
  
  // 🔥 COPY ICON TRACKING 🔥
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 🔥 SEARCH & HIGHLIGHT STATE 🔥
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // 🔥 AUTHORIZED ADMIN EMAILS 🔥
  const AUTHORIZED_EMAILS = [
    "vy7manish@gmail.com", 
    "patelanjali0801@gmail.com"
  ];

  // 🔥 PERSISTENT LOGIN LOGIC 🔥
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email && AUTHORIZED_EMAILS.includes(user.email)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  // 🔥 GOOGLE LOGIN LOGIC 🔥
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user.email && AUTHORIZED_EMAILS.includes(user.email)) {
        setIsAuthenticated(true);
        setError("");
        setShake(false);
      } else {
        await signOut(auth);
        setError("Unauthorized Admin Email.");
        setShake(true);
        setTimeout(() => setShake(false), 500); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // 🔥 DUMMY EMAIL LOGIN CLICK HANDLER FOR SECURITY 🔥
  const handleEmailAuthClick = () => {
    setError("Email login is disabled for security. Please use Google Sign In.");
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // 🔥 LOGOUT LOGIC 🔥
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setIsAuthenticated(false);
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

  const lowerQuery = searchQuery.trim().toLowerCase();
  const isSearching = lowerQuery.length > 0;
  const isNoMatch = isSearching && users.length > 0 && !users.some(u => u.name?.toLowerCase().includes(lowerQuery));

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
    if (typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleString('en-IN', { 
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    }
    return String(dateValue).split("GMT")[0].trim();
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 🔥 LOADING SCREEN 🔥
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <span className="flex h-4 w-4 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f9d58] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0f9d58]"></span>
        </span>
      </div>
    );
  }

  // 🔥 1. LOGIN SCREEN (LAYOUT NAVBAR WILL SHOW HERE) 🔥
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-[#f41256]/30">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#f41256] opacity-[0.04] blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#7c3aed] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

        {/* Modal Container */}
        <div className="bg-[#1a1b1e] border border-[#2a2d32] rounded-2xl shadow-2xl w-full max-w-[420px] p-8 relative z-10">
          
          {/* Close X Button */}
          <button className="absolute top-5 right-5 text-[#80868b] hover:text-white transition-colors focus:outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h1 className="text-[22px] font-bold text-white mb-2 text-center mt-2 tracking-tight"> Arcade Nexus Admin </h1>
          <p className="text-[#8e949c] text-[14px] text-center mb-6 leading-relaxed">
            Only authorized Arcade Nexus Admins can access the moderation panel and database.
          </p>

          {/* Google Sign In Box */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#131416] border border-[#2a2d32] rounded-xl hover:bg-[#202124] transition-all focus:outline-none shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#202124] border border-[#3c4043] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="text-left">
                <p className="text-white text-[13px] font-semibold leading-tight">Sign in with Google</p>
                <p className="text-[#8e949c] text-[11px]">Secure Admin Access</p>
              </div>
            </div>
            <div className="bg-white p-1 rounded-full">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-[#2a2d32]"></div>
            <span className="text-[#8e949c] text-[12px] font-bold">OR</span>
            <div className="flex-1 h-[1px] bg-[#2a2d32]"></div>
          </div>

          {/* Email / Sign Up Buttons */}
          <button 
            onClick={handleEmailAuthClick}
            className="w-full py-3 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-[15px] rounded-xl transition-all shadow-md focus:outline-none mb-3"
          >
            Login with Email
          </button>
          
          <button 
            onClick={handleEmailAuthClick}
            className="w-full py-3 bg-white hover:bg-gray-200 text-black font-semibold text-[15px] rounded-xl transition-all shadow-md focus:outline-none"
          >
            Sign Up
          </button>

          {error && (
            <div className={`mt-4 p-2.5 rounded-lg bg-[#e11d48]/10 border border-[#e11d48]/20 text-[#e11d48] text-[13px] font-bold text-center ${shake ? 'animate-hard-shake' : ''}`}>
              {error}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes hardShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
          }
          .animate-hard-shake {
            animation: hardShake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  // 🔥 2. FULL-SCREEN DASHBOARD (COVERS LAYOUT NAVBAR AUTOMATICALLY) 🔥
  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f9fa] h-screen w-screen overflow-y-auto custom-scrollbar font-sans flex flex-col items-center text-[#202124]">
      
      {/* Main Content Area - Added pb-24 for extra scrolling space at the bottom */}
      <div className="w-full max-w-7xl flex flex-col gap-10 p-4 md:p-8 mt-4 pb-24">
        
        {/* ================= LEADERBOARD SECTION ================= */}
        <div className="w-full flex flex-col gap-4">
          
          {/* Header Row: Title & Action Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dadce0] pb-4">
            <h2 className="text-2xl font-bold text-[#202124]">User Data House</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="relative flex flex-col w-48 sm:w-64">
                <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-colors w-full ${
                  isNoMatch 
                    ? 'border-red-500 text-red-700 bg-red-50' 
                    : 'text-[#5f6368] border-[#dadce0] bg-white focus-within:border-[#1a73e8]'
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                    placeholder="Search user..."
                    className={`bg-transparent border-none outline-none w-full text-sm font-medium py-1 ${
                      isNoMatch ? 'text-red-700 placeholder-red-300' : 'text-[#202124] placeholder-[#9aa0a6]'
                    }`}
                  />
                  <button 
                    onClick={handleSearchClick}
                    className="shrink-0 p-1 hover:text-[#1a73e8] transition-colors focus:outline-none"
                    title="Click to find user"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                {isNoMatch && (
                  <span className="text-[11px] font-bold text-red-500 absolute top-full mt-1 right-1">
                    No user found
                  </span>
                )}
              </div>

              {/* Logout Button (Red Curve) */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#ea4335] text-white hover:bg-[#d32f2f] rounded-full text-sm font-bold transition-all shadow-sm focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>

              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 px-5 py-2 bg-white text-[#5f6368] border border-[#dadce0] hover:bg-[#f1f3f4] rounded-full text-sm font-bold transition-all shadow-sm focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
            </div>
          </div>

          {/* Table Container - max-h 700px to show more rows before scrolling */}
          <div className="bg-white rounded-lg shadow-sm border border-[#dadce0] w-full overflow-hidden">
            <div className="w-full overflow-x-auto max-h-[700px] overflow-y-auto custom-scrollbar">
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
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043] text-center w-36">Profile Analyzed</th>
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
                          <td className="px-6 py-4 border-r border-[#e8eaed] text-center">
                            <span className="bg-[#f8f9fa] border border-[#dadce0] px-3 py-1.5 rounded-full text-[12px] font-bold text-[#3c4043] inline-flex items-center gap-1.5">
                              {user.calculationCount || 1} {user.calculationCount === 1 || !user.calculationCount ? 'Time' : 'Times'}
                            </span>
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

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
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