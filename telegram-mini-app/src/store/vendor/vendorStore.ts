import { create } from "zustand";
import { db } from "@/data";
import { useAuthStore } from "@/store/auth/authStore";

type VendorDashboardStats = {
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  location: string;
  isOpen: boolean;
  avgRating: number;
  totalReviews: number;
  menuItemsCount: number;
  activeOrdersCount: number;
  awaitingAcceptCount: number;
  preparingCount: number;
  readyForPickupCount: number;
  completedTodayCount: number;
  revenueTotal: number;
};

type VendorState = {
  stats: VendorDashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardStats: () => Promise<void>;
};

const delay = (ms: number = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isActiveOrderStatus = (status: string): boolean =>
  [
    "CREATED",
    "AWAITING_ACCEPT",
    "ASSIGNED",
    "AWAITING_PAYMENT",
    "PAYMENT_RECEIVED",
    "VENDOR_BEING_PREPARED",
    "VENDOR_FINISHED",
    "VENDOR_READY_FOR_PICKUP",
  ].includes(status);

export const useVendorStore = create<VendorState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay();

      const authUser = useAuthStore.getState().user;

      const vendorProfile =
        (authUser?.id
          ? db.vendorProfiles.find((p) => p.userId === authUser.id)
          : undefined) || db.vendorProfiles[0];

      if (!vendorProfile?.restaurantId) {
        throw new Error("Vendor restaurant not found");
      }

      const restaurant = db.restaurants.find(
        (r) => r.id === vendorProfile.restaurantId,
      );
      if (!restaurant) throw new Error("Restaurant not found");

      const orders = db.orders.filter((o) => o.restaurantId === restaurant.id);
      const activeOrders = orders.filter((o) => isActiveOrderStatus(o.status));

      const menuItemsCount = db.menuItems.filter(
        (m) => m.restaurantId === restaurant.id && m.isArchived !== true,
      ).length;

      const awaitingAcceptCount = orders.filter(
        (o) => o.status === "AWAITING_ACCEPT",
      ).length;

      const preparingCount = orders.filter(
        (o) => o.status === "VENDOR_BEING_PREPARED",
      ).length;

      const readyForPickupCount = orders.filter(
        (o) => o.status === "VENDOR_READY_FOR_PICKUP",
      ).length;

      const completedTodayCount = orders.filter(
        (o) =>
          (o.status === "DELIVERED" || o.status === "COMPLETED") &&
          new Date(o.updatedAt).toDateString() === new Date().toDateString(),
      ).length;

      const revenueTotal = db.ledgerEntries
        .filter((le: any) => le.userId == null && le.type === "PLATFORM_REVENUE")
        .reduce((sum: number, le: any) => sum + Number(le.amount || 0), 0);

      set({
        stats: {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantPhone: restaurant.phone,
          location: restaurant.location,
          isOpen: restaurant.isOpen,
          avgRating: Number(restaurant.avgRating) || 5,
          totalReviews: Number(restaurant.totalReviews) || 0,
          menuItemsCount,
          activeOrdersCount: activeOrders.length,
          awaitingAcceptCount,
          preparingCount,
          readyForPickupCount,
          completedTodayCount,
          revenueTotal,
        },
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : "Failed to load vendor dashboard",
      });
    }
  },
}));

