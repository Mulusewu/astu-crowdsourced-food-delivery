import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  searchQuery: string;
  recentSearches: string[];
  selectedPrice: string;
  selectedLocation: string;
  
  // Restaurant Specific
  sortBy: string;
  filterBy: string;
  
  // Tab State
  activeTab: string;
  
  setSearchQuery: (query: string) => void;
  setSelectedPrice: (price: string) => void;
  setSelectedLocation: (location: string) => void;
  setSortBy: (sort: string) => void;
  setFilterBy: (filter: string) => void;
  setActiveTab: (tab: string) => void;
  
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
      sortBy: "Rating",
      filterBy: "All",
      activeTab: "All",

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedPrice: (price) => set({ selectedPrice: price }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setFilterBy: (filter) => set({ filterBy: filter }),
      setActiveTab: (tab) => set({ activeTab: tab }),

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
          sortBy: "Rating",
          filterBy: "All",
        }),
    }),
    {
      name: "dashboard-filter-storage",
    }
  )
);
