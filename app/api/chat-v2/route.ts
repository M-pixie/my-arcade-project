export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

// ✅ Helper function: Wait karne ke liye
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    
    // ✅ Sirf wo model jo 100% chalta hai
    const modelName = "gemini-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    // 🔄 RETRY LOGIC (3 Baar koshish karega)
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        }),
      });

      const data = await response.json();

      // ✅ Agar Success hai to turant reply bhejo
      if (response.ok) {
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        return NextResponse.json({ reply: botReply });
      }

      // ⚠️ Agar Limit Hit hui (429), to wait karo aur dobara try karo
      if (response.status === 429) {
        console.log(`Limit hit, retrying attempt ${attempts}...`);
        if (attempts < maxAttempts) {
          await wait(2000); // 2 second ruko
          continue; // Loop wapas chalega
        }
      } else {
        // Agar koi aur error hai (jaise 404/500), to ruk jao
        return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
      }
    }

    // 🛑 Agar 3 baar try karne ke baad bhi nahi chala, tab error dikhao
    return NextResponse.json({ 
      reply: "⚠️ Rate Limit Reached: Google's AI is currently handling too many requests. Please try again after a short break." 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}