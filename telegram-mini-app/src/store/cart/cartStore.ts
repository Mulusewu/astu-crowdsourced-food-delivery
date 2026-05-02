import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  discountPercent?: number;
  quantity: number;
  image?: string;
  description?: string;
  restaurantId: string;
  restaurantName: string;
  specialInstructions?: string;
  modifiers?: Array<{
    name: string;
    price: number;
  }>;
  options?: Record<string, string>;
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
  restaurant: RestaurantInfo | null;
  isLoading: boolean;
  error: string | null;
  appliedPromo: {
    code: string;
    discount: number;
    type: "percentage" | "fixed";
    description?: string;
  } | null;

  // Basic actions
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void; // Added UI compatibility alias
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSpecialInstructions: (itemId: string, instructions: string) => void;
  updateItemOptions: (itemId: string, options: Record<string, string>) => void;
  clearCart: () => void;
  setRestaurant: (restaurant: RestaurantInfo) => void;

  // Promo actions
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;

  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: (itemId: string) => number;
  getSavings: () => number;

  // Cart management
  isCartEmpty: () => boolean;
  canAddMoreItems: () => boolean;
  canCheckout: () => { allowed: boolean; reason?: string };

  // Bulk operations
  addMultipleItems: (items: CartItem[]) => void;
  updateCartItems: (items: CartItem[]) => void;

  // Helpers
  clearError: () => void;
}

// Delivery fee constants
const DEFAULT_DELIVERY_FEE = 30;
const FREE_DELIVERY_THRESHOLD = 200;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      restaurant: null,
      isLoading: false,
      error: null,
      appliedPromo: null,

      addToCart: (newItem) => {
        const { items: _items, restaurant } = get();
        const quantity = newItem.quantity || 1;

        // Note: UI components (RestaurantDetails/FoodDetails) should check for 
        // restaurant mismatch before calling addToCart to show a nice modal.
        if (restaurant && restaurant.id !== newItem.restaurantId) {
          // Silent clear if mismatch - UI should have warned the user
          set({ items: [], restaurant: null, appliedPromo: null });
        }

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id,
          );

          const finalPrice = newItem.discountPrice || newItem.price;

          // Calculate item total with modifiers

          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
              specialInstructions:
                newItem.specialInstructions || existingItem.specialInstructions,
              modifiers: newItem.modifiers || existingItem.modifiers,
              options: newItem.options || existingItem.options,
            };
            return { items: updatedItems };
          } else {
            // Add new item
            const newCartItem: CartItem = {
              ...newItem,
              quantity,
              price: finalPrice,
            };

            return {
              items: [...state.items, newCartItem],
            };
          }
        });

        // Set restaurant info if not already set
        const { restaurant: currentRestaurant } = get();
        if (!currentRestaurant) {
          // This would ideally fetch from database
          set({
            restaurant: {
              id: newItem.restaurantId,
              name: newItem.restaurantName,
              deliveryFee: DEFAULT_DELIVERY_FEE,
              minimumOrder: 50,
              freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
              deliveryTime: "20-30 min",
            },
          });
        }
      },

      // Added UI compatibility alias pointing to addToCart
      addItem: (newItem) => {
        get().addToCart(newItem);
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== itemId);
          return {
            items: updatedItems,
            restaurant: updatedItems.length === 0 ? null : state.restaurant,
            appliedPromo: updatedItems.length === 0 ? null : state.appliedPromo,
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        }));
      },

      updateSpecialInstructions: (itemId, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, specialInstructions: instructions }
              : item,
          ),
        }));
      },

      updateItemOptions: (itemId, options) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, options: { ...item.options, ...options } }
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], restaurant: null, appliedPromo: null });
      },

      setRestaurant: (restaurant) => {
        set({ restaurant });
      },

      applyPromoCode: async (code) => {
        set({ isLoading: true, error: null });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const { restaurant: _restaurant, getSubtotal } = get();
        const subtotal = getSubtotal();

        // Mock promo validation from database.json
        if (code === "WELCOME20") {
          set({
            appliedPromo: {
              code,
              discount: 20,
              type: "percentage",
              description: "20% off your entire order",
            },
            isLoading: false,
          });
          return true;
        } else if (code === "FREEDELIVERY") {
          const deliveryFee = get().getDeliveryFee();
          set({
            appliedPromo: {
              code,
              discount: deliveryFee,
              type: "fixed",
              description: "Free delivery on this order",
            },
            isLoading: false,
          });
          return true;
        } else if (code === "FIRSTORDER" && subtotal >= 100) {
          set({
            appliedPromo: {
              code,
              discount: 50,
              type: "fixed",
              description: "ETB 50 off your first order",
            },
            isLoading: false,
          });
          return true;
        }

        set({ error: "Invalid or expired promo code", isLoading: false });
        return false;
      },

      removePromoCode: () => {
        set({ appliedPromo: null });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        let subtotal = 0;
        get().items.forEach((item) => {
          let itemPrice = item.discountPrice || item.price;
          let itemTotal = itemPrice * item.quantity;

          // Add modifier prices
          if (item.modifiers && item.modifiers.length > 0) {
            itemTotal += item.modifiers.reduce(
              (sum, mod) => sum + mod.price,
              0,
            );
          }

          subtotal += itemTotal;
        });
        return Math.round(subtotal * 100) / 100;
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;

        if (!promo) return 0;

        if (promo.type === "percentage") {
          return Math.round(subtotal * (promo.discount / 100) * 100) / 100;
        }

        return Math.min(promo.discount, subtotal);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const finalAmount = subtotal - discount;

        if (finalAmount === 0) return 0;

        const { restaurant } = get();
        const threshold =
          restaurant?.freeDeliveryThreshold || FREE_DELIVERY_THRESHOLD;

        if (finalAmount >= threshold) return 0;

        return restaurant?.deliveryFee || DEFAULT_DELIVERY_FEE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const deliveryFee = get().getDeliveryFee();
        return Math.round((subtotal - discount + deliveryFee) * 100) / 100;
      },

      getItemCount: (itemId) => {
        const item = get().items.find((item) => item.id === itemId);
        return item?.quantity || 0;
      },

      getSavings: () => {
        let originalTotal = 0;
        get().items.forEach((item) => {
          let originalPrice = item.originalPrice || item.price;
          if (item.discountPercent) {
            originalPrice = item.price / (1 - item.discountPercent / 100);
          }
          originalTotal += originalPrice * item.quantity;
        });
        const currentTotal = get().getSubtotal();
        return Math.round((originalTotal - currentTotal) * 100) / 100;
      },

      isCartEmpty: () => {
        return get().items.length === 0;
      },

      canAddMoreItems: () => {
        return get().items.length < 50;
      },

      canCheckout: () => {
        const { items, restaurant } = get();

        if (items.length === 0) {
          return { allowed: false, reason: "Your cart is empty" };
        }

        const subtotal = get().getSubtotal();
        const minimumOrder = restaurant?.minimumOrder || 50;

        if (subtotal < minimumOrder) {
          return {
            allowed: false,
            reason: `Minimum order amount is ETB ${minimumOrder}. Add ETB ${(minimumOrder - subtotal).toFixed(2)} more`,
          };
        }

        return { allowed: true };
      },

      addMultipleItems: (items) => {
        set((state) => ({
          items: [...state.items, ...items],
        }));
      },

      updateCartItems: (items) => {
        set({ items });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        restaurant: state.restaurant,
        appliedPromo: state.appliedPromo,
      }),
    },
  ),
);
