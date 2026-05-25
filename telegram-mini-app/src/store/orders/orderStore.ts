import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";
import { io, Socket } from "socket.io-client";
import { useDeliveryDashboardStore } from "../deliveryDashboardStore";

// ─── Backend Aligned Types ─────────────────────────────────────────────────────

export type OrderStatus =
  | "CREATED" | "AWAITING_ACCEPT" | "AWAITING_VENDOR" | "ASSIGNED" | "AWAITING_PAYMENT"
  | "PAYMENT_RECEIVED" | "VENDOR_BEING_PREPARED" | "VENDOR_FINISHED"
  | "VENDOR_READY_FOR_PICKUP" | "PICKED_UP" | "EN_ROUTE" | "ARRIVED"
  | "RECEIVED" | "DELIVERED" | "COMPLETED" | "DISPUTED" | "CANCELLED"
  | "NO_DELIVERER_FOUND";

export interface AvailableOrder {
  id: string;
  shortId: string;
  totalAmount: number;
  deliveryFee: number;
  itemCount: number;
  restaurantName: string;
  restaurantImageUrl: string | null;
  createdAt: string;
  lat?: number;
  lng?: number;
  distanceToRestaurantMeters?: number; // Injected by WS Broadcast
}

export interface OrderHistoryItem {
  id: string;
  shortId: string;
  restaurantName: string;
  restaurantImageUrl: string | null;
  firstItemName: string; // Mapped to "X Items" from backend summary
  firstItemImageUrl: string | null;
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: string;
  rating: number | null;
}

type SecondaryFilterType = "price_asc" | "price_desc" | "nearby" | "priority";

interface OrderStoreState {
  // States
  rawOrders: AvailableOrder[];
  filteredOrders: AvailableOrder[];
  activeOrders: any[]; // Array of 0 or 1 to satisfy UI iterators
  orderHistory: OrderHistoryItem[];
  currentOrder: any | null; // Deep details view
  
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  
  selectedCafe: string;
  secondaryFilter: SecondaryFilterType;
  socket: Socket | null;

  // Fetchers
  fetchAvailableOrders: () => Promise<void>;
  loadMoreOrders: () => Promise<void>;
  fetchActiveOrders: () => Promise<void>; // Fetches the single active delivery
  fetchOrderHistory: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  fetchOrderReceipt: (orderId: string) => Promise<any | null>;
  
  // UI Filters
  setSelectedCafe: (cafeId: string) => void;
  setSecondaryFilter: (filter: SecondaryFilterType) => void;
  _applyLocalSort: (orders: AvailableOrder[], filter: SecondaryFilterType) => AvailableOrder[];

  // Deliverer Logistics Actions
  acceptOrder: (orderId: string) => Promise<void>;
  dropOrder: (orderId: string, reason: string) => Promise<void>; // Replaces rejectOrder
  updateOrderStatus: (orderId: string, status: OrderStatus, lat?: number, lng?: number) => Promise<void>;
  completeOrder: (orderId: string, otpCode: string) => Promise<void>;
  reportUnfulfillable: (orderId: string, reason: string, details?: string) => Promise<void>; // Replaces submitOrderIssue
  
  // WebSockets
  connectDispatchSocket: () => void;
  disconnectDispatchSocket: () => void;

  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      rawOrders: [],
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
      secondaryFilter: "priority",
      socket: null,

