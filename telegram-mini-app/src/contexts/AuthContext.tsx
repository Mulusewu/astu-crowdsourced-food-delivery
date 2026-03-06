import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { User, UserRole } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isAuthenticated: boolean;
  role: UserRole | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Replace with your actual API call to validate token
          const response = await fetch("/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Assuming API returns user object
          } else {
            // Token invalid, clear it
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Clear token on logout
  };

  const isAuthenticated = !!user;
  const role = user?.role || null;

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    role,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
