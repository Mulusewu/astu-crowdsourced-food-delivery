import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, MapPin, Navigation, ShieldCheck, Truck } from "lucide-react";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useOrderStore } from "@/store/orders/orderStore";

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

export default function ActiveDeliveryTrackPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { activeOrders, currentOrder, fetchOrderById, updateOrderStatus } = useOrderStore();
  const { delivererProfile } = useDeliveryDashboardStore();

  const order =
    activeOrders.find((item) => item.id === orderId) ??
    (currentOrder?.id === orderId ? currentOrder : null);

  useEffect(() => {
    if (orderId && !order) {
      fetchOrderById(orderId);
    }
  }, [orderId, order, fetchOrderById]);

  const location = delivererProfile?.currentLocation;
  const stage = useMemo(() => STATUS_COPY[order?.status ?? "confirmed"], [order?.status]);

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] px-5">
        <div className="text-center">
          <p className="font-medium text-gray-600">Tracking data is not available yet.</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
            className="mt-4 rounded-full bg-[#F26A1C] px-6 py-3 font-bold text-white"
          >
            Back to active deliveries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-28 font-sans">
      <header className="sticky top-0 z-20 bg-white px-5 pb-4 pt-6 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
            className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] text-[#F26A1C]"
            aria-label="Go back"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F26A1C]">
              Live Tracking
            </p>
            <h1 className="text-xl font-black text-gray-900">
              Order #{order.shortId}
            </h1>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-5 pt-5">
        <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="h-64 bg-[linear-gradient(160deg,#FFF3EB_0%,#FFE0CC_100%)] p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#F26A1C]">
                {order.distance} away
              </div>
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700">
                {order.estimatedDeliveryTime || "25 min"}
              </div>
            </div>

            <div className="mt-10 flex h-28 items-center justify-center">
              <div className="relative flex h-28 w-full max-w-xs items-center">
                <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#F26A1C]/20" />
                <div className="absolute left-4 right-20 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#F26A1C]" />
                <div className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#F26A1C] shadow-md">
                  <Navigation size={20} />
                </div>
                <div className="absolute right-16 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#F26A1C] text-white shadow-md">
                  <Truck size={20} />
                </div>
                <div className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#F26A1C] shadow-md">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Current Status
                </p>
                <p className="mt-1 text-base font-black text-gray-900">
                  {order.status.replace("_", " ")}
                </p>
              </div>
              <div className="rounded-2xl bg-white/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Driver Position
                </p>
                <p className="mt-1 text-base font-black text-gray-900">
                  {location || "Location sync ready"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-[#F26A1C]" />
            <h2 className="text-lg font-black text-gray-900">Delivery Guidance</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">{stage}</p>

          <div className="mt-5 rounded-2xl bg-[#FFF7F2] p-4">
            <div className="flex items-center gap-2 text-[#F26A1C]">
              <ShieldCheck size={16} />
              <p className="text-sm font-bold">Backend-ready tracking shell</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              This screen is ready to consume live GPS, ETA, and socket updates without
              changing the surrounding delivery UI structure.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {order.status !== "PICKED_UP" && (
              <button
                type="button"
                onClick={() => updateOrderStatus(order.id, "PICKED_UP")}
                className="w-full rounded-full bg-[#F26A1C] py-3.5 text-sm font-bold text-white"
              >
                Mark as Picked Up
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                navigate(buildRoute(ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE, { orderId: order.id }))
              }
              className="w-full rounded-full border-2 border-[#F26A1C] py-3.5 text-sm font-bold text-[#F26A1C]"
            >
              Verify Delivery OTP
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(buildRoute(ROUTES.DELIVERY.DELIVERY_ACTIONS.UPDATE_LOCATION, { orderId: order.id }))
              }
              className="w-full rounded-full border border-gray-200 py-3.5 text-sm font-semibold text-gray-700"
            >
              Update Location
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
