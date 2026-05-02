import { useState } from "react";
import { ArrowLeft, Clock, Utensils } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";
import { useVendorStore } from "@/store/vendorStore";

type OrderStatusType = "Confirmed" | "Preparing" | "Ready For Pickup" | "Picked Up";
export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { state } = useLocation();
  const { vendor, activeOrders } = useVendorStore();

  const [currentStatus, setCurrentStatus] = useState<OrderStatusType>("Confirmed");
  const [showNotification, setShowNotification] = useState(false);

  const handleStatusChange = (status: OrderStatusType) => {
    setCurrentStatus(status);
    setShowNotification(true);
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Fetch the matching order from the store to ensure data is synced
  const order = activeOrders.find(o => o.id === orderId);

  // Use dynamic state passed from Details page if available (reflects Out Of Stock changes), else fallback
  const orderNumber = order?.orderNo || "123";
  const restaurantName = vendor?.restaurantName || "Helen Cafe";
  const itemsCount = state?.itemsCount ?? (order?.items || 3);
  const timeElapsed = order ? `${order.timeElapsed} Min Ago` : "5 Min Ago";
  const price = state?.subTotal ?? (order?.totalAmount || 310);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-gray-50 sticky top-0 z-10">
        <button 
          onClick={() => navigate(`/vendor/order/${orderId}`)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center justify-center pr-10">
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Order Status</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {/* Top row: Restaurant Name & Order No */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-sm">{restaurantName}</h2>
            <span className="text-gray-400 text-sm font-medium">Order #{orderNumber}</span>
          </div>

          {/* Middle row: Icon, Items/Time, Price */}
          <div className="flex items-center mb-8">
            <div className="text-orange-500 mr-4">
              <Utensils className="w-10 h-10" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-extrabold text-gray-900 text-base">{itemsCount} Items</span>
              <div className="flex items-center text-gray-400 text-xs font-medium mt-1">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{timeElapsed}</span>
              </div>
            </div>
            <div className="font-bold text-orange-500 text-lg">
              {price} Birr
            </div>
          </div>

          {/* Bottom row: Status Radio Buttons (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-2">
            {(["Confirmed", "Preparing", "Ready For Pickup", "Picked Up"] as OrderStatusType[]).map((status) => (
              <div 
                key={status} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleStatusChange(status)}
              >
                <div className="relative flex items-center justify-center">
                  {currentStatus === status ? (
                    <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-in zoom-in duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-orange-300 group-hover:border-orange-400 transition-colors"></div>
                  )}
                </div>
                <span className={`text-xs font-bold transition-colors ${currentStatus === status ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customer Notification Feedback */}
        <div className={`mt-6 flex justify-center transition-all duration-500 ${showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border border-orange-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Customer Notified: Order is {currentStatus}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
