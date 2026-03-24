import { create } from "zustand";
import db from "@/data/database.json";

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
  status: string;
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

export const useOrderDetailsStore = create<OrderDetailsState>((set, get) => ({
  order: null,
  isLoading: true,
  isAccepting: false,

  fetchOrderDetails: async (orderId: string) => {
    set({ isLoading: true });

    await delay(650);

    const found = db.orders.available.find((o: any) => o.id === orderId);

    if (found) {
      const subtotal = found.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );

      set({
        order: {
          id: found.id,
          orderNumber: found.orderNumber,
          cafeName: found.cafeName,
          customer: found.customer,
          items: found.items,
          subtotal,
          deliveryFee: 50,
          distance: found.distance,
          estimatedDeliveryTime: "30 Min",
          status: found.status,
          totalAmount: found.totalAmount,
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
    set({ isAccepting: false });
    // navigate to active deliveries (handled in component)
  },

  declineOrder: async () => {
    await delay(400);
    console.log("Order declined");
    // TODO: later → real API + reason dialog
  },
}));
