import { Query, Permission, Role } from "appwrite";
import type { Cell, Game, Player } from "@/types/game";
import { getWinPatterns } from "@/lib/game-utils";
import { databases, databaseID, collection02ID, collection04ID } from "./appwrite-config";

// ---------------------------------------------------------------------------
// Helpers — serialise/deserialise Cell[] ↔ Appwrite parallel arrays
// ---------------------------------------------------------------------------

/**
 * Convert a Cell array into the two parallel arrays stored in Appwrite:
 * `cellContents` (string[]) and `cellsMarked` (boolean[]).
 */
function serialiseCells(cells: Cell[]): {
  cellContents: string[];
  cellsMarked: boolean[];
} {
  return {
    cellContents: cells.map((c) => c.content),
    cellsMarked: cells.map((c) => c.marked),
  };
}

/**
 * Reconstruct a Cell array from the two parallel Appwrite arrays.
 * Falls back to an empty array if the data is missing or mismatched.
 */
function deserialiseCells(
  cellContents: string[] | undefined,
  cellsMarked: boolean[] | undefined
): Cell[] {
  if (!cellContents || !cellsMarked) return [];
  return cellContents.map((content, i) => ({
    content,
    marked: cellsMarked[i] ?? false,
  }));
}

// ---------------------------------------------------------------------------
// Document → Game mapper
// ---------------------------------------------------------------------------

/** @internal — exported for use by the Realtime hook in game-context.tsx */
export function documentToGame(doc: Record<string, unknown>): Game {
  return {
    id: String(doc.$id ?? ""),
    userId: (doc.userId as string | undefined) ?? undefined,
    name: String(doc.name ?? ""),
    boardSize: (doc.boardSize as number | undefined) ?? 5,
    boardColor: String(doc.boardColor ?? "#9333ea"),
    cells: deserialiseCells(
      doc.cellContents as string[] | undefined,
      doc.cellsMarked as boolean[] | undefined
    ),
    status: (doc.status as Game["status"]) ?? "not_started",
    startTime: (doc.startTime as string | null | undefined) ?? null,
    winningPatterns: [], // recomputed client-side from marked cells
    token: (doc.token as string | undefined) ?? undefined,
    isHost: Boolean(doc.isHost ?? false),
    players: (doc.players as Game["players"]) ?? [],
  };
}

// ---------------------------------------------------------------------------
// gameService
// ---------------------------------------------------------------------------

