"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { saveUserPoints } from "@/lib/leaderboard";
import Navbar from "@/app/components/Navbar";

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  
  // ✅ NEW: Profile Name & Avatar State
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
    }
  }, []);

  const calculatePoints = async () => {
    setError(null);

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
      return;
    }

    setLoading(true);
    setPoints(null);
    setBreakdown(null);
    // ✅ NEW: Reset name/avatar on new search
    setUserName(null); 
    setUserAvatar(null);

    try {
      const res = await fetch("http://localhost:5000/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: profileUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points.");
        return;
      }

      setPoints(data.totalPoints);
      setBreakdown(data.breakdown);

      // ✅ NEW: Backend se aaye hue name aur avatar ko set kiya
      // (Backend must return: { totalPoints, breakdown, userName, userAvatar })
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-16">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
            <svg className="w-8 h-8 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H5v-4h9v4zM5 11V7h9v4H5zm12 6h-2v-4h2v4zm0-6h-2V7h2v4z"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
            Arcade Points Calculator
          </h1>
          <p className="text-gray-500 text-lg">
            Calculate your points from Google cloud skills public profile URL.
          </p>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] border border-gray-100 overflow-hidden">
          
          {loading && (
            <div className="h-1 w-full bg-blue-100 overflow-hidden">
              <div className="h-full bg-[#1a73e8] animate-progress origin-left-right w-full"></div>
            </div>
          )}

          <div className="p-8 md:p-10">
            {/* INPUT FIELD */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Enter Public Profile URL
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="https://www.skills.google/public_profiles/..."
                  value={profileUrl}
                  onChange={(e) => {
                    setProfileUrl(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-4 py-4 text-base text-gray-900 bg-white border rounded-lg focus:outline-none focus:ring-4 transition-all duration-200
                    ${error 
                      ? "border-red-500 focus:ring-red-500/10" 
                      : "border-gray-300 focus:border-[#1a73e8] focus:ring-[#1a73e8]/10 hover:border-gray-400"
                    }
                  `}
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center mb-8">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-[#1a73e8] border-gray-300 rounded focus:ring-[#1a73e8] cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
                Remember my URL for next time
              </label>
            </div>

            <button
              onClick={calculatePoints}
              disabled={loading}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white text-base font-medium py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none flex justify-center items-center gap-2"
            >
              {loading ? "Analyzing Points..." : "Calculate Points"}
            </button>
          </div>

          {/* ================= RESULTS SECTION ================= */}
          {points !== null && (
            <div className="bg-gray-50 border-t border-gray-100 p-8 md:p-10 animate-fade-in-up">
              
              {/* ✅ NEW: USER PROFILE INFO CARD */}
              <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                  />
                ) : (
                  // Fallback avatar agar image na mile
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-white shadow-md">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                
                <div className="flex flex-col">
                  <h3 className="text-xl font-medium text-gray-900 leading-tight">
                    {userName || "Arcade Player"}
                  </h3>
                  <p className="text-sm text-gray-500">Google Cloud Arcade Public Profile.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Total Score */}
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Points</p>
                  <p className="text-6xl font-normal text-[#1a73e8] tracking-tight mt-1">
                    {points}
                  </p>
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div className="hidden md:block w-px h-16 bg-gray-300"></div>

                {/* Breakdown Stats */}
                <div className="flex-1 w-full grid grid-cols-3 gap-4">
                  {/* Trivia */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mb-2"></span>
                    <span className="text-2xl font-medium text-gray-800">{breakdown?.trivia}</span>
                    <span className="text-xs text-gray-500 font-medium">Trivia</span>
                  </div>

                  {/* Games */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mb-2"></span>
                    <span className="text-2xl font-medium text-gray-800">{breakdown?.games}</span>
                    <span className="text-xs text-gray-500 font-medium">Games</span>
                  </div>

                  {/* Skills */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mb-2"></span>
                    <span className="text-2xl font-medium text-gray-800">{breakdown?.skills}</span>
                    <span className="text-xs text-gray-500 font-medium">Badges</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Data verified from your Google Cloud Skills Boost profile.
                </p>
              </div>

            </div>
          )}
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 text-center flex justify-center gap-6 text-sm text-gray-500">
          <a href="https://go.cloudskillsboost.google/arcade" className="hover:text-gray-900">Arcade Page</a>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" className="hover:text-gray-900">Subscribe here!</a>
          <a href="http://qwiklab.zendesk.com/hc/requests/4774945" className="hover:text-gray-900">Arcade Support</a>
        </div>

      </main>
    </div>
  );
}