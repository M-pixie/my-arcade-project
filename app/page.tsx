"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect } from "react"; 

// 🔥 FIREBASE IMPORTS 🔥
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // ⚠️ APNE FIREBASE CONFIG FILE KA SAHI PATH YAHAN CHECK KAR LENA ⚠️

export default function HomePage() {
  const router = useRouter();

  // 🔥 NEW: State for Copy Button
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("qlcampaign=6m-ctsdq-27");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  

  // 🔥 NEW: State for Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags Delivery / Issue");
  const [formSubCategory, setFormSubCategory] = useState(""); 
  const [formMessage, setFormMessage] = useState("");

  // 🔥 NEW: State for Coordinator Application Form 🔥
  const [cFirstName, setCFirstName] = useState("");
  const [cLastName, setCLastName] = useState("");
  const [cEmail, setCEmail] = useState(""); // ✉️ ADDED EMAIL
  const [cRole, setCRole] = useState(""); // 🎓 ADDED ROLE (Student/Professional)
  const [cGender, setCGender] = useState(""); // 👤 ADDED GENDER
  const [cGithub, setCGithub] = useState("");
  const [cLinkedin, setCLinkedin] = useState("");
  const [cMemberSince, setCMemberSince] = useState("");
  const [cFresher, setCFresher] = useState("Yes");
  const [cProfileUrl, setCProfileUrl] = useState("");
  const [cHighestPoints, setCHighestPoints] = useState(""); // 🏆 ADDED HIGHEST POINTS
  const [cSwagTier, setCSwagTier] = useState(""); // 🎁 ADDED SWAG TIER
  const [cSource, setCSource] = useState("");
  const [cResume, setCResume] = useState(""); // 📄 ADDED RESUME LINK (OPTIONAL)
  const [cReason, setCReason] = useState("");
  const [isSubmittingCoordinator, setIsSubmittingCoordinator] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✨ ADDED SUCCESS MODAL STATE

  // 🔥 NEW: State for Smart Auto Scroll Button
  const [isAtTop, setIsAtTop] = useState(true);

  // 🔥 LOCAL STATES (To prevent user from voting/liking twice on the same device) 🔥
  const [printoVote, setPrintoVote] = useState<"received" | "not_received" | null>(null);
  const [whiteSquareVote, setWhiteSquareVote] = useState<"received" | "not_received" | null>(null);
  
  // 🔥 Review Inputs
  const [reviewName, setReviewName] = useState("");
  const [reviewVendor, setReviewVendor] = useState("Printo");
  const [reviewText, setReviewText] = useState("");

  // 🔥 GLOBAL FIREBASE STATES (Sabko Real-time yahi dikhega) 🔥
  const [reviews, setReviews] = useState<{name: string, time: string, text: string, vendor: string}[]>([]); 
  const [globalPrinto, setGlobalPrinto] = useState({ received: 0, not_received: 0 });
  const [globalWs, setGlobalWs] = useState({ received: 0, not_received: 0 });

  // 🔥 REAL-TIME FIREBASE SYNC & LOCAL CHECKS 🔥
  useEffect(() => {
    // 1. Check local storage so user can't vote/like twice on refresh
    const savedPrintoVote = localStorage.getItem("printoVote") as "received" | "not_received" | null;
    if (savedPrintoVote) setPrintoVote(savedPrintoVote);

    const savedWhiteSquareVote = localStorage.getItem("whiteSquareVote") as "received" | "not_received" | null;
    if (savedWhiteSquareVote) setWhiteSquareVote(savedWhiteSquareVote);

    // 2. Fetch Global Reviews from Firebase
    const q = query(collection(db, "swagReviews"), orderBy("createdAt", "desc"));
    const unsubReviews = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => doc.data() as any);
      setReviews(fetchedReviews);
    });

    // 3. Fetch Global Stats from Firebase
    const statsRef = doc(db, "swagStats", "cohort2");
    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalPrinto({ received: data.printoReceived || 0, not_received: data.printoNotReceived || 0 });
        setGlobalWs({ received: data.wsReceived || 0, not_received: data.wsNotReceived || 0 });
      } else {
        // Initialize database if it's completely empty
        setDoc(statsRef, { printoReceived: 0, printoNotReceived: 0, wsReceived: 0, wsNotReceived: 0 });
      }
    });

    return () => {
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

  // Handler to send form data directly to your WhatsApp!
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

  // 🔥 NEW: Handler for Coordinator Application Form to Firebase 🔥
  const handleCoordinatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCoordinator(true);
    try {
      await addDoc(collection(db, "coordinatorApplications"), {
        firstName: cFirstName,
        lastName: cLastName,
        email: cEmail,
        role: cRole, 
        gender: cGender, 
        githubLink: cGithub,
        linkedinUrl: cLinkedin,
        memberSince: cMemberSince,
        isFresher: cFresher,
        publicProfileUrl: cFresher === "No" ? cProfileUrl : "N/A",
        highestPoints: cFresher === "No" ? cHighestPoints : "N/A", 
        swagTier: cFresher === "No" ? cSwagTier : "N/A", 
        sourceInfo: cSource,
        resumeLink: cResume || "N/A", // ✨ Syncing Optional Resume Link
        reasonToJoin: cReason,
        createdAt: new Date().getTime() // For easy sorting in Firebase Console
      });
      
      // ✨ SHOW SUCCESS MODAL ✨
      setShowSuccessModal(true);
      
      // Reset Form
      setCFirstName("");
      setCLastName("");
      setCEmail("");
      setCRole("");
      setCGender("");
      setCGithub("");
      setCLinkedin("");
      setCMemberSince("");
      setCFresher("Yes");
      setCProfileUrl("");
      setCHighestPoints("");
      setCSwagTier("");
      setCSource("");
      setCResume("");
      setCReason("");
    } catch (error) {
      console.error("Error submitting application: ", error);
      alert("Something went wrong! Please try again later.");
    } finally {
      setIsSubmittingCoordinator(false);
    }
  };

  // 🔥 PUSH VOTES TO FIREBASE (Fixed Bug: SetDoc with merge so it never fails) 🔥
  const handlePrintoVoteClick = async (vote: "received" | "not_received") => {
    if (printoVote === vote) return; // Prevent clicking the same vote again
    
    const previousVote = printoVote;
    setPrintoVote(vote);
    localStorage.setItem("printoVote", vote);

    const statsRef = doc(db, "swagStats", "cohort2");
    const updates: any = {
      [vote === "received" ? "printoReceived" : "printoNotReceived"]: increment(1)
    };
    
    // If they changed their vote, remove the old one
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

  // 🔥 PUSH REVIEWS TO FIREBASE 🔥
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!reviewText.trim() || !reviewName.trim()) return;
    
    const newReview = {
      name: reviewName,
      time: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: reviewText,
      vendor: reviewVendor,
      createdAt: new Date().getTime() // Firebase sorting ke liye
    };
    
    await addDoc(collection(db, "swagReviews"), newReview);
    setReviewText("");
  };

  // 🔥 DYNAMIC MATH FOR UI PROGRESS BARS 🔥 
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
      
      {/* ✨ SUCCESS MODAL FOR COORDINATOR APPLICATION ✨ */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center relative animate-[popIn_0.3s_ease-out]">
            <div className="w-16 h-16 mx-auto bg-[#e6f4ea] rounded-full flex items-center justify-center text-[#34a853] mb-5 border border-[#ceead6]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-[#202124] mb-3 tracking-tight">Application Submitted!</h3>
            <p className="text-[#5f6368] text-[15px] leading-relaxed mb-8">
              Thank you for applying. Our Facilitator will review your application. If you are selected, you will also receive an email from us.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl transition-all shadow-sm transform hover:-translate-y-0.5"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      <Navbar />

      {/* ================= FIXED SCROLL BUTTON ================= */}
      <div className="fixed bottom-24 left-6 md:right-8 z-[100] flex flex-col gap-3">
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
          )}
        </button>
      </div>

      <main className="min-h-screen bg-white text-[#202124] overflow-hidden selection:bg-[#e8f0fe] selection:text-[#1a73e8] font-sans">

