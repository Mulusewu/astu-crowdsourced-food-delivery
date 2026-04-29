// src/store/auth/authStore.ts — aligned with Prisma schema
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";
import type { User, UserRole } from "@/types/user.types";
import { getRoleRedirectPath } from "@/types/user.types";

interface SignupData {
  fullName: string;
  email?: string;
  astuEmail?: string;
  phoneNumber?: string;
  password: string;
}

interface SigninData {
  email: string; // accepts email or astuEmail
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signup: (data: SignupData, navigate?: (path: string) => void) => Promise<void>;
  signin: (data: SigninData, navigate?: (path: string) => void) => Promise<void>;
  logout: () => void;
  updatePassword: (oldPw: string, newPw: string) => Promise<void>;
  clearError: () => void;
}

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));

const buildUserWithProfile = (raw: (typeof db.users)[number]): User => {
  const role = raw.role as UserRole;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: User = { ...(raw as any), role };

  if (role === "DELIVERER") {
    const p = db.delivererProfiles.find((dp) => dp.userId === raw.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (p) base.delivererProfile = { ...(p as any) };
  }
  if (role === "CUSTOMER") {
    const p = db.customerProfiles.find((cp) => cp.userId === raw.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (p) base.customerProfile = { ...(p as any) };
  }
  if (role === "VENDOR_STAFF") {
    const p = db.vendorProfiles.find((vp) => vp.userId === raw.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (p) base.vendorProfile = { ...(p as any) };
  }
  return base;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      signup: async (data, navigate) => {
        set({ isLoading: true, error: null });
        await delay(800);
        const duplicate = db.users.find(
          (u) =>
            (data.email && u.email === data.email) ||
            (data.astuEmail && u.astuEmail === data.astuEmail),
        );
        if (duplicate) {
          set({ isLoading: false, error: "An account with this email already exists." });
          throw new Error("User already exists");
        }
        const newUser: User = {
          id: `usr_${Date.now()}`,
          telegramId: Date.now(),
          astuEmail: data.astuEmail ?? null,
          email: data.email ?? null,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber ?? null,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
          status: "ACTIVE",
          isEmailVerified: false,
          isPhoneVerified: false,
          role: "CUSTOMER",
          activeMode: "CUSTOMER",
          lastActiveAt: new Date().toISOString(),
          failedLoginAttempts: 0,
          lockedUntil: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ user: newUser, token: `mock_token_${newUser.id}`, isLoading: false });
        console.log("✅ Signup", newUser.fullName, "| role:", newUser.role);
        if (navigate) navigate(getRoleRedirectPath(newUser.role));
      },

      signin: async (data, navigate) => {
        set({ isLoading: true, error: null });
        await delay(700);
        const raw = db.users.find(
          (u) => u.email === data.email || u.astuEmail === data.email,
        );
        if (!raw || !data.password) {
          set({ isLoading: false, error: "Invalid email or password." });
          throw new Error("Invalid email or password");
        }
        const user = buildUserWithProfile(raw);
        set({ user, token: `mock_token_${user.id}`, isLoading: false });
        console.log("✅ Signin", user.fullName, "| role:", user.role);
        if (navigate) navigate(getRoleRedirectPath(user.role));
      },

      logout: () => set({ user: null, token: null, error: null }),

      updatePassword: async (_old, _new) => {
        set({ isLoading: true, error: null });
        try {
          await delay(800);
          set({ isLoading: false });
        } catch (e) {
          set({ isLoading: false, error: "Failed to update password." });
          throw e;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({ user: s.user, token: s.token }),
    },
  ),
);
