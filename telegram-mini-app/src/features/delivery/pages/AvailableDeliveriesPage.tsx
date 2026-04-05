import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  Package,
  Clock,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BottomNav from "@/components/common/BottomNav1";

// Zustand Stores
import { useOrderStore } from "@/store/orders/orderStore";
import { useCafeStore } from "@/store/cafeStore";
import { useUIStore } from "@/store/uiStore";

export default function AvailableDeliveriesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeFromUrl = searchParams.get("cafe");

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  // Zustand State & Actions
  const {
    filteredOrders,
    isLoading,
    isLoadingMore,
    hasMore,
    selectedCafe,
    secondaryFilter,
    fetchAvailableOrders,
    loadMoreOrders,
    setSelectedCafe,
    setSecondaryFilter,
  } = useOrderStore();

  const { cafes, fetchCafes } = useCafeStore();
  const { showToast } = useUIStore();

  // Initial data fetch
  useEffect(() => {
    fetchAvailableOrders();
    fetchCafes();
  }, [fetchAvailableOrders, fetchCafes]);

  // Handle URL parameters (if navigating directly to a specific cafe)
  useEffect(() => {
    if (cafeFromUrl) {
      setSelectedCafe(cafeFromUrl);
    }
  }, [cafeFromUrl, setSelectedCafe]);

  // Infinite scroll logic
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMoreOrders]);

  // Loading Skeleton
  if (isLoading && !filteredOrders.length) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6 pb-20">
        <Skeleton className="h-10 w-full mb-6 rounded-2xl" />
        <Skeleton className="h-12 w-full mb-6 rounded-full" />
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative bg-gray-100 dark:bg-gray-900 rounded-[24px] h-48">
              <Skeleton className="absolute -top-10 left-1/2 -translate-x-1/2 w-[85px] h-[85px] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-24">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-6 pb-4">
        
        {/* Top Nav (Back & Title) */}
        <div className="relative flex items-center justify-center mb-6">
          <button 
            onClick={() => navigate("/delivery/dashboard")}
            className="absolute left-0 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-black text-xl text-gray-900 dark:text-white tracking-wide">
            Orders
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-full px-4 py-3 shadow-sm mb-4">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search Orders..." 
            className="flex-1 bg-transparent border-none outline-none px-3 text-[14px] font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <SlidersHorizontal size={20} className="text-gray-400 shrink-0" />
        </div>

        {/* FILTER PILLS (Integrated with Zustand/Shadcn) */}
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Cafe Filter */}
          <Select value={selectedCafe} onValueChange={setSelectedCafe}>
            <SelectTrigger 
              className={`h-10 rounded-full border-[1.5px] px-5 font-bold text-[13px] whitespace-nowrap transition-all shadow-none focus:ring-0 focus:ring-offset-0 ${
                selectedCafe === "all" 
                  ? "bg-[#F26A1C] text-white border-[#F26A1C]" 
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <SelectValue placeholder="All Cafes" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-xl">
              <SelectItem value="all" className="font-semibold cursor-pointer">🏪 All Cafes</SelectItem>
              {cafes.map((cafe) => (
                <SelectItem key={cafe.id} value={cafe.id} className="font-semibold cursor-pointer">
                  {cafe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort & Secondary Filter */}
          <Select value={secondaryFilter} onValueChange={setSecondaryFilter}>
            <SelectTrigger 
              className="h-10 rounded-full border-[1.5px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 font-bold text-[13px] text-gray-800 dark:text-gray-200 whitespace-nowrap shadow-none focus:ring-0 focus:ring-offset-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-xl">
              <SelectItem value="nearby" className="font-semibold cursor-pointer">📍 Nearby</SelectItem>
              <SelectItem value="price_asc" className="font-semibold cursor-pointer">💰 Low to High</SelectItem>
              <SelectItem value="price_desc" className="font-semibold cursor-pointer">💰 High to Low</SelectItem>
              <SelectItem value="priority" className="font-semibold cursor-pointer">⭐ Priority Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Clock Button (For visual consistency with original) */}
          <button className="h-10 w-10 shrink-0 rounded-full border-[1.5px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-[#F26A1C] hover:bg-orange-50 dark:hover:bg-gray-800 active:scale-95 transition-all">
            <Clock size={16} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* ORDERS GRID */}
      <main className="px-5">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4 opacity-30">🍽️</div>
            <p className="text-gray-900 dark:text-white font-bold text-lg">No orders found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 pt-12 pb-8">
            {filteredOrders.map((order) => {
              const orderId = order.orderNumber || order.id.slice(-3);
              const itemCount = order.items?.length || 0;
              const firstImage = order.items?.[0]?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop";
              
              return (
                <div 
                  key={order.id} 
                  className="relative bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 flex flex-col items-center pt-12 pb-4 px-3"
                >
                  {/* Floating Circular Image */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[90px] h-[90px]">
                    <img 
                      src={firstImage} 
                      alt="Order Item" 
                      className="w-full h-full rounded-full object-cover border-[5px] border-[#FDFDFD] dark:border-gray-950 shadow-sm"
                    />
                  </div>

                  {/* Top Right Orange Square Icon */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-2 border-[#F26A1C] rounded-[4px] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#F26A1C] rounded-[2px]" />
                  </div>

                  {/* Order Details */}
                  <h3 className="font-black text-gray-900 dark:text-white text-[15px] mb-1">
                    Order #{orderId}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-1.5 mb-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                    <Package size={12} className="text-[#F26A1C]" strokeWidth={2.5} />
                    <span className="font-bold text-[#F26A1C] text-[11px]">{itemCount} Items</span>
                  </div>
                  
                  <p className="font-bold text-[#F26A1C]/80 text-[13px] mb-4">
                    {order.totalAmount} ETB
                  </p>

                  {/* View Detail Button */}
                  <button 
                    onClick={() => navigate(`/delivery/available/${order.id}`)}
                    className="w-[90%] bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[11px] py-2.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-auto"
                  >
                    View Detail
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && (
          <div ref={ref} className="py-6 flex justify-center">
            {isLoadingMore ? (
              <div className="w-6 h-6 border-2 border-[#F26A1C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <p className="text-xs text-gray-400 font-medium">Scroll down for more</p>
            )}
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}