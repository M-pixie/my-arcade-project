"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello Player! 👋 Main Arcade Assistant hoon. Points ya Rules ke baare mein kuch bhi poocho!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Network error, try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* 🟢 Chat Window */}
      {isOpen && (
        <div className="bg-white width-80 md:w-96 h-[450px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-[#1a73e8] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-bold">Arcade Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 text-sm rounded-2xl ${
                  msg.role === "user" 
                    ? "bg-[#1a73e8] text-white rounded-tr-none" 
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 ml-2 animate-pulse">Assistant is typing...</div>}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about points..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={sendMessage} 
              disabled={loading}
              className="p-2 bg-[#1a73e8] text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* 🔵 Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#1a73e8] text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
}