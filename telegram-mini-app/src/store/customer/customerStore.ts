// src/store/customer/customerStore.ts
import { create } from "zustand";

interface CustomerState {
  user: any | null;
  favorites: string[]; // restaurant IDs
  addresses: any[];
  paymentMethods: any[];

  setUser: (user: any) => void;
  toggleFavorite: (restaurantId: string) => void;
  addAddress: (address: any) => void;
  addPaymentMethod: (method: any) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  user: null,
  favorites: [],
  addresses: [],
  paymentMethods: [],

  setUser: (user) => set({ user }),
  toggleFavorite: (restaurantId) =>
    set((state) => ({
      favorites: state.favorites.includes(restaurantId)
        ? state.favorites.filter((id) => id !== restaurantId)
        : [...state.favorites, restaurantId],
    })),
  addAddress: (address) =>
    set((state) => ({ addresses: [...state.addresses, address] })),
  addPaymentMethod: (method) =>
    set((state) => ({ paymentMethods: [...state.paymentMethods, method] })),
}));
