/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";

export interface FoodItem {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  location: string;
  price: number;
  rating: number; // Mapping from restaurant.avgRating or item.rating
  image: string;  // Mapping from item.imageUrl
  description: string;
  categoryId?: string;
  isFasting?: boolean;
  prepTimeMins?: number;
  isAvailable?: boolean;
  availabilityReason?: string | null;
  isPromo?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  cuisine: string[]; // Mapping from tags
  image: string;   // Mapping from imageUrl
  coverImage: string;
  logo: string;
  rating: number; // Mapping from avgRating
  totalReviews: number;
  priceLevel: string;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number; // Mapping from minOrderValue
  freeDeliveryThreshold: number;
  isOpen: boolean;
  location: string;
  contact: {
    phone: string;
    website?: string;
    email: string;
  };
  hours: Record<string, string>;
  features: any;
  categories: any[];
  offers: any[];
  deliveryZones: string[];
  estimatedDeliveryTime: {
    min: number;
    max: number;
  };
  popularityScore: number;
  isFeatured: boolean;
  menu: FoodItem[];
}

interface RestaurantState {
  restaurants: Restaurant[];
  popularFoods: FoodItem[];
  currentRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;

  fetchRestaurants: (filters?: { searchQuery?: string; location?: string; sortBy?: string }) => Promise<void>;
  fetchPopularFoods: (filters?: { searchQuery?: string; location?: string; priceRange?: string }) => Promise<void>;
  fetchRestaurantDetails: (id: string) => Promise<void>;
  toggleRestaurantStatus: (id: string, status: boolean) => Promise<void>;
  clearCurrentRestaurant: () => void;
  clearError: () => void;
}

const mapBackendRestaurant = (rest: any): Restaurant => ({
  id: rest.id,
  name: rest.name,
  description: "A wonderful place to eat in ASTU.",
  shortDescription: "",
  cuisine: rest.tags || [],
  image: rest.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
  coverImage: rest.imageUrl || "",
  logo: "",
  rating: Number(rest.avgRating) || 5.0,
  totalReviews: Number(rest.totalReviews) || 0,
  priceLevel: "$$",
  deliveryTime: "15-25 min",
  deliveryFee: 33, // Default backend minimum
  minimumOrder: Number(rest.minOrderValue) || 0,
  freeDeliveryThreshold: 0,
  isOpen: rest.effectiveIsOpen ?? (rest.isOpen !== false), // Uses backend computed schedule
  location: rest.location || "ASTU Campus",
  contact: { phone: rest.phone || "", email: "", website: "" },
  hours: { open: rest.openingTime || "00:00", close: rest.closingTime || "23:59" },
  features: { acceptsCash: true, acceptsCard: true, hasDelivery: true },
  categories: rest.categories || [],
  offers: [],
  deliveryZones: ["ASTU Campus"],
  estimatedDeliveryTime: { min: 15, max: 30 },
  popularityScore: Number(rest.totalReviews) || 0,
  isFeatured: false,
  menu: [] // Will be populated in details fetch
});

const mapBackendMenuItem = (item: any, restaurantName: string, location: string): FoodItem => ({
  id: item.id,
  name: item.name,
  restaurant: restaurantName,
  restaurantId: item.restaurantId,
  location: location,
  price: Number(item.price) || 0,
  rating: 5.0, // Backend reviews are aggregated at restaurant/deliverer level, items inherit 5.0 in UI
  image: item.imageUrl || "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&fit=crop",
  description: item.description || "",
  categoryId: item.categoryId,
  isFasting: item.isFasting || false,
  prepTimeMins: item.prepTimeMins || 15,
  isAvailable: item.effectiveAvailability ?? item.isAvailable, // Uses backend computed state
  availabilityReason: item.availabilityReason || null,
  isPromo: false
});



const resId = "3d5c9101-df75-46ac-8700-ce4062be6990";

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  popularFoods: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,
  
  //for testing we use specific resturants menus for teh popular food part
  
  fetchRestaurants: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Build API query parameters
      const params: any = { limit: 20 };
      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.sortBy === "Rating") params.sortBy = "rating";
      // To support Location sorting, we would pass userLat & userLng here
      
      const response = await apiClient.get('/restaurants', { params });
      
      const restaurants = response.data.restaurants.map(mapBackendRestaurant);
      set({ restaurants, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to load restaurants", isLoading: false });
    }
  },

  fetchPopularFoods: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params: any = { limit: 8 };
      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.priceRange && filters.priceRange !== "Any") {
        const [min, max] = filters.priceRange.split("-");
        params.minPrice = min;
        params.maxPrice = max;
      }

      // Hit our powerful Global Discovery Search endpoint
      const response = await apiClient.get(`/restaurants/${resId}/items`, { params });
      
      const popularFoods = response.data.items.map((item: any) => 
        mapBackendMenuItem(item, item.restaurant?.name || "Restaurant", item.restaurant?.location || "ASTU")
      );

      set({ popularFoods, isLoading: false });
    } catch (error: any) {
      set({ error: "Failed to load popular foods", isLoading: false });
      console.log(error);
    }
  },

  fetchRestaurantDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/restaurants/${id}`);
      const rawRest = response.data.data;
      
      const mappedRest = mapBackendRestaurant(rawRest);

      // Flatten nested categories into the menu array the UI expects
      let flattenedMenu: FoodItem[] = [];
      if (rawRest.categories) {
        rawRest.categories.forEach((cat: any) => {
          if (cat.products) {
            const mappedItems = cat.products.map((p: any) => ({
              ...mapBackendMenuItem(p, rawRest.name, rawRest.location),
              categoryId: cat.id
            }));
            flattenedMenu = [...flattenedMenu, ...mappedItems];
          }
        });
      }

      mappedRest.menu = flattenedMenu;
      // Preserve category structure for UI tabs
      mappedRest.categories = rawRest.categories || [];

      set({ currentRestaurant: mappedRest, isLoading: false });
    } catch (error: any) {
      set({ error: "Failed to load restaurant details", isLoading: false, currentRestaurant: null });
    }
  },

  toggleRestaurantStatus: async (id: string, status: boolean) => {
    
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch(`/restaurants/${id}/status`, { isOpen: status });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: "Failed to update restaurant status", isLoading: false });
    }
  },

  clearCurrentRestaurant: () => set({ currentRestaurant: null, error: null }),
  clearError: () => set({ error: null }),
}));
