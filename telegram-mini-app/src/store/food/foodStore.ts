import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";

export interface FoodDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  rating: number; // Mapped from restaurant
  totalReviews: number; // Mapped from restaurant
  preparationTime: number;
  isAvailable: boolean; // Computed effectiveAvailability
  isFasting: boolean;
  categoryName?: string;
}

interface FoodState {
  currentFood: FoodDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchFoodDetails: (id: string) => Promise<void>;
  clearCurrentFood: () => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  currentFood: null,
  isLoading: false,
  error: null,

  fetchFoodDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Hit the new backend endpoint
      const res = await apiClient.get(`/discovery/items/${id}`);
      const foundFood = res.data.data;

      // Map the backend relational structure to the UI flat structure
      const foodDetails: FoodDetails = {
        id: foundFood.id,
        name: foundFood.name,
        description: foundFood.description || "",
        price: Number(foundFood.price),
        image: foundFood.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        restaurantId: foundFood.restaurantId,
        restaurantName: foundFood.restaurant.name,
        rating: Number(foundFood.restaurant.avgRating) || 5.0,
        totalReviews: foundFood.restaurant.totalReviews || 0,
        preparationTime: foundFood.prepTimeMins || 15,
        isAvailable: foundFood.effectiveAvailability ?? true,
        isFasting: foundFood.isFasting || false,
        categoryName: foundFood.category?.name,
      };

      set({ currentFood: foodDetails, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching food details:", error);
      set({ 
        error: error.response?.data?.message || "Failed to load food details.", 
        isLoading: false 
      });
    }
  },

  clearCurrentFood: () => set({ currentFood: null, isLoading: false, error: null }),
}));