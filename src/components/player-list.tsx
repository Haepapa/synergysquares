"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Game, Player } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Award, Crown, UserX } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PlayerListProps {
  game: Game
  currentUsername: string
  onRemovePlayer: (playerId: string) => void
}

export function PlayerList({ game, currentUsername, onRemovePlayer }: PlayerListProps) {
  // Check if current user is the host
  const isHost = game.players.some((p) => p.isHost && p.name === currentUsername)

  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader>
        <CardTitle>Players</CardTitle>
        <CardDescription>
          {game.players.length} {game.players.length === 1 ? "player" : "players"} in this game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {game.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                game={game}
                isCurrentUserHost={isHost}
                onRemove={() => onRemovePlayer(player.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface PlayerCardProps {
  player: Player
  game: Game
  isCurrentUserHost: boolean
  onRemove: () => void
}

function PlayerCard({ player, game, isCurrentUserHost, onRemove }: PlayerCardProps) {
  // Find player achievements
  const achievements =
    game.winningCombinations?.filter((combo) => combo.playerId === player.id || combo.playerName === player.name) || []

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {player.isHost ? (
            <Crown className="h-5 w-5 text-primary" />
          ) : (
            <span className="text-lg font-medium">{player.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{player.name}</p>
            {player.isHost && <span className="text-xs text-muted-foreground">(Host)</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            Joined {formatDistanceToNow(new Date(player.joinedAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {achievements.length > 0 && (
          <div className="flex items-center gap-1" title={`${achievements.length} bingos`}>
            <Award className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">{achievements.length}</span>
          </div>
        )}

        {isCurrentUserHost && !player.isHost && (
          <Button variant="ghost" size="icon" onClick={onRemove} title="Remove player">
            <UserX className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  )
}
