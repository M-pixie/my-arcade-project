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

// 👇 🔥 HEAVY PRO-LEVEL METADATA (ULTIMATE SEO BOMB) 🔥
export const metadata: Metadata = {
  title: "Google Arcade Points Calculator 2026 | Google Arcade Nexus ",
  description: "Calculate your Google Cloud Arcade points and track skills badges instantly. Monitor your leaderboard rank to claim premium GCP swags for 2026",
  keywords: [
    "Google Cloud Arcade", "Arcade Points Calculator", "GCP Arcade 2026", "Arcade Nexus", "Google arcade", "Google Arcade" , "Arcade 2026" , "Arcade Facilittaor" , "Arcade Points" , "points", "Arcade hub" , "Google Arcade Swags" , "Facilitator Program" , "Google Cloud" , "calculator" , "points arcade" , "game" , "gcp" , "arcade program 2026" , "arcade event" , "arcade swags" , "Google arcade swags" , "cloud " , "arcade prize counter 2026" , "arcade swags 2026" , "prize counter" , "google swags" , "credit" , "check arcade points " , "how to check arcade points " , "check points" , 
    "Google Cloud Skills Boost", "Qwiklabs Badges", "Arcade Facilitator Program", "Cloud Hero", "GDG", "Google Developer Groups", "GDSC", "Arcade Cohort", "Facilitator 2026",
    "Google Swags", "Arcade Swag Drop", "GCP Prizes", "Redeem Arcade Points", "Free Google Cloud Swags", "Google gifts", "Google goodies", "Google Cloud Hoodie", "Google T-shirt", "Milestone Rewards",
    "Points Calculator", "Arcade Leaderboard", "Cloud Arcade Dashboard", "Trivia Points", "Game Badges", "Google google", "How to calculate arcade points", "Qwiklabs points tracker", "GCP points checker", "Arcade points trick"
  ],
  authors: [{ name: "Arcade Nexus Team" }, { name: "Manish Kumar" }, { name: "Anjali Patel" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://arcade-calculator.vercel.app", 
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
        url: "https://i.postimg.cc/tTSsd8kS/Snapinsta-app-437737395-25411276401819535-1259610102401518116-n-1080.jpg",
        width: 800,
        height: 420,
        alt: "Google Cloud Arcade Swags & Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculate Google Cloud Arcade Points 2026",
    description: "Check your Arcade Points and Leaderboard rank instantly.",
    images: ["https://i.postimg.cc/tTSsd8kS/Snapinsta-app-437737395-25411276401819535-1259610102401518116-n-1080.jpg"],
  },
  icons: {
    icon: '/icon.png', 
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
  
  // 🔥 KNOWLEDGE PANEL / FEATURED SNIPPET SCHEMA 🔥
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Arcade Nexus",
    "url": "https://arcade-calculator.vercel.app",
    "logo": "https://arcade-calculator.vercel.app/icon.png",
    "description": "The ultimate independent community toolkit built by Manish & Anjali for Google Cloud Arcade.",
    "founder": [
      {
        "@type": "Person",
        "name": "Manish Kumar",
        "jobTitle": "Founder & CEO",
        "image": "https://i.postimg.cc/GtV7yP9K/IMG-20260501-130548.jpg",
        "url": "https://linkedin.com/in/manish-ui"
      },
      {
        "@type": "Person",
        "name": "Anjali Patel",
        "jobTitle": "Founder & CEO", 
        "image": "https://i.postimg.cc/Nf2ykWb1/1000111442.png",
        "url": "https://www.linkedin.com/in/anjali-p-a2ba1419b"
      }
    ],
    "foundingDate": "2026",
    "sameAs": [
      "https://linkedin.com/in/manish-ui",
      "https://www.linkedin.com/in/anjali-p-a2ba1419b",
      "https://www.linkedin.com/company/arcade-nexus/"
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Injecting the Schema JSON-LD for Google Bots */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ NAVBAR */}
        <Navbar />

        {/* Main Content */}
        {children}

        {/* ✅ FOOTER */}
        <Footer />
        
      </body>
    </html>
  );
}