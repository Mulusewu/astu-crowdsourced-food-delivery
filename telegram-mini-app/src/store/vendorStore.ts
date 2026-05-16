import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface VendorUser {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  avatar?: string;
  roles: string[];
  activeRole: string;
  createdAt: string;
  isVerified: boolean;
  restaurantId: string;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    completionRate: number;
  };
  businessHours: Record<string, string>;
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface VendorOrder {
  id: string;
  orderNo: string;
  customerName: string;
  items: number;
  totalAmount: number;
  status: "new" | "preparing" | "ready" | "completed" | "cancelled";
  timeElapsed: number; // in minutes
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  inStock: boolean;
}

interface VendorState {
  vendor: VendorUser | null;
  isActive: boolean;
  activeOrders: VendorOrder[];
  menuItems: MenuItem[];
  analytics: any | null;
  earnings: any | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVendorData: (vendorId?: string) => Promise<void>;
  toggleActiveStatus: () => void;
  updateOrderStatus: (orderId: string, newStatus: VendorOrder["status"]) => void;
  declineOrder: (orderId: string) => void;
  toggleMenuItemStock: (itemId: string) => void;
  addMenuItem: (item: Omit<MenuItem, "id" | "inStock">, customId?: string) => void;
  updateMenuItem: (itemId: string, item: Partial<Omit<MenuItem, "id">>) => void;
  updateVendor: (updates: Partial<VendorUser>) => Promise<void>;
  logout: () => void;
}


