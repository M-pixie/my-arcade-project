"use client";

import AuthGuard from "@/app/components/AuthGuard";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function AccountPage() {
  const user = auth.currentUser;

  if (!user) return null;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 flex justify-center">
        
        {/* Main Container - Width similar to Google Settings */}
        <div className="w-full max-w-3xl">
          
          {/* Page Header */}
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-normal text-gray-900">Personal info</h1>
            <p className="mt-2 text-gray-500 text-base">
              Basic info, like your name and photo, that you use on Arcade Nexus.
            </p>
          </div>

          {/* CARD: Profile Section */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-800">Basic info</h2>
              <p className="text-sm text-gray-500 mt-1">
                Some info may be visible to other people using Arcade Nexus.
              </p>
            </div>

            {/* ROW 1: PROFILE PICTURE */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-default">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Photo
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  A photo helps personalize your account
                </p>
              </div>
              <div className="flex-shrink-0">
                <img
                  src={user.photoURL || "https://lh3.googleusercontent.com/a/default-user"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              </div>
            </div>

            {/* ROW 2: NAME */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 hover:bg-gray-50 transition cursor-default">
              <div className="w-1/3">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Name
                </p>
              </div>
              <div className="flex-1 text-right md:text-left">
                <p className="text-gray-900 font-medium text-lg">
                  {user.displayName || "No Name"}
                </p>
              </div>
              <div className="hidden md:block text-gray-400">
                {/* Right Arrow Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* ROW 3: EMAIL */}
            <div className="flex items-center justify-between px-6 py-6 hover:bg-gray-50 transition cursor-default">
              <div className="w-1/3">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Contact Info
                </p>
              </div>
              <div className="flex-1 text-right md:text-left">
                <p className="text-gray-900 font-medium text-lg">
                  {user.email}
                </p>
              </div>
              <div className="hidden md:block text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* SECURITY CARD */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
              {/* Google G Logo SVG */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                <path fill="#EA4335" d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Managed by Google
              </h3>
              <p className="text-gray-500 text-sm mt-1 max-w-lg leading-relaxed">
                Your profile details (Name, Photo, Email) are managed via your Google Account. 
                To update them, please visit your Google Account settings.
              </p>
              <a 
                href="https://myaccount.google.com/personal-info" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 font-medium text-sm hover:text-blue-800 hover:underline"
              >
                Manage your Google Account &rarr;
              </a>
            </div>
          </div>

        </div>
      </main>
    </AuthGuard>
  );
}