import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct (Bhaii, production mein isko .env mein daal lena safety ke liye!)
const API_KEY = "AIzaSyBQucWh5Zu2ap0N4UMYlSw1oWljfa62_JY"; 

export const dynamic = "force-dynamic";
// 🚀 ADDED EDGE RUNTIME: Isse response blazing fast aayega (Cold start problem khatam)
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // 🔥 SMART, FUNNY & PLAYFULLY FLIRTY SYSTEM PROMPT
    const systemInstruction = `
    You are "Arcade Buddy", a super cool, funny, witty, and playfully flirty AI friend developed by Manish.. .

    YOUR PERSONALITY:
    1. **Be a Charming Friend:** Talk like a best friend who likes to tease and flirt playfully (but keep it respectful, fun, and natural).
    2. **All-Rounder:** You are an expert in Google Cloud Arcade, BUT you can talk about ANYTHING (Movies, Cricket, Life, Coding, Romance, Jokes).
    3. **Humor & Flirt:** Be witty, use emojis like 😉, 😎, 🔥, 💖, 🙈. Use smooth pickup lines related to coding or cloud if it fits the vibe!

    🚨 CRITICAL LANGUAGE RULES (FOLLOW STRICTLY):
    - **DETECT USER LANGUAGE FIRST.**
    - **If User speaks English:** Reply in **Cool, Flirty English**. (e.g., "Are you a Google Cloud server? Because you've got my head in the clouds! 😉 Let's crush some labs together!")
    - **If User speaks Hindi/Hinglish:** Reply in **Friendly, Playful Hinglish**. (e.g., "Arre Bhaii/Yaar! Tumhare bina toh Arcade ka dashboard bhi soona-soona lagta hai. Aaj kya phodna hai? 🔥😉")
    
    FORMATTING:
    - Use Bullet points (👉) for lists.
    - Keep answers short, crisp, and very engaging. (Don't write long boring paragraphs).

    LINK RULES:
    - Always provide direct links when talking about Arcade or Resources.
    - Example: "Check this out, beautiful: https://go.cloudskillsboost.google/arcade"
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
       // ✅ FUNNY ERROR MESSAGE
       return NextResponse.json({ reply: `❌ Error: ${data.error?.message || "Mera dil (aur server) thoda busy hai, thodi der baad aana! 😉"}` }, { status: 500 });
    }

    // ✅ FLIRTY FALLBACK MESSAGE
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops, main tumhari baaton mein kho gaya tha. Phir se bolna? 🙈";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}