      _applyLocalSort: (orders, filter) => {
        const sorted = [...orders];
        switch (filter) {
          case "price_asc": return sorted.sort((a, b) => a.totalAmount - b.totalAmount);
          case "price_desc": return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
          case "nearby":
            return sorted.sort((a, b) => (a.distanceToRestaurantMeters || 9999) - (b.distanceToRestaurantMeters || 9999));
          case "priority":
          default:
            return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
      },

      // ==========================================
      // FETCHERS
      // ==========================================
      fetchAvailableOrders: async () => {
        const { selectedCafe, secondaryFilter } = get();
        set({ isLoading: true, error: null, page: 1 });

        try {
          const params: any = { status: "AWAITING_ACCEPT", roleAs: "DELIVERER", limit: 20, page: 1 };
          if (selectedCafe !== "all") params.restaurantId = selectedCafe;

          const res = await apiClient.get('/orders', { params });
          
          const mappedOrders: AvailableOrder[] = res.data.orders.map((o: any) => ({
            id: o.id,
            shortId: o.shortId,
            totalAmount: Number(o.totalAmount),
            deliveryFee: Number(o.deliveryFee),
            itemCount: o._count?.items || 1,
            restaurantName: o.restaurant?.name || "Restaurant",
            createdAt: o.createdAt,
            restaurantImageUrl: "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80&w=200"
          }));

          const sortedOrders = get()._applyLocalSort(mappedOrders, secondaryFilter);
          set({ rawOrders: mappedOrders, filteredOrders: sortedOrders, isLoading: false, hasMore: res.data.orders.length === 20 });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to fetch orders", isLoading: false });
        }
      },

      loadMoreOrders: async () => {
        const { selectedCafe, secondaryFilter, page, hasMore, isLoadingMore, rawOrders } = get();
        if (!hasMore || isLoadingMore) return;

        set({ isLoadingMore: true });
        const nextPage = page + 1;

        try {
          const params: any = { status: "AWAITING_ACCEPT", roleAs: "DELIVERER", limit: 20, page: nextPage };
          if (selectedCafe !== "all") params.restaurantId = selectedCafe;

          const res = await apiClient.get('/orders', { params });
          const newOrders = res.data.orders;
          
          const mappedOrders: AvailableOrder[] = newOrders.map((o: any) => ({
            id: o.id,
            shortId: o.shortId,
            totalAmount: Number(o.totalAmount),
            deliveryFee: Number(o.deliveryFee),
            itemCount: o._count?.items || 1,
            restaurantName: o.restaurant?.name || "Restaurant",
            createdAt: o.createdAt,
            restaurantImageUrl: "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80&w=200"
          }));

          const combined = [...rawOrders, ...mappedOrders];
          set({ rawOrders: combined, filteredOrders: get()._applyLocalSort(combined, secondaryFilter), page: nextPage, isLoadingMore: false, 
             hasMore: newOrders.length === 20  });
        } catch (e) {
          set({ isLoadingMore: false, hasMore: false });
        }
      },

      fetchActiveOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          // Backend ensures a deliverer only has ONE active delivery
          const res = await apiClient.get('/orders/active-delivery');
          const activeOrder = res.data.data;
          
          set({ 
            activeOrders: activeOrder ? [activeOrder] : [], 
            isLoading: false 
          });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to fetch active delivery", isLoading: false });
        }
      },

      fetchOrderHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          // Fetch past orders
          const params = { roleAs: "DELIVERER", limit: 50 }; // Add status filter array if backend supports it, otherwise backend returns all
          const res = await apiClient.get('/orders', { params });
          
          const historyStatuses = ["DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED", "NO_DELIVERER_FOUND"];
          const history = res.data.orders
            .filter((o: any) => historyStatuses.includes(o.status))
            .map((o: any): OrderHistoryItem => ({
              id: o.id,
              shortId: o.shortId,
              restaurantName: o.restaurant?.name || "Restaurant",
              restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200",
              firstItemName: `${o._count?.items || 1} Items`, // UI Fallback
              firstItemImageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200",
              totalAmount: Number(o.totalAmount),
              deliveryFee: Number(o.deliveryFee),
              status: o.status,
              createdAt: o.createdAt,
              rating: null // Could pull from detailed fetch if needed
            }));

          set({ orderHistory: history, isLoading: false });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to fetch history", isLoading: false });
        }
      },

      fetchOrderById: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.get(`/orders/${orderId}`);
          set({ currentOrder: res.data.data, isLoading: false });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to load details", isLoading: false });
        }
      },
       fetchOrderReceipt: async (orderId: string) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      return res.data.data;
    } catch (e) {
      return null;
    }
  },


      // ==========================================
      // LOGISTICS ACTIONS
      // ==========================================
      acceptOrder: async (orderId) => {
        const { activeOrders } = get();
        if (activeOrders.length > 0) {
          set({ error: "You already have an active delivery. Complete it first." });
          throw new Error("ACTIVE_DELIVERY_EXISTS");
        }

        set({ isLoading: true, error: null });
        try {
          // Atomic Lock in Backend
          await apiClient.post(`/dispatch/${orderId}/accept`);
          
          // Refresh state
          await get().fetchActiveOrders();
          await get().fetchAvailableOrders();
          
          // Remove from available lists
          set(s => {
            const updatedRaw = s.rawOrders.filter(o => o.id !== orderId);
            return {
              rawOrders: updatedRaw,
              filteredOrders: get()._applyLocalSort(updatedRaw, s.secondaryFilter),
              isLoading: false
            };
          });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to accept order. Someone else may have taken it.", isLoading: false });
          throw e;
        }
      },

      dropOrder: async (orderId, reason) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post(`/orders/${orderId}/drop`, { reason });
          
          set({ activeOrders: [], currentOrder: null, isLoading: false });
          get().fetchAvailableOrders(); // Refresh available pool
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to drop order", isLoading: false });
          throw e;
        }
      },

      updateOrderStatus: async (orderId, status, lat = 0, lng = 0) => {
        set({ isLoading: true, error: null });
        try {
          // Backend expects GPS coordinates for fraud check if status === 'PICKED_UP'
          await apiClient.patch(`/orders/${orderId}/state/deliverer`, { 
            status, currentLat: lat, currentLng: lng 
          });

          // Optimistic UI Update
          set(s => ({
            activeOrders: s.activeOrders.map(o => o.id === orderId ? { ...o, status } : o),
            currentOrder: s.currentOrder?.id === orderId ? { ...s.currentOrder, status } : s.currentOrder,
            isLoading: false
          }));
        } catch (e: any) {
          set({ error: e.response?.data?.message || "State transition failed", isLoading: false });
          throw e;
        }
      },

      completeOrder: async (orderId, otpCode) => {
        set({ isLoading: true, error: null });
        try {
          // Cryptographic Handshake
          await apiClient.post(`/orders/${orderId}/confirm-handshake`, { otpCode });

          // Refresh state completely
          await get().fetchActiveOrders(); // Will clear activeOrders array
          set((s) => ({
            currentOrder: s.currentOrder ? { ...s.currentOrder, status: 'COMPLETED' } : null,
            // Remove from active list
            activeOrders: s.activeOrders.filter(o => o.id !== orderId) 
          }));
          await get().fetchOrderHistory(); // Will move it to history

          set({  isLoading: false });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Handshake failed. Invalid PIN.", isLoading: false });
          throw e;
        }
      },

      reportUnfulfillable: async (orderId, reason, details) => {
        set({ isLoading: true, error: null });
        try {
          // Maps to 'RESTAURANT_CLOSED' | 'OUT_OF_STOCK' | 'PRICE_MISMATCH'
          await apiClient.post(`/orders/${orderId}/unfulfillable`, { reason, details });
          
          set({ activeOrders: [], currentOrder: null, isLoading: false });
        } catch (e: any) {
          set({ error: e.response?.data?.message || "Failed to report issue", isLoading: false });
          throw e;
        }
      },

      // ==========================================
      // WEBSOCKET BROADCAST ENGINE
      // ==========================================
      connectDispatchSocket: () => {
        const { socket: currentSocket } = get();
        if (currentSocket) currentSocket.disconnect();

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const BASE_URL = API_URL.replace('/api/v1', '');
        
        const storageStr = localStorage.getItem('auth-storage');
        let token = '';
        if (storageStr) token = JSON.parse(storageStr).state?.token || '';

        const newSocket = io(BASE_URL, { auth: { token }, query:{mode:'DELIVERER'}, withCredentials: true });

        newSocket.on('connect', () => console.log('[WS] Connected to Dispatch Engine globally'));

        // Listen for new orders popping up!
        newSocket.on('ORDER_BROADCAST', (payload) => {
          console.log('🚨 NEW ORDER BROADCAST RECEIVED:', payload);
          set(s => {
            // Prevent duplicate injections
            if (s.rawOrders.some(o => o.id === payload.orderId)) return s;

            const newAvailable: AvailableOrder = {
              id: payload.orderId,
              shortId: payload.shortId,
              totalAmount: payload.earnings.totalPayout,
              deliveryFee: payload.earnings.deliveryFee,
              itemCount: payload.itemCount,
              restaurantName: payload.restaurant.name,
              restaurantImageUrl: "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80",
              createdAt: payload.createdAt,
              distanceToRestaurantMeters: payload.distanceToRestaurantMeters
            };

            const updatedRaw = [newAvailable, ...s.rawOrders];

             const { dashboardOrders } = useDeliveryDashboardStore.getState();

            //  useDeliveryDashboardStore.getState().injectDashboardOrder(newAvailable);

            useDeliveryDashboardStore.setState({
              dashboardOrders: [
                {
                  id: newAvailable.id,
                  shortId: newAvailable.shortId,
                  restaurantName: newAvailable.restaurantName,
                  restaurantImageUrl: newAvailable.restaurantImageUrl,
                  itemCount: newAvailable.itemCount,
                  totalAmount: newAvailable.totalAmount,
                  deliveryFee: newAvailable.deliveryFee,
                  firstItemImageUrl: newAvailable.restaurantImageUrl
                },
                ...dashboardOrders
              ].slice(0, 6) // Keep dashboard limited to 6 items
            });


            return {
              rawOrders: updatedRaw,
              filteredOrders: get()._applyLocalSort(updatedRaw, s.secondaryFilter)
            };
          });
        });

        // Listen for orders being taken by others or cancelled
        newSocket.on('ORDER_STATUS_UPDATE', (payload) => {
          if (payload.status !== 'AWAITING_ACCEPT') {
            set(s => {
              const updatedRaw = s.rawOrders.filter(o => o.id !== payload.orderId);
              // useDeliveryDashboardStore.getState().removeDashboardOrder(payload.orderId);
               const { dashboardOrders } = useDeliveryDashboardStore.getState();
              useDeliveryDashboardStore.setState({
                dashboardOrders: dashboardOrders.filter(o => o.id !== payload.orderId)
              });
              return {
                rawOrders: updatedRaw,
                filteredOrders: get()._applyLocalSort(updatedRaw, s.secondaryFilter)
              };
            });
          }
        });

        set({ socket: newSocket });
      },

      disconnectDispatchSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },

      // UI Helpers
      setSelectedCafe: (cafeId) => {
        set({ selectedCafe: cafeId });
        set({ filteredOrders: get()._applyLocalSort(get().rawOrders.filter(o => cafeId === 'all' || o.id === cafeId), get().secondaryFilter) });
      },
      setSecondaryFilter: (filter) => {
        set({ secondaryFilter: filter });
        set({ filteredOrders: get()._applyLocalSort(get().rawOrders, filter) });
      },
      clearError: () => set({ error: null }),
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: "deliverer-order-storage",
      partialize: (s) => ({
        selectedCafe: s.selectedCafe,
        secondaryFilter: s.secondaryFilter,
      }),
    }
  )
);