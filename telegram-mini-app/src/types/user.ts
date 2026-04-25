import { type Address, type Stats } from "./common";

export type PaymentMethod =
  | {
      id: string;
      type: "card";
      last4: string;
      brand: string;
      expiry: string;
      isDefault: boolean;
    }
  | { id: string; type: "cash"; isDefault: boolean }
  | { id: string; type: "telegram_stars"; balance: number; isDefault: boolean }
  | { id: string; type: "telebirr"; phone: string; isDefault: boolean };

export interface Preferences {
  language: "am" | "en";
  theme: "light" | "dark";
  defaultSortBy: "rating" | "distance" | "price";
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  roles: string[];
  activeRole: string;
  createdAt: string;
  isVerified: boolean;
  defaultAddress: Address;
  savedAddresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: Preferences;
  stats: Stats;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  restaurantId: string;
  activeRole: "vendor";
  stats: Stats;
}

export interface Delivery {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  status: "available" | "busy" | "offline";
  vehicle?: {
    type: string;
    plateNumber: string;
    model: string;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  stats: Stats;
}

export interface Users {
  customers: Customer[];
  vendors: Vendor[];
  delivery: Delivery[];
  multiRole: Customer[];
}
