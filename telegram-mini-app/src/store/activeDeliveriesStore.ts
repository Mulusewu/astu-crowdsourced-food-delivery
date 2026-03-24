import { create } from "zustand";
import db from "@/data/database.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ActiveDelivery {
  id: string;
  orderNumber: string;
  status:
    | "assigned"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "cancelled"
    | "failed";
  priority: boolean;
  createdAt: string;
  estimatedDeliveryTime: string;
  timeRemaining: number;
  distance: string;
  restaurant: {
    id: string;
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    image: string;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    avatar?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: "cash" | "card" | "telegram_stars";
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

export const useActiveDeliveriesStore = create<ActiveDeliveriesState>(
  (set, get) => ({
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

      // Use real data from database.json (active orders that are assigned to delivery person)
      const deliveries =
        db.orders.active?.map((order: any) => ({
          ...order,
          timeRemaining: Math.floor(Math.random() * 40) + 10,
          restaurant: db.restaurants.find(
            (r: any) => r.id === order.cafeId,
          ) || {
            id: order.cafeId,
            name: order.cafeName,
            phone: "+251-911-123-456",
            address: "Bole Atlas",
            image: order.cafeImage,
          },
        })) || [];

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
            ? { ...delivery, status: newStatus as any }
            : delivery,
        ),
      }));
    },
  }),
);
