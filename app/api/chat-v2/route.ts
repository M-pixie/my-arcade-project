export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ✅ TESTING: Key yahin hai (Baad mein hata lenge)
const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // ✅ SOLUTION: "gemini-pro"
    // Ye Gemini ka Version 1.0 hai. Ye sabse purana aur stable hai.
    // Ye kabhi "Not Found" ka error nahi dega.
    const modelName = "gemini-pro"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();

    // Error Handling
    if (!response.ok) {
       // Limit Error
       if (response.status === 429) {
          return NextResponse.json({ reply: "⚠️ Limit Full: 1 minute wait karo." }, { status: 200 });
       }
       // Koi aur Google Error
       return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}