export const useVendorStore = create<VendorState>()(
  persist(
    (set: any, get: any) => ({
      vendor: null as VendorUser | null,
      isActive: true as boolean,
      activeOrders: [] as VendorOrder[],
      menuItems: [] as MenuItem[],
      analytics: null as any | null,
      earnings: null as any | null,
      isLoading: false as boolean,
      error: null as string | null,

      fetchVendorData: async (vendorId = "vend_001") => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);
          
          const vendorData = db.users.vendors.find((v: any) => v.id === vendorId);
          if (!vendorData) throw new Error("Vendor not found");

          // Find restaurant to extract menu items (from DB or mock)
          const restaurant = db.restaurants.find((r: any) => r.id === vendorData.restaurantId);
          
          // Try to get menu from restaurant object or db.menu, or mock it
          let rawMenu: any[] = [];
          if (restaurant && Array.isArray((restaurant as any).menu)) {
            rawMenu = (restaurant as any).menu;
          } else if (db.menu && !Array.isArray(db.menu)) {
            rawMenu = (db.menu as any)[vendorData.restaurantId] || [];
          } else if (Array.isArray(db.menu)) {
            rawMenu = (db.menu as any[]).filter((m: any) => m.restaurantId === vendorData.restaurantId);
          }

          const menuItems: MenuItem[] = rawMenu.length > 0 ? rawMenu.map(m => ({
            id: m.id,
            name: m.name,
            price: Number(m.price) || 0,
            image: m.image || m.imageUrl || "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
            inStock: true
          })) : ((db as any).vendorDashboard?.menuItems || []);

          const baseStats = vendorData.stats || {};
          const mockAnalytics = {
            today: {
              revenue: (baseStats.totalRevenue * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              orders: Math.floor(baseStats.totalOrders * 0.05),
              customers: Math.floor(baseStats.totalOrders * 0.04),
              revenueChange: "+12.5%",
              ordersChange: "+8.2%",
              revenueGrowing: true,
            },
            month: {
              revenue: (baseStats.totalRevenue * 0.4).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              orders: Math.floor(baseStats.totalOrders * 0.4),
              customers: Math.floor(baseStats.totalOrders * 0.35),
              revenueChange: "+24.3%",
              ordersChange: "+18.7%",
              revenueGrowing: true,
            },
            year: {
              revenue: baseStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              orders: baseStats.totalOrders,
              customers: Math.floor(baseStats.totalOrders * 0.8),
              revenueChange: "-2.1%",
              ordersChange: "+5.4%",
              revenueGrowing: false,
            }
          };

          const mockEarnings = {
            today: {
              earnings: (baseStats.totalRevenue * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              orders: Math.floor(baseStats.totalOrders * 0.05),
              transactions: [
                { id: 1, type: "Order Revenue", time: "2:30 PM", amount: `+${(baseStats.totalRevenue * 0.03).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 2, type: "Order Revenue", time: "11:15 AM", amount: `+${(baseStats.totalRevenue * 0.02).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              ]
            },
            month: {
              earnings: (baseStats.totalRevenue * 0.4).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              orders: Math.floor(baseStats.totalOrders * 0.4),
              transactions: [
                { id: 1, type: "Order Revenue", time: "Today, 2:30 PM", amount: `+${(baseStats.totalRevenue * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 2, type: "Order Revenue", time: "Today, 11:15 AM", amount: `+${(baseStats.totalRevenue * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 3, type: "Order Revenue", time: "Yesterday", amount: `+${(baseStats.totalRevenue * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 4, type: "Order Revenue", time: "2 days ago", amount: `+${(baseStats.totalRevenue * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              ]
            },
            year: {
              earnings: baseStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              orders: baseStats.totalOrders,
              transactions: [
                { id: 1, type: "Order Revenue", time: "May 15", amount: `+${(baseStats.totalRevenue * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 2, type: "Order Revenue", time: "May 14", amount: `+${(baseStats.totalRevenue * 0.3).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 3, type: "Order Revenue", time: "April", amount: `+${(baseStats.totalRevenue * 0.25).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
                { id: 4, type: "Order Revenue", time: "March", amount: `+${(baseStats.totalRevenue * 0.25).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              ]
            }
          };

          set({
            vendor: vendorData as VendorUser,
            activeOrders: (db as any).vendorDashboard?.activeOrders || [],
            menuItems,
            analytics: mockAnalytics,
            earnings: mockEarnings,
            isLoading: false
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to load vendor data", isLoading: false });
        }
      },

      toggleActiveStatus: () => {
        set((state: VendorState) => ({ isActive: !state.isActive }));
      },

      updateOrderStatus: (orderId: string, newStatus: VendorOrder["status"]) => {
        set((state: VendorState) => ({
          activeOrders: state.activeOrders.map((order: VendorOrder) => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        }));
      },

      declineOrder: (orderId: string) => {
        set((state: VendorState) => ({
          activeOrders: state.activeOrders.filter((order: VendorOrder) => order.id !== orderId)
        }));
      },

      toggleMenuItemStock: (itemId: string) => {
        set((state: VendorState) => ({
          menuItems: state.menuItems.map((item: MenuItem) =>
            item.id === itemId ? { ...item, inStock: !item.inStock } : item
          )
        }));
      },

      addMenuItem: (item: Omit<MenuItem, "id" | "inStock">, customId?: string) => {
        const newItem: MenuItem = {
          ...item,
          id: customId || `m${Date.now()}`,
          inStock: true
        };
        set((state: VendorState) => ({
          menuItems: [...state.menuItems, newItem]
        }));
      },

      updateMenuItem: (itemId: string, updatedItem: Partial<Omit<MenuItem, "id">>) => {
        set((state: VendorState) => ({
          menuItems: state.menuItems.map((item: MenuItem) =>
            item.id === itemId ? { ...item, ...updatedItem } : item
          )
        }));
      },

      updateVendor: async (updates: Partial<VendorUser>) => {
        set({ isLoading: true });
        try {
          await delay(800); // Simulate network delay
          set((state: VendorState) => ({
            vendor: state.vendor ? { ...state.vendor, ...updates } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: "Failed to update vendor", isLoading: false });
        }
      },

      logout: () => {
        set({
          vendor: null,
          activeOrders: [],
          menuItems: [],
          analytics: null,
          earnings: null,
          error: null,
          isActive: false
        });
      }
    }),
    {
      name: "vendor-storage",
      partialize: (state: any) => ({
        vendor: state.vendor,
        isActive: state.isActive,
        menuItems: state.menuItems,
        activeOrders: state.activeOrders,
        analytics: state.analytics,
        earnings: state.earnings,
      })
    }
  )
);
