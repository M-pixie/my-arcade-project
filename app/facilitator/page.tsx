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
      <div className="min-h-screen bg-[#f4f6f8] text-[#202124] font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8] pb-10">
        <Navbar />

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #dadce0; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9aa0a6; }
        `}</style>

        <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-[1350px] mx-auto">
          
          {/* ================= PAGE HEADER ================= */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Arcade Facilitator Program
              </h1>
              <p className="text-[#5f6368] mt-1.5 font-medium text-[15px]">
                Empowering the community to upskill, earn certifications, and claim Google Cloud swags.
              </p>
            </div>
          </div>

          {/* ================= BENTO GRID 1-PAGE LAYOUT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* 🔥 LEFT COLUMN (Milestones & Top Performers) 🔥 */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* --- User Milestones Card --- */}
              <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-[#e8eaed] bg-white">
                  <h2 className="text-[19px] font-extrabold text-[#1a73e8] tracking-tight">User Milestones & Prizes</h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    {/* 🔥 Original Yellow Theme Restored for Table Header 🔥 */}
                    <thead className="bg-[#fbbc04] border-b border-[#e8eaed] text-[12px] uppercase tracking-wider font-extrabold text-white">
                      <tr>
                        <th className="px-6 py-4">Milestone</th>
                        <th className="px-6 py-4">Requirement</th>
                        <th className="px-6 py-4">Prizes / Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8eaed]">
                      <tr className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-4 font-black text-[#202124] text-[14px]">Milestone 1</td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]"><strong>6 Arcade Games</strong> & <strong>18 Skill Badges</strong></td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]">15 Arcade + 5 Bonus <br/><strong className="text-[#137333]">= 20 Total Pts</strong></td>
                      </tr>
                      <tr className="hover:bg-[#f8f9fa] transition-colors bg-[#f8f9fa]">
                        <td className="px-6 py-4 font-black text-[#202124] text-[14px]">Milestone 2</td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]"><strong>8 Arcade Games</strong> & <strong>34 Skill Badges</strong></td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]">25 Arcade + 15 Bonus <br/><strong className="text-[#137333]">= 40 Total Pts</strong></td>
                      </tr>
                      <tr className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-4 font-black text-[#202124] text-[14px]">Milestone 3</td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]"><strong>10 Arcade Games</strong> & <strong>50 Skill Badges</strong></td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]">35 Arcade + 25 Bonus <br/><strong className="text-[#137333]">= 60 Total Pts</strong></td>
                      </tr>
                      <tr className="hover:bg-[#f8f9fa] transition-colors bg-[#f8f9fa]">
                        <td className="px-6 py-4 font-black text-[#202124] text-[14px]">Ultimate</td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]"><strong>12 Arcade Games</strong> & <strong>66 Skill Badges</strong></td>
                        <td className="px-6 py-4 text-[14px] text-[#3c4043]">45 Arcade + 35 Bonus <br/><strong className="text-[#137333]">= 80 Total Pts</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* --- Top Performers Card --- */}
              <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-[#e8eaed]">
                  <h2 className="text-[19px] font-extrabold text-[#202124] tracking-tight">Top Performers 2025</h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[#f8f9fa] border-b border-[#dadce0] text-[12px] uppercase tracking-wider font-bold text-[#5f6368]">
                      <tr>
                        <th className="px-6 py-3.5">Members</th>
                        <th className="px-6 py-3.5 text-center">Skill Badges</th>
                        <th className="px-6 py-3.5 text-center">Arcade Points</th>
                        <th className="px-6 py-3.5 text-right">Connect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8eaed]">
                      {coordinatorsData.map((coord, i) => (
                        <tr key={i} className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="px-6 py-3.5 font-bold text-[#1a73e8] hover:underline">
                            <a href={coord.linkedin} target="_blank" rel="noopener noreferrer">{coord.name}</a>
                          </td>
                          <td className="px-6 py-3.5 text-center font-bold text-[#202124] text-[14px]">{coord.badges}</td>
                          <td className="px-6 py-3.5 text-center font-bold text-[#b06000] text-[14px]">{coord.points}</td>
                          <td className="px-6 py-3.5 text-right">
                             <a href={coord.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-[12px] bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] px-3 py-1.5 rounded-md font-bold hover:bg-[#d2e3fc] transition-colors">
                               Profile
                             </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* 🔥 RIGHT COLUMN (Sidebar items) 🔥 */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* --- Quick Action Buttons (2x2 Grid) --- */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => router.push("/calculator")} className="p-4 bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] rounded-xl flex flex-col items-center justify-center gap-2.5 hover:-translate-y-1 hover:shadow-md transition-all group">
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <span className="text-[13px] font-extrabold tracking-wide">Calculator</span>
                </button>
                <button onClick={() => router.push("/leaderboard")} className="p-4 bg-[#e6f4ea] border border-[#ceead6] text-[#137333] rounded-xl flex flex-col items-center justify-center gap-2.5 hover:-translate-y-1 hover:shadow-md transition-all group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  <span className="text-[13px] font-extrabold tracking-wide">Leaderboard</span>
                </button>
                <button onClick={() => router.push("/resources")} className="p-4 bg-[#fef7e0] border border-[#fde293] text-[#b06000] rounded-xl flex flex-col items-center justify-center gap-2.5 hover:-translate-y-1 hover:shadow-md transition-all group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  <span className="text-[13px] font-extrabold tracking-wide">Skill Badges</span>
                </button>
                <button onClick={() => router.push("/dashboard")} className="p-4 bg-[#fce8e6] border border-[#fad2cf] text-[#c5221f] rounded-xl flex flex-col items-center justify-center gap-2.5 hover:-translate-y-1 hover:shadow-md transition-all group">
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  <span className="text-[13px] font-extrabold tracking-wide">Dashboard</span>
                </button>
              </div>

              {/* --- Notice / Note Card --- */}
              <div className="bg-gradient-to-br from-[#e8f0fe] to-[#f8f9fa] border border-[#d2e3fc] rounded-xl p-5 shadow-sm">
                <h3 className="text-[14px] font-extrabold text-[#1a73e8] flex items-center gap-2 mb-2.5">
                  <span className="text-lg">📌</span> Bonus Milestone Note
                </h3>
                <p className="text-[13.5px] text-[#3c4043] leading-relaxed mb-3.5">
                  If you complete the "Bonus Milestone" along with Ultimate Milestone, you earn an extra 10 bonus points, thus making your total <strong>45 + 35 + 10 = 90 points</strong>.
                </p>
                <a href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone" target="_blank" rel="noopener noreferrer" className="text-[13px] font-extrabold text-[#1a73e8] hover:text-[#1557b0] hover:underline flex items-center gap-1 w-fit transition-colors">
                  See Eligibility Criteria <span className="text-lg leading-none">➔</span>
                </a>
              </div>

              {/* --- Facilitator & Team Card --- */}
              <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm p-6 relative overflow-hidden flex-1">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#e8f0fe] rounded-full blur-[40px] opacity-60 pointer-events-none"></div>
                <h2 className="text-[17px] font-extrabold text-[#202124] mb-6 relative z-10">Facilitator & Team</h2>
                
                {/* 🔥 Updated Avatars Order: Anjali (1), Manish (2), Rohit (3) 🔥 */}
                <div className="flex justify-between items-center mb-6 relative z-10 px-2">
                  <div className="flex flex-col items-center">
                    <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
                      <img src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" alt="Anjali" className="w-14 h-14 rounded-full shadow-md object-cover object-top border-2 border-white" />
                    </a>
                    <span className="text-[12px] font-extrabold mt-2 text-[#202124]">Anjali</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
                      <img src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" alt="Manish" className="w-14 h-14 rounded-full shadow-md object-cover object-top border-2 border-white" />
                    </a>
                    <span className="text-[12px] font-extrabold mt-2 text-[#202124]">Manish</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <a href="https://www.linkedin.com/in/rohit-kumar-b482752ab" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
                      <img src="https://i.postimg.cc/cHVvphLB/IMG-20260222-221651.jpg" alt="Rohit" className="w-14 h-14 rounded-full shadow-md object-cover object-top border-2 border-white" />
                    </a>
                    <span className="text-[12px] font-extrabold mt-2 text-[#202124]">Rohit</span>
                  </div>
                </div>

                <p className="text-[13px] text-[#5f6368] leading-relaxed mb-6 relative z-10 font-medium">
                  As dedicated Google Cloud Arcade Facilitators in 2025 & 26, Anjali Patel, Manish, and Rohit Kumar demonstrated exceptional leadership by securing the prestigious Ultimate Milestone Winner title in both Cohorts.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                  <div className="bg-[#f8f9fa] p-3 rounded-lg text-center border border-[#e8eaed]">
                    <div className="text-xl mb-1">🏆</div>
                    <div className="text-[11px] font-black text-[#3c4043] tracking-wide">2x ULTIMATE</div>
                  </div>
                  <div className="bg-[#f8f9fa] p-3 rounded-lg text-center border border-[#e8eaed]">
                    <div className="text-xl mb-1">👥</div>
                    <div className="text-[11px] font-black text-[#3c4043] tracking-wide">2000+ GUIDED</div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-3 relative z-10 mt-auto">
                  <a href="https://wa.me/918538980608?text=Hi%20Manish%2C%20I%20have%20a%20query%20regarding%20Google%20Cloud%20Arcade%20labs%2C%20points%2C%20or%20swags." target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white text-[13px] font-bold py-2.5 rounded-lg flex justify-center items-center gap-1.5 hover:bg-[#128C7E] shadow-sm transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                  <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#0a66c2] text-white text-[13px] font-bold py-2.5 rounded-lg flex justify-center items-center gap-1.5 hover:bg-[#004182] shadow-sm transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </>
  );
}