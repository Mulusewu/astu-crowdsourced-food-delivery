import React from "react";
import { Link } from "react-router-dom";
import type { Restaurant } from "@/types/restaurant";

interface Props {
  restaurant: Restaurant;
  variant?: "grid" | "list";
}

const RestaurantCard: React.FC<Props> = ({ restaurant, variant = "grid" }) => {
  if (variant === "list") {
    // List view card (from screenshot 4)
    return (
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="flex items-center bg-white rounded-2xl shadow-sm p-2 gap-4 hover:shadow-md transition-shadow border border-gray-50"
      >
        {/* Left Image */}
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-[72px] h-[72px] rounded-xl object-cover"
          loading="lazy"
        />

        {/* Info Area */}
        <div className="flex flex-col flex-1 py-1">
          <h3 className="font-bold text-gray-900 leading-tight">
            {restaurant.name}
          </h3>
          <div className="flex items-center text-xs text-gray-400 mt-0.5">
             <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             {restaurant.location}
          </div>
          <div className="flex items-center text-xs font-semibold text-gray-800 mt-1">
            <span className="text-orange-500 mr-1 text-[10px]">★</span> {restaurant.rating}
          </div>
        </div>

        {/* Action Button (Call Icon) */}
        <div className="pr-3">
          <button 
            className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center text-orange-500"
            onClick={(e) => {
              e.preventDefault();
              if (restaurant.phone) {
                window.location.href = `tel:${restaurant.phone}`;
              }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </button>
        </div>
      </Link>
    );
  }

  // Grid view card (Horizontal Scroll cards from screenshot 2)
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="flex flex-col bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition-shadow min-w-[130px] w-[130px] flex-shrink-0 border border-gray-50"
    >
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-[80px] rounded-xl object-cover mb-2"
        loading="lazy"
      />
      <div className="flex items-center justify-between px-1 mb-0.5">
        <h3 className="font-bold text-gray-900 text-sm truncate">
          {restaurant.name}
        </h3>
        <div className="flex items-center text-xs font-bold text-gray-800">
          <span className="text-orange-500 mr-0.5 text-[10px]">★</span> {restaurant.rating}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;