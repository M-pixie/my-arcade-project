"use client";
import { useState } from "react";

const faqs = [
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
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions: FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{faq.question}</span>
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Animation logic for smooth opening */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-4 bg-gray-50 text-gray-600 text-sm border-t border-gray-100">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}