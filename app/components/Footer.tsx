"use client";

import { useRouter } from "next/navigation";
import VisitCounter from "@/app/components/VisitCounter";

export default function Footer() {
  const router = useRouter();
  
  // 🔥 FIX: Next.js me document.lastModified har refresh pe change hota hai, 
  // isliye ab isko static kar diya. Jab site update karo, toh bas ye date change kar dena.
  const lastUpdated = "April 29, 2026";

  return (
    <footer className="bg-white pt-24 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP SECTION: Links & Brand */}
        {/* Gap kam kiya mb-20 se mb-12 kar diya taaki niche ka content upar aaye */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-12 gap-y-16 mb-12">
          
          {/* BRAND INFO & VISITOR COUNT & DISCLAIMER */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-md bg-[#1a73e8] flex items-center justify-center text-white text-lg font-bold shadow-sm hover:bg-[#1557b0] transition-colors cursor-pointer" 
                onClick={() => router.push("/")}
              >
                A
              </div>
              <span 
                className="text-xl font-medium text-[#202124] tracking-tight hover:text-[#1a73e8] transition-colors cursor-pointer" 
                onClick={() => router.push("/")}
              >
                Arcade Nexus
              </span>
            </div>
            <p className="text-[#5f6368] text-[15px] leading-relaxed mb-6 max-w-sm">
              This platform is independently designed and developed to help users track, 
              analyze, and improve their Google Cloud Arcade progress efficiently.
            </p>

            {/* PREMIUM WEBSITE VISITOR BOX */}
            <div className="flex items-center justify-between p-4 rounded-md bg-gradient-to-r from-[#f8f9fa] to-white border border-[#dadce0] shadow-[0_2px_4px_rgba(0,0,0,0.02)] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <span className="text-[12px] font-bold text-[#5f6368] uppercase tracking-wider">Website Visitors</span>
              </div>
              <div className="text-xl font-semibold text-[#202124] tabular-nums tracking-tight">
                <VisitCounter />
              </div>
            </div>

            {/* ORIGINAL DISCLAIMER BOX */}
            <div className="p-4 rounded-md bg-[#f8f9fa] border border-[#dadce0] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p className="text-[13px] text-[#5f6368] leading-relaxed">
                <strong className="text-[#202124]">Disclaimer:</strong> This website is an independent, community-built tool and is not 
                an official website of Google Cloud Arcade or Google. All trademarks belong to their respective owners.
              </p>
            </div>
          </div>

          {/* PLATFORM LINKS */}
          <div className="lg:col-span-1">
            <h4 className="text-[#202124] font-semibold mb-6 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => router.push("/calculator")} className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2 group">
                  Calculator
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/dashboard")} className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2 group">
                  Dashboard
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/leaderboard")} className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2 group">
                  Leaderboard
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/resources")} className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors text-left flex items-center gap-2 group">
                  Skill Badges
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </li>
            </ul>
          </div>

          {/* RESOURCES LINKS */}
          <div className="lg:col-span-1">
            <h4 className="text-[#202124] font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors flex items-center gap-2 group">
                  Enrollment
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </li>
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors flex items-center gap-2 group">
                  Points System
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </li>
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="text-[#5f6368] text-[15px] font-medium hover:text-[#1a73e8] transition-colors flex items-center gap-2 group">
                  Syllabus
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </li>
            </ul>
          </div>

          {/* STAY CONNECTED SECTION */}
          <div className="lg:col-span-2">
            <h4 className="text-[#202124] font-semibold mb-6 text-sm uppercase tracking-wider">Stay Connected</h4>
            <p className="text-[15px] text-[#5f6368] mb-6 leading-relaxed">Join our community for the latest Arcade updates, hints, and support.</p>
            
            <div className="flex flex-col gap-3.5 items-start">
              
              {/* WhatsApp Box */}
              <a 
                href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 bg-white border border-[#dadce0] text-[#202124] text-[15px] font-medium rounded-md hover:bg-[#f8f9fa] hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(37,211,102,0.12)] group"
              >
                <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.28-.14-1.658-.817-1.914-.91-.256-.093-.442-.14-.628.14-.186.28-.721.91-.884 1.097-.163.187-.326.21-.605.07-.28-.14-1.182-.436-2.251-1.389-.828-.737-1.387-1.647-1.549-1.926-.163-.28-.017-.432.123-.571.127-.127.28-.327.419-.49.14-.163.186-.28.28-.465.093-.187.047-.35-.023-.49-.07-.14-.628-1.516-.86-2.073-.226-.543-.456-.468-.628-.477-.164-.009-.35-.011-.536-.011-.186 0-.488.07-.743.345-.256.275-.976.953-.976 2.324 0 1.372.999 2.698 1.139 2.883.14.186 1.966 3.001 4.761 4.208.665.287 1.185.459 1.587.587.671.213 1.282.183 1.767.11.542-.081 1.658-.677 1.892-1.33.232-.653.232-1.213.163-1.33-.07-.117-.256-.187-.536-.327z"/>
                </svg>
                WhatsApp Community
              </a>

              {/* Box 1: Google Cloud Community */}
              <a 
                href="https://discuss.google.dev/c/google-cloud/14" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-start sm:justify-center gap-3 w-full sm:w-auto px-6 py-3 bg-white border border-[#dadce0] text-[#202124] text-[15px] font-medium rounded-md hover:bg-[#f8f9fa] hover:border-[#1a73e8] hover:text-[#1a73e8] transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] group"
              >
                <svg className="w-5 h-5 text-[#1a73e8] group-hover:scale-110 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <div className="flex flex-col text-left">
                  <span>Google Cloud Community</span>
                  <span className="text-[12px] text-[#5f6368] font-normal group-hover:text-[#1a73e8] transition-colors leading-tight mt-0.5">Official forums</span>
                </div>
              </a>

              {/* Box 2: Google Skills */}
              <a 
                href="https://www.skills.google/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-start sm:justify-center gap-3 w-full sm:w-auto px-6 py-3 bg-white border border-[#dadce0] text-[#202124] text-[15px] font-medium rounded-md hover:bg-[#f8f9fa] hover:border-[#1a73e8] hover:text-[#1a73e8] transition-all duration-300 shadow-sm hover:shadow-[0_4px_12px_rgba(26,115,232,0.12)] group"
              >
                <svg className="w-5 h-5 text-[#1a73e8] group-hover:scale-110 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="flex flex-col text-left">
                  <span>Google Skills</span>
                  <span className="text-[12px] text-[#5f6368] font-normal group-hover:text-[#1a73e8] transition-colors leading-tight mt-0.5">Learning platform</span>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Socials */}
        {/* 🔥 FIX: border-t hata di aur pt-10 ko pt-4 kar diya taaki upar shift ho */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-8 pb-4">
          
          <div className="flex flex-col items-center md:items-start gap-2.5">
            
            <div className="text-[#3c4043] text-[15px] flex flex-col sm:flex-row items-center gap-3">
              <p className="font-semibold tracking-wide">
                © {new Date().getFullYear()} Arcade Nexus
              </p>
              
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#dadce0]"></div>
              
              {/* 🔥 FIX: LinkedIn links add kiye */}
              <p className="flex items-center justify-center gap-1.5 flex-wrap font-medium text-[#5f6368]">
                Powered by 
                <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="font-bold text-[#202124] hover:text-[#1a73e8] cursor-pointer transition-colors duration-200 ml-0.5">
                  Manish Kumar
                </a> 
                <span className="text-[#bdc1c6] font-normal text-sm px-0.5">&</span> 
                {/* ⚠️ Anjali ki LinkedIn link add kar lena niche href me */}
                <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" className="font-bold text-[#202124] hover:text-[#1a73e8] cursor-pointer transition-colors duration-200">
                  Anjali Patel
                </a>
              </p>
            </div>

            {/* 🔥 FIX: About Us section for both developers */}
            <p className="text-[13px] text-[#5f6368] font-medium leading-relaxed text-center md:text-left max-w-lg mt-1">
              This project was independently designed and developed together by Manish and Anjali to assist the Google Cloud Arcade community.
            </p>
            
            {/* 🔥 FIX: Dark text (text-[#202124]) aur issue fixed */}
            <p className="text-[13px] text-[#202124] font-bold tracking-[0.05em] uppercase mt-2">
              Last Updated: 05 May 2026 01:22 am IST
            </p>
          </div>

          {/* SOCIAL ICONS (Size Increased to w-8 h-8) */}
          <div className="flex items-center gap-6">
            
            {/* GitHub */}
            <a 
              href="https://github.com/M-pixie" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub" 
              className="hover:-translate-y-1 hover:scale-110 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md"
            >
              <svg className="w-8 h-8 fill-[#24292e]" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/manish-ui" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn" 
              className="hover:-translate-y-1 hover:scale-110 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md"
            >
              <svg className="w-8 h-8 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/am.pixi" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="hover:-translate-y-1 hover:scale-110 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md"
            >
              <svg className="w-8 h-8" fill="url(#ig-grad-fixed)" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="ig-grad-fixed" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

          </div>

        </div>
      </div>
    </footer>
  );
}