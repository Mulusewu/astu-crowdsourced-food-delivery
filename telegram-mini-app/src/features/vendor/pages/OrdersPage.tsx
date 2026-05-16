import { useState, useEffect } from "react";
import { useVendorStore, type VendorOrder } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";

export default function OrdersPage() {
  const { user } = useAuthStore();
  const { activeOrders, fetchVendorData, vendor } = useVendorStore();
  const [activeTab, setActiveTab] = useState<"all" | "new" | "preparing" | "ready">("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchVendorData(user.id);
    }
  }, [fetchVendorData, user?.id]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready" },
  ];

  const filteredOrders = activeOrders.filter((o: VendorOrder) => 
    activeTab === "all" ? true : o.status === activeTab
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold tracking-wide">Confirmed</span>;
      case "preparing":
        return <span className="px-3 py-1 bg-orange-50 text-[#F26A1C] rounded-full text-[11px] font-bold tracking-wide">Preparing</span>;
      case "ready":
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[11px] font-bold tracking-wide">Ready for Pickup</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[11px] font-bold tracking-wide">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden pb-24 font-outfit">
      {/* Header */}
      <div className="px-5 pt-8 pb-5 bg-gray-50 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-[#0B1E40] tracking-tight">Track Orders</h1>
        <p className="text-[13px] font-medium text-gray-500 mt-0.5">Manage your active orders</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                whitespace-nowrap rounded-2xl px-5 py-2.5 text-[13px] font-bold transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-[#F26A1C] text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-3 px-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm gap-3">
            <Package className="h-12 w-12 text-gray-200" />
            <div className="text-gray-400 font-bold text-sm">No {activeTab === "all" ? "active" : activeTab} orders at the moment.</div>
          </div>
        ) : (
          filteredOrders.map((order: VendorOrder) => (
            <div 
              key={order.id} 
              onClick={() => navigate(`/vendor/order/${order.id}/status`)}
              className="relative flex flex-col gap-3 rounded-[24px] bg-white p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-[#0B1E40] text-[17px] tracking-tight mb-1">
                    {vendor?.businessName || "Helen Cafe"}
                  </h3>
                  <div className="text-[12px] font-medium text-gray-500">
                    Order #{order.orderNo || "123"} • {order.timeElapsed || 2} Min Ago
                  </div>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <span className="text-[13px] font-medium text-gray-500">
                  {order.items || 3} Items
                </span>
                <span className="font-extrabold text-[#F26A1C] text-lg">
                  {order.totalAmount || 310} Birr
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
