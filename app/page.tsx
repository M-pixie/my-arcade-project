"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; 
import { useRouter } from "next/navigation";
import FAQ from "@/app/components/FAQ";
import PopupModal from "@/app/components/PopupModal";
import { useState, useEffect } from "react"; 

export default function HomePage() {
  const router = useRouter();

  // 🔥 NEW: State for Premium Problem Box Form
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Swags Delivery / Issue");
  const [formSubCategory, setFormSubCategory] = useState(""); 
  const [formMessage, setFormMessage] = useState("");

  // 🔥 NEW: State for Smart Auto Scroll Button
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Agar 300px se zyada scroll ho gaya hai, toh matlab hum neeche hain (upar ka teer dikhao)
      setIsAtTop(window.scrollY < 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler to send form data directly to your WhatsApp!
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Hi Manish, I am ${formName}.\n\nI have a query regarding: *${formCategory}*`;
    
    // Add Sub-category to the message if it exists
    if (formSubCategory) {
      text += `\nSpecifics: *${formSubCategory}*`;
    }
    
    text += `\n\nMessage:\n${formMessage}`;
    const whatsappUrl = `https://wa.me/918538980608?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optional: Clear form after sending
    setFormName("");
    setFormMessage("");
    setFormSubCategory("");
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
      <Navbar />

      {/* ================= FIXED SCROLL BUTTON (SMART AUTO-CHANGE & POSITION FIXED) ================= */}
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
            // Down Arrow (Jab user upar ho)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          ) : (
            // Up Arrow (Jab user neeche ho)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
          )}
        </button>
      </div>

      {/* PURE WHITE BACKGROUND, GOOGLE TEXT COLORS */}
      <main className="min-h-screen bg-white text-[#202124] overflow-hidden selection:bg-[#e8f0fe] selection:text-[#1a73e8] font-sans">


