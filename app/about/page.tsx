"use client";

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans selection:bg-[#1a73e8] selection:text-white pb-24 relative">
      
      {/* Background Subtle Grid - Extremely Minimal */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay"></div>

      <main className="pt-28 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* ================= 1. HERO SECTION (MINIMAL & PROFESSIONAL) ================= */}
        <section className="pt-4 animate-fade-in-up">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-[#202124] tracking-tight mb-4">
              About <span className="text-[#1a73e8]">Arcade</span>
            </h1>
            <p className="text-lg text-[#5f6368] font-medium max-w-2xl mx-auto">
              The ultimate community toolkit for Google Cloud enthusiasts.
            </p>
          </div>

          {/* Clean Google-Style Hero Card */}
          <div className="bg-white rounded-xl p-8 md:p-12 border border-[#dadce0] shadow-sm max-w-5xl mx-auto transition-shadow hover:shadow-md">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              
              <div className="flex-1">
                <div className="inline-block bg-[#e8f0fe] text-[#1a73e8] font-bold tracking-wider text-[11px] uppercase px-3 py-1 rounded-sm mb-4 border border-[#d2e3fc]">
                  About Arcade Program
                </div>
                <h2 className="text-3xl font-black text-[#202124] mb-4 leading-tight tracking-tight">
                  Master Cloud Skills. <span className="text-[#34a853]">Earn Swags.</span>
                </h2>
                <p className="text-[#5f6368] text-base leading-relaxed mb-8 max-w-3xl">
                  Join an always-on, no-cost gaming campaign where technical practitioners of all levels learn computing, application development, big data & AI/ML. Earn digital badges and convert them into official Google Cloud goodies.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-[#f1f3f4]">
                  {[
                    { title: "Digital Badges", desc: "Showcase Google Cloud-hosted badges on your LinkedIn & resume." },
                    { title: "Hands-on XP", desc: "Move beyond theory. Practice in real-world cloud environments." },
                    { title: "Claim Prizes", desc: "Earn Arcade points for every skill badge and claim official merchandise." }
                  ].map((item, idx) => (
                    <div key={idx} className="group">
                      <h3 className="text-[#202124] font-bold text-[15px] mb-2 flex items-center gap-2">
                        <span className="text-[#1a73e8] font-black">0{idx + 1}.</span> {item.title}
                      </h3>
                      <p className="text-[#5f6368] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. FEATURES GRID (CLEAN SQUARE BOXES) ================= */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#202124] tracking-tight">
              Platform Features
            </h2>
            <div className="h-px bg-[#dadce0] flex-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { title: "Calculate Points", desc: "Real-time points calculation.", link: "/calculator" },
              { title: "Live Leaderboard", desc: "Track community rankings.", link: "/leaderboard" },
              { title: "User Dashboard", desc: "Manage tier progression.", link: "/dashboard" },
              { title: "Go to Dashboard", desc: "Access your main portal.", link: "/dashboard" },
              { title: "Program Updates", desc: "Latest news & announcements.", link: "/facilitator" },
              { title: "Skill Badges", desc: "Curated active badges.", link: "/resources" },
              { title: "Smart Chatbot", desc: "24/7 AI automated help.", link: "/ChatBot" },
              { title: "Simple FAQs", desc: "Answers to common questions.", link: "/FAQ" }
            ].map((feature, index) => (
              <Link 
                href={feature.link} 
                key={index} 
                className="group flex flex-col justify-center bg-white p-6 rounded-lg border border-[#dadce0] hover:border-[#1a73e8] hover:shadow-[0_4px_14px_rgba(26,115,232,0.08)] transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-[16px] font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  <span className="text-[#dadce0] group-hover:text-[#1a73e8] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 font-bold">
                    ↗
                  </span>
                </div>
                <p className="text-sm text-[#5f6368] font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>


        {/* ================= 3. WHY PLAY (MINIMAL METRICS STYLE) ================= */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
            <div className="h-px bg-[#dadce0] flex-1"></div>
            <h2 className="text-2xl font-bold text-[#202124] tracking-tight">Why Play The Arcade?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { icon: "🎮", title: "Gamified Learning", desc: "Learn complex cloud concepts through engaging game-like structures.", color: "text-[#1a73e8]", bg: "bg-[#e8f0fe]" },
              { icon: "💸", title: "100% No Cost", desc: "Participation is completely free. Just bring your dedication to learn.", color: "text-[#34a853]", bg: "bg-[#e6f4ea]" },
              { icon: "🛠️", title: "Hands-on Labs", desc: "Practice in real Google Cloud environments, not just theory.", color: "text-[#f29900]", bg: "bg-[#fef7e0]" },
              { icon: "🎁", title: "Swags & Prizes", desc: "Convert your hard-earned points into official Cloud merchandise.", color: "text-[#ea4335]", bg: "bg-[#fce8e6]" }
            ].map((box, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-[#dadce0] flex flex-col hover:shadow-sm transition-shadow">
                <div className={`w-12 h-12 ${box.bg} ${box.color} rounded-md flex items-center justify-center text-2xl mb-5`}>
                  {box.icon}
                </div>
                <h3 className="text-lg font-bold text-[#202124] mb-2">{box.title}</h3>
                <p className="text-sm text-[#5f6368] leading-relaxed flex-1">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 4. TIMELINES & RESOURCES (CLEAN BENTO BOXES) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          
          {/* How It Works (Clean Timeline) */}
          <section className="bg-white p-8 sm:p-10 rounded-xl border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-[#202124] mb-8 flex items-center gap-3 border-b border-[#f1f3f4] pb-4">
              <span className="text-[#1a73e8]">⚙️</span> How It Works
            </h2>
            <div className="relative border-l-2 border-[#e8eaed] ml-3 space-y-8 pb-2">
              {[
                { title: "Sign in with Google", desc: "Create account on the official Cloud Skills Boost platform using your Google ID." },
                { title: "Monthly Challenge", desc: "New monthly games & trivia are released. Subscribe to never miss a challenge." },
                { title: "Earning Badges", desc: "Complete labs inside games to earn digital skill badges & Arcade Points." },
                { title: "Level Progression", desc: "Accumulate points to climb swag tiers. Use the calculator to track progression." }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-6 group">
                  <div className="absolute w-3 h-3 bg-white border-2 border-[#1a73e8] rounded-full -left-[7px] top-1.5 group-hover:bg-[#1a73e8] transition-colors"></div>
                  <h3 className="text-base font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">{step.title}</h3>
                  <p className="mt-1 text-sm text-[#5f6368] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Official Resources (Clean Links) */}
          <section className="bg-white p-8 sm:p-10 rounded-xl border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <h2 className="text-xl font-bold text-[#202124] mb-8 flex items-center gap-3 border-b border-[#f1f3f4] pb-4">
               <span className="text-[#34a853]">📚</span> Official Resources
            </h2>
            <div className="space-y-4 flex-1">
              {[
                { title: "The Arcade Platform", desc: "Hub for monthly games, trivia, and prize updates.", link: "https://go.cloudskillsboost.google/arcade" },
                { title: "Cloud Skills Boost", desc: "Main portal holding all technical labs and badges.", link: "https://www.cloudskillsboost.google/" },
                { title: "Learning Forum", desc: "Connect with learners, facilitators, and get support.", link: "https://www.googlecloudcommunity.com/" }
              ].map((resource, idx) => (
                <a href={resource.link} target="_blank" rel="noopener noreferrer" key={idx} className="group block bg-[#f8f9fa] p-5 rounded-lg border border-[#dadce0] hover:border-[#34a853] hover:bg-white transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#202124] group-hover:text-[#34a853] transition-colors">
                        {resource.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#5f6368]">{resource.desc}</p>
                    </div>
                    <div className="text-[#dadce0] group-hover:text-[#34a853] transition-colors font-bold">
                      ↗
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ================= 5. CONNECT & LEGAL (MINIMAL FOOTER BENTO) ================= */}
        <div className="max-w-6xl mx-auto pt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Contact Cards */}
            <div className="md:col-span-1 flex flex-col gap-4">
               <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-sm">
                 <h2 className="text-[15px] font-bold text-[#5f6368] uppercase tracking-wider mb-5">Reach Out</h2>
                 
                 <div className="space-y-3">
                   <a href="https://wa.me/8538980608" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white border border-[#dadce0] p-3 rounded-lg hover:border-[#25D366] group transition-colors">
                     <div className="text-[#25D366] p-1.5"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></div>
                     <div className="flex-1"><p className="text-[#202124] font-bold text-sm group-hover:text-[#25D366] transition-colors">WhatsApp</p></div>
                   </a>
                   
                   <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white border border-[#dadce0] p-3 rounded-lg hover:border-[#0077b5] group transition-colors">
                     <div className="text-[#0077b5] p-1.5"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>
                     <div className="flex-1"><p className="text-[#202124] font-bold text-sm group-hover:text-[#0077b5] transition-colors">LinkedIn</p></div>
                   </a>
                 </div>
               </div>
            </div>

            {/* Legal Policies Card */}
            <div className="md:col-span-2 bg-white border border-[#dadce0] rounded-xl p-8 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#5f6368] uppercase tracking-wider mb-6 border-b border-[#f1f3f4] pb-3">Legal & Policies</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-[#5f6368]">
                <div>
                  <h3 className="font-bold text-[#202124] mb-3">Privacy Policy</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> No Sensitive Data Stored.</li>
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> Public URL Processing only.</li>
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> 100% Data Privacy maintained.</li>
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> Standard Analytics performance only.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-[#202124] mb-3">Terms & Conditions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> Independent Community Project.</li>
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> Calculations act as guide only.</li>
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> Final Authority lies with Google.</li>
                    <li className="flex items-start gap-2"><span className="text-[#9aa0a6]">•</span> Users must provide correct URLs.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* ================= 6. DISCLAIMER (SYSTEM ALERT STYLE) ================= */}
          <div className="mt-6 bg-[#fce8e6] border border-[#fad2cf] rounded-lg p-5 flex flex-col sm:flex-row items-start gap-4">
             <div className="text-[#d93025] text-xl pt-0.5">⚠️</div>
             <div>
               <h3 className="text-[#d93025] font-bold text-sm mb-1">Important Disclaimer</h3>
               <p className="text-[#a50e0e] text-sm leading-relaxed">
                  This website is an independent, community-built tool and is <strong>not an official website of Google Cloud Arcade or Google.</strong> All trademarks belong to their respective owners.
               </p>
             </div>
          </div>

        </div>

      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}