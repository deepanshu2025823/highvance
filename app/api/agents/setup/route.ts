// app/api/agents/setup/route.ts

export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized access. Please login." }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, goal, ttsProvider, telephony, 
      llmProvider, followUpPlan, hasMemory 
    } = body;

    if (!name || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found in database." }, { status: 404 });
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        goal,
        ttsProvider,
        telephony,
        llmProvider,
        followUpPlan: followUpPlan || [],
        hasMemory: hasMemory ?? true,
        userId: user.id,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Agent protocol initialized successfully.",
      agentId: agent.id 
    }, { status: 201 });

  } catch (error) {
    console.error("[AGENT_SETUP_ERROR]:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}