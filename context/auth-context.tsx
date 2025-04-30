"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/appwrite-service";

interface User {
  id: string;
  name: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check if user is logged in on initial render
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((response) => {
        if (response) {
          setUser({
            id: response.id,
            name: response.name,
            email: response.email,
          });
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch current user:", error);
        setUser(null);
      });
  }, []);

  const login = async (email: string, password: string) => {
    authService
      .login(email, password)
      .then((response) => {
        if (response != undefined) {
          setUser({
            id: response.id,
            name: response.name,
            email: response.email,
          });
          toast({
            title: "Login successful",
            description: `Welcome back, ${response.name}!`,
          });
          return {
            id: response.id,
            name: response.name,
            email: response.email,
          };
        } else {
          setUser(null);
          toast({
            title: "Login failed",
            description: "Invalid email or password",
          });
          return null;
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        toast({
          title: "Login failed",
          description: "Please check your credentials.",
          variant: "destructive",
        });
        setUser(null);
        return null;
      });
  };

  const signup = async (email: string, password: string, name: string) => {
    authService
      .createAccount(email, password, name)
      .then((response) => {
        if (response) {
          setUser({
            id: response.id,
            name: response.name,
            email: response.email,
          });
          toast({
            title: "Signup successful",
            description: `Welcome, ${response.name}!`,
          });
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        toast({
          title: "Signup failed",
          description: "Please try again.",
          variant: "destructive",
        });
      });
  };

  const logout = () => {
    authService
      .logout()
      .then(() => {
        setUser(null);
        toast({
          title: "Logout successful",
          description: "You have been logged out.",
        });
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        toast({
          title: "Logout failed",
          description: "Please try again.",
          variant: "destructive",
        });
      });
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    setUser({
      ...user,
      ...data,
    });

    // APPWRITE INTEGRATION:
    // Replace with Appwrite account update
    // Example:
    // if (data.name) {
    //   account.updateName(data.name)
    //     .then((response) => {
    //       setUser({
    //         ...user,
    //         ...data,
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Update failed:", error);
    //       throw new Error("Failed to update profile.");
    //     });
    // }
  };

  const deleteAccount = () => {
    // In a real app, this would make an API call to delete the user's account
    // setUser(null);

    // Clear any user-related data from localStorage
    // localStorage.removeItem("bingo-user");

    // We'll keep the games for demo purposes, but in a real app you might want to delete those too

    // APPWRITE INTEGRATION:
    // Replace with Appwrite account deletion
    // Example:
    // account.delete()
    //   .then(() => {
    //     setUser(null);
    //     localStorage.removeItem("bingo-user");
    //   })
    //   .catch((error) => {
    //     console.error("Account deletion failed:", error);
    //     throw new Error("Failed to delete account.");
    //   });
    authService
      .deleteAccount()
      .then(() => {
        setUser(null);
        toast({
          title: "Account deleted",
          description: "Your account has been deleted.",
        });
      })
      .catch((error) => {
        console.error("Account deletion failed:", error);
        toast({
          title: "Account deletion failed",
          description: "Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
