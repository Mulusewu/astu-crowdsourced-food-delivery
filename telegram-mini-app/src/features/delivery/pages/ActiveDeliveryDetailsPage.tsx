
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  Package,
  Phone,
  Store,
  Truck,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useOrderStore } from "@/store/orders/orderStore";

const STATUS_OPTIONS = [
  { value: "PICKED_UP", label: "Picked Up", icon: Truck },
  { value: "EN_ROUTE", label: "En Route", icon: Truck },
  { value: "ARRIVED", label: "Arrived", icon: MapPin },
] as const;

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: "Assigned",
  VENDOR_BEING_PREPARED: "Vendor Preparing",
  VENDOR_FINISHED: "Vendor Finished",
  VENDOR_READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  EN_ROUTE: "En Route",
  ARRIVED: "Arrived",
  RECEIVED: "Received",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};


export default function ActiveDeliveryDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const {
    activeOrders,
    currentOrder,
    isLoading,
    fetchActiveOrders,
    fetchOrderById,
    updateOrderStatus,
  } = useOrderStore();

  const order =
    activeOrders.find((item) => item.id === orderId) ??
    (currentOrder?.id === orderId ? currentOrder : null);

  useEffect(() => {
    if (activeOrders.length === 0) {
      fetchActiveOrders();
    }
  }, [activeOrders.length, fetchActiveOrders]);

  useEffect(() => {
    if (orderId && !order) {
      fetchOrderById(orderId);
    }
  }, [orderId, order, fetchOrderById]);

  const nextActions = useMemo(() => {
    if (!order) return [];
    type StatusVal = (typeof STATUS_OPTIONS)[number]["value"];
    const transitions: Partial<Record<string, StatusVal[]>> = {
      ASSIGNED: ["PICKED_UP"],
      VENDOR_READY_FOR_PICKUP: ["PICKED_UP"],
      PICKED_UP: ["EN_ROUTE"],
      EN_ROUTE: ["ARRIVED"],
    };
    const next = transitions[order.status] ?? [];
    return STATUS_OPTIONS.filter(({ value }) => next.includes(value as StatusVal));
  }, [order]);

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] px-5 pt-6">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-40 w-full rounded-[28px]" />
        <Skeleton className="mt-6 h-48 w-full rounded-[28px]" />

      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] px-5">
        <div className="text-center">
          <p className="text-base font-medium text-gray-600">Active delivery not found.</p>
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
            className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] text-[#F26A1C] active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F26A1C]">
              Active Delivery
            </p>
            <h1 className="text-xl font-black text-gray-900">
              Order #{order.shortId}
            </h1>

          </div>
        </div>
      </header>

      <main className="space-y-5 px-5 pt-5">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#F26A1C]">
                <Store size={18} strokeWidth={2.3} />
                <span className="text-sm font-bold">{order.restaurant.name}</span>
              </div>
              <p className="mt-2 text-xl font-black text-gray-900">
                {STATUS_LABELS[order.status] ?? order.status}
              </p>
            </div>
            <span className="rounded-full bg-[#FFF0E6] px-3 py-1 text-xs font-bold text-[#F26A1C]">
              {order.paymentStatus.replace(/_/g, " ")}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#FFF7F2] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                ETA
              </p>
              <p className="mt-1 text-lg font-black text-gray-900">
                {order.estimatedDeliveryTime ?? "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#F26A1C]" />
            <h2 className="text-lg font-black text-gray-900">Delivery Summary</h2>
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} pcs</p>
                </div>
                <p className="font-bold text-[#F26A1C]">{item.unitPrice * item.quantity} ETB</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-[#FFF7F2] p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-[#F26A1C]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer Address
                </p>
                <p className="mt-1 font-semibold text-gray-900">{order.customer.deliveryAddress ?? "Address not set"}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#F26A1C]" />
              <span className="font-semibold text-gray-800">{order.customer.phoneNumber || "N/A"}</span>
            </div>
          </div>

        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-[#F26A1C]" />
            <h2 className="text-lg font-black text-gray-900">Next Actions</h2>
          </div>

          <div className="mt-4 space-y-3">
            {nextActions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateOrderStatus(order.id, value)}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-left transition hover:border-[#F26A1C]/30 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#FFF0E6] p-2 text-[#F26A1C]">
                    <Icon size={16} />
                  </div>
                  <span className="font-semibold text-gray-900">{label}</span>
                </div>
                <span className="text-xs font-bold uppercase text-[#F26A1C]">Update</span>
              </button>
            ))}

            {order.status === "ARRIVED" && (
              <button
                type="button"
                onClick={() =>
                  navigate(buildRoute(ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE, { orderId: order.id }))
                }
                className="w-full rounded-full bg-[#28A745] py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(40,167,69,0.24)]"
              >
                Complete Delivery
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.TRACK, { orderId: order.id }))
              }
              className="w-full rounded-full bg-[#F26A1C] py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(242,106,28,0.24)]"
            >
              Open Tracking
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(buildRoute(ROUTES.DELIVERY.COMMUNICATION.REPORT, { orderId: order.id }))
              }
              className="w-full rounded-full border-2 border-[#F26A1C] py-3.5 text-sm font-bold text-[#F26A1C]"
            >
              Report Issue
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}
