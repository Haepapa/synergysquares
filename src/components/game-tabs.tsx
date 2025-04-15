"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { Game } from "@/lib/types"
import { ThemeToggle } from "./theme-toggle"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
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

interface GameTabsProps {
  games: Game[]
  activeGameId: string
  onSelectGame: (gameId: string) => void
  onCreateGame: () => void
  onLeaveGame: (gameId: string) => void
}

export function GameTabs({ games, activeGameId, onSelectGame, onCreateGame, onLeaveGame }: GameTabsProps) {
  const [gameToLeave, setGameToLeave] = useState<string | null>(null)

  const handleLeaveClick = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation() // Prevent tab selection
    setGameToLeave(gameId)
  }

  const confirmLeaveGame = () => {
    if (gameToLeave) {
      onLeaveGame(gameToLeave)
      setGameToLeave(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border-b px-2 py-2">
        <Tabs value={activeGameId} className="flex-1 overflow-x-auto">
          <TabsList className="h-9">
            {games.map((game) => {
              const expiresIn = game.expiresAt ? formatDistanceToNow(new Date(game.expiresAt), { addSuffix: true }) : ""

              return (
                <TabsTrigger
                  key={game.id}
                  value={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="flex items-center gap-2 pr-1"
                >
                  <span>{game.name}</span>
                  {game.isHosted && (
                    <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-xs">
                      {game.players.length} {game.players.length === 1 ? "player" : "players"}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 rounded-full hover:bg-destructive/10"
                    onClick={(e) => handleLeaveClick(e, game.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onCreateGame} title="Create new game">
            <Plus className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Leave Game Confirmation Dialog */}
      <AlertDialog open={!!gameToLeave} onOpenChange={(open) => !open && setGameToLeave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the current game and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeaveGame}>Leave Game</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
