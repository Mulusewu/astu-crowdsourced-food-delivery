import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, MapPin, Navigation, Truck } from "lucide-react";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useOrderStore } from "@/store/orders/orderStore";
import { useTelegram } from "@/contexts/TelegramContext";

const STATUS_COPY: Record<string, string> = {
  ASSIGNED: "Head to the restaurant and prepare for pickup.",
  VENDOR_READY_FOR_PICKUP: "The order is ready. Pick it up and start the trip.",
  PICKED_UP: "Order picked up. Continue to the customer location.",
  DELIVERED: "Delivery completed.",
  COMPLETED: "Delivery completed.",
  VENDOR_BEING_PREPARED: "The vendor is preparing your order.",
  VENDOR_FINISHED: "The order is ready for pickup.",
  EN_ROUTE: "You are en route to the customer.",
  ARRIVED: "You have arrived at the customer location.",
  RECEIVED: "Order has been received by the customer.",
};

/**
 * ActiveDeliveryTrackPage
 * Deliverer-side live tracking with TMA BackButton and Haptics.
 */
export default function ActiveDeliveryTrackPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { showBackButton, hideBackButton, hapticFeedback } = useTelegram();
  const { activeOrders, currentOrder, fetchOrderById, updateOrderStatus } = useOrderStore();
  const { delivererProfile } = useDeliveryDashboardStore();

  const order = activeOrders.find((item) => item.id === orderId) ?? (currentOrder?.id === orderId ? currentOrder : null);

  const handleBack = useCallback(() => {
    hapticFeedback.impact("light");
    navigate(ROUTES.DELIVERY.ACTIVE.LIST);
  }, [navigate, hapticFeedback]);

  useEffect(() => {
    showBackButton(handleBack);
    return () => hideBackButton();
  }, [showBackButton, hideBackButton, handleBack]);

  useEffect(() => {
    if (orderId && !order) fetchOrderById(orderId);
  }, [orderId, order, fetchOrderById]);

  const location = delivererProfile?.currentLocation;
  const stage = useMemo(() => STATUS_COPY[order?.status ?? "confirmed"], [order?.status]);

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] dark:bg-gray-950 px-5">
        <div className="text-center">
          <p className="font-medium text-gray-600 dark:text-gray-400">Tracking data not available.</p>
          <button onClick={handleBack} className="mt-4 rounded-full bg-[#F26A1C] px-6 py-3 font-bold text-white active:scale-95 transition-transform shadow-lg">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans">
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-950 px-5 pb-4 pt-6 shadow-sm">
        <div className="relative flex items-center justify-center">
          <button onClick={handleBack} className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] dark:bg-orange-950/30 text-[#F26A1C] active:scale-95 transition-transform"><ArrowLeft size={22} strokeWidth={2.5} /></button>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F26A1C]">Live Tracking</p>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Order #{order.shortId}</h1>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-5 pt-5">
        <section className="overflow-hidden rounded-[28px] bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="h-64 bg-[linear-gradient(160deg,#FFF3EB_0%,#FFE0CC_100%)] p-5 relative">
            <div className="flex items-center justify-between relative z-10">
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#F26A1C]">{order.distance} away</div>
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700">{order.estimatedDeliveryTime || "25 min"}</div>
            </div>
            <div className="mt-10 flex h-28 items-center justify-center relative z-10">
              <div className="relative flex h-28 w-full max-w-xs items-center">
                <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#F26A1C]/20" />
                <div className="absolute left-4 right-20 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#F26A1C]" />
                <div className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#F26A1C] shadow-md"><Navigation size={20} /></div>
                <div className="absolute right-16 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#F26A1C] text-white shadow-md"><Truck size={20} /></div>
                <div className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#F26A1C] shadow-md"><MapPin size={20} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
              <div className="rounded-2xl bg-white/90 p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p><p className="text-sm font-black">{order.status.replace("_", " ")}</p></div>
              <div className="rounded-2xl bg-white/90 p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Position</p><p className="text-sm font-black truncate">{location || "Syncing..."}</p></div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-white dark:bg-gray-900 p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-3"><Clock3 size={18} /><h2 className="text-lg font-black text-gray-900 dark:text-white">Guidance</h2></div>
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 mb-6">{stage}</p>

          <div className="space-y-3">
            {order.status !== "PICKED_UP" && <button onClick={() => { hapticFeedback.notification("success"); updateOrderStatus(order.id, "PICKED_UP"); }} className="w-full rounded-full bg-[#F26A1C] py-4 text-sm font-bold text-white shadow-lg active:scale-95 transition-transform">Mark as Picked Up</button>}
            <button onClick={() => { hapticFeedback.impact("medium"); navigate(buildRoute(ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE, { orderId: order.id })); }} className="w-full rounded-full border-2 border-[#F26A1C] py-3.5 text-sm font-bold text-[#F26A1C] active:scale-95 transition-transform">Verify Delivery OTP</button>
            <button onClick={() => { hapticFeedback.impact("light"); navigate(buildRoute(ROUTES.DELIVERY.DELIVERY_ACTIONS.UPDATE_LOCATION, { orderId: order.id })); }} className="w-full rounded-full border border-gray-200 dark:border-gray-800 py-3.5 text-sm font-semibold text-gray-500 active:scale-95 transition-transform">Update Location</button>
          </div>
        </section>
      </main>
    </div>
  );
}
