import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 👇 Yahan apni API Key wapis paste kar dena
const API_KEY = "AIzaSyAXx7CHEvpOO5nF1oiLqJvhgH5B9glT-f8"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // ✅ FIX: Model ko 'gemini-1.5-flash' kar diya (Ye fast aur free hai)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are the Arcade Nexus Assistant. Your job is to help users with Google Cloud Arcade queries only. Keep answers short, friendly, and use emojis." }],
        },
        {
          role: "model",
          parts: [{ text: "Got it! I am the Arcade Nexus Assistant. I will help users calculate points and understand Arcade rules. 🚀" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    // 👇 Ye error ab Terminal me dikhega
    console.error("❌ BACKEND ERROR:", error.message || error);
    
    return NextResponse.json({ 
      reply: "Sorry, abhi server connect nahi ho pa raha. Terminal check karo!" 
    }, { status: 500 });
  }
}