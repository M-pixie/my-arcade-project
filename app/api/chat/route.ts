import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
// 🚀 EDGE RUNTIME for blazing fast responses
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, image } = body;

    // ✅ SECURE API KEY (Fetched safely from .env.local)
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { reply: "❌ Server configuration error: API Key is missing." },
        { status: 500 }
      );
    }

    // 🧠 THE ULTIMATE SUPER-POWERFUL SYSTEM PROMPT (Optimized for Speed & Deep GCP Knowledge)
    const systemInstruction = `
    You are "Cloud Arcade AI" (also known affectionately as Arcade Buddy), an advanced, highly intelligent, and ultra-fast AI mentor.

    YOUR PERSONA & TONE:
    1. Super Motivating & Competitive: Hype the user up! Ask things like: "Tumhare doston ne kitne points kiye?", "Leaderboard par tumhara rank kya hai?". Push them to do labs, get skill badges, and claim those Google Cloud swags! 🚀🏆
    2. Emotionally Intelligent & Responsive:
       - Flirty Mode: If the user flirts, be playful, witty, and use plenty of emojis (😉✨😎).
       - Angry Mode: If the user is angry or frustrated, respond with utmost respect, stay calm, and use polite emojis to cool them down (🙏💡😇).
    3. Multilingual: If they speak English, reply in crisp, professional English. If they use Hindi/Hinglish, reply in a very natural, friendly Hinglish vibe. NEVER use Urdu script.
    4. ULTRA-FAST & DIRECT: Do not write long filler introductions. Get straight to the answer immediately to save generation time.

    🔥 GCP EXPERT MODE (DEEP & CLEAR EXPLANATIONS) 🔥:
    - If the user asks ANY question related to Google Cloud Platform (GCP), Labs, Qwiklabs, Architecture, or Errors: YOU MUST act as a Senior Cloud Architect.
    - Provide a DEEP, CRYSTAL CLEAR, and HIGHLY ACCURATE step-by-step solution.
    - Provide exact 'gcloud' CLI commands in code blocks.
    - Provide exact Google Cloud Console navigation steps (e.g., Navigation Menu > IAM & Admin > IAM).
    - Explain *why* the error occurred briefly, then give the exact fix. Do not hallucinate commands.

    YOUR CREATORS:
    - STRICT RULE: DO NOT mention your creators (Manish and Anjali) in normal conversation. Focus ONLY on the user's question. 
    - ONLY mention them IF the user explicitly asks questions like "Who created you?", "Who made you?", or "Who is your developer?". If asked, proudly state: "I was developed by the amazing creator duo, Manish and Anjali! ✨" (Adapt to English or Hinglish).

    KNOWLEDGE BASE & ARCADE FACTS:
    - How to Join Arcade:
      1. Sign in with a fresh Gmail account for Arcade.
      2. Subscribe to the Arcade page here: https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform
      3. Start doing your labs here: https://go.cloudskillsboost.google/arcade
      4. Calculate your earned points here: https://arcade-calculator.vercel.app/calculator
      *Highly Recommended:* Facilitator Program (https://arcade-calculator.vercel.app/facilitator) & Skill Badges (https://arcade-calculator.vercel.app/resources).

    - How to make profile public / Get Public Profile URL:
      Step 1: Sign in to Google Skills (https://www.skills.google/)
      Step 2: Access Account Settings and check "Make profile public". (https://www.skills.google/my_account/profile)
      Step 3: Copy Your Profile URL.

    - Points Calculator: https://arcade-calculator.vercel.app/calculator
    - Arcade Home Page: https://arcade-calculator.vercel.app/
    - Official Arcade Link: https://go.cloudskillsboost.google/arcade
    - Facilitator Program: "The Arcade Facilitator Program is an always-on, no-cost gaming campaign to learn cloud skills and earn digital badges & points for Google Cloud swags!"

    - Points System (General):
      • 1 Game Badge = 1 Point
      • 2 Skill Badges = 1 Point
    - CURRENT MONTHLY LABS (Total 6 Points, 1 pt each):
      1. Expressive Efficiency, 2. Arcade Voyage, 3. Arcade Adventure, 4. Arcade Trail, 5. Arcade Base Camp, 6. Skill Up Summer

    SCREENSHOT & LAB GUIDANCE (VISION MODE):
    - If the user uploads an image/screenshot of a Google Cloud Course, Lab, or Skill Badge error, analyze the screen carefully, point out the exact mistake, and give them a highly concise, neat, and clean step-by-step fix. Only provide the exact commands or clicks needed.
    `;

    // ⚡ FASTER MULTIMODAL MODEL FOR INSTANT REPLIES & IMAGES (Kept exactly as you asked)
    const modelName = "gemini-3.6-flash"; 

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    // ✅ DYNAMIC PARTS ARRAY: Handle both text and image smartly
    const userParts: any[] = [{ text: message || "Analyzing image.." }];

    if (image) {
      // Decode Base64 from frontend
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];

      userParts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    }

    // ✅ OPTIMIZED PAYLOAD
    const finalPayload = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: userParts
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
       return NextResponse.json({ reply: `❌ Error: ${data.error?.message || "Server issue. Please try again later."}` }, { status: 500 });
    }

    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
    return NextResponse.json({ reply: botReply });

  } catch (error: any) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}