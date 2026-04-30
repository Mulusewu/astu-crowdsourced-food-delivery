import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  Bell,
  Star,
  Bookmark,
  Check,
  Headphones,
  SlidersHorizontal,
  ChevronDown,
  Gift,
  X,
} from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { useCustomerStore } from "@/store/customer/customerStore";
import { useCartStore } from "@/store/cart/cartStore";
import {
  useRestaurantStore,
  type FoodItem,
  type Restaurant,
} from "@/store/restaurantStore";

import {
  getRoleIcon,
  getRoleDisplayName,
  getAvailableRoles,
} from "@/types/user.types";
import { Skeleton } from "@/components/ui/skeleton";

// --- Main Page Component ---
export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, activeRole, switchRole } = useAuthStore();
  const { fetchUserData, isLoading: userLoading } = useCustomerStore();
  const {
    restaurants,
    popularFoods,
    fetchRestaurants,
    fetchPopularFoods,
    isLoading: restaurantLoading,
  } = useRestaurantStore();

  const [activeTab, setActiveTab] = useState<
    "All" | "Foods" | "Restaurants" | "Fast Foods" | "Coffee"
  >("All");
  const [isLoading, setIsLoading] = useState(true);

  // Multi-role Dropdown
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const availableRoles = getAvailableRoles(user);
  const hasMultipleRoles = availableRoles.length > 1;

  // Dropdown states for Restaurant Tab
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("Location");
  const [filterBy, setFilterBy] = useState("All");

  // Advanced Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // Filter Modal local states
  const [selectedPrice, setSelectedPrice] = useState("Any");
  const [selectedLocation, setSelectedLocation] = useState("Any");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
      await fetchRestaurants();
      await fetchPopularFoods();
      setIsLoading(false);
    };
    init();
  }, [fetchUserData, fetchRestaurants, fetchPopularFoods]);

  // --- UI Sub-Components ---

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
              onClick={() => navigate(`/customer/restaurant/${rest.id}`)}
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

  const FoodCard = ({ food }: { food: FoodItem }) => (
    <div
      onClick={() => navigate(`/customer/food/${food.id}`)}
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
            {food.name}
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
            // Favorites logic here
          }}
          className="text-[#F26A1C] p-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-md active:scale-90 transition-transform"
        >
          <Bookmark size={16} className="fill-current" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            useCartStore.getState().addToCart({
              ...food,
              quantity: 1,
              restaurantName: food.restaurant,
            } as any);
          }}
          className="text-white bg-[#F26A1C] text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#e05d15] active:scale-95 transition-all shadow-sm"
        >
          Add
        </button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (isLoading || userLoading || restaurantLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
        <Skeleton className="h-12 w-full mb-4 rounded-xl" />
        <Skeleton className="h-32 w-full mb-4 rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans relative">
      {/* HEADER SECTION */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex justify-between items-start mb-5">
          <div className="relative">
            <h1 className="text-[#F26A1C] font-bold text-[15px] leading-tight">
              Welcome Back,
            </h1>
            <h2
              onClick={() =>
                hasMultipleRoles ? setShowRoleMenu(!showRoleMenu) : null
              }
              className="text-gray-900 dark:text-white font-black text-2xl capitalize flex items-center gap-1 cursor-pointer active:opacity-70 transition-opacity"
            >
              {user?.name?.split(" ")[0] || "John"}
              {hasMultipleRoles && (
                <ChevronDown size={20} className="text-[#F26A1C] mt-1" />
              )}
            </h2>

            {/* Multi-role Support Dropdown */}
            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role as any);
                      setShowRoleMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span
                      className={
                        activeRole === role ? "text-[#F26A1C]" : "text-gray-500"
                      }
                    >
                      {getRoleIcon(role)}
                    </span>
                    <span
                      className={`font-medium ${activeRole === role ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                    >
                      {getRoleDisplayName(role)}
                    </span>
                    {activeRole === role && (
                      <Check size={16} className="ml-auto text-[#F26A1C]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="text-[#F26A1C] bg-[#FFF4ED] dark:bg-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform">
              <Gift size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => navigate("/customer/support")}
              className="text-[#F26A1C] bg-[#FFF4ED] dark:bg-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <Headphones size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => navigate("/customer/notifications")}
              className="text-[#F26A1C] bg-[#FFF4ED] dark:bg-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform relative"
            >
              <Bell size={18} strokeWidth={2.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#FFF4ED] dark:border-gray-800"></span>
            </button>
          </div>
        </div>

        {/* ENHANCED SEARCH & FILTER BAR */}
        <div className="flex items-center gap-3 mb-6">
          {/* Main Search Input */}
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
              className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full pl-11 pr-4 py-3.5 text-[14px] text-gray-900 dark:text-white font-medium shadow-sm outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Filter Modal Trigger (Kept exactly as requested) */}
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
          <div
            className="relative w-full h-[140px] rounded-[24px] overflow-hidden shadow-md cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => navigate("/customer/restaurant/rest_004")}
          >
            <img
              onClick={() => navigate("/customer/offers/:offerId")}
              src="https://images.unsplash.com/photo-1600891964092-4316b2880328?w=800"
              className="w-full h-full object-cover"
              alt="Promo"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-white font-bold text-lg leading-tight w-[70%]">
                  Try The Special Combo At Helen's
                </h2>
                <p className="text-gray-300 text-[10px] mt-1 font-medium">
                  Enough For 5 People
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white text-[11px] font-bold">Order 2,</p>
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
        </div>

        {/* SCROLLABLE TABS */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {["All", "Foods", "Restaurants", "Fast Foods", "Coffee"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
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
              {restaurants.map((rest) => (
                <div
                  key={rest.id}
                  className="w-[150px] shrink-0 bg-white dark:bg-gray-900 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => navigate(`/customer/restaurant/${rest.id}`)}
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
              {popularFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: RESTAURANTS */}
        {activeTab === "Restaurants" && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            {/* Custom Styled Filters Row from Figma */}
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
                {/* Figma Match: Orange Header Dropdown */}
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-[#F26A1C] text-white text-center py-2 text-[11px] font-bold">
                      Location
                    </div>
                    {["Rating", "Newest To Oldest", "Oldest To Newest"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setShowSortDropdown(false);
                          }}
                          className="w-full text-center px-3 py-2.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        >
                          {opt}
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
                  {filterBy} <ChevronDown size={14} className="text-gray-400" />
                </button>
                {/* Figma Match: Orange Header Dropdown */}
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-[#F26A1C] text-white text-center py-2 text-[11px] font-bold">
                      All
                    </div>
                    {["In-Campus", "Bole", "Geda", "Kereyu", "Main"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setFilterBy(opt);
                            setShowFilterDropdown(false);
                          }}
                          className="w-full text-center px-3 py-2.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        >
                          {opt}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Categorized Lists */}
            <LocationGroup
              title="In-Campus"
              items={restaurants.filter(
                (r) => r.location === "ASTU Campus" || filterBy === "In-Campus",
              )}
            />
            <LocationGroup
              title="Geda Gate"
              items={restaurants.filter(
                (r) => r.location === "Geda" || filterBy === "Geda",
              )}
            />
            <LocationGroup
              title="Bole Gate"
              items={restaurants.filter(
                (r) => r.location === "Bole" || filterBy === "Bole",
              )}
            />
            <LocationGroup
              title="Kereyu Gate"
              items={restaurants.filter(
                (r) => r.location === "Kereyu" || filterBy === "Kereyu",
              )}
            />
            <LocationGroup
              title="Main Gate"
              items={restaurants.filter(
                (r) => r.location === "Main" || filterBy === "Main",
              )}
            />
          </div>
        )}
      </main>
      {/* --- ADVANCED FILTER MODAL (Mobile First Bottom Sheet) --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          {/* Backdrop (Covers full screen) */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsFilterModalOpen(false)}
          />

          {/* Modal Content (Constrained to mobile width with max-w-md and mx-auto) */}
          <div className="relative w-full max-w-md mx-auto max-h-[90vh] flex flex-col bg-white dark:bg-gray-950 rounded-t-[32px] overflow-hidden animate-in slide-in-from-bottom-full duration-300 pb-[env(safe-area-inset-bottom)] shadow-2xl">
            {/* Drag Handle Indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full z-10" />

            {/* Orange Top Area with Real Input */}
            <div className="bg-[#F26A1C] px-5 pt-10 pb-10 rounded-t-[32px]">
              <div className="flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-3">
                <Search size={20} className="text-white shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-white placeholder:text-white/80"
                  autoFocus
                />
                <SlidersHorizontal
                  size={18}
                  className="text-white shrink-0 cursor-pointer"
                />
              </div>
            </div>

            {/* White Body Area */}
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

              {/* Recent Searches */}
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-3">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Soya Rekey",
                    "Special Firfir",
                    "Tegabino",
                    "Aynet",
                    "Ertib",
                    "Oromen",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 shadow-sm active:scale-95 transition-transform"
                    >
                      {tag}{" "}
                      <X size={12} className="text-gray-400 cursor-pointer" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Filters */}
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
                  ].map((price) => (
                    <button
                      key={price}
                      onClick={() => setSelectedPrice(price)}
                      className={`px-4 py-2 rounded-[10px] text-[12px] font-bold transition-colors active:scale-95 ${selectedPrice === price
                        ? "bg-[#F26A1C] text-white shadow-md"
                        : "bg-[#FFF4ED] dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-700"
                        }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filters */}
              <div className="mb-8">
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-3">
                  Location
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Any",
                    "Geda Gate",
                    "Bole Gate",
                    "Kereyu Gate",
                    "Kulibi Gate",
                    "Around Cafe",
                    "Stadium",
                  ].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`px-4 py-2 rounded-[10px] text-[12px] font-bold transition-colors active:scale-95 ${selectedLocation === loc
                        ? "bg-[#F26A1C] text-white shadow-md"
                        : "bg-[#FFF4ED] dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-700"
                        }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-auto pt-2">
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[20px] font-bold text-[15px] py-4 shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-transform"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
