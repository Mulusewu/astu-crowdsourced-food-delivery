export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; // Birr values
  imageUrl: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
  instructions?: string; // Derived from 'Modification' input
}

export type Role = "customer" | "delivery" | "vendor";

export interface User {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  role: Role;
}