{/* ================= HERO SECTION ================= */}
{/* ✨ Premium Gradient & White Indicator Fix ✨ */}
<section 
  className="relative pt-20 pb-16 overflow-hidden"
  style={{ 
    /* Blue to Cyan to Yellow to Orange transition */
    background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 30%, #06B6D4 55%, #FACC15 80%, #F97316 100%)' 
  }}
>
  
  <div className="w-full relative z-10">
    <div className="py-8 md:py-10 relative overflow-hidden flex flex-col gap-10 w-full mx-auto">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
         <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
      </div>

      {/* Inner Contained Container */}
      <div className="max-w-[85rem] mx-auto px-6 w-full flex flex-col gap-10 relative z-10">
        
        {/* === TOP ROW: Text, Buttons & Quick Links === */}
        <div className="flex flex-col lg:flex-row items-center gap-10 w-full">
          
          {/* LEFT COLUMN: Text & Buttons */}
          <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <div className="group relative inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#dadce0] text-[#137333] text-[12px] font-extrabold mb-6 uppercase tracking-widest rounded-full shadow-sm cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34a853]"></span>
              </span>
              <span className="relative z-10">May Month Labs Live !</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.1] drop-shadow-sm">
              The Arcade<span className="text-[#FACC15]"> Program</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl max-w-xl font-medium leading-relaxed mb-8 drop-shadow-sm">
              The ultimate professional dashboard to calculate your points, monitor live leaderboard rankings, and track your cloud skills journey.
            </p>

            {/* 🔥 2 Buttons Setup On Left 🔥 */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
              
              <a
                href="https://go.cloudskillsboost.google/arcade"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-white text-zinc-900 font-bold text-[14px] sm:text-base rounded-xl hover:scale-105 hover:bg-gray-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2.5"
              >
                {/* Auto Blinking Green Indicator */}
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34a853]"></span>
                </span>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span className="whitespace-nowrap">Start Arcade Labs 2026 </span>
              </a>

              {/* Glassmorphism style button */}
              <button 
                onClick={() => document.getElementById('coordinator-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl hover:bg-white/30 font-bold transition-all group shadow-[0_4px_14px_rgba(0,0,0,0.2)] transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Help Arcade Community !
                <div className="bg-white/20 text-white p-1.5 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7-7V3" /></svg>
                </div>
              </button>

            </div>
          </div>

          {/* 🔥 RIGHT COLUMN: Premium Quick Links 🔥 */}
          <div className="relative z-10 w-full lg:w-1/3 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1.5 justify-center lg:justify-start">
              {/* ✨ Changed the Red dot to a 2-point White glowing indicator ✨ */}
              <span className="relative flex h-2.5 w-2.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              </span>
              <h3 className="text-white font-bold text-lg uppercase tracking-wider">Quick Actions</h3>
            </div>

            {[
              { name: "Arcade Points Calculator", icon: "🧮", link: "/calculator" },
              { name: "Skill Badges List", icon: "🏅", link: "/resources" },
              { name: "Facilitator Program", icon: "🌟", link: "/facilitator" },
              { name: "Live Leaderboard", icon: "🏆", link: "/leaderboard" },
              { name: "Swags & Rewards", icon: "🎁", link: "#swags" },
              { name: "View Points System", icon: "📊", link: "#points-system" }
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
                className="flex items-center justify-between p-3.5 bg-white/95 hover:bg-white border border-white/40 rounded-xl transition-all duration-300 text-zinc-900 font-semibold shadow-md hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] group cursor-pointer transform hover:-translate-y-1 text-sm md:text-base backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-zinc-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all font-bold">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* === BOTTOM ROW: Disclaimer & Actions Container === */}
        <div className="w-full lg:max-w-[55rem] mx-auto bg-white border border-[#dadce0] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden relative z-20 mt-4">
          
          <div className="p-6 md:p-8 w-full flex flex-col items-center text-center gap-6">
            
            <p className="text-sm md:text-base text-[#5f6368] font-medium leading-relaxed max-w-3xl mx-auto bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <strong className="text-[#202124]">Disclaimer:</strong> This website is an independent, community-built tool and is not an official website of Google Cloud Arcade or Google, community-built tool designed simply to help you calculate your Arcade points and learn Google Cloud skills together with the community.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
              
              <a 
                href="https://expo.dev/artifacts/eas/mw6RYtdftR4dn57i4gSUKM.apk" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-zinc-900 font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
              >
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download App (apk)</span>
              </a>

              <button 
                onClick={() => router.push('/post')}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-zinc-900 font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
              >
                <svg className="w-5 h-5 shrink-0 text-[#fbbc04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>See Google Swags Post</span>
              </button>

              <a 
                href="https://api.whatsapp.com/send?text=Hey!%20Check%20out%20the%20Arcade%20Nexus%20App%20here:%20https://arcade-calculator.vercel.app/download" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-zinc-900 font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
              >
                <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>Share on WhatsApp</span>
              </a>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


        {/* ================= 🔥 PREMIUM COMBINED SECTION: HOW TO START & FEATURES 🔥 ================= */}
        <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* ONE SINGLE HEADING FOR BOTH */}
            <div className="text-center mb-16 relative z-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-sm font-bold tracking-wider uppercase mb-4 border border-[#d2e3fc]">
                Arcade Guide
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#202124] tracking-tight mb-5">
                Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Arcade Labs</span>
              </h2>
              <p className="text-[#5f6368] text-lg max-w-3xl mx-auto leading-relaxed">
                Follow simple steps to kickstart your experience, and leverage powerful tools specifically designed to help you track, calculate, and boost your Arcade points.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              
              {/* LEFT COLUMN: Steps */}
              <div className="flex flex-col h-full group">
                <div className="bg-white border border-[#dadce0] rounded-2xl shadow-sm hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] overflow-hidden flex-1 transition-all duration-300">
                  <div className="bg-[#fef7e0] border-b border-[#fde293] p-4">
                    <h3 className="text-lg font-bold text-[#b06000] flex items-center gap-2">
                      <span className="text-xl"></span> Arcade Start
                    </h3>
                  </div>
                  <div className="divide-y divide-[#dadce0] h-full flex flex-col p-1">
                    {[
                      { link: "https://share.google/mn0xUfmd49TA9RPc1", title: "Sign in Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile." },
                      { link: "https://share.google/45EC3J4RjWLzgbkGy", title: "Registration", desc: "Enroll in Arcade to unlock labs, points and challenges." },
                      { link: "https://share.google/Ojw8FgQpGhPI1sXyt", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards." },
                      { link: "https://share.google/JRMVQ9xd8tTwx8Mol", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards." },
                    ].map((step, idx) => (
                      <div key={idx} className="px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#f8f9fa] transition-colors duration-300 rounded-lg m-1">
                        <div className="flex-1">
                          <h3 className="text-[16px] md:text-[17px] font-bold text-[#202124] mb-0.5">{step.title}</h3>
                          <p className="text-[#5f6368] text-[13px] md:text-[14px] leading-relaxed">{step.desc}</p>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
                          <a 
                            href={step.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full sm:w-32 py-2.5 px-3 bg-[#34a853] hover:bg-[#2b8a44] text-white text-[14px] font-bold rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                          >
                            Click Here
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Features */}
              <div className="flex flex-col h-full group">
                <div className="bg-white border border-[#dadce0] rounded-2xl shadow-sm hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] overflow-hidden flex-1 transition-all duration-300">
                  <div className="bg-[#e8f0fe] border-b border-[#d2e3fc] p-4">
                    <h3 className="text-lg font-bold text-[#1a73e8] flex items-center gap-2">
                      <span className="text-xl"></span> Arcade Tools
                    </h3>
                  </div>
                  <div className="divide-y divide-[#dadce0] h-full flex flex-col p-1">
                    {[
                      { title: "Points Calculator", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator" },
                      { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard" },
                      { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard" },
                      { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator" },
                    ].map((feature, idx) => (
                      <div key={idx} className="px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#f8f9fa] transition-colors duration-300 rounded-lg m-1">
                        <div className="flex-1">
                          <h3 className="text-[16px] md:text-[17px] font-bold text-[#202124] mb-0.5">{feature.title}</h3>
                          <p className="text-[#5f6368] text-[13px] md:text-[14px] leading-relaxed">{feature.desc}</p>
                        </div>
                        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
                          <button 
                            onClick={() => router.push(feature.link)}
                            className="flex items-center justify-center gap-2 w-full sm:w-32 py-2.5 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-bold rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                          >
                            Try it out
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

          
{/* ================= REWARDS SECTION (Premium Clean Look) ================= */}
<section id="swags" className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
  <div className="max-w-[90rem] mx-auto px-6 relative z-10">
    
    {/* ✨ Premium Heading (Default Black) ✨ */}
    <div className="text-center mb-16 relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold text-[#202124] tracking-tight mb-4">
        Swags 2026 revealed soon
      </h2>
    </div>

    {/* ✨ Premium Image Wrapper (No Blue Box, Just Premium Shadow) ✨ */}
    <div className="flex justify-center z-10">
      <div className="relative rounded-2xl overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.1)] border border-[#dadce0] bg-white w-full max-w-5xl p-1.5 transition-shadow hover:shadow-[0_25px_80px_rgba(26,115,232,0.15)]">
        <div className="relative w-full h-full bg-white rounded-xl overflow-hidden border border-[#e8eaed]">
          <img src="https://i.postimg.cc/MT50zzG8/1775382064372.png" alt="Arcade 2026 Swags" className="w-full h-auto block" />
        </div>
      </div>
    </div>

  </div>
</section>


        
        {/* ================= 🔥 NEW: LIVE SWAG POLL & REVIEW TRACKER 🔥 ================= */}
        <div className="pb-24 pt-10 bg-white border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="bg-white border border-[#dadce0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              
              {/* Header without Like Button */}
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

                {/* 🔥 NEW: COMMUNITY & WEBSITE FEEDBACK BOX + OFFICIAL SUPPORT 🔥 */}
                <div className="mt-8 flex flex-col gap-4">
                  {/* Official Support Emails Mini-Box */}
                  <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[#3c4043] font-semibold text-sm flex items-center gap-2"><span className="text-xl">🛠️</span> Official Swags Support:</span>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
                      <a href="mailto:printose@printo.in" className="text-[#1a73e8] hover:underline font-medium flex items-center gap-1.5"><span className="text-base">📦</span> printose@printo.in</a>
                      <a href="mailto:support@whitesquarein.com" className="text-[#1a73e8] hover:underline font-medium flex items-center gap-1.5"><span className="text-base">📦</span> support@whitesquarein.com</a>
                    </div>
                  </div>

                  {/* Feedback Box (Professional English) */}
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

        {/* ================= PREMIUM PROBLEM / MESSAGE BOX ================= */}
        <div className="py-24 max-w-3xl mx-auto px-6 bg-white">
          <div className="bg-white border border-[#dadce0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
            <div className="bg-[#f8f9fa] border-b border-[#dadce0] p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1a73e8]"></div>
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
              {(formCategory === "Swags Delivery / Issue" || formCategory === "Labs Completion Issue") && (
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-[#3c4043]">
                    {formCategory === "Swags Delivery / Issue" ? "Select Vendor" : "Select Lab Type"}
                  </label>
                  <div className="relative">
                    <select required value={formSubCategory} onChange={(e) => setFormSubCategory(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="" disabled hidden>Select an option</option>
                      {formCategory === "Swags Delivery / Issue" && (<><option value="Printos">Printos Services</option><option value="Whitesquare">Whitesquare International</option></>)}
                      {formCategory === "Labs Completion Issue" && (<><option value="Skill Badges">Skill Badges</option><option value="Arcade Labs">Arcade Labs</option></>)}
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

        {/* ================= 🔥 NEW: COORDINATOR APPLICATION FORM 🔥 ================= */}
        <section id="coordinator-form" className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white border border-[#dadce0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
              
              <div className="bg-[#f8f9fa] border-b border-[#dadce0] p-8 md:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1a73e8]"></div>
                <h3 className="text-2xl md:text-3xl font-medium text-[#202124] mb-3">Apply for Coordinator</h3>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto">
                  Join our core team! Help guide the community, manage arcade initiatives, and grow your leadership skills with us.
                </p>
              </div>

              <form onSubmit={handleCoordinatorSubmit} className="p-8 md:p-10 flex flex-col gap-6">
                
                {/* Name & Email Row (Now 3 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">First Name</label>
                    <input type="text" required value={cFirstName} onChange={(e) => setCFirstName(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="E.g., Manish" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Last Name</label>
                    <input type="text" required value={cLastName} onChange={(e) => setCLastName(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="E.g., Kumar" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Email Address</label>
                    <input type="email" required value={cEmail} onChange={(e) => setCEmail(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="mail@example.com" />
                  </div>
                </div>

                {/* Role & Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Current Status</label>
                    <select required value={cRole} onChange={(e) => setCRole(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="" disabled hidden>Select your status</option>
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Gender</label>
                    <select required value={cGender} onChange={(e) => setCGender(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="" disabled hidden>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Social Links Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">GitHub Profile Link</label>
                    <input type="url" required value={cGithub} onChange={(e) => setCGithub(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="https://github.com/..." />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">LinkedIn Profile Link</label>
                    <input type="url" required value={cLinkedin} onChange={(e) => setCLinkedin(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>

                {/* Arcade Experience Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Member Since (Start Date)</label>
                    <input type="month" required value={cMemberSince} onChange={(e) => setCMemberSince(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Are you a Fresher to Google Cloud?</label>
                    <select required value={cFresher} onChange={(e) => setCFresher(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="Yes">Yes, I am a Fresher</option>
                      <option value="No">No, I have experience</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Field: Non-Fresher Options (Profile URL, Highest Points, Swag Tier) */}
                {cFresher === "No" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn p-5 bg-[#f8f9fa] border border-[#e8eaed] rounded-xl mt-2">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-semibold text-[#3c4043]">Google Skills Public Profile URL</label>
                      <input type="url" required value={cProfileUrl} onChange={(e) => setCProfileUrl(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="https://cloudskillsboost.google/..." />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-semibold text-[#3c4043]">Highest Arcade Points Earned</label>
                      <input type="number" required value={cHighestPoints} onChange={(e) => setCHighestPoints(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="E.g., 45" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-semibold text-[#3c4043]">Which Tier Swags Claimed?</label>
                      <select required value={cSwagTier} onChange={(e) => setCSwagTier(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                        <option value="" disabled hidden>Select Swag Tier</option>
                        <option value="Premium Tier">Premium Tier</option>
                        <option value="Advanced Tier">Advanced Tier</option>
                        <option value="Standard Tier">Standard Tier</option>
                        <option value="None">None Yet</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Dropdown: Source & Resume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">How did you hear about our community/website?</label>
                    <select required value={cSource} onChange={(e) => setCSource(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] cursor-pointer">
                      <option value="" disabled hidden>Select an option</option>
                      <option value="Friends / Colleagues">Friends / Colleagues</option>
                      <option value="Google Search">Google Search</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Other Social Media">Other Social Media</option>
                    </select>
                  </div>
                  {/* ✨ NEW: Optional Resume Link ✨ */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-[#3c4043]">Resume Link <span className="text-[#80868b] font-normal">(Optional)</span></label>
                    <input type="url" value={cResume} onChange={(e) => setCResume(e.target.value)} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124]" placeholder="Google Drive or Portfolio link..." />
                  </div>
                </div>

                {/* Reason Textarea */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-[#3c4043]">Why do you want to become a Coordinator?</label>
                  <textarea required value={cReason} onChange={(e) => setCReason(e.target.value)} rows={4} className="px-4 py-3 bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all text-[#202124] resize-none" placeholder="Share your motivation and how you can contribute..."></textarea>
                </div>

                {/* ✨ Important Note Section ✨ */}
<div className="mt-2 mb-4 bg-[#f8faff] border border-[#d2e3fc] rounded-xl p-6 relative overflow-hidden">
  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1a73e8]"></div>
  
  <h4 className="text-[17px] font-bold text-[#1a73e8] mb-3 flex items-center gap-2">
    <span className="text-xl">📌</span> Important Note
  </h4>
  
  <p className="text-[#3c4043] text-sm font-medium leading-relaxed">
    This is <strong className="text-[#202124]">not</strong> an official Google Arcade Coordinator role. You are being appointed by your Arcade Facilitator to help and guide users within the community. At the end of the program, you will receive a certificate of appreciation directly from your Facilitator.
  </p>
</div>

                {/* Submit Button */}
                <button type="submit" disabled={isSubmittingCoordinator} className={`mt-2 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg shadow-sm font-semibold text-white transition-all ${isSubmittingCoordinator ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a73e8] hover:bg-[#1557b0] hover:-translate-y-0.5 hover:shadow-md'}`}>
                  {isSubmittingCoordinator ? (
                    "Submitting Application..."
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

{/* ================= PREMIUM BASE POINTS SYSTEM ================= */}
<section id="points-system" className="relative z-10 py-24 bg-[#fafbfc] border-b border-[#dadce0]">
  {/* Subtle Background Pattern */}
  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
  
  <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] tracking-tight mb-4">
        Arcade Points <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]">System</span>
      </h2>
      <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
        Understand exactly how your effort translates to your final score. Collect badges across different tracks to maximize your rewards.
      </p>
    </div>
    
    {/* Premium Sleek Cards Container */}
    <div className="flex flex-col gap-5">
      
      {/* 1. Arcade Adventure (Google Blue Theme) */}
      <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white transition-all duration-300 border border-[#e8eaed] border-l-[5px] border-l-[#4285F4] shadow-sm hover:shadow-[0_8px_30px_rgba(66,133,244,0.12)] hover:-translate-y-0.5 overflow-hidden">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[#e8f0fe] text-[#4285F4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <div>
            <h4 className="text-[17px] md:text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">Arcade Adventure</h4>
            <p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-1">Standard track progression</p>
          </div>
        </div>
        
        {/* Highlighted Middle Section */}
        <div className="flex-1 flex justify-start md:justify-center w-full md:w-auto">
          <div className="flex items-center gap-3 bg-[#e8f0fe] rounded-xl px-5 py-2.5 border border-[#d2e3fc] shadow-sm">
            <span className="text-[#1a73e8] text-[15px] font-bold">1 game badge</span>
            <svg className="w-5 h-5 text-[#8ab4f8] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span className="text-[#174ea6] text-[15px] font-black tracking-wide">1 point</span>
          </div>
        </div>
        
        {/* Solid Button */}
        <div className="shrink-0 w-full md:w-auto">
          <div className="inline-block px-8 py-3 bg-[#4285F4] text-white text-[13px] md:text-sm font-bold rounded-xl uppercase tracking-wider shadow-md transition-all hover:bg-[#1a73e8] hover:shadow-lg w-full md:w-auto text-center cursor-pointer">
            1 Point
          </div>
        </div>
      </div>

      {/* 2. Arcade Voyage (Google Red Theme) */}
      <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white transition-all duration-300 border border-[#e8eaed] border-l-[5px] border-l-[#EA4335] shadow-sm hover:shadow-[0_8px_30px_rgba(234,67,53,0.12)] hover:-translate-y-0.5 overflow-hidden">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[#fce8e6] text-[#EA4335] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="text-[17px] md:text-lg font-bold text-[#202124] group-hover:text-[#d93025] transition-colors">Arcade Voyage</h4>
            <p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-1">Intermediate cloud challenges</p>
          </div>
        </div>
        
        {/* Highlighted Middle Section */}
        <div className="flex-1 flex justify-start md:justify-center w-full md:w-auto">
          <div className="flex items-center gap-3 bg-[#fce8e6] rounded-xl px-5 py-2.5 border border-[#fad2cf] shadow-sm">
            <span className="text-[#d93025] text-[15px] font-bold">1 game badge</span>
            <svg className="w-5 h-5 text-[#f28b82] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span className="text-[#a50e0e] text-[15px] font-black tracking-wide">1 point</span>
          </div>
        </div>
        
        {/* Solid Button */}
        <div className="shrink-0 w-full md:w-auto">
          <div className="inline-block px-8 py-3 bg-[#EA4335] text-white text-[13px] md:text-sm font-bold rounded-xl uppercase tracking-wider shadow-md transition-all hover:bg-[#d93025] hover:shadow-lg w-full md:w-auto text-center cursor-pointer">
            1 Point
          </div>
        </div>
      </div>

      {/* 3. Arcade Trail (Google Yellow Theme) */}
      <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white transition-all duration-300 border border-[#e8eaed] border-l-[5px] border-l-[#FBBC05] shadow-sm hover:shadow-[0_8px_30px_rgba(251,188,5,0.12)] hover:-translate-y-0.5 overflow-hidden">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[#fef7e0] text-[#f9ab00] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h4 className="text-[17px] md:text-lg font-bold text-[#202124] group-hover:text-[#ea8600] transition-colors">Arcade Trail</h4>
            <p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-1">Advanced guided paths</p>
          </div>
        </div>
        
        {/* Highlighted Middle Section */}
        <div className="flex-1 flex justify-start md:justify-center w-full md:w-auto">
          <div className="flex items-center gap-3 bg-[#fef7e0] rounded-xl px-5 py-2.5 border border-[#fde293] shadow-sm">
            <span className="text-[#e37400] text-[15px] font-bold">1 game badge</span>
            <svg className="w-5 h-5 text-[#fdd663] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span className="text-[#b06000] text-[15px] font-black tracking-wide">1 point</span>
          </div>
        </div>
        
        {/* Solid Button */}
        <div className="shrink-0 w-full md:w-auto">
          <div className="inline-block px-8 py-3 bg-[#FBBC05] text-[#202124] text-[13px] md:text-sm font-extrabold rounded-xl uppercase tracking-wider shadow-md transition-all hover:bg-[#f9ab00] hover:shadow-lg w-full md:w-auto text-center cursor-pointer">
            1 Point
          </div>
        </div>
      </div>

      {/* 4. Skill Badges (Google Green Theme) */}
      <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white transition-all duration-300 border border-[#e8eaed] border-l-[5px] border-l-[#34A853] shadow-sm hover:shadow-[0_8px_30px_rgba(52,168,83,0.12)] hover:-translate-y-0.5 overflow-hidden">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[#e6f4ea] text-[#34A853] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <h4 className="text-[17px] md:text-lg font-bold text-[#202124] group-hover:text-[#1e8e3e] transition-colors">Skill Badges</h4>
            <p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-1">90+ Skills Badges available</p>
          </div>
        </div>
        
        {/* Highlighted Middle Section */}
        <div className="flex-1 flex justify-start md:justify-center w-full md:w-auto">
          <div className="flex items-center gap-3 bg-[#e6f4ea] rounded-xl px-5 py-2.5 border border-[#ceead6] shadow-sm">
            <span className="text-[#188038] text-[15px] font-bold">2 badges</span>
            <svg className="w-5 h-5 text-[#81c995] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span className="text-[#0d652d] text-[15px] font-black tracking-wide">1 point</span>
          </div>
        </div>
        
        {/* Solid Button */}
        <div className="shrink-0 w-full md:w-auto">
          <div className="inline-block px-8 py-3 bg-[#34A853] text-white text-[13px] md:text-sm font-bold rounded-xl uppercase tracking-wider shadow-md transition-all hover:bg-[#1e8e3e] hover:shadow-lg w-full md:w-auto text-center cursor-pointer">
            Needs 2
          </div>
        </div>
      </div>

      {/* 5. Special Badges (Premium Purple Theme) */}
      <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white transition-all duration-300 border border-[#e8eaed] border-l-[5px] border-l-[#9333ea] shadow-sm hover:shadow-[0_8px_30px_rgba(147,51,234,0.12)] hover:-translate-y-0.5 overflow-hidden">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[#f3e8fd] text-[#9333ea] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="text-[17px] md:text-lg font-bold text-[#202124] group-hover:text-[#7e22ce] transition-colors">Special Badges</h4>
            <p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-1">Limited-time exclusive</p>
          </div>
        </div>
        
        {/* Highlighted Middle Section */}
        <div className="flex-1 flex justify-start md:justify-center w-full md:w-auto">
          <div className="flex items-center gap-3 bg-[#f3e8fd] rounded-xl px-5 py-2.5 border border-[#e9d5ff] shadow-sm">
            <span className="text-[#7e22ce] text-[15px] font-bold">1 game badge</span>
            <svg className="w-5 h-5 text-[#c084fc] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span className="text-[#581c87] text-[15px] font-black tracking-wide">2 points</span>
          </div>
        </div>
        
        {/* Solid Button */}
        <div className="shrink-0 w-full md:w-auto">
          <div className="inline-block px-8 py-3 bg-[#9333ea] text-white text-[13px] md:text-sm font-extrabold rounded-xl uppercase tracking-wider shadow-md transition-all hover:bg-[#7e22ce] hover:shadow-lg hover:scale-105 w-full md:w-auto text-center cursor-pointer">
            2 Points
          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>
        
      {/* ================= PREMIUM FACILITATOR PROGRAM SECTION ================= */}
<section className="relative z-10 py-24 bg-white border-b border-[#dadce0] overflow-hidden">
  {/* Subtle Background Elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-[0.03] pointer-events-none">
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#1a73e8] rounded-full blur-[100px]"></div>
    <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#34a853] rounded-full blur-[100px]"></div>
  </div>

  <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
    
    {/* Section Header */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[#fef7e0] border border-[#fde293]">
        <span className="text-lg">🌟</span>
        <span className="text-[#ea8600] text-sm font-bold uppercase tracking-wider">Exclusive Program</span>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#202124] tracking-tight mb-5">
        Arcade Facilitator <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#34a853]">Program</span>
      </h2>
      
      <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
        The Facilitator Program offers <strong className="text-[#202124]">bonus points</strong> for participants. Complete required games, trivia, skill badges, and lab-free courses to achieve milestones & get massive point boosts.
      </p>
    </div>

    {/* Premium Features Grid (Replaced the dark stacked boxes) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
      
      {/* Card 1: Join (Blue Theme) */}
      <div className="group relative bg-white rounded-2xl p-8 border border-[#e8eaed] border-t-[5px] border-t-[#4285F4] shadow-sm hover:shadow-[0_12px_40px_rgba(66,133,244,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="w-14 h-14 rounded-xl bg-[#e8f0fe] text-[#4285F4] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#202124] mb-3 group-hover:text-[#1a73e8] transition-colors">Join under a Facilitator</h3>
        <p className="text-[#5f6368] text-[15px] leading-relaxed mb-8 flex-grow">
          Register your profile under an active community facilitator to start your accelerated earning journey.
        </p>
        <div className="mt-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold rounded-md uppercase tracking-wider border border-[#d2e3fc]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Bonus Points
          </span>
        </div>
      </div>

      {/* Card 2: Support (Yellow Theme) */}
      <div className="group relative bg-white rounded-2xl p-8 border border-[#e8eaed] border-t-[5px] border-t-[#FBBC05] shadow-sm hover:shadow-[0_12px_40px_rgba(251,188,5,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="w-14 h-14 rounded-xl bg-[#fef7e0] text-[#f9ab00] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#202124] mb-3 group-hover:text-[#ea8600] transition-colors">Get Support & Guidance</h3>
        <p className="text-[#5f6368] text-[15px] leading-relaxed mb-8 flex-grow">
          Receive exclusive help, step-by-step strategies, and doubt resolution from your community lead.
        </p>
        <div className="mt-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fef7e0] text-[#b06000] text-xs font-bold rounded-md uppercase tracking-wider border border-[#fde293]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Bonus Points
          </span>
        </div>
      </div>

      {/* Card 3: Milestone (Green Theme) */}
      <div className="group relative bg-white rounded-2xl p-8 border border-[#e8eaed] border-t-[5px] border-t-[#34A853] shadow-sm hover:shadow-[0_12px_40px_rgba(52,168,83,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="w-14 h-14 rounded-xl bg-[#e6f4ea] text-[#34A853] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#202124] mb-3 group-hover:text-[#1e8e3e] transition-colors">Reach Milestone Targets</h3>
        <p className="text-[#5f6368] text-[15px] leading-relaxed mb-8 flex-grow">
          Hit specific lab completion goals and track milestones to unlock massive point boosts at the end.
        </p>
        <div className="mt-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e6f4ea] text-[#0d652d] text-xs font-bold rounded-md uppercase tracking-wider border border-[#ceead6]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Bonus Points
          </span>
        </div>
      </div>

    </div>

    {/* Premium CTA Button */}
    <div className="flex justify-center">
      <button
        onClick={() => router.push("/facilitator")}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#f8f9fa] text-[#1a73e8] font-bold text-base rounded-full overflow-hidden border border-[#dadce0] hover:border-[#1a73e8] shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none"
      >
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-[#e8f0fe]"></span>
        <span className="relative">Explore Facilitator Program</span>
        <svg className="w-5 h-5 relative transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
    </div>

  </div>
</section>

{/* ================= FREE CREDITS GUIDE ================= */}
<section className="relative z-10 py-16 bg-[#ffffff] border-b border-[#dadce0] overflow-hidden font-sans">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
    
    {/* YouTube Premium Box (Replaced Purple Header) */}
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#202124] mb-3">Watch the Video Tutorial & Get 309$ Credits</h2>
        <p className="text-[#5f6368] text-lg">Follow along with this step-by-step video guide</p>
      </div>
      
      <div className="relative max-w-3xl mx-auto rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#dadce0] aspect-video flex items-center justify-center group cursor-pointer bg-[#0f52ba]">
        {/* YouTube Thumbnail Mock Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2]"></div>
        
        {/* Decorative elements for the thumbnail */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
           <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#64b5f6] rounded-full blur-[80px]"></div>
        </div>
        
        {/* Video Inner Content */}
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
          
          {/* Top Bar - Video Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[10px]">
              🚀
            </div>
            <div className="text-white text-sm md:text-base font-semibold truncate text-left drop-shadow-md">
              [ Coming Soon.. ] Google Cloud FREE 309 Credits | Step-by-Step Guide | Google Skills
            </div>
          </div>

          {/* Center Title & Play Button */}
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

            {/* Premium Play Button */}
            <div className="mx-auto w-16 h-11 md:w-20 md:h-14 bg-[#ff0000] rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(255,0,0,0.4)] transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* Bottom Bar */}
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

  {/* Special Credit Link Box (Light Orange Theme) */}
<div className="bg-[#fff8f0] border border-[#fbd0b4] rounded-xl p-6 md:p-8 mb-16 shadow-sm relative transition-all max-w-3xl mx-auto">
  
  {/* Updated Copy Badge (Clear & Readable) */}
  <button 
    onClick={handleCopyCode}
    className="absolute top-5 right-5 md:top-6 md:right-6 bg-white hover:bg-[#f9f9f9] px-3 py-1.5 rounded-lg text-[14px] font-bold flex items-center gap-2 border border-[#dadce0] transition-colors cursor-pointer group shadow-sm"
    title="Copy code"
  >
    {/* Removed font-mono, changed to deep high-contrast color */}
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
    <div className="text-[#d94a11] text-2xl shrink-0">
      🔗
    </div>
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
      {/* Code tag se mono font aata h, usko div kar diya and highlight clear kar diya */}
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

    {/* Step-by-Step Guide (Vertical Cards Matching Screenshot 1) */}
    <div className="mb-16 max-w-3xl mx-auto">
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

    {/* Pro Tips Box (Light Green Theme Matching Screenshot 2) */}
    <div className="bg-[#e6f4ea] rounded-xl p-6 md:p-8 shadow-sm border border-[#ceead6] max-w-3xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2 text-[#0d652d]">
        <div className="bg-[#137333] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
          ✓
        </div> 
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

        <FAQ />

        
      </main>
    </>
  );
}