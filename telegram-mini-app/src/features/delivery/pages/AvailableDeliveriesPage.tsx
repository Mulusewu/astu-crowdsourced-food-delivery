import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ChevronDown,
  Package,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { useOrderStore } from "@/store/orders/orderStore";
import { ROUTES } from "@/routes/routePaths";
import { Button } from "@/components/ui/button";

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
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeSortLabel =
    sortOptions.find((opt) => opt.value === secondaryFilter)?.label || "Sort";

  // Initial cafe route binding
  useEffect(() => {
    if (cafeFromUrl) {
      setSelectedCafe(cafeFromUrl);
    } else {
      setSelectedCafe("all");
    }
  }, [cafeFromUrl, setSelectedCafe]);

  // Initial data fetch
  useEffect(() => {
    fetchAvailableOrders();
  }, [fetchAvailableOrders]);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMoreOrders]);

  // Local Search Filtering
  const displayedOrders = filteredOrders.filter(order => {
    if (!searchQuery) return true;
    return order.shortId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white font-sans flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-5 pt-10 pb-2 bg-white">
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
          <button 
            onClick={() => {
              setSelectedCafe("all");
              navigate(ROUTES.DELIVERY.AVAILABLE.LIST, { replace: true });
            }}
            className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[15px] px-7 h-[44px] rounded-[14px] shadow-sm transition-colors"
          >
            ALL
          </button>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-2 bg-white border border-gray-300 text-black font-semibold text-[15px] px-4 h-[44px] rounded-[14px] shadow-sm"
            >
              <span className="truncate max-w-[130px]">{activeSortLabel}</span>
              <ChevronDown
                size={20}
                strokeWidth={3}
                className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
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
        {displayedOrders.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-6 pb-8">
            {displayedOrders.map((order, idx) => {
              // BACKEND ALIGNMENT: Use shortId safely
              const orderId = order.shortId;
              const itemCount = order.itemCount;
              const firstImage = order.restaurantImageUrl;

              return (
                <article
                  key={`${order.id}-${idx}`}
                  className="relative flex w-full flex-col items-center overflow-visible rounded-2xl bg-white px-3 pb-3 pt-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100"
                >
                  <span
                    className="absolute right-3 top-3 z-[1] h-2 w-2 rounded-sm bg-[#F26A1C]"
                    aria-hidden
                  />

                  <div className="z-[1] -mt-10 mb-1 flex justify-center">
                    <div className="h-[5rem] w-[5rem] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-gray-50 shadow-md ring-1 ring-black/5">
                      <img
                        src={firstImage || "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80&w=200"}
                        alt={`Order #${orderId}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>

                  <p className="mt-1 text-center text-sm font-semibold text-gray-900">
                    #{orderId}
                  </p>

                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-600">
                    <Package
                      className="h-3.5 w-3.5 text-[#F26A1C]"
                      strokeWidth={2}
                    />
                    <span>{itemCount} items</span>
                  </div>

                  <p className="mt-1 text-center text-sm font-bold text-gray-900">
                    {order.totalAmount.toFixed(0)} ETB
                  </p>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => navigate(ROUTES.DELIVERY.AVAILABLE.DETAILS.replace(':orderId', order.id))}
                    className="mt-3 h-9 w-full rounded-full bg-[#F26A1C] text-xs font-semibold text-white hover:bg-[#F26A1C]/90 shadow-md transition-all active:scale-95"
                  >
                    View Detail
                  </Button>
                </article>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && (
          <div ref={ref} className="py-6 flex justify-center pb-32">
            {isLoadingMore ? (
              <div className="w-6 h-6 border-2 border-[#F26A1C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <p className="text-xs text-gray-400 font-medium">
                Scroll down for more
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}