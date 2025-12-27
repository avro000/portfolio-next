import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

/* GET all education */
export async function GET() {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const education = await db
    .collection("education")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return NextResponse.json(education);
}

/* CREATE education */
export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("portfolio");

  const result = await db.collection("education").insertOne(body);

  return NextResponse.json({ insertedId: result.insertedId });
}

/* UPDATE education */
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;

  const client = await clientPromise;
  const db = client.db("portfolio");

  await db.collection("education").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ success: true });
}

/* DELETE education */
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db("portfolio");

  await db.collection("education").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ success: true });
}
