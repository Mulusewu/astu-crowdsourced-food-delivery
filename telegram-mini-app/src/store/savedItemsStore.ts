import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedItem {
  id: string;
  name: string;
  location: string;
  image: string;
}

interface SavedItemsStore {
  items: SavedItem[];
  toggleItem: (item: SavedItem) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedItemsStore = create<SavedItemsStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const { items } = get();
        const isAlreadySaved = items.find((i) => i.id === item.id);

        if (isAlreadySaved) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },
      isSaved: (id) => {
        return get().items.some((i) => i.id === id);
      },
    }),
    {
      name: "saved-items-storage",
    }
  )
);
