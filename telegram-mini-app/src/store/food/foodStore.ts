// src/store/food/foodStore.ts
import { create } from "zustand";
import { db } from "@/data";

export interface FoodDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  rating: number;
  totalReviews: number;
  preparationTime: number;
  calories?: number;
  isAvailable: boolean;
  isPopular: boolean;
  category?: string;
  categoryName?: string;
  spicyLevel?: string;
  serves?: number;
  options?: Array<{
    name: string;
    choices: Array<{
      name: string;
      price: number;
    }>;
  }>;
  modifiers?: Array<{
    name: string;
    price: number;
  }>;
}

interface FoodState {
  currentFood: FoodDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchFoodDetails: (id: string) => Promise<void>;
  clearCurrentFood: () => void;
}

// Helper to simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to find restaurant name from restaurant ID
const getRestaurantName = (restaurantId: string): string => {
  const restaurant = db.restaurants.find((r) => r.id === restaurantId);
  return restaurant?.name || "Restaurant";
};

// Helper to get restaurant rating
const getRestaurantRating = (restaurantId: string): number => {
  const restaurant = db.restaurants.find((r) => r.id === restaurantId);
  return restaurant?.avgRating || 0;
};

// Helper to get restaurant total reviews
const getRestaurantReviews = (restaurantId: string): number => {
  const restaurant = db.restaurants.find((r) => r.id === restaurantId);
  return restaurant?.totalReviews ?? 0;
};

export const useFoodStore = create<FoodState>((set, get) => ({
  currentFood: null,
  isLoading: false,
  error: null,

  fetchFoodDetails: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await delay(600); // Simulate network delay

      const foundFood = db.menuItems.find((m) => m.id === id);

      if (!foundFood) {
        throw new Error("Food item not found");
      }

      // Build the food details object
      const foodDetails: FoodDetails = {
        id: foundFood.id,
        name: foundFood.name,
        description: foundFood.description || "",
        price: foundFood.price,
        image: foundFood.imageUrl || "",
        restaurantId: foundFood.restaurantId,
        restaurantName: getRestaurantName(foundFood.restaurantId),
        rating: getRestaurantRating(foundFood.restaurantId),
        totalReviews: getRestaurantReviews(foundFood.restaurantId),
        preparationTime: foundFood.prepTimeMins || 15,
        isAvailable: foundFood.isAvailable !== false,
        isPopular: false,
        category: foundFood.categoryId,
      };

      set({ currentFood: foodDetails, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching food details:", error);
      set({
        error: error.message || "Failed to load food details",
        isLoading: false,
      });
    }
  },

  clearCurrentFood: () =>
    set({ currentFood: null, isLoading: false, error: null }),
}));