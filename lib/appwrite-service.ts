import { ID, AppwriteException } from "appwrite";
// When integrating with Appwrite, uncomment these imports
import {
  account,
  databases,
  databaseID,
  collection01ID,
} from "./appwrite-config";
// import { account, databases, storage, functions } from "./appwrite-config";
// import { COLLECTIONS, BUCKETS, FUNCTIONS } from "./appwrite-config";
// import { Query, ID } from "appwrite";
import { ContactFormType } from "@/types/contact";

//========================================================================================
// Authentication Services
//========================================================================================
export const authService = {
  /**
   * Create a new user account
   */
  createAccount: async (email: string, password: string, name: string) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // return {
    //   id: `user_${Date.now()}`,
    //   name,
    //   email,
    // };

    // APPWRITE INTEGRATION:
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      await account.createEmailPasswordSession(email, password);
      // console.log("Account created:", newAccount);
      return {
        id: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
      };
    } catch (error) {
      console.error("Account creation failed:", error);
      throw new Error("Failed to create account.");
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error("From login: login failed with:", error);
      // throw new Error("Login failed. Please check your credentials.");
      return null;
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // APPWRITE INTEGRATION:
    try {
      await account.deleteSession("current");
      console.log("Account logged out");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Failed to logout.");
    }
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // const storedUser = localStorage.getItem("bingo-user");
    // return storedUser ? JSON.parse(storedUser) : null;

    // APPWRITE INTEGRATION:
    try {
      const user = await account.get();
      return {
        id: user.$id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error instanceof AppwriteException &&
        error.message === "User (role: guests) missing scope (account)"
      ) {
        console.log("From getCurrentUser: no logged in user");
        return null;
      } else {
        console.error(
          "From getCurrentUser: failed to get current user with:",
          error
        );
        return null;
      }
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (_userId: string, data: { name?: string }) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // const storedUser = localStorage.getItem("bingo-user");
    // if (!storedUser) return null;

    // const user = JSON.parse(storedUser);
    // const updatedUser = { ...user, ...data };
    // localStorage.setItem("bingo-user", JSON.stringify(updatedUser));
    // return updatedUser;

    // APPWRITE INTEGRATION:
    try {
      if (data.name) {
        await account.updateName(data.name);
      }
      const updatedUser = await account.get();
      console.log("Account updated:", updatedUser);
      return {
        id: updatedUser.$id,
        name: updatedUser.name,
        email: updatedUser.email,
      };
    } catch (error) {
      console.error("Profile update failed:", error);
      throw new Error("Failed to update profile.");
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // localStorage.removeItem("bingo-user");

    // APPWRITE INTEGRATION:
    try {
      const deleteUser = await account.get();
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: deleteUser.$id }),
      });
      if (!response.ok) {
        console.error("Account deletion failed");
      }
      return true;
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  },
};

//========================================================================================
// Game Services
//========================================================================================
const _getWinPatterns = (boardSize: number): number[][] => {
  const patterns: number[][] = [];

  // Rows
  for (let i = 0; i < boardSize; i++) {
    const row: number[] = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    patterns.push(row);
  }

  // Columns
  for (let j = 0; j < boardSize; j++) {
    const col: number[] = [];
    for (let i = 0; i < boardSize; i++) {
      col.push(i * boardSize + j);
    }
    patterns.push(col);
  }

  // Diagonal (top-left to bottom-right)
  const diag1: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
  }
  patterns.push(diag1);

  // Diagonal (top-right to bottom-left)
  const diag2: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  patterns.push(diag2);

  return patterns;
};


//========================================================================================
// Preset Services
//========================================================================================
export const presetService = {
  /**
   * Get all presets
   */
  getPresets: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedPresets = localStorage.getItem("bingo-custom-presets");
    return storedPresets ? JSON.parse(storedPresets) : {};

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.PRESETS
    //   );
    //
    //   // Convert the array of documents to a Record<string, string[]>
    //   const presets: Record<string, string[]> = {};
    //   response.documents.forEach((doc) => {
    //     presets[doc.name] = doc.items;
    //   });
    //
    //   return presets;
    // } catch (error) {
    //   console.error("Failed to fetch presets:", error);
    //   throw new Error("Failed to fetch presets.");
    // }
  },

  /**
   * Save a custom preset
   */
  savePreset: async (_userId: string, name: string, items: string[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedPresets = localStorage.getItem("bingo-custom-presets");
    const presets = storedPresets ? JSON.parse(storedPresets) : {};
    presets[name] = items;
    localStorage.setItem("bingo-custom-presets", JSON.stringify(presets));

    return { name, items };

    // APPWRITE INTEGRATION:
    // try {
    //   const response = await databases.createDocument(
    //     COLLECTIONS.PRESETS,
    //     'unique()',
    //     {
    //       userId,
    //       name,
    //       items,
    //       createdAt: new Date().toISOString(),
    //     }
    //   );
    //
    //   return {
    //     name: response.name,
    //     items: response.items,
    //   };
    // } catch (error) {
    //   console.error("Failed to save preset:", error);
    //   throw new Error("Failed to save preset.");
    // }
  },

  /**
   * Delete a custom preset
   */
  deletePreset: async (name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedPresets = localStorage.getItem("bingo-custom-presets");
    const presets = storedPresets ? JSON.parse(storedPresets) : {};
    delete presets[name];
    localStorage.setItem("bingo-custom-presets", JSON.stringify(presets));

    // APPWRITE INTEGRATION:
    // try {
    //   // First, find the preset document by name
    //   const response = await databases.listDocuments(
    //     COLLECTIONS.PRESETS,
    //     [Query.equal('name', name)]
    //   );
    //
    //   if (response.documents.length > 0) {
    //     await databases.deleteDocument(
    //       COLLECTIONS.PRESETS,
    //       response.documents[0].$id
    //     );
    //   }
    //
    //   return true;
    // } catch (error) {
    //   console.error("Failed to delete preset:", error);
    //   throw new Error("Failed to delete preset.");
    // }
  },
};

//========================================================================================
// Contact Service
//========================================================================================
export const contactService = {
  sameMessage: async (data: ContactFormType) => {
    try {
      await databases.createDocument(
        databaseID, // databaseId
        collection01ID, // collectionId
        ID.unique(),
        data
      );
      return true;
    } catch (error) {
      console.error("Error from contactService.sameMessage");
      console.error(error);
      return false;
    }
  },
};

//========================================================================================
// Esport
//========================================================================================
export default {
  auth: authService,
  preset: presetService,
  contact: contactService,
};
