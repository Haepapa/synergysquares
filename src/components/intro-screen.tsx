import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Settings, Grid3X3, Users, Palette } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface IntroScreenProps {
  onStartPlaying: () => void
}

export function IntroScreen({ onStartPlaying }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] p-4 md:p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-3xl w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="text-primary">Bingo Creator</span>
            </h1>
            <p className="text-lg text-muted-foreground">Create, customize, and play bingo games for any occasion</p>
          </div>
          <Button size="lg" onClick={onStartPlaying} className="px-6 py-5 text-lg whitespace-nowrap">
            <Play className="mr-2 h-5 w-5" />
            Start Playing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="transition-all duration-200 hover:scale-105">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-full">
                  <Palette className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Fully Customizable</h2>
              </div>
              <p className="text-muted-foreground">
                Create bingo boards with your own content, colors, and sizes. Perfect for classroom activities,
                team-building exercises, or game nights.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-105">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-full">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Multiplayer Ready</h2>
              </div>
              <p className="text-muted-foreground">
                Host games and invite friends to join with a simple code. Track who gets bingo first and make your
                events more interactive.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-105">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-full">
                  <Grid3X3 className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Flexible Layouts</h2>
              </div>
              <p className="text-muted-foreground">
                Choose from different board sizes (3×3 to 9×9) to match your needs. The classic 5×5 with a FREE center
                space is just the beginning.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-105">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-full">
                  <Settings className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Easy to Use</h2>
              </div>
              <p className="text-muted-foreground">
                Simple interface with real-time preview. Configure your game, add your content, and start playing in
                seconds.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Get Started</h2>
          <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
            <li>
              Click the <strong>Start Playing</strong> button to create your first game
            </li>
            <li>Use the settings gear icon to customize your board (size, color, content)</li>
            <li>Add your own text for each bingo square</li>
            <li>
              When you're ready, click <strong>Start Game</strong> to begin playing
            </li>
            <li>Click on squares to mark them as the items are called or completed</li>
          </ol>
        </div>

        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={onStartPlaying} className="px-8 py-6 text-lg">
            <Play className="mr-2 h-5 w-5" />
            Start Playing
          </Button>
        </div>
      </div>
    </div>
  )
}
