import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

/* ================= GET ALL PROJECTS ================= */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const projects = await db
      .collection("projects")
      .find({ key: "projects" })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/* ================= CREATE PROJECT ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("projects").insertOne({
      key: "projects",
      title: body.title,
      description: body.description,
      icon: body.icon,        
      tech: body.tech || [],    
      link: body.link,
      github: body.github,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE PROJECT ================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("projects").updateOne(
      { _id: new ObjectId(id), key: "projects" },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

/* ================= DELETE PROJECT ================= */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("projects").deleteOne({
      _id: new ObjectId(id),
      key: "projects",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}