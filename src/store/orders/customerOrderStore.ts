import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";
import { io, Socket } from 'socket.io-client';

export type OrderStatus =
  | "CREATED" | "AWAITING_VENDOR" | "AWAITING_ACCEPT" | "ASSIGNED" | "AWAITING_PAYMENT"
  | "PAYMENT_RECEIVED" | "VENDOR_BEING_PREPARED" | "VENDOR_FINISHED"
  | "VENDOR_READY_FOR_PICKUP" | "PICKED_UP" | "EN_ROUTE" | "ARRIVED"
  | "RECEIVED" | "DELIVERED" | "COMPLETED" | "DISPUTED" | "CANCELLED"
  | "NO_DELIVERER_FOUND";

export type PaymentStatus = "AWAITING_PAYMENT" | "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";

// Lightweight summary returned by GET /orders
export interface OrderSummary {
  id: string;
  shortId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  restaurant: { name: string };
  customer?: { user: { fullName: string }, defaultLocation: string };
  _count: { items: number };
  estimatedDeliveryTime?: string; // Optional if you add ETA fields to list later
}

export interface OrderDetails extends OrderSummary {
  items: { menuId: string, name: string, quantity: number, unitPrice: number, imageUrl: string }[];
  deliveryFee: number;
  serviceFee: number;
  foodPrice: number;
  otpCode: string;
  deliverer?: { user: { fullName: string, phoneNumber: string, avatarUrl: string }, rating: number };
  customer?: { user: { fullName: string }, defaultLocation: string };
  estimatedDeliveryTime?: string;
  estimatedReadyAt?: string;
}

interface CustomerOrderState {
  orders: OrderSummary[];
  currentOrderDetails: OrderDetails | null;
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;

  fetchCustomerOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  
  // Real-Time WebSockets Integration Hook
  connectToTracking: (orderId: string) => void; // NEW
  disconnectTracking: () => void; // NEW
  updateOrderStatusFromSocket: (orderId: string, newStatus: OrderStatus) => void;
  
  clearError: () => void;
}
 
