import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Search, Loader2, AlertCircle } from "lucide-react";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useRestaurantStore } from "@/store/restaurantStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantListPage() {
  const navigate = useNavigate();
  const { restaurants, isLoading, error, fetchRestaurants } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-10">
      {/* ── Header ── */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-orange-50 dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-[14px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-black text-gray-900 dark:text-white">Restaurants</h1>
        <button className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-[14px] flex items-center justify-center text-gray-900 dark:text-white active:scale-95 transition-transform">
          <Search size={20} strokeWidth={2.5} />
        </button>
      </header>

      <main className="px-5">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[24px]" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
            <p className="text-gray-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-500 font-medium">No restaurants found.</p>
          </div>
        )}

        {/* Restaurant List */}
        {!isLoading && !error && restaurants.length > 0 && (
          <div className="space-y-4 mt-2">
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.RESTAURANT.DETAILS, { restaurantId: rest.id }))}
                className="flex bg-white dark:bg-gray-900 rounded-[20px] p-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-none dark:border dark:border-gray-800 active:scale-[0.98] transition-transform cursor-pointer"
              >
                {/* Image */}
                <div className="w-[100px] h-[100px] shrink-0 rounded-[16px] overflow-hidden relative">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  {rest.isOpen ? (
                     <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                       Open
                     </div>
                  ) : (
                     <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                       Closed
                     </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 px-3 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight line-clamp-1 pr-2">
                      {rest.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded-full">
                      <Star size={11} className="fill-[#F26A1C] text-[#F26A1C]" />
                      <span className="text-[11px] font-bold text-[#F26A1C]">
                        {rest.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 mb-2">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-[12px] font-medium truncate">
                      {rest.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 text-[11px] font-semibold mt-auto">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      <span>{rest.avgDeliveryTime} min</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span>Min. {rest.minimumOrder} ETB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
