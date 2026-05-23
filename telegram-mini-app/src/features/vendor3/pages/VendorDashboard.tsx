import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, Package, Mail, Check, X, AlertCircle, Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { useVendorDashboardStore } from "@/store/vendor/vendorDashboardStore";
import { useVendorOrderStore, type KitchenOrder  } from "@/store/vendor/vendorOrderStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { toast } from "sonner";
import BottomNav from "@/components/common/BottomNav";
import { ROUTES } from "@/routes/routePaths";


function firstName(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName;
}

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

 
  
  const { stats, restaurantId, error: dashboardError, isLoading: isStatsLoading, fetchDashboardData } = useVendorDashboardStore();
  
  const { 
    kitchenQueue, isLoading: isQueueLoading, fetchKitchenQueue, 
    connectVendorSocket, disconnectVendorSocket,
    acceptOrder, rejectOrder, updateOrderStatus 
  } = useVendorOrderStore();
  
  const { currentRestaurant, fetchRestaurantDetails, toggleRestaurantStatus } = useRestaurantStore();

  const [processingId, setProcessingId] = useState<string | null>(null);

  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);



  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails(restaurantId);
      fetchKitchenQueue();
      connectVendorSocket();
    }
    return () => disconnectVendorSocket();
  }, [restaurantId, fetchRestaurantDetails, fetchKitchenQueue, connectVendorSocket, disconnectVendorSocket]);

  
