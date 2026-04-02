import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/database.json";

// Types
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  address: string;
}

export interface OrderHistory {
  id: string;
  orderNumber: string;
  restaurantName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveredAt: string;
  rating: number;
  review: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  cafeId: string;
  cafeName: string;
  cafeImage: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "picked_up"
    | "delivered"
    | "cancelled";
  paymentMethod: "cash" | "card" | "telegram_stars";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  estimatedDeliveryTime?: string;
  distance: string;
  isBookmarked: boolean;
  priority: boolean;
  specialInstructions?: string | null;
  progress?: {
    acceptedAt?: string;
    pickedUpAt?: string;
    startedAt?: string;
    estimatedArrival?: string;
  };
}

export interface Cafe {
  id: string;
  name: string;
}

type SecondaryFilterType = "price_asc" | "price_desc" | "nearby" | "priority";

interface OrderStore {
  // State
  orders: Order[];
  filteredOrders: Order[];
  activeOrders: Order[];
  orderHistory: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Pagination
  page: number;
  hasMore: boolean;

  // Filters
  selectedCafe: string;
  secondaryFilter: SecondaryFilterType;

  // Actions
  fetchAvailableOrders: () => Promise<void>;
  fetchActiveOrders: () => Promise<void>;
  fetchOrderHistory: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  loadMoreOrders: () => Promise<void>;

  // Filter actions
  setSelectedCafe: (cafeId: string) => void;
  setSecondaryFilter: (filter: SecondaryFilterType) => void;

  // Order actions
  toggleBookmark: (orderId: string) => void;
  acceptOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string, reason: string) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
  ) => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;

  // Helpers
  clearError: () => void;
  clearCurrentOrder: () => void;
}

// Helper function to filter orders
const filterOrders = (
  orders: Order[],
  selectedCafe: string,
  secondaryFilter: SecondaryFilterType,
): Order[] => {
  let filtered = [...orders];

  // Filter by cafe
  if (selectedCafe !== "all") {
    filtered = filtered.filter((order) => order.cafeId === selectedCafe);
  }

  // Apply secondary filter
  switch (secondaryFilter) {
    case "nearby":
      filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      break;
    case "price_asc":
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
      break;
    case "priority":
      filtered = filtered.filter((order) => order.priority === true);
      break;
    default:
      break;
  }

  return filtered;
};

// Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      filteredOrders: [],
      activeOrders: [],
      orderHistory: [],
      currentOrder: null,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      page: 1,
      hasMore: true,
      selectedCafe: "all",
      secondaryFilter: "nearby",

      // Fetch available orders
      fetchAvailableOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(800);

          // Get available orders from db.json
          const availableOrders = db.orders.available as Order[];

          // Ensure all orders have required fields with defaults
          const normalizedOrders = availableOrders.map((order) => ({
            ...order,
            isBookmarked: order.isBookmarked ?? false,
            priority: order.priority ?? false,
            distance: order.distance ?? "1.0 km",
            specialInstructions: order.specialInstructions ?? null,
          }));

          set({
            orders: normalizedOrders,
            filteredOrders: filterOrders(
              normalizedOrders,
              get().selectedCafe,
              get().secondaryFilter,
            ),
            isLoading: false,
            page: 1,
            hasMore: normalizedOrders.length >= 10,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch orders",
            isLoading: false,
          });
        }
      },

      // Fetch active orders
      fetchActiveOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);

          const activeOrders = db.orders.active as Order[];

          const normalizedOrders = activeOrders.map((order) => ({
            ...order,
            isBookmarked: order.isBookmarked ?? false,
            priority: order.priority ?? false,
            distance: order.distance ?? "1.0 km",
          }));

          set({
            activeOrders: normalizedOrders,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch active orders",
            isLoading: false,
          });
        }
      },

      // Fetch order history
      fetchOrderHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);

          const historyOrders = db.orders.history as Order[];

          const normalizedOrders = historyOrders.map((order) => ({
            ...order,
            isBookmarked: order.isBookmarked ?? false,
            priority: order.priority ?? false,
            distance: order.distance ?? "1.0 km",
            customer: order.customer ?? {
              id: "unknown",
              name: "Unknown",
              address: "Unknown",
            },
          }));

          set({
            orderHistory: normalizedOrders,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch order history",
            isLoading: false,
          });
        }
      },

      // Fetch single order by ID
      fetchOrderById: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          await delay(400);

          // Search in all order collections
          const allOrders = [
            ...(db.orders.available || []),
            ...(db.orders.active || []),
            ...(db.orders.history || []),
          ] as Order[];

          const order = allOrders.find((o) => o.id === orderId);

          if (!order) {
            throw new Error("Order not found");
          }

          set({
            currentOrder: order,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch order",
            isLoading: false,
          });
        }
      },

      // Load more orders (pagination)
      loadMoreOrders: async () => {
        const { page, hasMore, isLoadingMore, orders } = get();

        if (!hasMore || isLoadingMore) return;

        set({ isLoadingMore: true });

        try {
          await delay(800);

          // Simulate loading next page
          const nextPage = page + 1;
          const newOrders = generateMoreMockOrders(nextPage, 5);

          const updatedOrders = [...orders, ...newOrders];

          set({
            orders: updatedOrders,
            filteredOrders: filterOrders(
              updatedOrders,
              get().selectedCafe,
              get().secondaryFilter,
            ),
            page: nextPage,
            hasMore: nextPage < 5,
            isLoadingMore: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load more orders",
            isLoadingMore: false,
          });
        }
      },

      // Set selected cafe filter
      setSelectedCafe: (cafeId: string) => {
        set({ selectedCafe: cafeId });

        const { orders, secondaryFilter } = get();
        set({
          filteredOrders: filterOrders(orders, cafeId, secondaryFilter),
        });
      },

      // Set secondary filter
      setSecondaryFilter: (filter: SecondaryFilterType) => {
        set({ secondaryFilter: filter });

        const { orders, selectedCafe } = get();
        set({
          filteredOrders: filterOrders(orders, selectedCafe, filter),
        });
      },

      // Toggle bookmark
      toggleBookmark: (orderId: string) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? { ...order, isBookmarked: !order.isBookmarked }
              : order,
          );

          return {
            orders: updatedOrders,
            filteredOrders: filterOrders(
              updatedOrders,
              state.selectedCafe,
              state.secondaryFilter,
            ),
          };
        });
      },

      // Accept order
      acceptOrder: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);

          const order = get().orders.find((o) => o.id === orderId);

          if (!order) {
            throw new Error("Order not found");
          }

          const updatedOrder = {
            ...order,
            status: "confirmed" as const,
            progress: {
              acceptedAt: new Date().toISOString(),
            },
          };

          set((state) => {
            const updatedOrders = state.orders.filter((o) => o.id !== orderId);
            const updatedActive = [...state.activeOrders, updatedOrder];

            return {
              orders: updatedOrders,
              activeOrders: updatedActive,
              filteredOrders: filterOrders(
                updatedOrders,
                state.selectedCafe,
                state.secondaryFilter,
              ),
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to accept order",
            isLoading: false,
          });
        }
      },

      // Reject order
      rejectOrder: async (orderId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);

          set((state) => {
            const updatedOrders = state.orders.filter((o) => o.id !== orderId);

            return {
              orders: updatedOrders,
              filteredOrders: filterOrders(
                updatedOrders,
                state.selectedCafe,
                state.secondaryFilter,
              ),
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to reject order",
            isLoading: false,
          });
        }
      },

      // Update order status
      updateOrderStatus: async (orderId: string, status: Order["status"]) => {
        set({ isLoading: true, error: null });
        try {
          await delay(400);

          set((state) => {
            const updatedActive = state.activeOrders.map((o) =>
              o.id === orderId ? { ...o, status } : o,
            );

            const updatedCurrent =
              state.currentOrder?.id === orderId
                ? { ...state.currentOrder, status }
                : state.currentOrder;

            return {
              activeOrders: updatedActive,
              currentOrder: updatedCurrent,
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update order status",
            isLoading: false,
          });
        }
      },

      // Cancel order
      cancelOrder: async (orderId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
          await delay(600);

          set((state) => {
            const updatedActive = state.activeOrders.filter(
              (o) => o.id !== orderId,
            );

            return {
              activeOrders: updatedActive,
              currentOrder:
                state.currentOrder?.id === orderId ? null : state.currentOrder,
              isLoading: false,
            };
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to cancel order",
            isLoading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Clear current order
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: "order-storage",
      partialize: (state) => ({
        selectedCafe: state.selectedCafe,
        secondaryFilter: state.secondaryFilter,
      }),
    },
  ),
);

// Helper to generate mock orders for pagination
function generateMoreMockOrders(page: number, count: number): Order[] {
  const cafes = [
    {
      id: "rest_001",
      name: "Kaldi's Coffee",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100",
    },
    {
      id: "rest_002",
      name: "Yod Abyssinia",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100",
    },
    {
      id: "rest_003",
      name: "Tomoca Coffee",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100",
    },
  ];

  const foodImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100",
  ];

  const customerNames = ["Abebe Kebede", "Sara Hailu", "Meron Tadesse"];
  const addresses = [
    "Bole Atlas, 4th floor",
    "CMC Road, near Piassa",
    "Ayat Heights, Building B",
  ];
  const phones = ["+251911123456", "+251912987654", "+251913456789"];

  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const index = (page - 1) * count + i;
    const cafe = cafes[index % cafes.length];
    const custIndex = index % customerNames.length;

    orders.push({
      id: `order-mock-${Date.now()}-${index}`,
      orderNumber: `ORD-${2024}${String(index + 100).padStart(4, "0")}`,
      cafeId: cafe.id,
      cafeName: cafe.name,
      cafeImage: cafe.image,
      customer: {
        id: `cust-mock-${index}`,
        name: customerNames[custIndex],
        address: addresses[custIndex],
        phone: phones[custIndex],
      },
      items: [
        {
          id: `item-${index}-0`,
          name: ["Espresso", "Cappuccino", "Latte", "Burger"][
            Math.floor(Math.random() * 4)
          ],
          quantity: Math.floor(Math.random() * 2) + 1,
          price: 45 + Math.floor(Math.random() * 100),
          image: foodImages[Math.floor(Math.random() * foodImages.length)],
        },
      ],
      totalAmount: 45 + Math.floor(Math.random() * 150),
      status: "pending",
      paymentMethod: ["cash", "card", "telegram_stars"][
        Math.floor(Math.random() * 3)
      ] as "cash" | "card" | "telegram_stars",
      paymentStatus: Math.random() > 0.3 ? "paid" : "pending",
      createdAt: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      ).toISOString(),
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
      isBookmarked: Math.random() > 0.7,
      priority: Math.random() > 0.8,
      specialInstructions:
        Math.random() > 0.8 ? "Please call before arriving" : null,
    });
  }

  return orders;
}
