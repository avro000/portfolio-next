import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const otpDoc = await db.collection("otp_tokens").findOne({
      email: ADMIN_EMAIL,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await db.collection("otp_tokens").deleteMany({ email: ADMIN_EMAIL });
    await db.collection("otp_tokens").insertOne({
      email: ADMIN_EMAIL,
      resetToken,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      createdAt: new Date(),
    });

    return NextResponse.json({ resetToken });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
