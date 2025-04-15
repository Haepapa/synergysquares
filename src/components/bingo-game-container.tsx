"use client";

import { useState, useEffect } from "react";
import { BingoGame } from "./bingo-game";
import { GameTabs } from "./game-tabs";
import { PlayerList } from "./player-list";
import { GameProvider } from "@/context/game-context";
import type { Game, Player } from "@/lib/types";
import {
  generateDefaultBingoValues,
  generateGameToken,
} from "@/lib/bingo-utils";
import { IntroScreen } from "./intro-screen";
import { toast } from "sonner";

export function BingoGameContainer() {
  const [isPlayerListOpen, setIsPlayerListOpen] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [hasConfiguredGame, setHasConfiguredGame] = useState(false);

  // Check if user has visited before
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("bingo-visited");
    if (hasVisitedBefore) {
      setShowIntro(false);
    }
  }, []);

  // Initialize with a default game if none exists and not showing intro
  useEffect(() => {
    if (games.length === 0 && !showIntro) {
      createNewGame();
    }
  }, [games, showIntro]);

  // Load games from local storage
  useEffect(() => {
    const savedUsername = localStorage.getItem("bingo-username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    const savedGames = localStorage.getItem("bingo-games");
    if (savedGames) {
      try {
        const parsedGames = JSON.parse(savedGames);
        if (parsedGames.length > 0) {
          setGames(parsedGames);
          setActiveGameId(parsedGames[0].id);

          // Check if any game has been configured
          const anyConfigured = parsedGames.some(
            (game: Game) => game.hasBeenConfigured
          );
          setHasConfiguredGame(anyConfigured);
        }
      } catch (e) {
        console.error("Error loading saved games:", e);
      }
    }
  }, []);

  // Save games to local storage
  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem("bingo-games", JSON.stringify(games));
    }
  }, [games]);

  // Save username to local storage
  useEffect(() => {
    if (username) {
      localStorage.setItem("bingo-username", username);
    }
  }, [username]);

  const handleStartPlaying = () => {
    // Mark that the user has visited before
    localStorage.setItem("bingo-visited", "true");
    setShowIntro(false);

    // Create a new game if none exists
    if (games.length === 0) {
      const newGame = createNewGame();
      // Open settings automatically for new users
      setShowSettings(true);
    }
  };

  const createNewGame = () => {
    const newGameId = `game-${Date.now()}`;
    const gameNumber = games.length + 1;
    const newGame: Game = {
      id: newGameId,
      name: `New Game ${gameNumber}`,
      boardSize: 5,
      bingoValues: generateDefaultBingoValues(5),
      selectedCells: Array(25).fill(false),
      isStarted: false,
      isHosted: false,
      token: "",
      players: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      winningCombinations: [],
      boardColor: "#4a6da7", // Muted blue that works in both light and dark mode
      hasBeenConfigured: false, // Track if the game has been configured
    };

    setGames((prev) => [...prev, newGame]);
    setActiveGameId(newGameId);
    return newGame;
  };

  const updateGame = (gameId: string, updates: Partial<Game>) => {
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          // If any meaningful changes are made, mark the game as configured
          if (
            updates.name !== undefined ||
            updates.boardSize !== undefined ||
            updates.bingoValues !== undefined ||
            updates.boardColor !== undefined
          ) {
            setHasConfiguredGame(true);
            return { ...game, ...updates, hasBeenConfigured: true };
          }
          return { ...game, ...updates };
        }
        return game;
      })
    );
  };

  const startGame = (gameId: string) => {
    // Reset selected cells before starting
    const game = games.find((g) => g.id === gameId);
    if (game) {
      updateGame(gameId, {
        isStarted: true,
        selectedCells: Array(game.boardSize * game.boardSize).fill(false),
        winningCombinations: [],
      });
    }
  };

  const hostGame = (gameId: string) => {
    if (!username) {
      toast.error("Username Required", {
        description: "Please enter your username before hosting a game.",
      });
      return;
    }

    const token = generateGameToken();
    const currentPlayer: Player = {
      id: "host",
      name: username,
      isHost: true,
      joinedAt: new Date().toISOString(),
      achievements: [],
    };

    updateGame(gameId, {
      isHosted: true,
      token,
      players: [currentPlayer],
      hasBeenConfigured: true,
    });

    setHasConfiguredGame(true);

    toast.success("Game Hosted Successfully", {
      description: `Share this token with friends: ${token}`,
    });
  };

  const joinGame = (token: string) => {
    if (!username) {
      toast.error("Username Required", {
        description: "Please enter your username before joining a game.",
      });
      return;
    }

    // In a real app, this would verify the token with a server
    // For now, we'll simulate joining with a mock game
    const playerId = `player-${Date.now()}`;
    const currentPlayer: Player = {
      id: playerId,
      name: username,
      isHost: false,
      joinedAt: new Date().toISOString(),
      achievements: [],
    };

    const newGameId = `joined-${Date.now()}`;
    const newGame: Game = {
      id: newGameId,
      name: `Joined Game`,
      boardSize: 5,
      bingoValues: generateDefaultBingoValues(5),
      selectedCells: Array(25).fill(false),
      isStarted: true,
      isHosted: true,
      token,
      players: [
        {
          id: "host",
          name: "Game Host",
          isHost: true,
          joinedAt: new Date().toISOString(),
          achievements: [],
        },
        currentPlayer,
      ],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      winningCombinations: [],
      boardColor: "#4a6da7", // Muted blue
      hasBeenConfigured: true, // Joined games are considered configured
    };

    setGames((prev) => [...prev, newGame]);
    setActiveGameId(newGameId);
    setIsPlayerListOpen(true);
    setHasConfiguredGame(true);

    toast.success("Game Joined Successfully", {
      description: "You have joined the game.",
    });
  };

  const leaveGame = (gameId: string) => {
    // In a real app, this would notify the server
    setGames((prev) => prev.filter((game) => game.id !== gameId));

    if (activeGameId === gameId) {
      setActiveGameId(games.length > 1 ? games[0].id : null);
    }

    toast.success("Game Left", {
      description: "You have left the game.",
    });
  };

  const removePlayer = (gameId: string, playerId: string) => {
    // Only the host can remove players
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    const currentPlayer = game.players.find((p) => p.id === "host");
    if (!currentPlayer || !currentPlayer.isHost) {
      toast.error("Permission Denied", {
        description: "Only the host can remove players.",
      });
      return;
    }

    updateGame(gameId, {
      players: game.players.filter((p) => p.id !== playerId),
    });

    toast.success("Player Removed", {
      description: "The player has been removed from the game.",
    });
  };

  const activeGame =
    games.find((game) => game.id === activeGameId) ||
    (games.length > 0 ? games[0] : null);

  // Show intro screen for first-time visitors
  if (showIntro) {
    return <IntroScreen onStartPlaying={handleStartPlaying} />;
  }

  return (
    <GameProvider>
      <div className="flex h-screen w-full flex-col">
        {/* Game Tabs */}
        <GameTabs
          games={games}
          activeGameId={activeGameId || ""}
          onSelectGame={setActiveGameId}
          onCreateGame={createNewGame}
          onLeaveGame={leaveGame}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Game Board */}
          <div className="flex-1 overflow-auto p-4">
            {activeGame && (
              <BingoGame
                game={activeGame}
                username={username}
                onUpdateGame={(updates) => updateGame(activeGame.id, updates)}
                onStartGame={() => startGame(activeGame.id)}
                onHostGame={() => hostGame(activeGame.id)}
                onJoinGame={joinGame}
                onLeaveGame={() => leaveGame(activeGame.id)}
                onUsernameChange={setUsername}
                showSettings={showSettings}
                onSettingsChange={setShowSettings}
                showPlayerList={isPlayerListOpen}
                onPlayerListChange={setIsPlayerListOpen}
                showConfigureTooltip={!hasConfiguredGame}
              />
            )}
          </div>

          {/* Player List Panel (only for hosted games) */}
          {activeGame && activeGame.isHosted && (
            <div
              className={`transition-all duration-300 ease-in-out ${
                isPlayerListOpen ? "w-64 md:w-80" : "w-0"
              } relative overflow-hidden border-l`}
            >
              {isPlayerListOpen && (
                <PlayerList
                  game={activeGame}
                  currentUsername={username}
                  onRemovePlayer={(playerId) =>
                    removePlayer(activeGame.id, playerId)
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </GameProvider>
  );
}
