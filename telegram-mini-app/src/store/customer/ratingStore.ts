// src/store/customer/ratingStore.ts
// Prisma-aligned: Rating model (raterId, rateeId, orderId, rating, comment)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

export interface Rating {
  id: string;
  raterId: string;
  rateeId: string;    // deliverer or vendor userId
  orderId: string;
  rating: number;     // 1–5
  comment: string;
  createdAt: string;
}

interface RatingState {
  ratings: Rating[];
  isSubmitting: boolean;
  hasRated: (orderId: string) => boolean;
  submitRating: (params: {
    rateeId: string;
    orderId: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
}

const seedRatings: Rating[] = (db.ratings as any[]).map((r) => ({
  id: r.id,
  raterId: r.raterId,
  rateeId: r.rateeId,
  orderId: r.orderId,
  rating: r.rating,
  comment: r.comment ?? "",
  createdAt: r.createdAt,
}));

export const useRatingStore = create<RatingState>()(
  persist(
    (set, get) => ({
      ratings: seedRatings,
      isSubmitting: false,

      hasRated: (orderId) => {
        const { user } = useAuthStore.getState();
        return get().ratings.some(
          (r) => r.orderId === orderId && r.raterId === user?.id,
        );
      },

      submitRating: async ({ rateeId, orderId, rating, comment }) => {
        set({ isSubmitting: true });
        await new Promise((r) => setTimeout(r, 500));
        const { user } = useAuthStore.getState();
        const newRating: Rating = {
          id: `rat_${Date.now()}`,
          raterId: user?.id ?? "",
          rateeId,
          orderId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ ratings: [...s.ratings, newRating], isSubmitting: false }));
      },
    }),
    {
      name: "rating-storage",
      partialize: (s) => ({ ratings: s.ratings }),
    },
  ),
);
