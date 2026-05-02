import { useEffect } from "react";
import { useVendorStore } from "@/store/vendorStore";
import { User, Store, LogOut, Clock, Building2, ChevronRight } from "lucide-react";
import BottomNav from "@/components/common/BottomNav";

export default function SettingsPage() {
  const { vendor, fetchVendorData, isLoading, logout } = useVendorStore();

  useEffect(() => {
    if (!vendor && !isLoading) {
      fetchVendorData();
    }
  }, [fetchVendorData, vendor, isLoading]);

  if (isLoading || !vendor) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Profile Card */}
      <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <img 
          src={vendor.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Vendor"} 
          alt={vendor.name} 
          className="h-16 w-16 rounded-full object-cover bg-gray-100" 
        />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{vendor.name}</h2>
          <p className="text-sm text-gray-500">{vendor.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              Vendor Profile
            </span>
            {vendor.isVerified && (
              <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="flex flex-col gap-4">
        {/* Business Settings */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 bg-gray-50 px-4 py-3 border-b border-gray-100">Business Management</h3>
          <div className="divide-y divide-gray-100 flex flex-col">
            <button className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors w-full text-left">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Store className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Restaurant Details</p>
                <p className="text-xs text-gray-500">{vendor.businessName}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors w-full text-left">
              <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Operating Hours</p>
                <p className="text-xs text-gray-500">Configure availability times</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <button className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors w-full text-left">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Payment Information</p>
                <p className="text-xs text-gray-500">{vendor.paymentInfo.bankName} • ****{vendor.paymentInfo.accountNumber.slice(-4)}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 bg-gray-50 px-4 py-3 border-b border-gray-100">Account</h3>
          <div className="divide-y divide-gray-100 flex flex-col">
            <button className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors w-full text-left">
              <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Personal Information</p>
                <p className="text-xs text-gray-500">Update phone, email, password</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors w-full text-left text-red-600 mt-2"
            >
              <LogOut className="h-5 w-5 ml-2" />
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}

