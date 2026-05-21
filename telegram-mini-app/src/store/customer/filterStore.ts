import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  searchQuery: string;
  recentSearches: string[];
  selectedPrice: string;
  selectedPriceRange: string;
  selectedLocation: string;
  
  // Restaurant Specific
  filterBy: string;
  
  // Tab State
  activeTab: string;

  restaurantSearchQuery: string;
  sortBy: "rating" | "distance" | "name";
  selectedGate: string; // "Any" | "Gate 1" | "Block 40"

  
  setSearchQuery: (query: string) => void;
  setSelectedPrice: (price: string) => void;
  setSelectedPriceRange: (range: string) => void;
  setRestaurantSearchQuery: (query: string) => void;
  setSelectedGate: (gate: string) => void;
  setSelectedLocation: (location: string) => void;
  setSortBy: (sort: string) => void;
  setFilterBy: (filter: string) => void;
  setActiveTab: (tab: string) => void;
  
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearFilters: () => void;

   getDiscoveryParams: () => any;
  getRestaurantParams: (userLat?: number, userLng?: number) => any;

}

const MAX_RECENT_SEARCHES = 10;

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      searchQuery: "",
      restaurantSearchQuery: "",
      recentSearches: [
        "Soya Rekey",
        "Special Firfir",
        "Tegabino",
        "Aynet",
        "Ertib",
        "Oromen",
      ],
      selectedPrice: "Any",
      selectedPriceRange: "Any",
      selectedGate: "Any",
      selectedLocation: "Any",
      sortBy: "rating",
      filterBy: "All",
      activeTab: "All",

      setSearchQuery: (query) => set({ searchQuery: query }),
      setRestaurantSearchQuery: (query) => set({ restaurantSearchQuery: query }),
      setSelectedPriceRange: (range) => set({ selectedPriceRange: range }),
      setSelectedGate: (gate) => set({ selectedGate: gate }),
      setSelectedPrice: (price) => set({ selectedPrice: price }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setSortBy: (sort: any) => set({ sortBy: sort }),
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
          restaurantSearchQuery: "",
          selectedPriceRange: "Any",
          selectedGate: "Any",
          selectedPrice: "Any",
          selectedLocation: "Any",
          sortBy: "rating",
          activeTab: "All",
          filterBy: "All",
        }),
    getDiscoveryParams: () => {
        const state = get();
        const params: any = { limit: 20, isAvailable: 'true' };

        if (state.searchQuery) params.search = state.searchQuery;
        
        if (state.activeTab === "Fasting") params.isFasting = 'true';

        if (state.selectedPriceRange !== "Any") {
          const [min, max] = state.selectedPriceRange.split("-");
          params.minPrice = Number(min);
          params.maxPrice = Number(max);
        }

        return params;
      },

      getRestaurantParams: (userLat?: number, userLng?: number) => {
        const state = get();
        const params: any = { limit: 20, isOpen: 'true' };

        // We use the Gate string as a text search against the restaurant's location field
        let searchString = state.restaurantSearchQuery;
        if (state.selectedGate !== "Any") {
          searchString = searchString 
            ? `${searchString} ${state.selectedGate}` 
            : state.selectedGate;
        }
        
        if (searchString) params.search = searchString.trim();

        // Enums exactly matching backend: 'distance' | 'rating' | 'name'
        params.sortBy = state.sortBy;

        // Inject geospatial data for distance sorting
        if (userLat !== undefined && userLng !== undefined) {
          params.userLat = userLat;
          params.userLng = userLng;
        }

        return params;
      }
    }),
    {
      name: "dashboard-filter-storage",
      partialize: (state) => ({
        recentSearches: state.recentSearches, // Only persist the user's search history
      })
    }
  )
);
