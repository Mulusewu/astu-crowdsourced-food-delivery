import { create } from "zustand";
import db from "@/data/database.json";

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

// Safe location parser
const parseLocation = (loc: any): string => {
  if (typeof loc === "string") return loc;
  if (loc && typeof loc === "object" && loc.area) return loc.area;
  return "Adama";
};

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

      const restaurants: Restaurant[] = (db.restaurants || []).map(
        (rest: any) => ({
          ...rest,
          description: rest.description || "A wonderful place to eat.",
          shortDescription: rest.shortDescription || "",
          cuisine: rest.cuisine || [],
          image:
            rest.image ||
            rest.coverImage ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
          coverImage: rest.coverImage || "",
          logo: rest.logo || "",
          rating: Number(rest.rating) || 4.0,
          totalReviews: Number(rest.totalReviews) || Number(rest.reviews) || 0,
          reviews: Number(rest.totalReviews) || Number(rest.reviews) || 0,
          priceLevel: rest.priceLevel || "$$",
          deliveryTime: rest.deliveryTime || "15-25 min",
          avgDeliveryTime: rest.estimatedDeliveryTime?.max || 25,
          deliveryFee: Number(rest.deliveryFee) || 0,
          minimumOrder: Number(rest.minimumOrder) || 0,
          freeDeliveryThreshold: Number(rest.freeDeliveryThreshold) || 0,
          isOpen: rest.isOpen !== false,
          location: parseLocation(rest.location),
          contact: rest.contact || { phone: "", email: "" },
          hours: rest.hours || {},
          features: rest.features || {
            acceptsCash: true,
            acceptsCard: false,
            acceptsTelegramStars: false,
            hasDelivery: true,
            hasPickup: false,
            hasDineIn: false,
          },
          categories: rest.categories || [],
          offers: rest.offers || [],
          deliveryZones: rest.deliveryZones || [],
          estimatedDeliveryTime: rest.estimatedDeliveryTime || {
            min: 15,
            max: 25,
          },
          popularityScore: rest.popularityScore || 0,
          isFeatured: rest.isFeatured || false,
          menu: [],
        }),
      );

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

      // Safety check: if popularFoods doesn't exist, return empty array instead of crashing
      const popularRefs = Array.isArray(db.popularFoods) ? db.popularFoods : [];

      const popularFoods: FoodItem[] = popularRefs
        .map((ref: any) => {
          let product: any = null;

          // Hunt for the product in db.menu depending on how it's structured
          if (db.menu && !Array.isArray(db.menu)) {
            const restMenu = (db.menu as any)[ref.restaurantId] || [];
            product = restMenu.find((item: any) => item.id === ref.id);
          } else if (Array.isArray(db.menu)) {
            product = db.menu.find((item: any) => item.id === ref.id);
          }

          if (!product) return null;

          return {
            id: product.id,
            name: product.name,
            restaurant: ref.restaurant,
            restaurantId: ref.restaurantId,
            location: parseLocation(ref.location),
            price: Number(product.price) || 0,
            rating: Number(product.rating) || 4.0,
            image: product.image || product.imageUrl || "",
            imageUrl: product.imageUrl || product.image || "",
            description: product.description || "",
          };
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

      const restBase = ((db.restaurants as any[]) || []).find(
        (r) => r.id === id,
      );

      if (!restBase) {
        set({
          error: "Restaurant not found",
          isLoading: false,
          currentRestaurant: null,
        });
        return;
      }

      // ROBUST MENU FETCHING: Checks 3 different possible JSON structures
      let rawMenu: any[] = [];
      if (Array.isArray(restBase.menu)) {
        rawMenu = restBase.menu; // Nested inside restaurant
      } else if (db.menu && !Array.isArray(db.menu)) {
        rawMenu = (db.menu as any)[id] || []; // Dictionary keyed by ID
      } else if (Array.isArray(db.menu)) {
        rawMenu = db.menu.filter((m: any) => m.restaurantId === id); // Flat array
      }

      const menuItems: FoodItem[] = rawMenu.map((item) => ({
        id: item.id,
        name: item.name || "Menu Item",
        restaurant: restBase.name,
        restaurantId: restBase.id,
        location: parseLocation(restBase.location),
        price: Number(item.price) || 0,
        rating: Number(item.rating) || 4.0,
        image:
          item.image ||
          item.imageUrl ||
          "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&fit=crop",
        imageUrl:
          item.imageUrl ||
          item.image ||
          "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&fit=crop",
        description:
          item.description || "Delicious special from " + restBase.name,
      }));

      const fullRestaurant: Restaurant = {
        ...restBase,
        description:
          restBase.description || "A wonderful place to eat in Adama.",
        image:
          restBase.image ||
          restBase.coverImage ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
        rating: Number(restBase.rating) || 4.0,
        reviews: Number(restBase.totalReviews) || Number(restBase.reviews) || 0,
        avgDeliveryTime: restBase.estimatedDeliveryTime?.max || 25,
        location: parseLocation(restBase.location),
        menu: menuItems,
      } as Restaurant;

      set({ currentRestaurant: fullRestaurant, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load restaurant details", isLoading: false });
    }
  },

  clearCurrentRestaurant: () => set({ currentRestaurant: null, error: null }),
  clearError: () => set({ error: null }),
}));
