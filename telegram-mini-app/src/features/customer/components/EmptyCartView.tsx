import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "./Button";

// TMA specific empty view
export const EmptyCartView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-white">
      {/* Dynamic shopping cart icon derived from image */}
      <div className="relative mb-6">
        <ShoppingCart size={80} strokeWidth={1} className="text-[#888A9F]" />
        {/* Shadow simulation */}
        <div className="absolute -bottom-4 left-4 right-4 h-3 bg-black/5 rounded-full blur-[10px]"></div>
      </div>

      <h2 className="text-[20px] font-black text-gray-900 mb-1">
        Your Cart Is Empty
      </h2>
      <p className="text-sm font-semibold text-gray-600">
        Browse Menus And Order
      </p>
    </div>
  );
};
