import { NextResponse } from "next/server";
import { initSchema } from "@/lib/db";

export async function GET() {
  try {
    await initSchema();
    return NextResponse.json({ message: "Schema created" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    await initSchema();
    return NextResponse.json({ message: "Schema created" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
