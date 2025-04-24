import type { Cell } from "@/types/game"

export function generateBoardCells(size: number, content: string[] = [], existingCells: Cell[] = []): Cell[] {
  const totalCells = size * size
  const cells: Cell[] = []

  // Create a FREE space in the center for odd-sized boards
  const centerIndex = size % 2 === 1 ? Math.floor(totalCells / 2) : -1

  for (let i = 0; i < totalCells; i++) {
    // If we have existing cells and the index is valid, use that cell
    if (existingCells.length > i) {
      cells.push({
        ...existingCells[i],
        marked: i === centerIndex ? true : existingCells[i].marked,
      })
      continue
    }

    // Otherwise create a new cell
    let cellContent = ""

    if (i === centerIndex) {
      cellContent = "FREE"
    } else if (content.length > 0) {
      // Use provided content if available, cycling through if needed
      const contentIndex = i >= content.length ? i % content.length : i
      cellContent = content[contentIndex]
    } else {
      // Default content is the cell number
      cellContent = `${i + 1}`
    }

    cells.push({
      content: cellContent,
      marked: i === centerIndex, // Mark the FREE space by default
    })
  }

  return cells
}

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
