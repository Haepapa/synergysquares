export interface Cell {
  content: string
  marked: boolean
}

export interface Player {
  id: string
  name: string
  isHost: boolean
  joinTime: string
  hasBingo: boolean
}

export interface Game {
  id: string
  name: string
  boardSize: number
  boardColor: string
  cells: Cell[]
  status: "not_started" | "playing" | "paused"
  startTime?: string | null
  winningPatterns: number[][]
  token?: string
  isHost?: boolean
  players?: Player[]
}
