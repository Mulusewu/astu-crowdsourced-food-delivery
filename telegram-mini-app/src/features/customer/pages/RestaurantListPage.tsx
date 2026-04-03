import React, { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import BottomNavBar from "../components/BottomNavBar";
import { useRestaurants } from "../lib/useRestaurants";

const OFFERS_IMAGES = [
  "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
];

const categories = ["All", "Foods", "Restaurants", "Fast Foods"];
const filterOptions = ["All", "In-Campus", "Bole Gate", "Geda Gate", "Kereyu Gate", "Main Gate"];
const sortOptions = ["Location", "Rating", "Newest To Oldest", "Oldest To Newest"];

const user = { name: "Helen" };

const RestaurantListPage: React.FC = () => {
  const {
    search, setSearch,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    filterBy, setFilterBy,
    displayedRestaurants,
    topRestaurants,
    popular,
    nearForYou
  } = useRestaurants();

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeOffer, setActiveOffer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOffer((prev) => (prev + 1) % OFFERS_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const close = () => {
      setShowSortDropdown(false);
      setShowFilterDropdown(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-20 flex justify-center">
      {/* Mobile constraint container */}
      <div className="w-full max-w-[420px] bg-gray-50 min-h-screen relative shadow-sm font-sans flex flex-col">
        
        {/* Header */}
        <div className="px-4 pt-5 pb-3 flex justify-between items-start">
          <div>
            <h1 className="text-[22px] font-extrabold text-orange-500 leading-tight">Welcome Back,</h1>
            <h2 className="text-[22px] font-extrabold text-gray-900 leading-tight">{user.name}</h2>
          </div>
          <div className="flex gap-2.5 mt-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition">
              {/* Basket Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition">
              {/* Headset Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 005.636 5.636m12.728 0A9 9 0 0121 12v3a3 3 0 01-3 3h-1m-4.364-15.364A9.001 9.001 0 003 12v3a3 3 0 003 3h1m11 0h-5m5 0v-4" /></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 relative hover:bg-orange-200 transition">
              {/* Bell Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          
          {/* Ongoing Offers Card */}
          <h2 className="text-sm font-bold text-gray-900 mb-2">Ongoing Offers</h2>
          <div className="relative rounded-2xl overflow-hidden mb-5 bg-gray-900 h-40 border border-gray-100 shadow-sm group cursor-pointer">
            <img 
              src={OFFERS_IMAGES[activeOffer]}
              alt="Offer" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-extrabold text-lg leading-tight max-w-[70%]">Try The Special Combo At Helen's</h3>
                <p className="text-white/90 text-xs mt-1">Enough For 5 People</p>
              </div>
              <div className="flex w-full justify-between items-end">
                 <p className="text-white font-bold text-sm leading-tight">Order 2,<br/>Get 50% Off</p>
                 <button className="relative z-10 bg-orange-500 hover:bg-orange-600 transition-colors text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-md">
                   Order Now
                 </button>
              </div>
            </div>
            {/* Interactive pagination dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 w-16 justify-between z-10">
              {OFFERS_IMAGES.map((_, idx) => (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveOffer(idx)}
                  className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${activeOffer === idx ? "bg-white" : "bg-white/40 hover:bg-white/80"}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 min-h-[36px] rounded-xl text-xs font-bold whitespace-nowrap shadow-sm border transition-colors ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Filter Bar */}
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="relative">
              <span className="text-xs font-bold text-gray-900 block mb-0.5">Sort By:</span>
              <button 
                onClick={(e) => {e.stopPropagation(); setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false);}}
                className="flex items-center min-h-[36px] text-[11px] text-gray-500 hover:bg-gray-100 px-2 py-1 -ml-2 rounded-md transition"
              >
                {sortBy} <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-20">
                  <div className="px-3 py-1 bg-orange-500 text-white text-xs font-bold text-center mx-1 rounded">Sort Options</div>
                  {sortOptions.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => {setSortBy(opt); setShowSortDropdown(false);}}
                      className={`w-full text-center px-3 py-2 text-xs border-b border-gray-50 last:border-0 ${sortBy === opt ? 'text-gray-900 font-bold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative text-right">
              <span className="text-xs font-bold text-gray-900 block mb-0.5 text-right">Filter By</span>
              <button 
                onClick={(e) => {e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false);}}
                className="flex items-center justify-end min-h-[36px] text-[11px] text-gray-500 hover:bg-gray-100 px-2 py-1 -mr-2 rounded-md transition"
              >
                {filterBy === "All" ? "All" : filterBy.replace(" Gate", "")} <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-20">
                  <div className="px-3 py-1 bg-orange-500 text-white text-xs font-bold text-center mx-1 rounded">Locations</div>
                  {filterOptions.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => {setFilterBy(opt); setShowFilterDropdown(false);}}
                      className={`w-full text-center px-3 py-2 text-xs border-b border-gray-50 last:border-0 ${filterBy === opt ? 'text-gray-900 font-bold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conditional Rendering based on Filter */}
          <div className="pb-5">
            {filterBy === "All" ? (
               <div className="space-y-7">
                 {topRestaurants.length > 0 && (
                   <div>
                     <h3 className="text-base font-bold text-gray-900 mb-2">Top Restaurants</h3>
                     <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
                       {topRestaurants.map(r => (
                         <RestaurantCard key={r.id} restaurant={r} variant="grid" />
                       ))}
                     </div>
                   </div>
                 )}
                 {popular.length > 0 && (
                   <div>
                     <h3 className="text-base font-bold text-gray-900 mb-2">Popular</h3>
                     <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
                       {popular.map(r => (
                         <RestaurantCard key={r.id} restaurant={r} variant="grid" />
                       ))}
                     </div>
                   </div>
                 )}
                 {nearForYou.length > 0 && (
                   <div>
                     <h3 className="text-base font-bold text-gray-900 mb-2">Near For You</h3>
                     <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
                       {nearForYou.map(r => (
                         <RestaurantCard key={r.id} restaurant={r} variant="grid" />
                       ))}
                     </div>
                   </div>
                 )}
               </div>
            ) : (
              <div className="space-y-3">
                {displayedRestaurants.map(r => (
                    <RestaurantCard key={r.id} restaurant={r} variant="list" />
                ))}
                {displayedRestaurants.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-sm">No restaurants found in this location.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
        <BottomNavBar bgColor="bg-gray-50" />
      </div>
    </div>
  );
};

export default RestaurantListPage;