//debugging 1
  // console.log("it have reached teh Vendor dashboard");
  // console.log("VendorDashboard Render", { stats, kitchenQueue, currentRestaurant, dashboardError });

  const handleToggleStatus = async () => {
    if (!currentRestaurant) return;
    try {
      await toggleRestaurantStatus(currentRestaurant.id, !currentRestaurant.isOpen);
      toast.success(`Restaurant is now ${!currentRestaurant.isOpen ? 'OPEN' : 'CLOSED'}`);
    } catch (error) {
      toast.error("Failed to update store status.");
      console.log("Toggle Status Error", error);
    }
  };



  const handleAccept = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await acceptOrder(orderId, 20); // Default 20 mins ETA
      toast.success("Order Accepted! Waiting for a deliverer.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to accept order.");
    } finally {
      setProcessingId(null);
    }
  };



  const handleReject = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await rejectOrder(orderId, "Vendor busy or item out of stock.");
      toast.success("Order Rejected.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to reject order.");
    } finally {
      setProcessingId(null);
    }
  };
  

  const handleLogOut = () => {
      logout();
      navigate(ROUTES.AUTH);
    };
 

  const handleStartCooking = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, "VENDOR_BEING_PREPARED");
      toast.success("Started Cooking.");
    } catch (e: any) {
      toast.error("Failed to update state.");
    } finally {
      setProcessingId(null);
    }
  };

    if (!isStatsLoading && !restaurantId && dashboardError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200">
          <AlertCircle size={40} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Account Under Review</h2>
        <p className="text-gray-500 font-medium text-[15px] leading-relaxed max-w-sm">
          Your vendor account has been created successfully. An administrator must verify your business license and assign you to a restaurant before you can access the dashboard.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
        >
          Check Status
        </button>
        <button 
          onClick={handleLogOut}
          className="mt-8 bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
        >
          Log Out
        </button>
      </div>
    );
  }

  
  
  const isLoading = isStatsLoading || isQueueLoading || !currentRestaurant;

 
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto w-full min-h-screen bg-white">
        <Skeleton className="h-32 w-full rounded-[32px] mt-4" />
      </div>
    );
  }

  // Splitting the queue into actionable buckets
    const pendingAcceptance = kitchenQueue.filter(o => o.status === "AWAITING_VENDOR");
  const waitingOnLogistics = kitchenQueue.filter(o => ["AWAITING_ACCEPT", "ASSIGNED", "AWAITING_PAYMENT"].includes(o.status));
  const readyToCook = kitchenQueue.filter(o => o.status === "PAYMENT_RECEIVED");
  const currentlyCooking = kitchenQueue.filter(o => o.status === "VENDOR_BEING_PREPARED");
  
  const isOpen = currentRestaurant?.isOpen ?? false;

   const PremiumOrderCard = ({ 
    order, badgeText, badgeColor, primaryActionText, onPrimaryAction, onSecondaryAction, isProcessing, disabledText
  }: { 
    order: KitchenOrder, badgeText: string, badgeColor: string, 
    primaryActionText: string, onPrimaryAction: () => void, 
    onSecondaryAction?: () => void, isProcessing: boolean, disabledText?: string 
  }) => {
    const timeElapsedMins = Math.round((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);
    const firstImage = order.items?.[0]?.imageUrl || "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200";
    const totalItems = order.items.reduce((acc, i) => acc + i.quantity, 0);

    return (
      <div className="relative flex flex-col items-center bg-white rounded-[32px] pt-14 pb-5 px-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden z-10 transition-transform group-hover:scale-110 duration-500">
          <img src={firstImage} alt={`Order ${order.shortId}`} className="w-full h-full object-cover" />
        </div>

        <div className={`absolute right-4 top-4 px-2 py-0.5 rounded-full border z-20 ${badgeColor}`}>
          <span className="text-[8px] font-black uppercase tracking-tighter">{badgeText}</span>
        </div>

        <div className="flex flex-col items-center text-center gap-0.5 mt-2">
          <h3 className="font-black text-gray-900 text-lg tracking-tight">#{order.shortId}</h3>
          <div className="flex flex-col items-center leading-tight">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wide">{timeElapsedMins} Min Ago</span>
            </div>
            <div className="mt-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 flex items-center gap-2">
              <span className="text-primary text-[11px] font-black">{totalItems} Items</span>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="text-primary/90 text-[11px] font-black">{order.customerName.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full flex gap-2">
          {onSecondaryAction && (
            <button 
              onClick={onSecondaryAction}
              disabled={isProcessing}
              className="flex items-center justify-center w-12 bg-white text-red-500 border border-red-100 rounded-2xl active:scale-95 transition-all disabled:opacity-50"
            >
              <X size={18} strokeWidth={3} />
            </button>
          )}
          
          {/* REFINED: Dynamic button that acts as a disabled status badge if no action is permitted */}
          <button 
            onClick={onPrimaryAction}
            disabled={isProcessing || !!disabledText}
            className={`flex-1 text-xs font-black py-3 rounded-2xl shadow-[0_10px_20px_rgba(242,106,28,0.2)] active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest disabled:shadow-none ${
              disabledText ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : (disabledText || primaryActionText)}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 pb-28 max-w-lg mx-auto w-full bg-white min-h-screen animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight">
            <span className="text-primary block">Welcome Back,</span>
            <span className="text-black">{currentRestaurant?.name.split(' ')[0] || firstName(user?.fullName || "Vendor")}</span>
          </h1>
        </div>
        <div className="group relative">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 overflow-hidden">
            {user?.avatarUrl || currentRestaurant?.imageUrl ? (
              <img src={user?.avatarUrl || currentRestaurant?.imageUrl} alt={currentRestaurant?.name} className="w-full h-full object-cover" />
            ) : ((currentRestaurant?.name || "V").charAt(0))}
          </div>
          <div className="absolute top-14 right-0 bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap z-50 shadow-2xl pointer-events-none flex items-center gap-2 border border-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <Mail className="w-3 h-3 text-primary/80" />
            {user?.email || "No Email Provided"}
          </div>
        </div>
      </div>

      {/* Store Status Toggle & Summary Stats */}
      <div className="flex flex-col gap-4 bg-primary/5 p-5 rounded-[32px] border border-primary/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-lg font-black ${isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                {isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          </div>
          <button onClick={handleToggleStatus} className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${isOpen ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-primary/20">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Revenue</span>
            <span className="text-sm font-black text-gray-900">{stats.totalRevenue.toLocaleString()} ETB</span>
          </div>
          <div className="flex flex-col border-x border-primary/20 px-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Orders</span>
            <span className="text-sm font-black text-gray-900">{stats.todayOrders} Today</span>
          </div>
          <div className="flex flex-col pl-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-sm font-black text-gray-900">{currentRestaurant?.rating || 5.0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-800">Requires Attention</h2>
        {pendingAcceptance.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
             <Package className="w-12 h-12 text-gray-300 mb-2" />
             <p className="text-gray-500 text-sm font-medium">No new incoming orders.</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-8">
            {pendingAcceptance.map(order => (
              <PremiumOrderCard 
                key={order.id} 
                order={order} 
                badgeText="NEW" 
                badgeColor="bg-red-50 text-red-600 border-red-200"
                primaryActionText="Accept"
                onPrimaryAction={() => handleAccept(order.id)}
                onSecondaryAction={() => handleReject(order.id)}
                isProcessing={processingId === order.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* 1.5 WAITING ON CUSTOMER/DRIVER (Logistics Delay) */}
      {waitingOnLogistics.length > 0 && (
        <div className="flex flex-col gap-4 mt-8">
          <h2 className="text-lg font-bold text-gray-800">Waiting For System</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-8">
            {waitingOnLogistics.map(order => (
              <PremiumOrderCard 
                key={order.id} 
                order={order} 
                badgeText={order.status === "AWAITING_PAYMENT" ? "UNPAID" : "NO DRIVER"} 
                badgeColor="bg-gray-50 text-gray-500 border-gray-200"
                primaryActionText="" // Hidden
                disabledText={order.status === "AWAITING_PAYMENT" ? "Waiting for Pay" : "Waiting for Driver"}
                onPrimaryAction={() => {}}
                isProcessing={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. PAID & READY TO COOK */}
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-lg font-bold text-gray-800">Ready To Cook (Paid)</h2>
        {readyToCook.length === 0 ? (
           <p className="text-sm text-gray-400 italic">No paid orders waiting to be cooked.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-8">
            {readyToCook.map(order => (
              <PremiumOrderCard 
                key={order.id} 
                order={order} 
                badgeText="PAID" 
                badgeColor="bg-blue-50 text-blue-600 border-blue-200"
                primaryActionText="Cook"
                onPrimaryAction={() => handleStartCooking(order.id)}
                isProcessing={processingId === order.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. CURRENTLY COOKING */}
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-lg font-bold text-gray-800">Currently Cooking</h2>
        {currentlyCooking.length === 0 ? (
           <p className="text-sm text-gray-400 italic">Kitchen is empty.</p>
        ) : (
          <div className="space-y-3">
             {currentlyCooking.map(order => (
               <div key={order.id} className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex justify-between items-center group active:scale-[0.98] transition-transform cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-orange-200">
                     <img src={order.items?.[0]?.imageUrl || "https://images.unsplash.com/photo-1544025162-831e5088eb7e?w=200"} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h3 className="font-black text-orange-900">#{order.shortId}</h3>
                      <p className="text-xs text-orange-700 font-medium mt-0.5">Deliverer: {order.delivererName}</p>
                   </div>
                 </div>
                 <button 
                    onClick={() => {
                      setProcessingId(order.id);
                      updateOrderStatus(order.id, "VENDOR_READY_FOR_PICKUP")
                        .then(() => toast.success("Order moved to pickup shelf."))
                        .catch(() => toast.error("Failed to update status."))
                        .finally(() => setProcessingId(null));
                    }}
                    disabled={processingId === order.id}
                    className="bg-[#F26A1C] text-white font-bold px-4 py-2.5 rounded-xl text-sm active:scale-95 shadow-md disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                 >
                   {processingId === order.id ? <Loader2 size={16} className="animate-spin" /> : "Mark Ready"}
                 </button>
               </div>
             ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}