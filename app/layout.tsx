import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
// ChatBot ka import hata diya kyunki ab uska alag page hai

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👇 SEO + METADATA
export const metadata: Metadata = {
  title: "Google Cloud Arcade Points Calculator 2026 | Arcade Nexus",
  description:
    "Calculate and check your Google Cloud Arcade points instantly. Track Arcade badges, leaderboard rank, milestones, rewards, swag and Google Cloud Arcade progress in one place.",
  keywords: [
    // Core
    "Google Cloud Arcade",
    "Google Cloud Arcade 2026",
    "Google Arcade",
    "Google Arcade 2026",
    "Google Cloud Arcade points",
    "Google Arcade points",
    "Google Cloud Arcade points calculator",
    "Google Arcade points calculator",
    "Arcade points calculator",
    "Google Arcade calculator",
    "Cloud Arcade calculator",

    // Points / Score / Tracker
    "check Google Arcade points",
    "check Arcade points",
    "Google Arcade points checker",
    "Arcade points checker",
    "Google Cloud Arcade score",
    "Google Arcade score",
    "Arcade score calculator",
    "Arcade score checker",
    "Google Cloud Arcade points tracker",
    "Google Arcade points tracker",
    "Arcade points tracker",
    "calculate Google Arcade points",
    "calculate Google Cloud Arcade points",
    "calculate Arcade points",
    "Google Cloud points calculator",
    "Arcade progress tracker",
    "Google Arcade progress tracker",

    // Badges / Achievements
    "Google Cloud Arcade badges",
    "Google Arcade badges",
    "Google Cloud skill badges",
    "Google Arcade skill badges",
    "Arcade skill badges",
    "Google Cloud Arcade achievements",
    "Google Arcade achievements",
    "Arcade achievements",
    "Google Arcade milestones",
    "Arcade milestones",
    "Google Cloud Arcade milestone rewards",
    "Arcade milestone rewards",

    // Leaderboard / Ranking
    "Google Cloud Arcade leaderboard",
    "Google Arcade leaderboard",
    "Arcade leaderboard",
    "Google Cloud Arcade ranking",
    "Google Arcade ranking",
    "Google Arcade rank",
    "Arcade rank checker",
    "Google Arcade leaderboard 2026",
    "Google Cloud Arcade leaderboard 2026",

    // Swag / Rewards / Prize
    "Google Cloud Arcade swag",
    "Google Arcade swag",
    "Google Cloud Arcade swags 2026",
    "Google Arcade swags 2026",
    "Google Cloud Arcade prizes",
    "Google Arcade prizes",
    "Google Cloud Arcade rewards",
    "Google Arcade rewards",
    "Arcade prize counter",
    "Google Arcade prize counter",
    "Arcade swag drops",
    "Google Cloud swag",
    "Google Cloud gifts",
    "Google Cloud merchandise",
    "Google Cloud Arcade merchandise",

    // Facilitator
    "Google Cloud Arcade Facilitator",
    "Google Cloud Arcade Facilitator Program",
    "Arcade Facilitator Program",
    "Arcade Facilitator 2026",
    "Google Arcade Facilitator 2026",
    "Google Cloud Facilitator Program",
    "Arcade facilitator points",
    "Arcade facilitator leaderboard",

    // Skills Boost / Labs
    "Google Cloud Skills Boost",
    "Google Cloud Skills Boost Arcade",
    "Skills Boost Arcade",
    "Qwiklabs Arcade",
    "Google Cloud labs",
    "Google Cloud labs and badges",
    "Google Cloud learning arcade",
    "Google Cloud skill badges",

    // Search-intent queries
    "how to check Google Arcade points",
    "how to check Arcade points",
    "how to calculate Google Arcade points",
    "how to calculate Arcade points",
    "where to check Google Arcade points",
    "where to check Arcade points",
    "how to get Google Arcade points",
    "Google Arcade points update",
    "Google Arcade points not showing",
    "Google Arcade badge points",
    "Google Arcade trivia points",
    "Google Arcade game points",
    "Google Arcade challenge points",
    "Google Arcade completion points",

    // Dashboard / Tools
    "Google Arcade dashboard",
    "Google Cloud Arcade dashboard",
    "Arcade dashboard",
    "Google Arcade tools",
    "Google Cloud Arcade tools",
    "Arcade resources",
    "Arcade calculator online",
    "Google Arcade progress",
    "Google Cloud Arcade tracker",

    // 2026 long-tail
    "Google Cloud Arcade 2026 points calculator",
    "Google Cloud Arcade 2026 points checker",
    "Google Cloud Arcade 2026 leaderboard",
    "Google Cloud Arcade 2026 rewards",
    "Google Cloud Arcade 2026 swag",
    "Google Cloud Arcade 2026 badges",
    "Google Cloud Arcade 2026 achievements",
    "Google Arcade 2026 points tracker",
    "Google Arcade 2026 leaderboard",
    "Google Arcade 2026 rewards",
    "Google Arcade 2026 prize counter",

    // Brand
    "Arcade Nexus",
    "Arcade Nexus calculator",
    "Arcade Nexus Google Cloud",
    "Arcade Nexus points calculator",
    "Arcade Nexus leaderboard",
    "Arcade Nexus dashboard",
  ],
  authors: [
    { name: "Arcade Nexus Team" },
    { name: "Manish Kumar" },
    { name: "Anjali Patel" },
  ],
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://arcade-calculator.vercel.app",
  },
  openGraph: {
    title: "Arcade Nexus - Google Cloud Arcade Points Calculator 2026",
    description:
      "Calculate Google Cloud Arcade points, check your leaderboard rank, track badges and achievements, and explore Arcade rewards and swags.",
    url: "https://arcade-calculator.vercel.app",
    siteName: "Arcade Nexus",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://i.postimg.cc/tTSsd8kS/Snapinsta-app-437737395-25411276401819535-1259610102401518116-n-1080.jpg",
        width: 800,
        height: 420,
        alt: "Google Cloud Arcade Swags & Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Cloud Arcade Points Calculator 2026",
    description:
      "Check your Google Arcade points, badges, leaderboard rank, milestones and rewards instantly.",
    images: [
      "https://i.postimg.cc/tTSsd8kS/Snapinsta-app-437737395-25411276401819535-1259610102401518116-n-1080.jpg",
    ],
  },
  icons: {
    icon: "/icon.png",
  },
  verification: {
    google: "Whrghgx_Ik2-E-DkqCDfFwSQSVKms8_eVHOyffDHpsk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🔥 KNOWLEDGE PANEL / FEATURED SNIPPET SCHEMA
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Arcade Nexus",
    url: "https://arcade-calculator.vercel.app",
    logo: "https://arcade-calculator.vercel.app/icon.png",
    description:
      "The ultimate independent community toolkit built by Manish & Anjali for Google Cloud Arcade.",
    founder: [
      {
        "@type": "Person",
        name: "Manish Kumar",
        jobTitle: "Founder & CEO",
        image: "https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg",
        url: "https://linkedin.com/in/manish-ui",
      },
      {
        "@type": "Person",
        name: "Anjali Patel",
        jobTitle: "Founder & CEO",
        image: "https://i.postimg.cc/Nf2ykWb1/1000111442.png",
        url: "https://www.linkedin.com/in/anjali-p-a2ba1419b",
      },
    ],
    foundingDate: "2026",
    sameAs: [
      "https://linkedin.com/in/manish-ui",
      "https://www.linkedin.com/in/anjali-p-a2ba1419b",
      "https://www.linkedin.com/company/arcade-nexus/",
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* ✅ GOOGLE ADSENSE */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2755189943380750"
          crossOrigin="anonymous"
        />

        {/* ✅ ORGANIZATION SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ NAVBAR */}
        <Navbar />

        {/* ✅ MAIN CONTENT */}
        {children}

        {/* ✅ FOOTER */}
        <Footer />
      </body>
    </html>
  );
}