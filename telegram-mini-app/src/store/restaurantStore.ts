import { create } from "zustand";
import db from "@/data/database.json";

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
  features: {
    acceptsCash: boolean;
    acceptsCard: boolean;
    acceptsTelegramStars: boolean;
    hasDelivery: boolean;
    hasPickup: boolean;
    hasDineIn: boolean;
  };
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

  fetchRestaurants: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);

      let rawRestaurants = [...(db.restaurants as any[] || [])];

      // Apply Filters
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        rawRestaurants = rawRestaurants.filter(r => 
          r.name.toLowerCase().includes(query) || 
          r.location.toLowerCase().includes(query) ||
          r.tags?.some((t: string) => t.toLowerCase().includes(query))
        );
      }

      if (filters?.location && filters.location !== "Any") {
        const loc = filters.location.replace(" Gate", "").toLowerCase();
        rawRestaurants = rawRestaurants.filter(r => 
          r.location.toLowerCase().includes(loc)
        );
      }

      // Apply Sorting
      if (filters?.sortBy === "Rating") {
        rawRestaurants.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
      } else if (filters?.sortBy === "Newest To Oldest") {
        // Fallback to ID sorting if createdAt doesn't exist
        rawRestaurants.sort((a, b) => b.id.localeCompare(a.id));
      } else if (filters?.sortBy === "Oldest To Newest") {
        rawRestaurants.sort((a, b) => a.id.localeCompare(b.id));
      }

      const restaurants: Restaurant[] = rawRestaurants.map(
        (rest: any) => ({
          ...rest,
          description: rest.description || "A wonderful place to eat.",
          shortDescription: rest.shortDescription || "",
          cuisine: rest.tags || rest.cuisine || [],
          image:
            rest.imageUrl ||
            rest.image ||
            rest.coverImage ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
          coverImage: rest.coverImage || rest.imageUrl || "",
          logo: rest.logo || "",
          rating: Number(rest.avgRating) || Number(rest.rating) || 4.0,
          totalReviews: Number(rest.totalReviews) || 0,
          priceLevel: rest.priceLevel || "$$",
          deliveryTime: rest.deliveryTime || "15-25 min",
          deliveryFee: Number(rest.deliveryFee) || 0,
          minimumOrder: Number(rest.minOrderValue) || Number(rest.minimumOrder) || 0,
          freeDeliveryThreshold: Number(rest.freeDeliveryThreshold) || 0,
          isOpen: rest.isOpen !== false,
          location: parseLocation(rest.location),
          contact: {
            phone: rest.phone || rest.contact?.phone || "",
            email: rest.email || rest.contact?.email || "",
            website: rest.website || rest.contact?.website || "",
          },
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

  fetchPopularFoods: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      await delay(400);

      let rawFoods = [...(db.menuItems as any[])].filter((item) => item.isAvailable);

      // Apply Filters
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        rawFoods = rawFoods.filter(f => 
          f.name.toLowerCase().includes(query) || 
          f.description?.toLowerCase().includes(query)
        );
      }

      if (filters?.location && filters.location !== "Any") {
        const loc = filters.location.replace(" Gate", "").toLowerCase();
        rawFoods = rawFoods.filter(f => {
          const rest = db.restaurants.find(r => r.id === f.restaurantId);
          return (rest as any)?.location.toLowerCase().includes(loc);
        });
      }

      if (filters?.priceRange && filters.priceRange !== "Any") {
        const [minStr, maxStr] = filters.priceRange.split("-");
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        rawFoods = rawFoods.filter(f => f.price >= min && f.price <= max);
      }

      const popularFoods: FoodItem[] = rawFoods
        .slice(0, 20)
        .map((item) => {
          const rest = db.restaurants.find((r) => r.id === item.restaurantId) as any;
          return {
            id: item.id,
            name: item.name,
            restaurant: rest?.name ?? "Restaurant",
            restaurantId: item.restaurantId,
            location: parseLocation(rest?.location),
            price: Number(item.price) || 0,
            rating: Number(item.rating) || Number(rest?.avgRating) || 4.0,
            image: item.imageUrl || item.image || "",
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
        rawMenu = (db.menuItems as any[]).filter((m) => m.restaurantId === id);
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
        cuisine: restBase.tags || restBase.cuisine || [],
        image:
          restBase.imageUrl ||
          restBase.image ||
          restBase.coverImage ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&fit=crop",
        rating: Number(restBase.avgRating) || Number(restBase.rating) || 4.0,
        totalReviews: Number(restBase.totalReviews) || 0,
        minimumOrder: Number(restBase.minOrderValue) || Number(restBase.minimumOrder) || 0,
        location: parseLocation(restBase.location),
        contact: {
          phone: restBase.phone || restBase.contact?.phone || "",
          email: restBase.email || restBase.contact?.email || "",
          website: restBase.website || restBase.contact?.website || "",
        },
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
