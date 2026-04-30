import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  searchQuery: string;
  recentSearches: string[];
  selectedPrice: string;
  selectedLocation: string;
  
  setSearchQuery: (query: string) => void;
  setSelectedPrice: (price: string) => void;
  setSelectedLocation: (location: string) => void;
  
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearFilters: () => void;
}

const MAX_RECENT_SEARCHES = 10;

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      searchQuery: "",
      recentSearches: [
        "Soya Rekey",
        "Special Firfir",
        "Tegabino",
        "Aynet",
        "Ertib",
        "Oromen",
      ],
      selectedPrice: "Any",
      selectedLocation: "Any",

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedPrice: (price) => set({ selectedPrice: price }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),

      addRecentSearch: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;

          // Remove if it already exists to put it at the top
          const filtered = state.recentSearches.filter(
            (s) => s.toLowerCase() !== trimmed.toLowerCase()
          );

          // Add to start and cap at MAX_RECENT_SEARCHES
          return {
            recentSearches: [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES),
          };
        }),

      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (s) => s.toLowerCase() !== query.toLowerCase()
          ),
        })),

      clearFilters: () =>
        set({
          searchQuery: "",
          selectedPrice: "Any",
          selectedLocation: "Any",
        }),
    }),
    {
      name: "dashboard-filter-storage",
    }
  )
);
