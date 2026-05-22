"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "bot" | "user";
  text: string;
  image?: string | null;
}

export default function FullPageChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isClient, setIsClient] = useState(false); 
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  
  // 🔥 DEFAULT DARK MODE 🔥
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // 🔥 SCROLL STATE FOR ARROW 🔥
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef(isSpeakerOn);

  // Initial Data Load 
  useEffect(() => {
    const savedMessages = localStorage.getItem("arcade_chat_history");
    const savedRecents = localStorage.getItem("arcade_recent_searches");
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ role: "bot", text: "Hello! 👋 I am the Cloud Arcade AI. Ask me anything related to Google Cloud, Arcade points, Swags, or Labs!" }]);
    }

    if (savedRecents) {
      setRecentChats(JSON.parse(savedRecents));
    }
    
    setIsClient(true);
  }, []);

  // Save to Local Storage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("arcade_chat_history", JSON.stringify(messages));
      localStorage.setItem("arcade_recent_searches", JSON.stringify(recentChats));
    }
  }, [messages, recentChats, isClient]);

  useEffect(() => {
    speakerRef.current = isSpeakerOn;
  }, [isSpeakerOn]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // ================= 🔥 DYNAMIC SCROLL LOGIC 🔥 =================
  const handleChatScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Agar niche se 50px ke andar hai, toh bottom par maanenge
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50);
  };

  const scrollToPosition = () => {
    if (!scrollRef.current) return;
    if (isAtBottom) {
      // Top pe jao
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Bottom pe jao
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  // ================= 🔥 CTRL + V PASTE IMAGE LOGIC 🔥 =================
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setSelectedImage(reader.result as string);
            };
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  // 🗣️ Text-to-Speech Function
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    if (!speakerRef.current) return;

    const cleanText = text.replace(/[*#_`~]/g, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN"; 
    utterance.rate = 1; 
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => {
      const newState = !prev;
      if (!newState) window.speechSynthesis.cancel();
      return newState;
    });
  };

  // 🖼️ Handle Image Selection 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = input;
    const userImg = selectedImage; 

    setMessages((prev) => [...prev, { role: "user", text: userMsg, image: userImg }]);
    
    if (userMsg.trim()) {
      setRecentChats((prev) => {
        const newRecents = [userMsg, ...prev.filter(item => item !== userMsg)].slice(0, 10);
        return newRecents;
      });
    }

    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, image: userImg }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.reply || "Server Error");

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      speakText(data.reply); 
    
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Network Issue! Check your internet connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearRecents = () => {
    setRecentChats([]);
    localStorage.removeItem("arcade_recent_searches");
  };

  const clearChatHistory = () => {
    if(confirm("Are you sure you want to clear the entire chat history?")) {
      const defaultGreeting = { role: "bot" as const, text: "Hello! 👋 I am the Cloud Arcade AI. Ask me anything related to Google Cloud, Arcade points, Swags, or Labs!" };
      setMessages([defaultGreeting]);
      localStorage.setItem("arcade_chat_history", JSON.stringify([defaultGreeting]));
    }
  }

  // ================= 🔥 THEME VARIABLES 🔥 =================
  const theme = {
    bgMain: isDarkMode ? "bg-[#0f172a]" : "bg-[#F0F2F5]",
    bgChatArea: isDarkMode ? "bg-[#0f172a]" : "bg-[#f8f9fa]",
    textMain: isDarkMode ? "text-gray-100" : "text-[#202124]",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    
    botBubble: isDarkMode 
      ? "bg-[#1e293b] text-gray-100 border border-[#334155] shadow-sm" 
      : "bg-white text-gray-800 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    userBubble: "bg-gradient-to-br from-[#1a73e8] to-[#2b5dd4] text-white shadow-md border border-blue-600/20",
    
    inputBox: isDarkMode ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900",
  };

  if (!isClient) return null; 

  return (
    <div className={`flex w-full h-[100dvh] font-sans transition-colors duration-300 pt-[60px] ${theme.bgMain}`}>
      
      {/* 👈 LEFT SIDEBAR (Scrollbar hidden via class) */}
      <div className="w-64 bg-[#0d1321] text-white flex flex-col hidden md:flex h-full">
        <div className="p-4 flex flex-col gap-2 pt-6">
          <h2 className="text-lg font-bold text-gray-100 mb-3 tracking-wide px-1">Arcade Nexus</h2>
          
          <a href="/" className="bg-[#1e293b]/50 hover:bg-[#1a73e8] text-sm text-left px-4 py-2.5 rounded-md transition-colors w-full flex items-center gap-3 shadow-sm border border-[#1e293b]/50 hover:border-[#1a73e8]">
            🏠 Home
          </a>
          <a href="/calculator" className="bg-[#1e293b]/50 hover:bg-[#1a73e8] text-sm text-left px-4 py-2.5 rounded-md transition-colors w-full flex items-center gap-3 shadow-sm border border-[#1e293b]/50 hover:border-[#1a73e8]">
            📊 Go to Calculator
          </a>
          <a href="/dashboard" className="bg-[#1e293b]/50 hover:bg-[#1a73e8] text-sm text-left px-4 py-2.5 rounded-md transition-colors w-full flex items-center gap-3 shadow-sm border border-[#1e293b]/50 hover:border-[#1a73e8]">
            📈 Dashboard
          </a>
          <a href="/leaderboard" className="bg-[#1e293b]/50 hover:bg-[#1a73e8] text-sm text-left px-4 py-2.5 rounded-md transition-colors w-full flex items-center gap-3 shadow-sm border border-[#1e293b]/50 hover:border-[#1a73e8]">
            🏆 Leaderboard
          </a>
          
          <a href="/resources" className="bg-[#1e293b]/50 hover:bg-[#1a73e8] text-sm text-left px-4 py-2.5 rounded-md transition-colors w-full flex items-center gap-3 shadow-sm border border-[#1e293b]/50 hover:border-[#1a73e8]">
            🎖️ Skill Badges List
          </a>
          <a href="/facilitator" className="bg-[#1e293b]/50 hover:bg-[#1a73e8] text-sm text-left px-4 py-2.5 rounded-md transition-colors w-full flex items-center gap-3 shadow-sm border border-[#1e293b]/50 hover:border-[#1a73e8]">
            📢 Facilitator Program
          </a>
        </div>

        <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Searches</h3>
            <button onClick={clearRecents} className="text-xs text-red-400 hover:text-red-300 font-medium transition">Clear</button>
          </div>
          <div className="flex flex-col gap-2">
            {recentChats.length === 0 ? (
              <p className="text-[13px] text-gray-600 italic">No recent searches</p>
            ) : (
              recentChats.map((chat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setInput(chat)}
                  className="text-[13px] bg-[#1e293b]/30 px-3 py-2.5 rounded-md truncate text-gray-300 cursor-pointer hover:bg-[#1e293b] transition-colors border border-transparent hover:border-[#334155]"
                >
                  {chat}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 👉 RIGHT CHAT AREA */}
      <div className={`flex-1 flex flex-col h-full relative ${theme.bgChatArea}`}>
        
        {/* HEADER - Mobile Responsive Fixed */}
        <div className="p-3 sm:px-6 flex justify-between items-center z-10 transition-colors duration-300 bg-transparent">
          
          <div className="flex-1 flex items-center gap-2 sm:gap-3">
            <button onClick={() => window.history.back()} className={`md:hidden p-1.5 rounded-full ${theme.textMuted} hover:text-[#1a73e8] transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-gradient-to-br from-[#1a73e8] to-[#4285f4] text-white rounded-full flex items-center justify-center shadow-md border border-blue-400/30">
              <span className="text-lg sm:text-xl translate-x-[1px]">🤖</span>
            </div>
            
            {messages.length > 1 && (
              <button onClick={clearChatHistory} className="text-[11px] text-red-400/80 hover:text-red-400 underline underline-offset-2 transition-colors ml-1 hidden sm:block">
                Clear Chat
              </button>
            )}
          </div>

          <div className="flex-2 flex flex-col items-center justify-center text-center">
            <span className={`text-[12px] sm:text-[15px] font-medium tracking-wide whitespace-nowrap sm:whitespace-normal ${theme.textMain}`}>
              Ask anything related to Google Cloud Arcade
            </span>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 sm:p-2.5 rounded-full transition flex items-center justify-center ${isDarkMode ? 'bg-[#1e293b] text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>

            <button 
              onClick={toggleSpeaker} 
              className={`p-2 sm:p-2.5 rounded-full transition flex items-center justify-center ${isDarkMode ? 'bg-[#1e293b] text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
              title={isSpeakerOn ? "Turn off voice" : "Turn on voice"}
            >
              {isSpeakerOn ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              )}
            </button>
          </div>
        </div>

        {/* 💬 Messages Area (Scrollbar hidden, onScroll added) */}
        <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 scroll-smooth hide-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] sm:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed tracking-wide ${
                msg.role === "user" 
                  ? `${theme.userBubble} rounded-[20px] rounded-br-[4px]` 
                  : `${theme.botBubble} rounded-[20px] rounded-tl-[4px]` 
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="max-w-full h-auto mb-3 rounded-xl border border-white/20 shadow-sm" />
                )}
                
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => (
                      <a 
                        {...props} 
                        className={`${msg.role === 'user' ? 'text-blue-100 hover:text-white border-blue-200' : 'text-[#1a73e8] hover:text-[#1557b0] border-[#1a73e8]'} font-bold border-b transition-colors break-words`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                      />
                    ),
                    ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mt-2 mb-2 space-y-1.5" />,
                    ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mt-2 mb-2 space-y-1.5" />,
                    p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0 whitespace-pre-wrap" />,
                    strong: ({node, ...props}) => <strong {...props} className="font-extrabold" />,
                    code: ({node, inline, ...props}: any) => 
                      inline 
                        ? <code {...props} className={`${isDarkMode ? 'bg-[#0f172a] text-blue-300' : 'bg-gray-100 text-[#1a73e8]'} px-1.5 py-0.5 rounded-md text-[13px] font-mono border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        : <pre className={`${isDarkMode ? 'bg-[#0b1121] border-[#1e293b]' : 'bg-[#f1f3f4] border-gray-200'} p-4 rounded-xl overflow-x-auto text-[13px] font-mono border my-3 shadow-inner`}><code {...props} /></pre>
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start w-full animate-fade-in pl-2">
              <div className={`px-4 py-3 ${theme.botBubble} rounded-[20px] rounded-tl-[4px] flex items-center gap-2`}>
                 <div className="w-4 h-4 border-[3px] border-gray-300 border-t-[#1a73e8] rounded-full animate-spin"></div>
                 <span className="text-xs font-medium text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* ⌨️ Input Area with Scroll Arrow */}
        <div className="p-3 sm:p-4 transition-colors duration-300 relative z-20 bg-transparent">
          
          {selectedImage && (
            <div className="absolute bottom-[65px] left-4 sm:left-8 z-30">
              <div className={`relative inline-block p-1.5 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
                <img src={selectedImage} alt="Preview" className="h-20 sm:h-28 object-cover rounded-lg shadow-sm" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg hover:bg-red-600 hover:scale-110 transition-transform border-2 border-white"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* 🔥 Container updated to hold both Input Box and Arrow Button 🔥 */}
          <div className="max-w-5xl mx-auto flex gap-2 sm:gap-4 items-center px-1">
            
            <div className={`flex-1 flex gap-2 sm:gap-2.5 items-center p-1.5 sm:p-2 rounded-xl border focus-within:ring-2 focus-within:ring-[#1a73e8]/50 transition-all ${theme.inputBox} shadow-sm`}>
              
              <button 
                onClick={() => imageInputRef.current?.click()}
                className={`p-2 sm:p-2.5 rounded-lg transition ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-[#1a73e8] hover:bg-gray-200'}`}
                title="Upload Screenshot"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={imageInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && (input.trim() || selectedImage) && sendMessage()}
                disabled={loading} 
                placeholder="Ask me anything or paste a screenshot..."
                className="flex-1 bg-transparent border-none text-[14px] sm:text-[15px] font-medium focus:outline-none focus:ring-0 px-1 sm:px-2 placeholder-gray-500"
              />
              
              <button 
                onClick={sendMessage} 
                disabled={loading || (!input.trim() && !selectedImage)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#1a73e8] text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center group"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 translate-x-[1px] group-hover:translate-x-[3px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* 🔥 NEW DYNAMIC SCROLL ARROW BUTTON 🔥 */}
            <button 
              onClick={scrollToPosition}
              className={`p-2.5 rounded-lg transition-colors flex shrink-0 items-center justify-center ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-[#1a73e8] hover:bg-gray-200'}`}
              title={isAtBottom ? "Scroll to Top" : "Scroll to Bottom"}
            >
              {isAtBottom ? (
                // Up Arrow
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
              ) : (
                // Down Arrow
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
              )}
            </button>

          </div>
        </div>

      </div>

      {/* Global Style to completely hide native scrollbars */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}