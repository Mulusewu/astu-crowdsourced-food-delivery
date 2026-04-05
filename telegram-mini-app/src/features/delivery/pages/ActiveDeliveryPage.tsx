import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Star,
  Bike,
  Navigation,
  CheckCircle2,
  Package,
  Store,
  User
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/common/BottomNav1";

// Zustand Stores
import { useActiveDeliveriesStore } from "@/store/activeDeliveriesStore";

export default function ActiveDeliveriesPage() {
  const navigate = useNavigate();

  const {
    activeDeliveries,
    stats,
    isLoading,
    refreshing,
    fetchActiveDeliveries,
    updateDeliveryStatus,
  } = useActiveDeliveriesStore();

  useEffect(() => {
    fetchActiveDeliveries();
  }, [fetchActiveDeliveries]);

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessageCustomer = (customerId: string) => {
    navigate(`/chat/${customerId}`);
  };

  const handleNavigate = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  };

  const handleAction = (deliveryId: string, action: string) => {
    if (action === "details") {
      navigate(`/delivery/active/${deliveryId}`);
    } else {
      updateDeliveryStatus(deliveryId, action);
    }
  };

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} ETB`;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-40 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-[20px]" />)}
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-64 w-full rounded-[24px]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-28">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-6 pb-2">
        <div className="relative flex items-center justify-center mb-4">
          <button 
            onClick={() => navigate("/delivery/dashboard")}
            className="absolute left-0 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-black text-xl text-gray-900 dark:text-white tracking-wide leading-tight">
              Active Deliveries
            </h1>
            <p className="text-[11px] font-bold text-[#F26A1C]">
              {refreshing ? "Syncing..." : `${activeDeliveries.length} Ongoing`}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 mt-2">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-3 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
              <Bike size={18} className="text-[#F26A1C]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Active</p>
              <p className="font-black text-[16px] text-gray-900 dark:text-white leading-none">{stats.activeDeliveries}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-3 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Completed</p>
              <p className="font-black text-[16px] text-gray-900 dark:text-white leading-none">{stats.completedToday}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-3 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Avg Time</p>
              <p className="font-black text-[16px] text-gray-900 dark:text-white leading-none">{stats.averageTime}m</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] p-3 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Rating</p>
              <p className="font-black text-[16px] text-gray-900 dark:text-white leading-none">{stats.rating}</p>
            </div>
          </div>
        </div>

        {/* DELIVERIES LIST */}
        <div className="space-y-5">
          {activeDeliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <Bike size={32} className="text-gray-300 dark:text-gray-600" strokeWidth={2} />
              </div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white">No Active Deliveries</h3>
              <p className="text-[13px] font-medium text-gray-500 mt-1 mb-6">You are all caught up for now.</p>
              <button
                onClick={() => navigate("/delivery/available")}
                className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[13px] px-8 py-3 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                Find New Orders
              </button>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 flex flex-col"
              >
                {/* Header: Order Info */}
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                      <Package size={14} className="text-[#F26A1C]" />
                    </div>
                    <div>
                      <h3 className="font-black text-[14px] text-gray-900 dark:text-white leading-none">
                        Order #{delivery.orderNumber}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-500 mt-1">
                        {delivery.timeRemaining} MINS REMAINING
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-black text-[#F26A1C] text-[15px]">{formatCurrency(delivery.totalAmount)}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{delivery.paymentMethod}</span>
                  </div>
                </div>

                {/* Body: Timeline */}
                <div className="relative pl-3 py-2 space-y-5">
                  {/* Timeline connector line */}
                  <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-gray-100 dark:bg-gray-800 rounded-full" />

                  {/* Restaurant Node */}
                  <div className="relative flex gap-3 items-start z-10">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Store size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[13px] text-gray-900 dark:text-white leading-none">{delivery.restaurant.name}</p>
                      <p className="text-[11px] font-medium text-gray-500 line-clamp-1 mt-1">{delivery.restaurant.address}</p>
                    </div>
                    <button
                      onClick={() => handleNavigate(delivery.restaurant.address)}
                      className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-[#F26A1C] active:scale-95 transition-all"
                    >
                      <Navigation size={14} />
                    </button>
                  </div>

                  {/* Customer Node */}
                  <div className="relative flex gap-3 items-start z-10">
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 border-2 border-white dark:border-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-[#F26A1C]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[13px] text-gray-900 dark:text-white leading-none">{delivery.customer.name}</p>
                      <p className="text-[11px] font-medium text-gray-500 line-clamp-1 mt-1">{delivery.customer.address}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleMessageCustomer(delivery.customer.id)}
                        className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-[#F26A1C] active:scale-95 transition-all"
                      >
                        <MessageCircle size={14} />
                      </button>
                      <button
                        onClick={() => handleCallCustomer(delivery.customer.phone)}
                        className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 hover:bg-green-100 active:scale-95 transition-all"
                      >
                        <Phone size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/50 flex gap-2">
                  <button
                    onClick={() => handleAction(delivery.id, "details")}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-[12px] py-3 rounded-full active:scale-95 transition-all"
                  >
                    Details
                  </button>

                  {delivery.status === "assigned" && (
                    <button
                      onClick={() => handleAction(delivery.id, "picked_up")}
                      className="flex-[2] bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[12px] py-3 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      Confirm Pickup
                    </button>
                  )}

                  {delivery.status === "picked_up" && (
                    <button
                      onClick={() => handleAction(delivery.id, "in_transit")}
                      className="flex-[2] bg-blue-500 hover:bg-blue-600 text-white font-bold text-[12px] py-3 rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Start Navigation
                    </button>
                  )}

                  {delivery.status === "in_transit" && (
                    <button
                      onClick={() => handleAction(delivery.id, "delivered")}
                      className="flex-[2] bg-[#34C759] hover:bg-[#2db34e] text-white font-bold text-[12px] py-3 rounded-full shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                    >
                      Complete Delivery
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}