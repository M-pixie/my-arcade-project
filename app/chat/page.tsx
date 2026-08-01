"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 🔥 FIREBASE IMPORTS
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, where, getDocs, deleteDoc, setDoc, increment } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // <--- PATH CHECK KAR LENA AGAR ERROR AAYE
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

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
  
  // === COMMUNITY CHAT STATES 🔥 ===
  const [communityInput, setCommunityInput] = useState("");
  const [communityMsgs, setCommunityMsgs] = useState<any[]>([]);
  const [activeCommunityChat, setActiveCommunityChat] = useState<string | null>(null); // Real Chat ID
  const [realCommunityChats, setRealCommunityChats] = useState<any[]>([]); // Sidebar Chat List
  const [user, setUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<{id: string, senderName: string, text: string} | null>(null);

  // === AUTHENTICATION LOGIC ===
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); // Console me jo red error aata hai wo strict browser policy ki wajah se hai, usey ignore karo, login successful hoga.
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveCommunityChat(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
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

  const [activeTab, setActiveTab] = useState<"ai" | "community">("ai");

  // === FIREBASE LISTENER: SIDEBAR CHAT LIST 🔥 ===
  useEffect(() => {
    if (!user) {
      setRealCommunityChats([]);
      return;
    }
    
    // Fetch all chats so everyone can see them
    const q = query(
      collection(db, "chats")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort chats manually by createdAt timestamp (descending)
        chats.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setRealCommunityChats(chats);
      },
      (error) => {
        console.warn("Chats listener disabled: Firebase permission denied. Please update Firestore Rules.");
      }
    );

    return () => unsubscribe();
  }, [user]);

  // === FIREBASE LISTENER: CHAT MESSAGES 🔥 ===
  useEffect(() => {
    if (activeTab !== "community" || !activeCommunityChat) return;

    const q = query(
      collection(db, "chats", activeCommunityChat, "messages"), 
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCommunityMsgs(msgs);
        
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
          }
        }, 100);
      },
      (error) => {
        console.warn("Messages listener disabled: Firebase permission denied. Please update Firestore Rules.");
      }
    );

    return () => unsubscribe();
  }, [activeTab, activeCommunityChat]);

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
    if (activeTab === "ai") {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, isTyping, activeTab]);

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

  // === CREATE NEW GROUP LOGIC 🔥 ===
  const createNewGroup = async () => {
    if (!user) return;
    const groupName = window.prompt("Enter new group name:");
    if (!groupName || groupName.trim() === "") return;

    try {
      const newChatRef = await addDoc(collection(db, "chats"), {
        name: groupName.trim(),
        type: "group",
        members: [user.uid], // Creator is the first member
        createdAt: serverTimestamp()
      });
      setActiveCommunityChat(newChatRef.id);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group!");
    }
  };

  // === CREATE NEW DM LOGIC 🔥 ===
  const createNewDM = async () => {
    if (!user) return;
    const personName = window.prompt("Enter the name of the person you want to chat with:");
    if (!personName || personName.trim() === "") return;

    try {
      const newChatRef = await addDoc(collection(db, "chats"), {
        name: personName.trim(), // The person you are chatting with
        type: "dm",
        members: [user.uid], // Simplification for test: only you as member first to see it
        createdAt: serverTimestamp()
      });
      setActiveCommunityChat(newChatRef.id);
    } catch (error) {
      console.error("Error creating DM:", error);
      alert("Failed to create chat!");
    }
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
      if (!stopTypingRef.current) speakText(data.reply); 
    } catch (err: any) {
      setLoading(false);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: "Aw, Snap!", timestamp: Date.now() }]);
    } finally {
      setLoadingType(null);
    }
  };

  const getCurrentUser = () => {
    return user?.displayName || "Anonymous";
  };

  // === COMMUNITY SEND MESSAGE LOGIC 🔥 ===
  const sendCommunityMessage = async () => {
    if (!communityInput.trim() || !user || !activeCommunityChat) return;
    const textToSend = communityInput;
    setCommunityInput(""); 
    const currentReply = replyingTo;
    setReplyingTo(null);

    try {
      const username = getCurrentUser();
      await addDoc(collection(db, "chats", activeCommunityChat, "messages"), {
        text: textToSend,
        senderName: username,
        avatar: user.photoURL || username.charAt(0).toUpperCase(),
        timestamp: serverTimestamp(),
        isDeleted: false,
        replyTo: currentReply
      });

      const statsRef = doc(db, "metadata", "chatStats");
      try {
        await updateDoc(statsRef, { totalMessages: increment(1) });
      } catch (err) {
        await setDoc(statsRef, { totalMessages: 1 });
      }
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Error sending message to community.");
    }
  };

  const deleteCommunityMessage = async (msgId: string) => {
    if(!activeCommunityChat) return;
    try {
      const msgRef = doc(db, "chats", activeCommunityChat, "messages", msgId);
      await deleteDoc(msgRef);
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  const clearMyMessages = async () => {
    if (!activeCommunityChat || !user) return;
    if (!window.confirm("Are you sure you want to clear all your messages in this chat?")) return;
    try {
      const username = getCurrentUser();
      const q = query(collection(db, "chats", activeCommunityChat, "messages"), where("senderName", "==", username));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (d) => {
        const msgRef = doc(db, "chats", activeCommunityChat, "messages", d.id);
        await deleteDoc(msgRef);
      });
    } catch (error) {
      console.error("Failed to clear messages", error);
    }
  };

  const theme = {
    bgMain: isDarkMode ? "bg-[#131314]" : "bg-white",
    bgSidebar: isDarkMode ? "bg-[#1e1f20]" : "bg-[#f8f9fa]",
    bgChatArea: isDarkMode ? "bg-[#131314]" : "bg-[#ffffff]",
    botBubble: isDarkMode ? "bg-transparent text-gray-200" : "bg-transparent text-gray-800",
    userBubble: isDarkMode ? "bg-[#1e1f20] text-gray-100" : "bg-[#f0f4f9] text-black", 
    inputBox: isDarkMode ? "bg-[#1e1f20] border border-[#333538] text-white" : "bg-gray-100 border border-transparent text-black",
  };

  if (!isClient) return null; 

  return (
    <>
      <div className={`fixed inset-0 z-[100] flex w-full h-[100dvh] font-sans ${theme.bgMain}`}>
        
        {/* 👈 LEFT SIDEBAR */}
        <div className={`w-72 flex flex-col hidden md:flex h-full ${theme.bgSidebar} border-r ${isDarkMode ? 'border-[#333538]' : 'border-gray-200'}`}>
          
          <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
            <div className="flex justify-between items-center px-1 mb-2">
              <h2 className={`text-[16px] font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-black'}`}>Arcade Nexus</h2>
              
              <div className="flex gap-1.5">
                <button 
                  onClick={toggleSpeaker} 
                  className={`p-1.5 rounded-md transition flex items-center justify-center ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#333538]' : 'text-gray-600 hover:text-black hover:bg-gray-200'}`} 
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
                  className={`p-1.5 rounded-md transition flex items-center justify-center ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#333538]' : 'text-gray-600 hover:text-black hover:bg-gray-200'}`} 
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
                  className={`p-1.5 rounded-md transition flex items-center justify-center ${isDarkMode ? 'bg-[#333538] text-white hover:bg-[#404347]' : 'bg-black text-white hover:bg-gray-800'}`} 
                  title="New Chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>

            <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-[#131314] border border-[#333538]' : 'bg-gray-200 border border-transparent'}`}>
              <button 
                onClick={() => setActiveTab("ai")}
                className={`flex-1 py-1.5 rounded-md text-[13px] font-semibold transition-all ${activeTab === "ai" ? (isDarkMode ? 'bg-[#333538] text-white shadow-sm' : 'bg-white text-black shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
              >
                AI Chat
              </button>
              <button 
                onClick={() => setActiveTab("community")}
                className={`flex-1 py-1.5 rounded-md text-[13px] font-semibold transition-all ${activeTab === "community" ? (isDarkMode ? 'bg-[#333538] text-white shadow-sm' : 'bg-white text-black shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
              >
                Community
              </button>
            </div>
            
            <div className="flex flex-col gap-0.5 mt-2">
              <a href="/" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full rounded-md ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}>Home</a>
              <a href="/calculator" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full rounded-md ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}>Calculator</a>
              <a href="/dashboard" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full rounded-md ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}>Dashboard</a>
              <a href="/leaderboard" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full rounded-md ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}>Leaderboard</a>
              <a href="/resources" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full rounded-md ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}>Skill Badges</a>
              <a href="/facilitator" className={`text-[14px] font-medium px-2 py-1.5 transition-colors w-full rounded-md ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}>Facilitator</a>
            </div>
          </div>

          <div className={`p-4 overflow-y-auto hide-scrollbar border-t flex-1 flex flex-col ${isDarkMode ? 'border-[#333538]' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === "ai" ? "Recent Searches" : "Active Chats"}
              </h3>
              <div className="flex gap-3">
                {messages.length > 0 && activeTab === "ai" && (
                  <button onClick={clearChatHistory} className="text-xs text-red-400 hover:text-red-500 font-medium transition">Clear Chat</button>
                )}
                {activeTab === "ai" && (
                  <button onClick={clearRecents} className="text-xs text-red-400 hover:text-red-500 font-medium transition">Clear History</button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              {activeTab === "ai" ? (
                recentChats.map((chat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setInput(chat)}
                    className={`text-[13px] px-2 py-2 rounded-md truncate cursor-pointer transition-colors ${isDarkMode ? 'text-white hover:bg-[#282a2c]' : 'text-black hover:bg-gray-200'}`}
                  >
                    {chat}
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-2 flex-1">
                  
                  {/* 🔥 NEW CHAT & CREATE GROUP BUTTONS 🔥 */}
                  {user && (
                    <div className="flex gap-2 px-1 pb-2">
                      <button onClick={createNewDM} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-bold transition-colors shadow-sm ${isDarkMode ? 'bg-[#282a2c] text-white hover:bg-[#333538]' : 'bg-gray-200 text-black hover:bg-gray-300'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        New Chat
                      </button>
                      <button onClick={createNewGroup} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-bold transition-colors shadow-sm ${isDarkMode ? 'bg-[#282a2c] text-white hover:bg-[#333538]' : 'bg-gray-200 text-black hover:bg-gray-300'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Create Group
                      </button>
                    </div>
                  )}

                  {/* 🔥 LIST OF REAL CHATS FROM FIREBASE */}
                  {user ? (
                    realCommunityChats.length === 0 ? (
                      <div className="text-center px-2 py-6">
                        <p className={`text-[12px] font-medium italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No active chats yet. Start a new one!</p>
                      </div>
                    ) : (
                      realCommunityChats.map((chat) => (
                        <div 
                          key={chat.id} 
                          onClick={() => setActiveCommunityChat(chat.id)} 
                          className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors ${
                            activeCommunityChat === chat.id 
                              ? (isDarkMode ? 'bg-[#282a2c] text-white' : 'bg-gray-200 text-black')
                              : (isDarkMode ? 'text-gray-300 hover:bg-[#1e1f20]' : 'text-gray-600 hover:bg-gray-100')
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex shrink-0 items-center justify-center font-bold text-[10px] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            {chat.type === "group" ? "G" : chat.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[13px] font-medium truncate">{chat.name}</span>
                        </div>
                      ))
                    )
                  ) : (
                    <div className="text-center px-2 py-4">
                      <p className={`text-[12px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sign in to see your chats.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* PROFILE COMPONENT */}
          {user && (
            <div className={`p-4 border-t flex items-center justify-between transition-colors ${isDarkMode ? 'border-[#333538] bg-[#1e1f20]' : 'border-gray-200 bg-[#f8f9fa]'}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border border-gray-500/30" />
                <div className="flex flex-col truncate">
                  <span className={`text-[14px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{user.displayName}</span>
                  <span className={`text-[11px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className={`p-2 rounded-lg transition-colors group ${isDarkMode ? 'hover:bg-[#333538]' : 'hover:bg-gray-200'}`} 
                title="Logout"
              >
                <svg className={`w-5 h-5 transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-500 group-hover:text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          )}
        </div>

        {/* 👉 RIGHT CHAT AREA */}
        <div className={`flex-1 flex flex-col h-full relative ${theme.bgChatArea}`}>
          
          <div className="md:hidden absolute top-4 left-4 z-50">
            <button onClick={() => window.history.back()} className={`p-2 rounded-lg bg-black/10 backdrop-blur-md ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {activeTab === "ai" ? (
            <>
              {/* 💬 AI Messages Area */}
              <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 p-4 pt-16 md:px-8 md:pt-12 overflow-y-auto scroll-smooth hide-scrollbar flex flex-col items-center">
                
                <div className="w-full max-w-3xl flex flex-col gap-8">
                  {messages.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
                        <span className={`text-3xl font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>How can I help you today?</span>
                     </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      
                      {msg.role === "user" ? (
                        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%]">
                          {msg.image && (
                            <img src={msg.image} alt="Uploaded" className="max-w-full max-h-56 object-contain mb-3 rounded-2xl border border-gray-200/20 shadow-sm" />
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
                                        ? 'bg-[#1e1f20] border-[#333538] text-white hover:bg-[#282a2c] hover:border-gray-500 shadow-sm' 
                                        : 'bg-gray-50 border-gray-200 text-black hover:bg-gray-100 hover:border-gray-300 shadow-sm'
                                    }`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                  >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    {props.children}
                                    <svg className="w-3.5 h-3.5 ml-1 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
                                      <span className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Code</span>
                                      <div className="flex gap-2">
                                        <button className={`p-1 rounded transition hover:bg-black/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} title="Copy Code">
                                          <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                      </div>
                                    </div>
                                    <pre className="p-4 overflow-x-auto text-[13px] font-mono text-gray-200">{children}</pre>
                                  </div>
                                ),
                                code: ({ node, className, children, ...props }: any) => {
                                  const isInline = !className && !String(children).includes('\n');
                                  if (isInline) {
                                    return <code {...props} className={`${isDarkMode ? 'bg-[#1e1f20] text-gray-300 border-gray-700' : 'bg-white text-[#1a73e8] border-gray-300'} px-1.5 py-0.5 rounded-md text-[13px] font-mono border`}>{children}</code>;
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
                              <span className={`text-[11px] font-medium tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatTimeAgo(msg.timestamp)}
                              </span>

                              {(!isTyping || idx !== messages.length - 1) && (
                                <button
                                  onClick={() => handleCopyText(msg.text, idx)}
                                  className={`text-[12px] font-medium flex items-center gap-1.5 p-1.5 rounded-full transition-all ${copiedIndex === idx ? 'text-green-500' : `${isDarkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-[#1e1f20]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}`}
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
                            <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-gray-400' : 'border-[#1a73e8]'}`}></div>
                            <span className={`text-[14px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#1a73e8]'}`}>Analyzing image...</span>
                          </div>
                        ) : (
                          <div className="flex gap-1.5 items-center px-2">
                            <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }}></div>
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
                        className="absolute -top-3 -right-3 bg-gray-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg hover:bg-gray-600 hover:scale-110 transition-transform border-2 border-transparent"
                      >✕</button>
                    </div>
                  </div>
                )}

                <div className="max-w-3xl mx-auto flex gap-2 items-center">
                  <div className={`flex-1 flex gap-2 items-center py-2 px-2 sm:px-3 rounded-full transition-all ${theme.inputBox} ${isDarkMode ? 'focus-within:bg-[#282a2c]' : 'focus-within:bg-white focus-within:shadow-md'} shadow-sm`}>
                    <button 
                      onClick={() => imageInputRef.current?.click()} 
                      className={`p-2 rounded-full transition ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#333538]' : 'text-gray-500 hover:text-[#1a73e8] hover:bg-gray-200'}`}
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
                      className="flex-1 bg-transparent border-none text-[15px] font-medium focus:outline-none focus:ring-0 px-1 placeholder-gray-500"
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
                    className={`p-2 rounded-full transition-colors flex shrink-0 items-center justify-center ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#282a2c]' : 'text-gray-500 hover:text-[#1a73e8] hover:bg-gray-200'}`}
                  >
                    {isAtBottom ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            
            /* 🔥 COMMUNITY CHAT UI */
            !user ? (
              <div className={`flex-1 flex flex-col items-center justify-center p-6 ${theme.bgChatArea}`}>
                <div className="flex flex-col items-center text-center gap-6 max-w-md">
                  <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Join the Nexus
                  </h2>
                  <p className={`text-[15px] leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Connect with the Arcade community. Share code, get instant help, and chat in real-time.
                  </p>
                  
                  <button 
                    onClick={handleGoogleLogin}
                    className={`flex items-center gap-3 px-8 py-3.5 mt-4 rounded-full font-bold text-[15px] transition-all hover:scale-105 shadow-md ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {activeCommunityChat && (
                <div className="absolute top-0 left-0 right-0 z-10 pt-5 flex justify-center items-start pointer-events-none">
                  <h3 
                    onClick={clearMyMessages}
                    className={`cursor-pointer pointer-events-auto text-[17px] font-extrabold tracking-tight transition-colors drop-shadow-sm ${isDarkMode ? 'text-gray-200 hover:text-red-400' : 'text-gray-800 hover:text-red-500'}`}
                    title="Clear your messages"
                  >
                    {realCommunityChats.find(c => c.id === activeCommunityChat)?.name || "Community Chat"}
                  </h3>
                </div>
              )}

              <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 p-4 pt-20 md:px-6 md:pt-20 overflow-y-auto space-y-6 hide-scrollbar flex flex-col items-center">
                
                <div className="w-full flex flex-col gap-5 pb-4">
                  
                  {activeCommunityChat ? (
                    communityMsgs.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
                          <span className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start the conversation!</span>
                       </div>
                    ) : (
                      communityMsgs.map((msg) => {
                        const isMe = msg.senderName === getCurrentUser();
                        
                        return (
                          <div key={msg.id} className={`flex flex-col w-full group ${isMe ? 'items-end' : 'items-start'}`}>
                            
                            <div className={`flex items-center gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-6 h-6 rounded-full flex shrink-0 items-center justify-center font-bold text-[10px] overflow-hidden ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                {msg.avatar?.startsWith("http") ? (
                                  <img src={msg.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                  msg.avatar || "U"
                                )}
                              </div>
                              <span className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {isMe ? user?.displayName : msg.senderName}
                              </span>
                              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {msg.timestamp ? new Date(msg.timestamp.toMillis()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Just now"}
                              </span>
                            </div>

                            <div className={`flex items-end gap-2 w-full ${isMe ? 'flex-row-reverse' : ''}`}>
                              
                              <div className={`flex flex-col max-w-[85%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                                {msg.replyTo && (
                                  <div className={`mb-1 px-3 py-1.5 rounded-lg text-[12px] border-l-4 ${isDarkMode ? 'bg-[#1e1f20] border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-400 text-gray-700'}`}>
                                    <span className="font-bold block mb-0.5">{msg.replyTo.senderName}</span>
                                    <span className="truncate block opacity-80">{msg.replyTo.text}</span>
                                  </div>
                                )}
                                
                                <div className={`px-4 py-2 text-[14px] leading-relaxed shadow-sm backdrop-blur-md ${isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'} ${isDarkMode ? (isMe ? 'bg-gradient-to-br from-[#2a2d30] to-[#1e1f20] border border-[#3a3c3e] text-white' : 'bg-gradient-to-br from-[#1e1f20] to-[#151617] border border-[#2a2c2e] text-gray-100') : (isMe ? 'bg-gradient-to-br from-[#e8f0fe] to-[#d2e3fc] border border-[#c3d9fb] text-black' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-black')} ${msg.isDeleted ? 'italic opacity-60' : ''}`}>
                                  {msg.text}
                                </div>
                              </div>

                              {!msg.isDeleted && (
                                <div className={`flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1`}>
                                  <button 
                                    onClick={() => setReplyingTo({ id: msg.id, senderName: msg.senderName, text: msg.text })}
                                    className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-[#333538] text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                                    title="Reply"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                  </button>
                                  {isMe && (
                                    <button 
                                      onClick={() => deleteCommunityMessage(msg.id)}
                                      className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-[#333538] text-red-400' : 'hover:bg-gray-200 text-red-500'}`}
                                      title="Delete for Everyone"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                          </div>
                        );
                      })
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
                      <span className={`text-xl font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select a chat or start a new one!</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Community Input Area */}
              <div className="p-3 sm:p-4 pb-6 relative">
                {replyingTo && (
                  <div className={`absolute bottom-full left-4 right-4 mb-2 p-2.5 rounded-lg border shadow-lg flex justify-between items-center ${isDarkMode ? 'bg-[#1e1f20] border-[#333538]' : 'bg-white border-gray-200'}`}>
                    <div className="flex flex-col overflow-hidden">
                      <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Replying to {replyingTo.senderName}</span>
                      <span className={`text-[13px] truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{replyingTo.text}</span>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#333538] text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                )}
                
                <div className="max-w-3xl mx-auto flex gap-2 items-center">
                  <div className={`flex-1 flex items-center gap-2 py-2 px-3 rounded-full border shadow-sm ${isDarkMode ? 'bg-[#1e1f20] border-[#333538]' : 'bg-gray-100 border-transparent'}`}>
                    <button className={`p-1.5 rounded-full transition ${isDarkMode ? 'text-white hover:bg-[#333538]' : 'text-black hover:bg-gray-200'}`} title="Attach File">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <input 
                      type="text" 
                      value={communityInput}
                      onChange={(e) => setCommunityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && communityInput.trim() && sendCommunityMessage()}
                      placeholder="Message the community..." 
                      className={`flex-1 bg-transparent border-none text-[15px] font-medium focus:outline-none focus:ring-0 px-2 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-black placeholder-gray-500'}`}
                      disabled={!activeCommunityChat}
                    />
                    <button className={`p-1.5 rounded-full transition ${isDarkMode ? 'text-white hover:bg-[#333538]' : 'text-black hover:bg-gray-200'}`} title="Voice Note">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                  </div>
                  <button 
                    onClick={sendCommunityMessage}
                    disabled={!communityInput.trim() || !activeCommunityChat}
                    className={`p-2.5 rounded-full transition flex items-center justify-center disabled:opacity-50 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    <svg className="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
            )
          )}

        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}