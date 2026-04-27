// src/store/auth/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

export type UserRole = "customer" | "vendor" | "delivery";

interface AuthState {
  user: any | null;
  roles: UserRole[]; // All roles the user has
  activeRole: UserRole | null; // Currently active role
  token: string | null;
  isLoading: boolean;
  error: string | null;

  signup: (data: any) => Promise<void>;
  signin: (data: any) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
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
    const validRoles = roles.filter(
      (r: string) => r === "customer" || r === "vendor" || r === "delivery",
    ) as UserRole[];
    return validRoles.length > 0 ? validRoles : ["customer"];
  }

  return ["customer"];
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
          password: data.password, // Store password for signin verification
          roles: ["customer"] as UserRole[],
          activeRole: "customer",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          createdAt: new Date().toISOString(),
          isVerified: true, // Mock verification
        };

        // Prevent duplicate signup entries
        const existingUsers = [
          ...(db.users.customers || []),
          ...(JSON.parse(localStorage.getItem("additional_users") || "[]") ||
            []),
        ];

        if (existingUsers.some((user: any) => user.email === data.email)) {
          set({ isLoading: false, error: "User already exists" });
          throw new Error("User already exists");
        }

        const storedUsers = JSON.parse(
          localStorage.getItem("additional_users") || "[]",
        );
        storedUsers.push(newUser);
        localStorage.setItem("additional_users", JSON.stringify(storedUsers));

        set({
          user: newUser,
          roles: ["customer"],
          activeRole: "customer",
          token: `mock_token_${Date.now()}`,
          isLoading: false,
        });

        console.log("✅ Mock Signup successful", newUser);

        // Keep the user logged in and redirect to the customer dashboard
        window.location.href = "/customer/home";
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
          // Include users added via signup from localStorage
          ...JSON.parse(localStorage.getItem("additional_users") || "[]"),
        ];

        const foundUser = allUsers.find((u: any) => u.email === data.email);

        if (!foundUser) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        // Check password match
        if (!data.password || foundUser.password !== data.password) {
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
          activeRole =
            foundUser.activeRole &&
              finalRoles.includes(foundUser.activeRole as UserRole)
              ? (foundUser.activeRole as UserRole)
              : finalRoles[0];
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

        // Redirect to appropriate dashboard based on active role
        if (activeRole === "delivery") {
          window.location.href = "/delivery/dashboard";
        } else if (activeRole === "vendor") {
          window.location.href = "/vendor/dashboard";
        } else {
          window.location.href = "/customer/home"; // Customer dashboard
        }
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
            user: { ...user, activeRole: newRole },
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

      updatePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          console.log("Mock Password Update:", { oldPassword, newPassword });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: "Failed to update password" });
          throw error;
        }
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
    },
  ),
);
