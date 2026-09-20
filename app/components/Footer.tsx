"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VisitCounter from "@/app/components/VisitCounter";
import { subscribeLeaderboard } from "@/lib/leaderboard";

import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  Calculator,
  LayoutGrid,
  BarChart3,
  BadgeCheck,
  UserPlus,
  CircleDollarSign,
  BookOpen,
  Eye,
  UserRoundPlus,
  ChartNoAxesCombined,
  Radio,
} from "lucide-react";

/* =========================================================
   FLOATING AVATAR POSITIONS
========================================================= */

const avatarPositions = [
  { left: "6%", duration: "6.8s", delay: "0s" },
  { left: "17%", duration: "5.8s", delay: "1.7s" },
  { left: "29%", duration: "7.2s", delay: ".8s" },
  { left: "41%", duration: "6.2s", delay: "2.6s" },
  { left: "53%", duration: "7.6s", delay: "1.3s" },
  { left: "65%", duration: "5.9s", delay: "3.2s" },
  { left: "77%", duration: "6.7s", delay: ".6s" },
  { left: "88%", duration: "5.3s", delay: "2.3s" },
  { left: "24%", duration: "6.4s", delay: "3.8s" },
  { left: "72%", duration: "7.1s", delay: "4.1s" },
];

export default function Footer() {
  const router = useRouter();

  const lastUpdated =
    "15 SEPTEMBER 2026 23:10 IST";

  /* =========================================================
     LIVE DATA
  ========================================================= */

  const [leaderboardCount, setLeaderboardCount] =
    useState(0);

  const [profilesAnalyzed, setProfilesAnalyzed] =
    useState(0);

  const [leaderboardAvatars, setLeaderboardAvatars] =
    useState<string[]>([]);

  const [avatarStartIndex, setAvatarStartIndex] =
    useState(0);

  const [onlineUsers, setOnlineUsers] =
    useState(1);

  /* =========================================================
     LEADERBOARD SUBSCRIPTION
  ========================================================= */

  useEffect(() => {
    const unsub = subscribeLeaderboard((data) => {
      setLeaderboardCount(data.length);

      const totalAnalyzed = data.reduce(
        (acc: number, user: any) =>
          acc + (user.calculationCount || 1),
        0
      );

      setProfilesAnalyzed(totalAnalyzed);

      const avatars = data.map(
        (user: any) =>
          user.photoURL ||
          "https://i.postimg.cc/Nf2ykWb1/1000111442.png"
      );

      setLeaderboardAvatars(avatars);
    });

    return () => unsub();
  }, []);

  /* =========================================================
     ROTATE AVATARS
  ========================================================= */

  useEffect(() => {
    if (leaderboardAvatars.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setAvatarStartIndex(
        (prevIndex) =>
          (prevIndex + 10) %
          leaderboardAvatars.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [leaderboardAvatars.length]);

  /* =========================================================
     LIVE PRESENCE
  ========================================================= */

  useEffect(() => {
    if (!db) {
      return;
    }

    const sessionId =
      Math.random()
        .toString(36)
        .substring(2, 15);

    const presenceRef = doc(
      db,
      "live_users",
      sessionId
    );

    const setOnlineStatus = async () => {
      try {
        await setDoc(
          presenceRef,
          {
            lastActive: Date.now(),
          },
          {
            merge: true,
          }
        );
      } catch (error) {
        console.error(
          "Live presence error:",
          error
        );
      }
    };

    setOnlineStatus();

    const heartbeat = setInterval(
      setOnlineStatus,
      30000
    );

    const cleanup = () => {
      deleteDoc(
        presenceRef
      ).catch(() => {});
    };

    window.addEventListener(
      "beforeunload",
      cleanup
    );

    return () => {
      clearInterval(heartbeat);

      window.removeEventListener(
        "beforeunload",
        cleanup
      );

      cleanup();
    };
  }, []);

  /* =========================================================
     LIVE USERS
  ========================================================= */

  useEffect(() => {
    if (!db) {
      return;
    }

    const liveUsersRef =
      collection(
        db,
        "live_users"
      );

    const unsub = onSnapshot(
      liveUsersRef,
      (snapshot) => {
        const now = Date.now();

        let activeCount = 0;

        snapshot.forEach(
          (document) => {
            const lastActive =
              document.data()
                .lastActive;

            if (
              now - lastActive <
              60000
            ) {
              activeCount++;
            }
          }
        );

        setOnlineUsers(
          Math.max(
            activeCount,
            1
          )
        );
      },
      (error) => {
        console.error(
          "Live users listener error:",
          error
        );
      }
    );

    return () => unsub();
  }, []);

  /* =========================================================
     FEEDBACK
  ========================================================= */

  const handleFeedback = async (
    score: number
  ) => {
    try {
      if (db) {
        await addDoc(
          collection(
            db,
            "platform_feedback"
          ),
          {
            rating: score,
            source: "footer",
            timestamp:
              Date.now(),
            date:
              new Date().toLocaleDateString(
                "en-IN"
              ),
          }
        );
      }
    } catch (error) {
      console.error(
        "Error saving footer feedback:",
        error
      );
    }
  };

  /* =========================================================
     INLINE ARROW
  ========================================================= */

  const ArrowIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );

  /* =========================================================
     INLINE EXTERNAL ICON
  ========================================================= */

  const ExternalIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );

  return (
    <footer
      className="arcade-footer"
      aria-labelledby="footer-heading"
    >
      <h2
        id="footer-heading"
        className="sr-only"
      >
        Footer
      </h2>

      <style>{`

        /* =====================================================
           BASE
        ===================================================== */

        .arcade-footer {
          position: relative;

          width: 100%;

          overflow: hidden;

          background: #05070b;

          color: #ffffff;

          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .arcade-footer *,
        .arcade-footer *::before,
        .arcade-footer *::after {
          box-sizing: border-box;
        }

        /* =====================================================
           AMBIENT LIGHT
        ===================================================== */

        .footer-ambient {
          position: absolute;

          pointer-events: none;

          border-radius: 999px;

          filter: blur(105px);

          opacity: .55;
        }

        .footer-ambient-blue {
          width: 480px;
          height: 480px;

          left: -230px;
          top: -160px;

          background:
            rgba(
              37,
              99,
              235,
              .18
            );

          animation:
            footerBlueFloat
            15s
            ease-in-out
            infinite
            alternate;
        }

        .footer-ambient-purple {
          width: 430px;
          height: 430px;

          right: -180px;
          top: 100px;

          background:
            rgba(
              124,
              58,
              237,
              .15
            );

          animation:
            footerPurpleFloat
            17s
            ease-in-out
            infinite
            alternate;
        }

        .footer-ambient-pink {
          width: 300px;
          height: 300px;

          left: 42%;
          top: 35%;

          background:
            rgba(
              236,
              72,
              153,
              .075
            );

          animation:
            footerPinkFloat
            19s
            ease-in-out
            infinite
            alternate;
        }

        @keyframes footerBlueFloat {
          from {
            transform:
              translate3d(
                0,
                0,
                0
              )
              scale(1);
          }

          to {
            transform:
              translate3d(
                70px,
                35px,
                0
              )
              scale(1.12);
          }
        }

        @keyframes footerPurpleFloat {
          from {
            transform:
              translate3d(
                0,
                0,
                0
              )
              scale(1);
          }

          to {
            transform:
              translate3d(
                -55px,
                -28px,
                0
              )
              scale(1.1);
          }
        }

        @keyframes footerPinkFloat {
          from {
            transform:
              translate3d(
                0,
                0,
                0
              )
              scale(1);
          }

          to {
            transform:
              translate3d(
                40px,
                -32px,
                0
              )
              scale(1.16);
          }
        }

        /* =====================================================
           GRID
        ===================================================== */

        .footer-grid-bg {
          position: absolute;

          inset: 0;

          pointer-events: none;

          opacity: .055;

          background-image:
            linear-gradient(
              rgba(
                255,
                255,
                255,
                .055
              ) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(
                255,
                255,
                255,
                .055
              ) 1px,
              transparent 1px
            );

          background-size:
            72px 72px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 82%
            );
        }

        /* =====================================================
           CONTAINER
        ===================================================== */

        .footer-container {
          position: relative;

          z-index: 2;

          width:
            min(
              1400px,
              calc(100% - 48px)
            );

          margin:
            0 auto;

          padding:
            82px
            0
            24px;
        }

        /* =====================================================
           BRAND HERO
        ===================================================== */

        .footer-brand-section {
          display: grid;

          grid-template-columns:
            minmax(0,1.25fr)
            minmax(360px,.75fr);

          gap:
            60px;

          align-items:
            end;

          padding-bottom:
            62px;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              .09
            );
        }

        .brand-kicker {
          display: inline-flex;

          align-items: center;

          gap:
            8px;

          color:
            #93c5fd;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            .16em;

          text-transform:
            uppercase;
        }

        .brand-kicker-dot {
          width:
            6px;

          height:
            6px;

          flex-shrink:
            0;

          border-radius:
            50%;

          background:
            #60a5fa;

          box-shadow:
            0 0 16px
            rgba(
              96,
              165,
              250,
              .9
            );

          animation:
            livePulse
            2.2s
            ease-in-out
            infinite;
        }

        @keyframes livePulse {
          0%,
          100% {
            opacity: .45;

            transform:
              scale(1);
          }

          50% {
            opacity: 1;

            transform:
              scale(1.22);
          }
        }

        .brand-title {
          margin:
            16px 0 0;

          max-width:
            800px;

          color:
            #ffffff;

          font-size:
            clamp(
              44px,
              6vw,
              78px
            );

          line-height:
            .98;

          letter-spacing:
            -.065em;

          font-weight:
            750;
        }

        .brand-title-gradient {
          background:
            linear-gradient(
              100deg,
              #ffffff 0%,
              #bfdbfe 28%,
              #60a5fa 52%,
              #c084fc 77%,
              #f0abfc 100%
            );

          background-size:
            220% auto;

          -webkit-background-clip:
            text;

          background-clip:
            text;

          color:
            transparent;

          animation:
            footerGradient
            8s
            ease-in-out
            infinite;
        }

        @keyframes footerGradient {
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

        .brand-description {
          max-width:
            820px;

          margin:
            22px 0 0;

          color:
            #919baa;

          font-size:
            14px;

          line-height:
            1.85;

          font-weight:
            400;
        }

        .brand-description strong {
          color:
            #e5e7eb;

          font-weight:
            650;
        }

        /* =====================================================
           BRAND META
        ===================================================== */

        .brand-meta {
          display:
            flex;

          align-items:
            center;

          gap:
            12px;

          margin-top:
            27px;
        }

        .brand-mark {
          position:
            relative;

          width:
            45px;

          height:
            45px;

          display:
            grid;

          place-items:
            center;

          flex-shrink:
            0;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .11
            );

          border-radius:
            14px;

          background:
            linear-gradient(
              145deg,
              #111827,
              #1e293b
            );

          color:
            #ffffff;

          box-shadow:
            0 12px 35px
            rgba(
              0,
              0,
              0,
              .25
            );
        }

        .brand-mark::before {
          content:
            "";

          position:
            absolute;

          width:
            36px;

          height:
            36px;

          left:
            -15px;

          top:
            -18px;

          border-radius:
            50%;

          background:
            rgba(
              96,
              165,
              250,
              .35
            );

          filter:
            blur(12px);
        }

        .brand-meta-text {
          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;
        }

        .brand-meta-name {
          color:
            #ffffff;

          font-size:
            13px;

          font-weight:
            650;
        }

        .brand-meta-sub {
          color:
            #687384;

          font-size:
            11px;

          font-weight:
            500;
        }

        /* =====================================================
           SOCIAL ICONS
        ===================================================== */

        .footer-socials {
          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          margin-top:
            24px;
        }

        .footer-social {
          width:
            39px;

          height:
            39px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          flex-shrink:
            0;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .10
            );

          border-radius:
            11px;

          background:
            rgba(
              255,
              255,
              255,
              .035
            );

          color:
            #8d98a8;

          text-decoration:
            none;

          transition:
            transform .2s ease,
            color .2s ease,
            border-color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .footer-social svg {
          display:
            block;

          width:
            17px !important;

          height:
            17px !important;

          min-width:
            17px;

          min-height:
            17px;

          max-width:
            17px;

          max-height:
            17px;

          flex-shrink:
            0;
        }

        .footer-social:hover {
          color:
            #ffffff;

          border-color:
            rgba(
              96,
              165,
              250,
              .34
            );

          background:
            rgba(
              255,
              255,
              255,
              .07
            );

          transform:
            translateY(-3px);

          box-shadow:
            0 11px 28px
            rgba(
              37,
              99,
              235,
              .13
            );
        }

        /* =====================================================
           COMMUNITY NETWORK
        ===================================================== */

        .network-card {
          position:
            relative;

          min-height:
            250px;

          padding:
            21px;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .09
            );

          border-radius:
            22px;

          background:
            linear-gradient(
              145deg,
              rgba(
                255,
                255,
                255,
                .065
              ),
              rgba(
                255,
                255,
                255,
                .025
              )
            );

          box-shadow:
            inset 0 1px
            rgba(
              255,
              255,
              255,
              .05
            ),
            0 30px 80px
            rgba(
              0,
              0,
              0,
              .22
            );

          backdrop-filter:
            blur(20px);
        }

        .network-card::before {
          content:
            "";

          position:
            absolute;

          width:
            230px;

          height:
            230px;

          right:
            -100px;

          top:
            -120px;

          border-radius:
            50%;

          background:
            rgba(
              96,
              165,
              250,
              .10
            );

          filter:
            blur(35px);
        }

        .network-header {
          position:
            relative;

          z-index:
            2;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            12px;
        }

        .network-label {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          color:
            #a7f3d0;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            .12em;

          text-transform:
            uppercase;
        }

        .network-live-dot {
          width:
            6px;

          height:
            6px;

          flex-shrink:
            0;

          border-radius:
            50%;

          background:
            #34d399;

          box-shadow:
            0 0 15px
            rgba(
              52,
              211,
              153,
              .8
            );
        }

        .network-caption {
          color:
            #687384;

          font-size:
            10px;

          font-weight:
            600;
        }

        .network-stat {
          position:
            relative;

          z-index:
            2;

          margin-top:
            16px;

          color:
            #ffffff;

          font-size:
            39px;

          line-height:
            1;

          font-weight:
            750;

          letter-spacing:
            -.055em;
        }

        .network-stat-sub {
          margin-top:
            6px;

          color:
            #6b7585;

          font-size:
            11px;

          font-weight:
            500;
        }

        .network-bars {
          position:
            relative;

          z-index:
            2;

          display:
            grid;

          grid-template-columns:
            repeat(
              4,
              1fr
            );

          gap:
            7px;

          margin-top:
            22px;
        }

        .network-bar {
          height:
            4px;

          overflow:
            hidden;

          border-radius:
            99px;

          background:
            rgba(
              255,
              255,
              255,
              .075
            );
        }

        .network-bar span {
          display:
            block;

          width:
            68%;

          height:
            100%;

          border-radius:
            inherit;

          background:
            linear-gradient(
              90deg,
              #60a5fa,
              #c084fc
            );

          animation:
            barPulse
            3s
            ease-in-out
            infinite
            alternate;
        }

        .network-bar:nth-child(2) span {
          width:
            83%;

          animation-delay:
            .3s;
        }

        .network-bar:nth-child(3) span {
          width:
            54%;

          animation-delay:
            .6s;
        }

        .network-bar:nth-child(4) span {
          width:
            91%;

          animation-delay:
            .9s;
        }

        @keyframes barPulse {
          from {
            opacity:
              .55;

            transform:
              scaleX(.88);

            transform-origin:
              left;
          }

          to {
            opacity:
              1;

            transform:
              scaleX(1);

            transform-origin:
              left;
          }
        }

        .network-bottom {
          position:
            relative;

          z-index:
            2;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            10px;

          margin-top:
            21px;
        }

        .network-avatar-stack {
          display:
            flex;

          align-items:
            center;

          padding-left:
            7px;
        }

        .network-avatar {
          width:
            30px;

          height:
            30px;

          margin-left:
            -7px;

          border:
            2px solid
            #0b0e14;

          border-radius:
            50%;

          background:
            #1e293b;

          object-fit:
            cover;

          transition:
            transform .2s ease;
        }

        .network-avatar:hover {
          position:
            relative;

          z-index:
            5;

          transform:
            translateY(-3px);
        }

        .network-more {
          color:
            #667085;

          font-size:
            10px;

          font-weight:
            600;
        }

        /* =====================================================
           NAVIGATION
        ===================================================== */

        .nav-area {
          padding:
            58px
            0;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              .09
            );
        }

        .nav-heading-row {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            25px;

          margin-bottom:
            25px;
        }

        .nav-eyebrow {
          margin:
            0 0 7px;

          color:
            #60a5fa;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            .15em;

          text-transform:
            uppercase;
        }

        .nav-title {
          margin:
            0;

          color:
            #ffffff;

          font-size:
            26px;

          line-height:
            1.15;

          font-weight:
            700;

          letter-spacing:
            -.035em;
        }

        .nav-heading-copy {
          max-width:
            390px;

          color:
            #687384;

          font-size:
            12px;

          line-height:
            1.65;

          font-weight:
            400;

          text-align:
            right;
        }

        .nav-grid {
          display:
            grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap:
            13px;
        }

        .nav-card {
          position:
            relative;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          min-height:
            78px;

          padding:
            14px
            16px;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .075
            );

          border-radius:
            16px;

          background:
            rgba(
              255,
              255,
              255,
              .025
            );

          color:
            #ffffff;

          text-decoration:
            none;

          cursor:
            pointer;

          transition:
            transform .25s ease,
            border-color .25s ease,
            background .25s ease,
            box-shadow .25s ease;
        }

        .nav-card::before {
          content:
            "";

          position:
            absolute;

          inset:
            0;

          background:
            linear-gradient(
              100deg,
              transparent,
              rgba(
                96,
                165,
                250,
                .07
              ),
              rgba(
                192,
                132,
                252,
                .05
              ),
              transparent
            );

          transform:
            translateX(-110%);

          transition:
            transform .6s ease;
        }

        .nav-card:hover {
          transform:
            translateY(-3px);

          border-color:
            rgba(
              96,
              165,
              250,
              .25
            );

          background:
            rgba(
              255,
              255,
              255,
              .045
            );

          box-shadow:
            0 18px 42px
            rgba(
              0,
              0,
              0,
              .20
            );
        }

        .nav-card:hover::before {
          transform:
            translateX(110%);
        }

        .nav-card-left {
          position:
            relative;

          z-index:
            2;

          display:
            flex;

          align-items:
            center;

          gap:
            13px;
        }

        .nav-icon-box {
          width:
            43px;

          height:
            43px;

          display:
            grid;

          place-items:
            center;

          flex-shrink:
            0;

          border:
            1px solid
            rgba(
              96,
              165,
              250,
              .13
            );

          border-radius:
            12px;

          background:
            rgba(
              37,
              99,
              235,
              .10
            );

          color:
            #93c5fd;

          transition:
            transform .25s ease,
            background .25s ease;
        }

        .nav-card:hover .nav-icon-box {
          transform:
            scale(1.06);

          background:
            rgba(
              37,
              99,
              235,
              .17
            );
        }

        .nav-card-title {
          color:
            #f8fafc;

          font-size:
            14px;

          font-weight:
            650;
        }

        .nav-card-sub {
          margin-top:
            4px;

          color:
            #687384;

          font-size:
            11px;

          line-height:
            1.45;

          font-weight:
            400;
        }

        .nav-arrow {
          position:
            relative;

          z-index:
            2;

          width:
            34px;

          height:
            34px;

          display:
            grid;

          place-items:
            center;

          flex-shrink:
            0;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .08
            );

          border-radius:
            10px;

          color:
            #687384;

          transition:
            transform .2s ease,
            color .2s ease,
            border-color .2s ease;
        }

        .nav-card:hover .nav-arrow {
          color:
            #93c5fd;

          border-color:
            rgba(
              96,
              165,
              250,
              .24
            );

          transform:
            translateX(2px);
        }

        /* =====================================================
           RESOURCE LINKS
        ===================================================== */

        .resource-link-row {
          display:
            grid;

          grid-template-columns:
            repeat(
              3,
              1fr
            );

          gap:
            10px;

          margin-top:
            13px;
        }

        .resource-link {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          min-height:
            51px;

          padding:
            0
            13px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .065
            );

          border-radius:
            13px;

          background:
            rgba(
              255,
              255,
              255,
              .02
            );

          color:
            #8b95a5;

          text-decoration:
            none;

          font-size:
            11px;

          font-weight:
            600;

          transition:
            transform .2s ease,
            background .2s ease,
            color .2s ease,
            border-color .2s ease;
        }

        .resource-link:hover {
          transform:
            translateY(-2px);

          color:
            #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              .045
            );

          border-color:
            rgba(
              96,
              165,
              250,
              .20
            );
        }

        .resource-link-icon {
          width:
            30px;

          height:
            30px;

          display:
            grid;

          place-items:
            center;

          flex-shrink:
            0;

          border-radius:
            9px;

          background:
            rgba(
              255,
              255,
              255,
              .05
            );

          color:
            #60a5fa;
        }

        /* =====================================================
           LOWER AREA
        ===================================================== */

        .lower-area {
          display:
            grid;

          grid-template-columns:
            minmax(
              0,
              .8fr
            )
            minmax(
              0,
              1.2fr
            );

          gap:
            18px;

          padding:
            58px
            0;
        }

        /* =====================================================
           FEEDBACK
        ===================================================== */

        .feedback-card {
          position:
            relative;

          min-height:
            272px;

          padding:
            24px;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .085
            );

          border-radius:
            20px;

          background:
            linear-gradient(
              145deg,
              rgba(
                255,
                255,
                255,
                .055
              ),
              rgba(
                255,
                255,
                255,
                .02
              )
            );

          box-shadow:
            0 22px 60px
            rgba(
              0,
              0,
              0,
              .17
            );
        }

        .feedback-card::before {
          content:
            "";

          position:
            absolute;

          width:
            190px;

          height:
            190px;

          right:
            -95px;

          top:
            -110px;

          border-radius:
            50%;

          background:
            rgba(
              168,
              85,
              247,
              .11
            );

          filter:
            blur(28px);
        }

        .feedback-label {
          position:
            relative;

          z-index:
            2;

          color:
            #60a5fa;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            .13em;

          text-transform:
            uppercase;
        }

        .feedback-title {
          position:
            relative;

          z-index:
            2;

          margin:
            10px
            0
            0;

          color:
            #ffffff;

          font-size:
            19px;

          line-height:
            1.28;

          font-weight:
            700;

          letter-spacing:
            -.025em;
        }

        .feedback-copy {
          position:
            relative;

          z-index:
            2;

          margin:
            8px
            0
            0;

          max-width:
            420px;

          color:
            #687384;

          font-size:
            12px;

          line-height:
            1.65;
        }

        .feedback-options {
          position:
            relative;

          z-index:
            2;

          display:
            flex;

          gap:
            8px;

          margin-top:
            22px;
        }

        .feedback-option {
          width:
            45px;

          height:
            45px;

          display:
            grid;

          place-items:
            center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .075
            );

          border-radius:
            12px;

          background:
            rgba(
              255,
              255,
              255,
              .035
            );

          cursor:
            pointer;

          font-size:
            22px;

          line-height:
            1;

          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .feedback-option:hover {
          transform:
            translateY(-4px)
            scale(1.04);

          border-color:
            rgba(
              96,
              165,
              250,
              .30
            );

          background:
            rgba(
              255,
              255,
              255,
              .065
            );

          box-shadow:
            0 10px 28px
            rgba(
              37,
              99,
              235,
              .14
            );
        }

        .feedback-option:active {
          transform:
            scale(.96);
        }

        .feedback-scale {
          position:
            relative;

          z-index:
            2;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-top:
            12px;

          color:
            #596373;

          font-size:
            10px;

          font-weight:
            550;
        }

        /* =====================================================
           ANALYTICS
        ===================================================== */

        .analytics-panel {
          position:
            relative;

          overflow:
            hidden;

          padding:
            19px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .085
            );

          border-radius:
            20px;

          background:
            linear-gradient(
              145deg,
              rgba(
                255,
                255,
                255,
                .055
              ),
              rgba(
                255,
                255,
                255,
                .018
              )
            );
        }

        .analytics-heading {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            15px;

          padding:
            2px
            4px
            14px;
        }

        .analytics-title {
          color:
            #ffffff;

          font-size:
            14px;

          font-weight:
            650;
        }

        .analytics-status {
          display:
            inline-flex;

          align-items:
            center;

          gap:
            6px;

          padding:
            6px
            9px;

          border:
            1px solid
            rgba(
              52,
              211,
              153,
              .12
            );

          border-radius:
            999px;

          background:
            rgba(
              16,
              185,
              129,
              .05
            );

          color:
            #6ee7b7;

          font-size:
            9px;

          font-weight:
            700;

          letter-spacing:
            .08em;

          text-transform:
            uppercase;
        }

        .analytics-status-dot {
          width:
            5px;

          height:
            5px;

          border-radius:
            50%;

          background:
            #34d399;

          box-shadow:
            0 0 10px
            rgba(
              52,
              211,
              153,
              .8
            );
        }

        .metrics-grid {
          display:
            grid;

          grid-template-columns:
            repeat(
              2,
              1fr
            );

          gap:
            10px;
        }

        .metric-box {
          position:
            relative;

          min-height:
            101px;

          padding:
            16px;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .065
            );

          border-radius:
            14px;

          background:
            rgba(
              255,
              255,
              255,
              .025
            );

          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease;
        }

        .metric-box:hover {
          transform:
            translateY(-2px);

          border-color:
            rgba(
              96,
              165,
              250,
              .16
            );

          background:
            rgba(
              255,
              255,
              255,
              .04
            );
        }

        .metric-box::after {
          content:
            "";

          position:
            absolute;

          width:
            70px;

          height:
            70px;

          right:
            -35px;

          bottom:
            -35px;

          border-radius:
            50%;

          background:
            rgba(
              59,
              130,
              246,
              .10
            );

          filter:
            blur(14px);

          pointer-events:
            none;
        }

        .metric-label-row {
          display:
            flex;

          align-items:
            center;

          gap:
            7px;

          color:
            #6d7888;
        }

        .metric-label {
          font-size:
            9px;

          line-height:
            1.3;

          font-weight:
            700;

          letter-spacing:
            .10em;

          text-transform:
            uppercase;
        }

        .metric-value {
          margin-top:
            13px;

          color:
            #ffffff;

          font-size:
            24px;

          line-height:
            1;

          font-weight:
            750;

          letter-spacing:
            -.045em;
        }

        /* =====================================================
           LIVE CARD
        ===================================================== */

        .metric-live {
          border-color:
            rgba(
              52,
              211,
              153,
              .12
            );

          background:
            linear-gradient(
              145deg,
              rgba(
                16,
                185,
                129,
                .05
              ),
              rgba(
                255,
                255,
                255,
                .02
              )
            );
        }

        .avatar-field {
          position:
            absolute;

          inset:
            0;

          overflow:
            hidden;

          pointer-events:
            none;

          opacity:
            .8;

          mask-image:
            linear-gradient(
              to bottom,
              transparent,
              black 10%,
              black 75%,
              transparent
            );
        }

        .floating-avatar {
          position:
            absolute;

          bottom:
            -26px;

          width:
            22px;

          height:
            22px;

          border:
            2px solid
            #0a0d13;

          border-radius:
            50%;

          background:
            #1e293b;

          object-fit:
            cover;

          animation-name:
            avatarFloat;

          animation-timing-function:
            linear;

          animation-iteration-count:
            infinite;
        }

        @keyframes avatarFloat {
          0% {
            opacity:
              0;

            transform:
              translateY(25px)
              scale(.65);
          }

          16% {
            opacity:
              .8;
          }

          48% {
            opacity:
              1;

            transform:
              translateY(-52px)
              scale(1);
          }

          82% {
            opacity:
              .55;

            transform:
              translateY(-108px)
              scale(.86);
          }

          100% {
            opacity:
              0;

            transform:
              translateY(-145px)
              scale(.55);
          }
        }

        /* =====================================================
           BOTTOM
        ===================================================== */

        .footer-bottom {
          padding-top:
            28px;

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              .08
            );
        }

        .footer-disclaimer {
          max-width:
            1180px;

          margin:
            0;

          color:
            #5d6878;

          font-size:
            10px;

          line-height:
            1.75;

          font-weight:
            400;
        }

        .footer-disclaimer strong {
          color:
            #8d98a8;

          font-weight:
            700;
        }

        .footer-bottom-bar {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          flex-wrap:
            wrap;

          padding:
            23px
            0
            8px;
        }

        .copyright {
          margin:
            0;

          color:
            #657081;

          font-size:
            10px;

          line-height:
            1.4;

          font-weight:
            550;
        }

        .bottom-right {
          display:
            flex;

          align-items:
            center;

          gap:
            17px;

          flex-wrap:
            wrap;
        }

        .updated-pill {
          display:
            inline-flex;

          align-items:
            center;

          gap:
            6px;

          min-height:
            29px;

          padding:
            0
            10px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .08
            );

          border-radius:
            999px;

          background:
            rgba(
              255,
              255,
              255,
              .025
            );

          color:
            #6b7585;

          font-size:
            9px;

          line-height:
            1;

          font-weight:
            600;

          white-space:
            nowrap;
        }

        .updated-pill strong {
          color:
            #9da7b5;

          font-weight:
            700;
        }

        .legal-links {
          display:
            flex;

          align-items:
            center;

          gap:
            11px;

          flex-wrap:
            wrap;
        }

        .legal-button {
          padding:
            0;

          border:
            0;

          background:
            transparent;

          color:
            #6b7585;

          cursor:
            pointer;

          font-family:
            inherit;

          font-size:
            10px;

          line-height:
            1.5;

          font-weight:
            600;

          transition:
            color .18s ease;
        }

        .legal-button:hover {
          color:
            #93c5fd;
        }

        .legal-dot {
          width:
            3px;

          height:
            3px;

          border-radius:
            50%;

          background:
            #364152;
        }

        /* =====================================================
           CREATORS
        ===================================================== */

        .creator-area {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;
        }

        .creator-avatars {
          display:
            flex;

          align-items:
            center;

          padding-left:
            5px;
        }

        .creator-link {
          display:
            block;

          margin-left:
            -5px;
        }

        .creator-avatar {
          width:
            31px;

          height:
            31px;

          display:
            block;

          border:
            2px solid
            #05070b;

          border-radius:
            50%;

          background:
            #1e293b;

          object-fit:
            cover;

          transition:
            transform .2s ease;
        }

        .creator-link:hover
          .creator-avatar {
          position:
            relative;

          z-index:
            3;

          transform:
            translateY(-3px);
        }

        .creator-label {
          color:
            #687384;

          font-size:
            9px;

          line-height:
            1.45;

          font-weight:
            600;
        }

        .creator-label strong {
          display:
            block;

          color:
            #8994a4;

          font-weight:
            650;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 1050px) {

          .footer-brand-section {
            grid-template-columns:
              1fr;
          }

          .network-card {
            max-width:
              620px;
          }

          .lower-area {
            grid-template-columns:
              1fr;
          }

          .feedback-card {
            max-width:
              620px;
          }

        }

        @media (max-width: 760px) {

          .footer-container {
            width:
              min(
                100% - 30px,
                700px
              );

            padding:
              62px
              0
              18px;
          }

          .footer-brand-section {
            gap:
              32px;

            padding-bottom:
              44px;
          }

          .brand-title {
            font-size:
              clamp(
                40px,
                12vw,
                56px
              );
          }

          .brand-description {
            font-size:
              12.5px;

            line-height:
              1.75;
          }

          .nav-area {
            padding:
              42px
              0;
          }

          .nav-heading-row {
            flex-direction:
              column;

            align-items:
              flex-start;
          }

          .nav-heading-copy {
            max-width:
              500px;

            text-align:
              left;
          }

          .nav-grid {
            grid-template-columns:
              1fr;
          }

          .resource-link-row {
            grid-template-columns:
              1fr;
          }

          .lower-area {
            padding:
              42px
              0;
          }

          .metrics-grid {
            gap:
              8px;
          }

          .metric-value {
            font-size:
              21px;
          }

          .footer-bottom-bar {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .bottom-right {
            width:
              100%;

            align-items:
              flex-start;

            flex-direction:
              column;

            gap:
              13px;
          }

          .creator-area {
            width:
              100%;
          }

        }

        @media (max-width: 430px) {

          .footer-container {
            width:
              calc(
                100% - 22px
              );
          }

          .network-card {
            padding:
              16px;
          }

          .network-stat {
            font-size:
              32px;
          }

          .nav-card {
            min-height:
              71px;

            padding:
              12px;
          }

          .nav-icon-box {
            width:
              39px;

            height:
              39px;
          }

          .nav-card-title {
            font-size:
              12px;
          }

          .nav-card-sub {
            font-size:
              10px;
          }

          .feedback-card {
            padding:
              20px;
          }

          .feedback-option {
            width:
              40px;

            height:
              40px;

            font-size:
              19px;
          }

          .metric-box {
            min-height:
              91px;

            padding:
              13px;
          }

          .metric-label {
            font-size:
              8px;
          }

        }

      `}</style>

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="footer-grid-bg" />

      <div
        className="
          footer-ambient
          footer-ambient-blue
        "
      />

      <div
        className="
          footer-ambient
          footer-ambient-purple
        "
      />

      <div
        className="
          footer-ambient
          footer-ambient-pink
        "
      />

      <div className="footer-container">

        {/* ===================================================
            BRAND HERO
        =================================================== */}

        <section className="footer-brand-section">

          <div>

            <div className="brand-kicker">

              <span
                className="brand-kicker-dot"
              />

              Arcade Nexus Platform

            </div>

            <h2 className="brand-title">

              Built for the

              <br />

              <span className="brand-title-gradient">
                Arcade journey.
              </span>

            </h2>

            <p className="brand-description">

              An independent, community-driven
              platform designed by{" "}

              <strong>
                Manish
              </strong>

              {" "}and{" "}

              <strong>
                Anjali
              </strong>

              {" "}to make the Google Cloud Arcade
              journey simpler, smarter, and more
              rewarding. Built for Arcade learners
              and enthusiasts, Arcade Nexus helps
              you effortlessly calculate and track
              points, monitor skill badges and
              achievements, follow milestones,
              explore leaderboard progress, and
              stay updated with important Arcade
              activities. Our goal is to bring
              everything you need into one clean,
              reliable, and easy-to-use platform,
              helping you save time, understand
              your progress, and stay focused on
              reaching your next Arcade milestone.

            </p>

            <div className="brand-meta">

              <div className="brand-mark">

                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>

              </div>

              <div className="brand-meta-text">

                <span className="brand-meta-name">
                  Arcade Nexus
                </span>

                <span className="brand-meta-sub">
                  Community-driven platform
                </span>

              </div>

            </div>

            {/* =================================================
                SOCIAL LINKS
            ================================================= */}

            <div className="footer-socials">

              {/* WHATSAPP */}

              <a
                href="https://chat.whatsapp.com/GWFSFSVWEQE0cwKjVmrdXj"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="WhatsApp Community"
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.84 11.84 0 0012.07 0C5.55 0 .25 5.3.25 11.82c0 2.08.54 4.11 1.56 5.9L.25 24l6.43-1.51a11.84 11.84 0 005.39 1.29h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.38-8.48ZM12.08 21.75c-1.68 0-3.33-.45-4.77-1.3l-.34-.2-3.82.9.91-3.73-.22-.35a9.9 9.9 0 01-1.51-5.25c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.88 9.88 0 012.9 7.01c0 5.47-4.45 9.93-9.92 9.93Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.34.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                </svg>

              </a>

              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/company/arcade-nexus/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="LinkedIn"
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
                </svg>

              </a>

              {/* APP */}

              <a
                href="https://expo.dev/artifacts/eas/xmR9GpsFdcWwb9TAT9qCC6.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="Download App"
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 20h14" />
                </svg>

              </a>

            </div>

          </div>

          {/* =================================================
              NETWORK CARD
          ================================================= */}

          <div className="network-card">

            <div className="network-header">

              <div className="network-label">

                <span className="network-live-dot" />

                Community Network

              </div>

              <span className="network-caption">
                LIVE DATA
              </span>

            </div>

            <div className="network-stat">
              {
                leaderboardCount.toLocaleString()
              }
            </div>

            <div className="network-stat-sub">
              Unique profiles connected
            </div>

            <div className="network-bars">

              <div className="network-bar">
                <span />
              </div>

              <div className="network-bar">
                <span />
              </div>

              <div className="network-bar">
                <span />
              </div>

              <div className="network-bar">
                <span />
              </div>

            </div>

            <div className="network-bottom">

              <div className="network-avatar-stack">

                {leaderboardAvatars
                  .slice(
                    0,
                    5
                  )
                  .map(
                    (
                      avatar,
                      index
                    ) => (

                      <img
                        key={index}
                        src={avatar}
                        alt=""
                        className="network-avatar"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://i.postimg.cc/Nf2ykWb1/1000111442.png";
                        }}
                      />

                    )
                  )}

              </div>

              <span className="network-more">
                + community
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <section className="nav-area">

          <div className="nav-heading-row">

            <div>

              <div className="nav-eyebrow">
                Explore
              </div>

              <h3 className="nav-title">
                Everything connected.
              </h3>

            </div>

            <p className="nav-heading-copy">
              Access platform tools, resources
              and everything you need throughout
              your Arcade journey.
            </p>

          </div>

          <div className="nav-grid">

            {/* CALCULATOR */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/calculator"
                )
              }
              className="nav-card"
            >

              <div className="nav-card-left">

                <div className="nav-icon-box">
                  <Calculator size={18} />
                </div>

                <div>

                  <div className="nav-card-title">
                    Calculator
                  </div>

                  <div className="nav-card-sub">
                    Calculate your Arcade points
                  </div>

                </div>

              </div>

              <div className="nav-arrow">
                <ArrowIcon />
              </div>

            </button>

            {/* DASHBOARD */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="nav-card"
            >

              <div className="nav-card-left">

                <div className="nav-icon-box">
                  <LayoutGrid size={18} />
                </div>

                <div>

                  <div className="nav-card-title">
                    Dashboard
                  </div>

                  <div className="nav-card-sub">
                    View your progress and activity
                  </div>

                </div>

              </div>

              <div className="nav-arrow">
                <ArrowIcon />
              </div>

            </button>

            {/* LEADERBOARD */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/leaderboard"
                )
              }
              className="nav-card"
            >

              <div className="nav-card-left">

                <div className="nav-icon-box">
                  <BarChart3 size={18} />
                </div>

                <div>

                  <div className="nav-card-title">
                    Leaderboard
                  </div>

                  <div className="nav-card-sub">
                    Follow the community rankings
                  </div>

                </div>

              </div>

              <div className="nav-arrow">
                <ArrowIcon />
              </div>

            </button>

            {/* SKILL BADGES */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/resources"
                )
              }
              className="nav-card"
            >

              <div className="nav-card-left">

                <div className="nav-icon-box">
                  <BadgeCheck size={18} />
                </div>

                <div>

                  <div className="nav-card-title">
                    Skill Badges
                  </div>

                  <div className="nav-card-sub">
                    Explore badges and achievements
                  </div>

                </div>

              </div>

              <div className="nav-arrow">
                <ArrowIcon />
              </div>

            </button>

          </div>

          {/* EXTERNAL RESOURCES */}

          <div className="resource-link-row">

            <a
              href="https://rsvp.withgoogle.com/events/arcade-facilitator/enrol"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >

              <span className="resource-link-icon">
                <UserPlus size={14} />
              </span>

              Enrollment

              <span
                style={{
                  marginLeft: "auto",
                }}
              >
                <ExternalIcon />
              </span>

            </a>

            <a
              href="https://rsvp.withgoogle.com/events/arcade-facilitator/points-system"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >

              <span className="resource-link-icon">
                <CircleDollarSign size={14} />
              </span>

              Points System

              <span
                style={{
                  marginLeft: "auto",
                }}
              >
                <ExternalIcon />
              </span>

            </a>

            <a
              href="https://rsvp.withgoogle.com/events/arcade-facilitator/syllabus"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >

              <span className="resource-link-icon">
                <BookOpen size={14} />
              </span>

              Syllabus

              <span
                style={{
                  marginLeft: "auto",
                }}
              >
                <ExternalIcon />
              </span>

            </a>

          </div>

        </section>

        {/* ===================================================
            FEEDBACK + ANALYTICS
        =================================================== */}

        <section className="lower-area">

          {/* =================================================
              FEEDBACK
          ================================================= */}

          <div className="feedback-card">

            <div className="feedback-label">
              Feedback
            </div>

            <h3 className="feedback-title">
              Overall, how helpful is this page?
            </h3>

            <p className="feedback-copy">
              Your feedback is used to improve
              Arcade Nexus.
            </p>

            <div className="feedback-options">

              {[
                "😞",
                "😟",
                "😐",
                "🙂",
                "😀",
              ].map(
                (
                  emoji,
                  index
                ) => (

                  <button
                    key={`${emoji}-${index}`}
                    type="button"
                    onClick={() =>
                      handleFeedback(
                        index + 1
                      )
                    }
                    className="feedback-option"
                    aria-label={`Rating ${
                      index + 1
                    } out of 5`}
                  >
                    {emoji}
                  </button>

                )
              )}

            </div>

            <div className="feedback-scale">

              <span>
                Very unhelpful
              </span>

              <span>
                Very helpful
              </span>

            </div>

          </div>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <div className="analytics-panel">

            <div className="analytics-heading">

              <span className="analytics-title">
                Arcade Nexus Live Analytics
              </span>

              <span className="analytics-status">

                <span className="analytics-status-dot" />

                Live

              </span>

            </div>

            <div className="metrics-grid">

              {/* TOTAL VISITORS */}

              <div className="metric-box">

                <div className="metric-label-row">

                  <Eye size={13} />

                  <span className="metric-label">
                    Total Visitors
                  </span>

                </div>

                <div className="metric-value">
                  <VisitCounter />
                </div>

              </div>

              {/* UNIQUE PROFILES */}

              <div className="metric-box">

                <div className="metric-label-row">

                  <UserRoundPlus size={13} />

                  <span className="metric-label">
                    Unique Profiles
                  </span>

                </div>

                <div className="metric-value">
                  {
                    leaderboardCount.toLocaleString()
                  }
                </div>

              </div>

              {/* ANALYZED */}

              <div className="metric-box">

                <div className="metric-label-row">

                  <ChartNoAxesCombined
                    size={13}
                  />

                  <span className="metric-label">
                    Profiles Analyzed
                  </span>

                </div>

                <div className="metric-value">
                  {
                    profilesAnalyzed.toLocaleString()
                  }
                </div>

              </div>

              {/* LIVE ONLINE */}

              <div className="metric-box metric-live">

                <div className="avatar-field">

                  {leaderboardAvatars.length >
                    0 &&
                    Array.from(
                      {
                        length:
                          10,
                      }
                    ).map(
                      (
                        _,
                        index
                      ) => {

                        const avatarIndex =
                          (
                            avatarStartIndex +
                            index
                          ) %
                          leaderboardAvatars.length;

                        const avatar =
                          leaderboardAvatars[
                            avatarIndex
                          ];

                        const position =
                          avatarPositions[
                            index
                          ];

                        return (
                          <img
                            key={
                              index
                            }
                            src={
                              avatar
                            }
                            alt=""
                            className="floating-avatar"
                            style={{
                              left:
                                position.left,

                              animationDuration:
                                position.duration,

                              animationDelay:
                                position.delay,
                            }}
                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                "https://i.postimg.cc/Nf2ykWb1/1000111442.png";
                            }}
                          />
                        );
                      }
                    )}

                </div>

                <div
                  className="metric-label-row"
                  style={{
                    position:
                      "relative",
                    zIndex:
                      3,
                    color:
                      "#6ee7b7",
                  }}
                >

                  <Radio
                    size={13}
                    className="live-radio-icon"
                  />

                  <span className="metric-label">
                    Live Online
                  </span>

                </div>

                <div
                  className="metric-value"
                  style={{
                    position:
                      "relative",
                    zIndex:
                      3,
                  }}
                >
                  {onlineUsers}
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            BOTTOM
        =================================================== */}

        <section className="footer-bottom">

          <p className="footer-disclaimer">

            <strong>
              Disclaimer:
            </strong>{" "}

            Arcade Nexus is an independent,
            community-driven platform for Google
            Cloud Arcade learners and is not
            affiliated with or endorsed by Google.
            All trademarks belong to their
            respective owners.

          </p>

          <div className="footer-bottom-bar">

            <p className="copyright">
              ©{" "}
              {new Date().getFullYear()}
              {" "}
              Arcade Nexus. All rights reserved.
            </p>

            <div className="bottom-right">

              {/* UPDATED */}

              <div className="updated-pill">

                Last updated:

                <strong>
                  {lastUpdated}
                </strong>

              </div>

              {/* LEGAL */}

              <div className="legal-links">

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/terms"
                    )
                  }
                  className="legal-button"
                >
                  Terms & Conditions
                </button>

                <span className="legal-dot" />

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/privacy"
                    )
                  }
                  className="legal-button"
                >
                  Privacy Policy
                </button>

                <span className="legal-dot" />

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/aboutpage"
                    )
                  }
                  className="legal-button"
                >
                  About
                </button>

              </div>

              {/* CREATORS */}

              <div className="creator-area">

                <div className="creator-avatars">

                  <a
                    href="https://linkedin.com/in/manish-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-link"
                    aria-label="Manish on LinkedIn"
                  >

                    <img
                      src="https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg"
                      alt="Manish"
                      className="creator-avatar"
                    />

                  </a>

                  <a
                    href="https://www.linkedin.com/in/anjali-p-a2ba1419b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-link"
                    aria-label="Anjali Patel on LinkedIn"
                  >

                    <img
                      src="https://i.postimg.cc/Nf2ykWb1/1000111442.png"
                      alt="Anjali Patel"
                      className="creator-avatar"
                    />

                  </a>

                </div>

                <span className="creator-label">

                  <strong>
                    Built with care
                  </strong>

                  Arcade Nexus

                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </footer>
  );
}