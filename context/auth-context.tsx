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

  // Load user from localStorage on initial render
  useEffect(() => {
    // const storedUser = localStorage.getItem("bingo-user")
    // if (storedUser) {
    //   try {
    //     setUser(JSON.parse(storedUser))
    //   } catch (error) {
    //     console.error("Failed to parse stored user:", error)
    //   }
    // }
    // APPWRITE INTEGRATION:
    // Replace the above with a check for an active session
    // Example:
    // account.get().then(
    //   (response) => {
    //     setUser({
    //       id: response.$id,
    //       name: response.name,
    //       email: response.email,
    //     });
    //   },
    //   (error) => {
    //     console.error("No active session:", error);
    //     setUser(null);
    //   }
    // );
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

  // Save user to localStorage whenever it changes
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("bingo-user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("bingo-user");
  //   }

  // APPWRITE INTEGRATION:
  // This effect is not needed with Appwrite as user data is stored server-side
  // }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));

    // For demo purposes, we'll just create a user with the provided email
    // setUser({
    //   id: `user_${Date.now()}`,
    //   name: email.split("@")[0],
    //   email,
    // });

    // APPWRITE INTEGRATION:
    // Replace with Appwrite authentication
    // Example:
    // try {
    //   const session = await account.createEmailSession(email, password);
    //   const accountDetails = await account.get();
    //   setUser({
    //     id: accountDetails.$id,
    //     name: accountDetails.name,
    //     email: accountDetails.email,
    //   });
    // } catch (error) {
    //   console.error("Login failed:", error);
    //   throw new Error("Login failed. Please check your credentials.");
    // }
    authService
      .login(email, password)
      .then((response) => {
        if (response) {
          setUser({
            id: response.id,
            name: response.name,
            email: response.email,
          });
          toast({
            title: "Login successful",
            description: `Welcome back, ${response.name}!`,
          });
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        toast({
          title: "Login failed",
          description: "Please check your credentials.",
          variant: "destructive",
        });
      });
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 500));

    // setUser({
    //   id: `user_${Date.now()}`,
    //   name,
    //   email,
    // });

    // APPWRITE INTEGRATION:
    // Replace with Appwrite account creation
    // Example:
    // try {
    //   const newAccount = await account.create('unique()', email, password, name);
    //   await account.createEmailSession(email, password);
    //   setUser({
    //     id: newAccount.$id,
    //     name: newAccount.name,
    //     email: newAccount.email,
    //   });
    // } catch (error) {
    //   console.error("Signup failed:", error);
    //   throw new Error("Signup failed. Please try again.");
    // }
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
    // setUser(null);

    // APPWRITE INTEGRATION:
    // Replace with Appwrite session deletion
    // Example:
    // account.deleteSession('current')
    //   .then(() => {
    //     setUser(null);
    //   })
    //   .catch((error) => {
    //     console.error("Logout failed:", error);
    //   });
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
    setUser(null);

    // Clear any user-related data from localStorage
    localStorage.removeItem("bingo-user");

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
