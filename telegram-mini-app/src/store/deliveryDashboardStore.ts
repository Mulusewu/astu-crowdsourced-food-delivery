// src/store/deliveryDashboardStore.ts
// Aligned with Prisma schema — reads delivererProfiles and restaurants from database.json
import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";
import { ROUTES } from "@/routes/routePaths";
import { useAuthStore } from "@/store/auth/authStore";
import type { DelivererProfile } from "@/types/user.types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Restaurant shape (from Prisma Restaurant model) ──────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  mode: "VENDOR_MANAGED" | "ADMIN_MANAGED";
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
  activeOrders: number;   // computed — orders in progress at this restaurant
  isBookmarked: boolean;  // local-only
}

// Cheap/quick orders displayed on the dashboard
export interface DashboardOrder {
  id: string;
  shortId: string;
  restaurantName: string;
  restaurantImageUrl: string | null;
  itemCount: number;
  totalAmount: number;
  deliveryFee: number;
  firstItemImageUrl: string | null;
}

// Payment-waiting UI state (unchanged from old store)
type OrderStatus = "pending" | "accepted" | "awaiting_payment" | "paid" | "in_progress" | "completed" | "cancelled";
type CustomerActivity = "idle" | "viewing" | "paying";

interface DeliveryDashboardState {
  // Deliverer profile
  delivererProfile: DelivererProfile | null;
  // Restaurant list (server-sourced, enriched with computed fields)
  restaurants: Restaurant[];
  // Available orders shown on dashboard (AWAITING_ACCEPT, low total)
  dashboardOrders: DashboardOrder[];
  isLoading: boolean;

  // Payment-waiting state
  orderStatus: OrderStatus;
  paymentTimer: number;
  customerActivity: CustomerActivity;

  // Actions
  fetchDashboardData: () => Promise<void>;
  toggleActiveStatus: (navigate?: (path: string) => void) => void;
  toggleBookmark: (restaurantId: string) => void;
  setOrderStatus: (status: OrderStatus) => void;
  decreasePaymentTimer: () => void;
  resetPaymentTimer: (seconds?: number) => void;
  setCustomerActivity: (activity: CustomerActivity) => void;
  updateDelivererStats: (earnings: number) => void;
}

// Statuses that count as "active" at a restaurant
const RESTAURANT_ACTIVE_STATUSES = new Set([
  "AWAITING_ACCEPT",
  "ASSIGNED",
  "VENDOR_BEING_PREPARED",
  "VENDOR_FINISHED",
  "VENDOR_READY_FOR_PICKUP",
]);

export const useDeliveryDashboardStore = create<DeliveryDashboardState>()(
  persist(
    (set, get) => ({
      delivererProfile: null,
      restaurants: [],
      dashboardOrders: [],
      isLoading: true,

      orderStatus: "pending",
      paymentTimer: 300,
      customerActivity: "idle",

      fetchDashboardData: async () => {
        set({ isLoading: true });
        try {
          await delay(600);

          // Get the logged-in user from authStore
          const { user } = useAuthStore.getState();
          const userId = user?.id ?? "";

          // Find deliverer profile
          const rawProfile = db.delivererProfiles.find((dp) => dp.userId === userId);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const delivererProfile: DelivererProfile | null = rawProfile
            ? { ...(rawProfile as any) }
            : null;

          // Build restaurant list with active-order counts
          const restaurants: Restaurant[] = db.restaurants.map((r) => {
            const activeOrders = db.orders.filter(
              (o) =>
                o.restaurantId === r.id &&
                RESTAURANT_ACTIVE_STATUSES.has(o.status),
            ).length;

            return {
              id: r.id,
              name: r.name,
              phone: r.phone,
              mode: r.mode as Restaurant["mode"],
              location: r.location,
              lat: r.lat,
              lng: r.lng,
              isOpen: r.isOpen,
              isActive: r.isActive,
              openingTime: r.openingTime ?? null,
              closingTime: r.closingTime ?? null,
              imageUrl: r.imageUrl ?? null,
              minOrderValue: r.minOrderValue,
              avgRating: r.avgRating,
              totalReviews: r.totalReviews,
              tags: r.tags,
              activeOrders,
              isBookmarked: false,
            };
          });

          // Build dashboard orders from AWAITING_ACCEPT (low-amount ones first)
          const dashboardOrders: DashboardOrder[] = db.orders
            .filter((o) => o.status === "AWAITING_ACCEPT")
            .sort((a, b) => a.totalAmount - b.totalAmount)
            .slice(0, 6)
            .map((o) => {
              const restaurant = db.restaurants.find((r) => r.id === o.restaurantId);
              const items = db.orderItems.filter((oi) => oi.orderId === o.id);
              const firstMenuId = items[0]?.menuId;
              const firstMenuItem = firstMenuId
                ? db.menuItems.find((mi) => mi.id === firstMenuId)
                : null;
              return {
                id: o.id,
                shortId: o.shortId,
                restaurantName: restaurant?.name ?? "Restaurant",
                restaurantImageUrl: restaurant?.imageUrl ?? null,
                itemCount: items.length,
                totalAmount: o.totalAmount,
                deliveryFee: o.deliveryFee,
                firstItemImageUrl: firstMenuItem?.imageUrl ?? null,
              };
            });

          set({ delivererProfile, restaurants, dashboardOrders, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          set({ isLoading: false });
        }
      },

      toggleActiveStatus: (navigate) => {
        const { delivererProfile } = get();
        if (!delivererProfile) return;

        const willBeOnline = !delivererProfile.isOnline;
        set({
          delivererProfile: {
            ...delivererProfile,
            isOnline: willBeOnline,
            isAvailable: willBeOnline,
          },
        });

        if (!willBeOnline && navigate) {
          navigate(ROUTES.DELIVERY.OFFLINE);
        }
      },

      toggleBookmark: (restaurantId: string) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === restaurantId ? { ...r, isBookmarked: !r.isBookmarked } : r,
          ),
        }));
      },

      setOrderStatus: (status) => set({ orderStatus: status }),

      decreasePaymentTimer: () =>
        set((s) => ({ paymentTimer: Math.max(0, s.paymentTimer - 1) })),

      resetPaymentTimer: (seconds = 300) => set({ paymentTimer: seconds }),

      setCustomerActivity: (activity) => set({ customerActivity: activity }),
      updateDelivererStats: (earnings) => {
        set((s) => {
          if (!s.delivererProfile) return {};
          return {
            delivererProfile: {
              ...s.delivererProfile,
              totalDeliveries: (s.delivererProfile.totalDeliveries || 0) + 1,
              totalEarnings: (Number(s.delivererProfile.totalEarnings) || 0) + earnings,
            },
          };
        });
      },
    }),

    {
      name: "delivery-dashboard-storage",
      partialize: (s) => ({
        delivererProfile: s.delivererProfile,
        orderStatus: s.orderStatus,
        paymentTimer: s.paymentTimer,
        customerActivity: s.customerActivity,
      }),
    },
  ),
);
