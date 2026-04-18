"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import html2canvas from "html2canvas"; 
import { useRouter } from "next/navigation"; 
import { subscribeLeaderboard, savePublicUserToLeaderboard } from "@/lib/leaderboard"; 
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]); 
  
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userUniqueId, setUserUniqueId] = useState<string | null>(null); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [realRank, setRealRank] = useState<number | null>(null);

  // Celebration States
  const [flexName, setFlexName] = useState("");
  const [flexPoints, setFlexPoints] = useState("");
  const [flexMilestone, setFlexMilestone] = useState("");
  const [flexEmoji, setFlexEmoji] = useState("🚀");
  const [isCardGenerated, setIsCardGenerated] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false); 

  const cardRef = useRef<HTMLDivElement>(null);

  // ================= 🔥 CACHE LOAD HELPER 🔥 =================
  const loadDataFromCache = (data: any) => {
    setPoints(data.points);
    setBreakdown(data.breakdown);
    setHistory(data.history || []);
    setUserName(data.userName);
    setUserAvatar(data.userAvatar);
    setUserUniqueId(data.userUniqueId);
    setLoading(false);
  };

  // ================= 🔥 PAGE LOAD HOTE HI FETCH/CACHE KAREGA 🔥 =================
  useEffect(() => {
    const targetUrl = localStorage.getItem("current_processing_url");
    const cachedDataString = localStorage.getItem("arcade_user_data");
    let cachedData = null;

    if (cachedDataString) {
      try {
        cachedData = JSON.parse(cachedDataString);
      } catch (e) {
        console.error("Failed to parse cached data");
      }
    }

    if (targetUrl) {
      setProfileUrl(targetUrl);
      // Agar naya URL wahi hai jo pehle se cache me hai, toh bina API call ke fatak se load kardo
      if (cachedData && cachedData.profileUrl === targetUrl) {
        loadDataFromCache(cachedData);
        localStorage.removeItem("current_processing_url");
      } else {
        fetchDataAndCalculate(targetUrl);
      }
    } else if (cachedData) {
      // Direct dashboard open kiya aur data already save hai
      setProfileUrl(cachedData.profileUrl);
      loadDataFromCache(cachedData);
    } else {
      router.push("/calculator"); // Agar kuch bhi nahi mila toh calculator par bhej dega
    }
  }, []);

  useEffect(() => {
    if (userName) setFlexName(userName);
    if (points !== null) setFlexPoints(points.toString());
  }, [userName, points]);

  useEffect(() => {
    if (!userUniqueId) {
      setRealRank(null);
      return;
    }
    const unsub = subscribeLeaderboard((leaders: any[]) => {
      const me = leaders.find((l: any) => l.id === userUniqueId);
      if (me && me.rank) {
        setRealRank(me.rank);
      } else {
        setRealRank(null);
      }
    });
    return () => unsub();
  }, [userUniqueId]);

  // ================= 🔥 API CALL & SCRAPE LOGIC 🔥 =================
  const fetchDataAndCalculate = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate points.");
        setLoading(false);
        return;
      }

      setPoints(data.totalPoints);
      setBreakdown(data.breakdown);
      if (data.completionHistory) setHistory(data.completionHistory);
      if (data.userName) setUserName(data.userName);
      if (data.userAvatar) setUserAvatar(data.userAvatar);
      
      const extractedId = url.trim().split('/').pop() || null;
      setUserUniqueId(extractedId);

      // 🔥 Save completely to Local Storage (Cache)
      const cacheObj = {
        profileUrl: url.trim(),
        points: data.totalPoints,
        breakdown: data.breakdown,
        history: data.completionHistory || [],
        userName: data.userName || null,
        userAvatar: data.userAvatar || null,
        userUniqueId: extractedId
      };
      localStorage.setItem("arcade_user_data", JSON.stringify(cacheObj));

      // 🔥 Auto-Save to Leaderboard & Exact Rank Fetch
      try {
        await savePublicUserToLeaderboard({
          name: data.userName || "Arcade Player",
          photoURL: data.userAvatar || "/avatar.png",
          points: data.totalPoints,
          profileUrl: url.trim()
        });

        const rankQuery = query(collection(db, "leaderboard"), where("points", ">", data.totalPoints));
        const snapshot = await getCountFromServer(rankQuery);
        setRealRank(snapshot.data().count + 1);
      } catch (saveErr) {
        console.error("Leaderboard Auto-Save Failed:", saveErr);
      }

    } catch (err) {
      setError("Backend server se connect nahi ho raha. Kripya URL check karein.");
    } finally {
      setLoading(false);
      localStorage.removeItem("current_processing_url"); 
    }
  };

  const getMemberSinceYear = () => {
    if (!history || history.length === 0) return "2026";
    const years = history.map(h => new Date(h.date).getFullYear()).filter(y => !isNaN(y));
    return years.length > 0 ? Math.min(...years).toString() : "2026";
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const websiteUrl = "https://arcade-calculator.vercel.app/calculator"; 

  const shareToWhatsApp = () => {
    const text = `🔥 Yooo! I just reached *${points} points* on the Google Cloud Arcade 2026! 🚀\n\n👤 *Name:* ${userName || "Arcade Player"}\n🎯 *Points:* ${points}\n🔗 *My Public Profile:* ${profileUrl}\n\nCheck your own points and track your swags easily using this awesome Calculator:\n${websiteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
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

  const shareCardAsImage = async (platform: 'whatsapp' | 'linkedin') => {
    if (!cardRef.current) return;
    setIsGeneratingImg(true);
    try {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, useCORS: true, backgroundColor: "#ffffff", logging: false,
        onclone: (clonedDoc) => {
          const card = clonedDoc.getElementById("celebration-card");
          if (card) {
            card.style.width = "500px";
            card.style.maxWidth = "500px";
            card.style.height = "auto";
          }
        }
      });

      const dataUrl = canvas.toDataURL("image/png");
      const textForPost = `${flexEmoji} Just hit ${points || 0} points on Google Cloud Arcade 2026! \n\nCalculate your points here: ${websiteUrl}`;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "Arcade_Milestone.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ title: "My Arcade Milestone", text: textForPost, files: [file] });
            setIsGeneratingImg(false);
            return;
          } catch (e: any) {
            if (e.name === 'AbortError') { setIsGeneratingImg(false); return; }
          }
        }
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          alert(`✅ Poster Copied! Opening ${platform}... Just Paste (Ctrl+V) it to share!`);
        } catch (clipboardErr) {
          const link = document.createElement("a");
          link.download = "Arcade_Milestone.png";
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert(`🖼️ Poster Downloaded! Opening ${platform}... Please attach the downloaded image.`);
        }

        if (platform === 'whatsapp') {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textForPost)}`, "_blank");
        } else if (platform === 'linkedin') {
          window.open("https://www.linkedin.com/feed/", "_blank");
        }
        setIsGeneratingImg(false);
      }, "image/png");
    } catch (err) {
      console.error("Canvas generation failed", err);
      alert("Oops! Could not generate the poster. Please try again.");
      setIsGeneratingImg(false);
    }
  };

  // ================= 🔥 LOADING SCREEN (FAST TINTED SKELETON + MICROSOFT STYLE OVERLAY) 🔥 =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-sans relative">
        <Navbar />

        {/* --- PREMIUM CENTER SEARCHING OVERLAY (Professional / Microsoft Style) --- */}
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none bg-white/50 backdrop-blur-sm transition-all duration-300">
          {/* Sharper edges (rounded-lg), wider box (max-w-md), crisp shadow */}
          <div className="bg-white w-[90%] max-w-md px-10 py-10 rounded-lg shadow-2xl border border-[#dadce0] flex flex-col items-center transform transition-all">
            
            <div className="relative flex justify-center items-center mb-6">
              <div className="w-14 h-14 border-4 border-blue-50 rounded-full"></div>
              {/* Sleek spinner */}
              <div className="w-14 h-14 border-4 border-[#1a73e8] border-r-transparent border-t-transparent rounded-full animate-spin absolute"></div>
              {/* Minimalist dot inside instead of Emoji */}
              <div className="w-2 h-2 bg-[#1a73e8] rounded-full absolute animate-pulse"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#202124] tracking-tight">Searching Profile...</h2>
            
            {/* Professional Source Text */}
            <p className="text-sm font-medium text-[#5f6368] mt-2 text-center">
              fetching data securely from your public profile url
            </p>

            {/* Status indicator with sharper edges (rounded-md) */}
            <div className="mt-6 flex items-center gap-2 bg-[#f8f9fa] px-5 py-2 rounded-md border border-[#dadce0]">
              <div className="w-2 h-2 bg-[#34a853] rounded-full animate-pulse"></div>
              <p className="text-[11px] font-extrabold text-[#3c4043] uppercase tracking-widest">Calculating Points</p>
            </div>
          </div>
        </div>

        {/* --- SKELETON BACKGROUND --- */}
        <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-10 opacity-40 select-none pointer-events-none">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="h-10 w-64 bg-blue-100/60 rounded-md animate-fast-pulse"></div>
            <div className="h-10 w-40 bg-blue-200/50 rounded-lg animate-fast-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm animate-fast-pulse p-8 flex flex-col justify-center items-center">
              <div className="h-6 w-48 bg-blue-200/60 rounded mb-4"></div>
              <div className="h-4 w-32 bg-blue-200/40 rounded mb-6"></div>
              <div className="w-full max-w-sm h-3 bg-blue-100/50 rounded-full mb-3"></div>
              <div className="h-3 w-40 bg-blue-200/50 rounded"></div>
            </div>
            <div className="h-48 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm animate-fast-pulse p-8 flex flex-col justify-center items-center">
              <div className="h-6 w-56 bg-indigo-200/60 rounded mb-6"></div>
              <div className="h-16 w-16 bg-indigo-200/50 rounded-full mb-4"></div>
              <div className="h-8 w-40 bg-indigo-200/40 rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#f4f7fb] border border-[#dadce0] p-6 md:p-10 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-[#e8eaed] overflow-hidden flex flex-col h-[500px] animate-fast-pulse">
                <div className="h-20 bg-gradient-to-r from-indigo-100 to-purple-100 w-full"></div>
                <div className="flex-grow flex flex-col items-center pt-8 px-8 pb-6">
                  <div className="w-28 h-28 bg-green-50 rounded-full border-4 border-white mb-6"></div>
                  <div className="h-6 w-48 bg-[#e8f0fe] rounded mb-6"></div>
                  <div className="h-10 w-36 bg-blue-100/50 rounded-full mb-8"></div>
                  <div className="h-20 w-20 bg-yellow-50 rounded-full mb-8"></div>
                  <div className="h-12 w-full bg-yellow-100/50 rounded-full mb-6"></div>
                  <div className="h-8 w-full bg-[#e8f0fe] rounded-full mt-auto"></div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-6 lg:pl-4 mt-8 lg:mt-0">
                <div className="bg-white p-6 rounded-xl border border-[#dadce0] shadow-sm animate-fast-pulse h-32 flex flex-col items-center justify-center">
                  <div className="h-4 w-32 bg-gray-100 rounded mb-4"></div>
                  <div className="h-12 w-full bg-green-50 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-2 gap-5 w-full">
                  <div className="bg-white px-6 py-8 rounded-xl border border-[#dadce0] shadow-sm animate-fast-pulse flex flex-col items-center justify-center h-32">
                    <div className="h-10 w-16 bg-[#e8f0fe] rounded mb-3"></div>
                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                  </div>
                  <div className="bg-white px-6 py-8 rounded-xl border border-[#dadce0] shadow-sm animate-fast-pulse flex flex-col items-center justify-center h-32">
                    <div className="h-10 w-16 bg-[#e8f0fe] rounded mb-3"></div>
                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#dadce0] shadow-sm animate-fast-pulse h-16 w-full border-2 border-blue-50"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-5">
              <div className="h-6 w-56 bg-blue-100/60 rounded animate-fast-pulse"></div>
              <div className="h-10 w-36 bg-blue-200/50 rounded-lg animate-fast-pulse"></div>
            </div>
            <div className="bg-white border border-[#dadce0] rounded-lg shadow-sm animate-fast-pulse">
              <div className="h-12 border-b border-[#dadce0] bg-[#f8f9fa] flex items-center px-6">
                <div className="h-4 w-8 bg-gray-200 rounded mr-4"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
              </div>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-16 border-b border-[#f1f3f4] flex items-center px-6">
                  <div className="h-4 w-8 bg-blue-50 rounded mr-4"></div>
                  <div className="h-5 w-1/2 bg-blue-50 rounded mr-auto"></div>
                  <div className="h-4 w-24 bg-gray-100 rounded mr-10"></div>
                  <div className="h-8 w-16 bg-blue-100/40 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
          
        </main>
        
        <style jsx>{`
          @keyframes fast-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-fast-pulse {
            animation: fast-pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>
    );
  }

  // ================= 🔥 ERROR SCREEN 🔥 =================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans px-6 text-center">
         <Navbar />
         <div className="text-6xl mb-4">⚠️</div>
         <h2 className="text-2xl font-bold text-[#d93025] mb-2">Something went wrong!</h2>
         <p className="text-[#5f6368] mb-6 max-w-md">{error}</p>
         <button onClick={() => router.push('/calculator')} className="px-6 py-3 bg-[#1a73e8] text-white font-bold rounded-lg shadow hover:bg-[#1557b0]">
           Go Back to Calculator
         </button>
      </div>
    );
  }

  // ================= 🔥 MAIN DASHBOARD UI 🔥 =================
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-fade-in-up">
           <h1 className="text-3xl md:text-4xl font-bold text-[#202124] tracking-tight">Your Dashboard</h1>
           
           <div className="flex flex-col sm:flex-row gap-3">
             <button 
               onClick={() => {
                 localStorage.removeItem("arcade_user_data");
                 router.push('/calculator');
               }} 
               className="inline-flex justify-center items-center gap-2 text-[#5f6368] font-bold px-5 py-2.5 bg-white border border-[#dadce0] rounded-lg shadow-sm hover:bg-[#f1f3f4] hover:text-[#202124] transition-all"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               Refresh Dashboard
             </button>
             <button 
               onClick={() => router.push('/calculator')} 
               className="inline-flex justify-center items-center gap-2 text-white font-bold px-5 py-2.5 bg-[#1a73e8] rounded-lg shadow-sm hover:bg-[#1557b0] transition-all"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Calculate Points
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          
          <div className="bg-white border border-blue-200 rounded-2xl p-8 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden transition-all hover:shadow-md hover:border-blue-300">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-blue-600 tracking-tight">Arcade Program 2026</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">January 2026 - Dec 2026</p>
            </div>
            <div className="w-full max-w-sm h-3 bg-gray-100 rounded-full flex overflow-hidden mb-3 shadow-inner">
              <div className="bg-blue-500 h-full w-[60%] animate-[pulse_2s_ease-in-out_infinite]"></div>
              <div className="bg-purple-500 h-full w-[40%]"></div>
            </div>
            <p className="text-xs text-gray-400 font-medium">Season is currently active</p>
          </div>

          <div 
            onClick={() => router.push('/facilitator')}
            className="cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 border border-indigo-800 rounded-2xl p-8 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-xl font-black text-white mb-6 z-10 tracking-tight">Facilitator Program 2026</h3>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30 shadow-inner z-10">
              <span className="text-2xl drop-shadow-md">🎓</span>
            </div>
            <p className="text-sm font-bold text-blue-100 z-10 bg-white/10 px-5 py-2 rounded-full border border-white/10 backdrop-blur-sm uppercase tracking-wider">
              Enrolments Opening Soon
            </p>
          </div>
        </div>

        {points !== null && (
          <div className="bg-[#f4f7fb] border border-[#dadce0] p-6 md:p-10 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-[#e8eaed] overflow-hidden relative flex flex-col group transition-shadow duration-300">
                <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] py-5 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-30 transform -skew-x-12"></div>
                  <h3 className="text-white font-black text-2xl tracking-wide shadow-sm relative z-10">
                    Arcade Points: {points}
                  </h3>
                </div>
                
                <div className="px-8 pt-8 pb-6 flex flex-col items-center relative bg-gradient-to-b from-[#f8f9fa] to-transparent flex-grow">
                  <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-md flex items-center justify-center overflow-hidden mb-5 relative bg-[#137333] ring-4 ring-[#e6f4ea] transform transition-transform hover:scale-105">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl text-white font-bold">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                    )}
                  </div>
                  
                  <h2 className="text-[26px] font-black text-[#202124] mb-4 text-center tracking-tight leading-tight">
                    {userName || "Arcade Player"}
                  </h2>

                  <button 
                    onClick={handleCopyProfile}
                    className={`text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2 mb-7 ${copied ? 'bg-[#34a853] text-white ring-2 ring-[#ceead6]' : 'bg-gradient-to-r from-[#8ab4f8] to-[#4285f4] hover:from-[#669df6] hover:to-[#1a73e8] text-white'}`}
                  >
                    {copied ? (
                      <>Copied! <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></>
                    ) : (
                      <>Public Profile <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></>
                    )}
                  </button>

                  <div className="mb-6 drop-shadow-sm">
                    <svg width="75" height="75" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 85L50 70L75 85V45H25V85Z" fill="#d35400"/>
                      <circle cx="50" cy="40" r="34" fill="#f39c12"/>
                      <circle cx="50" cy="40" r="26" fill="#e67e22"/>
                      <path d="M50 22L54 32.5H65L56 39L59.5 49L50 43L40.5 49L44 39L35 32.5H46L50 22Z" fill="#fffaf0"/>
                    </svg>
                  </div>

                  <div className="relative group w-full mb-5">
                     <button 
                       onClick={() => router.push('/leaderboard')}
                       className="w-full bg-gradient-to-r from-[#fbbc04] to-[#f29900] text-white font-extrabold text-xl py-3 px-8 rounded-full shadow-sm text-center tracking-wide hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                     >
                       Rank # {realRank || "-"}
                     </button>
                  </div>

                  <div className="text-[13px] font-extrabold text-[#1a73e8] bg-[#e8f0fe] px-5 py-1.5 rounded-full uppercase tracking-wider mb-6 text-center border border-[#d2e3fc]">
                    User Progress Report
                  </div>

                  <div className="text-sm font-bold text-[#80868b] border-t border-[#e8eaed] pt-5 w-full text-center mt-auto tracking-wide uppercase">
                    Member since <span className="text-[#3c4043]">{getMemberSinceYear()}</span>
                  </div>
                </div>
              </div>

             {/* RIGHT: Stats & Share Buttons */}
              <div className="lg:col-span-7 flex flex-col justify-center gap-6 pl-0 lg:pl-4 mt-8 lg:mt-0">
                
                {/* --- NEW ACTION BUTTONS BOX --- */}
                {/* White border aur background hata diya hai, aur gap ko 5 kar diya hai thode extra space ke liye */}
                <div className="flex flex-col justify-center gap-5">
                  
                  {/* Clean Normal Heading */}
                  <h4 className="text-sm font-semibold text-[#5f6368] uppercase tracking-wide">
                    Quick Actions
                  </h4>

                  {/* Celebration Card Button */}
                  <button 
                    onClick={() => {
                      setIsCardGenerated(true);
                      setTimeout(() => {
                        document.getElementById('celebration-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                  >
                    <span>✨ Generate Celebration Achievements Card</span>
                    <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* Skill Badges Button */}
                  <button 
                    onClick={() => router.push('/resources')}
                    className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                  >
                    <span>Skill badges List here</span>
                    <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* WhatsApp Share Button */}
                  <button onClick={shareToWhatsApp} className="relative w-full group bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.002 0h-.004C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.543 5.867L.085 23.316l5.59-1.464C7.382 22.84 9.614 23.4 12 23.4c6.627 0 12-5.373 12-12S18.627 0 12.002 0zm0 21.45c-1.802 0-3.535-.466-5.1-1.348l-.366-.217-3.793.994.996-3.698-.238-.378A9.452 9.452 0 012.55 12c0-5.215 4.236-9.45 9.452-9.45s9.45 4.235 9.45 9.45-4.234 9.45-9.45 9.45zm5.198-6.85c-.285-.143-1.685-.83-1.946-.925-.262-.095-.453-.143-.643.143-.19.285-.736.925-.903 1.115-.166.19-.333.214-.618.071-.286-.143-1.203-.443-2.292-1.25-.848-.628-1.42-1.405-1.586-1.69-.167-.285-.018-.439.125-.582.129-.128.286-.333.428-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.643-1.552-.88-2.124-.233-.556-.47-.48-.643-.489-.166-.008-.357-.008-.547-.008-.19 0-.5.071-.762.357-.262.285-1 .975-1 2.378s1.024 2.758 1.167 2.948c.143.19 2.012 3.072 4.872 4.306.68.293 1.213.468 1.626.598.683.214 1.305.183 1.794.111.547-.08 1.685-.688 1.923-1.353.238-.665.238-1.235.166-1.353-.071-.119-.262-.19-.547-.333z"/>
                      </svg>
                      Share your points
                    </span>
                  </button>

                </div>

                <div className="grid grid-cols-2 gap-5 w-full">
                  <div className="bg-white px-6 py-5 rounded-xl border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#1a73e8] hover:shadow-md transition-all">
                    <span className="text-4xl font-black text-[#202124] leading-none mb-2">
                      {history.filter(item => item.type !== 'Skill Badge').length}
                    </span>
                    <span className="text-[13px] text-[#5f6368] font-bold uppercase tracking-wider text-center">All Games</span>
                  </div>

                  <div className="bg-white px-6 py-5 rounded-xl border border-[#dadce0] flex flex-col items-center justify-center shadow-sm hover:border-[#1a73e8] hover:shadow-md transition-all">
                    <span className="text-4xl font-black text-[#202124] leading-none mb-2">
                      {breakdown?.skills || 0}
                    </span>
                    <span className="text-[13px] text-[#5f6368] font-bold uppercase tracking-wider text-center">Skill Badges</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full">

                 <button 
                  onClick={() => router.push('/leaderboard')} 
                  className="relative w-full group bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base outline-none tracking-wide"
                >
                  <span>View Full Leaderboard</span>
                  
                  {/* PREMIUM LONG ARROW (Sleek & White) */}
                  <span className="absolute right-6 group-hover:translate-x-2 transition-transform duration-300 flex items-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m0 0l-6-6m6 6l-6 6" />
                    </svg>
                  </span>
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 🔥 BADGE COMPLETION HISTORY BOX 🔥 ================= */}
        {points !== null && (
          <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
              <h4 className="text-base font-extrabold text-[#3c4043] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Badge Completion History
              </h4>
              
              <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all w-full sm:w-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV Report
              </button>
            </div>
            
            <div className="bg-white border border-[#dadce0] rounded-lg overflow-hidden shadow-sm">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
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
                          <td className="px-5 py-4 text-base font-bold text-[#80868b] text-center border-r border-[#f1f3f4]">{i + 1}</td>
                          <td className="px-6 py-4"><p className="text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">{item.name}</p></td>
                          <td className="px-6 py-4 whitespace-nowrap border-l border-[#f1f3f4]"><p className="text-base text-[#5f6368] font-semibold">{item.date}</p></td>
                          <td className="px-6 py-4 text-center border-l border-[#f1f3f4]">
                            <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-black shadow-sm ${item.points >= 2 ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]' : item.points === 1 ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]' : 'bg-[#f3e8fd] text-[#8430ce] border border-[#d7aefb]'}`}>
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

        {/* ================= 🔥 SMART 1-CLICK CELEBRATION GENERATOR 🔥 ================= */}
        {points !== null && (
          <div id="celebration-section" className="mt-12 bg-white border border-[#dadce0] rounded-lg shadow-sm overflow-hidden animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="bg-[#f8f9fa] border-b border-[#dadce0] px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="text-lg font-extrabold text-[#202124] flex items-center gap-2">
                  🎉 Celebration Card Generator
                </h4>
                <p className="text-sm text-[#5f6368] font-medium mt-0.5">Create a premium achievement poster to flex your hard work!</p>
              </div>
            </div>
            
            <div className="p-6 md:p-10 flex flex-col items-center gap-6">
              {!isCardGenerated ? (
                <button onClick={() => setIsCardGenerated(true)} className="px-8 py-4 bg-[#1a73e8] text-white font-extrabold text-lg rounded-lg shadow-sm hover:bg-[#1557b0] transition-all flex items-center gap-3">
                  ✨ Generate My Poster
                </button>
              ) : (
                <div className="w-full flex flex-col lg:flex-row gap-10 items-center justify-center">
                  
                  {/* Left Col: Emoji Options & Details */}
                  <div className="w-full lg:w-1/3 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">1. Choose Your Vibe</label>
                      <div className="flex flex-wrap gap-2 bg-[#f8f9fa] border border-[#dadce0] p-2 rounded-lg">
                        {['🚀', '🏆', '🔥', '🎉', '😎', '☁️', '🥳', '❤️', '🥰', '😍', '🤩'].map((emoji) => (
                          <button 
                            key={emoji} 
                            onClick={() => setFlexEmoji(emoji)}
                            className={`flex-1 min-w-[40px] py-2 text-xl rounded-md transition-all ${flexEmoji === emoji ? 'bg-white shadow-sm scale-110 border border-[#dadce0] z-10' : 'hover:bg-[#e8f0fe] grayscale-[50%] opacity-70'}`}
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
                        className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#202124] font-semibold outline-none focus:border-[#1a73e8] focus:bg-white transition-all text-sm"
                        placeholder="e.g., Leveling up my skills!"
                        maxLength={40}
                      />
                    </div>
                    
                    <button onClick={() => shareCardAsImage('whatsapp')} disabled={isGeneratingImg} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-base font-bold rounded-xl transition-all shadow-sm">
                      {isGeneratingImg ? "Generating..." : "Download & Share Image"}
                    </button>
                  </div>

                  {/* Right Col: PREMIUM UI CARD FOR CANVAS */}
                  <div className="w-full lg:w-2/3 flex flex-col items-center">
                    <div className="w-full overflow-x-auto pb-4 flex justify-center">
                      <div 
                        ref={cardRef} 
                        id="celebration-card"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif', minWidth: '550px', backgroundColor: '#ffffff' }}
                        className="w-full max-w-[550px] mx-auto p-8 rounded-lg shadow-sm relative overflow-hidden border border-[#dadce0] flex flex-col"
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none z-0">
                          <span style={{ fontSize: '16rem', display: 'block', lineHeight: 1 }}>{flexEmoji}</span>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4285f4] via-[#34a853] via-[#fbbc04] to-[#ea4335] z-10"></div>

                        <div className="flex justify-between items-start relative z-10 mb-6 pt-2">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-bold text-2xl ring-2 ring-[#e8f0fe] shrink-0">
                              {userName ? userName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col justify-center">
                              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#202124', margin: 0, padding: 0, lineHeight: '1.2' }}>
                                {userName || "Arcade Player"}
                              </h3>
                              <div style={{ marginTop: '6px' }}>
                                <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 'bold', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '4px 10px', borderRadius: '99px', border: '1px solid #d2e3fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Cloud Verified
                                </span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: '#b06000', backgroundColor: '#fff8e1', border: '1px solid #fde293', padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Achievement
                            </span>
                            <span style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{flexEmoji}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', padding: '24px 0', position: 'relative', zIndex: 10 }}>
                          <p style={{ fontSize: '13px', fontWeight: '800', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                            Total Arcade Points
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '110px', fontWeight: '900', color: '#1a73e8', lineHeight: '0.8', margin: 0, padding: 0 }}>
                              {points}
                            </span>
                            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a73e8' }}>pts</span>
                          </div>
                          <div style={{ marginTop: '32px' }}>
                            <span style={{ display: 'inline-block', fontSize: '16px', fontWeight: 'bold', color: '#137333', backgroundColor: '#e6f4ea', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ceead6' }}>
                              {flexMilestone || "Leveling up my cloud skills!"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-6 mt-4 border-t border-[#dadce0] relative z-10">
                          <div className="flex flex-col gap-1">
                            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#80868b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                              Facilitated By
                            </p>
                            <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                              <span style={{ fontSize: '14px', backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ceead6' }}>👨‍🏫</span>
                              <p style={{ fontSize: '16px', fontWeight: '900', color: '#202124', margin: 0 }}>
                                Manish Kumar & Anjali P.
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#80868b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginBottom: '6px' }}>
                              Season 2026
                            </p>
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#5f6368', backgroundColor: '#f8f9fa', padding: '6px 10px', borderRadius: '4px', border: '1px solid #dadce0' }}>
                              Arcade Nexus
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

{/* ================= PREMIUM REWARDS (SWAGS) SECTION ================= */}
<div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
  
  {/* 1. Prize Tier System Box */}
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl pointer-events-none"></div>
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-12 h-12 bg-gradient-to-br from-[#1a73e8] to-[#4285f4] text-white rounded-full flex items-center justify-center shadow-md">
        <span className="text-xl">🏆</span>
      </div>
      <div>
        <span className="font-extrabold text-gray-800 text-lg block">Prize Tier System</span>
        <span className="text-xs text-[#1a73e8] font-bold uppercase tracking-wider">Unlock Premium Gear</span>
      </div>
    </div>
    <div className="text-center relative z-10">
      <div className="mt-2 inline-flex items-center gap-2 bg-white border border-blue-100 px-5 py-2 rounded-lg shadow-sm">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status:</span>
        <span className="text-sm font-black text-[#1a73e8]">To be announced</span>
      </div>
    </div>
  </div>

  {/* 2. Swags Image */}
  <img 
    src="https://i.postimg.cc/MT50zzG8/1775382064372.png" 
    alt="Premium Swags Showcase" 
    className="w-full max-w-5xl mx-auto h-auto block rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] relative z-10 transition-transform duration-700 hover:scale-[1.01] my-12" 
  />

  {/* 3. Note Banner */}
  <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm font-bold rounded-xl p-4 text-center shadow-sm flex items-center justify-center gap-3">
    <span className="text-xl">ℹ️</span>
    Note: These are the previous season 2025 swags. New premium prizes for 2026 will be revealed soon!
  </div>

</div>

      </main>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
      `}</style>
    </div>
  );
}