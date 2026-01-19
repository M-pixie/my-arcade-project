"use client";

import Navbar from "@/app/components/Navbar";
import VisitCounter from "@/app/components/VisitCounter"; // 👈 Import kiya
import { useRouter } from "next/navigation";
import FAQ from "@/app/components/FAQ";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-900 overflow-hidden selection:bg-blue-500 selection:text-white">
        
        {/* BACKGROUND GLOW EFFECTS */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px]" />
        </div>

        {/* ================= HERO ================= */}
        <section className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-32">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply"></div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative">
            
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-sm font-medium text-blue-700 tracking-wide">
                Arcade Nexus
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-blue-600 mb-6 leading-[1.1]">
              Track & Analyze Your <br />
              Arcade Progress
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              The professional dashboard to calculate your Google Cloud Arcade
              points, monitor leaderboard rankings & track your growth in real-time.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
              <button
                onClick={() => router.push("/calculator")}
                className="group relative px-8 py-4 bg-blue-600 rounded-xl font-semibold text-white shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                Open Calculator
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-300"
              >
                View Dashboard
              </button>
            </div>

            <p className="mt-12 text-sm text-slate-500 font-medium tracking-wide uppercase">
              Trusted by thousands of cloud enthusiasts
            </p>
          </div>
        </section>

        {/* ================= HOW TO GET STARTED ================= */}
        <section className="relative z-10 py-24 bg-slate-50/80 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
              How to Start Your <span className="text-blue-600">Journey</span>?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { link: "https://share.google/mn0xUfmd49TA9RPc1", num: "01", title: "Create Account", desc: "Sign up on Cloud Skills Boost and set up your Arcade profile." },
                { link: "https://share.google/45EC3J4RjWLzgbkGy", num: "02", title: "Subscribe", desc: "Enroll in Arcade to unlock labs, points and challenges." },
                { link: "https://share.google/Ojw8FgQpGhPI1sXyt", num: "03", title: "Start Labs", desc: "Complete labs, earn points & Get Google Cloud rewards." },
                { link: "https://share.google/JRMVQ9xd8tTwx8Mol", num: "04", title: "Facilitator Program", desc: "Join the program & Win Exclusive Points & rewards." },
              ].map((step, idx) => (
                <a
                  key={idx}
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600">
                    {step.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="relative z-10 py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-16">
              Everything you need to Win Arcade
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Accurate Calculator", icon: "🎯", desc: "Get reliable Arcade point calculation directly from your profile URL.", link: "/calculator" },
                { title: "Smart Dashboard", icon: "📊", desc: "View total points, recent activity, rank and history cleanly.", link: "/dashboard" },
                { title: "Live Leaderboard", icon: "🏆", desc: "Compete with others and track your position in real-time.", link: "/leaderboard" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(feature.link)}
                  className="group cursor-pointer p-8 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300"
                >
                  <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="relative z-10 py-28 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-16">How it works?</h2>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent z-0"></div>

              <div className="relative z-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-md hover:translate-y-[-5px] transition-transform">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-8 h-8" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.85-6.85C35.9 1.84 30.3 0 24 0 14.64 0 6.51 5.38 2.56 13.22l7.98 6.19C12.4 13.4 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.67-.15-3.27-.43-4.82H24v9.13h12.4c-.53 2.86-2.13 5.29-4.53 6.92l7.01 5.45C43.5 36.6 46.1 31.1 46.1 24.5z" />
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.43-.76-2.95-.76-4.59s.28-3.16.76-4.59l-7.98-6.19C.92 16.36 0 20.04 0 24c0 3.96.92 7.64 2.56 10.78l7.98-6.19z" />
                    <path fill="#34A853" d="M24 48c6.3 0 11.6-2.08 15.47-5.67l-7.01-5.45c-1.95 1.31-4.45 2.08-8.46 2.08-6.26 0-11.6-3.9-13.46-9.26l-7.98 6.19C6.51 42.62 14.64 48 24 48z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Login with Google</h3>
                <p className="mt-3 text-sm text-slate-500">Securely sign in using your Google account to access.</p>
              </div>

              <div className="relative z-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-md hover:translate-y-[-5px] transition-transform">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-md text-2xl">
                  📎
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Paste URL</h3>
                <p className="mt-3 text-sm text-slate-500">Add your Google Cloud Arcade profile link to calculate.</p>
              </div>

              <div className="relative z-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-md hover:translate-y-[-5px] transition-transform">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-md text-2xl">
                  🏆
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Get Points</h3>
                <p className="mt-3 text-sm text-slate-500">Instantly view total points, history & leaderboard rank.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BASE POINTS SYSTEM ================= */}
        <section className="relative z-10 py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Arcade Points System</h2>
              <p className="text-slate-500 mt-2">How your effort translates to score</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 rounded-full bg-green-500 shadow-sm"></div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">Levelled Game</h4>
                    <p className="text-sm text-slate-500">Monthly Levels Games</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-semibold">1 Point Each</div>
              </div>
              
              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 rounded-full bg-yellow-500 shadow-sm"></div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">Trivia Badge</h4>
                    <p className="text-sm text-slate-500">Week 1 to 4 Trivia Badges</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-sm font-semibold">1 Point Each</div>
              </div>

              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 rounded-full bg-purple-500 shadow-sm"></div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">Skill Badges</h4>
                    <p className="text-sm text-slate-500">90+ Skills Badges available</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-sm font-semibold">x2 = 1 Point</div>
              </div>

              <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-pink-50 to-white border border-pink-200">
                <div className="absolute top-0 left-0 w-full h-full bg-pink-100/30 animate-pulse"></div>
                <div className="relative flex items-center gap-4 z-10">
                  <div className="w-2 h-12 rounded-full bg-pink-500 shadow-sm"></div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">Special Badges</h4>
                    <p className="text-sm text-slate-600">Limited-time exclusive Points</p>
                  </div>
                </div>
                <div className="relative z-10 px-4 py-1.5 rounded-full bg-pink-500 text-white shadow-md text-sm font-bold">2 Points</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA (COUNTER ADDED) ================= */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 z-0"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Ready to level up your Arcade Points?
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              Calculate & Analyze Your Arcade Points instantly.
            </p>
            <button
              onClick={() => router.push("/calculator")}
              className="px-10 py-4 bg-white text-blue-900 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Calculate Your Points
            </button>
            
            {/* 👇 YAHAN LAGA DIYA HAI VISIT COUNTER */}
            <div className="mt-8 flex justify-center">
               <VisitCounter />
            </div>

          </div>
        </section>

        <FAQ />




        {/* ================= PREMIUM FOOTER ================= */}
<footer className="relative z-10 bg-[#0B1120] border-t border-slate-800 pt-20 pb-10 overflow-hidden">
  
  {/* Background Glow Effect */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
      
      {/* BRAND COLUMN */}
      <div className="lg:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            A
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Arcade Nexus
          </span>
        </div>
        <p className="text-slate-400 text-sm leading-7 mb-6 max-w-sm">
          This platform is independently designed and developed to help users track, 
          analyze, and improve their Google Cloud Arcade progress efficiently.
        </p>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> This website is an independent, community-built tool and is not 
            an official website of Google Cloud Arcade or Google. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>

      {/* LINKS: Platform */}
      <div className="lg:col-span-1">
        <h4 className="text-white font-semibold mb-6 tracking-wide">Platform</h4>
        <ul className="space-y-4">
          <li 
            onClick={() => router.push("/calculator")}
            className="text-slate-400 text-sm hover:text-blue-400 hover:translate-x-1 cursor-pointer transition-all duration-300"
          >
            Calculator
          </li>
          <li 
            onClick={() => router.push("/dashboard")}
            className="text-slate-400 text-sm hover:text-blue-400 hover:translate-x-1 cursor-pointer transition-all duration-300"
          >
            Dashboard
          </li>
          <li 
            onClick={() => router.push("/leaderboard")}
            className="text-slate-400 text-sm hover:text-blue-400 hover:translate-x-1 cursor-pointer transition-all duration-300"
          >
            Leaderboard
          </li>
        </ul>
      </div>

      {/* LINKS: Program */}
      <div className="lg:col-span-1">
        <h4 className="text-white font-semibold mb-6 tracking-wide">Resources</h4>
        <ul className="space-y-4">
          <li>
            <a 
              href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 text-sm hover:text-blue-400 hover:translate-x-1 cursor-pointer transition-all duration-300 block"
            >
              Enrollment
            </a>
          </li>
          <li>
            <a 
              href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 text-sm hover:text-blue-400 hover:translate-x-1 cursor-pointer transition-all duration-300 block"
            >
              Points System
            </a>
          </li>
          <li>
            <a 
              href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 text-sm hover:text-blue-400 hover:translate-x-1 cursor-pointer transition-all duration-300 block"
            >
              Syllabus
            </a>
          </li>
        </ul>
      </div>

      {/* STAY UPDATED */}
      <div className="lg:col-span-2">
        <h4 className="text-white font-semibold mb-6 tracking-wide">Stay Connected</h4>
        <p className="text-sm text-slate-400 mb-6">
          Join our community for the latest Arcade updates, hints, and support.
        </p>
        
        <a 
          href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20 group"
        >
          <span>Join WhatsApp Community</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>

    {/* DIVIDER */}
    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

    {/* BOTTOM BAR */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-slate-500 text-sm font-medium text-center md:text-left">
        <p>© {new Date().getFullYear()} Arcade Nexus. All rights reserved.</p>
        <p className="mt-1 text-slate-600">
          Powered by : <span className="text-slate-400">Manish Kumar</span>
        </p>
      </div>

      {/* SOCIAL ICONS (Modern Circles) */}
      <div className="flex items-center gap-4">
        
        {/* GitHub */}
        <a href="https://github.com/M-pixie" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group hover:bg-white hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 fill-slate-400 group-hover:fill-slate-900" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>

        {/* LinkedIn */}
        <a href="https://linkedin.com/in/manish-ui" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group hover:bg-[#0077b5] hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 fill-slate-400 group-hover:fill-white" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a href="https://instagram.com/urpixie7" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 fill-slate-400 group-hover:fill-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

        {/* WhatsApp */}
        <a href="https://wa.me/8538980608" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group hover:bg-[#25D366] hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 fill-slate-400 group-hover:fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.888.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.978zm11.374-5.483c-.28-.14-1.658-.817-1.914-.91-.256-.093-.442-.14-.628.14-.186.28-.721.91-.884 1.097-.163.187-.326.21-.605.07-.28-.14-1.182-.436-2.251-1.389-.828-.737-1.387-1.647-1.549-1.926-.163-.28-.017-.432.123-.571.127-.127.28-.327.419-.49.14-.163.186-.28.28-.465.093-.187.047-.35-.023-.49-.07-.14-.628-1.516-.86-2.073-.226-.543-.456-.468-.628-.477-.164-.009-.35-.011-.536-.011-.186 0-.488.07-.743.345-.256.275-.976.953-.976 2.324 0 1.372.999 2.698 1.139 2.883.14.186 1.966 3.001 4.761 4.208.665.287 1.185.459 1.587.587.671.213 1.282.183 1.767.11.542-.081 1.658-.677 1.892-1.33.232-.653.232-1.213.163-1.33-.07-.117-.256-.187-.536-.327z"/>
          </svg>
        </a>

      </div>
    </div>
  </div>
</footer>