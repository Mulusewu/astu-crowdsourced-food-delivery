// src/store/auth/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

export type UserRole = "customer" | "vendor" | "delivery" ;

interface AuthState {
  user: any | null;
  roles: UserRole[];           // All roles the user has
  activeRole: UserRole | null; // Currently active role
  token: string | null;
  isLoading: boolean;
  error: string | null;

  signup: (data: any) => Promise<void>;
  signin: (data: any) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  clearError: () => void;
}

// Helper function to validate and convert roles to UserRole[]
const normalizeRoles = (roles: any): UserRole[] => {
  if (!roles) return ["customer"];
  
  // If roles is a string, convert to array
  if (typeof roles === "string") {
    const role = roles as UserRole;
    return [role];
  }
  
  // If roles is an array, filter valid roles
  if (Array.isArray(roles)) {
    const validRoles = roles.filter((r: string) => 
      r === "customer" || r === "vendor" || r === "delivery"
    ) as UserRole[];
    return validRoles.length > 0 ? validRoles : ["customer"];
  }
  
  return ["customer"];
};

// Helper to get active role from user data
const getActiveRole = (user: any): UserRole => {
  const roles = normalizeRoles(user?.roles);
  return roles[0] || "customer";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      roles: ["customer"],
      activeRole: "customer",
      token: null,
      isLoading: false,
      error: null,

      // ====================== SIGNUP ======================
      signup: async (data) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 800));

        const newUser = {
          id: `user_${Date.now()}`,
          name: data.name,
          email: data.email,
          roles: ["customer"] as UserRole[],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          createdAt: new Date().toISOString(),
        };

        set({
          user: newUser,
          roles: ["customer"],
          activeRole: "customer",
          token: `mock_token_${Date.now()}`,
          isLoading: false,
        });

        console.log("✅ Mock Signup successful", newUser);
      },

      // ====================== SIGNIN ======================
      signin: async (data) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 700));

        // Search across all user types in mock database
        const allUsers = [
          ...(db.users.customers || []),
          ...(db.users.vendors || []),
          ...(db.users.delivery || []),
        ];

        const foundUser = allUsers.find((u: any) => u.email === data.email);

        if (!foundUser) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        // Mock password check (in real backend this is handled server-side)
        if (!data.password || data.password.length < 6) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        // Normalize roles from database
        const userRoles = normalizeRoles(foundUser.roles);
        
        // Handle multi-role user from database
        let finalRoles: UserRole[] = userRoles;
        let activeRole: UserRole = userRoles[0];

        // If user has multiple roles stored in a special way
        if (foundUser.roles && Array.isArray(foundUser.roles)) {
          finalRoles = foundUser.roles as UserRole[];
          activeRole = foundUser.activeRole || finalRoles[0];
        }

        set({
          user: foundUser,
          roles: finalRoles,
          activeRole: activeRole,
          token: `mock_token_${foundUser.id}`,
          isLoading: false,
        });

        console.log("✅ Mock Signin successful", foundUser);
        console.log("👤 User roles:", finalRoles);
        console.log("🎯 Active role:", activeRole);
      },

      // ====================== SWITCH ROLE ======================
      switchRole: (newRole: UserRole) => {
        const { roles, user } = get();

        if (!roles.includes(newRole)) {
          set({ error: `You don't have access to ${newRole} role yet.` });
          return;
        }

        set({ activeRole: newRole });

        // Update user's active role in the user object
        if (user) {
          set({
            user: { ...user, activeRole: newRole }
          });
        }

        // Redirect to correct dashboard based on active role
        if (newRole === "delivery") {
          window.location.href = "/delivery/dashboard";
        } else if (newRole === "vendor") {
          window.location.href = "/vendor/dashboard";
        } else {
          window.location.href = "/"; // Customer home
        }
      },

      logout: () => {
        set({
          user: null,
          roles: [],
          activeRole: null,
          token: null,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        roles: state.roles,
        activeRole: state.activeRole,
        token: state.token,
      }),
    }
  )
);