// app/api/external/lead/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    const newLead = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        source: "WEB_FORM" 
      }
    });

    return NextResponse.json({ success: true, message: "Lead captured!" }, { 
        status: 201,
        headers: {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'POST',
        }
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}