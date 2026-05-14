import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function POST(req: Request) {
  try {
    const { email, resetToken, newPassword } = await req.json();

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const tokenDoc = await db.collection("otp_tokens").findOne({
      email: ADMIN_EMAIL,
      resetToken,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please start over." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.collection("admins").updateOne(
      { email: ADMIN_EMAIL },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    await db.collection("otp_tokens").deleteMany({ email: ADMIN_EMAIL });

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
