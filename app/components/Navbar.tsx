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
    { name: "Home", href: "/", tooltip: "Go to Homepage" },
    { name: "Calculator", href: "/calculator", tooltip: "Calculate your points" },
    { name: "Dashboard", href: "/dashboard", tooltip: "Your dashboard" },
    { name: "Leaderboard", href: "/leaderboard", tooltip: "Check top rankings" },
    { name: "Skill Badges", href: "/resources", tooltip: "All Skill Badges" },
    { name: "Facilitator", href: "/facilitator", tooltip: "Facilitator program info" },
    { name: "Swags Post", href: "/post", tooltip: "See User Swags Post" },
    { name: "About Arcade", href: "/about", tooltip: "Explore About Arcade" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-[#dadce0] z-50">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* ================= LEFT: LOGO, TOGGLE TEXT & BACK ================= */}
        <div className="flex items-center gap-4">
          {pathname !== "/" && (
            <div className="relative group">
              <button
                onClick={() => router.back()}
                className="w-10 h-8 flex items-center justify-center rounded-sm text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] transition-all duration-200 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              </button>
            </div>
          )}
          
          <Link href="/" className="flex items-center gap-2 group">
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
                <Link href={link.href} className={`block px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 border ${isActive ? "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]" : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa] border-transparent"}`}>
                  {link.name}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* ================= RIGHT: AVATAR & MOBILE TOGGLE ================= */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden hover:scale-105 transition-transform shrink-0" title="Go to Dashboard">
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
              
              // 🔥 FIX: Comment yahan upar shift kar diya, error solve!
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-sm text-base font-medium transition-colors border ${
                    isActive 
                      ? "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]" 
                      : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa] border-transparent"
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