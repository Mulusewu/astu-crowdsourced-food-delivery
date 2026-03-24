import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Bookmark,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInView } from "react-intersection-observer";

// Zustand Stores
import { useOrderStore } from "@/store/orders/orderStore";
import { useCafeStore } from "@/store/cafeStore";
import { useUIStore } from "@/store/uiStore";
import BottomNav from "@/components/common/BottomNav1";

export default function AvailableDeliveriesPage() {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  // Zustand
  const {
    orders,
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
    toggleBookmark,
    acceptOrder,
  } = useOrderStore();

  const { cafes, fetchCafes } = useCafeStore();
  const { showToast } = useUIStore();

  // Initial data fetch
  useEffect(() => {
    fetchAvailableOrders();
    fetchCafes();
  }, [fetchAvailableOrders, fetchCafes]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMoreOrders();
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMoreOrders]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrder(orderId);
      showToast({ type: "success", message: "Order accepted successfully!" });
    } catch (error) {
      showToast({ type: "error", message: "Failed to accept order" });
    }
  };

  const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getSelectedCafeName = () => {
    if (selectedCafe === "all") return "All Cafes";
    const cafe = cafes.find((c) => c.id === selectedCafe);
    return cafe?.name || "All Cafes";
  };

  // Loading Skeleton (now shows 2-column grid skeleton)
  if (isLoading && !orders.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-4">
          <Skeleton className="h-9 w-40 mb-6" />
          <div className="flex gap-3">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Button
          variant="ghost"
          onClick={() => navigate("/delivery/dashboard")}
          className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 -ml-2"
        >
          <ChevronLeft size={22} />
          <span className="font-medium">Back</span>
        </Button>

        <div className="font-semibold text-xl tracking-tight">
          Available Orders
        </div>

        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-700 border-0 font-medium"
        >
          {filteredOrders.length}
        </Badge>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 space-y-3">
        {/* Cafe Filter */}
        <Select value={selectedCafe} onValueChange={setSelectedCafe}>
          <SelectTrigger className="h-12 border-gray-200 bg-white text-base">
            <SelectValue placeholder="All Cafes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🏪 All Cafes</SelectItem>
            {cafes.map((cafe) => (
              <SelectItem key={cafe.id} value={cafe.id}>
                {cafe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Secondary Filter */}
        <div className="flex gap-2">
          <Select value={secondaryFilter} onValueChange={setSecondaryFilter}>
            <SelectTrigger className="h-11 flex-1 border-gray-200 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearby">📍 Nearby</SelectItem>
              <SelectItem value="price_asc">💰 Low to High</SelectItem>
              <SelectItem value="price_desc">💰 High to Low</SelectItem>
              <SelectItem value="priority">⭐ Priority Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-gray-200"
          >
            <Clock size={18} />
          </Button>
        </div>
      </div>

      {/* Orders Grid - 2 Columns */}
      <ScrollArea className="h-[calc(100vh-195px)] px-4 py-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4 opacity-30">📦</div>
            <p className="text-gray-500 font-medium">No orders available</p>
            <p className="text-sm text-gray-400 mt-1">Try changing filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col"
              >
                <CardContent className="p-0 flex-1 flex flex-col">
                  {/* Cafe Header */}
                  <div className="flex items-center justify-between px-3 pt-3 pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.cafeImage} />
                        <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-semibold">
                          {order.cafeName?.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {order.cafeName}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={12} className="text-orange-500" />
                          {order.distance}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(order.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Bookmark
                        size={18}
                        className={
                          order.isBookmarked
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-400"
                        }
                      />
                    </button>
                  </div>

                  {/* Food Image + Info */}
                  <div className="px-3 pb-3 flex-1">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-100 mb-3">
                      <img
                        src={order.items[0]?.image}
                        alt={order.items[0]?.name}
                        className="w-full h-full object-cover"
                      />
                      {order.items.length > 1 && (
                        <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5">
                          +{order.items.length - 1}
                        </Badge>
                      )}
                    </div>

                    {/* Order Details */}
                    <div>
                      <div className="flex items-baseline justify-between">
                        <p className="text-xs text-gray-500">
                          Order #{order.id.slice(-4)}
                        </p>
                        <p className="font-bold text-orange-600 text-lg leading-none">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>

                      <h4 className="font-medium text-gray-900 text-sm mt-1 line-clamp-2 leading-tight">
                        {order.items[0]?.name}
                        {order.items.length > 1 &&
                          ` + ${order.items.length - 1} more`}
                      </h4>

                      <p className="text-xs text-gray-600 mt-1">
                        {order.customer?.name}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={13} />
                          {formatTime(order.createdAt)}
                        </div>
                        {order.priority && (
                          <Badge className="bg-orange-100 text-orange-700 text-[10px] px-2">
                            Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto border-t border-gray-100 p-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs border-gray-200"
                      onClick={() =>
                        navigate(`/delivery/available/${order.id}`)
                      }
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-9 text-xs bg-[#F26A1C] hover:bg-[#F26A1C]/90 text-white"
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={order.status !== "pending"}
                    >
                      Accept
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && (
          <div ref={ref} className="py-6 text-center">
            {isLoadingMore ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Scroll for more orders...</p>
            )}
          </div>
        )}
      </ScrollArea>
      <BottomNav />
    </div>
  );
}
