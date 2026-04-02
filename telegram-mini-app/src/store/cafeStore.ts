import { create } from "zustand";
import db from "@/data/database.json";

export interface Cafe {
  id: string;
  name: string;
  image?: string;
  cuisine?: string[];
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
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

      // Extract cafes from restaurants in db.json
      const cafes = db.restaurants.map((rest) => ({
        id: rest.id,
        name: rest.name,
        image: rest.image,
        cuisine: rest.cuisine,
        rating: rest.rating,
        deliveryTime: rest.deliveryTime,
        deliveryFee: rest.deliveryFee,
        minimumOrder: rest.minimumOrder,
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
        image: restaurant.image,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee,
        minimumOrder: restaurant.minimumOrder,
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
