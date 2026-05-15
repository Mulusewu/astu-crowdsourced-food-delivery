import { useEffect } from "react";
import { ArrowLeft, Phone, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/orders/orderStore";

// Helper for exact date formatting "03 June 2026"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString: string | null) => {
  if (!dateString) return "Estimating...";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
};

// BACKEND ALIGNED: Maps exact DB Enums to UI strings
const statusMap: Record<string, string> = {
  ASSIGNED: "Awaiting Payment",
  AWAITING_PAYMENT: "Awaiting Payment",
  PAYMENT_RECEIVED: "Payment Received",
  VENDOR_BEING_PREPARED: "Preparing Food",
  VENDOR_FINISHED: "Ready Soon",
  VENDOR_READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  EN_ROUTE: "On Transit",
  ARRIVED: "Arrived",
  RECEIVED: "Customer Confirmed",
};

export default function ActiveDeliveriesPage() {
  const navigate = useNavigate();
  // CRITICAL FIX: Fetch the single active delivery enforced by backend constraint
  const { activeOrders, fetchActiveOrders } = useOrderStore();

  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  return (
    <div className="flex flex-col bg-[#FDFDFD] font-sans text-gray-900 min-h-screen">
      <header className="px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-8">
        <div className="relative flex items-center justify-center h-12">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#FFEFE5] text-[#F26A1C] transition hover:bg-orange-200 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="text-[26px] font-black text-black tracking-tight">
            Active Orders
          </h1>
        </div>
      </header>

      <main className="flex-1 px-5">
        <div className="flex flex-col gap-6">
          {activeOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Truck size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No active deliveries at the moment.</p>
            </div>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/delivery/active/${order.id}`)}
                className="w-full rounded-[24px] border border-gray-100/80 bg-white p-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between pb-[10px]">
                  <span className="text-[14px] font-medium text-[#F26A1C]">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="text-[15px] font-bold text-[#00A859]">
                    ETA: {formatTime(order.estimatedDeliveryTime)}
                  </span>
                </div>
                <div className="h-[1px] w-full bg-gray-100 mb-[12px]" />

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[16px] font-black tracking-tight text-[#F26A1C]">
                    Order #{order.shortId}
                  </span>
                  <div className="flex items-center gap-[6px] text-gray-900">
                    <Truck size={15} strokeWidth={1.5} className="text-gray-700" />
                    <span className="text-[14px] font-medium text-black">
                      {statusMap[order.status] || order.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  {order.items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex flex-col">
                      <div className="flex items-center py-[10px] text-[14px] font-medium text-black">
                        {/* BACKEND ALIGNMENT: Nested Product DTO */}
                        <span className="flex-1">{item.product?.name || item.name}</span>
                        <span className="w-16 text-center">{item.quantity} Pcs</span>
                      </div>
                      {index < order.items.length - 1 && (
                        <div className="h-[1px] w-full bg-gray-100" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between py-2">
                  <div className="flex items-center gap-1.5">
                    <Phone size={16} strokeWidth={2.5} className="text-[#F26A1C] fill-[#F26A1C]" />
                    <span className="text-[15px] font-medium text-[#F26A1C]">
                      {order.customer?.user?.phoneNumber || "Hidden until Picked Up"}
                    </span>
                  </div>
                  <div className="text-[15px]">
                    <span className="font-bold text-black mr-2">Total</span>
                    <span className="font-black text-black">{Number(order.totalAmount).toFixed(0)} Birr</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}