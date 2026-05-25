import { useState, useEffect, useCallback } from "react";
import { CreditCard } from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  QrCode,
  AlertCircle,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useDisputeStore } from "@/store/orders/disputeStore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ROUTES, buildRoute } from "@/routes/routePaths";

const FALLBACK_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Deliverer";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // ── Store selectors ────────────────────────────────────────────────────────
  const {
    currentOrderDetails: order,
    isLoading,
    fetchOrderDetails,
    cancelOrder,
    connectToTracking,
    disconnectTracking,
  } = useCustomerOrderStore();

  const addToCart = useCartStore((state) => state.addToCart);
  const existingDispute = useDisputeStore((state) =>
    state.getDisputeByOrderId(orderId || ""),
  );

  // ── Lifecycle Hooks ────────────────────────────────────────────────────────
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId); // Fetch deep payload from backend
      connectToTracking(orderId); // Open live socket
    }

    return () => {
      disconnectTracking(); // Close socket when leaving page
    };
  }, [orderId]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const isCancellable = order
    ? [
        "CREATED",
        "AWAITING_ACCEPT",
        "AWAITING_VENDOR",
        "ASSIGNED",
        "AWAITING_PAYMENT",
      ].includes(order.status)
    : false;

  // Notice: isCompletable is REMOVED. Customer cannot click complete.

  const isFinished = order
    ? ["DELIVERED", "COMPLETED", "RECEIVED"].includes(order.status)
    : false;
  const isActive = order
    ? ![
        "DELIVERED",
        "COMPLETED",
        "RECEIVED",
        "CANCELLED",
        "DISPUTED",
        "NO_DELIVERER_FOUND",
      ].includes(order.status)
    : false;

  // ── Format helpers ─────────────────────────────────────────────────────────
  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusDisplay = (status: string) => {
    const map: Record<string, { label: string; bg: string; text: string }> = {
      CREATED: {
        label: "Ordered",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
      },
      AWAITING_ACCEPT: {
        label: "Finding Deliverer",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-600 dark:text-yellow-400",
      },
      ASSIGNED: {
        label: "Assigned",
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-600 dark:text-indigo-400",
      },
      AWAITING_PAYMENT: {
        label: "Awaiting Payment",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-600",
      },
      PAYMENT_RECEIVED: {
        label: "Payment Received",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600",
      },
      VENDOR_BEING_PREPARED: {
        label: "Preparing",
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-500",
      },
      VENDOR_FINISHED: {
        label: "Ready Soon",
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-500",
      },
      VENDOR_READY_FOR_PICKUP: {
        label: "Ready for Pickup",
        bg: "bg-[#FFF4ED]",
        text: "text-[#F26A1C]",
      },
      PICKED_UP: {
        label: "Picked Up",
        bg: "bg-[#FFF4ED]",
        text: "text-[#F26A1C]",
      },
      EN_ROUTE: {
        label: "On the Way",
        bg: "bg-[#FFF4ED]",
        text: "text-[#F26A1C]",
      },
      ARRIVED: { label: "Arrived", bg: "bg-[#FFF4ED]", text: "text-[#F26A1C]" },
      RECEIVED: {
        label: "Received",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600",
      },
      DELIVERED: {
        label: "Delivered",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600",
      },
      COMPLETED: {
        label: "Completed",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700",
      },
      CANCELLED: {
        label: "Cancelled",
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-500",
      },
      DISPUTED: {
        label: "Disputed",
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-500",
      },
      NO_DELIVERER_FOUND: {
        label: "No Deliverer",
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-500",
      },
    };
    return (
      map[status] ?? {
        label: status,
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-600 dark:text-gray-300",
      }
    );
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!orderId) return;
    setIsLoadingAction(true);
    try {
      await cancelOrder(orderId);
      setShowCancelModal(false);
      navigate(ROUTES.CUSTOMER.ORDERS.LIST);
    } catch (error) {
      // Toast is handled by service throwing error
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => {
      // CRITICAL FIX: Add expectedUnitPrice to comply with backend anti-spoofing
      addToCart({
        menuId: item.menuId,
        name: item.name,
        expectedUnitPrice: item.unitPrice,
        image: item.imageUrl ?? undefined,
        restaurantId: "N/A", // Handled by cart store logic
        quantity: item.quantity,
      });
    });
    navigate(ROUTES.CUSTOMER.CART);
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 p-5 flex flex-col gap-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          We couldn't find the details for this order.
        </p>
        <button
          onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
          className="bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold active:scale-95 transition-transform"
        >
          Go to Orders
        </button>
      </div>
    );
  }

  const statusConfig = getStatusDisplay(order.status);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-32 relative">
      {/* ── Header ── */}
      <header className="px-5 pt-6 pb-4 sticky top-0 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md z-30 flex items-center justify-between">
        <button
          onClick={() => {
            navigate(ROUTES.CUSTOMER.ORDERS.LIST);
          }}
          className="w-10 h-10 bg-orange-50 dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-[14px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-black text-gray-900 dark:text-white">
          Order Details
        </h1>
        <div className="w-10" />
      </header>

      <main className="px-5 space-y-6">
        {/* ── Status + OTP Row ── */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">
                Order Status
              </span>
              <div
                className={cn(
                  "px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wide",
                  statusConfig.bg,
                  statusConfig.text,
                )}
              >
                {statusConfig.label}
              </div>
            </div>
            <h2 className="text-[16px] font-black text-gray-900 dark:text-white leading-tight truncate">
              {order.restaurant?.name}
            </h2>
            <p className="text-[11px] font-bold text-gray-400">
              Order Code:{" "}
              <span className="text-gray-600 dark:text-gray-300">
                {order.shortId}
              </span>
            </p>
          </div>

          {/* OTP Block - ALWAYS SHOW SO CUSTOMER CAN READ IT TO DELIVERER */}
          <div className="flex flex-col items-center justify-center shrink-0 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Your PIN
            </span>
            <span className="text-[20px] font-black tracking-[0.2em] text-[#F26A1C]">
              {order.otpCode}
            </span>
            <span className="text-[9px] text-gray-400 text-center mt-1 leading-tight">
              Show to Deliverer
            </span>
          </div>
        </div>

        {/* ── Dispute Status ── */}
        {existingDispute && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-[18px] p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-black text-red-600 dark:text-red-400">
                Dispute Raised
              </p>
              <p className="text-[11px] font-bold text-red-500/80 uppercase tracking-wide mt-0.5">
                Status: {existingDispute.status.replace("_", " ")}
              </p>
              {existingDispute.resolution && (
                <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 mt-2 bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-red-100/50 dark:border-red-900/20">
                  Resolution: {existingDispute.resolution}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Delivery + Time Info ── */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[18px] p-4 border border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-[#F26A1C] mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Delivery Address
              </p>
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
                {order.customer?.defaultDormBlock || "ASTU Campus"}
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex items-start gap-2.5">
            <Clock size={16} className="text-[#F26A1C] mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Ordered At
              </p>
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          {order.estimatedReadyAt && (
            <>
              <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Estimated Prep Time
                  </p>
                  <p className="text-[13px] font-semibold text-orange-600 dark:text-orange-400">
                    {formatDate(order.estimatedReadyAt)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Deliverer Info ── */}
        {order.deliverer ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[18px] border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <img
                  src={order.deliverer.user.avatarUrl || FALLBACK_AVATAR}
                  alt={order.deliverer.user.fullName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-100 dark:border-gray-700 shrink-0"
                />
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white">
                    {order.deliverer.user.fullName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#F26A1C]">
                    <Star size={10} className="fill-[#F26A1C]" />
                    <span>{order.deliverer.rating?.toFixed(1)}</span>
                    <span className="text-gray-400 dark:text-gray-500 ml-1">
                      • Delivery Partner
                    </span>
                  </div>
                </div>
              </div>
              {order.deliverer.user.phoneNumber && (
                <a
                  href={`tel:${order.deliverer.user.phoneNumber}`}
                  className="w-10 h-10 rounded-[14px] bg-white dark:bg-gray-800 border border-orange-100 dark:border-gray-700 flex items-center justify-center active:scale-95 transition-transform shadow-sm shrink-0"
                >
                  <Phone size={18} className="text-[#F26A1C]" />
                </a>
              )}
            </div>

            {order.deliverer.user.phoneNumber && (
              <a
                href={`tel:${order.deliverer.user.phoneNumber}`}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-orange-50 dark:bg-orange-900/20 border-t border-orange-100 dark:border-orange-800/30 active:bg-orange-100 dark:active:bg-orange-900/40 transition-colors"
              >
                <Phone size={13} className="text-[#F26A1C] shrink-0" />
                <span className="text-[13px] font-bold text-[#F26A1C] tracking-wide">
                  {order.deliverer.user.phoneNumber}
                </span>
                <span className="ml-auto text-[11px] font-semibold text-orange-400 dark:text-orange-500">
                  Tap to call
                </span>
              </a>
            )}
          </div>
        ) : isActive ? (
          <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-3.5 rounded-[18px] border border-yellow-100 dark:border-yellow-800/40">
            <div className="w-11 h-11 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center shrink-0">
              <RefreshCw
                size={18}
                className="text-yellow-600 dark:text-yellow-400 animate-spin-slow"
              />
            </div>
            <div>
              <p className="text-[13px] font-bold text-yellow-700 dark:text-yellow-300">
                Finding your deliverer…
              </p>
              <p className="text-[11px] text-yellow-600/80 dark:text-yellow-400/70">
                This usually takes 1-2 minutes
              </p>
            </div>
          </div>
        ) : null}

        {/* ── Order Items ── */}
        <div>
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mb-3">
            Order Items{" "}
            <span className="text-gray-400 font-medium">
              ({order.items.length})
            </span>
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {order.items.map((item: any) => (
              <div
                key={item.menuId}
                onClick={() =>
                  navigate(
                    buildRoute(ROUTES.CUSTOMER.FOOD.DETAILS, {
                      foodId: item.menuId,
                    }),
                  )
                }
                className="w-[100px] shrink-0 flex flex-col gap-1.5 cursor-pointer active:opacity-70 transition-opacity"
              >
                <div className="w-full h-[85px] rounded-[16px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {item.name}
                </p>
                <div className="flex justify-between items-center text-[11px] font-bold text-[#F26A1C]">
                  <span>{Number(item.unitPrice).toFixed(0)} ETB</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Price Breakdown ── */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[18px] p-4 border border-gray-100 dark:border-gray-800 space-y-2.5">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">
            Price Breakdown
          </h3>
          <div className="flex justify-between text-[13px] font-semibold text-gray-600 dark:text-gray-400">
            <span>Food Subtotal</span>
            <span>{Number(order.foodPrice).toFixed(2)} ETB</span>
          </div>
          <div className="flex justify-between text-[13px] font-semibold text-gray-600 dark:text-gray-400">
            <span>Delivery Fee</span>
            <span>{Number(order.deliveryFee).toFixed(2)} ETB</span>
          </div>
          {Number(order.serviceFee) > 0 && (
            <div className="flex justify-between text-[13px] font-semibold text-gray-600 dark:text-gray-400">
              <span>Service Fee</span>
              <span>{Number(order.serviceFee).toFixed(2)} ETB</span>
            </div>
          )}
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-black text-gray-900 dark:text-white">
              Total
            </span>
            <span className="text-[18px] font-black text-[#F26A1C]">
              {Number(order.totalAmount).toFixed(2)} ETB
            </span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="space-y-3 pb-4">
          {isFinished && (
            <>
              <button
                onClick={handleReorder}
                className="w-full py-4 bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold rounded-[20px] text-[15px] shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-transform"
              >
                Order Again
              </button>
              <button
                onClick={() =>
                  navigate(
                    buildRoute(ROUTES.CUSTOMER.ORDERS.REVIEW, {
                      orderId: order.id,
                    }),
                  )
                }
                className="w-full py-4 bg-[#FFF4ED] dark:bg-gray-800 text-[#F26A1C] font-bold rounded-[20px] text-[15px] active:scale-95 transition-transform"
              >
                Leave a Review
              </button>
              {!existingDispute && (
                <button
                  onClick={() =>
                    navigate(
                      buildRoute(ROUTES.CUSTOMER.ORDERS.DISPUTE, {
                        orderId: order.id,
                      }),
                    )
                  }
                  className="w-full py-4 bg-white dark:bg-gray-900 border-2 border-red-50 dark:border-red-900/20 text-red-500 font-bold rounded-[20px] text-[15px] active:scale-95 transition-transform"
                >
                  Raise a Dispute
                </button>
              )}
            </>
          )}

          {isCancellable && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold rounded-[20px] text-[15px] active:scale-95 transition-transform"
            >
              Cancel Order
            </button>
          )}

          {isActive && (
            <button
              onClick={() =>
                navigate(
                  buildRoute(ROUTES.CUSTOMER.ORDERS.TRACK, {
                    orderId: order.id,
                  }),
                )
              }
              className="w-full py-4 bg-[#F26A1C]..."
            >
              Track Order
            </button>
          )}
          {order.status === "ASSIGNED" && (
            <div className="px-5 mt-6 relative z-10">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[12px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                    Deliverer Found!
                  </p>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                    Pay now to secure your order.
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      buildRoute(ROUTES.CUSTOMER.PAYMENT.PROCESS, {
                        orderId: order.id,
                      }),
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95"
                >
                  <CreditCard size={18} /> Pay Now
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Cancel Order Modal ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white mb-2 leading-tight">
              Cancel This Order?
            </h3>
            <p className="text-[12px] font-semibold text-gray-500 mb-6 px-2">
              This action cannot be undone. You can re-order from Order History.
            </p>
            <div className="flex gap-3">
              <button
                disabled={isLoadingAction}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3.5 border-2 border-orange-100 dark:border-gray-700 text-[#F26A1C] font-bold rounded-[16px] text-[13px] active:scale-95 transition-transform disabled:opacity-50"
              >
                Return
              </button>
              <button
                disabled={isLoadingAction}
                onClick={handleCancel}
                className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-[16px] text-[13px] shadow-md active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoadingAction ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
