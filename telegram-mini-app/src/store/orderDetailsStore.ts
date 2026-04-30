import { create } from "zustand";
import { db } from "@/data";
import type { Order as SchemaOrder } from "@/types/prisma";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  cafeName: string;
  customer: { address: string };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  distance: string;
  estimatedDeliveryTime: string;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
}

interface OrderDetailsState {
  order: OrderDetails | null;
  isLoading: boolean;
  isAccepting: boolean;

  fetchOrderDetails: (orderId: string) => Promise<void>;
  acceptOrder: () => Promise<void>;
  declineOrder: () => Promise<void>;
}

const mapSchemaToUiStatus = (status: SchemaOrder["status"]): OrderDetails["status"] => {
  switch (status) {
    case "CREATED":
    case "AWAITING_ACCEPT":
      return "pending";
    case "ASSIGNED":
      return "confirmed";
    case "CANCELLED":
    case "NO_DELIVERER_FOUND":
      return "cancelled";
    default:
      // For detail page “accept”, we only need to know if it’s still accept-able.
      return "confirmed";
  }
};

export const useOrderDetailsStore = create<OrderDetailsState>((set, get) => ({
  order: null,
  isLoading: true,
  isAccepting: false,

  fetchOrderDetails: async (orderId: string) => {
    set({ isLoading: true });

    await delay(650);

    const foundOrder = db.orders.find((o) => o.id === orderId);

    if (foundOrder) {
      const restaurant =
        db.restaurants.find((r) => r.id === foundOrder.restaurantId) || null;
      const customer =
        db.users.find((u) => u.id === foundOrder.customerId) || null;

      const items = db.orderItems
        .filter((oi) => oi.orderId === foundOrder.id)
        .map((oi) => {
          const menu = db.menuItems.find((m) => m.id === oi.menuId) || null;
          return {
            id: oi.id,
            name: menu?.name || "Item",
            quantity: oi.quantity,
            price: oi.unitPrice,
            image: menu?.imageUrl || "",
          };
        });

      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      set({
        order: {
          id: foundOrder.id,
          orderNumber: foundOrder.shortId,
          cafeName: restaurant?.name || "Restaurant",
          customer: { address: customer?.phoneNumber || "" },
          items,
          subtotal,
          deliveryFee: foundOrder.deliveryFee,
          distance: "—",
          estimatedDeliveryTime: "30 Min",
          status: mapSchemaToUiStatus(foundOrder.status),
          totalAmount: foundOrder.totalAmount,
        },
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  acceptOrder: async () => {
    set({ isAccepting: true });
    await delay(800);
    // TODO: later → real API call
    console.log("Order accepted");
    set((state) => ({
      isAccepting: false,
      order: state.order ? { ...state.order, status: "confirmed" } : state.order,
    }));
    // navigate to active deliveries (handled in component)
  },

  declineOrder: async () => {
    await delay(400);
    console.log("Order declined");
    set((state) => ({
      order: state.order ? { ...state.order, status: "cancelled" } : state.order,
    }));
    // TODO: later → real API + reason dialog
  },
}));
