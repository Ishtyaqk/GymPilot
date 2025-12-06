"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, Apple } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-emerald-400" />
          <span className="text-xl font-bold text-white">GymPilot</span>
        </Link>

        <nav className="flex items-center space-x-1">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              pathname === "/"
                ? "bg-zinc-800 text-white"
                : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
            )}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Workout</span>
          </Link>

          <Link
            href="/calorie-tracker"
            className={cn(
              "flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              pathname === "/calorie-tracker"
                ? "bg-zinc-800 text-white"
                : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
            )}
          >
            <Apple className="h-4 w-4" />
            <span>Calories</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
