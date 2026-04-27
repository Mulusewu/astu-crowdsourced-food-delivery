import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Phone, MessageSquare, AlertTriangle, CheckCircle2, Truck, Flag } from "lucide-react";
import { useOrderStore } from "@/store/orders/orderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ActiveDeliveryDetailsPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById, isLoading, error } = useOrderStore();

  useEffect(() => {
    if (deliveryId) {
      fetchOrderById(deliveryId);
    }
  }, [deliveryId, fetchOrderById]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFD] px-5 text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the delivery details you're looking for.</p>
        <Button onClick={() => navigate(-1)} className="rounded-full px-8">
          Go Back
        </Button>
      </div>
    );
  }

  const steps = [
    { id: "picked_up", label: "Picked Up", icon: Package },
    { id: "in_transit", label: "On Transit", icon: Truck },
    { id: "delivered", label: "Arrived", icon: Flag },
  ];



  const getStepStatus = (index: number) => {
    // This is simplified logic for the UI tracker
    const statusMap: Record<string, number> = {
      "pending": -1,
      "confirmed": -1,
      "preparing": -1,
      "ready": -1,
      "picked_up": 0,
      "in_transit": 1,
      "delivered": 2,
    };
    
    const currentIndex = statusMap[currentOrder.status] ?? -1;
    
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="flex flex-col bg-[#FDFDFD] font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 border-b border-gray-100">
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
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Delivery Detail Information
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 space-y-6">
        {/* Status Tracker */}
        <section className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest text-center">Delivery Progress</h3>
          <div className="relative flex justify-between">
            {/* Background Line */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 -z-0" />
            
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    status === "completed" ? "bg-[#F26A1C] border-[#F26A1C] text-white" : 
                    status === "current" ? "bg-white border-[#F26A1C] text-[#F26A1C] shadow-[0_0_15px_rgba(242,106,28,0.3)]" : 
                    "bg-white border-gray-200 text-gray-300"
                  )}>
                    {status === "completed" ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tight",
                    status === "upcoming" ? "text-gray-300" : "text-gray-900"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Customer Information */}
        <section className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-[#F26A1C]">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</h4>
              <p className="text-[15px] font-bold text-gray-900">{currentOrder.customer.address}</p>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-gray-50 mb-6" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">{currentOrder.customer.name}</p>
                <p className="text-[11px] font-medium text-gray-500">Customer</p>
              </div>
            </div>
            <a 
              href={`tel:${currentOrder.customer.phone}`}
              className="h-12 w-12 rounded-full bg-[#f26a1c] flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-95 transition-transform"
            >
              <Phone size={20} fill="white" />
            </a>
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>
          </div>
          <div className="p-6 space-y-4">
            {currentOrder.items.map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">{item.name}</p>
                    <p className="text-[12px] font-medium text-gray-500">{item.quantity} x {item.price} Birr</p>
                  </div>
                </div>
                <p className="text-[14px] font-black text-[#F26A1C]">{item.quantity * item.price} Birr</p>
              </div>
            ))}
            
            <div className="h-[1px] w-full bg-gray-100 my-2" />
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-[15px] font-black text-gray-900">Total Payment</span>
              <span className="text-[18px] font-black text-[#F26A1C]">{currentOrder.totalAmount} Birr</span>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <section className="pt-4">
          <Button 
            variant="outline"
            onClick={() => navigate(`/delivery/report/${currentOrder.id}`)}
            className="w-full h-14 rounded-2xl border-[1.5px] border-red-100 bg-white text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all flex gap-2 items-center justify-center"
          >
            <AlertTriangle size={20} />
            Report Issue
          </Button>
        </section>
      </main>
    </div>
  );
}
