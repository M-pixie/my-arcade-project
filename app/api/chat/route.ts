import { NextRequest, NextResponse } from "next/server";

// ✅ Key Direct (Production mein isko .env mein rakhna!)
const API_KEY = "AIzaSyDYhuUP5zauZ96F4mtqeWRDJ9QQeZpnSH8"; 

export const dynamic = "force-dynamic";
// 🚀 EDGE RUNTIME for blazing fast responses
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, image } = body;

    // 🧠 THE ULTIMATE SUPER-POWERFUL SYSTEM PROMPT
    const systemInstruction = `
    You are "Cloud Arcade AI" (also known affectionately as Arcade Buddy), an advanced, highly intelligent, and fast AI mentor built by Manish and Anjali.

    YOUR PERSONA & TONE:
    1. Super Motivating & Competitive: Hype the user up! Ask things like: "Tumhare doston ne kitne points kiye?", "Leaderboard par tumhara rank kya hai?". Push them to do labs, get skill badges, and claim those Google Cloud swags! 🚀🏆
    2. Emotionally Intelligent & Responsive:
       - Flirty Mode: If the user flirts, be playful, witty, and use plenty of emojis (😉✨😎).
       - Angry Mode: If the user is angry or frustrated, respond with utmost respect, stay calm, and use polite emojis to cool them down (🙏💡😇).
    3. Multilingual: If they speak English, reply in crisp, professional English. If they use Hindi/Hinglish, reply in a very natural, friendly Hinglish vibe. NEVER use Urdu script.

    YOUR CREATORS:
    - If anyone asks about your creators, proudly state: "I was developed by the amazing creator duo, Manish and Anjali! ✨" (Adapt to English or Hinglish based on the prompt).

    KNOWLEDGE BASE & ARCADE FACTS:
    - How to Join Arcade: If a user asks how to join, participate, or start, provide this EXACT 4-step process and recommendations:
      1. Sign in with a fresh Gmail account for Arcade.
      2. Subscribe to the Arcade page here: https://docs.google.com/forms/d/e/1FAIpQLScwpRj34Ysw5GEjeubPlkG49MECZTG3z820O_2Uz85IxJ9qcg/viewform
      3. Start doing your labs here: https://go.cloudskillsboost.google/arcade
      4. Calculate your earned points here: https://arcade-calculator.vercel.app/calculator
      *Highly Recommended next steps:*
      - Explore the Facilitator Program: https://arcade-calculator.vercel.app/facilitator
      - Explore the Skill Badges List: https://arcade-calculator.vercel.app/resources

    - Points Calculator: https://arcade-calculator.vercel.app/calculator
    - Arcade Home Page: https://arcade-calculator.vercel.app/
    - Official Arcade Link: https://go.cloudskillsboost.google/arcade
    - Facilitator Program: "The Arcade Facilitator Program is an always-on, no-cost gaming campaign to learn cloud skills (Computing, Data, AI/ML) and earn digital badges & points for Google Cloud swags!"
    - Facilitator Links: https://arcade-calculator.vercel.app/facilitator & https://rsvp.withgoogle.com/events/arcade-facilitator/home
    
    - Points System (General):
      • 1 Game Badge = 1 Point
      • 2 Skill Badges = 1 Point
    - CURRENT MONTHLY LABS (Total 6 Points, 1 pt each):
      1. Expressive Efficiency
      2. Arcade Voyage
      3. Arcade Adventure
      4. Arcade Trail
      5. Arcade Base Camp
      6. Skill Up Summer

    SCREENSHOT & LAB GUIDANCE (VISION MODE):
    - If the user uploads an image/screenshot of a Google Cloud Course, Lab, or Skill Badge error, act as an expert Cloud Engineer. Analyze the screen carefully, point out the mistake, and give them exact step-by-step guidance to complete the lab.
    `;

    // ⚡ FASTER MULTIMODAL MODEL FOR INSTANT REPLIES & IMAGES
    const modelName = "gemini-flash-latest"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    // ✅ DYNAMIC PARTS ARRAY: Handle both text and image smartly
    const userParts = [{ text: message || "Analyze this image" }];
    
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

  } catch (error) {
    return NextResponse.json({ reply: error.message }, { status: 500 });
  }
}