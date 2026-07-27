import { NextRequest, NextResponse } from "next/server";
import { findOne, createOne, updateById } from "@/lib/mongodb-api";

export async function GET() {
  try {
    let settings = await findOne("settings", {});
    if (!settings) {
      settings = await createOne("settings", {});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    let settings = await findOne("settings", {});
    if (!settings) {
      settings = await createOne("settings", body);
    } else {
      await updateById("settings", settings.id as number, body);
      settings = { ...settings, ...body };
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
