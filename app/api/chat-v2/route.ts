export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct (Jaisa aapne rakha tha)
const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // ✅ MAGIC FIX: Ye "System Prompt" AI ko bataata hai ki kaise behave karna hai
    const systemInstruction = `
    You are the "Arcade Nexus Assistant", a friendly expert on Google Cloud Arcade.
    
    STRICT RULES FOR YOU:
    1. **Topic:** ONLY answer questions related to Google Cloud Arcade, Points, Swags, Facilitator Program, and Cloud Skills Boost. If the user asks unrelated topics (like weather, movies), politely refuse in a fun way.
    2. **Length:** Keep answers VERY SHORT and concise (max 2-3 sentences). Don't write essays.
    3. **Language Matching:** - If the user uses Hindi/Hinglish words (like "kaise", "bhai", "kya"), reply in **Casual Hinglish** (e.g., "Haan bhaii, points update hone me time lagta hai 🚀").
       - If the user speaks formal English, reply in **Cool English**.
    4. **Tone:** Be expressive, friendly, and use emojis (😎, 🔥, 👇). Sound like a real person, not a robot.
    `;

    // Hum user ke message ke saath ye instructions jod denge
    const finalPrompt = `${systemInstruction}\n\nUser Question: ${message}`;

    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
       if (response.status === 429) {
          return NextResponse.json({ reply: "⚠️ Limit Hit: Google thoda busy hai, 1 minute baad try karna." }, { status: 200 });
       }
       return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}