export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ARCADE_BOT_KEY; 

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ reply: "❌ Server Error: API Key missing hai (Vercel Settings check karein)." }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body;

    // ✅ "gemini-pro" (Classic model) use kar rahe hain.
    // Ye naye models ki tarah "Not Found" ya "Limit 0" ke nakhre kam karta hai.
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
        // Agar Quota Error (429) hai
        if (response.status === 429) {
             throw new Error("⚠️ Limit Hit: Google thoda busy hai, 1 minute baad try karein.");
        }
        // Agar Model Not Found ya Key Error hai
        throw new Error(`Google Error (${response.status}): ${data.error?.message || response.statusText}`);
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    // Ye error frontend par jayega
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}