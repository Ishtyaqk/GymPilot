import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, nextDay } = body as { id?: string; nextDay?: number }

  if (!id || nextDay === undefined) {
    return NextResponse.json({ error: "Missing id or nextDay" }, { status: 400 })
  }

  try {
    await prisma.planNotification.update({
      where: { id },
      data: { nextDay, lastSentAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("mark-sent error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

