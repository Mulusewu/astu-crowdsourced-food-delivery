// src/store/delivery/deliveryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface RestaurantWithOrders {
  id: string;
  name: string;
  image: string;
  orderCount: number;
  location: string;
  distance: string;
}

interface PocketFriendlyOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  distance: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    image?: string;
  }>;
  image?: string; // Main food image for the card
}

interface DeliveryPerson {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  isActive: boolean;
  status: string;
  stats?: {
    todayDeliveries: number;
    todayEarnings: number;
    rating: number;
  };
}

interface DeliveryDashboardState {
  deliveryPerson: DeliveryPerson | null;
  restaurantsWithOrders: RestaurantWithOrders[];
  pocketFriendlyOrders: PocketFriendlyOrder[]; // ← Added
  isLoading: boolean;
  isOnline: boolean;

  // Actions
  fetchDashboardData: () => Promise<void>;
  toggleAvailability: () => void;
}

export const useDeliveryDashboardStore = create<DeliveryDashboardState>()(
  persist(
    (set, get) => ({
      deliveryPerson: null,
      restaurantsWithOrders: [],
      pocketFriendlyOrders: [], // ← New field
      isLoading: true,
      isOnline: true,

      fetchDashboardData: async () => {
        set({ isLoading: true });

        try {
          await delay(650);

          // Delivery Person
          const personData = db.users.delivery?.[0];
          const deliveryPerson: DeliveryPerson = personData
            ? {
                id: personData.id,
                name: personData.name,
                avatar: personData.avatar,
                isOnline: personData.isActive ?? true,
                isActive: personData.isActive ?? true,
                status: personData.status || "available",
                stats: personData.stats,
              }
            : {
                id: "del_001",
                name: "Biruk Wondimu",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Biruk",
                isOnline: true,
                isActive: true,
                status: "available",
              };

          // Restaurants with active orders
          let restaurantsWithOrders =
            db.deliveryDashboard?.restaurantsWithOrders;

          if (!restaurantsWithOrders || restaurantsWithOrders.length === 0) {
            restaurantsWithOrders =
              db.restaurants
                ?.filter((r: any) => r.orderCount && r.orderCount > 0)
                .map((r: any) => ({
                  id: r.id,
                  name: r.name,
                  image: r.image || r.coverImage,
                  orderCount: r.orderCount || Math.floor(Math.random() * 8) + 2,
                  location: r.location?.address || "Bole",
                  distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
                })) || [];
          }

          // Pocket Friendly Orders - Quick horizontal orders (from available orders)
          const pocketFriendlyOrders: PocketFriendlyOrder[] =
            db.orders?.available
              ?.slice(0, 6) // Take first 6 for horizontal scroll
              .map((order: any) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                distance: order.distance,
                items: order.items,
                image: order.items[0]?.image || order.cafeImage,
              })) || [];

          set({
            deliveryPerson,
            restaurantsWithOrders,
            pocketFriendlyOrders, // ← Added
            isLoading: false,
            isOnline: deliveryPerson.isOnline,
          });
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          set({ isLoading: false });
        }
      },

      toggleAvailability: () => {
        const currentOnline = get().isOnline;

        set((state) => ({
          isOnline: !currentOnline,
          deliveryPerson: state.deliveryPerson
            ? { ...state.deliveryPerson, isOnline: !currentOnline }
            : null,
        }));
      },
    }),

    {
      name: "delivery-dashboard-storage",
      partialize: (state) => ({
        isOnline: state.isOnline,
      }),
    },
  ),
);
