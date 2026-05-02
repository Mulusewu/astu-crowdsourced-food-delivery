import { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Star,
  Clock,
  Heart,
  Loader2,
  AlertCircle,
  MapPin,
} from "lucide-react";

import { useRestaurantStore } from "@/store/restaurantStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useSavedItemsStore } from "@/store/customer/savedItemsStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";

export default function RestaurantDetailsPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPromoOnly = searchParams.get("promoOnly") === "true";

  // Stores
  const {
    currentRestaurant: restaurant,
    isLoading,
    error,
    fetchRestaurantDetails,
    clearCurrentRestaurant,
  } = useRestaurantStore();

  const addToCart = useCartStore((state) => state.addToCart); // Using direct addToCart

  const {
    items: savedItems,
    addItem: saveItem,
    removeItem: unsaveItem,
  } = useSavedItemsStore();

  const isSaved = restaurantId
    ? savedItems.some((item) => item.id === restaurantId)
    : false;

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails(restaurantId);
    }
    return () => clearCurrentRestaurant();
  }, [restaurantId, fetchRestaurantDetails, clearCurrentRestaurant]);

  const handleToggleSave = () => {
    if (!restaurant) return;
    if (isSaved) {
      unsaveItem(restaurant.id);
    } else {
      saveItem({
        id: restaurant.id,
        name: restaurant.name,
        location: restaurant.location || "Adama",
        image: restaurant.image,
      });
    }
  };

  const handleAddToCart = (menuItem: any) => {
    if (!restaurant) return;
    addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      description: menuItem.description,
      image: menuItem.imageUrl || menuItem.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pb-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#F26A1C] mb-4" />
        <p className="text-gray-500 font-bold text-sm">Loading Menu...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 pb-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
        <p className="text-gray-500 font-medium mb-8 text-sm">
          {error || "We couldn't find this restaurant."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-white border-2 border-[#F26A1C] text-[#F26A1C] font-bold py-3 px-8 rounded-[16px] active:scale-95 transition-transform"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-28 flex flex-col font-sans antialiased">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-black tracking-wide truncate px-4">
          {restaurant.name}
        </h1>
        <button
          onClick={handleToggleSave}
          className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
        >
          {isSaved ? (
            <Bookmark
              size={20}
              className="fill-[#F26A1C] text-[#F26A1C]"
              strokeWidth={2}
            />
          ) : (
            <Bookmark size={20} className="text-gray-400" strokeWidth={2.5} />
          )}
        </button>
      </header>

      {/* ── Hero Image ── */}
      <div className="px-4 pt-4 pb-5">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-[220px] object-cover rounded-[24px] shadow-sm"
        />
      </div>

      {/* ── Restaurant Info & Stats ── */}
      <section className="px-4 mb-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[22px] font-black leading-tight mb-1">
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin size={14} className="text-[#F26A1C]" />
              <span className="text-[13px] font-semibold">
                {restaurant.location}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-0 border border-gray-100 bg-gray-50 rounded-[18px] overflow-hidden divide-x divide-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-3.5 px-2">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <Star size={16} className="fill-[#F26A1C] text-[#F26A1C]" />
              <span className="text-[16px] font-black text-gray-900">
                {restaurant.rating}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Rating
            </p>
          </div>

          <button
            onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.RESTAURANT.REVIEWS, { restaurantId: restaurant.id }))}
            className="flex flex-col items-center justify-center py-3.5 px-2 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-1.5 mb-0.5">
              <Heart size={16} className="text-[#F26A1C]" strokeWidth={2.5} />
              <span className="text-[16px] font-black text-gray-900">
                {restaurant.reviews}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Reviews
            </p>
          </button>

          <div className="flex flex-col items-center justify-center py-3.5 px-2">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <Clock size={16} className="text-[#F26A1C]" strokeWidth={2.5} />
              <span className="text-[16px] font-black text-gray-900">
                {restaurant.avgDeliveryTime}m
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Delivery
            </p>
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      <p className="px-5 text-[14px] text-gray-600 font-medium mb-8 leading-relaxed">
        {restaurant.description}
      </p>

      {/* ── Menu Items ── */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[18px] font-black">
            {isPromoOnly ? "Promo Offers" : "Menu Items"}
          </h3>
          {isPromoOnly && (
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">
              Limited Time Deals
            </span>
          )}
        </div>

        {(() => {
          const displayedMenu = isPromoOnly 
            ? restaurant.menu?.filter(item => item.isPromo) 
            : restaurant.menu;

          if (!displayedMenu || displayedMenu.length === 0) {
            return (
              <div className="py-10 text-center bg-gray-50 rounded-[24px] border border-gray-100">
                <p className="text-gray-500 font-bold text-sm">
                  {isPromoOnly ? "No promo items currently available." : "No menu items found."}
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-2 gap-4">
              {displayedMenu.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-[20px] p-3 flex flex-col items-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.03)] relative overflow-hidden"
              >
                {/* Fasting badge */}
                {item.isFasting && (
                  <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full">
                    Fasting
                  </span>
                )}

                {/* Unavailability badge */}
                {item.isAvailable === false && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full">
                    Unavailable
                  </span>
                )}

                {/* Clickable image area */}
                <div
                  className="w-full cursor-pointer group"
                  onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.FOOD.DETAILS, { foodId: item.id }))}
                >
                  <div className="w-full h-[100px] mb-3 rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-active:scale-105 transition-transform"
                    />
                  </div>

                  <h4 className="font-bold text-[14px] text-gray-900 mb-1 truncate w-full px-1">
                    {item.name}
                  </h4>

                  {/* Prep time badge */}
                  {item.prepTimeMins && (
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={11} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400 font-medium">
                        {item.prepTimeMins} min
                      </span>
                    </div>
                  )}

                  <p className="font-black text-[#F26A1C] mb-3">
                    {item.price} ETB
                  </p>
                </div>

                {/* Add to Cart */}
                <button
                  disabled={item.isAvailable === false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                  className="bg-[#FFF4ED] hover:bg-[#F26A1C] text-[#F26A1C] hover:text-white font-bold py-2.5 px-4 rounded-[14px] w-full text-[13px] active:scale-95 transition-all mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.isAvailable === false ? (item.availabilityReason ?? "Unavailable") : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
          );
        })()}
      </section>
    </div>
  );
}
