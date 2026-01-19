import { NextRequest, NextResponse } from "next/server";

// Aapki Sahi API Key
const API_KEY = "AIzaSyD4E0fbodxwwF33xUrjnRJy4OFcI-nGXUs"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // 👇 UPDATED INSTRUCTIONS: Ab ye Language detect karke jawab dega
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

    // ✅ Model Name: gemini-flash-latest (Jo working hai)
    const modelName = "gemini-flash-latest";
    
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