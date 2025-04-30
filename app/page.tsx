import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import IntroductionScreen from "@/components/introduction-screen";
import { AuthProvider } from "@/context/auth-context";
import { GameProvider } from "@/context/game-context";

export const metadata: Metadata = {
  title: "Synergy Squares - The Ultimate Bingo Game for Teams and Events",
  description:
    "Create custom bingo games for meetings, team building, events, and more. Play online with colleagues and friends in real-time.",
  keywords: [
    "bingo game",
    "team building",
    "meeting bingo",
    "virtual bingo",
    "custom bingo",
    "online bingo",
    "multiplayer bingo",
  ],
  openGraph: {
    title: "Synergy Squares - The Ultimate Bingo Game for Teams and Events",
    description:
      "Create custom bingo games for meetings, team building, events, and more. Play online with colleagues and friends in real-time.",
    type: "website",
    url: "https://synergysquares.com",
  },
};

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <GameProvider>
          <main className="min-h-screen bg-background">
            <IntroductionScreen />
          </main>
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
