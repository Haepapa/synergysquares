export interface Player {
  id: string
  name: string
  isHost?: boolean
  joinedAt: string
  achievements: string[]
}

export interface WinningCombination {
  playerId: string
  playerName: string
  lines: string[]
  timestamp: string
}

export interface Game {
  id: string
  name: string
  boardSize: number
  bingoValues: string[]
  selectedCells: boolean[]
  isStarted: boolean
  isHosted: boolean
  token: string
  players: Player[]
  createdAt: string
  expiresAt: string
  winningCombinations?: WinningCombination[]
  boardColor?: string
  hasBeenConfigured?: boolean // Track if the game has been configured
}
