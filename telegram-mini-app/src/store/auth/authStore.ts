// src/store/auth/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/data";
import type { PrismaUser } from "@/types/prisma";

export type UserRole = "customer" | "vendor" | "delivery" | "admin";

type SchemaUserRole = PrismaUser["role"];

type AuthUser = Pick<
  PrismaUser,
  | "id"
  | "telegramId"
  | "astuEmail"
  | "email"
  | "fullName"
  | "phoneNumber"
  | "avatarUrl"
  | "status"
  | "isEmailVerified"
  | "isPhoneVerified"
  | "role"
  | "activeMode"
  | "createdAt"
  | "updatedAt"
> & {
  // Convenience for existing UI that expects these names sometimes.
  name: string;
};

interface AuthState {
  user: AuthUser | null;
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

const mapSchemaRoleToActiveRole = (role: SchemaUserRole): UserRole => {
  switch (role) {
    case "CUSTOMER":
      return "customer";
    case "DELIVERER":
      return "delivery";
    case "VENDOR_STAFF":
      return "vendor";
    case "ADMIN":
      return "admin";
    default:
      return "customer";
  }
};

const verifyMockPassword = (stored: string, provided: string): boolean => {
  // Local dataset uses bcrypt-looking hashes; we can't verify that client-side.
  // For UI testing: accept exact match OR accept any non-empty password when
  // stored value looks like a bcrypt hash.
  if (!provided) return false;
  if (stored === provided) return true;
  if (stored.startsWith("$2")) return true;
  return false;
};

const toAuthUser = (u: PrismaUser): AuthUser => ({
  ...u,
  name: u.fullName,
});

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

        const newUser: AuthUser = {
          id: `user_${Date.now()}`,
          telegramId: Date.now(),
          astuEmail: null,
          email: data.email ?? null,
          fullName: data.name,
          phoneNumber: data.phoneNumber ?? null,
          password: data.password, // Store password for signin verification
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          status: "ACTIVE",
          isEmailVerified: true,
          isPhoneVerified: false,
          role: "CUSTOMER",
          activeMode: "CUSTOMER",
          lastActiveAt: new Date().toISOString(),
          deviceToken: null,
          failedLoginAttempts: 0,
          lockedUntil: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          name: data.name,
        };

        // Prevent duplicate signup entries
        const existingUsers = [
          ...(db.users || []),
          ...((JSON.parse(localStorage.getItem("additional_users") || "[]") ||
            []) as AuthUser[]),
        ];

        if (existingUsers.some((user) => user.email === data.email)) {
          set({ isLoading: false, error: "User already exists" });
          throw new Error("User already exists");
        }

        const storedUsers = (JSON.parse(
          localStorage.getItem("additional_users") || "[]",
        ) || []) as AuthUser[];
        storedUsers.push(newUser);
        localStorage.setItem("additional_users", JSON.stringify(storedUsers));

        const activeRole = mapSchemaRoleToActiveRole(newUser.role);
        set({
          user: newUser,
          roles: [activeRole],
          activeRole,
          token: `mock_token_${Date.now()}`,
          isLoading: false,
        });

        console.log("✅ Mock Signup successful", newUser);

        // Keep the user logged in and redirect to the customer dashboard
        window.location.href = "/customer/dashboard";
      },

      // ====================== SIGNIN ======================
      signin: async (data) => {
        set({ isLoading: true, error: null });

        await new Promise((resolve) => setTimeout(resolve, 700));

        // Search across all users in Prisma-shaped dataset
        const allUsers = [
          ...(db.users || []),
          // Include users added via signup from localStorage
          ...((JSON.parse(localStorage.getItem("additional_users") || "[]") ||
            []) as AuthUser[]),
        ] as Array<PrismaUser | AuthUser>;

        const foundUser = allUsers.find((u) => u.email === data.email);

        if (!foundUser) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        // Check password match
        if (
          !verifyMockPassword(
            (foundUser as PrismaUser).password,
            String(data.password ?? ""),
          )
        ) {
          set({ isLoading: false, error: "Invalid email or password" });
          throw new Error("Invalid email or password");
        }

        const schemaRole = (foundUser as PrismaUser).role;
        const activeRole = mapSchemaRoleToActiveRole(schemaRole);
        const finalRoles: UserRole[] = [activeRole];

        set({
          user: toAuthUser(foundUser as PrismaUser),
          roles: finalRoles,
          activeRole: activeRole,
          token: `mock_token_${(foundUser as PrismaUser).id}`,
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
        } else if (activeRole === "admin") {
          window.location.href = "/customer/dashboard";
        } else {
          window.location.href = "/customer/dashboard"; // Customer dashboard
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
        } else if (newRole === "admin") {
          window.location.href = "/customer/dashboard";
        } else {
          window.location.href = "/customer/dashboard";
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
