// src/store/orders/customerOrderStore.ts
// Prisma-aligned customer order store with full OrderStatus enum and placeOrder action.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

// ─── Prisma-aligned OrderStatus ──────────────────────────────────────────────
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

// ─── Customer-facing Order model ─────────────────────────────────────────────
export interface CustomerOrder {
  id: string;
  shortId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  restaurantId: string;
  restaurantName: string;
  restaurantImageUrl: string | null;
  items: {
    id: string;
    menuId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string | null;
  }[];
  // Financials (Prisma-aligned)
  foodPrice: number;
  deliveryFee: number;
  transactionFee: number;
  serviceFee: number;
  tip: number;
  totalAmount: number;
  // OTP
  otpCode: string;
  otpVerifiedAt: string | null;
  // ETA
  estimatedDeliveryTime: string | null;
  estimatedReadyAt: string | null;
  // Delivery address
  deliveryAddress: string | null;
  // Status history
  statusHistory: {
    oldStatus: OrderStatus | null;
    newStatus: OrderStatus;
    createdAt: string;
  }[];
  // Deliverer info (if assigned)
  deliverer: {
    name: string;
    phone: string;
    avatarUrl: string | null;
    rating: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Store interface ──────────────────────────────────────────────────────────
interface CustomerOrderState {
  orders: CustomerOrder[];
  isLoading: boolean;
  error: string | null;
  fetchCustomerOrders: () => Promise<void>;
  getOrderById: (id: string) => CustomerOrder | undefined;
  placeOrder: (params: {
    restaurantId: string;
    items: { menuId: string; quantity: number; unitPrice: number; name: string; imageUrl: string | null }[];
    foodPrice: number;
    deliveryFee: number;
    serviceFee: number;
    transactionFee: number;
    tip: number;
    totalAmount: number;
    deliveryAddress: string;
  }) => Promise<CustomerOrder>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  confirmPayment: (orderId: string) => Promise<void>;
  clearError: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const generateShortId = () =>
  `AE-${1000 + Math.floor(Math.random() * 9000)}`;

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// Build a CustomerOrder view from the flat database arrays
const buildCustomerOrder = (rawOrder: (typeof db.orders)[0]): CustomerOrder => {
  const restaurant = db.restaurants.find((r) => r.id === rawOrder.restaurantId);
  const orderItems = db.orderItems
    .filter((oi) => oi.orderId === rawOrder.id)
    .map((oi) => {
      const menuItem = db.menuItems.find((m) => m.id === oi.menuId);
      return {
        id: oi.id,
        menuId: oi.menuId,
        name: menuItem?.name ?? "Item",
        quantity: oi.quantity,
        unitPrice: Number(oi.unitPrice),
        imageUrl: menuItem?.imageUrl ?? null,
      };
    });

  const statusHistory = (db.orderStatusHistories ?? [])
    .filter((h: any) => h.orderId === rawOrder.id)
    .map((h: any) => ({
      oldStatus: (h.oldStatus as OrderStatus) ?? null,
      newStatus: h.newStatus as OrderStatus,
      createdAt: h.createdAt,
    }))
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Find deliverer info
  let deliverer: CustomerOrder["deliverer"] = null;
  if (rawOrder.delivererId) {
    const delivererProfile = (db.delivererProfiles as any[]).find(
      (dp: any) => dp.userId === rawOrder.delivererId,
    );
    const delivererUser = delivererProfile
      ? db.users.find((u) => u.id === delivererProfile.userId)
      : null;
    if (delivererUser) {
      deliverer = {
        name: delivererUser.fullName,
        phone: delivererUser.phoneNumber ?? "",
        avatarUrl: delivererUser.avatarUrl ?? null,
        rating: Number(delivererProfile?.rating ?? 4.5),
      };
    }
  }

  return {
    id: rawOrder.id,
    shortId: rawOrder.shortId,
    status: rawOrder.status as OrderStatus,
    paymentStatus: rawOrder.paymentStatus as PaymentStatus,
    restaurantId: rawOrder.restaurantId,
    restaurantName: restaurant?.name ?? "Restaurant",
    restaurantImageUrl: restaurant?.imageUrl ?? null,
    items: orderItems,
    foodPrice: Number(rawOrder.foodPrice),
    deliveryFee: Number(rawOrder.deliveryFee),
    transactionFee: Number(rawOrder.transactionFee),
    serviceFee: Number(rawOrder.serviceFee),
    tip: Number(rawOrder.tip),
    totalAmount: Number(rawOrder.totalAmount),
    otpCode: rawOrder.otpCode,
    otpVerifiedAt: rawOrder.otpVerifiedAt ?? null,
    estimatedDeliveryTime: rawOrder.estimatedDeliveryTime ?? null,
    estimatedReadyAt: rawOrder.estimatedReadyAt ?? null,
    deliveryAddress: null,
    statusHistory,
    deliverer,
    createdAt: rawOrder.createdAt,
    updatedAt: rawOrder.updatedAt,
  };
};

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCustomerOrderStore = create<CustomerOrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchCustomerOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(500);
          const { user } = useAuthStore.getState();
          const userId = user?.id ?? "";
          const customerProfileId =
            (db.customerProfiles as any[]).find((cp: any) => cp.userId === userId)?.id ?? "";

          const customerOrders = db.orders
            .filter((o) => o.customerId === userId || o.customerId === customerProfileId)
            .map(buildCustomerOrder);

          set((s) => {
            const existingIds = new Set(customerOrders.map((o) => o.id));
            const localOnly = s.orders.filter((o) => !existingIds.has(o.id));
            return { orders: [...customerOrders, ...localOnly], isLoading: false };
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to load orders", isLoading: false });
        }
      },

      getOrderById: (id) => get().orders.find((o) => o.id === id),

      placeOrder: async (params) => {
        set({ isLoading: true, error: null });
        try {
          await delay(700);
          const now = new Date().toISOString();
          const newOrder: CustomerOrder = {
            id: `ord_${Date.now()}`,
            shortId: generateShortId(),
            status: "AWAITING_ACCEPT",
            paymentStatus: "AWAITING_PAYMENT",
            restaurantId: params.restaurantId,
            restaurantName:
              db.restaurants.find((r) => r.id === params.restaurantId)?.name ?? "Restaurant",
            restaurantImageUrl:
              db.restaurants.find((r) => r.id === params.restaurantId)?.imageUrl ?? null,
            items: params.items.map((item, i) => ({
              id: `oi_${Date.now()}_${i}`,
              menuId: item.menuId,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              imageUrl: item.imageUrl,
            })),
            foodPrice: params.foodPrice,
            deliveryFee: params.deliveryFee,
            transactionFee: params.transactionFee,
            serviceFee: params.serviceFee,
            tip: params.tip,
            totalAmount: params.totalAmount,
            otpCode: generateOtp(),
            otpVerifiedAt: null,
            estimatedDeliveryTime: null,
            estimatedReadyAt: null,
            deliveryAddress: params.deliveryAddress,
            statusHistory: [
              { oldStatus: null, newStatus: "AWAITING_ACCEPT", createdAt: now },
            ],
            deliverer: null,
            createdAt: now,
            updatedAt: now,
          };

          set((s) => ({ orders: [newOrder, ...s.orders], isLoading: false }));
          return newOrder;
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to place order", isLoading: false });
          throw e;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id === orderId) {
              const now = new Date().toISOString();
              // Simulate deliverer assignment if transitioning to ASSIGNED
              let deliverer = o.deliverer;
              if (status === "ASSIGNED" && !deliverer) {
                deliverer = {
                  name: "Biruk Wondimu",
                  phone: "+251914567890",
                  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Biruk",
                  rating: 4.8,
                };
              }
              return {
                ...o,
                status,
                deliverer,
                updatedAt: now,
                statusHistory: [
                  ...o.statusHistory,
                  { oldStatus: o.status, newStatus: status, createdAt: now },
                ],
              };
            }
            return o;
          }),
        }));
      },

      confirmPayment: async (orderId) => {
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id === orderId) {
              const now = new Date().toISOString();
              return {
                ...o,
                status: "PAYMENT_RECEIVED",
                paymentStatus: "CAPTURED",
                updatedAt: now,
                statusHistory: [
                  ...o.statusHistory,
                  { oldStatus: o.status, newStatus: "PAYMENT_RECEIVED", createdAt: now },
                ],
              };
            }
            return o;
          }),
        }));
      },

      cancelOrder: async (orderId) => {
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id === orderId) {
              const now = new Date().toISOString();
              return {
                ...o,
                status: "CANCELLED",
                paymentStatus: o.paymentStatus === "CAPTURED" ? "REFUNDED" : o.paymentStatus,
                updatedAt: now,
                statusHistory: [
                  ...o.statusHistory,
                  { oldStatus: o.status, newStatus: "CANCELLED", createdAt: now },
                ],
              };
            }
            return o;
          }),
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "customer-order-storage",
      partialize: (s) => ({ orders: s.orders }),
    },
  ),
);
