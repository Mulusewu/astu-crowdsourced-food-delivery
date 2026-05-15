/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";



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

      // fetchUserData: async (userId = "") => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     await delay(600);

      //     // Flat db.users array (Prisma-aligned) — customers have role "CUSTOMER"
      //     const customer = db.users.find((u: any) =>
      //       userId ? u.id === userId : u.role === "CUSTOMER"
      //     );

      //     if (!customer) {
      //       throw new Error("Customer not found");
      //     }

      //     const user: CustomerUser = {
      //       id: customer.id,
      //       name: (customer as any).fullName ?? (customer as any).name ?? "",
      //       email: (customer as any).email ?? "",
      //       phone: (customer as any).phoneNumber ?? (customer as any).phone ?? "",
      //       avatar: (customer as any).avatarUrl ?? (customer as any).avatar,
      //       role: "customer",
      //       createdAt: customer.createdAt,
      //       isVerified: (customer as any).isEmailVerified ?? false,
      //     };

      //     set({
      //       user,
      //       isLoading: false,
      //     });
      //   } catch (error) {
      //     set({ error: error instanceof Error ? error.message : "Failed to load user data", isLoading: false });
      //   }
      // },

      // setUser: (user) => set({ user }),
      
      // updateUser: async (updates) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     await delay(500);
      //     const currentUser = get().user;
      //     if (currentUser) {
      //       set({ user: { ...currentUser, ...updates }, isLoading: false });
      //     }
      //   } catch (error) {
      //     set({ error: "Failed to update user", isLoading: false });
      //   }
      // },

      // // Address Management
      // addAddress: (address) => {
      //   set((state) => ({
      //     addresses: [...state.addresses, address],
      //   }));
      // },
      
      // updateAddress: (addressId, updates) => {
      //   set((state) => ({
      //     addresses: state.addresses.map((addr) =>
      //       addr.id === addressId ? { ...addr, ...updates } : addr
      //     ),
      //   }));
      // },
      
      // deleteAddress: (addressId) => {
      //   set((state) => ({
      //     addresses: state.addresses.filter((addr) => addr.id !== addressId),
      //   }));
      // },
      
      // setDefaultAddress: (addressId) => {
      //   set((state) => ({
      //     addresses: state.addresses.map((addr) => ({
      //       ...addr,
      //       isDefault: addr.id === addressId,
      //     })),
      //     user: state.user ? { ...state.user, defaultAddressId: addressId } : null,
      //   }));
      // },
      
      // getDefaultAddress: () => {
      //   return get().addresses.find((addr) => addr.isDefault);
      // },

      // // Payment Management
      // addPaymentMethod: (method) => {
      //   set((state) => ({
      //     paymentMethods: [...state.paymentMethods, method],
      //   }));
      // },
      
      // removePaymentMethod: (methodId) => {
      //   set((state) => ({
      //     paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId),
      //   }));
      // },
      
      // setDefaultPaymentMethod: (methodId) => {
      //   set((state) => ({
      //     paymentMethods: state.paymentMethods.map((method) => ({
      //       ...method,
      //       isDefault: method.id === methodId,
      //     })),
      //   }));
      // },

      // Favorites Management
  //     toggleFavorite: (restaurantId) => {
  //       set((state) => ({
  //         favorites: state.favorites.includes(restaurantId)
  //           ? state.favorites.filter((id) => id !== restaurantId)
  //           : [...state.favorites, restaurantId],
  //       }));
  //     },
      
  //     toggleFavoriteFood: (foodId) => {
  //       set((state) => ({
  //         favoriteFoods: state.favoriteFoods.includes(foodId)
  //           ? state.favoriteFoods.filter((id) => id !== foodId)
  //           : [...state.favoriteFoods, foodId],
  //       }));
  //     },
      
  //     isFavorite: (restaurantId) => {
  //       return get().favorites.includes(restaurantId);
  //     },
      
  //     isFavoriteFood: (foodId) => {
  //       return get().favoriteFoods.includes(foodId);
  //     },
      
  //     getFavorites: () => {
  //       return get().favorites;
  //     },
      
  //     getFavoriteFoods: () => {
  //       return get().favoriteFoods;
  //     },

  //     // Recent Searches
  //     addRecentSearch: (searchTerm) => {
  //       if (!searchTerm.trim()) return;
  //       set((state) => {
  //         const filtered = state.recentSearches.filter((s) => s !== searchTerm);
  //         return {
  //           recentSearches: [searchTerm, ...filtered].slice(0, 10),
  //         };
  //       });
  //     },
      
  //     clearRecentSearches: () => {
  //       set({ recentSearches: [] });
  //     },

  //     // Preferences
  //     updatePreferences: (preferences) => {
  //       set((state) => ({
  //         user: state.user ? {
  //           ...state.user,
  //           preferences: { ...state.user.preferences, ...preferences } as CustomerPreferences,
  //         } : null,
  //       }));
  //     },

  //     // Helpers
  //     clearError: () => set({ error: null }),
      
  //     logout: () => {
  //       set({
  //         user: null,
  //         addresses: [],
  //         paymentMethods: [],
  //         favorites: [],
  //         favoriteFoods: [],
  //         recentSearches: [],
  //         error: null,
  //       });
  //     },
  //   }),
  //   {
  //     name: "customer-storage",
  //     partialize: (state) => ({
  //       user: state.user,
  //       addresses: state.addresses,
  //       paymentMethods: state.paymentMethods,
  //       favorites: state.favorites,
  //       favoriteFoods: state.favoriteFoods,
  //       recentSearches: state.recentSearches,
  //     }),
  //   }
  // )
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