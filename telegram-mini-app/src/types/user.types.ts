// src/types/user.types.ts
// Fully aligned with Prisma schema

export type UserRole = "CUSTOMER" | "DELIVERER" | "VENDOR_STAFF" | "ADMIN";
export type ActiveMode = "CUSTOMER" | "DELIVERER";
export type UserStatus = "ACTIVE" | "BANNED" | "PENDING";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export const UserRoles = {
  CUSTOMER: "CUSTOMER" as const,
  DELIVERER: "DELIVERER" as const,
  VENDOR_STAFF: "VENDOR_STAFF" as const,
  ADMIN: "ADMIN" as const,
} as const;

// ─── Sub-profiles ─────────────────────────────────────────────────────────────

export interface CustomerProfile {
  id: string;
  userId: string;
  defaultLocation: string | null;
  rating: number;
  totalOrders: number;
  prefferedPaymentMethod: string | null;
  bookmarkRestaurants: string[];
  bookmarkMeals: string[];
}

export interface DelivererProfile {
  id: string;
  userId: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  isOnline: boolean;
  currentLocation: string | null;
  rating: number;
  isAvailable: boolean;
  payoutAccount: string | null;
  payoutProvider: string | null;
  totalDeliveries: number;
  totalEarnings: number;
  lat: number | null;
  lng: number | null;
  lastPingAt: string | null;
}

export interface VendorProfile {
  id: string;
  userId: string;
  restaurantId: string | null;
  isOwner: boolean;
  businessDocumentUrl: string;
  verificationStatus: VerificationStatus;
}

// ─── Core User (mirrors Prisma `User` model) ──────────────────────────────────

export interface User {
  id: string;
  telegramId: number;
  astuEmail: string | null;
  email: string | null;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: UserRole;
  activeMode: ActiveMode;
  lastActiveAt: string;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string;

  // Profiles — populated by backend when needed
  customerProfile?: CustomerProfile | null;
  delivererProfile?: DelivererProfile | null;
  vendorProfile?: VendorProfile | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const hasRole = (user: User | null, role: UserRole): boolean =>
  user?.role === role;

export const isDeliverer = (user: User | null): boolean =>
  user?.role === "DELIVERER";

export const isCustomer = (user: User | null): boolean =>
  user?.role === "CUSTOMER";

export const isVendor = (user: User | null): boolean =>
  user?.role === "VENDOR_STAFF";

export const isAdmin = (user: User | null): boolean =>
  user?.role === "ADMIN";

export const getRoleDisplayName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    CUSTOMER: "Customer",
    DELIVERER: "Deliverer",
    VENDOR_STAFF: "Vendor Staff",
    ADMIN: "Administrator",
  };
  return names[role];
};

export const getRoleRedirectPath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    CUSTOMER: "/customer/dashboard",
    DELIVERER: "/delivery/dashboard",
    VENDOR_STAFF: "/vendor/dashboard",
    ADMIN: "/admin/dashboard",
  };
  return paths[role];
};

export const getRoleIcon = (role: UserRole): string => {
  const icons: Record<UserRole, string> = {
    CUSTOMER: "👤",
    DELIVERER: "🛵",
    VENDOR_STAFF: "🏪",
    ADMIN: "👑",
  };
  return icons[role];
};