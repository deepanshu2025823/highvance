// app/api/forms/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, fields } = await req.json();
    return NextResponse.json({ success: true, formId: "new-form-123" });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}