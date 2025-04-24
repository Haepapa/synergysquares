"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import IntroductionScreen from "@/components/introduction-screen"
import GameDashboard from "@/components/game-dashboard"
import { AuthProvider } from "@/context/auth-context"
import { GameProvider } from "@/context/game-context"
import { toast } from "sonner"

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false)
  const router = useRouter()

  // Check if user has previously started the app
  useEffect(() => {
    const hasStartedBefore = localStorage.getItem("bingo-has-started")
    if (hasStartedBefore === "true") {
      setHasStarted(true)
    }
  }, [])

  const handleStart = () => {
    localStorage.setItem("bingo-has-started", "true")
    setHasStarted(true)
    toast.success("Welcome to Synergy Squares!", {
      description: "Create a new game or join an existing one to get started.",
    })
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <GameProvider>
          <main className="min-h-screen bg-background">
            {!hasStarted ? <IntroductionScreen onStart={handleStart} /> : <GameDashboard />}
          </main>
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
