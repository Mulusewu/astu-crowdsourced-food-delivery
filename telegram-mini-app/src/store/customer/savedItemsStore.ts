import { create } from "zustand";
import db from "@/data/database.json";

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

// Safely pull saved items from the JSON database.
// Fallback to the initial mock data if "savedItems" doesn't exist in database.json yet.
const dbSavedItems = (db.savedItems || [
  {
    id: "1",
    name: "Helen Cafe",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Yesome Special",
    location: "Helen Cafe",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Bole Mami",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Barch Food Zone",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Pasta Besego",
    location: "Bole Mami",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Helen Cafe",
    location: "Bole Gate",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
  },
]) as SavedItem[];

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
