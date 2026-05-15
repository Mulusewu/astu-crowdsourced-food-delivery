import { useEffect, useCallback } from "react";
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
import { useTelegram } from "@/contexts/TelegramContext";

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "CREATED":
    case "AWAITING_ACCEPT": return ClipboardCheck;
    case "ASSIGNED": return Bike;
    case "AWAITING_PAYMENT": return Clock;
    case "PAYMENT_RECEIVED": return CheckCircle2;
    case "VENDOR_BEING_PREPARED":
    case "VENDOR_FINISHED": return ChefHat;
    case "VENDOR_READY_FOR_PICKUP":
    case "PICKED_UP": return PackageCheck;
    case "EN_ROUTE": return Navigation;
    case "ARRIVED": return MapPin;
    case "RECEIVED":
    case "DELIVERED":
    case "COMPLETED": return Home;
    case "DISPUTED":
    case "CANCELLED":
    case "NO_DELIVERER_FOUND": return XCircle;
    default: return ClipboardCheck;
  }
};

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

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { showBackButton, hideBackButton, hapticFeedback } = useTelegram();
  
  // CRITICAL FIX: Pull the deep order details and websocket methods
  const { 
    currentOrderDetails: order, 
    isLoading, 
    fetchOrderDetails, 
    connectToTracking, 
    disconnectTracking 
  } = useCustomerOrderStore();

  const handleBack = useCallback(() => {
    hapticFeedback.impact("light");
    navigate(ROUTES.CUSTOMER.ORDERS.LIST);
  }, [navigate, hapticFeedback]);

  // Handle Telegram Nav
  useEffect(() => {
    showBackButton(handleBack);
    return () => hideBackButton();
  }, [showBackButton, hideBackButton, handleBack]);

  // Handle Backend Data & WebSocket Connection
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
      connectToTracking(orderId);
    }
    return () => disconnectTracking();
  }, [orderId]);

  if (isLoading && !order && orderId !== ":orderId") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#F26A1C] mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading tracker...</p>
      </div>
    );
  }

  if (orderId === ":orderId" || (!isLoading && !order)) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4"><XCircle size={32} className="text-[#F26A1C]" /></div>
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <button onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)} className="bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold shadow-lg">View All Orders</button>
      </div>
    );
  }

  if (!order) return null;

  const isDelivered = ["RECEIVED", "DELIVERED", "COMPLETED"].includes(order.status);
  const isFailed = ["CANCELLED", "DISPUTED", "NO_DELIVERER_FOUND"].includes(order.status);
  const isInTransit = ["EN_ROUTE", "ARRIVED"].includes(order.status);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col relative pb-10">
      <div className="relative w-full h-[35vh] bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop" alt="Map tracking" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
        
        {/* Mock Blinking Location Pin for En Route */}
        {isInTransit && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-14 h-14 bg-[#F26A1C]/20 rounded-full flex items-center justify-center animate-ping absolute" />
            <div className="w-12 h-12 bg-[#F26A1C] rounded-full border-4 border-white flex items-center justify-center relative shadow-xl">
              <Navigation size={20} className="text-white fill-white" />
            </div>
          </div>
        )}
        
        {isDelivered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
          </div>
        )}

        <button onClick={handleBack} className="absolute top-6 left-5 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#F26A1C]" />
                <h2 className="text-lg font-black">{STATUS_LABEL_MAP[order.status] ?? order.status}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Time</p>
              <p className="text-sm font-bold">
                {order.estimatedReadyAt 
                  ? new Date(order.estimatedReadyAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "Estimating..."}
              </p>
            </div>
          </div>
          
          {/* BACKEND ALIGNMENT: order.deliverer?.user */}
          {order.status === "AWAITING_ACCEPT" ? (
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                <Bike size={20} />
              </div>
              <p className="text-sm font-medium">Finding partner...</p>
            </div>
          ) : order.deliverer ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={order.deliverer.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.deliverer.user.fullName)}&background=F26A1C&color=fff`} 
                  alt={order.deliverer.user.fullName} 
                  className="w-12 h-12 rounded-full border-2 border-orange-100 object-cover" 
                />
                <div>
                  <p className="text-sm font-bold">{order.deliverer.user.fullName}</p>
                  <p className="text-xs font-medium text-gray-500">Delivery Partner · ★ {order.deliverer.rating.toFixed(1)}</p>
                </div>
              </div>
              {/* Only show phone button if backend un-masked the phone number */}
              {order.deliverer.user.phoneNumber && (
                <a href={`tel:${order.deliverer.user.phoneNumber}`} onClick={() => hapticFeedback.impact("medium")} className="w-10 h-10 bg-[#FFF4ED] dark:bg-gray-800 rounded-full flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform">
                  <Phone size={18} className="fill-[#F26A1C]/20" />
                </a>
              )}
            </div>
          ) : (
             // Graceful Fallback: The status is ASSIGNED but the deep payload fetch hasn't finished yet (takes ~100ms)
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                <Bike size={20} />
              </div>
              <p className="text-sm font-medium text-blue-500">Connecting you to driver...</p>
            </div>
          )}

        </div>
      </div>




      {(isInTransit || order.status === "PICKED_UP") && order.otpCode && (
        <div className="px-5 mt-6 relative z-10">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 rounded-2xl p-5 border border-orange-200 dark:border-orange-800 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-[#F26A1C] uppercase tracking-widest mb-1">Your Delivery OTP</p>
              <p className="text-xs font-semibold text-orange-800 dark:text-orange-300">Give this code to the driver</p>
            </div>
            <div className="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl shadow-sm">
              <span className="text-xl font-black text-[#F26A1C] tracking-[0.25em]">{order.otpCode}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 mt-8">
        <h3 className="font-black text-lg mb-6">Order Tracking</h3>
        {isFailed ? (
          <div className="flex flex-col items-center justify-center py-8 bg-red-50 dark:bg-red-900/10 rounded-[20px] text-center">
            <XCircle size={40} className="text-red-500 mb-3" />
            <p className="font-bold text-red-600">{STATUS_LABEL_MAP[order.status]}</p>
          </div>
        ) : (
          <div className="relative pl-4 space-y-7">
            <div className="absolute top-3 bottom-3 left-[31px] w-0.5 bg-gray-100 dark:bg-gray-800 -z-10" />
            
            {/* BACKEND ALIGNMENT: Render history from actual DB events */}
            {order.statusHistory?.map((historyItem: any, idx: number) => {
              const isActive = idx === order.statusHistory.length - 1;
              const Icon = getStatusIcon(historyItem.newStatus);
              const label = STATUS_LABEL_MAP[historyItem.newStatus as OrderStatus] ?? historyItem.newStatus;
              
              return (
                <div key={historyItem.id || idx} className="flex gap-4 relative">
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-4 border-[#FDFDFD] dark:border-gray-950 z-10 transition-all ${isActive ? "bg-[#F26A1C] text-white ring-4 ring-orange-100 dark:ring-orange-900/30 scale-110" : "bg-gray-200 dark:bg-gray-800 text-gray-400"}`}>
                    <Icon size={14} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <div className={`pt-0.5 ${!isActive && "opacity-60"}`}>
                    <p className={`text-sm font-bold ${isActive ? "text-[#F26A1C]" : "text-gray-900 dark:text-white"}`}>{label}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                      {new Date(historyItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 mt-8">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-2">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Delivery Address</span>
          </div>
          {/* BACKEND ALIGNMENT: Dorm Block */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {order.customer?.defaultLocation || "ASTU Campus, Adama"}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs text-gray-500">
            <span>Total Paid</span>
            <span className="font-bold text-[#F26A1C]">{Number(order.totalAmount).toFixed(2)} ETB</span>
          </div>
        </div>
      </div>
    </div>
  );
}