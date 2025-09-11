import type { Game } from "@/types/game";
import {
  databases,
  databaseID,
  collection02ID,
} from "./appwrite-config";

export const gameService = {
  /**
   * Create a new game
   */
  createGame: async (userId: string, gameData: Partial<Game>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const id = `game_${Date.now()}`;
    const newGame: Game = {
      id,
      name: gameData.name || "New Bingo Game",
      boardSize: gameData.boardSize || 5,
      boardColor: gameData.boardColor || "#9333ea",
      cells: gameData.cells || [],
      status: "not_started",
      winningPatterns: [],
      isHost: true,
      players: [
        {
          id: userId,
          name: "You",
          isHost: true,
          joinTime: new Date().toISOString(),
          hasBingo: false,
        },
      ],
    };

    // Save to localStorage for demo
    // const storedGames = localStorage.getItem("bingo-games");
    // const games = storedGames ? JSON.parse(storedGames) : [];
    // games.push(newGame);
    // localStorage.setItem("bingo-games", JSON.stringify(games));
    // TODO (me): how to get this data into appwrite?
    console.log("New game created:", newGame);

    // return newGame;

    // APPWRITE INTEGRATION:
    try {
      const response = await databases.createDocument(
        databaseID,
        collection02ID,
        'unique()',
        {
          ...gameData,
          status: "not_started",
          winningPatterns: [],
          isHost: true,
          players: [
            {
              id: userId,
              name: "You",
              isHost: true,
              joinTime: new Date().toISOString(),
              hasBingo: false,
            },
          ],
          createdAt: new Date().toISOString(),
        }
      );
      return response as unknown as Game;
    } catch (error) {
      console.error("Game creation failed:", error);
      throw new Error("Failed to create game.");
    }
  },

  /**
   * Get all games for a user
   */
  getUserGames: async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    return storedGames ? JSON.parse(storedGames) : [];

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.GAMES,
    //     [Query.equal('userId', userId)]
    //   );
    //   return response.documents as Game[];
    // } catch (error) {
    //   console.error("Failed to fetch user games:", error);
    //   throw new Error("Failed to fetch games.");
    // }
  },

  /**
   * Get a game by ID
   */
  getGameById: async (gameId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    return games.find((game: Game) => game.id === gameId) || null;

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.getDocument(
    //     COLLECTIONS.GAMES,
    //     gameId
    //   );
    //   return response as unknown as Game;
    // } catch (error) {
    //   console.error("Failed to fetch game:", error);
    //   throw new Error("Failed to fetch game.");
    // }
  },

  /**
   * Get a game by token
   */
  getGameByToken: async (token: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    return games.find((game: Game) => game.token === token) || null;

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.GAMES,
    //     [Query.equal('token', token)]
    //   );
    //
    //   if (response.documents.length > 0) {
    //     return response.documents[0] as unknown as Game;
    //   }
    //   return null;
    // } catch (error) {
    //   console.error("Failed to fetch game by token:", error);
    //   throw new Error("Failed to fetch game.");
    // }
  },

  /**
   * Update a game
   */
  updateGame: async (gameId: string, gameData: Partial<Game>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    const gameIndex = games.findIndex((game: Game) => game.id === gameId);

    if (gameIndex === -1) {
      throw new Error("Game not found");
    }

    const updatedGame = { ...games[gameIndex], ...gameData };
    games[gameIndex] = updatedGame;
    localStorage.setItem("bingo-games", JSON.stringify(games));

    return updatedGame;

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.updateDocument(
    //     COLLECTIONS.GAMES,
    //     gameId,
    //     {
    //       ...gameData,
    //       updatedAt: new Date().toISOString(),
    //     }
    //   );
    //   return response as unknown as Game;
    // } catch (error) {
    //   console.error("Game update failed:", error);
    //   throw new Error("Failed to update game.");
    // }
  },

  /**
   * Delete a game
   */
  deleteGame: async (gameId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    const updatedGames = games.filter((game: Game) => game.id !== gameId);
    localStorage.setItem("bingo-games", JSON.stringify(updatedGames));

    // APPWRITE INTEGRATION:
    // try {
    //   await databases.deleteDocument(
    //     COLLECTIONS.GAMES,
    //     gameId
    //   );
    //   return true;
    // } catch (error) {
    //   console.error("Game deletion failed:", error);
    //   throw new Error("Failed to delete game.");
    // }
  },

  /**
   * Join a game using a token
   */
  joinGame: async (token: string, player: Player) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    const gameIndex = games.findIndex((game: Game) => game.token === token);

    if (gameIndex === -1) {
      throw new Error("Game not found");
    }

    const game = games[gameIndex];
    const updatedPlayers = [...(game.players || []), player];
    const updatedGame = { ...game, players: updatedPlayers };
    games[gameIndex] = updatedGame;
    localStorage.setItem("bingo-games", JSON.stringify(games));

    return updatedGame;

    // APPWRITE INTEGRATION:
    // try {
    //   // This could be implemented as a serverless function in Appwrite
    //   const response = await functions.createExecution(
    //     FUNCTIONS.JOIN_GAME,
    //     JSON.stringify({
    //       token,
    //       player,
    //     })
    //   );
    //
    //   if (response.statusCode === 200) {
    //     return JSON.parse(response.response) as Game;
    //   }
    //   throw new Error("Failed to join game.");
    // } catch (error) {
    //   console.error("Failed to join game:", error);
    //   throw new Error("Failed to join game.");
    // }
  },

  /**
   * Check if a player has won
   */
  checkWinner: async (
    gameId: string,
    playerId: string,
    markedCells: number[]
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    const game = games.find((g: Game) => g.id === gameId);

    if (!game) {
      throw new Error("Game not found");
    }

    // Check for winning patterns
    const winPatterns = getWinPatterns(game.boardSize);
    const winningPatterns: number[][] = [];

    for (const pattern of winPatterns) {
      if (pattern.every((cellIndex) => markedCells.includes(cellIndex))) {
        winningPatterns.push(pattern);
      }
    }

    return { hasWon: winningPatterns.length > 0, winningPatterns };

    // APPWRITE INTEGRATION:
    // try {
    //   // This could be implemented as a serverless function in Appwrite
    //   const response = await functions.createExecution(
    //     FUNCTIONS.CHECK_WINNER,
    //     JSON.stringify({
    //       gameId,
    //       playerId,
    //       markedCells,
    //     })
    //   );
    //
    //   if (response.statusCode === 200) {
    //     return JSON.parse(response.response) as { hasWon: boolean, winningPatterns: number[][] };
    //   }
    //   throw new Error("Failed to check winner.");
    // } catch (error) {
    //   console.error("Failed to check winner:", error);
    //   throw new Error("Failed to check winner.");
    // }
  },
};