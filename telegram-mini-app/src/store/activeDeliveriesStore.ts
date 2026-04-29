import { create } from "zustand";
import db from "@/data/database.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ActiveDelivery {
  id: string;
  shortId: string;
  status: string;
  priority: boolean;
  createdAt: string;
  estimatedDeliveryTime: string;
  timeRemaining: number;
  restaurant: {
    id: string;
    name: string;
    phone: string;
    address: string;
    image: string | null;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
  totalAmount: number;
}

interface ActiveDeliveriesState {
  activeDeliveries: ActiveDelivery[];
  stats: {
    activeDeliveries: number;
    completedToday: number;
    earningsToday: number;
    averageTime: number;
    rating: number;
  };
  isLoading: boolean;
  refreshing: boolean;

  fetchActiveDeliveries: () => Promise<void>;
  updateDeliveryStatus: (deliveryId: string, newStatus: string) => void;
}

const ACTIVE_STATUSES = new Set(["ASSIGNED", "PICKED_UP", "EN_ROUTE", "ARRIVED"]);

export const useActiveDeliveriesStore = create<ActiveDeliveriesState>(
  (set) => ({
    activeDeliveries: [],
    stats: {
      activeDeliveries: 0,
      completedToday: 0,
      earningsToday: 0,
      averageTime: 0,
      rating: 4.8,
    },
    isLoading: true,
    refreshing: false,

    fetchActiveDeliveries: async () => {
      set({ isLoading: true });
      await delay(650);

      const activeOrders = db.orders.filter((o) => ACTIVE_STATUSES.has(o.status));

      const deliveries: ActiveDelivery[] = activeOrders.map((order) => {
        const restaurant = db.restaurants.find((r) => r.id === order.restaurantId);
        const customer = db.users.find((u) => u.id === order.customerId);
        return {
          id: order.id,
          shortId: order.shortId,
          status: order.status,
          priority: false,
          createdAt: order.createdAt,
          estimatedDeliveryTime: order.estimatedDeliveryTime ?? "TBD",
          timeRemaining: Math.floor(Math.random() * 40) + 10,
          restaurant: {
            id: restaurant?.id ?? order.restaurantId,
            name: restaurant?.name ?? "Restaurant",
            phone: restaurant?.phone ?? "",
            address: restaurant?.location ?? "",
            image: restaurant?.imageUrl ?? null,
          },
          customer: {
            id: customer?.id ?? order.customerId,
            name: customer?.fullName ?? "Customer",
            phone: customer?.phoneNumber ?? "",
            address: "Campus",
          },
          totalAmount: order.totalAmount,
        };
      });

      set({
        activeDeliveries: deliveries,
        stats: {
          activeDeliveries: deliveries.length,
          completedToday: 8,
          earningsToday: 850,
          averageTime: 24,
          rating: 4.8,
        },
        isLoading: false,
      });
    },

    updateDeliveryStatus: (deliveryId: string, newStatus: string) => {
      set((state) => ({
        activeDeliveries: state.activeDeliveries.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, status: newStatus }
            : delivery,
        ),
      }));
    },
  }),
);
