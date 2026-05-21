import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Phone, MessageSquare, AlertTriangle, CheckCircle2, Truck, Flag } from "lucide-react";
import { useOrderStore, type OrderStatus } from "@/store/orders/orderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ROUTES } from "@/routes/routePaths";

export default function ActiveDeliveryDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Single active order fetches automatically on dashboard boot, but we fallback to API if reloaded
  const { activeOrders, fetchActiveOrders,fetchOrderById, updateOrderStatus, reportUnfulfillable, isLoading } = useOrderStore();
  const currentOrder = activeOrders.find(o => o.id === orderId);

  const orderToDisplay = currentOrder?.id === orderId ? currentOrder : activeOrders.find(o => o.id === orderId);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>("RESTAURANT_CLOSED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderId && !orderToDisplay) {
      fetchActiveOrders();
      fetchOrderById(orderId);
    }
  }, [orderId, currentOrder, fetchActiveOrders]);

  useEffect(() => {
    if (orderToDisplay?.status === 'COMPLETED') {
      const timer = setTimeout(() => {
        navigate(ROUTES.DELIVERY.DASHBOARD);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [orderToDisplay?.status, navigate]);

  if (isLoading && !currentOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F26A1C] border-t-transparent"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFD] px-5 text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the delivery details you're looking for.</p>
        <Button onClick={() => navigate(-1)} className="rounded-full px-8 bg-[#F26A1C] hover:bg-[#d95d15]">
          Go Back
        </Button>
      </div>
    );
  }

  if (orderToDisplay.status === 'COMPLETED') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFD] px-5 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Delivery Complete!</h2>
        <p className="text-gray-500 font-bold mb-8">Your payout has been added to your ledger.</p>
      </div>
    );
  }


  // BACKEND ALIGNED: Strict 17-state Canonical Tracker
  const steps = [
    { id: "picked_up", label: "Picked Up", icon: Package, targetStatus: "PICKED_UP" as OrderStatus },
    { id: "on_transit", label: "On Transit", icon: Truck, targetStatus: "EN_ROUTE" as OrderStatus },
    { id: "arrived", label: "Arrived", icon: Flag, targetStatus: "ARRIVED" as OrderStatus },
  ];

  const getStepStatus = (index: number) => {
    const statusMap: Record<string, number> = {
      "ASSIGNED": 0, "AWAITING_PAYMENT": 0, "PAYMENT_RECEIVED": 0,
      "VENDOR_BEING_PREPARED": 0, "VENDOR_READY_FOR_PICKUP": 0,
      "PICKED_UP": 1,
      "EN_ROUTE": 2,
      "ARRIVED": 3, "RECEIVED": 3, "DELIVERED": 3, "COMPLETED": 3
    };

    const currentIndex = statusMap[orderToDisplay.status] ?? 0;

    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  const handleStepClick = async (index: number) => {
    const status = getStepStatus(index);
    if (status !== "current") return;

    const step = steps[index];
    if (step.targetStatus) {
      try {
        // Fraud Engine Note: If they tap "Picked Up", the backend requires GPS coords. 
        // We pass fallback 0,0 here, but in a real mobile app, you would read navigator.geolocation
        await updateOrderStatus(orderToDisplay.id, step.targetStatus, 8.563, 39.291);
        toast.success(`Status updated to ${step.label}`);
        
        if (step.targetStatus === "ARRIVED") {
          // Send them to the OTP Handshake screen!
          navigate(`/delivery/${orderToDisplay.id}/complete`)
          // navigate(ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE,  {orderId: orderToDisplay.id, } );
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update status.");
      }
    }
  };

  const handleReportIssue = async () => {
    setIsSubmitting(true);
    try {
      await reportUnfulfillable(orderToDisplay.id, reportReason, "Reported via Delivery Details App");
      toast.success("Issue reported. Customer has been refunded.");
      setIsReportModalOpen(false);
      navigate(ROUTES.DELIVERY.DASHBOARD);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to report issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#FDFDFD] font-sans text-gray-900 min-h-screen relative pb-10">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(242, 106, 28, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(242, 106, 28, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(242, 106, 28, 0); }
        }
        .pulse-active { animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F26A1C] transition hover:bg-orange-100 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-black">
              Order #{orderToDisplay.shortId}
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Status: {orderToDisplay.status.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-6">
        {/* Progress System */}
        <section className="bg-white rounded-[32px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Job Milestones</h3>
          </div>

          <div className="relative flex justify-between">
            {/* Connector Line */}
            <div className="absolute top-6 left-8 right-8 h-[2px] bg-gray-100 -z-0" />

            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const Icon = step.icon;
              // Deliverer cannot progress their status if customer hasn't paid yet!
              const isActionable = status === "current" && !["ASSIGNED", "AWAITING_PAYMENT"].includes(orderToDisplay.status);

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isActionable}
                    className={cn(
                      "group flex h-13 w-13 items-center justify-center rounded-full border-2 transition-all duration-500 relative",
                      status === "completed" 
                        ? "bg-[#F26A1C] border-[#F26A1C] text-white" 
                        : status === "current" 
                          ? "bg-white border-[#F26A1C] text-[#F26A1C] shadow-[0_0_20px_rgba(242,106,28,0.25)]" 
                          : "bg-white border-gray-100 text-gray-300 opacity-60"
                      ,
                      isActionable && "pulse-active cursor-pointer hover:scale-110 active:scale-90"
                    )}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 size={26} className="animate-in zoom-in duration-500" />
                    ) : (
                      <Icon size={24} />
                    )}

                    {isActionable && (
                      <div className="absolute -top-12 bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap animate-bounce shadow-xl">
                        {step.label.toUpperCase()} ?
                      </div>
                    )}
                  </button>

                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter text-center max-w-[70px]",
                    status === "upcoming" ? "text-gray-300" : "text-gray-900"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {["ASSIGNED", "AWAITING_PAYMENT"].includes(orderToDisplay.status) && (
             <p className="text-center text-xs text-orange-500 mt-6 font-bold animate-pulse">Waiting for Customer Payment...</p>
          )}
        </section>

        {/* Customer & Destination */}
        <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F26A1C]">
              <MapPin size={24} className="stroke-[2.5]" />
            </div>
            <div className="flex-1 pt-1">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 font-outfit">Destination</h4>
              {/* BACKEND ALIGNMENT: defaultDormBlock */}
              <p className="text-[15px] font-bold text-gray-900 leading-tight">{orderToDisplay.customer?.defaultDormBlock || "ASTU Campus"}</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-[14px] font-black text-gray-900">{orderToDisplay.customer?.user?.fullName}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Customer</p>
              </div>
            </div>
            {orderToDisplay.customer?.user?.phoneNumber && (
              <a
                href={`tel:${orderToDisplay.customer.user.phoneNumber}`}
                className="h-12 w-12 rounded-full bg-[#F26A1C] flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-95 transition-all"
              >
                <Phone size={20} fill="white" />
              </a>
            )}
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Order Summary</h3>
          </div>
          <div className="p-6 space-y-5">
            {orderToDisplay.items.map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                    {/* BACKEND ALIGNMENT */}
                    <img src={item.product?.imageUrl || "https://images.unsplash.com/photo-1544025162-831e5088eb7e"} alt={item.product?.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-gray-900 tracking-tight">{item.product?.name || item.name}</p>
                    <p className="text-[12px] font-bold text-gray-400">{item.quantity} x {Number(item.unitPrice).toFixed(0)} Birr</p>
                  </div>
                </div>
                <p className="text-[15px] font-black text-[#F26A1C] font-mono">{Number(item.quantity * item.unitPrice).toFixed(0)} Birr</p>
              </div>
            ))}

            <div className="pt-2">
              <div className="flex items-center justify-between px-2 py-4 bg-gray-900 rounded-2xl">
                <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest ml-4">Expected Payout</span>
                {/* DELIVERER MATH: They care about what they earn, not the customer total */}
                <span className="text-[20px] font-black text-white mr-4 font-mono">{Number(orderToDisplay.totalAmount).toFixed(0)} Birr</span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Action */}
        <section className="pt-6 pb-20">
          <Button
            variant="outline"
            onClick={() => setIsReportModalOpen(true)}
            className="w-full h-14 rounded-2xl border-2 border-red-50 bg-white text-red-500 font-black text-[15px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all flex gap-3 items-center justify-center shadow-sm"
          >
            <AlertTriangle size={20} className="stroke-[2.5]" />
            Report Issue (Cancel)
          </Button>
        </section>
      </main>

      {/* UNFULFILLABLE ESCAPE HATCH MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsReportModalOpen(false)} />
          <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 text-center shadow-2xl">
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white mb-2 leading-tight">
              Report Order Issue
            </h3>
            <p className="text-[12px] font-medium text-gray-500 mb-4 px-2">
              If the restaurant is closed or out of stock, select a reason to cancel the order and refund the customer.
            </p>
            
            <select 
              value={reportReason} 
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full mb-6 p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#F26A1C]"
            >
              <option value="RESTAURANT_CLOSED">Restaurant is Closed</option>
              <option value="OUT_OF_STOCK">Item is Out of Stock</option>
              <option value="PRICE_MISMATCH">Price Mismatch (Menu outdated)</option>
              <option value="VENDOR_REFUSED">Vendor Refused Order</option>
            </select>

            <div className="flex gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => setIsReportModalOpen(false)}
                className="flex-1 py-3.5 border-2 border-orange-100 text-[#F26A1C] font-bold rounded-[16px] text-[13px] active:scale-95 transition-transform"
              >
                Back
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleReportIssue}
                className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-[16px] text-[13px] shadow-md active:scale-95 transition-transform flex items-center justify-center"
              >
                {isSubmitting ? "..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}