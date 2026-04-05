import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Bookmark,
  MapPin,
  FileText,
  Package,
  AlertCircle,
  Bike,
  Check,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth/authStore";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import {
  getRoleIcon,
  getRoleDisplayName,
  getAvailableRoles,
} from "@/types/user.types";
import BottomNav from "@/components/common/BottomNav1";

export default function DeliveryDashboard() {
  const navigate = useNavigate();

  // --- AUTH & MULTI-ROLE STORE ---
  const { user, activeRole, switchRole } = useAuthStore();
  const availableRoles = getAvailableRoles(user);
  const hasMultipleRoles = availableRoles.length > 1;
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Derive dynamic user details
  const firstName = user?.name?.split(" ")[0] || "Guest";
  const initial = user?.name?.[0] || "U";

  // --- DELIVERY DASHBOARD STORE ---
  const {
    restaurantsWithOrders,
    pocketFriendlyOrders,
    isLoading,
    isOnline,
    fetchDashboardData,
    toggleAvailability,
  } = useDeliveryDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRoleSwitch = (role: any) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  // --- OFFLINE STATE VIEW ---
  if (!isLoading && !isOnline) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-6 relative pb-20 font-sans transition-colors">
        {/* Multi-role Switcher (Top Right, even when offline) */}
        {hasMultipleRoles && (
          <div className="absolute top-6 right-5">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-[42px] h-[42px] rounded-full bg-[#F26A1C] flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white dark:border-gray-900 active:scale-95 transition-transform"
            >
              {initial}
            </button>
            {showRoleMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800/50 mb-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Profile
                    </p>
                  </div>
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span
                        className={
                          activeRole === role
                            ? "text-[#F26A1C]"
                            : "text-gray-500"
                        }
                      >
                        {getRoleIcon(role)}
                      </span>
                      <span
                        className={`font-medium ${activeRole === role ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {getRoleDisplayName(role)}
                      </span>
                      {activeRole === role && (
                        <Check size={16} className="ml-auto text-[#F26A1C]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Logo Placeholder */}
        <div className="absolute top-16 flex items-center justify-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              ASTU
            </span>
            <span className="text-2xl font-black text-[#F26A1C] tracking-tighter leading-none">
              EATS
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Bike size={32} className="text-[#F26A1C]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-[#F26A1C] italic mt-0.5">
              Delivery
            </span>
          </div>
        </div>

        <h1 className="text-[28px] font-black text-gray-900 dark:text-white mb-8 text-center mt-20">
          You're Offline
        </h1>

        {/* Warning Box */}
        <div className="flex items-center gap-3 bg-transparent mb-12 max-w-[250px]">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
            <AlertCircle size={24} className="text-white" fill="#FACC15" />
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
            Go Online To Start Receiving Orders
          </p>
        </div>

        {/* Custom Offline Toggle Button */}
        <button
          onClick={toggleAvailability}
          className="relative w-40 h-[52px] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-full flex items-center px-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 bg-gray-500 dark:bg-gray-400 rounded-full shadow-sm" />
          <span className="absolute w-full text-center pr-6 text-gray-600 dark:text-gray-300 font-bold text-[17px]">
            Offline
          </span>
        </button>
      </div>
    );
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6 space-y-6">
        <Skeleton className="h-14 w-48 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-12 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-40 w-full rounded-3xl bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-64 w-full rounded-3xl bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  // --- ONLINE STATE VIEW ---
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-28 transition-colors">
      {/* HEADER */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-[#F26A1C] font-bold text-lg leading-tight">
              Welcome Back,
            </h1>
            <h2 className="text-gray-900 dark:text-white font-black text-3xl capitalize">
              {firstName}
            </h2>
          </div>

          {/* Avatar Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => hasMultipleRoles && setShowRoleMenu(!showRoleMenu)}
              className="w-[42px] h-[42px] rounded-full bg-[#F26A1C] flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white dark:border-gray-900 active:scale-95 transition-transform"
            >
              {initial}
            </button>

            {showRoleMenu && hasMultipleRoles && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800/50 mb-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Profile
                    </p>
                  </div>
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span
                        className={
                          activeRole === role
                            ? "text-[#F26A1C]"
                            : "text-gray-500"
                        }
                      >
                        {getRoleIcon(role)}
                      </span>
                      <span
                        className={`font-medium ${activeRole === role ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {getRoleDisplayName(role)}
                      </span>
                      {activeRole === role && (
                        <Check size={16} className="ml-auto text-[#F26A1C]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-full px-4 py-3 shadow-sm mb-5">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent border-none outline-none px-3 text-[15px] font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <SlidersHorizontal size={20} className="text-gray-400 shrink-0" />
        </div>

        {/* FILTER & ONLINE TOGGLE ROW */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="bg-[#F26A1C] text-white font-black text-[13px] px-6 py-2 rounded-full shadow-md active:scale-95 transition-transform">
              ALL
            </button>
            <button className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-bold text-[13px] px-4 py-2 rounded-full flex items-center gap-1 active:scale-95 transition-transform">
              Location <ChevronDown size={14} className="stroke-[3]" />
            </button>
          </div>

          {/* Custom Online Toggle */}
          <div
            className="flex items-center border border-[#F26A1C] rounded-full px-1.5 py-1 cursor-pointer active:scale-95 transition-transform bg-orange-50/50 dark:bg-orange-900/20"
            onClick={toggleAvailability}
          >
            <span className="text-[#F26A1C] font-bold text-[12px] px-2">
              Online
            </span>
            <div className="w-5 h-5 bg-[#F26A1C] rounded-full shadow-sm" />
          </div>
        </div>
      </header>

      <main className="px-5 mt-2">
        {/* POCKET FRIENDLY ORDERS */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-8">
            Pocket Friendly Orders
          </h3>

          {pocketFriendlyOrders.length === 0 ? (
            <p className="text-sm text-gray-500 font-medium">
              No orders available right now.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {pocketFriendlyOrders.map((order) => (
                <div
                  key={order.id}
                  className="relative w-[130px] shrink-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col items-center pt-10 pb-4 px-3 mt-4"
                >
                  <img
                    src={
                      order.image ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"
                    }
                    alt="Food"
                    className="absolute -top-6 w-[70px] h-[70px] rounded-full object-cover border-[4px] border-white dark:border-gray-900 shadow-sm"
                  />
                  <h4 className="font-black text-gray-900 dark:text-white text-[13px] mb-1 text-center mt-1">
                    Order {order.orderNumber || `#${order.id.slice(-3)}`}
                  </h4>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Package
                      size={12}
                      className="text-[#F26A1C]"
                      strokeWidth={3}
                    />
                    <span className="font-bold text-[#F26A1C] text-[11px]">
                      {order.items?.length || 0} Items
                    </span>
                  </div>
                  <p className="font-black text-[#F26A1C] text-[12px] mb-3">
                    {order.totalAmount} ETB
                  </p>
                  <button
                    onClick={() => navigate(`/delivery/available/${order.id}`)}
                    className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[10px] w-full py-2 rounded-full shadow-md transition-colors active:scale-95"
                  >
                    View Detail
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESTAURANTS WITH ACTIVE ORDERS */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-4">
            Restaurants With Active Orders
          </h3>
          <div className="space-y-5">
            {restaurantsWithOrders.length === 0 ? (
              <p className="text-sm text-gray-500 font-medium">
                No restaurants have active orders.
              </p>
            ) : (
              restaurantsWithOrders.map((cafe) => (
                <div
                  key={cafe.id}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative h-[150px] w-full">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-0 right-4 bg-[#F26A1C] w-10 h-12 rounded-b-[16px] flex items-center justify-center shadow-lg">
                      <Bookmark size={20} fill="white" className="text-white" />
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-[17px] mb-1">
                        {cafe.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mb-1 text-gray-600 dark:text-gray-400">
                        <FileText
                          size={13}
                          className="text-[#F26A1C]"
                          strokeWidth={2.5}
                        />
                        <span className="font-bold text-[12px]">
                          {cafe.orderCount} Orders
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin
                          size={13}
                          className="text-[#F26A1C]"
                          strokeWidth={2.5}
                        />
                        <span className="font-semibold text-[11px]">
                          {cafe.location} , {cafe.distance}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/delivery/available?cafe=${cafe.id}`)
                      }
                      className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[13px] px-5 py-2.5 rounded-[14px] shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      View Orders
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav activeTab="home" />
    </div>
  );
}
