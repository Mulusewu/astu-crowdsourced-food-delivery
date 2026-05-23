import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";
import { useAuthStore } from "@/store/auth/authStore";
import { io, Socket } from "socket.io-client";

export interface KitchenOrder {
  id: string;
  shortId: string;
  status: string;
  items: { name: string; quantity: number }[];
  delivererName: string;
  customerName: string;
  createdAt: string;
  estimatedReadyAt?: string;
}

interface VendorOrderState {
  kitchenQueue: KitchenOrder[];
  isLoading: boolean;
  socket: Socket | null;

  fetchKitchenQueue: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, estimatedPrepTimeMins?: number) => Promise<void>;
  
  acceptOrder: (orderId: string, estimatedPrepTimeMins?: number) => Promise<void>;
  rejectOrder: (orderId: string, reason: string) => Promise<void>;

  connectVendorSocket: () => void;
  disconnectVendorSocket: () => void;
}

export const useVendorOrderStore = create<VendorOrderState>((set, get) => ({
  kitchenQueue: [],
  isLoading: false,
  socket: null,

  fetchKitchenQueue: async () => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      const restaurantId = user?.vendorProfile?.restaurantId;
      if (!restaurantId) return set({ isLoading: false });

      // Hits our dedicated operational endpoint
      const res = await apiClient.get(`/orders/kitchen-queue/${restaurantId}`);
      const queue = res.data.data.map((o: any) => ({
        id: o.id,
        shortId: o.shortId,
        status: o.status,
        items: o.items.map((i: any) => ({ name: i.product.name, quantity: i.quantity,imageUrl: i.product.imageUrl })),
        delivererName: o.deliverer?.user?.fullName || "Awaiting Deliverer",
        customerName:  "Customer",
        createdAt: o.createdAt,
        estimatedReadyAt: o.estimatedReadyAt || "15 mins"
      }));

      set({ kitchenQueue: queue, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId, status, estimatedPrepTimeMins) => {
    try {
      // Optimistic update
      set(s => ({
        kitchenQueue: s.kitchenQueue.map(o => o.id === orderId ? { ...o, status } : o)
      }));

      await apiClient.patch(`/orders/${orderId}/state/vendor`, { 
        status, 
        estimatedPrepTimeMins 
      });

      // If marked Ready for Pickup, we could optionally remove it from the strict kitchen queue view
      if (status === 'VENDOR_READY_FOR_PICKUP') {
         set(s => ({ kitchenQueue: s.kitchenQueue.filter(o => o.id !== orderId) }));
      }

    } catch (error) {
      get().fetchKitchenQueue(); // Rollback on failure
      throw error;
    }
  },
 acceptOrder: async (orderId, estimatedPrepTimeMins = 20) => {
    try {
      set(s => ({
        kitchenQueue: s.kitchenQueue.map(o => o.id === orderId ? { ...o, status: "AWAITING_ACCEPT" } : o)
      }));
      await apiClient.post(`/orders/${orderId}/vendor-accept`, { estimatedPrepTimeMins });
    } catch (error) {
      get().fetchKitchenQueue(); 
      throw error;
    }
  },

  // NEW METHOD: Hits POST /orders/:id/vendor-reject
  rejectOrder: async (orderId, reason) => {
    try {
      set(s => ({ kitchenQueue: s.kitchenQueue.filter(o => o.id !== orderId) }));
      await apiClient.post(`/orders/${orderId}/vendor-reject`, { reason });
    } catch (error) {
      get().fetchKitchenQueue(); 
      throw error;
    }
  },

  connectVendorSocket: () => {
    const { socket: currentSocket } = get();
    if (currentSocket) currentSocket.disconnect();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const BASE_URL = API_URL.replace('/api/v1', '');
    
    // const storageStr = localStorage.getItem('auth-storage');
    // const token = storageStr ? JSON.parse(storageStr).state?.token : '';

    let token = useAuthStore.getState().token;
    if (!token) {
      const storageStr = localStorage.getItem('auth-storage');
      if (storageStr) {
        try {
          token = JSON.parse(storageStr).state?.token;
        } catch (e) {}
      }
    }

    if (!token) {
      console.error("❌ [VENDOR WS] Cannot connect: No token available in authStore");
      return;
    }
     console.log(`🔌 [VENDOR WS] Attempting to connect...`);

    const newSocket = io(BASE_URL, { 
      auth: { token },
      extraHeaders: { Authorization: `Bearer ${token}` },
      query: { mode: 'VENDOR_STAFF' }, withCredentials: true ,
    transports: ['websocket', 'polling'] });

     newSocket.on('connect', () => {
          console.log('🟢 [VENDOR WS] Connected to Server successfully. Socket ID:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('🔴 [VENDOR WS] Connection Error:', err.message);
    });

    // When the webhook updates an order to PAYMENT_RECEIVED, we refresh the kitchen queue
    newSocket.on('ORDER_STATUS_UPDATE', async (payload) => {
      console.log('🚨 [VENDOR WS] Payload Received:', payload)

        if (['AWAITING_VENDOR', 'PAYMENT_RECEIVED'].includes(payload.status)) {
         const existing = get().kitchenQueue.find(o => o.id === payload.orderId);
         
         if (existing) {
           console.log('[VENDOR WS] Order already in queue. Updating status locally.');
           set(s => ({
             kitchenQueue: s.kitchenQueue.map(o => o.id === payload.orderId ? { ...o, status: payload.status } : o)
           }));
         } else {
           console.log(`[VENDOR WS] New Order! Fetching details for ${payload.orderId}...`);
           try {
             const res = await apiClient.get(`/orders/${payload.orderId}`);
             const o = res.data.data;
             
             console.log(`[VENDOR WS] Details Fetched Successfully:`, o.shortId);
             
             const newKitchenOrder = {
                id: o.id,
                shortId: o.shortId,
                status: o.status,
                items: o.items.map((i: any) => ({ 
                  name: i.product?.name || i.name, 
                  quantity: i.quantity, 
                  imageUrl: i.product?.imageUrl || i.imageUrl 
                })),
                delivererName: o.deliverer?.user?.fullName || "Awaiting Deliverer",
                customerName: o.customer?.user?.fullName || "Customer",
                createdAt: o.createdAt,
                estimatedReadyAt: o.estimatedReadyAt || "15 mins"
             };

             set(s => ({ kitchenQueue: [...s.kitchenQueue, newKitchenOrder] }));
           } catch (e: any) {
             console.error("🔥 [VENDOR WS] Fetch Failed:", e.response?.data || e.message);
           }
         }
      } else if (payload.status === 'CANCELLED') {
        console.log(`[VENDOR WS] Order ${payload.orderId} was cancelled. Removing from queue.`);
        set(s => ({ kitchenQueue: s.kitchenQueue.filter(o => o.id !== payload.orderId) }));
      }
    });

    set({ socket: newSocket });
      },

  disconnectVendorSocket: () => {
    get().socket?.disconnect();
    set({ socket: null });
  }
}));