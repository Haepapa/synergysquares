"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import GameDashboard from "@/components/game-dashboard"
import { AuthProvider } from "@/context/auth-context"
import { GameProvider } from "@/context/game-context"
import { toast } from "sonner"

export default function PlayPage() {
  const router = useRouter()

  // Check if user has previously started the app
  useEffect(() => {
    const hasStartedBefore = localStorage.getItem("bingo-has-started")
    if (hasStartedBefore !== "true") {
      // If user hasn't started before, redirect to intro page
      router.push("/")
      toast.info("Welcome to Synergy Squares!", {
        description: "Please start from the home page to learn about the game.",
      })
    } else {
      // User has started before, show welcome back message
      toast.success("Welcome back to Synergy Squares!", {
        description: "Create a new game or continue where you left off.",
      })
    }
  }, [router])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <GameProvider>
          <main className="min-h-screen bg-background">
            <GameDashboard />
          </main>
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
