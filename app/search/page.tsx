"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";

const searchDatabase = [
  { id: 1, title: "Points Calculator", description: "Calculate your Google Cloud Arcade points, milestones, and track your progress.", href: "/calculator", tags: ["calc", "points", "count", "milestone", "arcade", "calculator"] },
  { id: 2, title: "User Dashboard", description: "View your personal arcade progress, profile stats, and history.", href: "/dashboard", tags: ["profile", "stats", "progress", "user", "dashboard", "account"] },
  { id: 3, title: "Global Leaderboard", description: "Check top performers and find your rank in the global Arcade community.", href: "/leaderboard", tags: ["rank", "top", "score", "position", "leaderboard", "compete"] },
  { id: 4, title: "Skill Badges & Resources", description: "Explore resources, lab solutions, and track your skill badges.", href: "/resources", tags: ["badge", "skill", "learn", "resources", "labs", "qwiklabs"] },
  { id: 5, title: "Facilitator Portal", description: "Information, guides, and resources specifically for Arcade facilitators.", href: "/facilitator", tags: ["lead", "guide", "manage", "community", "facilitator", "cohort"] },
  { id: 6, title: "Swags & Prizes", description: "Details about arcade swags, prize counter dates, and delivery updates.", href: "/post", tags: ["prize", "tshirt", "goodies", "claim", "swags", "post", "gifts"] },
  { id: 7, title: "About Arcade Nexus", description: "Learn more about the platform, its features, and the vision behind it.", href: "/about", tags: ["info", "details", "project", "about", "nexus"] },
  { id: 8, title: "Help & Community Chat", description: "Get support, ask questions, and chat with other developers.", href: "/chat", tags: ["support", "contact", "message", "help", "chat", "talk"] },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("arcade_search_history");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing search history");
      }
    }
  }, []);

  // Update history & trigger analyzing state when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 400); // Smooth 400ms fake delay

      setRecentSearches((prev) => {
        // Remove duplicate if it exists, add to top, keep only latest 5
        const updated = [query, ...prev.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, 5);
        localStorage.setItem("arcade_search_history", JSON.stringify(updated));
        return updated;
      });

      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleDeleteHistory = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the history item when deleting
    const updated = recentSearches.filter((term) => term !== termToRemove);
    setRecentSearches(updated);
    localStorage.setItem("arcade_search_history", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("arcade_search_history");
  };

  const handleHistoryClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const filteredResults = searchDatabase.filter((item) => {
    const lowerQuery = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });

  return (
    <div className="pt-24 px-4 md:px-8 max-w-4xl mx-auto min-h-screen bg-white">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black tracking-tight">Search</h1>
          {query && (
            <p className="text-sm text-[#5f6368] mt-2">
              Showing results for <span className="font-semibold text-black">"{query}"</span>
            </p>
          )}
        </div>
        
        {/* ANALYZING ANIMATION */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-sm font-medium text-black animate-pulse">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing data...
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT/TOP: SEARCH RESULTS */}
        <div className="flex-1">
          {query ? (
            !isAnalyzing && (
              <div className="space-y-6">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <Link 
                      key={result.id} 
                      href={result.href}
                      className="block group pb-4 border-b border-[#dadce0] hover:border-black transition-colors"
                    >
                      <h2 className="text-xl font-bold text-black group-hover:underline decoration-2 underline-offset-4">
                        {result.title}
                      </h2>
                      <p className="text-[#5f6368] mt-2 text-sm leading-relaxed">
                        {result.description}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="pt-8">
                    <p className="text-black font-semibold text-xl tracking-tight">No results found.</p>
                    <p className="text-sm text-[#5f6368] mt-2">Try adjusting your search terms.</p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="pt-8">
              <p className="text-xl text-[#5f6368] font-light tracking-wide">
                Type in the navigation bar to start searching...
              </p>
            </div>
          )}
        </div>

        {/* RIGHT/BOTTOM: RECENT SEARCHES */}
        {recentSearches.length > 0 && (
          <div className="w-full lg:w-72 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">Recent Searches</h3>
              <button 
                onClick={handleClearAll}
                className="text-xs font-medium text-[#5f6368] hover:text-black transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <ul className="space-y-1">
              {recentSearches.map((term, idx) => (
                <li 
                  key={idx} 
                  className="group flex items-center justify-between py-2 px-3 -mx-3 rounded-md hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                  onClick={() => handleHistoryClick(term)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-4 h-4 text-[#5f6368] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-black truncate">{term}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDeleteHistory(term, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#5f6368] hover:text-black transition-all rounded-full hover:bg-[#e8eaed]"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 px-4 max-w-4xl mx-auto font-medium text-black">Loading interface...</div>}>
      <SearchContent />
    </Suspense>
  );
}