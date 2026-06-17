"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  // 🔥 REAL-TIME FIREBASE LISTENER 🔥
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
      setError("Data sync karne me error aayi.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

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
            <h1 className="text-xl font-bold text-[#b31412] mb-4">Admin Nexus Privacy</h1>
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
      <div className="w-full max-w-6xl flex flex-col gap-6">
        
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

        {/* ================= MAIN CONTENT ================= */}
        <div className="w-full flex flex-col gap-2">
          
          {/* 🔥 SEARCH WITH RIGHT SIDE BUTTON IN BOX 🔥 */}
          <div className="flex justify-end w-full px-1 mb-4">
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
                
                {/* Search Icon Clickable Button */}
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
              
              {/* Error Message */}
              {isNoMatch && (
                <span className="text-[11px] font-bold text-[#d93025] absolute top-full mt-1 right-1">
                  No user found
                </span>
              )}
            </div>
          </div>

          {/* MAIN TABLE */}
          <div className="bg-white rounded-lg shadow-sm border border-[#dadce0] w-full overflow-hidden">
            <div className="w-full overflow-x-auto">
              {loading ? (
                <div className="p-10 text-center text-[#5f6368] font-bold">Syncing live data...</div>
              ) : users.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  
                  {/* Table Header */}
                  <thead className="bg-[#0f9d58] border-b border-[#0b8043]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043] w-20 text-center">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043]">User Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043]">Public Profile</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-[#0b8043] text-center w-28">Points</th>
                      <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Last Update</th>
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody className="divide-y divide-[#e8eaed]">
                    {users.map((user, index) => {
                      // 🔥 HIGHLIGHT LOGIC 🔥
                      const isMatch = isSearching && user.name?.toLowerCase().includes(lowerQuery);
                      
                      return (
                        <tr 
                          key={user.id} 
                          id={`user-row-${user.id}`}
                          className={`transition-colors duration-500 ${isMatch ? 'bg-[#ceead6]' : 'hover:bg-[#f8f9fa]'}`}
                        >
                          {/* Rank */}
                          <td className="px-6 py-4 text-sm font-bold text-[#80868b] text-center border-r border-[#e8eaed]">
                            {index + 1}
                          </td>
                          
                          {/* Avatar & Name */}
                          <td className="px-6 py-4 border-r border-[#e8eaed]">
                            <div className="flex items-center gap-3">
                              <img 
                                src={user.photoURL || "/avatar.png"} 
                                alt="Avatar" 
                                className="w-8 h-8 rounded-full border border-[#dadce0] shrink-0 object-cover"
                              />
                              <span className="text-[15px] font-bold text-[#202124]">
                                {user.name || "Unknown Player"}
                              </span>
                            </div>
                          </td>

                          {/* Public Profile Link */}
                          <td className="px-6 py-4 border-r border-[#e8eaed] max-w-[250px]">
                            {user.profileUrl ? (
                              <div className="flex items-center gap-2">
                                {/* Copy Button with Tick Logic */}
                                <button 
                                  onClick={() => handleCopy(user.id, user.profileUrl)} 
                                  className={`transition-colors focus:outline-none ${copiedId === user.id ? 'text-[#34a853]' : 'text-[#5f6368] hover:text-[#1a73e8]'}`}
                                  title="Copy URL"
                                >
                                  {copiedId === user.id ? (
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                  ) : (
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  )}
                                </button>
                                <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-normal text-[#5f6368] hover:text-[#1a73e8] hover:underline truncate block w-full">
                                  {user.profileUrl}
                                </a>
                              </div>
                            ) : (
                              <span className="text-[13px] font-normal italic text-[#9aa0a6]">No profile linked</span>
                            )}
                          </td>

                          {/* Points */}
                          <td className="px-6 py-4 border-r border-[#e8eaed] text-center">
                            <span className="text-base font-bold text-[#202124]">
                              {user.points}
                            </span>
                          </td>

                          {/* Last Update */}
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-medium text-[#5f6368]">
                              {formatDate(user.updatedAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-[#5f6368] font-bold">Koi data nahi mila bhai.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}