export const gameService = {
  /**
   * Create a new game document in Appwrite.
   *
   * @param userId - Appwrite user ID of the host.
   * @param gameData - Initial game fields (name, boardSize, boardColor, cells, …).
   * @returns The created Game with `id` set to the Appwrite document `$id`.
   */
  createGame: async (userId: string, gameData: Partial<Game>): Promise<Game> => {
    const { cellContents, cellsMarked } = serialiseCells(gameData.cells ?? []);

    const doc = await databases.createDocument(
      databaseID,
      collection02ID,
      "unique()",
      {
        name: gameData.name ?? "New Bingo Game",
        boardSize: gameData.boardSize ?? 5,
        boardColor: gameData.boardColor ?? "#9333ea",
        status: "not_started",
        userId,
        cellContents,
        cellsMarked,
        token: gameData.token ?? "",
        isHost: true,
        startTime: null,
        createdAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    return documentToGame(doc);
  },

  /**
   * Return all games owned by `userId`, newest first.
   */
  getUserGames: async (userId: string): Promise<Game[]> => {
    const response = await databases.listDocuments(
      databaseID,
      collection02ID,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );
    return response.documents.map(documentToGame);
  },

  /**
   * Fetch a single game by its Appwrite document ID.
   * Returns `null` if the document does not exist.
   */
  getGameById: async (gameId: string): Promise<Game | null> => {
    try {
      const doc = await databases.getDocument(databaseID, collection02ID, gameId);
      return documentToGame(doc);
    } catch {
      return null;
    }
  },

  /**
   * Look up a game by its shareable token.
   * Returns `null` if no matching game is found.
   */
  getGameByToken: async (token: string): Promise<Game | null> => {
    const response = await databases.listDocuments(
      databaseID,
      collection02ID,
      [Query.equal("token", token), Query.limit(1)]
    );
    if (response.documents.length === 0) return null;
    return documentToGame(response.documents[0]);
  },

  /**
   * Persist changes to an existing game document.
   *
   * @param gameId - Appwrite document ID (`game.$id`).
   * @param gameData - Partial Game fields to update.
   * @returns The updated Game.
   */
  updateGame: async (gameId: string, gameData: Partial<Game>): Promise<Game> => {
    const payload: Record<string, unknown> = {
      name: gameData.name,
      boardSize: gameData.boardSize,
      boardColor: gameData.boardColor,
      status: gameData.status,
      startTime: gameData.startTime ?? null,
      token: gameData.token ?? "",
      isHost: gameData.isHost,
    };

    // Only include cells when explicitly provided
    if (gameData.cells !== undefined) {
      const { cellContents, cellsMarked } = serialiseCells(gameData.cells);
      payload.cellContents = cellContents;
      payload.cellsMarked = cellsMarked;
    }

    // Remove undefined keys so Appwrite doesn't overwrite with null unexpectedly
    for (const key of Object.keys(payload)) {
      if (payload[key] === undefined) delete payload[key];
    }

    // When we know the owner, repair document permissions so that:
    // - anyone can read (required for token-based join to work)
    // - only the owner can update or delete
    // This also retroactively fixes documents created before the permissions
    // fix was introduced.
    const permissions = gameData.userId
      ? [
          Permission.read(Role.any()),
          Permission.update(Role.user(gameData.userId)),
          Permission.delete(Role.user(gameData.userId)),
        ]
      : undefined;

    const doc = await databases.updateDocument(
      databaseID,
      collection02ID,
      gameId,
      payload,
      permissions
    );

    return documentToGame(doc);
  },

  /**
   * Delete a game document from Appwrite.
   *
   * @param gameId - Appwrite document ID.
   */
  deleteGame: async (gameId: string): Promise<void> => {
    await databases.deleteDocument(databaseID, collection02ID, gameId);
  },

  /**
   * Add a player to an existing game document's `players` array.
   *
   * NOTE: This is a client-side merge and does not use the `player` Appwrite
   * collection (that is task [5] — join-game-server).  Until real-time
   * multiplayer is implemented the players list is managed here as a JSON
   * array stored on the game document.
   *
   * @param token - Shareable game token.
   * @param player - Player object to add.
   * @returns The updated Game.
   */
  /**
   * Persist a player document in the `player` Appwrite collection and return
   * the game the player has joined.
   *
   * The joiner does **not** write to the host's game document (they lack the
   * necessary permission).  Instead a dedicated `player` document is created
   * with a `gameId` field so the host can query "who has joined my game" via
   * Appwrite Realtime (task [6]).
   *
   * Per-player permissions: any authenticated user can read the document;
   * the player themselves can update/delete their own record.
   *
   * @param token - Shareable game token.
   * @param player - Player object to persist (must include `id`).
   * @returns The game the player joined.
   */
  joinGame: async (token: string, player: Player): Promise<Game> => {
    const game = await gameService.getGameByToken(token);
    if (!game) throw new Error("Game not found for token: " + token);

    const playerPerms = player.id
      ? [
          Permission.read(Role.users()),
          Permission.update(Role.user(player.id)),
          Permission.delete(Role.user(player.id)),
        ]
      : [Permission.read(Role.users())];

    await databases.createDocument(
      databaseID,
      collection04ID,
      "unique()",
      {
        id: player.id,
        name: player.name,
        isHost: false,
        joinTime: player.joinTime,
        hasBingo: false,
        gameId: game.id,
      },
      playerPerms,
    );

    return game;
  },

  /**
   * Determine whether the provided set of marked cell indices satisfies any
   * winning pattern for the given board size.
   *
   * This function is **pure** — it does not touch Appwrite or any external
   * state, making it safe to call on every cell mark.
   *
   * @param boardSize - The NxN size of the board (e.g. 5 for a 5×5 board).
   * @param markedCells - Flat list of marked cell indices.
   * @returns `{ hasWon, winningPatterns }` where `winningPatterns` is the
   *   list of index arrays that are fully marked.
   */
  checkWinner: (
    boardSize: number,
    markedCells: number[]
  ): { hasWon: boolean; winningPatterns: number[][] } => {
    const markedSet = new Set(markedCells);
    const winningPatterns: number[][] = [];

    for (const pattern of getWinPatterns(boardSize)) {
      if (pattern.every((idx) => markedSet.has(idx))) {
        winningPatterns.push(pattern);
      }
    }

    return { hasWon: winningPatterns.length > 0, winningPatterns };
  },
};