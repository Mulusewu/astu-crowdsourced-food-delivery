import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, History, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVendorOrderStore } from "@/store/vendor/vendorOrderStore";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/common/BottomNav";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { orderHistory, isHistoryLoading, fetchOrderHistory } =
    useVendorOrderStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const filteredHistory = orderHistory.filter(
    (order) =>
      order.shortId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen w-full max-w-lg mx-auto pb-28">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 shadow-sm sticky top-0 z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Order History
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col gap-4">
        {isHistoryLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <History className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm font-medium">
              No past orders found.
            </p>
          </div>
        ) : (
          filteredHistory.map((order) => {
            const isCompleted =
              order.status === "COMPLETED" || order.status === "DELIVERED";
            const date = new Date(order.createdAt).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric" },
            );
            const time = new Date(order.createdAt).toLocaleTimeString(
              undefined,
              { hour: "2-digit", minute: "2-digit" },
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900">
                      #{order.shortId}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">
                      {date} • {time}
                    </span>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isCompleted
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </div>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col shrink-0 items-center gap-1"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative">
                        <img
                          src={
                            item?.imageUrl ||
                            "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-1.5 rounded-tl-lg text-[9px] font-black text-gray-900 border-t border-l border-white/50">
                          x{item.quantity}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 max-w-[48px] truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Customer
                    </span>
                    <span className="text-xs font-black text-gray-800">
                      {order.customerName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
