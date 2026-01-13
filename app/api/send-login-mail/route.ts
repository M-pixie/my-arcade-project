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
  // 👇 JASOOS START (Debugging Logs)
  console.log("------------------------------------------------");
  console.log("🔍 DEBUG START: Checking Keys on Server");
  console.log("📧 EMAIL_FROM:", process.env.EMAIL_FROM ? "✅ Mil Gya" : "❌ Missing Hai (Undefined)");
  console.log("🔑 PASSWORD:", process.env.EMAIL_APP_PASSWORD ? "✅ Mil Gya" : "❌ Missing Hai (Undefined)");
  console.log("------------------------------------------------");
  // 👆 JASOOS END

  try {
    const { email, userAgent } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const deviceOS = detectOS(userAgent || "");

    // 🔐 Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // 📩 Professional Email
    const mailOptions = {
      from: `"Arcade Points Calculator" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "🔐 New Login Alert – Arcade Points Calculator",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2 style="color:#1f2937;">🔐 New Login Detected</h2>

          <p>Hello,</p>

          <p>
            Your account was successfully used to sign in to the
            <b>Arcade Points Calculator</b> website.
          </p>

          <table style="margin-top:10px;">
            <tr>
              <td><b>Website:</b></td>
              <td>Arcade Points Calculator</td>
            </tr>
            <tr>
              <td><b>Account:</b></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td><b>Device:</b></td>
              <td>${deviceOS}</td>
            </tr>
            <tr>
              <td><b>Time:</b></td>
              <td>${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <p style="margin-top:12px;">
            If this was you, no action is required.
          </p>

          <p style="color:#b91c1c;">
            If this was <b>not you</b>, please secure your Google account
            immediately.
          </p>

          <hr />

          <p style="font-size:12px; color:#6b7280;">
            This is an automated security message from
            <b>Arcade Points Calculator</b>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Mail error details:", err); // Error detail log
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}