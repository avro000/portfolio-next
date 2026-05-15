import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({
        message: "If this email is registered, you will receive an OTP.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("otp_tokens").deleteMany({ email: ADMIN_EMAIL });

    await db.collection("otp_tokens").insertOne({
      email: ADMIN_EMAIL,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date(),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Admin Portal" <${process.env.SMTP_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: "Admin Password Reset — OTP Code",
      html: `
<div style="background:#D2C8BC;padding:24px 12px;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#EDE8E2;border:1px solid #B0A89E;">

    <!-- Header -->
    <div style="padding:28px 24px 20px;border-bottom:1px solid #B0A89E;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#5A5550;">Avra Podder — Admin</p>
      <h1 style="margin:0;font-size:24px;font-weight:700;color:#1A1A1A;font-family:Georgia,'Times New Roman',serif;">Password Reset</h1>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;text-align:center;">
      <p style="margin:0 0 24px;font-size:14px;color:#5A5550;line-height:1.6;">Your one-time verification code is:</p>

      <!-- OTP Box — compact for mobile -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
        <tr>
          ${otp.split("").map((d: string) => `<td style="padding:0 3px;"><div style="width:36px;height:44px;line-height:44px;text-align:center;font-size:22px;font-weight:700;font-family:Georgia,'Times New Roman',serif;color:#1A1A1A;background:#D2C8BC;border:1px solid #B0A89E;">${d}</div></td>`).join("")}
        </tr>
      </table>

      <p style="margin:24px 0 0;font-size:12px;color:#5A5550;">
        This code expires in <strong style="color:#1A1A1A;">10 minutes</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;border-top:1px solid #B0A89E;text-align:center;">
      <p style="margin:0;font-size:11px;color:#5A5550;line-height:1.6;">
        If you didn't request this, please ignore this email.<br/>
        <strong>Do not share this code with anyone.</strong>
      </p>
    </div>

  </div>
</div>`,
    });

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
