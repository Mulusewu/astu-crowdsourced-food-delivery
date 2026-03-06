export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  DELIVERY = "delivery",
  ADMIN = "admin",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  // Customer specific
  defaultAddress?: Address;
  savedAddresses?: Address[];
  // Vendor specific
  restaurantId?: string;
  // Delivery specific
  vehicleType?: string;
  isAvailable?: boolean;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  label?: string; // 'home', 'work', etc.
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
