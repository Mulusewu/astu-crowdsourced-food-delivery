import { create } from "zustand";
import { apiClient } from "@/api/client/axiosInstance";
import { useAuthStore } from "@/store/auth/authStore";

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isFasting: boolean;
  prepTimeMins: number;
}

interface VendorMenuState {
  categories: Category[];
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;

  fetchMenu: () => Promise<void>;
  createCategory: (name: string, sortOrder: number) => Promise<void>;
  createItem: (data: Omit<MenuItem, "id">) => Promise<void>;
    updateItem: (itemId: string, data: Partial<MenuItem>) => Promise<void>; 

  toggleItemStock: (itemId: string, isAvailable: boolean) => Promise<void>;
}

export const useVendorMenuStore = create<VendorMenuState>((set, get) => ({
  categories: [],
  items: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const restaurantId = user?.vendorProfile?.restaurantId;
      if (!restaurantId) return set({ isLoading: false });

      // Fetch Categories
      const catRes = await apiClient.get(`/restaurants/${restaurantId}/categories`);
      
      // Fetch Items (Include archived/hidden so vendor can un-hide them)
      const itemRes = await apiClient.get(`/restaurants/${restaurantId}/items`, {
        params: { includeArchived: 'true', limit: 100 }
      });

      const items = itemRes.data.items.map((i: any) => ({
        id: i.id,
        categoryId: i.categoryId,
        name: i.name,
        price: Number(i.price),
        description: i.description,
        imageUrl: i.imageUrl,
        isAvailable: i.isAvailable,
        isFasting: i.isFasting,
        prepTimeMins: i.prepTimeMins
      }));

      set({ categories: catRes.data.data, items, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
   updateItem: async (itemId, data) => {
        const { user } = useAuthStore.getState();
        const restaurantId = user?.vendorProfile?.restaurantId;
        if (!restaurantId) return;

       
          await apiClient.patch(`/restaurants/${restaurantId}/items/${itemId}`, data);
          await get().fetchMenu(); // Refresh the list
       
      },

  createCategory: async (name, sortOrder) => {
    const { user } = useAuthStore.getState();
    const restaurantId = user?.vendorProfile?.restaurantId;
    if (!restaurantId) return;

  
      await apiClient.post(`/restaurants/${restaurantId}/categories`, { name, sortOrder });
      await get().fetchMenu(); // Refresh
   
  },

  createItem: async (data) => {
    const { user } = useAuthStore.getState();
    const restaurantId = user?.vendorProfile?.restaurantId;
    if (!restaurantId) return;

    //handle empty images
    if (!data.imageUrl) {
      data.imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
    }

  
      await apiClient.post(`/restaurants/${restaurantId}/items`, data);
      await get().fetchMenu(); // Refresh
   
  },

  toggleItemStock: async (itemId, isAvailable) => {
    const { user } = useAuthStore.getState();
    const restaurantId = user?.vendorProfile?.restaurantId;
    if (!restaurantId) return;

    // Optimistic Update
    const oldItems = get().items;
    set({ items: oldItems.map(i => i.id === itemId ? { ...i, isAvailable } : i) });

    try {
      await apiClient.patch(`/restaurants/${restaurantId}/items/${itemId}/availability`, { isAvailable });
    } catch (error) {
      set({ items: oldItems }); // Rollback
      throw error;
    }
  }
}));