import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";
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

interface VendorDashboardState {
  stats: VendorStats;
  recentOrders: VendorOrder[];
  restaurantId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useVendorDashboardStore = create<VendorDashboardState>((set) => ({
  stats: { todayOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 },
  recentOrders: [],
  restaurantId: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const restaurantId = user?.vendorProfile?.restaurantId;

      if (!restaurantId) {
        set({ error: "No restaurant assigned to this vendor yet.", isLoading: false });
        return;
      }

      // Fetch the last 50 orders for this restaurant to compute stats
      // In Phase 2, you would build a dedicated `GET /restaurants/:id/stats` endpoint.
      const res = await apiClient.get('/orders', {
        params: { roleAs: 'VENDOR', restaurantId, limit: 50 }
      });

      const orders = res.data.orders;
      const today = new Date().toISOString().split("T")[0];

      const stats: VendorStats = {
        todayOrders: orders.filter((o: any) => o.createdAt.startsWith(today)).length,
        pendingOrders: orders.filter((o: any) => 
          ["PAYMENT_RECEIVED", "VENDOR_BEING_PREPARED", "VENDOR_READY_FOR_PICKUP"].includes(o.status)
        ).length,
        completedOrders: orders.filter((o: any) => 
          ["DELIVERED", "COMPLETED", "RECEIVED"].includes(o.status)
        ).length,
        totalRevenue: orders
          .filter((o: any) => ["DELIVERED", "COMPLETED", "RECEIVED"].includes(o.status))
          .reduce((acc: number, o: any) => acc + Number(o.totalAmount), 0),
      };

      const recentOrders: VendorOrder[] = orders.slice(0, 5).map((o: any) => ({
        id: o.id,
        shortId: o.shortId,
        customerName: o.customer?.user?.fullName || "Customer",
        itemCount: o._count?.items || 1,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      set({ stats, recentOrders, restaurantId, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.message || "Failed to fetch dashboard data", isLoading: false });
    }
  },
}));