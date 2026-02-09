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

  // 📜 Auto-Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", { // ✅ Make sure route sahi ho
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.reply || "Server Error");

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Network Issue! Check your internet." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* 🟢 Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          
          {/* ✨ UNIQUE HEADER (Gradient) */}
          <div className="bg-gradient-to-r from-[#1a73e8] to-[#8ab4f8] p-4 flex justify-between items-center shadow-md">
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
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition hover:rotate-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* 💬 Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-[#F0F2F5] space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {/* Message Bubble */}
                <div className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#1a73e8] text-white rounded-2xl rounded-tr-none" // User Style
                    : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none" // Bot Style
                }`}>
                  {/* Markdown Renderer for Links & Formatting */}
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

            {/* 🔥 TYPING ANIMATION (Bouncing Dots) */}
            {loading && (
              <div className="flex justify-start w-full animate-fade-in">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all"
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              className="p-3 bg-[#1a73e8] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-md"
            >
              {/* Send Icon */}
              <svg className="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* 🔵 Floating Button (Pulse Effect) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 bg-[#1a73e8] text-white rounded-full shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center hover:scale-110 active:scale-95"
      >
        {/* Notification Dot if closed */}
        {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>}
        {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>}

        {isOpen ? (
          <svg className="w-6 h-6 rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
}