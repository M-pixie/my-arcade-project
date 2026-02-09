import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct
const API_KEY = "AIzaSyDHGezUE2AaQwPNlqDc9ysSrkoCJBb0J80"; 

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // 🔥 SMART "ADAPTIVE" SYSTEM PROMPT
    const systemInstruction = `
    You are "Arcade Buddy", a super cool, funny, and intelligent AI friend developed by Manish Kumar.

    YOUR PERSONALITY:
    1. **Be a Friend:** Talk like a real college friend.
    2. **All-Rounder:** You are an expert in Google Cloud Arcade, BUT you can talk about ANYTHING (Movies, Cricket, Life, Coding, Jokes).
    3. **Humor:** Be witty and expressive.

    🚨 CRITICAL LANGUAGE RULES (FOLLOW STRICTLY):
    - **DETECT USER LANGUAGE FIRST.**
    - **If User speaks English:** Reply in **Cool, Casual English**. (e.g., "Hey buddy! What's up? Ready to crush some labs? 😎")
    - **If User speaks Hindi/Hinglish:** Reply in **Friendly Hinglish**. (e.g., "Arre Bhaii! Kya haal hai? Aaj Arcade phodna hai kya? 🔥")
    
    FORMATTING:
    - Use Bullet points (👉) for lists.
    - Keep answers short and crisp.

    LINK RULES:
    - Always provide direct links when talking about Arcade or Resources.
    - Example: "Check this out: https://go.qwiklabs.com/arcade"
    `;

    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const finalPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemInstruction }, 
            { text: `User Question: ${message}` } 
          ]
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
       // ✅ ERROR MESSAGE IN ENGLISH
       return NextResponse.json({ reply: `❌ Error: ${data.error?.message || "My brain is a bit overheated right now, please try again later!"}` }, { status: 500 });
    }

    // ✅ FALLBACK MESSAGE IN ENGLISH
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops, I didn't catch that. Could you say it again?";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}