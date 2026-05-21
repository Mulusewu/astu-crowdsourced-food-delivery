import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useVendorStore, type VendorOrder } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  DollarSign,
  Star,
  Clock,
  Package, 
  TrendingUp,
  Mail
} from "lucide-react";

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const { vendor, isActive, activeOrders, isLoading, fetchVendorData, toggleActiveStatus } = useVendorStore();

  useEffect(() => {
    // Fetch data for the currently authenticated vendor
    if (user?.id && !vendor) {
      fetchVendorData(user.id);
    }
  }, [fetchVendorData, user?.id, vendor]);

  if (isLoading || !vendor) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto w-full min-h-screen bg-white animate-in fade-in duration-500">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-32 w-full rounded-[32px] mt-4" />
        <div className="space-y-4 mt-6">
          <Skeleton className="h-6 w-36" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64 w-full rounded-[32px]" />
            <Skeleton className="h-64 w-full rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  // Derived stats
  const newOrders = activeOrders.filter((o: VendorOrder) => o.status === "new");

  return (
    <div className="flex flex-col gap-6 p-6 pb-28 max-w-lg mx-auto w-full bg-white min-h-screen animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight">
            <span className="text-primary block">Welcome Back,</span>
            <span className="text-black">{vendor.name.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="group relative">
          <div
            className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            {user?.avatar || vendor.avatar ? (
              <img 
                src={user?.avatar || vendor.avatar} 
                alt={vendor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              vendor.name.charAt(0)
            )}
          </div>
          {/* Premium Tooltip for email - Standard hover behavior */}
          <div className="absolute top-14 right-0 bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap z-50 shadow-2xl pointer-events-none flex items-center gap-2 border border-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <Mail className="w-3 h-3 text-primary/80" />
            {vendor.email}
          </div>
        </div>
      </div>

      {/* Store Status Toggle & Summary Stats */}
      <div className="flex flex-col gap-4 bg-primary/5 p-5 rounded-[32px] border border-primary/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-lg font-black ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {isActive ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          </div>
          <button
            onClick={toggleActiveStatus}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isActive ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${isActive ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-primary/20">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Revenue</span>
            <span className="text-sm font-black text-gray-900">{vendor.stats.totalRevenue.toLocaleString()} ETB</span>
          </div>
          <div className="flex flex-col border-x border-primary/20 px-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Orders</span>
            <span className="text-sm font-black text-gray-900">{vendor.stats.totalOrders}</span>
          </div>
          <div className="flex flex-col pl-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-sm font-black text-gray-900">{vendor.stats.averageRating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-800">Available Orders</h2>

        {/* Orders Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-16 mt-8">
          {newOrders.map((order: VendorOrder) => (
            <div key={order.id} className="relative flex flex-col items-center bg-white rounded-[32px] pt-14 pb-5 px-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
              {/* Circular Food Image - Popping out of the card */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden z-10 transition-transform group-hover:scale-110 duration-500">
                <img
                  src={order.image}
                  alt={`Order ${order.orderNo}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Indicator Badge */}
              <div className="absolute right-4 top-4 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 z-20">
                <span className="text-[8px] font-black text-primary uppercase tracking-tighter">{order.status}</span>
              </div>

              {/* Order Info */}
              <div className="flex flex-col items-center text-center gap-0.5 mt-2">
                <h3 className="font-black text-gray-900 text-lg tracking-tight">Order #{order.orderNo}</h3>
                <div className="flex flex-col items-center leading-tight">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{order.timeElapsed} Min Ago</span>
                  </div>
                  <div className="mt-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 flex items-center gap-2">
                    <span className="text-primary text-[11px] font-black">{order.items} Items</span>
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    <span className="text-primary/90 text-[11px] font-black">{order.totalAmount} ETB</span>
                  </div>
                </div>
              </div>

              {/* View Detail Button */}
              <Link
                to={`/vendor/order/${order.id}`}
                className="mt-5 w-full bg-primary text-white text-xs font-black py-3 rounded-2xl shadow-[0_10px_20px_rgba(242,106,28,0.2)] hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
              >
                View Detail
              </Link>
            </div>
          ))}
        </div>
      </div>

      {newOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No new orders available.</p>
        </div>
      )}
    </div>
  );
}
