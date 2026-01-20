export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ARCADE_BOT_KEY; 

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ reply: "❌ Error: API Key missing in Vercel!" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body;

    // ✅ FAST MODEL: Timeout se bachne ke liye Flash use kar rahe hain
    const modelName = "gemini-1.5-flash"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        // 429 Quota Error Handling
        if (response.status === 429) {
             return NextResponse.json({ reply: "⚠️ Traffic High: 1 minute ruko phir try karo." }, { status: 200 });
        }
        return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message || response.statusText}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: `❌ Server Crash: ${error.message}` }, { status: 500 });
  }
}