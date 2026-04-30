import { create } from "zustand";
import { db } from "@/data";

export interface Cafe {
  id: string;
  name: string;
  image?: string;
  cuisine?: string[];
  rating?: number;
  deliveryTime?: string; // UI-only estimate
  deliveryFee?: number; // UI-only (order-dependent in schema)
  minimumOrder?: number;
}

interface CafeStore {
  // State
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCafes: () => Promise<void>;
  fetchCafeById: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedCafe: () => void;
}

// Simulate API delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useCafeStore = create<CafeStore>((set) => ({
  // Initial state
  cafes: [],
  selectedCafe: null,
  isLoading: false,
  error: null,

  // Fetch all cafes
  fetchCafes: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);

      // Extract cafes from Prisma restaurants
      const cafes = db.restaurants.map((rest) => ({
        id: rest.id,
        name: rest.name,
        image:
          rest.imageUrl ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
        cuisine: rest.tags || [],
        rating: rest.avgRating,
        deliveryTime: "15-25 min",
        deliveryFee: 0,
        minimumOrder: Number(rest.minOrderValue) || 0,
      }));

      set({
        cafes,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cafes",
        isLoading: false,
      });
    }
  },

  // Fetch single cafe by ID
  fetchCafeById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await delay(300);

      const restaurant = db.restaurants.find((r) => r.id === id);

      if (!restaurant) {
        throw new Error("Cafe not found");
      }

      const cafe = {
        id: restaurant.id,
        name: restaurant.name,
        image:
          restaurant.imageUrl ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
        cuisine: restaurant.tags || [],
        rating: restaurant.avgRating,
        deliveryTime: "15-25 min",
        deliveryFee: 0,
        minimumOrder: Number(restaurant.minOrderValue) || 0,
      };

      set({
        selectedCafe: cafe,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cafe",
        isLoading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear selected cafe
  clearSelectedCafe: () => set({ selectedCafe: null }),
}));
