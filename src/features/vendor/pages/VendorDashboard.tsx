import { useEffect } from "react";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Star,
  ChevronRight,
  Plus,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useVendorStore } from "@/store/vendorStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { stats, recentOrders, fetchVendorData, isLoading, error } = useVendorStore();

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const statConfig = [
    { label: "Today's Orders", value: stats.todayOrders.toString(), icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Pending", value: stats.pendingOrders.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Completed", value: stats.completedOrders.toString(), icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Revenue", value: `${stats.totalRevenue.toLocaleString()} ETB`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 p-5 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => navigate(ROUTES.AUTH)}
          className="bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-10">
      {/* ─── Top Header ─── */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/80 dark:bg-gray-950/80 backdrop-blur-md z-20">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {user?.fullName?.split(" ")[0] || "Vendor"}
          </h1>
        </div>
        <button 
          onClick={() => navigate(ROUTES.VENDOR.MENU.ADD)}
          className="w-12 h-12 bg-[#F26A1C] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <main className="px-5 mt-6">
        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 gap-4">
          {statConfig.map((stat, idx) => (
            <div 
              key={stat.label} 
              onClick={() => idx === 3 && navigate(ROUTES.VENDOR.EARNINGS)}
              className={cn(
                "bg-white dark:bg-gray-900 p-5 rounded-[28px] shadow-sm border border-gray-50 dark:border-gray-800 transition-all active:scale-95",
                idx === 3 && "cursor-pointer hover:border-[#F26A1C]/30"
              )}
            >
              <div className={`w-10 h-10 ${stat.bg} dark:bg-gray-800 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* ─── Quick Actions ─── */}
        <div className="mt-8 flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Recent Orders</h2>
          <button 
            onClick={() => navigate(ROUTES.VENDOR.ORDERS.LIST)}
            className="text-[11px] font-bold text-[#F26A1C] uppercase tracking-wider flex items-center gap-1"
          >
            See All <ChevronRight size={14} />
          </button>
        </div>

        {/* ─── Orders List ─── */}
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-10 rounded-[32px] text-center border border-dashed border-gray-200 dark:border-gray-800">
              <ShoppingBag className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-sm font-bold text-gray-400">No recent orders yet.</p>
            </div>
          ) : recentOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-900 p-4 rounded-[24px] shadow-sm border border-gray-50 dark:border-gray-800 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer" onClick={() => navigate(ROUTES.VENDOR.ORDERS.LIST)}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs",
                  ["CREATED", "AWAITING_ACCEPT"].includes(order.status) ? "bg-orange-50 text-orange-500" :
                  ["ASSIGNED", "VENDOR_BEING_PREPARED"].includes(order.status) ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
                )}>
                  {order.shortId.split("-")[1]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">{order.customerName}</h4>
                  <p className="text-[11px] font-medium text-gray-500">{order.itemCount} items · {order.totalAmount} ETB</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-wider mb-1",
                   ["CREATED", "AWAITING_ACCEPT"].includes(order.status) ? "text-orange-500" :
                   ["ASSIGNED", "VENDOR_BEING_PREPARED"].includes(order.status) ? "text-blue-500" : "text-green-500"
                )}>{order.status.replace("_", " ")}</p>
                <p className="text-[10px] font-medium text-gray-400">{order.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Store Performance ─── */}
        <div className="mt-8 bg-gray-900 dark:bg-white rounded-[32px] p-6 text-white dark:text-gray-900 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-1">Store Performance</h3>
            <p className="text-xs font-medium text-gray-400 mb-6">Real-time insights for your business growth.</p>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star size={14} className="fill-current" />
                  <span className="text-lg font-black">4.8</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rating</p>
              </div>
              <div className="w-px h-8 bg-gray-800 dark:bg-gray-200 mt-1" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-blue-400">
                  <Users size={14} />
                  <span className="text-lg font-black">120</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Followers</p>
              </div>
            </div>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#F26A1C] rounded-full opacity-20 blur-2xl" />
        </div>
      </main>
    </div>
  );
}
