import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const inquiry = await Inquiry.findById(id);
      return NextResponse.json(inquiry);
    }

    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const inquiry = await Inquiry.create(body);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    const inquiry = await Inquiry.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ message: "Inquiry deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
