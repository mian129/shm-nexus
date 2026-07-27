import { NextRequest, NextResponse } from "next/server";
import { findMany, createOne, updateById, deleteById } from "@/lib/mongodb-api";

export async function GET() {
  try {
    const team = await findMany("teams", {}, { order: 1 });
    return NextResponse.json(team);
  } catch (error: any) {
    console.error("Team GET error:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to fetch team", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const member = await createOne("teams", body);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    await updateById("teams", id, updateData);
    return NextResponse.json({ _id: id, ...updateData });
  } catch (error: any) {
    console.error("Team PUT error:", error.message);
    return NextResponse.json({ error: "Failed to update team member", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await deleteById("teams", id!);
    return NextResponse.json({ message: "Team member deleted" });
  } catch (error: any) {
    console.error("Team DELETE error:", error.message);
    return NextResponse.json({ error: "Failed to delete team member", details: error.message }, { status: 500 });
  }
}
