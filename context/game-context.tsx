"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Game } from "@/types/game";
import { useAuth } from "@/context/auth-context";
import { generateBoardCells } from "@/lib/game-utils";
import { gameService } from "@/lib/game-service";

interface GameContextType {
  games: Game[];
  activeGameId: string | null;
  /** True while the initial game list is being fetched from Appwrite. */
  isLoading: boolean;
  setActiveGameId: (id: string) => void;
  createGame: () => Promise<string>;
  updateGame: (game: Game) => void;
  removeGame: (id: string) => void;
  fetchGameByToken: (token: string) => Promise<Game | null>;
  /**
   * Join an existing game by its share token.
   * Always queries Appwrite so a player can join a game hosted by another user.
   * The game is added to the local games list with `isHost: false`.
   * Returns the joined Game, or `null` if the token is invalid.
   */
  joinByToken: (
    token: string,
    playerName: string,
    playerId: string
  ) => Promise<Game | null>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  // Tracks whether we have ever seen a non-null user (used to distinguish
  // "initial mount with no user" from "explicit logout").
  const hadUserRef = useRef(false);
  // Guard against concurrent createGame calls (e.g. React Strict Mode double-invoke)
  const isCreatingRef = useRef(false);

  // Reload games whenever the logged-in user changes.
  useEffect(() => {
    if (!user) {
      if (hadUserRef.current) {
        // Explicit logout — wipe games so stale data isn't shown.
        setGames([]);
        setActiveGameId(null);
      }
      // Initial mount with no user (guest): do nothing — the dashboard will
      // auto-create an in-memory game via createGame().
      return;
    }

    // User just logged in or page reloaded while authenticated.
    hadUserRef.current = true;
    setIsLoading(true);
    gameService
      .getUserGames(user.id)
      .then((fetchedGames) => {
        setGames(fetchedGames);
      })
      .catch((err) => {
        console.error("Failed to load games from Appwrite:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  /**
   * Create a new game.
   *
   * - **Authenticated users**: game is saved to Appwrite; the Appwrite `$id`
   *   is used as the game's id.
   * - **Guests (no user)**: an in-memory game is created with a `local_`
   *   prefixed id.  It is not persisted and will be lost on page refresh.
   *
   * Returns the game id, or an empty string if a creation was already in
   * flight (React Strict Mode double-invoke guard).
   */
  const createGame = useCallback(async (): Promise<string> => {
    if (isCreatingRef.current) return "";
    isCreatingRef.current = true;

    try {
      const boardSize = 5;
      const cells = generateBoardCells(boardSize, [], []);

      if (!user) {
        // Guest mode: in-memory only, not persisted to Appwrite.
        const id = `local_${Date.now()}`;
        const guestGame: Game = {
          id,
          name: "New Bingo Game",
          boardSize,
          boardColor: "#9333ea",
          cells,
          status: "not_started",
          winningPatterns: [],
          isHost: true,
          players: [
            {
              id: "guest",
              name: "You",
              isHost: true,
              joinTime: new Date().toISOString(),
              hasBingo: false,
            },
          ],
        };
        setGames((prev) => [...prev, guestGame]);
        return id;
      }

      // Authenticated: persist to Appwrite.
      const newGame = await gameService.createGame(user.id, {
        name: "New Bingo Game",
        boardSize,
        boardColor: "#9333ea",
        cells,
        isHost: true,
      });
      setGames((prev) => [...prev, newGame]);
      return newGame.id;
    } finally {
      isCreatingRef.current = false;
    }
  }, [user]);

  /**
   * Optimistic update: reflect the change in local state immediately.
   * For authenticated users, syncs to Appwrite in the background.
   * Guest games (local_ prefix) are only updated in memory.
   */
  const updateGame = useCallback(
    (updatedGame: Game) => {
      setGames((prev) =>
        prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
      );

      if (!user || updatedGame.id.startsWith("local_")) return;

      gameService.updateGame(updatedGame.id, updatedGame).catch((err) => {
        console.error("Failed to sync game update to Appwrite:", err);
      });
    },
    [user]
  );

  /**
   * Optimistic delete: remove from local state immediately.
   * For authenticated users, deletes from Appwrite in the background.
   * Guest games (local_ prefix) are only removed from memory.
   */
  const removeGame = useCallback(
    (id: string) => {
      setGames((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        if (activeGameId === id) {
          setActiveGameId(updated.length > 0 ? updated[0].id : null);
        }
        return updated;
      });

      if (!user || id.startsWith("local_")) return;

      gameService.deleteGame(id).catch((err) => {
        console.error("Failed to delete game from Appwrite:", err);
      });
    },
    [activeGameId, user]
  );

  /**
   * Look up a game by its shareable token.
   * For authenticated users, queries Appwrite.
   * For guests, searches the in-memory game list only.
   */
  const fetchGameByToken = useCallback(
    async (token: string): Promise<Game | null> => {
      if (!user) {
        return games.find((g) => g.token === token) ?? null;
      }
      return gameService.getGameByToken(token);
    },
    [user, games]
  );

  /**
   * Join an existing game by its share token.
   *
   * Always queries Appwrite so the joiner can find a game hosted by another
   * user.  The found game is added to the local games list with `isHost: false`
   * and the joining player appended to the players array.  We intentionally do
   * NOT call `updateGame` here because the joining player does not have write
   * permission on the host's Appwrite document — full player-list sync is
   * handled by Appwrite Realtime (task [6]).
   *
   * @param token      - The share token displayed in the host's PlayerListPanel.
   * @param playerName - Display name for the joining player.
   * @param playerId   - Unique ID for the joining player (use the Appwrite user
   *                     id when authenticated, or a guest-generated string).
   * @returns The joined Game, or `null` if the token is invalid.
   */
  const joinByToken = useCallback(
    async (
      token: string,
      playerName: string,
      playerId: string
    ): Promise<Game | null> => {
      // Always hit Appwrite so the joiner can find games they don't own.
      const foundGame = await gameService.getGameByToken(token);
      if (!foundGame) return null;

      const joinedGame: Game = {
        ...foundGame,
        isHost: false,
        players: [
          ...(foundGame.players ?? []),
          {
            id: playerId,
            name: playerName,
            isHost: false,
            joinTime: new Date().toISOString(),
            hasBingo: false,
          },
        ],
      };

      setGames((prev) => {
        // If we already have this game in our list (e.g. rejoining), replace it.
        if (prev.some((g) => g.id === joinedGame.id)) {
          return prev.map((g) => (g.id === joinedGame.id ? joinedGame : g));
        }
        return [...prev, joinedGame];
      });

      return joinedGame;
    },
    []
  );

  return (
    <GameContext.Provider
      value={{
        games,
        activeGameId,
        isLoading,
        setActiveGameId,
        createGame,
        updateGame,
        removeGame,
        fetchGameByToken,
        joinByToken,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
