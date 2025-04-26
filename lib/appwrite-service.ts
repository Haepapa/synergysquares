import type { Game, Player } from "@/types/game";
// When integrating with Appwrite, uncomment these imports
import { account } from "./appwrite-config";
// import { account, databases, storage, functions } from "./appwrite-config";
// import { COLLECTIONS, BUCKETS, FUNCTIONS } from "./appwrite-config";
// import { Query, ID } from "appwrite";
import { ID } from "appwrite";

// ===== Authentication Services =====

export const authService = {
  /**
   * Create a new user account
   */
  createAccount: async (email: string, password: string, name: string) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // return {
    //   id: `user_${Date.now()}`,
    //   name,
    //   email,
    // };

    // APPWRITE INTEGRATION:
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      await account.createEmailPasswordSession(email, password);
      console.log("Account created:", newAccount);
      return {
        id: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
      };
    } catch (error) {
      console.error("Account creation failed:", error);
      throw new Error("Failed to create account.");
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // return {
    //   id: `user_${Date.now()}`,
    //   name: email.split("@")[0],
    //   email,
    // };

    // APPWRITE INTEGRATION:
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      console.log("Account logged in:", user);
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // APPWRITE INTEGRATION:
    try {
      await account.deleteSession("current");
      console.log("Account logged out");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Failed to logout.");
    }
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // const storedUser = localStorage.getItem("bingo-user");
    // return storedUser ? JSON.parse(storedUser) : null;

    // APPWRITE INTEGRATION:
    try {
      const user = await account.get();
      console.log("Current user:", user);
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, data: { name?: string }) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // const storedUser = localStorage.getItem("bingo-user");
    // if (!storedUser) return null;

    // const user = JSON.parse(storedUser);
    // const updatedUser = { ...user, ...data };
    // localStorage.setItem("bingo-user", JSON.stringify(updatedUser));
    // return updatedUser;

    // APPWRITE INTEGRATION:
    try {
      if (data.name) {
        await account.updateName(data.name);
      }
      const updatedUser = await account.get();
      console.log("Account updated:", updatedUser);
      return {
        id: updatedUser.$id,
        name: updatedUser.name,
        email: updatedUser.email,
      };
    } catch (error) {
      console.error("Profile update failed:", error);
      throw new Error("Failed to update profile.");
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // localStorage.removeItem("bingo-user");

    // APPWRITE INTEGRATION:
    try {
      const user = await account.get();
      const result = await account.deleteIdentity(
        user.$id // identityId
      );
      return true;
    } catch (error) {
      console.error("Account deletion failed:", error);
      throw new Error("Failed to delete account.");
    }
  },
};

// ===== Game Services =====

const getWinPatterns = (boardSize: number): number[][] => {
  const patterns: number[][] = [];

  // Rows
  for (let i = 0; i < boardSize; i++) {
    const row: number[] = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    patterns.push(row);
  }

  // Columns
  for (let j = 0; j < boardSize; j++) {
    const col: number[] = [];
    for (let i = 0; i < boardSize; i++) {
      col.push(i * boardSize + j);
    }
    patterns.push(col);
  }

  // Diagonal (top-left to bottom-right)
  const diag1: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
  }
  patterns.push(diag1);

  // Diagonal (top-right to bottom-left)
  const diag2: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  patterns.push(diag2);

  return patterns;
};

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
    const storedGames = localStorage.getItem("bingo-games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    games.push(newGame);
    localStorage.setItem("bingo-games", JSON.stringify(games));

    return newGame;

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.createDocument(
    //     COLLECTIONS.GAMES,
    //     'unique()',
    //     {
    //       ...gameData,
    //       userId,
    //       status: "not_started",
    //       winningPatterns: [],
    //       isHost: true,
    //       players: [
    //         {
    //           id: userId,
    //           name: "You",
    //           isHost: true,
    //           joinTime: new Date().toISOString(),
    //           hasBingo: false,
    //         },
    //       ],
    //       createdAt: new Date().toISOString(),
    //     }
    //   );
    //   return response as unknown as Game;
    // } catch (error) {
    //   console.error("Game creation failed:", error);
    //   throw new Error("Failed to create game.");
    // }
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

// ===== Preset Services =====

export const presetService = {
  /**
   * Get all presets
   */
  getPresets: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedPresets = localStorage.getItem("bingo-custom-presets");
    return storedPresets ? JSON.parse(storedPresets) : {};

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.PRESETS
    //   );
    //
    //   // Convert the array of documents to a Record<string, string[]>
    //   const presets: Record<string, string[]> = {};
    //   response.documents.forEach((doc) => {
    //     presets[doc.name] = doc.items;
    //   });
    //
    //   return presets;
    // } catch (error) {
    //   console.error("Failed to fetch presets:", error);
    //   throw new Error("Failed to fetch presets.");
    // }
  },

  /**
   * Save a custom preset
   */
  savePreset: async (userId: string, name: string, items: string[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedPresets = localStorage.getItem("bingo-custom-presets");
    const presets = storedPresets ? JSON.parse(storedPresets) : {};
    presets[name] = items;
    localStorage.setItem("bingo-custom-presets", JSON.stringify(presets));

    return { name, items };

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.createDocument(
    //     COLLECTIONS.PRESETS,
    //     'unique()',
    //     {
    //       userId,
    //       name,
    //       items,
    //       createdAt: new Date().toISOString(),
    //     }
    //   );
    //
    //   return {
    //     name: response.name,
    //     items: response.items,
    //   };
    // } catch (error) {
    //   console.error("Failed to save preset:", error);
    //   throw new Error("Failed to save preset.");
    // }
  },

  /**
   * Delete a custom preset
   */
  deletePreset: async (name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedPresets = localStorage.getItem("bingo-custom-presets");
    const presets = storedPresets ? JSON.parse(storedPresets) : {};
    delete presets[name];
    localStorage.setItem("bingo-custom-presets", JSON.stringify(presets));

    // APPWRITE INTEGRATION:
    // try {
    //   // First, find the preset document by name
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.PRESETS,
    //     [Query.equal('name', name)]
    //   );
    //
    //   if (response.documents.length > 0) {
    //     await databases.deleteDocument(
    //       COLLECTIONS.PRESETS,
    //       response.documents[0].$id
    //     );
    //   }
    //
    //   return true;
    // } catch (error) {
    //   console.error("Failed to delete preset:", error);
    //   throw new Error("Failed to delete preset.");
    // }
  },
};

export default {
  auth: authService,
  game: gameService,
  preset: presetService,
};
