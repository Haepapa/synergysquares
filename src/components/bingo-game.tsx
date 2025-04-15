"use client"

import { useState, useEffect } from "react"
import { BingoBoard } from "./bingo-board"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Confetti } from "./confetti"
import { useGameContext } from "@/context/game-context"
import { Settings, GamepadIcon, Users } from "lucide-react"
import { GameSettings } from "./game-settings"
import { GameControls } from "./game-controls"
import type { Game, WinningCombination } from "@/lib/types"
import { toast } from "sonner"
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "./tooltip"

interface BingoGameProps {
  game: Game
  username: string
  onUpdateGame: (updates: Partial<Game>) => void
  onStartGame: () => void
  onHostGame: () => void
  onJoinGame: (token: string) => void
  onLeaveGame: () => void
  onUsernameChange: (username: string) => void
  showSettings?: boolean
  onSettingsChange: (show: boolean) => void
  showPlayerList?: boolean
  onPlayerListChange: (show: boolean) => void
  showConfigureTooltip?: boolean
}

export function BingoGame({
  game,
  username,
  onUpdateGame,
  onStartGame,
  onHostGame,
  onJoinGame,
  onLeaveGame,
  onUsernameChange,
  showSettings = false,
  onSettingsChange,
  showPlayerList = false,
  onPlayerListChange,
  showConfigureTooltip = false,
}: BingoGameProps) {
  const [hasWon, setHasWon] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const { syncGameState } = useGameContext()

  // Check for win after each move
  useEffect(() => {
    if (game.isStarted && game.selectedCells.length > 0) {
      const winningLines = checkForWin(game.selectedCells, game.boardSize)

      if (winningLines.length > 0 && !hasWon) {
        setHasWon(true)
        setShowConfetti(true)

        // Add the winning combination to the game state
        const newWinningCombination: WinningCombination = {
          playerId: "self",
          playerName: username,
          lines: winningLines,
          timestamp: new Date().toISOString(),
        }

        const updatedWinningCombinations = [...(game.winningCombinations || []), newWinningCombination]

        onUpdateGame({ winningCombinations: updatedWinningCombinations })

        // In a real app, this would sync with other players
        syncGameState(game.id, {
          winningCombinations: updatedWinningCombinations,
        })

        toast.success("BINGO!", {
          description: "Congratulations! You've got a bingo!",
        })

        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      }
    } else {
      setHasWon(false)
    }
  }, [
    game.selectedCells,
    game.boardSize,
    game.isStarted,
    game.id,
    game.winningCombinations,
    hasWon,
    onUpdateGame,
    syncGameState,
    username,
  ])

  const toggleCell = (index: number) => {
    // Don't allow toggling if game hasn't started
    if (!game.isStarted) return

    // Don't allow toggling the center cell in odd-sized boards
    if (game.boardSize % 2 === 1 && index === Math.floor(game.bingoValues.length / 2)) {
      return
    }

    const newSelectedCells = [...game.selectedCells]
    newSelectedCells[index] = !newSelectedCells[index]
    onUpdateGame({ selectedCells: newSelectedCells })

    // In a real app, this would sync with other players
    syncGameState(game.id, { selectedCells: newSelectedCells })
  }

  // Function to check for bingo wins
  const checkForWin = (selectedCells: boolean[], size: number): string[] => {
    // Create a copy of the selected cells array to work with
    const cellsToCheck = [...selectedCells]

    // Automatically mark the center cell as selected if it's an odd-sized board
    if (size % 2 === 1) {
      const centerIndex = Math.floor(cellsToCheck.length / 2)
      cellsToCheck[centerIndex] = true
    }

    const winningLines: string[] = []

    // Check rows
    for (let row = 0; row < size; row++) {
      let rowComplete = true
      for (let col = 0; col < size; col++) {
        const index = row * size + col
        if (!cellsToCheck[index]) {
          rowComplete = false
          break
        }
      }
      if (rowComplete) winningLines.push(`row-${row}`)
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      let colComplete = true
      for (let row = 0; row < size; row++) {
        const index = row * size + col
        if (!cellsToCheck[index]) {
          colComplete = false
          break
        }
      }
      if (colComplete) winningLines.push(`col-${col}`)
    }

    // Check diagonal (top-left to bottom-right)
    let diag1Complete = true
    for (let i = 0; i < size; i++) {
      const index = i * size + i
      if (!cellsToCheck[index]) {
        diag1Complete = false
        break
      }
    }
    if (diag1Complete) winningLines.push("diag-1")

    // Check diagonal (top-right to bottom-left)
    let diag2Complete = true
    for (let i = 0; i < size; i++) {
      const index = i * size + (size - 1 - i)
      if (!cellsToCheck[index]) {
        diag2Complete = false
        break
      }
    }
    if (diag2Complete) winningLines.push("diag-2")

    // Check four corners
    if (size >= 3) {
      const topLeft = 0
      const topRight = size - 1
      const bottomLeft = size * (size - 1)
      const bottomRight = size * size - 1

      if (cellsToCheck[topLeft] && cellsToCheck[topRight] && cellsToCheck[bottomLeft] && cellsToCheck[bottomRight]) {
        winningLines.push("corners")
      }
    }

    return winningLines
  }

  return (
    <div className="mx-auto max-w-2xl relative">
      {showConfetti && <Confetti />}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{game.name}</h1>

        {/* Vertical stack of control icons */}
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <TooltipRoot open={showConfigureTooltip && !showSettings}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSettingsChange(!showSettings)}
                  className={`rounded-full ${showConfigureTooltip && !showSettings ? "animate-pulse ring-2 ring-primary" : ""}`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium">
                Configure Your Game
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>

          <Button variant="outline" size="icon" onClick={() => setShowControls(!showControls)} className="rounded-full">
            <GamepadIcon className="h-4 w-4" />
          </Button>

          {game.isHosted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPlayerListChange(!showPlayerList)}
              className="rounded-full"
            >
              <Users className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {game.isHosted && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-medium">Game Token: {game.token}</h3>
                <p className="text-sm text-muted-foreground">Share this token with friends to play together</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Game expires in {new Date(game.expiresAt).toLocaleTimeString()} (
                  {new Date(game.expiresAt).toLocaleDateString()})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!game.isStarted && (
        <div className="text-center mb-6">
          {!game.hasBeenConfigured ? (
            <p className="text-muted-foreground mb-4">
              {showConfigureTooltip
                ? "Click the settings icon to configure your game before playing."
                : "Configure your game settings by clicking the gear icon, then start playing."}
            </p>
          ) : (
            <div className="p-3 bg-muted rounded-md border border-border">
              <p className="font-medium">Game Paused</p>
              <p className="text-sm text-muted-foreground">Resume the game from the game controls.</p>
            </div>
          )}
        </div>
      )}

      {/* Game Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <GameSettings
              game={game}
              onUpdateGame={onUpdateGame}
              onStartGame={onStartGame}
              username={username}
              onUsernameChange={onUsernameChange}
              onHostGame={onHostGame}
              onJoinGame={onJoinGame}
              onClose={() => onSettingsChange(false)}
            />
          </div>
        </div>
      )}

      {/* Game Controls Modal */}
      {showControls && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
            <GameControls
              game={game}
              onUpdateGame={onUpdateGame}
              onLeaveGame={onLeaveGame}
              onClose={() => setShowControls(false)}
            />
          </div>
        </div>
      )}

      <div className={`relative ${!game.isStarted && game.hasBeenConfigured ? "opacity-60 pointer-events-none" : ""}`}>
        <BingoBoard
          size={game.boardSize}
          values={game.bingoValues}
          selectedCells={game.selectedCells}
          onToggleCell={toggleCell}
          hasWon={hasWon}
          boardColor={game.boardColor}
          isPreview={!game.isStarted}
        />
      </div>
    </div>
  )
}
