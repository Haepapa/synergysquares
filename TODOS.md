# Synergy Squares — Development Todos

This file tracks all outstanding development tasks required to complete and publish the app.
Each task is designed to be actionable independently (respecting dependencies noted below).

> **App summary:** Next.js 15 + Appwrite multiplayer Bingo game generator.
> Auth is fully wired to Appwrite. Game storage, presets, and multiplayer are
> partially or fully localStorage-only and need migrating to the backend.

---

## Dependency Map

```
[1] game-service-appwrite
        ↓
[2] game-context-appwrite ──────────────────────────┐
        ↓                                            │
[4] game-token-server                               │
        ↓                                            │
[5] join-game-server                                │
        ↓                                            ↓
[6] realtime-multiplayer ←──────────────────────────┘
        │
        └──┐
[7] preset-appwrite         [9]  public-assets
[12] appwrite-prod-project  [13] self-signed-tls
           └──────────────────────────┐
                                      ↓
                               [14] deploy
```

---

## 🔴 Critical — App-Breaking Without These

---

### ~~[1] Wire `game-service.ts` fully to Appwrite~~ ✅ DONE

**File:** `lib/game-service.ts`
**Blocks:** [2], [4]

**Problem:**
All game CRUD functions fall back to `localStorage`. Appwrite implementations exist but are commented out. This means games are lost on page refresh and can never be shared between users.

**Functions to fix (all in `lib/game-service.ts`):**

| Function | Current State | Fix Required |
|----------|--------------|-------------|
| `createGame()` | Calls Appwrite but ignores result; duplicates game in local state | Return Appwrite document, use `$id` as game ID |
| `getUserGames()` | localStorage only | `databases.listDocuments(databaseID, collection02ID, [Query.equal('userId', userId)])` |
| `getGameById()` | localStorage only | `databases.getDocument(databaseID, collection02ID, id)` |
| `getGameByToken()` | localStorage only | `databases.listDocuments(databaseID, collection02ID, [Query.equal('token', token)])` |
| `updateGame()` | localStorage only | `databases.updateDocument(databaseID, collection02ID, game.id, {...})` |
| `deleteGame()` | localStorage only | `databases.deleteDocument(databaseID, collection02ID, id)` |

**Relevant env vars:**
```
NEXT_PUBLIC_APPWRITE_DATABASEID=64e5820de507762f68f9
NEXT_PUBLIC_APPWRITE_COLLECTION02ID=64e5820e0b197d6c90e9   ← games collection
```

**Imports already available in the file:**
```ts
import { databases, databaseID, collection02ID } from './appwrite-config';
import { Query } from 'appwrite';
```

**Notes:**
- The commented-out Appwrite code blocks are already in the file and mostly correct — primary task is uncommenting and testing
- Remove all `localStorage.getItem/setItem("bingo-games")` calls once Appwrite is live
- The `createGame()` function has a `TODO` comment on line 42 — resolve this by using the Appwrite document `$id` as the game's `id` field

---

### ~~[2] Migrate `game-context.tsx` from localStorage to Appwrite~~ ✅ DONE

**File:** `context/game-context.tsx`
**Depends on:** [1]
**Blocks:** [6]

**Problem:**
- On mount, games are loaded from `localStorage.getItem("bingo-games")` — commented-out Appwrite version exists
- Game saves/updates are never synced to Appwrite
- `fetchGameByToken()` searches local `games` state only — can't find another user's game

**Changes required:**

1. **Load games on mount** — Replace localStorage load with:
   ```ts
   if (user) {
     const response = await databases.listDocuments(databaseID, collection02ID, [
       Query.equal('userId', user.id)
     ]);
     setGames(response.documents as Game[]);
   }
   ```

2. **Remove the localStorage save effect** — The commented-out `useEffect` that called `localStorage.setItem` should be deleted entirely.

3. **`fetchGameByToken()`** (line 177–183) — Replace local `.find()` with `gameService.getGameByToken(token)`.

4. **`createGame()`** — Await the Appwrite response and use the returned document's `$id` as the game id (see also task [3]).

5. **`removeGame()`** — Call `gameService.deleteGame(id)` before removing from local state.

