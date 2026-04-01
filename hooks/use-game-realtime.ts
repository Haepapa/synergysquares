/**
 * useGameRealtime
 *
 * Subscribes to Appwrite Realtime events for an active game:
 *
 * 1. **Game document updates** — fires when the host (or any permitted writer)
 *    updates the game document (e.g. a cell is marked, game status changes).
 *    Calls `onGameUpdate` with the raw Appwrite document payload.
 *
 * 2. **Player document creates** — fires when any player document is created
 *    in the player collection.  We filter client-side to documents whose
 *    `gameId` matches the current active game.
 *    Calls `onPlayerJoin` with the raw player document payload.
 *
 * Subscriptions are torn down on unmount or when `gameId` changes.
 * Guest games (id starts with "local_") are skipped — they are never stored
 * in Appwrite so there is nothing to subscribe to.
 *
 * @param gameId       - The Appwrite document `$id` of the active game, or
 *                       `null` when no game is active.
 * @param onGameUpdate - Callback invoked with the raw game document payload
 *                       whenever the game document changes.
 * @param onPlayerJoin - Callback invoked with the raw player document payload
 *                       whenever a new player joins the active game.
 */

import { useEffect, useRef } from "react";
import type { RealtimeResponseEvent } from "appwrite";
import {
  client_,
  databaseID,
  collection02ID,
  collection04ID,
} from "@/lib/appwrite-config";

type RawDoc = Record<string, unknown>;

interface UseGameRealtimeOptions {
  gameId: string | null;
  onGameUpdate: (doc: RawDoc) => void;
  onPlayerJoin: (doc: RawDoc) => void;
}

export function useGameRealtime({
  gameId,
  onGameUpdate,
  onPlayerJoin,
}: UseGameRealtimeOptions) {
  // Keep the latest callbacks in a ref so the subscribe effect does not need
  // to re-run (and re-subscribe) every time a callback identity changes.
  const onGameUpdateRef = useRef(onGameUpdate);
  const onPlayerJoinRef = useRef(onPlayerJoin);
  useEffect(() => {
    onGameUpdateRef.current = onGameUpdate;
  }, [onGameUpdate]);
  useEffect(() => {
    onPlayerJoinRef.current = onPlayerJoin;
  }, [onPlayerJoin]);

  useEffect(() => {
    // Only subscribe when we have a real Appwrite-backed game.
    if (!gameId || gameId.startsWith("local_")) return;

    const gameChannel = `databases.${databaseID}.collections.${collection02ID}.documents.${gameId}`;
    const playerChannel = `databases.${databaseID}.collections.${collection04ID}.documents`;

    const unsubscribeGame = client_.subscribe(
      gameChannel,
      (response: RealtimeResponseEvent<RawDoc>) => {
        if (response.events.some((e) => e.includes(".update"))) {
          onGameUpdateRef.current(response.payload);
        }
      }
    );

    const unsubscribePlayers = client_.subscribe(
      playerChannel,
      (response: RealtimeResponseEvent<RawDoc>) => {
        if (
          response.events.some((e) => e.includes(".create")) &&
          response.payload.gameId === gameId
        ) {
          onPlayerJoinRef.current(response.payload);
        }
      }
    );

    return () => {
      unsubscribeGame();
      unsubscribePlayers();
    };
  }, [gameId]);
}
