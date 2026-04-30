"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [hideRedLine, setHideRedLine] = useState(false);
  
  // History me url ke sath time bhi store karenge ab
  const [recentUrls, setRecentUrls] = useState<{url: string, time: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // For history copy feedback

  const router = useRouter();

  const whatsappHelpMessage = encodeURIComponent("Hello Facilitator Manish! 👋\n\nI am reaching out regarding the Google Cloud Arcade program. I need some guidance with my profile and points calculation. Could you please help me out?");
  const whatsappHelpUrl = `https://api.whatsapp.com/send?phone=918538980608&text=${whatsappHelpMessage}`;

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
    }
    const savedRecentUrls = localStorage.getItem("recent_arcade_urls_v2"); // New key for object structure
    if (savedRecentUrls) {
      setRecentUrls(JSON.parse(savedRecentUrls));
    }
  }, []);

  const saveToHistory = (urlToSave: string) => {
    setRecentUrls((prevUrls) => {
      const filtered = prevUrls.filter((u) => u.url !== urlToSave);
      const updatedUrls = [{ url: urlToSave, time: new Date().toISOString() }, ...filtered].slice(0, 5); 
      localStorage.setItem("recent_arcade_urls_v2", JSON.stringify(updatedUrls));
      return updatedUrls;
    });
  };

  const clearHistory = () => {
    setRecentUrls([]);
    localStorage.removeItem("recent_arcade_urls_v2");
  };

  const triggerBlink = async () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); await delay(150);
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); await delay(150);
    setHideRedLine(true);  await delay(150);
    setHideRedLine(false); 
  };

  const proceedToDashboard = async () => {
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

    saveToHistory(profileUrl.trim());
    setLoading(true); // Spinner start ho jayega
    
    try {
      // Calculator page par hi points calculate kar rahe hain ab
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: profileUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points. Check URL.");
        setLoading(false);
        return;
      }

      // Calculation done, ab cache me save kar denge jisse dashboard direct load ho jaye
      const extractedId = profileUrl.trim().split('/').pop() || null;
      const cacheObj = {
        profileUrl: profileUrl.trim(),
        points: data.totalPoints,
        breakdown: data.breakdown,
        history: data.completionHistory || [],
        userName: data.userName || null,
        userAvatar: data.userAvatar || null,
        userUniqueId: extractedId
      };
      
      localStorage.setItem("arcade_user_data", JSON.stringify(cacheObj));
      localStorage.setItem("current_processing_url", profileUrl.trim());
      
      // Ab Data aa chuka hai, seedha dashboard open karenge!
      router.push("/dashboard");

    } catch (err) {
      setError("Backend server connection failed. Please try again.");
      setLoading(false);
    }
  };

  const handleHistoryClick = (url: string, index: number) => {
    setProfileUrl(url);
    setError(null);
    setHideRedLine(false);
    
    // Copy to clipboard
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        
        {/* HEADER SECTION (Center Aligned, Subtitle Moved) */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-[#202124] tracking-tight leading-tight">
            Arcade <span className="text-[#1a73e8]">Calculator</span>
          </h1>
        </div>

        {/* 1. INPUT BOX AREA (MAIN CALCULATOR) */}
        <div className="bg-white rounded-xl border border-[#dadce0] shadow-sm overflow-hidden mb-8 relative">
          
          <style>{`
            @keyframes real-loading {
              0% { left: -30%; width: 10%; }
              50% { left: 30%; width: 60%; }
              100% { left: 100%; width: 10%; }
            }
            .animate-real-loading {
              animation: real-loading 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
              position: absolute;
            }
          `}</style>

          {/* 🔥 PREMIUM THIN DARK GREY LINE AT THE VERY TOP */}
          {loading && (
            <div className="absolute top-0 left-0 h-[2px] w-full bg-[#f1f3f4] overflow-hidden z-50">
              <div className="h-full bg-[#5f6368] animate-real-loading rounded-full"></div>
            </div>
          )}

          <div className="p-8 md:p-12 mt-1">
            
            {/* Subtitle moved right above the input box (mb-8 for extra spacing so it doesn't look sticky) */}
            <p className="text-[#5f6368] text-sm md:text-base font-semibold mb-8 text-left">
              Calculate your exact points from Google Cloud Skills Boost public profile URL.
            </p>

            <div className="mb-6">
              <div className={`relative border-2 rounded-lg transition-colors duration-75 ${error ? (hideRedLine ? "border-[#dadce0]" : "border-[#d93025]") : "border-[#dadce0] focus-within:border-[#1a73e8]"}`}>
                
                <label className={`absolute -top-3 left-3 bg-white px-1 text-sm font-bold transition-colors duration-75 z-10 ${error ? (hideRedLine ? "text-[#5f6368]" : "text-[#d93025]") : "text-[#1a73e8]"}`}>
                  Enter Public Profile Url
                </label>
                <input
                  type="text"
                  placeholder="https://www.skills.google/public_profiles/..."
                  value={profileUrl}
                  onChange={(e) => {
                    setProfileUrl(e.target.value);
                    setError(null);
                    setHideRedLine(false); 
                  }}
                  className="w-full px-4 py-4 text-base text-[#202124] bg-transparent outline-none rounded-lg relative z-10"
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

            <div className="flex items-center mb-8">
              <input id="remember-me" type="checkbox" className="w-4 h-4 text-[#1a73e8] border-[#dadce0] rounded-sm focus:ring-[#1a73e8] focus:ring-offset-0 cursor-pointer" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <label htmlFor="remember-me" className="ml-3 text-sm font-medium text-[#5f6368] cursor-pointer select-none">Remember my url for next time</label>
            </div>

            {/* 🔄 Button Spinner & Green Color (Premium Look with less curve: rounded-md) */}
            <button onClick={proceedToDashboard} disabled={loading} className="w-full bg-[#1e8e3e] hover:bg-[#137333] active:bg-[#0d5023] text-white text-lg font-bold py-4 rounded-md transition-all disabled:opacity-90 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparing Dashboard...
                </>
              ) : (
                "Calculate Points"
              )}
            </button>

            {/* Premium Dark Brown Text Below Button */}
            <p className="text-[13.5px] font-bold text-[#5d4037] text-center mt-5 leading-snug tracking-wide">
              If your account is not completely public, Google will not be able to see your progress, and you cannot calculate your points here.
            </p>

            {recentUrls.length > 0 && (
              <div className="mt-8 border-t border-[#dadce0] pt-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recent Profiles
                  </p>
                  <button onClick={clearHistory} className="flex items-center gap-1.5 text-sm text-[#d93025] bg-[#fce8e6] hover:bg-[#fad2ce] px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Clear History
                  </button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {recentUrls.map((item, idx) => {
                    const shortId = item.url.split("/").pop()?.substring(0, 15) || "Profile";
                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleHistoryClick(item.url, idx)} 
                        className={`w-full md:w-auto self-start px-4 py-2.5 bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#e8f0fe] text-[#202124] hover:text-[#1a73e8] text-sm font-bold rounded-lg transition-all flex items-center justify-between gap-4 shadow-sm ${copiedIndex === idx ? 'border-[#34a853] bg-[#e6f4ea] text-[#137333] hover:text-[#137333] hover:border-[#34a853] hover:bg-[#e6f4ea]' : ''}`}
                        title={item.url}
                      >
                        <div className="flex items-center gap-2.5">
                          {copiedIndex === idx ? (
                            <svg className="w-4 h-4 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4 text-[#5f6368] opacity-70 group-hover:text-[#1a73e8]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                          )}
                          <span className="truncate max-w-[120px]">{shortId}...</span>
                        </div>
                        
                        <div className="flex items-center gap-2 border-l border-[#dadce0] pl-3">
                          <span className="text-[11px] font-semibold text-[#80868b] bg-[#f8f9fa] px-2 py-0.5 rounded">
                            {timeAgo(item.time)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. PREMIUM INFO BOXES (How to use & Profile Public) */}
        <div className="grid md:grid-cols-2 gap-6 mb-10 text-left items-stretch">
          {/* How to Use Box */}
          <div className="flex flex-col bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-[#202124] font-medium text-lg mb-4 border-b border-[#f1f3f4] pb-4">
              How to use Calculator ?
            </h3>
            <ul className="list-disc pl-5 space-y-3.5 text-[#3c4043] text-[15px] font-medium flex-grow">
              <li>Your profile <span className="bg-[#f1f3f4] text-[#202124] px-1.5 py-0.5 rounded font-bold text-xs uppercase tracking-wider mx-1 border border-[#dadce0]">must be public</span> to fetch data.</li>
              <li>Copy your complete profile URL  <code className="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[#1a73e8] font-mono text-sm border border-[#dadce0] shadow-sm">https://www.skills.google/...</code></li>
              <li>Paste the exact URL in the input box above and click Calculate.</li>
              <li>Invalid, broken, or private URLs will return an error.</li>
            </ul>
          </div>

          {/* How to Setup Profile Box */}
          <div className="flex flex-col bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-[#202124] font-medium text-lg mb-4 border-b border-[#f1f3f4] pb-4">
              How to make Profile Public ?
            </h3>
            <ul className="list-disc pl-5 space-y-3.5 text-[#3c4043] text-[15px] font-medium flex-grow">
              <li>Go to <a href="https://www.skills.google/" target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline font-bold">skills.google</a></li>
              <li>Top right corner: Click <strong>Sign in</strong> or the blue <strong>Join now</strong> button.</li>
              <li>Select <strong>Continue with Google</strong> using your lab email.</li>
              <li>After login, click your <strong>profile avatar</strong> (top right) and select <strong>Settings</strong>.</li>
              <li>Under Public visibility, check <strong>Make profile public</strong> and click <strong>Update settings</strong>.</li>
            </ul>
          </div>
        </div>

        {/* 3. NEED HELP BUTTON */}
        <div className="w-full mt-2">
          <a href={whatsappHelpUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full gap-2.5 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-6 py-4 rounded-xl text-base font-extrabold transition-all shadow-sm hover:shadow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.387-.885-.719-1.484-1.608-1.658-1.906-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Need Help? Ask Facilitator
          </a>
        </div>

      </main>
    </div>
  );
}