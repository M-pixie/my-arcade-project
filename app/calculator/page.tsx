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

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
    }
  }, []);

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

      <main className="max-w-3xl mx-auto px-6 py-16">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-[#e8f0fe] border border-[#d2e3fc] rounded-sm mb-6">
            <svg className="w-8 h-8 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H5v-4h9v4zM5 11V7h9v4H5zm12 6h-2v-4h2v4zm0-6h-2V7h2v4z"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight mb-3">
            Arcade Points Calculator
          </h1>
          <p className="text-[#5f6368] text-base md:text-lg">
            Calculate your points from Google cloud skills public profile url.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-[#dadce0] shadow-sm overflow-hidden">
          
          {loading && (
            <div className="h-1 w-full bg-[#e8f0fe] overflow-hidden">
              <div className="h-full bg-[#1a73e8] animate-progress origin-left-right w-full"></div>
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
                  Enter public profile url
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
              {loading ? "Analyzing your profile..." : "Calculate Points"}
            </button>
          </div>

          {/* ================= RESULTS SECTION ================= */}
          {points !== null && (
            <div className="bg-[#f8f9fa] border-t border-[#dadce0] p-8 md:p-12 animate-fade-in-up">
              
              <div className="flex items-center gap-5 mb-10 bg-white p-5 rounded-sm border border-[#dadce0]">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Profile" 
                    className="w-14 h-14 rounded-full border border-[#dadce0] object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] font-medium text-xl border border-[#d2e3fc]">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-[#202124] leading-tight">
                    {userName || "Arcade Player"}
                  </h3>
                  <p className="text-sm text-[#5f6368] mt-0.5">(You) : Google cloud skills boost profile</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="text-center md:text-left flex-shrink-0">
                  <p className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Total Points</p>
                  <p className="text-7xl font-light text-[#1a73e8] tracking-tight mt-1">
                    {points}
                  </p>
                </div>

                <div className="hidden md:block w-px h-20 bg-[#dadce0]"></div>
                <div className="block md:hidden h-px w-full bg-[#dadce0]"></div>

                <div className="flex-1 w-full grid grid-cols-3 gap-3">
                  
                  <div className="bg-white p-4 rounded-sm border border-[#dadce0] flex flex-col items-center justify-center">
                    <span className="w-2 h-2 rounded-sm bg-[#fbbc04] mb-3"></span>
                    <span className="text-2xl font-normal text-[#202124] leading-none mb-1">{breakdown?.trivia}</span>
                    <span className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider text-center">Trivia & Sprint</span>
                  </div>

                  <div className="bg-white p-4 rounded-sm border border-[#dadce0] flex flex-col items-center justify-center">
                    <span className="w-2 h-2 rounded-sm bg-[#34a853] mb-3"></span>
                    <span className="text-2xl font-normal text-[#202124] leading-none mb-1">{breakdown?.games}</span>
                    <span className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider text-center">All Games</span>
                  </div>

                  <div className="bg-white p-4 rounded-sm border border-[#dadce0] flex flex-col items-center justify-center">
                    <span className="w-2 h-2 rounded-sm bg-[#a142f4] mb-3"></span>
                    <span className="text-2xl font-normal text-[#202124] leading-none mb-1">{breakdown?.skills}</span>
                    <span className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider text-center">Skill Badges</span>
                  </div>
                  
                </div>
              </div>

              <div className="mt-8 text-center md:text-left">
                <p className="text-xs text-[#80868b]">
                  Data verified securely from your public profile.
                </p>
              </div>

            </div>
          )}
        </div>
        
        {/* ================= FOOTER SECTION START (Sirf Ye Change Hai) ================= */}
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