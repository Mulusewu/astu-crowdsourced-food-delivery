import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserRole = "customer" | "vendor" | "delivery" | null;

interface AuthState {
  user: any | null;
  role: UserRole;
  token: string | null;

  login: (userData: any, token: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,

      login: (userData, token) =>
        set({ user: userData, role: userData.role, token }),

      logout: () => set({ user: null, role: null, token: null }),

      setRole: (role) => set({ role }),
    }),
    { name: "auth-storage" }, // Persists across page reloads
  ),
);

// Usage in any component:
// const { user, role, login } = useAuthStore();
