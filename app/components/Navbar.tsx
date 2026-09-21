"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const router = useRouter();
  const pathname = usePathname();

  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>("/avatar.png"); 
  const [imageError, setImageError] = useState(false);
  
  // Naya State: Naye swags count karne ke liye
  const [unreadSwags, setUnreadSwags] = useState(0);

  // Naya Logic: Swag Drops track karne ke liye
  useEffect(() => {
    // Database me swag_drops collection ko sun rahe hain
    const unsub = onSnapshot(collection(db, "swag_drops"), 
      (snapshot) => {
        const totalSwags = snapshot.size; // Total swags kitne hain
        
        // Agar user pehle se Swags Drop page par hai (/post)
        if (pathname === "/post") {
          localStorage.setItem("arcade_last_seen_swags", totalSwags.toString());
          setUnreadSwags(0);
        } else {
          // Agar user kisi aur page par hai
          if (!localStorage.getItem("arcade_last_seen_swags")) {
            localStorage.setItem("arcade_last_seen_swags", totalSwags.toString());
            setUnreadSwags(0);
          } else {
            const lastSeen = parseInt(localStorage.getItem("arcade_last_seen_swags") || "0");
            const unread = totalSwags - lastSeen;
            setUnreadSwags(unread > 0 ? unread : 0);
          }
        }
      },
      (error) => {
        console.warn("Notification badge disabled: Firebase permission denied. Please update Firestore Rules.");
      }
    );

    return () => unsub();
  }, [pathname]);

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
    if (pathname !== "/") {
      router.back();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/"  },
    { name: "Calculator", href: "/calculator" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Skill Badges", href: "/resources" },
    { name: "Facilitator", href: "/facilitator" },
    { name: "Swags Drop", href: "/post" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/members/google-events" },
    
    { name: "Pixi", href: "/admin-nexus-2026" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-[#f8f9fa] border-b border-[#dadce0] z-50">
      <div className="w-full mx-auto h-full px-4 md:px-8 flex items-center justify-between">

        {/* ================= LEFT: BACK BUTTON & SEARCH BAR ================= */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          <button 
            onClick={handleLogoClick}
            className="p-2 -ml-2 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124] transition-colors cursor-pointer focus:outline-none shrink-0"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          {/* 🔥 SEARCH EVERYTHING INPUT (DESKTOP) 🔥 */}
          <form onSubmit={handleSearch} className="hidden lg:flex relative items-center">
            <svg 
              className="absolute left-3 w-4 h-4 text-[#5f6368]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Search arcade.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-56 lg:w-64 xl:w-80 rounded-full bg-[#f1f3f4] border border-transparent text-sm text-[#202124] placeholder-[#5f6368] focus:bg-white focus:border-[#dadce0] focus:shadow-sm focus:outline-none transition-all duration-300"
            />
          </form>
        </div>

        {/* ================= CENTER: NAVIGATION (DESKTOP) ================= */}
        <nav className="hidden md:flex items-center justify-center gap-1 flex-1 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.name} className="relative group">
                <Link 
                  href={link.href} 
                  prefetch={true}
                  className={`relative block px-3 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? "bg-[#e8f0fe] text-[#1a73e8] font-bold" 
                      : "text-[#5f6368] font-medium hover:bg-[#f1f3f4] hover:text-[#202124]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {/* Yaha Swag Drop ka Notification Badge lagaya hai */}
                    {link.name === "Swags Drop" && unreadSwags > 0 && (
                      <span className="flex items-center justify-center px-[5px] min-w-[18px] h-[18px] bg-[#d93025] text-white text-[10px] font-bold rounded-full animate-pulse">
                        {unreadSwags > 99 ? '99+' : unreadSwags}
                      </span>
                    )}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* ================= RIGHT: AVATAR & MOBILE TOGGLE ================= */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-end">
          <Link href="/dashboard" prefetch={true} className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden hover:scale-105 transition-transform shrink-0 border-2 border-transparent hover:border-[#dadce0]" title="Go to Dashboard">
            <img 
              src={imageError ? "/avatar.png" : currentUserAvatar} 
              alt={currentUserName || "User"} 
              className="w-full h-full object-cover bg-white" 
              onError={() => setImageError(true)} 
            />
          </Link>

          <button 
            className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition" 
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
        <nav className="absolute top-full left-0 w-full md:hidden bg-[#f8f9fa] border-b border-[#dadce0] z-50">
          <div className="px-4 py-4 space-y-2">
            
            <form onSubmit={handleSearch} className="relative flex items-center mb-4">
              <svg 
                className="absolute left-3 w-5 h-5 text-[#5f6368]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                placeholder="Search A to Z..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full rounded-full bg-[#f1f3f4] border border-transparent text-base text-[#202124] placeholder-[#5f6368] focus:bg-white focus:border-[#dadce0] focus:shadow-sm focus:outline-none transition-all duration-300"
              />
            </form>

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ${
                    isActive 
                      ? "bg-[#e8f0fe] text-[#1a73e8] font-bold" 
                      : "text-[#5f6368] font-medium hover:bg-[#f1f3f4] hover:text-[#202124]"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      {link.name}
                      {/* Mobile menu me bhi Notification Badge laga diya */}
                      {link.name === "Swags Drop" && unreadSwags > 0 && (
                        <span className="flex items-center justify-center px-[5px] min-w-[18px] h-[18px] bg-[#d93025] text-white text-[10px] font-bold rounded-full animate-pulse">
                          {unreadSwags > 99 ? '99+' : unreadSwags}
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}