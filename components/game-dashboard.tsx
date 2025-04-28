"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Plus,
  X,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  Play,
  Pause,
  Maximize,
  Minimize,
  Home,
} from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import GameBoard from "@/components/game-board"
import GameSettingsModal from "@/components/game-settings-modal"
import PlayerListPanel from "@/components/player-list-panel"
import AccountDialog from "@/components/account-dialog"
import { useGame } from "@/context/game-context"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import SynergySquaresLogo from "@/components/synergy-squares-logo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AuthDialog from "@/components/auth-dialog"
import Link from "next/link"

export default function GameDashboard() {
  const { games, activeGameId, setActiveGameId, createGame, removeGame, updateGame } = useGame()
  const { user, logout } = useAuth()
  const [showSettings, setShowSettings] = useState(false)
  const [showPlayerList, setShowPlayerList] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [gameToRemove, setGameToRemove] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  // Create a default game if none exists
  useEffect(() => {
    if (games.length === 0) {
      handleCreateGame()
    } else if (!activeGameId && games.length > 0) {
      setActiveGameId(games[0].id)
    }
  }, [games, activeGameId, setActiveGameId])

  const handleCreateGame = () => {
    const newGameId = createGame()
    setActiveGameId(newGameId)
    setShowSettings(true)
    toast.success("New game created", {
      description: "Customize your game settings to get started.",
    })
  }

  const handleRemoveGame = (gameId: string) => {
    setGameToRemove(gameId)
  }

  const confirmRemoveGame = () => {
    if (gameToRemove) {
      removeGame(gameToRemove)
      setGameToRemove(null)
      toast.success("Game removed", {
        description: "The game has been removed successfully.",
      })
    }
  }

  const toggleGameStatus = (game: any) => {
    // If game has winning patterns, don't allow status changes
    if (game.winningPatterns && game.winningPatterns.length > 0) {
      toast.info("Game completed", {
        description: "This game has been won and cannot be modified.",
      })
      return
    }

    // Only the host can control the game in multiplayer
    if (!game.isHost) {
      toast.info("Permission denied", {
        description: "Only the game organizer can control the game.",
      })
      return
    }

    if (game.status === "not_started") {
      updateGame({
        ...game,
        status: "playing",
        startTime: new Date().toISOString(),
      })
      toast.success("Game started")
    } else if (game.status === "playing") {
      updateGame({
        ...game,
        status: "paused",
      })
      toast.info("Game paused")
    } else if (game.status === "paused") {
      updateGame({
        ...game,
        status: "playing",
      })
      toast.success("Game resumed")
    }
  }

  const scrollTabs = (direction: "left" | "right") => {
    const tabsContainer = tabsContainerRef.current
    if (tabsContainer) {
      const scrollAmount = 150
      const newPosition =
        direction === "left" ? tabsContainer.scrollLeft - scrollAmount : tabsContainer.scrollLeft + scrollAmount

      tabsContainer.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
    }
  }

  const scrollToTab = (tabId: string) => {
    const tabsContainer = tabsContainerRef.current
    if (tabsContainer) {
      const tabElement = tabsContainer.querySelector(`[data-value="${tabId}"]`)
      if (tabElement) {
        tabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }

  // When active tab changes, scroll it into view
  useEffect(() => {
    if (activeGameId) {
      scrollToTab(activeGameId)
    }
  }, [activeGameId])

  const activeGame = games.find((game) => game.id === activeGameId)
  const isGameWon = activeGame?.winningPatterns && activeGame.winningPatterns.length > 0
  const shouldPulsePlayButton = activeGame && (activeGame.status === "not_started" || activeGame.status === "paused")

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAccountMenu &&
        !(event.target as Element).closest(".account-menu") &&
        !(event.target as Element).closest('button[title="Account options"]')
      ) {
        setShowAccountMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAccountMenu])

  return (
    <div className="flex flex-col min-h-screen">
      {!isFullscreen && (
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <SynergySquaresLogo className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Synergy Squares</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="icon" className="btn-hover-effect" title="Back to home">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              className="btn-hover-effect"
              onClick={() => {
                if (user) {
                  setShowAccountMenu(true)
                } else {
                  setAuthMode("login")
                  setShowAuthDialog(true)
                }
              }}
              title={user ? "Account options" : "Login or sign up"}
            >
              <UserCircle className="w-5 h-5" />
            </Button>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        {!isFullscreen && (
          <Tabs value={activeGameId || ""} onValueChange={setActiveGameId} className="flex-1 flex flex-col">
            <div className="flex items-center px-4 py-2 border-b relative">
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 h-8 w-8 p-0 btn-hover-effect"
                onClick={() => scrollTabs("left")}
                title="Scroll tabs left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 overflow-x-hidden tabs-container" ref={tabsContainerRef}>
                <TabsList className="flex h-auto justify-start w-max">
                  {games.map((game) => (
                    <TabsTrigger
                      key={game.id}
                      value={game.id}
                      data-value={game.id}
                      className="flex items-center justify-between px-4 py-2 space-x-2 flex-shrink-0 btn-hover-effect tab-item"
                    >
                      <span className="truncate">{game.name || `Game ${game.id.slice(0, 4)}`}</span>
                      <span
                        className="ml-2 h-5 w-5 p-0 flex-shrink-0 cursor-pointer flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveGame(game.id)
                        }}
                        title="Leave this game"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove game</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-8 w-8 p-0 btn-hover-effect"
                onClick={() => scrollTabs("right")}
                title="Scroll tabs right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="ml-2 btn-hover-effect"
                onClick={handleCreateGame}
                title="Create new game"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Create new game</span>
              </Button>
            </div>

            {games.map((game) => (
              <TabsContent key={game.id} value={game.id} className="flex-1 p-4 overflow-auto">
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center mb-4 space-x-4">
                    <div className="flex flex-col space-y-3 mt-8">
                      {!isGameWon && (
                        <Button
                          variant="outline"
                          size="icon"
                          className={`btn-hover-effect ${
                            game.status === "not_started" || game.status === "paused" ? "animate-pulse-border" : ""
                          } ${!game.isHost || game.status === "playing" ? "opacity-50" : ""}`}
                          onClick={() => toggleGameStatus(game)}
                          disabled={game.cells.some((cell) => !cell.content) || !game.isHost}
                          title={
                            !game.isHost
                              ? "Only the game organizer can control the game"
                              : game.status === "playing"
                                ? "Pause game"
                                : "Play game"
                          }
                        >
                          {game.status === "playing" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          <span className="sr-only">{game.status === "playing" ? "Pause Game" : "Play Game"}</span>
                        </Button>
                      )}

                      {!isGameWon && (
                        <Button
                          variant="outline"
                          size="icon"
                          className={`btn-hover-effect ${game.status === "playing" || !game.isHost ? "opacity-50" : ""}`}
                          onClick={() => setShowSettings(true)}
                          disabled={game.status === "playing" || !game.isHost}
                          title={
                            !game.isHost
                              ? "Only the game organizer can modify settings"
                              : game.status === "playing"
                                ? "Pause the game to edit settings"
                                : "Game settings"
                          }
                        >
                          <Settings className="h-5 w-5" />
                          <span className="sr-only">Game Settings</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        className="btn-hover-effect"
                        onClick={() => setShowPlayerList(true)}
                        title="View players"
                      >
                        <Users className="h-5 w-5" />
                        <span className="sr-only">Players</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="btn-hover-effect"
                        onClick={toggleFullscreen}
                        title="Enter fullscreen"
                      >
                        <Maximize className="h-5 w-5" />
                        <span className="sr-only">Fullscreen</span>
                      </Button>
                    </div>

                    <GameBoard game={game} />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {isFullscreen && activeGame && (
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center">
              <GameBoard game={activeGame} fullscreen={true} />
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {!isGameWon && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`btn-hover-effect bg-background/80 backdrop-blur-sm ${
                    shouldPulsePlayButton ? "animate-pulse-border" : ""
                  } ${!activeGame.isHost ? "opacity-50" : ""}`}
                  onClick={() => toggleGameStatus(activeGame)}
                  disabled={!activeGame.isHost}
                  title={
                    !activeGame.isHost
                      ? "Only the game organizer can control the game"
                      : activeGame.status === "playing"
                        ? "Pause game"
                        : "Play game"
                  }
                >
                  {activeGame.status === "playing" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="btn-hover-effect bg-background/80 backdrop-blur-sm"
                onClick={() => setShowPlayerList(true)}
                title="View players"
              >
                <Users className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="btn-hover-effect bg-background/80 backdrop-blur-sm"
                onClick={toggleFullscreen}
                title="Exit fullscreen"
              >
                <Minimize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {showSettings && activeGame && <GameSettingsModal game={activeGame} onClose={() => setShowSettings(false)} />}

      {showPlayerList && activeGame && (
        <PlayerListPanel game={activeGame} onClose={() => setShowPlayerList(false)} position="right" />
      )}

      {showAccountDialog && <AccountDialog onClose={() => setShowAccountDialog(false)} />}

      <AlertDialog open={!!gameToRemove} onOpenChange={(open) => !open && setGameToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this game? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-hover-effect">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveGame} className="bg-accent hover:bg-accent/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showAccountMenu && user && (
        <div className="fixed right-4 top-16 w-48 bg-background border rounded-md shadow-md z-50 overflow-hidden account-menu">
          <div className="p-2 border-b">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => {
                setShowAccountDialog(true)
                setShowAccountMenu(false)
              }}
            >
              Preferences
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-red-500 hover:text-red-600"
              onClick={() => {
                logout()
                setShowAccountMenu(false)
                toast.success("Logged out successfully")
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      )}

      {showAuthDialog && (
        <AuthDialog
          mode={authMode}
          onClose={() => setShowAuthDialog(false)}
          onModeChange={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  )
}
