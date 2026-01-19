import { NextRequest, NextResponse } from "next/server";

// ❌ Ye HARDCODED wali line HATA DO:
// const API_KEY = "AIzaSyD4E0fbodxwwF33xUrjnRJy4OFcI-nGXUs"; 

// ✅ Ye NEW line lagao (Ye Vercel se key mangega):
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // 👇 Safety Check: Agar Vercel par key dalna bhool gaye to error dega
    if (!API_KEY) {
      throw new Error("API Key gum ho gayi hai! Vercel Environment Variables check karo.");
    }

    const body = await req.json();
    const { message } = body;

    // ... Baaki code same rahega ...
    const systemInstruction = `... (Aapka wahi purana code) ...`;
    const modelName = "gemini-flash-latest";
    
    // URL me API Key automatically aa jayegi
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    
    // ... Neeche ka code bhi same ...
    const response = await fetch(url, { ... });
    // ...