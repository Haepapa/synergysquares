import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import SynergySquaresLogo from "@/components/synergy-squares-logo"
import { Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy - Synergy Squares",
  description: "Privacy Policy for Synergy Squares, the ultimate bingo game for teams and events.",
  keywords: [
    "privacy policy",
    "data protection",
    "bingo game",
    "synergy squares",
    "user privacy",
    "personal information",
  ],
}

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                At Synergy Squares, we respect your privacy and are committed to protecting your personal data. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                website, application, and services (collectively, the "Service").
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
                please do not access the Service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our Service, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Personal Data:</strong> Personal Data means data about a living individual who can be
                  identified from those data. We may collect your name, email address, and other contact information
                  when you create an account or contact us.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect information on how the Service is accessed and used. This
                  may include your computer's Internet Protocol address, browser type, browser version, the pages of our
                  Service that you visit, the time and date of your visit, the time spent on those pages, and other
                  diagnostic data.
                </li>
                <li>
                  <strong>Game Data:</strong> We collect information related to the bingo games you create, including
                  game settings, content, and participation data.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Notify you about changes to our Service</li>
                <li>Allow you to participate in interactive features of our Service</li>
                <li>Provide customer support</li>
                <li>Monitor the usage of our Service</li>
                <li>Detect, prevent and address technical issues</li>
                <li>
                  Provide you with news, special offers and general information about other goods, services and events
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Storage and Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the
                Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
              <p>
                Your data is stored securely using Appwrite, a secure backend server for web and mobile applications. We
                implement appropriate technical and organizational measures to ensure a level of security appropriate to
                the risk.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
              <p>
                We will retain your Personal Data only for as long as is necessary for the purposes set out in this
                Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our
                legal obligations, resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p>
                We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a
                shorter period of time, except when this data is used to strengthen the security or to improve the
                functionality of our Service, or we are legally obligated to retain this data for longer time periods.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclosure of Data</h2>
              <p>We may disclose your Personal Data in the following situations:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>To Service Providers:</strong> We may share your information with third-party service
                  providers to perform tasks on our behalf and to assist us in providing the Service.
                </li>
                <li>
                  <strong>For Business Transfers:</strong> We may share or transfer your information in connection with,
                  or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                  portion of our business to another company.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose
                  with your consent.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law
                  or in response to valid requests by public authorities.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Data Protection Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The right to access, update or delete the information we have on you</li>
                <li>
                  The right of rectification - the right to have your information corrected if it is inaccurate or
                  incomplete
                </li>
                <li>The right to object to our processing of your Personal Data</li>
                <li>
                  The right of restriction - the right to request that we restrict the processing of your personal
                  information
                </li>
                <li>
                  The right to data portability - the right to be provided with a copy of your Personal Data in a
                  structured, machine-readable format
                </li>
                <li>
                  The right to withdraw consent at any time where we relied on your consent to process your personal
                  information
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain
                information. Cookies are files with a small amount of data which may include an anonymous unique
                identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                identifiable information from anyone under the age of 13. If you are a parent or guardian and you are
                aware that your child has provided us with Personal Data, please contact us.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please{" "}
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
