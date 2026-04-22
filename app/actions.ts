"use server"

import type { CalorieFormData } from "@/components/calorie-form"
import type { FitnessFormData } from "@/components/fitness-form"
import { upsertPlanNotification } from "@/lib/notifications"

type WorkoutPlanResult =
  | { success: true; plan: string }
  | { success: false; error: string }

const goalMap = {
  loseWeight: "lose weight",
  buildMuscle: "build muscle",
  improveEndurance: "improve endurance",
  increaseStrength: "increase strength",
} as const

const activityMultipliers: Record<CalorieFormData["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
}

const workoutStyleMap: Record<FitnessFormData["gymGoal"], string[]> = {
  loseWeight: [
    "metabolic strength with efficient supersets",
    "hybrid cardio plus resistance training",
    "calorie-burn focused full-body sessions",
  ],
  buildMuscle: [
    "compound-first hypertrophy with accessory volume",
    "balanced muscle-building split with smart isolation work",
    "progressive overload focused hypertrophy sessions",
  ],
  improveEndurance: [
    "strength-endurance circuits with pacing work",
    "cardio-supported resistance training for work capacity",
    "conditioning-first training with muscular endurance support",
  ],
  increaseStrength: [
    "low-rep compound work with technique emphasis",
    "strength-focused split with longer rest periods",
    "powerbuilding style structure with heavy primary lifts",
  ],
}

const mealStylePool = {
  quick: [
    "quick-prep meals that can be assembled in 15 to 20 minutes",
    "repeatable weekday meals with minimal cooking friction",
  ],
  moderate: [
    "balanced home-cooked meals with practical prep time",
    "structured meals with a mix of quick and cooked options",
  ],
  flexible: [
    "varied meal ideas with more cooking flexibility",
    "flavor-first meals that still match the macro targets",
  ],
} as const

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function formatOptionalText(value?: string) {
  return value?.trim() ? value.trim() : "Not provided"
}

function getWorkoutLocationLabel(location: FitnessFormData["workoutLocation"]) {
  switch (location) {
    case "fullGym":
      return "Full gym access"
    case "home":
      return "Home or minimal-equipment setup"
    case "hybrid":
      return "Hybrid gym and home setup"
  }
}

function getGoalDeltaSummary(weight: number, goalWeight: number) {
  const delta = Math.round((goalWeight - weight) * 10) / 10

  if (delta === 0) {
    return "Body recomposition or performance-focused goal around current body weight"
  }

  if (delta > 0) {
    return `Targeting a gain of about ${delta} kg`
  }

  return `Targeting a loss of about ${Math.abs(delta)} kg`
}

function roundToNearest(value: number, increment: number) {
  return Math.round(value / increment) * increment
}

function calculateNutritionTargets(formData: CalorieFormData) {
  const { age, gender, height, weight, activityLevel, goal } = formData
  const sexOffset = gender === "male" ? 5 : gender === "female" ? -161 : -78
  const bmr = 10 * weight + 6.25 * height - 5 * age + sexOffset
  const maintenanceCalories = bmr * activityMultipliers[activityLevel]

  const calorieAdjustment = goal === "lose" ? -400 : goal === "gain" ? 250 : 0
  const minimumCalories = gender === "female" ? 1200 : gender === "male" ? 1500 : 1350
  const targetCalories = Math.max(minimumCalories, roundToNearest(maintenanceCalories + calorieAdjustment, 25))

  const proteinPerKg = goal === "lose" ? 2 : goal === "gain" ? 1.8 : 1.6
  const fatPerKg = goal === "lose" ? 0.8 : goal === "gain" ? 0.9 : 0.85

  const proteinGrams = roundToNearest(weight * proteinPerKg, 5)
  const fatGrams = roundToNearest(weight * fatPerKg, 5)
  const caloriesAfterProteinAndFat = targetCalories - proteinGrams * 4 - fatGrams * 9
  const carbGrams = Math.max(80, roundToNearest(caloriesAfterProteinAndFat / 4, 5))

  return {
    bmr: roundToNearest(bmr, 5),
    maintenanceCalories: roundToNearest(maintenanceCalories, 25),
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
  }
}

function buildWorkoutPrompt(formData: FitnessFormData) {
  const {
    age,
    fitnessLevel,
    height,
    weight,
    goalWeight,
    workoutDays,
    workoutDuration,
    gymGoal,
    workoutLocation,
    equipmentAccess,
    injuries,
    exercisePreferences,
    additionalInfo,
  } = formData

  const bmi = weight / (height / 100) ** 2
  const selectedStyle = pickOne(workoutStyleMap[gymGoal])

  return `
Create a genuinely personalized workout plan in markdown.

## User Profile
- Age: ${age}
- Fitness level: ${fitnessLevel}
- Height: ${height} cm
- Current weight: ${weight} kg
- Goal weight: ${goalWeight} kg
- Estimated BMI: ${bmi.toFixed(1)}
- Goal summary: ${getGoalDeltaSummary(weight, goalWeight)}
- Training days available: ${workoutDays} days per week
- Session length cap: ${workoutDuration} minutes
- Primary goal: ${goalMap[gymGoal]}
- Training environment: ${getWorkoutLocationLabel(workoutLocation)}
- Equipment available: ${formatOptionalText(equipmentAccess)}
- Injuries or limitations: ${formatOptionalText(injuries)}
- Exercise preferences: ${formatOptionalText(exercisePreferences)}
- Additional context: ${formatOptionalText(additionalInfo)}
- Program style to lean into for this request: ${selectedStyle}

Instructions:
- Make the plan feel bespoke to this profile, not like a generic template.
- Use exercises that fit the training environment and listed equipment. If the user trains at home or with minimal gear, avoid assuming access to machines or barbells unless they listed them.
- Match the weekly split to the goal, experience, and ${workoutDays}-day schedule. Do not make every plan a full-body copy unless that is clearly the best fit.
- Keep each session realistic for a ${workoutDuration}-minute cap.
- Respect injuries or limitations and mention safer swaps where needed.
- Use exercise selection, rep ranges, rest times, and conditioning that clearly reflect the goal of ${goalMap[gymGoal]}.
- Avoid repetitive filler advice and avoid repeating the exact same exercise unnecessarily across multiple days.
- Include progression guidance for the next 4 weeks.

Return markdown with these top-level sections:
## Profile Snapshot
## Weekly Training Plan
## 4-Week Progression
## Recovery Notes
## Exercise Swaps

Inside "Weekly Training Plan", create one subsection per workout day using this heading pattern:
### Day 1 - [Focus]

For each day include:
- Goal of the session
- Warm-up
- Main work as bullet points with exercise name, sets, reps, and rest
- Optional finisher or cardio if relevant
- Estimated session time
`.trim()
}

