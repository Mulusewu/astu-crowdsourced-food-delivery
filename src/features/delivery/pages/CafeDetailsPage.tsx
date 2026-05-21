import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Package, 
  Star, 
  ChevronRight 
} from "lucide-react";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useOrderStore } from "@/store/orders/orderStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function CafeDetailsPage() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const navigate = useNavigate();
  const { restaurants, fetchDashboardData, isLoading: isDashboardLoading } = useDeliveryDashboardStore();
  const { orders, fetchAvailableOrders, isLoading: isOrdersLoading } = useOrderStore();

  useEffect(() => {
    if (restaurants.length === 0) {
      fetchDashboardData();
    }
    fetchAvailableOrders();
  }, [restaurants.length, fetchDashboardData, fetchAvailableOrders]);

  const cafe = useMemo(() => 
    restaurants.find(r => r.id === cafeId),
    [restaurants, cafeId]
  );

  const cafeOrders = useMemo(() => 
    orders.filter(o => o.restaurant.id === cafeId && o.status === "AWAITING_ACCEPT"),
    [orders, cafeId]
  );

  if (isDashboardLoading && !cafe) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6">
        <Skeleton className="h-10 w-10 rounded-xl mb-6" />
        <Skeleton className="h-48 w-full rounded-[32px] mb-6" />
        <Skeleton className="h-8 w-2/3 rounded-lg mb-4" />
        <Skeleton className="h-4 w-full rounded-lg mb-2" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="h-20 w-20 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
          <Package className="text-[#F26A1C]" size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Cafe Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">We couldn't find the details for this location.</p>
        <button
          onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
          className="bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold shadow-lg"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-24">
      {/* Hero Header */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={cafe.imageUrl ?? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
          alt={cafe.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-[max(1.5rem,env(safe-area-inset-top))] h-11 w-11 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F26A1C] text-[10px] font-black text-white uppercase tracking-wider">
              {cafe.isOpen ? "Open Now" : "Closed"}
            </span>
            <div className="flex items-center gap-1 text-white/90 text-sm font-bold">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>{cafe.avgRating} ({cafe.totalReviews})</span>
            </div>
          </div>
          <h1 className="text-28 font-black text-white leading-tight">{cafe.name}</h1>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-10">
        {/* Info Card */}
        <div className="rounded-[32px] bg-white dark:bg-gray-900 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-800">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center shrink-0">
                <MapPin className="text-red-500" size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{cafe.location}</p>
                <p className="text-xs font-medium text-gray-400">Main Pickup Point</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                <Phone className="text-blue-500" size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{cafe.phone}</p>
                <p className="text-xs font-medium text-gray-400">Contact Restaurant</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center shrink-0">
                <Clock className="text-purple-500" size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {cafe.openingTime} - {cafe.closingTime}
                </p>
                <p className="text-xs font-medium text-gray-400">Business Hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Orders Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Available Orders</h2>
            <span className="bg-orange-50 dark:bg-orange-950/30 text-[#F26A1C] text-xs font-black px-3 py-1 rounded-full">
              {cafeOrders.length} Found
            </span>
          </div>

          <div className="space-y-4">
            {isOrdersLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-3xl" />)
            ) : cafeOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-gray-800">
                <Package className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={40} />
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No active orders from this cafe</p>
              </div>
            ) : (
              cafeOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => navigate(buildRoute(ROUTES.DELIVERY.AVAILABLE.DETAILS, { orderId: order.id }))}
                  className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700">
                      <img 
                        src={order.items[0]?.imageUrl ?? "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200"} 
                        alt="" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-black text-gray-900 dark:text-white">Order #{order.shortId}</p>
                      <p className="text-sm font-bold text-[#F26A1C]">{order.deliveryFee} ETB Earning</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
        <button
          onClick={() => navigate(ROUTES.DELIVERY.AVAILABLE.LIST)}
          className="w-full h-14 rounded-full bg-[#F26A1C] text-white font-black text-base shadow-[0_12px_32px_rgba(242,106,28,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          View All Nearby Orders
        </button>
      </div>
    </div>
  );
}
