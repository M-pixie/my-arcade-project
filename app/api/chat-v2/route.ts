export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    const systemInstruction = `
    You are the "Arcade Nexus Assistant", a friendly expert on Google Cloud Arcade.
    STRICT RULES:
    1. Topic: ONLY Google Cloud Arcade related topics.
    2. Length: VERY SHORT (max 2-3 sentences).
    3. Language: Match user (Hinglish/English).
    4. Tone: Expressive, friendly, use emojis (😎, 🔥).
    `;

    const finalPrompt = `${systemInstruction}\n\nUser Question: ${message}`;

    // ✅ FIXED MODELS: Pehle aapka wala 'latest', phir backup '8b'
    const models = ["gemini-flash-latest", "gemini-1.5-flash-8b"];
    let lastError = "";

    for (const modelName of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        return NextResponse.json({ reply: botReply });
      }

      if (response.status === 429) {
        lastError = "limit";
        continue; // Agle model par switch karega
      }

      // Agar model 'Not Found' hai to agle par jao
      if (response.status === 404) {
        continue;
      }

      return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    if (lastError === "limit") {
      return NextResponse.json({ 
        reply: "⚠️ Rate Limit Reached: Google's AI is currently handling too many requests. Please try again after a short break." 
      }, { status: 200 });
    }

    return NextResponse.json({ reply: "Service temporarily unavailable. Please try again later." }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}