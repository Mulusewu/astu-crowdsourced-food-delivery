import React from "react";
import { ArrowLeft, Phone, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav1";

// Helper for exact date formatting "03 June 2026"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

import { getActiveOrders, type ActiveOrder } from "../utils/orderMapper";

export default function ActiveDeliveriesPage() {
  const navigate = useNavigate();

  // Fetch active orders from the centralized database
  const activeOrders: ActiveOrder[] = getActiveOrders();


  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-sans pb-24 text-gray-900">
      {/* Header */}
      <header className="px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
        <div className="relative flex items-center justify-center h-12">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#FFEFE5] text-[#F26A1C] transition hover:bg-orange-200 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="text-[26px] font-black text-black tracking-tight">
            Active Orders
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5">
        <div className="flex flex-col gap-6">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="w-full rounded-[24px] border border-gray-100/80 bg-white p-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              {/* Date & Time */}
              <div className="flex items-center justify-between pb-[10px]">
                <span className="text-[14px] font-medium text-[#F26A1C]">
                  {formatDate(order.date)}
                </span>
                <span className="text-[15px] font-bold text-[#00A859]">
                  {order.timeRemaining}
                </span>
              </div>
              <div className="h-[1px] w-full bg-gray-100 mb-[12px]" />

              {/* Order Number & Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[16px] font-black tracking-tight text-[#F26A1C]">
                  Order #{order.orderNo}
                </span>
                <div className="flex items-center gap-[6px] text-gray-900">
                  <Truck size={15} strokeWidth={1.5} className="text-gray-700" />
                  <span className="text-[14px] font-medium text-black">{order.status}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col">
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center py-[10px] text-[14px] font-medium text-black">
                      <span className="flex-1">{item.name}</span>
                      <span className="w-16 text-center">{item.quantity}</span>
                      <span className="w-20 text-right">{item.price} Birr</span>
                    </div>
                    {/* Divider except after last item */}
                    {index < order.items.length - 1 && (
                      <div className="h-[1px] w-full bg-gray-100" />
                    )}
                  </div>
                ))}
              </div>

              {/* Phone & Total */}
              <div className="mt-3 flex items-center justify-between py-2">
                <div className="flex items-center gap-1.5">
                  <Phone size={16} strokeWidth={2.5} className="text-[#F26A1C] fill-[#F26A1C]" />
                  <span className="text-[15px] font-medium text-[#F26A1C]">
                    {order.phone}
                  </span>
                </div>
                <div className="text-[15px]">
                  <span className="font-bold text-black mr-2">Total</span>
                  <span className="font-black text-black">{order.total} Birr</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-[20px] flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => navigate(`/delivery/report/${order.id}`)}
                  className="rounded-full border-[1.5px] border-[#F26A1C]/60 bg-white px-8 py-[6px] text-[15px] font-medium text-[#F26A1C] transition hover:bg-orange-50 active:scale-95"
                >
                  Report Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
