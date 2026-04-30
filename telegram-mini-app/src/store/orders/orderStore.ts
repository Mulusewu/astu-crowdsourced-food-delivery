// src/store/orders/orderStore.ts
// Aligned with Prisma schema — relational data joined from database.json
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";

// ─── Prisma-aligned types ─────────────────────────────────────────────────────

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

export interface OrderMenuItem {
  id: string;        // orderItem id
  menuId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
}

export interface OrderCustomer {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  deliveryAddress: string | null;
}

export interface OrderRestaurant {
  id: string;
  name: string;
  imageUrl: string | null;
  location: string;
  lat: number;
  lng: number;
  phone: string;
}

export interface Order {
  id: string;
  shortId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  restaurant: OrderRestaurant;
  customer: OrderCustomer;
  delivererId: string | null;
  items: OrderMenuItem[];
  // Financials
  foodPrice: number;
  deliveryFee: number;
  transactionFee: number;
  serviceFee: number;
  tip: number;
  totalAmount: number;
  // Location
  pickupLat: number | null;
  pickupLng: number | null;
  // Timing
  estimatedDeliveryTime: string | null;
  estimatedReadyAt: string | null;
  createdAt: string;
  updatedAt: string;
  // OTP
  otpCode: string;
  otpVerifiedAt: string | null;
  // UI helpers (local-only)
  isBookmarked: boolean;
  distance: string | null;
}

// History item: simplified view for the history page
export interface OrderHistoryItem {
  id: string;
  shortId: string;
  restaurantName: string;
  restaurantImageUrl: string | null;
  firstItemName: string;
  firstItemImageUrl: string | null;
  totalAmount: number;
  deliveryFee: number;
  status: "DELIVERED" | "COMPLETED" | "CANCELLED" | "DISPUTED";
  createdAt: string;
  rating: number | null;
}

type SecondaryFilterType = "price_asc" | "price_desc" | "nearby" | "priority";

// Statuses that indicate an order is "in progress" for a deliverer
const ACTIVE_STATUSES: OrderStatus[] = [
  "ASSIGNED",
  "VENDOR_BEING_PREPARED",
  "VENDOR_FINISHED",
  "VENDOR_READY_FOR_PICKUP",
  "PICKED_UP",
  "EN_ROUTE",
  "ARRIVED",
  "RECEIVED",
];

const HISTORY_STATUSES: OrderStatus[] = [
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
];

// ─── Relational join helper ───────────────────────────────────────────────────

const buildOrderView = (raw: (typeof db.orders)[number]): Order => {
  const restaurant = db.restaurants.find((r) => r.id === raw.restaurantId);
  const customerUser = db.users.find((u) => u.id === raw.customerId);
  const customerProfile = db.customerProfiles.find(
    (cp) => cp.userId === raw.customerId,
  );
  const rawItems = db.orderItems.filter((oi) => oi.orderId === raw.id);

  const items: OrderMenuItem[] = rawItems.map((oi) => {
    const mi = db.menuItems.find((m) => m.id === oi.menuId);
    return {
      id: oi.id,
      menuId: oi.menuId,
      name: mi?.name ?? "Unknown Item",
      unitPrice: oi.unitPrice,
      quantity: oi.quantity,
      imageUrl: mi?.imageUrl ?? null,
    };
  });

  return {
    id: raw.id,
    shortId: raw.shortId,
    status: raw.status as OrderStatus,
    paymentStatus: raw.paymentStatus as PaymentStatus,
    restaurant: {
      id: restaurant?.id ?? raw.restaurantId,
      name: restaurant?.name ?? "Unknown Restaurant",
      imageUrl: restaurant?.imageUrl ?? null,
      location: restaurant?.location ?? "",
      lat: restaurant?.lat ?? 0,
      lng: restaurant?.lng ?? 0,
      phone: restaurant?.phone ?? "",
    },
    customer: {
      id: customerUser?.id ?? raw.customerId,
      fullName: customerUser?.fullName ?? "Customer",
      phoneNumber: customerUser?.phoneNumber ?? null,
      avatarUrl: customerUser?.avatarUrl ?? null,
      deliveryAddress: customerProfile?.defaultLocation ?? null,
    },
    delivererId: raw.delivererId ?? null,
    items,
    foodPrice: raw.foodPrice,
    deliveryFee: raw.deliveryFee,
    transactionFee: raw.transactionFee,
    serviceFee: raw.serviceFee,
    tip: raw.tip,
    totalAmount: raw.totalAmount,
    pickupLat: raw.pickupLat ?? null,
    pickupLng: raw.pickupLng ?? null,
    estimatedDeliveryTime: raw.estimatedDeliveryTime ?? null,
    estimatedReadyAt: raw.estimatedReadyAt ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    otpCode: raw.otpCode,
    otpVerifiedAt: raw.otpVerifiedAt ?? null,
    isBookmarked: false,
    distance: null,
  };
};

