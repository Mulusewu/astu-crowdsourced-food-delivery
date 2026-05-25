import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";
import { useOrderStore, type OrderStatus } from "./orderStore";
import { ROUTES } from "@/routes/routePaths";

export interface OrderDetailItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface DetailedOrder {
  id: string;
  shortId: string;
  status: OrderStatus;
  restaurantName: string;
  customerAddress: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  distance: string; // Formatted distance
  estimatedDeliveryTime: string | null;
  items: OrderDetailItem[];
}

interface OrderDetailsState {
  order: DetailedOrder | null;
  isLoading: boolean;
  isAccepting: boolean;
  error: string | null;

  fetchOrderDetails: (orderId: string) => Promise<void>;
  acceptOrder: (navigate: (path: string) => void) => Promise<void>;
  declineOrder: (navigate: (path: string) => void) => void;
  clearState: () => void;
}

export const useOrderDetailsStore = create<OrderDetailsState>((set, get) => ({
  order: null,
  isLoading: false,
  isAccepting: false,
  error: null,

  fetchOrderDetails: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      const raw = res.data.data;

      const mappedOrder: DetailedOrder = {
        id: raw.id,
        shortId: raw.shortId,
        status: raw.status,
        restaurantName: raw.restaurant.name,
        customerAddress: raw.customer?.customerProfile?.defaultLocation || "ASTU Campus",
        subtotal: Number(raw.foodPrice),
        deliveryFee: Number(raw.deliveryFee),
        totalAmount: Number(raw.totalAmount),
        distance: "Campus Bound", // Can be computed if needed via geolocation
        estimatedDeliveryTime: raw.estimatedDeliveryTime || "25",
        items: raw.items.map((i: any) => ({
          id: i.id,
          name: i.product.name,
          price: Number(i.unitPrice),
          quantity: i.quantity,
          image: i.product.imageUrl || "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80"
        }))
      };

      set({ order: mappedOrder, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.message || "Failed to load order", isLoading: false });
    }
  },

  acceptOrder: async (navigate) => {
    const { order } = get();
    if (!order) return;

    set({ isAccepting: true, error: null });
    try {
      // 1. Call the backend Atomic Lock with orderid as body
      await apiClient.post(`/dispatch/${order.id}/accept`, {orderId : order.id});
      
      // // 2. Refresh the global Order Store to fetch the new Active Delivery
      // await useOrderStore.getState().fetchActiveOrders();

      useOrderStore.setState((s) => ({
        activeOrders: [{
          id: order.id,
          shortId: order.shortId,
          status: 'ASSIGNED',
          totalAmount: order.totalAmount,
          customer: { user: { phoneNumber: "Hidden until Picked Up" } },
          items: order.items,
          createdAt: new Date().toISOString()
        }]
      }));

      set({ isAccepting: false });
      
      // 3. Navigate to the waiting room
      navigate(ROUTES.DELIVERY.ACTIVE.DETAILS.replace(':orderId', order.id));

      useOrderStore.getState().fetchActiveOrders().catch(console.error);

      
    } catch (e: any) {
      set({ error: e.response?.data?.message || "Failed to accept. Order may have been taken.", isAccepting: false });
      throw e;
    }
  },

  declineOrder: (navigate) => {
    const { order } = get();
    if (!order) return;

    // We do not have a dedicated backend route for declining unassigned orders.
    // We simply hide it from the Deliverer's local feed.
    const { rawOrders, secondaryFilter, _applyLocalSort } = useOrderStore.getState();
    const updatedRaw = rawOrders.filter(o => o.id !== order.id);
    
    useOrderStore.setState({
      rawOrders: updatedRaw,
      filteredOrders: _applyLocalSort(updatedRaw, secondaryFilter)
    });

    set({ order: null });
    navigate(ROUTES.DELIVERY.DASHBOARD);
  },

  clearState: () => set({ order: null, error: null, isAccepting: false })
}));