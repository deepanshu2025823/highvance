import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await (prisma as any).user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN" 
      }
    });

    return NextResponse.json({ message: "User registered successfully", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}