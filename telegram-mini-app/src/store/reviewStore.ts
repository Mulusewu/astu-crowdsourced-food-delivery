// src/store/reviewStore.ts
import { create } from "zustand";

interface ReviewState {
  // Deliverer review
  delivererRating: number;
  delivererText: string;
  // Restaurant review
  restaurantRating: number;
  restaurantText: string;
  // Meta
  isLoading: boolean;
  isSubmitted: boolean;
  error: string | null;
  // Actions
  setDelivererRating: (r: number) => void;
  setDelivererText: (t: string) => void;
  setRestaurantRating: (r: number) => void;
  setRestaurantText: (t: string) => void;
  submitReviews: (params: {
    orderId: string;
    restaurantId: string;
    restaurantName: string;
    delivererName?: string;
  }) => Promise<void>;
  reset: () => void;
}

// Simulated async submit (replace with real API call later)
const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export const useReviewStore = create<ReviewState>()((set, get) => ({
  delivererRating: 0,
  delivererText: "",
  restaurantRating: 0,
  restaurantText: "",
  isLoading: false,
  isSubmitted: false,
  error: null,

  setDelivererRating: (r) => set({ delivererRating: r }),
  setDelivererText: (t) => set({ delivererText: t }),
  setRestaurantRating: (r) => set({ restaurantRating: r }),
  setRestaurantText: (t) => set({ restaurantText: t }),

  submitReviews: async ({ orderId, restaurantId, restaurantName, delivererName }) => {
    const { delivererRating, restaurantRating } = get();
    if (restaurantRating === 0 && delivererRating === 0) {
      set({ error: "Please rate at least one." });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await delay();
      // TODO: replace with real API calls
      console.log("Review submitted:", {
        orderId,
        restaurant: { id: restaurantId, name: restaurantName, rating: restaurantRating, text: get().restaurantText },
        deliverer: delivererName ? { name: delivererName, rating: delivererRating, text: get().delivererText } : null,
      });
      set({ isLoading: false, isSubmitted: true });
    } catch {
      set({ isLoading: false, error: "Failed to submit review. Please try again." });
    }
  },

  reset: () =>
    set({
      delivererRating: 0,
      delivererText: "",
      restaurantRating: 0,
      restaurantText: "",
      isLoading: false,
      isSubmitted: false,
      error: null,
    }),
}));
