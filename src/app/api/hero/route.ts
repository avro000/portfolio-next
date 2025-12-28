import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const hero = await db.collection("hero").findOne({ key: "main" });

    return NextResponse.json(hero ?? {});
  } catch (error) {
    console.error("GET HERO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const rawBody = await req.json();
    const { _id, ...body } = rawBody;

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("hero").updateOne(
      { key: "main" },
      {
        $set: {
          ...body,
          key: "main",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT HERO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update hero" },
      { status: 500 }
    );
  }
}
