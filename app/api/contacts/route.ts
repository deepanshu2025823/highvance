import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    const newContact = await prisma.contact.create({
      data: { name, email, phone }
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}