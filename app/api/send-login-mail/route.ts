import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
  // 👇 DEKHO: Yahan maine naam badal diye hain (MY_ADMIN_...)
  console.log("------------------------------------------------");
  console.log("🔍 NEW DEBUG: Checking New Keys");
  console.log("📧 EMAIL:", process.env.MY_ADMIN_EMAIL ? "✅ Mil Gya" : "❌ Missing");
  console.log("🔑 PASS:", process.env.MY_ADMIN_PASS ? "✅ Mil Gya" : "❌ Missing");
  console.log("------------------------------------------------");

  try {
    const { email, userAgent } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // 👇 Yahan bhi Naye Naam use ho rahe hain
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_ADMIN_EMAIL, // <-- NAYA NAAM
        pass: process.env.MY_ADMIN_PASS,  // <-- NAYA NAAM
      },
    });

    const mailOptions = {
      from: `"Arcade Admin" <${process.env.MY_ADMIN_EMAIL}>`, // <-- NAYA NAAM
      to: email,
      subject: "🔐 Login Alert",
      text: `New login detected for account: ${email}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Mail error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}