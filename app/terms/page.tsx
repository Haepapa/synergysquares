import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import SynergySquaresLogo from "@/components/synergy-squares-logo"
import { Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service - Synergy Squares",
  description: "Terms of Service for Synergy Squares, the ultimate bingo game for teams and events.",
  keywords: ["terms of service", "legal", "bingo game", "synergy squares", "user agreement", "terms and conditions"],
}

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Synergy Squares. These Terms of Service ("Terms") govern your use of the Synergy Squares
                website, application, and services (collectively, the "Service") operated by Synergy Squares ("we,"
                "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you
                disagree with any part of the Terms, you may not access the Service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of the Service</h2>
              <p>
                Synergy Squares provides an online platform for creating, customizing, and playing bingo games
                individually or with others. You are responsible for maintaining the confidentiality of your account and
                password and for restricting access to your computer or device. You agree to accept responsibility for
                all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
              <p>
                Our Service allows you to create, post, link, store, share and otherwise make available certain
                information, text, graphics, or other material ("Content"). You are responsible for the Content that you
                post to the Service, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting Content to the Service, you grant us the right to use, modify, publicly perform, publicly
                display, reproduce, and distribute such Content on and through the Service. You retain any and all of
                your rights to any Content you submit, post, or display on or through the Service and you are
                responsible for protecting those rights.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Prohibited Uses</h2>
              <p>You agree not to use the Service:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>
                  To transmit, or procure the sending of, any advertising or promotional material, including any "junk
                  mail," "chain letter," "spam," or any other similar solicitation.
                </li>
                <li>
                  To impersonate or attempt to impersonate Synergy Squares, a Synergy Squares employee, another user, or
                  any other person or entity.
                </li>
                <li>
                  To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or
                  which, as determined by us, may harm Synergy Squares or users of the Service or expose them to
                  liability.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding Content provided by users), features, and functionality
                are and will remain the exclusive property of Synergy Squares and its licensors. The Service is
                protected by copyright, trademark, and other laws of both the United States and foreign countries. Our
                trademarks and trade dress may not be used in connection with any product or service without the prior
                written consent of Synergy Squares.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use
                the Service will immediately cease. If you wish to terminate your account, you may simply discontinue
                using the Service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                In no event shall Synergy Squares, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct
                or content of any third party on the Service; (iii) any content obtained from the Service; and (iv)
                unauthorized access, use or alteration of your transmissions or content, whether based on warranty,
                contract, tort (including negligence) or any other legal theory, whether or not we have been informed of
                the possibility of such damage.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
                basis. The Service is provided without warranties of any kind, whether express or implied, including,
                but not limited to, implied warranties of merchantability, fitness for a particular purpose,
                non-infringement or course of performance.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without
                regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days' notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion. By continuing to
                access or use our Service after those revisions become effective, you agree to be bound by the revised
                terms.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  contact us
                </Link>
                .
              </p>
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
