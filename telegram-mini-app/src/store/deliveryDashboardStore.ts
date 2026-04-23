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
  fetchDashboardData: () => Promise<void>;
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

      fetchDashboardData: async () => {
        set({ isLoading: true });

        try {
          await delay(800);

          const data = db.deliveryDashboard;
          if (data) {
            set({
              deliveryPerson: data.deliveryPerson as DeliveryPerson,
              cheapOrders: data.cheapOrders as CheapOrder[],
              cafes: data.cafes as Cafe[],
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
