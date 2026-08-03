"use client";

import { useRouter } from "next/navigation";
import VisitCounter from "@/app/components/VisitCounter";

export default function Footer() {
  const router = useRouter();
  
  // 🔥 Updated to match your exact request
  const lastUpdated = "03 August 2026 20:58 IST";

  return (
    <footer className="bg-[#f4f7fc] pt-24 pb-8 font-sans border-t border-[#e2e8f0]">
      {/* 🔥 Premium Background Color Added */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP SECTION: Links & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-10 gap-y-16 mb-12">
          
          {/* BRAND INFO & VISITOR COUNT & DISCLAIMER */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white text-lg font-bold shadow-md hover:bg-[#1557b0] transition-transform hover:-translate-y-1 cursor-pointer" 
                onClick={() => router.push("/")}
              >
                AN
              </div>
              <span 
                className="text-2xl font-bold text-[#202124] tracking-tight hover:text-[#1a73e8] transition-colors cursor-pointer" 
                onClick={() => router.push("/")}
              >
                Arcade Nexus Platform
              </span>
            </div>
            <p className="text-[#5f6368] text-[15px] font-medium leading-relaxed mb-6 max-w-sm">
              This platform is independently designed and developed to help users track, 
              analyze, and improve their Google Cloud Arcade progress efficiently.
            </p>

            {/* PREMIUM WEBSITE VISITOR BOX */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <span className="text-[12px] font-extrabold text-[#5f6368] uppercase tracking-widest">Total Visitors</span>
              </div>
              <div className="text-xl font-bold text-[#1a73e8] tabular-nums tracking-tight bg-[#f4f7fc] px-4 py-1.5 rounded-full">
                <VisitCounter />
              </div>
            </div>

            {/* ORIGINAL DISCLAIMER BOX */}
            <div className="p-4 rounded-2xl bg-white border border-[#dadce0] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <p className="text-[13px] text-[#5f6368] font-medium leading-relaxed">
                <strong className="text-[#202124] bg-[#f8f9fa] px-2 py-0.5 rounded-md mr-1 border border-[#e2e8f0]">Disclaimer:</strong> 
                This website is an independent, community-built tool and is not an official website of Google. All trademarks belong to their respective owners.
              </p>
            </div>
          </div>

          {/* 🔥 PLATFORM LINKS (NOW PREMIUM PILLS) */}
          <div className="lg:col-span-1">
            <h4 className="text-[#202124] font-extrabold mb-5 text-[13px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8]"></span> Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => router.push("/calculator")} className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">🧮</span> Calculator
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/dashboard")} className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">📊</span> Dashboard
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/leaderboard")} className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">🏆</span> Leaderboard
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/resources")} className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">🏅</span> Skill Badges
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 🔥 RESOURCES LINKS (NOW PREMIUM PILLS) */}
          <div className="lg:col-span-1">
            <h4 className="text-[#202124] font-extrabold mb-5 text-[13px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f9ab00]"></span> Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">📝</span> Enrollment
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </a>
              </li>
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">⭐</span> Points
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </a>
              </li>
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between px-5 py-3 bg-white border border-[#dadce0] rounded-full text-[14.5px] font-semibold text-[#3c4043] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] transition-all duration-300 group">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[16px]">📚</span> Syllabus
                  </span>
                  <span className="text-[#1a73e8] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➔</span>
                </a>
              </li>
            </ul>
          </div>

          {/* STAY CONNECTED SECTION (UPDATED TO PILL STYLE) */}
          <div className="lg:col-span-2">
            <h4 className="text-[#202124] font-extrabold mb-5 text-[13px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34a853]"></span> Connect
            </h4>
            <p className="text-[14px] font-medium text-[#5f6368] mb-5 leading-relaxed">Join our community for the latest updates & support.</p>
            
            <div className="flex flex-col gap-3.5 items-start w-full">
              
              {/* WhatsApp Box */}
              <a 
                href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-between w-full sm:w-auto px-6 py-3 bg-white border border-[#dadce0] text-[#202124] text-[15px] font-bold rounded-full hover:bg-[#f8f9fa] hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(37,211,102,0.12)] group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.28-.14-1.658-.817-1.914-.91-.256-.093-.442-.14-.628.14-.186.28-.721.91-.884 1.097-.163.187-.326.21-.605.07-.28-.14-1.182-.436-2.251-1.389-.828-.737-1.387-1.647-1.549-1.926-.163-.28-.017-.432.123-.571.127-.127.28-.327.419-.49.14-.163.186-.28.28-.465.093-.187.047-.35-.023-.49-.07-.14-.628-1.516-.86-2.073-.226-.543-.456-.468-.628-.477-.164-.009-.35-.011-.536-.011-.186 0-.488.07-.743.345-.256.275-.976.953-.976 2.324 0 1.372.999 2.698 1.139 2.883.14.186 1.966 3.001 4.761 4.208.665.287 1.185.459 1.587.587.671.213 1.282.183 1.767.11.542-.081 1.658-.677 1.892-1.33.232-.653.232-1.213.163-1.33-.07-.117-.256-.187-.536-.327z"/>
                  </svg>
                  WhatsApp Community
                </div>
                <span className="text-[#25D366] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-4">➔</span>
              </a>

              {/* Box 1: Get App */}
              <a 
                href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-between w-full sm:w-auto px-6 py-2.5 bg-white border border-[#dadce0] text-[#202124] rounded-full hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#1a73e8] group-hover:-translate-y-1 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-[14px]">Get Arcade App (Apk)</span>
                    <span className="text-[11px] font-bold text-[#5f6368] group-hover:text-[#1a73e8] transition-colors uppercase tracking-wide"></span>
                  </div>
                </div>
              </a>

             {/* Box 2: LinkedIn Page */}
              <a 
                href="https://www.linkedin.com/company/arcade-nexus/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-between w-full sm:w-auto px-6 py-2.5 bg-white border border-[#dadce0] text-[#202124] rounded-full hover:bg-[#f8f9fa] hover:border-[#0A66C2] transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(10,102,194,0.12)] group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform duration-300 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-[14px]">Arcade Nexus Platform</span>
                    <span className="text-[11px] font-bold text-[#5f6368] group-hover:text-[#0A66C2] transition-colors uppercase tracking-wide"></span>
                  </div>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* 🔥 BOTTOM SECTION (FIXED & MADE PREMIUM) */}
        <div className="pt-8 mt-4 border-t border-[#dadce0] flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 pb-4">
          
          <div className="flex flex-col items-center lg:items-start gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="font-bold text-[#202124] text-[16px] tracking-wide bg-white px-4 py-1.5 rounded-full border border-[#dadce0] shadow-sm">
                © {new Date().getFullYear()} Arcade Nexus
              </p>
              
              <div className="flex items-center gap-2 bg-[#e8f0fe] px-3 py-1.5 rounded-full border border-[#d2e3fc]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a73e8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1a73e8]"></span>
                </span>
                <span className="text-[11px] text-[#1a73e8] font-bold uppercase tracking-widest">
                  Updated:  {lastUpdated}
                </span>
              </div>
            </div>

            <p className="text-[14px] text-[#5f6368] font-medium leading-relaxed text-center lg:text-left max-w-xl">
              This project was independently designed and developed together by <strong className="text-[#202124]">Manish</strong> and <strong className="text-[#202124]">Anjali</strong> to assist the Google Cloud Arcade community.
            </p>
            
            {/* 🔥 NO CURVE BOX - CLEAN CIRCULAR PICS ONLY 🔥 */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[14px] font-bold text-[#5f6368] tracking-wide">Powered by</span>
              <div className="flex items-center gap-2">
                <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" title="Manish Kumar" className="block hover:scale-110 transition-transform">
                  <img 
                    src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" 
                    alt="Manish Kumar" 
                    className="w-9 h-9 rounded-full object-cover object-top border-2 border-white shadow-sm" 
                  />
                </a>
                <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" title="Anjali Patel" className="block hover:scale-110 transition-transform">
                  <img 
                    src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" 
                    alt="Anjali Patel" 
                    className="w-9 h-9 rounded-full object-cover object-top border-2 border-white shadow-sm" 
                  />
                </a>
              </div>
            </div>

          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-5 bg-white p-3 rounded-full border border-[#dadce0] shadow-sm">
            
            {/* GitHub */}
            <a 
              href="https://github.com/M-pixie" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8f9fa] hover:bg-[#24292e] group transition-all duration-300"
            >
              <svg className="w-5 h-5 fill-[#24292e] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/manish-ui" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8f9fa] hover:bg-[#0A66C2] group transition-all duration-300"
            >
              <svg className="w-5 h-5 fill-[#0A66C2] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/a.pixii" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8f9fa] group transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}></div>
              <svg className="w-5 h-5 fill-[#bc1888] group-hover:fill-white transition-colors relative z-10" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

          </div>

        </div>
      </div>
    </footer>
  );
}