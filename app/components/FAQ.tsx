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
    <div className="max-w-4xl mx-auto px-6 py-20 bg-white">
      {/* Heading: Google UI Style (font-normal, dark grey text) */}
      <h2 className="text-3xl md:text-4xl font-normal text-center text-[#202124] mb-12 tracking-tight">
        Frequently Asked Questions
      </h2>
      
      {/* Contiguous Box Style (Thin borders, square corners, split by thin lines) */}
      <div className="border border-[#dadce0] rounded-sm bg-white divide-y divide-[#dadce0] shadow-sm">
        {faqs.map((faq, index) => (
          <div key={index} className="overflow-hidden bg-white">
            <button
              className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-[#f8f9fa] transition-colors gap-4 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {/* Question Text */}
              <span className="text-[#202124] font-medium text-base md:text-lg leading-snug">
                {faq.question}
              </span>
              
              {/* Icon: Google Grey & Smooth Rotation */}
              <svg 
                className={`w-5 h-5 text-[#5f6368] flex-shrink-0 transform transition-transform duration-300 ease-in-out ${openIndex === index ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Answer Panel: Smooth Reveal */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Answer Text: Light Grey Text, Pure White Background */}
              <div className="p-6 pt-0 bg-white text-[#5f6368] text-base leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}