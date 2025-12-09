import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

// Returns users who are due to be emailed now.
// For simplicity, this currently returns all rows that have both workout AND calories.
// Add time-window filtering as needed (e.g., only at 07:00 IST).
export async function GET() {
  try {
    const rows = await prisma.planNotification.findMany({
      where: {
        email: { not: "" },
        workout: { not: null },
        calories: { not: null },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    })

    const data = rows.map((row) => ({
      id: row.id,
      userEmail: row.email,
      subject: `Day ${row.nextDay}: Workout + Calories`,
      workout: row.workout ?? "",
      calories: row.calories ?? "",
      nextDay: row.nextDay,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("due-notifications error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

