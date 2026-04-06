"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function AdminPage() {
  const router = useRouter();

  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Message States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ LISTEN FOR AUTH STATE CHANGES
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ OPTIMIZED SUPERFAST LOGIN FUNCTION
  const loginWithGoogle = async () => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // 📨 LOGIN SUCCESS API CALL (Background me chalega, user wait nahi karega)
      fetch("/api/send-login-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedInUser.email,
          userAgent: navigator.userAgent,
        }),
      }).catch(err => console.error("Mail send error:", err));

      setSuccessMessage("Login Successful! Redirecting...");
      
      // 🔥 Redirect speed fast kar di (2000ms se hata kar 500ms)
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again with an authorized account.");
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccessMessage("Logged out successfully!");
      // Halka delay taaki message dikhe
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Logout error", error);
      setErrorMessage("Failed to log out. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-[#202124]">
      
      {/* 🔥 NEW REAL 3D LOCK ANIMATION STYLES 🔥 */}
      <style>{`
        @keyframes real-lock-float {
          0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0px 8px 12px rgba(26, 115, 232, 0.3)); }
          50% { transform: translateY(-10px) scale(1.05); filter: drop-shadow(0px 18px 24px rgba(26, 115, 232, 0.5)); }
        }
        .animate-real-lock {
          animation: real-lock-float 3s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        .animate-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* 1️⃣ REAL NAVBAR ADDED */}
      <Navbar />

      {/* 2️⃣ EKDUM TOP NAVIGATION BAR */}
      <div className="w-full bg-white border-b border-[#dadce0] py-3 px-6 shadow-sm z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#5f6368]">
             <button onClick={() => router.push("/")} className="hover:text-[#1a73e8] hover:underline transition-colors focus:outline-none">Home</button>
             <button onClick={() => router.push("/calculator")} className="hover:text-[#1a73e8] hover:underline transition-colors focus:outline-none">Calculator</button>
             <button onClick={() => router.push("/dashboard")} className="hover:text-[#1a73e8] hover:underline transition-colors focus:outline-none">Dashboard</button>
             <button onClick={() => router.push("/leaderboard")} className="hover:text-[#1a73e8] hover:underline transition-colors focus:outline-none">Leaderboard</button>
          </div>

          {/* DYNAMIC LOGOUT BUTTON IN NAVBAR */}
          {!loadingAuth && user && (
            <button 
               onClick={handleLogout} 
               className="text-[#d93025] border border-[#d93025] hover:bg-[#fce8e6] px-4 py-1.5 rounded-sm transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-200"
            >
               Logout
            </button>
          )}
        </div>
      </div>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        
        {/* === LOGIN / WELCOME CARD === */}
        <div className="w-full max-w-[450px] bg-white rounded-sm border border-[#dadce0] p-10 shadow-sm mb-12">
          
          <div className="text-center mb-10">
            
            {/* 🔥 ASLI 3D TALA (REAL LOCK) 🔥 */}
            <div className="relative flex justify-center items-center mb-8 h-28">
              {/* Background Blue Glow */}
              <div className="absolute w-20 h-20 bg-[#1a73e8] rounded-full blur-2xl animate-glow z-0"></div>
              
              {/* Real 3D Lock Image */}
              <div className="relative z-10 w-28 h-28 animate-real-lock">
                <img 
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png" 
                  alt="Secure Lock" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-normal text-[#202124] mb-2 tracking-tight mt-4">
              Sign in Arcade
            </h1>
            <p className="text-[#5f6368] text-sm">
              Secure access for Arcade Nexus Administrators
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 text-sm text-[#d93025] bg-[#fce8e6] p-4 rounded-sm border border-[#fad2cf]">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
               </svg>
               <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-6">
            {loadingAuth ? (
              <div className="flex justify-center py-4">
                 <div className="w-6 h-6 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              // CENTERED DASHBOARD & LOGOUT BUTTONS
              <div className="text-center space-y-3">
                <div className="px-4 py-3 mb-4 bg-[#e8f0fe] text-[#1a73e8] text-sm font-medium rounded-sm border border-[#d2e3fc]">
                  Logged in as <br/><span className="font-bold text-[#1557b0]">{user.email}</span>
                </div>
                
                {/* Go to Dashboard Button */}
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-sm px-6 py-3.5 text-sm font-medium transition-colors focus:outline-none shadow-sm"
                >
                  Go to Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>

                {/* BIG LOGOUT BUTTON INSIDE CARD */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-white text-[#d93025] border border-[#dadce0] hover:bg-[#fce8e6] hover:border-[#fad2cf] rounded-sm px-6 py-3.5 text-sm font-medium transition-colors focus:outline-none"
                >
                  Logout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                </button>
              </div>
            ) : (
              // If User is NOT logged in
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#dadce0] rounded-sm px-6 py-3.5 text-sm font-medium text-[#3c4043] hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-colors focus:outline-none shadow-sm"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="G"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            )}
            
            <div className="pt-6 text-center border-t border-[#dadce0]">
               <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1a73e8] hover:underline flex items-center justify-center gap-1">
                 What is Google Cloud Arcade?
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
               </a>
            </div>
          </div>
        </div>

        {/* === HOW IT WORKS SECTION === */}
        <div className="w-full max-w-4xl mt-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-normal text-[#202124] tracking-tight">How the Admin Console Works</h2>
            <div className="w-12 h-1 bg-[#1a73e8] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-[#dadce0] rounded-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center rounded-full mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h3 className="text-base font-medium text-[#202124] mb-2">Secure Authentication</h3>
              <p className="text-sm text-[#5f6368] leading-relaxed">
                Login securely using your authorized Google Workspace or Gmail account. Multi-factor authentication is supported through Google's robust security infrastructure.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#dadce0] rounded-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#fef7e0] text-[#fbbc04] flex items-center justify-center rounded-full mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 className="text-base font-medium text-[#202124] mb-2">Access Control</h3>
              <p className="text-sm text-[#5f6368] leading-relaxed">
                Upon successful login, your email is verified against our database. Only authorized facilitators and admins are granted access to the internal dashboard.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#dadce0] rounded-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#e6f4ea] text-[#34a853] flex items-center justify-center rounded-full mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="text-base font-medium text-[#202124] mb-2">Session Management</h3>
              <p className="text-sm text-[#5f6368] leading-relaxed">
                Your session is safely maintained. You will be automatically redirected to the dashboard if you return. Always use the logout button when finishing your tasks.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* ✅ SUCCESS TOAST NOTIFICATION */}
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#323232] text-[#f1f3f4] px-6 py-3.5 rounded-sm shadow-md flex items-center gap-3 min-w-[320px] justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#81c995]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-sm font-normal">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-[#9aa0a6] hover:text-white transition-colors focus:outline-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}