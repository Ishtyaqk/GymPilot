"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Salad } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { generateCaloriePlan } from "@/app/actions"

const formSchema = z.object({
  age: z.coerce.number().min(13).max(100),
  gender: z.enum(["male", "female", "other"]),
  height: z.coerce.number().min(120).max(250),
  weight: z.coerce.number().min(30).max(250),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "athlete"]),
  goal: z.enum(["lose", "maintain", "gain"]),
  dietaryPrefs: z.string().optional(),
  mealsPerDay: z.coerce.number().min(2).max(6),
})

export function CalorieForm() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: "male",
      height: 170,
      weight: 70,
      activityLevel: "moderate",
      goal: "maintain",
      dietaryPrefs: "",
      mealsPerDay: 3,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await generateCaloriePlan(values)
      if (res.success) {
        setResult(res.plan)
      } else {
        setError(res.error || "Something went wrong. Please try again.")
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Salad className="h-6 w-6 text-emerald-400" />
          <span>Calorie & Meal Plan</span>
        </CardTitle>
        <CardDescription className="text-zinc-300">
          Get calories, macros, and a simple meal outline tailored to you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {result && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm">
            <div className="prose prose-invert max-w-none text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 text-white border border-zinc-700">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other / Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500"
                      />
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
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 text-white border border-zinc-700">
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Lightly Active</SelectItem>
                      <SelectItem value="moderate">Moderately Active</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="athlete">Athlete</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 text-white border border-zinc-700">
                      <SelectItem value="lose">Lose Fat</SelectItem>
                      <SelectItem value="maintain">Maintain</SelectItem>
                      <SelectItem value="gain">Gain Muscle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="mealsPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meals Per Day</FormLabel>
                    <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500"
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dietaryPrefs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences / Restrictions</FormLabel>
                    <FormControl>
                    <Textarea
                      placeholder="e.g., vegetarian, halal, lactose-free"
                      {...field}
                      className="resize-none bg-zinc-900 text-white border border-zinc-700 placeholder:text-zinc-400 focus:ring-orange-500 focus:border-orange-500"
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Plan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

