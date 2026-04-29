import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  ClipboardCheck,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  Navigation,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useCustomerOrderStore,
  type OrderStatus,
} from "@/store/orders/customerOrderStore";
import { ROUTES } from "@/routes/routePaths";

// ─── Full timeline aligned with Prisma OrderStatus ───────────────────────────
const TIMELINE_STEPS: {
  statuses: OrderStatus[];
  label: string;
  subtext: string;
  icon: React.ElementType;
}[] = [
  {
    statuses: ["CREATED", "AWAITING_ACCEPT"],
    label: "Order Placed",
    subtext: "Looking for a nearby deliverer",
    icon: ClipboardCheck,
  },
  {
    statuses: ["ASSIGNED"],
    label: "Deliverer Assigned",
    subtext: "Your deliverer is on the way to the restaurant",
    icon: Bike,
  },
  {
    statuses: ["AWAITING_PAYMENT", "PAYMENT_RECEIVED", "VENDOR_BEING_PREPARED", "VENDOR_FINISHED"],
    label: "Preparing",
    subtext: "Restaurant is preparing your food",
    icon: ChefHat,
  },
  {
    statuses: ["VENDOR_READY_FOR_PICKUP", "PICKED_UP"],
    label: "Picked Up",
    subtext: "Your order has been picked up",
    icon: PackageCheck,
  },
  {
    statuses: ["EN_ROUTE", "ARRIVED"],
    label: "On the Way",
    subtext: "Deliverer is heading to your location",
    icon: Navigation,
  },
  {
    statuses: ["RECEIVED", "DELIVERED", "COMPLETED"],
    label: "Delivered",
    subtext: "Enjoy your meal! 🎉",
    icon: Home,
  },
];

const STATUS_LABEL_MAP: Partial<Record<OrderStatus, string>> = {
  CREATED: "Created",
  AWAITING_ACCEPT: "Finding Deliverer",
  ASSIGNED: "Deliverer Assigned",
  AWAITING_PAYMENT: "Awaiting Payment",
  PAYMENT_RECEIVED: "Payment Received",
  VENDOR_BEING_PREPARED: "Preparing",
  VENDOR_FINISHED: "Ready Soon",
  VENDOR_READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  EN_ROUTE: "En Route",
  ARRIVED: "Arrived",
  RECEIVED: "Received",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  DISPUTED: "Disputed",
  CANCELLED: "Cancelled",
  NO_DELIVERER_FOUND: "No Deliverer Found",
};

const isFinalFailed = (status: OrderStatus) =>
  status === "CANCELLED" || status === "DISPUTED" || status === "NO_DELIVERER_FOUND";

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, fetchCustomerOrders, isLoading } = useCustomerOrderStore();

  const order = orders.find((o) => o.id === orderId);

  // Ensure orders are loaded (handles hard refresh)
  useEffect(() => {
    if (!order) {
      fetchCustomerOrders();
    }
  }, [orderId]);

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#F26A1C] mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
          <XCircle size={32} className="text-[#F26A1C]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500 mb-6 text-sm font-medium">
          We couldn't find the tracking details for this order.
        </p>
        <button
          onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
          className="bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold active:scale-95 transition-transform"
        >
          View All Orders
        </button>
      </div>
    );
  }

  // Determine current timeline step
  const currentStepIndex = TIMELINE_STEPS.findIndex((step) =>
    step.statuses.includes(order.status),
  );

  const isDelivered = ["RECEIVED", "DELIVERED", "COMPLETED"].includes(order.status);
  const isFailed = isFinalFailed(order.status);
  const isInTransit = ["EN_ROUTE", "ARRIVED"].includes(order.status);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col relative pb-10">

      {/* 1. MAP AREA */}
      <div className="relative w-full h-[35vh] bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop"
          alt="Map tracking"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />

        {/* Pulsing driver marker when in transit */}
        {isInTransit && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-14 h-14 bg-[#F26A1C]/20 rounded-full flex items-center justify-center animate-ping absolute" />
            <div className="w-12 h-12 bg-[#F26A1C] rounded-full border-4 border-white flex items-center justify-center relative shadow-xl">
              <Navigation size={20} className="text-white fill-white" />
            </div>
          </div>
        )}

        {/* Delivered checkmark */}
        {isDelivered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-5 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-md text-gray-900 dark:text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* 2. ETA & DELIVERER CARD (Overlaps map) */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Status
              </p>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#F26A1C]" />
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  {STATUS_LABEL_MAP[order.status] ?? order.status}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Order No.
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                #{order.shortId}
              </p>
            </div>
          </div>

          {/* Deliverer Info */}
          {order.deliverer ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    order.deliverer.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(order.deliverer.name)}&background=F26A1C&color=fff&size=128`
                  }
                  alt={order.deliverer.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-100 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {order.deliverer.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Delivery Partner · ★ {order.deliverer.rating.toFixed(1)}
                  </p>
                </div>
              </div>
              {order.deliverer.phone && (
                <a
                  href={`tel:${order.deliverer.phone}`}
                  className="w-10 h-10 bg-[#FFF4ED] dark:bg-gray-800 rounded-full flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
                >
                  <Phone size={18} className="fill-[#F26A1C]/20" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                <Bike size={20} />
              </div>
              <p className="text-sm font-medium">
                {isFailed
                  ? "No deliverer was assigned"
                  : "Finding a delivery partner..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. FULL STATUS TIMELINE */}
      <div className="px-5 mt-8">
        <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">
          Order Tracking
        </h3>

        {isFailed ? (
          <div className="flex flex-col items-center justify-center py-8 bg-red-50 dark:bg-red-900/10 rounded-[20px] border border-red-100 dark:border-red-800">
            <XCircle size={40} className="text-red-500 mb-3" />
            <p className="font-bold text-red-600 dark:text-red-400">
              {STATUS_LABEL_MAP[order.status]}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {order.status === "CANCELLED"
                ? "This order was cancelled."
                : order.status === "NO_DELIVERER_FOUND"
                ? "We couldn't find a deliverer for your order."
                : "This order is under dispute review."}
            </p>
          </div>
        ) : (
          <div className="relative pl-4 space-y-7">
            {/* Vertical connector line */}
            <div className="absolute top-3 bottom-3 left-[31px] w-0.5 bg-gray-100 dark:bg-gray-800 -z-10" />

            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx;
              const isActive = idx === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.label} className="flex gap-4 relative">
                  {/* Icon circle */}
                  <div
                    className={`
                      w-8 h-8 shrink-0 rounded-full flex items-center justify-center
                      border-4 border-[#FDFDFD] dark:border-gray-950 z-10 transition-all
                      ${isCompleted
                        ? "bg-[#F26A1C] text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-400"}
                      ${isActive
                        ? "ring-4 ring-orange-100 dark:ring-orange-900/30 scale-110"
                        : ""}
                    `}
                  >
                    <Icon size={14} strokeWidth={isCompleted ? 3 : 2} />
                  </div>

                  {/* Step text */}
                  <div className={`pt-0.5 ${!isCompleted && "opacity-40"}`}>
                    <p
                      className={`text-sm font-bold ${
                        isActive ? "text-[#F26A1C]" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                      {step.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. DELIVERY ADDRESS */}
      <div className="px-5 mt-8">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-2">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">
              Delivery Address
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {order.deliveryAddress || "ASTU Campus, Adama"}
          </p>

          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs text-gray-500">
            <span>Total Paid</span>
            <span className="font-bold text-[#F26A1C]">
              {order.totalAmount.toFixed(2)} ETB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
