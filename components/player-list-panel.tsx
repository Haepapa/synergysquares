"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/game-context"
import { toast } from "sonner"
import type { Game } from "@/types/game"
import { Crown, UserX, Award, X } from "lucide-react"

interface PlayerListPanelProps {
  game: Game
  onClose: () => void
  position?: "right" | "dialog"
}

export default function PlayerListPanel({ game, onClose, position = "dialog" }: PlayerListPanelProps) {
  const { updateGame } = useGame()

  // If no players are defined, create a default player list
  const players = game.players || [
    {
      id: "local",
      name: "You",
      isHost: true,
      joinTime: game.startTime || new Date().toISOString(),
      hasBingo: game.winningPatterns.length > 0,
    },
  ]

  const handleRemovePlayer = (playerId: string) => {
    if (!game.isHost) {
      toast.error("Permission denied", {
        description: "Only the host can remove players.",
      })
      return
    }

    const updatedPlayers = players.filter((player) => player.id !== playerId)

    updateGame({
      ...game,
      players: updatedPlayers,
    })
  }

  if (position === "right") {
    return (
      <div className="fixed right-0 top-0 h-full w-[300px] bg-background shadow-lg z-50 border-l overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Players</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {game.token && (
            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium">Game Token</h3>
              <p className="mt-2 text-sm font-mono">{game.token}</p>
              <p className="mt-1 text-xs text-muted-foreground">Share this token with others to join your game</p>
            </div>
          )}

          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-2">
                  {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                  <span>{player.name}</span>
                  {player.hasBingo && <Award className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-muted-foreground">
                    Joined: {new Date(player.joinTime).toLocaleTimeString()}
                  </span>
                  {game.isHost && !player.isHost && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePlayer(player.id)}
                      className="btn-hover-effect"
                    >
                      <UserX className="w-4 h-4" />
                      <span className="sr-only">Remove player</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No players have joined this game yet.</div>
          )}

          {game.isHost && (
            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium">Host Controls</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                As the host, you can remove players and manage the game.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Players</DialogTitle>
          <DialogDescription>Manage players in your game</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {game.token && (
            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium">Game Token</h3>
              <p className="mt-2 text-sm font-mono">{game.token}</p>
              <p className="mt-1 text-xs text-muted-foreground">Share this token with others to join your game</p>
            </div>
          )}

          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-2">
                  {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                  <span>{player.name}</span>
                  {player.hasBingo && <Award className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-muted-foreground">
                    Joined: {new Date(player.joinTime).toLocaleTimeString()}
                  </span>
                  {game.isHost && !player.isHost && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePlayer(player.id)}
                      className="btn-hover-effect"
                    >
                      <UserX className="w-4 h-4" />
                      <span className="sr-only">Remove player</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No players have joined this game yet.</div>
          )}

          {game.isHost && (
            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium">Host Controls</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                As the host, you can remove players and manage the game.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
