// src/store/food/foodStore.ts
import { create } from "zustand";
import db from "@/data/database.json";

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
  isFasting?: boolean;
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
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find restaurant name from restaurant ID
const getRestaurantName = (restaurantId: string): string => {
  const restaurant = db.restaurants.find(r => r.id === restaurantId);
  return restaurant?.name || "Restaurant";
};

// Helper to get restaurant rating
const getRestaurantRating = (restaurantId: string): number => {
  const restaurant = db.restaurants.find(r => r.id === restaurantId);
  return restaurant?.avgRating || 0;
};

// Helper to get restaurant total reviews
const getRestaurantReviews = (restaurantId: string): number => {
  const restaurant = db.restaurants.find(r => r.id === restaurantId);
  return restaurant?.totalReviews || 0;
};

export const useFoodStore = create<FoodState>((set) => ({
  currentFood: null,
  isLoading: false,
  error: null,

  fetchFoodDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await delay(600); // Simulate network delay

      // Search flat menuItems array (Prisma-aligned flat structure)
      let foundFood: any = null;
      let foundRestaurantId: string | null = null;

      for (const item of db.menuItems) {
        if (item.id === id) {
          foundFood = item;
          foundRestaurantId = item.restaurantId;
          break;
        }
      }

      if (!foundFood || !foundRestaurantId) {
        set({ currentFood: null, isLoading: false, error: null });
        return;
      }

      // Helper to find category name from category ID
      const getCategoryName = (categoryId?: string): string | undefined => {
        if (!categoryId) return undefined;
        const category = db.categories.find(c => c.id === categoryId);
        return category?.name;
      };

      // Build the food details object
      const foodDetails: FoodDetails = {
        id: foundFood.id,
        name: foundFood.name,
        description: foundFood.description,
        price: foundFood.price,
        discountPrice: foundFood.discountPrice,
        originalPrice: foundFood.originalPrice || foundFood.price,
        discount: foundFood.discountPrice 
          ? Math.round(((foundFood.price - foundFood.discountPrice) / foundFood.price) * 100)
          : foundFood.discount,
        image: foundFood.imageUrl || foundFood.image,
        restaurantId: foundRestaurantId,
        restaurantName: getRestaurantName(foundRestaurantId),
        rating: foundFood.rating || getRestaurantRating(foundRestaurantId),
        totalReviews: foundFood.totalReviews || getRestaurantReviews(foundRestaurantId),
        preparationTime: foundFood.prepTimeMins || foundFood.preparationTime || 15,
        calories: foundFood.calories,
        isAvailable: foundFood.isAvailable !== false,
        isPopular: foundFood.isPopular || false,
        isFasting: foundFood.isFasting || false,
        category: foundFood.category || foundFood.categoryId,
        categoryName: getCategoryName(foundFood.categoryId) || foundFood.categoryName,
        spicyLevel: foundFood.spicyLevel,
        serves: foundFood.serves,
        options: foundFood.options,
        modifiers: foundFood.modifiers,
      };

      set({ currentFood: foodDetails, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching food details:", error);
      set({ 
        error: "Failed to load food details. Please try again.", 
        isLoading: false 
      });
    }
  },

  clearCurrentFood: () => set({ currentFood: null, isLoading: false, error: null }),
}));