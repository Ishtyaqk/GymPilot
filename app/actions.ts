"use server"

import type { FitnessFormData } from "@/components/fitness-form"

export async function generateWorkoutPlan(formData: FitnessFormData): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in the environment.")
    }
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

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
        ]
      })
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Gemini API: " + (await response.text()))
    }
    const data: any = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API."
  } catch (error) {
    console.error("Error generating workout plan:", error)
    // Surface a user-friendly error so the client UI can show feedback
    const message = error instanceof Error ? error.message : "Unknown error"
    throw new Error("Failed to generate workout plan. " + message)
  }
}
