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
  // Prisma MenuItem fields
  categoryId?: string;
  isFasting?: boolean;
  prepTimeMins?: number;
  isAvailable?: boolean;
  availabilityReason?: string | null;
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

      const popularFoods: FoodItem[] = db.menuItems
        .filter((item) => item.isAvailable)
        .slice(0, 20)
        .map((item) => {
          const rest = db.restaurants.find((r) => r.id === item.restaurantId);
          return {
            id: item.id,
            name: item.name,
            restaurant: rest?.name ?? "Restaurant",
            restaurantId: item.restaurantId,
            location: parseLocation(rest?.location),
            price: Number(item.price) || 0,
            rating: Number(rest?.avgRating) || 4.0,
            image: item.imageUrl || "",
            imageUrl: item.imageUrl || "",
            description: item.description || "",
            categoryId: item.categoryId,
            isFasting: item.isFasting ?? false,
            prepTimeMins: item.prepTimeMins ?? 15,
            isAvailable: item.isAvailable ?? true,
            availabilityReason: item.availabilityReason ?? null,
          };
        });

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

      // Fetch menu items from flat db.menuItems array (Prisma-aligned)
      let rawMenu: any[] = [];
      if (Array.isArray(restBase.menu)) {
        rawMenu = restBase.menu; // Nested inside restaurant (legacy)
      } else {
        rawMenu = db.menuItems.filter((m) => m.restaurantId === id);
      }

      const menuItems: FoodItem[] = rawMenu.map((item) => ({
        id: item.id,
        name: item.name || "Menu Item",
        restaurant: restBase.name,
        restaurantId: restBase.id,
        location: parseLocation(restBase.location),
        price: Number(item.price) || 0,
        rating: Number(item.rating) || Number(restBase.avgRating) || 4.0,
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
        categoryId: item.categoryId,
        isFasting: item.isFasting ?? false,
        prepTimeMins: item.prepTimeMins ?? 15,
        isAvailable: item.isAvailable ?? true,
        availabilityReason: item.availabilityReason ?? null,
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
