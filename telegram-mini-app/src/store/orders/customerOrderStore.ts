import { create } from "zustand";
import db from "@/data/database.json"; // Import your JSON database
import deliveryDb from "@/data/users/delivery.json";

export type OrderStatus = "placed" | "preparing" | "in_transit" | "delivered";

export interface Order {
  id: string;
  status: OrderStatus;
  estimatedDelivery: string;
  restaurant: string;
  items: { name: string; qty: number }[];
  total: number;
  deliveryPerson?: {
    name: string;
    phone: string;
    avatar: string;
    rating: number;
  };
}

interface CustomerOrderState {
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  setOrders: (orders: Order[]) => void;
}

interface DbOrderItem {
  name: string;
  quantity: number;
}

interface DbOrder {
  id: string;
  status: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  cafeName: string;
  items: DbOrderItem[];
  totalAmount: number;
}

interface DeliveryPersonRecord {
  name: string;
  phone: string;
  avatar: string;
  stats?: {
    averageRating?: number;
  };
}

const firstDeliveryPerson = deliveryDb.delivery[0] as
  | DeliveryPersonRecord
  | undefined;

const mapOrderStatus = (status: string): OrderStatus => {
  switch (status) {
    case "pending":
      return "placed";
    case "preparing":
      return "preparing";
    case "in_transit":
      return "in_transit";
    case "delivered":
      return "delivered";
    default:
      return "placed";
  }
};

const assignedDeliveryPerson = firstDeliveryPerson
  ? {
      name: firstDeliveryPerson.name,
      phone: firstDeliveryPerson.phone,
      avatar: firstDeliveryPerson.avatar,
      rating: firstDeliveryPerson.stats?.averageRating ?? 4.8,
    }
  : undefined;

const rawOrders = [
  ...(db.orders?.available || []),
  ...(db.orders?.active || []),
  ...(db.orders?.history || []),
] as DbOrder[];

const dbOrders: Order[] = rawOrders.map((order) => ({
  id: order.id,
  status: mapOrderStatus(order.status),
  estimatedDelivery:
    order.estimatedDeliveryTime || order.deliveredAt || "Updating soon",
  restaurant: order.cafeName,
  items: order.items.map((item) => ({
    name: item.name,
    qty: item.quantity,
  })),
  total: order.totalAmount,
  deliveryPerson:
    order.status === "in_transit" ? assignedDeliveryPerson : undefined,
}));

export const useCustomerOrderStore = create<CustomerOrderState>((set, get) => ({
  // Set the initial state using the data from database.json
  orders: dbOrders,

  // Find a specific order by ID (used by the Tracking Page)
  getOrderById: (id) => get().orders.find((o) => o.id === id),

  // Allow updating orders later
  setOrders: (orders) => set({ orders }),
}));
