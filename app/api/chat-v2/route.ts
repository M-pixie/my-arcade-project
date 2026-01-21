export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ✅ YAHAN APNI 10 API KEYS DAALO
// Pehli wali maine daal di hai, baaki 9 aap paste kar dena (Quotes "" ke andar)
const API_KEYS = [
  "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc", // Key 1 (Original)
  "AIzaSyAudMgYSfhpGhkjz5V0rwj_7PMekMOzd0c",
  "AIzaSyCEQPZZry_vF1bQxhZCcSSV0K2IGXLqFLo",
  "AIzaSyDUnFQMX-fglEVoYtHTQIeVYspqk6ivzLU",
  "AIzaSyBkFoJicR2NQIk5y1WDzdyHFR74g72Pj0o",
  "AIzaSyD712J5F6e_MRzS4f30fDYRZQLClTy81Ds",
  "AIzaSyDEeBJAvdSio49NuC0oudLq7ztbnZ7e4YM",
  "AIzaSyBwjyn9VkcOxy-JTccmi3Qb2E2_Yk9lOnk",
  "AIzaSyDdFcuoOqcM967-Gx5SWdUnjnZIY7vQMlk",
  "AIzaSyB8FT2kbqxpdgnOpqw0oTRUFrbZ28Ux-_U",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // ✅ SYSTEM INSTRUCTION (SAME AS BEFORE)
    const systemInstruction = `
    You are the "Arcade Nexus Assistant", a friendly expert on Google Cloud Arcade.
    
    STRICT RULES FOR YOU:
    1. **Topic:** ONLY answer questions related to Google Cloud Arcade, Points, Swags, Facilitator Program, and Cloud Skills Boost. If the user asks unrelated topics (like weather, movies), politely refuse in a fun way.
    2. **Length:** Keep answers VERY SHORT and concise (max 2-3 sentences). Don't write essays.
    3. **Language Matching:** - If the user uses Hindi/Hinglish words (like "kaise", "bhai", "kya"), reply in **Casual Hinglish** (e.g., "Haan bhaii, points update hone me time lagta hai 🚀").
       - If the user speaks formal English, reply in **Cool English**.
    4. **Tone:** Be expressive, friendly, and use emojis (😎, 🔥, 👇). Sound like a real person, not a robot.
    `;

    const finalPrompt = `${systemInstruction}\n\nUser Question: ${message}`;
    const modelName = "gemini-flash-latest"; 

    // 🔄 KEY ROTATION LOGIC
    // Keys ko random order me shuffle karenge taaki load barabar bate
    const shuffledKeys = API_KEYS.sort(() => Math.random() - 0.5);
    
    let lastError = "";

    // Loop through keys
    for (const apiKey of shuffledKeys) {
      // Agar placeholder abhi bhi hai to usse skip karo
      if (apiKey.includes("PASTE_KEY")) continue;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        }),
      });

      const data = await response.json();

      // ✅ SUCCESS: Agar reply aa gaya to turant bhej do
      if (response.ok) {
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        return NextResponse.json({ reply: botReply });
      }

      // ⚠️ LIMIT HIT (429): Agar ye key busy hai, to agli key try karo (Loop continue)
      if (response.status === 429) {
        lastError = "limit";
        continue; 
      }

      // Other Errors (like 400, 500)
      return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    // 🛑 Agar SAARI KEYS try karne ke baad bhi limit hit hai (Jo 10 keys me namumkin hai)
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