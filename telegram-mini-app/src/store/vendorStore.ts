import { create } from "zustand";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

export interface VendorStats {
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface VendorOrder {
  id: string;
  shortId: string;
  customerName: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  time: string;
}

interface VendorState {
  stats: VendorStats;
  recentOrders: VendorOrder[];
  restaurantId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchVendorData: () => Promise<void>;
}

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const useVendorStore = create<VendorState>((set) => ({
  stats: {
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  restaurantId: null,
  isLoading: false,
  error: null,

  fetchVendorData: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(600);
      const { user } = useAuthStore.getState();
      if (!user) {
        set({ error: "Not authenticated", isLoading: false });
        return;
      }

      // Find the vendor profile for this user to get their restaurantId
      const vendorProfile = db.vendorProfiles.find((vp) => vp.userId === user.id);
      if (!vendorProfile) {
        set({ error: "No vendor profile found for this user", isLoading: false });
        return;
      }

      const restaurantId = vendorProfile.restaurantId;
      const restaurant = db.restaurants.find((r) => r.id === restaurantId);

      if (!restaurant) {
        set({ error: "No restaurant found for this vendor", isLoading: false });
        return;
      }

      // Filter orders for this restaurant
      const restaurantOrders = db.orders.filter((o) => o.restaurantId === restaurantId);

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const todayOrders = restaurantOrders.filter((o) => o.createdAt.startsWith(today));
      
      const stats: VendorStats = {
        todayOrders: todayOrders.length,
        pendingOrders: restaurantOrders.filter((o) => 
          ["CREATED", "AWAITING_ACCEPT", "ASSIGNED", "VENDOR_BEING_PREPARED"].includes(o.status)
        ).length,
        completedOrders: restaurantOrders.filter((o) => 
          ["DELIVERED", "COMPLETED", "RECEIVED"].includes(o.status)
        ).length,
        totalRevenue: restaurantOrders
          .filter((o) => ["DELIVERED", "COMPLETED", "RECEIVED", "PAYMENT_RECEIVED"].includes(o.status))
          .reduce((acc, o) => acc + Number(o.totalAmount), 0),
      };

      // Map recent orders
      const recentOrders: VendorOrder[] = restaurantOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((o) => {
          const customerUser = db.users.find((u) => u.id === o.customerId);
          const itemsCount = db.orderItems.filter((oi) => oi.orderId === o.id).length;
          
          return {
            id: o.id,
            shortId: o.shortId,
            customerName: customerUser?.fullName || "Customer",
            itemCount: itemsCount,
            totalAmount: Number(o.totalAmount),
            status: o.status,
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });

      set({ 
        stats, 
        recentOrders, 
        restaurantId, 
        isLoading: false 
      });
    } catch (e) {
      set({ error: "Failed to fetch vendor data", isLoading: false });
    }
  },
}));
