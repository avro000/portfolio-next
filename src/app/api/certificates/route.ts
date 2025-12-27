import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

/* GET certificates */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const certificates = await db
      .collection("certificates")
      .find({ key: "certificates" })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(certificates);
  } catch (e) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

/* CREATE certificate */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("certificates").insertOne({
      key: "certificates",
      title: body.title,
      issuer: body.issuer,
      year: body.year,
      icon: body.icon,
      description: body.description,
      link: body.link,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

/* UPDATE certificate */
export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("certificates").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* DELETE certificate */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("certificates").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}