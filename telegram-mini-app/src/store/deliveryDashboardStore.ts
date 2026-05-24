import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/api/client/axiosInstance";
import { ROUTES } from "@/routes/routePaths";
import { useAuthStore } from "@/store/auth/authStore";
import { useOrderStore } from "@/store/orders/orderStore"; 
import type { DelivererProfile } from "@/types/user.types";

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  mode: "VENDOR_MANAGED" | "ADMIN_MANAGED";
  location: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  isActive: boolean;
  imageUrl: string | null;
  minOrderValue: number;
  avgRating: number;
  tags: string[];
  activeOrders: number;   // Computed from available orders
  isBookmarked: boolean;  // Computed from backend bookmarks
}

export interface DashboardOrder {
  id: string;
  shortId: string;
  restaurantName: string;
  restaurantImageUrl: string | null;
  itemCount: number;
  totalAmount: number;
  deliveryFee: number;
  firstItemImageUrl: string | null;
}

interface DeliveryDashboardState {
  delivererProfile: DelivererProfile | null;
  restaurants: Restaurant[];
  dashboardOrders: DashboardOrder[];
  isLoading: boolean;
  error: string | null;

  gpsIntervalId: number | null;
  isSpoofing: boolean;
  spoofedCoords: { lat: number, lng: number } | null;

  fetchDashboardData: () => Promise<void>;
  toggleActiveStatus: (navigate?: (path: string) => void) => Promise<void>;
  toggleBookmark: (restaurantId: string) => Promise<void>;

  startLiveTracking: () => void;
  stopLiveTracking: () => void;
  setSpoofedLocation: (isActive: boolean, coords?: { lat: number, lng: number }) => void;
  
  clearError: () => void;
}

