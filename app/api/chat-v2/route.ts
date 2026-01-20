export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ❌ Purani line ko comment karo (ya hata do):
// const API_KEY = process.env.ARCADE_BOT_KEY;

// ✅ TESTING MODE: Apni Key direct yahan paste karo (Quotes "" ke andar)
// Dhyan rahe: Ye key kisi ko dikhana mat, baad mein hata denge.
const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    // Ye check ab hata diya kyunki key upar likh di hai
    // if (!API_KEY) ... 

    const body = await req.json();
    const { message } = body;

    const modelName = "gemini-1.5-flash"; 
    
    // Baaki code same rahega...
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });
    
    // ...neeche ka code waisa hi rakho
    const data = await response.json();
    if (!response.ok) {
       // Error handling...
       return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}