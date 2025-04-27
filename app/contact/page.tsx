import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import SynergySquaresLogo from "@/components/synergy-squares-logo"
import { Home } from "lucide-react"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us - Synergy Squares",
  description: "Get in touch with the Synergy Squares team for support, feedback, or business inquiries.",
  keywords: [
    "contact",
    "support",
    "help",
    "feedback",
    "bingo game",
    "synergy squares",
    "customer service",
    "get in touch",
  ],
}

export default function ContactPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container mx-auto flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <SynergySquaresLogo className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Synergy Squares</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="outline" size="icon" className="btn-hover-effect" title="Back to home">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="mb-8 text-muted-foreground">
              Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below and our
              team will get back to you as soon as possible.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ContactForm />
              </div>
              <div className="bg-accent/5 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">support@synergysquares.com</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9am - 5pm EST</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Follow Us</h3>
                    <div className="flex space-x-4 mt-2">
                      <a href="#" className="text-accent hover:text-accent/80">
                        Twitter
                      </a>
                      <a href="#" className="text-accent hover:text-accent/80">
                        LinkedIn
                      </a>
                      <a href="#" className="text-accent hover:text-accent/80">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">How do I create a custom bingo game?</h3>
                      <p className="text-muted-foreground">
                        Sign in, click "Start Playing", then create a new game and customize it in the settings.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Can I play with my team remotely?</h3>
                      <p className="text-muted-foreground">
                        Yes! Generate a game token in the settings and share it with your team members.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Is Synergy Squares free to use?</h3>
                      <p className="text-muted-foreground">
                        Yes, Synergy Squares is currently free to use with all core features available.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      </div>
    </ThemeProvider>
  )
}
