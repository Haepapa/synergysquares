import { Query, Permission, Role } from "appwrite";
import { databases, databaseID, collection03ID } from "./appwrite-config";
import type { Preset } from "@/components/preset-manager";

// ---------------------------------------------------------------------------
// Document → Preset mapper
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function documentToPreset(doc: Record<string, any>): Preset {
  return {
    id: doc.$id,
    name: doc.name,
    content: doc.content ?? [],
    userId: doc.userId,
    createdAt: doc.createdAt ?? doc.$createdAt,
    updatedAt: doc.updatedAt ?? doc.$updatedAt,
  };
}

// ---------------------------------------------------------------------------
// presetService — all CRUD backed by Appwrite
// ---------------------------------------------------------------------------

export const presetService = {
  /**
   * Fetch all presets owned by the given user, newest first.
   *
   * @param userId - Appwrite user ID.
   */
  getPresets: async (userId: string): Promise<Preset[]> => {
    const response = await databases.listDocuments(
      databaseID,
      collection03ID,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );
    return response.documents.map(documentToPreset);
  },

  /**
   * Create a new preset document.
   *
   * @param userId - Appwrite user ID of the owner.
   * @param name   - Display name for the preset.
   * @param content - Array of bingo cell strings.
   */
  createPreset: async (
    userId: string,
    name: string,
    content: string[]
  ): Promise<Preset> => {
    const now = new Date().toISOString();
    const doc = await databases.createDocument(
      databaseID,
      collection03ID,
      "unique()",
      { userId, name, content, createdAt: now, updatedAt: now },
      // Only the owning user can read, update, or delete their presets.
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
    return documentToPreset(doc);
  },

  /**
   * Update an existing preset's name and/or content.
   *
   * @param presetId - Appwrite document ID.
   * @param name     - New name (pass existing name to leave unchanged).
   * @param content  - New content array.
   */
  updatePreset: async (
    presetId: string,
    name: string,
    content: string[]
  ): Promise<Preset> => {
    const doc = await databases.updateDocument(
      databaseID,
      collection03ID,
      presetId,
      { name, content, updatedAt: new Date().toISOString() }
    );
    return documentToPreset(doc);
  },

  /**
   * Permanently delete a preset document.
   *
   * @param presetId - Appwrite document ID.
   */
  deletePreset: async (presetId: string): Promise<void> => {
    await databases.deleteDocument(databaseID, collection03ID, presetId);
  },
};
