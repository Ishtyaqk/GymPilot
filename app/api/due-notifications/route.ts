import { NextResponse } from "next/server"

// Temporary mock endpoint so n8n has a valid resource to call.
// Replace the mock data with your own DB-backed lookup that returns
// only the users who should receive an email right now.
export async function GET() {
  const data: Array<{
    id: string
    userEmail: string
    subject?: string
    workout: string
    calories: string
    nextDay: number
  }> = [
    {
      id: "demo-plan-1",
      userEmail: "user@example.com",
      subject: "Day 1: Workout + Calories",
      workout: "## Workout\n- Squats 3x10\n- Pushups 3x12",
      calories: "## Calories & Macros\n- Calories: 2200 kcal\n- Protein: 150g\n- Carbs: 230g\n- Fats: 70g",
      nextDay: 1,
    },
  ]

  return NextResponse.json(data)
}

