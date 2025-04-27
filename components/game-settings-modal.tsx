"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGame } from "@/context/game-context"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import type { Game } from "@/types/game"
import { generateBoardCells } from "@/lib/game-utils"
import { presetCategories } from "@/data/presets"
import PresetManager, { type Preset } from "@/components/preset-manager"
import { FolderOpen, Settings2 } from "lucide-react"

interface GameSettingsModalProps {
  game: Game
  onClose: () => void
}

export default function GameSettingsModal({ game, onClose }: GameSettingsModalProps) {
  const { updateGame, fetchGameByToken } = useGame()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("setup")
  const [gameName, setGameName] = useState(game.name || "")
  const [boardSize, setBoardSize] = useState(game.boardSize.toString())
  const [boardColor, setBoardColor] = useState(game.boardColor || "#9333ea") // Default to purple
  const [cellContent, setCellContent] = useState("")
  const [selectedPreset, setSelectedPreset] = useState("")
  const [customPresetName, setCustomPresetName] = useState("")
  const [savedPresets, setSavedPresets] = useState<Record<string, string[]>>({})
  const [gameToken, setGameToken] = useState(game.token || "")
  const [isHost, setIsHost] = useState(game.isHost || true)
  const [isJoining, setIsJoining] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [showPresetManager, setShowPresetManager] = useState(false)

  // Load saved presets from localStorage
  useEffect(() => {
    const savedPresetsJson = localStorage.getItem("bingo-custom-presets")
    if (savedPresetsJson) {
      setSavedPresets(JSON.parse(savedPresetsJson))
    }
  }, [])

  // Initialize cell content from game
  useEffect(() => {
    if (game.cells.length > 0) {
      setCellContent(game.cells.map((cell) => cell.content).join("\n"))
    }
  }, [game.cells])

  // Validate token when it changes
  useEffect(() => {
    const validateToken = async () => {
      if (!gameToken || gameToken.length < 4) {
        setIsValidToken(false)
        return
      }

      try {
        const foundGame = await fetchGameByToken(gameToken)
        setIsValidToken(!!foundGame)
      } catch (error) {
        setIsValidToken(false)
      }
    }

    if (!isHost && gameToken) {
      validateToken()
    } else {
      setIsValidToken(false)
    }
  }, [gameToken, isHost, fetchGameByToken])

  // Fix: Always update cells when saving settings
  const handleSaveSettings = () => {
    const size = Number.parseInt(boardSize)

    if (isNaN(size) || size < 3 || size > 9 || size % 2 === 0) {
      toast.error("Invalid board size", {
        description: "Board size must be an odd number between 3 and 9.",
      })
      return
    }

    // Always generate new cells based on current content
    let contentArray: string[] = []
    if (cellContent.trim()) {
      contentArray = cellContent.split("\n").filter((item) => item.trim())
    }

    // Generate cells with the content array (even if empty)
    const cells = generateBoardCells(size, contentArray, [])

    const updatedGame = {
      ...game,
      name: gameName,
      boardSize: size,
      boardColor,
      cells,
      token: gameToken || game.token,
      isHost,
    }

    updateGame(updatedGame)
    onClose()
  }

  const handleJoinGame = async () => {
    if (!gameToken) {
      toast.error("Missing game token", {
        description: "Please enter a valid game token to join.",
      })
      return
    }

    try {
      // Check if the game token is valid
      const foundGame = await fetchGameByToken(gameToken)

      if (!foundGame) {
        toast.error("Invalid game token", {
          description: "The game token you entered does not exist.",
        })
        return
      }

      // Join the game as a non-host player
      const joinedGame = {
        ...foundGame,
        isHost: false,
        players: [
          ...(foundGame.players || []),
          {
            id: `player_${Date.now()}`,
            name: "You", // This would be the current user's name in a real app
            isHost: false,
            joinTime: new Date().toISOString(),
            hasBingo: false,
          },
        ],
      }

      updateGame(joinedGame)
      onClose()

      toast.success("Game joined", {
        description: "You have successfully joined the game.",
      })
    } catch (error) {
      toast.error("Failed to join game", {
        description: "There was an error joining the game. Please try again.",
      })
    }
  }

  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName)

    let presetContent: string[] = []
    if (presetName in presetCategories) {
      presetContent = presetCategories[presetName]
    } else if (presetName in savedPresets) {
      presetContent = savedPresets[presetName]
    }

    if (presetContent.length > 0) {
      setCellContent(presetContent.join("\n"))
    }
  }

  const handleSavePreset = () => {
    if (!customPresetName.trim()) {
      toast.error("Missing preset name", {
        description: "Please provide a name for your custom preset.",
      })
      return
    }

    const contentArray = cellContent.split("\n").filter((item) => item.trim())
    if (contentArray.length === 0) {
      toast.error("Missing content", {
        description: "Please add content to save as a preset.",
      })
      return
    }

    const updatedPresets = {
      ...savedPresets,
      [customPresetName]: contentArray,
    }

    setSavedPresets(updatedPresets)
    localStorage.setItem("bingo-custom-presets", JSON.stringify(updatedPresets))
    setSelectedPreset(customPresetName)
    setCustomPresetName("")
  }

  const handleGenerateRandomContent = () => {
    if (!selectedPreset) {
      toast.error("No preset selected", {
        description: "Please select a preset to generate random content.",
      })
      return
    }

    let presetContent: string[] = []
    if (selectedPreset in presetCategories) {
      presetContent = presetCategories[selectedPreset]
    } else if (selectedPreset in savedPresets) {
      presetContent = savedPresets[selectedPreset]
    }

    if (presetContent.length === 0) return

    // Shuffle and select items
    const shuffled = [...presetContent].sort(() => 0.5 - Math.random())
    const size = Number.parseInt(boardSize)
    const needed = size * size

    // If we need more items than available, repeat some
    let randomContent: string[] = []
    while (randomContent.length < needed) {
      randomContent = [...randomContent, ...shuffled]
    }

    // Trim to exact size needed
    randomContent = randomContent.slice(0, needed)

    // Add FREE space in the center for odd-sized boards
    if (size % 2 === 1) {
      const centerIndex = Math.floor(needed / 2)
      randomContent[centerIndex] = "FREE"
    }

    setCellContent(randomContent.join("\n"))
  }

  const handleGenerateToken = () => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase()
    setGameToken(token)
  }

  const handleSelectPresetFromManager = (preset: Preset) => {
    setCellContent(preset.content.join("\n"))
    toast.success(`Preset "${preset.name}" loaded`, {
      description: `${preset.content.length} items loaded into your game.`,
    })
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Game Settings</DialogTitle>
            <DialogDescription>Configure your game board and multiplayer options</DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="values">Content</TabsTrigger>
              <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="game-name">Game Name</Label>
                <Input
                  id="game-name"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="My Bingo Game"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="board-size">Board Size (odd number 3-9)</Label>
                <Select value={boardSize} onValueChange={setBoardSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3×3</SelectItem>
                    <SelectItem value="5">5×5</SelectItem>
                    <SelectItem value="7">7×7</SelectItem>
                    <SelectItem value="9">9×9</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="board-color">Board Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="board-color"
                    type="color"
                    value={boardColor}
                    onChange={(e) => setBoardColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={boardColor} onChange={(e) => setBoardColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="values" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="preset">Content Presets</Label>
                  {user && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPresetManager(true)}
                      className="flex items-center text-xs"
                    >
                      <Settings2 className="mr-1 h-3 w-3" />
                      Manage Presets
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {Object.keys(presetCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      {Object.keys(savedPresets).map((preset) => (
                        <SelectItem key={preset} value={preset}>
                          {preset} (Custom)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGenerateRandomContent} className="bg-accent hover:bg-accent/90">
                    Randomize
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cell-content">Cell Content (one item per line)</Label>
                <Textarea
                  id="cell-content"
                  value={cellContent}
                  onChange={(e) => setCellContent(e.target.value)}
                  placeholder="Enter content for each cell, one per line"
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  For odd-sized boards, a FREE space will be automatically added to the center.
                </p>
              </div>

              {!user ? (
                <div className="p-4 border rounded-md bg-muted/50">
                  <h3 className="font-medium flex items-center">
                    <FolderOpen className="mr-2 h-4 w-4 text-accent" />
                    Save Custom Presets
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Log in to create and save your own custom presets for future games.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="custom-preset">Save as Custom Preset</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="custom-preset"
                      value={customPresetName}
                      onChange={(e) => setCustomPresetName(e.target.value)}
                      placeholder="Custom preset name"
                      className="flex-1"
                    />
                    <Button onClick={handleSavePreset} className="bg-accent hover:bg-accent/90">
                      Save Preset
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="multiplayer" className="space-y-4">
              {isHost ? (
                <div className="space-y-2">
                  <Label htmlFor="game-token">Game Token (to share with others)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="game-token"
                      value={gameToken}
                      onChange={(e) => setGameToken(e.target.value)}
                      placeholder="Generate a token to share"
                      className="flex-1"
                      readOnly
                    />
                    <Button onClick={handleGenerateToken} className="bg-accent hover:bg-accent/90">
                      Generate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="join-token">Enter Token to Join Game</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="join-token"
                      value={gameToken}
                      onChange={(e) => setGameToken(e.target.value)}
                      placeholder="Enter token from host"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleJoinGame}
                      className="btn-hover-effect"
                      disabled={!isValidToken}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  variant={isHost ? "outline" : "default"}
                  className={`w-full ${isHost ? "btn-hover-effect" : "bg-accent hover:bg-accent/90"}`}
                  onClick={() => {
                    setIsHost(!isHost)
                    setGameToken("")
                  }}
                >
                  {isHost ? "Join Existing Game" : "Create New Hosted Game"}
                </Button>
              </div>

              <div className="p-4 border rounded-md bg-muted">
                <h3 className="font-medium">How Multiplayer Works</h3>
                <ul className="mt-2 ml-5 text-sm list-disc text-muted-foreground">
                  <li>As a host: Generate a token and share it with others to join your game</li>
                  <li>As a player: Enter a token you received to join someone else's game</li>
                  <li>All players will see the same board and can mark cells independently</li>
                  <li>The host can see all players and remove them if needed</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="btn-hover-effect">
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="bg-accent hover:bg-accent/90">
              Apply Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preset Manager Dialog */}
      {showPresetManager && (
        <PresetManager
          open={showPresetManager}
          onClose={() => setShowPresetManager(false)}
          onSelectPreset={handleSelectPresetFromManager}
        />
      )}
    </>
  )
}
