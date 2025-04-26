// export const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
// export const APPWRITE_PROJECT_ID = "your-project-id";

// Collection IDs for Appwrite database
export const COLLECTIONS = {
  GAMES: "games",
  USERS: "users",
  PRESETS: "presets",
};

// Bucket IDs for Appwrite storage
export const BUCKETS = {
  GAME_ASSETS: "game-assets",
};

// Appwrite function IDs
export const FUNCTIONS = {
  JOIN_GAME: "join-game",
  CHECK_WINNER: "check-winner",
};

/**
 * When integrating with Appwrite, you'll need to:
 * 1. Install the Appwrite SDK: npm install appwrite
 * 2. Initialize the Appwrite client here
 * 3. Export the client and services for use in the app
 *
 * Example:
 *
 * import { Client, Account, Databases, Storage, Functions } from 'appwrite';
 *
 * const client = new Client()
 *   .setEndpoint(APPWRITE_ENDPOINT)
 *   .setProject(APPWRITE_PROJECT_ID);
 *
 * export const account = new Account(client);
 * export const databases = new Databases(client);
 * export const storage = new Storage(client);
 * export const functions = new Functions(client);
 */
import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. https://cloud.appwrite.io/v1
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!); // your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
