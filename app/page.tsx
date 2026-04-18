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

  // 🔥 FULL 12 EVENTS LIST REORDERED (Arcade #1, GSA #6)
  const googleEvents = [
    { 
      title: "Google Cloud Arcade", icon: "🎮", 
      theme: { bg: "bg-[#e8f0fe]/20", text: "text-[#1a73e8]", border: "border-[#d2e3fc]" }, 
      date: "All Year Round", 
      desc: "Gamified cloud skills learning platform with hands-on labs, trivia, and standard tier point progression.", 
      swags: "Premium Hoodies, Backpacks, Mugs & Cloud Gear", 
      link: "https://go.cloudskillsboost.google/arcade" 
    },
    { 
      title: "Google DevFest", icon: "🎪", 
      theme: { bg: "bg-[#fce8e6]/20", text: "text-[#c5221f]", border: "border-[#f8c1cb]" }, 
      date: "Oct - Dec (Annually)", 
      desc: "The largest annual decentralized tech conference hosted by local Google Developer Groups.", 
      swags: "Official T-shirts, Badges, Stickers & Tech Gadgets", 
      link: "https://developers.google.com/community/devfest" 
    },
    { 
      title: "Google I/O Extended", icon: "🌐", 
      theme: { bg: "bg-[#e8f0fe]/20", text: "text-[#1a73e8]", border: "border-[#d2e3fc]" }, 
      date: "May - July", 
      desc: "Community-led technical sessions bringing the magic of Google I/O global announcements to local cities and GDSCs.", 
      swags: "Exclusive I/O T-shirts, Developer Stickers & Pins", 
      link: "https://developers.google.com/community/gdg/io-extended" 
    },
    { 
      title: "Solution Challenge", icon: "🌍", 
      theme: { bg: "bg-[#e6f4ea]/20", text: "text-[#137333]", border: "border-[#ceead6]" }, 
      date: "Jan - May", 
      desc: "Global hackathon to solve UN Sustainable Development Goals using Google tech to build real-world software solutions.", 
      swags: "Heavy Cash Prizes, Mentorship & Premium Gadgets", 
      link: "https://developers.google.com/community/gdsc-solution-challenge" 
    },
    { 
      title: "Study Jams (Cloud/Android)", icon: "📚", 
      theme: { bg: "bg-[#fef7e0]/20", text: "text-[#b06000]", border: "border-[#fde293]" }, 
      date: "Aug - Sep", 
      desc: "Month-long campus campaigns for hands-on technical learning and course completions.", 
      swags: "Verified Certificates, Badges & Official T-shirts", 
      link: "https://developers.google.com/community/gdsc" 
    },
    { 
      title: "Google Student Ambassador (GSA)", icon: "🎓", 
      theme: { bg: "bg-[#e8f0fe]/20", text: "text-[#1a73e8]", border: "border-[#d2e3fc]" },
      date: "April - June", 
      desc: "A flagship program for university students to act as official liaisons between Google and their campus, hosting workshops and building developer communities.", 
      swags: "Premium Lead Jackets, Backpacks, Medals & Mentorship", 
      link: "https://developers.google.com/community/gdg" 
    },
    { 
      title: "Cloud Next (Innovators Hive)", icon: "☁️", 
      theme: { bg: "bg-[#e8f0fe]/20", text: "text-[#1a73e8]", border: "border-[#d2e3fc]" }, 
      date: "April / October", 
      desc: "Google Cloud's flagship global event featuring developer quests and online challenges.", 
      swags: "Digital Badges, Vouchers & Physical Swags", 
      link: "https://cloud.withgoogle.com/next" 
    },
    { 
      title: "Build with AI", icon: "🤖", 
      theme: { bg: "bg-[#f3e8fd]/20", text: "text-[#8430ce]", border: "border-[#d7aefb]" }, 
      date: "Feb - May", 
      desc: "Global campaign teaching developers how to build real-world apps using Gemini and AI tools.", 
      swags: "Build with AI T-shirts, Cloud Credits & Prize Kits", 
      link: "https://developers.google.com/community/build-with-ai" 
    },
    { 
      title: "WTM IWD Events", icon: "👩‍💻", 
      theme: { bg: "bg-[#fce8e6]/20", text: "text-[#c5221f]", border: "border-[#f8c1cb]" }, 
      date: "March - May", 
      desc: "Technical workshops highlighting Women in Tech (International Women's Day), open to all.", 
      swags: "Aesthetic WTM T-shirts, Notebooks & Tote Bags", 
      link: "https://developers.google.com/womentechmakers" 
    },
    { 
      title: "Google Summer of Code", icon: "☀️", 
      theme: { bg: "bg-[#fef7e0]/20", text: "text-[#b06000]", border: "border-[#fde293]" }, 
      date: "Jan - August", 
      desc: "Prestigious global program writing code for open-source organizations during summer.", 
      swags: "Heavy Stipend ($1.5k-$3k+), Certificates & T-shirts", 
      link: "https://summerofcode.withgoogle.com/" 
    },
    { 
      title: "Gemini API Competition", icon: "🏆", 
      theme: { bg: "bg-[#f3e8fd]/20", text: "text-[#8430ce]", border: "border-[#d7aefb]" }, 
      date: "Mid-Year", 
      desc: "Global online hackathons to build innovative applications using the latest Gemini models.", 
      swags: "Custom Trophies, Cash Prizes & Pixel Devices", 
      link: "https://ai.google.dev/competition" 
    },
    { 
      title: "GenAI Exchange Program", icon: "🧠", 
      theme: { bg: "bg-[#e8f0fe]/20", text: "text-[#1a73e8]", border: "border-[#d2e3fc]" }, 
      date: "April - September", 
      desc: "Joint initiative by Google Cloud & Hack2skill featuring AI training and a national hackathon.", 
      swags: "₹65 Lakh Prize Pool, Cloud Swags & Certificates", 
      link: "https://vision.hack2skill.com/event/genaiexchange" 
    }
  ];

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
{/* ✨ pt-32 ko pt-24 kar diya taaki box thoda upar shift ho jaye ✨ */}
<section className="relative pt-24 pb-20 px-6 border-b border-[#dadce0] bg-white overflow-hidden">
  
  <div className="max-w-[90rem] mx-auto relative z-10">
    {/* ✨ PREMIUM PURPLE BANNER (Hero Content + Yugali Box) ✨ */}
    {/* ✨ rounded-[2.5rem] ko rounded-2xl kiya gaya taaki halka aur premium curve aaye ✨ */}
    <div className="bg-gradient-to-r bg-[#0d47a1] rounded-2xl p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(107,60,176,0.3)] relative overflow-hidden flex flex-col gap-12 w-full mx-auto">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
         <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#d7aefb] rounded-full blur-[100px]"></div>
      </div>

      {/* === TOP ROW: Text, Buttons & Quick Links === */}
      <div className="flex flex-col lg:flex-row items-center gap-12 w-full relative z-10">
        
        {/* LEFT COLUMN: Text & Buttons */}
        <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="group relative inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 border border-white/20 text-[#fde293] text-[13px] font-extrabold mb-8 uppercase tracking-widest rounded-full shadow-sm cursor-default backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34a853]"></span>
            </span>
            <span className="relative z-10">April Month Labs Live !</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Arcade<span className="text-[#fde293]"> Program</span>
          </h1>

          <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-10">
            The ultimate professional dashboard to calculate your points, monitor live leaderboard rankings, and track your cloud skills journey.
          </p>

          {/* Premium Stylish Buttons Row (All Equal & Long Width) */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
            <button
              onClick={() => router.push("/calculator")}
              className="flex-1 w-full px-6 py-4 bg-white text-[#6b3cb0] font-black text-[15px] sm:text-base rounded-xl hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              <span className="whitespace-nowrap">Open Calculator</span>
            </button>
            
            <a
              href="https://go.cloudskillsboost.google/arcade"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 w-full px-6 py-4 bg-[#fde293] hover:bg-[#fbc02d] text-[#6b3cb0] font-black text-[15px] sm:text-base rounded-xl hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span className="whitespace-nowrap">Start Labs</span>
            </a>

            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 w-full px-6 py-4 bg-white/10 text-white border border-white/20 font-bold text-[15px] sm:text-base rounded-xl hover:bg-white/20 hover:border-white/40 shadow-sm backdrop-blur-md transition-all duration-300 focus:outline-none flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <span className="whitespace-nowrap">Dashboard</span>
            </button>
          </div>

          {/* ✨ NEW: Animated Action Buttons Container ✨ */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
            <button 
              onClick={() => document.getElementById('google-events')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white font-bold transition-all group animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(253,226,147,0.3)] hover:shadow-[0_0_30px_rgba(253,226,147,0.5)] transform hover:-translate-y-1 w-full sm:w-auto"
            >
              All Google Events & Programs
              <div className="bg-[#fde293] text-[#6b3cb0] p-1.5 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7-7V3" /></svg>
              </div>
            </button>

            <button 
              onClick={() => document.getElementById('coordinator-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white font-bold transition-all group animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(253,226,147,0.3)] hover:shadow-[0_0_30px_rgba(253,226,147,0.5)] transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Apply for Co Ordinator Role
              <div className="bg-[#fde293] text-[#6b3cb0] p-1.5 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7-7V3" /></svg>
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Premium Quick Links (Bullets) */}
        <div className="relative z-10 w-full lg:w-1/3 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
            <span className="w-2 h-2 rounded-full bg-[#fde293] animate-pulse"></span>
            <h3 className="text-[#fde293] font-bold text-lg uppercase tracking-wider">Quick Actions Open</h3>
          </div>

          {[
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
              className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-semibold backdrop-blur-md group shadow-sm cursor-pointer transform hover:-translate-x-1"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              <span className="text-[#fde293] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all font-bold">
                →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* === BOTTOM ROW: Yugali Announcement (Inside Header) === */}
      <div className="w-full max-w-5xl mx-auto bg-white border border-[#dadce0] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row relative z-20">
        <div className="w-full md:w-1.5 h-1.5 md:h-auto bg-gradient-to-b from-[#1a73e8] via-[#8ab4f8] to-[#1a73e8]"></div>
        <div className="p-6 md:p-8 flex-1 w-full text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-[#f1f3f4] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-lg shadow-sm border border-[#d2e3fc]">
                📢
              </div>
              <div>
                <h3 className="font-bold text-[#1a73e8] text-lg">
                  <a 
                    href="https://discuss.google.dev/t/google-skills-arcade-2026-prize-counter-update/347189?u=npoojithareddy2" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                  >
                    Google Skills Arcade 2026: Prize Counter Update
                  </a>
                </h3>
                
                <p className="text-xs mt-2.5">
                  <span className="bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-1 rounded-md font-bold inline-block shadow-sm border border-[#d2e3fc]">
                    Official update : A new cadence for the 2026 Prize Counter.
                  </span>
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 mt-2 sm:mt-0">
              <a 
                href="https://discuss.google.dev/t/google-skills-arcade-2026-prize-counter-update/347189?u=npoojithareddy2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#1a73e8] text-white text-sm font-bold rounded-lg shadow-[0_2px_10px_rgba(26,115,232,0.15)] hover:bg-[#1557b0] hover:shadow-[0_6px_20px_rgba(26,115,232,0.3)] transform hover:-translate-y-0.5 transition-all duration-300 group whitespace-nowrap"
              >
                View Yugali Post
                <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#34a853] text-white flex items-center justify-center font-bold text-sm">Y</div>
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-[#202124]">Yugali <span className="bg-[#e8f0fe] text-[#1a73e8] text-[10px] px-1.5 py-0.5 rounded ml-1 border border-[#d2e3fc]">Google Staff</span></span>
                 <span className="text-[11px] text-[#5f6368]">Apr 7 • 2026</span>
               </div>
            </div>
          </div>

          <div className="text-[15px] leading-relaxed space-y-4 bg-[#f8f9fa] p-5 rounded-lg border border-[#e8eaed]">
            <p className="bg-[#e8f0fe] text-[#1a73e8] px-3 py-2.5 rounded-md font-medium shadow-sm inline-block w-full border border-[#d2e3fc]">
              If you've been part of our Google Skills Arcade family for a while, you know the rhythm we've shared: the excitement of two Prize Counter openings every year. It's been our favorite way to celebrate the miles you've covered.
            </p>
            <p className="bg-white text-[#202124] px-3 py-2.5 rounded-md font-bold shadow-sm border-l-4 border-[#1a73e8] inline-block w-full text-base">
              This year, the road has a bit of a detour.
            </p>
            <p className="bg-[#e8f0fe] text-[#1a73e8] px-3 py-2.5 rounded-md font-medium shadow-sm inline-block w-full border border-[#d2e3fc]">
              Due to some <strong className="text-[#1557b0] font-extrabold">persistent shipping constraints that are out of our hands</strong>, we're moving to a <strong className="text-[#1557b0] font-extrabold">single, unified Prize Counter opening</strong> at the end of this year. Instead of two windows, we'll have one focused moment to redeem your points and grab your swag.
            </p>
            <p className="bg-white text-[#5f6368] px-3 py-2.5 rounded-md font-medium shadow-sm inline-block w-full border border-[#dadce0]">
              We know this feels like a big shift. Having only one chance to claim your rewards is a change we didn't take lightly, and we truly understand if it feels a little bittersweet. Your patience means the world to us while we navigate these logistics to make sure your rewards actually reach you.
            </p>
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
                Master the Platform
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#202124] tracking-tight mb-5">
                Start Your Journey & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Win Arcade</span>
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
                      <span className="text-xl"></span> Arcade Start Guide
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
                      <span className="text-xl"></span> Arcade Essential Tools
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

          
{/* ================= REWARDS SECTION (Updated Color) ================= */}


        <section id="swags" className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
          <div className="max-w-[90rem] mx-auto px-6 relative z-10">
            {/* ✨ CHANGE: Rewards section background changed from Purple to Deep Blue ✨ */}
            <div className="bg-[#0d47a1] rounded-2xl p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(13,71,161,0.3)] relative overflow-hidden flex flex-col items-center w-full max-w-6xl mx-auto">
              <div className="text-center mb-12 relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 border border-white/20 text-[#fde293] font-extrabold mb-8 uppercase tracking-widest rounded-full backdrop-blur-sm">
                  <span className="text-2xl">🎁</span><span>Previous Google Swags</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#fde293] tracking-tight mb-6">Arcade Swags</h2>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Master Google Cloud skills through hands-on labs, accumulate Arcade points, and redeem them for exclusive premium swags.</p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl p-1 bg-gradient-to-br from-[#fde293] to-[#fbc02d] w-full max-w-5xl z-10">
                <div className="relative w-full h-full bg-white rounded-xl overflow-hidden">
                  <img src="https://i.postimg.cc/MT50zzG8/1775382064372.png" alt="Swags" className="w-full h-auto block" />
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
                <h3 className="text-2xl md:text-3xl font-medium text-[#202124] mb-3">Apply for Coordinator Role</h3>
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

                {/* ✨ NEW: Benefits Section ✨ */}
                <div className="mt-2 mb-4 bg-[#f8faff] border border-[#d2e3fc] rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1a73e8]"></div>
                  <h4 className="text-[17px] font-bold text-[#1a73e8] mb-4 flex items-center gap-2">
                    <span className="text-xl">✨</span> Benefits of Becoming a Coordinator
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-[#3c4043] font-medium text-sm">
                      <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] shrink-0 text-base shadow-sm">🎓</div>
                      Special Appreciation Certificate
                    </div>
                    <div className="flex items-center gap-3 text-[#3c4043] font-medium text-sm">
                      <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] shrink-0 text-base shadow-sm">🚀</div>
                      Develop Leadership Skills
                    </div>
                    <div className="flex items-center gap-3 text-[#3c4043] font-medium text-sm">
                      <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] shrink-0 text-base shadow-sm">🎁</div>
                      Win Premium Google Swags
                    </div>
                    <div className="flex items-center gap-3 text-[#3c4043] font-medium text-sm">
                      <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] shrink-0 text-base shadow-sm">☁️</div>
                      Build Google Cloud Skills
                    </div>
                  </div>
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
        <section id="points-system" className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#202124 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-[#202124] tracking-tight mb-4">
                Arcade Points <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbc02d] to-[#fde293]">System</span>
              </h2>
              <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                Understand exactly how your effort translates to your final score. Collect badges across different tracks to maximize your rewards.
              </p>
            </div>
            
            {/* Wrapper for Premium Dark Purple Theme */}
            <div className="bg-[#1A0B2E] border border-[#422575] rounded-2xl shadow-[0_20px_50px_rgba(107,60,176,0.15)] p-4 flex flex-col gap-2 relative overflow-hidden">
              
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8430ce] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d7aefb] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

              {/* Arcade Adventure */}
              <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#2D1B4E]/80 hover:bg-[#422575]/80 transition-all duration-300 cursor-default border border-[#6b3cb0]/40 hover:border-[#fde293]/60 z-10 backdrop-blur-sm shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[#fde293]/10 text-[#fde293] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#fde293]/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-white group-hover:text-[#fde293] transition-colors">Arcade Adventure</h4><p className="text-[13px] md:text-sm font-medium text-[#d7aefb] mt-0.5">Standard track progression</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#1A0B2E] rounded-md px-4 py-2 border border-[#6b3cb0]/50 group-hover:border-[#fde293]/40 transition-all duration-300 shadow-inner"><span className="text-[#a8a2b5] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#8430ce]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg><span className="text-[#fde293] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-5 py-2 bg-[#fde293]/10 text-[#fde293] text-[13px] md:text-sm font-bold rounded-md uppercase tracking-wider shadow-sm transition-all border border-[#fde293]/30 group-hover:bg-[#fde293]/20">1 Point Each</div></div>
              </div>

              {/* Arcade Voyage */}
              <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#2D1B4E]/80 hover:bg-[#422575]/80 transition-all duration-300 cursor-default border border-[#6b3cb0]/40 hover:border-[#fde293]/60 z-10 backdrop-blur-sm shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[#fde293]/10 text-[#fde293] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#fde293]/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-white group-hover:text-[#fde293] transition-colors">Arcade Voyage</h4><p className="text-[13px] md:text-sm font-medium text-[#d7aefb] mt-0.5">Intermediate cloud challenges</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#1A0B2E] rounded-md px-4 py-2 border border-[#6b3cb0]/50 group-hover:border-[#fde293]/40 transition-all duration-300 shadow-inner"><span className="text-[#a8a2b5] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#8430ce]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg><span className="text-[#fde293] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-5 py-2 bg-[#fde293]/10 text-[#fde293] text-[13px] md:text-sm font-bold rounded-md uppercase tracking-wider shadow-sm transition-all border border-[#fde293]/30 group-hover:bg-[#fde293]/20">1 Point Each</div></div>
              </div>

              {/* Arcade Trail */}
              <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#2D1B4E]/80 hover:bg-[#422575]/80 transition-all duration-300 cursor-default border border-[#6b3cb0]/40 hover:border-[#fde293]/60 z-10 backdrop-blur-sm shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[#fde293]/10 text-[#fde293] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#fde293]/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-white group-hover:text-[#fde293] transition-colors">Arcade Trail</h4><p className="text-[13px] md:text-sm font-medium text-[#d7aefb] mt-0.5">Advanced guided paths</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#1A0B2E] rounded-md px-4 py-2 border border-[#6b3cb0]/50 group-hover:border-[#fde293]/40 transition-all duration-300 shadow-inner"><span className="text-[#a8a2b5] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#8430ce]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg><span className="text-[#fde293] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-5 py-2 bg-[#fde293]/10 text-[#fde293] text-[13px] md:text-sm font-bold rounded-md uppercase tracking-wider shadow-sm transition-all border border-[#fde293]/30 group-hover:bg-[#fde293]/20">1 Point Each</div></div>
              </div>

              {/* Skill Badges */}
              <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#2D1B4E]/80 hover:bg-[#422575]/80 transition-all duration-300 cursor-default border border-[#6b3cb0]/40 hover:border-[#fde293]/60 z-10 backdrop-blur-sm shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[#fde293]/10 text-[#fde293] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#fde293]/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-white group-hover:text-[#fde293] transition-colors">Skill Badges</h4><p className="text-[13px] md:text-sm font-medium text-[#d7aefb] mt-0.5">90+ Skills Badges available</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#1A0B2E] rounded-md px-4 py-2 border border-[#6b3cb0]/50 group-hover:border-[#fde293]/40 transition-all duration-300 shadow-inner"><span className="text-[#a8a2b5] text-[13px] md:text-sm font-semibold">x2 badges</span><svg className="w-4 h-4 text-[#8430ce]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg><span className="text-[#fde293] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-5 py-2 bg-[#fde293]/10 text-[#fde293] text-[13px] md:text-sm font-bold rounded-md uppercase tracking-wider shadow-sm transition-all border border-[#fde293]/30 group-hover:bg-[#fde293]/20">Needs 2 Badges</div></div>
              </div>

              {/* Special Badges */}
              <div className="group relative rounded-xl py-5 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#422575]/60 hover:bg-[#6b3cb0]/60 transition-all duration-300 cursor-default border border-[#8430ce]/50 hover:border-[#fde293]/80 z-10 backdrop-blur-sm shadow-md hover:shadow-lg">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[#fde293]/20 text-[#fde293] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-[#fde293]/40"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-extrabold text-[#fde293]">Special Badges</h4><p className="text-[13px] md:text-sm font-semibold text-[#fde293]/80 mt-0.5">Limited-time exclusive</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-[#1A0B2E] rounded-md px-4 py-2 shadow-inner border border-[#8430ce]/60 group-hover:border-[#fde293]/50 transition-all duration-300"><span className="text-[#a8a2b5] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#d7aefb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg><span className="text-[#fde293] text-[13px] md:text-sm font-extrabold">2 points</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-5 py-2 bg-[#fde293] text-[#422575] text-[13px] md:text-sm font-extrabold rounded-md uppercase tracking-wider shadow-[0_0_15px_rgba(253,226,147,0.4)] transition-all hover:scale-105">2 Points</div></div>
              </div>
              
            </div>
          </div>
        </section>
        
       {/* ================= PREMIUM FACILITATOR PROGRAM SECTION ================= */}
       <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-[#1e1e1e] rounded-2xl p-8 md:p-10 shadow-lg text-white border border-[#333]">
              
              {/* Header inside the dark box */}
              <div className="text-center md:text-left mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                  <span className="text-4xl">🌟</span>
                  <span>Arcade Facilitator <span className="text-[#fde293]">Program</span></span>
                </h2>
                <p className="text-[#aaa] text-base md:text-lg max-w-2xl mx-auto md:mx-0 leading-relaxed">
                  The Facilitator Program offers <span className="font-bold text-white">bonus points</span> for participants. Complete required number of Games, Trivia, Skill Badges and Lab-free Courses to achieve Facilitator Milestones & get additional bonus points.
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                {/* Item 1 */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#2d2d2d] p-5 rounded-xl border border-[#444] hover:border-[#555] transition-colors group">
                  <div className="flex-1">
                    <h3 className="text-[18px] md:text-xl font-bold text-white mb-1.5">Join under a Facilitator</h3>
                    <p className="text-[#aaa] text-[14px] md:text-[15px] leading-relaxed">Register your profile under an active facilitator to start earning.</p>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                    <span className="inline-flex items-center px-4 py-2 bg-[#e6f4ea]/10 text-[#34a853] text-sm font-bold rounded-lg uppercase tracking-wider border border-[#34a853]/30">
                      Bonus Points
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#2d2d2d] p-5 rounded-xl border border-[#444] hover:border-[#555] transition-colors group">
                  <div className="flex-1">
                    <h3 className="text-[18px] md:text-xl font-bold text-white mb-1.5">Get support & guidance</h3>
                    <p className="text-[#aaa] text-[14px] md:text-[15px] leading-relaxed">Receive exclusive help and strategies from your community lead.</p>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                    <span className="inline-flex items-center px-4 py-2 bg-[#e6f4ea]/10 text-[#34a853] text-sm font-bold rounded-lg uppercase tracking-wider border border-[#34a853]/30">
                      Bonus Points
                    </span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#2d2d2d] p-5 rounded-xl border border-[#444] hover:border-[#555] transition-colors group">
                  <div className="flex-1">
                    <h3 className="text-[18px] md:text-xl font-bold text-white mb-1.5">Reach milestone targets</h3>
                    <p className="text-[#aaa] text-[14px] md:text-[15px] leading-relaxed">Hit specific lab completion goals to unlock massive point boosts.</p>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                    <span className="inline-flex items-center px-4 py-2 bg-[#e6f4ea]/10 text-[#34a853] text-sm font-bold rounded-lg uppercase tracking-wider border border-[#34a853]/30">
                      Bonus Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Link */}
              <div className="pt-6 border-t border-[#444] flex justify-center md:justify-start">
                <button
                  onClick={() => router.push("/facilitator")}
                  className="flex items-center justify-center gap-2 text-[#8ab4f8] hover:text-white font-bold text-base transition-colors group focus:outline-none"
                >
                  Learn More About the Arcade Facilitator Program
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>

            </div>
          </div>
        </section>

{/* ================= FREE CREDITS GUIDE ================= */}
<section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0] overflow-hidden">
  <div className="max-w-4xl mx-auto px-6 relative z-10">
    
    {/* Purple Header Banner */}
    <div className="bg-gradient-to-r from-[#6b3cb0] to-[#8430ce] rounded-3xl p-10 md:p-14 text-center shadow-xl mb-12 relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#d7aefb] rounded-full blur-[80px]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-4xl mb-6 backdrop-blur-sm border border-white/30 text-white">
          🎁
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
          How to Claim Google Skills Credits<br/><span className="text-[#fde293]">Worth $309 for FREE</span>
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
          Follow these simple steps to successfully claim your 309 free credits
        </p>
      </div>
    </div>

    {/* Special Link Box (Dark Theme - Matched with Pro Tips) */}
    <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden transition-all">
      <div className="absolute top-6 right-6 bg-[#2d2d2d] text-[#34a853] px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border border-[#444] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></span>
        ✓ Working
      </div>
      
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#2d2d2d] text-[#fde293] flex items-center justify-center text-xl shrink-0 border border-[#444]">
          🔗
        </div>
        <div className="pr-24">
          <h3 className="text-xl md:text-2xl font-bold text-[#fde293] mb-2">Special Credit Link</h3>
          <p className="text-[#aaa] text-sm md:text-base font-medium">
            Use this exclusive link to receive your <strong className="text-[#34a853]">309 credits</strong>
          </p>
          <p className="text-[#8ab4f8] text-xs font-bold mt-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Last updated & verified: February 2026
          </p>
        </div>
      </div>

      <div className="bg-[#2d2d2d] border border-[#444] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full overflow-hidden">
          <p className="text-xs text-[#888] font-bold uppercase mb-1">Special Link:</p>
          <code className="text-sm md:text-base text-[#8ab4f8] block truncate w-full">
            https://www.skills.google/catalog?<span className="bg-[#3c2a00] text-[#fde293] px-1 rounded font-bold">qlcampaign=6m-ctsdq-27</span>
          </code>
        </div>
        <a 
          href="https://www.skills.google/catalog?qlcampaign=6m-ctsdq-27" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto px-6 py-3 bg-[#d94a11] hover:bg-[#c03f0c] text-white font-bold text-sm rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Open Link
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </div>

    {/* What You'll Get Box */}
    <div className="bg-[#f8faff] border-2 border-[#e8f0fe] rounded-2xl p-6 md:p-8 mb-16 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-xl md:text-2xl font-bold text-[#1a73e8] mb-6 flex items-center gap-2">
        <span className="text-2xl">💡</span> What You'll Get
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white border border-[#dadce0] rounded-xl py-6 px-4 text-center shadow-sm">
          <div className="text-4xl font-black text-[#8430ce] mb-1">9</div>
          <div className="text-[#5f6368] text-sm font-semibold uppercase tracking-wider">Initial Credits</div>
        </div>
        <div className="bg-white border border-[#dadce0] rounded-xl py-6 px-4 text-center shadow-sm">
          <div className="text-4xl font-black text-[#34a853] mb-1">300</div>
          <div className="text-[#5f6368] text-sm font-semibold uppercase tracking-wider">Bonus Credits</div>
        </div>
        <div className="bg-[#e8f0fe] border border-[#d2e3fc] rounded-xl py-6 px-4 text-center shadow-sm transform md:scale-105 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">Total Value</div>
          <div className="text-4xl font-black text-[#1a73e8] mb-1 mt-2">309</div>
          <div className="text-[#1a73e8] text-sm font-bold uppercase tracking-wider">Total Credits</div>
        </div>
      </div>
    </div>

    {/* Steps List */}
    <div className="mb-16">
      <h3 className="text-2xl md:text-3xl font-bold text-[#202124] mb-10 text-center">Step-by-Step Guide</h3>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#1a73e8] before:via-[#8430ce] before:to-[#34a853] before:opacity-30">
        
        {/* Step Items Array Mapping */}
        {[
          { 
            title: "Sign Out of Your Google Skills Account", 
            desc: "Before starting, make sure you log out of your Google Skills account. This is important to ensure the credits are applied correctly.", 
            alert: { type: "important", text: "Important: This step is crucial! Credits may not apply if you're already logged in." }
          },
          { 
            title: "Open the Special Credit Link", 
            desc: "Visit the exclusive link provided above or in the video description.", 
            alert: { type: "important", text: "Important: This link contains a special code at the end of the URL, which is required to activate the credits." }
          },
          { 
            title: "Sign In to Your Google Skills Account", 
            desc: "Once the link opens, sign in using your Google account, or your email and password manually.", 
            alert: { type: "tip", text: "Tip: Use the same account you plan to complete Skill Badges." }
          },
          { 
            title: "Receive Initial Credits", 
            desc: "After signing in through the special link, you will automatically receive 9 credits in your account.", 
            alert: null,
            badge: "9 Credits"
          },
          { 
            title: "Complete One Lab from the Catalog", 
            desc: "To unlock the remaining credits, from the Google Skills Catalog, search for 'hands on'. Select 'A Tour of Google Cloud Hands-on Labs' (recommended for beginners).", 
            alert: { type: "tip", text: "Tip: This lab is perfect for beginners and takes about 3-5 minutes." }
          },
          { 
            title: "Finish the Lab with 100% Score", 
            desc: "Complete the selected lab and ensure you achieve a 100/100 score. This may include opening the Google Cloud Console, assigning permissions to a principal, and enabling a required API.", 
            alert: { type: "important", text: "Important: Partial completion will not unlock the remaining credits." }
          },
          { 
            title: "Verify Your Total Credits", 
            desc: "After ending the lab, visit the Billing / Payments page of your Google Skills Account and confirm that 300 additional credits have been added.", 
            alert: null,
            badge: "309 Total Credits"
          }
        ].map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1a73e8] text-white font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
              {index + 1}
            </div>
            {/* Content Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white border border-[#dadce0] shadow-sm hover:shadow-md hover:border-[#1a73e8] transition-all duration-300">
              <h4 className="text-lg font-bold text-[#202124] mb-2">{step.title}</h4>
              <p className="text-[#5f6368] text-[15px] leading-relaxed mb-3">{step.desc}</p>
              
              {step.badge && (
                <div className="inline-block mt-1 mb-2 px-3 py-1 bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold rounded-md border border-[#d2e3fc]">
                  {step.badge}
                </div>
              )}

              {step.alert && (
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium border ${step.alert.type === 'important' ? 'bg-[#fce8e6] text-[#c5221f] border-[#f8c1cb]' : 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'}`}>
                  {step.alert.text}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Pro Tips Box */}
    <div className="bg-[#1e1e1e] rounded-2xl p-8 md:p-10 shadow-lg text-white border border-[#333]">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#fde293]">
        <span className="text-3xl">⚡</span> Pro Tips for Success
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Always sign out first", desc: "This is the most common reason credits don't apply." },
          { title: "Use the special link", desc: "The code at the end of the URL is essential." },
          { title: "Complete the lab 100%", desc: "Follow all instructions carefully for full credit." },
          { title: "Check your billing page", desc: "Verify credits are added after completing the lab." },
          { title: "Be patient", desc: "Sometimes credits take a few minutes to appear." }
        ].map((tip, i) => (
          <li key={i} className="flex items-start gap-3 bg-[#2d2d2d] p-4 rounded-xl border border-[#444]">
             <div className="mt-0.5 text-[#34a853]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
             </div>
             <div>
               <strong className="text-white block mb-0.5 text-[15px]">{tip.title}</strong>
               <span className="text-[#aaa] text-sm">{tip.desc}</span>
             </div>
          </li>
        ))}
      </ul>
    </div>

  </div>
</section>

       {/* ================= 🔥 NEW: GLOBAL GOOGLE EVENTS SECTION (DARK THEME + FAST DARK PURPLE BLINK CARDS) 🔥 ================= */}
       <section id="google-events" className="relative z-10 py-24 bg-white border-b border-[#dadce0] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Wrapper for Dark Theme (Matched with Pro Tips) */}
            <div className="bg-[#1e1e1e] rounded-3xl p-8 md:p-12 shadow-2xl border border-[#333] relative overflow-hidden">
              
              {/* Custom CSS for FAST Dark Purple Blinking Cards */}
              <style>{`
                @keyframes ultra-premium-purple-blink {
                  0%, 100% { background-color: #2D1B4E; border-color: rgba(161, 66, 244, 0.3); box-shadow: 0 4px 20px rgba(161, 66, 244, 0.1); }
                  50% { background-color: #1A0B2E; border-color: rgba(161, 66, 244, 0.8); box-shadow: 0 10px 40px rgba(161, 66, 244, 0.5); }
                }
                .animate-ultra-purple-blink {
                  animation: ultra-premium-purple-blink 1.5s ease-in-out infinite;
                }
              `}</style>

              <div className="text-center mb-16 relative z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f3e8fd]/10 text-[#d7aefb] text-xs font-extrabold uppercase tracking-widest rounded-full mb-4 border border-[#d7aefb]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d7aefb] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d7aefb]"></span>
                  </span>
                  Google Opportunities
                </span>
                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-5">
                  Top Google Events & Programs
                </h2>
                <p className="text-[#aaa] text-lg max-w-2xl mx-auto leading-relaxed">
                  Unlock exclusive swags, professional badges, standard tier points, cash prizes and official recognition by participating in these flagship campaigns throughout the year.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {googleEvents.map((event, idx) => {
                  
                  let statusTag = "🟢 Active";
                  if(idx % 3 === 1) statusTag = "⏳ Upcoming";
                  if(idx % 3 === 2) statusTag = "🔥 Live Now";

                  return (
                    <div key={idx} className="rounded-2xl p-6 flex flex-col transition-all duration-300 group animate-ultra-purple-blink relative overflow-hidden transform hover:-translate-y-1">
                      
                      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>

                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border transition-transform duration-500 group-hover:rotate-6 ${event.theme.bg} ${event.theme.border} ${event.theme.text} bg-opacity-90`}>
                            {event.icon}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="bg-[#422575] text-[#d7aefb] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-[#6b3cb0]">
                            {statusTag}
                          </span>
                          <span className="bg-[#1A0B2E] text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-purple-900/50">
                            {event.date}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2.5 relative z-10 group-hover:text-[#d7aefb] transition-colors">{event.title}</h3>
                      <p className="text-[#a8a2b5] text-sm leading-relaxed mb-6 flex-1 relative z-10 font-medium">
                        {event.desc}
                      </p>

                      <div className="bg-[#160826] border border-[#422575] rounded-xl p-4 mb-6 flex items-start gap-3.5 relative z-10 transition-colors group-hover:bg-[#1E0C36] shadow-inner">
                        <div className="w-8 h-8 rounded-full bg-[#2D1B4E] flex items-center justify-center text-lg shrink-0">
                          🎁
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#b48eed] tracking-widest mb-1">Rewards & Perks</p>
                          <p className="text-[13px] font-bold text-white leading-snug">{event.swags}</p>
                        </div>
                      </div>

                      <a 
                        href={event.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-auto pt-4 border-t border-[#422575] flex items-center justify-between text-[#c49cf5] font-bold text-sm group-hover:text-white transition-all relative z-10"
                      >
                        <span>Explore Campaign</span>
                        <div className="w-8 h-8 rounded-full bg-[#422575] flex items-center justify-center group-hover:bg-[#8430ce] transition-colors">
                          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                      </a>
                      
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>


        <FAQ />

        
      </main>
    </>
  );
}