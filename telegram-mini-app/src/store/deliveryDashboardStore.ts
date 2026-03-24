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
      isLoading: true,
      isOnline: true,

      fetchDashboardData: async () => {
        set({ isLoading: true });

        try {
          await delay(650); // Simulate realistic network delay

          // Get delivery person (first one for now - you can enhance with auth later)
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

          // Get restaurants with orders from dedicated section (preferred)
          let restaurantsWithOrders =
            db.deliveryDashboard?.restaurantsWithOrders;

          // Fallback: derive from restaurants that have active orders
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

          set({
            deliveryPerson,
            restaurantsWithOrders,
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

        // TODO: Later → call real API to update delivery person status
      },
    }),

    {
      name: "delivery-dashboard-storage",
      partialize: (state) => ({
        isOnline: state.isOnline,
        // You can add more fields here if needed (e.g., preferred filters)
      }),
    },
  ),
);
