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
    1. Topic: ONLY Google Cloud Arcade, Points, Swags, Facilitator Program, and Cloud Skills Boost.
    2. Length: VERY SHORT (max 2-3 sentences).
    3. Language: Match user (Hinglish for Hinglish, English for English).
    4. Tone: Expressive, friendly, use emojis (😎, 🔥, 🚀).
    `;

    const finalPrompt = `${systemInstruction}\n\nUser Question: ${message}`;

    // ✅ List of models for rotation
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp"];
    let lastError = "";

    // ✅ Loop to try different models if one hits a limit
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

      // Agar limit hit hui (429), to loop agle model par jayega
      if (response.status === 429) {
        lastError = "limit";
        continue; 
      }

      return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    // ✅ Agar saare models ki limit khatam ho jaye, tab ye message dikhega
    if (lastError === "limit") {
      return NextResponse.json({ 
        reply: "⚠️ Rate Limit Reached: Google's AI is currently handling too many requests. Please try again after a short break." 
      }, { status: 200 });
    }

    return NextResponse.json({ reply: "Something went wrong" }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}