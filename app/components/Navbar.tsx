"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>("/avatar.png"); 
  const [showUserName, setShowUserName] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🔥 MAGIC REFRESH FUNCTION 🔥
  const refreshUserData = () => {
    try {
      const savedData = localStorage.getItem("arcade_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.userName) setCurrentUserName(parsed.userName);
        
        const newAvatar = parsed.userAvatar || parsed.photoURL;
        if (newAvatar) {
          setCurrentUserAvatar(newAvatar);
          setImageError(false); 
        }
      }
    } catch (e) {
      console.error("Error reading user data", e);
    }
  };

  useEffect(() => {
    refreshUserData();
    window.addEventListener("arcadeDataUpdated", refreshUserData);
    window.addEventListener("storage", refreshUserData);

    return () => {
      window.removeEventListener("arcadeDataUpdated", refreshUserData);
      window.removeEventListener("storage", refreshUserData);
    };
  }, []);

  useEffect(() => {
    if (!currentUserName) return;
    const interval = setInterval(() => {
      setShowUserName((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUserName]);

  const navLinks = [
    { name: "Home", href: "/"  },
    { name: "Calculator", href: "/calculator" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Skill Badges", href: "/resources" },
    { name: "Facilitator", href: "/facilitator" },
    { name: "Swags Post", href: "/post" },
    { name: "About", href: "/about" },
    { name: "Help", href: "/chat" },
    { name: "Admin", href: "/admin-nexus-2026" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-[#dadce0] z-50">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* ================= LEFT: LOGO, TOGGLE TEXT & BACK ================= */}
        <div className="flex items-center">
          
          {/* 🔥 FIX: Back button ab achanak se jhatka nahi dega, smoothly width slide hogi 🔥 */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center ${
              pathname !== "/" ? "w-10 opacity-100 mr-4" : "w-0 opacity-0 mr-0 pointer-events-none"
            }`}
          >
            <button
              onClick={() => router.back()}
              className="w-10 h-8 flex items-center justify-center rounded-sm text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] transition-all duration-200 focus:outline-none shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            </button>
          </div>
          
          <Link href="/" prefetch={true} className="flex items-center gap-2 group">
            <div className="hidden sm:grid [grid-template-areas:'stack'] items-center">
              <span className={`[grid-area:stack] text-lg font-bold text-[#202124] tracking-tight transition-opacity duration-700 ease-in-out truncate max-w-[150px] ${showUserName && currentUserName ? 'opacity-0' : 'opacity-100'}`}>
                Arcade Nexus
              </span>
              {currentUserName && (
                <span className={`[grid-area:stack] text-lg font-bold text-[#202124] tracking-tight transition-opacity duration-700 ease-in-out truncate max-w-[150px] ${showUserName ? 'opacity-100' : 'opacity-0'}`}>
                  {currentUserName}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* ================= CENTER: NAVIGATION (DESKTOP) ================= */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.name} className="relative group">
                {/* 🔥 Premium Outline/Curve Styling (Colorless Background) 🔥 */}
                <Link 
                  href={link.href} 
                  prefetch={true}
                  className={`block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    isActive 
                      ? "border-[#1a73e8] text-[#1a73e8] bg-transparent" 
                      : "border-transparent text-[#5f6368] hover:border-[#dadce0] hover:text-[#202124] bg-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* ================= RIGHT: AVATAR & MOBILE TOGGLE ================= */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" prefetch={true} className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden hover:scale-105 transition-transform shrink-0" title="Go to Dashboard">
            <img 
              src={imageError ? "/avatar.png" : currentUserAvatar} 
              alt={currentUserName || "User"} 
              className="w-full h-full object-cover" 
              style={{ border: "none" }} 
              onError={() => setImageError(true)} 
            />
          </Link>

          <button className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa] rounded-sm transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full md:hidden bg-white border-b border-[#dadce0] shadow-lg z-50">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-full text-base font-medium transition-all duration-300 border ${
                    isActive 
                      ? "border-[#1a73e8] text-[#1a73e8] bg-transparent" 
                      : "border-transparent text-[#5f6368] hover:border-[#dadce0] hover:text-[#202124] bg-transparent"
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