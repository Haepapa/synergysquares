/**
 * Tests for lib/game-service.ts
 *
 * Covers the pure/stateless helpers that do not require an Appwrite connection:
 *   - checkWinner (pure win-detection logic)
 *
 * The Appwrite-backed async functions (createGame, getUserGames, etc.) are
 * integration-tested manually against a local Appwrite instance.  Unit tests
 * for those would require mocking the Appwrite SDK; the vi.mock stub below
 * keeps the module importable in the test environment.
 */

import { describe, it, expect, vi } from "vitest";

// Mock the entire appwrite-config module so tests run without live credentials.
// The checkWinner function is pure (no Appwrite calls) but importing game-service
// pulls in appwrite-config at module scope.
vi.mock("@/lib/appwrite-config", () => ({
  databaseID: "test-db",
  collection02ID: "test-games",
  client_: {},
  account: {},
  databases: {
    createDocument: vi.fn(),
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
  storage: {},
  functions: {},
}));

import { gameService } from "@/lib/game-service";

// ---------------------------------------------------------------------------
// checkWinner — pure function, no Appwrite required
// ---------------------------------------------------------------------------

describe("gameService.checkWinner", () => {
  describe("3×3 board", () => {
    const SIZE = 3;

    it("returns hasWon=false when no cells are marked", () => {
      const result = gameService.checkWinner(SIZE, []);
      expect(result.hasWon).toBe(false);
      expect(result.winningPatterns).toHaveLength(0);
    });

    it("detects a winning top row", () => {
      const result = gameService.checkWinner(SIZE, [0, 1, 2]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 1, 2]);
    });

    it("detects a winning left column", () => {
      const result = gameService.checkWinner(SIZE, [0, 3, 6]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 3, 6]);
    });

    it("detects top-left → bottom-right diagonal", () => {
      const result = gameService.checkWinner(SIZE, [0, 4, 8]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 4, 8]);
    });

    it("detects top-right → bottom-left diagonal", () => {
      const result = gameService.checkWinner(SIZE, [2, 4, 6]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([2, 4, 6]);
    });

    it("detects four corners pattern", () => {
      const result = gameService.checkWinner(SIZE, [0, 2, 6, 8]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 2, 6, 8]);
    });

    it("returns hasWon=false for partial row", () => {
      const result = gameService.checkWinner(SIZE, [0, 1]);
      expect(result.hasWon).toBe(false);
    });

    it("can return multiple winning patterns at once", () => {
      // Full board: all cells marked → every row/column/diagonal wins
      const allCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = gameService.checkWinner(SIZE, allCells);
      expect(result.hasWon).toBe(true);
      // 3 rows + 3 cols + 2 diagonals + 4-corners = 9 patterns
      expect(result.winningPatterns.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe("5×5 board", () => {
    const SIZE = 5;

    it("returns hasWon=false when nothing is marked", () => {
      expect(gameService.checkWinner(SIZE, []).hasWon).toBe(false);
    });

    it("detects winning second row (indices 5–9)", () => {
      const result = gameService.checkWinner(SIZE, [5, 6, 7, 8, 9]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([5, 6, 7, 8, 9]);
    });

    it("detects winning third column (indices 2,7,12,17,22)", () => {
      const result = gameService.checkWinner(SIZE, [2, 7, 12, 17, 22]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([2, 7, 12, 17, 22]);
    });

    it("detects top-left diagonal on 5×5", () => {
      const result = gameService.checkWinner(SIZE, [0, 6, 12, 18, 24]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 6, 12, 18, 24]);
    });

    it("detects four corners on 5×5 (0, 4, 20, 24)", () => {
      const result = gameService.checkWinner(SIZE, [0, 4, 20, 24]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 4, 20, 24]);
    });

    it("does not win with only 4 of 5 in a row", () => {
      const result = gameService.checkWinner(SIZE, [0, 1, 2, 3]); // missing 4
      expect(result.hasWon).toBe(false);
    });
  });

  describe("9×9 board", () => {
    const SIZE = 9;

    it("detects first row win on 9×9", () => {
      const firstRow = Array.from({ length: 9 }, (_, i) => i); // 0..8
      const result = gameService.checkWinner(SIZE, firstRow);
      expect(result.hasWon).toBe(true);
    });

    it("does not win with partial row on 9×9", () => {
      const result = gameService.checkWinner(SIZE, [0, 1, 2, 3, 4, 5, 6, 7]);
      expect(result.hasWon).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// checkWinner — pure function, no Appwrite required
// ---------------------------------------------------------------------------

describe("gameService.checkWinner", () => {
  describe("3×3 board", () => {
    const SIZE = 3;

    it("returns hasWon=false when no cells are marked", () => {
      const result = gameService.checkWinner(SIZE, []);
      expect(result.hasWon).toBe(false);
      expect(result.winningPatterns).toHaveLength(0);
    });

    it("detects a winning top row", () => {
      const result = gameService.checkWinner(SIZE, [0, 1, 2]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 1, 2]);
    });

    it("detects a winning left column", () => {
      const result = gameService.checkWinner(SIZE, [0, 3, 6]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 3, 6]);
    });

    it("detects top-left → bottom-right diagonal", () => {
      const result = gameService.checkWinner(SIZE, [0, 4, 8]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 4, 8]);
    });

    it("detects top-right → bottom-left diagonal", () => {
      const result = gameService.checkWinner(SIZE, [2, 4, 6]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([2, 4, 6]);
    });

    it("detects four corners pattern", () => {
      const result = gameService.checkWinner(SIZE, [0, 2, 6, 8]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 2, 6, 8]);
    });

    it("returns hasWon=false for partial row", () => {
      const result = gameService.checkWinner(SIZE, [0, 1]);
      expect(result.hasWon).toBe(false);
    });

    it("can return multiple winning patterns at once", () => {
      // Full board: all cells marked → every row/column/diagonal wins
      const allCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = gameService.checkWinner(SIZE, allCells);
      expect(result.hasWon).toBe(true);
      // 3 rows + 3 cols + 2 diagonals + 4-corners = 9 patterns
      expect(result.winningPatterns.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe("5×5 board", () => {
    const SIZE = 5;

    it("returns hasWon=false when nothing is marked", () => {
      expect(gameService.checkWinner(SIZE, []).hasWon).toBe(false);
    });

    it("detects winning second row (indices 5–9)", () => {
      const result = gameService.checkWinner(SIZE, [5, 6, 7, 8, 9]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([5, 6, 7, 8, 9]);
    });

    it("detects winning third column (indices 2,7,12,17,22)", () => {
      const result = gameService.checkWinner(SIZE, [2, 7, 12, 17, 22]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([2, 7, 12, 17, 22]);
    });

    it("detects top-left diagonal on 5×5", () => {
      const result = gameService.checkWinner(SIZE, [0, 6, 12, 18, 24]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 6, 12, 18, 24]);
    });

    it("detects four corners on 5×5 (0, 4, 20, 24)", () => {
      const result = gameService.checkWinner(SIZE, [0, 4, 20, 24]);
      expect(result.hasWon).toBe(true);
      expect(result.winningPatterns).toContainEqual([0, 4, 20, 24]);
    });

    it("does not win with only 4 of 5 in a row", () => {
      const result = gameService.checkWinner(SIZE, [0, 1, 2, 3]); // missing 4
      expect(result.hasWon).toBe(false);
    });
  });

  describe("9×9 board", () => {
    const SIZE = 9;

    it("detects first row win on 9×9", () => {
      const firstRow = Array.from({ length: 9 }, (_, i) => i); // 0..8
      const result = gameService.checkWinner(SIZE, firstRow);
      expect(result.hasWon).toBe(true);
    });

    it("does not win with partial row on 9×9", () => {
      const result = gameService.checkWinner(SIZE, [0, 1, 2, 3, 4, 5, 6, 7]);
      expect(result.hasWon).toBe(false);
    });
  });
});
