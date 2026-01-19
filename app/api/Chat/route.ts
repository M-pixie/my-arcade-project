import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Yahan apni API Key daal dena ya .env file use karna
const API_KEY = "AIzaSyAXx7CHEvpO05nF1oiLqJvhgH5B9glT-f8"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 🤖 Bot ki Training (System Prompt)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are the Arcade Nexus Assistant. Your job is to help users with Google Cloud Arcade queries only. Keep answers short, friendly, and use emojis. Rules: 1. Trivia/Standard Games = 1 Point. 2. Skill Badges = 1 Point (Need 2 badges). 3. Special Games = 2 Points. 4. If someone asks about non-arcade topics, politely refuse." }],
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

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ reply: "Sorry bhaii, abhi server busy hai. Thodi der baad try karna! 😅" });
  }
}