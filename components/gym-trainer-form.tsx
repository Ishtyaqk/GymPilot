"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dumbbell, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { WorkoutPlan } from "@/components/workout-plan"

const formSchema = z.object({
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  height: z.coerce.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30kg").max(250, "Weight must be less than 250kg"),
  goalWeight: z.coerce
    .number()
    .min(30, "Goal weight must be at least 30kg")
    .max(250, "Goal weight must be less than 250kg"),
  workoutDays: z.coerce.number().min(1, "Must work out at least 1 day").max(7, "Cannot exceed 7 days"),
  gymGoal: z.enum(["loseWeight", "buildMuscle", "improveEndurance", "increaseStrength"]),
})

export function GymTrainerForm() {
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessLevel: "beginner",
      height: 170,
      weight: 70,
      goalWeight: 70,
      workoutDays: 3,
      gymGoal: "buildMuscle",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormData(values)
    setShowResults(true)
  }

  function handleReset() {
    setShowResults(false)
  }

  if (showResults && formData) {
    return <WorkoutPlan formData={formData} onReset={handleReset} />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-emerald-500" />
          <span>Create Your Workout Plan</span>
        </CardTitle>
        <CardDescription>
          Fill in your details to get a personalized workout routine tailored to your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Fitness Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="beginner" />
                        </FormControl>
                        <FormLabel className="font-normal">Beginner</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intermediate" />
                        </FormControl>
                        <FormLabel className="font-normal">Intermediate</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="advanced" />
                        </FormControl>
                        <FormLabel className="font-normal">Advanced</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="goalWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workoutDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Days Per Week: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={7}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>How many days can you commit to working out?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gymGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary fitness goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="loseWeight">Lose Weight</SelectItem>
                      <SelectItem value="buildMuscle">Build Muscle</SelectItem>
                      <SelectItem value="improveEndurance">Improve Endurance</SelectItem>
                      <SelectItem value="increaseStrength">Increase Strength</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Generate Workout Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
