"use client";

import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

export default function FacilitatorPage() {
  const router = useRouter();

  // COORDINATORS DATA
  const coordinatorsData = [
    { name: "Disha Shukla", linkedin: "https://www.linkedin.com/in/disha-shukla-90a88a298", badges: "85+", points: "95", profileUrl: "https://www.skills.google/public_profiles/b2233758-bfb0-41e3-bc41-85d89d7bb1de" },
    { name: "Vaibhav Raj", linkedin: "https://www.linkedin.com/in/vaibhav-raj-0a9477285", badges: "90+", points: "98", profileUrl: "https://www.skills.google/public_profiles/a0122dd1-ef1a-4092-9845-af2c6c7bb7d2" },
    { name: "Milan Deori", linkedin: "https://www.linkedin.com/in/milan-deori-939a832a1", badges: "70+", points: "105", profileUrl: "https://www.cloudskillsboost.google/public_profiles/d0df0491-5dca-4c7b-9b0e-c8144752f0b5" },
    { name: "Jayanta Ghosh", linkedin: "https://www.linkedin.com/in/jayantaghosh2004", badges: "120+", points: "100", profileUrl: " https://www.skills.google/public_profiles/4594551b-ab3b-4e2b-afe0-fd776ba8fd57" },
    { name: "Rajiv Ranjan Malviya", linkedin: "https://www.linkedin.com/in/rajivmalviya", badges: "72+", points: "98", profileUrl: "https://www.skills.google/public_profiles/f270e397-82a1-4f30-88d1-484c46ab24f8" },
    { name: "Ataul Rahman", linkedin: "https://www.linkedin.com/in/ataul-rahman", badges: "56+", points: "103", profileUrl: "https://www.skills.google/public_profiles/3b11619a-40bc-452f-ac49-6bcc2292010b" },
    { name: "Santu Gupta", linkedin: "https://www.linkedin.com/in/santu-kumar-163a17279", badges: "125+", points: "92", profileUrl: "https://www.skills.google/public_profiles/b384c49b-874a-48a3-9c0f-a34b61f15a47" }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#fcfcfc] text-[#202124] font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8]">
        <Navbar />

        <main className="pt-16">
          
          {/* ================= ULTRA CLEAN PREMIUM HERO SECTION ================= */}
          <section className="relative bg-white overflow-hidden py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center gap-6">
              
              {/* EXACT MATCH OF THE IMAGE FONT STYLE */}
              <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold text-[#0f172a] tracking-tight mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Arcade Facilitator Program
              </h1>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-[#34a853] mb-4 tracking-tight">
                Enrolments soon..
              </h2>

              <div className="flex flex-col gap-2 text-[#5f6368] font-medium text-[15px] md:text-[17px] mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>13 July 2026 at 17:00 - 14 September 2026 at 23:59 GMT+5:30</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Registration opens on 13 July 2026 at 17:00 GMT+5:30</span>
                </div>
              </div>

              {/* 🔥 INLINE GREY REFERRAL CODE STRIP 🔥 */}
              <div className="w-full max-w-lg mx-auto flex flex-col gap-1.5 mb-12">
                <span className="text-[13px] font-bold text-[#5f6368] uppercase tracking-wider text-left pl-1">
                  Referral Code
                </span>
                <div className="flex items-center justify-between bg-[#f1f3f4] rounded-lg px-5 py-3 border border-[#dadce0]">
                  <div className="font-mono text-xl sm:text-2xl text-[#202124] font-extrabold tracking-[0.15em] opacity-80">
                    ****_***_***
                  </div>
                  <div className="bg-white/80 border border-[#dadce0] text-[#5f6368] px-3 py-1.5 rounded-md text-[13px] font-bold flex items-center gap-2 shadow-sm cursor-not-allowed">
                    <span className="w-2 h-2 rounded-full bg-[#9aa0a6]"></span>
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (2x2 Grid, Grey Color, Slight Curve) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto mb-14">
                
                <button onClick={() => router.push("/calculator")} className="w-full px-6 py-4 bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] font-bold text-[15px] rounded-lg hover:bg-[#e8eaed] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                  <svg className="w-5 h-5 text-[#5f6368] group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  Calculate Points
                </button>
                
                <button onClick={() => router.push("/leaderboard")} className="w-full px-6 py-4 bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] font-bold text-[15px] rounded-lg hover:bg-[#e8eaed] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                  <svg className="w-5 h-5 text-[#5f6368] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  Leaderboard
                </button>
                
                <button onClick={() => router.push("/resources")} className="w-full px-6 py-4 bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] font-bold text-[15px] rounded-lg hover:bg-[#e8eaed] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                  <svg className="w-5 h-5 text-[#5f6368] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  Skill Badges List
                </button>
                
                <button onClick={() => router.push("/dashboard")} className="w-full px-6 py-4 bg-[#f1f3f4] border border-[#dadce0] text-[#3c4043] font-bold text-[15px] rounded-lg hover:bg-[#e8eaed] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                  <svg className="w-5 h-5 text-[#5f6368] transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Dashboard
                </button>

              </div>
              </div>
          </section>

          {/* ================= MILESTONES & SWAGS SECTION ================= */}
          <section className="pt-16 pb-24 px-6 bg-[#f8f9fa] border-y border-[#dadce0]">
            <div className="max-w-5xl mx-auto">
              
              <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight mb-10 text-center">
                Milestones & Swags
              </h2>
              
              <div className="bg-white border border-[#cccccc] rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="grid grid-cols-12 text-sm md:text-lg lg:text-xl font-bold text-white">
                  <div className="col-span-5 bg-[#3a6b66] flex items-center justify-center py-4 md:py-6 px-4 md:px-6 text-center">
                    Users Milestone
                  </div>
                  <div className="col-span-4 bg-[#506c8d] flex items-center justify-center py-4 md:py-6 px-4 md:px-6 text-center">
                    Required Points
                  </div>
                  <div className="col-span-3 bg-[#cdb685] flex items-center justify-center py-4 md:py-6 px-4 md:px-6 text-center">
                    Expected Rewards
                  </div>
                </div>

                <div className="divide-y divide-[#e8eaed]">
                  <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <span className="w-3 h-3 bg-[#1a73e8] rounded-full flex-shrink-0"></span>
                      <span className="font-bold text-[#202124] text-sm md:text-lg">Ultimate Milestone</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#1a73e8] text-sm md:text-lg">40+ Points</div>
                    <div className="col-span-3 text-center text-xs md:text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <span className="w-3 h-3 bg-[#fbbc04] rounded-full flex-shrink-0"></span>
                      <span className="font-bold text-[#202124] text-sm md:text-lg">Milestone 3</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#b06000] text-sm md:text-lg">25 - 39 Points</div>
                    <div className="col-span-3 text-center text-xs md:text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <span className="w-3 h-3 bg-[#34a853] rounded-full flex-shrink-0"></span>
                      <span className="font-bold text-[#202124] text-sm md:text-lg">Milestone 2</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#2b8a44] text-sm md:text-lg">15 - 24 Points</div>
                    <div className="col-span-3 text-center text-xs md:text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <span className="w-3 h-3 bg-[#ea4335] rounded-full flex-shrink-0"></span>
                      <span className="font-bold text-[#202124] text-sm md:text-lg">Milestone 1</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#c5221f] text-sm md:text-lg">10 - 14 Points</div>
                    <div className="col-span-3 text-center text-xs md:text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= BORDERLESS & OPEN CONTACT FACILITATOR WITH ANIMATED IMAGES ================= */}
          <section id="contact-facilitator" className="py-20 px-6 bg-[#fcfcfc] border-b border-[#dadce0] relative overflow-hidden">
            <style>{`
              @keyframes customFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-12px); }
              }
              .float-anim-1 { animation: customFloat 4s ease-in-out infinite; }
              .float-anim-2 { animation: customFloat 4s ease-in-out infinite 1s; }
              .float-anim-3 { animation: customFloat 4s ease-in-out infinite 2s; }
            `}</style>
            
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#e8f0fe] rounded-full blur-[100px] -translate-y-1/2 opacity-60 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight">Arcade Facilitator & Team</h2>
              </div>

              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                <div className="flex flex-col items-center justify-center flex-shrink-0 md:w-5/12">
                  <div className="flex gap-6 sm:gap-8 mb-4">
                    <div className="flex flex-col items-center float-anim-1">
                      <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="w-40 h-40 sm:w-44 sm:h-44 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 block relative">
                        <img src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" alt="Manish" className="w-full h-full object-cover object-top" />
                      </a>
                      <div className="mt-5 text-center">
                        <h4 className="font-bold text-[#202124] text-[17px]">Manish</h4>
                        <div className="inline-block mt-1 bg-[#e8f0fe] border border-[#d2e3fc] px-3 py-1 rounded-md shadow-sm">
                          <span className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wide">Arcade Facilitator</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center float-anim-2">
                      <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" className="w-40 h-40 sm:w-44 sm:h-44 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 block relative">
                        <img src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" alt="Anjali" className="w-full h-full object-cover object-top" />
                      </a>
                      <div className="mt-5 text-center">
                        <h4 className="font-bold text-[#202124] text-[17px]">Anjali</h4>
                        <div className="inline-block mt-1 bg-[#fef7e0] border border-[#fde293] px-3 py-1 rounded-md shadow-sm">
                          <span className="text-[11px] font-bold text-[#b06000] uppercase tracking-wide">Arcade Facilitator</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center float-anim-3 -mt-4 relative z-20">
                    <a href="https://www.linkedin.com/in/rohit-kumar-b482752ab" target="_blank" rel="noopener noreferrer" className="w-40 h-40 sm:w-44 sm:h-44 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 block relative">
                      <img src="https://i.postimg.cc/cHVvphLB/IMG-20260222-221651.jpg" alt="Rohit" className="w-full h-full object-cover object-top" />
                    </a>
                    <div className="mt-5 text-center">
                      <h4 className="font-bold text-[#202124] text-[17px]">Rohit</h4>
                      <div className="inline-block mt-1 bg-[#fce8e6] border border-[#fad2cf] px-3 py-1 rounded-md shadow-sm">
                        <span className="text-[11px] font-bold text-[#c5221f] uppercase tracking-wide">Labs Lead</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[#3c4043] text-[17px] leading-relaxed mb-8 text-center md:text-left font-normal">
                    As a dedicated Google Cloud Arcade Facilitator in 2025 & 26, Manish & Anjali Patel has demonstrated exceptional leadership by securing the prestigious Ultimate Milestone Winner title in both Cohorts. He is passionate about empowering the community to upskill, earn certifications, and claim official Google Cloud swags.
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-lg border border-[#e8eaed] shadow-sm mb-8">
                    {[
                      { icon: "🏆", title: "2x Ultimate", subtitle: "Cohort 1 & 2" },
                      { icon: "👥", title: "2000+", subtitle: "People Guided" },
                      { icon: "⭐", title: "20+", subtitle: "Coordinators" },
                      { icon: "🎁", title: "Gifts & Certs", subtitle: "Distributed" }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center justify-center text-center group cursor-default">
                        <div className="text-2xl mb-1.5 transform group-hover:-translate-y-1 transition-transform duration-300">{stat.icon}</div>
                        <div className="font-bold text-[#202124] text-[14px]">{stat.title}</div>
                        <div className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider mt-1">{stat.subtitle}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <a href="https://wa.me/918538980608?text=Hi%20Manish%2C%20I%20have%20a%20query%20regarding%20Google%20Cloud%20Arcade%20labs%2C%20points%2C%20or%20swags." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-[15px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none hover:-translate-y-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WhatsApp
                    </a>
                    <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-[15px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none hover:-translate-y-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= TOP PERFORMERS SECTION ================= */}
          <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight mb-3">Top Performers Arcade 2025</h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed font-bold">
                  The dedicated individuals helping our community achieve their milestones.
                </p>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f1f3f4] border-b border-[#e8eaed] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  <div className="col-span-5">Members</div>
                  <div className="col-span-3 text-center">Skill Badges</div>
                  <div className="col-span-2 text-center">Arcade Points</div>
                  <div className="col-span-2 text-right">Connect</div>
                </div>

                <div className="divide-y divide-[#e8eaed]">
                  {coordinatorsData.map((coord, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                      <div className="col-span-1 md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <a href={coord.linkedin} target="_blank" rel="noopener noreferrer" className="font-bold text-[#202124] hover:text-[#1a73e8] text-base transition-colors">
                          {coord.name}
                        </a>
                      </div>
                      <div className="col-span-1 md:col-span-5 grid grid-cols-2 gap-4 md:gap-0 mt-3 md:mt-0">
                        <div className="md:col-span-1 flex flex-col md:items-center">
                          <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider md:hidden mb-1">Skill Badges</span>
                          <span className="font-bold text-[#202124] text-base">{coord.badges}</span>
                        </div>
                        <div className="md:col-span-1 flex flex-col md:items-center">
                          <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider md:hidden mb-1">Arcade Pts</span>
                          <span className="font-bold text-[#b06000] text-base">{coord.points}</span>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-3 mt-3 md:mt-0">
                        <a href={coord.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-white border border-[#dadce0] text-[#1a73e8] text-sm font-bold rounded-lg hover:bg-[#f8f9fa] transition-colors shadow-sm">
                          Profile
                        </a>
                        <a href={coord.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] hover:text-[#004182] transition-colors" title="View LinkedIn Profile">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}