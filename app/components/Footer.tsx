"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard"; // 🔥 Added to get live members count

export default function Footer() {
  const router = useRouter();
  
  const lastUpdated = "05 AUGUST 2026 16:58 IST";
  
  // 🔥 Backend se total members laane ka logic
  const [leaderboardCount, setLeaderboardCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaderboardCount(data.length);
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-white pt-20 pb-8 font-sans w-full">
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10">
        
        {/* 🔥 TOP SECTION: Animated Star Logo, Title & Subtitle 🔥 */}
        <div className="flex flex-col items-center text-center mb-12">
          
          {/* 🔥 BADA STAR WITH SPINNING CIRCLE ANIMATION 🔥 */}
          <div className="relative mb-6 flex items-center justify-center w-20 h-20">
            {/* Spinning dashed ring */}
            <div className="absolute inset-0 border-[3px] border-dashed border-[#1a73e8] rounded-full animate-[spin_8s_linear_infinite] opacity-50"></div>
            {/* Big Star */}
            <svg className="w-10 h-10 text-[#1a73e8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
          
          <h2 className="text-[42px] md:text-[49px] font-bold tracking-[-0.04em] text-[#111827] mb-4">
  Arcade Nexus
</h2>
          
          <p className="text-[#5f6368] text-[16px] font-medium max-w-4xl mx-auto leading-relaxed">
  <strong className="text-[#202124]">Arcade Nexus Platform</strong> is an independent, community-driven platform designed and developed by{" "}
  <strong className="text-[#2563EB]">Manish</strong> and{" "}
  <strong className="text-[#2563EB]">Anjali</strong> to help Google Cloud Arcade learners effortlessly track their progress, analyze achievements, access important resources, and stay connected with the community through a modern, all-in-one experience.
</p>
        </div>

        {/* 🔥 MIDDLE SECTION: 4 Cards Grid (Wider Layout) 🔥 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
          
          {/* CARD 1: Total Visitors */}
          <div className="xl:col-span-1 bg-white rounded-2xl border border-[#e8eaed] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-14 h-12 bg-[#e8f0fe] rounded-2xl flex items-center justify-center mb-5 mt-2">
              <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            
            {/* Normal Bold Text instead of tiny caps */}
            <h3 className="text-[18px] font-bold text-[#202124] mb-3">
              Website Visitors
            </h3>
            
            <div className="text-[34px] font-black text-[#1a73e8] tracking-tight mb-8 z-10">
              <VisitCounter />
            </div>

            <div className="absolute bottom-4 left-0 w-full flex items-end justify-center gap-2 px-6 h-12 opacity-80">
               <div className="w-3 bg-[#e8f0fe] h-[20%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[30%] rounded-t-sm"></div>
               <div className="w-3 bg-[#d2e3fc] h-[60%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[40%] rounded-t-sm"></div>
               <div className="w-3 bg-[#e8f0fe] h-[70%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[50%] rounded-t-sm"></div>
               <div className="w-3 bg-[#d2e3fc] h-[90%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[60%] rounded-t-sm"></div>
            </div>
          </div>

          {/* 🔥 CARD 2: NEW PROFILE ANALYZED TOTAL BOX 🔥 */}
          <div className="xl:col-span-1 bg-white rounded-2xl border border-[#e8eaed] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-14 h-12 bg-[#e8f0fe] rounded-2xl flex items-center justify-center mb-5 mt-2">
              <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            
            {/* Normal Bold Text */}
            <h3 className="text-[18px] font-bold text-[#202124] mb-3 leading-tight">
              Users Enrolled
            </h3>
            
            <div className="text-[34px] font-black text-[#1a73e8] tracking-tight mb-8 z-10">
              {leaderboardCount}
            </div>

            <div className="absolute bottom-4 left-0 w-full flex items-end justify-center gap-2 px-6 h-12 opacity-80">
               <div className="w-3 bg-[#e8f0fe] h-[50%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[30%] rounded-t-sm"></div>
               <div className="w-3 bg-[#d2e3fc] h-[80%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[40%] rounded-t-sm"></div>
               <div className="w-3 bg-[#e8f0fe] h-[60%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[90%] rounded-t-sm"></div>
               <div className="w-3 bg-[#d2e3fc] h-[50%] rounded-t-sm"></div>
               <div className="w-3 bg-[#1a73e8] h-[100%] rounded-t-sm"></div>
            </div>
          </div>

          {/* CARD 3: Platform & Resources (Wide Card takes 2 columns) */}
          <div className="md:col-span-2 xl:col-span-2 bg-white rounded-2xl border border-[#e8eaed] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
              
              {/* Platform Column */}
              <div>
                {/* 🔥 NORMAL TEXT BADA & BOLD 🔥 */}
                <h4 className="text-[20px] font-bold text-[#202124] mb-5">
                  Platform
                </h4>
                <ul className="space-y-4">
                  <li>
                    <button onClick={() => router.push("/calculator")} className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors w-full text-left">
                      <span className="text-[20px]">🧮</span> Calculator
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors w-full text-left">
                      <span className="text-[20px]">📊</span> Dashboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/leaderboard")} className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors w-full text-left">
                      <span className="text-[20px]">🏆</span> Leaderboard
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/resources")} className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors w-full text-left">
                      <span className="text-[20px]">🏅</span> Skill Badges
                    </button>
                  </li>
                </ul>
              </div>

              {/* Resources Column */}
              <div>
                {/* 🔥 NORMAL TEXT BADA & BOLD 🔥 */}
                <h4 className="text-[20px] font-bold text-[#202124] mb-5">
                  Resources
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors">
                      <span className="text-[20px]">📝</span> Enrollment
                    </a>
                  </li>
                  <li>
                    <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors">
                      <span className="text-[20px]">⭐</span> Points
                    </a>
                  </li>
                  <li>
                    <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[15px] font-semibold text-[#3c4043] hover:text-[#1a73e8] transition-colors">
                      <span className="text-[20px]">📚</span> Syllabus
                    </a>
                  </li>
                </ul>
              </div>
              
            </div>
          </div>

          {/* CARD 4: Connect */}
          <div className="md:col-span-2 xl:col-span-1 bg-white rounded-2xl border border-[#e8eaed] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-8">
            {/* 🔥 NORMAL TEXT BADA & BOLD 🔥 */}
            <h4 className="text-[20px] font-bold text-[#202124] mb-3">
              Connect
            </h4>
            <p className="text-[14px] font-medium text-[#5f6368] mb-6 leading-relaxed">
              Join our community for the latest updates & support.
            </p>
            
            <ul className="space-y-5">
              <li>
                <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] font-bold text-[#3c4043] hover:text-[#25D366] transition-colors">
                  <svg className="w-5 h-5 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.28-.14-1.658-.817-1.914-.91-.256-.093-.442-.14-.628.14-.186.28-.721.91-.884 1.097-.163.187-.326.21-.605.07-.28-.14-1.182-.436-2.251-1.389-.828-.737-1.387-1.647-1.549-1.926-.163-.28-.017-.432.123-.571.127-.127.28-.327.419-.49.14-.163.186-.28.28-.465.093-.187.047-.35-.023-.49-.07-.14-.628-1.516-.86-2.073-.226-.543-.456-.468-.628-.477-.164-.009-.35-.011-.536-.011-.186 0-.488.07-.743.345-.256.275-.976.953-.976 2.324 0 1.372.999 2.698 1.139 2.883.14.186 1.966 3.001 4.761 4.208.665.287 1.185.459 1.587.587.671.213 1.282.183 1.767.11.542-.081 1.658-.677 1.892-1.33.232-.653.232-1.213.163-1.33-.07-.117-.256-.187-.536-.327z"/></svg>
                  WhatsApp Community
                </a>
              </li>
              <li>
                <a href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] font-bold text-[#3c4043] hover:text-[#1a73e8] transition-colors">
                  <svg className="w-5 h-5 text-[#1a73e8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Get Arcade App (Apk)
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/arcade-nexus/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] font-bold text-[#3c4043] hover:text-[#0A66C2] transition-colors">
                  <svg className="w-5 h-5 fill-[#0A66C2] shrink-0" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Arcade Nexus Platform
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* 🔥 DISCLAIMER BOX 🔥 */}
        <div className="bg-[#f8f9fa] rounded-2xl py-4 px-6 border border-[#e8eaed] text-center mb-10 max-w-[1200px] mx-auto">
          <p className="text-[13px] text-[#5f6368] font-medium">
            <strong className="text-[#202124]">Disclaimer:</strong> This website is an independent, community-built tool and is not an official website of Google. 
            All trademarks belong to their respective owners.
          </p>
        </div>

        {/* 🔥 BOTTOM ROW 🔥 */}
        <div className="border-t border-[#e8eaed] pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-[14px] font-bold text-[#5f6368]">
            © {new Date().getFullYear()} Arcade Nexus
          </div>
          
          {/* 🔥 BLACK TEXT ONLY, NO BLUE PILL 🔥 */}
          <div className="text-[15px] font-black text-[#202124]">
            Last Update: {lastUpdated}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[#5f6368]">Powered by</span>
            <div className="flex -space-x-2">
              <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" title="Manish Kumar" className="hover:z-10 transition-transform">
                <img 
                  src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" 
                  alt="Manish Kumar" 
                  className="w-9 h-9 rounded-full object-cover object-top border-2 border-white shadow-sm" 
                />
              </a>
              <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" title="Anjali Patel" className="hover:z-10 transition-transform">
                <img 
                  src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" 
                  alt="Anjali Patel" 
                  className="w-9 h-9 rounded-full object-cover object-top border-2 border-white shadow-sm" 
                />
              </a>
            </div>
          </div>
          
        </div>

      </div>
    </footer>
  );
}