// src/store/auth/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

type UserRole = "customer" | "vendor" | "delivery" | null;

interface AuthState {
  user: any | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  signup: (data: any) => Promise<void>;
  signin: (data: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      token: null,
      isLoading: false,
      error: null,

      // Mock Signup (simulates backend + saves to local state)
      signup: async (data) => {
        set({ isLoading: true, error: null });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate user creation
        const newUser = {
          id: `user_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        };

        // Mock success response
        set({
          user: newUser,
          role: data.role,
          token: `mock_token_${Date.now()}`,
          isLoading: false,
        });

        // In real backend you would call API here
        console.log("✅ Mock Signup successful", newUser);
      },

      // Mock Signin (checks against database.json)
      signin: async (data) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 700));

        // Search in mock database
        const allUsers = [
          ...db.users.customers,
          ...db.users.vendors,
          ...db.users.delivery,
        ];

        const foundUser = allUsers.find((u: any) => u.email === data.email);

        if (!foundUser) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        // Mock password check (in real app this is done on backend)
        if (foundUser.role !== "customer" && !data.password.includes("123")) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        const token = `mock_token_${foundUser.id}`;

        set({
          user: foundUser,
          role: foundUser.role,
          token,
          isLoading: false,
        });

        console.log("✅ Mock Signin successful", foundUser);
      },

      logout: () => {
        set({ user: null, role: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        token: state.token,
      }),
    },
  ),
);
