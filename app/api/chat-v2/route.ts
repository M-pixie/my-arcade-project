export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// ✅ TESTING: Key yahin hai
const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // ✅ SOLUTION: Aapki list me se ye model select kiya hai.
    // 'gemini-pro' aur '1.5' aapke account par nahi hain.
    // '2.0-flash-exp' naya hai aur chalna chahiye.
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

    // 🛑 Error Handling
    if (!response.ok) {
       // Limit Error (429)
       if (response.status === 429) {
          return NextResponse.json({ reply: "⚠️ Limit Full: Bhaii thoda ruko (30 sec), Google rest le raha hai." }, { status: 200 });
       }
       // Model Not Found Error
       if (response.status === 404) {
          return NextResponse.json({ reply: `❌ Error: Ye model bhi nahi mila! List check karni padegi.` }, { status: 500 });
       }
       
       return NextResponse.json({ reply: `❌ Google Error: ${data.error?.message}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}