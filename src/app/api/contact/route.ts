import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const contact = await db
      .collection("contact")
      .findOne({ key: "contact" });

    return NextResponse.json(contact ?? {});
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("contact").updateOne(
      { key: "contact" },
      {
        $set: {
          email: body.email,
          phone: body.phone,
          location: body.location,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}