import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, X, Loader2 } from "lucide-react";
import { useVendorOrderStore, type KitchenOrder } from "@/store/vendor/vendorOrderStore";
import { useVendorDashboardStore } from "@/store/vendor/vendorDashboardStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import BottomNav from "@/components/common/BottomNav";
import { toast } from "sonner";

export default function VendorOrdersPage() {
  const navigate = useNavigate();
   
  // 1. Data Fetching
  const { restaurantId } = useVendorDashboardStore();
  const { currentRestaurant } = useRestaurantStore();
  const { kitchenQueue, fetchKitchenQueue, acceptOrder, updateOrderStatus, rejectOrder, isLoading, connectVendorSocket, disconnectVendorSocket } = useVendorOrderStore();
  
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) {
      fetchKitchenQueue();
      connectVendorSocket();
    }
    return () => {
      disconnectVendorSocket();
    }
  }, [restaurantId, fetchKitchenQueue, connectVendorSocket, disconnectVendorSocket]);

  // 2. Tab Definition & Filtering (Mapped to Backend Enums)
  const tabs = [
    { id: "ALL", label: "All" },
    { id: "AWAITING_VENDOR", label: "New (Unaccepted)" },
    { id: "PAYMENT_RECEIVED", label: "Paid (Ready to Cook)" },
    { id: "VENDOR_BEING_PREPARED", label: "Cooking" },
    { id: "VENDOR_READY_FOR_PICKUP", label: "Ready for Pickup" },
  ];

  const filteredOrders = kitchenQueue.filter((o: KitchenOrder) => 
    activeTab === "ALL" ? true : o.status === activeTab
  );

  // 3. UI Helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AWAITING_VENDOR":
        return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[11px] font-bold tracking-wide">Action Required</span>;
      case "AWAITING_ACCEPT":
      case "ASSIGNED":
      case "AWAITING_PAYMENT":
        return <span className="px-3 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-full text-[11px] font-bold tracking-wide">Waiting on Customer/Driver</span>;
      case "PAYMENT_RECEIVED":
        return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[11px] font-bold tracking-wide">Paid - Ready to Cook</span>;
      case "VENDOR_BEING_PREPARED":
        return <span className="px-3 py-1 bg-orange-50 text-[#F26A1C] border border-orange-100 rounded-full text-[11px] font-bold tracking-wide">Cooking</span>;
      case "VENDOR_READY_FOR_PICKUP":
        return <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[11px] font-bold tracking-wide">Ready for Pickup</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[11px] font-bold tracking-wide">{status.replace(/_/g, ' ')}</span>;
    }
  };

  // 4. Dynamic Action Handlers
  const handlePrimaryAction = async (e: React.MouseEvent, order: KitchenOrder) => {
    e.stopPropagation(); // Prevent navigating to detail page
    setProcessingId(order.id);

    try {
      if (order.status === 'AWAITING_VENDOR') {
        // Assume 20 minutes prep time for fast action. Detailed page can have input.
        await acceptOrder(order.id, 20); 
        toast.success("Order Accepted! Broadcasted to deliverers.");
      } 
      else if (order.status === 'PAYMENT_RECEIVED') {
        await updateOrderStatus(order.id, 'VENDOR_BEING_PREPARED');
        toast.success("Order marked as Cooking.");
      }
      else if (order.status === 'VENDOR_BEING_PREPARED') {
        await updateOrderStatus(order.id, 'VENDOR_READY_FOR_PICKUP');
        toast.success("Order marked Ready for Pickup.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update order.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelAction = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setProcessingId(orderId);
    try {
      // Rejects unaccepted orders, or cancels paid orders (triggering backend escrow refund)
      await rejectOrder(orderId, "Vendor cancelled via fast-action button.");
      toast.success("Order Cancelled. Customer refunded.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setProcessingId(null);
    }
  };

  const getPrimaryButtonText = (status: string) => {
    if (status === 'AWAITING_VENDOR') return "Accept Order";
    if (status === 'PAYMENT_RECEIVED') return "Start Cooking";
    if (status === 'VENDOR_BEING_PREPARED') return "Mark Ready";
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden pb-24 font-sans">
      
      {/* Header */}
      <div className="px-5 pt-8 pb-5 bg-gray-50 sticky top-0 z-10">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kitchen Orders</h1>
        <p className="text-[13px] font-medium text-gray-500 mt-0.5">
          {currentRestaurant?.name || "Your Restaurant"}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        {isLoading && kitchenQueue.length === 0 ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#F26A1C]" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm gap-3">
            <Package className="h-12 w-12 text-gray-200" />
            <div className="text-gray-400 font-bold text-sm">No orders in this category.</div>
          </div>
        ) : (
          filteredOrders.map((order: KitchenOrder) => {
            const timeElapsedMins = Math.round((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);
            const primaryActionText = getPrimaryButtonText(order.status);
            const isProcessing = processingId === order.id;

            return (
              <div 
                key={order.id} 
                onClick={() => navigate(`/vendor/order/${order.id}`)}
                className="relative flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
              >
                {/* Top Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 text-[17px] tracking-tight mb-1">
                      #{order.shortId}
                    </h3>
                    <div className="text-[12px] font-medium text-gray-500">
                      {order.customerName} • {timeElapsedMins} Min Ago
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <ul className="text-[13px] font-semibold text-gray-700 space-y-1">
                    {order.items.map((i, idx) => (
                      <li key={idx} className="truncate">{i.quantity}x {i.name}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Fast Actions Bottom Bar */}
                {['AWAITING_VENDOR', 'PAYMENT_RECEIVED', 'VENDOR_BEING_PREPARED'].includes(order.status) && (
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button 
                      onClick={(e) => handleCancelAction(e, order.id)}
                      disabled={isProcessing}
                      className="w-12 h-10 shrink-0 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <X size={18} />
                    </button>
                    
                    {primaryActionText && (
                      <button 
                        onClick={(e) => handlePrimaryAction(e, order)}
                        disabled={isProcessing}
                        className="flex-1 h-10 bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[13px] rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shadow-sm"
                      >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : primaryActionText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}