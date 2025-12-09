import { NextResponse } from "next/server"

// Temporary mock endpoint that pretends to mark a notification as sent.
// Replace with your DB update logic (set nextDay, lastSentAt, etc.).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, nextDay } = body as { id?: string; nextDay?: number }

  if (!id || nextDay === undefined) {
    return NextResponse.json({ error: "Missing id or nextDay" }, { status: 400 })
  }

  // TODO: persist the update in your data store
  return NextResponse.json({ ok: true })
}

