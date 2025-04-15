export function generateDefaultBingoValues(size: number): string[] {
  const totalCells = size * size
  const values: string[] = []

  for (let i = 0; i < totalCells; i++) {
    // If it's a center cell in an odd-sized board, set it to "FREE"
    if (size % 2 === 1 && i === Math.floor(totalCells / 2)) {
      values.push("FREE")
    } else {
      values.push(`B-${i + 1}`)
    }
  }

  return values
}

export function checkForWin(selectedCells: boolean[], size: number): string[] {
  // Create a copy of the selected cells array to work with
  const cellsToCheck = [...selectedCells]

  // Automatically mark the center cell as selected if it's an odd-sized board
  if (size % 2 === 1) {
    const centerIndex = Math.floor(cellsToCheck.length / 2)
    cellsToCheck[centerIndex] = true
  }

  const winningLines: string[] = []

  // Check rows
  for (let row = 0; row < size; row++) {
    let rowComplete = true
    for (let col = 0; col < size; col++) {
      const index = row * size + col
      if (!cellsToCheck[index]) {
        rowComplete = false
        break
      }
    }
    if (rowComplete) winningLines.push(`row-${row}`)
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    let colComplete = true
    for (let row = 0; row < size; row++) {
      const index = row * size + col
      if (!cellsToCheck[index]) {
        colComplete = false
        break
      }
    }
    if (colComplete) winningLines.push(`col-${col}`)
  }

  // Check diagonal (top-left to bottom-right)
  let diag1Complete = true
  for (let i = 0; i < size; i++) {
    const index = i * size + i
    if (!cellsToCheck[index]) {
      diag1Complete = false
      break
    }
  }
  if (diag1Complete) winningLines.push("diag-1")

  // Check diagonal (top-right to bottom-left)
  let diag2Complete = true
  for (let i = 0; i < size; i++) {
    const index = i * size + (size - 1 - i)
    if (!cellsToCheck[index]) {
      diag2Complete = false
      break
    }
  }
  if (diag2Complete) winningLines.push("diag-2")

  // Check four corners
  if (size >= 3) {
    const topLeft = 0
    const topRight = size - 1
    const bottomLeft = size * (size - 1)
    const bottomRight = size * size - 1

    if (cellsToCheck[topLeft] && cellsToCheck[topRight] && cellsToCheck[bottomLeft] && cellsToCheck[bottomRight]) {
      winningLines.push("corners")
    }
  }

  return winningLines
}

export function generateGameToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