function buildCaloriePrompt(formData: CalorieFormData) {
  const {
    age,
    gender,
    height,
    weight,
    activityLevel,
    goal,
    dietaryPrefs,
    preferredFoods,
    avoidFoods,
    budget,
    cookingTime,
    mealsPerDay,
  } = formData

  const targets = calculateNutritionTargets(formData)
  const mealStyle = pickOne(mealStylePool[cookingTime])
  const goalLabel = goal === "lose" ? "fat loss" : goal === "gain" ? "muscle gain" : "maintenance"

  return `
Create a personalized nutrition plan in markdown.

## User Profile
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Activity level: ${activityLevel}
- Goal: ${goalLabel}
- Dietary preferences or restrictions: ${formatOptionalText(dietaryPrefs)}
- Foods they enjoy: ${formatOptionalText(preferredFoods)}
- Foods to avoid: ${formatOptionalText(avoidFoods)}
- Meals per day: ${mealsPerDay}
- Budget: ${budget}
- Cooking time preference: ${cookingTime}
- Meal-planning style to lean into for this request: ${mealStyle}

## Calculated Targets
- Estimated BMR: ${targets.bmr} kcal
- Estimated maintenance calories: ${targets.maintenanceCalories} kcal
- Recommended daily calorie target: ${targets.targetCalories} kcal
- Protein target: ${targets.proteinGrams} g
- Carbs target: ${targets.carbGrams} g
- Fat target: ${targets.fatGrams} g

Instructions:
- Use the calculated calorie and macro targets as the anchor for the plan.
- Make the food suggestions feel realistic for the stated preferences, dislikes, budget, and cooking-time limits.
- Do not recycle the same protein-carb combination in every meal.
- Respect dietary restrictions and do not suggest avoided foods.
- Keep portions practical and easy to follow without sounding clinical.
- Include smart substitutions so the user can vary meals without breaking the plan.

Return markdown with these top-level sections:
## Daily Target
## Macro Split
## Meal Plan
## Grocery Strategy
## Adjustment Rules

Inside "Meal Plan", create ${mealsPerDay} meal subsections using this heading pattern:
### Meal 1 - [Theme]

For each meal include:
- Foods with rough portions
- Approx macro contribution
- One easy swap or alternative
`.trim()
}

async function requestGroqPlan({
  model,
  systemPrompt,
  userPrompt,
  temperature,
  maxTokens,
}: {
  model: string
  systemPrompt: string
  userPrompt: string
  temperature: number
  maxTokens: number
}) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("Groq API error:", response.status, text)
    return {
      ok: false as const,
      error: `Failed to fetch from Groq API (status ${response.status}). ${text || "Please try again later."}`,
    }
  }

  const data: any = await response.json()
  const plan = data.choices?.[0]?.message?.content

  if (!plan || !plan.trim()) {
    return {
      ok: false as const,
      error: "No response from Groq API.",
    }
  }

  return {
    ok: true as const,
    plan,
  }
}

export async function generateWorkoutPlan(formData: FitnessFormData): Promise<WorkoutPlanResult> {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "GROQ_API_KEY is not set in the environment." }
    }

    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant"
    const prompt = buildWorkoutPrompt(formData)
    const response = await requestGroqPlan({
      model,
      systemPrompt:
        "You are an expert strength and conditioning coach. Your plans must feel specific to the user's schedule, limitations, training environment, and goals. Reply in clean markdown only.",
      userPrompt: prompt,
      temperature: 0.9,
      maxTokens: 1800,
    })

    if (!response.ok) {
      return { success: false, error: response.error }
    }

    if (formData.email) {
      await upsertPlanNotification({
        email: formData.email,
        workout: response.plan,
      })
    }

    return { success: true, plan: response.plan }
  } catch (error) {
    console.error("Error generating workout plan:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: "Failed to generate workout plan. " + message }
  }
}

export async function generateCaloriePlan(formData: CalorieFormData): Promise<WorkoutPlanResult> {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { success: false, error: "GROQ_API_KEY is not set in the environment." }
    }

    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant"
    const prompt = buildCaloriePrompt(formData)
    const response = await requestGroqPlan({
      model,
      systemPrompt:
        "You are an expert nutrition coach. Build meal plans that feel practical, varied, and specific to the user's budget, preferences, cooking time, and calorie goal. Reply in clean markdown only.",
      userPrompt: prompt,
      temperature: 0.8,
      maxTokens: 1200,
    })

    if (!response.ok) {
      return { success: false, error: response.error }
    }

    if (formData.email) {
      await upsertPlanNotification({
        email: formData.email,
        calories: response.plan,
      })
    }

    return { success: true, plan: response.plan }
  } catch (error) {
    console.error("Error generating calorie plan:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: "Failed to generate calorie plan. " + message }
  }
}
