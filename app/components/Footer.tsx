"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard";

export default function Footer() {
  const router = useRouter();
  const lastUpdated = "09 AUGUST 2026 17:40 IST";
  
  const [leaderboardCount, setLeaderboardCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaderboardCount(data.length);
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 font-sans w-full mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Arcade Nexus</span>
            </div>
            <p className="text-[14px] text-gray-500 leading-relaxed pr-4">
              An independent, community-driven platform designed by <span className="font-medium text-gray-700">Manish</span> and <span className="font-medium text-gray-700">Anjali</span>. Built to help Google Cloud Arcade learners effortlessly track progress, analyze achievements, and stay connected.
            </p>
          </div>

          {/* Platform Links (Col Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-[12px] font-semibold text-gray-900 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => router.push("/calculator")} className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors w-full text-left">
                  Calculator
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/dashboard")} className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors w-full text-left">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/leaderboard")} className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors w-full text-left">
                  Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/resources")} className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors w-full text-left">
                  Skill Badges
                </button>
              </li>
            </ul>
          </div>

          {/* Resource Links (Col Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-[12px] font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group">
                  Enrollment
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </li>
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group">
                  Points System
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </li>
              <li>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group">
                  Syllabus
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Stats & Community (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Clean Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-[12px] font-medium text-gray-500 mb-1">Website Visitors</p>
                <div className="text-xl font-bold text-gray-900">
                  <VisitCounter />
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-[12px] font-medium text-gray-500 mb-1">Users Enrolled</p>
                <div className="text-xl font-bold text-gray-900">
                  {leaderboardCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Connect Links */}
            <div>
              <h3 className="text-[12px] font-semibold text-gray-900 uppercase tracking-wider mb-3">Connect</h3>
              <div className="flex gap-4">
                <a href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-colors" title="WhatsApp Community">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/arcade-nexus/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors" title="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="Download Android App">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-4 border-t border-gray-100">
          <p className="text-[12px] text-gray-500 text-center sm:text-left">
            <span className="font-semibold text-gray-700">Disclaimer:</span> This website is an independent, community-built tool and is not an official website of Google. All trademarks belong to their respective owners.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-[13px] text-gray-500">
            © {new Date().getFullYear()} Arcade Nexus. All rights reserved.
          </div>
          
          <div className="text-[13px] text-gray-500 font-medium">
            Last updated: <span className="text-gray-800">{lastUpdated}</span>
          </div>

          {/* Creators */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-500">Developed by</span>
            <div className="flex -space-x-1.5">
              <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" title="Manish Kumar" className="hover:z-10 transition-transform">
                <img 
                  src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" 
                  alt="Manish Kumar" 
                  className="w-6 h-6 rounded-full object-cover object-top border border-white ring-1 ring-gray-100" 
                />
              </a>
              <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" title="Anjali Patel" className="hover:z-10 transition-transform">
                <img 
                  src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" 
                  alt="Anjali Patel" 
                  className="w-6 h-6 rounded-full object-cover object-top border border-white ring-1 ring-gray-100" 
                />
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}