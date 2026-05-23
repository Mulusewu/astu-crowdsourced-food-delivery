import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings2, PackageOpen, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useVendorStore } from "@/store/vendorStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { availableOrders, stats, fetchVendorData, isLoading, error } = useVendorStore();

  useEffect(() => {
    if (fetchVendorData) {
      fetchVendorData();
    }
  }, [fetchVendorData]);

  // ─── Loading State (Adapted to fit Design A's Grid) ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-28 w-full max-w-md mx-auto px-5 pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-14 w-40 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-[14px]" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Error State (From B, styled to match the app) ───
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center w-full max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mb-4 border border-red-100 dark:border-red-900">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => navigate(ROUTES.AUTH)}
          className="bg-[#F26A1C] text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
        >
          Back to Login
        </button>
      </div>
    );
  }


  // Filter for 'Available' orders based on backend statuses from B
  // We already have this in the store's availableOrders
  
  // Dynamic user greeting
  const vendorFirstName = user?.fullName?.split(" ")[0] || "Vendor";
  const vendorInitial = vendorFirstName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-28 w-full max-w-md mx-auto relative">

      {/* ── Header ── */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Welcome Back,</h1>
          <h1 className="text-xl font-black text-[#F26A1C] leading-tight">{vendorFirstName}</h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-[#F26A1C] text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-white dark:border-gray-800">
          {vendorInitial}
        </div>
      </header>

      <main className="px-5 space-y-6 pt-2">
        {/* Stats Overview */}
        <section className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          <div className="bg-white dark:bg-gray-900 rounded-[22px] p-4 min-w-[140px] shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Today's Orders</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{stats.todayOrders}</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[22px] p-4 min-w-[140px] shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pending Tasks</p>
            <h3 className="text-xl font-black text-orange-500">{stats.pendingOrders}</h3>
          </div>
          <div className="bg-[#1A1A1A] dark:bg-white rounded-[22px] p-4 min-w-[160px] shadow-lg shrink-0">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Revenue</p>
            <h3 className="text-xl font-black text-[#F26A1C]">{stats.totalRevenue.toLocaleString()} ETB</h3>
          </div>
        </section>

        {/* Search Bar & Settings */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-white dark:bg-gray-900 rounded-[14px] px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800">
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search Orders.."
              className="bg-transparent border-none outline-none w-full text-[13px] font-semibold text-gray-700 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <button className="w-[50px] bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800 text-gray-500 active:scale-95 transition-transform shrink-0">
            <Settings2 size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button className="bg-[#F26A1C] text-white px-5 py-2 rounded-[10px] text-[12px] font-black uppercase tracking-wide shadow-sm active:scale-95 transition-transform">
            ALL
          </button>
          <button className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-[10px] text-[12px] font-bold border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-1 active:scale-95 transition-transform">
            Price <span className="text-[9px] mt-0.5">▼</span>
          </button>
        </div>

        {/* Order Grid */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-[14px] font-bold text-gray-500 uppercase tracking-wider">Available Orders</h2>
          {availableOrders.length > 0 && (
            <span className="bg-orange-100 dark:bg-orange-900/30 text-[#F26A1C] text-[10px] font-black px-2 py-0.5 rounded-full">
              {availableOrders.length} NEW
            </span>
          )}
        </div>

        {availableOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 opacity-70 animate-in fade-in">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <PackageOpen size={36} className="text-gray-400" />
            </div>
            <p className="font-bold text-gray-500 dark:text-gray-400 text-[15px]">No new orders right now.</p>
            <p className="text-[12px] font-medium text-gray-400 mt-1">Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 pt-6">
            {availableOrders.map((order) => {
              // Safely extract backend data using B's structure but formatting it for A's UI
              const itemImage = order.items?.[0]?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
              const totalItems = order.itemCount || order.items?.reduce((acc: number, item: any) => acc + item.qty, 0) || 1;
              const displayId = order.shortId ? order.shortId.split("-").pop() : order.id.slice(0, 4); // e.g. "AE-1024" -> "1024"

              return (
                <div key={order.id} className="relative pt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Overlapping Image */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85px] h-[85px] rounded-full border-[5px] border-gray-50 dark:border-gray-950 z-10 shadow-sm overflow-hidden bg-white">
                    <img src={itemImage} alt="Food item" className="w-full h-full object-cover" />
                  </div>

                  {/* Card Body */}
                  <div className="bg-white dark:bg-gray-900 rounded-[20px] p-4 pt-14 shadow-[0_8px_24px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center relative h-full justify-between">
                    <div className="absolute top-3 right-3 w-3 h-3 border-[2.5px] border-[#F26A1C] rounded-[4px]" />

                    <div>
                      <h3 className="font-black text-[15px] text-gray-900 dark:text-white mb-1">Order #{displayId}</h3>
                      <div className="flex flex-col items-center gap-0.5 mb-4">
                        <span className="text-[11px] font-bold text-[#F26A1C] flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md">
                          <PackageOpen size={12} /> {totalItems} Items
                        </span>
                        <span className="text-[14px] font-black text-[#F26A1C] mt-1">{order.totalAmount || 0} ETB</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(buildRoute(ROUTES.VENDOR.ORDERS.DETAILS, { orderId: order.id }))}
                      className="w-full py-2.5 bg-[#F26A1C] text-white font-black tracking-wide text-[12px] rounded-[12px] active:scale-95 transition-transform shadow-md"
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}