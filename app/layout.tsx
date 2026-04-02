import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ 1. Yahan ChatBot import kiya
import ChatBot from "./components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👇 🔥 HEAVY PRO-LEVEL METADATA (ULTIMATE SEO BOMB) 🔥
export const metadata: Metadata = {
  title: "Google Cloud Arcade Calculator 2026 | Arcade Nexus Points Tracker",
  description: "Instantly calculate your Google Cloud Arcade points, track Qwiklabs skill badges, trivia, and leaderboard rank. Claim your premium GCP swags and milestone rewards for 2026.",
  keywords: [
    // 🔥 Core Keywords (Main search terms)
    "Google Cloud Arcade", "Arcade Points Calculator", "GCP Arcade 2026", "Arcade Nexus", "Google arcade", 
    // 🔥 Program Specific & Communities (Log ye bahut search karte hain)
    "Google Cloud Skills Boost", "Qwiklabs Badges", "Arcade Facilitator Program", "Cloud Hero", "GDG", "Google Developer Groups", "GDSC", "Arcade Cohort", "Facilitator 2026",
    // 🔥 Rewards & Action (Lalach wale words - Highest Traffic)
    "Google Swags", "Arcade Swag Drop", "GCP Prizes", "Redeem Arcade Points", "Free Google Cloud Swags", "Google gifts", "Google goodies", "Google Cloud Hoodie", "Google T-shirt", "Milestone Rewards",
    // 🔥 Tools, Features & Long-tail search phrases
    "Points Calculator", "Arcade Leaderboard", "Cloud Arcade Dashboard", "Trivia Points", "Game Badges", "Google google", "How to calculate arcade points", "Qwiklabs points tracker", "GCP points checker", "Arcade points trick"
  ],
  authors: [{ name: "Arcade Nexus Team" }, { name: "Manish Kumar" }], // Tumhara naam SEO me add kar diya!
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1", // 🔥 Google bots ko VIP access
  alternates: {
    canonical: "https://arcade-calculator.vercel.app", // 🔥 Duplicate content penalty se bachayega
  },
  openGraph: {
    title: "Arcade Nexus - Google Cloud Arcade Points Calculator",
    description: "Calculate your Arcade Points, check your rank, and claim premium swags! The ultimate dashboard for GCP learners.",
    url: "https://arcade-calculator.vercel.app",
    siteName: "Arcade Nexus",
    type: "website",
    locale: "en_IN",
    images: [
      {
        // 🔥 Social media pe share karne pe ye mst image dikhegi
        url: "https://services.google.com/fh/files/misc/gcaf25_prizes_image5.png", // Image 5 (Premium swags) kar diya jisse zyada clicks aayen
        width: 1200,
        height: 630,
        alt: "Google Cloud Arcade Swags & Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculate Google Cloud Arcade Points 2026",
    description: "Check your Arcade Points and Leaderboard rank instantly.",
    images: ["https://services.google.com/fh/files/misc/gcaf25_prizes_image5.png"], // 🔥 Twitter pe link daloge toh image aayegi
  },
  icons: {
    icon: '/icon.png', 
  },
  verification: {
    google: "Whrghgx_Ik2-E-DkqCDfFwSQSVKms8_eVHOyffDHpsk", // Tumhara Google Console code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Main Content */}
        {children}

        {/* ✅ 2. Yahan ChatBot laga diya (Body khatam hone se pehle) */}
        <ChatBot />
      </body>
    </html>
  );
}