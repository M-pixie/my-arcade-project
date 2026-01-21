"use client";

import { HelpCircle, ExternalLink } from "lucide-react"; // Icons ke liye

export default function UrlHelp() {
  return (
    <div className="w-full mt-3">
      <details className="group bg-blue-50 border border-blue-100 rounded-xl overflow-hidden transition-all duration-300">
        
        {/* === CLICKABLE HEADER === */}
        <summary className="flex items-center justify-between p-3 cursor-pointer list-none select-none text-blue-700 hover:bg-blue-100/50 transition-colors">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <HelpCircle size={18} />
            <span>Mera Public Profile URL kahan milega?</span>
          </div>
          {/* Arrow Icon that rotates */}
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-blue-400">
            ▼
          </span>
        </summary>

        {/* === HIDDEN CONTENT (Khulne par ye dikhega) === */}
        <div className="p-4 bg-white text-sm text-slate-600 border-t border-blue-100 animate-in slide-in-from-top-2 duration-200">
          
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>
              <a 
                href="https://www.cloudskillsboost.google/" 
                target="_blank" 
                className="text-blue-600 underline font-medium inline-flex items-center gap-1"
              >
                Google Cloud Skills Boost <ExternalLink size={12}/>
              </a> 
              par login karo.
            </li>
            <li>Right side mein apne <strong>Avatar</strong> (Photo) par click karke <strong>"Public Profile"</strong> par jao.</li>
            <li>Agar wahan <strong>"Make Profile Public"</strong> ka button hai, to use daba do.</li>
            <li>Ab jo Browser ke upar Link (URL) hai, use copy karo aur yahan paste karo.</li>
          </ol>

          {/* 👇 IMAGE / GIF SECTION */}
          <div className="relative w-full h-auto rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            {/* Yahan maine abhi placeholder lagaya hai.
                Apni GIF ya Screenshot 'public' folder me daal kar yahan link change kar dena */}
            <img 
              src="https://placehold.co/600x300/png?text=Step+1:+Click+Profile+->+Copy+URL" 
              alt="How to copy URL" 
              className="w-full object-cover"
            />
          </div>
          
          <p className="text-xs text-slate-400 mt-2 text-center">
            Tip: Link kuch aisa dikhna chahiye: <em>.../public_profiles/1234...</em>
          </p>

        </div>
      </details>
    </div>
  );
}