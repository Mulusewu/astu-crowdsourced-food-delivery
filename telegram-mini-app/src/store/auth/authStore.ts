/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/store/auth/authStore.ts — aligned with Prisma schema
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/endpoints/auth";
import { apiClient } from "@/api/client/axiosInstance"; // For direct profile fetching
import type { User, CustomerProfile, DelivererProfile, ActiveMode, UserRole } from "@/types/user.types";
import { getRoleRedirectPath } from "@/types/user.types";
import { email, type int } from "zod";
import { ROUTES } from "@/routes";

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
  intendedMode: "student" | "vendor"; // New field to indicate which login mode the user is trying to access
}

interface SignupVendorData {
  vendorName: string;
  email: string;
  contactNumber: string;
  password: string;
  businessDocumentUrl: string;
   intendedMode: "student" | "vendor";
}

interface SigninData {
  identifier: string; // Can be email or phone, backend will handle
  password: string;
  intendedMode: "student" | "vendor"; // New field to indicate which login mode the user is trying to access
}

interface AuthState {
  user: User | null;
  token: string | null;
  activeMode: ActiveMode | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;

  signup: (data: SignupData, navigate?: (path: string) => void) => Promise<void>;
  signin: (data: SigninData, navigate?: (path: string) => void) => Promise<void>;
  signupVendor: (data: SignupVendorData, navigate?: (path: string) => void) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (oldPw: string, newPw: string) => Promise<void>;
   toggleActiveMode: (targetMode: ActiveMode, navigate?: (path: string) => void) => Promise<void>;
  refreshProfile: () => Promise<void>;

  setToken: (token: string) => void;
  setUser: (user: User) => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updatePhone: (newPhone: string) => Promise<void>;

  clearError: () => void;
}




const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const mapBackendRoleToFrontendArray = (backendRole: string): UserRole[] => {
  switch (backendRole) {
    case 'DELIVERER': return ["CUSTOMER", "DELIVERER"];
    case 'VENDOR_STAFF': return ["CUSTOMER", "VENDOR_STAFF"];
    case 'ADMIN': return ["CUSTOMER", "VENDOR_STAFF", "DELIVERER", "ADMIN"];
    default: return ["CUSTOMER"];
  }
};



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      activeMode: null,
      roles: ["CUSTOMER"],
      isLoading: false,
      error: null,

      setToken: (token: string) => set({ token }),

      setUser: (user: User) => set({ user }),
      clearError: () => set({ error: null }),
      refreshProfile: async () => {
        try {
          // Hits the GET /users/me endpoint we built in the backend
          const res = await apiClient.get('/users/me');
          const freshUser = res.data.data;
          const freshRoles = mapBackendRoleToFrontendArray(freshUser.role);
          
          set({ 
            user: freshUser,
            activeMode: freshUser.activeMode as ActiveMode,
            roles: freshRoles
          });
        } catch (error) {
          console.error("Failed to refresh profile", error);
        }
      },
      signup: async (data, navigate) => {
        set({ isLoading: true, error: null });

      try {
          await authApi.register(data);
          set({ isLoading: false });
          // Navigate to OTP verification page
          if (navigate) navigate(`/verify-email/${data.astuEmail}`);
          // if (navigate) navigate(`${ROUTES.VERIFY_EMAIL}/${data.astuEmail}`);
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

       signupVendor: async (data, navigate) => {
        set({ isLoading: true, error: null });

        //mapping frontend field names to backend expected names
        const backendData = {
          ...data,
          fullName: data.vendorName, // Map vendorName to fullName for backend
          phoneNumber: data.contactNumber, // Map contactNumber to phoneNumber for backend
          email: data.email,
          password: data.password,
          businessDocumentUrl: data.businessDocumentUrl || "https://example.com/license-placeholder.pdf"
        };
        try {
          // Call the newly created API endpoint
          await authApi.registerVendor(backendData);
          set({ isLoading: false });
          // Route vendors to phone verification or pending screen
          if (navigate) navigate(`verify-phone/${data.contactNumber}`);
        } catch (error: any) {
          set({ isLoading: false, error: error.response?.data?.message || "Vendor registration failed" });
          throw error;
        }
      },

    
      signin: async (data, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const { intendedMode, ...apiPayload } = data;
          const response = await authApi.login(apiPayload);

          const { accessToken, user } = response.data;
          if (intendedMode === "student" && user.role === "VENDOR_STAFF") {
            throw new Error("You selected Student login, but this is a Vendor account.");
          }
          console.log("User:", user); // Debug log
          if (intendedMode === "vendor" && user.role !== "VENDOR_STAFF") {
            throw new Error("You selected Vendor login, but this is a Student account.");
          }
          const frontendRoles = mapBackendRoleToFrontendArray(user.role);
          const activeMode = frontendRoles.includes("DELIVERER") ? "DELIVERER" : "CUSTOMER";

          set({  
            token: accessToken, 
            activeMode: user.activeMode as ActiveMode,
            roles: frontendRoles,
            user: { ...user, avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}` },  
            isLoading: false
          });

          if (navigate) navigate(getRoleRedirectPath(user.role, user.activeMode));
        } catch (error: any) {
          set({ isLoading: false, error: error.response?.data?.message || "Failed to sign in" });
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
          // Make API call to backend
          const response = await apiClient.patch('/users/me', data);
          const updatedUser = response.data.data;

          set((s) => {
            if (!s.user) return { isLoading: false };
            
            // Extract profile patches to update local state optimistically or 
            // merge backend response (assuming backend returns full user).
            // For safety, we merge the API response into the existing user.
            const { customerProfile: cpPatch, delivererProfile: dpPatch, ...userFields } = data;
            
            return {
              user: {
                ...s.user,
                // Apply the exact fields sent in the request locally for immediate UI updates,
                // or rely entirely on `updatedUser` if the backend returns the populated object.
                ...updatedUser, // Merge backend response
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
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Failed to update profile." 
          });
          throw error;
        }
      },

      updatePhone: async (newPhone: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.patch('/users/me/phone', { newPhone });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to update phone number."
          });
          throw error;
        }
      },

      toggleActiveMode: async (targetMode: ActiveMode = "CUSTOMER", navigate?: (path: string) => void) => {
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
           if (navigate) {
            if (targetMode === "DELIVERER") navigate("/delivery/dashboard");
            else navigate("/customer/dashboard");
          }
          
        } catch (error: any) {
          set({ isLoading: false, error: error.response?.data?.message || "Failed to switch mode" });
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        activeMode: state.activeMode ,
        roles: state.roles
      }),
    }
  )
);