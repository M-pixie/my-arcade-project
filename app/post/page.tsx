"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db } from "@/lib/firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function SwagDropsPage() {
  const [activeTier, setActiveTier] = useState("All Tiers");
  const [swags, setSwags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // New states for the Paid Swag form
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaserName, setPurchaserName] = useState("");

  const tiers = ["All Tiers", "Trooper", "Ranger", "Champion", "Legend"];

  useEffect(() => {
    const q = query(collection(db, "swag_drops"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSwags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSwags(fetchedSwags);
      setLoading(false);
      
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }, (error) => {
      console.error("Firebase fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSwags = activeTier === "All Tiers" 
    ? swags 
    : swags.filter(swag => swag.tags && swag.tags.includes(activeTier));

  const arcadeCards = [
    { stars: "★", title: "Arcade Trooper", points: "50 Points", progress: "38%", color: "bg-red-500", spots: "3718 / 6000 spots left" },
    { stars: "★★", title: "Arcade Ranger", points: "75 Points", progress: "59%", color: "bg-blue-400", spots: "1622 / 4000 spots left" },
    { stars: "★★★", title: "Arcade Champion", points: "95 Points", progress: "74%", color: "bg-yellow-400", spots: "781 / 3000 spots left" },
    { stars: "★★★★", title: "Arcade Legend", points: "120 Points", progress: "44%", color: "bg-green-400", spots: "1397 / 2500 spots left" },
  ];

  // Function to handle the form submission for the paid swag
  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaserName.trim()) return;

    // Directing to your WhatsApp number. Added '91' country code for India
    const phoneNumber = "918538980608"; 
    const message = `Hello, I want to purchase the Paid Swag. My Name is: ${purchaserName}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    setIsPurchaseModalOpen(false);
    setPurchaserName(""); // clear input
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-16">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 pt-28 space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <h1 className="text-3xl font-black text-[#202124]">Swag Drops</h1>
          </div>
          
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-50"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-500"></span>
              </span>
              <span>
                Synced • Last Checked:{" "}
                {lastUpdated ? `Today, ${lastUpdated}` : "Syncing..."}
              </span>
            </div>

            <a 
              href="https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#b06000] font-bold text-sm hover:underline transition-all"
            >
              How the 2026 Prize Tiers Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {arcadeCards.map((card, idx) => (
            <div key={idx} className="bg-[#2d2f34] rounded-xl p-5 flex flex-col items-center justify-between border border-gray-700 shadow-lg">
              <div className="text-[#facc15] text-lg mb-1">{card.stars}</div>
              <h3 className="text-[#facc15] font-black text-sm tracking-wide text-center uppercase font-mono">
                {card.title}
              </h3>
              
              <div className="w-full border-b-[3px] border-dashed border-[#facc15] opacity-80 my-4"></div>
              
              <div className={`text-6xl mb-4 ${card.title === 'Arcade Legend' ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' : ''}`}>
                🕹️
              </div>
              
              <div className="text-[#facc15] font-bold font-mono text-lg mb-4">
                {card.points}
              </div>
              
              <div className="w-full bg-[#404349] rounded-full h-4 mb-3 relative overflow-hidden flex items-center justify-center">
                <div 
                  className={`absolute left-0 top-0 h-full ${card.color} transition-all duration-1000`}
                  style={{ width: card.progress }}
                ></div>
                <span className="relative text-[10px] text-white font-bold z-10 font-mono">
                  {card.progress}
                </span>
              </div>
              
              <div className="text-gray-300 text-xs font-medium text-center">
                {card.spots}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-5 py-2 rounded-full text-[15px] font-bold transition-all duration-300 outline-none
                ${activeTier === tier 
                  ? "bg-[#1a73e8] text-white shadow-md scale-105" 
                  : "bg-white text-[#5f6368] border border-[#dadce0] hover:bg-gray-50"
                }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="text-center text-[#5f6368] font-medium text-sm flex items-center justify-center gap-1.5">
          Showing 
          <strong className="text-black flex items-center justify-center min-w-[20px]">
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              // Added +1 because of the static Paid Swag box
              filteredSwags.length + 1 
            )}
          </strong> 
          swag item(s)
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-16">
             <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            
            {filteredSwags.map((swag) => (
              <div key={swag.id} className="bg-white rounded-2xl border border-[#dadce0] shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                
                <div className={`w-full h-[300px] p-6 ${swag.bgColor || 'bg-[#fceda6]'} flex justify-center items-center relative`}>
                  <img 
                    src={swag.image} 
                    alt={swag.title} 
                    className="w-full h-full object-contain rounded-xl hover:scale-[1.02] transition-transform duration-500" 
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[#80868b] text-[13px] font-semibold mb-2">
                    Revealed on {swag.date}
                  </span>
                  <h3 className="text-[18px] font-bold text-[#202124] leading-snug mb-4">
                    {swag.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {swag.tags && swag.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className={`text-[12px] font-bold px-3 py-1 rounded-md
                          ${tag === 'Champion' ? 'bg-purple-100 text-purple-700' : ''}
                          ${tag === 'Legend' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${tag !== 'Champion' && tag !== 'Legend' ? 'bg-blue-50 text-blue-600' : ''}
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-2">
                    <a 
                      href={swag.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full block text-center bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Swag Drop ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* 🚀 NEW PAID SWAG BOX STARTS HERE 🚀 */}
            <div className="bg-white rounded-2xl border-2 border-yellow-400 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col relative">
              
              {/* PAID Tag */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full z-10 shadow-md tracking-wider">
                PAID
              </div>

              <div className="w-full h-[300px] p-6 bg-gradient-to-br from-yellow-50 to-orange-100 flex justify-center items-center relative">
                {/* Fixed the image format for postimg so it displays successfully in the <img> tag */}
                <img 
                  src="https://i.postimg.cc/VJyPB736/image.png" 
                  alt="Premium Paid Swag" 
                  className="w-full h-full object-contain rounded-xl hover:scale-[1.02] transition-transform duration-500" 
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[#80868b] text-[13px] font-semibold mb-2">
                  Premium Collection
                </span>
                <h3 className="text-[18px] font-bold text-[#202124] leading-snug mb-4">
                  Exclusive Paid Swag
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[12px] font-bold px-3 py-1 rounded-md bg-yellow-100 text-yellow-700">
                    Paid Swag
                  </span>
                </div>

                <div className="mt-auto pt-2">
                  <button 
                    onClick={() => setIsPurchaseModalOpen(true)}
                    className="w-full block text-center bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Purchase Paid ↗
                  </button>
                </div>
              </div>
            </div>
            {/* 🚀 NEW PAID SWAG BOX ENDS HERE 🚀 */}

            <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden flex flex-col">
              <div className="w-full h-[300px] bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex flex-col justify-center items-center text-white p-6 relative">
                <span className="text-6xl font-thin mb-2 opacity-80">+</span>
                <h4 className="font-bold text-lg">More Swags</h4>
                <p className="text-sm font-medium opacity-90">Dropping Soon</p>
              </div>
              <div className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                <span className="text-[#80868b] text-[13px] font-semibold mb-2 w-full text-left">
                  Stay tuned!
                </span>
                <h3 className="text-[18px] font-bold text-[#202124] leading-snug mb-6 w-full text-left">
                  Exciting Prizes Ahead!
                </h3>
                
                <div className="flex flex-wrap gap-2 w-full mb-6">
                  <span className="text-[12px] font-bold px-3 py-1 rounded-md bg-blue-50 text-blue-600">
                    All Tiers
                  </span>
                </div>

                <div className="mt-auto pt-2 w-full">
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-[#f1f3f4] text-[#9aa0a6] font-bold py-3 rounded-xl cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* 🚀 PURCHASE MODAL (FORM) 🚀 */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            
            <button 
              onClick={() => setIsPurchaseModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🛍️</span>
              <h2 className="text-2xl font-black text-[#202124]">Get Your Swag</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your name to initiate purchase via WhatsApp</p>
            </div>
            
            <form onSubmit={handlePurchaseSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name..." 
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-all bg-gray-50"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 mt-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Send on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}