---

### ~~[3] Fix anonymous game creation race condition~~ ✅ DONE

**File:** `context/game-context.tsx` (line ~73)
**Resolved by:** Task [2] (guest mode added; authenticated games use proper user ID)

---

### ~~[4] Make game tokens work server-side~~ ✅ DONE

**Files:** `lib/game-service.ts`, `context/game-context.tsx`, `components/game-settings-modal.tsx`
**Depends on:** [1]
**Blocks:** [5]

**What was done:**
1. `createGame()` now sets `Permission.read(Role.any())` on Appwrite documents so any user (or guest) can query games by token.
2. `joinByToken(token, playerName, playerId)` added to `GameContext` — always queries Appwrite and adds the found game to the local games list with `isHost: false` without writing to the host's document.
3. `handleJoinGame` in `game-settings-modal.tsx` updated to use `joinByToken`, using the authenticated user's name/id where available.
4. The token validation `useEffect` now calls `gameService.getGameByToken()` directly (not via context) so guests can validate tokens for games hosted by other users.
5. On successful join, `setActiveGameId` is called so the board switches to the joined game immediately.

---

### [5] Implement server-side `joinGame()`

**File:** `lib/game-service.ts`
**Depends on:** [4]
**Blocks:** [6]

**Problem:**
`joinGame()` only updates local state. When a second player joins via token, the host never sees them and the join isn't persisted.

**Current (broken) implementation:**
```ts
joinGame: async (token: string, playerName: string) => {
  // Only updates localStorage
}
```

**Fix:**
```ts
joinGame: async (token: string, playerName: string, userId: string) => {
  // 1. Fetch game by token from Appwrite
  const game = await gameService.getGameByToken(token);
  if (!game) throw new Error("Game not found");

  // 2. Create a new player document in the 'player' collection
  const player: Player = {
    id: userId,
    name: playerName,
    isHost: false,
    joinTime: new Date().toISOString(),
    hasBingo: false,
  };
  await databases.createDocument(databaseID, playerCollectionID, 'unique()', player);

  // 3. Return the game so the joining player can render their board
  return game;
};
```

**Notes:**
- Player collection ID: `64e5820e28c6980fbd57`
- Consider using an Appwrite Function for atomic join to prevent race conditions if multiple players join simultaneously

---

### [6] Implement real-time multiplayer via Appwrite Realtime

**File:** New hook `hooks/use-game-realtime.ts` + `context/game-context.tsx`
**Depends on:** [2], [5]
**This is the most complex task**

**Problem:**
Players cannot see each other's cell marks, joins, or game status changes. There are no WebSocket subscriptions anywhere in the codebase.

**Implementation plan:**

1. **Create `hooks/use-game-realtime.ts`:**
   ```ts
   import { client } from '@/lib/appwrite-config';
   
   export function useGameRealtime(gameId: string, onUpdate: (game: Game) => void) {
     useEffect(() => {
       const unsubscribe = client.subscribe(
         `databases.${databaseID}.collections.${collection02ID}.documents.${gameId}`,
         (response) => {
           if (response.events.includes('databases.*.collections.*.documents.*.update')) {
             onUpdate(response.payload as Game);
           }
         }
       );
       return () => unsubscribe();
     }, [gameId]);
   }
   ```

2. **Subscribe in `game-context.tsx`** when `activeGameId` changes.

3. **Subscribe to player collection** for join/leave events:
   ```
   databases.{dbId}.collections.{playerCollectionId}.documents
   ```

4. **Export `client`** from `lib/appwrite-config.ts` (currently only `account`, `databases`, `storage`, `functions` are exported).

**Appwrite Realtime docs:** https://appwrite.io/docs/apis/realtime

---

## 🟠 High Priority

---

### ~~[7] Migrate presets from localStorage to Appwrite~~ ✅ DONE

**Files:** `lib/preset-service.ts` (new), `components/preset-manager.tsx`, `lib/appwrite-config.ts`, `appres/collections/presets.go` (new)

