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
  
  // NEW: State for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 🔥 UPDATED TEAM DATA ARRAY (Only 3 members left)
  const teamMembers = [
    { 
      name: "Manish Kumar", 
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

  // 🔥 UPDATED: COORDINATORS DATA ARRAY (Preeti Patel removed, now 7 people)
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
      <div className="min-h-screen bg-white text-[#202124] font-sans">
        <Navbar />

        <main className="pt-20">
          
          {/* ================= HERO SECTION ================= */}
          <section className="relative border-b border-[#dadce0] bg-[#f8f9fa] overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 flex flex-col items-center justify-center gap-10">
              
              {/* Centered Hero Content since graphic is removed */}
              <div className="flex-1 text-center z-10 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#dadce0] text-[#5f6368] text-xs font-bold mb-6 uppercase tracking-widest rounded-sm shadow-sm hover:shadow-md transition-shadow">
                  <span className="w-2 h-2 bg-[#34a853] rounded-sm animate-pulse"></span>
                  Facilitator 2026
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#202124] tracking-tight mb-6 leading-[1.15]">
                  Google Cloud Arcade <br className="hidden sm:block" />
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] to-[#4285F4]">Facilitator Program</span>
                </h1>
                
                <p className="text-[#5f6368] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                  Kickstart your cloud journey, learn new skills on Google Cloud Platform, and win exciting exclusive Google Cloud swags by completing milestones.
                </p>

                {/* 🔥 PREMIUM GOOGLE SEARCH BOX STYLE BUTTONS 🔥 */}
                <div className="w-full max-w-[750px] mx-auto bg-white border border-[#dfe1e5] rounded-2xl sm:rounded-full shadow-sm hover:shadow-[0_1px_6px_rgba(32,33,36,.28)] hover:border-transparent transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden">
                  
                  {/* Google Search Icon (Left) */}
                  <div className="hidden sm:flex items-center justify-center pl-6 pr-2 bg-transparent">
                    <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-[#9aa0a6]">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"></path>
                    </svg>
                  </div>

                  {/* Button 1: Enroll Now */}
                  <a 
                    href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-4 sm:py-3.5 px-4 text-center text-[#3c4043] hover:text-[#1a73e8] hover:bg-[#f8f9fa] font-medium text-sm sm:text-base transition-colors border-b sm:border-b-0 sm:border-r border-[#dfe1e5] focus:outline-none flex items-center justify-center gap-2"
                  >
                    Enroll Now
                  </a>
                  
                  {/* Button 2: Points System */}
                  <a 
                    href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-4 sm:py-3.5 px-4 text-center text-[#3c4043] hover:text-[#1a73e8] hover:bg-[#f8f9fa] font-medium text-sm sm:text-base transition-colors border-b sm:border-b-0 sm:border-r border-[#dfe1e5] focus:outline-none flex items-center justify-center gap-2"
                  >
                    Points System
                  </a>
                  
                  {/* Button 3: Calculator */}
                  <button 
                    onClick={() => router.push("/calculator")}
                    className="flex-1 py-4 sm:py-3.5 px-4 text-center text-[#1a73e8] font-semibold hover:bg-[#f8f9fa] text-sm sm:text-base transition-colors focus:outline-none flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    Open Calculator
                  </button>
                  
                </div>
              </div>

            </div>
          </section>

          {/* ================= HOW IT WORKS / ABOUT ================= */}
          <section className="py-24 px-6 border-b border-[#dadce0] bg-white">
            <div className="max-w-6xl mx-auto">
              

{/* ================= PREMIUM RECTANGULAR INTRO BOX ================= */}
              <div className="mb-10 bg-white border border-[#dadce0] rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden group">
                
                {/* Clean Single Blue Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1a73e8]"></div>

                <div className="text-center relative z-10">
                  <h2 className="text-3xl font-medium text-black tracking-tight mb-10">Arcade Facilitator Program ?</h2>

                  {/* 🔥 HIGHLIGHTED PARAGRAPH BOX */}
                  <div className="max-w-4xl mx-auto text-left border-l-4 border-[#1a73e8] pl-6 md:pl-8 mb-16">
                    <p className="text-black text-base md:text-lg leading-relaxed font-medium">
                      The Arcade Facilitator Program is an always-on, no-cost gaming campaign where technical practitioners of all levels can learn new cloud skills like computing, application development, big data & AI/ML and earn digital badges & points to use towards claiming swag prizes and Google Cloud goodies. 
                    </p>
                  </div>

                  {/* 🔥 PREMIUM FACILITATOR PORTFOLIO BOX 🔥 */}
                  <div className="max-w-4xl mx-auto bg-white border border-[#dadce0] rounded-[2rem] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-left hover:shadow-md transition-all duration-500">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                      
                      {/* Facilitator Image & Title */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-32 h-40 rounded-[1.5rem] overflow-hidden shadow-sm border border-[#dadce0] mb-5 relative group/img">
                          <img 
                            src="https://i.postimg.cc/L4tXVMs8/IMG-20241228-094816.jpg" 
                            alt="Manish Kumar" 
                            className="w-full h-full object-cover object-top transform group-hover/img:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-black">Manish Kumar</h3>
                        <p className="text-sm font-semibold text-[#1a73e8] bg-[#e8f0fe] px-3 py-1 rounded-full mt-2">Arcade Facilitator</p>
                        
                        <a 
                          href="https://linkedin.com/in/manish-ui" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-black hover:text-[#1a73e8] hover:bg-[#f8f9fa] border border-[#dadce0] px-5 py-2.5 rounded-xl transition-colors w-full"
                        >
                          <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          Connect
                        </a>
                      </div>

                      {/* Achievements & Description */}
                      <div className="flex-1">
                        
                        {/* 🔥 STYLISH, ITALIC & BLACK PARAGRAPH 🔥 */}
                        <p className="text-black text-[17px] md:text-[19px] leading-relaxed mb-8 text-center md:text-left italic font-serif tracking-wide">
                          "As a dedicated <strong className="font-bold font-sans">Google Cloud Arcade Facilitator</strong> in 2025, Manish has demonstrated exceptional leadership by securing the prestigious <strong className="font-bold font-sans">Ultimate Milestone Winner</strong> title in both Cohort 1 and Cohort 2. He is passionate about empowering the community and has successfully helped individuals upskill, earn certifications, and claim official Google Cloud swags."
                        </p>
                        
                        {/* 🔥 CLEAN STATS SYMBOLS WITHOUT BOXES 🔥 */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 mt-8 border-t border-[#dadce0] pt-8">
                          {[
                            { icon: "🏆", title: "2x Ultimate", subtitle: "Cohort 1 & 2" },
                            { icon: "👥", title: "2000+", subtitle: "People Guided" },
                            { icon: "⭐", title: "20+", subtitle: "Coordinators" },
                            { icon: "🎁", title: "Gifts & Certs", subtitle: "Distributed" }
                          ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center text-center group cursor-default">
                              <div className="text-3xl mb-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                                {stat.icon}
                              </div>
                              <div className="font-bold text-black text-[16px]">{stat.title}</div>
                              <div className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mt-1">{stat.subtitle}</div>
                            </div>
                          ))}
                        </div>
                        
                      </div>

                    </div>
                  </div>

                </div>
              </div>
              {/* ================= END PREMIUM INTRO BOX ================= */}

              {/* ================= CONTACT FACILITATOR SECTION (UPDATED BG) ================= */}
              <div className="mb-16 bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                <div className="flex-1">
                  <h3 className="text-2xl font-medium text-[#202124] mb-3 flex items-center gap-2">
                    Contact Facilitator
                    <span className="relative flex h-2.5 w-2.5 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34a853]"></span>
                    </span>
                  </h3>
                  <p className="text-[#5f6368] text-sm md:text-base mb-5">Have questions? Get direct help regarding your Arcade progress.</p>
                  
                  <ul className="text-[#3c4043] text-sm md:text-base space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-[#1a73e8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Ask specific queries related to <strong>Labs, Swags, or Arcade Points</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-[#1a73e8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Please keep your <strong>Google Cloud Skills Boost Public URL</strong> ready.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-[#1a73e8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Kindly allow some time for a response due to high message volumes.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="w-full md:w-auto text-center">
                  <a 
                    href="https://wa.me/918538980608?text=Hi%20Manish%2C%20I%20have%20a%20query%20regarding%20Google%20Cloud%20Arcade%20labs%2C%20points%2C%20or%20swags." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
              {/* ================= END CONTACT FACILITATOR SECTION ================= */}

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Learn Google Cloud Skills", icon: "📚", color: "text-[#1a73e8]", bg: "bg-[#e8f0fe]", border: "border-[#d2e3fc]", desc: "Access free Qwiklabs credits and start learning Google Cloud basics, Gen AI, and Big Data." },
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

          {/* ================= MILESTONES & REWARDS ================= */}
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
                
                <div className="animate-scroll-text w-full text-sm font-medium text-[#1a73e8] px-4">
                  * Rewards are subject to change and availability by Google Cloud. Points must be earned in the active cohort. Please refer to official guidelines.
                </div>
              </div>
            </div>
          </section>

          {/* ================= TEAM SECTION ================= */}
          <section className="py-24 px-6 bg-white border-b border-[#dadce0]">
            <div className="max-w-[1000px] mx-auto relative z-10">

              {/* Premium Animations */}
              <style>{`
                @keyframes gradient-rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .animate-gradient-rotate {
                  animation: gradient-rotate 8s linear infinite;
                  width: 200%; 
                  height: 200%;
                  top: -50%;
                  left: -50%;
                }
                @keyframes shimmer-text {
                  0% { background-position: 200% center; }
                  100% { background-position: -200% center; }
                }
                .animate-shimmer-text {
                  background-size: 200% auto;
                  animation: shimmer-text 3s linear infinite;
                }
              `}</style>

              <div className="text-center mb-20 relative z-10">
                <h2 className="text-4xl md:text-5xl font-semibold text-[#202124] tracking-tight mb-4">
                  Meet Our Arcade Team
                </h2>
                <p className="text-[#5f6368] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Connect with the people driving the Arcade Facilitator Program in our community.
                </p>
                <div className="h-0.5 w-40 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] mx-auto rounded-full mt-6"></div>
              </div>

              {/* 🔥 UPDATED GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {teamMembers.map((member, index) => (
                  <a 
                    key={index} 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full max-w-[280px] rounded-2xl hover:shadow-[0_8px_30px_rgba(26,115,232,0.18)] transition-all duration-500 overflow-hidden pointer-events-auto"
                  >
                    <div className="absolute animate-gradient-rotate bg-[conic-gradient(from_0deg_at_50%_50%,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                    
                    <div className="relative h-full bg-white rounded-[14px] text-center flex flex-col items-center justify-center z-10 m-[3px] pointer-events-none">
                      
                      <div className="w-full aspect-[3/4] object-cover rounded-t-[14px] mb-4 overflow-hidden border-b border-[#dadce0]">
                        {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${member.color}`}>
                              {member.initials || member.name.charAt(0)}
                            </div>
                        )}
                      </div>

                      <div className="px-5 pb-6 flex flex-col items-center w-full">
                          <h3 className="text-lg font-bold text-[#202124] mb-2 group-hover:text-[#1a73e8] transition-colors">{member.name}</h3>

                          {member.role === "Arcade Facilitator" ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f0fe] border border-[#d2e3fc] rounded-md mb-2 shadow-sm">
                              <svg className="w-3.5 h-3.5 text-[#FBBC05] animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#1a73e8] animate-shimmer-text bg-clip-text text-transparent">
                                {member.role}
                              </span>
                            </div>
                          ) : (
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${member.color} text-[10px] font-bold uppercase tracking-widest rounded-md mb-2 text-center`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0"></span>
                              {member.role}
                            </div>
                          )}
                      </div>

                    </div>
                  </a>
                ))}
              </div>

            </div>
          </section>

          {/* ================= 🔥 NEW: COMMUNITY LEAD SECTION 🔥 ================= */}
          <section className="py-20 px-6 bg-white border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl font-normal text-[#202124] tracking-tight mb-4">Arcade Community Lead</h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  Driving our community forward with dedication and support.
                </p>
              </div>

              {/* 🔥 UPDATED: Curve reduced from rounded-[2rem] to rounded-2xl 🔥 */}
              <div className="max-w-3xl mx-auto bg-white border border-[#dadce0] rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-[#1a73e8] transition-all duration-500 flex flex-col md:flex-row items-center md:items-start gap-8">
                 {/* Profile Info */}
                 <div className="flex flex-col items-center flex-shrink-0 text-center md:text-left md:items-start">
                    <div className="w-24 h-24 rounded-full bg-[#fef7e0] text-[#b06000] border-4 border-[#fde293] flex items-center justify-center text-3xl font-bold mb-4 shadow-sm">
                      P
                    </div>
                    <h3 className="text-2xl font-bold text-black">Preeti Patel</h3>
                    <span className="text-[11px] font-bold text-[#b06000] bg-[#fef7e0] px-3 py-1 rounded-full mt-2 border border-[#fde293]">Community Lead</span>

                    <div className="flex items-center gap-3 mt-5">
                      <a href="https://www.linkedin.com/in/preeti-patel-a91406331" target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] hover:text-[#004182] hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                      <a href="https://www.skills.google/public_profiles/0db81977-a509-43bd-917f-e8e9d6611ac9" target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#1a73e8] hover:underline">View Profile</a>
                    </div>
                 </div>

                 {/* Description / Points & New WhatsApp Button */}
                 <div className="flex-1 mt-2 md:mt-0 w-full flex flex-col justify-between">
                   
                   {/* 🔥 UPDATED: Single Professional Paragraph 🔥 */}
                   <p className="text-[#3c4043] text-base leading-relaxed font-medium mb-6 text-center md:text-left">
                     As the dedicated Community Lead, Preeti spearheads community engagement initiatives, seamlessly managing group dynamics and providing unwavering support to members navigating technical labs. She plays a pivotal role in resolving queries, participating in core strategy meetings, and fostering a highly collaborative environment to ensure the collective success of the program.
                   </p>

                   {/* Separator Line */}
                   <div className="w-full h-[1px] bg-[#dadce0] my-4"></div>

                   {/* 🔥 NEW: Join Community WhatsApp Button 🔥 */}
                   <div className="w-full flex justify-center md:justify-start pt-2">
                      <a 
                        href="https://chat.whatsapp.com/KqEzksayDXQFiDHMv0JqYY" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-[15px] font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.347-.272.273-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Join WhatsApp Community
                      </a>
                   </div>

                 </div>
              </div>
            </div>
          </section>


          {/* ================= CO-ORDINATORS TEAM SECTION ================= */}
          <section className="py-24 px-6 bg-[#f8f9fa] border-b border-[#dadce0]">
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl font-normal text-[#202124] tracking-tight mb-4">Our Expert Co-ordinators</h2>
                <p className="text-[#5f6368] text-base max-w-2xl mx-auto leading-relaxed">
                  The dedicated individuals helping our community achieve their milestones.
                </p>
              </div>

              <div className="bg-white border border-[#dadce0] rounded-sm shadow-sm overflow-hidden mb-6">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-[#dadce0] text-xs font-bold text-[#5f6368] uppercase tracking-wider">
                  <div className="col-span-5">Coordinators</div>
                  <div className="col-span-3 text-center">Skill Badges</div>
                  <div className="col-span-2 text-center">Arcade Points</div>
                  <div className="col-span-2 text-right">Public Profile</div>
                </div>

                <div className="divide-y divide-[#dadce0]">
                  {coordinatorsData.map((coord, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-[#f8f9fa] transition-colors">
                      
                      <div className="col-span-1 md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <a 
                          href={coord.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-bold text-[#202124] hover:text-[#0a66c2] text-[17px] hover:underline underline-offset-4 transition-colors"
                        >
                          {coord.name}
                        </a>
                        <span className="text-[10px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-sm sm:ml-2 border border-[#d2e3fc]">Coordinator</span>
                      </div>

                      <div className="col-span-1 md:col-span-5 grid grid-cols-2 gap-4 md:gap-0 mt-2 md:mt-0">
                        <div className="md:col-span-1 flex flex-col md:items-center">
                          <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider md:hidden mb-0.5">Skill Badges</span>
                          <span className="font-semibold text-[#202124]">{coord.badges}</span>
                        </div>
                        <div className="md:col-span-1 flex flex-col md:items-center">
                          <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider md:hidden mb-0.5">Arcade Pts</span>
                          <span className="font-semibold text-[#b06000]">{coord.points}</span>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-3 mt-3 md:mt-0">
                        <a 
                          href={coord.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-block px-4 py-2 bg-white border border-[#dadce0] text-[#1a73e8] text-[13px] font-medium rounded-sm hover:bg-[#e8f0fe] hover:border-[#1a73e8] transition-colors shadow-sm"
                        >
                          Profile
                        </a>
                        <a 
                          href={coord.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#0a66c2] hover:text-[#004182] hover:scale-110 transition-transform flex-shrink-0"
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

          {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
          <section className="py-24 px-6 bg-white border-b border-[#dadce0]">
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

              {/* PREMIUM FAQ BUTTON */}
              <div className="mt-10 text-center">
                 <a 
                   href="https://rsvp.withgoogle.com/events/arcade-facilitator/faqs" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-sm font-medium text-[#1a73e8] bg-white border border-[#dadce0] px-6 py-3.5 rounded-xl hover:shadow-md hover:border-[#1a73e8] hover:bg-[#f8f9fa] transition-all duration-300 group"
                 >
                   View all FAQs on official site
                   <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                   </svg>
                 </a>
              </div>
            </div>
          </section>

        </main>

        {/* ================= MINIMAL FOOTER ================= */}
        <footer className="bg-white py-8 border-t border-[#dadce0]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#5f6368] text-sm text-center md:text-left">
              <p>© {new Date().getFullYear()} Arcade Nexus. Independent Community Tool.</p>
            </div>
            <div className="flex gap-4">
              
              {/* HOME LINK WITH POP MODAL */}
              <div className="relative group flex items-center justify-center">
                <button onClick={() => router.push("/")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline focus:outline-none transition-colors">
                  Home
                </button>
                {/* Clean Pop Modal (Tooltip) */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#202124] text-white text-[11px] font-medium tracking-wide rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Return to Homepage
                  {/* Little downward arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#202124]"></div>
                </div>
              </div>

              {/* CALCULATOR LINK WITH POP MODAL */}
              <div className="relative group flex items-center justify-center">
                <button onClick={() => router.push("/calculator")} className="text-[#5f6368] text-sm hover:text-[#1a73e8] hover:underline focus:outline-none transition-colors">
                  Calculator
                </button>
                {/* Clean Pop Modal (Tooltip) */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#202124] text-white text-[11px] font-medium tracking-wide rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Calculate Arcade Points
                  {/* Little downward arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#202124]"></div>
                </div>
              </div>

            </div>
          </div>
        </footer>
      </div>
    </>
  );
}