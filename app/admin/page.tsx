"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar"; // 👈 IMPORTED NAVBAR

export default function AdminPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // ✅ Success Message State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Function
  const loginWithGoogle = async () => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 📨 LOGIN SUCCESS API CALL
      await fetch("/api/send-login-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          userAgent: navigator.userAgent,
        }),
      });

      // ✅ SHOW SUCCESS MESSAGE BEFORE REDIRECT
      setSuccessMessage("Login Successful! Redirecting...");
      
      // 2 Second delay taaki user message padh sake
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again with an authorized account.");
    }
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccessMessage("Logged out successfully");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    // 👇 'pt-24' Add kiya taaki content Navbar ke piche na chhipe
    <div className="min-h-screen flex flex-col bg-[#F0F2F5] font-sans text-[#202124] relative pt-24">
      
      {/* 1️⃣ REAL NAVBAR ADDED */}
      <Navbar />

      {/* ===== CENTERED LOGIN CARD ===== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 mb-10">
        
        <div className="w-full max-w-[450px] bg-white rounded-2xl border border-[#dadce0] p-10 shadow-lg transition-all hover:shadow-xl">
          
          <div className="text-center mb-10">
            {/* Google Logo */}
            <div className="flex justify-center mb-6">
               <svg className="w-12 h-12" viewBox="0 0 48 48">
                 <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                 <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                 <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                 <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                 <path fill="none" d="M0 0h48v48H0z"></path>
               </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-[#202124] mb-2 tracking-tight">
              Admin Console
            </h1>
            <p className="text-gray-500">
              Secure login for Arcade Nexus Administrators
            </p>
          </div>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 text-sm text-[#d93025] bg-red-50 p-3 rounded-lg border border-red-100">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
               </svg>
               <span>{errorMessage}</span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="space-y-6">
            <button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full px-6 py-3.5 text-sm font-semibold text-[#3c4043] hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="G"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            
            <div className="pt-4 text-center border-t border-gray-100">
               <a href="https://go.cloudskillsboost.google/arcade" target="_blank" className="text-xs font-medium text-[#1a73e8] hover:underline flex items-center justify-center gap-1">
                 What is Google Cloud Arcade?
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
               </a>
            </div>
          </div>
        </div>

      </main>

      {/* 3️⃣ PROFESSIONAL FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
           
           {/* Left: Copyright */}
           <div className="text-sm text-gray-500">
             &copy; 2026 <strong>Arcade Nexus</strong>. All rights reserved.
           </div>

           {/* Right: Navigation Links */}
           <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
             <button onClick={() => router.push("/calculator")} className="hover:text-[#1a73e8] transition-colors">Calculator</button>
             <button onClick={() => router.push("/dashboard")} className="hover:text-[#1a73e8] transition-colors">Dashboard</button>
             <button onClick={() => router.push("/leaderboard")} className="hover:text-[#1a73e8] transition-colors">Leaderboard</button>
             <button onClick={handleLogout} className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full transition-colors">
               Logout
             </button>
           </div>
        </div>
      </footer>

      {/* ✅ SUCCESS TOAST NOTIFICATION */}
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#323232] text-white px-6 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 min-w-[320px] justify-between border border-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-gray-400 hover:text-white transition-colors">
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