**What was done:**
1. Created `presets` Appwrite collection (`69cc93bdd2063dea5ac2`) with attributes: `userId`, `name`, `content` (string[]), `createdAt`, `updatedAt`; `idx_userId` index; `documentSecurity: true`; per-user `read/update/delete` permissions per document
2. Added `NEXT_PUBLIC_APPWRITE_COLLECTION03ID` to `.env.local` and exported `collection03ID` from `appwrite-config.ts`
3. Created `lib/preset-service.ts` with `getPresets`, `createPreset`, `updatePreset`, `deletePreset` — all backed by Appwrite
4. Rewrote `components/preset-manager.tsx` to use `presetService` — removed all localStorage code and commented-out stubs (saved ~350 → 298 lines)
5. Added `appres/collections/presets.go` for future re-provisioning
6. Added 13 tests in `__tests__/preset-service.test.ts` (70 total passing)

---

### ~~[8] Remove dead code and consolidate duplicates~~ ✅ DONE

**Files:** `lib/appwrite-service.ts`, `lib/utils.ts`, `lib/game-utils.ts`, `components/game-settings-modal.tsx`

**What was removed:**
- `_getWinPatterns()` from `lib/appwrite-service.ts` — duplicate of `lib/game-utils.ts`
- `getWinPatterns()` from `lib/utils.ts` — duplicate of `lib/game-utils.ts`; `cn()` is the only remaining export
- `_handleSavePreset()`, `_isJoining`/`_setIsJoining`, and `customPresetName` state from `game-settings-modal.tsx` — all dead/unused
- Updated `components/game-board.tsx` import from `@/lib/utils` → `@/lib/game-utils` for `getWinPatterns`

---

## 🟡 Medium — Production Readiness

---

### [9] Add favicon, OG image, and app icons

**Directory:** `public/`
**Independent**

**Problem:**
`public/` contains only generic Next.js placeholder SVGs. No favicon or social sharing image exists. The `metadata` in `app/page.tsx` references an OG image that doesn't exist.

**Assets to create:**

| Asset | Path | Notes |
|-------|------|-------|
| Favicon | `app/favicon.ico` or `public/favicon.ico` | 32×32 or 64×64 |
| Apple touch icon | `public/apple-touch-icon.png` | 180×180 |
| OG / social share image | `public/og-image.png` | 1200×630, shows logo + tagline |
| App icon (optional) | `public/icon.png` | 512×512 for PWA manifest |

**Update metadata in `app/layout.tsx`:**
```ts
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};
```

---

### [10] Complete SEO metadata for all pages

**Files:** `app/play/page.tsx`, `app/contact/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`
**Independent**

**Problem:**
Only `app/page.tsx` (home) has a `metadata` export. All other pages are missing it.

**Add to each page:**
```ts
// app/contact/page.tsx
export const metadata: Metadata = {
  title: 'Contact Us | Synergy Squares',
  description: 'Get in touch with the Synergy Squares team.',
};

// app/privacy/page.tsx
export const metadata: Metadata = {
  title: 'Privacy Policy | Synergy Squares',
  description: 'How Synergy Squares collects and uses your data.',
};

// app/terms/page.tsx
export const metadata: Metadata = {
  title: 'Terms of Service | Synergy Squares',
  description: 'Terms and conditions for using Synergy Squares.',
};

// app/play/page.tsx
export const metadata: Metadata = {
  title: 'Play | Synergy Squares',
  description: 'Create and play custom Bingo games.',
};
```

---

### [11] Configure `next.config.ts` for production

**File:** `next.config.ts`
**Independent** — but review before deploying

**Problem:** File is currently empty (`{}`).

**Recommended additions:**
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // If deploying via Docker/self-hosted:
  // output: 'standalone',

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### [12] Set up production Appwrite project

**Files:** `.env.local` (production copy), `appres/.env.local`
**Depends on:** nothing (infrastructure task)
**Blocks:** [14]

