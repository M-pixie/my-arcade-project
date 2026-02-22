"use client";

import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

// NEW: Official FAQ Data
const officialFaqs = [
  {
    question: "When is the Arcade Facilitator program starting?",
    answer: "The Arcade Facilitator program is an ongoing initiative. Different cohorts and milestones are announced periodically. Keep an eye on your email or the official community channels for specific start and end dates of the active cohort."
  },
  {
    question: "How do I enroll in the program?",
    answer: "You can enroll using the official enrollment form provided by Google Cloud. Ensure you have a Google Cloud Skills Boost account and a public profile URL ready before you fill out the form."
  },
  {
    question: "I completed a lab, but my points are not updating?",
    answer: "Points can take up to 24-48 hours to reflect on your profile. Ensure that you have completed the lab within the active program dates and that your public profile is correctly linked."
  },
  {
    question: "How can I claim swags?",
    answer: "Once the program cohort ends, the Google Cloud team will calculate your final points based on your milestones. If you qualify for a prize tier, you will receive an email with instructions on how to claim your swags from the prize counter."
  },
  {
    question: "What if my Google Cloud Skills Boost profile is not public?",
    answer: "If your profile is not public, your points cannot be tracked, and you will not be eligible for rewards. You must go to your profile settings in Cloud Skills Boost and ensure 'Make Profile Public' is enabled."
  },
  {
    question: "Who can participate in this program?",
    answer: "The program is generally open to anyone interested in learning Google Cloud technologies. However, you must meet the age requirements and any geographic restrictions specified in the official terms and conditions."
  }
];

