"use client";

import { useEffect, useState } from "react";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  const BONUS_MILESTONE_LINK =
    "https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone";

  const VERIFICATION_FORM_LINK =
    "https://docs.google.com/forms/d/e/1FAIpQLSdq6-5RPthTa4D_o7xfgM0We_pnFWmj80ByiZfEl9ov1yZ3iw/viewform";

  // New version key = old "Don't show again" state automatically reset
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070708]/80 px-4 backdrop-blur-[8px] animate-in fade-in duration-300">

      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-[220px] w-[220px] rounded-full bg-fuchsia-500/[0.06] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[15%] right-[15%] h-[220px] w-[220px] rounded-full bg-violet-500/[0.06] blur-[90px]" />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[24px] border border-[#2a2d32] bg-[#1a1b1e] shadow-[0_25px_80px_rgba(0,0,0,0.65)] animate-in zoom-in-95 duration-300">

        {/* Close */}
        <button
          onClick={() => handleClose("close")}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#23252a] text-[#80868b] transition-all hover:bg-[#2d3036] hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-6 py-6 sm:px-7 sm:py-7">

          {/* Badge */}
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#34373d] bg-[#202124] px-3.5 py-1.5">
              <span className="text-sm">🏆</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aeb4bc]">
                Bonus Milestone
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-[1.8rem] font-bold leading-tight tracking-[-0.025em] text-white sm:text-[2rem]">
              Earn Extra{" "}
              <span className="text-[#8ab4f8]">10 Points</span>
            </h2>

            <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-5 text-[#9aa0a6] sm:text-sm">
              Complete the Bonus Milestone and submit your AI Agent
              for verification to claim your extra Arcade Points.
            </p>
          </div>

          {/* Main Info Card */}
          <div className="mt-6 rounded-2xl border border-[#2a2d32] bg-[#15171b] p-4.5 sm:p-5">

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#202124] text-lg shadow-inner">
                ✨
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-[#e8eaed] sm:text-sm">
                  What you need to do
                </h3>

                <p className="mt-1.5 text-[11px] leading-5 text-[#8e949c] sm:text-xs">
                  Complete the required milestone steps and create
                  your{" "}
                  <span className="font-semibold text-[#d9dce1]">
                    first AI Agent
                  </span>
                  . Then submit the official verification form.
                </p>
              </div>
            </div>

            {/* Reward */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#2a2d32] bg-[#101113] px-3.5 py-3">
              <span className="text-[11px] font-medium text-[#80868b]">
                Bonus Reward
              </span>

              <span className="text-base font-bold text-white">
                +10 Points
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#4b2a2a] bg-[#241719] px-3.5 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#302023] text-sm">
              ⏰
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#f28b82]">
                Submission Deadline
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-[#e8eaed] sm:text-xs">
                14 September 2026 · 11:59 PM IST
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">

            <a
              href={BONUS_MILESTONE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#3c4043] bg-[#202124] px-3 py-3 text-[11px] font-bold text-[#e8eaed] transition-all hover:bg-[#2a2d32] hover:border-[#4a4e54] sm:text-xs"
            >
              View Milestone

              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M7 7h10v10"
                />
              </svg>
            </a>

            <a
              href={VERIFICATION_FORM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1a73e8] px-3 py-3 text-[11px] font-bold text-white shadow-[0_5px_15px_rgba(26,115,232,0.2)] transition-all hover:bg-[#1967d2] sm:text-xs"
            >
              Open Verification Form

              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M7 7h10v10"
                />
              </svg>
            </a>

          </div>

          {/* Don't show again */}
          <div className="mt-5 text-center">
            <button
              onClick={() => handleClose("done")}
              className="text-[12px] font-semibold text-[#8e949c] transition-colors hover:text-white sm:text-[13px]"
            >
              Don't show this again
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}