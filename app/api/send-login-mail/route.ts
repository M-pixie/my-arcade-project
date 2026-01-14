import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

// 🖥️ OS detect helper
function detectOS(userAgent: string) {
  if (!userAgent) return "Unknown Device";
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
    return "iOS";
  return "Unknown Device";
}

export async function POST(req: Request) {
  // 👇 Debug Logs (Check karne ke liye)
  console.log("------------------------------------------------");
  console.log("🔍 Sending Full Designed Email...");
  console.log("📧 EMAIL:", process.env.MY_ADMIN_EMAIL ? "✅ Found" : "❌ Missing");
  console.log("------------------------------------------------");

  try {
    const { email, userAgent } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const deviceOS = detectOS(userAgent || "");

    // 🔐 Gmail transporter (NAYE NAAM ke saath)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_ADMIN_EMAIL, // ✅ Naya Naam
        pass: process.env.MY_ADMIN_PASS,  // ✅ Naya Naam
      },
    });

    // 📩 Professional Email Template
    const mailOptions = {
      from: `"Arcade Points Calculator" <${process.env.MY_ADMIN_EMAIL}>`, // ✅ Naya Naam
      to: email,
      subject: "🔐 New Login Alert – Arcade Points Calculator",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color: #333;">
          <h2 style="color:#1a73e8;">🔐 New Login Detected</h2>

          <p>Hello,</p>

          <p>
            Your account was successfully used to sign in to the
            <b>Arcade Points Calculator</b> website.
          </p>

          <table style="width: 100%; max-width: 400px; border-collapse: collapse; margin-top:10px; background-color: #f9f9f9; padding: 10px; border-radius: 8px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 100px;">Website:</td>
              <td style="padding: 8px;">Arcade Points Calculator</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Account:</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Device:</td>
              <td style="padding: 8px; color: #d93025; font-weight: bold;">${deviceOS}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Time:</td>
              <td style="padding: 8px;">${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <p style="margin-top:20px;">
            If this was you, no action is required.
          </p>

          <p style="color:#d93025; font-weight: bold;">
            If this was <b>not you</b>, please secure your Google account immediately.
          </p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

          <p style="font-size:12px; color:#666;">
            This is an automated security message from
            <b>Arcade Points Calculator</b>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Designed Email sent successfully!");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Mail error details:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}