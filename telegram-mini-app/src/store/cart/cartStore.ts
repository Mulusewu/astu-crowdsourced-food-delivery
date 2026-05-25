/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";
import { useRestaurantStore } from "../restaurantStore";
import { useAuthStore } from "../auth/authStore";
import { useCustomerStore } from "../customer/customerStore";


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
  refreshQuote: () => Promise<unknown>;
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
        const { items, restaurantId, tip } = get();
        let { deliveryLat, deliveryLng } = get();
        
        if (items.length === 0) return set({ quote: null });
        
        // Try to get coordinates from the customer's default block address if not set
        if (!deliveryLat || !deliveryLng) {
          const defaultAddr = useCustomerStore.getState().getDefaultAddress();
          if (defaultAddr) {
            deliveryLat = defaultAddr.latitude;
            deliveryLng = defaultAddr.longitude;
          }
        }

        // if (!restaurantId || !deliveryLat || !deliveryLng ) {
        //   // Cannot quote without location
        //   return; 
        // }

        set({ isLoading: true, error: null });
        try {
          const payload = {
            restaurantId,
            deliveryLat,
            deliveryLng,
            tip,
            items: items.map(i => ({
              menuId: i.menuId,
              quantity: i.quantity,
              expectedUnitPrice: i.expectedUnitPrice
            }))
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
        const { items, restaurantId, tip } = get();
        let { deliveryLat, deliveryLng } = get();
        
        // Resolve coordinates from default address

        
        if (!deliveryLat || !deliveryLng) {
          const defaultAddr = useCustomerStore.getState().getDefaultAddress();
          if (defaultAddr) {
            deliveryLat = defaultAddr.latitude;
            deliveryLng = defaultAddr.longitude;
          }
        }
        console.log(deliveryLat, deliveryLng);
        
        if (items.length === 0 || !restaurantId || !deliveryLat || !deliveryLng) {
          set({ error: "Please select a delivery address to checkout.", isLoading: false });
          return null;
        }

        set({ isLoading: true, error: null });
        try {
          const payload = {
            restaurantId,
            deliveryLat,
            deliveryLng,
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

      reorderPastOrder: async (restaurantId: string, items: { menuId: string, quantity: number }[]) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Ask the backend for the CURRENT prices of these items
          // Since we built the `fetchActiveMenuItems` in the backend Quote engine, 
          // we can just throw this at the quote endpoint.
          
          // Note: To quote, we need a generic delivery location if they haven't set one
          const { user } = useAuthStore.getState();
          const deliveryLat = 8.563; // Campus Center
          const deliveryLng = 39.291;
          
          // We don't know the expectedUnitPrice yet!
          // We have to build a new backend route or modify the quote engine to return prices.
          // FOR NOW: We will rely on the `searchDiscovery` or `fetchRestaurantDetails` to fetch the current prices first.
          
          const { fetchRestaurantDetails } = useRestaurantStore.getState();
          await fetchRestaurantDetails(restaurantId);
          const currentMenu = useRestaurantStore.getState().currentRestaurant?.menu || [];
          
          const updatedItems = [];
          for (const pastItem of items) {
             const currentItem = currentMenu.find(m => m.id === pastItem.menuId);
             if (!currentItem || !currentItem.isAvailable) {
               throw new Error(`Item is no longer available.`);
             }
             updatedItems.push({
               menuId: currentItem.id,
               name: currentItem.name,
               expectedUnitPrice: currentItem.price, // ACTUAL LIVE PRICE
               quantity: pastItem.quantity,
               image: currentItem.image,
               restaurantId
             });
          }

          // Override cart
          set({ items: updatedItems, restaurantId });
          
          // Trigger quote
          await get().refreshQuote();
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || "Failed to reorder. Items may be out of stock." });
          throw error;
        }
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