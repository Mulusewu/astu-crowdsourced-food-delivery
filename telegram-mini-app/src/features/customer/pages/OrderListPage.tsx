import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Assuming you have this store. If not, use your actual orders store.
import {
  useCustomerOrderStore,
} from "@/store/orders/customerOrderStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isLoading, setIsLoading] = useState(true);

  // Pull orders from your Zustand store
  // Assuming the store has an array of orders or a fetch function

  const rawOrders = useCustomerOrderStore((state) => state.orders);
  const fetchOrders = useCustomerOrderStore((state) => state.fetchCustomerOrders);
  const orders = rawOrders || [];

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await fetchOrders();
      setTimeout(() => setIsLoading(false), 400);
    };
    loadOrders();
  }, []);

  // Prisma OrderStatus: active vs. completed/failed
  const ACTIVE_STATUSES = [
    "CREATED", "AWAITING_ACCEPT", "ASSIGNED",
    "AWAITING_PAYMENT", "PAYMENT_RECEIVED",
    "VENDOR_BEING_PREPARED", "VENDOR_FINISHED", "VENDOR_READY_FOR_PICKUP",
    "PICKED_UP", "EN_ROUTE", "ARRIVED",
  ];
  const PAST_STATUSES = ["RECEIVED", "DELIVERED", "COMPLETED", "CANCELLED", "DISPUTED", "NO_DELIVERER_FOUND"];

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const pastOrders = orders.filter((o) => PAST_STATUSES.includes(o.status));

  const getStatusDisplay = (status: string) => {
    const map: Record<string, { text: string; color: string; bg: string }> = {
      CREATED: { text: "Created", color: "text-gray-500", bg: "bg-gray-50" },
      AWAITING_ACCEPT: { text: "Finding Deliverer", color: "text-blue-500", bg: "bg-blue-50" },
      ASSIGNED: { text: "Assigned", color: "text-indigo-500", bg: "bg-indigo-50" },
      AWAITING_PAYMENT: { text: "Awaiting Payment", color: "text-yellow-600", bg: "bg-yellow-50" },
      PAYMENT_RECEIVED: { text: "Payment Received", color: "text-green-500", bg: "bg-green-50" },
      VENDOR_BEING_PREPARED: { text: "Preparing", color: "text-orange-500", bg: "bg-orange-50" },
      VENDOR_FINISHED: { text: "Ready Soon", color: "text-orange-500", bg: "bg-orange-50" },
      VENDOR_READY_FOR_PICKUP: { text: "Ready for Pickup", color: "text-[#F26A1C]", bg: "bg-[#FFF4ED]" },
      PICKED_UP: { text: "Picked Up", color: "text-[#F26A1C]", bg: "bg-[#FFF4ED]" },
      EN_ROUTE: { text: "On the Way", color: "text-[#F26A1C]", bg: "bg-[#FFF4ED]" },
      ARRIVED: { text: "Arrived", color: "text-[#F26A1C]", bg: "bg-[#FFF4ED]" },
      RECEIVED: { text: "Received", color: "text-green-500", bg: "bg-green-50" },
      DELIVERED: { text: "Delivered", color: "text-green-600", bg: "bg-green-50" },
      COMPLETED: { text: "Completed", color: "text-green-700", bg: "bg-green-100" },
      DISPUTED: { text: "Disputed", color: "text-red-500", bg: "bg-red-50" },
      CANCELLED: { text: "Cancelled", color: "text-red-500", bg: "bg-red-50" },
      NO_DELIVERER_FOUND: { text: "No Deliverer", color: "text-gray-500", bg: "bg-gray-100" },
    };
    return map[status] ?? { text: status, color: "text-gray-500", bg: "bg-gray-50" };
  };

  // --- UI Sub-components ---

  const ActiveOrderCard = ({ order }: { order: any }) => {
    const status = getStatusDisplay(order.status);
    return (
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-5 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight">
              {order.restaurantName || "Restaurant"}
            </h3>
            <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
              #{order.shortId || order.id}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${status.bg} ${status.color}`}>
            {status.text}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <Clock size={16} className="text-[#F26A1C]" />
          <span>
            {order.estimatedDeliveryTime
              ? `ETA: ${new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : "Estimating..."}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-bold text-gray-500">
            {order.items?.length ?? 0} Item{order.items?.length !== 1 ? "s" : ""}
          </p>
          <p className="text-lg font-black text-[#F26A1C]">
            {order.totalAmount?.toFixed(0) || "0"} ETB
          </p>
        </div>

        <button
          onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.DETAILS, { orderId: order.id }))}
          className="w-full flex items-center justify-center bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[13px] py-3.5 rounded-[16px] transition-colors shadow-[0_4px_12px_rgba(242,106,28,0.2)] active:scale-[0.98]"
        >
          View Details
        </button>
      </div>
    );
  };

  const PastOrderCard = ({ order }: { order: any }) => {
    const status = getStatusDisplay(order.status);
    const isDelivered = ["DELIVERED", "COMPLETED", "RECEIVED"].includes(order.status);

    return (
      <div className="bg-white dark:bg-gray-900 rounded-[20px] p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.bg} ${status.color}`}>
              {isDelivered ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">
                {order.restaurantName || "Restaurant"}
              </h3>
              <p className="text-xs font-medium text-gray-500">
                #{order.shortId} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="font-black text-[15px] text-gray-900 dark:text-white">
            {order.totalAmount?.toFixed(0) || "0"} ETB
          </p>
        </div>

        <div className="mt-3">
          <button
            onClick={() => navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.DETAILS, { orderId: order.id }))}
            className="w-full flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[13px] py-2.5 rounded-[12px] active:scale-95 transition-transform"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center pt-16 pb-10 text-center px-4">
      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-5">
        <Package size={40} className="text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-[18px] font-black text-gray-900 dark:text-white mb-2">
        No {type} Orders
      </h3>
      <p className="text-[14px] text-gray-500 font-medium mb-8">
        {type === "active"
          ? "You don't have any ongoing orders at the moment."
          : "You haven't made any orders yet. Start exploring!"}
      </p>
      <button
        onClick={() => navigate(ROUTES.CUSTOMER.HOME)}
        className="bg-[#F26A1C] text-white font-bold py-3.5 px-8 rounded-full shadow-md active:scale-95 transition-transform"
      >
        Browse Restaurants
      </button>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col relative pb-28">
      {/* HEADER */}
      <header className="px-5 pt-6 pb-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          My Orders
        </h1>
      </header>

      <main className="px-5 pt-2">
        {/* CUSTOM TABS */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-full mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === "active"
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Active Orders
            {activeOrders.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center bg-[#F26A1C] text-white text-[10px] w-4 h-4 rounded-full">
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === "history"
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            History
          </button>
        </div>

        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-[24px]" />
            <Skeleton className="h-[200px] w-full rounded-[24px]" />
          </div>
        ) : (
          /* CONTENT */
          <div className="animate-in fade-in duration-300">
            {activeTab === "active" ? (
              activeOrders.length > 0 ? (
                activeOrders.map((order: any) => (
                  <ActiveOrderCard key={order.id} order={order} />
                ))
              ) : (
                <EmptyState type="active" />
              )
            ) : pastOrders.length > 0 ? (
              pastOrders.map((order: any) => (
                <PastOrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState type="past" />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
