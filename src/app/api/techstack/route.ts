import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

/* ================= GET tech stack ================= */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const tech = await db
      .collection("techstack")
      .find({ key: "techstack" })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(tech);
  } catch (error) {
    console.error("GET TECH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tech stack" },
      { status: 500 }
    );
  }
}

/* ================= CREATE tech ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("techstack").insertOne({
      key: "techstack",
      name: body.name,
      logo: body.logo,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CREATE TECH ERROR:", error);
    return NextResponse.json(
      { error: "Create failed" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE tech ================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, logo } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("techstack").updateOne(
      { _id: new ObjectId(id), key: "techstack" },
      {
        $set: {
          name,
          logo,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE TECH ERROR:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE tech ================= */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("techstack").deleteOne({
      _id: new ObjectId(id),
      key: "techstack",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE TECH ERROR:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}