import { create } from "zustand";
import { db } from "@/data";

export interface FoodItem {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  imageUrl: string;
  description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  cuisine: string[];
  image: string;
  coverImage: string;
  logo: string;
  rating: number;
  totalReviews: number;
  priceLevel: string;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  freeDeliveryThreshold: number;
  isOpen: boolean;
  location: string;
  contact: {
    phone: string;
    website?: string;
    email: string;
  };
  hours: Record<string, string>;
  features: {
    acceptsCash: boolean;
    acceptsCard: boolean;
    acceptsTelegramStars: boolean;
    hasDelivery: boolean;
    hasPickup: boolean;
    hasDineIn: boolean;
  };
  categories: Array<any>;
  offers: Array<any>;
  deliveryZones: string[];
  estimatedDeliveryTime: {
    min: number;
    max: number;
  };
  popularityScore: number;
  isFeatured: boolean;

  // UI Specifics
  reviews: number;
  avgDeliveryTime: number;
  menu: FoodItem[];
}

interface RestaurantState {
  restaurants: Restaurant[];
  popularFoods: FoodItem[];
  currentRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;

  fetchRestaurants: () => Promise<void>;
  fetchPopularFoods: () => Promise<void>;
  fetchRestaurantDetails: (id: string) => Promise<void>;
  clearCurrentRestaurant: () => void;
  clearError: () => void;
}

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const FALLBACK_REST_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop";
const FALLBACK_MENU_IMAGE =
  "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80&w=200&auto=format&fit=crop";

const priceLevelFromMin = (minOrderValue: number): string => {
  if (minOrderValue >= 200) return "$$$";
  if (minOrderValue >= 80) return "$$";
  return "$";
};

const toUiRestaurant = (rest: (typeof db.restaurants)[number]): Restaurant => ({
  id: rest.id,
  name: rest.name,
  description: "A wonderful place to eat.",
  shortDescription: "",
  cuisine: rest.tags || [],
  image: rest.imageUrl || FALLBACK_REST_IMAGE,
  coverImage: rest.imageUrl || "",
  logo: "",
  rating: Number(rest.avgRating) || 4.5,
  totalReviews: Number(rest.totalReviews) || 0,
  reviews: Number(rest.totalReviews) || 0,
  priceLevel: priceLevelFromMin(Number(rest.minOrderValue) || 0),
  deliveryTime: "15-25 min",
  avgDeliveryTime: 25,
  deliveryFee: 0,
  minimumOrder: Number(rest.minOrderValue) || 0,
  freeDeliveryThreshold: 0,
  isOpen: rest.isOpen !== false,
  location: rest.location || "Adama",
  contact: { phone: rest.phone, email: rest.phone },
  hours: {},
  features: {
    acceptsCash: true,
    acceptsCard: false,
    acceptsTelegramStars: false,
    hasDelivery: true,
    hasPickup: false,
    hasDineIn: false,
  },
  categories: db.categories.filter((c) => c.restaurantId === rest.id),
  offers: [],
  deliveryZones: [],
  estimatedDeliveryTime: { min: 15, max: 25 },
  popularityScore: 0,
  isFeatured: false,
  menu: [],
});

const toUiFoodItem = (
  menu: (typeof db.menuItems)[number],
  restaurant: (typeof db.restaurants)[number],
): FoodItem => ({
  id: menu.id,
  name: menu.name,
  restaurant: restaurant.name,
  restaurantId: restaurant.id,
  location: restaurant.location || "Adama",
  price: Number(menu.price) || 0,
  rating: Number(restaurant.avgRating) || 4.5,
  image: menu.imageUrl || FALLBACK_MENU_IMAGE,
  imageUrl: menu.imageUrl || FALLBACK_MENU_IMAGE,
  description: menu.description || "",
});

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  popularFoods: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,

  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);

      const restaurants: Restaurant[] = (db.restaurants || []).map(toUiRestaurant);

      set({ restaurants, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load",
        isLoading: false,
      });
    }
  },

  fetchPopularFoods: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);

      // Prisma dataset doesn't include popularFoods. Derive a reasonable list from menuItems.
      const popularFoods: FoodItem[] = db.menuItems
        .slice(0, 10)
        .map((m) => {
          const rest = db.restaurants.find((r) => r.id === m.restaurantId);
          if (!rest) return null;
          return toUiFoodItem(m, rest);
        })
        .filter(Boolean) as FoodItem[];

      set({ popularFoods, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load popular foods", isLoading: false });
    }
  },

  fetchRestaurantDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);

      const restBase = (db.restaurants || []).find((r) => r.id === id);

      if (!restBase) {
        set({
          error: "Restaurant not found",
          isLoading: false,
          currentRestaurant: null,
        });
        return;
      }

      const base = toUiRestaurant(restBase);
      const menuItems: FoodItem[] = db.menuItems
        .filter((m) => m.restaurantId === id && m.isArchived !== true)
        .map((m) => toUiFoodItem(m, restBase));

      const fullRestaurant: Restaurant = {
        ...base,
        menu: menuItems,
      };

      set({ currentRestaurant: fullRestaurant, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load restaurant details", isLoading: false });
    }
  },

  clearCurrentRestaurant: () => set({ currentRestaurant: null, error: null }),
  clearError: () => set({ error: null }),
}));
