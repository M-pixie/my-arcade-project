import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 👇 YAHAN APNI KEY DAALO (Quotes ke andar)
const API_KEY = "YAIzaSyAXx7CHEvpO05nF1oiLqJvhgH5B9glT-f8"; 

export async function POST(req: NextRequest) {
  try {
    // 1. Check agar Key nahi daali
    if (!API_KEY || API_KEY.startsWith("YAHAN")) {
      console.error("❌ Error: API Key missing hai!");
      return NextResponse.json({ reply: "Bhaii API Key daalna bhool gaye code mein! 😅" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { message } = await req.json();

    console.log("📩 User message:", message); // Terminal me dikhega

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Arcade Assistant. Keep answers short and friendly." }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I am ready to help. 🚀" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Reply sent:", text); // Terminal me dikhega
    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("❌ Chat Error:", error); // Asli error yahan print hoga
    return NextResponse.json({ reply: "Server Error: Terminal check karo bhaii!" });
  }
}