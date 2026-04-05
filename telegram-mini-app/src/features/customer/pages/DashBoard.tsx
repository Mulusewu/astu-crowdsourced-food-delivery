import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Search, Bell, Heart, ChevronRight, 
  Star, Tag, ShoppingBag, UserCircle, Check, 
  Headphones, SlidersHorizontal, ChevronDown, 
  Home, Bookmark, ListOrdered, User
} from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { useCustomerStore } from "@/store/customer/customerStore";
import { useCartStore } from "@/store/cart/cartStore";

import { getRoleIcon, getRoleDisplayName, getAvailableRoles } from "@/types/user.types";
import { Skeleton } from "@/components/ui/skeleton";

// --- Types ---
interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  location: string; // e.g., "Bole Gate", "In-Campus"
  deliveryTime: string;
  isOpen: boolean;
  cuisine: string[];
}

interface FoodItem {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  location: string;
  price: number;
  image: string;
  rating: number;
}

// --- Main Page Component ---
export default function HomePage() {
  const navigate = useNavigate();
  const { user, activeRole, switchRole } = useAuthStore();
  const { fetchUserData, isLoading: userLoading } = useCustomerStore();
  const { items: cartItems, getTotalItems } = useCartStore();
  
  const [activeTab, setActiveTab] = useState<"All" | "Foods" | "Restaurants" | "Fast Foods" | "Coffee">("All");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Dropdown states for Restaurant Tab
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("Location");
  const [filterBy, setFilterBy] = useState("All");

  const availableRoles = getAvailableRoles(user);
  const hasMultipleRoles = availableRoles.length > 1;

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
      await loadMockData();
    };
    init();
  }, [fetchUserData]);

  const loadMockData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Network delay simulation
      
      // Data matching the specific design categories
      setRestaurants([
        { id: "r1", name: "Helen", rating: 4.2, location: "Bole Gate", isOpen: true, deliveryTime: "15 min", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", cuisine: ["Traditional"] },
        { id: "r2", name: "Mami", rating: 3.8, location: "Geda Gate", isOpen: true, deliveryTime: "20 min", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400", cuisine: ["Fast Food"] },
        { id: "r3", name: "Etu", rating: 4.2, location: "Geda Gate", isOpen: true, deliveryTime: "10 min", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400", cuisine: ["Coffee"] },
        { id: "r4", name: "Barch", rating: 3.9, location: "Bole Gate", isOpen: true, deliveryTime: "25 min", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", cuisine: ["Fast Food"] },
        { id: "r5", name: "Mesi", rating: 4.2, location: "In-Campus", isOpen: true, deliveryTime: "5 min", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400", cuisine: ["Traditional"] },
      ]);
      
      setPopularFoods([
        { id: "f1", name: "Soya", restaurant: "Barch's", location: "Bole Gate", price: 100, rating: 3.8, image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400" },
        { id: "f2", name: "Beyaynet", restaurant: "Helen's", location: "Bole Gate", price: 120, rating: 4.1, image: "https://images.unsplash.com/photo-1604328909899-7e7b3a2d9a5d?w=400" },
        { id: "f3", name: "Tegabino", restaurant: "Mesi's", location: "Bole Gate", price: 100, rating: 4.2, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
        { id: "f4", name: "Pasta Besiga", restaurant: "Mesi's", location: "Bole Gate", price: 110, rating: 4.3, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Sub-Components matching design exactly ---

  const LocationGroup = ({ title, items }: { title: string, items: Restaurant[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[15px]">{title}</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.map(rest => (
            <div key={rest.id} className="w-[140px] shrink-0 bg-white dark:bg-gray-900 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer" onClick={() => navigate(`/customer/restaurant/${rest.id}`)}>
              <img src={rest.image} alt={rest.name} className="w-full h-[90px] object-cover" />
              <div className="p-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{rest.name}</span>
                  <div className="flex items-center gap-0.5">
                    <Star size={12} className="fill-[#F26A1C] text-[#F26A1C]" />
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{rest.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin size={10} className="text-[#F26A1C]" />
                  <span className="text-[10px] font-medium truncate">{rest.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FoodCard = ({ food }: { food: FoodItem }) => (
    <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 mb-3 active:scale-[0.98] transition-transform">
      <img src={food.image} alt={food.name} className="w-[85px] h-[85px] rounded-xl object-cover" />
      <div className="flex-1 px-3 flex flex-col justify-between py-0.5">
        <div>
          <h4 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">{food.name}</h4>
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <MapPin size={11} className="text-[#F26A1C]" />
            <span className="text-[11px] font-medium">{food.restaurant}, {food.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-[#F26A1C] text-[#F26A1C]" />
            <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">{food.rating}</span>
          </div>
          <span className="text-[13px] font-bold text-[#F26A1C]">{food.price} Birr</span>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end w-[60px]">
        <button className="text-[#F26A1C] p-1 bg-orange-50 dark:bg-orange-900/20 rounded-md">
          <Bookmark size={18} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); useCartStore.getState().addToCart({...food, quantity: 1, restaurantName: food.restaurant} as any); }}
          className="bg-[#F26A1C] text-white text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#e05d15] transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (isLoading || userLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4"><Skeleton className="h-12 w-full mb-4" /><Skeleton className="h-32 w-full mb-4" /><Skeleton className="h-40 w-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans">
      
      {/* HEADER SECTION */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-[#F26A1C] font-bold text-[15px] leading-tight">Welcome Back,</h1>
            <h2 className="text-gray-900 dark:text-white font-black text-2xl capitalize">
              {user?.name?.split(" ")[0] || "John"}
            </h2>
          </div>
          <div className="flex gap-3">
            {/* Multi-role Support via user avatar/menu */}
            {hasMultipleRoles && (
              <div className="relative">
                <button onClick={() => setShowRoleMenu(!showRoleMenu)} className="w-10 h-10 rounded-full bg-orange-50 dark:bg-gray-800 text-[#F26A1C] flex items-center justify-center">
                  <UserCircle size={22} />
                </button>
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                    {availableRoles.map(role => (
                      <button key={role} onClick={() => { switchRole(role as any); setShowRoleMenu(false); }} className="w-full px-4 py-2 text-left text-sm flex items-center gap-3">
                        <span className={activeRole === role ? "text-[#F26A1C]" : "text-gray-500"}>{getRoleIcon(role)}</span>
                        <span className={`font-medium ${activeRole === role ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>{getRoleDisplayName(role)}</span>
                        {activeRole === role && <Check size={16} className="ml-auto text-[#F26A1C]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button className="text-[#F26A1C] bg-orange-50 dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Headphones size={20} />
            </button>
            <button className="text-[#F26A1C] bg-orange-50 dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2.5 shadow-sm">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search" 
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
            onClick={() => navigate("/search")}
          />
          <SlidersHorizontal size={18} className="text-gray-400 shrink-0" />
        </div>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="px-5">
        
        {/* BANNER */}
        <div className="mt-2 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[15px]">Ongoing Offers</h3>
          <div className="relative w-full h-[140px] rounded-[20px] overflow-hidden shadow-md cursor-pointer" onClick={() => navigate("/customer/restaurant/r1")}>
            <img src="https://images.unsplash.com/photo-1600891964092-4316b2880328?w=800" className="w-full h-full object-cover" alt="Promo" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-white font-bold text-xl leading-tight w-[60%]">Try The Special Combo At Helen's</h2>
                <p className="text-gray-300 text-[10px] mt-1 font-medium">Enough For 5 People</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white text-[11px] font-bold">Order 2,</p>
                  <p className="text-white text-lg font-black leading-none">GET 50% OFF</p>
                </div>
                <button className="bg-[#F26A1C] text-white text-[11px] font-bold px-5 py-2 rounded-full shadow-lg hover:bg-[#e05d15]">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE TABS */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {["All", "Foods", "Restaurants", "Fast Foods", "Coffee"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap px-5 py-1.5 rounded-full text-sm font-semibold transition-all shadow-sm border
                ${activeTab === tab 
                  ? "bg-[#F26A1C] text-white border-[#F26A1C]" 
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: ALL */}
        {activeTab === "All" && (
          <div className="animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-[16px] flex items-center gap-1">
              🔥 Top Restaurants
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-2">
              {restaurants.map(rest => (
                <div key={rest.id} className="w-[150px] shrink-0 bg-white dark:bg-gray-900 rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 overflow-hidden cursor-pointer" onClick={() => navigate(`/customer/restaurant/${rest.id}`)}>
                  <img src={rest.image} alt={rest.name} className="w-full h-[95px] object-cover" />
                  <div className="p-2.5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{rest.name}</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-[#F26A1C] text-[#F26A1C]" />
                        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">{rest.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin size={11} className="text-[#F26A1C]" />
                      <span className="text-[11px] font-medium truncate">{rest.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-3 mt-4 text-[16px] flex items-center gap-1">
              🔥 Popular Near You
            </h3>
            <div>
              {popularFoods.map(food => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: RESTAURANTS */}
        {activeTab === "Restaurants" && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            {/* Filters Row */}
            <div className="flex justify-between items-center mb-6 px-1">
              <div className="relative">
                <p className="text-[11px] font-bold text-gray-500 mb-0.5">Sort By:</p>
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                  {sortBy} <ChevronDown size={14} className="text-[#F26A1C]" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-900 border border-[#F26A1C] rounded-lg shadow-lg z-10 overflow-hidden">
                    {["Location", "Rating", "Newest To Oldest", "Oldest To Newest"].map(opt => (
                      <button key={opt} onClick={() => { setSortBy(opt); setShowSortDropdown(false); }} className={`w-full text-left px-3 py-2 text-[11px] font-semibold ${sortBy === opt ? 'bg-[#F26A1C] text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative text-right">
                <p className="text-[11px] font-bold text-gray-500 mb-0.5">Filter By:</p>
                <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center justify-end gap-1 text-sm font-bold text-gray-900 dark:text-white w-full">
                  {filterBy} <ChevronDown size={14} className="text-[#F26A1C]" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
                    {["All", "In-Campus", "Bole", "Geda", "Kereyu", "Main"].map(opt => (
                      <button key={opt} onClick={() => { setFilterBy(opt); setShowFilterDropdown(false); }} className={`w-full text-left px-3 py-2 text-[11px] font-semibold ${filterBy === opt ? 'text-[#F26A1C] bg-orange-50 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categorized Lists */}
            <LocationGroup title="In-Campus" items={restaurants.filter(r => r.location === "In-Campus" || filterBy === "In-Campus")} />
            <LocationGroup title="Geda Gate" items={restaurants.filter(r => r.location === "Geda Gate" || filterBy === "Geda")} />
            <LocationGroup title="Bole Gate" items={restaurants.filter(r => r.location === "Bole Gate" || filterBy === "Bole")} />
            <LocationGroup title="Kereyu Gate" items={restaurants.filter(r => r.location === "Kereyu Gate" || filterBy === "Kereyu")} />
            <LocationGroup title="Main Gate" items={restaurants.filter(r => r.location === "Main Gate" || filterBy === "Main")} />
          </div>
        )}

      </main>

      {/* CUSTOM BOTTOM NAVIGATION (Fixed) */}
      <div className="fixed bottom-4 left-4 right-4 bg-[#F26A1C] rounded-[24px] h-[65px] flex items-center justify-between px-6 shadow-xl shadow-orange-500/30 z-50">
        <button className="bg-white/20 p-2.5 rounded-full text-white transition-transform active:scale-95">
          <Home size={22} fill="white" />
        </button>
        <button className="text-white/80 hover:text-white transition-colors p-2">
          <Bookmark size={22} fill="currentColor" />
        </button>
        
        {/* Floating Center Action Button */}
        <div className="relative -top-5">
          <button className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F26A1C] active:scale-95 transition-transform" onClick={() => navigate("/customer/cart")}>
            <div className="bg-orange-100 rounded-full p-2 text-[#F26A1C]">
              <ShoppingBag size={20} fill="currentColor" />
            </div>
            {getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        <button className="text-white/80 hover:text-white transition-colors p-2">
          <ListOrdered size={22} />
        </button>
        <button className="text-white/80 hover:text-white transition-colors p-2" onClick={() => navigate("/customer/profile")}>
          <User size={22} fill="currentColor" />
        </button>
      </div>

    </div>
  );
}