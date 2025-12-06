"use client"

import { useRef } from "react"
import { ArrowLeft, Printer } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CalorieResultsProps {
  caloriePlan: string
  onReset: () => void
}

export function CalorieResults({ caloriePlan, onReset }: CalorieResultsProps) {
  const resultRef = useRef<HTMLDivElement>(null)

  const printPlan = () => {
    window.print()
  }

  return (
    <Card className="w-full bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md rounded-2xl text-white font-sans">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-white font-bold">Your Personalized Calorie Plan</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="bg-white text-black font-semibold border-zinc-200 hover:bg-zinc-100 hover:text-black shadow"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={resultRef} className="mt-4 space-y-4 custom-markdown">
          <Markdown remarkPlugins={[remarkGfm]}>{caloriePlan}</Markdown>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-zinc-800 p-6">
        <Button
          variant="outline"
          onClick={onReset}
          className="bg-white text-black font-semibold border-zinc-200 hover:bg-zinc-100 hover:text-black shadow"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={printPlan}
            title="Print calorie plan"
            className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print calorie plan</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
