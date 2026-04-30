import { useEffect } from "react";
import { MapPin, Star, Store, Package } from "lucide-react";
import { useVendorStore } from "@/store/vendor/vendorStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboard() {
  const { stats, isLoading, error, fetchDashboardStats } = useVendorStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-5 pt-6 font-sans">
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="mt-4 h-6 w-64 rounded-lg" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-white px-5 pt-10 font-sans">
        <p className="text-sm font-bold text-gray-900">Vendor Dashboard</p>
        <p className="mt-2 text-sm text-gray-500">
          {error || "Failed to load vendor stats."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-5 pt-6 pb-28 font-sans text-gray-900">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[#F26A1C]">
          <Store size={20} strokeWidth={2.5} />
          <h1 className="text-[22px] font-black">Vendor Dashboard</h1>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[18px] font-black">{stats.restaurantName}</p>
            <div className="mt-1 flex items-center gap-1 text-gray-500">
              <MapPin size={14} className="text-[#F26A1C]" />
              <span className="truncate text-[12px] font-semibold">
                {stats.location}
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
              stats.isOpen
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {stats.isOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-gray-500">Active Orders</p>
            <Package size={18} className="text-[#F26A1C]" />
          </div>
          <p className="mt-2 text-[26px] font-black text-gray-900">
            {stats.activeOrdersCount}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-gray-500">
            Awaiting: {stats.awaitingAcceptCount} • Preparing: {stats.preparingCount}
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-gray-500">Menu Items</p>
            <span className="text-[#F26A1C] text-[12px] font-black">ETB</span>
          </div>
          <p className="mt-2 text-[26px] font-black text-gray-900">
            {stats.menuItemsCount}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-gray-500">
            Ready for pickup: {stats.readyForPickupCount}
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-gray-500">Rating</p>
            <Star size={18} className="fill-[#F26A1C] text-[#F26A1C]" />
          </div>
          <p className="mt-2 text-[26px] font-black text-gray-900">
            {stats.avgRating.toFixed(1)}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-gray-500">
            {stats.totalReviews} reviews
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-gray-500">Completed Today</p>
            <span className="text-[#F26A1C] text-[12px] font-black">TODAY</span>
          </div>
          <p className="mt-2 text-[26px] font-black text-gray-900">
            {stats.completedTodayCount}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-gray-500">
            Revenue total (platform): {stats.revenueTotal.toFixed(0)} ETB
          </p>
        </div>
      </section>
    </div>
  );
}
