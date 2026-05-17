/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";


export interface CartItem {
  menuId: string;
  name: string;
  expectedUnitPrice: number; // Required by backend anti-spoofing
  quantity: number;
  image?: string;
  restaurantId: string;
}

export interface CartQuote {
  foodPrice: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  totalAmount: number;
  distanceMeters: number;
  payoutAmount?: number;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  deliveryFee: number;
  minimumOrder: number;
  freeDeliveryThreshold: number;
  deliveryTime: string;
  rating?: number;
}
interface CartState {
  // State
  items: CartItem[];
  restaurantId: string | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  tip: number;
  
  quote: CartQuote | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getTotalItems: () => number;
  setDeliveryLocation: (lat: number, lng: number) => void;
  setTip: (tip: number) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;

  // Backend Integration
  refreshQuote: () => Promise<null>;
  checkout: () => Promise<string | null>; // Returns the orderId on success
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      restaurantId: null,
      deliveryLat: null,
      deliveryLng: null,
      tip: 0,
      quote: null,
      isLoading: false,
      error: null,


      getTotalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),

      addToCart: (newItem) => {
        const state = get();
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
        
        // Prevent cross-restaurant ordering
        if (state.restaurantId && state.restaurantId !== newItem.restaurantId) {
          set({ error: "You can only order from one restaurant at a time. Clear your cart to start a new order." });
          return;
        }

        const existingItemIndex = state.items.findIndex(i => i.menuId === newItem.menuId);
        const updatedItems = [...state.items];

        if (existingItemIndex >= 0) {
          updatedItems[existingItemIndex].quantity += (newItem.quantity || 1);
        } else {
          updatedItems.push({ ...newItem, quantity: newItem.quantity || 1 });
        }

        set({ items: updatedItems, restaurantId: newItem.restaurantId });
        get().refreshQuote();
      },

      removeFromCart: (menuId) => {
        const updatedItems = get().items.filter(i => i.menuId !== menuId);
        if (updatedItems.length === 0) {
          set({ items: [], restaurantId: null, quote: null });
        } else {
          set({ items: updatedItems });
          get().refreshQuote();
        }
      },

      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(menuId);
          return;
        }
        set(state => ({
          items: state.items.map(i => i.menuId === menuId ? { ...i, quantity } : i)
        }));
        get().refreshQuote();
      },

      clearCart: () => {
        set({ items: [], restaurantId: null, quote: null, error: null, tip: 0 });
      },

      refreshQuote: async () => {
        const { items, restaurantId, deliveryLat, deliveryLng, tip } = get();
        
        if (items.length === 0) return set({ quote: null });
        // if (!restaurantId || !deliveryLat || !deliveryLng ) {
        //   // Cannot quote without location (Wait until customer selects dorm)
        //   return; 
        // }

        // mock data 


        set({ isLoading: true, error: null });
        try {
          const payload = {
            restaurantId,
            deliveryLat,
            deliveryLng,
            items: items.map(i => ({
              menuId: i.menuId,
              quantity: i.quantity,
              expectedUnitPrice: i.expectedUnitPrice
            })),
            tip
          };

          const res = await apiClient.post('/orders/quote', payload);
          set({ quote: res.data.data, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || "Failed to calculate price. Restaurant might be closed.", 
            quote: null, 
            isLoading: false 
          });
        }
      },

      checkout: async () => {
        const { items, restaurantId, deliveryLat, deliveryLng, tip } = get();
        console.log({ items, restaurantId, deliveryLat, deliveryLng, tip });
        
        if (items.length === 0 || !restaurantId || !deliveryLat || !deliveryLng) return null;

        set({ isLoading: true, error: null });
        try {
          const payload = {
            restaurantId,
            deliveryLat: 8.562387,
            deliveryLng: 38.753949,
            tip,
            items: items.map(i => ({
              menuId: i.menuId,
              quantity: i.quantity,
              expectedUnitPrice: i.expectedUnitPrice
            }))
          };

          const res = await apiClient.post('/orders/checkout', payload);
          get().clearCart();
          return res.data.data.id; // Return the created Order ID for routing
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Checkout failed", isLoading: false });
          return null;
        }
      },

      setDeliveryLocation: (lat, lng) => {
        set({ deliveryLat: lat, deliveryLng: lng });
        get().refreshQuote();
      },

      setTip: (tip) => {
        set({ tip });
        get().refreshQuote();
      },

      clearError: () => set({ error: null })
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId,
        // Don't persist Quotes or delivery coords across sessions as they expire
      }),
    }
  )
); 