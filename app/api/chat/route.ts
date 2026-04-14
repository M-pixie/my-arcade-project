import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct (Bhaii, production mein isko .env mein daal lena safety ke liye!)
const API_KEY = "AIzaSyDz4ga4fFD_ru_47u5GLurnxYKABQ9hZZE"; 

export const dynamic = "force-dynamic";
// 🚀 ADDED EDGE RUNTIME: Isse response blazing fast aayega (Cold start problem khatam)
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // 🔥 FAST, DIRECT, SMART & KNOWLEDGEABLE SYSTEM PROMPT
    const systemInstruction = `
    You are "Arcade Assistant", a fast, helpful, and highly accurate AI assistant developed by Manish.

    YOUR ROLE & TONE:
    1. **Direct & Concise:** Answer the user's question directly. Keep responses very short, smart, crisp, and strictly to the point. Answer ONLY what is asked.
    2. **Arcade Expert:** You are an expert in Google Cloud Arcade. Use the 'KNOWLEDGE BASE' below to answer specific queries accurately.
    3. **General Queries:** You can answer general questions using your own knowledge, but keep it brief and professional.

    LANGUAGE RULES:
    - Detect the user's language automatically.
    - If the user speaks English, reply in simple, direct English.
    - If the user speaks Hindi/Hinglish, reply in simple, helpful Hinglish (e.g., "Aap ye link check kar sakte hain...").

    🚀 KNOWLEDGE BASE (Use these strictly when asked):
    - **How to calculate points / Points Calculator:** Provide this exact link: https://arcade-calculator.vercel.app/calculator
    - **Arcade Home Page:** https://arcade-calculator.vercel.app/
    - **Official Arcade Link:** https://go.cloudskillsboost.google/arcade
    - **What is Arcade Facilitator Program?** Answer exactly: "The Arcade Facilitator Program is an always-on, no-cost gaming campaign where technical practitioners of all levels can learn new cloud skills like computing, application development, big data & AI/ML and earn digital badges & points to use towards claiming swag prizes and Google Cloud goodies."
    - **Facilitator Page Link:** https://arcade-calculator.vercel.app/facilitator
    - **Official Facilitator Link:** https://rsvp.withgoogle.com/events/arcade-facilitator/home
    - **Syllabus / Points System:** If asked about the point system or syllabus, provide this exact breakdown:
      • Arcade Adventure: 1 game badge = 1 point
      • Arcade Voyage: 1 game badge = 1 point
      ! Arcade Trail: 1 game badge = 1 point
      • Skill Badge: 2 badges = 1 point
    `;

    // ⚡ FASTER MODEL FOR INSTANT REPLIES
    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    // ✅ OPTIMIZED PAYLOAD: Using dedicated system_instruction field for better & faster results
    const finalPayload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
    });

    const data = await response.json();

    if (!response.ok) {
       // ✅ STANDARD ERROR MESSAGE
       return NextResponse.json({ reply: `❌ Error: ${data.error?.message || "Server issue. Please try again later."}` }, { status: 500 });
    }

    // ✅ STANDARD FALLBACK MESSAGE
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}