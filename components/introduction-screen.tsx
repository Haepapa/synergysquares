"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle } from "lucide-react"
import AuthDialog from "@/components/auth-dialog"
import { useAuth } from "@/context/auth-context"
import SynergySquaresLogo from "@/components/synergy-squares-logo"
import AccountDialog from "@/components/account-dialog"
import { toast } from "sonner"

interface IntroductionScreenProps {
  onStart: () => void
}

export default function IntroductionScreen({ onStart }: IntroductionScreenProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { user, logout } = useAuth()
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setShowAuthDialog(true)
  }

  const handleLogout = useCallback(() => {
    logout()
    setShowAccountMenu(false)
    toast.success("Logged out successfully")
  }, [logout])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center space-x-2">
          <SynergySquaresLogo className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Synergy Squares</h1>
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="icon"
            className="btn-hover-effect"
            onClick={() => (user ? setShowAccountMenu(true) : handleAuthClick("login"))}
            title={user ? "Account options" : "Login or sign up"}
          >
            <UserCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Synergy Squares!</CardTitle>
          <CardDescription>Create, customize, and play bingo games individually or with others.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Customize your boards, play with friends, and have fun!</p>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={onStart}>
            Start Playing
          </Button>
        </CardFooter>
      </Card>

      {showAccountMenu && user && (
        <div className="absolute right-4 top-16 w-48 bg-background border rounded-md shadow-md z-50 overflow-hidden">
          <div className="p-2 border-b">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => {
                setShowAccountDialog(true)
                setShowAccountMenu(false)
              }}
            >
              Preferences
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-red-500 hover:text-red-600"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      )}

      {showAuthDialog && (
        <AuthDialog
          mode={authMode}
          onClose={() => setShowAuthDialog(false)}
          onModeChange={(mode) => setAuthMode(mode)}
        />
      )}

      {showAccountDialog && <AccountDialog onClose={() => setShowAccountDialog(false)} />}
    </div>
  )
}