export const useCustomerOrderStore = create<CustomerOrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrderDetails: null,
      isLoading: false,
      error: null,
      socket: null,

      fetchCustomerOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          // Backend defaults to roleAs: CUSTOMER if not provided, but we are explicit
          const res = await apiClient.get('/orders', { 
            params: { roleAs: 'CUSTOMER', limit: 50 } // Adjust limit/pagination as needed
          });
          
          set({ orders: res.data.orders, isLoading: false });
        } catch (e: any) {
          set({ 
            error: e.response?.data?.message || "Failed to load orders", 
            isLoading: false 
          });
        }
      },

      fetchOrderDetails: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.get(`/orders/${orderId}`);
          
          // Map backend deep payload to frontend UI expectations
          const order = res.data.data;
          const mappedDetails: OrderDetails = {
            id: order.id,
            shortId: order.shortId,
            status: order.status,
            totalAmount: order.totalAmount,
            foodPrice: order.foodPrice,
            deliveryFee: order.deliveryFee,
            serviceFee: order.serviceFee,
            otpCode: order.otpCode,
            createdAt: order.createdAt,
            restaurant: { name: order.restaurant.name },
            customer: { 
              user: { fullName: order.customer?.user?.fullName || "" },
              defaultLocation: order.customer?.defaultLocation || ""
            },
            _count: { items: order.items.length },
            items: order.items.map((i: any) => ({
              menuId: i.product.id, // Assuming backend includes product id
              name: i.product.name,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              imageUrl: i.product.imageUrl
            })),
            estimatedReadyAt: order.estimatedReadyAt,
            // Map Deliverer details safely (Backend hides phone until picked up)
            deliverer: order.deliverer ? {
              user: {
                fullName: order.deliverer.user.fullName,
                phoneNumber: order.deliverer.user.phoneNumber || "",
                avatarUrl: order.deliverer.user.avatarUrl || ""
              },
              rating: Number(order.deliverer.rating)
            } : undefined
          };

          set({ currentOrderDetails: mappedDetails, isLoading: false });
        } catch (e: any) {
          set({ error: "Failed to load order details", isLoading: false });
        }
      },
      cancelOrder: async (orderId, reason = "Customer cancelled via app") => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post(`/orders/${orderId}/cancel`, { reason });
          
          // Optimistic update
          set((s) => ({
            orders: s.orders.map((o) => 
              o.id === orderId ? { ...o, status: "CANCELLED" } : o
            ),
            isLoading: false
          }));
        } catch (e: any) {
          set({ 
            error: e.response?.data?.message || "Failed to cancel order", 
            isLoading: false 
          });
          throw e; // Throw so UI can toast error
        }
      },

      connectToTracking: async (orderId: string) => {
        const { socket: currentSocket } = get();
        if (currentSocket) currentSocket.disconnect(); // Clean up old sockets

        // Initialize connection
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        // Extract base URL without the /api/v1 path
        const BASE_URL = API_URL.replace('/api/v1', '');
        
        // Grab token directly from localStorage (because persist saves it there)
        const storageStr = localStorage.getItem('auth-storage');
        let token = '';
        if (storageStr) {
          const parsed = JSON.parse(storageStr);
          token = parsed.state?.token || '';
        }

        const newSocket = io(BASE_URL, {
          auth: { token },
          withCredentials: true // Important for sticky sessions if you add load balancers later
        });

        newSocket.on('connect', () => {
          console.log('[WS] Connected to live tracking');
          // Tell backend which order we are looking at
          newSocket.emit('track_order', orderId);
        });

        // Listen for status bumps from Vendor or Deliverer
        newSocket.on('ORDER_STATUS_UPDATE', async (payload) => {
          console.log('[WS] Order Update Received:', payload);
          get().updateOrderStatusFromSocket(payload.orderId, payload.status);

        const triggersDeepFetch = ['ASSIGNED', 'PICKED_UP', 'COMPLETED', 'CANCELLED', 'DISPUTED'];
          if (triggersDeepFetch.includes(payload.status)) {
            // We do not set isLoading=true here because we don't want the UI to flash to a loading skeleton.
            // We just fetch it silently and overwrite the currentOrderDetails when it arrives.
            try {
              const res = await apiClient.get(`/orders/${payload.orderId}`);
              const order = res.data.data;
              
              // Apply the same rigorous mapping as fetchOrderDetails
              const mappedDetails: OrderDetails = {
                id: order.id,
                shortId: order.shortId,
                status: order.status,
                totalAmount: order.totalAmount,
                foodPrice: order.foodPrice,
                deliveryFee: order.deliveryFee,
                serviceFee: order.serviceFee,
                otpCode: order.otpCode,
                createdAt: order.createdAt,
                restaurant: { name: order.restaurant.name },
                customer: { 
                  user: { fullName: order.customer?.user?.fullName || "" },
                  defaultLocation: order.customer?.defaultLocation || ""
                },
                _count: { items: order.items.length },
                items: order.items.map((i: any) => ({
                  menuId: i.product.id,
                  name: i.product.name,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                  imageUrl: i.product.imageUrl
                })),
                estimatedReadyAt: order.estimatedReadyAt,
                deliverer: order.deliverer ? {
                  user: {
                    fullName: order.deliverer.user.fullName,
                    phoneNumber: order.deliverer.user.phoneNumber || "",
                    avatarUrl: order.deliverer.user.avatarUrl || ""
                  },
                  rating: Number(order.deliverer.rating)
                } : undefined
              };

              set({ currentOrderDetails: mappedDetails });
            } catch (e) {
              console.error("[WS] Silently failed to fetch deep payload update", e);
            }
          }
        });

        // NEW: Listen for Live GPS Updates from the Deliverer
        newSocket.on('DELIVERER_LOCATION_UPDATE', (payload) => {
           console.log('[WS] Deliverer Location Update:', payload);
           // In Phase 2, you will pipe payload.lat and payload.lng to your Google Maps / Leaflet component here.
           // You can store it in a volatile state variable in this store: `liveDelivererCoords: {lat, lng}`
        });

        set({ socket: newSocket });
      },

      disconnectTracking: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },

      updateOrderStatusFromSocket: (orderId, newStatus) => {
        set((state) => {
          // 1. Update the list view
          const updatedOrders = state.orders.map((o) => 
            o.id === orderId ? { ...o, status: newStatus } : o
          );

          // 2. Update the deep view if currently open
          let updatedDetails = state.currentOrderDetails;
          if (updatedDetails && updatedDetails.id === orderId) {
            updatedDetails = { ...updatedDetails, status: newStatus };
          }

          return { orders: updatedOrders, currentOrderDetails: updatedDetails };
        });
      },


      clearError: () => set({ error: null }),
    }),
    {
      name: "customer-order-storage",
      // Only cache the raw orders to make the UI feel fast on boot
      partialize: (s) => ({ orders: s.orders }),
      
    }
  )
);