**Steps:**
1. Create a new project on [Appwrite Cloud](https://cloud.appwrite.io) (or provision a self-hosted instance with valid TLS)
2. Generate a new API key with `databases.read`, `databases.write`, `users.read`, `users.write` scopes
3. Update `appres/.env.local` with the production project ID and API key
4. Run `cd appres && go run main.go` to create all collections
5. Copy the output IDs into your production environment variable store (Vercel, etc.)
6. Add the production domain to Appwrite **Platforms** (Web platform) to allow browser requests

**Required production env vars:**
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=<prod-project-id>
NEXT_PUBLIC_APPWRITE_DATABASEID=<from appres output>
NEXT_PUBLIC_APPWRITE_COLLECTION01ID=<contact_us collection>
NEXT_PUBLIC_APPWRITE_COLLECTION02ID=<game collection>
NEXT_PUBLIC_APPWRITE_USER_MGMT=<api-key-with-users-scope>
```

---

### ✅ [13] Remove self-signed TLS workarounds

**Files:** `app/api/delete-user/route.ts`, `appres/main.go`
**Depends on:** [12] (needs a properly TLS-certified Appwrite instance)
**Blocks:** [14]

**Problem:**
Two files disable TLS verification — these are local-dev hacks that must not reach production:

1. **`app/api/delete-user/route.ts` line ~20:**
   ```ts
   client.config.selfSigned = true;  // ← REMOVE FOR PRODUCTION
   ```

2. **`appres/main.go` line ~14:**
   ```go
   http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}  // ← REMOVE FOR PRODUCTION
   ```

**Fix:** Remove both lines when targeting a production Appwrite instance with a valid certificate.

> 💡 Consider using a build-time environment variable flag to conditionally apply `selfSigned` only in local dev:
> ```ts
> if (process.env.NODE_ENV !== 'production') client.config.selfSigned = true;
> ```

---

## 🟢 Final

---

### [14] Deploy to production (Vercel + Appwrite Cloud)

**Depends on:** [2], [7], [9], [12], [13]

**Checklist:**
- [ ] All Appwrite env vars set on Vercel (Settings → Environment Variables)
- [ ] Production domain added to Appwrite project Platforms
- [ ] `npm run build` passes locally with production env vars
- [ ] Run end-to-end smoke test:
  - Sign up as user A → create game → copy token
  - Sign up as user B → join by token → verify both see the same board
  - Mark cells → verify real-time sync
  - Complete a line → verify win detection and confetti
- [ ] Self-signed TLS flags removed (task [13])
- [ ] OG image renders correctly when URL is shared (use [opengraph.xyz](https://opengraph.xyz) to test)
- [ ] Contact form submits successfully (check Appwrite `contact_us` collection)

---

## Current Collections in Appwrite (local dev)

| Collection | ID | Purpose |
|---|---|---|
| `contact_us` | `64e5820debbd079c0e38` | Contact form submissions (`COLLECTION01ID`) |
| `cell` | `64e5820dfa1cd84e4833` | Individual board cells |
| `board` | `64e5820e0292f245e94e` | Player boards |
| `game` | `64e5820e0b197d6c90e9` | Games (`COLLECTION02ID`) |
| `player` | `64e5820e28c6980fbd57` | Players in a game |

> ⚠️ A `presets` collection does not yet exist — required for task [7].

---

## 🐛 Known Issues to Investigate

### [BUG-1] Token join flow not working end-to-end

**Symptom:** The Join button remains disabled even when a valid token from another user's hosted game is entered.

**Investigation so far:**
- Appwrite `documentSecurity` was `false` — fixed (set to `true`)
- Collection `$permissions` was empty — fixed (added `read("users")`)
- Per-document `Permission.read(Role.any())` was missing on old docs — fixed (added to `createGame` and `updateGame`)
- Multiplayer tab now correctly gates behind login with a clear message for guests
- Root cause suspected: may require both users to have accepted the self-signed TLS cert at `https://appwrite.localhost` in their browser; OR a timing/state issue where the token is not flushed to Appwrite before the joiner queries

**Likely next steps:**
1. Confirm both test accounts have visited `https://appwrite.localhost` and accepted the cert
2. Add temporary `console.log` in `validateToken` to inspect the Appwrite response and any error in the browser console
3. Check the Network tab in DevTools to confirm the `listDocuments` request is being made and what it returns
4. Consider adding a loading spinner to the token input so the user can see validation is in progress
