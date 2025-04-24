"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Game } from "@/types/game"
import { generateBoardCells } from "@/lib/game-utils"

interface GameContextType {
  games: Game[]
  activeGameId: string | null
  setActiveGameId: (id: string) => void
  createGame: () => string
  updateGame: (game: Game) => void
  removeGame: (id: string) => void
  fetchGameByToken: (token: string) => Promise<Game | null>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([])
  const [activeGameId, setActiveGameId] = useState<string | null>(null)

  // Load games from localStorage on initial render
  useEffect(() => {
    const storedGames = localStorage.getItem("bingo-games")
    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames))
      } catch (error) {
        console.error("Failed to parse stored games:", error)
      }
    }

    // APPWRITE INTEGRATION:
    // Replace with Appwrite database query to fetch user's games
    // Example:
    // const { user } = useAuth();
    // if (user) {
    //   databases.listDocuments(
    //     COLLECTIONS.GAMES,
    //     [Query.equal('userId', user.id)]
    //   )
    //   .then((response) => {
    //     setGames(response.documents as Game[]);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch games:", error);
    //   });
    // }
  }, [])

  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bingo-games", JSON.stringify(games))

    // APPWRITE INTEGRATION:
    // This effect is not needed with Appwrite as game data is stored server-side
  }, [games])

  const createGame = () => {
    const id = `game_${Date.now()}`
    const boardSize = 5
    const newGame: Game = {
      id,
      name: "New Bingo Game",
      boardSize,
      boardColor: "#9333ea", // Default to purple
      cells: generateBoardCells(boardSize, [], []),
      status: "not_started",
      winningPatterns: [],
      isHost: true,
      players: [
        {
          id: "local",
          name: "You",
          isHost: true,
          joinTime: new Date().toISOString(),
          hasBingo: false,
        },
      ],
    }

    setGames((prevGames) => [...prevGames, newGame])

    // APPWRITE INTEGRATION:
    // Replace with Appwrite document creation
    // Example:
    // const { user } = useAuth();
    // if (user) {
    //   databases.createDocument(
    //     COLLECTIONS.GAMES,
    //     'unique()',
    //     {
    //       ...newGame,
    //       userId: user.id,
    //       createdAt: new Date().toISOString(),
    //     }
    //   )
    //   .then((response) => {
    //     const createdGame = response as Game;
    //     setGames((prevGames) => [...prevGames, createdGame]);
    //     return createdGame.id;
    //   })
    //   .catch((error) => {
    //     console.error("Failed to create game:", error);
    //     throw new Error("Failed to create game.");
    //   });
    // }

    return id
  }

  const updateGame = (updatedGame: Game) => {
    setGames((prevGames) => prevGames.map((game) => (game.id === updatedGame.id ? updatedGame : game)))

    // APPWRITE INTEGRATION:
    // Replace with Appwrite document update
    // Example:
    // databases.updateDocument(
    //   COLLECTIONS.GAMES,
    //   updatedGame.id,
    //   {
    //     ...updatedGame,
    //     updatedAt: new Date().toISOString(),
    //   }
    // )
    // .catch((error) => {
    //   console.error("Failed to update game:", error);
    //   throw new Error("Failed to update game.");
    // });
  }

  const removeGame = (id: string) => {
    setGames((prevGames) => {
      const updatedGames = prevGames.filter((game) => game.id !== id)

      // If the removed game was active, set the first remaining game as active or null
      if (activeGameId === id) {
        setActiveGameId(updatedGames.length > 0 ? updatedGames[0].id : null)
      }

      return updatedGames
    })

    // APPWRITE INTEGRATION:
    // Replace with Appwrite document deletion
    // Example:
    // databases.deleteDocument(
    //   COLLECTIONS.GAMES,
    //   id
    // )
    // .catch((error) => {
    //   console.error("Failed to delete game:", error);
    //   throw new Error("Failed to delete game.");
    // });
  }

  const fetchGameByToken = async (token: string): Promise<Game | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find game with matching token
    const game = games.find((g) => g.token === token)
    return game || null

    // APPWRITE INTEGRATION:
    // Replace with Appwrite database query
    // Example:
    // try {
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.GAMES,
    //     [Query.equal('token', token)]
    //   );
    //
    //   if (response.documents.length > 0) {
    //     return response.documents[0] as Game;
    //   }
    //   return null;
    // } catch (error) {
    //   console.error("Failed to fetch game by token:", error);
    //   throw new Error("Failed to fetch game.");
    // }
  }

  return (
    <GameContext.Provider
      value={{
        games,
        activeGameId,
        setActiveGameId,
        createGame,
        updateGame,
        removeGame,
        fetchGameByToken,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
