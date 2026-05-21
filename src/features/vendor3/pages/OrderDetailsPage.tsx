import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, CheckCircle2, Star, Loader2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useVendorOrderStore } from "@/store/vendor/vendorOrderStore";
// We reuse the deep-fetcher we built for the deliverer/customer
import { useOrderDetailsStore } from "@/store/orders/orderDetailsStore"; 
import { toast } from "sonner";
import { ROUTES, buildRoute } from "@/routes/routePaths";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  
  const { acceptOrder, rejectOrder, updateOrderStatus } = useVendorOrderStore();
  const { order, isLoading, fetchOrderDetails, clearState } = useOrderDetailsStore();
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
    return () => clearState();
  }, [orderId, fetchOrderDetails, clearState]);

  // Dynamic Button Handlers
  const handlePrimaryAction = async () => {
    if (!order) return;
    setIsProcessing(true);
    try {
      if (order.status ===  'AWAITING_VENDOR') {
        await acceptOrder(order.id, 20); // Default 20 mins ETA
        toast.success("Order Accepted! Waiting for deliverer/payment.");
        navigate(ROUTES.VENDOR.DASHBOARD);
      } 
      else if (order.status === 'PAYMENT_RECEIVED') {
        await updateOrderStatus(order.id, 'VENDOR_BEING_PREPARED');
        toast.success("Order marked as Cooking.");
        // Re-fetch to update UI instantly without navigating
        fetchOrderDetails(order.id);
      }
      else if (order.status === 'VENDOR_BEING_PREPARED') {
        await updateOrderStatus(order.id, 'VENDOR_READY_FOR_PICKUP');
        toast.success("Order marked Ready for Pickup.");
        navigate(ROUTES.VENDOR.DASHBOARD);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!order) return;
    setIsProcessing(true);
    try {
      await rejectOrder(order.id, "Vendor cannot fulfill this order.");
      toast.success("Order Cancelled. Customer refunded if paid.");
      navigate(ROUTES.VENDOR.DASHBOARD);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Dynamic Text Helpers
  const getPrimaryButtonText = () => {
    if (order.status === 'AWAITING_VENDOR') return "Accept Order";
    if (order.status === 'PAYMENT_RECEIVED') return "Start Cooking";
    if (order.status === 'VENDOR_BEING_PREPARED') return "Mark Ready for Pickup";
    return "Process Order";
  };

  // Vendors can only decline if they haven't handed the food to the deliverer yet
  const canDecline = ['AWAITING_VENDOR', 'AWAITING_ACCEPT', 'ASSIGNED', 'AWAITING_PAYMENT', 'PAYMENT_RECEIVED', 'VENDOR_BEING_PREPARED'].includes(order.status);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2 pr-10">
          <span className="text-2xl">🍔</span>
          <h1 className="text-2xl font-extrabold text-black">Order #{order.shortId}</h1>
        </div>
      </div>

      {/* Content - Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-48 flex flex-col gap-4">
        {/* Status Alert */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-orange-800">Status</span>
          <span className="text-xs font-black text-[#F26A1C] uppercase tracking-wide px-3 py-1 bg-white rounded-full">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        {order.items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-[24px] p-3 shadow-sm border border-gray-100 flex relative"
          >
            {/* Circular Image */}
            <div className="w-20 h-20 shrink-0 mr-4 mt-2 relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover rounded-full shadow-md border-2 border-white"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center pt-5 pb-1 w-full">
              <h3 className="font-bold text-gray-900 leading-tight">
                {item.name} <span className="text-orange-500 font-black">(x{item.quantity})</span>
              </h3>
              <p className="text-sm font-semibold text-gray-800 my-1">{item.price} ETB <span className="text-xs font-medium text-gray-400">each</span></p>
              
              <div className="flex items-center gap-1 text-gray-500 mt-auto">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="text-[11px] font-medium truncate">
                  Deliver to: {order.customerAddress || "ASTU Campus"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Action Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] px-6 py-6 pb-8 z-20">
        
        {/* Sub Total (Strictly Backend Mapped) */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <span className="text-sm font-bold text-gray-500">Food Sub Total</span>
          <span className="text-lg font-black text-orange-500">{order.subtotal} ETB</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={handlePrimaryAction}
            disabled={isProcessing}
            className="flex-1 bg-[#F26A1C] text-white font-bold py-3.5 rounded-full shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all text-sm flex justify-center items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : getPrimaryButtonText()}
          </button>
          
          {canDecline && (
            <button 
              onClick={handleDecline}
              disabled={isProcessing}
              className="flex-1 bg-white text-red-500 font-bold py-3.5 rounded-full border-2 border-red-100 hover:bg-red-50 active:scale-95 transition-all text-sm flex justify-center items-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <> <X size={18} /> Decline </>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}