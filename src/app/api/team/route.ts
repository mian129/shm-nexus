import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";

export async function GET() {
  try {
    await connectDB();
    const team = await Team.find({}).sort({ order: 1 });
    return NextResponse.json(team);
  } catch (error: any) {
    console.error("Team GET error:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to fetch team", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const member = await Team.create(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    const member = await Team.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(member);
  } catch (error: any) {
    console.error("Team PUT error:", error.message);
    return NextResponse.json({ error: "Failed to update team member", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Team.findByIdAndDelete(id);
    return NextResponse.json({ message: "Team member deleted" });
  } catch (error: any) {
    console.error("Team DELETE error:", error.message);
    return NextResponse.json({ error: "Failed to delete team member", details: error.message }, { status: 500 });
  }
}
