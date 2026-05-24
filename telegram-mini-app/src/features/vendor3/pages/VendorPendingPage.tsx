import { useAuthStore } from "@/store/auth/authStore";
import { Clock, Store, LogOut } from "lucide-react";

export default function VendorPendingPage() {
  const { user, logout } = useAuthStore();

  const status = user?.vendorProfile?.verificationStatus || "PENDING";
  const hasRestaurant = !!user?.vendorProfile?.restaurantId;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200">
        {status === "REJECTED" ? (
          <Store size={40} className="text-red-500" />
        ) : (
          <Clock size={40} className="text-[#F26A1C]" />
        )}
      </div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2">
        {status === "REJECTED" ? "Application Rejected" : "Account Under Review"}
      </h2>
      
      <p className="text-gray-500 font-medium text-[15px] leading-relaxed max-w-sm mb-8">
        {status === "REJECTED" 
          ? "Your business application was declined by the administration. Please contact support."
          : !hasRestaurant && status === "APPROVED"
            ? "Your license is approved. Waiting for administration to link your restaurant dashboard."
            : "Your vendor account has been created. An administrator must verify your business license before you can access the dashboard."
        }
      </p>

      <div className="flex gap-4 w-full max-w-xs">
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 bg-[#F26A1C] text-white py-3.5 rounded-2xl font-bold shadow-md active:scale-95 transition-transform"
        >
          Refresh Status
        </button>
        <button 
          onClick={() => logout()}
          className="w-14 bg-white text-gray-400 border border-gray-200 py-3.5 rounded-2xl font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}