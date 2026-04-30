export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type TokenType =
  | "EMAIL_VERIFICATION"
  | "PHONE_VERIFICATION"
  | "PASSWORD_RESET";
export type UserRole = "CUSTOMER" | "DELIVERER" | "VENDOR_STAFF" | "ADMIN";
export type ActiveMode = "CUSTOMER" | "DELIVERER";
export type VendorMode = "VENDOR_MANAGED" | "ADMIN_MANAGED";
export type OrderStatus =
  | "CREATED"
  | "AWAITING_ACCEPT"
  | "ASSIGNED"
  | "AWAITING_PAYMENT"
  | "PAYMENT_RECEIVED"
  | "VENDOR_BEING_PREPARED"
  | "VENDOR_FINISHED"
  | "VENDOR_READY_FOR_PICKUP"
  | "PICKED_UP"
  | "EN_ROUTE"
  | "ARRIVED"
  | "RECEIVED"
  | "DELIVERED"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED"
  | "NO_DELIVERER_FOUND";
export type PaymentStatus =
  | "AWAITING_PAYMENT"
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED";
export type LedgerTransactionType =
  | "ESCROW_RESERVE"
  | "REIMBURSEMENT_PAYMENT"
  | "PLATFORM_REVENUE"
  | "REFUND"
  | "DISPUTE_HOLD";
export type LedgerEntryStatus = "PENDING" | "COMPLETED" | "FAILED";
export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
export type DispatchAction = "BROADCAST" | "ACCEPTED" | "DECLINED" | "IGNORED";

export interface PrismaUser {
  id: string;
  telegramId: number;
  astuEmail: string | null;
  email: string | null;
  fullName: string;
  phoneNumber: string | null;
  password: string;
  avatarUrl: string | null;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: UserRole;
  activeMode: ActiveMode;
  lastActiveAt: string;
  deviceToken: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  mode: VendorMode;
  location: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  isActive: boolean;
  openingTime: string | null;
  closingTime: string | null;
  imageUrl: string | null;
  minOrderValue: number;
  avgRating: number;
  totalReviews: number;
  tags: string[];
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
  isArchived: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isArchived: boolean;
  prepTimeMins: number;
  isFasting: boolean;
  availabilityReason: string | null;
}

export interface Order {
  id: string;
  shortId: string;
  customerId: string;
  delivererId: string | null;
  restaurantId: string;
  pickupLat: number | null;
  pickupLng: number | null;
  estimatedDeliveryTime: string | null;
  estimatedReadyAt: string | null;
  foodPrice: number;
  deliveryFee: number;
  transactionFee: number;
  serviceFee: number;
  tip: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  otpCode: string;
  otpVerifiedAt: string | null;
  chapaRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuId: string;
  quantity: number;
  unitPrice: number;
}

export interface Payment {
  id: string;
  orderId: string;
  transactionId: string | null;
  provider: string | null;
  status: PaymentStatus;
  apiResponse: string | null;
  amount: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  refundReason: string | null;
  webhookReceivedAt: string | null;
  payoutAmount: number;
  attempts: number;
  createdAt: string;
}

export interface PrismaDatabase {
  version: string;
  timestamp: string;
  prismaCompatible: boolean;
  users: PrismaUser[];
  customerProfiles: CustomerProfile[];
  delivererProfiles: DelivererProfile[];
  vendorProfiles: VendorProfile[];
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  orderItems: OrderItem[];
  payments: Payment[];
  notifications: Array<Record<string, unknown>>;
  ratings: Array<Record<string, unknown>>;
  ledgerEntries: Array<Record<string, unknown>>;
  disputes: Array<Record<string, unknown>>;
  dispatchLogs: Array<Record<string, unknown>>;
  anomalyFlags: Array<Record<string, unknown>>;
  refreshTokens: Array<Record<string, unknown>>;
  verificationTokens: Array<Record<string, unknown>>;
  userAuditLogs: Array<Record<string, unknown>>;
  payoutLogs: Array<Record<string, unknown>>;
  systemConfigs: Array<Record<string, unknown>>;
}
