import { useAuthStore } from "@/store/auth/authStore";
import { canSwitchRoles } from "@/types/user.types";
import { RefreshCw, User, Truck, Clock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

export default function RoleSwitcher() {
  const { user, toggleActiveMode, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (!canSwitchRoles(user)) return null;

  // Derive the current state of their application
  const hasProfile = !!user?.delivererProfile;
  const isPending = user?.delivererProfile?.verificationStatus === "PENDING";
  const isRejected = user?.delivererProfile?.verificationStatus === "REJECTED";
  // const isApproved = user?.delivererProfile?.verificationStatus === "APPROVED";
  const isActive = user?.activeMode === "DELIVERER";

  const handleAction = async () => {
    if (isLoading) return;

    // 1. If they don't have a profile, or it was rejected, send to application page
    if (!hasProfile || isRejected) {
      navigate(ROUTES.CUSTOMER.APPLICATION); // Assuming you add this to routePaths.ts
      return;
    }

    // 2. If it's pending, do nothing (just waiting for Admin)
    if (isPending) return;

    // 3. If approved, toggle modes
    try {
      const targetMode = user?.activeMode === "CUSTOMER" ? "DELIVERER" : "CUSTOMER";
      await toggleActiveMode(targetMode);
      
      // Zustand + Router integration
      setTimeout(() => {
        if (targetMode === "DELIVERER") {
          navigate(ROUTES.DELIVERY.DASHBOARD, { replace: true });
        } else {
          navigate(ROUTES.CUSTOMER.HOME, { replace: true });
        }
      }, 100);
    } catch (error) {
      console.error("Failed to toggle mode:", error);
    }
  };

  const getButtonState = () => {
    if (isLoading) return <RefreshCw size={14} className="animate-spin" />;
    if (!hasProfile || isRejected) return "Apply Now";
    if (isPending) return "Under Review";
    if (isActive) return "Switch to Customer";
    return "Switch to Deliverer";
  };

  const getMessage = () => {
    if (!hasProfile) return "Apply to become a deliverer and start earning!";
    if (isPending) return "Your application is currently under admin review.";
    if (isRejected) return "Application rejected. Tap to re-apply or contact support.";
    if (isActive) return "You are currently in Delivery mode.";
    return "Switch to your deliverer profile to earn.";
  };

  return (
    <div className="mx-5 mt-6 mb-2">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isPending ? 'bg-yellow-100 text-yellow-600' :
              isRejected ? 'bg-red-100 text-red-600' :
              isActive ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {isPending ? <Clock size={20} /> : isRejected ? <ShieldCheck size={20} /> : isActive ? <Truck size={20} /> : <User size={20} />}
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">
                {hasProfile ? "Deliverer Partner" : "Deliverer Program"}
              </p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5 max-w-40 leading-tight">
                {getMessage()}
              </p>
            </div>
          </div>
          <button
            onClick={handleAction}
            disabled={isLoading || isPending}
            className={`flex items-center justify-center min-w-25 h-9 rounded-full text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none shadow-md ${
              isPending ? 'bg-yellow-500 text-white' :
              isRejected ? 'bg-red-500 text-white' :
              isActive ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-[#F26A1C] text-white shadow-orange-200'
            }`}
          >
            {getButtonState()}
          </button>
        </div>

        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              isPending ? 'bg-yellow-500 w-1/2' :
              isActive ? 'bg-[#F26A1C] w-full' : 'bg-blue-500 w-0'
            }`} 
          />
        </div>
      </div>
    </div>
  );
}