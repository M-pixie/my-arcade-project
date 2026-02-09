import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct
const API_KEY = "AIzaSyDHGezUE2AaQwPNlqDc9ysSrkoCJBb0J80"; 

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // 🔥 NEW INTELLIGENT SYSTEM PROMPT
    const systemInstruction = `
    You are "Arcade Nexus Assistant", an expert guide for the Google Cloud Arcade & Facilitator Program.

    Your Goal: Provide EXACT, HELPFUL, and COMPLETE answers. Do not be vague.

    RULES:
    1. **Be Direct:** If asked about points, deadlines, or swags, give specific details.
    2. **Provide Links:** When helpful, include these OFFICIAL links:
       - Arcade Website: https://go.qwiklabs.com/arcade
       - Swag Drop: https://www.googlecloudswag.com/
       - Facilitator Program: https://rsvp.withgoogle.com/events/arcade-facilitator
    3. **Tone:** Professional yet friendly. Use emojis (🚀, 🔗, ✅) to make it readable.
    4. **Language:** - If user asks in Hindi/Hinglish, reply in clear *Hinglish*.
       - If user asks in English, reply in *English*.
    
    Example Scenarios:
    - User: "Points kab update honge?" -> Reply: "Points usually Friday ko update hote hain, lekin kabhi-kabhi 24-48 hours extra lag sakte hain. Aap apni progress yahan check karein: https://go.qwiklabs.com/arcade 🕒"
    - User: "Swags kya milenge?" -> Reply: "Swags tier-based hote hain (Standard, Advanced, Premium). Isme T-shirts, Bags, aur Bottles ho sakti hain. Full list yahan dekhein: https://www.googlecloudswag.com/ 🎁"
    `;

    // 🧠 Model Upgrade: 'gemini-1.5-flash' use karenge jo better aur faster hai
    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const finalPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemInstruction }, // Pehle instruction bhejo
            { text: `User Question: ${message}` } // Phir user ka sawal
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
    });

    const data = await response.json();

    if (!response.ok) {
       // Google Error Handling
       return NextResponse.json({ reply: `❌ Error: ${data.error?.message || "AI Service Unavailable"}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't fetch the answer.";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}