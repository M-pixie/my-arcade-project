import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafcff] dark:bg-[#0b0f19] py-20 px-4 sm:px-8 lg:px-16 relative overflow-hidden font-sans text-slate-800 dark:text-slate-200">
      
      {/* --- Ambient Premium Background Glows --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        
        {/* --- 1. HERO SECTION & FACILITATOR SPOTLIGHT --- */}
        <section className="text-center space-y-10 pt-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[80px] -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] text-slate-600 dark:text-slate-300 text-sm font-medium shadow-sm transition-colors hover:border-slate-300 dark:hover:border-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            The Ultimate Google Cloud Community Tool
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#1f2937] dark:text-slate-100 tracking-tight mb-6 leading-[1.1]">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a73e8] via-[#4285f4] to-[#1a73e8]">Arcade</span>
          </h1>
          
          {/* Premium Minimal Facilitator Card - Lamba Box, Kam Curve, Thin Border Hover */}
          <div className="mt-16 max-w-5xl mx-auto group"> 
            <div className="relative bg-white dark:bg-[#0a0a0a] rounded-md p-8 md:p-12 text-left border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)]">
              
              <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-white/[0.02] rounded-md transition-colors duration-300 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10">
                
                {/* Premium Tagline */}
                <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase mb-2">
                  Google Cloud Arcade
                </p>
                
                {/* Main Heading */}
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-6">
                  Arcade Facilitator
                </h2>
                
                {/* Intro Paragraph */}
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-10">
                  The Arcade Facilitator Program is an always-on, no-cost gaming campaign where technical practitioners of all levels can learn new cloud skills like computing, application development, big data & AI/ML and earn digital badges & points to use towards claiming swag prizes and Google Cloud goodies.
                </p>

                {/* Why Enroll Section */}
                <div className="border-t border-slate-200 dark:border-slate-800/50 pt-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                    Why should I enrol in the program?
                  </h3>
                  <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
                    There are a lot of things in store for you. We want to make sure that by the end of this program:
                  </p>

                  {/* Bullet Points List */}
                  <ul className="space-y-5 text-slate-600 dark:text-slate-400 text-base md:text-lg">
                    
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">1.</span>
                      <p className="leading-relaxed">
                        You can showcase what you've learned here to your professional network using <strong>Google Cloud-hosted digital badges</strong> (see below) that you can add to your resume and professional profiles like LinkedIn. 🏆
                      </p>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">2.</span>
                      <p className="leading-relaxed">
                        You gain practical, hands-on experience in real-world Google Cloud environments, moving beyond theory to master actual cloud architecture. 💻
                      </p>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">3.</span>
                      <p className="leading-relaxed">
                        You earn valuable Arcade points for every skill badge completed, getting you closer to claiming exclusive official swags and merchandise. 🎁
                      </p>
                    </li>

                  </ul>
                </div>

              

              </div>
            </div>
          </div>
        </section>

        {/* --- 2. INTERACTIVE FEATURES GRID --- */}
        <section className="relative">
          <div className="flex items-center justify-center mb-16">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent flex-grow"></div>
            <h2 className="px-8 text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
              What You Get On Arcade Nexus
            </h2>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🧮", title: "Calculate Points", desc: "Accurate & real-time Arcade points calculation based on latest rules.", link: "/calculator", color: "text-blue-600 bg-blue-100 dark:bg-blue-500/10" },
              { icon: "🏆", title: "Live Leaderboard", desc: "Track community rankings dynamically and compete with peers.", link: "/leaderboard", color: "text-amber-600 bg-amber-100 dark:bg-amber-500/10" },
              { icon: "📊", title: "User Dashboard", desc: "A personalized space to manage your badges & tier progression.", link: "/dashboard", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10" },
              { icon: "🔐", title: "Google Sign-In", desc: "Secure OAuth login. Get instant welcome email alerts.", link: "/dashboard", color: "text-rose-600 bg-rose-100 dark:bg-rose-500/10" },
              { icon: "📢", title: "Program Updates", desc: "Latest news, prize counter dates & facilitator announcements.", link: "/facilitator", color: "text-purple-600 bg-purple-100 dark:bg-purple-500/10" },
              { icon: "🏷️", title: "Skill Badges List", desc: "Curated, organized resources and links for all active badges.", link: "/resources", color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-500/10" },
              { icon: "🤖", title: "Smart Chatbot", desc: "24/7 AI-powered automated help trained on Arcade queries.", link: "/ChatBot", color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-500/10" },
              { icon: "❓", title: "Simple FAQs", desc: "Clear, straight-to-the-point answers to common questions.", link: "/FAQ", color: "text-orange-600 bg-orange-100 dark:bg-orange-500/10" }
            ].map((feature, index) => (
              <Link href={feature.link} key={index} className="group flex flex-col h-full bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.05)] transform hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 border border-white/50 dark:border-slate-700/50 shadow-sm ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex justify-between items-center">
                  {feature.title}
                  <span className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500 text-lg">↗</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>


        {/* --- 3. PREMIUM FLOATING INFO CARDS (About Arcade) --- */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Play The Arcade?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎮", title: "Gamified Learning", desc: "Learn complex cloud concepts through engaging, game-like structures." },
              { icon: "💸", title: "100% No Cost", desc: "Participation is completely free. Just bring your dedication to learn." },
              { icon: "🛠️", title: "Hands-on Labs", desc: "Practice in real Google Cloud environments, not just theory." },
              { icon: "🎁", title: "Swags & Prizes", desc: "Convert your hard-earned points into official Google Cloud merchandise." }
            ].map((box, idx) => (
              <div key={idx} className="bg-white dark:bg-[#111827]/80 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-3xl mb-5 shadow-inner">
                  {box.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{box.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* --- 4. CLEAN & ANIMATED TIMELINES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800/50 pt-16">
          
          <section className="bg-white/50 dark:bg-[#111827]/40 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-300">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">⚙️</span> 
              How It Works
            </h2>
            <div className="relative border-l-[2px] border-slate-200 dark:border-slate-700 ml-4 space-y-12 pb-4">
              {[
                { title: "Sign in with Google", desc: "Start your journey by creating an account on the official Cloud Skills Boost platform using your Google ID." },
                { title: "Monthly Challenge", desc: "New games and trivia are released every month. Subscribe to updates so you never miss a new challenge." },
                { title: "Earning Points & Badges", desc: "Complete the specific labs inside the games to earn digital skill badges. Each valid badge adds to your total Arcade Points." },
                { title: "Level Progression", desc: "Accumulate points to climb the swag tiers (Standard, Advanced, Premium). Use our calculator to track your progression." }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-10 group cursor-default">
                  <div className="absolute w-4 h-4 bg-white dark:bg-[#111] border-2 border-slate-300 dark:border-slate-600 rounded-full -left-[9px] top-1.5 group-hover:border-blue-500 transition-colors duration-300 z-10"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-2.5 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 z-20 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/50 dark:bg-[#111827]/40 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-300">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-10 flex items-center gap-3">
               <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">📚</span> 
               Official Resources
            </h2>
            <div className="space-y-5">
              {[
                { title: "The Arcade Platform", desc: "The central hub for monthly games, trivia, and prize updates.", link: "https://go.cloudskillsboost.google/arcade" },
                { title: "Cloud Skills Boost", desc: "The main learning portal holding all the technical labs.", link: "https://www.cloudskillsboost.google/" },
                { title: "Learning Forum", desc: "Connect with learners and get support from the community.", link: "https://www.googlecloudcommunity.com/" }
              ].map((resource, idx) => (
                <a href={resource.link} target="_blank" rel="noopener noreferrer" key={idx} className="group block bg-white dark:bg-[#0a0a0a] p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                        {resource.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{resource.desc}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-purple-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shrink-0">
                      ↗
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* --- 5. CONTACT & CONNECT (Original Icons) --- */}
        <section className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Connect With Us</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Have queries or suggestions? Reach out directly to the facilitator.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* LinkedIn */}
            <a href="https://linkedin.com/in/manish-ui" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-12 h-12 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">LinkedIn</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect Professionally</p>
            </a>

             {/* Email */}
             <a href="mailto:vy7manish@gmail.com" className="group bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-500 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email Us</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">For Detailed Queries</p>
            </a>

             {/* WhatsApp */}
             <a href="https://wa.me/8538980608" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-[#111827]/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-500 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">WhatsApp</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quick Community Support</p>
            </a>
          </div>
        </section>

        {/* --- 6. LEGAL SECTION (TERMS & PRIVACY EXPANDED) --- */}
        <section className="max-w-5xl mx-auto border-t border-slate-200 dark:border-slate-800/50 pt-16 pb-10">
           <div className="bg-white/50 dark:bg-[#111827]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-left">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center md:text-left">Legal & Policies</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-slate-600 dark:text-slate-400">
               
               {/* Privacy Policy Bullets */}
               <div>
                 <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    🔒 Privacy Policy
                 </h3>
                 <ul className="space-y-3 list-disc pl-5 marker:text-blue-500">
                   <li><strong>No Sensitive Data Stored:</strong> We never store your Google passwords or secure Cloud credentials.</li>
                   <li><strong>Public URL Processing:</strong> Badge fetching and points calculation rely entirely on your provided public profile URLs.</li>
                   <li><strong>Data Privacy:</strong> Your fetched progress data remains local and is not sold or shared with third-party advertisers.</li>
                   <li><strong>Basic Analytics:</strong> We only use standard analytics to monitor website traffic and improve platform performance.</li>
                 </ul>
               </div>
               
               {/* Terms & Conditions Bullets */}
               <div>
                 <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    ⚖️ Terms & Conditions
                 </h3>
                 <ul className="space-y-3 list-disc pl-5 marker:text-purple-500">
                   <li><strong>Independent Project:</strong> Arcade Nexus is a community tool built by a Facilitator, not an official Google Cloud product.</li>
                   <li><strong>Guide Only:</strong> All calculations provided are estimations based on current rules and should be used as a helpful guide.</li>
                   <li><strong>Final Authority:</strong> Eligibility for swags and milestones is solely determined by the official Google Cloud Arcade team.</li>
                   <li><strong>User Responsibility:</strong> Users are responsible for providing correct public profile URLs for accurate syncing.</li>
                 </ul>
               </div>

             </div>
             
             <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center md:flex md:justify-between md:items-center text-xs text-slate-500">
               <p>By using Arcade Nexus, you agree to these terms.</p>
               <p className="mt-2 md:mt-0">Last updated: April 2026.</p>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
}