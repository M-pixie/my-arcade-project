import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👇 YAHAN PAR MAINE METADATA UPDATE KIYA HAI
export const metadata: Metadata = {
  title: "Arcade Nexus - Google Cloud Arcade Points Calculator",
  description: "Calculate your Google Cloud Arcade points instantly. Check your badges, trivia, and game progress for the Google Cloud Arcade program.",
  keywords: [
    "Google Cloud Arcade",
    "Arcade Points Calculator",
    "Google Cloud Skills Boost",
    "Arcade Nexus",
    "Cloud Hero",
    "Google Swags"
    "arcade"
    "points calculator"
    "arcade points "
    "google cloud"
    "arcade"
    "arcade points calculator"
  ],
  openGraph: {
    title: "Arcade Nexus - Google Cloud Points Calculator",
    description: "Check your Arcade Points and Leaderboard rank instantly.",
    type: "website",
  },
  // 👇 Sirf ye daalo (Pura tag hata diya hai)
verification: {
  google: "Whrghgx_Ik2-E-DkqCDfFwSQSVKms8_eVHOyffDHpsk",
},

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
        
        {children}
      </body>
    </html>
  );
}