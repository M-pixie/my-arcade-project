"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  // 🔥 NEW: Reordered links as requested (Dashboard hata diya gaya hai taaki 404 error na aaye)
  const navLinks = [
    { name: "Home", href: "/", tooltip: "Go to Homepage" },
    { name: "Calculator", href: "/calculator", tooltip: "Calculate your points" },
    { name: "Facilitator", href: "/facilitator", tooltip: "Facilitator program info" },
    { name: "Skill Badges", href: "/resources", tooltip: "All Skill Badges" },
    { name: "Dashboard", href: "/dashboard", tooltip: "your dashboard" },
    { name: "Leaderboard", href: "/leaderboard", tooltip: "Check top rankings" },
    { name: "About Arcade", href: "/about", tooltip: "Explore About Arcade" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-[#dadce0] z-50">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* ================= LEFT: LOGO & BACK ================= */}
        <div className="flex items-center gap-4">
          
          {pathname !== "/" && (
            <div className="relative group">
              <button
                onClick={() => router.back()}
                className="w-10 h-8 flex items-center justify-center rounded-sm 
                            text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] 
                            transition-all duration-200 focus:outline-none"
                aria-label="Go Back"
              >
                {/* Long Sleek Left Arrow */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </button>
              
              {/* Tooltip for Back Button */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 bg-[#202124] text-white text-xs font-medium whitespace-nowrap rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-md pointer-events-none">
                Go Back
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-[#202124]"></div>
              </div>
            </div>
          )}

          <Link href="/" className="flex items-center gap-2 group">
            <span className="hidden sm:block text-lg font-medium text-[#202124] tracking-tight group-hover:text-[#1a73e8] transition-colors">
              Arcade Nexus
            </span>
          </Link>
        </div>

        {/* ================= CENTER: NAVIGATION (DESKTOP) ================= */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              // 🔥 NEW: Wrapper div for group hover tooltip
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`block px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 
                    ${isActive 
                      ? "bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]" 
                      : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa]"
                    }`}
                >
                  {link.name}
                </Link>
                
                {/* 🔥 POP MODAL / TOOLTIP FOR NAV LINKS */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#202124] text-white text-xs font-medium whitespace-nowrap rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-md pointer-events-none">
                  {link.tooltip}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-[#202124]"></div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ================= RIGHT: MOBILE TOGGLE ================= */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa] rounded-sm transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-[#dadce0] animate-in slide-in-from-top-5 duration-200 shadow-md">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-sm text-base font-medium transition-colors ${
                    isActive 
                      ? "bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]" 
                      : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

    </header>
  );
}