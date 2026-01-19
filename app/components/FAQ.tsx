"use client";
import { useState } from "react";

const faqs = [
  {
    question: "Mera Public Profile URL kaise milega?",
    answer: "Apne Google Cloud Skills Boost profile par jao, 'Public Profile' button par click karo, aur upar browser se link copy kar lo. Dhyan rahe profile 'Public' honi chahiye."
  },
  {
    question: "Points 0 kyu dikha raha hai?",
    answer: "Agar aapki profile private hai ya URL galat hai to 0 dikhega. Ye bhi check karein ki aapne games isi saal (2026) complete kiye hain."
  },
  {
    question: "Kya ye Google ka official tool hai?",
    answer: "Nahi, ye ek community tool hai jo students ki madad ke liye banaya gaya hai. Iska Google Cloud se official connection nahi hai."
  },
  {
    question: "Points calculation kaise hoti hai?",
    answer: "Trivia = 1 Pt, Levels/Games = 1 Pt, Skill Badges (2 badges) = 1 Pt. 'Work-Life Refresh' jese special games ke 2 Points milte hain."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
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