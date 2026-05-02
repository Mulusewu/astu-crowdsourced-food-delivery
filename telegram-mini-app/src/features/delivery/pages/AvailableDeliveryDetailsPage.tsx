import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, UtensilsCrossed, Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useOrderStore } from "@/store/orders/orderStore";

export default function AvailableDeliveryDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    isLoading,
    orders,
    currentOrder,
    fetchAvailableOrders,
    fetchOrderById,
    acceptOrder,
    rejectOrder,
  } = useOrderStore();

  const order =
    orders.find((item) => item.id === orderId) ??
    (currentOrder?.id === orderId ? currentOrder : null);

  useEffect(() => {
    if (orders.length === 0) {
      fetchAvailableOrders();
    }
  }, [orders.length, fetchAvailableOrders]);

  useEffect(() => {
    if (orderId && !order) {
      fetchOrderById(orderId);
    }
  }, [orderId, order, fetchOrderById]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6">
        <Skeleton className="h-10 w-full mb-8 rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-[24px]" />
          ))}
          <Skeleton className="h-64 w-full rounded-[32px] mt-8" />
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Order not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#F26A1C] text-white px-6 py-2 rounded-full font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }




  const SummaryRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-[13px] font-bold text-gray-800 dark:text-gray-300">
        {label}
      </span>
      <span className="text-[13px] font-black text-[#F26A1C]">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-8 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-6 pb-4">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Store className="text-[#F26A1C]" size={22} strokeWidth={2.5} />
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-wide">
              {order.restaurant.name}
            </h1>
          </div>
        </div>
      </header>

      {/* ITEMS LIST */}
      <main className="flex-1 px-5 mt-2 overflow-y-auto">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] p-3 shadow-[0_4px_15px_rgba(0,0,0,0.02)]"
            >
              {/* Circular Food Image */}
              <div className="w-[70px] h-[70px] shrink-0">
                <img
                  src={item.imageUrl ?? "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full shadow-sm"
                />
              </div>

              {/* Item Details */}
              <div className="flex flex-col justify-center flex-1">
                <h3 className="font-black text-[15px] text-gray-900 dark:text-white leading-tight">
                  {item.name}
                </h3>
                <p className="font-bold text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
                  {item.unitPrice * item.quantity} ETB
                </p>

                <div className="flex items-center gap-1 mt-1.5 text-gray-500">
                  <MapPin
                    size={12}
                    className="text-[#F26A1C] shrink-0"
                    strokeWidth={3}
                  />
                  <span className="text-[11px] font-semibold line-clamp-1">
                    {order.customer.deliveryAddress ?? order.restaurant.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ORDER SUMMARY CARD */}
      <div className="px-5 mt-6 mb-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
          {/* Card Header */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <UtensilsCrossed
              className="text-[#F26A1C]"
              size={20}
              strokeWidth={2.5}
            />
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Order #{order.shortId}
            </h2>
          </div>

          {/* Breakdown Rows */}
          <div className="mb-6">
            <SummaryRow label="Food Price" value={`${order.foodPrice} ETB`} />
            <SummaryRow label="Delivery Fee (Your Earning)" value={`${order.deliveryFee} ETB`} />
            {order.tip > 0 && (
              <SummaryRow label="Tip" value={`${order.tip} ETB`} />
            )}
            <SummaryRow label="Pickup Location" value={order.restaurant.location} />
            <SummaryRow
              label="Ready At"
              value={order.estimatedReadyAt ? new Date(order.estimatedReadyAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
            />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <span className="text-[15px] font-black text-gray-900 dark:text-white">Customer Total</span>
              <span className="text-[16px] font-black text-[#F26A1C]">{order.totalAmount} ETB</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={async () => {
                if (!orderId) return;
                await acceptOrder(orderId);
                navigate(
                  buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, {
                    orderId,
                  }),
                );
              }}
              disabled={isLoading || order.status !== "AWAITING_ACCEPT"}
              className="flex-1 bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-full py-3.5 font-bold text-[15px] shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? "..." : "Accept"}
            </button>

            <button
              onClick={async () => {
                if (!orderId) return;
                await rejectOrder(orderId, "Declined from delivery detail page");
                navigate(ROUTES.DELIVERY.AVAILABLE.LIST);
              }}
              disabled={isLoading}
              className="flex-1 bg-transparent border-2 border-[#F26A1C] text-[#F26A1C] hover:bg-orange-50 dark:hover:bg-gray-800 rounded-full py-3.5 font-bold text-[15px] active:scale-95 transition-all disabled:opacity-50"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
