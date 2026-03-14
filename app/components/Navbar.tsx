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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Calculator", href: "/calculator" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Admin", href: "/admin" },
    { name: "Facilitator", href: "/facilitator" },
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
    router.push("/admin");
  };

  // 🚨 YAHAN SE 'if (!user) return null;' HATA DIYA HAI TAAKI NAVBAR HAMESHA DIKHE!

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* ================= LEFT: LOGO & BACK ================= */}
        <div className="flex items-center gap-4">
          
          {pathname !== "/" && (
             <button
             onClick={() => router.back()}
             className="w-8 h-8 flex items-center justify-center rounded-full 
                        text-gray-500 hover:text-gray-900 hover:bg-gray-100 
                        transition-all duration-200"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
             </svg>
           </button>
          )}

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="hidden sm:block text-lg font-bold text-gray-800 tracking-tight group-hover:text-black transition-colors">
              Arcade Nexus
            </span>
          </Link>
        </div>

        {/* ================= CENTER: NAVIGATION (DESKTOP) ================= */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                  ${isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {link.name}
              </Link>
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
                className={`flex items-center justify-center p-0.5 rounded-full transition-all duration-200 ${dropdownOpen ? 'ring-2 ring-blue-500/30 bg-gray-50' : 'hover:bg-gray-100'}`}
              >
                <img
                  src={user.photoURL || "/avatar.png"}
                  alt="User"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-gray-200"
                />
              </button>

              {/* Dropdown Menu (White Theme) */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5 overflow-hidden">
                  <div className="p-5 flex flex-col items-center text-center border-b border-gray-100 bg-gray-50/50">
                     <img src={user.photoURL || "/avatar.png"} className="w-16 h-16 rounded-full border-2 border-white shadow-sm mb-3" />
                     <p className="text-gray-900 font-semibold">{user.displayName || "Admin User"}</p>
                     <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU (White Theme) ================= */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-gray-200 animate-in slide-in-from-top-5 duration-200 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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