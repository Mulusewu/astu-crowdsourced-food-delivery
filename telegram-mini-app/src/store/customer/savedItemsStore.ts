import { create } from "zustand";

export interface SavedItem {
  id: string;
  name: string;
  location: string;
  image: string;
}

interface SavedItemsState {
  items: SavedItem[];
  addItem: (item: SavedItem) => void; // <-- Added this
  removeItem: (id: string) => void;
}

// savedItems is not part of the Prisma schema — maintained as local Zustand state
const dbSavedItems: SavedItem[] = [];

export const useSavedItemsStore = create<SavedItemsState>((set) => ({
  items: dbSavedItems,

  // Add item logic (with duplicate prevention)
  addItem: (item) =>
    set((state) => {
      // Check if the item already exists in the saved list
      const exists = state.items.some(
        (existingItem) => existingItem.id === item.id,
      );
      if (exists) return state; // Do nothing if it's already saved

      return {
        items: [...state.items, item],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
