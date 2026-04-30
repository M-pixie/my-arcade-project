"use client";

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#202124] font-sans selection:bg-[#1a73e8] selection:text-white pb-24 relative overflow-hidden">
      
      {/* 🔥 VIBRANT BACKGROUND GLOWS 🔥 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a73e8] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#ea4335] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#34a853] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

      <main className="pt-28 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 bg-white text-[#1a73e8] font-bold tracking-widest text-[11px] uppercase px-5 py-2.5 rounded-full mb-6 border border-[#e8eaed] shadow-[0_4px_12px_rgba(26,115,232,0.15)]">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#1a73e8] to-[#ea4335] animate-pulse"></span>
              About Us & The Program
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#202124] tracking-tight mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#ea4335]">Arcade Nexus</span>
            </h1>
            <p className="text-lg md:text-xl text-[#5f6368] font-medium max-w-3xl mx-auto leading-relaxed">
              The ultimate independent community toolkit built by <span className="font-bold text-[#1a73e8]">Manish</span> & <span className="font-bold text-[#ea4335]">Anjali</span> to help Google Cloud enthusiasts track, learn, and grow efficiently.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-8 md:p-14 border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.08)] max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a73e8] via-[#34a853] to-[#ea4335]"></div>
            
            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-black text-[#202124] leading-tight tracking-tight">
                  Master Cloud Skills. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34a853] to-[#1e8e3e]">Earn Official Swags.</span>
                </h2>
                <p className="text-[#5f6368] text-lg leading-relaxed max-w-2xl">
                  Join an always-on, no-cost gaming campaign where technical practitioners of all levels learn computing, application development, big data & AI/ML. Earn digital badges and convert them into official Google Cloud goodies.
                </p>
              </div>
              
              <div className="flex-1 w-full grid grid-cols-1 gap-4">
                {[
                  { title: "Digital Badges", desc: "Showcase Google Cloud-hosted badges on your LinkedIn.", icon: "🏅", color: "bg-[#e8f0fe] text-[#1a73e8]" },
                  { title: "Hands-on XP", desc: "Move beyond theory. Practice in real-world environments.", icon: "💻", color: "bg-[#e6f4ea] text-[#34a853]" },
                  { title: "Claim Prizes", desc: "Earn Arcade points and claim official merchandise.", icon: "🎁", color: "bg-[#fce8e6] text-[#ea4335]" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-[#e8eaed] hover:border-transparent hover:shadow-md transition-all group flex items-start gap-4">
                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-[#202124] font-bold text-[16px] mb-1">{item.title}</h3>
                      <p className="text-[#5f6368] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. FEATURES GRID (🔥 NOW MATCHES "WHY PLAY" STYLE EXACTLY) ================= */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-6 mb-10 max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-[#202124] tracking-tight">Platform Features</h2>
            <div className="h-px bg-gradient-to-r from-[#dadce0] to-transparent flex-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Calculate Points", desc: "Real-time points calculation.", link: "/calculator", icon: "🔢", color: "text-[#1a73e8]", bg: "bg-[#e8f0fe]", border: "hover:border-[#1a73e8]", hoverText: "group-hover:text-[#1a73e8]" },
              { title: "Live Leaderboard", desc: "Track community rankings.", link: "/leaderboard", icon: "🏆", color: "text-[#f29900]", bg: "bg-[#fef7e0]", border: "hover:border-[#f29900]", hoverText: "group-hover:text-[#f29900]" },
              { title: "User Dashboard", desc: "Manage tier progression.", link: "/dashboard", icon: "📊", color: "text-[#a142f4]", bg: "bg-[#f3e8fd]", border: "hover:border-[#a142f4]", hoverText: "group-hover:text-[#a142f4]" },
              { title: "Go to Dashboard", desc: "Access your main portal.", link: "/dashboard", icon: "🚪", color: "text-[#34a853]", bg: "bg-[#e6f4ea]", border: "hover:border-[#34a853]", hoverText: "group-hover:text-[#34a853]" },
              { title: "Program Updates", desc: "Latest news & announcements.", link: "/facilitator", icon: "📢", color: "text-[#ea4335]", bg: "bg-[#fce8e6]", border: "hover:border-[#ea4335]", hoverText: "group-hover:text-[#ea4335]" },
              { title: "Skill Badges", desc: "Curated active badges.", link: "/resources", icon: "🏅", color: "text-[#3f51b5]", bg: "bg-[#e8eaf6]", border: "hover:border-[#3f51b5]", hoverText: "group-hover:text-[#3f51b5]" },
              { title: "Smart Chatbot", desc: "24/7 AI automated help.", link: "/ChatBot", icon: "🤖", color: "text-[#009688]", bg: "bg-[#e0f2f1]", border: "hover:border-[#009688]", hoverText: "group-hover:text-[#009688]" },
              { title: "Simple FAQs", desc: "Answers to common questions.", link: "/FAQ", icon: "❓", color: "text-[#5f6368]", bg: "bg-[#f1f3f4]", border: "hover:border-[#5f6368]", hoverText: "group-hover:text-[#5f6368]" }
            ].map((feature, index) => (
              <Link 
                href={feature.link} 
                key={index} 
                className={`bg-white p-8 rounded-xl border border-[#e8eaed] flex flex-col hover:shadow-xl ${feature.border} transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center text-3xl group-hover:-translate-y-2 transition-transform duration-300 shadow-sm`}>
                    {feature.icon}
                  </div>
                  {/* Clickable arrow styling */}
                  <span className={`text-[#dadce0] ${feature.hoverText} transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 font-bold text-xl`}>
                    ↗
                  </span>
                </div>
                <h3 className={`text-xl font-bold text-[#202124] mb-3 ${feature.hoverText} transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[#5f6368] leading-relaxed flex-1">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= 3. WHY PLAY ================= */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-6 mb-10 max-w-6xl mx-auto">
            <div className="h-px bg-gradient-to-l from-[#dadce0] to-transparent flex-1"></div>
            <h2 className="text-3xl font-black text-[#202124] tracking-tight">Why Play The Arcade?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🎮", title: "Gamified Learning", desc: "Learn complex cloud concepts through engaging game-like structures.", color: "text-[#1a73e8]", bg: "bg-[#e8f0fe]", border: "hover:border-[#1a73e8]" },
              { icon: "💸", title: "100% No Cost", desc: "Participation is completely free. Just bring your dedication to learn.", color: "text-[#34a853]", bg: "bg-[#e6f4ea]", border: "hover:border-[#34a853]" },
              { icon: "🛠️", title: "Hands-on Labs", desc: "Practice in real Google Cloud environments, not just theory.", color: "text-[#f29900]", bg: "bg-[#fef7e0]", border: "hover:border-[#f29900]" },
              { icon: "🎁", title: "Swags & Prizes", desc: "Convert your hard-earned points into official Cloud merchandise.", color: "text-[#ea4335]", bg: "bg-[#fce8e6]", border: "hover:border-[#ea4335]" }
            ].map((box, idx) => (
              <div key={idx} className={`bg-white p-8 rounded-xl border border-[#e8eaed] flex flex-col hover:shadow-xl ${box.border} transition-all duration-300 group`}>
                <div className={`w-16 h-16 ${box.bg} ${box.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm`}>
                  {box.icon}
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-3">{box.title}</h3>
                <p className="text-[15px] text-[#5f6368] leading-relaxed flex-1">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. TIMELINES & RESOURCES ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          
          <section className="bg-white p-8 sm:p-10 rounded-xl border border-[#e8eaed] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow">
            <h2 className="text-2xl font-black text-[#202124] mb-8 flex items-center gap-3">
              <span className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl text-blue-600 shadow-sm">⚙️</span> How It Works
            </h2>
            <div className="relative border-l-2 border-[#1a73e8]/20 ml-6 space-y-10 pb-2">
              {[
                { title: "Sign in with Google", desc: "Create an account on the official Cloud Skills Boost platform using your Google ID." },
                { title: "Monthly Challenge", desc: "New monthly games & trivia are released. Subscribe to never miss a challenge." },
                { title: "Earning Badges", desc: "Complete labs inside games to earn digital skill badges & Arcade Points." },
                { title: "Level Progression", desc: "Accumulate points to climb swag tiers. Use the calculator to track progression." }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-8 group">
                  <div className="absolute w-5 h-5 bg-[#e8f0fe] border-4 border-[#1a73e8] rounded-full -left-[11px] top-0 group-hover:bg-[#1a73e8] group-hover:scale-125 transition-all duration-300 shadow-sm"></div>
                  <h3 className="text-[17px] font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">{step.title}</h3>
                  <p className="mt-2 text-[15px] text-[#5f6368] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 sm:p-10 rounded-xl border border-[#e8eaed] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow flex flex-col">
            <h2 className="text-2xl font-black text-[#202124] mb-8 flex items-center gap-3">
               <span className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl text-green-600 shadow-sm">📚</span> Official Resources
            </h2>
            <div className="space-y-4 flex-1">
              {[
                { title: "The Arcade Platform", desc: "Hub for monthly games, trivia, and prize updates.", link: "https://go.cloudskillsboost.google/arcade", color: "hover:border-[#1a73e8]" },
                { title: "Cloud Skills Boost", desc: "Main portal holding all technical labs and badges.", link: "https://www.cloudskillsboost.google/", color: "hover:border-[#34a853]" },
                { title: "Learning Forum", desc: "Connect with learners, facilitators, and get support.", link: "https://www.googlecloudcommunity.com/", color: "hover:border-[#ea4335]" }
              ].map((resource, idx) => (
                <a href={resource.link} target="_blank" rel="noopener noreferrer" key={idx} className={`group flex items-center justify-between bg-gray-50/50 p-6 rounded-xl border border-[#e8eaed] ${resource.color} hover:shadow-md transition-all duration-300`}>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#202124] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#5f6368]">{resource.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[#e8eaed] group-hover:bg-[#202124] group-hover:border-[#202124] group-hover:text-white transition-all duration-300 font-bold">
                    ↗
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ================= 5. CONTACT US & LEGAL ================= */}
        <div className="max-w-6xl mx-auto pt-10 border-t border-[#dadce0] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#202124] tracking-tight mb-3">Support & Policies</h2>
            <p className="text-[#5f6368]">Everything you need to know about our community guidelines and contact info.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-1 flex flex-col gap-4">
               <div className="bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow h-full">
                 <h3 className="text-xl font-black text-[#202124] mb-6 flex items-center gap-3">
                   <span className="w-10 h-10 bg-[#e8f0fe] text-[#1a73e8] rounded-xl flex items-center justify-center text-xl">📬</span> Contact Us
                 </h3>
                 <p className="text-sm text-[#5f6368] mb-6">Have questions or found a bug? Reach out to us directly.</p>
                 
                 <div className="space-y-4">
                   <a href="mailto:contact@arcadenexus.com" className="flex items-center gap-4 bg-white border border-[#e8eaed] p-4 rounded-xl hover:border-[#ea4335] hover:shadow-md transition-all group">
                     <div className="w-10 h-10 rounded-xl bg-[#fce8e6] flex items-center justify-center text-[#ea4335]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                     <div className="flex-1">
                       <p className="text-[12px] text-[#5f6368] font-bold uppercase tracking-wider">Email Us</p>
                       <p className="text-[#202124] font-bold text-sm">support@arcadenexus.com</p>
                     </div>
                   </a>

                   <a href="https://wa.me/8538980608" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white border border-[#e8eaed] p-4 rounded-xl hover:border-[#34a853] hover:shadow-md transition-all group">
                     <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] flex items-center justify-center text-[#34a853]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></div>
                     <div className="flex-1">
                       <p className="text-[12px] text-[#5f6368] font-bold uppercase tracking-wider">WhatsApp</p>
                       <p className="text-[#202124] font-bold text-sm">Community Chat</p>
                     </div>
                   </a>
                 </div>
               </div>
            </div>

            <div className="md:col-span-2 bg-white border border-[#e8eaed] rounded-xl p-8 md:p-10 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
                <div>
                  <h3 className="text-xl font-black text-[#202124] mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-[#e8f0fe] text-[#1a73e8] rounded-xl flex items-center justify-center text-xl">🔒</span> Privacy Policy
                  </h3>
                  <div className="text-[#5f6368] text-[15px] leading-relaxed space-y-4">
                    <p>At Arcade Nexus, the privacy of our visitors is of extreme importance to us.</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shrink-0"></div> <span><strong>No Data Storage:</strong> We do not store your personal Google Cloud data.</span></li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shrink-0"></div> <span><strong>Log Files:</strong> Standard log files are used strictly to improve site performance.</span></li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shrink-0"></div> <span><strong>Cookies:</strong> Used to personalize content and ads (via Google AdSense).</span></li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#202124] mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-[#e6f4ea] text-[#34a853] rounded-xl flex items-center justify-center text-xl">📝</span> Terms
                  </h3>
                  <div className="text-[#5f6368] text-[15px] leading-relaxed space-y-4">
                    <p>By using Arcade Nexus, you hereby consent to our Terms of Service.</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shrink-0"></div> <span><strong>Usage:</strong> Provided "as is" to help the community with estimations.</span></li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shrink-0"></div> <span><strong>Independence:</strong> Final authority always lies with the official Google team.</span></li>
                      <li className="flex items-start gap-3"><div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shrink-0"></div> <span><strong>Changes:</strong> We reserve the right to modify these terms without notice.</span></li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ================= 6. DISCLAIMER ================= */}
          <div className="mt-8 bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
             <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-3xl shadow-sm border border-red-200 shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
               ⚠️
             </div>
             <div className="text-center sm:text-left">
               <h3 className="text-red-600 font-black text-lg mb-2 tracking-tight">Important Legal Disclaimer</h3>
               <p className="text-red-800/80 text-[15px] leading-relaxed max-w-4xl font-medium">
                 This website (Arcade Nexus) is an independent, community-built platform and is <strong>strictly not an official website of Google Cloud Arcade, Google LLC, or Alphabet Inc.</strong> All trademarks, program names, and logos belong to their respective owners. 
               </p>
             </div>
          </div>

        </div>

      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}