import { NextRequest, NextResponse } from "next/server";
import { findMany, createOne, updateById, deleteById } from "@/lib/mongodb-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const filter: Record<string, unknown> = {};
    if (category && category !== "All") filter.category = category;
    if (featured === "true") filter.featured = true;

    const projects = await findMany("projects", filter, { createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Projects GET error:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to fetch projects", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await createOne("projects", body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    await updateById("projects", id, updateData);
    return NextResponse.json({ _id: id, ...updateData });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await deleteById("projects", id!);
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
