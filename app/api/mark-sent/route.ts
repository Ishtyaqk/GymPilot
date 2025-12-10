import { NextResponse } from "next/server"

import { prisma } from "../../../lib/prisma"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, nextDay } = body as { id?: string; nextDay?: number }

  if (!id || nextDay === undefined) {
    return NextResponse.json({ error: "Missing id or nextDay" }, { status: 400 })
  }

  try {
    await prisma.planNotification.update({
      where: { id },
      data: { nextDay: Number(nextDay), lastSentAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("mark-sent error:", error)
    // Return more details in development, generic in production
    const errorMessage = error?.code === 'P2025' 
      ? `Record with id ${id} not found`
      : error?.message || "Failed to update"
    return NextResponse.json({ 
      error: errorMessage,
      code: error?.code,
      received: { id, nextDay }
    }, { status: 500 })
  }
}

