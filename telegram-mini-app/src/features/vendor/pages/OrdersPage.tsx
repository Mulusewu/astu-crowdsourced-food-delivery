import { useVendorStore, type VendorOrder } from "@/store/vendorStore";
import { Package, Clock, Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";

export default function OrdersPage() {
  const { activeOrders, vendor, updateOrderStatus } = useVendorStore();
  const navigate = useNavigate();

  // Remove useEffect fetching to prevent state reset from database.json on every load
  // which causes accepted orders to revert back to 'new' and disappear.

  // We only want to show orders that have been accepted and are currently in progress.
  // Once an order is marked as 'completed' (Picked Up), it should leave this tracking list.
  const trackableOrders = activeOrders
    .filter((o: VendorOrder) => o.status === "preparing" || o.status === "ready");

  const handleStatusToggle = (orderId: string, status: VendorOrder["status"]) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative overflow-hidden pb-32 font-outfit">
      {/* Header */}
      <div className="px-5 pt-8 pb-5 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl border border-orange-100 flex items-center justify-center text-[#F26A1C] bg-orange-50/50 active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[28px] font-extrabold text-[#0B1E40] tracking-tight">Order Status</h1>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-6 px-5 mt-2">
        {trackableOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-[32px] border border-gray-100 gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Package className="h-10 w-10 text-orange-200" />
            </div>
            <div className="text-gray-400 font-bold text-base px-10">No active orders to track at the moment.</div>
          </div>
        ) : (
          trackableOrders.map((order: VendorOrder) => (
            <div 
              key={order.id} 
              className="relative flex flex-col gap-6 rounded-[32px] bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#0B1E40] text-[18px] tracking-tight">
                    {vendor?.businessName || "Helen Cafe"}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[13px] font-bold text-gray-400">
                      <Clock size={14} className="text-[#F26A1C]" />
                      {order.timeElapsed || 2} Min Ago
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[14px] font-bold text-gray-300 block mb-0.5">Order #{order.orderNo || "123"}</span>
                  <span className="font-extrabold text-[#F26A1C] text-[18px]">
                    {order.totalAmount || 300} Birr
                  </span>
                </div>
              </div>

              {/* Items Summary with Icon */}
              <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                <div className="w-12 h-12 bg-[#F26A1C] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                   <p className="text-[17px] font-extrabold text-[#0B1E40] leading-none mb-1">{order.items || 3} Items</p>
                   <p className="text-[12px] font-bold text-orange-400">Preparation in progress</p>
                </div>
              </div>

              {/* Status Update Grid - Radio Style */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
                <StatusOption 
                  label="Confirmed"
                  isActive={order.status === "new"}
                  isCompleted={["preparing", "ready", "completed"].includes(order.status)}
                  onClick={() => handleStatusToggle(order.id, "new")}
                />
                <StatusOption 
                  label="Ready For Pickup"
                  isActive={order.status === "ready"}
                  isCompleted={order.status === "completed"}
                  onClick={() => handleStatusToggle(order.id, "ready")}
                />
                <StatusOption 
                  label="Preparing"
                  isActive={order.status === "preparing"}
                  isCompleted={["ready", "completed"].includes(order.status)}
                  onClick={() => handleStatusToggle(order.id, "preparing")}
                />
                <StatusOption 
                  label="Picked Up"
                  isActive={order.status === "completed"}
                  isCompleted={false}
                  onClick={() => handleStatusToggle(order.id, "completed")}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function StatusOption({ label, isActive, isCompleted, onClick }: { label: string, isActive: boolean, isCompleted: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 text-left group transition-all"
    >
      <div className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${isCompleted 
          ? "bg-[#F26A1C] border-[#F26A1C] shadow-sm" 
          : isActive 
            ? "border-[#F26A1C] ring-4 ring-orange-50" 
            : "border-gray-200 group-hover:border-orange-200"
        }
      `}>
        {isCompleted ? (
          <Check size={14} className="text-white stroke-[3px]" />
        ) : (
          isActive && <div className="w-2.5 h-2.5 bg-[#F26A1C] rounded-full shadow-sm shadow-orange-200 animate-pulse" />
        )}
      </div>
      <span className={`
        text-[14px] font-bold tracking-tight transition-colors duration-300
        ${isActive || isCompleted ? "text-[#0B1E40]" : "text-gray-400 group-hover:text-gray-500"}
      `}>
        {label}
      </span>
    </button>
  );
}

