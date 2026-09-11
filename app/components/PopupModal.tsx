"use client";

import { useEffect, useState } from "react";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  const BONUS_MILESTONE_LINK =
    "https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone";

  const VERIFICATION_FORM_LINK =
    "https://docs.google.com/forms/d/e/1FAIpQLSdq6-5RPthTa4D_o7xfgM0We_pnFWmj80ByiZfEl9ov1yZ3iw/viewform";

  const POPUP_STORAGE_KEY = "bonus_milestone_popup_seen_v2";

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(POPUP_STORAGE_KEY);

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (action: "close" | "done") => {
    setIsOpen(false);

    if (action === "done") {
      localStorage.setItem(POPUP_STORAGE_KEY, "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Container: White bg, rounded-xl, compact max-width */}
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-300">
        
        {/* Subtle Close Button */}
        <button
          onClick={() => handleClose("close")}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-6 py-8 sm:px-8">
          
          {/* Minimalist Badge */}
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1">
              <span className="text-xs">🏆</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Bonus Milestone
              </span>
            </div>
          </div>

          {/* Clean Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-[1.75rem]">
              Earn Extra <span className="text-blue-600">10 Points</span>
            </h2>
            <p className="mx-auto mt-2.5 max-w-[320px] text-[13px] leading-relaxed text-gray-500">
              Complete the Bonus Milestone and submit your AI Agent for verification.
            </p>
          </div>

          {/* Elegant Info Box */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-gray-100 text-lg shadow-sm">
                ✨
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-gray-900">
                  What you need to do
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                  Create your first AI Agent and submit the official verification form before the deadline.
                </p>
              </div>
            </div>

            {/* Reward & Deadline Row */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px]">⏰</span>
                <span className="text-[11px] font-semibold text-gray-600">
                  14 Sept 2026 · 11:59 PM
                </span>
              </div>
              <span className="rounded-md bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-700">
                +10 Points
              </span>
            </div>
          </div>

          {/* Action Buttons (Stacked for cleaner hierarchy) */}
          <div className="mt-7 flex flex-col gap-2.5">
            <a
              href={VERIFICATION_FORM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[13px] font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Open Verification Form
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>

            <a
              href={BONUS_MILESTONE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-bold text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900"
            >
              View Milestone Details
            </a>
          </div>

          {/* Dismiss Text */}
          <div className="mt-5 text-center">
            <button
              onClick={() => handleClose("done")}
              className="text-[11px] font-medium text-gray-400 transition-colors hover:text-gray-600"
            >
              Don't show this again
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}