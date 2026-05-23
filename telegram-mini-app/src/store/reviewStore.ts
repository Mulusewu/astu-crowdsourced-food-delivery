import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";

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
  submitReviews: (orderId: string) => Promise<void>;
  reset: () => void;
}

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

  submitReviews: async (orderId: string) => {
    const { delivererRating, delivererText, restaurantRating, restaurantText } = get();
    
    // Safety check: At least one rating is required
    if (restaurantRating === 0 && delivererRating === 0) {
      set({ error: "Please provide at least one rating." });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 1. Data Sanitization to match Backend DTO
      // Combine text fields cleanly. If only one exists, just send that one.
      let combinedComment = "";
      if (restaurantText && delivererText) {
        combinedComment = `Food: ${restaurantText} | Delivery: ${delivererText}`;
      } else if (restaurantText) {
        combinedComment = restaurantText;
      } else if (delivererText) {
        combinedComment = delivererText;
      }

      // 2. Build the Payload
      const payload: any = {
        restaurantRating: restaurantRating > 0 ? restaurantRating : undefined,
        comment: combinedComment.substring(0, 500) // Max length safety
      };

      // Only attach deliverer rating if it was explicitly set
      // (e.g., if the order was cancelled, there might not be a deliverer)
      if (delivererRating > 0) {
        payload.delivererRating = delivererRating;
      }

      // 3. Network Call
      await apiClient.post(`/orders/${orderId}/review`, payload);

      set({ isLoading: false, isSubmitted: true });
    } catch (e: any) {
      console.error("Review submission failed:", e);
      set({ 
        isLoading: false, 
        error: e.response?.data?.message || "Failed to submit review. Please try again." 
      });
      throw e; // Throw so UI can toast
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