export default function FacilitatorPage() {
  const router = useRouter();
  
  // NEW: State for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Team data array - UPDATED WITH INITIALS AND LINKEDIN LINKS!
  const teamMembers = [
    { 
      name: "Manish", 
      role: "Arcade Facilitator", 
      initials: "M", 
      linkedin: "https://linkedin.com/in/manish-ui", 
      color: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]" 
    },
    { 
      name: "Anjali", 
      role: "Arcade Facilitator", 
      initials: "A", 
      linkedin: "https://www.linkedin.com/in/anjali..", 
      color: "bg-[#fef7e0] text-[#b06000] border-[#fde293]" 
    },
    { 
      name: "Preeti", 
      role: "Community Lead", 
      initials: "P", 
      linkedin: "https://www.linkedin.com/in/preeti-patel-a91406331", 
      color: "bg-[#e6f4ea] text-[#137333] border-[#ceead6]" 
    },
    { 
      name: "Rohit", 
      role: "Google Cloud Labs Lead", 
      initials: "R", 
      linkedin: "https://www.linkedin.com/in/rohit-kumar-b482752ab", 
      color: "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]" 
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#202124] font-sans">
      <Navbar />

      <main className="pt-20">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative border-b border-[#dadce0] bg-[#f8f9fa] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#dadce0] text-[#5f6368] text-xs font-bold mb-6 uppercase tracking-widest rounded-sm">
                <span className="w-2 h-2 bg-[#34a853] rounded-sm"></span>
                Facilitator 2026
              </div>
              
              <h1 className="text-4xl md:text-6xl font-normal text-[#202124] tracking-tight mb-6 leading-[1.1]">
                Google Cloud Arcade <br />
                <span className="font-medium text-[#1a73e8]">Facilitator Program</span>
              </h1>
              
              <p className="text-[#5f6368] text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                Kickstart your cloud journey, learn new skills on Google Cloud Platform, and win exciting exclusive Google Cloud swags by completing milestones.
              </p>

              {/* THREE BUTTONS IN A ROW */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a 
                  href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-base font-medium rounded-sm shadow-sm transition-all text-center focus:outline-none"
                >
                  Enroll Now
                </a>
                <a 
                  href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#1a73e8] text-[#1a73e8] text-base font-medium rounded-sm transition-all text-center focus:outline-none"
                >
                  Points System
                </a>
                {/* NEW CALCULATOR BUTTON */}
                <button 
                  onClick={() => router.push("/calculator")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#1a73e8] text-[#1a73e8] text-base font-medium rounded-sm transition-all text-center focus:outline-none"
                >
                  Open Calculator
                </button>
              </div>
            </div>

            {/* Hero Graphic / Illustration Placeholder */}
            <div className="flex-1 w-full max-w-md relative z-10 hidden md:block">
              {/* Techy dotted background container */}
              <div 
                className="aspect-square bg-white border border-[#dadce0] rounded-sm shadow-sm p-6 relative overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(#dadce0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              >
                
                {/* Center: Main GCP / Cloud Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-48 h-48 bg-[#e8f0fe] rounded-full opacity-50 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-white border-[4px] border-[#1a73e8] rounded-full flex items-center justify-center shadow-lg z-20">
                    <svg className="w-14 h-14 text-[#1a73e8]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      {/* Cloud Icon representing GCP */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                      <polyline strokeLinecap="round" strokeLinejoin="round" points="12 11 12 15 15 15" />
                    </svg>
                  </div>
                </div>

                {/* Floating Element 1: Labs / Terminal (Google Green) */}
                <div className="absolute top-10 left-10 bg-white p-3 border border-[#dadce0] rounded-sm shadow-md z-30 animate-[bounce_4s_infinite]">
                  <div className="bg-[#e6f4ea] p-2 rounded-sm">
                    <svg className="w-6 h-6 text-[#34a853]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="4 17 10 11 4 5"></polyline>
                      <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                  </div>
                </div>

                {/* Floating Element 2: Swag / T-Shirt (Google Red) */}
                <div className="absolute top-14 right-8 bg-white p-3 border border-[#dadce0] rounded-sm shadow-md z-30 animate-[bounce_5s_infinite_reverse]">
                  <div className="bg-[#fce8e6] p-2 rounded-sm">
                    <svg className="w-6 h-6 text-[#ea4335]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.38 3.46L16 2a8 8 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
                    </svg>
                  </div>
                </div>

                {/* Floating Element 3: Swag / Gift Box (Google Yellow) */}
                <div className="absolute bottom-12 right-12 bg-white p-3 border border-[#dadce0] rounded-sm shadow-md z-30 animate-[bounce_6s_infinite]">
                  <div className="bg-[#fef7e0] p-2 rounded-sm">
                    <svg className="w-6 h-6 text-[#fbbc04]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                      <path d="M12 8v13"></path>
                      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
                    </svg>
                  </div>
                </div>

                {/* Floating Element 4: Badges / Shield (Google Blue) */}
                <div className="absolute bottom-16 left-8 bg-white p-3 border border-[#dadce0] rounded-sm shadow-md z-30 animate-[bounce_4.5s_infinite_reverse]">
                  <div className="bg-[#e8f0fe] p-2 rounded-sm">
                    <svg className="w-6 h-6 text-[#1a73e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS / ABOUT ================= */}
        <section className="py-24 px-6 border-b border-[#dadce0] bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-normal text-[#202124] tracking-tight mb-4">Arcade Facilitator Program ?</h2>
              <p className="text-[#5f6368] max-w-2xl mx-auto">
                The Arcade Facilitator Program is an always-on, no-cost gaming campaign where technical practitioners of all levels can learn new cloud skills like computing, application development, big data & AI/ML and earn digital badges & points to use towards claiming swag prizes and Google Cloud goodies. 
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Learn Google Cloud Skills ", icon: "📚", color: "text-[#1a73e8]", bg: "bg-[#e8f0fe]", border: "border-[#d2e3fc]", desc: "Access free Qwiklabs credits and start learning Google Cloud basics, Gen AI, and Big Data." },
                { title: "Earn Cloud Skill Badges", icon: "🎖️", color: "text-[#fbbc04]", bg: "bg-[#fef7e0]", border: "border-[#fde293]", desc: "Complete quests and skill badges on Google Cloud Skills Boost to earn Arcade Points." },
                { title: "Win Google Cloud Swags", icon: "🎁", color: "text-[#34a853]", bg: "bg-[#e6f4ea]", border: "border-[#ceead6]", desc: "Accumulate points and redeem them at the prize counter for official Google Cloud swags." }
              ].map((item, index) => (
                <div key={index} className="p-8 border border-[#dadce0] rounded-sm hover:shadow-sm transition-shadow bg-white">
                  <div className={`w-14 h-14 ${item.bg} ${item.border} border rounded-sm flex items-center justify-center text-2xl mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium text-[#202124] mb-3">{item.title}</h3>
                  <p className="text-[#5f6368] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MILESTONES & REWARDS (TABLE STYLE) ================= */}
        <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-normal text-[#202124] tracking-tight mb-10 text-center">Milestones & Swags</h2>
            
            <div className="bg-white border border-[#dadce0] rounded-sm shadow-sm overflow-hidden mb-6">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-[#dadce0] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                <div className="col-span-4">Users Milestone</div>
                <div className="col-span-4 text-center">Required Points</div>
                <div className="col-span-4 text-right">Expected Rewards</div>
              </div>

              <div className="divide-y divide-[#dadce0]">
                {/* Premium Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#1a73e8] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Ultimate Milestone</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#1a73e8]">40+ Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>

                {/* Premium Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#fbbc04] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Milestone 3</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#fbbc04]">25 - 39 Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>

                {/* Advanced Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#34a853] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Milestone 2</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#34a853]">15 - 24 Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>

                {/* Standard Tier */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#ea4335] rounded-sm"></span>
                    <span className="font-medium text-[#202124]">Milestone 1</span>
                  </div>
                  <div className="col-span-4 text-center font-semibold text-[#ea4335]">10 - 14 Points</div>
                  <div className="col-span-4 text-right text-sm text-[#5f6368]">Coming soon..</div>
                </div>
              </div>
            </div>
            
            {/* MOVING MARQUEE TEXT */}
            <div className="overflow-hidden bg-[#e8f0fe] border border-[#d2e3fc] rounded-sm py-2 mb-6 w-full whitespace-nowrap">
              {/* Animation CSS directly injected */}
              <style>{`
                @keyframes scroll-text {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-scroll-text {
                  display: inline-block;
                  animation: scroll-text 15s linear infinite;
                  will-change: transform;
                }
              `}</style>
              
              {/* Sirf Ek Text Line */}
              <div className="animate-scroll-text w-full text-sm font-medium text-[#1a73e8] px-4">
                * Rewards are subject to change and availability by Google Cloud. Points must be earned in the active cohort. Please refer to official guidelines.
              </div>
            </div>
          </div>
        </section>

        {/* ================= TEAM SECTION (INITIALS + LINKEDIN) ================= */}
        <section className="py-24 px-6 bg-white border-b border-[#dadce0]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-normal text-[#202124] tracking-tight mb-4"> [ Meet Our Arcade Team ]</h2>
              <p className="text-[#5f6368] max-w-2xl mx-auto">
                Connect with the people driving the Arcade Facilitator Program in our community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <a 
                  key={index} 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white border border-[#dadce0] rounded-sm p-8 text-center hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] hover:border-[#1a73e8] transition-all duration-200"
                >
                  
                  {/* Clean Initial Avatar (Reverted to Initials) */}
                  <div className={`w-16 h-16 mx-auto rounded-sm border flex items-center justify-center text-xl font-medium mb-5 ${member.color}`}>
                    {member.initials}
                  </div>
                  
                  <h3 className="text-lg font-medium text-[#202124] mb-1 group-hover:text-[#1a73e8] transition-colors">{member.name}</h3>
                  <p className="text-xs text-[#5f6368] font-medium tracking-wider uppercase mb-5">{member.role}</p>

                  {/* LinkedIn Mini Icon */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-[#f8f9fa] border border-[#dadce0] group-hover:bg-[#e8f0fe] group-hover:border-[#d2e3fc] transition-colors">
                    <svg className="w-4 h-4 fill-[#5f6368] group-hover:fill-[#1a73e8] transition-colors" viewBox="0 0 24 24">
                       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* ================= NEW: FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-normal text-[#202124] tracking-tight">Frequently Asked Questions</h2>
              <p className="text-[#5f6368] mt-2 text-sm">Find answers to common questions about the Arcade Facilitator Program.</p>
            </div>
            
            <div className="border border-[#dadce0] rounded-sm bg-white divide-y divide-[#dadce0] shadow-sm">
              {officialFaqs.map((faq, index) => (
                <div key={index} className="overflow-hidden bg-white">
                  <button
                    className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-[#f8f9fa] transition-colors gap-4 focus:outline-none"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="text-[#202124] font-medium text-base md:text-lg leading-snug">
                      {faq.question}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-[#5f6368] flex-shrink-0 transform transition-transform duration-300 ease-in-out ${openFaqIndex === index ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 pt-0 bg-white text-[#5f6368] text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
               <a 
                 href="https://rsvp.withgoogle.com/events/arcade-facilitator/faqs" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-sm font-medium text-[#1a73e8] hover:underline"
               >
                 View all FAQs on official site
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
               </a>
            </div>
          </div>
        </section>

      </main>

      {/* ================= MINIMAL FOOTER ================= */}
      <footer className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#5f6368] text-sm text-center md:text-left">
            <p>© {new Date().getFullYear()} Arcade Nexus. Independent Community Tool.</p>
          </div>
          <div className="flex gap-4">
            
            {/* Home Button with Tooltip */}
            <div className="relative group">
              <button onClick={() => router.push("/")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline focus:outline-none">
                Home
              </button>
              {/* Black Popup (Tooltip) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#202124] text-white text-xs font-medium whitespace-nowrap rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-md">
                Go to Homepage
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#202124]"></div>
              </div>
            </div>

            {/* Calculator Button with Tooltip */}
            <div className="relative group">
              <button onClick={() => router.push("/calculator")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline focus:outline-none">
                Calculator
              </button>
              {/* Black Popup (Tooltip) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#202124] text-white text-xs font-medium whitespace-nowrap rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-md">
                Open Calculator
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#202124]"></div>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}