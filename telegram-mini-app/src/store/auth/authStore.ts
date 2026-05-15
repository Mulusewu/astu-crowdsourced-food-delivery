/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/store/auth/authStore.ts — aligned with Prisma schema
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/endpoints/auth";
import type { User, CustomerProfile, DelivererProfile, ActiveMode } from "@/types/user.types";
import { getRoleRedirectPath } from "@/types/user.types";

export interface UpdateProfileData {
  // User-level fields
  fullName?: string;
  phoneNumber?: string | null;
  email?: string | null;
  astuEmail?: string | null;
  avatarUrl?: string | null;
  // Nested profile patches
  customerProfile?: Partial<CustomerProfile>;
  delivererProfile?: Partial<DelivererProfile>;
}

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
  activeMode: ActiveMode | null;
  isLoading: boolean;
  error: string | null;

  signup: (data: SignupData, navigate?: (path: string) => void) => Promise<void>;
  signin: (data: SigninData, navigate?: (path: string) => void) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (oldPw: string, newPw: string) => Promise<void>;

  setToken: (token: string) => void;
  setUser: (user: User) => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  toggleActiveMode: (targetMode?: ActiveMode) => Promise<void>;
  clearError: () => void;
}

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      activeMode: null,
      isLoading: false,
      error: null,

      setToken: (token: string) => set({ token }),

      setUser: (user: User) => set({ user }),

      signup: async (data, navigate) => {
        set({ isLoading: true, error: null });

      try {
          await authApi.register(data);
          set({ isLoading: false });
          // Navigate to OTP verification page
          if (navigate) navigate(`/verify-email`);
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      signin: async (data, navigate) => {
        try {
          const response = await authApi.login(data);
          const { accessToken, user } = response.data;

          set({ 
            user, 
            token: accessToken, 
            activeMode: user.activeMode as ActiveMode,
            isLoading: false 
          });

          if (navigate) navigate(getRoleRedirectPath(user.role, user.activeMode));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

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

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);
          const { customerProfile: cpPatch, delivererProfile: dpPatch, ...userFields } = data;
          set((s) => {
            if (!s.user) return { isLoading: false };
            return {
              user: {
                ...s.user,
                ...userFields,
                updatedAt: new Date().toISOString(),
                ...(cpPatch && s.user.customerProfile
                  ? { customerProfile: { ...s.user.customerProfile, ...cpPatch } }
                  : {}),
                ...(dpPatch && s.user.delivererProfile
                  ? { delivererProfile: { ...s.user.delivererProfile, ...dpPatch } }
                  : {}),
              },
              isLoading: false,
            };
          });
        } catch (e) {
          set({ isLoading: false, error: "Failed to update profile." });
          throw e;
        }
      },

      toggleActiveMode: async (targetMode: ActiveMode = "CUSTOMER") => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
          // Tell backend to update DB mode (so Dispatch Engine knows we are available)
          await authApi.toggleMode(targetMode as string);
          
          set({ 
            activeMode: targetMode,
            user: { ...user, activeMode: targetMode },
            isLoading: false 
          });

          // Handle Redirects
          if (targetMode === "DELIVERER") window.location.href = "/delivery/dashboard";
          else window.location.href = "/";
          
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

       logout: async () => {
        try {
          await authApi.logout(); // Tells backend to clear the HttpOnly cookie
        } catch (e) {
          console.error("Backend logout failed, clearing local state.");
        } finally {
          set({ user: null, token: null, activeMode: null, error: null });
          window.location.href = "/signin";
        }
      },

     clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        activeMode: state.activeMode 
      }),
    }
  )
);