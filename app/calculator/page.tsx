"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { saveUserPoints, subscribeLeaderboard } from "@/lib/leaderboard"; 
import Navbar from "@/app/components/Navbar";
import html2canvas from "html2canvas"; 
import { useRouter } from "next/navigation"; 
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // UPDATED IMPORT

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

  // ================= 🔥 NEW PREMIUM CARD STATES 🔥 =================
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [realRank, setRealRank] = useState<number | null>(null);
  const [loginToast, setLoginToast] = useState(false); // LOGIN SUCCESS TOAST STATE

  // ================= 🔥 CELEBRATION GENERATOR STATES 🔥 =================
  const [flexName, setFlexName] = useState("");
  const [flexPoints, setFlexPoints] = useState("");
  const [flexMilestone, setFlexMilestone] = useState("");
  const [flexEmoji, setFlexEmoji] = useState("🚀");
  const [isCardGenerated, setIsCardGenerated] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false); 

  const cardRef = useRef<HTMLDivElement>(null);

  // Listen to Auth State for Sign-in Button & Real Rank
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setCurrentUser);
    return () => unsub();
  }, []);

  // ================= 🔥 DIRECT GOOGLE LOGIN LOGIC 🔥 =================
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoginToast(true);
      setTimeout(() => setLoginToast(false), 3500); // Hide toast after 3.5s
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // ================= 🔥 LEADERBOARD RANK FETCHING 🔥 =================
  useEffect(() => {
    if (!currentUser) {
      setRealRank(null);
      return;
    }
    // Fetch actual rank from leaderboard if user is logged in
    const unsub = subscribeLeaderboard((leaders: any[]) => {
      const me = leaders.find((l: any) => l.id === currentUser.uid);
      if (me && me.rank) {
        setRealRank(me.rank);
      }
    });
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (userName) setFlexName(userName);
    if (points !== null) {
      setFlexPoints(points.toString());
    }
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

  // Helper function to calculate 'Member Since' year
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

  // ================= UPDATED WHATSAPP SHARE LOGIC =================
  const shareToWhatsApp = () => {
    const text = `🔥 Yooo! I just reached *${points} points* on the Google Cloud Arcade 2026! 🚀\n\n👤 *Name:* ${userName || "Arcade Player"}\n🎯 *Points:* ${points}\n🔗 *My Public Profile:* ${profileUrl}\n\nCheck your own points and track your swags easily using this awesome Calculator:\n${websiteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    const text = `🚀 Thrilled to share that I have successfully accumulated ${points} points in the Google Cloud Arcade 2026 program!\n\nConsistent learning and hands-on practice in cloud tech is paying off. Big thanks to the community! ☁️✨\n\nYou can calculate your Arcade points instantly using this tool: ${websiteUrl}\n\n#GoogleCloud #GoogleCloudArcade #CloudComputing #Learning`;
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank");
  };

  const whatsappHelpMessage = encodeURIComponent("Hello Facilitator Manish! 👋\n\nI am reaching out regarding the Google Cloud Arcade program. I need some guidance with my profile and points calculation. Could you please help me out?");
  const whatsappHelpUrl = `https://api.whatsapp.com/send?phone=918538980608&text=${whatsappHelpMessage}`;

  // ================= 🔥 RESTORED & FIXED: DIRECT SHARE IMAGE LOGIC 🔥 =================
  const shareCardAsImage = async (platform: 'whatsapp' | 'linkedin') => {
    if (!cardRef.current) return;
    setIsGeneratingImg(true);

    try {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff",
        logging: false,
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

      // Check for Mobile Native Share first
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "Arcade_Milestone.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "My Arcade Milestone",
              text: textForPost,
              files: [file]
            });
            setIsGeneratingImg(false);
            return;
          } catch (e: any) {
            if (e.name === 'AbortError') {
              setIsGeneratingImg(false);
              return;
            }
          }
        }

        // Fallback for PC/Desktop - Copy Image to Clipboard & Open Platform
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          alert(`✅ Poster Copied! Opening ${platform}... Just Paste (Ctrl+V) it to share!`);
        } catch (clipboardErr) {
          // Absolute Fallback - Download
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
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans relative">
      
      {/* LOGIN SUCCESS TOAST */}
      {loginToast && (
        <div className="fixed top-24 right-5 bg-[#34a853] text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 font-bold transition-all duration-500 transform translate-y-0 opacity-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
          Login Successful!
        </div>
      )}

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3.5 bg-[#e8f0fe] border border-[#d2e3fc] rounded-xl mb-6 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H5v-4h9v4zM5 11V7h9v4H5zm12 6h-2v-4h2v4zm0-6h-2V7h2v4z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#202124] tracking-tight mb-4 leading-tight">
            Arcade Points <span className="text-[#1a73e8]">Calculator</span>
          </h1>
          <p className="text-[#5f6368] text-base md:text-lg mb-8 font-medium">
            Calculate your exact points from Google Cloud Skills Boost public profile URL.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left items-stretch">
            {/* How to Use Box - Highlighted & Professional */}
            <div className="bg-[#f8fbff] border border-[#aecbfa] rounded-lg p-6 shadow-md flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-[#202124] font-extrabold text-[18px] mb-4 flex items-center gap-2 border-b border-[#d2e3fc] pb-3">
                <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                How to use Calculator?
              </h3>
              <ul className="list-disc pl-5 space-y-3.5 text-[#3c4043] text-[15px] font-medium flex-grow">
                <li>Your profile <span className="bg-[#e8eaed] text-[#202124] px-1.5 py-0.5 rounded font-bold text-xs uppercase tracking-wider mx-1 border border-[#dadce0]">must be public</span> to fetch data.</li>
                <li>Copy your complete profile URL (e.g., <code className="bg-[#ffffff] px-1.5 py-0.5 rounded text-[#1a73e8] font-mono text-sm border border-[#d2e3fc] shadow-sm">https://www.skills.google/public_profiles/...</code></li>
                <li>Paste the exact URL in the input box below and click Calculate.</li>
                <li>Invalid, broken, or private URLs will return an error.</li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-[#d2e3fc] mt-auto">
                <a href={whatsappHelpUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] px-4 py-3 rounded-lg text-sm font-bold transition-colors border border-[#ceead6] shadow-sm hover:shadow">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.387-.885-.719-1.484-1.608-1.658-1.906-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Need Help? Ask Facilitator
                </a>
              </div>
            </div>

            {/* How to Setup Profile Box - Highlighted & Step by Step */}
            <div className="bg-[#f8fbff] border border-[#aecbfa] rounded-lg p-6 shadow-md flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-[#202124] font-extrabold text-[18px] mb-4 flex items-center gap-2 border-b border-[#d2e3fc] pb-3">
                <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                How to make Profile Public?
              </h3>
              
              <div className="space-y-4 text-[15px] text-[#3c4043] font-medium flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-56">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center justify-center text-sm font-extrabold shadow-sm">1</span>
                  <p>Go to <a href="https://www.skills.google/" target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline font-bold">skills.google</a></p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center justify-center text-sm font-extrabold shadow-sm">2</span>
                  <p>Top right corner: Click <strong>Sign in</strong> or the blue <strong>Join now</strong> button.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center justify-center text-sm font-extrabold shadow-sm">3</span>
                  <p>Select <strong>Continue with Google</strong> using your lab email.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center justify-center text-sm font-extrabold shadow-sm">4</span>
                  <p>After login, click your <strong>profile avatar</strong> (top right) and select <strong>Settings</strong>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center justify-center text-sm font-extrabold shadow-sm">5</span>
                  <p>Under Public visibility, check <strong>Make profile public</strong> and click <strong>Update settings</strong>.</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#d2e3fc] mt-auto">
                <a href={whatsappHelpUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] px-4 py-3 rounded-lg text-sm font-bold transition-colors border border-[#ceead6] shadow-sm hover:shadow">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.387-.885-.719-1.484-1.608-1.658-1.906-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Need Help? Ask Facilitator
                </a>
              </div>
            </div>
          </div>
          
          {/* Mandatory Warning Note */}
          <div className="bg-[#fef7e0] border border-[#fce8b2] p-4 mb-8 rounded-lg text-left shadow-sm flex gap-3 items-start">
            <svg className="w-6 h-6 text-[#f29900] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div>
              <p className="text-sm text-[#b06000] font-extrabold mb-1">Mandatory for New & Existing Members</p>
              <p className="text-sm text-[#b06000] font-medium">If your account is not completely public, Google will not be able to see your progress, and you cannot calculate your points here.</p>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-xl border border-[#dadce0] shadow-sm overflow-hidden">
          
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
              <div className={`relative border-2 rounded-lg transition-colors duration-75 ${error ? (hideRedLine ? "border-[#dadce0]" : "border-[#d93025]") : "border-[#dadce0] focus-within:border-[#1a73e8]"}`}>
                <label className={`absolute -top-3 left-3 bg-white px-1 text-sm font-bold transition-colors duration-75 ${error ? (hideRedLine ? "text-[#5f6368]" : "text-[#d93025]") : "text-[#1a73e8]"}`}>
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
                  className="w-full px-4 py-4 text-base text-[#202124] bg-transparent outline-none rounded-lg"
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

            <button onClick={calculatePoints} disabled={loading} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#174ea6] text-white text-lg font-bold py-4 rounded-lg transition-all disabled:bg-[#f1f3f4] disabled:text-[#9aa0a6] flex justify-center items-center gap-2 shadow-sm">
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
                      <button key={idx} onClick={() => { setProfileUrl(url); setError(null); setHideRedLine(false); }} className="px-4 py-2 bg-white hover:bg-[#e8f0fe] border border-[#dadce0] hover:border-[#1a73e8] text-[#202124] hover:text-[#1a73e8] text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm" title={url}>
                        <svg className="w-4 h-4 text-[#5f6368] opacity-70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        {shortId}...
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ================= 🔥 NEW PREMIUM RESULTS SECTION 🔥 ================= */}
          {points !== null && (
            <div className="bg-[#f4f7fb] border-t border-[#dadce0] p-6 md:p-10 animate-fade-in-up rounded-b-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: Premium Profile Card */}
                <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-[#e8eaed] overflow-hidden relative flex flex-col group transition-shadow duration-300">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] py-5 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-30 transform -skew-x-12"></div>
                    <h3 className="text-white font-black text-2xl tracking-wide shadow-sm relative z-10">
                      Arcade Points: {points}
                    </h3>
                  </div>
                  
                  {/* Content */}
                  <div className="px-8 pt-8 pb-6 flex flex-col items-center relative bg-gradient-to-b from-[#f8f9fa] to-transparent flex-grow">
                    
                    {/* Avatar */}
                    <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-md flex items-center justify-center overflow-hidden mb-5 relative bg-[#137333] ring-4 ring-[#e6f4ea] transform transition-transform hover:scale-105">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl text-white font-bold">{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                      )}
                    </div>
                    
                    {/* Name */}
                    <h2 className="text-[26px] font-black text-[#202124] mb-4 text-center tracking-tight leading-tight">
                      {userName || "Arcade Player"}
                    </h2>

                    {/* Copy Public Profile Button */}
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

                    {/* Badge (Ribbon style SVG) */}
                    <div className="mb-6 drop-shadow-sm">
                      <svg width="75" height="75" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 85L50 70L75 85V45H25V85Z" fill="#d35400"/>
                        <circle cx="50" cy="40" r="34" fill="#f39c12"/>
                        <circle cx="50" cy="40" r="26" fill="#e67e22"/>
                        <path d="M50 22L54 32.5H65L56 39L59.5 49L50 43L40.5 49L44 39L35 32.5H46L50 22Z" fill="#fffaf0"/>
                      </svg>
                    </div>

                    {/* ================= 🔥 UPDATED RANK PILL & TOOLTIP 🔥 ================= */}
                    <div className="relative group w-full mb-5">
                      {currentUser ? (
                        <div className="w-full bg-gradient-to-r from-[#fbbc04] to-[#f29900] text-white font-extrabold text-xl py-3 px-8 rounded-full shadow-sm text-center tracking-wide">
                          Rank # {realRank || "-"}
                        </div>
                      ) : (
                        <button 
                          onClick={handleGoogleLogin}
                          className="w-full bg-gradient-to-r from-[#fbbc04] to-[#f29900] text-white font-extrabold text-[15px] py-3 px-8 rounded-full shadow-sm text-center tracking-wide hover:shadow-md transition-all cursor-pointer"
                        >
                          Sign in for rank
                        </button>
                      )}
                      
                      {/* Tooltip for non-logged in users */}
                      {!currentUser && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#202124] text-white text-xs font-bold py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          Sign in to unlock Leaderboard
                          <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#202124] rotate-45"></div>
                        </div>
                      )}
                    </div>

                    {/* User Progress Report Title */}
                    <div className="text-[13px] font-extrabold text-[#1a73e8] bg-[#e8f0fe] px-5 py-1.5 rounded-full uppercase tracking-wider mb-6 text-center border border-[#d2e3fc]">
                      User Progress Report
                    </div>

                    {/* Member Since */}
                    <div className="text-sm font-bold text-[#80868b] border-t border-[#e8eaed] pt-5 w-full text-center mt-auto tracking-wide uppercase">
                      Member since <span className="text-[#3c4043]">{getMemberSinceYear()}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Stats & Navigation Buttons */}
                <div className="lg:col-span-7 flex flex-col justify-center gap-8 pl-0 lg:pl-4 mt-8 lg:mt-0">
                  
                  {/* ====== PREMIUM SIGN IN BLOCK (NEW) ====== */}
                  {!currentUser && (
                    <div className="bg-white p-6 rounded-xl border border-[#dadce0] shadow-sm flex flex-col justify-center items-center gap-4 mb-2">
                      <div>
                         <p className="text-sm font-black text-[#5f6368] uppercase tracking-wider mb-1 text-center">Save Your Progress</p>
                         <p className="text-xs font-medium text-[#80868b] text-center">Sign in with Google to track your rank and points</p>
                      </div>
                      <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-[#f8f9fa] text-[#3c4043] text-base font-bold rounded-xl transition-all border border-[#dadce0] shadow-sm hover:shadow-md">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                      </button>
                    </div>
                  )}

                  {/* Share Actions Area (WhatsApp Only) */}
                  <div className="bg-white p-6 rounded-xl border border-[#dadce0] shadow-sm flex flex-col justify-center items-center gap-4">
                    <div>
                       <p className="text-sm font-black text-[#5f6368] uppercase tracking-wider mb-1 text-center">Share your points</p>
                    </div>
                    <button onClick={shareToWhatsApp} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-base font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.002 0h-.004C5.373 0 0 5.373 0 12c0 2.123.553 4.122 1.543 5.867L.085 23.316l5.59-1.464C7.382 22.84 9.614 23.4 12 23.4c6.627 0 12-5.373 12-12S18.627 0 12.002 0zm0 21.45c-1.802 0-3.535-.466-5.1-1.348l-.366-.217-3.793.994.996-3.698-.238-.378A9.452 9.452 0 012.55 12c0-5.215 4.236-9.45 9.452-9.45s9.45 4.235 9.45 9.45-4.234 9.45-9.45 9.45zm5.198-6.85c-.285-.143-1.685-.83-1.946-.925-.262-.095-.453-.143-.643.143-.19.285-.736.925-.903 1.115-.166.19-.333.214-.618.071-.286-.143-1.203-.443-2.292-1.25-.848-.628-1.42-1.405-1.586-1.69-.167-.285-.018-.439.125-.582.129-.128.286-.333.428-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.643-1.552-.88-2.124-.233-.556-.47-.48-.643-.489-.166-.008-.357-.008-.547-.008-.19 0-.5.071-.762.357-.262.285-1 .975-1 2.378s1.024 2.758 1.167 2.948c.143.19 2.012 3.072 4.872 4.306.68.293 1.213.468 1.626.598.683.214 1.305.183 1.794.111.547-.08 1.685-.688 1.923-1.353.238-.665.238-1.235.166-1.353-.071-.119-.262-.19-.547-.333z"/>
                      </svg>
                      Share your points
                    </button>
                  </div>

                  {/* Summary Blocks (Clean Border) */}
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

                  {/* HUGE Action Buttons (Less Curve) */}
                  <div className="flex flex-col gap-4 w-full">
                    <button 
                      onClick={() => router.push('/dashboard')} 
                      className="w-full group bg-gradient-to-r from-[#1a73e8] to-[#4285f4] hover:from-[#1557b0] hover:to-[#1a73e8] text-white font-black py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between text-lg outline-none"
                    >
                      <span className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Go to Dashboard
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                    
                    <button 
                      onClick={() => router.push('/leaderboard')} 
                      className="w-full group bg-white hover:bg-[#f8fbff] text-[#1a73e8] border-2 border-[#1a73e8] font-black py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between text-lg outline-none"
                    >
                      <span className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Check your rank status
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= 🔥 WIDER BADGE COMPLETION HISTORY BOX (MOVED UP) 🔥 ================= */}
        {points !== null && (
          <div className="mt-12 animate-fade-in-up md:-mx-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4 px-4 md:px-0">
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
                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-black shadow-sm ${item.points >= 2 ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]' : item.points === 1 ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]' : 'bg-[#f3e8fd] text-[#8430ce] border border-[#d7aefb]'}`}>
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

        {/* ================= 🔥 SMART 1-CLICK CELEBRATION GENERATOR (MOVED DOWN) 🔥 ================= */}
        {points !== null && (
        <div className="mt-12 bg-white border border-[#dadce0] rounded-lg shadow-sm overflow-hidden md:-mx-12 animate-fade-in-up">
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
                  
                  <div className="bg-[#e8f0fe] p-5 rounded-lg border border-[#d2e3fc]">
                    <p className="text-xs text-[#1a73e8] font-extrabold uppercase tracking-wider">Locked Stats:</p>
                    <ul className="text-sm font-bold text-[#202124] mt-3 space-y-2">
                      <li className="flex items-center gap-2"><span className="text-lg">👤</span> <span className="truncate">{userName || "Arcade Player"}</span></li>
                      <li className="flex items-center gap-2"><span className="text-lg">🎯</span> {points} Points</li>
                      <li className="flex items-center gap-2"><span className="text-lg">👨‍🏫</span> Manish Kumar</li>
                    </ul>
                  </div>
                </div>

                {/* Right Col: PREMIUM UI CARD & Actions */}
                <div className="w-full lg:w-2/3 flex flex-col items-center">
                  
                  {/* ====== EXACT SCREEN-TO-CANVAS LAYOUT UI ====== */}
                  <div className="w-full overflow-x-auto pb-4 flex justify-center">
                    <div 
                      ref={cardRef} 
                      id="celebration-card"
                      style={{ 
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        minWidth: '550px',
                        backgroundColor: '#ffffff'
                      }}
                      className="w-full max-w-[550px] mx-auto p-8 rounded-lg shadow-sm relative overflow-hidden border border-[#dadce0] flex flex-col"
                    >
                      
                      {/* Background Accents (Giant emoji properly centered) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none z-0">
                        <span style={{ fontSize: '16rem', display: 'block', lineHeight: 1 }}>{flexEmoji}</span>
                      </div>

                      {/* Top Google Colors Bar */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4285f4] via-[#34a853] via-[#fbbc04] to-[#ea4335] z-10"></div>

                      {/* Top Header - Using Explicit Inline CSS to stop canvas chopping */}
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
                        {/* 🔥 FIX: Emoji added next to Achievement badge 🔥 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '900', color: '#b06000', backgroundColor: '#fff8e1', border: '1px solid #fde293', padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Achievement
                          </span>
                          <span style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{flexEmoji}</span>
                        </div>
                      </div>

                      {/* Main Score Area - Fixed Alignment and Spacing */}
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
                        
                        {/* Huge Margin top to prevent overlapping text */}
                        <div style={{ marginTop: '32px' }}>
                          <span style={{ display: 'inline-block', fontSize: '16px', fontWeight: 'bold', color: '#137333', backgroundColor: '#e6f4ea', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ceead6' }}>
                            {flexMilestone || "Leveling up my cloud skills!"}
                          </span>
                        </div>
                      </div>

                      {/* Footer / Branding Area */}
                      <div className="flex justify-between items-end pt-6 mt-4 border-t border-[#dadce0] relative z-10">
                        <div className="flex flex-col gap-1">
                          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#80868b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                            Facilitated By
                          </p>
                          <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                            <span style={{ fontSize: '14px', backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ceead6' }}>👨‍🏫</span>
                            <p style={{ fontSize: '16px', fontWeight: '900', color: '#202124', margin: 0 }}>
                              Manish Kumar
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
                  {/* ====== END OF PREMIUM CARD ====== */}

                </div>
              </div>
            )}
          </div>
        </div>
        )}
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm w-full">
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-48 px-4 py-3 bg-[#34a853] text-white text-center rounded-lg font-bold transition-colors hover:bg-[#1e8e3e] shadow-sm border border-[#34a853]">Arcade Page</a>
          </div>
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-48 px-4 py-3 bg-[#34a853] text-white text-center rounded-lg font-bold transition-colors hover:bg-[#1e8e3e] shadow-sm border border-[#34a853]">Subscribe here!</a>
          </div>
          <div className="relative group w-full sm:w-auto flex justify-center">
            <a href="http://qwiklab.zendesk.com/hc/requests/4774945" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-48 px-4 py-3 bg-[#34a853] text-white text-center rounded-lg font-bold transition-colors hover:bg-[#1e8e3e] shadow-sm border border-[#34a853]">Arcade Support</a>
          </div>
        </div>

      </main>
    </div>
  );
}