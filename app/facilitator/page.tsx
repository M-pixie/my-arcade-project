"use client";

import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 🔥 UPDATED: Official FAQ Data from Google Cloud Arcade Site
const officialFaqs = [
  {
    question: "When is the Arcade Facilitator program starting?",
    answer: "The Arcade Facilitator program is an ongoing initiative. Different cohorts and milestones are announced periodically. Keep an eye on your email or the official community channels for specific start and end dates of the active cohort."
  },
  {
    question: "How do I enrol in the program?",
    answer: "You can enrol using the official enrolment form provided by Google Cloud. Ensure you have a Google Cloud Skills Boost account and a public profile URL ready before you fill out the form."
  },
  {
    question: "What is the eligibility criteria for enrolling in the program?",
    answer: "To participate, you must be 18 years or older at the time of account creation. You also need a valid Google Cloud Skills Boost account with your profile set to 'Public' to track your progress."
  },
  {
    question: "How many labs can I complete on Google Cloud Skills Boost in a span of 24 hours?",
    answer: "There is a strict daily maximum limit of 15 labs within a 24-hour period. If you reach this limit, you will see a 'Quota Expired' message and must wait until the next day for the limit to reset."
  },
  {
    question: "I did not receive an invitation email after applying through the enrolment form. What should I do?",
    answer: "Please check your Spam or Promotions folder. If you submitted the enrolment form correctly with your Facilitator's referral code and a valid Public Profile URL, your enrolment is registered even if the confirmation email is delayed. You can start completing labs!"
  },
  {
    question: "I have achieved all the milestones in the program. Will I get the Bonus Points associated with each of them?",
    answer: "No, you will only receive the Bonus Points associated with the highest milestone you have achieved at the end of the cohort. Bonus points are not cumulative."
  },
  {
    question: "Why does my Google Cloud Skills Boost page show a red banner with 'Quota Expired'?",
    answer: "This usually happens when you have exhausted your 15-lab daily limit or if the system detects rapid lab completions (speed-running). Please wait 24-48 hours for the quota to automatically replenish."
  },
  {
    question: "I am stuck! I need help with Google Cloud Skills Boost, what should I do?",
    answer: "If you face a technical glitch inside a specific lab, you can use the 'Help' or 'Chat' option within the Google Cloud Skills Boost lab interface to reach out to the official technical support team directly."
  },
  {
    question: "How to find my Google Cloud Skills Boost Public Profile URL?",
    answer: "Go to your Google Cloud Skills Boost account, click on your profile avatar, and select 'Profile'. Click on 'Make Profile Public' if it isn't already. Once public, copy the URL from your browser's address bar."
  },
  {
    question: "I completed a lab, but my points are not updating?",
    answer: "Points can take up to 24-48 hours to reflect on your profile. Ensure that you have completed the lab within the active program dates and that your public profile is correctly linked."
  },
  {
    question: "I have completed few/all of the milestones. When will I get my prizes?",
    answer: "Once the program cohort ends, the Google Cloud team will calculate your final points. If you qualify for a prize tier, you will receive an email with instructions on how to claim your swags from the prize counter. Delivery happens after you claim them."
  },
  {
    question: "Are users who participated in any other cloud campaigns eligible for the program?",
    answer: "Yes, users who are participating in other individual Google Cloud campaigns or the standard Arcade can also participate in the Facilitator Program, provided they meet the standard eligibility criteria."
  }
];

