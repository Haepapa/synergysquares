import { cn } from "@/lib/utils"

interface BingoBoardProps {
  size: number
  values: string[]
  selectedCells: boolean[]
  onToggleCell: (index: number) => void
  hasWon: boolean
  boardColor?: string
  isPreview?: boolean
}

export function BingoBoard({
  size,
  values,
  selectedCells,
  onToggleCell,
  hasWon,
  boardColor = "#333333",
  isPreview = false,
}: BingoBoardProps) {
  // Convert the boardColor to RGB values for use in Tailwind's arbitrary values
  const getRgbColor = (hex: string) => {
    // Remove the # if present
    hex = hex.replace("#", "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return { r, g, b }
  }

  const rgbColor = getRgbColor(boardColor)

  // Find the center cell index for odd-sized boards
  const centerIndex = size % 2 === 1 ? Math.floor(values.length / 2) : -1

  // Function to determine text size class based on content length
  const getTextSizeClass = (text: string) => {
    if (!text) return "text-base"

    const length = text.length

    if (length <= 5) return "text-base"
    if (length <= 10) return "text-sm"
    if (length <= 15) return "text-xs"
    return "text-xs"
  }

  return (
    <div className="relative">
      <div
        className="grid gap-2 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: `${Math.min(600, size * 100)}px`,
        }}
      >
        {values.map((value, index) => {
          const isCenterCell = index === centerIndex

          // For the center FREE cell, always show it as selected
          const isSelected = isCenterCell ? true : selectedCells[index]

          // Determine text size class based on content length
          const textSizeClass = getTextSizeClass(value)

          return (
            <button
              key={index}
              className={cn(
                "aspect-square flex items-center justify-center p-2 text-center rounded-md border-2 transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isSelected && !isPreview
                  ? `bg-[rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})] text-white border-[rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})]`
                  : `bg-card text-card-foreground border-muted`,
                isPreview &&
                  isCenterCell &&
                  `bg-[rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b}/20)] border-[rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b}/30)]`,
                isPreview && !isCenterCell && `hover:border-[rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b}/30)]`,
                hasWon && isSelected && "animate-pulse",
                isPreview && "cursor-default",
              )}
              onClick={() => !isPreview && onToggleCell(index)}
              disabled={isCenterCell || isPreview}
            >
              <span
                className={cn(
                  "font-medium break-words hyphens-auto overflow-hidden",
                  textSizeClass,
                  "leading-tight",
                  isSelected && !isPreview ? "text-white" : "text-foreground",
                  isSelected && !isPreview && "hover:text-white",
                )}
              >
                {value}
              </span>
            </button>
          )
        })}
      </div>

      {hasWon && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="text-center p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-2">BINGO!</h2>
            <p className="text-muted-foreground">You won the game!</p>
          </div>
        </div>
      )}
    </div>
  )
}
