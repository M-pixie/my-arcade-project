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
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 mb-8">
      {/* Heading: Mobile pe thoda chhota, Laptop pe bada */}
      <h2 className="text-xl md:text-2xl font-bold text-center text-black mb-6 md:mb-8">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-3 md:space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-300 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <button
              className="w-full flex justify-between items-start p-4 text-left focus:outline-none hover:bg-gray-50 transition-colors gap-4"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {/* Question Text: 
                  - Mobile par text thoda chhota rakha hai taaki overflow na ho.
                  - Leading-snug rakha hai taaki lines chipke nahi.
              */}
              <span className="text-black font-semibold text-[15px] md:text-lg leading-snug">
                {faq.question}
              </span>
              
              {/* Icon Fix: 
                  - 'flex-shrink-0' lagaya taaki text lamba hone par arrow pichke nahi.
                  - 'mt-0.5' lagaya taaki text ki pehli line ke sath align rahe.
              */}
              <svg 
                className={`w-5 h-5 md:w-6 md:h-6 text-black transform transition-transform duration-200 flex-shrink-0 mt-0.5 ${openIndex === index ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Answer Box */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-4 pt-2 bg-gray-50 text-gray-900 font-medium text-sm md:text-base border-t border-gray-200 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}