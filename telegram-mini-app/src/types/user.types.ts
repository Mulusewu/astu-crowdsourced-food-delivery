// src/types/user.types.ts

// Use union type for better compatibility with TypeScript's erasableSyntaxOnly
export type UserRole = "customer" | "vendor" | "delivery" | "admin";

// Role constants for type-safe usage
export const UserRoles = {
  CUSTOMER: "customer" as const,
  VENDOR: "vendor" as const,
  DELIVERY: "delivery" as const,
  ADMIN: "admin" as const,
} as const;

// Helper to get all roles as array
export const ALL_ROLES: UserRole[] = ["customer", "vendor", "delivery", "admin"];

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];           // Supports multiple roles
  activeRole?: UserRole;       // Current active role for this session
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
  businessName?: string;

  // Delivery specific
  vehicleType?: string;
  isAvailable?: boolean;
  vehiclePlate?: string;
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
  roles: UserRole[];           // All roles the user has
  activeRole: UserRole | null; // Currently active role
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Helper type for role checks
export type RoleCheck = {
  isCustomer: boolean;
  isVendor: boolean;
  isDelivery: boolean;
  isAdmin: boolean;
};

// Helper function to check if user has a specific role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.roles?.includes(role) ?? false;
};

// Helper function to get role check object
export const getRoleCheck = (user: User | null): RoleCheck => ({
  isCustomer: hasRole(user, UserRoles.CUSTOMER),
  isVendor: hasRole(user, UserRoles.VENDOR),
  isDelivery: hasRole(user, UserRoles.DELIVERY),
  isAdmin: hasRole(user, UserRoles.ADMIN),
});

// Helper function to get display name for role
export const getRoleDisplayName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    customer: "Customer",
    vendor: "Vendor",
    delivery: "Delivery Person",
    admin: "Administrator",
  };
  return names[role];
};

// Helper function to get role icon
export const getRoleIcon = (role: UserRole): string => {
  const icons: Record<UserRole, string> = {
    customer: "👤",
    vendor: "🏪",
    delivery: "🛵",
    admin: "👑",
  };
  return icons[role];
};

// Helper function to get available roles for a user (for RoleSwitcher)
export const getAvailableRoles = (user: User | null): UserRole[] => {
  return user?.roles ?? [];
};

// Helper function to check if user can switch to a specific role
export const canSwitchToRole = (user: User | null, role: UserRole): boolean => {
  return hasRole(user, role);
};

// Helper function to get default redirect path for a role
export const getRoleRedirectPath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    customer: "/",
    vendor: "/vendor/dashboard",
    delivery: "/delivery/dashboard",
    admin: "/admin/dashboard",
  };
  return paths[role];
};

// Helper function to get dashboard title for a role
export const getDashboardTitle = (role: UserRole): string => {
  const titles: Record<UserRole, string> = {
    customer: "Customer Dashboard",
    vendor: "Vendor Dashboard",
    delivery: "Delivery Dashboard",
    admin: "Admin Dashboard",
  };
  return titles[role];
};

// Helper to get role badge color (for Tailwind)
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    customer: "bg-blue-100 text-blue-800",
    vendor: "bg-purple-100 text-purple-800",
    delivery: "bg-green-100 text-green-800",
    admin: "bg-red-100 text-red-800",
  };
  return colors[role];
};