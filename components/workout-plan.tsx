"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Dumbbell, Printer, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type WorkoutPlanProps = {
  formData: {
    fitnessLevel: string
    height: number
    weight: number
    goalWeight: number
    workoutDays: number
    gymGoal: string
  }
  onReset: () => void
}

type Exercise = {
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

type WorkoutDay = {
  name: string
  focus: string
  exercises: Exercise[]
  cardio?: {
    type: string
    duration: string
    intensity: string
  }
}

export function WorkoutPlan({ formData, onReset }: WorkoutPlanProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Generate workout plan based on form data
  const workoutPlan = generateWorkoutPlan(formData)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-emerald-500" />
            <span>Your Personalized Workout Plan</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
        </div>
        <CardDescription>Based on your fitness level, goals, and availability</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Tips</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Your Profile</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Fitness Level:</span>
                    <span className="font-medium capitalize">{formData.fitnessLevel}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-medium">{formData.height} cm</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Current Weight:</span>
                    <span className="font-medium">{formData.weight} kg</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Goal Weight:</span>
                    <span className="font-medium">{formData.goalWeight} kg</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Workout Days:</span>
                    <span className="font-medium">{formData.workoutDays} days/week</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Primary Goal:</span>
                    <span className="font-medium">{formatGoal(formData.gymGoal)}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Program Focus</h3>
                <p className="text-sm text-muted-foreground">{getProgramDescription(formData)}</p>

                <h3 className="mt-4 text-lg font-medium">Weekly Structure</h3>
                <ul className="space-y-1 text-sm">
                  {workoutPlan.map((day, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16 justify-center">
                        Day {index + 1}
                      </Badge>
                      <span>
                        {day.name} - <span className="text-muted-foreground">{day.focus}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 text-lg font-medium">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                This program is designed specifically for your fitness level and goals. Start with the recommended
                weights and adjust as needed. Remember to warm up before each session and cool down afterward. Stay
                hydrated and listen to your body.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="pt-4">
            <div className="space-y-6">
              {workoutPlan.map((day, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">
                      Day {index + 1}: {day.name}
                    </CardTitle>
                    <CardDescription>{day.focus}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left text-sm">
                            <th className="pb-2 font-medium">Exercise</th>
                            <th className="pb-2 font-medium">Sets</th>
                            <th className="pb-2 font-medium">Reps</th>
                            <th className="pb-2 font-medium">Rest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.exercises.map((exercise, exIndex) => (
                            <tr key={exIndex} className="border-b text-sm">
                              <td className="py-3">{exercise.name}</td>
                              <td className="py-3">{exercise.sets}</td>
                              <td className="py-3">{exercise.reps}</td>
                              <td className="py-3">{exercise.rest}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {day.cardio && (
                        <div className="rounded-lg bg-muted p-3">
                          <h4 className="mb-2 font-medium">Cardio</h4>
                          <p className="text-sm">
                            <span className="font-medium">{day.cardio.type}:</span> {day.cardio.duration} at{" "}
                            {day.cardio.intensity} intensity
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Notes:</span> Warm up with 5-10 minutes of light cardio and
                          dynamic stretching before starting. Cool down with static stretching after completing the
                          workout.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4 pt-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">Nutrition Recommendations</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Proper nutrition is essential to support your {formatGoal(formData.gymGoal)} goal. Here are some
                guidelines:
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Macronutrient Distribution</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {getNutritionTips(formData).macros.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Meal Timing</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {getNutritionTips(formData).timing.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Hydration</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    <li className="text-muted-foreground">Drink at least 2-3 liters of water daily</li>
                    <li className="text-muted-foreground">Increase intake on workout days</li>
                    <li className="text-muted-foreground">Consider electrolytes for intense training sessions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Foods to Emphasize</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {getNutritionTips(formData).foods.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 text-lg font-medium">Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                These are general nutrition guidelines. For personalized nutrition advice, consult with a registered
                dietitian or nutritionist.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 pt-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">Tracking Your Progress</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Monitoring your progress is crucial for staying motivated and making adjustments to your program.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Metrics to Track</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    <li className="text-muted-foreground">Body weight (1-2 times per week, same time of day)</li>
                    <li className="text-muted-foreground">Body measurements (chest, waist, hips, arms, legs)</li>
                    <li className="text-muted-foreground">Workout performance (weights, reps, sets completed)</li>
                    <li className="text-muted-foreground">Energy levels and recovery quality</li>
                    <li className="text-muted-foreground">Progress photos (every 2-4 weeks)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Program Progression</h4>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    <li className="text-muted-foreground">
                      Aim to increase weight by 2.5-5% when you can complete all sets and reps with good form
                    </li>
                    <li className="text-muted-foreground">
                      For endurance goals, gradually increase duration before intensity
                    </li>
                    <li className="text-muted-foreground">
                      Take a deload week every 4-6 weeks (reduce volume by 40-50%)
                    </li>
                    <li className="text-muted-foreground">Reassess your program every 8-12 weeks</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 text-lg font-medium">Workout Journal</h3>
              <p className="text-sm text-muted-foreground">
                Consider keeping a workout journal or using a fitness app to track your workouts, nutrition, and
                progress. This will help you stay accountable and make data-driven adjustments to your program.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print workout plan</span>
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Add to calendar</span>
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share workout plan</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper functions to generate workout plan based on user data
function generateWorkoutPlan(formData: WorkoutPlanProps["formData"]): WorkoutDay[] {
  const { fitnessLevel, workoutDays, gymGoal } = formData
  let workoutPlan: WorkoutDay[] = []

  // Generate different plans based on goals and fitness level
  if (gymGoal === "buildMuscle") {
    if (workoutDays <= 3) {
      // Full body routine for fewer workout days
      for (let i = 0; i < workoutDays; i++) {
        workoutPlan.push({
          name: "Full Body Workout",
          focus: "Compound movements with progressive overload",
          exercises: [
            { name: "Barbell Squat", sets: 4, reps: "8-10", rest: "90-120 sec" },
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90-120 sec" },
            { name: "Bent Over Row", sets: 3, reps: "10-12", rest: "60-90 sec" },
            { name: "Overhead Press", sets: 3, reps: "8-10", rest: "60-90 sec" },
            { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90 sec" },
            { name: "Dumbbell Curl", sets: 3, reps: "12-15", rest: "60 sec" },
            { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "60 sec" },
          ],
          cardio: {
            type: "HIIT",
            duration: "10 minutes",
            intensity: "moderate-high",
          },
        })
      }
    } else {
      // Push/Pull/Legs split for more workout days
      const splits = [
        {
          name: "Push Day",
          focus: "Chest, Shoulders, Triceps",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90-120 sec" },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec" },
            { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90 sec" },
            { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
            { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60 sec" },
            { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "60 sec" },
          ],
        },
        {
          name: "Pull Day",
          focus: "Back, Biceps, Rear Delts",
          exercises: [
            { name: "Deadlift", sets: 4, reps: "6-8", rest: "120 sec" },
            { name: "Pull-ups/Lat Pulldown", sets: 4, reps: "8-10", rest: "90 sec" },
            { name: "Bent Over Row", sets: 3, reps: "10-12", rest: "90 sec" },
            { name: "Face Pulls", sets: 3, reps: "12-15", rest: "60 sec" },
            { name: "Barbell Curl", sets: 3, reps: "10-12", rest: "60 sec" },
            { name: "Hammer Curl", sets: 3, reps: "12-15", rest: "60 sec" },
          ],
        },
        {
          name: "Leg Day",
          focus: "Quadriceps, Hamstrings, Calves",
          exercises: [
            { name: "Barbell Squat", sets: 4, reps: "8-10", rest: "120 sec" },
            { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90 sec" },
            { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
            { name: "Walking Lunges", sets: 3, reps: "12 per leg", rest: "60 sec" },
            { name: "Leg Extension", sets: 3, reps: "12-15", rest: "60 sec" },
            { name: "Seated Calf Raise", sets: 4, reps: "15-20", rest: "60 sec" },
          ],
          cardio: {
            type: "Steady State",
            duration: "15-20 minutes",
            intensity: "moderate",
          },
        },
      ]

      // Assign workouts based on available days
      for (let i = 0; i < workoutDays; i++) {
        workoutPlan.push(splits[i % splits.length])
      }
    }
  } else if (gymGoal === "loseWeight") {
    // Create a weight loss focused plan with more cardio
    const workouts = [
      {
        name: "Full Body HIIT",
        focus: "Calorie burning and muscle preservation",
        exercises: [
          { name: "Kettlebell Swing", sets: 3, reps: "15-20", rest: "45 sec" },
          { name: "Goblet Squat", sets: 3, reps: "12-15", rest: "45 sec" },
          { name: "Push-up", sets: 3, reps: "10-15", rest: "45 sec" },
          { name: "Dumbbell Row", sets: 3, reps: "12 per arm", rest: "45 sec" },
          { name: "Mountain Climber", sets: 3, reps: "30 seconds", rest: "30 sec" },
          { name: "Plank", sets: 3, reps: "30-45 seconds", rest: "30 sec" },
        ],
        cardio: {
          type: "HIIT Circuit",
          duration: "20 minutes",
          intensity: "high",
        },
      },
      {
        name: "Lower Body Focus",
        focus: "Leg strength and calorie burning",
        exercises: [
          { name: "Squat", sets: 4, reps: "12-15", rest: "60 sec" },
          { name: "Lunges", sets: 3, reps: "12 per leg", rest: "45 sec" },
          { name: "Leg Press", sets: 3, reps: "15-20", rest: "60 sec" },
          { name: "Glute Bridge", sets: 3, reps: "15-20", rest: "45 sec" },
          { name: "Leg Curl", sets: 3, reps: "12-15", rest: "45 sec" },
          { name: "Calf Raise", sets: 3, reps: "15-20", rest: "30 sec" },
        ],
        cardio: {
          type: "Steady State",
          duration: "25-30 minutes",
          intensity: "moderate-high",
        },
      },
      {
        name: "Upper Body Circuit",
        focus: "Upper body strength and metabolic conditioning",
        exercises: [
          { name: "Dumbbell Bench Press", sets: 3, reps: "12-15", rest: "45 sec" },
          { name: "Bent Over Row", sets: 3, reps: "12-15", rest: "45 sec" },
          { name: "Shoulder Press", sets: 3, reps: "12-15", rest: "45 sec" },
          { name: "Lat Pulldown", sets: 3, reps: "12-15", rest: "45 sec" },
          { name: "Tricep Extension", sets: 3, reps: "15", rest: "30 sec" },
          { name: "Bicep Curl", sets: 3, reps: "15", rest: "30 sec" },
        ],
        cardio: {
          type: "Interval Training",
          duration: "20 minutes",
          intensity: "moderate-high",
        },
      },
      {
        name: "Core and Cardio",
        focus: "Core strength and cardiovascular endurance",
        exercises: [
          { name: "Plank", sets: 3, reps: "45-60 seconds", rest: "30 sec" },
          { name: "Russian Twist", sets: 3, reps: "20 total", rest: "30 sec" },
          { name: "Mountain Climber", sets: 3, reps: "30 seconds", rest: "30 sec" },
          { name: "Bicycle Crunch", sets: 3, reps: "20 total", rest: "30 sec" },
          { name: "Leg Raise", sets: 3, reps: "12-15", rest: "30 sec" },
          { name: "Side Plank", sets: 3, reps: "30 seconds each side", rest: "30 sec" },
        ],
        cardio: {
          type: "Cardio Circuit",
          duration: "30 minutes",
          intensity: "moderate-high",
        },
      },
    ]

    // Assign workouts based on available days
    for (let i = 0; i < workoutDays; i++) {
      workoutPlan.push(workouts[i % workouts.length])
    }
  } else if (gymGoal === "improveEndurance") {
    // Create an endurance-focused plan
    const workouts = [
      {
        name: "Endurance Circuit",
        focus: "Cardiovascular and muscular endurance",
        exercises: [
          { name: "Bodyweight Squat", sets: 3, reps: "20-25", rest: "30 sec" },
          { name: "Push-up", sets: 3, reps: "15-20", rest: "30 sec" },
          { name: "Inverted Row", sets: 3, reps: "15-20", rest: "30 sec" },
          { name: "Walking Lunge", sets: 3, reps: "20 steps total", rest: "30 sec" },
          { name: "Mountain Climber", sets: 3, reps: "45 seconds", rest: "30 sec" },
          { name: "Jumping Jack", sets: 3, reps: "45 seconds", rest: "30 sec" },
        ],
        cardio: {
          type: "Steady State",
          duration: "30-40 minutes",
          intensity: "moderate",
        },
      },
      {
        name: "Interval Training",
        focus: "Aerobic and anaerobic capacity",
        exercises: [
          { name: "Burpee", sets: 4, reps: "10-15", rest: "45 sec" },
          { name: "Box Jump", sets: 4, reps: "12-15", rest: "45 sec" },
          { name: "Battle Rope Wave", sets: 4, reps: "30 seconds", rest: "45 sec" },
          { name: "Kettlebell Swing", sets: 4, reps: "20", rest: "45 sec" },
          { name: "Medicine Ball Slam", sets: 4, reps: "15", rest: "45 sec" },
        ],
        cardio: {
          type: "HIIT",
          duration: "20-25 minutes",
          intensity: "high",
        },
      },
      {
        name: "Strength-Endurance",
        focus: "Muscular endurance with strength elements",
        exercises: [
          { name: "Goblet Squat", sets: 3, reps: "15-20", rest: "45 sec" },
          { name: "Dumbbell Row", sets: 3, reps: "15-20", rest: "45 sec" },
          { name: "Dumbbell Bench Press", sets: 3, reps: "15-20", rest: "45 sec" },
          { name: "Dumbbell Lunge", sets: 3, reps: "12 each leg", rest: "45 sec" },
          { name: "Lateral Raise", sets: 3, reps: "15-20", rest: "45 sec" },
          { name: "Plank", sets: 3, reps: "45-60 seconds", rest: "45 sec" },
        ],
        cardio: {
          type: "Tempo Run",
          duration: "25 minutes",
          intensity: "moderate-high",
        },
      },
      {
        name: "Recovery and Mobility",
        focus: "Active recovery and flexibility",
        exercises: [
          { name: "Bodyweight Squat", sets: 2, reps: "15", rest: "30 sec" },
          { name: "Push-up", sets: 2, reps: "10-15", rest: "30 sec" },
          { name: "Glute Bridge", sets: 2, reps: "15", rest: "30 sec" },
          { name: "Cat-Cow Stretch", sets: 2, reps: "10 cycles", rest: "30 sec" },
          { name: "World's Greatest Stretch", sets: 2, reps: "5 per side", rest: "30 sec" },
          { name: "Foam Rolling", sets: 1, reps: "60 seconds per area", rest: "as needed" },
        ],
        cardio: {
          type: "Light Cardio",
          duration: "20 minutes",
          intensity: "low",
        },
      },
    ]

    // Assign workouts based on available days
    for (let i = 0; i < workoutDays; i++) {
      workoutPlan.push(workouts[i % workouts.length])
    }
  } else if (gymGoal === "increaseStrength") {
    // Create a strength-focused plan
    if (workoutDays <= 3) {
      // Full body approach for fewer workout days
      for (let i = 0; i < workoutDays; i++) {
        workoutPlan.push({
          name: "Full Body Strength",
          focus: "Compound movements with heavy loads",
          exercises: [
            { name: "Barbell Squat", sets: 5, reps: "5", rest: "3 min" },
            { name: "Bench Press", sets: 5, reps: "5", rest: "3 min" },
            { name: "Deadlift", sets: 3, reps: "5", rest: "3-5 min" },
            { name: "Overhead Press", sets: 3, reps: "5", rest: "2-3 min" },
            { name: "Barbell Row", sets: 3, reps: "5", rest: "2-3 min" },
            { name: "Weighted Dip/Chin-up", sets: 3, reps: "5-8", rest: "2 min" },
          ],
          cardio: {
            type: "Recovery",
            duration: "10 minutes",
            intensity: "low",
          },
        })
      }
    } else {
      // Upper/Lower split for more workout days
      const splits = [
        {
          name: "Upper Body Strength",
          focus: "Upper body compound movements",
          exercises: [
            { name: "Bench Press", sets: 5, reps: "5", rest: "3 min" },
            { name: "Overhead Press", sets: 4, reps: "6", rest: "2-3 min" },
            { name: "Barbell Row", sets: 4, reps: "6-8", rest: "2-3 min" },
            { name: "Weighted Pull-up", sets: 3, reps: "6-8", rest: "2 min" },
            { name: "Close Grip Bench Press", sets: 3, reps: "8", rest: "2 min" },
            { name: "Face Pull", sets: 3, reps: "12-15", rest: "90 sec" },
          ],
        },
        {
          name: "Lower Body Strength",
          focus: "Lower body compound movements",
          exercises: [
            { name: "Barbell Squat", sets: 5, reps: "5", rest: "3 min" },
            { name: "Deadlift", sets: 3, reps: "5", rest: "3-5 min" },
            { name: "Leg Press", sets: 3, reps: "8", rest: "2-3 min" },
            { name: "Romanian Deadlift", sets: 3, reps: "8", rest: "2-3 min" },
            { name: "Walking Lunge", sets: 3, reps: "10 per leg", rest: "2 min" },
            { name: "Standing Calf Raise", sets: 4, reps: "10-12", rest: "90 sec" },
          ],
          cardio: {
            type: "Recovery",
            duration: "10 minutes",
            intensity: "low",
          },
        },
      ]

      // Assign workouts based on available days
      for (let i = 0; i < workoutDays; i++) {
        workoutPlan.push(splits[i % splits.length])
      }
    }
  }

  // Adjust difficulty based on fitness level
  if (fitnessLevel === "beginner") {
    workoutPlan = workoutPlan.map((day) => {
      return {
        ...day,
        exercises: day.exercises.map((exercise) => {
          // Reduce volume for beginners
          return {
            ...exercise,
            sets: Math.max(2, exercise.sets - 1),
            rest: exercise.rest.includes("sec") ? Number.parseInt(exercise.rest) + 30 + " sec" : exercise.rest,
          }
        }),
      }
    })
  } else if (fitnessLevel === "advanced") {
    workoutPlan = workoutPlan.map((day) => {
      return {
        ...day,
        exercises: day.exercises.map((exercise) => {
          // Increase volume for advanced
          return {
            ...exercise,
            sets: exercise.sets + 1,
            rest: exercise.rest.includes("sec")
              ? Math.max(30, Number.parseInt(exercise.rest) - 15) + " sec"
              : exercise.rest,
          }
        }),
      }
    })
  }

  return workoutPlan
}

function formatGoal(goal: string): string {
  switch (goal) {
    case "loseWeight":
      return "Weight Loss"
    case "buildMuscle":
      return "Muscle Building"
    case "improveEndurance":
      return "Endurance Improvement"
    case "increaseStrength":
      return "Strength Increase"
    default:
      return goal
  }
}

function getProgramDescription(formData: WorkoutPlanProps["formData"]): string {
  const { fitnessLevel, gymGoal, workoutDays } = formData

  let description = ""

  switch (gymGoal) {
    case "loseWeight":
      description =
        "This program focuses on high-volume training with moderate weights and increased cardio to maximize calorie burn while preserving muscle mass. "
      break
    case "buildMuscle":
      description =
        "This program emphasizes progressive overload with moderate to heavy weights in the 8-12 rep range to stimulate muscle hypertrophy. "
      break
    case "improveEndurance":
      description =
        "This program combines higher-rep resistance training with strategic cardio to improve both muscular and cardiovascular endurance. "
      break
    case "increaseStrength":
      description =
        "This program focuses on heavy compound movements with lower reps to maximize strength gains and neural adaptations. "
      break
  }

  if (workoutDays <= 3) {
    description +=
      "With " +
      workoutDays +
      " training days per week, we've designed a full-body approach to ensure optimal frequency for your goals."
  } else if (workoutDays <= 5) {
    description +=
      "With " +
      workoutDays +
      " training days per week, we've implemented a split routine to allow for sufficient volume and recovery."
  } else {
    description +=
      "With " +
      workoutDays +
      " training days per week, we've created an optimized split routine with strategic recovery days to prevent overtraining."
  }

  return description
}

function getNutritionTips(formData: WorkoutPlanProps["formData"]): {
  macros: string[]
  timing: string[]
  foods: string[]
} {
  const { gymGoal, weight } = formData

  let macros: string[] = []
  let timing: string[] = []
  let foods: string[] = []

  switch (gymGoal) {
    case "loseWeight":
      macros = [
        `Protein: 1.6-2.0g per kg of bodyweight (${Math.round(weight * 1.6)}-${Math.round(weight * 2.0)}g)`,
        "Carbs: 2-3g per kg of bodyweight, focusing on training days",
        "Fats: 0.5-0.8g per kg of bodyweight",
        "Calorie deficit of 300-500 calories below maintenance",
      ]
      timing = [
        "Eat protein with every meal to preserve muscle mass",
        "Time carbs around workouts for better performance",
        "Consider intermittent fasting if it suits your schedule",
        "Eat most of your carbs earlier in the day or around workouts",
      ]
      foods = [
        "Lean proteins: chicken breast, turkey, white fish, egg whites, low-fat dairy",
        "Complex carbs: sweet potatoes, brown rice, quinoa, oats",
        "Healthy fats: avocado, olive oil, nuts in moderation",
        "Plenty of fibrous vegetables to increase satiety",
      ]
      break
    case "buildMuscle":
      macros = [
        `Protein: 1.8-2.2g per kg of bodyweight (${Math.round(weight * 1.8)}-${Math.round(weight * 2.2)}g)`,
        "Carbs: 4-7g per kg of bodyweight",
        "Fats: 0.8-1g per kg of bodyweight",
        "Calorie surplus of 300-500 calories above maintenance",
      ]
      timing = [
        "Eat protein every 3-4 hours to maximize muscle protein synthesis",
        "Consume 20-40g of protein post-workout",
        "Include carbs and protein before and after training",
        "Consider a slow-digesting protein before bed (casein)",
      ]
      foods = [
        "Complete proteins: chicken, beef, eggs, fish, whey protein",
        "Carb sources: rice, potatoes, pasta, oats, fruits",
        "Healthy fats: nuts, avocados, olive oil, fatty fish",
        "Calorie-dense foods: nut butters, dried fruits, whole milk",
      ]
      break
    case "improveEndurance":
      macros = [
        `Protein: 1.4-1.6g per kg of bodyweight (${Math.round(weight * 1.4)}-${Math.round(weight * 1.6)}g)`,
        "Carbs: 5-8g per kg of bodyweight",
        "Fats: 1-1.5g per kg of bodyweight",
        "Maintenance calories with potential increase on heavy training days",
      ]
      timing = [
        "Consume carbs before, during (if sessions exceed 60 minutes), and after workouts",
        "Eat a carb-rich meal 2-3 hours before endurance training",
        "Consider a small protein/carb snack 30-60 minutes post-workout",
        "Stay hydrated throughout the day and during workouts",
      ]
      foods = [
        "Quality carbs: whole grains, fruits, starchy vegetables",
        "Lean proteins: chicken, fish, tofu, legumes",
        "Anti-inflammatory foods: berries, fatty fish, nuts, leafy greens",
        "Electrolyte-rich foods: bananas, sweet potatoes, yogurt",
      ]
      break
    case "increaseStrength":
      macros = [
        `Protein: 1.8-2.2g per kg of bodyweight (${Math.round(weight * 1.8)}-${Math.round(weight * 2.2)}g)`,
        "Carbs: 4-6g per kg of bodyweight",
        "Fats: 0.8-1.2g per kg of bodyweight",
        "Slight calorie surplus of 200-300 calories above maintenance",
      ]
      timing = [
        "Consume protein every 3-4 hours throughout the day",
        "Eat a balanced meal 1-2 hours before training",
        "Consider intra-workout carbs for longer sessions",
        "Post-workout nutrition within 1-2 hours focusing on protein and carbs",
      ]
      foods = [
        "Complete proteins: eggs, meat, dairy, fish",
        "Nutrient-dense carbs: oats, rice, potatoes, whole grains",
        "Healthy fats: nuts, seeds, avocados, olive oil",
        "Micronutrient-rich foods: colorful vegetables, fruits, organ meats",
      ]
      break
  }

  return { macros, timing, foods }
}
