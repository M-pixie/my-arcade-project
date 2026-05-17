"use client";
import { useState } from "react";

const faqs = [
  {
    question: "How do I find my Public Profile URL?",
    answer: "Navigate to your Google Cloud Skills Boost profile, click the 'Public Profile' button, and copy the URL from your browser. Ensure your profile visibility is set to 'Public'."
  },
  {
    question: "Why is my score showing as 0?",
    answer: "This usually happens if your profile is private, the URL is incorrect, or no eligible games from the current 2026 season were found on your profile."
  },
  {
    question: "How are the Arcade Points calculated?",
    answer: "Standard Games, Levels & Trivia = 1 Point. Skill Badges = 1 Point per 2 badges. Special Games (e.g., Work-Life Refresh) = 2 Points."
  },
  {
    question: "I just completed a lab, why isn't it counting?",
    answer: "Google Cloud profiles can take a few minutes to update after you complete a lab. Please refresh your public profile page and try calculating again."
  },
  {
    question: "Is this an official Google Cloud tool?",
    answer: "No, this is a community-developed tool designed to assist learners in tracking their progress. We are not officially affiliated with Google or Google Cloud."
  },
  {
    question: "Is my personal data safe?",
    answer: "Yes. We only fetch public data from the URL you provide to calculate your score. We do not store your personal information permanently."
  },
  {
    question: "Can I use this calculator on mobile?",
    answer: "Absolutely! This tool is fully responsive and works seamlessly on both desktop and mobile devices."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    // Upar ka space thoda badhaya (pt-12) aur niche ka space kam kiya (pb-4)
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-4 bg-white relative z-10">
      
      {/* Premium Header Styling */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#202124] tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>
      
      {/* Contiguous Box Style with Soft Curve & Premium Shadow */}
      <div className="border border-[#dadce0] rounded-2xl bg-white divide-y divide-[#dadce0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        {faqs.map((faq, index) => (
          <div key={index} className="overflow-hidden bg-white group">
            <button
              className="w-full flex justify-between items-center px-6 md:px-8 py-5 md:py-6 text-left bg-white hover:bg-[#f8f9fa] transition-all duration-300 gap-4 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {/* Question Text: Turns blue when active */}
              <span 
                className={`font-semibold text-base md:text-[17px] leading-snug transition-colors duration-300 ${
                  openIndex === index ? "text-[#1a73e8]" : "text-[#202124]"
                }`}
              >
                {faq.question}
              </span>
              
              {/* Premium Icon Container with dynamic background & rotation */}
              <div 
                className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index 
                    ? "bg-[#e8f0fe] text-[#1a73e8]" 
                    : "bg-transparent text-[#5f6368] group-hover:bg-[#e8eaed]"
                }`}
              >
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-300 ease-out ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {/* Answer Panel: Smooth Reveal */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Answer Text: Extra padding for better readability */}
              <div className="px-6 md:px-8 pb-6 pt-0 bg-white text-[#5f6368] text-[15px] leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}