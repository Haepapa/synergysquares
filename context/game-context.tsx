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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  // Guard against concurrent createGame calls (e.g. React Strict Mode double-invoke)
  const isCreatingRef = useRef(false);

  // Reload games whenever the logged-in user changes.
  // On logout (user === null) wipe local state; on login fetch from Appwrite.
  useEffect(() => {
    if (!user) {
      setGames([]);
      setActiveGameId(null);
      return;
    }

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
   * Create a new game in Appwrite and add it to local state.
   * Returns the Appwrite document ID (used immediately to set activeGameId).
   * Throws if no user is logged in.
   */
  const createGame = useCallback(async (): Promise<string> => {
    if (!user) throw new Error("Must be logged in to create a game.");
    if (isCreatingRef.current) {
      // A creation is already in flight — return a sentinel so the caller
      // can detect the no-op and avoid setting a stale activeGameId.
      return "";
    }

    isCreatingRef.current = true;
    try {
      const boardSize = 5;
      const newGame = await gameService.createGame(user.id, {
        name: "New Bingo Game",
        boardSize,
        boardColor: "#9333ea",
        cells: generateBoardCells(boardSize, [], []),
        isHost: true,
      });

      setGames((prev) => [...prev, newGame]);
      return newGame.id;
    } finally {
      isCreatingRef.current = false;
    }
  }, [user]);

  /**
   * Optimistic update: reflect the change in local state immediately, then
   * sync to Appwrite in the background.  If the Appwrite write fails, the
   * local state may diverge — a full refresh will re-sync from the server.
   */
  const updateGame = useCallback((updatedGame: Game) => {
    setGames((prev) =>
      prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
    );

    gameService.updateGame(updatedGame.id, updatedGame).catch((err) => {
      console.error("Failed to sync game update to Appwrite:", err);
    });
  }, []);

  /**
   * Optimistic delete: remove from local state immediately, then delete from
   * Appwrite.  Adjusts activeGameId if the active game is being removed.
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

      gameService.deleteGame(id).catch((err) => {
        console.error("Failed to delete game from Appwrite:", err);
      });
    },
    [activeGameId]
  );

  /**
   * Look up a game by its shareable token via Appwrite.
   * Returns null if no game is found.
   */
  const fetchGameByToken = useCallback(
    (token: string): Promise<Game | null> => {
      return gameService.getGameByToken(token);
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
