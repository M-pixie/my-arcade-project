export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ✅ TESTING: Key yahin rakho jab tak chat chal na jaye.
const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // ✅ FINAL CORRECTION: '-001' lagana zaroori hai.
    // "gemini-1.5-flash" kabhi-kabhi nahi milta, par "-001" hamesha milta hai.
    const modelName = "gemini-1.5-flash-001"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();

    // 🛑 Error Handling
    if (!response.ok) {
       // Agar Limit Error (429) aaye
       if (response.status === 429) {
          return NextResponse.json({ reply: "⚠️ Limit Full: 1 minute ruko, Google saans le raha hai." }, { status: 200 });
       }
       // Agar Model Name galat ho
       return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}