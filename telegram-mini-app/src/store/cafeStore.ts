// src/store/cafeStore.ts
// Aligned with Prisma Restaurant model field names
import { create } from "zustand";
import db from "@/data/database.json";

export interface Cafe {
  id: string;
  name: string;
  imageUrl: string | null;
  location: string;
  tags: string[];          // was: cuisine
  avgRating: number;       // was: rating
  totalReviews: number;
  minOrderValue: number;   // was: minimumOrder
  isOpen: boolean;
  isActive: boolean;
  phone: string;
  lat: number;
  lng: number;
}

interface CafeStore {
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  isLoading: boolean;
  error: string | null;
  fetchCafes: () => Promise<void>;
  fetchCafeById: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedCafe: () => void;
}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const mapRestaurantToCafe = (r: (typeof db.restaurants)[number]): Cafe => ({
  id: r.id,
  name: r.name,
  imageUrl: r.imageUrl ?? null,
  location: r.location,
  tags: r.tags,
  avgRating: r.avgRating,
  totalReviews: r.totalReviews,
  minOrderValue: r.minOrderValue,
  isOpen: r.isOpen,
  isActive: r.isActive,
  phone: r.phone,
  lat: r.lat,
  lng: r.lng,
});

export const useCafeStore = create<CafeStore>((set) => ({
  cafes: [],
  selectedCafe: null,
  isLoading: false,
  error: null,

  fetchCafes: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);
      set({ cafes: db.restaurants.map(mapRestaurantToCafe), isLoading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to fetch cafes", isLoading: false });
    }
  },

  fetchCafeById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await delay(300);
      const r = db.restaurants.find((x) => x.id === id);
      if (!r) throw new Error("Cafe not found");
      set({ selectedCafe: mapRestaurantToCafe(r), isLoading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to fetch cafe", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedCafe: () => set({ selectedCafe: null }),
}));
