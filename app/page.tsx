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

  // 🔥 State for Copy Button
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("qlcampaign=6m-ctsdq-27");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 🔥 State for Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags Delivery / Issue");
  const [formSubCategory, setFormSubCategory] = useState(""); 
  const [formMessage, setFormMessage] = useState("");

  // 🔥 Tab State for Premium Guide Section
  const [activeGuideTab, setActiveGuideTab] = useState('start');

  // Tab 1: How to Start Arcade Data
  const startSteps = [
    { link: "https://share.google/mn0xUfmd49TA9RPc1", title: "Sign in Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile.", icon: "👤", badge: "Step 1" },
    { link: "https://share.google/45EC3J4RjWLzgbkGy", title: "Registration", desc: "Enroll in Arcade to unlock labs, points and challenges.", icon: "📝", badge: "Step 2" },
    { link: "https://share.google/Ojw8FgQpGhPI1sXyt", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards.", icon: "🚀", badge: "Step 3" },
    { link: "https://share.google/JRMVQ9xd8tTwx8Mol", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards.", icon: "🏅", badge: "Step 4" }
  ];

  // Tab 2: Arcade Tools Data
  const arcadeTools = [
    { title: "Points Calculator", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator", icon: "🔢", badge: "Calc" },
    { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard", icon: "📊", badge: "Dash" },
    { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard", icon: "🏆", badge: "Rank" },
    { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator", icon: "🤝", badge: "Lead" }
  ];

  // Tab 3: Arcade Points System Data (Clean & Minimal with Sky Blue Badges)
  const pointsSystem = [
    { title: "Arcade Adventure", desc: "Standard track progression (1 game badge = 1 point)", icon: "🗺️", badge: "1 Pt" },
    { title: "Arcade Voyage", desc: "Intermediate cloud challenges (1 game badge = 1 point)", icon: "⛵", badge: "1 Pt" },
    { title: "Arcade Trail", desc: "Advanced guided paths (1 game badge = 1 point)", icon: "🛤️", badge: "1 Pt" },
    { title: "Skill Badges", desc: "90+ Skills Badges available (2 badges = 1 point)", icon: "🏅", badge: "0.5 Pt" },
    { title: "Special Badges", desc: "Limited-time exclusive (1 game badge = 2 points)", icon: "🌟", badge: "2 Pts" }
  ];

  // 🔥 State for Smart Auto Scroll Button
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

  // 🔥 LEADERBOARD STATES FOR ROTATING AVATARS 🔥
  const [leaders, setLeaders] = useState<any[]>([]);
  const [avatarStartIndex, setAvatarStartIndex] = useState(0);

  useEffect(() => {
    // 🔥 AVATARS DATA FETCH 🔥
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
      unsubLeaderboard();
      unsubReviews();
      unsubStats();
    };
  }, []);

  // 🔥 ALL PLAYERS AVATAR ROTATION LOGIC 🔥
  useEffect(() => {
    if (leaders.length === 0) return;
    const interval = setInterval(() => {
      setAvatarStartIndex((prev) => (prev + 3) % leaders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [leaders.length]);

  // 🔥 SELECT 10 AVATARS FOR DISPLAY 🔥
  let displayAvatars: string[] = [];
  if (leaders.length > 0) {
    const allUrls = leaders.map(l => l.photoURL || "/avatar.png");
    for (let i = 0; i < 10; i++) {
      displayAvatars.push(allUrls[(avatarStartIndex + i) % allUrls.length]);
    }
    displayAvatars = Array.from(new Set(displayAvatars)).slice(0, 10);
  }

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

  const handlePrintoVoteClick = async (vote: "received" | "not_received") => {
    if (printoVote === vote) return; 
    
    const previousVote = printoVote;
    setPrintoVote(vote);
    localStorage.setItem("printoVote", vote);

    const statsRef = doc(db, "swagStats", "cohort2");
    const updates: any = {
      [vote === "received" ? "printoReceived" : "printoNotReceived"]: increment(1)
    };
    
    if (previousVote) {
      updates[previousVote === "received" ? "printoReceived" : "printoNotReceived"] = increment(-1);
    }
    
    await setDoc(statsRef, updates, { merge: true });
  };

  const handleWhiteSquareVoteClick = async (vote: "received" | "not_received") => {
    if (whiteSquareVote === vote) return; 

    const previousVote = whiteSquareVote;
    setWhiteSquareVote(vote);
    localStorage.setItem("whiteSquareVote", vote);

    const statsRef = doc(db, "swagStats", "cohort2");
    const updates: any = {
      [vote === "received" ? "wsReceived" : "wsNotReceived"]: increment(1)
    };
    
    if (previousVote) {
      updates[previousVote === "received" ? "wsReceived" : "wsNotReceived"] = increment(-1);
    }
    
    await setDoc(statsRef, updates, { merge: true });
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

  const printoTotal = globalPrinto.received + globalPrinto.not_received;
  const printoStats = { 
    received: printoTotal > 0 ? Math.round((globalPrinto.received / printoTotal) * 100) : 0, 
    not_received: printoTotal > 0 ? Math.round((globalPrinto.not_received / printoTotal) * 100) : 0 
  };
  
  const wsTotal = globalWs.received + globalWs.not_received;
  const whiteSquareStats = { 
    received: wsTotal > 0 ? Math.round((globalWs.received / wsTotal) * 100) : 0, 
    not_received: wsTotal > 0 ? Math.round((globalWs.not_received / wsTotal) * 100) : 0 
  };

  return (
    <>
      <PopupModal />
      
      <Navbar />

      {/* ================= FIXED SCROLL BUTTON (MOVED TO RIGHT) ================= */}
      {/* 🔥 Changed from left-6 to right-6 md:right-8 🔥 */}
      <div className="fixed bottom-24 right-6 md:right-8 z-[100] flex flex-col gap-3">
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
            /* 🔥 REAL "TIR" (ARROW) DOWN 🔥 */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
          ) : (
            /* 🔥 REAL "TIR" (ARROW) UP 🔥 */
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
          )}
        </button>
      </div>

      <main className="min-h-screen bg-white text-[#202124] overflow-hidden selection:bg-[#e8f0fe] selection:text-[#1a73e8] font-sans">

       {/* ================= HERO SECTION ================= */}
        <section 
          className="relative pt-20 pb-16 bg-white"
        >
          <div className="w-full relative z-10">
            {/* 🔥 AVATARS SAFE PLACEMENT 🔥 */}
            <div className="py-8 md:py-10 relative overflow-hidden flex flex-col gap-10 w-full mx-auto">
              
              {displayAvatars.length > 0 && (
                <div className="absolute top-2 left-6 md:top-4 md:left-8 flex items-start gap-2 z-40">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex -space-x-3">
                      {displayAvatars.map((url, idx) => (
                        <img 
                          key={`${url}-${idx}`}
                          src={url}
                          alt="player avatar"
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover relative transition-transform hover:scale-110 shadow-md"
                          style={{ border: "none", zIndex: 10 - idx }}
                        />
                      ))}
                    </div>
                    <span className="text-black text-xs font-medium tracking-wide drop-shadow-sm">Active Users..</span>
                  </div>
                  {leaders.length > 10 && (
                    <span className="text-gray-800 text-[13px] font-bold tracking-wide drop-shadow-sm mt-1.5">
                      & {leaders.length - 10} others
                    </span>
                  )}
                </div>
              )}

              {/* 🔥 NEW NEED HELP BUTTON (TOP RIGHT) 🔥 */}
              <button
                onClick={() => router.push('/chat')}
                className="absolute top-0 right-4 md:top-1 md:right-8 z-50 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2.5 rounded-[4px] text-sm font-bold transition-all duration-300 flex items-center gap-2 group cursor-pointer border-none shadow-none"
              >
                Need Help ?
                <span className="text-lg group-hover:animate-bounce"></span>
              </button>

              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                 {/* Removed the intense blur balls since background is now solid white, but kept containers if needed for future */}
              </div>

              <div className="max-w-[85rem] mx-auto px-6 w-full flex flex-col gap-10 relative z-10 mt-8 md:mt-4">
                
                <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
                  
                  <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                    
                    <h1 className="text-5xl sm:text-6xl md:text-6xl font-bold tracking-tight text-black mb-5 leading-[1.1] drop-shadow-sm">
                      Arcade<span className="text-black"> Nexus</span>
                    </h1>

                    <p className="text-black/90 text-lg md:text-xl max-w-xl font-medium leading-relaxed mb-8 drop-shadow-sm">
                      The ultimate professional dashboard to calculate your points, monitor live leaderboard rankings, and track your cloud skills journey.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
                      <a
                        href="https://go.cloudskillsboost.google/arcade"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#1a73e8] text-white font-bold text-[14px] sm:text-base rounded-[4px] hover:bg-[#1557b0] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2.5 border-none shadow-none"
                      >
                        <span className="absolute top-2 right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34a853]"></span>
                        </span>
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span className="whitespace-nowrap">Start Arcade Labs 2026 </span>
                      </a>

                      <button
                        onClick={() => router.push('/calculator')}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#1a73e8] text-white font-bold text-[14px] sm:text-base rounded-[4px] hover:bg-[#1557b0] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2.5 border-none shadow-none"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span className="whitespace-nowrap">Arcade Points Calculator</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 w-full lg:w-1/3 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 mb-1.5 justify-center lg:justify-start">
                      <span className="relative flex h-2.5 w-2.5 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a73e8] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1a73e8] shadow-[0_0_8px_rgba(26,115,232,0.8)]"></span>
                      </span>
                      <h3 className="text-black font-bold text-lg uppercase tracking-wider">Quick Actions</h3>
                    </div>

                    {[
                      { name: "See Swags Post", icon: "📌", link: "/post" },
                      { name: "Arcade Points Calculator", icon: "🧮", link: "/calculator" },
                      { name: "Skill Badges List", icon: "🏅", link: "/resources" },
                      { name: "Facilitator Program", icon: "🌟", link: "/facilitator" },
                      { name: "Live Leaderboard", icon: "🏆", link: "/leaderboard" },
                      { name: "Get 309 Credits", icon: "💰", link: "#credits-section" },
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
                        className="flex items-center justify-between px-4 py-2.5 w-[98%] mx-auto bg-[#1a73e8] hover:bg-[#1557b0] border-none rounded-[4px] transition-all duration-300 text-white font-semibold shadow-none group cursor-pointer text-sm md:text-base"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all font-bold">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:max-w-[55rem] mx-auto bg-white border border-[#dadce0] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden relative z-20 mt-4">
                  <div className="p-6 md:p-8 w-full flex flex-col items-center text-center gap-6">
                    
                    {/* YELLOW HIGHLIGHT DISCLAIMER */}
                    <p className="text-[14px] font-bold text-[#111] leading-relaxed text-justify bg-[#fff59d] p-4 rounded-sm border border-[#fbc02d] shadow-sm w-full">
                      Disclaimer: Arcade Nexus is an independent, community-built platform created for educational and informational purposes only. This website is not affiliated with, endorsed by, or officially connected to Google Cloud Arcade, Google LLC, or Alphabet Inc. Our goal is simply to help Arcade community members by providing useful resources, guides, and tools to enhance their learning experience.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
                      <a 
                        href="https://expo.dev/artifacts/eas/cFGmSKQew8LyDAazBtaeLx.apk" 
                        className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm rounded-[4px] shadow-none transition-all duration-300 w-full sm:w-auto border-none"
                      >
                        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download App (Latest Version)</span>
                      </a>

                      <a 
                        href="https://api.whatsapp.com/send?text=Hey!%20Check%20out%20the%20Arcade%20Nexus%20App%20here:%20https://arcade-calculator.vercel.app/download" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm rounded-[4px] shadow-none transition-all duration-300 w-full sm:w-auto border-none"
                      >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        
        {/* ================= 🔥 NEW PREMIUM TABBED GUIDE SECTION 🔥 ================= */}
        <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-[#202124] tracking-tight mb-5">
                Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Arcade Labs</span>
              </h2>
            </div>

            {/* TABBED INTERFACE (Clean & Professional) */}
            <div className="bg-white rounded-lg shadow-sm border border-[#707070] overflow-hidden flex flex-col">
              
              {/* Tab Headers */}
              <div className="flex flex-col sm:flex-row border-b border-[#707070]">
                <button 
                  onClick={() => setActiveGuideTab('start')}
                  className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 border-b sm:border-b-0 sm:border-r border-[#707070] ${activeGuideTab === 'start' ? 'bg-[#1a73e8] text-white' : 'bg-gray-50 text-[#5f6368] hover:bg-gray-100 hover:text-[#1a73e8]'}`}
                >
                  How to Start Arcade ?
                </button>
                <button 
                  onClick={() => setActiveGuideTab('tools')}
                  className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 border-b sm:border-b-0 sm:border-r border-[#707070] ${activeGuideTab === 'tools' ? 'bg-[#1a73e8] text-white' : 'bg-gray-50 text-[#5f6368] hover:bg-gray-100 hover:text-[#1a73e8]'}`}
                >
                  Arcade Tools
                </button>
                <button 
                  onClick={() => setActiveGuideTab('points')}
                  className={`flex-1 py-4 text-center font-bold text-[14px] sm:text-[15px] transition-colors duration-200 ${activeGuideTab === 'points' ? 'bg-[#1a73e8] text-white' : 'bg-gray-50 text-[#5f6368] hover:bg-gray-100 hover:text-[#1a73e8]'}`}
                >
                  Points System
                </button>
              </div>
              
              {/* Tab Content Area */}
              <div className="h-[auto] max-h-[450px] overflow-y-auto custom-scrollbar">
                
                {/* 1. How to Start Content */}
                {activeGuideTab === 'start' && (
                  <div className="divide-y divide-[#e0e0e0] animate-fade-in">
                    {startSteps.map((item, index) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="flex p-5 hover:bg-[#f0f4f8] group transition-colors duration-200 w-full">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e0e0e0] pr-4 mr-5">
                          <span className="text-[26px] mb-2 transition-all">{item.icon}</span>
                          <span className="bg-[#0ea5e9] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#202124] font-bold text-[18px] group-hover:text-[#1a73e8] transition-colors">
                            {item.title} <span className="font-sans font-bold text-[#1a73e8] ml-1">→</span>
                          </h3>
                          <div className="text-[#5f6368] text-[15px] mt-1.5 leading-relaxed">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* 2. Arcade Tools Content */}
                {activeGuideTab === 'tools' && (
                  <div className="divide-y divide-[#e0e0e0] animate-fade-in">
                    {arcadeTools.map((item, index) => (
                      <Link href={item.link} key={index} className="flex p-5 hover:bg-[#f0f4f8] group transition-colors duration-200 w-full">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e0e0e0] pr-4 mr-5">
                          <span className="text-[26px] mb-2 transition-all">{item.icon}</span>
                          <span className="bg-[#1a73e8] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#202124] font-bold text-[18px] group-hover:text-[#1a73e8] transition-colors">
                            {item.title} <span className="font-sans font-bold text-[#1a73e8] ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </h3>
                          <div className="text-[#5f6368] text-[15px] mt-1.5 flex items-center gap-2 leading-relaxed">
                            <span className="text-[#1a73e8] font-bold text-[14px]">🔗</span> {item.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* 3. Points System Content */}
                {activeGuideTab === 'points' && (
                  <div className="divide-y divide-[#e0e0e0] animate-fade-in">
                    {pointsSystem.map((item, index) => (
                      <div key={index} className="flex p-5 hover:bg-[#f8f9fa] group transition-colors duration-200 w-full">
                        <div className="flex flex-col items-center justify-center w-24 shrink-0 border-r border-[#e0e0e0] pr-4 mr-5">
                          <span className="text-[26px] mb-2 transition-all">{item.icon}</span>
                          <span className="bg-[#0ea5e9] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest w-full text-center">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-[#202124] font-bold text-[18px] transition-colors">
                            {item.title}
                          </h3>
                          <div className="text-[#5f6368] text-[15px] mt-1.5 leading-relaxed">
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

        {/* ================= FREE CREDITS GUIDE (SHIFTED HERE) ================= */}
        <section id="credits-section" className="relative z-10 py-16 bg-[#ffffff] border-b border-[#dadce0] overflow-hidden font-sans">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#202124] mb-3">Watch the Video Tutorial & Get 309$ Credits</h2>
                <p className="text-[#5f6368] text-lg">Follow along with this step-by-step video guide</p>
              </div>
              
              <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#dadce0] aspect-video flex items-center justify-center group cursor-pointer bg-[#0f52ba]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2]"></div>
                
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                   <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
                   <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#64b5f6] rounded-full blur-[80px]"></div>
                </div>
                
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[10px]">
                      🚀
                    </div>
                    <div className="text-white text-sm md:text-base font-semibold truncate text-left drop-shadow-md">
                      [ Coming Soon.. ] Google Cloud FREE 309 Credits | Step-by-Step Guide | Google Skills
                    </div>
                  </div>

                  <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
                    <div className="inline-block bg-[#1a73e8]/30 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                      Coming Soon...
                    </div>
                    
                    <h3 className="text-white font-black text-4xl md:text-6xl tracking-tight mb-6 drop-shadow-lg flex justify-center items-center gap-4">
                      <span className="text-[#90caf9]">309</span>
                      <div className="flex flex-col text-left leading-tight text-xl md:text-3xl">
                        <span>FREE</span>
                        <span>CREDITS</span>
                      </div>
                    </h3>

                    <div className="mx-auto w-16 h-11 md:w-20 md:h-14 bg-[#ff0000] rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(255,0,0,0.4)] transition-transform duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="flex justify-between items-end w-full">
                    <div className="text-white font-bold text-2xl md:text-3xl tracking-tighter drop-shadow-md flex items-center gap-1.5">
                      <span className="text-[#4285f4]">G</span>
                      <span className="text-[#ea4335]">o</span>
                      <span className="text-[#fbbc05]">o</span>
                      <span className="text-[#4285f4]">g</span>
                      <span className="text-[#34a853]">l</span>
                      <span className="text-[#ea4335]">e</span> 
                      <span className="text-white ml-1">Cloud</span>
                    </div>
                    <div className="bg-[#212121]/80 hover:bg-[#212121] transition-colors backdrop-blur-sm text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 shadow-sm border border-white/10">
                      Watch on 
                      <svg className="w-16 h-4 md:h-5" viewBox="0 0 90 20" fill="currentColor">
                        <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324ZM11.4276 14.2857V5.71429L18.8552 10L11.4276 14.2857Z" />
                      </svg>
                    </div>
                  </div>
                </div>
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

            <div className="mb-16 max-w-5xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-[#202124] mb-8 text-center">Step-by-Step Guide</h3>
              <div className="space-y-4">
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
                  <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-5 md:p-6 rounded-xl bg-white border border-[#dadce0] shadow-sm">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6b3cb0] text-white font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
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

            <div className="bg-[#e6f4ea] rounded-xl p-6 md:p-8 shadow-sm border border-[#ceead6] max-w-5xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2 text-[#0d652d]">
                <div className="bg-[#137333] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</div> 
                Pro Tips for Success
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Always sign out first", desc: "This is the most common reason credits don't apply" },
                  { title: "Use the special link", desc: "The code at the end of the URL is essential" },
                  { title: "Complete the lab 100%", desc: "Follow all instructions carefully for full credit" },
                  { title: "Check your billing page", desc: "Verify credits are added after completing the lab" },
                  { title: "Be patient", desc: "Sometimes credits take a few minutes to appear" }
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[#0d652d]">
                    <span className="mt-2 w-1.5 h-1.5 bg-[#137333] rounded-full shrink-0"></span>
                    <div className="text-[15px]">
                      <strong className="font-bold text-[#137333]">{tip.title}</strong>
                      <span className="text-[#0d652d]"> - {tip.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
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

        {/* ================= LIVE SWAG POLL & REVIEW TRACKER ================= */}
        <div className="pb-12 pt-10 bg-white border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="bg-white border border-[#dadce0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              
              <div className="bg-[#f8f9fa] border-b border-[#dadce0] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#202124]">Google Arcade Swags Review</h3>
                  <p className="text-[#5f6368] text-sm mt-1">Live tracking and community feedback</p>
                </div>
              </div>

              <div className="p-6 sm:p-8">

                {/* Review Input */}
                <div className="mb-8">
                  <h4 className="font-bold text-[#202124] mb-3">Leave a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Your Name..." 
                        required
                        className="sm:w-1/3 px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[15px]"
                      />
                      <select 
                        value={reviewVendor}
                        onChange={(e) => setReviewVendor(e.target.value)}
                        className="sm:w-1/4 px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[15px]"
                      >
                        <option value="Printo">Printo</option>
                        <option value="Whitesquare">Whitesquare</option>
                      </select>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your swag experience or delivery location..." 
                        required
                        className="flex-1 px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[15px]"
                      />
                      <button type="submit" className="px-6 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg shadow-sm transition-colors text-[15px]">
                        Post
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Comments Feed */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviews.length === 0 ? (
                    <p className="text-center text-[#5f6368] py-4 text-sm font-medium">No reviews yet. Be the first to share your experience!</p>
                  ) : (
                    reviews.map((rev, idx) => (
                      <div key={idx} className="bg-white border border-[#e8eaed] p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold text-xs border border-[#d2e3fc]">
                              {rev.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-[#202124] text-sm">{rev.name}</span>
                              <span className="text-[#80868b] text-xs ml-2">{rev.time}</span>
                            </div>
                          </div>
                          <span className="bg-[#f8f9fa] border border-[#dadce0] text-[#5f6368] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            {rev.vendor}
                          </span>
                        </div>
                        <p className="text-[#3c4043] text-[14px] leading-relaxed ml-10">
                          {rev.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[#3c4043] font-semibold text-sm flex items-center gap-2"><span className="text-xl">🛠️</span> Official Swags Support:</span>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
                      <a href="mailto:printose@printo.in" className="text-[#1a73e8] hover:underline font-medium flex items-center gap-1.5"><span className="text-base">📦</span> printose@printo.in</a>
                      <a href="mailto:support@whitesquarein.com" className="text-[#1a73e8] hover:underline font-medium flex items-center gap-1.5"><span className="text-base">📦</span> support@whitesquarein.com</a>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#e8f0fe] to-[#f3e8fd] border border-[#d2e3fc] rounded-xl p-6 sm:p-8 text-center shadow-sm">
                    <h4 className="text-[18px] sm:text-xl font-bold text-[#1a73e8] mb-3 flex items-center justify-center gap-2">
                      <span className="text-2xl">🌟</span> Share Your Community Experience!
                    </h4>
                    <p className="text-[#5f6368] text-[14px] sm:text-[15px] font-medium leading-relaxed max-w-2xl mx-auto">
                      How much did this platform and our community guidance help you? Please share your valuable feedback and support using the review box above. Your feedback keeps us motivated!
                    </p>
                  </div>
                </div>

              </div>
            </div>
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