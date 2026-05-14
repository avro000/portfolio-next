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
<div style="background:#0f172a;padding:30px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#020617;border-radius:14px;border:1px solid #1e293b;">
    <div style="padding:22px 26px;border-bottom:1px solid #1e293b;">
      <h2 style="margin:0;font-size:22px;color:#e2e8f0;">&#128274; Password Reset OTP</h2>
      <p style="margin-top:4px;color:#94a3b8;">Use this code to reset your admin password</p>
    </div>
    <div style="padding:30px 26px;color:#e5e7eb;text-align:center;">
      <p style="font-size:15px;color:#94a3b8;margin:0 0 24px;">Your one-time password is:</p>
      <div style="background:#0f172a;border:2px solid #0ea5e9;border-radius:12px;padding:20px 30px;display:inline-block;">
        <span style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#22d3ee;">${otp}</span>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:#64748b;">This code expires in <b>10 minutes</b>.</p>
    </div>
    <div style="padding:18px 26px;border-top:1px solid #1e293b;color:#94a3b8;font-size:12px;text-align:center;">
      If you didn't request this, please ignore this email.<br/>
      <span style="color:#38bdf8;">Do not share this code with anyone.</span>
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
