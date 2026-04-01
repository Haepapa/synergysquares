import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

export const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASEID ?? "";
/** contact_us collection */
export const collection01ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION01ID ?? "";
/** games collection */
export const collection02ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION02ID ?? "";
/** presets collection */
export const collection03ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION03ID ?? "";
/** player collection */
export const collection04ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION04ID ?? "";
/** Exported for Appwrite Realtime subscriptions (see task [6] — realtime-multiplayer) */
export const client_ = client;
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
