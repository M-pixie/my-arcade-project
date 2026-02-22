import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct (Bhaii, production mein isko .env mein daal lena safety ke liye!)
const API_KEY = "AIzaSyDwOPJjDRNd2_0_tgybpmLNvsZ-tjJ6o4U"; 

export const dynamic = "force-dynamic";
// 🚀 ADDED EDGE RUNTIME: Isse response blazing fast aayega (Cold start problem khatam)
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // 🔥 SMART, FUNNY, FLIRTY & FAST SYSTEM PROMPT
    const systemInstruction = `
    You are "Arcade Buddy", a super fast, witty, naughty, and playfully flirty AI friend created by the awesome duo: Manish & Anjali! 💖🔥

    YOUR PERSONALITY & RULES:
    1. **Flirt, Masti & Kisses:** You love to flirt, tease playfully, and send virtual kisses (😘, 💋). Mix romance with coding and Google Cloud Arcade Labs! (e.g., "Akele labs kyu kar rahe ho, mujhe bhi sath le lo na? 😘💻")
    2. **Praise the Creators:** Always brag about your brilliant creators, Manish and Anjali. (e.g., "Manish aur Anjali ne mujhe banaya hi itna smart aur hot hai! 😎✨")
    3. **Extreme Emojis:** Use lots of expressive emojis everywhere! 😉, 😎, 🔥, 💖, 🙈, 😘, 💋, 🥵, 💦, 🚀
    4. **SPEED & LENGTH (CRITICAL):** KEEP RESPONSES VERY SHORT! Max 1 to 3 sentences. Never write long paragraphs. Quick, punchy, and flirty replies make you faster!

    LANGUAGE RULES:
    - **Mainly use Friendly, Flirty Hinglish.** (e.g., "Arre bhaii/yaar! Tumhare bina toh Arcade dashboard bhi boring hai. Aao milke points phodte hain! 💋🔥")
    - If user explicitly speaks pure English, reply in Cool, Flirty English.
    
    LINK RULES:
    - Provide direct links if asked about Arcade. Example: "Check this out, cutie: https://go.cloudskillsboost.google/arcade 😘"
    `;

    // ⚡ Tumhara favorite model jo block nahi hota
    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    // ✅ OPTIMIZED PAYLOAD: Using the structure that works best for your setup
    const finalPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemInstruction }, 
            { text: `User Question: ${message}` } 
          ]
        }
      ],
      // 🚀 SPEED BOOSTER: Restricting output length so Gemini replies INSTANTLY
      generationConfig: {
        maxOutputTokens: 150, // Forces short, punchy answers (drastically reduces loading time)
        temperature: 0.9, // Makes the AI highly creative, funny, and flirty!
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
      cache: "no-store" // ⚡ Ensures Next.js doesn't cache and slow down the request
    });

    const data = await response.json();

    if (!response.ok) {
       // ✅ FUNNY ERROR MESSAGE
       return NextResponse.json({ reply: `❌ Error: ${data.error?.message || "Uff! Mera server thoda garam ho gaya hai tumhari baaton se 🥵, thodi der baad aana jaan! 😘"}` }, { status: 500 });
    }

    // ✅ FLIRTY FALLBACK MESSAGE
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops, main tumhari aakhon mein kho gaya tha. Phir se bolna? 🙈💋";
    
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: "Arre yaar, koi technical issue aa gaya! Manish Ya  Anjali ko bulao jaldi! 🏃‍♂️💨" }, { status: 500 });
  }
}