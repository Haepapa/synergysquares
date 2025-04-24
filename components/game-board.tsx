"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/context/game-context"
import { toast } from "sonner"
import type { Game, Cell } from "@/types/game"
import confetti from "canvas-confetti"
import { getWinPatterns } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface GameBoardProps {
  game: Game
  fullscreen?: boolean
}

export default function GameBoard({ game, fullscreen = false }: GameBoardProps) {
  const { updateGame } = useGame()
  const [winningCells, setWinningCells] = useState<number[]>([])
  const [showBingo, setShowBingo] = useState(false)
  const isGameWon = game.winningPatterns && game.winningPatterns.length > 0

  // Check for wins when cells are marked
  useEffect(() => {
    if (game.status !== "playing") return

    const winPatterns = getWinPatterns(game.boardSize)
    const markedCellIndices = game.cells
      .map((cell, index) => (cell.marked ? index : -1))
      .filter((index) => index !== -1)

    for (const pattern of winPatterns) {
      if (pattern.every((cellIndex) => markedCellIndices.includes(cellIndex))) {
        if (!game.winningPatterns.some((wp) => wp.length === pattern.length && wp.every((i) => pattern.includes(i)))) {
          // New win found
          const updatedGame = {
            ...game,
            winningPatterns: [...game.winningPatterns, pattern],
          }
          updateGame(updatedGame)
          setWinningCells(pattern)
          setShowBingo(true)

          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })

          // Only show toast for the first win
          if (game.winningPatterns.length === 0) {
            toast.success("BINGO!", {
              description: "You've got a winning pattern!",
            })
          }

          // Hide the BINGO overlay after 3 seconds
          setTimeout(() => {
            setShowBingo(false)
          }, 3000)
        }
      }
    }
  }, [game, updateGame])

  const handleCellClick = (index: number) => {
    // Don't allow clicks if game is won
    if (isGameWon) {
      return
    }

    // Don't allow clicks if game is not playing
    if (game.status !== "playing") {
      return
    }

    // Check if this is the FREE space (center of odd-sized board)
    const isFreeSpace = game.boardSize % 2 === 1 && index === Math.floor(game.cells.length / 2)
    if (isFreeSpace) {
      return // FREE space is always marked and can't be toggled
    }

    const updatedCells = [...game.cells]
    updatedCells[index] = {
      ...updatedCells[index],
      marked: !updatedCells[index].marked,
    }

    updateGame({
      ...game,
      cells: updatedCells,
    })
  }

  const getCellStyle = (cell: Cell, index: number) => {
    const isWinningCell = winningCells.includes(index)
    const isFreeSpace = game.boardSize % 2 === 1 && index === Math.floor(game.cells.length / 2)
    const isPaused = game.status === "paused"

    return {
      backgroundColor: cell.marked
        ? isWinningCell
          ? isPaused
            ? `${game.boardColor}40` // 25% opacity for winning cells when paused
            : `${game.boardColor}80` // 50% opacity for winning cells
          : isPaused
            ? `${game.boardColor}60` // 40% opacity when paused
            : game.boardColor
        : isFreeSpace
          ? isPaused
            ? `${game.boardColor}20` // 12.5% opacity for free space when paused
            : `${game.boardColor}40` // 25% opacity for free space
          : `${game.boardColor}15`, // 15% opacity for unselected tiles (muted version of the selected color)
      color: cell.marked ? (isPaused ? "rgba(255, 255, 255, 0.7)" : "white") : "",
      filter: isPaused ? "grayscale(30%)" : "none",
      cursor: isFreeSpace || isGameWon ? "default" : game.status === "playing" ? "pointer" : "default",
      "--hover-color": `${game.boardColor}30`, // 30% opacity for hover effect
    }
  }

  const getTextSizeClass = (content: string) => {
    if (content.length > 15) return "text-xs"
    if (content.length > 10) return "text-sm"
    return ""
  }

  // Calculate board size based on fullscreen mode and screen size
  const getBoardSize = () => {
    if (fullscreen) {
      return {
        width: "min(95vw, 95vh)",
        height: "min(95vw, 95vh)",
      }
    }

    // For mobile, make the board larger
    return {
      width: "min(90vw, 600px)",
      height: "min(90vw, 600px)",
    }
  }

  const boardSize = getBoardSize()

  return (
    <div className="relative">
      <div
        className="grid gap-2 p-4 rounded-lg shadow-md" // Removed bg-gray-200/70 dark:bg-gray-800/70
        style={{
          gridTemplateColumns: `repeat(${game.boardSize}, 1fr)`,
          width: boardSize.width,
          height: boardSize.height,
          aspectRatio: "1/1",
        }}
      >
        {game.cells.map((cell, index) => {
          const isFreeSpace = game.boardSize % 2 === 1 && index === Math.floor(game.cells.length / 2)
          const isClickable = game.status === "playing" && !isFreeSpace && !isGameWon

          // Use div instead of button for non-clickable cells
          const CellComponent = isClickable ? "button" : "div"

          // Update the cell component styling to add hover effects and better background for unselected tiles
          return (
            <CellComponent
              key={index}
              className={cn(
                "flex items-center justify-center aspect-square rounded-md transition-all duration-200",
                winningCells.includes(index) ? "animate-pulse" : "",
                "shadow-sm border border-border/30",
                isClickable ? "hover:scale-105 hover:shadow-md hover:z-10 hover:bg-[var(--hover-color)]" : "",
              )}
              style={getCellStyle(cell, index)}
              onClick={isClickable ? () => handleCellClick(index) : undefined}
              disabled={!isClickable}
              aria-label={`Bingo cell ${cell.content}`}
              aria-pressed={cell.marked}
              role={isClickable ? "button" : "presentation"}
            >
              <div className={`bingo-cell ${getTextSizeClass(cell.content)}`}>{cell.content}</div>
            </CellComponent>
          )
        })}
      </div>

      {showBingo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg animate-fade-in">
          <div className="text-6xl font-bold text-white animate-bounce">BINGO!</div>
        </div>
      )}

      {game.status === "not_started" && game.cells.some((cell) => !cell.content) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center text-white p-4">
            <p className="text-lg font-bold mb-2">Configure your game</p>
            <p className="text-sm">Click the settings icon to add content to your board</p>
          </div>
        </div>
      )}

      {game.status === "paused" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg animate-fade-in">
          <div className="text-2xl font-bold text-white">PAUSED</div>
        </div>
      )}

      {isGameWon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-2xl font-bold text-white bg-accent/80 px-4 py-2 rounded-lg">GAME WON!</div>
        </div>
      )}
    </div>
  )
}