export const useDeliveryDashboardStore = create<DeliveryDashboardState>()(
  persist(
    (set, get) => ({
      delivererProfile: null,
      restaurants: [],
      dashboardOrders: [],
      isLoading: true,
      error: null,
      gpsIntervalId: null,
      isSpoofing: false,
      spoofedCoords: null,

      fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
          // 1. Fetch data in parallel for speed
          const [userRes, restsRes, ordersRes, bookmarksRes] = await Promise.all([
            apiClient.get('/users/me'),
            apiClient.get('/restaurants', { params: { isOpen: 'true', limit: 20 } }),
            apiClient.get('/orders', { params: { status: 'AWAITING_ACCEPT', roleAs: 'DELIVERER', limit: 10 } }),
            apiClient.get('/users/me/bookmarks', { params: { type: 'RESTAURANT' } })
          ]);

          const profile = userRes.data.data.delivererProfile;
          const bookmarkedIds = bookmarksRes.data.data.map((b: any) => b.targetId);
          const availableOrders = ordersRes.data.orders;


          // 2. Map Dashboard Orders (Cheap/Quick orders logic)
          const mappedOrders: DashboardOrder[] = availableOrders
            .sort((a: any, b: any) => Number(a.totalAmount) - Number(b.totalAmount)) // Sort lowest price first
            .slice(0, 6)
            .map((o: any) => ({
              id: o.id,
              shortId: o.shortId,
              restaurantName: o.restaurant?.name || "Restaurant",
              restaurantImageUrl: o.restaurant?.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
              itemCount: o._count?.items || 1,
              totalAmount: Number(o.totalAmount),
              deliveryFee: Number(o.deliveryFee) || 33,
              firstItemImageUrl: o.restaurant?.imageUrl || "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200", // Fallback to restaurant image
            }));

          // 3. Map Restaurants and compute active orders per restaurant
          const mappedRestaurants: Restaurant[] = restsRes.data.restaurants.map((r: any) => {
            const activeCount = availableOrders.filter((o: any) => o.restaurant?.name === r.name).length;
            
            return {
              id: r.id,
              name: r.name,
              phone: r.phone || "",
              mode: r.mode,
              location: r.location,
              lat: r.lat,
              lng: r.lng,
              isOpen: r.isOpen,
              isActive: r.isActive,
              imageUrl: r.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
              minOrderValue: Number(r.minOrderValue) || 0,
              avgRating: Number(r.avgRating) || 5.0,
              tags: r.tags || [],
              activeOrders: activeCount,
              isBookmarked: bookmarkedIds.includes(r.id),
            };
          });

          // Sort restaurants to show bookmarked ones or ones with active orders first
          mappedRestaurants.sort((a, b) => {
            if (a.isBookmarked && !b.isBookmarked) return -1;
            if (!a.isBookmarked && b.isBookmarked) return 1;
            return b.activeOrders - a.activeOrders;
          });

          set(state => ({ 
            delivererProfile: profile, 
            restaurants: mappedRestaurants, 
             dashboardOrders: state.dashboardOrders.length > 0 ? state.dashboardOrders : mappedOrders, 
            isLoading: false 
          }));

        } catch (error: any) {
          console.error("Failed to fetch dashboard data:", error);
          set({ isLoading: false, error: error.response?.data?.message || "Failed to load dashboard" });
        }
      },

       startLiveTracking: () => {
        if (get().gpsIntervalId) return; // Prevent duplicates

        console.log("📍 [TELEMETRY] Starting 15s GPS ping loop...");

        const intervalId = window.setInterval(() => {
          const state = get();
          const { socket } = useOrderStore.getState();
          
          if (!socket || !socket.connected) return;

          // If the Presentation Spoofer is active, send the fake coordinates!
          if (state.isSpoofing && state.spoofedCoords) {
            socket.emit('UPDATE_LOCATION', state.spoofedCoords);
            return;
          }

          // Otherwise, ask the browser for real hardware GPS
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                socket.emit('UPDATE_LOCATION', { 
                  lat: position.coords.latitude, 
                  lng: position.coords.longitude 
                });
              },
              (error) => console.warn("📍 [GPS ERROR]:", error.message),
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
          }
        }, 15000) as unknown as number; // Ping every 15 seconds

        set({ gpsIntervalId: intervalId });
      },

      stopLiveTracking: () => {
        const { gpsIntervalId } = get();
        if (gpsIntervalId) {
          window.clearInterval(gpsIntervalId);
          set({ gpsIntervalId: null });
          console.log("📍 [TELEMETRY] Tracking stopped.");
        }
      },

      setSpoofedLocation: (isActive, coords) => {
        set({ isSpoofing: isActive, spoofedCoords: coords || null });
        // Immediately fire a ping so the DB updates instantly before a demo
        if (isActive && coords) {
          const { socket } = useOrderStore.getState();
          if (socket?.connected) socket.emit('UPDATE_LOCATION', coords);
        }
      },

      toggleActiveStatus: async () => {
        const { delivererProfile } = get();
        if (!delivererProfile) return;

        const willBeOnline = !delivererProfile.isAvailable;
        
        // Optimistic UI Update
        set({
          delivererProfile: { ...delivererProfile, isAvailable: willBeOnline }
        });

        try {
          // Backend API Call (Strict DB field: isAvailable)
          await apiClient.patch('/users/me/availability', { isAvailable: willBeOnline });
          
           if (willBeOnline) {
            get().startLiveTracking();
          } else {
            get().stopLiveTracking();
          }

          // if (!willBeOnline && navigate) {
          //   navigate(ROUTES.DELIVERY.OFFLINE);
          // }
        } catch (error: any) {
          // Rollback on failure (e.g., Payout account not set up)
          set({
            delivererProfile: { ...delivererProfile, isAvailable: !willBeOnline },
            error: error.response?.data?.message || "Failed to go online. Check payout details."
          });
          throw error; // Throw so UI can toast
        }
      },

      toggleBookmark: async (restaurantId: string) => {
        const { restaurants } = get();
        
        // Optimistic Update
        set({
          restaurants: restaurants.map((r) =>
            r.id === restaurantId ? { ...r, isBookmarked: !r.isBookmarked } : r,
          ),
        });

        try {
          await apiClient.post('/users/me/bookmarks', {
            type: 'RESTAURANT',
            targetId: restaurantId
          });
        } catch (error) {
          // Rollback
          set({ restaurants });
        }
      },

      clearError: () => set({ error: null })
    }),

    {
      name: "delivery-dashboard-storage",
      partialize: (s) => ({
        isSpoofing: s.isSpoofing,
        spoofedCoords: s.spoofedCoords
      }),
    },
  ),
);