export default function FacilitatorPage() {
  const router = useRouter();
  
  // State for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 🔥 NEW: State for Community Lead WhatsApp Form 🔥
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    issue: "Community / Group Issue"
  });

  const handleLeadWhatsAppSubmit = () => {
    if (!leadForm.name || !leadForm.email) {
      alert("Please fill your Name and Email.");
      return;
    }
    const message = `Hello Preeti Patel,%0A%0A*Name:* ${leadForm.name}%0A*Email:* ${leadForm.email}%0A*Issue Type:* ${leadForm.issue}%0A%0AI need some help regarding this. Please guide me.`;
    window.open(`https://wa.me/917080203742?text=${message}`, "_blank");
    setShowLeadForm(false);
  };

  // TEAM DATA
  const teamMembers = [
    { 
      name: "Manish", 
      role: "Arcade Facilitator", 
      image: "https://i.postimg.cc/L4tXVMs8/IMG-20241228-094816.jpg", 
      initials: "M",
      linkedin: "https://linkedin.com/in/manish-ui", 
      color: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]" 
    },
    { 
      name: "Anjali", 
      role: "Arcade Facilitator", 
      image: "https://i.postimg.cc/Nf2ykWb1/1000111442.png", 
      initials: "A",
      linkedin: "https://www.linkedin.com/in/anjali-p-a2ba1419b", 
      color: "bg-[#fef7e0] text-[#b06000] border-[#fde293]" 
    },
    { 
      name: "Rohit", 
      role: "Google Cloud Labs Lead", 
      image: "https://i.postimg.cc/cHVvphLB/IMG-20260222-221651.jpg",
      initials: "R", 
      linkedin: "https://www.linkedin.com/in/rohit-kumar-b482752ab", 
      color: "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]" 
    }
  ];

  // COORDINATORS DATA
  const coordinatorsData = [
    { name: "Disha Shukla", linkedin: "https://www.linkedin.com/in/disha-shukla-90a88a298", badges: "85+", points: "95", profileUrl: "https://www.skills.google/public_profiles/b2233758-bfb0-41e3-bc41-85d89d7bb1de" },
    { name: "Vaibhav Raj", linkedin: "https://www.linkedin.com/in/vaibhav-raj-0a9477285", badges: "90+", points: "98", profileUrl: "https://www.skills.google/public_profiles/a0122dd1-ef1a-4092-9845-af2c6c7bb7d2" },
    { name: "Milan Deori", linkedin: "https://www.linkedin.com/in/milan-deori-939a832a1", badges: "70+", points: "105", profileUrl: "https://www.cloudskillsboost.google/public_profiles/d0df0491-5dca-4c7b-9b0e-c8144752f0b5" },
    { name: "Jayanta Ghosh", linkedin: "https://www.linkedin.com/in/jayantaghosh2004", badges: "120+", points: "100", profileUrl: " https://www.skills.google/public_profiles/4594551b-ab3b-4e2b-afe0-fd776ba8fd57" },
    { name: "Rajiv Ranjan Malviya", linkedin: "https://www.linkedin.com/in/rajivmalviya", badges: "72+", points: "98", profileUrl: "https://www.skills.google/public_profiles/f270e397-82a1-4f30-88d1-484c46ab24f8" },
    { name: "Ataul Rahman", linkedin: "https://www.linkedin.com/in/ataul-rahman", badges: "56+", points: "103", profileUrl: "https://www.skills.google/public_profiles/3b11619a-40bc-452f-ac49-6bcc2292010b" },
    { name: "Santu Kumar", linkedin: "https://www.linkedin.com/in/santu-kumar-163a17279", badges: "125+", points: "92", profileUrl: "https://www.skills.google/public_profiles/b384c49b-874a-48a3-9c0f-a34b61f15a47" }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#fcfcfc] text-[#202124] font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8]">
        <Navbar />

        <main className="pt-20">
          
          {/* ================= PREMIUM HERO SECTION ================= */}
          <section className="relative border-b border-[#dadce0] bg-gradient-to-b from-[#f0f4f8] to-[#ffffff] overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#4285F4] opacity-[0.04] blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[#34A853] opacity-[0.04] blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center justify-center relative z-10">
              
              <div className="flex-1 text-center w-full max-w-5xl mx-auto mb-10">
                
                {/* 🔥 ULTRA PREMIUM BADGE (BLINKING 'Coming Soon') 🔥 */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-[#e8f0fe] mb-6 cursor-default hover:shadow-md hover:border-[#d2e3fc] transition-all duration-300">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea4335] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ea4335]"></span>
                  </span>
                  <span className="font-sans text-xs font-bold text-[#202124] tracking-wide uppercase flex items-center gap-1">
                    FACILITATOR  
                    <span className="ml-1 text-[#1a73e8] font-black animate-pulse">Coming Soon..</span>
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#1f2937] tracking-tight mb-6 leading-[1.1]">
                  Facilitator <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] via-[#4285f4] to-[#1a73e8]">Program</span>
                </h1>
                
                <p className="text-[#5f6368] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
                  Kickstart your cloud journey, learn new skills on Google Cloud Platform, and win exciting exclusive Google Cloud swags by completing milestones.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <a 
                    href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] text-white font-medium text-[15px] sm:text-base rounded-lg hover:bg-[#1557b0] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 group"
                  >
                    Enroll Now
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                  
                  <a 
                    href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#3c4043] border border-[#dadce0] font-medium text-[15px] sm:text-base rounded-lg hover:bg-[#f8f9fa] hover:border-[#1a73e8] hover:text-[#1a73e8] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 focus:outline-none flex items-center justify-center gap-2"
                  >
                    Points System
                  </a>
                  
                  <button 
                    onClick={() => router.push("/calculator")}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#34a853] text-white font-medium text-[15px] sm:text-base rounded-lg hover:bg-[#2b8a44] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    Open Calculator
                  </button>
                </div>
              </div>

              {/* PREMIUM INFO BOXES */}
              <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-white border border-[#e8eaed] rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-xl sm:text-[22px] font-semibold text-[#202124] mb-6 tracking-tight">Facilitator Program Highlights</h2>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-[15px] font-bold text-[#3c4043]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]"></span>
                        No-cost gaming campaign
                      </li>
                      <li className="flex items-center gap-3 text-[15px] font-bold text-[#3c4043]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]"></span>
                        Learn in-demand cloud skills
                      </li>
                      <li className="flex items-center gap-3 text-[15px] font-bold text-[#3c4043]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4285f4]"></span>
                        Earn digital badges & points
                      </li>
                      <li className="flex items-center gap-3 text-[15px] font-bold text-[#3c4043]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]"></span>
                        Claim swag & Google Cloud goodies
                      </li>
                    </ul>
                  </div>

                  {/* 🔥 BLINKING REGISTRATION STATUS 🔥 */}
                  <div className="bg-white border border-[#e8eaed] rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                    <h2 className="text-xl sm:text-[22px] font-semibold text-[#202124] mb-6 tracking-tight">Registration Status</h2>
                    <div className="w-full bg-[#1a73e8] text-white text-center font-bold py-3.5 rounded-md mb-4 shadow-sm text-[15px] animate-pulse">
                      Enrolments Opening Soon
                    </div>
                    <p className="text-[#5f6368] text-sm font-medium text-center mb-auto pb-4">
                      Enrolments are expected to open in March 2026 in the Arcade Facilitator Program
                    </p>
                    <a href="#" className="w-full bg-gradient-to-r from-[#1a73e8] to-[#1557b0] text-white flex items-center justify-center gap-2 py-3.5 rounded-md font-bold text-[15px] hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      Learn more about this program
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* 🔥 BLINKING REFERRAL CODE 🔥 */}
                  <div className="md:col-span-2 bg-white border border-[#e8eaed] rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
                    <h2 className="text-xl sm:text-[22px] font-semibold text-[#202124] mb-6 tracking-tight">Facilitator Referral Code</h2>
                    <div className="bg-gradient-to-r from-[#1a73e8] to-[#1557b0] rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                      <div className="font-mono text-xl sm:text-[22px] text-white font-bold tracking-[0.1em]">
                        ********-**-***-***
                      </div>
                      <button className="bg-white/20 text-white border border-white/30 font-semibold px-6 py-2.5 rounded-md text-sm cursor-not-allowed backdrop-blur-sm animate-pulse">
                        Coming Soon
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#e8eaed] rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-xl sm:text-[22px] font-semibold text-[#202124] mb-6 tracking-tight">Key Dates</h2>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#d2e3fc] bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-[#202124]">Registration Opens</p>
                          <p className="text-[13px] font-medium text-[#5f6368] mt-0.5 animate-pulse text-[#1a73e8]">To be announced</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#fad2cf] bg-[#fce8e6] flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-[#202124]">Program Ends</p>
                          <p className="text-[13px] font-medium text-[#5f6368] mt-0.5 animate-pulse text-[#ea4335]">To be announced</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ================= MILESTONES & SWAGS (With Important Note) ================= */}
          <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#202124] tracking-tight mb-8 text-center">Milestones & Swags</h2>
              
              <div className="bg-white border border-[#e8eaed] rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f1f3f4] border-b border-[#e8eaed] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  <div className="col-span-5">Users Milestone</div>
                  <div className="col-span-4 text-center">Required Points</div>
                  <div className="col-span-3 text-right">Expected Rewards</div>
                </div>

                <div className="divide-y divide-[#e8eaed]">
                  <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#1a73e8] rounded-full"></span>
                      <span className="font-semibold text-[#202124] text-base">Ultimate Milestone</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#1a73e8] text-base">40+ Points</div>
                    <div className="col-span-3 text-right text-sm text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#fbbc04] rounded-full"></span>
                      <span className="font-semibold text-[#202124] text-base">Milestone 3</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#b06000] text-base">25 - 39 Points</div>
                    <div className="col-span-3 text-right text-sm text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#34a853] rounded-full"></span>
                      <span className="font-semibold text-[#202124] text-base">Milestone 2</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#2b8a44] text-base">15 - 24 Points</div>
                    <div className="col-span-3 text-right text-sm text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                    <div className="col-span-5 flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#ea4335] rounded-full"></span>
                      <span className="font-semibold text-[#202124] text-base">Milestone 1</span>
                    </div>
                    <div className="col-span-4 text-center font-bold text-[#c5221f] text-base">10 - 14 Points</div>
                    <div className="col-span-3 text-right text-sm text-[#5f6368] font-bold animate-pulse">Coming soon</div>
                  </div>
                </div>
              </div>

              {/* 🔥 MOVED AND IMPROVED: Important Note 🔥 */}
              <div className="bg-[#fce8e6] border border-[#fad2cf] rounded-xl p-6 shadow-sm flex items-start sm:items-center gap-5 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-white border border-[#fad2cf] flex items-center justify-center flex-shrink-0 text-2xl text-[#ea4335] font-black shadow-sm">
                  !
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#c5221f] mb-1 uppercase tracking-wide">Important Note</h4>
                  <p className="text-[#3c4043] text-[15px] font-medium leading-relaxed">
                    Earning any of the milestones above does <strong className="text-[#ea4335]">NOT</strong> make you eligible for any swags/prizes alone. In this program, you are earning "Bonus" points to add to your "Arcade" points to reach the actual Skills Boost Arcade achievements to claim prizes.
                  </p>
                </div>
              </div>

              {/* MOVING MARQUEE TEXT */}
              <div className="mt-8 overflow-hidden bg-[#e8f0fe] border border-[#d2e3fc] rounded-lg py-2.5 w-full whitespace-nowrap">
                <style>{`
                  @keyframes scroll-text {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                  }
                  .animate-scroll-text {
                    display: inline-block;
                    animation: scroll-text 20s linear infinite;
                    will-change: transform;
                  }
                `}</style>
                <div className="animate-scroll-text w-full text-sm font-bold text-[#1a73e8] px-4">
                  ⭐ Rewards are subject to change and availability by Google Cloud. Points must be earned in the active cohort. Please refer to official guidelines. ⭐
                </div>
              </div>

            </div>
          </section>

          {/* ================= HOW IT WORKS / ABOUT FACILITATOR ================= */}
          <section className="py-24 px-6 border-b border-[#dadce0] bg-white relative">
            <div className="max-w-6xl mx-auto">
              
              {/* 🔥 NEW HEADING 🔥 */}
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-[#202124] tracking-tight">Arcade Facilitator</h2>
                <div className="w-24 h-1.5 bg-[#1a73e8] mx-auto mt-4 rounded-full"></div>
              </div>

              {/* PREMIUM FACILITATOR PORTFOLIO BOX */}
              <div className="max-w-4xl mx-auto bg-white border border-[#e8eaed] rounded-xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8f0fe] rounded-full blur-[80px] -z-10 opacity-30"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 z-10 relative pt-4">
                  
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-32 h-40 rounded-lg overflow-hidden border border-[#dadce0] mb-5 relative group/img cursor-pointer shadow-sm">
                      <img 
                        src="https://i.postimg.cc/L4tXVMs8/IMG-20241228-094816.jpg" 
                        alt="Manish Kumar" 
                        className="w-full h-full object-cover object-top transform group-hover/img:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-[#202124]">Manish Kumar</h3>
                    <p className="text-xs font-bold text-[#1a73e8] bg-[#e8f0fe] border border-[#d2e3fc] px-3 py-1 rounded-full mt-2 tracking-wide uppercase">Arcade Facilitator</p>
                    
                    <a 
                      href="https://linkedin.com/in/manish-ui" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#0a66c2] hover:bg-[#004182] px-5 py-2.5 rounded-lg transition-colors w-full shadow-sm"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Connect
                    </a>
                  </div>

                  <div className="flex-1">
                    <p className="text-[#3c4043] text-base leading-relaxed mb-8 text-center md:text-left">
                      As a dedicated Google Cloud Arcade Facilitator in 2025, Manish has demonstrated exceptional leadership by securing the prestigious Ultimate Milestone Winner title in both Cohort 1 and Cohort 2. He is passionate about empowering the community and has successfully helped individuals upskill, earn certifications, and claim official Google Cloud swags.
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 mt-6 bg-[#f8f9fa] p-5 rounded-xl border border-[#e8eaed]">
                      {[
                        { icon: "🏆", title: "2x Ultimate", subtitle: "Cohort 1 & 2" },
                        { icon: "👥", title: "2000+", subtitle: "People Guided" },
                        { icon: "⭐", title: "20+", subtitle: "Coordinators" },
                        { icon: "🎁", title: "Gifts & Certs", subtitle: "Distributed" }
                      ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center group cursor-default">
                          <div className="text-2xl mb-2 transform group-hover:-translate-y-1 transition-transform duration-300">{stat.icon}</div>
                          <div className="font-bold text-[#202124] text-[15px]">{stat.title}</div>
                          <div className="text-[10px] font-semibold text-[#5f6368] uppercase tracking-wider mt-1">{stat.subtitle}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* CONTACT FACILITATOR SECTION */}
              <div className="mt-16 bg-white border border-[#e8eaed] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-md transition-shadow duration-300 max-w-4xl mx-auto">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#202124] mb-3 flex items-center gap-2">
                    Contact Facilitator
                    <span className="relative flex h-2.5 w-2.5 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34a853]"></span>
                    </span>
                  </h3>
                  <p className="text-[#5f6368] text-base mb-5 font-medium">Have questions? Get direct help regarding your Arcade progress.</p>
                  
                  <ul className="text-[#3c4043] text-sm md:text-base space-y-3 font-medium">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#1a73e8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      <span>Ask specific queries related to <strong>Labs, Swags, or Arcade Points</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#1a73e8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      <span>Please keep your <strong>Google Cloud Public URL</strong> ready.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#1a73e8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      <span>Kindly allow some time for a response due to high volumes.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="w-full md:w-auto text-center">
                  <a 
                    href="https://wa.me/918538980608?text=Hi%20Manish%2C%20I%20have%20a%20query%20regarding%20Google%20Cloud%20Arcade%20labs%2C%20points%2C%20or%20swags." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-base font-bold rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none hover:-translate-y-1"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* ================= TEAM SECTION ================= */}
          <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
            <div className="max-w-5xl mx-auto relative z-10">

              <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl font-bold text-[#202124] tracking-tight mb-3">
                  Meet Our Arcade Team
                </h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  Connect with the people driving the Arcade Facilitator Program in our community.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {teamMembers.map((member, index) => (
                  <div key={index} className="w-full max-w-[280px] bg-white border border-[#e8eaed] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative"
                    >
                      <div className="w-full aspect-[4/5] overflow-hidden border-b border-[#e8eaed]">
                        {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${member.color}`}>
                              {member.initials || member.name.charAt(0)}
                            </div>
                        )}
                      </div>
                      <div className="p-5 text-center bg-white relative z-10">
                        <h3 className="text-xl font-black text-[#202124] mb-2 group-hover:text-[#1a73e8] transition-colors">{member.name}</h3>
                        
                        {/* 🔥 UNIQUE ARCADE FACILITATOR TAG 🔥 */}
                        {member.role === "Arcade Facilitator" ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#e8f0fe] to-[#d2e3fc] border border-[#aecbfa] rounded-full shadow-sm">
                            <span className="text-sm">👑</span>
                            <span className="text-xs font-black text-[#1a73e8] uppercase tracking-wide">Arcade Facilitator</span>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-[#5f6368]">{member.role}</p>
                        )}
                      </div>
                    </a>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ================= 🔥 UPDATED: COMMUNITY LEAD SECTION 🔥 ================= */}
          <section className="py-24 px-6 bg-white border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl font-bold text-[#202124] tracking-tight mb-3">Arcade Community Lead</h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  Driving our community forward with dedication and support.
                </p>
              </div>

              <div className="max-w-3xl mx-auto bg-white border border-[#e8eaed] rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 hover:shadow-md transition-shadow">
                 
                 {/* Profile Info */}
                 <div className="flex flex-col items-center flex-shrink-0 text-center md:text-left md:items-start">
                    <div className="w-24 h-24 rounded-full bg-[#fef7e0] text-[#b06000] border border-[#fde293] flex items-center justify-center text-3xl font-bold mb-4 shadow-sm">
                      P
                    </div>
                    <h3 className="text-2xl font-black text-[#202124]">Preeti Patel</h3>
                    <span className="text-xs font-black text-[#b06000] bg-[#fef7e0] px-3 py-1 rounded-md mt-2 uppercase tracking-wide border border-[#fde293]">Community Lead</span>

                    <div className="flex items-center gap-3 mt-4">
                      <a href="https://www.linkedin.com/in/preeti-patel-a91406331" target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] hover:text-[#004182] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                      <a href="https://www.skills.google/public_profiles/0db81977-a509-43bd-917f-e8e9d6611ac9" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#1a73e8] hover:underline">View Profile</a>
                    </div>
                 </div>

                 <div className="flex-1 mt-2 md:mt-0 w-full flex flex-col justify-between">
                   <p className="text-[#3c4043] text-[15px] font-medium leading-relaxed text-center md:text-left">
                     As the dedicated Community Lead, Preeti spearheads community engagement initiatives, seamlessly managing group dynamics and providing unwavering support to members navigating technical labs. She plays a pivotal role in resolving queries and fostering a collaborative environment.
                   </p>

                   <div className="w-full flex flex-col sm:flex-row gap-3 mt-6">
                      <a 
                        href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#1a73e8] text-[#1a73e8] hover:bg-[#e8f0fe] text-sm font-bold rounded-lg shadow-sm transition-colors"
                      >
                        Join WhatsApp Group
                      </a>
                      
                      {/* 🔥 NEW CONTACT FORM BUTTON 🔥 */}
                      <button 
                        onClick={() => setShowLeadForm(!showLeadForm)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                      >
                        {showLeadForm ? "Close Form" : "Contact Lead"}
                      </button>
                   </div>
                 </div>
              </div>

              {/* 🔥 NEW INLINE CONTACT FORM 🔥 */}
              {showLeadForm && (
                <div className="max-w-3xl mx-auto mt-4 bg-white border border-[#dadce0] rounded-xl p-6 shadow-md transition-all duration-300 transform origin-top animate-fade-in-up">
                  <h4 className="text-lg font-bold text-[#202124] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Send Query via WhatsApp
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-[#5f6368] uppercase mb-1">Your Name</label>
                      <input 
                        type="text" 
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#5f6368] uppercase mb-1">Your Email</label>
                      <input 
                        type="email" 
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-[#5f6368] uppercase mb-1">Issue / Query Type</label>
                    <select 
                      value={leadForm.issue}
                      onChange={(e) => setLeadForm({...leadForm, issue: e.target.value})}
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="Community / Group Issue">Community / Group Issue</option>
                      <option value="Lab & Technical Issue">Lab & Technical Issue</option>
                      <option value="Arcade Points & Swags">Arcade Points & Swags</option>
                      <option value="General Program Query">General Program Query</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleLeadWhatsAppSubmit}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Submit via WhatsApp
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* ================= CO-ORDINATORS TEAM SECTION ================= */}
          <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl font-bold text-[#202124] tracking-tight mb-3">Our Expert Co-ordinators</h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  The dedicated individuals helping our community achieve their milestones.
                </p>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f1f3f4] border-b border-[#e8eaed] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  <div className="col-span-5">Coordinators</div>
                  <div className="col-span-3 text-center">Skill Badges</div>
                  <div className="col-span-2 text-center">Arcade Points</div>
                  <div className="col-span-2 text-right">Connect</div>
                </div>

                <div className="divide-y divide-[#e8eaed]">
                  {coordinatorsData.map((coord, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                      
                      <div className="col-span-1 md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <a 
                          href={coord.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-bold text-[#202124] hover:text-[#1a73e8] text-base transition-colors"
                        >
                          {coord.name}
                        </a>
                        <span className="text-[10px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-md border border-[#d2e3fc] uppercase tracking-wide">Coordinator</span>
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
                        <a 
                          href={coord.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center justify-center px-4 py-2 bg-white border border-[#dadce0] text-[#1a73e8] text-sm font-bold rounded-lg hover:bg-[#f8f9fa] transition-colors shadow-sm"
                        >
                          Profile
                        </a>
                        <a 
                          href={coord.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#0a66c2] hover:text-[#004182] transition-colors"
                          title="View LinkedIn Profile"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= 🔥 UPDATED: FREQUENTLY ASKED QUESTIONS (LARGER TEXT) 🔥 ================= */}
          <section className="py-24 px-6 bg-white border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#202124] tracking-tight">Frequently Asked Questions</h2>
                <p className="text-[#5f6368] mt-3 text-lg font-medium">Find answers to common questions about the Arcade Facilitator Program.</p>
              </div>
              
              <div className="border border-[#e8eaed] rounded-[1.5rem] bg-white divide-y divide-[#e8eaed] shadow-sm">
                {officialFaqs.map((faq, index) => (
                  <div key={index} className={`overflow-hidden bg-white ${index === 0 ? 'rounded-t-[1.5rem]' : ''} ${index === officialFaqs.length - 1 ? 'rounded-b-[1.5rem]' : ''}`}>
                    <button
                      className="w-full flex justify-between items-center p-6 sm:p-8 text-left hover:bg-[#f8f9fa] transition-colors gap-6 focus:outline-none"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    >
                      <span className="font-bold text-lg sm:text-xl text-[#202124] leading-snug">
                        {faq.question}
                      </span>
                      <svg 
                        className={`w-6 h-6 text-[#1a73e8] flex-shrink-0 transform transition-transform duration-300 ${openFaqIndex === index ? "rotate-180" : ""}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        openFaqIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-6 sm:p-8 pt-0 text-[#3c4043] text-base sm:text-lg font-medium leading-relaxed bg-[#f8fbff]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PREMIUM FAQ BUTTON */}
              <div className="mt-10 text-center">
                 <a 
                   href="https://rsvp.withgoogle.com/events/arcade-facilitator/faqs" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-base font-bold text-[#1a73e8] hover:text-[#1557b0] transition-colors group bg-[#e8f0fe] px-6 py-3 rounded-full"
                 >
                   View all FAQs on official site
                   <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                   </svg>
                 </a>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}