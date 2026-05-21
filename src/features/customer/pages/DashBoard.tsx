import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import {
  MapPin,
  Search,
  Bell,
  Star,
  Bookmark,
  Headphones,
  SlidersHorizontal,
  ChevronDown,
  ShoppingCart,
  X,
  User,
  LogOut
} from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { useSavedItemsStore } from "@/store/customer/savedItemsStore";
import { useCartStore } from "@/store/cart/cartStore";
import {
  useRestaurantStore,
  type FoodItem,
  type Restaurant,
} from "@/store/restaurantStore";
import { useFilterStore } from "@/store/customer/filterStore";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function firstName(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName;
}

function firstInitial(fullName: string) {
  return (fullName.trim()[0] ?? "U").toUpperCase();
}

 const LocationGroup = ({
    title,
    items,
  }: {
    title: string;
    items: Restaurant[];
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[15px]">
          {title}
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.map((rest) => (
            <div
              key={rest.id}
              className="w-[140px] shrink-0 bg-white dark:bg-gray-900 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer border border-transparent"
              onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.RESTAURANT.DETAILS, { restaurantId: rest.id }))}
            >
              <img
                src={rest.image}
                alt={rest.name}
                className="w-full h-[90px] object-cover"
              />
              <div className="p-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate pr-1">
                    {rest.name}
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star size={12} className="fill-[#F26A1C] text-[#F26A1C]" />
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                      {rest.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin size={10} className="text-[#F26A1C]" />
                  <span className="text-[10px] font-medium truncate">
                    {rest.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
// --- Main Page Component ---
export default function CustomerDashboard() {
  const navigate = useNavigate();

  // 1. Identity
  const { user, logout } = useAuthStore();
  
  // 2. Bookmarks (Backend Synced)
  const { 
    items: savedItems, 
    fetchSavedItems, 
    addItem: addBookmark, 
    removeItem: removeBookmark, 
    isSaved 
  } = useSavedItemsStore();

  // 3. Feeds (Backend Synced)
  const {
    restaurants,
    popularFoods,
    fetchRestaurants,
    fetchPopularFoods,
    fetchRestaurantDetails ,
    isLoading: restaurantLoading,
  } = useRestaurantStore();

  const cartCount = useCartStore(state => state.getTotalItems());

  // 4. UI States
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const hasUnreadNotifications = true; 

  // 5. Backend-Aligned Filters
  const {
    searchQuery,
    recentSearches,
    selectedPriceRange,
    selectedGate,
    sortBy,
    activeTab,
    setSearchQuery,
    setSelectedPriceRange,
    setSortBy,
    setSelectedGate,
    setActiveTab,
    addRecentSearch,
    removeRecentSearch,
    getDiscoveryParams, 
    getRestaurantParams
  } = useFilterStore();

  // Replace with actual device GPS coordinates if implemented later
  const userLat = undefined; 
  const userLng = undefined;

  // Initial Boot
  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Centralized Backend Fetcher (Reacts to filter changes automatically)
  useEffect(() => {
    if (activeTab === "Restaurants") {
      const params = getRestaurantParams(userLat, userLng);
      console.log("params are", params);
      fetchRestaurants();
    } else {
      const params = getDiscoveryParams();
      fetchRestaurants(params);
      
      // Also silently fetch restaurants to populate the top carousel in "All" tab
      if (activeTab === "All") {
        fetchRestaurants();
        fetchPopularFoods();
        // fetchRestaurants({ isOpen: 'true', sortBy: 'rating', limit: 10 });
      }
    }
  }, [
    searchQuery, 
    selectedPriceRange, 
    activeTab, 
    selectedGate,
    sortBy,
    userLat,
    userLng,
    fetchPopularFoods,
    fetchRestaurants
  ]);


  // --- UI Sub-Components ---

 

  const FoodCard = ({ food }: { food: FoodItem }) => {
    const saved = isSaved(food.id);

    return (
      <div
        onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.FOOD.DETAILS, { foodId: food.id }))}
        className="flex bg-white dark:bg-gray-900 rounded-2xl p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 mb-3 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <img
          src={food.image}
          alt={food.name}
          className="w-[85px] h-[85px] rounded-xl object-cover"
        />
        <div className="flex-1 px-3 flex flex-col justify-between py-0.5">
          <div>
            <h4 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">
              {food.name} {food.isFasting && '🌱'}
            </h4>
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <MapPin size={11} className="text-[#F26A1C]" />
              <span className="text-[11px] font-medium">
                {food.restaurant}, {food.location}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-[#F26A1C] text-[#F26A1C]" />
              <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">
                {food.rating}
              </span>
            </div>
            <span className="text-[13px] font-bold text-[#F26A1C]">
              {food.price} Birr
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end w-[60px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (saved) {
                removeBookmark(food.id, "MENU_ITEM");
              } else {
                addBookmark({
                  id: food.id,
                  type: "MENU_ITEM",
                  name: food.name,
                  location: `${food.restaurant}, ${food.location}`,
                  image: food.image || "",
                });
              }
            }}
            className="text-[#F26A1C] p-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-md active:scale-90 transition-transform"
          >
            <Bookmark
              size={16}
              className={saved ? "fill-[#F26A1C]" : "text-[#F26A1C]"}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Backend Cart DTO compliance
              useCartStore.getState().addToCart({
                menuId: food.id,
                name: food.name,
                expectedUnitPrice: food.price,
                quantity: 1,
                image: food.image,
                restaurantId: food.restaurantId,
              });
              toast.success("Added to Cart", {
                description: `${food.name} was added to your cart.`,
                duration: 2000,
              });
            }}
            className="text-white bg-[#F26A1C] text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#e05d15] active:scale-95 transition-all shadow-sm"
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  if (restaurantLoading && restaurants.length === 0 && popularFoods.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
        <Skeleton className="h-12 w-full mb-4 rounded-xl" />
        <Skeleton className="h-32 w-full mb-4 rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const name = user?.fullName || "Customer";

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans relative">
      {/* HEADER SECTION */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
             <div className="relative shrink-0">
              {showProfileMenu && (
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setShowProfileMenu(false)}
                />
              )}
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative z-[101] flex h-11 w-11 items-center justify-center rounded-full bg-[#F26A1C] text-lg font-semibold text-white shadow-sm transition hover:bg-[#F26A1C]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1C] focus-visible:ring-offset-2"
                aria-label="Account menu"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  firstInitial(name)
                )}
              </button>
              {showProfileMenu && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 shadow-lg z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                    <p className="text-xs text-gray-500">
                      {user?.email ?? user?.astuEmail ?? ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.CUSTOMER.PROFILE)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <User size={16} /> View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-[#F26A1C] font-bold text-[15px] leading-tight">
                Welcome Back,
              </h1>
              <h2
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="text-gray-900 dark:text-white font-black text-2xl capitalize flex items-center gap-1 cursor-pointer active:opacity-70 transition-opacity"
              >
                {firstName(name)}
              </h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => navigate(ROUTES.CUSTOMER.CART)} 
              className="text-[#F26A1C] bg-[#FFF4ED] dark:bg-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform relative"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate(ROUTES.CUSTOMER.SUPPORT)}
              className="text-[#F26A1C] bg-[#FFF4ED] dark:bg-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <Headphones size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => navigate(ROUTES.CUSTOMER.NOTIFICATIONS)}
              className="text-[#F26A1C] bg-[#FFF4ED] dark:bg-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform relative"
            >
              <Bell size={18} strokeWidth={2.5} />
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 flex w-[14px] h-[14px] items-center justify-center bg-red-500 rounded-full border-2 border-white dark:border-gray-950 text-white text-[10px] font-bold leading-none">
                  +
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ENHANCED SEARCH & FILTER BAR */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-gray-400 pointer-events-none"
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addRecentSearch(searchQuery);
              }}
              className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full pl-11 pr-4 py-3.5 text-[14px] text-gray-900 dark:text-white font-medium shadow-sm outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-all placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex shrink-0 items-center justify-center w-[46px] h-[46px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            <SlidersHorizontal
              size={18}
              className="text-gray-600 dark:text-gray-300"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </header>
      
      {/* MAIN SCROLLABLE CONTENT */}
      <main className="px-5">
        {/* PROMO BANNER */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[15px]">
            Ongoing Offers
          </h3>
          {(() => {
            const promoRestaurant = restaurants.find(r => r.menu?.some(m => m.isPromo)) || restaurants[0];
            const promoRestId = promoRestaurant?.id;
            
            return (
              <div
                className="relative w-full h-[140px] rounded-[24px] overflow-hidden shadow-md cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => {
                  if(promoRestId) navigate(buildRoute(ROUTES.CUSTOMER.RESTAURANT.DETAILS, { restaurantId: promoRestId }) + "?promoOnly=true");
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600891964092-4316b2880328?w=800"
                  className="w-full h-full object-cover"
                  alt="Promo"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight w-[70%]">
                      Try The Special Combo At {promoRestaurant?.name || "Our Partners"}
                    </h2>
                    <p className="text-gray-300 text-[10px] mt-1 font-medium">
                      Exclusive App Discounts
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white text-[11px] font-bold">Limited Time,</p>
                      <p className="text-white text-lg font-black leading-none">
                        GET 50% OFF
                      </p>
                    </div>
                    <button className="bg-[#F26A1C] text-white text-[12px] font-bold px-6 py-2 rounded-full shadow-lg hover:bg-[#e05d15] active:scale-95 transition-transform">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* SCROLLABLE TABS */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {["All", "Foods", "Restaurants", "Fast Foods", "Coffee"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-2 rounded-[14px] text-[13px] font-bold transition-all shadow-sm border
              ${activeTab === tab
                    ? "bg-[#F26A1C] text-white border-[#F26A1C]"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* TAB CONTENT: ALL */}
        {activeTab === "All" && (
          <div className="animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[16px] flex items-center gap-1">
              🔥 Top Restaurants
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-2">
              {restaurants.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 w-full text-center">No restaurants match your filters.</p>
              ) : restaurants.map((rest) => (
                <div
                  key={rest.id}
                  className="w-[150px] shrink-0 bg-white dark:bg-gray-900 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.RESTAURANT.DETAILS, { restaurantId: rest.id }))}
                >
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-[95px] object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[13px] text-gray-900 dark:text-white truncate">
                        {rest.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-[#F26A1C] text-[#F26A1C]"
                        />
                        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">
                          {rest.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin size={11} className="text-[#F26A1C]" />
                      <span className="text-[11px] font-medium truncate">
                        {rest.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-3 mt-4 text-[16px] flex items-center gap-1">
              🔥 Popular Near You
            </h3>
            <div>
              {popularFoods.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 w-full text-center">No foods match your filters.</p>
              ) : popularFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: RESTAURANTS */}
        {activeTab === "Restaurants" && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6 px-1 z-10 relative">
              <div className="relative">
                <p className="text-[12px] font-bold text-gray-900 dark:text-white mb-1">
                  Sort By:
                </p>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {sortBy} <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setSortBy("name");
                        setShowSortDropdown(false);
                      }}
                      className={`w-full bg-[#F26A1C] text-white text-center py-2 text-[11px] font-bold active:opacity-90 ${sortBy === "name" ? "ring-2 ring-inset ring-white/50" : ""}`}
                    >
                      A to Z
                    </button>
                    {["rating", "distance"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt as any);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-center px-3 py-2.5 text-[11px] font-semibold hover:bg-gray-50 border-b border-gray-50 last:border-0 ${
                            sortBy === opt ? "text-[#F26A1C] bg-orange-50/50" : "text-gray-700"
                          }`}
                        >
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="relative text-right">
                <p className="text-[12px] font-bold text-gray-900 dark:text-white mb-1">
                  Filter By:
                </p>
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center justify-end gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 w-full"
                >
                  {selectedGate} <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setSelectedGate("Any");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full bg-[#F26A1C] text-white text-center py-2 text-[11px] font-bold active:opacity-90 ${selectedGate === "Any" ? "ring-2 ring-inset ring-white/50" : ""}`}
                    >
                      All Gates
                    </button>
                    {["In-Campus", "Bole", "Geda", "Kereyu", "Main"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedGate(opt);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-center px-3 py-2.5 text-[11px] font-semibold hover:bg-gray-50 border-b border-gray-50 last:border-0 ${
                            selectedGate === opt ? "text-[#F26A1C] bg-orange-50/50" : "text-gray-700"
                          }`}
                        >
                          {opt}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* We preserve the client-side location grouping purely for UI aesthetic, 
                but it operates on the backend-filtered `restaurants` array */}
            {(selectedGate === "Any" || selectedGate === "In-Campus") && (
              <LocationGroup
                title="In-Campus"
                items={restaurants.filter((r) => r.location.toLowerCase().includes("campus") || r.location.toLowerCase().includes("block"))}
              />
            )}
            {(selectedGate === "Any" || selectedGate === "Geda") && (
              <LocationGroup
                title="Geda Gate"
                items={restaurants}
              />
            )}
            {(selectedGate === "Any" || selectedGate === "Bole") && (
              <LocationGroup
                title="Bole Gate"
                items={restaurants.filter((r) => r.location.toLowerCase().includes("bole"))}
              />
            )}
          </div>
        )}

        {/* TAB CONTENT: FOODS, FAST FOODS, COFFEE */}
        {(activeTab === "Foods" ||
          activeTab === "Fast Foods" ||
          activeTab === "Coffee") && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-5 px-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-[16px]">
                {activeTab === "Foods" ? "All Delicious Foods" : `Best ${activeTab}`}
              </h3>
            </div>
            <div className="space-y-3">
              {popularFoods.length === 0 && (
                <p className="text-sm text-gray-500 py-4 w-full text-center">No foods match your filters.</p>
              )}
              {popularFoods
                .filter((food) => {
                  if (activeTab === "Fast Foods") return food.name.toLowerCase().includes("burger") || food.name.toLowerCase().includes("pizza") || food.name.toLowerCase().includes("fast");
                  if (activeTab === "Coffee") return food.name.toLowerCase().includes("coffee") || food.name.toLowerCase().includes("macchiato");
                  return true;
                })
                .map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
            </div>
          </div>
        )}
      </main>
      
      {/* --- ADVANCED FILTER MODAL (Mobile First Bottom Sheet) --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsFilterModalOpen(false)}
          />

          <div className="relative w-full max-w-md mx-auto max-h-[90vh] flex flex-col bg-white dark:bg-gray-950 rounded-t-[32px] overflow-hidden animate-in slide-in-from-bottom-full duration-300 pb-[env(safe-area-inset-bottom)] shadow-2xl">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full z-10" />

            <div className="bg-[#F26A1C] px-5 pt-10 pb-10 rounded-t-[32px]">
              <div className="flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-3">
                <Search size={20} className="text-white shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addRecentSearch(searchQuery);
                  }}
                  className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-white placeholder:text-white/80"
                  autoFocus
                />
                <SlidersHorizontal
                  size={18}
                  className="text-white shrink-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto bg-white dark:bg-gray-950 -mt-6 rounded-t-[24px]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[18px] font-black text-gray-900 dark:text-white">
                  Filter
                </h2>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 dark:bg-gray-800 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="h-[1px] w-full bg-orange-100 dark:bg-gray-800 mb-6" />

              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-3">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.length === 0 && (
                    <p className="text-xs text-gray-400">No recent searches</p>
                  )}
                  {recentSearches.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 shadow-sm active:scale-95 transition-transform cursor-pointer"
                    >
                      {tag}{" "}
                      <X
                        size={12}
                        className="text-gray-400 cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(tag);
                        }}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-3">
                  Price
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Any",
                    "80-100",
                    "100-120",
                    "120-150",
                    "150-200",
                    "200-250",
                    "250-300",
                    "300-400",
                  ].map((price) => (
                    <button
                      key={price}
                      onClick={() => setSelectedPriceRange(price)}
                      className={`px-4 py-2 rounded-[10px] text-[12px] font-bold transition-colors active:scale-95 ${selectedPriceRange === price
                        ? "bg-[#F26A1C] text-white shadow-md"
                        : "bg-[#FFF4ED] dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-700"
                        }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}