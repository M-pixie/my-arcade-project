"use client";

import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function FacilitatorPage() {
  const router = useRouter();
  
  

  // State for Co-ordinator Contact Form
  const [selectedCoordinator, setSelectedCoordinator] = useState<{name: string, phone: string} | null>(null);
  const [coordinatorForm, setCoordinatorForm] = useState({
    name: "",
    gsp: "",
    query: ""
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCoordinatorSubmit = () => {
    if (!coordinatorForm.name || !coordinatorForm.gsp || !coordinatorForm.query) {
      alert("Please fill all the details (Name, GSP No, and Query).");
      return;
    }
    if (selectedCoordinator) {
      const message = `Hello ${selectedCoordinator.name},%0A%0A*Name (Labs):* ${coordinatorForm.name}%0A*GSP No:* ${coordinatorForm.gsp}%0A*Query/Problem:* ${coordinatorForm.query}%0A%0AI am facing an issue in Arcade 2026. Please help me out.`;
      window.open(`https://wa.me/${selectedCoordinator.phone}?text=${message}`, "_blank");
      
      // Close Modal & Show Success Tooltip
      setSelectedCoordinator(null);
      setCoordinatorForm({ name: "", gsp: "", query: "" });
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }
  };

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

  // Contact Co-ordinators Data
  const contactCoordinators = [
    { name: "Raman Rimpy", phone: "917696732471", linkedin: "https://www.linkedin.com/in/ramandeep-rimpy-175b123a5" },
    { name: "Preeti Patel", phone: "917080203742", linkedin: "https://www.linkedin.com/in/preeti-patel-a91406331" },
    { name: "Milan Deori", phone: "919083231422", linkedin: "https://www.linkedin.com/in/milan-deori-939a832a1" },
    { name: "Jayanta", phone: "919832724535", linkedin: "https://www.linkedin.com/in/jayantaghosh2004" },
    { name: "Ataul Rahman", phone: "918936868890", linkedin: "https://www.linkedin.com/in/ataul-rahman" },
    { name: "Santu Gupta", phone: "918651581856", linkedin: "https://www.linkedin.com/in/santu-kumar-163a17279" }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#fcfcfc] text-[#202124] font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8]">
        <Navbar />

        {/* 🔥 TOOLTIP NOTIFICATION 🔥 */}
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${showTooltip ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
          <div className="bg-[#34a853] text-white px-6 py-3 rounded-lg shadow-lg font-bold text-sm flex items-center gap-3 border border-[#2b8a44]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Coordinator team will reach out shortly within 24hrs.
          </div>
        </div>

        {/* 🔥 PT-20 reduced to PT-16 to shift content up 🔥 */}
        <main className="pt-16">
          
          {/* ================= PREMIUM HERO SECTION (UPDATED) ================= */}
          <section className="relative border-b border-[#dadce0] bg-white overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#4285F4] opacity-[0.04] blur-[100px] rounded-full pointer-events-none"></div>
            
            {/* 🔥 Reduced PT-12 MD:PT-16 to PT-6 MD:PT-8 🔥 */}
            <div className="max-w-6xl mx-auto px-6 pt-6 pb-12 md:pt-8 md:pb-16 relative z-10">
              
              {/* Top Hero Row */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-16">
                
                {/* Left Content */}
                {/* lg:-mt-2 se isko halka upar kiya gaya hai */}
                <div className="flex-1 w-full lg:w-[60%] text-left lg:ml-[-16px] lg:-mt-2">
                  
                  <h1 className="text-4xl md:text-5xl font-medium text-[#202124] leading-tight mb-4 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Arcade Facilitator Program
                  </h1>
                  
                 

                  {/* mt-10 se isko halka niche kiya gaya hai */}
                  <h3 className="text-lg sm:text-[20px] font-bold text-[#202124] mt-10 mb-5 tracking-tight">
                    Enrolments soon..
                  </h3>

                  <div className="flex flex-col gap-4 text-[#202124] font-normal text-[16px]">
                    <div className="flex items-start gap-3">
                      <svg className="w-[20px] h-[20px] flex-shrink-0 text-[#202124] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                      <span>13 July 2026 at 17:00 - 14 September 2026 at 23:59 GMT+5:30</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-[20px] h-[20px] flex-shrink-0 text-[#202124] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                      <span>Registration opens on 13 July 2026 at 17:00 GMT+5:30</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - 4 Curved Sleek Pill Buttons */}
                {/* lg:mt-8 se isko thoda layout me niche laya gaya hai */}
                <div className="w-full lg:w-[35%] flex flex-col gap-3.5 justify-center flex-shrink-0 mt-8 lg:mt-8">
                  <button onClick={() => router.push("/calculator")} className="w-full max-w-[260px] mx-auto lg:ml-auto lg:mr-0 px-5 py-3 bg-[#34a853] text-white font-bold text-[14px] rounded-full hover:bg-[#2b8a44] hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    Calculate Points
                  </button>
                  <button onClick={() => router.push("/leaderboard")} className="w-full max-w-[260px] mx-auto lg:ml-auto lg:mr-0 px-5 py-3 bg-white text-[#1a73e8] border border-[#dadce0] font-bold text-[14px] rounded-full hover:bg-[#f8f9fa] hover:border-[#1a73e8] hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Leaderboard
                  </button>
                  <button onClick={() => router.push("/resources")} className="w-full max-w-[260px] mx-auto lg:ml-auto lg:mr-0 px-5 py-3 bg-[#fbbc04] text-[#202124] font-bold text-[14px] rounded-full hover:bg-[#f2a900] hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    Skill Badges List
                  </button>
                  <button onClick={() => router.push("/dashboard")} className="w-full max-w-[260px] mx-auto lg:ml-auto lg:mr-0 px-5 py-3 bg-[#1a73e8] text-white font-bold text-[14px] rounded-full hover:bg-[#1557b0] hover:shadow-md transition-all flex items-center justify-center gap-3 group">
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Dashboard
                  </button>
                </div>

              </div>

              {/* Slim Assistance & Referral Block */}
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="md:col-span-2 bg-white border border-[#e8eaed] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#e8f0fe] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <h2 className="text-xl sm:text-[22px] font-bold text-[#202124] mb-4 tracking-tight flex items-center gap-2.5 relative z-10">
                      <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                      Facilitator Referral Code
                    </h2>
                    <div className="bg-gradient-to-r from-[#1a73e8] to-[#1557b0] rounded-lg p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 items-center justify-center backdrop-blur-sm border border-white/20">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <div className="font-mono text-xl sm:text-[24px] text-white font-bold tracking-[0.15em] opacity-95 select-none">
                          ****-**-***
                        </div>
                      </div>
                      <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-6 py-2.5 rounded-lg text-[13px] cursor-not-allowed backdrop-blur-sm transition-all duration-300 w-full sm:w-auto shadow-sm flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Coming Soon
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#e8eaed] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
                    <h2 className="text-xl sm:text-[22px] font-bold text-[#202124] mb-4 tracking-tight">Need help ?</h2>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => document.getElementById('contact-coordinators')?.scrollIntoView({ behavior: 'smooth' })} className="group w-full text-left px-4 py-3 bg-[#f8fbff] border border-[#d2e3fc] rounded-lg hover:bg-[#e8f0fe] hover:border-[#aecbfa] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1a73e8] text-[14px] leading-tight">Co-ordinator</span>
                          <span className="text-[#1a73e8] text-[11px] font-bold opacity-80 mt-0.5">For Arcade Labs Issues</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white border border-[#d2e3fc] flex items-center justify-center group-hover:bg-[#1a73e8] group-hover:border-[#1a73e8] transition-colors flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-[#1a73e8] group-hover:text-white transition-colors transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>

                      <button onClick={() => document.getElementById('contact-facilitator')?.scrollIntoView({ behavior: 'smooth' })} className="group w-full text-left px-4 py-3 bg-white border border-[#dadce0] rounded-lg hover:bg-[#f8f9fa] hover:border-[#bdc1c6] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#3c4043] text-[14px] leading-tight">Contact Facilitator</span>
                          <span className="text-[#5f6368] text-[11px] font-bold mt-0.5">For General Queries</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#f1f3f4] border border-[#dadce0] flex items-center justify-center group-hover:bg-[#e8eaed] transition-colors flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-[#5f6368] transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
{/* ================= MILESTONES & SWAGS SECTION ================= */}
<section className="pt-8 pb-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
  <div className="max-w-5xl mx-auto">
    
    {/* HEADING: Bottom margin (mb-6 se mb-10) badha diya taaki box halka niche shift ho */}
    <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight mb-10 text-center">
      Milestones & Swags
    </h2>
    
    {/* MAIN BOX CONTAINER */}
    <div className="bg-white border border-[#cccccc] rounded-xl shadow-lg overflow-hidden mb-8">
      
      {/* HEADER TABS: 3 Different Colors (Teal, Blue, Gold) */}
      <div className="grid grid-cols-12 text-lg sm:text-xl font-bold text-white">
        {/* Column 1: Teal Color */}
        <div className="col-span-5 bg-[#3a6b66] flex items-center justify-center py-6 px-6">
          Users Milestone
        </div>
        
        {/* Column 2: Blue Color */}
        <div className="col-span-4 bg-[#506c8d] flex items-center justify-center py-6 px-6">
          Required Points
        </div>
        
        {/* Column 3: Gold/Tan Color */}
        <div className="col-span-3 bg-[#cdb685] flex items-center justify-center py-6 px-6">
          Expected Rewards
        </div>
      </div>

      {/* MILESTONE ROWS */}
      <div className="divide-y divide-[#e8eaed]">
        
        {/* Ultimate Milestone Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
          <div className="col-span-5 flex items-center gap-4">
            <span className="w-3 h-3 bg-[#1a73e8] rounded-full"></span>
            <span className="font-bold text-[#202124] text-lg">Ultimate Milestone</span>
          </div>
          <div className="col-span-4 text-center font-bold text-[#1a73e8] text-lg">40+ Points</div>
          <div className="col-span-3 text-center text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
        </div>

        {/* Milestone 3 Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
          <div className="col-span-5 flex items-center gap-4">
            <span className="w-3 h-3 bg-[#fbbc04] rounded-full"></span>
            <span className="font-bold text-[#202124] text-lg">Milestone 3</span>
          </div>
          <div className="col-span-4 text-center font-bold text-[#b06000] text-lg">25 - 39 Points</div>
          <div className="col-span-3 text-center text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
        </div>

        {/* Milestone 2 Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
          <div className="col-span-5 flex items-center gap-4">
            <span className="w-3 h-3 bg-[#34a853] rounded-full"></span>
            <span className="font-bold text-[#202124] text-lg">Milestone 2</span>
          </div>
          <div className="col-span-4 text-center font-bold text-[#2b8a44] text-lg">15 - 24 Points</div>
          <div className="col-span-3 text-center text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
        </div>

        {/* Milestone 1 Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-[#f8f9fa] transition-colors">
          <div className="col-span-5 flex items-center gap-4">
            <span className="w-3 h-3 bg-[#ea4335] rounded-full"></span>
            <span className="font-bold text-[#202124] text-lg">Milestone 1</span>
          </div>
          <div className="col-span-4 text-center font-bold text-[#c5221f] text-lg">10 - 14 Points</div>
          <div className="col-span-3 text-center text-base text-[#5f6368] font-bold animate-pulse">Coming soon</div>
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
              @keyframes customFloatLight {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
              }
              @keyframes slowPulseScale {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              @keyframes slowPulseOpacity {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
              }
              .float-anim-1 { animation: customFloat 4s ease-in-out infinite; }
              .float-anim-2 { animation: customFloat 4s ease-in-out infinite 1s; }
              .float-anim-3 { animation: customFloat 4s ease-in-out infinite 2s; }
              .animate-float-slow { animation: customFloatLight 6s ease-in-out infinite; }
              .animate-pulse-scale-slow { animation: slowPulseScale 4s ease-in-out infinite; }
              .animate-pulse-opacity-slow { animation: slowPulseOpacity 4s ease-in-out infinite; }
            `}</style>
            
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#e8f0fe] rounded-full blur-[100px] -translate-y-1/2 opacity-60 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight">Arcade Facilitator & Team</h2>
              </div>

              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                <div className="flex flex-col items-center justify-center flex-shrink-0 md:w-5/12">
                  <div className="flex gap-6 sm:gap-8 mb-4">
                    {/* Manish Profile */}
                    <div className="flex flex-col items-center float-anim-1">
                      <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="w-40 h-40 sm:w-44 sm:h-44 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 block relative" style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
                        <img src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg" alt="Manish" className="w-full h-full object-cover object-top" style={{ imageRendering: "high-quality" }} />
                      </a>
                      <div className="mt-5 text-center">
                        <h4 className="font-bold text-[#202124] text-[17px]">Manish</h4>
                        <div className="inline-block mt-1 bg-[#e8f0fe] border border-[#d2e3fc] px-3 py-1 rounded-md shadow-sm">
                          <span className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wide">Arcade Facilitator</span>
                        </div>
                      </div>
                    </div>

                    {/* Anjali Profile */}
                    <div className="flex flex-col items-center float-anim-2">
                      <a href="https://www.linkedin.com/in/anjali-p-a2ba1419b" target="_blank" rel="noopener noreferrer" className="w-40 h-40 sm:w-44 sm:h-44 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 block relative" style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
                        <img src="https://i.postimg.cc/Nf2ykWb1/1000111442.png" alt="Anjali" className="w-full h-full object-cover object-top" style={{ imageRendering: "high-quality" }} />
                      </a>
                      <div className="mt-5 text-center">
                        <h4 className="font-bold text-[#202124] text-[17px]">Anjali</h4>
                        <div className="inline-block mt-1 bg-[#fef7e0] border border-[#fde293] px-3 py-1 rounded-md shadow-sm">
                          <span className="text-[11px] font-bold text-[#b06000] uppercase tracking-wide">Arcade Facilitator</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rohit Profile */}
                  <div className="flex flex-col items-center float-anim-3 -mt-4 relative z-20">
                    <a href="https://www.linkedin.com/in/rohit-kumar-b482752ab" target="_blank" rel="noopener noreferrer" className="w-40 h-40 sm:w-44 sm:h-44 rounded-full shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300 block relative" style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
                      <img src="https://i.postimg.cc/cHVvphLB/IMG-20260222-221651.jpg" alt="Rohit" className="w-full h-full object-cover object-top" style={{ imageRendering: "high-quality" }} />
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

          {/* ================= 🔥 CONTACT CO-ORDINATORS SECTION 🔥 ================= */}
          <section id="contact-coordinators" className="py-24 px-6 bg-[#f8fbff] border-b border-[#d2e3fc] relative">
            <div className="max-w-6xl mx-auto z-10 relative">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight mb-3">Need help ?</h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto font-bold">
                  Facing any issue with labs or GSP tracking? Reach out to our dedicated co-ordinators directly.
                </p>
              </div>

              {/* Smaller Cards with Sleek Grey Pill Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {contactCoordinators.map((coord, idx) => (
                  <div key={idx} className="bg-white border border-[#e8eaed] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex flex-col">
                        <h3 className="text-[17px] font-bold text-[#202124]">{coord.name}</h3>
                        <span className="text-[10px] font-bold text-[#5f6368] bg-[#f1f3f4] border border-[#dadce0] px-2 py-1 rounded-full w-fit mt-1.5 uppercase tracking-wide">Co-ordinator</span>
                      </div>
                      <a href={coord.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] hover:text-[#004182] transition-colors" title="View LinkedIn Profile">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    </div>
                    
                    <button onClick={() => setSelectedCoordinator(coord)} className="w-full py-2 bg-[#f8f9fa] border border-[#dadce0] text-[#3c4043] font-bold text-sm rounded-full hover:bg-[#e8eaed] hover:text-[#202124] transition-all flex items-center justify-center tracking-wide">
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 🔥 MODAL FOR CO-ORDINATOR FORM 🔥 */}
          {selectedCoordinator && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white border border-[#dadce0] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
                
                <div className="bg-[#f8f9fa] border-b border-[#e8eaed] p-5 flex justify-between items-center">
                  <h3 className="font-bold text-[#202124] text-lg flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#1a73e8] rounded-full"></span>
                    Contact {selectedCoordinator.name}
                  </h3>
                  <button onClick={() => setSelectedCoordinator(null)} className="text-[#5f6368] hover:text-[#202124] transition-colors focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-[#5f6368] uppercase mb-1.5">Enter Labs Name</label>
                    <input type="text" value={coordinatorForm.name} onChange={(e) => setCoordinatorForm({...coordinatorForm, name: e.target.value})} placeholder="e.g. Share Data Using Google Data Cloud" className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[15px] font-bold text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#5f6368] uppercase mb-1.5">GSP No.</label>
                    <input type="text" value={coordinatorForm.gsp} onChange={(e) => setCoordinatorForm({...coordinatorForm, gsp: e.target.value})} placeholder="e.g. GSP398" className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[15px] font-bold text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:bg-white transition-colors uppercase" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#5f6368] uppercase mb-1.5">Problem / Query</label>
                    <textarea value={coordinatorForm.query} onChange={(e) => setCoordinatorForm({...coordinatorForm, query: e.target.value})} placeholder="Describe your lab issue briefly..." rows={3} className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[15px] font-bold text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:bg-white transition-colors resize-none"></textarea>
                  </div>
                  <button onClick={handleCoordinatorSubmit} className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm rounded-md shadow-sm transition-colors flex items-center justify-center mt-2 tracking-wide">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

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