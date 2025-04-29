"use server"

import type { FitnessFormData } from "@/components/fitness-form"
const fetch: any = (...args: any[]) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

      Please provide:
      1. A weekly workout schedule with specific exercises, sets, reps, and rest periods
      2. Nutrition recommendations to support their goals
      3. Tips for tracking progress
      4. Any modifications needed based on their fitness level

      Format the response in markdown with clear sections and bullet points.
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
    throw new Error("Failed to generate workout plan. Please try again later.")
  }
}
