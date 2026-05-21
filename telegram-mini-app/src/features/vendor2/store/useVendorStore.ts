import { create } from 'zustand';

export interface VendorOrder {
  id: string;
  orderNumber: string;
  itemsCount: number;
  totalPrice: number;
  currency: string;
  imageUrl: string;
  status: 'available' | 'preparing' | 'ready' | 'completed';
}

interface VendorState {
  orders: VendorOrder[];
  isShopOpen: boolean;
  setOrders: (orders: VendorOrder[]) => void;
  toggleShopStatus: () => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  orders: [
    {
      id: '1',
      orderNumber: '123',
      itemsCount: 3,
      totalPrice: 310,
      currency: 'ETB',
      imageUrl: 'https://images.unsplash.com/photo-1512058560366-cd242d458690?w=400&q=80',
      status: 'available',
    },
    {
      id: '2',
      orderNumber: '234',
      itemsCount: 1,
      totalPrice: 110,
      currency: 'ETB',
      imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80',
      status: 'available',
    },
    {
      id: '3',
      orderNumber: '345',
      itemsCount: 2,
      totalPrice: 210,
      currency: 'ETB',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
      status: 'available',
    },
    {
      id: '4',
      orderNumber: '456',
      itemsCount: 1,
      totalPrice: 120,
      currency: 'ETB',
      imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&q=80',
      status: 'available',
    },
    {
      id: '5',
      orderNumber: '345', // Duplicated in screenshot
      itemsCount: 2,
      totalPrice: 210,
      currency: 'ETB',
      imageUrl: 'https://images.unsplash.com/photo-1512058560366-cd242d458690?w=400&q=80',
      status: 'available',
    },
    {
      id: '6',
      orderNumber: '567',
      itemsCount: 1,
      totalPrice: 120,
      currency: 'ETB',
      imageUrl: 'https://images.unsplash.com/photo-1541518763531-d3a3b3d799c5?w=400&q=80',
      status: 'available',
    },
  ],
  isShopOpen: true,
  setOrders: (orders) => set({ orders }),
  toggleShopStatus: () => set((state) => ({ isShopOpen: !state.isShopOpen })),
}));
