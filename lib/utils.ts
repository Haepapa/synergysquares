import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function getWinPatterns(size: number): number[][] {
  const patterns: number[][] = []

  // Rows
  for (let i = 0; i < size; i++) {
    const row: number[] = []
    for (let j = 0; j < size; j++) {
      row.push(i * size + j)
    }
    patterns.push(row)
  }

  // Columns
  for (let i = 0; i < size; i++) {
    const column: number[] = []
    for (let j = 0; j < size; j++) {
      column.push(j * size + i)
    }
    patterns.push(column)
  }

  // Diagonal (top-left to bottom-right)
  const diagonal1: number[] = []
  for (let i = 0; i < size; i++) {
    diagonal1.push(i * size + i)
  }
  patterns.push(diagonal1)

  // Diagonal (top-right to bottom-left)
  const diagonal2: number[] = []
  for (let i = 0; i < size; i++) {
    diagonal2.push(i * size + (size - 1 - i))
  }
  patterns.push(diagonal2)

  // Four corners (for boards 3×3 or larger)
  if (size >= 3) {
    patterns.push([
      0, // top-left
      size - 1, // top-right
      size * (size - 1), // bottom-left
      size * size - 1, // bottom-right
    ])
  }

  return patterns
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
