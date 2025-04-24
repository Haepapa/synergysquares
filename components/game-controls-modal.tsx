"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/game-context"
import { useToast } from "@/hooks/use-toast"
import type { Game } from "@/types/game"
import { Play, Pause, RotateCcw, AlertTriangle } from "lucide-react"

interface GameControlsModalProps {
  game: Game
  onClose: () => void
  onRemove: () => void
}

export default function GameControlsModal({ game, onClose, onRemove }: GameControlsModalProps) {
  const { updateGame } = useGame()
  const { toast } = useToast()

  const handleStartGame = () => {
    if (game.cells.some((cell) => !cell.content)) {
      toast({
        title: "Incomplete board",
        description: "Some cells are empty. Please fill all cells in the settings.",
        variant: "destructive",
      })
      return
    }

    updateGame({
      ...game,
      status: "playing",
      startTime: new Date().toISOString(),
    })

    onClose()
  }

  const handlePauseGame = () => {
    updateGame({
      ...game,
      status: "paused",
    })
    onClose()
  }

  const handleResumeGame = () => {
    updateGame({
      ...game,
      status: "playing",
    })
    onClose()
  }

  const handleResetGame = () => {
    const updatedCells = game.cells.map((cell) => ({
      ...cell,
      marked: false,
    }))

    updateGame({
      ...game,
      status: "not_started",
      cells: updatedCells,
      winningPatterns: [],
      startTime: null,
    })

    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Game Controls</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-muted">
            <h3 className="font-medium">Game Status</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                Status:{" "}
                <span className="font-medium text-foreground">
                  {game.status === "playing" ? "Playing" : game.status === "paused" ? "Paused" : "Not Started"}
                </span>
              </p>
              {game.startTime && (
                <p>
                  Started:{" "}
                  <span className="font-medium text-foreground">{new Date(game.startTime).toLocaleString()}</span>
                </p>
              )}
              <p>
                Winning patterns: <span className="font-medium text-foreground">{game.winningPatterns.length}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {game.status === "not_started" && (
              <Button className="col-span-2 btn-hover-effect" onClick={handleStartGame}>
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            )}

            {game.status === "playing" && (
              <Button onClick={handlePauseGame} className="btn-hover-effect">
                <Pause className="w-4 h-4 mr-2" />
                Pause Game
              </Button>
            )}

            {game.status === "paused" && (
              <Button onClick={handleResumeGame} className="btn-hover-effect">
                <Play className="w-4 h-4 mr-2" />
                Resume Game
              </Button>
            )}

            {(game.status === "playing" || game.status === "paused") && (
              <Button variant="outline" onClick={handleResetGame} className="btn-hover-effect">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
              </Button>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button variant="destructive" className="w-full" onClick={onRemove}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Remove Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
