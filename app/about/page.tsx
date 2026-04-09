import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans selection:bg-indigo-600 selection:text-white pb-24 relative overflow-hidden">
      
      {/* Background Subtle Mesh/Dot Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <main className="pt-28 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* ================= 1. HERO SECTION (DARK PREMIUM CARD) ================= */}
        <section>
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl font-bold text-[#111] tracking-tight mb-4">
              Arcade <span className="text-indigo-600">Nexus</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-xl mx-auto">
              The ultimate community toolkit for Google Cloud enthusiasts.
            </p>
          </div>

          {/* MASSIVE DARK PINK/PURPLE BENTO CARD */}
          <div className="relative bg-gradient-to-br from-[#3b0731] to-[#1f031a] rounded-3xl p-1 border border-[#6e1e5b] shadow-[0_20px_40px_rgba(219,39,119,0.15)] overflow-hidden group hover:border-[#9d2b82] transition-colors duration-500 elevation-hero">
            
            {/* Dark Pink Ambient inner glow */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-[#db2777]/30 blur-[120px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[#ec4899]/40"></div>
            
            {/* Inner div with matching smaller curve */}
            <div className="bg-[#280421]/90 backdrop-blur-md rounded-2xl p-8 md:p-14 relative z-10 border border-white/5 transition-colors duration-300 group-hover:bg-[#310629]">
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                
                <div>
                  <p className="text-[#f472b6] font-bold tracking-widest text-xs uppercase mb-3">About Arcade Program</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    Master Cloud Skills. <span className="text-[#f472b6] marker-swags">Earn Swags.</span>
                  </h2>
                  <p className="text-[#fbcfe8] opacity-80 text-lg leading-relaxed mb-8 max-w-3xl">
                    Join an always-on, no-cost gaming campaign where technical practitioners of all levels learn computing, application development, big data & AI/ML. Earn digital badges and convert them into official Google Cloud goodies.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#6e1e5b] separator-pink">
                    <div className="bg-[#3b0a31] p-5 rounded-xl border border-[#6e1e5b] transition-colors group-hover:bg-[#4a0d3e] group-hover:shadow-[0_4px_12px_rgba(219,39,119,0.2)] hover:-translate-y-0.5">
                      <h3 className="text-white font-bold text-lg mb-2">1. Digital Badges</h3>
                      <p className="text-[#fbcfe8] opacity-70 text-sm">Showcase Google Cloud-hosted badges on your LinkedIn & resume.</p>
                    </div>
                    <div className="bg-[#3b0a31] p-5 rounded-xl border border-[#6e1e5b] transition-colors group-hover:bg-[#4a0d3e] group-hover:shadow-[0_4px_12px_rgba(219,39,119,0.2)] hover:-translate-y-0.5">
                      <h3 className="text-white font-bold text-lg mb-2">2. Hands-on XP</h3>
                      <p className="text-[#fbcfe8] opacity-70 text-sm">Move beyond theory. Practice in real-world cloud environments.</p>
                    </div>
                    <div className="bg-[#3b0a31] p-5 rounded-xl border border-[#6e1e5b] transition-colors group-hover:bg-[#4a0d3e] group-hover:shadow-[0_4px_12px_rgba(219,39,119,0.2)] hover:-translate-y-0.5">
                      <h3 className="text-white font-bold text-lg mb-2">3. Claim Prizes</h3>
                      <p className="text-[#fbcfe8] opacity-70 text-sm">Earn Arcade points for every skill badge and claim official merchandise.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ================= 2. FEATURES GRID (3 IN A ROW - COLORFUL RECTANGULAR CARDS) ================= */}
        <section>
          <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111] tracking-tight flex items-center gap-3">
               <span className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shadow-inner text-slate-600">🧰</span>
               Open Platform Features
            </h2>
            <div className="h-px bg-slate-300 flex-1 ml-6 hidden md:block border-slate-300"></div>
          </div>

          {/* 🔥 CHANGED TO grid-cols-3 🔥 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Calculate Points", desc: "Real-time points calculation.", link: "/calculator", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", shadow: "hover:shadow-[0_6px_20px_rgba(59,130,246,0.15)]" },
              { title: "Live Leaderboard", desc: "Track community rankings.", link: "/leaderboard", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", shadow: "hover:shadow-[0_6px_20px_rgba(245,158,11,0.15)]" },
              { title: "User Dashboard", desc: "Manage tier progression.", link: "/dashboard", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", shadow: "hover:shadow-[0_6px_20px_rgba(16,185,129,0.15)]" },
              { title: "Google Sign-In", desc: "Secure OAuth login.", link: "/dashboard", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", shadow: "hover:shadow-[0_6px_20px_rgba(225,29,72,0.15)]" },
              { title: "Program Updates", desc: "Latest news & announcements.", link: "/facilitator", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", shadow: "hover:shadow-[0_6px_20px_rgba(168,85,247,0.15)]" },
              { title: "Skill Badges", desc: "Curated active badges.", link: "/resources", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800", shadow: "hover:shadow-[0_6px_20px_rgba(6,182,212,0.15)]" },
              { title: "Smart Chatbot", desc: "24/7 AI automated help.", link: "/ChatBot", bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800", shadow: "hover:shadow-[0_6px_20px_rgba(99,102,241,0.15)]" },
              { title: "Simple FAQs", desc: "Answers to common questions.", link: "/FAQ", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", shadow: "hover:shadow-[0_6px_20px_rgba(249,115,22,0.15)]" }
            ].map((feature, index) => (
              <Link 
                href={feature.link} 
                key={index} 
                className={`group flex flex-col justify-center p-6 rounded-xl border ${feature.bg} ${feature.border} transition-all duration-300 hover:-translate-y-1 ${feature.shadow}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`text-[18px] font-bold ${feature.text} transition-colors`}>
                    {feature.title}
                  </h3>
                  <span className={`${feature.text} opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300 font-bold text-lg`}>
                    →
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>


        {/* ================= 3. WHY PLAY (DISTINCT LIGHT COLOR CARDS) ================= */}
        <section>
          <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
            <div className="h-px bg-slate-300 flex-1 mr-6 hidden md:block border-slate-300"></div>
            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Why Play The Arcade?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto marker-why">
            {[
              { icon: "🎮", title: "Gamified Learning", desc: "Learn complex cloud concepts through engaging game-like structures.", base: "bg-[#fff0f6] border-[#ffdeeb]", iconbox: "from-[#ff85b3] to-[#ff4785]", accent: "text-[#d61e5c]" },
              { icon: "💸", title: "100% No Cost", desc: "Participation is completely free. Just bring your dedication to learn.", base: "bg-[#e6fcf5] border-[#c3fae8]", iconbox: "from-[#63e6be] to-[#20c997]", accent: "text-[#0ca678]" },
              { icon: "🛠️", title: "Hands-on Labs", desc: "Practice in real Google Cloud environments, not just theory.", base: "bg-[#e7f5ff] border-[#d0ebff]", iconbox: "from-[#74c0fc] to-[#339af0]", accent: "text-[#1c7ed6]" },
              { icon: "🎁", title: "Swags & Prizes", desc: "Convert your hard-earned points into official Google Cloud merchandise.", base: "bg-[#fff9db] border-[#fff3bf]", iconbox: "from-[#ffd43b] to-[#fab005]", accent: "text-[#f08c00]" }
            ].map((box, idx) => (
              <div key={idx} className={`${box.base} p-8 rounded-2xl border ${box.border} flex items-center gap-6 group hover:border-slate-400 transition-colors duration-300 shadow-sm elevation-block`}>
                <div className={`w-16 h-16 shrink-0 bg-gradient-to-br ${box.iconbox} rounded-full border border-white/20 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-md marker-icon`}>
                  {box.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${box.accent} mb-1.5 marker-title`}>{box.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed marker-desc">{box.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 4. TIMELINES & RESOURCES (THEMED Wide CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto marker-wide">
          
          {/* How It Works (Indigo Theme) */}
          <section className="bg-[#f0f4ff] p-8 sm:p-10 rounded-[2rem] border border-indigo-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-indigo-200 transition-colors duration-300 elevation-indigo">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-indigo-300/50"></div>
            
            <h2 className="text-2xl font-bold text-indigo-950 mb-10 flex items-center gap-3 relative z-10 marker-title-parent">
              <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg border border-indigo-200 shadow-inner marker-title-icon">⚙️</span> 
              How It Works
            </h2>
            <div className="relative border-l-2 border-indigo-200 ml-5 space-y-10 pb-4 z-10 timeline-indigo">
              {[
                { title: "Sign in with Google", desc: "Create account official Cloud Skills Boost platform using Google ID." },
                { title: "Monthly Challenge", desc: "New monthly games trivia are released. Subscribe never miss a challenge." },
                { title: "Earning Badges", desc: "Complete labs inside games earn digital skill badges Arcade Points." },
                { title: "Level Progression", desc: "Accumulate points climb swag tiers (Standard Advanced Premium). Use calculator track progression." }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-8 group cursor-default">
                  <div className="absolute w-4 h-4 bg-[#f0f4ff] border-2 border-indigo-300 rounded-full -left-[9px] top-1.5 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-all duration-300 shadow-sm z-10 marker-indigo"></div>
                  <h3 className="text-lg font-bold text-indigo-950 group-hover:text-indigo-700 transition-colors marker-wide-title">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-700 leading-relaxed marker-wide-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Official Resources (Teal Theme) */}
          <section className="bg-[#e6fffa] p-8 sm:p-10 rounded-[2rem] border border-teal-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col group hover:border-teal-200 transition-colors duration-300 elevation-teal">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-teal-300/50"></div>
            
            <h2 className="text-2xl font-bold text-teal-950 mb-8 flex items-center gap-3 relative z-10 marker-title-parent">
               <span className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-lg border border-teal-200 shadow-inner marker-title-icon">📚</span> 
               Official Resources
            </h2>
            <div className="space-y-4 relative z-10 flex-1">
              {[
                { title: "The Arcade Platform", desc: "Hub monthly games trivia prize updates.", link: "https://go.cloudskillsboost.google/arcade" },
                { title: "Cloud Skills Boost", desc: "Main portal holding all technical labs.", link: "https://www.cloudskillsboost.google/" },
                { title: "Learning Forum", desc: "Connect with learners and get support.", link: "https://www.googlecloudcommunity.com/" }
              ].map((resource, idx) => (
                <a href={resource.link} target="_blank" rel="noopener noreferrer" key={idx} className="group block bg-white p-5 rounded-xl border border-teal-100 hover:border-teal-300 hover:bg-teal-50/50 transition-all duration-300 shadow-sm">
                  <div className="flex justify-between items-center marker-resource-item">
                    <div>
                      <h3 className="text-base font-bold text-teal-950 group-hover:text-teal-700 transition-colors marker-wide-title">
                        {resource.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-700 leading-relaxed marker-wide-desc">{resource.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 group-hover:bg-teal-500 group-hover:border-teal-400 group-hover:text-white transition-colors shadow-inner marker-resource-icon">
                      ↗
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ================= 5. CONNECT & LEGAL (FOOTER BENTO) ================= */}
        <div className="max-w-6xl mx-auto pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 marker-footer">
            
            {/* Contact Cards with Colorful Accents */}
            <div className="md:col-span-1 flex flex-col gap-4 marker-contact-parent">
               <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm group hover:border-rose-200 transition-colors relative overflow-hidden marker-contact-card">
                  <div className="absolute inset-0 bg-rose-100 blur-[50px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-rose-200/50"></div>
                 <h2 className="text-xl font-bold text-[#111] mb-6 relative z-10 marker-contact-header">Reach Out</h2>
                 
                 <div className="relative z-10 space-y-3 marker-contact-links">
                   <a href="https://wa.me/8538980608" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl hover:border-[#25D366] group/link transition-all backdrop-blur-sm">
                     <div className="text-[#25D366] bg-white p-2.5 rounded-lg border border-slate-100 transition-all group-hover/link:bg-[#25D366] group-hover/link:text-white group-hover/link:scale-105 shadow-inner marker-link-icon"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></div>
                     <div className="text-left flex-1 marker-link-text"><p className="text-[#111] font-bold text-[15px] group-hover/link:text-[#25D366] transition-colors">WhatsApp</p><p className="text-xs text-slate-600">Quick Support</p></div>
                     <div className="text-[#25D366] opacity-0 group-hover/link:opacity-100 transition-opacity marker-link-arrow">↗</div>
                   </a>
                   
                   <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl hover:border-[#0077b5] group/link transition-all backdrop-blur-sm">
                     <div className="text-[#0077b5] bg-white p-2.5 rounded-lg border border-slate-100 transition-all group-hover/link:bg-[#0077b5] group-hover/link:text-white group-hover/link:scale-105 shadow-inner marker-link-icon"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>
                     <div className="text-left flex-1 marker-link-text"><p className="text-[#111] font-bold text-[15px] group-hover/link:text-[#0077b5] transition-colors">LinkedIn</p><p className="text-xs text-slate-600">Professional Connect</p></div>
                     <div className="text-[#0077b5] opacity-0 group-hover/link:opacity-100 transition-opacity marker-link-arrow">↗</div>
                   </a>
                 </div>
               </div>
            </div>

            {/* Legal Policies Card with Rose Theme */}
            <div className="md:col-span-2 bg-[#fff0f3] border border-rose-100 rounded-2xl p-8 sm:p-10 relative overflow-hidden group hover:border-rose-200 transition-colors duration-300 elevation-rose">
              <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-rose-200 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-rose-300/50"></div>
              <h2 className="text-2xl font-bold text-rose-950 mb-6 relative z-10 marker-title">Legal & Policies</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-700 relative z-10 leading-relaxed marker-legal-parent">
                <div>
                  <h3 className="font-bold text-rose-950 mb-3 flex items-center gap-2 marker-legal-title">🔒 Privacy Policy</h3>
                  <ul className="space-y-2 list-none marker-legal-list">
                    <li><span className="text-rose-500 mr-2.5">•</span>No Sensitive Data Stored.</li>
                    <li><span className="text-rose-500 mr-2.5">•</span>Public URL Processing only.</li>
                    <li><span className="text-rose-500 mr-2.5">•</span>100% Data Privacy maintained.</li>
                    <li><span className="text-rose-500 mr-2.5">•</span>Standard Analytics performance only.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 mb-3 flex items-center gap-2 marker-legal-title">⚖️ Terms & Conditions</h3>
                  <ul className="space-y-2 list-none marker-legal-list">
                    <li><span className="text-rose-500 mr-2.5">•</span>Independent Community Project.</li>
                    <li><span className="text-rose-500 mr-2.5">•</span>Calculations act as guide only.</li>
                    <li><span className="text-rose-500 mr-2.5">•</span>Final Authority lies with Google.</li>
                    <li><span className="text-rose-500 mr-2.5">•</span>Users must provide correct URLs.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* ================= 6. DISCLAIMER (RED ALERT BOX) ================= */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm group hover:border-red-300 transition-colors">
             <div className="w-12 h-12 shrink-0 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl group-hover:scale-110 transition-transform">⚠️</div>
             <div>
               <h3 className="text-red-800 font-bold text-lg mb-1">Disclaimer</h3>
               <p className="text-red-700 font-medium text-sm leading-relaxed">
                  This website is an independent, community-built tool and is <strong className="text-red-900 bg-red-200/50 px-1 rounded">not an official website of Google Cloud Arcade or Google.</strong> All trademarks belong to their respective owners.
               </p>
             </div>
          </div>

        </div>

      </main>
    </div>
  );
}