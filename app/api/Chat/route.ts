import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Hum check kar rahe hain ki kya backend zinda hai?
  return NextResponse.json({ reply: "Congratulations! Connection jud gaya hai. ✅" });
}