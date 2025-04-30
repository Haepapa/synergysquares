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

  // Reduce welcome toasts on play page
  useEffect(() => {
    const hasStartedBefore = localStorage.getItem("bingo-has-started")
    if (hasStartedBefore !== "true") {
      // If user hasn't started before, redirect to intro page
      router.push("/")
      // Keep this toast as it's important for user navigation
      toast.info("Welcome to Synergy Squares!", {
        description: "Please start from the home page to learn about the game.",
      })
    } else {
      // Remove the welcome back toast - not a key milestone
      // toast.success("Welcome back to Synergy Squares!", {
      //   description: "Create a new game or continue where you left off.",
      // })
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
