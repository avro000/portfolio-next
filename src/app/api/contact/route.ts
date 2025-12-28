import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic";

/* GET CONTACT */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const contact = await db
      .collection("contact")
      .findOne({ key: "contact" });

    return NextResponse.json(contact ?? {});
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

/* UPDATE CONTACT */
export async function PUT(req: Request) {
  try {
    const raw = await req.json();
    const { _id, ...body } = raw;

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("contact").updateOne(
      { key: "contact" },
      {
        $set: {
          ...body,
          key: "contact",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT CONTACT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}
