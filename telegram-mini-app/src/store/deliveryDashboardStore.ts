import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  stats: {
    deliveriesToday: number;
    earningsToday: number;
    totalDeliveries: number;
    totalEarnings: number;
    rating: number;
  };
}

export interface Cafe {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  distance: string;
  estimatedTime: number;
  rating: number;
  isBookmarked: boolean;
  acceptsCash: boolean;
  acceptsCard: boolean;
  minimumOrder: number;
  cuisine: string[];
  activeOrders: number;
}

export interface CheapOrder {
  id: string;
  orderNo: string;
  items: number;
  priceEtb: number;
  image: string;
}

type OrderStatus =
  | "pending"
  | "accepted"
  | "awaiting_payment"
  | "paid"
  | "in_progress"
  | "completed"
  | "cancelled";

type CustomerActivity = "idle" | "viewing" | "paying";

interface DeliveryDashboardState {
  deliveryPerson: DeliveryPerson | null;
  cafes: Cafe[];
  cheapOrders: CheapOrder[];
  isLoading: boolean;
  
  // Payment-waiting state
  orderStatus: OrderStatus;
  paymentTimer: number; // seconds
  customerActivity: CustomerActivity;

  // Actions
  fetchDashboardData: (userId?: string) => Promise<void>;
  toggleActiveStatus: (navigate?: (path: string) => void) => void;
  toggleBookmark: (cafeId: string) => void;
  setOrderStatus: (status: OrderStatus) => void;
  decreasePaymentTimer: () => void;
  resetPaymentTimer: (seconds?: number) => void;
  setCustomerActivity: (activity: CustomerActivity) => void;
}

export const useDeliveryDashboardStore = create<DeliveryDashboardState>()(
  persist(
    (set, get) => ({
      deliveryPerson: null,
      cafes: [],
      cheapOrders: [],
      isLoading: true,

      // Payment-waiting defaults
      orderStatus: "pending",
      paymentTimer: 300, 
      customerActivity: "idle",

      fetchDashboardData: async (userId?: string) => {
        set({ isLoading: true });

        try {
          await delay(800);

          let deliveryUser = null;
          if (userId) {
            deliveryUser = db.users.delivery?.find((u: any) => u.id === userId);
            if (!deliveryUser) {
              deliveryUser = db.users.multiRole?.find((u: any) => u.id === userId);
            }
          }
          
          const dashboardData = db.deliveryDashboard;
          
          // Use auth user data if available, otherwise fallback to dashboard default
          // Merge stats carefully to include both total stats from user and today's stats from dashboard
          const deliveryPersonData = deliveryUser 
            ? { 
                ...deliveryUser, 
                ...dashboardData.deliveryPerson, 
                id: deliveryUser.id, 
                name: deliveryUser.name, 
                email: deliveryUser.email,
                stats: {
                  ...dashboardData.deliveryPerson.stats,
                  ...(deliveryUser.stats || {})
                }
              }
            : dashboardData.deliveryPerson;

          if (dashboardData) {
            set({
              deliveryPerson: deliveryPersonData as DeliveryPerson,
              cheapOrders: dashboardData.cheapOrders as CheapOrder[],
              cafes: dashboardData.cafes as Cafe[],
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          set({ isLoading: false });
        }
      },

      toggleActiveStatus: (navigate) => {
        const { deliveryPerson } = get();
        if (deliveryPerson) {
          const willBeOnline = !deliveryPerson.isActive;
          set({
            deliveryPerson: {
              ...deliveryPerson,
              isActive: willBeOnline,
            },
          });

          if (!willBeOnline && navigate) {
            navigate("/delivery/offline");
          }
        }
      },

      toggleBookmark: (cafeId: string) => {
        set((state) => ({
          cafes: state.cafes.map((cafe) =>
            cafe.id === cafeId
              ? { ...cafe, isBookmarked: !cafe.isBookmarked }
              : cafe
          ),
        }));
      },

      setOrderStatus: (status) => set({ orderStatus: status }),

      decreasePaymentTimer: () =>
        set((state) => ({
          paymentTimer: Math.max(0, state.paymentTimer - 1),
        })),

      resetPaymentTimer: (seconds = 300) => set({ paymentTimer: seconds }),

      setCustomerActivity: (activity) => set({ customerActivity: activity }),
    }),

    {
      name: "delivery-dashboard-storage",
      partialize: (state) => ({
        deliveryPerson: state.deliveryPerson,
        cafes: state.cafes,
        orderStatus: state.orderStatus,
        paymentTimer: state.paymentTimer,
        customerActivity: state.customerActivity,
      }),
    },
  ),
);
