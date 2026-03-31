/**
 * Tests for lib/game-utils.ts
 *
 * generateBoardCells and getWinPatterns are pure functions used directly by
 * the game context when creating and evaluating games.  They require no
 * mocking or external state.
 */

import { describe, it, expect } from "vitest";
import { generateBoardCells, getWinPatterns } from "@/lib/game-utils";

// ---------------------------------------------------------------------------
// generateBoardCells
// ---------------------------------------------------------------------------

describe("generateBoardCells", () => {
  describe("3×3 board", () => {
    it("generates exactly 9 cells", () => {
      expect(generateBoardCells(3, [], [])).toHaveLength(9);
    });

    it("places FREE in the centre (index 4)", () => {
      const cells = generateBoardCells(3, [], []);
      expect(cells[4].content).toBe("FREE");
      expect(cells[4].marked).toBe(true);
    });

    it("marks only the centre cell by default", () => {
      const cells = generateBoardCells(3, [], []);
      const markedCount = cells.filter((c) => c.marked).length;
      expect(markedCount).toBe(1);
    });

    it("fills cells with provided content", () => {
      const content = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      const cells = generateBoardCells(3, content, []);
      // Centre is always FREE regardless of provided content
      expect(cells[4].content).toBe("FREE");
      // Other cells use the supplied content
      expect(cells[0].content).toBe("A");
      expect(cells[1].content).toBe("B");
    });

    it("cycles content when fewer items than cells", () => {
      const content = ["X", "Y"];
      const cells = generateBoardCells(3, content, []);
      // Content cycles: index % content.length (excluding FREE centre)
      expect(cells[0].content).toBe("X");
      expect(cells[1].content).toBe("Y");
    });
  });

  describe("5×5 board", () => {
    it("generates exactly 25 cells", () => {
      expect(generateBoardCells(5, [], [])).toHaveLength(25);
    });

    it("places FREE in the centre (index 12)", () => {
      const cells = generateBoardCells(5, [], []);
      expect(cells[12].content).toBe("FREE");
      expect(cells[12].marked).toBe(true);
    });

    it("uses default numeric content when none provided", () => {
      const cells = generateBoardCells(5, [], []);
      // Index 0 should be "1", index 1 "2", etc. (centre is FREE)
      expect(cells[0].content).toBe("1");
      expect(cells[1].content).toBe("2");
    });
  });

  describe("9×9 board (even would skip FREE)", () => {
    it("generates exactly 81 cells", () => {
      expect(generateBoardCells(9, [], [])).toHaveLength(81);
    });

    it("places FREE in the centre (index 40)", () => {
      const cells = generateBoardCells(9, [], []);
      expect(cells[40].content).toBe("FREE");
    });
  });

  describe("existing cells preservation", () => {
    it("reuses existing cells when provided", () => {
      const existing = generateBoardCells(3, ["A", "B", "C", "D", "E", "F", "G", "H", "I"], []);
      existing[0].marked = true;
      const refreshed = generateBoardCells(3, [], existing);
      expect(refreshed[0].marked).toBe(true);
    });

    it("always marks centre as marked even if existing has it unmarked", () => {
      const existing = generateBoardCells(3, [], []);
      existing[4].marked = false; // manually unmark FREE
      const refreshed = generateBoardCells(3, [], existing);
      expect(refreshed[4].marked).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// getWinPatterns
// ---------------------------------------------------------------------------

describe("getWinPatterns", () => {
  describe("3×3 board", () => {
    const patterns = getWinPatterns(3);

    it("returns correct total pattern count (3 rows + 3 cols + 2 diags + 4 corners = 9)", () => {
      expect(patterns).toHaveLength(9);
    });

    it("includes all three rows", () => {
      expect(patterns).toContainEqual([0, 1, 2]);
      expect(patterns).toContainEqual([3, 4, 5]);
      expect(patterns).toContainEqual([6, 7, 8]);
    });

    it("includes all three columns", () => {
      expect(patterns).toContainEqual([0, 3, 6]);
      expect(patterns).toContainEqual([1, 4, 7]);
      expect(patterns).toContainEqual([2, 5, 8]);
    });

    it("includes both diagonals", () => {
      expect(patterns).toContainEqual([0, 4, 8]); // TL→BR
      expect(patterns).toContainEqual([2, 4, 6]); // TR→BL
    });

    it("includes four corners", () => {
      expect(patterns).toContainEqual([0, 2, 6, 8]);
    });
  });

  describe("5×5 board", () => {
    const patterns = getWinPatterns(5);

    it("returns correct total pattern count (5+5+2+1 = 13)", () => {
      expect(patterns).toHaveLength(13);
    });

    it("includes first and last rows", () => {
      expect(patterns).toContainEqual([0, 1, 2, 3, 4]);
      expect(patterns).toContainEqual([20, 21, 22, 23, 24]);
    });

    it("includes first and last columns", () => {
      expect(patterns).toContainEqual([0, 5, 10, 15, 20]);
      expect(patterns).toContainEqual([4, 9, 14, 19, 24]);
    });

    it("includes TL→BR diagonal", () => {
      expect(patterns).toContainEqual([0, 6, 12, 18, 24]);
    });

    it("includes TR→BL diagonal", () => {
      expect(patterns).toContainEqual([4, 8, 12, 16, 20]);
    });

    it("includes four corners (0, 4, 20, 24)", () => {
      expect(patterns).toContainEqual([0, 4, 20, 24]);
    });
  });

  describe("pattern integrity", () => {
    it("every pattern index is within bounds for the board size", () => {
      for (const size of [3, 5, 7, 9]) {
        const total = size * size;
        const patterns = getWinPatterns(size);
        for (const pattern of patterns) {
          for (const idx of pattern) {
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThan(total);
          }
        }
      }
    });

    it("no pattern has duplicate indices", () => {
      for (const size of [3, 5, 7, 9]) {
        const patterns = getWinPatterns(size);
        for (const pattern of patterns) {
          const unique = new Set(pattern);
          expect(unique.size).toBe(pattern.length);
        }
      }
    });
  });
});
