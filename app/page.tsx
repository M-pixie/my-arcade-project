"use client";

import VisitCounter from "@/app/components/VisitCounter";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FAQ from "@/app/components/FAQ";
import { useState, useEffect, useRef } from "react";

// Firebase
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  savePublicUserToLeaderboard,
  subscribeLeaderboard,
} from "@/lib/leaderboard";

/* =========================================================
   FORMAT STATS
========================================================= */

const formatStat = (num: number) => {
  if (num >= 1000) {
    return (
      (num / 1000).toFixed(1).replace(".0", "") + "K+"
    );
  }

  return num.toString();
};

export default function HomePage() {
  const router = useRouter();

  /* =========================================================
     HERO CALCULATOR
  ========================================================= */

  const [heroUrl, setHeroUrl] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  const [calcResult, setCalcResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const autoCloseTimerRef =
    useRef<NodeJS.Timeout | null>(null);

  /* =========================================================
     REALTIME STATS
  ========================================================= */

  const [stats, setStats] = useState({
    unique: 0,
    analyzed: 0,
  });

  /* =========================================================
     SUPPORT FORM
  ========================================================= */

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(
    "Swags Delivery / Issue"
  );
  const [formSubCategory, setFormSubCategory] = useState("");
  const [formMessage, setFormMessage] = useState("");

  /* =========================================================
     GUIDE TAB
  ========================================================= */

  const [activeGuideTab, setActiveGuideTab] =
    useState("start");

  /* =========================================================
     GUIDE DATA
  ========================================================= */

  const startSteps = [
    {
      link: "https://share.google/mn0xUfmd49TA9RPc1",
      title: "Sign in Account",
      desc: "Sign up on Cloud Skills Boost and set up your Arcade profile.",
      badge: "01",
    },
    {
      link: "https://share.google/45EC3J4RjWLzgbkGy",
      title: "Registration",
      desc: "Enroll in Arcade to unlock labs, points and challenges.",
      badge: "02",
    },
    {
      link: "https://share.google/Ojw8FgQpGhPI1sXyt",
      title: "Start Labs",
      desc: "Complete labs, earn points and unlock Google Cloud rewards.",
      badge: "03",
    },
    {
      link: "https://share.google/JRMVQ9xd8tTwx8Mol",
      title: "Facilitator Program",
      desc: "Explore facilitator resources and community guidance.",
      badge: "04",
    },
  ];

  const arcadeTools = [
    {
      title: "Points Calculator",
      desc: "Calculate Arcade points directly from your public profile.",
      link: "/calculator",
      badge: "01",
    },
    {
      title: "Smart Dashboard",
      desc: "View your points, activity, rank and progress in one place.",
      link: "/dashboard",
      badge: "02",
    },
    {
      title: "Live Leaderboard",
      desc: "Track your position and community progress in real-time.",
      link: "/leaderboard",
      badge: "03",
    },
    {
      title: "Facilitator Page",
      desc: "Explore facilitator information, resources and guidance.",
      link: "/facilitator",
      badge: "04",
    },
  ];

  const pointsSystem = [
    {
      title: "Arcade Adventure",
      desc: "Standard track progression.",
      badge: "01",
    },
    {
      title: "Arcade Voyage",
      desc: "Intermediate cloud challenges.",
      badge: "02",
    },
    {
      title: "Arcade Trail",
      desc: "Advanced guided paths.",
      badge: "03",
    },
    {
      title: "Skill Badges",
      desc: "Skill badge contribution to your progress.",
      badge: "04",
    },
  ];

  /* =========================================================
     FIREBASE
  ========================================================= */

  useEffect(() => {
    const savedUrl = localStorage.getItem("arcade_url");

    if (savedUrl) {
      setHeroUrl(savedUrl);
    }

    const reviewQuery = query(
      collection(db, "swagReviews"),
      orderBy("createdAt", "desc")
    );

    const unsubReviews = onSnapshot(
      reviewQuery,
      () => {
        // Realtime reviews listener retained.
      },
      (error) => {
        console.error(
          "Reviews subscription error:",
          error
        );
      }
    );

    const unsubLeaderboard = subscribeLeaderboard(
      (data) => {
        const unique = data.length;

        const analyzed = data.reduce(
          (acc: number, user: any) =>
            acc + (user.calculationCount || 1),
          0
        );

        setStats({
          unique,
          analyzed,
        });
      }
    );

    return () => {
      unsubReviews();
      unsubLeaderboard();

      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  /* =========================================================
     HERO CALCULATOR
  ========================================================= */

  const handleHeroSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const targetUrl = heroUrl.trim();

    if (!targetUrl) {
      return;
    }

    setHeroError(null);
    setShowResult(false);
    setIsCalculating(true);

    const urlPattern =
      /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;

    if (!urlPattern.test(targetUrl)) {
      setHeroError(
        "Please enter a valid Public Profile URL."
      );

      setIsCalculating(false);

      return;
    }

    localStorage.setItem(
      "arcade_url",
      targetUrl
    );

    try {
      const res = await fetch(
        "/api/calculate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: targetUrl,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setHeroError(
          data.error ||
            "Failed to calculate points. Check URL."
        );

        setIsCalculating(false);

        return;
      }

      const extractedId =
        targetUrl.split("/").pop() ||
        null;

      const cacheObj = {
        profileUrl: targetUrl,
        points: data.totalPoints,
        breakdown: data.breakdown,
        history:
          data.completionHistory || [],
        userName:
          data.userName || null,
        userAvatar:
          data.userAvatar || null,
        userUniqueId:
          extractedId,
      };

      localStorage.setItem(
        "arcade_user_data",
        JSON.stringify(cacheObj)
      );

      localStorage.setItem(
        "current_processing_url",
        targetUrl
      );

      void savePublicUserToLeaderboard({
        name:
          data.userName ||
          "Arcade Player",

        photoURL:
          data.userAvatar ||
          "/avatar.png",

        points:
          data.totalPoints,

        profileUrl:
          targetUrl,
      }).catch((error) => {
        console.error(
          "Leaderboard save failed:",
          error
        );
      });

      setCalcResult(data);
      setShowResult(true);

      /* =====================================================
         AUTO CLOSE AFTER 2.5 SECONDS
      ===================================================== */

      if (autoCloseTimerRef.current) {
        clearTimeout(
          autoCloseTimerRef.current
        );
      }

      autoCloseTimerRef.current =
        setTimeout(() => {
          setShowResult(false);
        }, 2500);

    } catch (error) {
      console.error(
        "Calculator error:",
        error
      );

      setHeroError(
        "Connection failed. Check your internet and retry."
      );
    } finally {
      setIsCalculating(false);
    }
  };

  /* =========================================================
     SUPPORT
  ========================================================= */

  const handleFormSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    let text =
      `Hi Manish, I am ${formName}.\n\n` +
      `I have a query regarding: *${formCategory}*`;

    if (formSubCategory) {
      text +=
        `\nSpecifics: *${formSubCategory}*`;
    }

    text +=
      `\n\nMessage:\n${formMessage}`;

    const whatsappUrl =
      `https://wa.me/918538980608?text=${encodeURIComponent(
        text
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setFormName("");
    setFormMessage("");
    setFormSubCategory("");
  };

  return (
    <>
      <style jsx global>{`

        /* =====================================================
           BASE
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;

          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background: #ffffff;
          color: #111827;
        }

        button,
        input,
        textarea,
        select {
          font-family: inherit;
        }

        ::selection {
          background: #2563eb;
          color: #ffffff;
        }

        .nexus-page {
          min-height: 100vh;
          overflow-x: hidden;
          background: #ffffff;
        }

        /* =====================================================
           ANIMATIONS
        ===================================================== */

        @keyframes nexusFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes nexusGridMove {
          from {
            transform:
              perspective(700px)
              rotateX(62deg)
              translateY(0);
          }

          to {
            transform:
              perspective(700px)
              rotateX(62deg)
              translateY(64px);
          }
        }

        @keyframes nexusBlueOrb {
          0% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(35px, 25px, 0)
              scale(1.12);
          }

          100% {
            transform:
              translate3d(-15px, 35px, 0)
              scale(0.98);
          }
        }

        @keyframes nexusPurpleOrb {
          0% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(-30px, -25px, 0)
              scale(1.1);
          }

          100% {
            transform:
              translate3d(25px, 15px, 0)
              scale(0.96);
          }
        }

        @keyframes nexusPinkOrb {
          0% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(20px, -25px, 0)
              scale(1.15);
          }

          100% {
            transform:
              translate3d(-25px, 20px, 0)
              scale(0.97);
          }
        }

        @keyframes nexusGlowPulse {
          0%,
          100% {
            opacity: 0.28;
            transform: scale(1);
          }

          50% {
            opacity: 0.62;
            transform: scale(1.1);
          }
        }

        @keyframes nexusShimmer {
          from {
            transform:
              translateX(-130%)
              skewX(-20deg);
          }

          to {
            transform:
              translateX(250%)
              skewX(-20deg);
          }
        }

        @keyframes nexusSpinner {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes nexusButtonGlow {
          0%,
          100% {
            box-shadow:
              0 8px 24px
              rgba(37, 99, 235, 0.10);
          }

          50% {
            box-shadow:
              0 10px 30px
              rgba(99, 102, 241, 0.20);
          }
        }

        /* =====================================================
           HERO
        ===================================================== */

        .nexus-hero {
          position: relative;

          min-height: 700px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% -12%,
              rgba(59, 130, 246, 0.15),
              transparent 32%
            ),
            radial-gradient(
              circle at 0% 45%,
              rgba(37, 99, 235, 0.12),
              transparent 29%
            ),
            radial-gradient(
              circle at 100% 45%,
              rgba(168, 85, 247, 0.12),
              transparent 28%
            ),
            #07090e;
        }

        .nexus-grid {
          position: absolute;

          inset: -35%;

          opacity: 0.10;

          pointer-events: none;

          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.055) 1px,
              transparent 1px
            );

          background-size: 64px 64px;

          transform:
            perspective(700px)
            rotateX(62deg);

          transform-origin: center top;

          animation:
            nexusGridMove
            14s
            linear
            infinite;
        }

        .hero-noise {
          position: absolute;

          inset: 0;

          pointer-events: none;

          opacity: 0.023;

          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
        }

        .hero-orb {
          position: absolute;

          border-radius: 50%;

          filter: blur(105px);

          pointer-events: none;
        }

        .hero-orb-blue {
          width: 430px;
          height: 430px;

          left: -170px;
          top: -180px;

          background:
            rgba(37, 99, 235, 0.20);

          animation:
            nexusBlueOrb
            12s
            ease-in-out
            infinite
            alternate;
        }

        .hero-orb-purple {
          width: 410px;
          height: 410px;

          right: -130px;
          top: 75px;

          background:
            rgba(124, 58, 237, 0.17);

          animation:
            nexusPurpleOrb
            14s
            ease-in-out
            infinite
            alternate;
        }

        .hero-orb-pink {
          width: 330px;
          height: 330px;

          left: 42%;
          top: 28%;

          background:
            rgba(236, 72, 153, 0.10);

          animation:
            nexusPinkOrb
            16s
            ease-in-out
            infinite
            alternate;
        }

        .hero-orb-cyan {
          width: 260px;
          height: 260px;

          right: 18%;
          bottom: -170px;

          background:
            rgba(6, 182, 212, 0.09);

          animation:
            nexusGlowPulse
            5s
            ease-in-out
            infinite;
        }

        .hero-content {
          position: relative;

          z-index: 5;

          max-width: 1160px;

          margin: 0 auto;

          padding:
            90px
            24px
            52px;

          text-align: center;
        }

        /* =====================================================
           HERO PILL
        ===================================================== */

        .hero-pill {
          display: inline-flex;

          align-items: center;

          gap: 9px;

          padding:
            7px
            12px;

          border:
            1px solid
            rgba(255,255,255,0.10);

          border-radius: 999px;

          background:
            rgba(255,255,255,0.035);

          backdrop-filter:
            blur(13px);

          color: #cbd5e1;

          font-size: 11px;

          line-height: 1;

          font-weight: 600;

          letter-spacing: 0.045em;

          text-transform: uppercase;

          box-shadow:
            0 12px 35px
            rgba(0,0,0,0.14);

          animation:
            nexusFadeUp
            .7s
            ease
            both;
        }

        .hero-live-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          flex-shrink: 0;

          background:
            #60a5fa;

          box-shadow:
            0 0 0 4px
            rgba(96,165,250,0.08),
            0 0 15px
            rgba(96,165,250,0.85);

          animation:
            nexusGlowPulse
            2.5s
            ease-in-out
            infinite;
        }

        /* =====================================================
           HERO TITLE
        ===================================================== */

        .hero-title {
          max-width: 920px;

          margin:
            25px
            auto
            0;

          color: #ffffff;

          font-size:
            clamp(
              44px,
              5.2vw,
              68px
            );

          line-height: 1.04;

          letter-spacing: -0.045em;

          font-weight: 700;

          animation:
            nexusFadeUp
            .8s
            .04s
            ease
            both;
        }

        .hero-title-gradient {
          background:
            linear-gradient(
              90deg,
              #dbeafe 0%,
              #60a5fa 33%,
              #c084fc 65%,
              #f0abfc 100%
            );

          background-size:
            180% auto;

          -webkit-background-clip:
            text;

          background-clip:
            text;

          color: transparent;

          animation:
            gradientShift
            7s
            linear
            infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position:
              0% center;
          }

          50% {
            background-position:
              100% center;
          }

          100% {
            background-position:
              0% center;
          }
        }

        .hero-description {
          max-width: 645px;

          margin:
            19px
            auto
            0;

          color: #9ca3af;

          font-size: 14px;

          line-height: 1.75;

          font-weight: 400;

          animation:
            nexusFadeUp
            .9s
            .10s
            ease
            both;
        }

        .hero-description strong {
          color: #e5e7eb;

          font-weight: 600;
        }

        /* =====================================================
           CALCULATOR
        ===================================================== */

        .calculator-shell {
          position: relative;

          max-width: 760px;

          margin:
            34px
            auto
            0;

          animation:
            nexusFadeUp
            1s
            .16s
            ease
            both;
        }

        .calculator-glow {
          position: absolute;

          inset: -22px;

          border-radius: 27px;

          background:
            linear-gradient(
              100deg,
              rgba(37,99,235,0.11),
              rgba(168,85,247,0.10),
              rgba(236,72,153,0.08)
            );

          filter: blur(30px);

          pointer-events: none;
        }

        .calculator-border {
          position: relative;

          padding: 1px;

          border-radius: 17px;

          overflow: hidden;

          background:
            linear-gradient(
              100deg,
              rgba(96,165,250,0.60),
              rgba(168,85,247,0.35),
              rgba(236,72,153,0.27),
              rgba(255,255,255,0.08)
            );

          box-shadow:
            0 18px 55px
            rgba(0,0,0,0.23);
        }

        .calculator-border::after {
          content: "";

          position: absolute;

          top: 0;
          left: -120%;

          width: 50%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.15),
              transparent
            );

          transform:
            skewX(-20deg);

          pointer-events: none;
        }

        .calculator-border:hover::after {
          animation:
            nexusShimmer
            .85s
            ease
            both;
        }

        .calculator-inner {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          min-height: 60px;

          padding: 5px;

          border-radius: 16px;

          background:
            rgba(255,255,255,0.97);
        }

        .calculator-icon {
          width: 39px;
          height: 39px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-left: 2px;

          border-radius: 11px;

          background: #eff6ff;

          color: #2563eb;

          flex-shrink: 0;
        }

        .calculator-input {
          flex: 1;

          min-width: 0;

          height: 48px;

          padding:
            0
            12px;

          border: 0;

          outline: none;

          background:
            transparent;

          color: #111827;

          font-family: inherit;

          font-size: 14px;

          font-weight: 500;
        }

        .calculator-input::placeholder {
          color: #9ca3af;
        }

        .calculator-input:disabled {
          opacity: 0.65;
        }

        .calculator-button {
          width: 46px;
          height: 46px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: 0;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: #ffffff;

          cursor: pointer;

          font-family: inherit;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .calculator-button:hover:not(:disabled) {
          transform:
            translateY(-1px);

          box-shadow:
            0 10px 25px
            rgba(79,70,229,0.30);
        }

        .calculator-button:disabled {
          opacity: .75;
          cursor: not-allowed;
        }

        /* =====================================================
           PREMIUM SPINNER
        ===================================================== */

        .premium-spinner {
          width: 17px;
          height: 17px;

          display: block;

          border:
            2px solid
            rgba(255,255,255,0.28);

          border-top-color:
            #ffffff;

          border-radius: 50%;

          animation:
            nexusSpinner
            .65s
            linear
            infinite;
        }

        /* =====================================================
           ERROR
        ===================================================== */

        .hero-error {
          display: inline-flex;

          margin-top: 13px;

          padding:
            7px
            10px;

          border:
            1px solid
            rgba(248,113,113,0.16);

          border-radius: 8px;

          background:
            rgba(239,68,68,0.06);

          color: #fca5a5;

          font-size: 12px;

          line-height: 1.4;

          font-weight: 500;

          animation:
            nexusFadeUp
            .4s
            ease
            both;
        }

        /* =====================================================
           QUICK ACTIONS
        ===================================================== */

        .hero-actions {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 11px;

          flex-wrap: wrap;

          margin-top: 19px;

          animation:
            nexusFadeUp
            1s
            .18s
            ease
            both;
        }

        .hero-action {
          position: relative;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          min-height: 44px;

          padding:
            0
            16px;

          overflow: hidden;

          border:
            1px solid
            rgba(255,255,255,0.11);

          border-radius: 11px;

          background:
            rgba(255,255,255,0.045);

          color: #e5e7eb;

          font-family: inherit;

          font-size: 12px;

          line-height: 1;

          font-weight: 700;

          text-decoration: none;

          cursor: pointer;

          backdrop-filter:
            blur(13px);

          transition:
            transform .25s ease,
            border-color .25s ease,
            background .25s ease,
            box-shadow .25s ease,
            color .25s ease;

          animation:
            nexusButtonGlow
            4.5s
            ease-in-out
            infinite;
        }

        .hero-action::before {
          content: "";

          position: absolute;

          inset: 0;

          opacity: 0;

          background:
            linear-gradient(
              115deg,
              transparent 18%,
              rgba(96,165,250,0.13),
              rgba(192,132,252,0.11),
              transparent 82%
            );

          transition:
            opacity .25s ease;
        }

        .hero-action:hover::before {
          opacity: 1;
        }

        .hero-action:hover {
          color: #ffffff;

          transform:
            translateY(-3px);

          border-color:
            rgba(147,197,253,0.38);

          background:
            rgba(255,255,255,0.075);

          box-shadow:
            0 14px 32px
            rgba(37,99,235,0.13),
            0 0 24px
            rgba(168,85,247,0.09);
        }

        .hero-action svg {
          position: relative;

          z-index: 2;

          width: 16px;
          height: 16px;

          flex-shrink: 0;
        }

        .hero-action span,
        .hero-action {
          position: relative;
        }

        /* =====================================================
           RESULT
        ===================================================== */

        .result-card {
          position: relative;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 18px;

          max-width: 760px;

          margin:
            23px
            auto
            0;

          padding:
            18px
            14px
            14px;

          border:
            1px solid
            #e5e7eb;

          border-radius: 17px;

          background:
            rgba(255,255,255,0.98);

          color: #111827;

          box-shadow:
            0 24px 70px
            rgba(0,0,0,0.20);

          text-align: left;

          animation:
            nexusFadeUp
            .4s
            ease
            both;
        }

        .result-close {
          position: absolute;

          top: 7px;
          right: 7px;

          width: 26px;
          height: 26px;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 0;

          border:
            1px solid
            #e2e8f0;

          border-radius: 50%;

          background: #ffffff;

          color: #64748b;

          cursor: pointer;

          font-family: inherit;

          font-size: 17px;

          font-weight: 500;

          line-height: 1;

          z-index: 20;

          box-shadow:
            0 2px 8px
            rgba(15,23,42,0.08);

          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .result-close:hover {
          background: #f8fafc;

          border-color: #cbd5e1;

          color: #111827;

          transform:
            scale(1.05);
        }

        .result-user {
          display: flex;

          align-items: center;

          gap: 11px;

          min-width: 0;
        }

        .result-avatar {
          width: 46px;
          height: 46px;

          overflow: hidden;

          border:
            1px solid
            #e5e7eb;

          border-radius: 50%;

          background: #f3f4f6;

          flex-shrink: 0;

          cursor: pointer;
        }

        .result-avatar img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .result-avatar-fallback {
          width: 100%;
          height: 100%;

          display: grid;

          place-items: center;

          color: #4b5563;

          font-size: 15px;

          font-weight: 700;
        }

        .result-name {
          max-width: 185px;

          overflow: hidden;

          color: #111827;

          font-size: 13px;

          font-weight: 700;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .result-points {
          margin-top: 4px;

          color: #2563eb;

          font-size: 11px;

          font-weight: 500;
        }

        .result-points strong {
          color: #111827;

          font-weight: 700;
        }

        .result-metrics {
          display: flex;

          align-items: center;

          gap: 19px;
        }

        .result-metric {
          min-width: 60px;

          text-align: center;
        }

        .result-metric span {
          display: block;

          color: #9ca3af;

          font-size: 8px;

          line-height: 1.25;

          font-weight: 700;

          letter-spacing: .08em;

          text-transform: uppercase;
        }

        .result-metric strong {
          display: block;

          margin-top: 4px;

          color: #111827;

          font-size: 15px;

          font-weight: 700;
        }

        .result-divider {
          width: 1px;

          height: 30px;

          background: #e5e7eb;
        }

        .result-dashboard {
          min-height: 38px;

          padding:
            0
            13px;

          border: 0;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: #ffffff;

          cursor: pointer;

          font-family: inherit;

          font-size: 11px;

          font-weight: 600;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .result-dashboard:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 8px 22px
            rgba(37,99,235,.23);
        }

        /* =====================================================
           HERO STATS
        ===================================================== */

        .hero-stats {
          display: grid;

          grid-template-columns:
            repeat(4,1fr);

          max-width: 900px;

          margin:
            47px
            auto
            0;

          border-top:
            1px solid
            rgba(255,255,255,.08);
        }

        .hero-stat {
          position: relative;

          padding:
            22px
            12px;
        }

        .hero-stat + .hero-stat::before {
          content: "";

          position: absolute;

          left: 0;
          top: 35%;

          width: 1px;
          height: 30%;

          background:
            rgba(255,255,255,.08);
        }

        .hero-stat-number {
          color: #ffffff;

          font-size: 27px;

          line-height: 1;

          font-weight: 700;

          letter-spacing: -.03em;
        }

        .hero-stat-label {
          margin-top: 7px;

          color: #6b7280;

          font-size: 9px;

          line-height: 1.2;

          font-weight: 600;

          letter-spacing: .13em;

          text-transform: uppercase;
        }

        .rating-number {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 4px;
        }

        .rating-star {
          color: #fbbf24;

          font-size: 20px;
        }

        /* =====================================================
           LIGHT SECTIONS
        ===================================================== */

        .section {
          position: relative;

          padding:
            100px
            24px;

          background: #ffffff;
        }

        .resources-section {
          position: relative;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 5% 20%,
              rgba(59,130,246,0.045),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 60%,
              rgba(168,85,247,0.045),
              transparent 28%
            ),
            #ffffff;

          border-top:
            1px solid
            #f1f5f9;
        }

        .section-container {
          max-width: 1180px;

          margin: 0 auto;
        }

        .section-heading {
          max-width: 680px;

          margin-bottom: 48px;
        }

        .eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 14px;

          color: #2563eb;

          font-size: 10px;

          line-height: 1;

          font-weight: 700;

          letter-spacing: .14em;

          text-transform: uppercase;
        }

        .eyebrow::before {
          content: "";

          width: 19px;
          height: 1px;

          background: #2563eb;
        }

        .section-title {
          margin: 0;

          color: #111827;

          font-size:
            clamp(
              35px,
              4.6vw,
              53px
            );

          line-height: 1.05;

          letter-spacing: -.05em;

          font-weight: 700;
        }

        .section-description {
          max-width: 650px;

          margin-top: 17px;

          color: #6b7280;

          font-size: 14px;

          line-height: 1.8;

          font-weight: 400;
        }

        /* =====================================================
           FEATURES
        ===================================================== */

        .feature-grid {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 15px;
        }

        .feature-card {
          position: relative;

          min-height: 245px;

          padding: 26px;

          overflow: hidden;

          border:
            1px solid
            #e5e7eb;

          border-radius: 18px;

          background: #ffffff;

          text-decoration: none;

          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .feature-card::before {
          content: "";

          position: absolute;

          width: 190px;
          height: 190px;

          top: -105px;
          right: -105px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              rgba(37,99,235,.09),
              rgba(168,85,247,.06)
            );

          filter: blur(27px);

          transition:
            transform .4s ease;
        }

        .feature-card:hover {
          transform:
            translateY(-6px);

          border-color:
            #bfdbfe;

          box-shadow:
            0 20px 50px
            rgba(15,23,42,.08);
        }

        .feature-card:hover::before {
          transform:
            scale(1.5);
        }

        .feature-number {
          position: relative;

          width: 43px;
          height: 43px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #eff6ff;

          color: #2563eb;

          font-size: 10px;

          font-weight: 700;
        }

        .feature-card h3 {
          position: relative;

          margin:
            26px
            0
            9px;

          color: #111827;

          font-size: 18px;

          line-height: 1.2;

          letter-spacing: -.02em;

          font-weight: 700;
        }

        .feature-card p {
          position: relative;

          margin: 0;

          max-width: 320px;

          color: #6b7280;

          font-size: 13px;

          line-height: 1.7;

          font-weight: 400;
        }

        .feature-link {
          position: absolute;

          left: 26px;
          bottom: 22px;

          color: #2563eb;

          font-size: 11px;

          font-weight: 600;

          transition:
            transform .2s ease;
        }

        .feature-card:hover .feature-link {
          transform:
            translateX(3px);
        }

        /* =====================================================
           RESOURCES - LIGHT VERSION
        ===================================================== */

        .guide-layout {
          display: grid;

          grid-template-columns:
            1.1fr
            .9fr;

          gap: 18px;
        }

        .light-panel {
          overflow: hidden;

          border:
            1px solid
            #e5e7eb;

          border-radius: 20px;

          background:
            rgba(255,255,255,.94);

          box-shadow:
            0 15px 40px
            rgba(15,23,42,.045);
        }

        .guide-tabs {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          border-bottom:
            1px solid
            #e5e7eb;

          background:
            #f8fafc;
        }

        .guide-tab {
          min-height: 52px;

          border: 0;

          background:
            transparent;

          color: #64748b;

          cursor: pointer;

          font-family: inherit;

          font-size: 12px;

          font-weight: 600;

          transition:
            color .2s ease,
            background .2s ease;
        }

        .guide-tab:hover {
          color: #2563eb;

          background:
            #ffffff;
        }

        .guide-tab.active {
          color: #2563eb;

          background: #ffffff;

          box-shadow:
            inset 0 -2px
            #2563eb;
        }

        .guide-items {
          padding: 13px;
        }

        .guide-item {
          display: flex;

          gap: 15px;

          padding: 16px;

          border:
            1px solid
            transparent;

          border-radius: 14px;

          text-decoration: none;

          transition:
            border-color .2s ease,
            background .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        .guide-item:hover {
          border-color:
            #dbeafe;

          background:
            #f8fbff;

          transform:
            translateX(3px);

          box-shadow:
            0 7px 20px
            rgba(37,99,235,.045);
        }

        .guide-icon {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border:
            1px solid
            #dbeafe;

          border-radius: 13px;

          background:
            linear-gradient(
              145deg,
              #eff6ff,
              #f5f3ff
            );

          color: #2563eb;

          font-size: 11px;

          font-weight: 700;
        }

        .guide-item h3 {
          margin:
            1px
            0
            6px;

          color: #111827;

          font-size: 15px;

          line-height: 1.35;

          font-weight: 650;

          letter-spacing: -.01em;
        }

        .guide-item p {
          margin: 0;

          color: #64748b;

          font-size: 13px;

          line-height: 1.65;

          font-weight: 400;
        }

        .guide-badge {
          margin-left: 8px;

          color: #2563eb;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: .09em;

          text-transform: uppercase;
        }

        /* =====================================================
           SUPPORT - LIGHT
        ===================================================== */

        .support-panel {
          padding: 27px;
        }

        .support-title {
          margin: 0;

          color: #111827;

          font-size: 20px;

          line-height: 1.2;

          letter-spacing: -.03em;

          font-weight: 700;
        }

        .support-description {
          margin:
            9px
            0
            22px;

          color: #64748b;

          font-size: 12px;

          line-height: 1.7;

          font-weight: 400;
        }

        .support-form {
          display: flex;

          flex-direction: column;

          gap: 11px;
        }

        .support-input,
        .support-select,
        .support-textarea {
          width: 100%;

          border:
            1px solid
            #e2e8f0;

          border-radius: 12px;

          outline: none;

          background:
            #ffffff;

          color: #111827;

          padding:
            12px
            13px;

          font-family: inherit;

          font-size: 12px;

          font-weight: 400;

          box-shadow:
            0 1px 2px
            rgba(15,23,42,.02);

          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .support-input::placeholder,
        .support-textarea::placeholder {
          color: #94a3b8;
        }

        .support-select option {
          color: #111827;
        }

        .support-input:focus,
        .support-select:focus,
        .support-textarea:focus {
          border-color:
            #93c5fd;

          background:
            #ffffff;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08);
        }

        .support-textarea {
          min-height: 105px;

          resize: vertical;
        }

        .support-button {
          min-height: 43px;

          border: 0;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: #ffffff;

          cursor: pointer;

          font-family: inherit;

          font-size: 12px;

          font-weight: 600;

          transition:
            background .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        .support-button:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 12px 28px
            rgba(37,99,235,.20);
        }

        /* =====================================================
           FAQ
        ===================================================== */

        .faq-section {
          background: #ffffff;
        }

        /* =====================================================
           CTA
        ===================================================== */

        .cta-wrap {
          padding:
            0
            24px
            90px;

          background:
            #ffffff;
        }

        .cta-box {
          position: relative;

          max-width: 1180px;

          min-height: 350px;

          margin: 0 auto;

          display: flex;

          align-items: center;
          justify-content: center;

          overflow: hidden;

          border:
            1px solid
            rgba(96,165,250,.16);

          border-radius: 26px;

          background:
            radial-gradient(
              circle at 18% 20%,
              rgba(59,130,246,.18),
              transparent 32%
            ),
            radial-gradient(
              circle at 82% 80%,
              rgba(168,85,247,.14),
              transparent 34%
            ),
            #080b12;

          box-shadow:
            0 35px 90px
            rgba(15,23,42,.15);
        }

        .cta-ring-one,
        .cta-ring-two {
          position: absolute;

          border:
            1px solid
            rgba(255,255,255,.045);

          border-radius: 50%;

          pointer-events: none;
        }

        .cta-ring-one {
          width: 420px;
          height: 420px;

          animation:
            nexusGlowPulse
            6s
            ease-in-out
            infinite;
        }

        .cta-ring-two {
          width: 650px;
          height: 650px;

          opacity: .55;
        }

        .cta-content {
          position: relative;

          z-index: 3;

          max-width: 650px;

          padding:
            55px
            24px;

          text-align: center;
        }

        .cta-title {
          margin: 0;

          color: #ffffff;

          font-size:
            clamp(
              38px,
              5.5vw,
              59px
            );

          line-height: 1;

          letter-spacing: -.055em;

          font-weight: 700;
        }

        .cta-description {
          max-width: 570px;

          margin:
            17px
            auto
            25px;

          color: #8b93a1;

          font-size: 13px;

          line-height: 1.75;

          font-weight: 400;
        }

        .cta-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          min-height: 42px;

          padding:
            0
            17px;

          border-radius: 11px;

          background: #ffffff;

          color: #111827;

          text-decoration: none;

          font-family: inherit;

          font-size: 12px;

          font-weight: 700;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .cta-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 15px 38px
            rgba(255,255,255,.12);
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1000px) {

          .feature-grid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .guide-layout {
            grid-template-columns:
              1fr;
          }
        }

        @media (max-width: 760px) {

          .nexus-hero {
            min-height: auto;
          }

          .hero-content {
            padding:
              76px
              16px
              42px;
          }

          .hero-title {
            font-size:
              clamp(
                40px,
                10.8vw,
                56px
              );
          }

          .hero-description {
            font-size: 13px;
          }

          .calculator-inner {
            min-height: 58px;
          }

          .calculator-icon {
            width: 38px;
            height: 38px;

            border-radius: 10px;
          }

          .calculator-input {
            height: 46px;

            padding:
              0
              8px;

            font-size: 12px;
          }

          .calculator-button {
            width: 44px;
            height: 44px;

            border-radius: 11px;
          }

          .hero-actions {
            gap: 8px;
          }

          .hero-action {
            min-height: 42px;

            padding:
              0
              12px;

            font-size: 10px;
          }

          .result-card {
            flex-direction: column;

            align-items: stretch;

            padding:
              18px
              13px
              13px;
          }

          .result-user {
            padding-right: 25px;
          }

          .result-metrics {
            justify-content: center;
          }

          .result-dashboard {
            width: 100%;
          }

          .hero-stats {
            grid-template-columns:
              repeat(2,1fr);

            margin-top: 38px;
          }

          .hero-stat {
            padding:
              18px
              8px;
          }

          .hero-stat-number {
            font-size: 24px;
          }

          .hero-stat-label {
            font-size: 8px;
          }

          .hero-stat:nth-child(3)::before {
            display: none;
          }

          .feature-grid {
            grid-template-columns:
              1fr;
          }

          .section {
            padding:
              78px
              16px;
          }

          .section-title {
            font-size:
              clamp(
                34px,
                9vw,
                48px
              );
          }

          .guide-tabs {
            grid-template-columns:
              1fr;
          }

          .guide-tab {
            min-height: 46px;

            border-bottom:
              1px solid
              #eef2f7;
          }

          .guide-item h3 {
            font-size: 14px;
          }

          .guide-item p {
            font-size: 12px;
          }

          .guide-icon {
            width: 44px;
            height: 44px;
          }

          .support-panel {
            padding: 21px;
          }

          .cta-wrap {
            padding:
              0
              16px
              65px;
          }

          .cta-box {
            min-height: 330px;

            border-radius: 23px;
          }

          .cta-content {
            padding:
              45px
              18px;
          }
        }

        @media (max-width: 420px) {

          .hero-pill {
            font-size: 9px;

            letter-spacing: .03em;
          }

          .hero-actions {
            width: 100%;

            max-width: 290px;

            margin-left: auto;
            margin-right: auto;
          }

          .hero-action {
            width: 100%;
          }

          .calculator-input {
            font-size: 11px;
          }

          .hero-stat-number {
            font-size: 22px;
          }

          .result-metrics {
            gap: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            scroll-behavior:
              auto !important;

            transition-duration:
              0.01ms !important;
          }
        }

      `}</style>

      <main className="nexus-page">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="nexus-hero">

          <div className="nexus-grid" />
          <div className="hero-noise" />

          {/* Animated Color Orbs */}

          <div className="hero-orb hero-orb-blue" />

          <div className="hero-orb hero-orb-purple" />

          <div className="hero-orb hero-orb-pink" />

          <div className="hero-orb hero-orb-cyan" />

          <div className="hero-content">

            {/* PILL */}

            <div className="hero-pill">

              <span className="hero-live-dot" />

              Arcade Nexus Platform

              <span
                style={{
                  color: "#60a5fa",
                }}
              >
                •
              </span>

              Built for Arcade

            </div>

            {/* TITLE */}

            <h1 className="hero-title">

              Your Arcade journey,

              <br />

              <span className="hero-title-gradient">
                made simple.
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p className="hero-description">

              Calculate your{" "}

              <strong>
                Arcade points
              </strong>

              , track your progress,
              explore resources and stay
              connected with the community —
              all in one place.

            </p>

            {/* =================================================
                CALCULATOR
            ================================================= */}

            <div className="calculator-shell">

              <div className="calculator-glow" />

              <div className="calculator-border">

                <form
                  onSubmit={
                    handleHeroSubmit
                  }
                  className="calculator-inner"
                >

                  <div className="calculator-icon">

                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M12 3v18" />
                      <path d="M3 12h18" />
                      <path d="m7 7 10 10" />
                      <path d="m17 7-10 10" />
                    </svg>

                  </div>

                  <input
                    type="text"
                    value={heroUrl}
                    onChange={(e) =>
                      setHeroUrl(
                        e.target.value
                      )
                    }
                    disabled={
                      isCalculating
                    }
                    required
                    autoComplete="off"
                    placeholder="Paste your Google Cloud Skills public profile URL..."
                    className="calculator-input"
                  />

                  <button
                    type="submit"
                    disabled={
                      isCalculating
                    }
                    className="calculator-button"
                    aria-label={
                      isCalculating
                        ? "Calculating points"
                        : "Calculate points"
                    }
                  >

                    {isCalculating ? (

                      <span
                        className="premium-spinner"
                        aria-hidden="true"
                      />

                    ) : (

                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>

                    )}

                  </button>

                </form>

              </div>

            </div>

            {/* ERROR */}

            {heroError && (
              <div className="hero-error">
                {heroError}
              </div>
            )}

            {/* =================================================
                BIGGER HIGHLIGHTED ACTIONS
            ================================================= */}

            {!showResult && (

              <div className="hero-actions">

                <a
                  href="https://go.cloudskillsboost.google/arcade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-action"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>

                  Start Arcade Labs

                </a>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard"
                    )
                  }
                  className="hero-action"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                    />

                    <path d="M8 8h8" />
                    <path d="M8 12h5" />
                  </svg>

                  Smart Dashboard

                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/leaderboard"
                    )
                  }
                  className="hero-action"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >

                    <path d="M8 21h8" />

                    <path d="M12 17v4" />

                    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />

                    <path d="M7 7H4v2a3 3 0 0 0 3 3" />

                    <path d="M17 7h3v2a3 3 0 0 1-3 3" />

                  </svg>

                  Leaderboard

                </button>

              </div>

            )}

            {/* =================================================
                RESULT
            ================================================= */}

            {showResult &&
              calcResult && (

                <div className="result-card">

                  <button
                    type="button"
                    onClick={() =>
                      setShowResult(false)
                    }
                    className="result-close"
                    aria-label="Close result"
                  >
                    ×
                  </button>

                  <div className="result-user">

                    <div
                      className="result-avatar"
                      onClick={() =>
                        router.push(
                          "/dashboard"
                        )
                      }
                      role="button"
                      tabIndex={0}
                      title="Open Dashboard"
                    >

                      {calcResult.userAvatar ? (

                        <img
                          src={
                            calcResult.userAvatar
                          }
                          alt=""
                        />

                      ) : (

                        <div className="result-avatar-fallback">

                          {calcResult.userName?.charAt(
                            0
                          ) || "U"}

                        </div>

                      )}

                    </div>

                    <div>

                      <div className="result-name">

                        {calcResult.userName ||
                          "GOOGLE USER"}

                      </div>

                      <div className="result-points">

                        Total Points:{" "}

                        <strong>
                          {
                            calcResult.totalPoints
                          }
                        </strong>

                      </div>

                    </div>

                  </div>

                  <div className="result-metrics">

                    <div className="result-metric">

                      <span>
                        Game Badges
                      </span>

                      <strong>
                        {
                          calcResult
                            .breakdown
                            ?.games || 0
                        }
                      </strong>

                    </div>

                    <div className="result-divider" />

                    <div className="result-metric">

                      <span>
                        Skill Badges
                      </span>

                      <strong>
                        {
                          calcResult
                            .breakdown
                            ?.skills || 0
                        }
                      </strong>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="result-dashboard"
                    onClick={() =>
                      router.push(
                        "/dashboard"
                      )
                    }
                  >
                    Open Dashboard →
                  </button>

                </div>

              )}

            {/* =================================================
                STATS
            ================================================= */}

            <div className="hero-stats">

              <div className="hero-stat">

                <div className="hero-stat-number">
                  {formatStat(
                    stats.unique
                  )}
                </div>

                <div className="hero-stat-label">
                  Unique Profiles
                </div>

              </div>

              <div className="hero-stat">

                <div className="hero-stat-number">
                  {formatStat(
                    stats.analyzed
                  )}
                </div>

                <div className="hero-stat-label">
                  Profiles Analyzed
                </div>

              </div>

              <div className="hero-stat">

                <div className="hero-stat-number">
                  <VisitCounter />
                </div>

                <div className="hero-stat-label">
                  Total Visitors
                </div>

              </div>

              <div className="hero-stat">

                <div className="hero-stat-number rating-number">

                  <span>
                    4.9
                  </span>

                  <span className="rating-star">
                    ★
                  </span>

                </div>

                <div className="hero-stat-label">
                  Community Rating
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="section"
        >

          <div className="section-container">

            <div className="section-heading">

              <div className="eyebrow">
                Platform
              </div>

              <h2 className="section-title">

                Everything you need,

                <br />

                <span
                  style={{
                    color: "#2563eb",
                  }}
                >
                  in one place.
                </span>

              </h2>

              <p className="section-description">

                Arcade Nexus brings together
                your calculator, progress
                tracking, leaderboard,
                community resources and
                more into one focused
                platform.

              </p>

            </div>

            <div className="feature-grid">

              {[
                {
                  title:
                    "Points Calculator",

                  desc:
                    "Calculate Arcade points directly from your public Google Cloud Skills profile.",

                  link:
                    "/calculator",
                },

                {
                  title:
                    "Smart Dashboard",

                  desc:
                    "View your points, badges, activity and progress in a clean dashboard.",

                  link:
                    "/dashboard",
                },

                {
                  title:
                    "Live Leaderboard",

                  desc:
                    "Track your ranking and see community progress in real-time.",

                  link:
                    "/leaderboard",
                },

                {
                  title:
                    "Facilitator Program",

                  desc:
                    "Explore facilitator information, guidance and useful resources.",

                  link:
                    "/facilitator",
                },

                {
                  title:
                    "Skill Badges Guide",

                  desc:
                    "Discover skill badges and understand their contribution to your progress.",

                  link:
                    "/resources",
                },

                {
                  title:
                    "Swags & Community",

                  desc:
                    "Explore community posts, swag experiences and useful resources.",

                  link:
                    "/post",
                },
              ].map(
                (
                  feature,
                  index
                ) => (

                  <Link
                    key={
                      feature.title
                    }
                    href={
                      feature.link
                    }
                    className="feature-card"
                  >

                    <div className="feature-number">

                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}

                    </div>

                    <h3>
                      {
                        feature.title
                      }
                    </h3>

                    <p>
                      {
                        feature.desc
                      }
                    </p>

                    <span className="feature-link">
                      Explore →
                    </span>

                  </Link>

                )
              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            RESOURCES + SUPPORT
            LIGHT BACKGROUND
        ===================================================== */}

        <section className="section resources-section">

          <div className="section-container">

            <div className="section-heading">

              <div className="eyebrow">
                Resources
              </div>

              <h2 className="section-title">

                Get started.

                <br />

                <span
                  style={{
                    color: "#2563eb",
                  }}
                >
                  Keep moving.
                </span>

              </h2>

              <p className="section-description">

                Quick-start resources,
                platform tools and support —
                organized in one simple
                experience.

              </p>

            </div>

            <div className="guide-layout">

              {/* GUIDE */}

              <div className="light-panel">

                <div className="guide-tabs">

                  <button
                    type="button"
                    onClick={() =>
                      setActiveGuideTab(
                        "start"
                      )
                    }
                    className={`guide-tab ${
                      activeGuideTab ===
                      "start"
                        ? "active"
                        : ""
                    }`}
                  >
                    Getting Started
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveGuideTab(
                        "tools"
                      )
                    }
                    className={`guide-tab ${
                      activeGuideTab ===
                      "tools"
                        ? "active"
                        : ""
                    }`}
                  >
                    Platform Tools
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveGuideTab(
                        "points"
                      )
                    }
                    className={`guide-tab ${
                      activeGuideTab ===
                      "points"
                        ? "active"
                        : ""
                    }`}
                  >
                    Points System
                  </button>

                </div>

                <div className="guide-items">

                  {activeGuideTab ===
                    "start" &&
                    startSteps.map(
                      (item) => (

                        <a
                          key={
                            item.title
                          }
                          href={
                            item.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="guide-item"
                        >

                          <div className="guide-icon">

                            {
                              item.badge
                            }

                          </div>

                          <div>

                            <h3>

                              {
                                item.title
                              }

                              <span className="guide-badge">
                                Guide
                              </span>

                            </h3>

                            <p>
                              {
                                item.desc
                              }
                            </p>

                          </div>

                        </a>

                      )
                    )}

                  {activeGuideTab ===
                    "tools" &&
                    arcadeTools.map(
                      (item) => (

                        <Link
                          key={
                            item.title
                          }
                          href={
                            item.link
                          }
                          className="guide-item"
                        >

                          <div className="guide-icon">

                            {
                              item.badge
                            }

                          </div>

                          <div>

                            <h3>

                              {
                                item.title
                              }

                              <span className="guide-badge">
                                Tool
                              </span>

                            </h3>

                            <p>
                              {
                                item.desc
                              }
                            </p>

                          </div>

                        </Link>

                      )
                    )}

                  {activeGuideTab ===
                    "points" &&
                    pointsSystem.map(
                      (item) => (

                        <div
                          key={
                            item.title
                          }
                          className="guide-item"
                        >

                          <div className="guide-icon">

                            {
                              item.badge
                            }

                          </div>

                          <div>

                            <h3>

                              {
                                item.title
                              }

                              <span className="guide-badge">
                                Points
                              </span>

                            </h3>

                            <p>
                              {
                                item.desc
                              }
                            </p>

                          </div>

                        </div>

                      )
                    )}

                </div>

              </div>

              {/* SUPPORT */}

              <div className="light-panel support-panel">

                <h3 className="support-title">
                  Need help?
                </h3>

                <p className="support-description">

                  Submit your query and continue
                  the conversation directly
                  through WhatsApp.

                </p>

                <form
                  className="support-form"
                  onSubmit={
                    handleFormSubmit
                  }
                >

                  <input
                    className="support-input"
                    type="text"
                    required
                    value={
                      formName
                    }
                    onChange={(
                      e
                    ) =>
                      setFormName(
                        e.target.value
                      )
                    }
                    placeholder="Full name"
                  />

                  <select
                    className="support-select"
                    value={
                      formCategory
                    }
                    onChange={(
                      e
                    ) => {

                      setFormCategory(
                        e.target.value
                      );

                      setFormSubCategory(
                        ""
                      );

                    }}
                  >

                    <option>
                      Swags Delivery / Issue
                    </option>

                    <option>
                      Labs Completion Issue
                    </option>

                    <option>
                      Arcade Points Calculation
                    </option>

                    <option>
                      Other Queries
                    </option>

                  </select>

                  {(
                    formCategory ===
                      "Swags Delivery / Issue" ||
                    formCategory ===
                      "Labs Completion Issue" ||
                    formCategory ===
                      "Arcade Points Calculation"
                  ) && (

                    <select
                      className="support-select"
                      required
                      value={
                        formSubCategory
                      }
                      onChange={(
                        e
                      ) =>
                        setFormSubCategory(
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select specific issue
                      </option>

                      {formCategory ===
                        "Swags Delivery / Issue" && (
                        <>
                          <option value="Printos">
                            Printos Services
                          </option>

                          <option value="Whitesquare">
                            Whitesquare International
                          </option>
                        </>
                      )}

                      {formCategory ===
                        "Labs Completion Issue" && (
                        <>
                          <option value="Arcade Monthly Labs">
                            Arcade Monthly Labs
                          </option>

                          <option value="Skill Badges">
                            Skill Badges
                          </option>
                        </>
                      )}

                      {formCategory ===
                        "Arcade Points Calculation" && (
                        <>
                          <option value="Points Count Issue">
                            Points Count Issue
                          </option>

                          <option value="Invalid Public Profile Issue">
                            Invalid Public Profile Issue
                          </option>
                        </>
                      )}

                    </select>

                  )}

                  <textarea
                    className="support-textarea"
                    required
                    value={
                      formMessage
                    }
                    onChange={(
                      e
                    ) =>
                      setFormMessage(
                        e.target.value
                      )
                    }
                    placeholder="Tell us what you need help with..."
                  />

                  <button
                    type="submit"
                    className="support-button"
                  >
                    Submit Request →
                  </button>

                </form>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="section faq-section">

          <div className="section-container">

            <div className="section-heading">

              <div className="eyebrow">
                FAQ
              </div>

              <h2 className="section-title">

                Questions,

                <br />

                answered.

              </h2>

            </div>

            <FAQ />

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="cta-wrap">

          <div className="cta-box">

            <div className="cta-ring-one" />

            <div className="cta-ring-two" />

            <div className="cta-content">

              <div
                className="eyebrow"
                style={{
                  color: "#60a5fa",
                }}
              >
                Keep building
              </div>

              <h2 className="cta-title">
                Ready to level up?
              </h2>

              <p className="cta-description">

                Jump into Google Cloud Arcade,
                complete labs, earn points and
                keep your progress moving
                forward.

              </p>

              <a
                href="https://go.cloudskillsboost.google/arcade"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >

                Start Arcade Labs

                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>

              </a>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}