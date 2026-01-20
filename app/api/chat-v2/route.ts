export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ✅ SAFE MODE: Ab hum key wapas Vercel settings se uthayenge
const API_KEY = process.env.ARCADE_BOT_KEY; 

export async function POST(req: NextRequest) {
  try {
    // Check agar key nahi mili (Safety)
    if (!API_KEY) {
      return NextResponse.json({ reply: "❌ API Key Missing in Vercel Settings!" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body;

    // ✅ WINNING MODEL: Ye wala model chal gaya hai, isliye ise hi rakhenge.
    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();

    // 🛑 Error Handling (Agar phir se limit aaye to user ko bata dega)
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