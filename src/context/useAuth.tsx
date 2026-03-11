import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

// 1. Define the shape
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// 2. Create the Context object
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};