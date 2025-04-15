import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { X } from "lucide-react"
import type { Game } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface GameControlsProps {
  game: Game
  onUpdateGame: (updates: Partial<Game>) => void
  onLeaveGame: () => void
  onClose: () => void
}

export function GameControls({ game, onUpdateGame, onLeaveGame, onClose }: GameControlsProps) {
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)

  const handleLeaveGame = () => {
    onLeaveGame()
    onClose()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">Game Controls</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Game Status</h3>
          <p className="text-sm text-muted-foreground">
            {game.isStarted ? "Game is in progress" : "Game is not started yet"}
          </p>

          {game.isStarted ? (
            <Button variant="outline" className="w-full mt-2" onClick={() => onUpdateGame({ isStarted: false })}>
              Pause Game
            </Button>
          ) : (
            <Button variant="outline" className="w-full mt-2" onClick={() => onUpdateGame({ isStarted: true })}>
              Resume Game
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Game Management</h3>
          <p className="text-sm text-muted-foreground">
            Leaving the game will delete all game data. This action cannot be undone.
          </p>

          <Button
            variant="destructive"
            className="w-full mt-2"
            onClick={() => setShowLeaveConfirmation(true)}
            disabled={!game.isStarted}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Leave Game
          </Button>
        </div>
      </div>

      {/* Leave Game Confirmation Dialog */}
      <AlertDialog open={showLeaveConfirmation} onOpenChange={setShowLeaveConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the current game and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGame}>Leave Game</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
