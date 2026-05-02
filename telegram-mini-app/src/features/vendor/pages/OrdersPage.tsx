import { useState, useEffect } from "react";
import { useVendorStore, type VendorOrder } from "@/store/vendorStore";
import { Clock, Check, ChefHat, X, Package } from "lucide-react";
import BottomNav from "@/components/common/BottomNav";

export default function OrdersPage() {
  const { activeOrders, updateOrderStatus, fetchVendorData, isLoading } = useVendorStore();
  const [activeTab, setActiveTab] = useState<"new" | "preparing" | "ready" | "history">("new");

  useEffect(() => {
    if (activeOrders.length === 0 && !isLoading) {
      fetchVendorData();
    }
  }, [fetchVendorData]);

  const tabs = [
    { id: "new", label: "New", count: activeOrders.filter((o: VendorOrder) => o.status === "new").length },
    { id: "preparing", label: "Preparing", count: activeOrders.filter((o: VendorOrder) => o.status === "preparing").length },
    { id: "ready", label: "Ready", count: activeOrders.filter((o: VendorOrder) => o.status === "ready").length },
  ];

  const filteredOrders = activeOrders.filter((o: VendorOrder) => 
    activeTab === "history" 
      ? ["completed", "cancelled"].includes(o.status)
      : o.status === activeTab
  );

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`flex items-center justify-center h-5 px-1.5 rounded-full text-xs
                ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm gap-3">
            <Package className="h-10 w-10 text-gray-300" />
            <div className="text-gray-500">No {activeTab} orders at the moment.</div>
          </div>
        ) : (
          filteredOrders.map((order: VendorOrder) => (
            <div key={order.id} className="relative flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900">#{order.orderNo}</span>
                    <span className="text-sm font-medium text-gray-400">• {order.customerName}</span>
                  </div>
                  <p className="text-sm text-gray-500">{order.items} {order.items === 1 ? 'item' : 'items'} • {order.totalAmount} ETB</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  <Clock className="h-3 w-3" />
                  {order.timeElapsed} mins
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2 border-t border-gray-50 pt-4">
                {order.status === "new" && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 px-4 py-2.5 text-sm font-semibold hover:bg-red-100 transition-colors"
                    >
                      <X className="h-4 w-4" /> Decline
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <ChefHat className="h-4 w-4" /> Accept & Prepare
                    </button>
                  </>
                )}

                {order.status === "preparing" && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Check className="h-4 w-4" /> Mark as Ready
                  </button>
                )}

                {order.status === "ready" && (
                  <div className="w-full text-center p-2 rounded-lg bg-green-50 border border-green-100">
                    <p className="text-sm font-medium text-green-700">Waiting for delivery pickup</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}

