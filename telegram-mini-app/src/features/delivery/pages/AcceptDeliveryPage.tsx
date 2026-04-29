import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useOrderStore } from "@/store/orders/orderStore";

export default function AcceptDeliveryPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, fetchAvailableOrders, acceptOrder, isLoading } = useOrderStore();

  useEffect(() => {
    if (orders.length === 0) {
      fetchAvailableOrders();
    }
  }, [orders.length, fetchAvailableOrders]);

  const order = orders.find((item) => item.id === orderId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] px-5">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-[0_10px_32px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F26A1C]">
          Accept Delivery
        </p>
        <h1 className="mt-3 text-2xl font-black text-gray-900">
          {order ? (order.restaurant?.name ?? order.shortId) : "Open Delivery"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Confirm this order and move it into your active delivery queue.
        </p>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={!orderId || isLoading}
            onClick={async () => {
              if (!orderId) return;
              await acceptOrder(orderId);
              navigate(
                buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, {
                  orderId,
                }),
              );
            }}
            className="w-full rounded-full bg-[#F26A1C] py-3.5 text-sm font-bold text-white"
          >
            {isLoading ? "Accepting..." : "Accept Order"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-full border-2 border-[#F26A1C] py-3.5 text-sm font-bold text-[#F26A1C]"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
