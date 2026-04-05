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
  return restaurant?.rating || 0;
};

// Helper to get restaurant total reviews
const getRestaurantReviews = (restaurantId: string): number => {
  const restaurant = db.restaurants.find(r => r.id === restaurantId);
  return restaurant?.totalReviews || 0;
};

export const useFoodStore = create<FoodState>((set, get) => ({
  currentFood: null,
  isLoading: false,
  error: null,

  fetchFoodDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await delay(600); // Simulate network delay

      // Search for the food item across all restaurants in database.json
      let foundFood: any = null;
      let foundRestaurantId: string | null = null;

      // Iterate through all restaurants and their menus
      for (const restaurant of db.restaurants) {
        const menuItems = db.menu[restaurant.id as keyof typeof db.menu];
        if (menuItems && Array.isArray(menuItems)) {
          const food = menuItems.find((item: any) => item.id === id);
          if (food) {
            foundFood = food;
            foundRestaurantId = restaurant.id;
            break;
          }
        }
      }

      // Also check in any other menu structures if needed
      if (!foundFood) {
        // Try alternative menu structure (if any)
        const allMenuItems = Object.values(db.menu).flat();
        const alternativeMatch = allMenuItems.find((item: any) => item.id === id);
        if (alternativeMatch) {
          foundFood = alternativeMatch;
          // Try to find which restaurant this belongs to
          for (const [restId, menuItems] of Object.entries(db.menu)) {
            if (Array.isArray(menuItems) && menuItems.some((item: any) => item.id === id)) {
              foundRestaurantId = restId;
              break;
            }
          }
        }
      }

      if (!foundFood || !foundRestaurantId) {
        throw new Error("Food item not found");
      }

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
        image: foundFood.image,
        restaurantId: foundRestaurantId,
        restaurantName: getRestaurantName(foundRestaurantId),
        rating: foundFood.rating || getRestaurantRating(foundRestaurantId),
        totalReviews: foundFood.totalReviews || getRestaurantReviews(foundRestaurantId),
        preparationTime: foundFood.preparationTime || 15,
        calories: foundFood.calories,
        isAvailable: foundFood.isAvailable !== false,
        isPopular: foundFood.isPopular || false,
        category: foundFood.category,
        categoryName: foundFood.categoryName,
        spicyLevel: foundFood.spicyLevel,
        serves: foundFood.serves,
        options: foundFood.options,
        modifiers: foundFood.modifiers,
      };

      set({ currentFood: foodDetails, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching food details:", error);
      set({ 
        error: error.message || "Failed to load food details", 
        isLoading: false 
      });
    }
  },

  clearCurrentFood: () => set({ currentFood: null, isLoading: false, error: null }),
}));