"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "bot" | "user";
  text: string;
  image?: string | null;
  timestamp?: number; 
}

export default function FullPageChatBot() {
  // === AI CHAT STATES ===
  const [messages, setMessages] = useState<Message[]>([]);
  const [isClient, setIsClient] = useState(false); 
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"text" | "image" | null>(null); 
  const [isTyping, setIsTyping] = useState(false); 
  const [typingDots, setTypingDots] = useState("."); 
  
  // === GLOBAL STATES ===
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef(isSpeakerOn);
  const stopTypingRef = useRef(false);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // === TIMERS AND LOCAL STORAGE ===
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem("arcade_chat_history");
    const savedRecents = localStorage.getItem("arcade_recent_searches");
    if (savedMessages && savedMessages !== "[]") setMessages(JSON.parse(savedMessages));
    if (savedRecents) setRecentChats(JSON.parse(savedRecents));
    setIsClient(true);
  }, []);

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
  }, [messages, loading, isTyping]);

  // 🔥 FAST 1 dot -> 2 dots -> 3 dots loop effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && loadingType === "text") {
      interval = setInterval(() => {
        setTypingDots(prev => (prev.length >= 3 ? "." : prev + "."));
      }, 200); 
    }
    return () => clearInterval(interval);
  }, [loading, loadingType]);

  const handleChatScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50);
  };

  const scrollToPosition = () => {
    if (!scrollRef.current) return;
    if (isAtBottom) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setSelectedImage(reader.result as string);
    }
  };

  const handleCopyText = (text: string, idx: number) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000); 
    }
  };

  const stopResponse = () => {
    stopTypingRef.current = true;
    setLoading(false);
    setIsTyping(false);
  };

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "Just now";
    const diff = Math.max(0, now - timestamp);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const startNewChat = () => setMessages([]);
  const clearRecents = () => {
    setRecentChats([]);
    localStorage.removeItem("arcade_recent_searches");
  };
  const clearChatHistory = () => {
    setMessages([]);
    localStorage.setItem("arcade_chat_history", JSON.stringify([]));
  };

  // === CLEAR ALL LOGIC ===
  const handleClearAll = () => {
    clearChatHistory();
    clearRecents();
  };

  // === AI CHAT SEND LOGIC ===
  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg = input;
    const userImg = selectedImage; 

    setMessages((prev) => [...prev, { role: "user", text: userMsg, image: userImg, timestamp: Date.now() }]);
    
    if (userMsg.trim()) {
      setRecentChats((prev) => [userMsg, ...prev.filter(item => item !== userMsg)].slice(0, 10));
    }

    setInput("");
    setSelectedImage(null);
    setLoading(true);
    setLoadingType(userImg ? "image" : "text"); 
    stopTypingRef.current = false; 

    try {
      const systematicInstruction = "\n\n[SYSTEM INSTRUCTION: Provide your answer in a highly professional, systematic manner. STRICTLY avoid writing long essays. Use bullet points, short paragraphs (max 2-3 lines), and clean formatting. Make it airy, easy to scan, and direct. IMPORTANT: If providing recommendations or extra tips, restrict them STRICTLY to the exact context/topic the user is discussing. Do not give generic advice.]";
      
      let apiMessage = (userMsg || "") + systematicInstruction;
      if (userImg) {
        apiMessage += "\n\n[SYSTEM INSTRUCTION: Analyze the attached image. If it is NOT related to Google Cloud, Google Cloud Arcade program, Google Cloud Swags, or Google Cloud Labs, strictly reply EXACTLY with 'Invalid Image it is not related to Google Cloud or Arcade program' and nothing else. IMPORTANT: If it IS a Google Cloud Lab screenshot asking for a solution, provide a highly concise, neat, and clean step-by-step solution. DO NOT give bulky or long-winded explanations. Only provide the exact commands or clicks needed.]";
      }

      const res = await fetch("/api/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: apiMessage, image: userImg }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.reply || "Server Error");

      if (data.reply.includes("Invalid Image it is not related to Google Cloud or Arcade")) {
        setMessages((prev) => {
          const newMessages = [...prev];
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (newMessages[i].role === "user" && newMessages[i].image) {
              newMessages[i].image = null; break;
            }
          }
          return newMessages;
        });
      }

      setLoading(false); 
      setIsTyping(true); 
      setMessages((prev) => [...prev, { role: "bot", text: "", timestamp: Date.now() }]);
      
      let currentTypingText = "";
      const chunkSize = 40; 
      for (let i = 0; i < data.reply.length; i += chunkSize) {
        if (stopTypingRef.current) break; 
        currentTypingText += data.reply.slice(i, i + chunkSize);
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = currentTypingText;
          return newMsgs;
        });
        await new Promise((resolve) => setTimeout(resolve, 5)); 
      }
      setIsTyping(false); 
      if (!stopTypingRef.current) speakText(data.reply); 
    } catch (err: any) {
      setLoading(false);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: "Aw, Snap!", timestamp: Date.now() }]);
    } finally {
      setLoadingType(null);
    }
  };

  // 🔥 ALL STRICTLY WHITE OR BLACK TEXT THEME 🔥
  const theme = {
    bgMain: isDarkMode ? "bg-[#131314]" : "bg-white",
    bgSidebar: isDarkMode ? "bg-[#1e1f20]" : "bg-[#f8f9fa]",
    bgChatArea: isDarkMode ? "bg-[#131314]" : "bg-[#ffffff]",
    botBubble: isDarkMode ? "bg-transparent text-white" : "bg-transparent text-black",
    userBubble: isDarkMode ? "bg-[#1e1f20] text-white" : "bg-[#f0f4f9] text-black", 
    inputBox: isDarkMode ? "bg-[#1e1f20] border border-[#333538] text-white" : "bg-gray-100 border border-transparent text-black",
  };

  if (!isClient) return null; 

  return (
    <>
      <div className={`fixed inset-0 z-[100] flex w-full h-[100dvh] font-sans ${theme.bgMain}`}>
        
        {/* 👈 LEFT SIDEBAR (Strictly AI Only) */}
        <div className={`w-72 flex flex-col hidden md:flex h-full ${theme.bgSidebar} border-r ${isDarkMode ? 'border-[#333538]' : 'border-gray-200'}`}>
          
          <div className="px-4 pt-5 pb-4 flex flex-col gap-6">
            <div className="flex justify-between items-center px-1">
              <h2 className={`text-[17px] font-extrabold tracking-wide ${isDarkMode ? 'text-white' : 'text-black'}`}>Arcade AI</h2>
              
              <div className="flex gap-1.5">
                <button 
                  onClick={toggleSpeaker} 
                  className={`p-1.5 rounded-md transition flex items-center justify-center ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`} 
                  title={isSpeakerOn ? "Turn off voice" : "Turn on voice"}
                >
                  {isSpeakerOn ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                  )}
                </button>

                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className={`p-1.5 rounded-md transition flex items-center justify-center ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`} 
                  title="Toggle Theme"
                >
                  {isDarkMode ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  )}
                </button>

                <button 
                  onClick={startNewChat} 
                  className={`p-1.5 rounded-md transition flex items-center justify-center ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`} 
                  title="New Chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>

            {/* 🔥 Sidebar Menu Links 🔥 */}
            <div className="flex flex-col gap-1">
              <a href="/" className={`text-[14px] font-bold px-3 py-2.5 transition-colors w-full rounded-lg ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}>Home</a>
              <a href="/calculator" className={`text-[14px] font-bold px-3 py-2.5 transition-colors w-full rounded-lg ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}>Calculator</a>
              <a href="/dashboard" className={`text-[14px] font-bold px-3 py-2.5 transition-colors w-full rounded-lg ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}>Dashboard</a>
              <a href="/resources" className={`text-[14px] font-bold px-3 py-2.5 transition-colors w-full rounded-lg ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}>Skill Badges</a>
              <a href="/about" className={`text-[14px] font-bold px-3 py-2.5 transition-colors w-full rounded-lg ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}>About</a>
            </div>
          </div>

          <div className={`p-4 overflow-y-auto hide-scrollbar border-t flex-1 flex flex-col ${isDarkMode ? 'border-[#333538]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Recent Searches
              </h3>
              
              {/* 🔥 SINGLE CLEAR ALL BUTTON 🔥 */}
              <button 
                onClick={handleClearAll} 
                className="text-[11px] text-red-500 hover:text-red-400 font-bold transition"
                title="Clear Chat and History"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              {recentChats.map((chat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setInput(chat)}
                  className={`text-[13px] font-medium px-3 py-2 rounded-lg truncate cursor-pointer transition-colors ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}
                >
                  {chat}
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* 👉 RIGHT CHAT AREA */}
        <div className={`flex-1 flex flex-col h-full relative ${theme.bgChatArea}`}>
          
          <div className="md:hidden absolute top-4 left-4 z-50">
            <button onClick={() => window.history.back()} className={`p-2 rounded-lg bg-black/10 backdrop-blur-md ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* 💬 AI Messages Area */}
          <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 p-4 pt-16 md:px-8 md:pt-12 overflow-y-auto scroll-smooth hide-scrollbar flex flex-col items-center">
            
            <div className="w-full max-w-3xl flex flex-col gap-8">
              {messages.length === 0 && (
                 // 🔥 GEMINI SYMBOL EMPTY STATE SVG INSTEAD OF IMAGE 🔥
                 <div className="flex flex-col items-center justify-center h-[60vh] opacity-90 px-4 text-center">
                    
                    <svg className="w-14 h-14 mb-6 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9688 2C11.9688 2 11.2188 9.5 5.96875 12C11.2188 14.5 11.9688 22 11.9688 22C11.9688 22 12.7188 14.5 17.9688 12C12.7188 9.5 11.9688 2 11.9688 2Z" fill="url(#gemini_grad_large)"/>
                      <defs>
                        <linearGradient id="gemini_grad_large" x1="5.96875" y1="2" x2="17.9688" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#1C7DFF"/>
                          <stop offset="0.5" stopColor="#B344FF"/>
                          <stop offset="1" stopColor="#FF6A3D"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <span className={`text-xl md:text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>How can I help you with Arcade?</span>
                    
                    <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl">
                       {[
                         "Calculate Dashboard Points", 
                         "Skill Badges Guide", 
                         "Labs Error Fix", 
                         "Find Error Solution", 
                         "Learn Google Cloud"
                       ].map(chip => (
                         <button 
                           key={chip} 
                           onClick={() => setInput(chip)} 
                           className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm border ${isDarkMode ? 'bg-[#1e1f20] border-white/20 text-white hover:bg-white/10 hover:border-white/40' : 'bg-white border-black/20 text-black hover:bg-black/5 hover:border-black/40'}`}
                         >
                           {chip}
                         </button>
                       ))}
                    </div>
                 </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {msg.role === "user" ? (
                    <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%]">
                      {msg.image && (
                        <img src={msg.image} alt="Uploaded" className="max-w-full max-h-56 object-contain mb-3 rounded-2xl border border-white/20 shadow-sm" />
                      )}
                      <div className={`px-5 py-3 text-[15px] leading-relaxed rounded-3xl ${theme.userBubble}`}>
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    
                    <div className="flex flex-col items-start w-full">
                      <div className={`w-full text-[15px] leading-relaxed ${theme.botBubble}`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({node, ...props}) => (
                              <a 
                                {...props} 
                                className={`inline-flex items-center gap-2 px-3 py-2 mt-1 mb-1 rounded-xl border text-[14px] font-semibold transition-all no-underline ${
                                  isDarkMode 
                                    ? 'bg-[#1e1f20] border-white/20 text-white hover:bg-white/10 shadow-sm' 
                                    : 'bg-gray-50 border-black/20 text-black hover:bg-black/5 shadow-sm'
                                }`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                              >
                                <svg className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                </svg>
                                {props.children}
                                <svg className={`w-3.5 h-3.5 ml-1 ${isDarkMode ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                              </a>
                            ),
                            ul: ({node, ...props}) => <ul {...props} className="list-none pl-1 mt-3 mb-3 space-y-2" />,
                            li: ({node, ...props}) => <li {...props} className="flex flex-col" />,
                            ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mt-2 mb-2 space-y-1.5" />,
                            p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0 whitespace-pre-wrap" />,
                            strong: ({node, ...props}) => <strong {...props} className="font-bold" />,
                            pre: ({ children }) => (
                              <div className={`my-5 rounded-xl overflow-hidden border ${isDarkMode ? 'border-[#333538] bg-[#0d0d0d]' : 'border-gray-300 bg-[#f1f3f4]'} shadow-sm`}>
                                <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? 'bg-[#1e1f20] border-[#333538]' : 'bg-gray-200 border-gray-300'}`}>
                                  <span className={`text-[12px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Code</span>
                                  <div className="flex gap-2">
                                    <button className={`p-1 rounded transition hover:bg-black/10 ${isDarkMode ? 'text-white' : 'text-black'}`} title="Copy Code">
                                      <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </button>
                                  </div>
                                </div>
                                <pre className={`p-4 overflow-x-auto text-[13px] font-mono ${isDarkMode ? 'text-white' : 'text-black'}`}>{children}</pre>
                              </div>
                            ),
                            code: ({ node, className, children, ...props }: any) => {
                              const isInline = !className && !String(children).includes('\n');
                              if (isInline) {
                                return <code {...props} className={`${isDarkMode ? 'bg-[#1e1f20] text-white border-white/20' : 'bg-white text-black border-black/20'} px-1.5 py-0.5 rounded-md text-[13px] font-mono border`}>{children}</code>;
                              }
                              return <code className={className} {...props}>{children}</code>;
                            }
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {msg.text !== "Aw, Snap!" && (
                        <div className="flex items-center mt-2 justify-between gap-4 w-full">
                          <span className={`text-[11px] font-medium tracking-wide opacity-70 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {formatTimeAgo(msg.timestamp)}
                          </span>

                          {(!isTyping || idx !== messages.length - 1) && (
                            <button
                              onClick={() => handleCopyText(msg.text, idx)}
                              className={`text-[12px] font-medium flex items-center gap-1.5 p-1.5 rounded-full transition-all ${copiedIndex === idx ? 'text-green-500' : `${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}`}
                              title="Copy Text"
                            >
                              {copiedIndex === idx ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex flex-col items-start w-full animate-fade-in">
                  <div className="py-2 flex items-center">
                    {loadingType === "image" ? (
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
                        <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Analyzing image...</span>
                      </div>
                    ) : (
                      // 🔥 SMALL GEMINI SPARKLE SVG FOR TYPING INDICATOR 🔥
                      <div className="flex items-center px-1 py-1">
                        <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.9688 2C11.9688 2 11.2188 9.5 5.96875 12C11.2188 14.5 11.9688 22 11.9688 22C11.9688 22 12.7188 14.5 17.9688 12C12.7188 9.5 11.9688 2 11.9688 2Z" fill="url(#gemini_grad_small)"/>
                          <defs>
                            <linearGradient id="gemini_grad_small" x1="5.96875" y1="2" x2="17.9688" y2="22" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#1C7DFF"/>
                              <stop offset="0.5" stopColor="#B344FF"/>
                              <stop offset="1" stopColor="#FF6A3D"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ⌨️ AI Input Bar */}
          <div className="p-3 sm:p-4 pb-6 transition-colors duration-300 relative z-20">
            {selectedImage && (
              <div className="absolute bottom-[75px] left-1/2 -translate-x-1/2 z-30 max-w-3xl w-full px-4">
                <div className={`relative inline-block p-1.5 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-[#1e1f20] border-[#333538]' : 'bg-white border-gray-200'}`}>
                  <img src={selectedImage} alt="Preview" className="h-24 sm:h-32 object-cover rounded-lg shadow-sm" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className={`absolute -top-3 -right-3 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg transition-transform border-2 border-transparent hover:scale-110 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >✕</button>
                </div>
              </div>
            )}

            <div className="max-w-3xl mx-auto flex gap-2 items-center">
              <div className={`flex-1 flex gap-2 items-center py-2 px-2 sm:px-3 rounded-full transition-all ${theme.inputBox} ${isDarkMode ? 'focus-within:bg-[#282a2c]' : 'focus-within:bg-white focus-within:shadow-md'} shadow-sm`}>
                <button 
                  onClick={() => imageInputRef.current?.click()} 
                  className={`p-2 rounded-full transition ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}
                  title="Upload Screenshot"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </button>
                <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && !isTyping && (input.trim() || selectedImage) && sendMessage()}
                  disabled={loading || isTyping} 
                  placeholder="Ask me anything..."
                  className={`flex-1 bg-transparent border-none text-[15px] font-medium focus:outline-none focus:ring-0 px-1 ${isDarkMode ? 'text-white placeholder-white/60' : 'text-black placeholder-black/60'}`}
                />
                
                {(loading || isTyping) ? (
                  <button onClick={stopResponse} className={`p-2 rounded-full transition shadow-sm flex items-center justify-center ${isDarkMode ? 'bg-[#333538] text-red-400 hover:bg-[#404347]' : 'bg-gray-200 text-red-500 hover:bg-gray-300'}`}>
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
                  </button>
                ) : (
                  <button onClick={sendMessage} disabled={(!input.trim() && !selectedImage)} className={`p-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center group ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                     <svg className="w-5 h-5 translate-x-[1px] group-hover:translate-x-[3px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>

              <button 
                onClick={scrollToPosition}
                className={`p-2 rounded-full transition-colors flex shrink-0 items-center justify-center ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}
              >
                {isAtBottom ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}