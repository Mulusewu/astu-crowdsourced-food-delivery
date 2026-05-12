import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Phone, MessageSquare, AlertTriangle, CheckCircle2, Truck, Flag } from "lucide-react";
import { useOrderStore } from "@/store/orders/orderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ActiveDeliveryDetailsPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById, updateOrderStatus, isLoading, error } = useOrderStore();

  useEffect(() => {
    if (deliveryId) {
      fetchOrderById(deliveryId);
    }
  }, [deliveryId, fetchOrderById]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F26A1C] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !currentOrder) {
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

  const steps = [
    { 
      id: "picked_up", 
      label: "Picked Up", 
      icon: Package, 
      targetStatus: "picked_up" as const 
    },
    { 
      id: "on_transit", 
      label: "On Transit", 
      icon: Truck, 
      targetStatus: "in_transit" as const 
    },
    { 
      id: "arrived", 
      label: "Arrived", 
      icon: Flag, 
      targetStatus: "delivered" as const 
    },
  ];

  const getStepStatus = (index: number) => {
    // Definitive sequential mapping for manual tracking
    const statusMap: Record<string, number> = {
      // Step 0 is the starting task (not completed yet)
      "pending": 0,
      "confirmed": 0,
      "ready": 0,
      "preparing": 0,
      // Step 0 is completed, Step 1 is the next task
      "picked_up": 1,
      // Step 1 is completed, Step 2 is the final task
      "in_transit": 2,
      // All steps completed
      "delivered": 3,
    };

    const currentIndex = statusMap[currentOrder.status] ?? 0;

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
        await updateOrderStatus(currentOrder.id, step.targetStatus);
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }
  };

  return (
    <div className="flex flex-col bg-[#FDFDFD] font-sans text-gray-900 min-h-screen">
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
              Order #{currentOrder.orderNumber?.replace("ORD-", "") || currentOrder.id.slice(-3)}
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Manual Progress Tracker
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
              const isActionable = status === "current";

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
        </section>

        {/* Customer & Destination */}
        <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F26A1C]">
              <MapPin size={24} className="stroke-[2.5]" />
            </div>
            <div className="flex-1 pt-1">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 font-outfit">Destination</h4>
              <p className="text-[15px] font-bold text-gray-900 leading-tight">{currentOrder.customer.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-[14px] font-black text-gray-900">{currentOrder.customer.name}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Customer</p>
              </div>
            </div>
            <a
              href={`tel:${currentOrder.customer.phone}`}
              className="h-12 w-12 rounded-full bg-[#F26A1C] flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-95 transition-all"
            >
              <Phone size={20} fill="white" />
            </a>
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Order Summary</h3>
          </div>
          <div className="p-6 space-y-5">
            {currentOrder.items.map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-gray-900 tracking-tight">{item.name}</p>
                    <p className="text-[12px] font-bold text-gray-400">{item.quantity} x {item.price} Birr</p>
                  </div>
                </div>
                <p className="text-[15px] font-black text-[#F26A1C] font-mono">{item.quantity * item.price} Birr</p>
              </div>
            ))}

            <div className="pt-2">
              <div className="flex items-center justify-between px-2 py-4 bg-gray-900 rounded-2xl">
                <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest ml-4">Total Amount</span>
                <span className="text-[20px] font-black text-white mr-4 font-mono">{currentOrder.totalAmount} Birr</span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Action */}
        <section className="pt-6 pb-20">
          <Button
            variant="outline"
            onClick={() => navigate(`/delivery/report/${currentOrder.id}`)}
            className="w-full h-14 rounded-2xl border-2 border-red-50 bg-white text-red-500 font-black text-[15px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all flex gap-3 items-center justify-center shadow-sm"
          >
            <AlertTriangle size={20} className="stroke-[2.5]" />
            Report Issue
          </Button>
        </section>
      </main>
    </div>
  );
}
