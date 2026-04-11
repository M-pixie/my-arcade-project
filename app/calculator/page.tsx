"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { saveUserPoints } from "@/lib/leaderboard";
import Navbar from "@/app/components/Navbar";

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  
  // Profile Name & Avatar State
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rememberMe, setRememberMe] = useState(false);

  // 👇 GUARANTEED BLINK STATE 👇
  const [hideRedLine, setHideRedLine] = useState(false);

  // 🔥 NEW: State for Recent URLs History
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
    }
    
    // Load Recent URLs from LocalStorage
    const savedRecentUrls = localStorage.getItem("recent_arcade_urls");
    if (savedRecentUrls) {
      setRecentUrls(JSON.parse(savedRecentUrls));
    }
  }, []);

  // Function to save URL to history
  const saveToHistory = (urlToSave: string) => {
    setRecentUrls((prevUrls) => {
      // Remove if already exists to bring it to top, limit to last 5 URLs
      const filtered = prevUrls.filter((u) => u !== urlToSave);
      const updatedUrls = [urlToSave, ...filtered].slice(0, 5); 
      localStorage.setItem("recent_arcade_urls", JSON.stringify(updatedUrls));
      return updatedUrls;
    });
  };

  // Clear History
  const clearHistory = () => {
    setRecentUrls([]);
    localStorage.removeItem("recent_arcade_urls");
  };

  // 👇 100% WORKING ASYNC BLINK LOGIC 👇
  const triggerBlink = async () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    // Blink 1 (Gray -> Red)
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); await delay(150);
    
    // Blink 2 (Gray -> Red)
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); await delay(150);
    
    // Blink 3 (Gray -> Red)
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); // Final state stays RED
  };

  const calculatePoints = async () => {
    setError(null);
    setHideRedLine(false);

    if (rememberMe) {
      localStorage.setItem("arcade_url", profileUrl.trim());
    } else {
      localStorage.removeItem("arcade_url");
    }

    if (
      !profileUrl.trim() ||
      !profileUrl.includes("https://www.skills.google/public_profiles/")
    ) {
      setError("Please enter a valid Public Profile URL.");
      triggerBlink(); 
      return;
    }

    // Save to history on successful validation
    saveToHistory(profileUrl.trim());

    setLoading(true);
    setPoints(null);
    setBreakdown(null);
    setUserName(null); 
    setUserAvatar(null);

    try {
      const res = await fetch("/api/calculate", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: profileUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points.");
        triggerBlink();
        return;
      }

      setPoints(data.totalPoints);
      setBreakdown(data.breakdown);

      if (data.userName) setUserName(data.userName);
      if (data.userAvatar) setUserAvatar(data.userAvatar);

      const user = auth.currentUser;
      if (user) {
        await saveUserPoints(user, data.totalPoints);
      }
    } catch (err) {
      setError(
        "Backend server connect nahi ho raha. Make sure 'node index.js' terminal mein chal raha hai."
      );
      triggerBlink();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans">
      <Navbar />

      {/* 🔥 FIX: Increased Top Padding (py-16 to pt-24 pb-16) so icon doesn't stick to navbar */}
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        
        <div className="text-center mb-10">
          
          {/* Enhanced Icon Box */}
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-[#e8f0fe] to-[#f3e8fd] border border-[#d2e3fc] rounded-2xl mb-6 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H5v-4h9v4zM5 11V7h9v4H5zm12 6h-2v-4h2v4zm0-6h-2V7h2v4z"/>
            </svg>
          </div>
          
          {/* 🔥 FIX: Premium Heading UI */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#202124] tracking-tight mb-4">
            Arcade Points <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#a142f4]">Calculator</span>
          </h1>
          <p className="text-[#5f6368] text-base md:text-lg mb-8 font-medium">
            Calculate your exact points from Google Cloud Skills Boost public profile URL.
          </p>

          {/* ================= 🔥 NEW: HOW TO USE INSTRUCTIONS (RED HIGHLIGHT) 🔥 ================= */}
          <div className="bg-[#fce8e6] border border-[#f8c1cb] rounded-xl p-5 mb-2 text-left shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[#c5221f] font-extrabold text-[17px] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              How to use Arcade Points Calculator?
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-[#991b1b] text-[14px] md:text-[15px] font-bold">
              <li>Your Google Cloud Skills Boost profile <span className="bg-[#c5221f] text-white px-1.5 py-0.5 rounded text-xs uppercase tracking-wider mx-1 shadow-sm">must be public</span> to fetch your data.</li>
              <li>Copy your complete profile URL (e.g., <code className="bg-[#fad2ce] px-1.5 py-0.5 rounded text-[#991b1b]">https://www.skills.google/public_profiles/...</code>).</li>
              <li>Paste the exact URL in the input box below and click Calculate.</li>
              <li><span className="underline decoration-[#c5221f]/40 underline-offset-2">Invalid, broken, or private URLs will not work</span> and will return an error.</li>
            </ul>
          </div>
          {/* ================= END HOW TO USE SECTION ================= */}

        </div>

        <div className="bg-white rounded-sm border border-[#dadce0] shadow-sm overflow-hidden">
          
          {/* ================= FAST SEARCHING/LOADING ANIMATION ================= */}
          {loading && (
            <div className="h-1 w-full bg-[#e8f0fe] overflow-hidden relative">
              <style>{`
                @keyframes fast-loading {
                  0% { left: -40%; width: 30%; }
                  50% { left: 30%; width: 70%; }
                  100% { left: 100%; width: 30%; }
                }
                .animate-fast-loading {
                  animation: fast-loading 0.8s infinite ease-in-out;
                  position: absolute;
                }
              `}</style>
              <div className="h-full bg-[#1a73e8] animate-fast-loading rounded-full"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            
            {/* ================= BLINKING CUTOUT INPUT FIELD ================= */}
            <div className="mb-6 mt-3">
              <div 
                className={`relative border-2 rounded-md transition-colors duration-75
                  ${error 
                    ? (hideRedLine ? "border-[#dadce0]" : "border-[#d93025]") 
                    : "border-[#00A859] focus-within:border-[#007b41]"
                  }
                `}
              >
                {/* Floating Cutout Label */}
                <label 
                  className={`absolute -top-3 left-3 bg-white px-1 text-sm font-medium transition-colors duration-75
                    ${error 
                      ? (hideRedLine ? "text-[#5f6368]" : "text-[#d93025]") 
                      : "text-[#00A859]"
                    }
                  `}
                >
                  Enter Public Profile Url
                </label>
                
                {/* Actual Input Field */}
                <input
                  type="text"
                  placeholder="https://www.skills.google/public_profiles/..."
                  value={profileUrl}
                  onChange={(e) => {
                    setProfileUrl(e.target.value);
                    setError(null);
                    setHideRedLine(false); // Jaise hi type karega, error aur red line hat jayegi
                  }}
                  className="w-full px-4 py-3.5 text-base text-[#202124] bg-transparent outline-none rounded-md"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 mt-2 text-[#d93025] text-sm font-medium">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
            {/* ================= END OF CUTOUT INPUT FIELD ================= */}

            {/* CHECKBOX */}
            <div className="flex items-center mb-8">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-[#1a73e8] border-[#dadce0] rounded-sm focus:ring-[#1a73e8] focus:ring-offset-0 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-3 text-sm text-[#5f6368] cursor-pointer select-none">
                Remember my url for next time
              </label>
            </div>

            {/* BUTTON */}
            <button
              onClick={calculatePoints}
              disabled={loading}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white text-base font-medium py-3.5 rounded-sm transition-colors disabled:bg-[#f1f3f4] disabled:text-[#9aa0a6] flex justify-center items-center gap-2"
            >
              {loading ? "Analyzing profile..." : "Calculate Points"}
            </button>

            {/* ================= 🔥 RECENT URLS HISTORY SECTION 🔥 ================= */}
            {recentUrls.length > 0 && (
              <div className="mt-8 border-t border-[#dadce0] pt-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recent Profiles
                  </p>
                  <button 
                    onClick={clearHistory} 
                    className="flex items-center gap-1.5 text-sm text-[#d93025] bg-[#fce8e6] hover:bg-[#fad2ce] px-4 py-2 rounded-md font-bold transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Clear History
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {recentUrls.map((url, idx) => {
                    const shortId = url.split("/").pop()?.substring(0, 15) || "Profile";
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setProfileUrl(url);
                          setError(null);
                          setHideRedLine(false);
                        }}
                        className="px-4 py-2 bg-white hover:bg-[#e8f0fe] border-2 border-[#dadce0] hover:border-[#1a73e8] text-[#202124] hover:text-[#1a73e8] text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm"
                        title={url} // Full URL on hover
                      >
                        <svg className="w-4 h-4 text-[#5f6368] opacity-70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        {shortId}...
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/* ================= END OF RECENT URLS SECTION ================= */}

          </div>

          {/* ================= 🔥 PREMIUM RESULTS SECTION 🔥 ================= */}
          {points !== null && (
            <div className="bg-[#f8f9fa] border-t border-[#dadce0] p-8 md:p-12 animate-fade-in-up rounded-b-sm">
              
              {/* Premium Profile Section */}
              <div className="flex items-center gap-5 mb-10 bg-white p-4 md:px-6 md:py-4 rounded-2xl border border-[#dadce0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="relative shrink-0">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover ring-2 ring-[#e8f0fe]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#6ab0ff] flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white ring-2 ring-[#e8f0fe]">
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  {/* Verified Green Dot */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00A859] border-2 border-white rounded-full" title="Verified Public Profile"></div>
                </div>
                
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-xl font-bold text-[#202124] leading-tight truncate">
                    {userName || "Arcade Player"}
                  </h3>
                  <p className="text-xs md:text-sm text-[#5f6368] mt-1 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#1a73e8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="truncate">Google Cloud Skills Boost Profile</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                
                {/* Total Points (Premium Dark Green) */}
                <div className="text-center md:text-left flex-shrink-0">
                  <p className="text-sm font-extrabold text-[#5f6368] uppercase tracking-widest mb-2">Total Points Earned</p>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <p className="text-7xl md:text-8xl font-black text-[#137333] tracking-tighter drop-shadow-sm">
                      {points}
                    </p>
                    <span className="text-2xl font-bold text-[#137333] opacity-80">pts</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-[#dadce0] to-transparent"></div>
                <div className="block md:hidden h-px w-full bg-gradient-to-r from-transparent via-[#dadce0] to-transparent"></div>

                {/* Breakdown (2 Compact Premium Boxes - No Top Icons) */}
                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                  
                  {/* All Games Box (Trivia + Games Sum) */}
                  <div className="bg-white px-4 py-3.5 rounded-lg border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#34a853] hover:shadow transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#34a853] group-hover:w-1.5 transition-all"></div>
                    <span className="text-2xl font-black text-[#202124] leading-none mb-1.5">
                      {(breakdown?.trivia || 0) + (breakdown?.games || 0)}
                    </span>
                    <span className="text-[11px] text-[#5f6368] font-bold uppercase tracking-wider text-center">All Games</span>
                  </div>

                  {/* Skill Badges Box */}
                  <div className="bg-white px-4 py-3.5 rounded-lg border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#a142f4] hover:shadow transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#a142f4] group-hover:w-1.5 transition-all"></div>
                    <span className="text-2xl font-black text-[#202124] leading-none mb-1.5">
                      {breakdown?.skills || 0}
                    </span>
                    <span className="text-[11px] text-[#5f6368] font-bold uppercase tracking-wider text-center">Skill Badges</span>
                  </div>
                  
                </div>
              </div>

              <div className="mt-10 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                <svg className="w-4 h-4 text-[#00A859]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs font-semibold text-[#80868b]">
                  Data verified securely from your public profile.
                </p>
              </div>

            </div>
          )}
          {/* ================= END OF RESULTS SECTION ================= */}

        </div>
        
        {/* ================= FOOTER SECTION START ================= */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm w-full">
          
          {/* Button 1: Arcade Page */}
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a 
              href="https://go.cloudskillsboost.google/arcade" 
              target="_blank" rel="noopener noreferrer"
              className="block w-full sm:w-48 px-4 py-3 bg-[#00A859] text-white text-center rounded-md font-medium transition-colors hover:bg-[#008c4a] shadow-sm"
            >
              Arcade Page
            </a>
            {/* Black Popup */}
            <span className="absolute -top-10 scale-0 transition-all rounded bg-black px-3 py-1.5 text-xs text-white group-hover:scale-100 whitespace-nowrap shadow-lg z-20">
              Visit Arcade Page
              <span className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
            </span>
          </div>

          {/* Button 2: Subscribe here! */}
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" 
              target="_blank" rel="noopener noreferrer"
              className="block w-full sm:w-48 px-4 py-3 bg-[#00A859] text-white text-center rounded-md font-medium transition-colors hover:bg-[#008c4a] shadow-sm"
            >
              Subscribe here!
            </a>
            {/* Black Popup */}
            <span className="absolute -top-10 scale-0 transition-all rounded bg-black px-3 py-1.5 text-xs text-white group-hover:scale-100 whitespace-nowrap shadow-lg z-20">
              Go to Subscribe Form
              <span className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
            </span>
          </div>

          {/* Button 3: Arcade Support */}
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a 
              href="http://qwiklab.zendesk.com/hc/requests/4774945" 
              target="_blank" rel="noopener noreferrer"
              className="block w-full sm:w-48 px-4 py-3 bg-[#00A859] text-white text-center rounded-md font-medium transition-colors hover:bg-[#008c4a] shadow-sm"
            >
              Arcade Support
            </a>
            {/* Black Popup */}
            <span className="absolute -top-10 scale-0 transition-all rounded bg-black px-3 py-1.5 text-xs text-white group-hover:scale-100 whitespace-nowrap shadow-lg z-20">
              Open Support Ticket
              <span className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
            </span>
          </div>

        </div>
        {/* ================= FOOTER SECTION END ================= */}

      </main>
    </div>
  );
}