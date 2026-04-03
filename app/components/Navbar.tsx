"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🔥 NEW: Reordered links as requested
  const navLinks = [
    { name: "Home", href: "/", tooltip: "Go to Homepage" },
    { name: "Calculator", href: "/calculator", tooltip: "Calculate your points" },
    { name: "Facilitator", href: "/facilitator", tooltip: "Facilitator program info" },
    { name: "Skill Badges", href: "/resources", tooltip: "All Skill BAadges" },
    { name: "Dashboard", href: "/dashboard", tooltip: "View your dashboard" },
    { name: "Leaderboard", href: "/leaderboard", tooltip: "Check top rankings" },
    { name: "Admin", href: "/admin", tooltip: "Admin console" },
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    router.push("/admin");
  };

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

        {/* ================= RIGHT: PROFILE & MOBILE TOGGLE ================= */}
        <div className="flex items-center gap-4">
          
          {/* ✅ PROFILE DROPDOWN (Sirf tab dikhega jab user login hoga) */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center justify-center p-0.5 rounded-full transition-all duration-200 border-2 ${dropdownOpen ? 'border-[#1a73e8] shadow-sm' : 'border-transparent hover:border-[#dadce0]'}`}
              >
                <img
                  src={user.photoURL || "/avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover bg-white"
                />
              </button>

              {/* 🔥 PREMIUM DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl bg-white border border-[#dadce0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] transform origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden">
                  
                  {/* Top Banner Area */}
                  <div className="bg-gradient-to-r from-[#e8f0fe] to-[#f8f9fa] p-5 pb-6 text-center border-b border-[#dadce0] relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#1a73e8]"></div>
                    <img 
                      src={user.photoURL || "/avatar.png"} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-4 border-white shadow-sm mx-auto mb-3 object-cover bg-white" 
                    />
                    <p className="text-[#202124] font-medium text-lg leading-tight truncate px-2">
                      {user.displayName || "Arcade Admin"}
                    </p>
                    <p className="text-sm text-[#5f6368] truncate px-2 mt-0.5">
                      {user.email}
                    </p>
                    
                    {/* Tiny Status Badge */}
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] border border-[#ceead6] rounded-full">
                       <span className="w-1.5 h-1.5 bg-[#34a853] rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-bold text-[#137333] uppercase tracking-wider">Authorized</span>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-2 bg-white">
                    <button 
                      onClick={logout} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-[#d93025] hover:bg-[#fce8e6] hover:text-[#c5221f] rounded-lg transition-colors font-medium group"
                    >
                      <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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