"use server"

import type { FitnessFormData } from "@/components/fitness-form"

type WorkoutPlanResult =
  | { success: true; plan: string }
  | { success: false; error: string }

export async function generateWorkoutPlan(formData: FitnessFormData): Promise<WorkoutPlanResult> {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "GROQ_API_KEY is not set in the environment." }
    }
    const model = process.env.GROQ_MODEL || "llama-3.1-70b-versatile"
    const { fitnessLevel, height, weight, goalWeight, workoutDays, gymGoal, additionalInfo } = formData

    const goalMap = {
      loseWeight: "lose weight",
      buildMuscle: "build muscle",
      improveEndurance: "improve endurance",
      increaseStrength: "increase strength",
    }

    const prompt = `
      Create a detailed fitness routine for someone with the following characteristics:
      - Fitness level: ${fitnessLevel}
      - Height: ${height} cm
      - Current weight: ${weight} kg
      - Goal weight: ${goalWeight} kg
      - Available workout days: ${workoutDays} days per week
      - Primary goal: ${goalMap[gymGoal as keyof typeof goalMap]}
      ${additionalInfo ? `- Additional information: ${additionalInfo}` : ""}

      IMPORTANT: Format your response EXACTLY as follows using markdown:

      ## Weekly Workout Schedule

      **Day 1: [Day Name]**
      - Exercise 1: [Name] - [Sets] sets x [Reps] reps, [Rest] rest
      - Exercise 2: [Name] - [Sets] sets x [Reps] reps, [Rest] rest
      - Exercise 3: [Name] - [Sets] sets x [Reps] reps, [Rest] rest

      **Day 2: [Day Name]**
      - Exercise 1: [Name] - [Sets] sets x [Reps] reps, [Rest] rest
      - Exercise 2: [Name] - [Sets] sets x [Reps] reps, [Rest] rest
      - Exercise 3: [Name] - [Sets] sets x [Reps] reps, [Rest] rest

      [Continue for all workout days...]

      ## Nutrition Recommendations

      - [Recommendation 1]
      - [Recommendation 2]
      - [Recommendation 3]
      - [Continue with more recommendations...]

      ## Progress Tracking Tips

      - [Tip 1]
      - [Tip 2]
      - [Tip 3]
      - [Continue with more tips...]

      ## Modifications for ${fitnessLevel} Level

      - [Modification 1]
      - [Modification 2]
      - [Modification 3]

      Use this EXACT structure for all fitness levels. Be consistent with formatting, bullet points, and section headers.
    `

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful fitness coach that replies in structured markdown." },
          { role: "user", content: prompt.trim() },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("Groq API error:", response.status, text)
      return {
        success: false,
        error: `Failed to fetch from Groq API (status ${response.status}). ${text || "Please try again later."}`,
      }
    }

    const data: any = await response.json()
    const plan = data.choices?.[0]?.message?.content

    if (!plan) {
      return { success: false, error: "No response from Groq API." }
    }

    return { success: true, plan }
  } catch (error) {
    console.error("Error generating workout plan:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: "Failed to generate workout plan. " + message }
  }
}