{/* ================= HERO SECTION (PREMIUM & ANIMATED) ================= */}
<section className="relative pt-32 pb-24 px-6 border-b border-[#dadce0] bg-white overflow-hidden">
  
  {/* Custom Animations injected via standard style block */}
  <style>{`
    @keyframes float-element {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    .animate-float {
      animation: float-element 5s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    .animate-glow {
      animation: pulse-glow 3s ease-in-out infinite;
    }
  `}</style>

  <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
    
    {/* ================= TOP ROW: TEXT & NEW IMAGE ================= */}
    <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 mb-20">
      
      {/* ================= LEFT CONTENT (TEXT & NOTE BUTTON) ================= */}
      <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
        
        {/* Animated APRIL LABS Badge (NOW PERFECTLY CENTERED) */}
        <div className="w-full flex justify-center mb-8">
          <div className="group relative inline-flex items-center gap-2.5 px-5 py-2 bg-[#fef7e0] border border-[#fde293] text-[#b06000] text-[13px] font-extrabold uppercase tracking-widest rounded-full shadow-sm cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea4335] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ea4335]"></span>
            </span>
            <span className="relative z-10">April Month Labs Live !</span>
          </div>
        </div>

        {/* MAIN HEADING */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#202124] mb-6 leading-tight">
          Google Skills Arcade
        </h1>

        {/* 🔥 PARAGRAPHS WITH ANNOUNCEMENT BOX HIGHLIGHT THEME 🔥 */}
        
        {/* Subheading 1: White/Gray Highlight */}
        <div className="w-full mb-4">
          <p className="bg-white border border-[#dadce0] text-[#5f6368] px-5 py-4 rounded-xl shadow-sm text-lg md:text-xl leading-relaxed font-medium text-center lg:text-left">
            The professional dashboard to calculate your Google Cloud Arcade points, 
            monitor leaderboard rankings & track your growth in real-time.
          </p>
        </div>

        {/* Subheading 2: Blue Announcement Highlight */}
        <div className="w-full mb-8">
          <p className="bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] px-6 py-5 rounded-xl shadow-sm text-base md:text-lg leading-relaxed font-medium text-center lg:text-left">
            The Arcade  Program is an always-on, no-cost gaming campaign where technical practitioners of all levels can learn new cloud skills like computing, application development, big data & AI/ML and earn digital badges & points to use towards claiming swag prizes and Google Cloud goodies.
          </p>
        </div>

        {/* Standard Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mt-4">
          <button
            onClick={() => router.push("/calculator")}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] text-white font-medium text-base rounded-xl hover:bg-[#1557b0] hover:shadow-md transition-all duration-200 focus:outline-none"
          >
            Open Calculator
          </button>
          
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1a73e8] border border-[#dadce0] font-medium text-base rounded-xl hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-all duration-200 focus:outline-none"
          >
            View Dashboard
          </button>
        </div>

        {/* 🔥 RESTORED TO LEFT SIDE: CLICKABLE HIGHLIGHT NOTE (BLACK & BLUE THEME) 🔥 */}
        <button 
          onClick={() => document.getElementById('google-events')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 w-full lg:w-max inline-flex items-center justify-between gap-4 px-5 py-3.5 bg-[#f8f9fa] hover:bg-[#e8eaed] border border-[#dadce0] rounded-xl shadow-sm transition-all duration-300 cursor-pointer group"
        >
          <span className="text-[#202124] font-extrabold text-[13px] sm:text-sm tracking-wide text-left">
            NOTE: All Google Events & Programs are available at the bottom
          </span>
          <div className="bg-[#202124] group-hover:bg-[#1a73e8] text-white p-1.5 rounded-full animate-bounce shadow-sm transition-colors duration-300 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>

      {/* ================= RIGHT CONTENT: NEW ANIMATED IMAGE & LONG ARCADE BUTTON ================= */}
      <div className="flex-1 w-full flex flex-col justify-center items-center lg:items-end relative mt-12 lg:mt-0">
        
        {/* Decorative floating elements (Google Colors) */}
        <div className="absolute top-4 left-10 w-6 h-6 bg-[#34a853] rounded-full animate-glow opacity-60 z-0"></div>
        <div className="absolute bottom-32 left-4 w-10 h-10 bg-[#ea4335] rounded-full animate-float delay-150 opacity-50 z-0"></div>
        <div className="absolute top-1/3 right-4 w-8 h-8 bg-[#fbbc04] rounded-full animate-glow delay-75 opacity-70 z-0"></div>
        <div className="absolute -top-6 right-20 w-12 h-12 bg-[#1a73e8] rounded-full animate-float opacity-40 z-0"></div>

        {/* Soft background glow behind Image */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[#e8f0fe] rounded-full blur-[80px] opacity-80 z-0 pointer-events-none"></div>

        {/* 🔥 USER PROVIDED IMAGE (Slightly larger and pulled up) 🔥 */}
        <div className="relative z-10 w-full max-w-[560px] animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-2 -mt-4">
          <img 
            src="https://i.postimg.cc/RhgP45n8/1776073780417.png" 
            alt="Google Cloud Arcade Experience" 
            className="w-full h-auto object-contain rounded-2xl transform scale-105 transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* 🔥 ARCADE LABS BUTTON UNDER THE IMAGE ON THE RIGHT 🔥 */}
        <div className="relative z-10 w-full max-w-[560px] flex flex-col gap-3 mt-6 px-2">
          <a
            href="https://go.cloudskillsboost.google/arcade"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#34a853] hover:bg-[#2b8a44] text-white font-bold text-[15px] sm:text-base rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Open Arcade Labs
          </a>
        </div>

      </div>
    </div>

    {/* ================= NEW UPDATE ALERT BOX ================= */}
    <div className="w-full max-w-5xl bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row relative z-20 mt-20">
      
      {/* Left Accent Bar */}
      <div className="w-full md:w-1.5 h-1.5 md:h-auto bg-gradient-to-b from-[#1a73e8] via-[#8ab4f8] to-[#1a73e8]"></div>

      <div className="p-6 md:p-8 flex-1 w-full">
        {/* Top Meta Details */}
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

        {/* Post Author Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#34a853] text-white flex items-center justify-center font-bold text-sm">Y</div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-[#202124]">Yugali <span className="bg-[#e8f0fe] text-[#1a73e8] text-[10px] px-1.5 py-0.5 rounded ml-1 border border-[#d2e3fc]">Google Staff</span></span>
               <span className="text-[11px] text-[#5f6368]">Apr 7 • 2026</span>
             </div>
          </div>
        </div>

        {/* Content Body */}
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
    {/* ================= END ALERT BOX ================= */}
  </div>
</section>


        {/* ================= HOW TO GET STARTED ================= */}
        <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-3xl mx-auto px-6">
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-normal text-[#202124] tracking-tight mb-4">
                How to Start Your Journey?
              </h2>
              <p className="text-[#5f6368] text-base max-w-xl mx-auto leading-relaxed">
                Follow these simple steps to kickstart your Google Cloud Arcade experience.
              </p>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-[#dadce0]">
                {[
                  { link: "https://share.google/mn0xUfmd49TA9RPc1", title: "Sign in Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile." },
                  { link: "https://share.google/45EC3J4RjWLzgbkGy", title: "Registration", desc: "Enroll in Arcade to unlock labs, points and challenges." },
                  { link: "https://share.google/Ojw8FgQpGhPI1sXyt", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards." },
                  { link: "https://share.google/JRMVQ9xd8tTwx8Mol", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards." },
                ].map((step, idx) => (
                  <div key={idx} className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                    <div className="flex-1">
                      <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">{step.title}</h3>
                      <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                      <a 
                        href={step.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full md:w-40 py-3 px-5 bg-[#34a853] hover:bg-[#2b8a44] text-white text-[14px] font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                      >
                        Click Here
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ================= FEATURES ================= */}
        <section className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] tracking-tight mb-4">
                Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Win Arcade</span>
              </h2>
              <p className="text-[#5f6368] text-base max-w-xl mx-auto leading-relaxed">
                Powerful tools and resources designed to help you track, calculate, and boost your Arcade points.
              </p>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-[#dadce0]">
                {[
                  { title: "Points Calculator", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator" },
                  { title: "Smart Dashboard", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard" },
                  { title: "Live Leaderboard", desc: "Compete with others and track your position in real-time.", link: "/leaderboard" },
                  { title: "Facilitator Page", desc: "Get expert guidance, FAQs, and connect directly with community leads.", link: "/facilitator" },
                ].map((feature, idx) => (
                  <div key={idx} className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                    <div className="flex-1">
                      <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">{feature.title}</h3>
                      <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">{feature.desc}</p>
                    </div>
                    <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                      <button 
                        onClick={() => router.push(feature.link)}
                        className="flex items-center justify-center gap-2 w-full md:w-40 py-3 px-5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
                      >
                        Try it out
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

          
{/* ================= PREMIUM REWARDS SECTION ================= */}
<section className="relative z-10 py-24 bg-gradient-to-b from-[#f8f9fa] to-white border-b border-[#dadce0] overflow-hidden">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16 relative z-10 flex flex-col items-center">
      <div className="inline-flex items-center gap-4 text-[#b06000] mb-8 cursor-default">
        <span className="text-6xl block animate-[smooth-float-spin_3s_ease-in-out_infinite] origin-center">🎁</span>
        <span className="text-sm font-medium text-[#5f6368] uppercase tracking-[0.3em] mt-2">Google Swags</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-semibold text-[#202124] tracking-tight mb-5">Arcade swags</h2>
      <p className="text-[#5f6368] text-lg max-w-2xl mx-auto leading-relaxed font-normal">
        Level up your cloud skills and unlock exclusive, premium Google Cloud gear. The more badges you collect, the bigger the rewards.
      </p>
    </div>
    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] transition-all duration-500 ease-out p-[4px] bg-white mx-auto max-w-5xl">
      <div className="relative w-full h-full bg-white rounded-[13px] z-10 overflow-hidden border border-[#dadce0]">
        <img src="https://i.postimg.cc/MT50zzG8/1775382064372.png" alt="Premium Swags Showcase" className="w-full h-auto block" />
      </div>
    </div>
  </div>
</section>

        {/* ================= OFFICIAL SWAG PARTNERS ================= */}
        <div className="pt-16 border-b border-[#dadce0] pb-24 bg-white">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-medium text-[#202124] mb-3">Official Google Swags Partners</h3>
            <p className="text-[#5f6368] text-base max-w-xl mx-auto">
              Having trouble tracking your rewards? Connect with the official dispatch partners directly for faster resolution.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6 px-6">
            <a href="mailto:printose@printo.in" className="flex items-center gap-5 p-6 bg-[#f8f9fa] border border-[#dadce0] rounded-xl hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgba(26,115,232,0.1)] transition-all group w-full md:w-[360px]">
              <div className="w-14 h-14 bg-white text-[#5f6368] rounded-full border border-[#dadce0] flex items-center justify-center text-2xl group-hover:bg-[#1a73e8] group-hover:text-white group-hover:border-[#1a73e8] transition-colors">📦</div>
              <div className="text-left">
                <h4 className="text-[#202124] font-semibold text-lg mb-0.5">Printo Support</h4>
                <p className="text-[#1a73e8] text-sm group-hover:underline">printose@printo.in</p>
              </div>
            </a>
            <a href="mailto:support@whitesquarein.com" className="flex items-center gap-5 p-6 bg-[#f8f9fa] border border-[#dadce0] rounded-xl hover:border-[#1a73e8] hover:shadow-[0_8px_30px_rgba(26,115,232,0.1)] transition-all group w-full md:w-[360px]">
              <div className="w-14 h-14 bg-white text-[#5f6368] rounded-full border border-[#dadce0] flex items-center justify-center text-2xl group-hover:bg-[#1a73e8] group-hover:text-white group-hover:border-[#1a73e8] transition-colors">📦</div>
              <div className="text-left">
                <h4 className="text-[#202124] font-semibold text-lg mb-0.5">Whitesquare Int.</h4>
                <p className="text-[#1a73e8] text-sm group-hover:underline">support@whitesquarein.com</p>
              </div>
            </a>
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

       {/* ================= PREMIUM HOW IT WORKS ================= */}
        <section className="relative z-10 py-32 bg-[#f8f9fa] border-t border-b border-[#dadce0] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <div className="inline-block mb-24">
              <span className="text-[#1a73e8] font-bold text-sm tracking-[0.2em] uppercase block mb-3">Simple Process</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-[#202124] tracking-tight mb-5">How it works</h2>
              <p className="text-[#5f6368] text-lg max-w-xl mx-auto font-normal">Get your Google Cloud Arcade points calculated instantly in three seamless steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#dadce0] to-transparent z-0"></div>
              <div className="relative z-10 flex flex-col items-center group">
                <div className="w-20 h-20 bg-[#e8f0fe] border border-[#d2e3fc] rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#1a73e8] group-hover:shadow-[0_8px_30px_rgba(26,115,232,0.2)] transition-all duration-300 transform group-hover:-translate-y-1">
                  <span className="text-[#1a73e8] group-hover:text-white text-3xl font-black tracking-tight transition-colors duration-300">01</span>
                </div>
                <div className="w-12 h-1 bg-[#1a73e8] rounded-full mb-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
                <h3 className="text-xl font-semibold text-[#202124] mb-3 group-hover:text-[#1a73e8] transition-colors">Login with Google</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-[260px]">Securely sign in using your official Google account to access all platform tools.</p>
              </div>
              <div className="relative z-10 flex flex-col items-center group mt-12 md:mt-0">
                <div className="w-20 h-20 bg-[#e6f4ea] border border-[#ceead6] rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#34a853] group-hover:shadow-[0_8px_30px_rgba(52,168,83,0.2)] transition-all duration-300 transform group-hover:-translate-y-1">
                  <span className="text-[#34a853] group-hover:text-white text-3xl font-black tracking-tight transition-colors duration-300">02</span>
                </div>
                <div className="w-12 h-1 bg-[#34a853] rounded-full mb-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
                <h3 className="text-xl font-semibold text-[#202124] mb-3 group-hover:text-[#34a853] transition-colors">Paste Profile URL</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-[260px]">Simply drop your public Cloud Skills Boost profile link into the search bar.</p>
              </div>
              <div className="relative z-10 flex flex-col items-center group mt-12 md:mt-0">
                <div className="w-20 h-20 bg-[#fce8e6] border border-[#f8c1cb] rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#ea4335] group-hover:shadow-[0_8px_30px_rgba(234,67,53,0.2)] transition-all duration-300 transform group-hover:-translate-y-1">
                  <span className="text-[#ea4335] group-hover:text-white text-3xl font-black tracking-tight transition-colors duration-300">03</span>
                </div>
                <div className="w-12 h-1 bg-[#ea4335] rounded-full mb-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
                <h3 className="text-xl font-semibold text-[#202124] mb-3 group-hover:text-[#ea4335] transition-colors">Get Arcade Points</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-[260px]">Instantly view your total points, history, and track your real-time leaderboard rank.</p>
              </div>
            </div>
          </div>
        </section>

       {/* ================= PREMIUM BASE POINTS SYSTEM ================= */}
        <section className="relative z-10 py-24 bg-white border-b border-[#dadce0]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#202124 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-[#202124] tracking-tight mb-4">Arcade Points <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#34a853]">System</span></h2>
              <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">Understand exactly how your effort translates to your final score. Collect badges across different tracks to maximize your rewards.</p>
            </div>
            <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 flex flex-col gap-1">
              <div className="group relative rounded-xl py-4 px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:bg-white transition-colors duration-300 cursor-default border border-transparent hover:border-[#ceead6]">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center group-hover:scale-105 transition-transform duration-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-[#202124]">Arcade Adventure</h4><p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-0.5">Standard track progression</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-[#dadce0] group-hover:border-[#ceead6] transition-all duration-300"><span className="text-[#5f6368] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#bdc1c6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg><span className="text-[#137333] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-4 py-2 bg-[#137333] text-white text-[13px] md:text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">1 Point Each</div></div>
              </div>
              <div className="group relative rounded-xl py-4 px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:bg-white transition-colors duration-300 cursor-default border border-transparent hover:border-[#d2e3fc]">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center group-hover:scale-105 transition-transform duration-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-[#202124]">Arcade Voyage</h4><p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-0.5">Intermediate cloud challenges</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-[#dadce0] group-hover:border-[#d2e3fc] transition-all duration-300"><span className="text-[#5f6368] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#bdc1c6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg><span className="text-[#1a73e8] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-4 py-2 bg-[#1a73e8] text-white text-[13px] md:text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">1 Point Each</div></div>
              </div>
              <div className="group relative rounded-xl py-4 px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:bg-white transition-colors duration-300 cursor-default border border-transparent hover:border-[#b2ebf2]">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#e4f7fb] text-[#0d8293] flex items-center justify-center group-hover:scale-105 transition-transform duration-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-[#202124]">Arcade Trail</h4><p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-0.5">Advanced guided paths</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-[#dadce0] group-hover:border-[#b2ebf2] transition-all duration-300"><span className="text-[#5f6368] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#bdc1c6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg><span className="text-[#0d8293] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-4 py-2 bg-[#0d8293] text-white text-[13px] md:text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">1 Point Each</div></div>
              </div>
              <div className="group relative rounded-xl py-4 px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:bg-white transition-colors duration-300 cursor-default border border-transparent hover:border-[#d7aefb]">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f3e8fd] text-[#8430ce] flex items-center justify-center group-hover:scale-105 transition-transform duration-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-[#202124]">Skill Badges</h4><p className="text-[13px] md:text-sm font-medium text-[#5f6368] mt-0.5">90+ Skills Badges available</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-[#dadce0] group-hover:border-[#d7aefb] transition-all duration-300"><span className="text-[#5f6368] text-[13px] md:text-sm font-semibold">x2 badges</span><svg className="w-4 h-4 text-[#bdc1c6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg><span className="text-[#8430ce] text-[13px] md:text-sm font-bold">1 point</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-4 py-2 bg-[#8430ce] text-white text-[13px] md:text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">Needs 2 Badges</div></div>
              </div>
              <div className="group relative rounded-xl py-4 px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-[#fce8e6]/30 hover:bg-[#fce8e6]/80 transition-colors duration-300 cursor-default border border-[#fce8e6] hover:border-[#f8c1cb]">
                <div className="flex items-center gap-5 relative w-full md:w-auto">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white text-[#c5221f] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><h4 className="text-[17px] md:text-lg font-bold text-[#202124]">Special Badges</h4><p className="text-[13px] md:text-sm font-medium text-[#c5221f] mt-0.5">Limited-time exclusive</p></div>
                </div>
                <div className="relative w-full md:w-auto flex-1 flex justify-start md:justify-center">
                  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-[#f8c1cb]"><span className="text-[#5f6368] text-[13px] md:text-sm font-semibold">x1 game badge</span><svg className="w-4 h-4 text-[#bdc1c6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg><span className="text-[#c5221f] text-[13px] md:text-sm font-bold">2 points</span></div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto text-left md:text-right"><div className="inline-block px-4 py-2 bg-[#ea4335] text-white text-[13px] md:text-sm font-bold rounded-lg uppercase tracking-wider shadow-sm group-hover:shadow-md transition-shadow">2 Points</div></div>
              </div>
            </div>
          </div>
        </section>

        
       {/* ================= PREMIUM FACILITATOR PROGRAM SECTION ================= */}
       <section className="relative z-10 py-24 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-3xl mx-auto px-6">

            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#202124] tracking-tight mb-4">
                Arcade Facilitator <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Program</span>
              </h2>
              <p className="text-[#5f6368] text-base max-w-xl mx-auto leading-relaxed">
                The Facilitator Program offers <span className="font-semibold text-[#202124]">bonus points</span> for participants. Complete required number of Games, Trivia, Skill Badges and Lab-free Courses to achieve Facilitator Milestones & get additional bonus points.
              </p>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-[#dadce0]">
                {/* Item 1 */}
                <div className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                  <div className="flex-1">
                    <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">Join under a Facilitator</h3>
                    <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">Register your profile under an active facilitator to start earning.</p>
                  </div>
                  <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                    <span className="inline-block px-4 py-2 bg-[#e6f4ea] text-[#137333] text-sm font-bold rounded-lg uppercase tracking-wider border border-[#ceead6]">
                      Bonus Points
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                  <div className="flex-1">
                    <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">Get support & guidance</h3>
                    <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">Receive exclusive help and strategies from your community lead.</p>
                  </div>
                  <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                    <span className="inline-block px-4 py-2 bg-[#e6f4ea] text-[#137333] text-sm font-bold rounded-lg uppercase tracking-wider border border-[#ceead6]">
                      Bonus Points
                    </span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="px-6 py-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f9fa] transition-colors duration-300 group">
                  <div className="flex-1">
                    <h3 className="text-[18px] md:text-xl font-bold text-[#202124] mb-1">Reach milestone targets</h3>
                    <p className="text-[#5f6368] text-[14px] md:text-[15px] leading-relaxed">Hit specific lab completion goals to unlock massive point boosts.</p>
                  </div>
                  <div className="w-full md:w-auto mt-1 md:mt-0 flex-shrink-0">
                    <span className="inline-block px-4 py-2 bg-[#e6f4ea] text-[#137333] text-sm font-bold rounded-lg uppercase tracking-wider border border-[#ceead6]">
                      Bonus Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Link */}
              <div className="bg-[#f8f9fa] p-6 border-t border-[#dadce0] flex justify-center">
                <button
                  onClick={() => router.push("/facilitator")}
                  className="flex items-center justify-center gap-2 text-[#1a73e8] hover:text-[#1557b0] font-semibold text-base transition-colors group focus:outline-none"
                >
                  Learn More About the Arcade Facilitator Program
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

       {/* ================= 🔥 NEW: GLOBAL GOOGLE EVENTS SECTION (WHITE THEME + FAST DARK PURPLE BLINK CARDS) 🔥 ================= */}
       <section id="google-events" className="relative z-10 py-24 bg-white border-b border-[#dadce0] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Custom CSS for FAST Dark Purple Blinking Cards */}
            <style>{`
              @keyframes ultra-premium-purple-blink {
                0%, 100% { background-color: #2D1B4E; border-color: rgba(161, 66, 244, 0.3); box-shadow: 0 4px 20px rgba(161, 66, 244, 0.1); }
                50% { background-color: #1A0B2E; border-color: rgba(161, 66, 244, 0.8); box-shadow: 0 10px 40px rgba(161, 66, 244, 0.5); }
              }
              .animate-ultra-purple-blink {
                /* 🔥 Animation duration reduced to 1.5s for faster blinking 🔥 */
                animation: ultra-premium-purple-blink 1.5s ease-in-out infinite;
              }
            `}</style>

            {/* Header Area (Light Theme) */}
            <div className="text-center mb-16 relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f3e8fd] text-[#8430ce] text-xs font-extrabold uppercase tracking-widest rounded-full mb-4 border border-[#d7aefb]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8430ce] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8430ce]"></span>
                </span>
                Google Opportunities
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-[#202124] tracking-tight mb-5">
                Top Google Events & Programs
              </h2>
              <p className="text-[#5f6368] text-lg max-w-2xl mx-auto leading-relaxed">
                Unlock exclusive swags, professional badges, standard tier points, cash prizes and official recognition by participating in these flagship campaigns throughout the year.
              </p>
            </div>

            {/* Events Grid with FAST Dark Purple Blinking Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {googleEvents.map((event, idx) => {
                
                // Automatically assign a status badge based on index for a premium realistic feel
                let statusTag = "🟢 Active";
                if(idx % 3 === 1) statusTag = "⏳ Upcoming";
                if(idx % 3 === 2) statusTag = "🔥 Live Now";

                return (
                  <div key={idx} className="rounded-2xl p-6 flex flex-col transition-all duration-300 group animate-ultra-purple-blink relative overflow-hidden transform hover:-translate-y-1">
                    
                    {/* Inner glowing accent for extra premium feel */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Top Row: Icon & Status */}
                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border transition-transform duration-500 group-hover:rotate-6 ${event.theme.bg} ${event.theme.border} ${event.theme.text} bg-opacity-90`}>
                          {event.icon}
                        </div>
                      </div>
                      
                      {/* Interactive Status & Timeline Badges */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="bg-[#422575] text-[#d7aefb] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-[#6b3cb0]">
                          {statusTag}
                        </span>
                        <span className="bg-[#1A0B2E] text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-purple-900/50">
                          {event.date}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description (White/Light Grey for Dark Background) */}
                    <h3 className="text-xl font-bold text-white mb-2.5 relative z-10 group-hover:text-[#d7aefb] transition-colors">{event.title}</h3>
                    <p className="text-[#a8a2b5] text-sm leading-relaxed mb-6 flex-1 relative z-10 font-medium">
                      {event.desc}
                    </p>

                    {/* Swags Box (High Contrast Inner Box) */}
                    <div className="bg-[#160826] border border-[#422575] rounded-xl p-4 mb-6 flex items-start gap-3.5 relative z-10 transition-colors group-hover:bg-[#1E0C36] shadow-inner">
                      <div className="w-8 h-8 rounded-full bg-[#2D1B4E] flex items-center justify-center text-lg shrink-0">
                        🎁
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#b48eed] tracking-widest mb-1">Rewards & Perks</p>
                        <p className="text-[13px] font-bold text-white leading-snug">{event.swags}</p>
                      </div>
                    </div>

                    {/* Bottom CTA Link */}
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
        </section>


        <FAQ />

        
      </main>
    </>
  );
}