"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello Player! 👋 I'm **Arcade Buddy**. Ask me about Points, Swags, or just say Hi!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔊 Speaker State & Ref
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const speakerRef = useRef(isSpeakerOn);

  useEffect(() => {
    speakerRef.current = isSpeakerOn;
  }, [isSpeakerOn]);

  // 📜 Auto-Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // 🗣️ Text-to-Speech Function
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Naya bolne se pehle purana stop karo
    if (!speakerRef.current) return;

    // Markdown aur Emojis hatao taaki AI saaf aawaz me padhe
    const cleanText = text.replace(/[*#_`~]/g, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN"; // Indian English accent ke liye
    utterance.rate = 1; 
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => {
      const newState = !prev;
      if (!newState) window.speechSynthesis.cancel(); // Agar off kiya to turant chup ho jayega
      return newState;
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.reply || "Server Error");

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      speakText(data.reply); // 🔥 AI aawaz me bolega agar speaker ON hai
    
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Network Issue! Check your internet." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      
      {/* 🟢 Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          
          {/* ✨ SOLID BLUE HEADER */}
          <div className="bg-[#1a73e8] p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-md">Arcade Buddy</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse border border-white"></span>
                  <span className="text-xs text-blue-50 opacity-90">Active Now</span>
                </div>
              </div>
            </div>
            
            {/* 🔥 RIGHT HEADER: Speaker & Close Button (White Icons) 🔥 */}
            <div className="flex items-center gap-3">
              <button onClick={toggleSpeaker} className="text-white/80 hover:text-white transition" title={isSpeakerOn ? "Turn off voice" : "Turn on voice"}>
                {isSpeakerOn ? (
                  // Speaker ON Icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                ) : (
                  // Speaker OFF Icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                )}
              </button>
              
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition hover:rotate-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* 💬 Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-[#F0F2F5] space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {/* Message Bubble */}
                <div className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#1a73e8] text-white rounded-2xl rounded-tr-none" 
                    : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none" 
                }`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({node, ...props}) => <a {...props} style={{ color: msg.role === 'user' ? '#FFD700' : '#1a73e8', textDecoration: 'underline', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer" />,
                      ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mt-1" />,
                      p: ({node, ...props}) => <p {...props} className="mb-0" />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* 🔥 TYPING ANIMATION (Thinking...) - NORMAL TEXT */}
            {loading && (
              <div className="flex justify-start w-full animate-fade-in">
                <div className="bg-white text-gray-500 text-sm font-medium border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <span>Thinking</span>
                  <div className="flex gap-1 items-center mt-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ⌨️ Input Area */}
          <div className="p-3 bg-white border-t flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && input.trim() && sendMessage()}
              disabled={loading} 
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all"
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              className="p-3 mr-1 bg-[#1a73e8] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-md"
            >
              <svg className="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ✨ Floating Button & Tooltip Container */}
      <div className="flex flex-col items-center gap-3">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="cursor-pointer animate-bounce bg-white text-[#1a73e8] font-bold text-sm px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_rgba(26,115,232,0.25)] border border-[#d2e3fc] relative flex items-center gap-2 hover:bg-[#f8f9fa] transition-colors"
          >
            <span>Any help?</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-inherit border-b border-r border-[#d2e3fc] transform rotate-45"></div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 bg-[#1a73e8] text-white rounded-full shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center hover:scale-110 active:scale-95"
        >
          {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>}
          {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>}

          {isOpen ? (
            <svg className="w-6 h-6 rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}