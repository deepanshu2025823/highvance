// app/api/forms/save/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, fields, accentColor, borderRadius } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newForm = await prisma.form.create({
      data: {
        name,
        fields,
        accentColor,
        borderRadius,
        userId: user.id,
      }
    });

    return NextResponse.json({ success: true, formId: newForm.id });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}