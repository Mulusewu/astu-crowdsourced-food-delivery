import { create } from "zustand";
import { db } from "@/data";
import { useAuthStore } from "@/store/auth/authStore";

export type OrderStatus = "placed" | "preparing" | "in_transit" | "delivered";

export interface Order {
  id: string;
  status: OrderStatus;
  estimatedDelivery: string;
  restaurant: string;
  // Backwards-compatible fields used by some pages
  restaurantName?: string;
  items: { name: string; qty: number }[];
  itemCount?: number;
  total: number;
  totalAmount?: number;
  date?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    avatar: string;
    rating: number;
  };
}

interface CustomerOrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  getOrderById: (id: string) => Order | undefined;
  setOrders: (orders: Order[]) => void;
  fetchOrders: () => Promise<void>;
}

const mapOrderStatus = (status: string): OrderStatus => {
  switch (status) {
    case "CREATED":
    case "AWAITING_ACCEPT":
    case "AWAITING_PAYMENT":
      return "placed";
    case "VENDOR_BEING_PREPARED":
    case "VENDOR_FINISHED":
    case "VENDOR_READY_FOR_PICKUP":
      return "preparing";
    case "PICKED_UP":
    case "EN_ROUTE":
    case "ARRIVED":
      return "in_transit";
    case "DELIVERED":
    case "COMPLETED":
      return "delivered";
    default:
      return "placed";
  }
};

const delay = (ms: number = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useCustomerOrderStore = create<CustomerOrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  // Find a specific order by ID (used by the Tracking Page)
  getOrderById: (id) => get().orders.find((o) => o.id === id),

  // Allow updating orders later
  setOrders: (orders) => set({ orders }),

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay();

      const authUser = useAuthStore.getState().user;
      const customerId =
        authUser?.id || db.users.find((u) => u.role === "CUSTOMER")?.id;

      const orders = db.orders
        .filter((o) => o.customerId === customerId)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .map((o) => {
          const restaurant =
            db.restaurants.find((r) => r.id === o.restaurantId) || null;
          const items = db.orderItems
            .filter((oi) => oi.orderId === o.id)
            .map((oi) => {
              const menu = db.menuItems.find((m) => m.id === oi.menuId) || null;
              return { name: menu?.name || "Item", qty: oi.quantity };
            });

          const delivererUser = o.delivererId
            ? db.users.find((u) => u.id === o.delivererId) || null
            : null;
          const delivererProfile = o.delivererId
            ? db.delivererProfiles.find((p) => p.userId === o.delivererId) || null
            : null;

          return {
            id: o.id,
            status: mapOrderStatus(o.status),
            estimatedDelivery: o.estimatedDeliveryTime || "Updating soon",
            restaurant: restaurant?.name || "Restaurant",
            restaurantName: restaurant?.name || "Restaurant",
            items,
            itemCount: items.reduce((sum, it) => sum + it.qty, 0),
            total: o.totalAmount,
            totalAmount: o.totalAmount,
            date: o.createdAt,
            deliveryPerson:
              delivererUser && delivererProfile && mapOrderStatus(o.status) === "in_transit"
                ? {
                    name: delivererUser.fullName,
                    phone: delivererUser.phoneNumber || "",
                    avatar: delivererUser.avatarUrl || "",
                    rating: delivererProfile.rating,
                  }
                : undefined,
          } as Order;
        });

      set({ orders, isLoading: false });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : "Failed to fetch orders",
      });
    }
  },
}));
