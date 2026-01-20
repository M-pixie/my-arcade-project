export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";



// ✅ FINAL SOLUTION: Key ko direct yahan daal diya.
// Ab Vercel ki settings ka koi jhanjhat nahi.
const API_KEY = "AIzaSyA7aOITJkIgswleGaUVhyLzlV3vrFip8zc"; 

export async function POST(req: NextRequest) {
  try {
    // Ye check hata diya kyunki key upar likhi hai, to missing ho hi nahi sakti
    // if (!API_KEY) ... 

    const body = await req.json();
    const { message } = body;

    // ✅ MODEL: Ye wahi model hai jo pichli baar "Hi there" bola tha.
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