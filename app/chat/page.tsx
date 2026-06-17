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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isClient, setIsClient] = useState(false); 
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"text" | "image" | null>(null); 
  const [isTyping, setIsTyping] = useState(false); 
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef(isSpeakerOn);
  
  const stopTypingRef = useRef(false);

  const [isBlurred, setIsBlurred] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem("arcade_chat_history");
    const savedRecents = localStorage.getItem("arcade_recent_searches");
    
    if (savedMessages && savedMessages !== "[]") {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]); 
    }

    if (savedRecents) {
      setRecentChats(JSON.parse(savedRecents));
    }
    
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

  useEffect(() => {
    const triggerBlackout = () => {
      setIsBlurred(true);
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText("🚫 Security Alert: Content Protected.").catch(() => {});
      }
      setTimeout(() => {
        if (document.hasFocus()) setIsBlurred(false);
      }, 3000);
    };

    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); triggerBlackout(); };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey) || 
        (e.ctrlKey && (e.key.toLowerCase() === "c" || e.key.toLowerCase() === "p" || e.key.toLowerCase() === "s" || e.key.toLowerCase() === "u")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j" || e.key.toLowerCase() === "c"))
      ) {
        e.preventDefault();
        triggerBlackout();
      }
    };
    const handleCopy = (e: ClipboardEvent) => { e.preventDefault(); triggerBlackout(); };
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    const handleVisibilityChange = () => setIsBlurred(document.hidden);
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") { e.preventDefault(); triggerBlackout(); }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("copy", handleCopy);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
            reader.onload = () => setSelectedImage(reader.result as string);
          }
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

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

  const startNewChat = () => {
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = input;
    const userImg = selectedImage; 

    setMessages((prev) => [...prev, { role: "user", text: userMsg, image: userImg, timestamp: Date.now() }]);
    
    if (userMsg.trim()) {
      setRecentChats((prev) => {
        const newRecents = [userMsg, ...prev.filter(item => item !== userMsg)].slice(0, 10);
        return newRecents;
      });
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

      if (data.reply.includes("Invalid Image it is not related to Google Cloud or Arcade program")) {
        setMessages((prev) => {
          const newMessages = [...prev];
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (newMessages[i].role === "user" && newMessages[i].image) {
              newMessages[i].image = null; 
              break;
            }
          }
          return newMessages;
        });
      }

      setLoading(false); 
      setIsTyping(true); 
      setMessages((prev) => [...prev, { role: "bot", text: "", timestamp: Date.now() }]);
      
      let currentTypingText = "";
      const chunkSize = 12; 
      
      for (let i = 0; i < data.reply.length; i += chunkSize) {
        if (stopTypingRef.current) break; 

        currentTypingText += data.reply.slice(i, i + chunkSize);
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = currentTypingText;
          return newMsgs;
        });
        await new Promise((resolve) => setTimeout(resolve, 1)); 
      }

      setIsTyping(false); 
      if (!stopTypingRef.current) {
        speakText(data.reply); 
      }
    
    } catch (err: any) {
      setLoading(false);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: "Too many requests right now. Try later.", timestamp: Date.now() }]);
    } finally {
      setLoadingType(null);
    }
  };

  const clearRecents = () => {
    setRecentChats([]);
    localStorage.removeItem("arcade_recent_searches");
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.setItem("arcade_chat_history", JSON.stringify([]));
  }

  const theme = {
    bgMain: isDarkMode ? "bg-[#131314]" : "bg-[#F0F2F5]",
    bgSidebar: isDarkMode ? "bg-[#1e1f20]" : "bg-[#f8f9fa]",
    bgChatArea: isDarkMode ? "bg-[#131314]" : "bg-[#ffffff]",
    textMain: isDarkMode ? "text-gray-100" : "text-[#202124]",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    
    botBubble: isDarkMode ? "bg-[#1e1f20] border border-[#333538] text-gray-100 shadow-sm" : "bg-white border border-gray-200 text-gray-800 shadow-sm",
    userBubble: isDarkMode ? "bg-[#282a2c] text-gray-100" : "bg-[#f0f4f9] text-gray-900", 
    
    inputBox: isDarkMode ? "bg-[#1e1f20] border-transparent text-white" : "bg-[#f0f4f9] border-transparent text-gray-900",
  };

  if (!isClient) return null; 

  return (
    <>
      {isBlurred && (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center p-6 h-[100dvh] w-[100vw]">
          <p className="text-gray-300 font-medium text-lg flex items-center justify-center gap-3 text-center">
            Screenshots are strictly prohibited. Return to Home.
          </p>
        </div>
      )}

      <div 
        className={`flex w-full h-[100dvh] font-sans pt-[60px] prevent-copy ${theme.bgMain} ${isBlurred ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}
        aria-hidden={isBlurred}
      >
        
        {/* 👈 LEFT SIDEBAR */}
        <div className={`w-64 flex flex-col hidden md:flex h-full ${theme.bgSidebar} border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="p-3 flex flex-col gap-0.5 pt-4">
            <h2 className={`text-[15px] font-bold mb-2 tracking-wide px-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Arcade Nexus</h2>
            
            <a href="/" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full flex items-center gap-3 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>Home</a>
            <a href="/calculator" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full flex items-center gap-3 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>Calculator</a>
            <a href="/dashboard" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full flex items-center gap-3 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>Dashboard</a>
            <a href="/leaderboard" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full flex items-center gap-3 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>Leaderboard</a>
            
            <a href="/resources" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full flex items-center gap-3 mt-1 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>Skill Badges</a>
            <a href="/facilitator" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full flex items-center gap-3 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>Facilitator</a>
          </div>

          <div className={`p-4 overflow-y-auto hide-scrollbar border-t mt-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Recent Searches</h3>
              <button onClick={clearRecents} className="text-xs text-red-400 hover:text-red-500 font-medium transition">Clear</button>
            </div>
            <div className="flex flex-col gap-1">
              {recentChats.length === 0 ? (
                <p className={`text-[13px] italic px-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>No recent searches</p>
              ) : (
                recentChats.map((chat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setInput(chat)}
                    className={`text-[13px] px-2 py-2 rounded-md truncate cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
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
          
          <div className="p-3 sm:px-6 flex justify-between items-center z-10 transition-colors duration-300 bg-transparent">
            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <button onClick={() => window.history.back()} className={`md:hidden p-1.5 rounded-full ${theme.textMuted} hover:text-gray-300 transition-colors`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-[#282a2c] text-white' : 'bg-[#1a73e8] text-white'}`}>
                <span className="text-lg sm:text-xl translate-x-[1px]">🤖</span>
              </div>
            </div>

            <div className="flex-2 flex flex-col items-center justify-center text-center">
              <span className={`text-[12px] sm:text-[15px] font-medium tracking-wide whitespace-nowrap sm:whitespace-normal ${theme.textMain}`}>
                Ask Arcade Nexus
              </span>
            </div>
            
            <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
              
              {messages.length > 0 && (
                <button 
                  onClick={clearChatHistory} 
                  className={`p-2 sm:p-2.5 rounded-full transition flex items-center justify-center ${isDarkMode ? 'bg-[#1e1f20] text-gray-300 hover:bg-[#282a2c] hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
                  title="Clear Chat"
                >
                  <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}

              <button 
                onClick={startNewChat} 
                className={`p-2 sm:p-2.5 rounded-full transition flex items-center justify-center ${isDarkMode ? 'bg-[#1e1f20] text-gray-300 hover:bg-[#282a2c] hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
                title="New Chat"
              >
                <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </button>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`p-2 sm:p-2.5 rounded-full transition flex items-center justify-center ${isDarkMode ? 'bg-[#1e1f20] text-gray-300 hover:bg-[#282a2c]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
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
                className={`p-2 sm:p-2.5 rounded-full transition flex items-center justify-center ${isDarkMode ? 'bg-[#1e1f20] text-gray-300 hover:bg-[#282a2c]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
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

          {/* 💬 Messages Area */}
          <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 p-4 md:px-8 md:py-6 overflow-y-auto space-y-6 scroll-smooth hide-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col w-full ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="Uploaded" 
                    className="max-w-[75%] sm:max-w-[50%] max-h-56 object-contain mb-2 rounded-xl disable-img-drag shadow-sm border border-gray-200/20" 
                    onDragStart={(e) => e.preventDefault()}
                  />
                )}
                
                {/* 🔥 REMOVED tracking-wide and leading-normal mapping issues for normal text 🔥 */}
                {msg.text && msg.text.trim() !== "" && (
                  <div className={`relative max-w-[95%] sm:max-w-[85%] px-4 py-3 text-[14px] sm:text-[15px] leading-relaxed ${
                    msg.role === "user" 
                      ? `${theme.userBubble} rounded-[20px] rounded-br-[4px]` 
                      : `${theme.botBubble} rounded-[18px] rounded-tl-[4px]` 
                  }`}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({node, ...props}) => (
                          <a 
                            {...props} 
                            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-[#1a73e8] hover:text-[#1557b0]'} underline underline-offset-2 transition-colors break-words font-medium`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                          />
                        ),
                        ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mt-2 mb-2 space-y-1.5" />,
                        ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mt-2 mb-2 space-y-1.5" />,
                        p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0 whitespace-pre-wrap" />,
                        /* 🔥 FIXED: font-extrabold changed to standard font-bold so it's not bulky 🔥 */
                        strong: ({node, ...props}) => <strong {...props} className="font-bold" />,
                        pre: ({ children }) => (
                          <pre className={`${isDarkMode ? 'bg-[#131314] border-[#333538]' : 'bg-[#f1f3f4] border-gray-200'} p-4 rounded-xl overflow-x-auto text-[13px] font-mono border my-3 shadow-inner`}>
                            {children}
                          </pre>
                        ),
                        code: ({ node, className, children, ...props }: any) => {
                          const isInline = !className && !String(children).includes('\n');
                          if (isInline) {
                            return (
                              <code {...props} className={`${isDarkMode ? 'bg-[#131314] text-gray-300 border-gray-700' : 'bg-gray-100 text-[#1a73e8] border-gray-200'} px-1.5 py-0.5 rounded-md text-[13px] font-mono border`}>
                                {children}
                              </code>
                            );
                          }
                          return <code className={className} {...props}>{children}</code>;
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>

                    {/* 🔥 Time & Copy Footer (Only for Bot) 🔥 */}
                    {msg.role === "bot" && (
                      <div className="flex items-center mt-1.5 justify-between gap-4">
                        
                        {/* Timestamp */}
                        <span className={`text-[10.5px] font-medium tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatTimeAgo(msg.timestamp)}
                        </span>

                        {/* Copy Button */}
                        {(!isTyping || idx !== messages.length - 1) && (
                          <button
                            onClick={() => handleCopyText(msg.text, idx)}
                            className={`text-[11.5px] font-medium flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                              copiedIndex === idx ? 'text-green-500 bg-green-500/10' : `${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-[#282a2c]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`
                            }`}
                            title="Copy Text"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}

            {/* 🔥 LOADING LAYOUT */}
            {loading && (
              <div className="flex flex-col items-start w-full animate-fade-in">
                <div className={`px-4 py-3 pb-3 ${theme.botBubble} rounded-[18px] rounded-tl-[4px] flex items-center`}>
                  {loadingType === "image" ? (
                    <div className="flex items-center gap-2.5">
                      <div className={`w-[15px] h-[15px] border-[2px] border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-gray-400' : 'border-[#1a73e8]'}`}></div>
                      <span className={`text-[14px] font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#1a73e8]'}`}>Analyzing image...</span>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ⌨️ Input Area */}
          <div className="p-3 sm:p-4 transition-colors duration-300 relative z-20 bg-transparent">
            
            {selectedImage && (
              <div className="absolute bottom-[65px] left-4 sm:left-8 z-30">
                <div className={`relative inline-block p-1.5 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-[#1e1f20] border-[#333538]' : 'bg-white border-gray-200'}`}>
                  <img src={selectedImage} alt="Preview" className="h-20 sm:h-28 object-cover rounded-lg shadow-sm disable-img-drag" onDragStart={(e) => e.preventDefault()} />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-3 -right-3 bg-gray-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg hover:bg-gray-600 hover:scale-110 transition-transform border-2 border-transparent"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="max-w-5xl mx-auto flex gap-2 sm:gap-4 items-center px-1">
              
              {/* 🔥 Input Focus Background Fix Here */}
              <div className={`flex-1 flex gap-2 items-center py-1 px-1.5 sm:py-1.5 sm:px-2 rounded-xl transition-all ${theme.inputBox} ${isDarkMode ? 'focus-within:bg-[#282a2c]' : 'focus-within:bg-white'} shadow-sm`}>
                
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className={`p-1.5 sm:p-2 rounded-lg transition ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#333538]' : 'text-gray-500 hover:text-[#1a73e8] hover:bg-gray-200'}`}
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
                  onKeyDown={(e) => e.key === "Enter" && !loading && !isTyping && (input.trim() || selectedImage) && sendMessage()}
                  disabled={loading || isTyping} 
                  placeholder="Ask me anything or paste a screenshot..."
                  className="flex-1 bg-transparent border-none text-[14px] sm:text-[15px] font-medium focus:outline-none focus:ring-0 px-1 sm:px-2 placeholder-gray-500 prevent-copy-input"
                />
                
                {(loading || isTyping) ? (
                  <button 
                    onClick={stopResponse} 
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition shadow-md flex items-center justify-center ${isDarkMode ? 'bg-[#333538] text-red-400 hover:bg-[#404347]' : 'bg-gray-200 text-red-500 hover:bg-gray-300'}`}
                    title="Stop Response"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
                  </button>
                ) : (
                  <button 
                    onClick={sendMessage} 
                    disabled={(!input.trim() && !selectedImage)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center group ${isDarkMode ? 'bg-[#282a2c] text-gray-200 hover:bg-[#333538]' : 'bg-[#1a73e8] text-white hover:bg-blue-600'}`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 translate-x-[1px] group-hover:translate-x-[3px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                )}

              </div>

              <button 
                onClick={scrollToPosition}
                className={`p-2 sm:p-2.5 rounded-lg transition-colors flex shrink-0 items-center justify-center ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-500 hover:text-[#1a73e8] hover:bg-gray-200'}`}
                title={isAtBottom ? "Scroll to Top" : "Scroll to Bottom"}
              >
                {isAtBottom ? (
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
                ) : (
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .prevent-copy {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }

        .prevent-copy-input {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        .disable-img-drag {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}