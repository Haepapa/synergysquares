"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { UserCircle, CheckCircle, Users, Zap, Palette } from "lucide-react"
import AuthDialog from "@/components/auth-dialog"
import { useAuth } from "@/context/auth-context"
import SynergySquaresLogo from "@/components/synergy-squares-logo"
import AccountDialog from "@/components/account-dialog"
import { toast } from "sonner"

export default function IntroductionScreen() {
  const router = useRouter()
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

  const handleStart = () => {
    localStorage.setItem("bingo-has-started", "true")
    router.push("/play")
    toast.success("Welcome to Synergy Squares!", {
      description: "Create a new game or join an existing one to get started.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <SynergySquaresLogo className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Synergy Squares</h1>
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
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Make Meetings Fun with <span className="text-accent">Synergy Squares</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
              Create custom bingo games for meetings, team building, events, and more. Play online with colleagues and
              friends in real-time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg" onClick={handleStart}>
                Start Playing Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg btn-hover-effect"
                onClick={() => handleAuthClick("signup")}
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Synergy Squares?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-accent/20">
                <CardHeader>
                  <Palette className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>Customizable Boards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create your own bingo boards with custom content, colors, and sizes. Choose from our presets or make
                    your own.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Users className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>Multiplayer Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Play together with your team in real-time. Share your game with a simple token and track everyone's
                    progress.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Zap className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>No Installation Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Works in your browser on any device. No downloads or installations required - just create and play!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-accent/10 rounded-full p-4 mb-4">
                  <span className="text-2xl font-bold text-accent">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Board</h3>
                <p>Choose a template or create your own custom bingo board with your content.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-accent/10 rounded-full p-4 mb-4">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Share With Others</h3>
                <p>Generate a game token and share it with friends or colleagues to join your game.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-accent/10 rounded-full p-4 mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Play Together</h3>
                <p>Mark squares as they happen and be the first to get a winning pattern!</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-accent hover:bg-accent/90" onClick={handleStart}>
                Get Started Now
              </Button>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Team Meetings</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Virtual Events</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Team Building</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Conferences</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Classrooms</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Training Sessions</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Family Gatherings</h3>
              </Card>

              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Watch Parties</h3>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Meetings More Engaging?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of teams who use Synergy Squares to make their meetings more fun and interactive.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg" onClick={handleStart}>
              Start Playing For Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <SynergySquaresLogo className="h-6 w-6" />
              <span className="font-semibold">Synergy Squares</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-accent">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent">
                Contact
              </Link>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Synergy Squares. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

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
