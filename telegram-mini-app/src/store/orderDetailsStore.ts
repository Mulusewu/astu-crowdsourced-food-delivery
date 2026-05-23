import { create } from "zustand";
import db from "@/data/database.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface OrderItemDisplay {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  shortId: string;
  restaurantName: string;
  deliveryAddress: string;
  items: OrderItemDisplay[];
  subtotal: number;
  deliveryFee: number;
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

const menuItemMap = new Map(db.menuItems.map((m) => [m.id, m]));
const restaurantMap = new Map(db.restaurants.map((r) => [r.id, r]));

export const useOrderDetailsStore = create<OrderDetailsState>((set) => ({
  order: null,
  isLoading: true,
  isAccepting: false,

  fetchOrderDetails: async (orderId: string) => {
    set({ isLoading: true });
    await delay(650);

    const found = db.orders.find((o) => o.id === orderId);

    if (found) {
      const orderItems = db.orderItems.filter((i) => i.orderId === orderId);
      const items: OrderItemDisplay[] = orderItems.map((i) => ({
        id: i.id,
        name: menuItemMap.get(i.menuId)?.name ?? "Item",
        quantity: i.quantity,
        price: Number(i.unitPrice),
      }));
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const restaurant = restaurantMap.get(found.restaurantId);

      set({
        order: {
          id: found.id,
          shortId: found.shortId,
          restaurantName: restaurant?.name ?? "Restaurant",
          deliveryAddress: found.pickupLat != null ? `${found.pickupLat}, ${found.pickupLng}` : "Campus",
          items,
          subtotal,
          deliveryFee: Number(found.deliveryFee),
          estimatedDeliveryTime: found.estimatedDeliveryTime ?? "30 Min",
          status: found.status,
          totalAmount: Number(found.totalAmount),
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
    set({ isAccepting: false });
  },

  declineOrder: async () => {
    await delay(400);
  },
}));
