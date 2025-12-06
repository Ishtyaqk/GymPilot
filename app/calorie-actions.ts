"use server"

import type { CalorieFormData } from "@/components/calorie-form"
const fetch: any = (...args: any[]) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export async function generateCaloriePlan(formData: CalorieFormData): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in the environment.")
    }

    const { age, gender, height, weight, activityLevel, goal, dietaryPreferences, mealsPerDay } = formData

    const activityMap = {
      sedentary: "sedentary (little to no exercise)",
      lightlyActive: "lightly active (exercise 1-3 days/week)",
      moderatelyActive: "moderately active (exercise 3-5 days/week)",
      veryActive: "very active (exercise 6-7 days/week)",
      extremelyActive: "extremely active (physical job or training twice per day)",
    }

    const goalMap = {
      lose: "lose weight",
      maintain: "maintain weight",
      gain: "gain weight/muscle",
    }

    const prompt = `
      Create a detailed calorie and nutrition plan for someone with the following characteristics:
      - Age: ${age} years
      - Gender: ${gender}
      - Height: ${height} cm
      - Current weight: ${weight} kg
      - Activity level: ${activityMap[activityLevel as keyof typeof activityMap]}
      - Primary goal: ${goalMap[goal as keyof typeof goalMap]}
      - Dietary preferences: ${dietaryPreferences || "None specified"}
      - Preferred meals per day: ${mealsPerDay}

      Please provide:
      1. Daily calorie target (TDEE calculation and goal-adjusted calories)
      2. Macronutrient breakdown (protein, carbs, fats in grams and percentages)
      3. A sample meal plan for one day with ${mealsPerDay} meals
      4. Each meal should include:
         - Meal name and timing
         - Food items with portions
         - Approximate calories and macros
      5. Hydration recommendations
      6. General nutrition tips for their goal
      7. Foods to emphasize and foods to limit

      Format the response in clear markdown with proper sections and bullet points.
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
    console.error("Error generating calorie plan:", error)
    throw new Error("Failed to generate calorie plan. Please try again later.")
  }
}
