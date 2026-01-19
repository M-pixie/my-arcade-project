import { NextRequest, NextResponse } from "next/server";

// ✅ UPDATE: Ab ye API Key seedha Vercel/System se uthayega (Secure hai)
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // 👇 Safety Check: Agar key set karna bhool gaye to ye bata dega
    if (!API_KEY) {
      throw new Error("API Key missing! Please check Vercel Environment Variables.");
    }

    const body = await req.json();
    const { message } = body;

    // 👇 SAME INSTRUCTIONS (English + Hinglish Logic)
    const systemInstruction = `
      You are the "Arcade Nexus Assistant". 
      You ONLY help users with the "Google Cloud Arcade" program.
      
      RULES:
      - Focus ONLY on Arcade Cloud Skills Boost.
      - 1 Skill Badge = 1 Point (Usually).
      - 1 Game Badge = 1 Point.
      - Trivia = 1 Point.
      - Milestones give bonus points.
      
      BEHAVIOR:
      - **LANGUAGE RULE:** If the user asks in English, answer in **English**. If the user asks in Hindi/Hinglish, answer in **Hinglish**.
      - Keep answers SHORT, COOL, and FRIENDLY.
      - NEVER talk about Google Play Store, Android Apps, or Rupees (₹).
      - If asked about "Calculation", explain: "Total Points = (Skill Badges) + (Game Badges) + (Trivia)."
    `;

    // ✅ Model Name: gemini-flash-latest
    const modelName = "gemini-flash-latest";
    
    // URL me ab API Key automatically 'process.env' se aa jayegi
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction }] // Pehle Rules
          },
          {
            role: "model",
            parts: [{ text: "Got it! I will adapt to the user's language (English or Hinglish) and focus on Google Cloud Arcade. 🚀" }]
          },
          {
            role: "user",
            parts: [{ text: message }] // User ka sawal
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Google API Error");
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from bot.";

    return NextResponse.json({ reply: reply });

  } catch (error: any) {
    console.error("❌ Backend Error:", error);
    return NextResponse.json({ reply: `Error: ${error.message}` }, { status: 500 });
  }
}