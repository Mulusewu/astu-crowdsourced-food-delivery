import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";


export interface SavedItem {
  id: string;
  name: string;
  location: string;
  image: string;
  type: "RESTAURANT" | "MENU_ITEM"; 
   price?: number; // NEW
  restaurantId?: string; // NEW
}

interface SavedItemsState {
  items: SavedItem[];
  isLoading: boolean;
  error: string | null;

  
  
  fetchSavedItems: () => Promise<void>;
  addItem: (item: SavedItem) => Promise<void>;
  removeItem: (id: string, type: "RESTAURANT" | "MENU_ITEM") => Promise<void>;
   isSaved: (id: string) => boolean;
}

export const useSavedItemsStore = create<SavedItemsState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      isSaved: (id: string) => get().items.some(item => item.id === id),


    fetchSavedItems: async () => {
        set({ isLoading: true,  error: null  });
        try {
          const response = await apiClient.get('/users/me/bookmarks');

          console.log("Raw backend response:", response.data);
          
          // Map the enriched backend response to the exact shape the UI expects
          const mappedItems: SavedItem[] = response.data.data.map((b: any) => ({
            id: b.id,
            type: b.type,
            name: b.name,
            location: b.location,
            image: b.imageUrl || "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&fit=crop",
            price: b.price,
            restaurantId: b.restaurantId
          }));

          set({ items: mappedItems, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch bookmarks:", error);
          set({ isLoading: false, error: "Failed to load saved items" });
        }
      },

      addItem: async (item) => {
        const { items } = get();
        if (items.some((existingItem) => existingItem.id === item.id)) return;

        // Optimistic UI Update
        set({ items: [...items, item] });

        try {
          await apiClient.post('/users/me/bookmarks', {
            type: item.type,
            targetId: item.id
          });
        } catch (error) {
          // Rollback if server fails
          set({ items: items.filter(i => i.id !== item.id) });
          console.error("Failed to save to database", error);
        }
      },

      removeItem: async (id, type) => {
        const { items } = get();
        const removedItem = items.find((item) => item.id === id);
        
        // Optimistic UI Update
        set({ items: items.filter((item) => item.id !== id) });

        try {
          // Our backend toggles if it exists, so calling POST again removes it
          await apiClient.post('/users/me/bookmarks', {
            type,
            targetId: id
          });
        } catch (error) {
          // Rollback if server fails
          if (removedItem) set({ items: [...items, removedItem] });
          console.error("Failed to remove from database", error);
        }
      },
    }),
    {
      name: "saved-items-storage",
    }
  )
);
