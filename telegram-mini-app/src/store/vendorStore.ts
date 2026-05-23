import { create } from "zustand";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";

export interface VendorStats {
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface VendorMenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
  categoryId: string;
}

export interface VendorFullOrder {
  id: string;
  shortId: string;
  customerId: string;
  customerName: string;
  customerLocation: string;
  itemCount: number;
  totalAmount: number;
  totalPrice: number; // For consistency with UI
  status: string;
  time: string;
  timeElapsed: string;
  createdAt: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    image: string;
  }>;
}

interface VendorState {
  stats: VendorStats;
  recentOrders: VendorOrder[];
  menuItems: VendorMenuItem[];
  availableOrders: VendorFullOrder[];
  activeOrders: VendorFullOrder[];
  restaurantId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchVendorData: () => Promise<void>;
  toggleMenuAvailability: (itemId: string) => void;
  acceptOrder: (orderId: string) => void;
  declineOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const useVendorStore = create<VendorState>((set, get) => ({
  stats: {
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  menuItems: [],
  availableOrders: [],
  activeOrders: [],
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

      const restaurantOrders = db.orders.filter((o) => o.restaurantId === restaurantId);
      
      const menuItems: VendorMenuItem[] = db.menuItems
        .filter((mi) => mi.restaurantId === restaurantId)
        .map((mi) => ({
          id: mi.id,
          name: mi.name,
          price: Number(mi.price),
          image: mi.imageUrl,
          isAvailable: mi.isAvailable,
          categoryId: mi.categoryId,
        }));

      set({ 
        restaurantId, 
        menuItems,
        isLoading: false 
      });

      // Initially populate lists and stats
      const state = get();
      const allFullOrders = state._mapFullOrders(restaurantOrders);
      state._recalculateFromOrders(allFullOrders);

    } catch (e) {
      set({ error: "Failed to fetch vendor data", isLoading: false });
    }
  },

  // Internal helper to map raw orders to full orders
  _mapFullOrders: (rawOrders: any[]): VendorFullOrder[] => {
    return rawOrders.map((o) => {
      const customerUser = db.users.find((u) => u.id === o.customerId);
      const orderItems = db.orderItems.filter((oi) => oi.orderId === o.id);
      const items = orderItems.map((oi) => {
        const menuItem = db.menuItems.find((mi) => mi.id === oi.menuId);
        return {
          name: menuItem?.name || "Unknown Item",
          qty: oi.quantity,
          price: Number(oi.unitPrice),
          image: menuItem?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
        };
      });

      return {
        id: o.id,
        shortId: o.shortId,
        customerId: o.customerId,
        customerName: customerUser?.fullName || "Customer",
        customerLocation: "Bole, ASTU Area", // Mocked location
        itemCount: items.reduce((acc, i) => acc + i.qty, 0),
        totalAmount: Number(o.totalAmount),
        totalPrice: Number(o.totalAmount),
        status: o.status,
        time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeElapsed: "10 mins ago",
        items,
        createdAt: o.createdAt
      };
    });
  },

  // Internal helper to recalculate stats and lists from a source of full orders
  _recalculateFromOrders: (allOrders: any[]) => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = allOrders.filter((o) => o.createdAt?.startsWith(today));
    
    const stats: VendorStats = {
      todayOrders: todayOrders.length,
      pendingOrders: allOrders.filter((o) => 
        ["CREATED", "AWAITING_ACCEPT", "ASSIGNED", "VENDOR_BEING_PREPARED", "ACCEPTED", "PREPARING", "READY"].includes(o.status)
      ).length,
      completedOrders: allOrders.filter((o) => 
        ["DELIVERED", "COMPLETED", "RECEIVED", "PICKED_UP"].includes(o.status)
      ).length,
      totalRevenue: allOrders
        .filter((o) => ["DELIVERED", "COMPLETED", "RECEIVED", "PAYMENT_RECEIVED", "PICKED_UP"].includes(o.status))
        .reduce((acc, o) => acc + Number(o.totalAmount), 0),
    };

    const recentOrdersMapped: VendorOrder[] = allOrders
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 10)
      .map((o) => ({
        id: o.id,
        shortId: o.shortId,
        customerName: o.customerName,
        itemCount: o.itemCount,
        totalAmount: o.totalAmount,
        status: o.status,
        time: o.time,
      }));

    set({ 
      stats, 
      recentOrders: recentOrdersMapped, 
      availableOrders: allOrders.filter(o => ["CREATED", "AWAITING_ACCEPT", "PENDING"].includes(o.status)),
      activeOrders: allOrders.filter(o => ["ACCEPTED", "PREPARING", "READY"].includes(o.status)),
    });
  },

  toggleMenuAvailability: (itemId: string) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    }));
  },

  acceptOrder: (orderId: string) => {
    const currentOrders = [...get().availableOrders, ...get().activeOrders];
    const updatedAll = currentOrders.map(o => 
      o.id === orderId ? { ...o, status: "ACCEPTED" } : o
    );
    get()._recalculateFromOrders(updatedAll);
  },

  declineOrder: (orderId: string) => {
    const currentOrders = [...get().availableOrders, ...get().activeOrders];
    const updatedAll = currentOrders.filter(o => o.id !== orderId);
    get()._recalculateFromOrders(updatedAll);
  },

  updateOrderStatus: (orderId: string, status: string) => {
    const currentOrders = [...get().availableOrders, ...get().activeOrders];
    const updatedAll = currentOrders.map(o => 
      o.id === orderId ? { ...o, status } : o
    );
    get()._recalculateFromOrders(updatedAll);
  },
}));
