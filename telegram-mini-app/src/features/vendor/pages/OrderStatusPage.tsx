import { useState } from "react";
import {
  ArrowLeft,
  Box,
  User,
  Phone,
  MapPin,
  Check,
  Clock,
  Package,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useVendorStore } from "@/store/vendorStore";

type OrderStatusType = "new" | "preparing" | "ready" | "completed";

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams();
  const { state } = useLocation();
  const { vendor, activeOrders, updateOrderStatus } = useVendorStore();

  const orderId = paramOrderId || activeOrders[0]?.id;
  const order = activeOrders.find((o) => o.id === orderId);

  // Mock items and customer info since it might not be in the store yet
  const mockItems = [
    { id: 1, quantity: 2, name: "Ethiopian Macchiato", price: 90 },
    { id: 2, quantity: 1, name: "Traditional Coffee", price: 130 },
  ];

  const handleStatusUpdate = () => {
    if (!order) return;
    if (order.status === "new") {
      updateOrderStatus(order.id, "preparing");
    } else if (order.status === "preparing") {
      updateOrderStatus(order.id, "ready");
    }
  };

  const orderNumber = order?.orderNo || "123";
  const restaurantName = vendor?.businessName || "Helen Cafe";
  const itemsCount = state?.itemsCount ?? (order?.items || 3);
  const timeElapsed = order ? `${order.timeElapsed} Min Ago` : "2 Min Ago";
  const price = state?.subTotal ?? (order?.totalAmount || 310);

  const getStepStatus = (stepId: OrderStatusType) => {
    const statuses: OrderStatusType[] = [
      "new",
      "preparing",
      "ready",
      "completed",
    ];
    const currentIndex = statuses.indexOf(
      (order?.status as OrderStatusType) || "new",
    );
    const stepIndex = statuses.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden font-outfit">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10">
        <button
          onClick={() => navigate("/vendor/orders")}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#0B1E40] tracking-tight">
          Order Status
        </h1>
        <span className="text-[13px] font-medium text-gray-500">
          Order #{orderNumber}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-2 pb-32 overflow-y-auto no-scrollbar">
        {/* Main Info Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          {/* Top row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-orange-50 flex items-center justify-center">
                <Box className="w-6 h-6 text-[#F26A1C]" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#0B1E40] text-[17px] tracking-tight mb-0.5">
                  {restaurantName}
                </h2>
                <div className="text-[12px] font-medium text-gray-500">
                  {itemsCount} Items • {timeElapsed}
                </div>
              </div>
            </div>
            <div className="font-extrabold text-[#F26A1C] text-lg tracking-tight">
              {price} Birr
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 w-full mb-5" />

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-extrabold text-[#0B1E40] text-[15px] mb-3">
              Order Items
            </h3>
            <div className="space-y-2.5">
              {mockItems.map((item) => (
                <div key={item.id} className="flex justify-between text-[13px]">
                  <span className="text-gray-600 font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-extrabold text-[#0B1E40]">
                    {item.price} Birr
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 w-full mb-5" />

          {/* Customer Information */}
          <div>
            <h3 className="font-extrabold text-[#0B1E40] text-[15px] mb-3">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-[13px] text-gray-600 font-medium">
                <User className="w-[18px] h-[18px] mr-3 text-gray-400" />
                {order?.customerName || "John Doe"}
              </div>
              <div className="flex items-center text-[13px] text-gray-600 font-medium">
                <Phone className="w-[18px] h-[18px] mr-3 text-gray-400" />
                +251911234567
              </div>
              <div className="flex items-center text-[13px] text-gray-600 font-medium">
                <MapPin className="w-[18px] h-[18px] mr-3 text-gray-400" />
                Bole, Addis Ababa
              </div>
            </div>
          </div>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mt-4">
          <h3 className="font-extrabold text-[#0B1E40] text-[15px] mb-6">
            Order Progress
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-5 bottom-8 w-[2px] bg-gray-100" />

            {/* Steps */}
            <div className="space-y-6">
              {/* Confirmed */}
              <div className="flex gap-4 relative z-10">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepStatus("new") === "completed" ||
                  getStepStatus("new") === "current" ? (
                    <div className="w-10 h-10 rounded-full bg-[#F26A1C] flex items-center justify-center shadow-sm">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-extrabold text-[15px] ${getStepStatus("new") === "current" ? "text-[#F26A1C]" : "text-[#0B1E40]"}`}
                  >
                    Confirmed
                  </h4>
                  {getStepStatus("new") === "current" && (
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      Current status
                    </p>
                  )}
                </div>
              </div>

              {/* Preparing */}
              <div className="flex gap-4 relative z-10">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepStatus("preparing") === "completed" ||
                  getStepStatus("preparing") === "current" ? (
                    <div className="w-10 h-10 rounded-full bg-[#F26A1C] flex items-center justify-center shadow-sm">
                      {getStepStatus("preparing") === "completed" ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-extrabold text-[15px] ${getStepStatus("preparing") === "current" ? "text-[#F26A1C]" : "text-[#0B1E40]"}`}
                  >
                    Preparing
                  </h4>
                  {getStepStatus("preparing") === "current" && (
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      Current status
                    </p>
                  )}
                </div>
              </div>

              {/* Ready for Pickup */}
              <div className="flex gap-4 relative z-10">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepStatus("ready") === "completed" ||
                  getStepStatus("ready") === "current" ? (
                    <div className="w-10 h-10 rounded-full bg-[#F26A1C] flex items-center justify-center shadow-sm">
                      {getStepStatus("ready") === "completed" ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Package className="w-5 h-5 text-white" />
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-extrabold text-[15px] ${getStepStatus("ready") === "current" ? "text-[#F26A1C]" : "text-[#0B1E40]"}`}
                  >
                    Ready for Pickup
                  </h4>
                  {getStepStatus("ready") === "current" && (
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      Waiting for delivery
                    </p>
                  )}
                </div>
              </div>

              {/* Picked Up */}
              <div className="flex gap-4 relative z-10">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepStatus("completed") === "completed" ||
                  getStepStatus("completed") === "current" ? (
                    <div className="w-10 h-10 rounded-full bg-[#F26A1C] flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-extrabold text-[15px] ${getStepStatus("completed") === "current" ? "text-[#F26A1C]" : "text-[#0B1E40]"}`}
                  >
                    Picked Up
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      {order && (order.status === "new" || order.status === "preparing") && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-5 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] max-w-md mx-auto z-20">
          <button
            onClick={handleStatusUpdate}
            className="w-full bg-[#F26A1C] text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
          >
            {order.status === "new" ? "Start Preparing" : "Mark as Ready"}
          </button>
        </div>
      )}
    </div>
  );
}
