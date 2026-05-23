import React from 'react';
import { Bookmark } from 'lucide-react';
import type { VendorOrder } from '../store/useVendorStore';

interface OrderCardProps {
  order: VendorOrder;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="relative mt-12 mb-4">
      {/* Floating Food Plate */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 w-28 h-28">
        <div className="relative">
          <img
            src={order.imageUrl}
            alt={`Order ${order.orderNumber}`}
            className="w-full h-full object-cover rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] bg-white"
          />
          {/* Bookmark Badge */}
          <div className="absolute top-8 -right-3 bg-white p-1 rounded-md shadow-md border border-orange-100">
            <Bookmark size={12} className="text-[#F26A1C] fill-[#F26A1C]" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="bg-white rounded-[32px] pt-16 pb-5 px-3 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          Order #{order.orderNumber}
        </h3>
        
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[#F26A1C] text-sm">🍔</span>
          <span className="text-gray-400 font-bold text-xs">{order.itemsCount} Items</span>
        </div>

        <div className="text-[#F26A1C] font-black text-lg mb-4 tracking-tight">
          {order.totalPrice} {order.currency}
        </div>

        <button className="bg-[#F26A1C] text-white font-bold py-2.5 px-7 rounded-2xl text-sm transition-transform active:scale-95 shadow-lg shadow-orange-100">
          View Detail
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
