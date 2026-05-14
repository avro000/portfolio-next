import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const existing = await db
      .collection("admins")
      .findOne({ email: ADMIN_EMAIL });

    if (existing) {
      return NextResponse.json({ message: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await db.collection("admins").insertOne({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await db.collection("otp_tokens").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );

    return NextResponse.json({ message: "Admin seeded successfully." });
  } catch (error) {
    console.error("SEED ERROR:", error);
    return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
  }
}
