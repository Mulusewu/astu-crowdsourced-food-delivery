import type { Users } from "./user";
import type { Restaurant } from "./restaurant";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  cafeId: string;
  cafeName: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "in_transit" | "delivered";
  createdAt: string;
}

export interface Database {
  version: string;
  timestamp: string;
  currency: "Birr";
  baseDeliveryFee: number;
  users: Users;
  restaurants: Restaurant[];
  menu: Record<string, any[]>; // maps restaurantId to food array
  orders: {
    available: Order[];
    active: Order[];
    history: Order[];
  };
  popularFoods: {
    id: string;
    restaurant: string;
    location: string;
  }[];
}
