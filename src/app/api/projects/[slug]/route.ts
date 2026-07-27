import { NextRequest, NextResponse } from "next/server";
import { findOne } from "@/lib/mongodb-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await findOne("projects", { slug });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
