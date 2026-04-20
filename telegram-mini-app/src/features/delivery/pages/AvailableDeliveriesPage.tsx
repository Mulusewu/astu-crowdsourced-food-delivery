import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ArrowLeft, ChevronDown, Bookmark } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { useOrderStore } from "@/store/orders/orderStore";
import { useCafeStore } from "@/store/cafeStore";

import BottomNav from "@/components/common/BottomNav1";

// Custom fast food icon (Drink + Burger matching the image)
const FoodPlateIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#F26A1C] mr-1 shrink-0">
    <path d="M12 11h8" />
    <path d="M4 11h4" />
    <path d="M12 15h8" />
    <path d="M4 15h4" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M4 19h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1z" />
  </svg>
);

const sortOptions = [
  { label: "Nearby First", value: "nearby" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Priority Orders", value: "priority" },
] as const;

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
    fetchAvailableOrders,
    loadMoreOrders,
    setSelectedCafe,
    secondaryFilter,
    setSecondaryFilter,
    toggleBookmark,
  } = useOrderStore();

  const { fetchCafes } = useCafeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeSortLabel = sortOptions.find(opt => opt.value === secondaryFilter)?.label || "Sort";

  // Initial data fetch
  useEffect(() => {
    fetchAvailableOrders();
    fetchCafes();
  }, [fetchAvailableOrders, fetchCafes]);

  useEffect(() => {
    if (cafeFromUrl) {
      setSelectedCafe(cafeFromUrl);
    }
  }, [cafeFromUrl, setSelectedCafe]);

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMoreOrders]);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col pb-24">
      {/* Header */}
      <header className="px-5 pt-10 pb-2">
        <div className="flex items-center justify-between mb-6 relative">
          <button
            onClick={() => navigate("/delivery/dashboard")}
            className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center text-[#F26A1C] z-10"
          >
            <ArrowLeft strokeWidth={2.5} size={22} />
          </button>

          <h1 className="absolute w-full text-center text-[26px] font-black text-black">
            Orders
          </h1>
          <div className="w-11" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full h-[52px] bg-white border border-gray-300 rounded-[26px] px-4 shadow-sm">
          <Search className="text-gray-400" size={24} />
          <input
            type="text"
            placeholder="Search Orders.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none px-3 text-[16px] text-gray-800 placeholder:text-gray-400"
          />
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <SlidersHorizontal size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-6">
          <button className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[15px] px-7 h-[44px] rounded-[14px] shadow-sm transition-colors">
            ALL
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-2 bg-white border border-gray-300 text-black font-semibold text-[15px] px-4 h-[44px] rounded-[14px] shadow-sm"
            >
              <span className="truncate max-w-[130px]">{activeSortLabel}</span>
              <ChevronDown size={20} strokeWidth={3} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsFilterOpen(false)} 
                />
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[190px] rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col p-1.5">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSecondaryFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`flex w-full text-left items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          secondaryFilter === option.value
                            ? "bg-orange-50 text-[#F26A1C]"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="flex-1 px-5 mt-8 relative z-0">
        {filteredOrders.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-6 pb-8">
            {filteredOrders.map((order, idx) => {
              const orderId = order.orderNumber || order.id.slice(-3);
              const itemCount = order.items?.length || 1;
              const firstImage = order.items?.[0]?.image || "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80&w=200&auto=format&fit=crop";

              return (
                <div
                  key={`${order.id}-${idx}`}
                  className="relative bg-white border border-[#f5f5f5] rounded-[24px] pt-[65px] pb-5 px-3 flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  {/* Product Image Overflow */}
                  <div className="absolute -top-[45px] w-[110px] h-[110px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-[4px] border-white">
                    <img
                      src={firstImage}
                      alt={`Order #${orderId}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Bookmark Icon */}
                  <button 
                    onClick={() => toggleBookmark(order.id)}
                    className="absolute top-4 right-4 text-[#F26A1C] transition-transform active:scale-95"
                  >
                    <Bookmark size={20} strokeWidth={3} className={order.isBookmarked ? "fill-[#F26A1C]" : "fill-transparent"} />
                  </button>

                  <h2 className="text-[17px] font-black text-black tracking-tight mt-2">
                    Order #{orderId}
                  </h2>

                  <div className="flex items-center justify-center mt-1">
                    <FoodPlateIcon />
                    <span className="text-[14px] font-semibold text-black leading-tight">
                      {itemCount} Items
                    </span>
                  </div>

                  <div className="text-[15px] font-bold text-[#F26A1C] mt-0.5">
                    {order.totalAmount} ETB
                  </div>

                  <button
                    onClick={() => navigate(`/delivery/available/${order.id}`)}
                    className="w-[85%] h-[38px] mt-4 bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[13px] rounded-[19px] shadow-[0_4px_12px_rgba(242,106,28,0.3)] transition-all active:scale-95"
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