import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Package,
  Phone,
  Store,
  Truck,
  CheckCircle2,
  Navigation,
  MessageSquare,
  AlertCircle
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useOrderStore, type OrderStatus } from "@/store/orders/orderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: "Awaiting Pickup",
  VENDOR_BEING_PREPARED: "Preparing Food",
  VENDOR_FINISHED: "Order Ready",
  VENDOR_READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  EN_ROUTE: "On My Way",
  ARRIVED: "Arrived at Customer",
  RECEIVED: "Customer Received",
  DELIVERED: "Completed",
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

  const [isUpdating, setIsUpdating] = useState(false);

  const order = useMemo(() => 
    activeOrders.find((item) => item.id === orderId) ??
    (currentOrder?.id === orderId ? currentOrder : null),
  [activeOrders, currentOrder, orderId]);

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

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!orderId) return;
    setIsUpdating(true);
    await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);
  };

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-40 w-full rounded-[32px]" />
        <Skeleton className="mt-6 h-64 w-full rounded-[32px]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFD] dark:bg-gray-950 px-8 text-center">
        <div className="h-20 w-20 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center mb-4">
          <AlertCircle className="text-[#F26A1C]" size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Order Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">This delivery might have been cancelled or reassigned.</p>
        <Button
          onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
          className="w-full h-14 rounded-full bg-[#F26A1C] font-black text-white"
        >
          Back to List
        </Button>
      </div>
    );
  }

  const isAtPickup = ["ASSIGNED", "VENDOR_BEING_PREPARED", "VENDOR_FINISHED", "VENDOR_READY_FOR_PICKUP"].includes(order.status);
  const isEnRoute = ["PICKED_UP", "EN_ROUTE"].includes(order.status);
  const isAtDropoff = order.status === "ARRIVED";

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FDFDFD]/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-[#F26A1C] active:scale-95 transition-transform"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F26A1C]">Order Tracking</p>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">#{order.shortId}</h1>
          </div>
          <button
            onClick={() => navigate(buildRoute(ROUTES.DELIVERY.COMMUNICATION.REPORT, { orderId: order.id }))}
            className="h-11 w-11 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500"
          >
            <AlertCircle size={22} />
          </button>
        </div>
      </header>

      <main className="px-5 mt-6 space-y-6">
        {/* Status Hero Card */}
        <div className="rounded-[32px] bg-white dark:bg-gray-900 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center">
                {isAtPickup ? <Store className="text-[#F26A1C]" size={24} /> : <Truck className="text-[#F26A1C]" size={24} />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-400">Current Status</p>
                <p className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                  {STATUS_LABELS[order.status] || order.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">Earning</p>
              <p className="text-xl font-black text-[#F26A1C]">{order.deliveryFee} ETB</p>
            </div>
          </div>
        </div>

        {/* Pickup & Dropoff Segmented View */}
        <div className="space-y-4">
          {/* Pickup Point */}
          <div className={cn(
            "p-6 rounded-[32px] transition-all border-2",
            isAtPickup ? "bg-white dark:bg-gray-900 border-[#F26A1C]/30 shadow-lg" : "bg-gray-50/50 dark:bg-gray-900/50 border-transparent opacity-60"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-[#F26A1C]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Pickup</h3>
              </div>
              {order.status === "PICKED_UP" && <CheckCircle2 className="text-green-500" size={18} />}
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">{order.restaurant.name}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">{order.restaurant.location}</p>
            
            <div className="mt-5 flex gap-2">
              <a href={`tel:${order.restaurant.phone}`} className="flex-1 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                <Phone size={16} /> Call Shop
              </a>
              <button className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                <Navigation size={20} />
              </button>
            </div>
          </div>

          {/* Dropoff Point */}
          <div className={cn(
            "p-6 rounded-[32px] transition-all border-2",
            isEnRoute || isAtDropoff ? "bg-white dark:bg-gray-900 border-[#F26A1C]/30 shadow-lg" : "bg-gray-50/50 dark:bg-gray-900/50 border-transparent opacity-60"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#F26A1C]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Dropoff</h3>
              </div>
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">{order.customer.fullName}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">{order.customer.deliveryAddress || "Address Loading..."}</p>
            
            <div className="mt-5 flex gap-2">
              <a href={`tel:${order.customer.phoneNumber}`} className="flex-1 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                <Phone size={16} /> Call Customer
              </a>
              <button className="h-12 w-12 rounded-2xl bg-[#FFEFE5] dark:bg-orange-950/20 text-[#F26A1C] flex items-center justify-center">
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-[32px] bg-white dark:bg-gray-900 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
           <div className="flex items-center gap-2 mb-4">
             <Package size={18} className="text-[#F26A1C]" />
             <h3 className="text-base font-black text-gray-900 dark:text-white">Package Contents</h3>
           </div>
           <div className="space-y-3">
             {order.items.map((item) => (
               <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                 <div>
                   <p className="text-sm font-black text-gray-900 dark:text-white">{item.name}</p>
                   <p className="text-xs font-bold text-gray-400">Qty: {item.quantity}</p>
                 </div>
                 <p className="text-sm font-black text-gray-900 dark:text-white">{item.unitPrice * item.quantity} ETB</p>
               </div>
             ))}
           </div>
        </div>
      </main>

      {/* Dynamic Action Button Container */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFDFD] dark:from-gray-950 via-[#FDFDFD]/90 dark:via-gray-950/90 to-transparent z-40">
        <div className="max-w-[500px] mx-auto space-y-3">
          {isAtPickup && (
            <Button
              onClick={() => handleStatusUpdate("PICKED_UP")}
              disabled={isUpdating}
              className="w-full h-16 rounded-full bg-[#F26A1C] text-white text-lg font-black shadow-lg shadow-orange-500/20"
            >
              {isUpdating ? "Processing..." : "Confirm Pickup"}
            </Button>
          )}

          {order.status === "PICKED_UP" && (
            <Button
              onClick={() => handleStatusUpdate("EN_ROUTE")}
              disabled={isUpdating}
              className="w-full h-16 rounded-full bg-[#F26A1C] text-white text-lg font-black shadow-lg shadow-orange-500/20"
            >
              {isUpdating ? "Updating..." : "Start Journey"}
            </Button>
          )}

          {order.status === "EN_ROUTE" && (
            <Button
              onClick={() => handleStatusUpdate("ARRIVED")}
              disabled={isUpdating}
              className="w-full h-16 rounded-full bg-[#F26A1C] text-white text-lg font-black shadow-lg shadow-orange-500/20"
            >
              {isUpdating ? "Updating..." : "Arrived at Customer"}
            </Button>
          )}

          {isAtDropoff && (
            <Button
              onClick={() => navigate(buildRoute(ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE, { orderId: order.id }))}
              className="w-full h-16 rounded-full bg-green-500 hover:bg-green-600 text-white text-lg font-black shadow-lg shadow-green-500/20"
            >
              Verify OTP & Complete
            </Button>
          )}

          <Button
            onClick={() => navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.TRACK, { orderId: order.id }))}
            variant="outline"
            className="w-full h-14 rounded-full border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-black"
          >
            Live Tracking Map
          </Button>
        </div>
      </div>
    </div>
  );
}
