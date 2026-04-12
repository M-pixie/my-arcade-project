"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { saveUserPoints } from "@/lib/leaderboard";
import Navbar from "@/app/components/Navbar";
import html2canvas from "html2canvas"; 

export default function CalculatorPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]); 
  
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [hideRedLine, setHideRedLine] = useState(false);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  // ================= 🔥 NEW: CELEBRATION GENERATOR STATES 🔥 =================
  const [flexName, setFlexName] = useState("");
  const [flexPoints, setFlexPoints] = useState("");
  const [flexMilestone, setFlexMilestone] = useState("");
  const [flexEmoji, setFlexEmoji] = useState("🚀");
  const [isCardGenerated, setIsCardGenerated] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false); 

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userName) setFlexName(userName);
    if (points !== null) setFlexPoints(points.toString());
  }, [userName, points]);
  // ===========================================================================

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");
    if (savedUrl) {
      setProfileUrl(savedUrl);
      setRememberMe(true);
    }
    const savedRecentUrls = localStorage.getItem("recent_arcade_urls");
    if (savedRecentUrls) {
      setRecentUrls(JSON.parse(savedRecentUrls));
    }
  }, []);

  const saveToHistory = (urlToSave: string) => {
    setRecentUrls((prevUrls) => {
      const filtered = prevUrls.filter((u) => u !== urlToSave);
      const updatedUrls = [urlToSave, ...filtered].slice(0, 5); 
      localStorage.setItem("recent_arcade_urls", JSON.stringify(updatedUrls));
      return updatedUrls;
    });
  };

  const clearHistory = () => {
    setRecentUrls([]);
    localStorage.removeItem("recent_arcade_urls");
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

    saveToHistory(profileUrl.trim());

    setLoading(true);
    setPoints(null);
    setBreakdown(null);
    setHistory([]); 
    setUserName(null); 
    setUserAvatar(null);
    setIsCardGenerated(false); 

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
      
      if (data.completionHistory) {
        setHistory(data.completionHistory);
      }

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

  const websiteUrl = "https://yourwebsite.com"; 

  const shareToWhatsApp = () => {
    const text = `🔥 Yooo! I just reached *${points} points* on the Google Cloud Arcade 2026! 🚀\n\nCheck your own points and track your swags easily using this awesome Calculator:\n${websiteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    const text = `🚀 Thrilled to share that I have successfully accumulated ${points} points in the Google Cloud Arcade 2026 program!\n\nConsistent learning and hands-on practice in cloud tech is paying off. Big thanks to the community! ☁️✨\n\nYou can calculate your Arcade points instantly using this tool: ${websiteUrl}\n\n#GoogleCloud #GoogleCloudArcade #CloudComputing #Learning`;
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank");
  };

  const shareCardAsImage = async (platform: 'whatsapp' | 'linkedin') => {
    if (!cardRef.current) return;
    setIsGeneratingImg(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Increased scale for even better text clarity
        useCORS: true, 
        backgroundColor: null // Transparent so border radius works well
      });

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "Arcade_Milestone.png", { type: "image/png" });

      const textForPost = `${flexEmoji} Just hit ${flexPoints || 0} points on Google Cloud Arcade 2026! \n\nCalculate your points here: ${websiteUrl}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Arcade Milestone",
          text: textForPost,
          files: [file]
        });
      } else {
        const link = document.createElement("a");
        link.download = "Arcade_Milestone.png";
        link.href = dataUrl;
        link.click();
        
        alert("🖼️ Celebration Card Downloaded! You can now attach it to your post.");
        
        if (platform === 'whatsapp') {
          window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(textForPost)}`, "_blank");
        } else if (platform === 'linkedin') {
          window.open("https://www.linkedin.com/feed/", "_blank");
        }
      }
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Oops! Could not generate the card image. Try again.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const downloadCSV = () => {
    if (history.length === 0) return;
    let csv = "Serial,Lab / Badge Name,Earned Date,Points\n";
    history.forEach((item, i) => {
      const safeName = item.name.replace(/"/g, '""');
      csv += `${i + 1},"${safeName}","${item.date}",${item.points}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${userName ? userName.replace(/\s+/g, '_') : 'Arcade'}_History_2026.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-[#e8f0fe] to-[#f3e8fd] border border-[#d2e3fc] rounded-2xl mb-6 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H5v-4h9v4zM5 11V7h9v4H5zm12 6h-2v-4h2v4zm0-6h-2V7h2v4z"/>
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#202124] tracking-tight mb-4">
            Arcade Points <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#a142f4]">Calculator</span>
          </h1>
          <p className="text-[#5f6368] text-base md:text-lg mb-8 font-medium">
            Calculate your exact points from Google Cloud Skills Boost public profile URL.
          </p>

          <div className="bg-[#fce8e6] border border-[#f8c1cb] rounded-xl p-5 mb-2 text-left shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[#c5221f] font-extrabold text-[17px] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              How to use Arcade Points Calculator?
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-[#202124] text-[14px] md:text-[15px] font-bold">
              <li>Your Google Cloud Skills Boost profile <span className="bg-[#c5221f] text-white px-1.5 py-0.5 rounded text-xs uppercase tracking-wider mx-1 shadow-sm">must be public</span> to fetch your data.</li>
              <li>Copy your complete profile URL (e.g., <code className="bg-[#fad2ce] px-1.5 py-0.5 rounded text-[#202124]">https://www.skills.google/public_profiles/...</code>).</li>
              <li>Paste the exact URL in the input box below and click Calculate.</li>
              <li><span className="underline decoration-[#c5221f]/40 underline-offset-2">Invalid, broken, or private URLs will not work</span> and will return an error.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-md overflow-hidden">
          
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
            
            <div className="mb-6 mt-3">
              <div className={`relative border-2 rounded-xl transition-colors duration-75 ${error ? (hideRedLine ? "border-[#dadce0]" : "border-[#d93025]") : "border-[#00A859] focus-within:border-[#007b41]"}`}>
                <label className={`absolute -top-3 left-3 bg-white px-1 text-sm font-bold transition-colors duration-75 ${error ? (hideRedLine ? "text-[#5f6368]" : "text-[#d93025]") : "text-[#00A859]"}`}>
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
                  className="w-full px-4 py-4 text-base text-[#202124] bg-transparent outline-none rounded-xl"
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

            <button onClick={calculatePoints} disabled={loading} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white text-lg font-bold py-4 rounded-xl transition-all disabled:bg-[#f1f3f4] disabled:text-[#9aa0a6] flex justify-center items-center gap-2 shadow-sm">
              {loading ? "Analyzing profile..." : "Calculate Points"}
            </button>

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
                
                <div className="flex flex-wrap gap-3">
                  {recentUrls.map((url, idx) => {
                    const shortId = url.split("/").pop()?.substring(0, 15) || "Profile";
                    return (
                      <button key={idx} onClick={() => { setProfileUrl(url); setError(null); setHideRedLine(false); }} className="px-4 py-2 bg-white hover:bg-[#e8f0fe] border-2 border-[#dadce0] hover:border-[#1a73e8] text-[#202124] hover:text-[#1a73e8] text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm" title={url}>
                        <svg className="w-4 h-4 text-[#5f6368] opacity-70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        {shortId}...
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ================= 🔥 PREMIUM RESULTS SECTION 🔥 ================= */}
          {points !== null && (
            <div className="bg-[#f8f9fa] border-t border-[#dadce0] p-8 md:p-12 animate-fade-in-up rounded-b-2xl">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-10 bg-white p-5 md:px-6 md:py-5 rounded-2xl border border-[#dadce0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="relative shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover ring-2 ring-[#e8f0fe]" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#6ab0ff] flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white ring-2 ring-[#e8f0fe]">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00A859] border-2 border-white rounded-full" title="Verified Public Profile"></div>
                  </div>
                  
                  <div className="flex flex-col overflow-hidden w-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className="text-xl font-bold text-[#202124] leading-tight truncate">{userName || "Arcade Player"}</h3>
                    </div>
                    <p className="text-xs md:text-sm text-[#5f6368] mt-1 font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#1a73e8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="truncate">Google Cloud Skills Boost Profile</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-[#f1f3f4] md:border-none shrink-0">
                  <p className="text-[11px] font-extrabold text-[#80868b] uppercase tracking-wider mb-2.5">Share your points</p>
                  <div className="flex items-center gap-2">
                    <button onClick={shareToWhatsApp} className="flex items-center gap-1.5 px-4 py-2 bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] text-xs font-bold rounded-lg transition-colors border border-[#ceead6]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.387-.885-.719-1.484-1.608-1.658-1.906-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WhatsApp
                    </button>
                    <button onClick={shareToLinkedIn} className="flex items-center gap-1.5 px-4 py-2 bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] text-xs font-bold rounded-lg transition-colors border border-[#d2e3fc]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left flex-shrink-0 w-full md:w-auto">
                  <div className="flex justify-between md:flex-col items-center md:items-start mb-2">
                    <p className="text-sm font-extrabold text-[#5f6368] uppercase tracking-widest">Total Points Earned</p>
                  </div>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <p className="text-7xl md:text-8xl font-extrabold text-[#1a73e8] tracking-tight drop-shadow-sm pb-1">
                      {points}
                    </p>
                    <span className="text-2xl font-bold text-[#1a73e8] opacity-90">pts</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-[#dadce0] to-transparent"></div>
                <div className="block md:hidden h-px w-full bg-gradient-to-r from-transparent via-[#dadce0] to-transparent"></div>

                <div className="flex-1 w-full grid grid-cols-2 gap-5">
                  <div className="bg-white px-5 py-4 rounded-xl border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#34a853] hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#34a853] group-hover:w-2 transition-all"></div>
                    <span className="text-3xl font-black text-[#202124] leading-none mb-1.5">
                      {history.filter(item => item.type !== 'Skill Badge').length}
                    </span>
                    <span className="text-[12px] text-[#5f6368] font-bold uppercase tracking-wider text-center">All Games</span>
                  </div>

                  <div className="bg-white px-5 py-4 rounded-xl border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#a142f4] hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#a142f4] group-hover:w-2 transition-all"></div>
                    <span className="text-3xl font-black text-[#202124] leading-none mb-1.5">
                      {breakdown?.skills || 0}
                    </span>
                    <span className="text-[12px] text-[#5f6368] font-bold uppercase tracking-wider text-center">Skill Badges</span>
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
        </div>

        {/* ================= 🔥 SMART 1-CLICK CELEBRATION GENERATOR 🔥 ================= */}
        {points !== null && (
        <div className="mt-12 bg-white border border-[#dadce0] rounded-2xl shadow-md overflow-hidden md:-mx-12 animate-fade-in-up">
          <div className="bg-[#f8f9fa] border-b border-[#dadce0] px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-lg font-extrabold text-[#202124] flex items-center gap-2">
                🎉 Celebration Card Generator
              </h4>
              <p className="text-sm text-[#5f6368] font-medium mt-0.5">Create a stunning achievement poster to flex your hard work!</p>
            </div>
          </div>
          
          <div className="p-6 md:p-10 flex flex-col items-center gap-6">
            {!isCardGenerated ? (
              <button onClick={() => setIsCardGenerated(true)} className="px-8 py-4 bg-gradient-to-r from-[#1a73e8] to-[#a142f4] text-white font-extrabold text-lg rounded-xl shadow-[0_10px_20px_-10px_rgba(26,115,232,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(161,66,244,0.6)] transform hover:-translate-y-1 transition-all flex items-center gap-3">
                ✨ Generate My Poster
              </button>
            ) : (
              <div className="w-full flex flex-col lg:flex-row gap-10 items-center justify-center">
                
                {/* Left Col: Emoji Options & Details */}
                <div className="w-full lg:w-1/3 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">1. Choose Your Vibe</label>
                    <div className="flex flex-wrap gap-2 bg-[#f8f9fa] border border-[#dadce0] p-2 rounded-xl">
                      {['🚀', '🏆', '🔥', '🎉', '😎', '☁️', '🥳', '❤️', '🥰', '😍', '🤩'].map((emoji) => (
                        <button 
                          key={emoji} 
                          onClick={() => setFlexEmoji(emoji)}
                          className={`flex-1 min-w-[40px] py-2 text-xl rounded-lg transition-all ${flexEmoji === emoji ? 'bg-white shadow-md scale-110 border border-[#dadce0] z-10' : 'hover:bg-[#e8f0fe] grayscale-[50%] opacity-70'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">2. Add Custom Milestone</label>
                    <input 
                      type="text" 
                      value={flexMilestone} 
                      onChange={(e) => setFlexMilestone(e.target.value)} 
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-[#202124] font-semibold outline-none focus:border-[#1a73e8] focus:bg-white transition-all text-sm"
                      placeholder="e.g., Leveling up my skills!"
                      maxLength={40}
                    />
                  </div>
                  
                  <div className="bg-[#e8f0fe] p-5 rounded-xl border border-[#d2e3fc]">
                    <p className="text-xs text-[#1a73e8] font-extrabold uppercase tracking-wider">Locked Stats:</p>
                    <ul className="text-sm font-bold text-[#202124] mt-3 space-y-2">
                      <li className="flex items-center gap-2"><span className="text-lg">👤</span> <span className="truncate">{userName || "Arcade Player"}</span></li>
                      <li className="flex items-center gap-2"><span className="text-lg">🎯</span> {points} Points</li>
                      <li className="flex items-center gap-2"><span className="text-lg">👨‍🏫</span> Manish Kumar</li>
                    </ul>
                  </div>
                </div>

                {/* Right Col: PREMIUM LIVE CARD & Actions */}
                <div className="w-full lg:w-2/3 flex flex-col items-center">
                  
                  {/* ================= THE PREMIUM CARD UI ================= */}
                  <div ref={cardRef} className="w-full max-w-md bg-gradient-to-br from-[#0B1121] via-[#15234b] to-[#2D1B4E] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden text-white border border-white/10">
                    
                    {/* Decorative Elements */}
                    <div className="absolute -right-12 -top-12 text-[12rem] opacity-5 rotate-12 pointer-events-none select-none">{flexEmoji}</div>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4285f4] via-[#34a853] via-[#fbbc04] to-[#ea4335]"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4285f4] rounded-full blur-[80px] opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#a142f4] rounded-full blur-[80px] opacity-30"></div>
                    
                    {/* Top Header: Achievement Label */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-[#8ab4f8] text-[10px] font-black uppercase tracking-widest rounded-full mb-3 backdrop-blur-sm shadow-sm">
                          Achievement Unlocked
                        </span>
                        <div className="flex items-center gap-3">
                          {userAvatar ? (
                            <img src={userAvatar} crossOrigin="anonymous" className="w-14 h-14 rounded-full border-2 border-[#8ab4f8] shadow-[0_0_15px_rgba(138,180,248,0.4)] object-cover" alt="Avatar"/>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#8ab4f8] flex items-center justify-center text-white font-bold text-2xl border-2 border-white/20 shadow-lg">
                              {userName ? userName.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <h3 className="text-xl font-black text-white leading-tight drop-shadow-md truncate max-w-[180px]">{userName || "Arcade Player"}</h3>
                            <p className="text-[11px] font-medium text-[#9aa0a6] mt-0.5">Google Cloud Skills Boost</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating Emoji Badge */}
                      <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 border border-white/30 rounded-full flex items-center justify-center text-3xl shadow-xl backdrop-blur-md transform rotate-12">
                        {flexEmoji}
                      </div>
                    </div>

                    {/* Main Score Area */}
                    <div className="mb-8 relative z-10 text-center bg-white/5 py-8 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent"></div>
                      <p className="text-[11px] font-black text-[#8ab4f8] uppercase tracking-[0.2em] mb-2 relative z-10 drop-shadow-md">Season 2026 Arcade Points</p>
                      
                      <div className="flex justify-center items-baseline gap-2 relative z-10">
                        <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#e8f0fe] drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                          {points}
                        </p>
                        <span className="text-2xl font-bold text-[#8ab4f8]">pts</span>
                      </div>
                      
                      <div className="mt-4 inline-block">
                        <p className="text-sm font-bold text-[#fbbc04] bg-[#fbbc04]/10 px-4 py-1.5 rounded-lg border border-[#fbbc04]/30 shadow-sm">
                          {flexMilestone || "Leveling up my cloud skills!"}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Branding Area */}
                    <div className="flex justify-between items-end pt-4 border-t border-white/10 relative z-10">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Facilitated By</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-[#34a853]/20 text-[#34a853] p-1 rounded-md border border-[#34a853]/30">👨‍🏫</span>
                          <p className="text-sm font-black text-white tracking-wide">Manish Kumar</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Generated On</p>
                        <p className="text-[11px] font-black text-white/70 bg-white/5 px-2 py-1 rounded border border-white/10">Arcade Nexus</p>
                      </div>
                    </div>
                  </div>
                  {/* ================= END OF PREMIUM CARD ================= */}

                  {/* Share as Image Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-6">
                    <button onClick={() => shareCardAsImage('whatsapp')} disabled={isGeneratingImg} className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] text-sm font-bold rounded-xl transition-all border border-[#ceead6] shadow-sm hover:shadow-md disabled:opacity-50">
                      {isGeneratingImg ? "Generating..." : (
                        <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.387-.885-.719-1.484-1.608-1.658-1.906-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> Share Photo</>
                      )}
                    </button>
                    <button onClick={() => shareCardAsImage('linkedin')} disabled={isGeneratingImg} className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] text-sm font-bold rounded-xl transition-all border border-[#d2e3fc] shadow-sm hover:shadow-md disabled:opacity-50">
                      {isGeneratingImg ? "Generating..." : (
                        <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> Share Photo</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* ================= 🔥 BADGE COMPLETION HISTORY BOX (BOTTOM) 🔥 ================= */}
        {points !== null && (
          <div className="mt-12 animate-fade-in-up md:-mx-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4 px-4 md:px-0">
              <h4 className="text-base font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Badge Completion Ledger
              </h4>
              
              <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all w-full sm:w-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV Report
              </button>
            </div>
            
            <div className="bg-white border border-[#dadce0] rounded-2xl overflow-hidden shadow-md">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-[#f8f9fa] sticky top-0 z-10 border-b border-[#dadce0] shadow-sm">
                    <tr>
                      <th className="px-5 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider text-center w-12 border-r border-[#f1f3f4]">#</th>
                      <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider">Lab / Badge Name</th>
                      <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider whitespace-nowrap border-l border-[#f1f3f4]">Earned Date</th>
                      <th className="px-6 py-4 text-sm font-extrabold text-[#5f6368] uppercase tracking-wider text-center border-l border-[#f1f3f4]">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f3f4]">
                    {history.length > 0 ? (
                      history.map((item, i) => (
                        <tr key={i} className="hover:bg-[#f8f9fa] transition-colors group">
                          <td className="px-5 py-5 text-base font-bold text-[#80868b] text-center border-r border-[#f1f3f4]">{i + 1}</td>
                          <td className="px-6 py-5"><p className="text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">{item.name}</p></td>
                          <td className="px-6 py-5 whitespace-nowrap border-l border-[#f1f3f4]"><p className="text-base text-[#5f6368] font-semibold">{item.date}</p></td>
                          <td className="px-6 py-5 text-center border-l border-[#f1f3f4]">
                            <span className={`inline-block px-4 py-2 rounded-xl text-sm font-black shadow-sm ${item.points >= 2 ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]' : item.points === 1 ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]' : 'bg-[#f3e8fd] text-[#8430ce] border border-[#d7aefb]'}`}>
                              +{item.points}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-[#9aa0a6] font-medium text-lg">
                          No valid 2026 badges found for this profile.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm w-full">
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-48 px-4 py-3 bg-[#00A859] text-white text-center rounded-xl font-bold transition-colors hover:bg-[#008c4a] shadow-sm">Arcade Page</a>
          </div>
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-48 px-4 py-3 bg-[#00A859] text-white text-center rounded-xl font-bold transition-colors hover:bg-[#008c4a] shadow-sm">Subscribe here!</a>
          </div>
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a href="http://qwiklab.zendesk.com/hc/requests/4774945" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-48 px-4 py-3 bg-[#00A859] text-white text-center rounded-xl font-bold transition-colors hover:bg-[#008c4a] shadow-sm">Arcade Support</a>
          </div>
        </div>

      </main>
    </div>
  );
}