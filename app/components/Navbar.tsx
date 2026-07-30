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

  const handleLogoClick = () => {
    // Agar home page pe nahi hain, toh pichle page par back kar do
    if (pathname !== "/") {
      router.back();
    }
  };

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
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-[#dadce0] z-50">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* ================= LEFT: LOGO (NOW ACTS AS BACK BUTTON) ================= */}
        <div className="flex items-center">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="hidden sm:block text-left">
              {/* Only shows Name if exists, otherwise Arcade Nexus. Bold & No Truncate */}
              <span className="text-lg font-bold text-[#202124] tracking-tight transition-all duration-300">
                {currentUserName ? currentUserName : "Arcade Nexus"}
              </span>
            </div>
          </button>
        </div>

        {/* ================= CENTER: NAVIGATION (DESKTOP) ================= */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.name} className="relative group">
                {/* 🔥 Premium Solid Blue Active State 🔥 */}
                <Link 
                  href={link.href} 
                  prefetch={true}
                  className={`block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-[#1a73e8] text-white shadow-sm" 
                      : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124] bg-transparent"
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

          <button className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                  className={`block px-4 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-[#1a73e8] text-white shadow-sm" 
                      : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124] bg-transparent"
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