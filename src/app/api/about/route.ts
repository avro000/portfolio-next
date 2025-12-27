import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

/* GET ABOUT */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const about = await db
      .collection("about")
      .findOne({ key: "about" });

    return NextResponse.json(about ?? {});
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch about" },
      { status: 500 }
    );
  }
}

/* UPDATE ABOUT */
export async function PUT(req: Request) {
  try {
    const rawBody = await req.json();
    const { _id, ...body } = rawBody; // remove _id

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("about").updateOne(
      { key: "about" },
      {
        $set: {
          ...body,
          key: "about",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update about" },
      { status: 500 }
    );
  }
}
