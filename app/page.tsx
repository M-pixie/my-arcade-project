"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect } from "react"; 

// 🔥 FIREBASE IMPORTS 🔥
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
// 🔥 LEADERBOARD IMPORT FOR AVATARS 🔥
import { subscribeLeaderboard } from "@/lib/leaderboard";

export default function HomePage() {
  const router = useRouter();

  // 🔥 State for Campaign Code Copy Button
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("qlcampaign=6m-ctsdq-27");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 🔥 NEW: State for Referral Code Copy Button
  const [isReferralCopied, setIsReferralCopied] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("GCAF26-IN-9SC-AE9");
    setIsReferralCopied(true);
    setTimeout(() => setIsReferralCopied(false), 2000);
  };

  // 🔥 State for Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags Delivery / Issue");
  const [formSubCategory, setFormSubCategory] = useState(""); 
  const [formMessage, setFormMessage] = useState("");

  // 🔥 Tab State for Premium Guide Section
  const [activeGuideTab, setActiveGuideTab] = useState('start');

  const startSteps = [
    { link: "https://share.google/mn0xUfmd49TA9RPc1", title: "Sign in Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile.", icon: "👤", badge: "Step 1" },
    { link: "https://share.google/45EC3J4RjWLzgbkGy", title: "Registration", desc: "Enroll in Arcade to unlock labs, points and challenges.", icon: "📝", badge: "Step 2" },
    { link: "https://share.google/Ojw8FgQpGhPI1sXyt", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards.", icon: "🚀", badge: "Step 3" },
    { link: "https://share.google/JRMVQ9xd8tTwx8Mol", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards.", icon: "🏅", badge: "Step 4" }
  ];

  const arcadeTools = [
    { title: "Points Calculator", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator", icon: "🔢", badge: "Calc" },
    { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard", icon: "📊", badge: "Dash" },
    { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator", icon: "🤝", badge: "Lead" }
  ];

  const pointsSystem = [
    { title: "Arcade Adventure", desc: "Standard track progression (1 game badge = 1 point)", icon: "🗺️", badge: "1 Pt" },
    { title: "Arcade Voyage", desc: "Intermediate cloud challenges (1 game badge = 1 point)", icon: "⛵", badge: "1 Pt" },
    { title: "Arcade Trail", desc: "Advanced guided paths (1 game badge = 1 point)", icon: "🛤️", badge: "1 Pt" },
    { title: "Skill Badges", desc: "90+ Skills Badges available (2 badges = 1 point)", icon: "🏅", badge: "0.5 Pt" },
    { title: "Special Badges", desc: "Limited-time exclusive (1 game badge = 2 points)", icon: "🌟", badge: "2 Pts" }
  ];

  const [isAtTop, setIsAtTop] = useState(true);

  // 🔥 LOCAL STATES
  const [printoVote, setPrintoVote] = useState<"received" | "not_received" | null>(null);
  const [whiteSquareVote, setWhiteSquareVote] = useState<"received" | "not_received" | null>(null);
  
  // 🔥 Review Inputs
  const [reviewName, setReviewName] = useState("");
  const [reviewVendor, setReviewVendor] = useState("Printo");
  const [reviewText, setReviewText] = useState("");

  // 🔥 GLOBAL FIREBASE STATES
  const [reviews, setReviews] = useState<{name: string, time: string, text: string, vendor: string}[]>([]); 
  const [globalPrinto, setGlobalPrinto] = useState({ received: 0, not_received: 0 });
  const [globalWs, setGlobalWs] = useState({ received: 0, not_received: 0 });

  // 🔥 LEADERBOARD STATES
  const [leaders, setLeaders] = useState<any[]>([]);
  
  // 🔥 NEW: State for Current User Profile (SYNCED WITH NAVBAR LOGIC)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>("/avatar.png");
  const [imageError, setImageError] = useState(false);

  // 🔥 MAGIC REFRESH FUNCTION FOR HOMEPAGE AVATAR & NAME 🔥
  const refreshUserData = () => {
    try {
      const savedData = localStorage.getItem("arcade_user_data") || localStorage.getItem("arcadeUserData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Avatar logic
        const newAvatar = parsed.userAvatar || parsed.photoURL;
        if (newAvatar) {
          setCurrentUserAvatar(newAvatar);
          setImageError(false); 
        }

        // Name logic
        const newName = parsed.userName || parsed.name;
        if (newName) {
          setCurrentUserName(newName);
        }
      }
    } catch (e) {
      console.error("Error reading user data", e);
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshUserData();
    
    // Listeners for real-time updates
    window.addEventListener("arcadeDataUpdated", refreshUserData);
    window.addEventListener("storage", refreshUserData);

    const unsubLeaderboard = subscribeLeaderboard((data) => setLeaders(data));

    const savedPrintoVote = localStorage.getItem("printoVote") as "received" | "not_received" | null;
    if (savedPrintoVote) setPrintoVote(savedPrintoVote);

    const savedWhiteSquareVote = localStorage.getItem("whiteSquareVote") as "received" | "not_received" | null;
    if (savedWhiteSquareVote) setWhiteSquareVote(savedWhiteSquareVote);

    const q = query(collection(db, "swagReviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => doc.data() as any);
      setReviews(fetchedReviews);
    });

    const statsRef = doc(db, "swagStats", "cohort2");
    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalPrinto({ received: data.printoReceived || 0, not_received: data.printoNotReceived || 0 });
        setGlobalWs({ received: data.wsReceived || 0, not_received: data.wsNotReceived || 0 });
      } else {
        setDoc(statsRef, { printoReceived: 0, printoNotReceived: 0, wsReceived: 0, wsNotReceived: 0 });
      }
    });

    return () => {
      window.removeEventListener("arcadeDataUpdated", refreshUserData);
      window.removeEventListener("storage", refreshUserData);
      unsubLeaderboard();
      unsubReviews();
      unsubStats();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Hi Manish, I am ${formName}.\n\nI have a query regarding: *${formCategory}*`;
    
    if (formSubCategory) {
      text += `\nSpecifics: *${formSubCategory}*`;
    }
    
    text += `\n\nMessage:\n${formMessage}`;
    const whatsappUrl = `https://wa.me/918538980608?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    setFormName("");
    setFormMessage("");
    setFormSubCategory("");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!reviewText.trim() || !reviewName.trim()) return;
    
    const newReview = {
      name: reviewName,
      time: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: reviewText,
      vendor: reviewVendor,
      createdAt: new Date().getTime() 
    };
    
    await addDoc(collection(db, "swagReviews"), newReview);
    setReviewText("");
  };

  return (
    <>
      <PopupModal />
      
      <Navbar />

      {/* ================= FIXED SCROLL BUTTON ================= */}
      <div className="fixed bottom-8 right-6 md:right-8 z-[100] flex flex-col gap-3">
        <button 
          onClick={() => {
            if (isAtTop) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-white text-[#1a73e8] rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-[#e8f0fe] hover:scale-110 transition-all border border-[#dadce0]"
          title={isAtTop ? "Scroll to Bottom" : "Scroll to Top"}
        >
          {isAtTop ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
          )}
        </button>
      </div>

      <main className="min-h-screen bg-white text-[#202124] overflow-hidden selection:bg-[#e8f0fe] selection:text-[#1a73e8] font-sans">

{/* ================= HERO SECTION ================= */}
<section className="relative pt-20 pb-4 bg-white overflow-hidden">
  <style>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.1);
      border-radius: 10px;
    }
  `}</style>

  {/* Subtle Background Glows for White Theme */}
  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#4285F4] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"></div>
  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#ff4a7d] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

  <div className="w-full relative z-10">
    <div className="py-8 md:py-10 relative overflow-hidden flex flex-col gap-10 w-full mx-auto">
      
      {/* 🔥 Arcade Nexus Header 🔥 */}
      <div className="absolute top-2 md:top-2 left-1/2 transform -translate-x-1/2 z-50 flex justify-center w-full pointer-events-none">
        <h1 className="text-[40px] md:text-[56px] font-bold text-gray-900 tracking-tight drop-shadow-sm m-0 text-center">
          Arcade Nexus
        </h1>
      </div>

      {/* 🔥 You Avatar UPDATED (Blue border & only Name) 🔥 */}
      <div 
        className="absolute top-4 right-4 md:top-6 md:right-8 flex flex-col items-center gap-1.5 z-40 cursor-pointer group"
        onClick={() => router.push('/dashboard')}
      >
        <img 
          src={imageError ? "/avatar.png" : currentUserAvatar} 
          alt="Your Avatar" 
          onError={() => setImageError(true)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 border-2 border-[#1a73e8] p-[2px] bg-white shadow-sm"
        />
        <span className="text-[#5f6368] text-[11px] md:text-xs font-bold tracking-wide group-hover:text-[#1a73e8] transition-colors text-center max-w-[80px] truncate">
          {currentUserName || "You"}
        </span>
      </div>

      <div className="max-w-[85rem] mx-auto px-6 w-full flex flex-col gap-10 relative z-10 mt-28 md:mt-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 w-full">
          
          <div className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="text-gray-700 text-xl md:text-2xl max-w-xl font-medium leading-relaxed mb-8 mt-2">
              Calculate points, monitor live rankings, and track your entire Arcade journey in one sleek dashboard.
            </p>

            {/* 🔥 Buttons Section 🔥 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 w-full">
              <button
                onClick={() => router.push('/calculator')}
                className="px-6 py-2.5 bg-[#1a73e8] text-white font-bold text-[14px] tracking-wide rounded-md hover:bg-[#1557b0] hover:-translate-y-0.5 transition-all duration-300 shadow-md border border-transparent"
              >
                Arcade Calculator
              </button>
              <a
                href="https://go.cloudskillsboost.google/arcade"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white text-[#1a73e8] font-bold text-[14px] tracking-wide rounded-md hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300 border border-[#dadce0] shadow-sm"
              >
                Start Labs here
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform?pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#ff4a7d] text-white font-bold text-[14px] tracking-wide rounded-md hover:bg-[#f92e66] hover:-translate-y-0.5 transition-all duration-300 shadow-md border border-transparent"
              >
                Subscribe for Arcade
              </a>
            </div>

            {/* 🔥 Facilitator Program Box 🔥 */}
            <div className="flex flex-col gap-3 text-left w-full max-w-lg mt-2">
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#202124] tracking-tight">
                Facilitator Program
              </h3>
              <div className="flex flex-col gap-3 text-[#5f6368] font-medium text-[14px] md:text-[15px]">
                <div className="flex items-start gap-3">
                  <svg className="w-[20px] h-[20px] flex-shrink-0 text-[#1a73e8] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>13 July 2026 at 17:00 - 14 September 2026 at 23:59 GMT+5:30</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-[20px] h-[20px] flex-shrink-0 text-[#1a73e8] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Registration opens on 13 July 2026 at 17:00 GMT+5:30</span>
                </div>
              </div>

              {/* 🔥 UPDATED: Yellow Premium Referral Code Section 🔥 */}
              <div className="mt-5 w-full">
                <h4 className="text-[#5f6368] text-[12px] font-bold uppercase tracking-[0.1em] mb-2 ml-1">
                  Facilitator Referral Code
                </h4>
                <div className="bg-[#fef7e0] border border-[#fbbc04] rounded-md p-3 md:px-5 flex items-center justify-between w-full shadow-sm">
                  <div className="font-mono text-black font-extrabold text-[18px] md:text-[20px] tracking-wider mt-1">
                    GCAF26-IN-9SC-AE9
                  </div>
                  <button
                    onClick={handleCopyReferral}
                    className="p-1.5 text-[#b06000] hover:text-black hover:bg-[#fbbc04]/30 transition-colors rounded-md shrink-0"
                    title="Copy Referral Code"
                  >
                    {isReferralCopied ? (
                      <svg className="w-5 h-5 text-[#34a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 🔥 Premium Blue Card for Tools (RIGHT SIDE) 🔥 */}
          <div className="relative z-10 w-full lg:w-[360px] flex justify-end">
            <div className="bg-gradient-to-b from-[#1a73e8] to-[#0d47a1] rounded-[16px] shadow-[0_12px_32px_rgba(26,115,232,0.2)] flex flex-col w-full overflow-hidden border border-[#4285f4]">
              {[
                { 
                  name: "Arcade Points Calculator", 
                  link: "/calculator", 
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> 
                },
                { 
                  name: "Skill Badges List", 
                  link: "/resources", 
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /> 
                },
                { 
                  name: "Facilitator Program", 
                  link: "/facilitator", 
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> 
                },
                { 
                  name: "Live Leaderboard", 
                  link: "/leaderboard", 
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> 
                },
                { 
                  name: "Get 309 Credits", 
                  link: "#credits-section", 
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0v3.75C20.25 20.653 16.556 22.5 12 22.5s-8.25-1.847-8.25-4.125v-3.75" /> 
                },
                { 
                  name: "Arcade Chatbot", 
                  link: "/chat", 
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> 
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  onClick={(e) => {
                    if(item.link.startsWith('#')) {
                      e.preventDefault();
                      document.getElementById(item.link.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.link.startsWith('/')) {
                      e.preventDefault();
                      router.push(item.link);
                    }
                  }}
                  className="flex items-center justify-between px-5 py-[14px] border-b border-[#4285f4]/30 last:border-none hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[38px] h-[38px] rounded-[8px] bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-sm transition-all duration-300">
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        {item.icon}
                      </svg>
                    </div>
                    <span className="font-[700] text-[15px] text-white tracking-tight group-hover:text-blue-100 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transform transition-all">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>

{/* ================= 🔥 NEW PREMIUM TABBED GUIDE SECTION 🔥 ================= */}
<section className="relative z-10 pt-4 pb-24 bg-gray-50 border-t border-gray-100">
  <div className="max-w-4xl mx-auto px-6">
    
    <div className="text-center mb-10 relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-5 drop-shadow-sm">
        Start Arcade Labs
      </h2>
    </div>

    {/* TABBED INTERFACE */}
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
      
      {/* Tab Headers */}
      <div className="flex flex-col sm:flex-row border-b border-gray-200">
        <button 
          onClick={() => setActiveGuideTab('start')}
          className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 border-b sm:border-b-0 sm:border-r border-gray-200 ${activeGuideTab === 'start' ? 'bg-[#1a73e8] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#1a73e8]'}`}
        >
          Arcade Labs Start
        </button>
        <button 
          onClick={() => setActiveGuideTab('tools')}
          className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 border-b sm:border-b-0 sm:border-r border-gray-200 ${activeGuideTab === 'tools' ? 'bg-[#1a73e8] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#1a73e8]'}`}
        >
          Arcade Tools
        </button>
        <button 
          onClick={() => setActiveGuideTab('points')}
          className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 ${activeGuideTab === 'points' ? 'bg-[#1a73e8] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#1a73e8]'}`}
        >
          Points System
        </button>
      </div>
      
      {/* Tab Content Area */}
      <div className="h-[auto] max-h-[450px] overflow-y-auto custom-scrollbar">
        
        {/* 1. How to Start Content */}
        {activeGuideTab === 'start' && (
          <div className="divide-y divide-gray-100 animate-fade-in">
            {startSteps.map((item, index) => (
              <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-5 hover:bg-gray-50 group transition-colors duration-200 w-full">
                <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-gray-200 pr-4 mr-5">
                  <span className="text-[26px] mb-2 transition-all">{item.icon}</span>
                  <span className="bg-[#0ea5e9] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center shadow-sm">
                    {item.badge}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-gray-900 font-bold text-[18px] group-hover:text-[#1a73e8] transition-colors">
                    {item.title} <span className="font-sans font-bold text-[#1a73e8] ml-1">→</span>
                  </h3>
                  <div className="text-gray-600 text-[15px] mt-1.5 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 2. Arcade Tools Content */}
        {activeGuideTab === 'tools' && (
          <div className="divide-y divide-gray-100 animate-fade-in">
            {arcadeTools.map((item, index) => (
              <Link href={item.link} key={index} className="flex p-5 hover:bg-gray-50 group transition-colors duration-200 w-full">
                <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-gray-200 pr-4 mr-5">
                  <span className="text-[26px] mb-2 transition-all">{item.icon}</span>
                  <span className="bg-[#1a73e8] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center shadow-sm">
                    {item.badge}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-gray-900 font-bold text-[18px] group-hover:text-[#1a73e8] transition-colors">
                    {item.title} <span className="font-sans font-bold text-[#1a73e8] ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </h3>
                  <div className="text-gray-600 text-[15px] mt-1.5 flex items-center gap-2 leading-relaxed">
                    <span className="text-[#1a73e8] font-bold text-[14px]">🔗</span> {item.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 3. Points System Content */}
        {activeGuideTab === 'points' && (
          <div className="divide-y divide-gray-100 animate-fade-in">
            {pointsSystem.map((item, index) => (
              <div key={index} className="flex p-5 hover:bg-gray-50 group transition-colors duration-200 w-full">
                <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-gray-200 pr-4 mr-5">
                  <span className="text-[26px] mb-2 transition-all">{item.icon}</span>
                  <span className="bg-[#0ea5e9] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center shadow-sm">
                    {item.badge}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-gray-900 font-bold text-[18px] transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-gray-600 text-[15px] mt-1.5 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>

  </div>
</section>

      {/* ================= FREE CREDITS GUIDE ================= */}
<section id="credits-section" className="relative z-10 py-16 bg-[#ffffff] border-b border-[#dadce0] overflow-hidden font-sans">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
    
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#202124] mb-3">Get Free 309 Credits</h2>
        <p className="text-[#5f6368] text-lg">Follow along with this step-by-step video guide</p>
      </div>
      
      {/* YouTube Video Embed */}
      <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#dadce0] aspect-video bg-black">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/WVdUW1wJwyI" 
          title="How to get your free credits or monthly credits pass? | Google Skills Campaigns" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
        </iframe>
      </div>
    </div>
    
    <div className="bg-[#fff8f0] border border-[#fbd0b4] rounded-xl p-6 md:p-8 mb-16 shadow-sm relative transition-all max-w-5xl mx-auto">
      <button 
        onClick={handleCopyCode}
        className="absolute top-5 right-5 md:top-6 md:right-6 bg-white hover:bg-[#f9f9f9] px-3 py-1.5 rounded-lg text-[14px] font-bold flex items-center gap-2 border border-[#dadce0] transition-colors cursor-pointer group shadow-sm"
        title="Copy code"
      >
        <span className="text-[#c03f0c]">qlcampaign=6m-ctsdq-27</span>
        {isCopied ? (
          <span className="text-[#137333] flex items-center bg-[#e6f4ea] p-1 rounded-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : (
          <span className="text-[#5f6368] group-hover:text-[#202124] p-1 rounded-md bg-[#f1f3f4]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </span>
        )}
      </button>
      
      <div className="flex items-start gap-3 mb-5 mt-4 md:mt-0">
        <div className="text-[#d94a11] text-2xl shrink-0">🔗</div>
        <div className="pr-0 md:pr-48"> 
          <h3 className="text-xl font-bold text-[#202124] mb-1.5">Special Credit Link</h3>
          <p className="text-[#5f6368] text-sm">
            Use this exclusive link to receive your <strong className="text-[#137333]">309 credits</strong>
          </p>
          <p className="text-[#1a73e8] text-xs font-semibold mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Last updated & verified: February 2026
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#dadce0] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full overflow-hidden px-1">
          <p className="text-[11px] text-[#5f6368] font-bold uppercase mb-0.5">Special Link:</p>
          <div className="text-sm text-[#1a73e8] block truncate w-full">
            https://www.skills.google/catalog?<span className="bg-[#ffe5d9] text-[#c03f0c] px-1.5 py-0.5 rounded font-bold">qlcampaign=6m-ctsdq-27</span>
          </div>
        </div>
        <a 
          href="https://www.skills.google/catalog?qlcampaign=6m-ctsdq-27" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto px-5 py-2.5 bg-[#d94a11] hover:bg-[#c03f0c] text-white font-bold text-sm rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Open Link
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </div>

    {/* TIMELINE DESIGN FOR STEP BY STEP GUIDE */}
    <div className="mb-16 max-w-5xl mx-auto px-2">
      <h3 className="text-2xl md:text-3xl font-bold text-[#202124] mb-10 text-center">Step-by-Step Guide</h3>
      
      <div className="relative ml-4 md:ml-8">
        {/* Vertical Connector Line */}
        <div className="absolute top-4 bottom-0 left-[19px] w-[3px] bg-[#e8eaed] z-0"></div>

        <div className="space-y-6 md:space-y-8 relative z-10">
          {[
            { 
              title: "Sign Out of Your Google Skills Account", 
              icon: "🚪",
              desc: "Before starting, make sure you log out of your Google Skills account. This is important to ensure the credits are applied correctly.", 
              alert: { type: "important", text: "Important: This step is crucial! Credits may not apply if you're already logged in." }
            },
            { 
              title: "Open the Special Credit Link", 
              icon: "🔗",
              desc: "Visit the exclusive link provided above or in the video description.", 
              alert: { type: "important", text: "Important: This link contains a special code at the end of the URL, which is required to activate the credits." }
            },
            { 
              title: "Sign In to Your Google Skills Account", 
              icon: "🔑",
              desc: "Once the link opens, sign in using your Google account, or your email and password manually.", 
              alert: { type: "tip", text: "Tip: Use the same account you plan to complete Skill Badges." }
            },
            { 
              title: "Receive Initial Credits", 
              icon: "🎁",
              desc: "After signing in through the special link, you will automatically receive 9 credits in your account.", 
              alert: null,
              badge: "9 Credits"
            },
            { 
              title: "Complete One Lab from the Catalog", 
              icon: "💻",
              desc: "To unlock the remaining credits, from the Google Skills Catalog, search for 'hands on'. Select 'A Tour of Google Cloud Hands-on Labs' (recommended for beginners).", 
              alert: { type: "tip", text: "Tip: This lab is perfect for beginners and takes about 3-5 minutes." }
            },
            { 
              title: "Finish the Lab with 100% Score", 
              icon: "💯",
              desc: "Complete the selected lab and ensure you achieve a 100/100 score. This may include opening the Google Cloud Console, assigning permissions to a principal, and enabling a required API.", 
              alert: { type: "important", text: "Important: Partial completion will not unlock the remaining credits." }
            },
            { 
              title: "Verify Your Total Credits", 
              icon: "✅",
              desc: "After ending the lab, visit the Billing / Payments page of your Google Skills Account and confirm that 300 additional credits have been added.", 
              alert: null,
              badge: "309 Total Credits"
            }
          ].map((step, index) => (
            <div key={index} className="relative flex items-start gap-4 md:gap-6">
              
              {/* Connected Circle Bullet */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6b3cb0] text-white font-bold text-sm shrink-0 border-4 border-white shadow-sm z-10 mt-3">
                {index + 1}
              </div>

              {/* Content Card */}
              <div className="flex-1 p-5 md:p-6 rounded-xl bg-white border border-[#dadce0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
                <h4 className="text-lg font-bold text-[#202124] mb-2 flex items-center gap-2">
                  <span className="text-[#d94a11]">{step.icon}</span> {step.title}
                </h4>
                <p className="text-[#5f6368] text-[15px] leading-relaxed mb-3">{step.desc}</p>
                
                {step.badge && (
                  <div className="inline-block mt-1 mb-2 px-3 py-1 bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold rounded-md border border-[#d2e3fc]">
                    {step.badge}
                  </div>
                )}

                {step.alert && (
                  <div className={`mt-2 p-3 rounded-md text-[13px] font-medium border flex gap-2 items-start ${step.alert.type === 'important' ? 'bg-[#fff9e6] text-[#b06000] border-[#ffecb3]' : 'bg-[#e6f4ea] text-[#0d652d] border-[#ceead6]'}`}>
                    <span className="mt-0.5">{step.alert.type === 'important' ? '⚠️' : '💡'}</span>
                    <span>{step.alert.text}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</section>

        {/* ================= PREMIUM PROBLEM / MESSAGE BOX ================= */}
        <div className="py-12 max-w-4xl mx-auto px-6 bg-white">
          <div className="bg-white border border-[#dadce0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
            <div className="bg-[#f8f9fa] border-b border-[#dadce0] p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#1a73e8]"></div>
              <h3 className="text-2xl md:text-3xl font-medium text-[#202124] mb-3">Problem Submission Form</h3>
              <p className="text-base mt-2">
                <span className="bg-[#e8f0fe] text-[#1a73e8] px-3 py-1 rounded-md font-medium inline-block border border-[#d2e3fc]">
                  Drop a message regarding your Swags, Labs, or Arcade Points. Our community team will look into it directly.
                </span>
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 md:p-10 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-[#3c4043]">Your Name</label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] placeholder-[#9aa0a6]" placeholder="Enter your full name" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-[#3c4043]">Issue Category</label>
                  <div className="relative">
                    <select value={formCategory} onChange={(e) => { setFormCategory(e.target.value); setFormSubCategory(""); }} className="w-full px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="Swags Delivery / Issue">Swags Delivery / Issue</option>
                      <option value="Labs Completion Issue">Labs Completion Issue</option>
                      <option value="Arcade Points Calculation">Arcade Points Calculation</option>
                      <option value="Other Queries">Other Queries</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Conditional Sub-Category Dropdown */}
              {(formCategory === "Swags Delivery / Issue" || formCategory === "Labs Completion Issue" || formCategory === "Arcade Points Calculation") && (
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-[#3c4043]">
                    {formCategory === "Swags Delivery / Issue" && "Select Vendor"}
                    {formCategory === "Labs Completion Issue" && "Select Lab Type"}
                    {formCategory === "Arcade Points Calculation" && "Select Point Issue"}
                  </label>
                  <div className="relative">
                    <select required value={formSubCategory} onChange={(e) => setFormSubCategory(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="" disabled hidden>Select an option</option>
                      
                      {formCategory === "Swags Delivery / Issue" && (
                        <>
                          <option value="Printos">Printos Services</option>
                          <option value="Whitesquare">Whitesquare International</option>
                        </>
                      )}
                      
                      {formCategory === "Labs Completion Issue" && (
                        <>
                          <option value="Arcade Monthly Labs">Arcade Monthly Labs</option>
                          <option value="Skill Badges">Skill Badges</option>
                        </>
                      )}
                      
                      {formCategory === "Arcade Points Calculation" && (
                        <>
                          <option value="Points Count Issue">Points Count Issue</option>
                          <option value="Invalid Public Profile Issue">Invalid Public Profile Issue</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-[#3c4043]">Describe Your Problem</label>
                <textarea required value={formMessage} onChange={(e) => setFormMessage(e.target.value)} rows={5} className="px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] resize-none placeholder-[#9aa0a6]" placeholder="Explain your doubt or issue in detail here..."></textarea>
              </div>
              <button type="submit" className="mt-2 w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-base font-semibold rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all focus:outline-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                Send Request Securely
              </button>
              <p className="text-center text-xs text-[#80868b] mt-1">* This will securely redirect your query to our official WhatsApp support channel.</p>
            </form>
          </div>
        </div>

        {/* ================= WIDER FAQ SECTION ================= */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-2 pb-12 mb-8">
          <div className="w-full">
            <FAQ />
          </div>
        </section>
        
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a73e8; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1557b0; 
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}