const toHistoryItem = (order: Order): OrderHistoryItem => ({
  id: order.id,
  shortId: order.shortId,
  restaurantName: order.restaurant.name,
  restaurantImageUrl: order.restaurant.imageUrl,
  firstItemName: order.items[0]?.name ?? "Order",
  firstItemImageUrl: order.items[0]?.imageUrl ?? null,
  totalAmount: order.totalAmount,
  deliveryFee: order.deliveryFee,
  status: (["DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED"].includes(order.status)
    ? order.status
    : "DELIVERED") as OrderHistoryItem["status"],
  createdAt: order.createdAt,
  rating: null,
});

const filterOrders = (
  orders: Order[],
  selectedCafe: string,
  secondaryFilter: SecondaryFilterType,
): Order[] => {
  let filtered = [...orders];
  if (selectedCafe !== "all") {
    filtered = filtered.filter((o) => o.restaurant.id === selectedCafe);
  }
  switch (secondaryFilter) {
    case "price_asc":
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
      break;
    default:
      break;
  }
  return filtered;
};

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// ─── Store ────────────────────────────────────────────────────────────────────

interface OrderStore {
  orders: Order[];           // available (AWAITING_ACCEPT)
  filteredOrders: Order[];
  activeOrders: Order[];
  orderHistory: OrderHistoryItem[];
  currentOrder: Order | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  selectedCafe: string;
  secondaryFilter: SecondaryFilterType;

  fetchAvailableOrders: () => Promise<void>;
  fetchActiveOrders: () => Promise<void>;
  fetchOrderHistory: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  loadMoreOrders: () => Promise<void>;
  setSelectedCafe: (cafeId: string) => void;
  setSecondaryFilter: (filter: SecondaryFilterType) => void;
  toggleBookmark: (orderId: string) => void;
  acceptOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string, reason: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  completeOrder: (orderId: string, otpCode: string) => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;
  submitOrderIssue: (orderId: string, details: { type: string; description: string }) => Promise<void>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      filteredOrders: [],
      activeOrders: [],
      orderHistory: [],
      currentOrder: null,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      page: 1,
      hasMore: false,
      selectedCafe: "all",
      secondaryFilter: "nearby",

      fetchAvailableOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);
          const activeIds = new Set(get().activeOrders.map(o => o.id));
          const available = db.orders
            .filter((o) => o.status === "AWAITING_ACCEPT" && !activeIds.has(o.id))
            .map(buildOrderView);
          set({
            orders: available,
            filteredOrders: filterOrders(available, get().selectedCafe, get().secondaryFilter),
            isLoading: false,
            page: 1,
            hasMore: false,
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to fetch orders", isLoading: false });
        }
      },

      fetchActiveOrders: async () => {
        // If we already have active orders in state, don't overwrite them with stale DB data
        // in mock mode. This allows local mutations to persist.
        if (get().activeOrders.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          await delay(500);
          const { user } = useAuthStore.getState();
          const delivererUserId = user?.id ?? "";
          const active = db.orders
            .filter(
              (o) =>
                ACTIVE_STATUSES.includes(o.status as OrderStatus) &&
                (o.delivererId === delivererUserId ||
                  o.delivererId === user?.delivererProfile?.id),
            )
            .map(buildOrderView);
          set({ activeOrders: active, isLoading: false });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to fetch active orders", isLoading: false });
        }
      },

      fetchOrderHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(500);
          const { user } = useAuthStore.getState();
          const delivererUserId = user?.id ?? "";
          const history = db.orders
            .filter(
              (o) =>
                HISTORY_STATUSES.includes(o.status as OrderStatus) &&
                (o.delivererId === delivererUserId ||
                  o.delivererId === user?.delivererProfile?.id),
            )
            .map(buildOrderView)
            .map(toHistoryItem);
          set({ orderHistory: history, isLoading: false });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to fetch history", isLoading: false });
        }
      },

      fetchOrderById: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
          await delay(400);
          const inState = [...get().orders, ...get().activeOrders].find((o) => o.id === orderId);
          if (inState) {
            set({ currentOrder: inState, isLoading: false });
            return;
          }
          const raw = db.orders.find((o) => o.id === orderId);
          if (!raw) throw new Error("Order not found");
          set({ currentOrder: buildOrderView(raw), isLoading: false });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to fetch order", isLoading: false });
        }
      },

      loadMoreOrders: async () => {
        if (!get().hasMore || get().isLoadingMore) return;
        set({ isLoadingMore: true });
        await delay(800);
        set({ isLoadingMore: false, hasMore: false });
      },

      setSelectedCafe: (cafeId) => {
        set({ selectedCafe: cafeId });
        set({ filteredOrders: filterOrders(get().orders, cafeId, get().secondaryFilter) });
      },

      setSecondaryFilter: (filter) => {
        set({ secondaryFilter: filter });
        set({ filteredOrders: filterOrders(get().orders, get().selectedCafe, filter) });
      },

      toggleBookmark: (orderId) => {
        set((s) => {
          const updated = s.orders.map((o) =>
            o.id === orderId ? { ...o, isBookmarked: !o.isBookmarked } : o,
          );
          return {
            orders: updated,
            filteredOrders: filterOrders(updated, s.selectedCafe, s.secondaryFilter),
          };
        });
      },

      acceptOrder: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);
          const { user } = useAuthStore.getState();
          set((s) => {
            const order = s.orders.find((o) => o.id === orderId);
            if (!order) return { isLoading: false };
            const accepted: Order = {
              ...order,
              status: "ASSIGNED",
              delivererId: user?.id ?? null,
              customer: {
                ...order.customer,
                deliveryAddress: order.customer.deliveryAddress ?? user?.customerProfile?.defaultLocation ?? null,
              },
            };
            const updatedOrders = s.orders.filter((o) => o.id !== orderId);
            return {
              orders: updatedOrders,
              filteredOrders: filterOrders(updatedOrders, s.selectedCafe, s.secondaryFilter),
              activeOrders: [...s.activeOrders, accepted],
              currentOrder: accepted,
              isLoading: false,
            };
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to accept order", isLoading: false });
        }
      },

      rejectOrder: async (orderId, _reason) => {
        set({ isLoading: true, error: null });
        try {
          await delay(500);
          set((s) => {
            const updated = s.orders.filter((o) => o.id !== orderId);
            return {
              orders: updated,
              filteredOrders: filterOrders(updated, s.selectedCafe, s.secondaryFilter),
              currentOrder: s.currentOrder?.id === orderId ? null : s.currentOrder,
              isLoading: false,
            };
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to decline order", isLoading: false });
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true, error: null });
        try {
          await delay(400);
          set((s) => ({
            activeOrders: s.activeOrders.map((o) =>
              o.id === orderId ? { ...o, status } : o,
            ),
            currentOrder:
              s.currentOrder?.id === orderId
                ? { ...s.currentOrder, status }
                : s.currentOrder,
            isLoading: false,
          }));
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to update status", isLoading: false });
        }
      },

      completeOrder: async (orderId, otpCode) => {
        set({ isLoading: true, error: null });
        try {
          await delay(500);
          // Validate OTP against the stored code
          const order = get().activeOrders.find((o) => o.id === orderId)
            ?? get().currentOrder;
          if (order && order.otpCode !== otpCode) {
            set({ error: "Incorrect OTP. Please ask the customer for the correct code.", isLoading: false });
            return;
          }
          set((s) => {
            const o = s.activeOrders.find((x) => x.id === orderId);
            if (!o) return { isLoading: false };

            // Update deliverer stats in dashboard store
            const { updateDelivererStats } = useDeliveryDashboardStore.getState();
            updateDelivererStats(o.deliveryFee);

            const completed: Order = {
              ...o,
              status: "DELIVERED",
              otpVerifiedAt: new Date().toISOString(),
            };
            return {
              activeOrders: s.activeOrders.filter((x) => x.id !== orderId),
              currentOrder: s.currentOrder?.id === orderId ? completed : s.currentOrder,
              orderHistory: [toHistoryItem(completed), ...s.orderHistory],
              isLoading: false,
            };
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to complete order", isLoading: false });
        }
      },

      cancelOrder: async (orderId, reason) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);
          set((s) => {
            const o = s.activeOrders.find((x) => x.id === orderId);
            const cancelled = o ? { ...o, status: "CANCELLED" as OrderStatus } : null;
            return {
              activeOrders: s.activeOrders.filter((x) => x.id !== orderId),
              currentOrder: s.currentOrder?.id === orderId ? cancelled : s.currentOrder,
              orderHistory: cancelled
                ? [toHistoryItem(cancelled), ...s.orderHistory]
                : s.orderHistory,
              isLoading: false,
            };
          });
          console.log("Order cancelled:", orderId, reason);
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to cancel order", isLoading: false });
        }
      },

      submitOrderIssue: async (orderId, details) => {
        set({ isLoading: true, error: null });
        try {
          await delay(800);
          console.log("Issue submitted for order:", orderId, details);
          set({ isLoading: false });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to submit issue", isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: "order-storage",
      partialize: (s) => ({
        selectedCafe: s.selectedCafe,
        secondaryFilter: s.secondaryFilter,
      }),
    },
  ),
);
