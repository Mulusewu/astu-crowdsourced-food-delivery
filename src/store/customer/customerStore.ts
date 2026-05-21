/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";
import { useAuthStore } from "../auth/authStore";



export interface CustomerPreferences {
  language: "am" | "en";
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  theme: "light" | "dark";
  defaultSortBy: "rating" | "distance" | "price";
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
  favoriteRestaurants: string[];
  favoriteFoods: string[];
  recentSearches: string[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "customer";
  createdAt: string;
  isVerified: boolean;
  defaultAddressId?: string;
  preferences?: CustomerPreferences;
  stats?: CustomerStats;
}

interface CustomerState {
  // User data
  // user: CustomerUser | null;
  isLoading: boolean;
  error: string | null;
  
  // User preferences
  // addresses: Address[];
  // paymentMethods: PaymentMethod[];

  favorites: string[]; // restaurant IDs
  favoriteFoods: string[]; // food product IDs
  recentSearches: string[];


   fetchBookmarks: () => Promise<void>;
  toggleFavorite: (restaurantId: string) => Promise<void>;
  toggleFavoriteFood: (foodId: string) => Promise<void>;
  applyForDeliverer: (data: { idCardUrl: string, payoutProvider: string, payoutAccount: string }) => Promise<void>;
  
// Recent searches
  addRecentSearch: (searchTerm: string) => void;
  clearRecentSearches: () => void;

  clearError: () => void;
  resetCustomerState: () => void;

  
  // // Actions
  // fetchUserData: (userId?: string) => Promise<void>;
  // setUser: (user: CustomerUser) => void;
  // updateUser: (updates: Partial<CustomerUser>) => Promise<void>;
  
 
  
  // // Payment management
  // addPaymentMethod: (method: PaymentMethod) => void;
  // removePaymentMethod: (methodId: string) => void;
  // setDefaultPaymentMethod: (methodId: string) => void;
  
  // // Favorites
  // toggleFavorite: (restaurantId: string) => void;
  // toggleFavoriteFood: (foodId: string) => void;
  // isFavorite: (restaurantId: string) => boolean;
  // isFavoriteFood: (foodId: string) => boolean;
  // getFavorites: () => string[];
  // getFavoriteFoods: () => string[];
  
  
  
  // // Preferences
  // updatePreferences: (preferences: Partial<CustomerPreferences>) => void;
  
  // // Helpers
  // clearError: () => void;
  // logout: () => void;
}






export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      // Initial state
      // user: null,
      isLoading: false,
      error: null,
      // addresses: [],
      // paymentMethods: [],
      favorites: [],
      favoriteFoods: [],
      recentSearches: [],

  // ==========================================
      // BACKEND SYNCED ACTIONS
      // ==========================================
      fetchBookmarks: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.get('/users/me/bookmarks');
          const bookmarks = res.data.data;
          
          set({
            favorites: bookmarks.filter((b: any) => b.type === 'RESTAURANT').map((b: any) => b.targetId),
            favoriteFoods: bookmarks.filter((b: any) => b.type === 'MENU_ITEM').map((b: any) => b.targetId),
            isLoading: false
          });
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Failed to load bookmarks", isLoading: false });
        }
      },

      toggleFavorite: async (restaurantId) => {
        // 1. Optimistic UI Update
        const prevFavorites = get().favorites;
        const isCurrentlySaved = prevFavorites.includes(restaurantId);
        
        set({
          favorites: isCurrentlySaved
            ? prevFavorites.filter(id => id !== restaurantId)
            : [...prevFavorites, restaurantId]
        });

        // 2. Background Backend Sync
        try {
          await apiClient.post('/users/me/bookmarks', {
            type: 'RESTAURANT',
            targetId: restaurantId
          });
        } catch (error) {
          // 3. Rollback on failure
          set({ favorites: prevFavorites });
          console.log(error);
        }
      },
      
      toggleFavoriteFood: async (foodId) => {
        const prevFoods = get().favoriteFoods;
        const isCurrentlySaved = prevFoods.includes(foodId);

        set({
          favoriteFoods: isCurrentlySaved
            ? prevFoods.filter(id => id !== foodId)
            : [...prevFoods, foodId]
        });

        try {
          await apiClient.post('/users/me/bookmarks', {
            type: 'MENU_ITEM',
            targetId: foodId
          });
        } catch (error) {
          set({ favoriteFoods: prevFoods });
          console.log(error);
        }
      },

      applyForDeliverer: async (data: { idCardUrl: string, payoutProvider: string, payoutAccount: string }) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/users/me/deliverer-application', data);
      
      // We must refresh the authStore so the UI immediately sees the new PENDING status
      await useAuthStore.getState().refreshProfile();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to submit application", isLoading: false });
      throw error;
    }
  },

      // ==========================================
      // LOCAL UI ACTIONS
      // ==========================================
      addRecentSearch: (searchTerm) => {
        if (!searchTerm.trim()) return;
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== searchTerm);
          return { recentSearches: [searchTerm, ...filtered].slice(0, 10) };
        });
      },
      
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      clearError: () => set({ error: null }),
      
      resetCustomerState: () => set({ favorites: [], favoriteFoods: [], recentSearches: [], error: null })
    }),
    {
      name: "customer-storage",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        // We persist bookmarks so the UI is fast on reload, but fetchBookmarks overrides it in background
        favorites: state.favorites,
        favoriteFoods: state.favoriteFoods,
      }),
    }
  )
);