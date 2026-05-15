import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ChevronDown,
  Bookmark,
  Package,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { useOrderStore } from "@/store/orders/orderStore";
import { useCafeStore } from "@/store/cafeStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Custom fast food icon (Drink + Burger matching the image)
const FoodPlateIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#F26A1C] mr-1 shrink-0"
  >
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
  const queryFromUrl = searchParams.get("search");

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
    selectedCafe,
    secondaryFilter,
    setSecondaryFilter,
    toggleBookmark,
  } = useOrderStore();

  const { cafes, fetchCafes } = useCafeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const visibleOrders = filteredOrders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      order.shortId.toLowerCase().includes(query) ||
      order.restaurant.name.toLowerCase().includes(query) ||
      order.customer.fullName.toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query))
    );
  });

  const activeSortLabel =
    sortOptions.find((opt) => opt.value === secondaryFilter)?.label || "Sort";

  // Initial data fetch
  useEffect(() => {
    fetchAvailableOrders();
    fetchCafes();
  }, [fetchAvailableOrders, fetchCafes]);

  useEffect(() => {
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  useEffect(() => {
    if (cafeFromUrl) {
      setSelectedCafe(cafeFromUrl);
      return;
    }
    setSelectedCafe("all");
  }, [cafeFromUrl, setSelectedCafe]);

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMoreOrders]);

  return (
    <div className="bg-white dark:bg-gray-950 font-sans flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-5 pt-10 pb-2 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between mb-6 relative">
          <button
            onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
            className="w-11 h-11 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center text-[#F26A1C] z-10"
          >
            <ArrowLeft strokeWidth={2.5} size={22} />
          </button>
          <h1 className="absolute w-full text-center text-[26px] font-black text-black dark:text-white">
            Orders
          </h1>
          <div className="w-11" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Orders.."
            className="h-12 rounded-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-12 pr-12 text-base shadow-none dark:text-white"
          />
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCafe("all")}
            className={`font-bold text-[15px] px-7 h-[44px] rounded-[14px] shadow-sm transition-colors ${
              selectedCafe !== "all"
                ? "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                : "bg-[#F26A1C] text-white hover:bg-[#e05d15]"
            }`}
          >
            ALL
          </button>

          {cafes.slice(0, 4).map((cafe) => (
            <button
              key={cafe.id}
              type="button"
              onClick={() => setSelectedCafe(cafe.id)}
              className={`h-[44px] rounded-[14px] px-4 text-sm font-semibold transition-colors ${
                selectedCafe === cafe.id
                  ? "bg-[#F26A1C] text-white"
                  : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              }`}
            >
              {cafe.name}
            </button>
          ))}

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-black dark:text-white font-semibold text-[15px] px-4 h-[44px] rounded-[14px] shadow-sm"
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
                <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[190px] rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col p-1.5">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSecondaryFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full text-left items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          secondaryFilter === option.value
                            ? "bg-orange-50 dark:bg-orange-950/20 text-[#F26A1C]"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
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
        {visibleOrders.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-gray-900/40 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-6 pb-8">
            {visibleOrders.map((order, idx) => {
              const orderId = order.shortId;
              const itemCount = order.items?.length || 1;
              const firstImage =
                order.items?.[0]?.imageUrl ||
                "https://images.unsplash.com/photo-1544025162-831e5088eb7e?q=80&w=200&auto=format&fit=crop";

              return (
                <div
                  key={`${order.id}-${idx}`}
                  className="relative bg-white dark:bg-gray-900 border border-[#f5f5f5] dark:border-gray-800 rounded-[24px] pt-[65px] pb-5 px-3 flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  {/* Product Image Overflow */}
                  <div className="absolute -top-[45px] w-[110px] h-[110px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-[4px] border-white dark:border-gray-900">
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
                    <Bookmark
                      size={20}
                      strokeWidth={3}
                      className={
                        order.isBookmarked
                          ? "fill-[#F26A1C]"
                          : "fill-transparent"
                      }
                    />
                  </button>

                  <h2 className="text-[17px] font-black text-black dark:text-white tracking-tight mt-2">
                    Order #{orderId}
                  </h2>

                  <div className="flex items-center justify-center mt-1">
                    <FoodPlateIcon />
                    <span className="text-[14px] font-semibold text-black dark:text-white leading-tight">
                      {itemCount} Items
                    </span>
                  </div>

                  <div className="text-[15px] font-bold text-[#F26A1C] mt-0.5">
                    {order.totalAmount} ETB
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        buildRoute(ROUTES.DELIVERY.AVAILABLE.DETAILS, {
                          orderId: order.id,
                        }),
                      )
                    }
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
