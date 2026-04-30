import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/data";

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  area: string;
  building: string;
  floor?: string;
  apartment?: string;
  office?: string;
  room?: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "cash" | "telegram_stars";
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiry?: string;
  expiryMonth?: number;
  expiryYear?: number;
  balance?: number;
}

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
  user: CustomerUser | null;
  isLoading: boolean;
  error: string | null;
  
  // User preferences
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  favorites: string[]; // restaurant IDs
  favoriteFoods: string[]; // food product IDs
  recentSearches: string[];
  
  // Actions
  fetchUserData: (userId?: string) => Promise<void>;
  setUser: (user: CustomerUser) => void;
  updateUser: (updates: Partial<CustomerUser>) => Promise<void>;
  
  // Address management
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, updates: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  getDefaultAddress: () => Address | undefined;
  
  // Payment management
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  
  // Favorites
  toggleFavorite: (restaurantId: string) => void;
  toggleFavoriteFood: (foodId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  isFavoriteFood: (foodId: string) => boolean;
  getFavorites: () => string[];
  getFavoriteFoods: () => string[];
  
  // Recent searches
  addRecentSearch: (searchTerm: string) => void;
  clearRecentSearches: () => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<CustomerPreferences>) => void;
  
  // Helpers
  clearError: () => void;
  logout: () => void;
}

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Default preferences
const defaultPreferences: CustomerPreferences = {
  language: "en",
  notifications: { push: true, email: true, sms: false },
  theme: "light",
  defaultSortBy: "rating"
};

// Helper to normalize payment method
const normalizePaymentMethod = (method: any): PaymentMethod => {
  return {
    id: method.id,
    type: method.type as "card" | "cash" | "telegram_stars",
    isDefault: method.isDefault || false,
    last4: method.last4,
    brand: method.brand,
    expiry: method.expiry,
    expiryMonth: method.expiryMonth,
    expiryYear: method.expiryYear,
    balance: method.balance,
  };
};

// Helper to normalize address
const normalizeAddress = (addr: any, isDefault: boolean): Address => {
  return {
    id: addr.id,
    label: addr.label,
    street: addr.street,
    city: addr.city,
    area: addr.area,
    building: addr.building,
    floor: addr.floor,
    apartment: addr.apartment,
    office: addr.office,
    room: addr.room,
    landmark: addr.landmark,
    latitude: addr.latitude,
    longitude: addr.longitude,
    isDefault,
  };
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      addresses: [],
      paymentMethods: [],
      favorites: [],
      favoriteFoods: [],
      recentSearches: [],

      fetchUserData: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);

          const resolvedUserId =
            userId ||
            db.users.find((u) => u.role === "CUSTOMER")?.id ||
            db.users[0]?.id;

          const schemaUser = resolvedUserId
            ? db.users.find((u) => u.id === resolvedUserId)
            : undefined;

          if (!schemaUser) throw new Error("Customer not found");

          const profile = db.customerProfiles.find(
            (p) => p.userId === schemaUser.id,
          );

          const favorites = profile?.bookmarkRestaurants || [];
          const favoriteFoods = profile?.bookmarkMeals || [];

          const user: CustomerUser = {
            id: schemaUser.id,
            name: schemaUser.fullName,
            email: schemaUser.email || "",
            phone: schemaUser.phoneNumber || "",
            avatar: schemaUser.avatarUrl || undefined,
            role: "customer",
            createdAt: schemaUser.createdAt,
            isVerified: schemaUser.isEmailVerified || schemaUser.isPhoneVerified,
            preferences: defaultPreferences,
            stats: {
              totalOrders: profile?.totalOrders || 0,
              totalSpent: 0,
              averageRating: profile?.rating || 5,
              favoriteRestaurants: favorites,
              favoriteFoods: favoriteFoods,
              recentSearches: [],
            },
          };
          
          set({
            user,
            addresses: [],
            paymentMethods: [],
            favorites,
            favoriteFoods,
            recentSearches: [],
            isLoading: false,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to load user data", isLoading: false });
        }
      },

      setUser: (user) => set({ user }),
      
      updateUser: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          await delay(500);
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, ...updates }, isLoading: false });
          }
        } catch (error) {
          set({ error: "Failed to update user", isLoading: false });
        }
      },

      // Address Management
      addAddress: (address) => {
        set((state) => ({
          addresses: [...state.addresses, address],
        }));
      },
      
      updateAddress: (addressId, updates) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === addressId ? { ...addr, ...updates } : addr
          ),
        }));
      },
      
      deleteAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== addressId),
        }));
      },
      
      setDefaultAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
          user: state.user ? { ...state.user, defaultAddressId: addressId } : null,
        }));
      },
      
      getDefaultAddress: () => {
        return get().addresses.find((addr) => addr.isDefault);
      },

      // Payment Management
      addPaymentMethod: (method) => {
        set((state) => ({
          paymentMethods: [...state.paymentMethods, method],
        }));
      },
      
      removePaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId),
        }));
      },
      
      setDefaultPaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((method) => ({
            ...method,
            isDefault: method.id === methodId,
          })),
        }));
      },

      // Favorites Management
      toggleFavorite: (restaurantId) => {
        set((state) => ({
          favorites: state.favorites.includes(restaurantId)
            ? state.favorites.filter((id) => id !== restaurantId)
            : [...state.favorites, restaurantId],
        }));
      },
      
      toggleFavoriteFood: (foodId) => {
        set((state) => ({
          favoriteFoods: state.favoriteFoods.includes(foodId)
            ? state.favoriteFoods.filter((id) => id !== foodId)
            : [...state.favoriteFoods, foodId],
        }));
      },
      
      isFavorite: (restaurantId) => {
        return get().favorites.includes(restaurantId);
      },
      
      isFavoriteFood: (foodId) => {
        return get().favoriteFoods.includes(foodId);
      },
      
      getFavorites: () => {
        return get().favorites;
      },
      
      getFavoriteFoods: () => {
        return get().favoriteFoods;
      },

      // Recent Searches
      addRecentSearch: (searchTerm) => {
        if (!searchTerm.trim()) return;
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== searchTerm);
          return {
            recentSearches: [searchTerm, ...filtered].slice(0, 10),
          };
        });
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      // Preferences
      updatePreferences: (preferences) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            preferences: { ...state.user.preferences, ...preferences } as CustomerPreferences,
          } : null,
        }));
      },

      // Helpers
      clearError: () => set({ error: null }),
      
      logout: () => {
        set({
          user: null,
          addresses: [],
          paymentMethods: [],
          favorites: [],
          favoriteFoods: [],
          recentSearches: [],
          error: null,
        });
      },
    }),
    {
      name: "customer-storage",
      partialize: (state) => ({
        user: state.user,
        addresses: state.addresses,
        paymentMethods: state.paymentMethods,
        favorites: state.favorites,
        favoriteFoods: state.favoriteFoods,
        recentSearches: state.recentSearches,
      }),
    }
  )
);