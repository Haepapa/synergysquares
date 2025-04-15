import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X, Play, Sparkles } from "lucide-react"
import type { Game } from "@/lib/types"
import { generateDefaultBingoValues } from "@/lib/bingo-utils"
import { getRandomWordsFromCategory, getRandomWordsFromAllCategories } from "@/lib/buzzwords"
import { toast } from "sonner"

interface GameSettingsProps {
  game: Game
  onUpdateGame: (updates: Partial<Game>) => void
  onStartGame: () => void
  username: string
  onUsernameChange: (username: string) => void
  onHostGame: () => void
  onJoinGame: (token: string) => void
  onClose: () => void
}

export function GameSettings({
  game,
  onUpdateGame,
  onStartGame,
  username,
  onUsernameChange,
  onHostGame,
  onJoinGame,
  onClose,
}: GameSettingsProps) {
  const [joinToken, setJoinToken] = useState("")
  const [bulkValues, setBulkValues] = useState("")
  const [activeTab, setActiveTab] = useState("setup")

  const handleSizeChange = (value: number[]) => {
    const newSize = value[0]
    onUpdateGame({
      boardSize: newSize,
      bingoValues: generateDefaultBingoValues(newSize),
      selectedCells: Array(newSize * newSize).fill(false),
    })
  }

  const handleGameNameChange = (name: string) => {
    onUpdateGame({ name })
  }

  const handleColorChange = (color: string) => {
    onUpdateGame({ boardColor: color })
  }

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...game.bingoValues]
    newValues[index] = value
    onUpdateGame({ bingoValues: newValues })
  }

  const handleBulkValuesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkValues(e.target.value)
  }

  const applyBulkValues = () => {
    const values = bulkValues.split("\n").filter((v) => v.trim() !== "")

    if (values.length > 0) {
      const newValues = [...game.bingoValues]

      // Apply values, skipping the center cell for odd-sized boards
      let valueIndex = 0
      for (let i = 0; i < newValues.length; i++) {
        const isCenterCell = i === Math.floor(newValues.length / 2)

        if (!isCenterCell && valueIndex < values.length) {
          newValues[i] = values[valueIndex]
          valueIndex++
        }
      }

      onUpdateGame({ bingoValues: newValues })
    }
  }

  const applyPresetCategory = (category: string) => {
    const totalCells = game.boardSize * game.boardSize
    const centerIndex = Math.floor(totalCells / 2)
    const wordsNeeded = game.boardSize % 2 === 1 ? totalCells - 1 : totalCells // Exclude center cell for odd-sized boards

    let words: string[]

    if (category === "Randomize") {
      words = getRandomWordsFromAllCategories(wordsNeeded)
      toast.success("Buzzwords Added", {
        description: "Random buzzwords from all categories have been added to your board.",
      })
    } else {
      words = getRandomWordsFromCategory(category, wordsNeeded)
      toast.success("Buzzwords Added", {
        description: `Buzzwords from "${category}" have been added to your board.`,
      })
    }

    // If we don't have enough words, fill the rest with defaults
    if (words.length < wordsNeeded) {
      for (let i = words.length; i < wordsNeeded; i++) {
        words.push(`B-${i + 1}`)
      }
    }

    // Create new values array
    const newValues: string[] = []
    let wordIndex = 0

    for (let i = 0; i < totalCells; i++) {
      if (game.boardSize % 2 === 1 && i === centerIndex) {
        // Keep "FREE" in the center for odd-sized boards
        newValues.push("FREE")
      } else {
        newValues.push(words[wordIndex])
        wordIndex++
      }
    }

    onUpdateGame({ bingoValues: newValues })
  }

  const handleStartGame = () => {
    onStartGame()
    onClose()
  }

  // Function to navigate to the next tab
  const goToNextTab = () => {
    if (activeTab === "setup") setActiveTab("values")
    else if (activeTab === "values") setActiveTab("multiplayer")
  }

  // Function to navigate to the previous tab
  const goToPrevTab = () => {
    if (activeTab === "multiplayer") setActiveTab("values")
    else if (activeTab === "values") setActiveTab("setup")
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">Game Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!game.isStarted && (
        <div className="p-4 border-b">
          <Button className="w-full" onClick={handleStartGame} disabled={!game.name} size="lg">
            <Play className="mr-2 h-4 w-4" />
            Start Playing
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="setup" className="relative">
            <span className="flex items-center">
              <span className="bg-primary/20 text-primary font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                1
              </span>
              Setup
            </span>
          </TabsTrigger>
          <TabsTrigger value="values" className="relative">
            <span className="flex items-center">
              <span className="bg-primary/20 text-primary font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                2
              </span>
              Values
            </span>
          </TabsTrigger>
          <TabsTrigger value="multiplayer" className="relative">
            <span className="flex items-center">
              <span className="bg-primary/20 text-primary font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                3
              </span>
              Multiplayer
            </span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="setup" className="space-y-4 mt-0">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Name your game and customize the board size and color to get started.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="game-name">Game Name</Label>
              <Input
                id="game-name"
                placeholder="Enter a name for this game"
                value={game.name}
                onChange={(e) => handleGameNameChange(e.target.value)}
                disabled={game.isStarted}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>
                  Board Size: {game.boardSize}×{game.boardSize}
                </Label>
              </div>
              <Slider
                value={[game.boardSize]}
                min={3}
                max={9}
                step={2} // Only allow odd numbers
                onValueChange={handleSizeChange}
                disabled={game.isStarted}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="board-color">Board Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="board-color"
                  value={game.boardColor || "#4a6da7"}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border-0"
                  disabled={game.isStarted}
                />
                <span className="text-sm text-muted-foreground">Choose a color for your game board</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="values" className="space-y-4 mt-0">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Fill your board with content. Use presets or add your own custom values.
              </p>
            </div>

            <Accordion type="single" collapsible className="border rounded-md">
              <AccordionItem value="presets">
                <AccordionTrigger className="px-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-foreground" />
                    <span>Presets</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Select a category to fill your board with themed buzzwords
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Communication & Influence",
                        "Technology & Innovation",
                        "People & Culture",
                        "Financial & Performance",
                        "Operational & Efficiency",
                        "Strategic & Visionary",
                        "Randomize",
                      ].map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          className="justify-start"
                          onClick={() => applyPresetCategory(category)}
                          disabled={game.isStarted}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-2">
              <Label htmlFor="bulk-values">Bulk Add Values (one per line)</Label>
              <Textarea
                id="bulk-values"
                placeholder="Enter values, one per line"
                value={bulkValues}
                onChange={handleBulkValuesChange}
                className="h-24"
                disabled={game.isStarted}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={applyBulkValues}
                className="w-full"
                disabled={game.isStarted}
              >
                Apply Values
              </Button>
            </div>

            <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
              {game.bingoValues.map((value, index) => {
                // Skip the center cell in odd-sized boards
                const isCenterCell = index === Math.floor(game.bingoValues.length / 2)

                return (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`value-${index}`} className="text-xs">
                      Cell {index + 1} {isCenterCell ? "(Center - Always FREE)" : ""}
                    </Label>
                    <Input
                      id={`value-${index}`}
                      value={isCenterCell ? "FREE" : value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      disabled={isCenterCell || game.isStarted}
                      placeholder={`Value ${index + 1}`}
                    />
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="multiplayer" className="space-y-4 mt-0">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Optional: Enter your name to play with others. Host a game to share or join an existing game.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                disabled={game.isStarted}
              />
              <p className="text-xs text-muted-foreground">Required for hosting or joining games</p>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Host a Game</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Share your game with others. You need to enter your name first. Games automatically expire after 6
                hours.
              </p>
              <Button variant="outline" onClick={onHostGame} disabled={!username || game.isStarted} className="w-full">
                Host Game
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Join a Game</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Enter a game token to join. You need to enter your name first.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter game token"
                  value={joinToken}
                  onChange={(e) => setJoinToken(e.target.value)}
                  disabled={game.isStarted}
                />
                <Button
                  variant="secondary"
                  onClick={() => onJoinGame(joinToken)}
                  disabled={!joinToken || !username || game.isStarted}
                >
                  Join
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleStartGame} disabled={!game.name} variant="default">
                <Play className="mr-2 h-4 w-4" />
                Start Game
              </Button>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
