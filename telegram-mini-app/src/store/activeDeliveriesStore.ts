import { create } from "zustand";
import { db } from "@/data";

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

      const deliveries = db.orders
        .filter(
          (order) =>
            Boolean(order.delivererId) &&
            ["ASSIGNED", "PICKED_UP", "EN_ROUTE", "ARRIVED"].includes(
              order.status,
            ),
        )
        .map((order) => {
          const restaurant =
            db.restaurants.find((r) => r.id === order.restaurantId) || null;
          const customer =
            db.users.find((u) => u.id === order.customerId) || null;

          const items = db.orderItems
            .filter((oi) => oi.orderId === order.id)
            .map((oi) => {
              const menu = db.menuItems.find((m) => m.id === oi.menuId) || null;
              return {
                id: oi.id,
                name: menu?.name || "Item",
                quantity: oi.quantity,
                price: oi.unitPrice,
                image: menu?.imageUrl || undefined,
              };
            });

          const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );

          const uiStatus: ActiveDelivery["status"] =
            order.status === "ASSIGNED"
              ? "assigned"
              : order.status === "PICKED_UP"
                ? "picked_up"
                : order.status === "EN_ROUTE" || order.status === "ARRIVED"
                  ? "in_transit"
                  : "assigned";

          return {
            id: order.id,
            orderNumber: order.shortId,
            status: uiStatus,
            priority: false,
            createdAt: order.createdAt,
            estimatedDeliveryTime: order.estimatedDeliveryTime || "—",
            timeRemaining: Math.floor(Math.random() * 40) + 10,
            distance: "—",
            restaurant: {
              id: restaurant?.id || order.restaurantId,
              name: restaurant?.name || "Restaurant",
              phone: restaurant?.phone || "",
              address: restaurant?.location || "",
              image: restaurant?.imageUrl || "",
            },
            customer: {
              id: customer?.id || order.customerId,
              name: customer?.fullName || "Customer",
              phone: customer?.phoneNumber || "",
              address:
                db.customerProfiles.find((p) => p.userId === order.customerId)
                  ?.defaultLocation || "",
              avatar: customer?.avatarUrl || undefined,
            },
            items,
            subtotal,
            deliveryFee: order.deliveryFee,
            totalAmount: order.totalAmount,
            paymentMethod: "cash",
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
            ? { ...delivery, status: newStatus as any }
            : delivery,
        ),
      }));
    },
  }),
);
