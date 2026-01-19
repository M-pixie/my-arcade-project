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

  // Auto scroll
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
      console.log("🚀 Sending request to /api/chat...");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      console.log("📩 Server Status:", res.status, res.statusText);

      // Agar server ne error diya (404, 500 etc)
      if (!res.ok) {
        const errorText = await res.text(); // Error message padho
        console.error("❌ SERVER ERROR DETAILS:", errorText);
        throw new Error(`Server Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err: any) {
      console.error("❌ FRONTEND CATCH ERROR:", err);
      // User ko generic error dikhao, par console me asli error dekho
      setMessages((prev) => [...prev, { role: "bot", text: "Error: Check Console (F12)" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* 🟢 Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
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
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 🔵 Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#1a73e8] text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center text-2xl"
      >
        💬
      </button>
    </div>
  );
}