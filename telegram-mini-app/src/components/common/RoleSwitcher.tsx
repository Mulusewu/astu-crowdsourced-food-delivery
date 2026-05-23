import { useAuthStore } from "@/store/auth/authStore";
import { canSwitchRoles } from "@/types/user.types";
import { RefreshCw, User, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

export default function RoleSwitcher() {
  const { user, toggleActiveMode, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (!canSwitchRoles(user)) return null;

  const handleToggle = async () => {
    if (isLoading) return;

    // Determine the target mode based on current mode
    const targetMode = user?.activeMode === "CUSTOMER" ? "DELIVERER" : "CUSTOMER";
    
    try {
      // Perform the role switch in the backend/store
      await toggleActiveMode(targetMode);
      
      // We add a tiny micro-delay to allow Zustand's persistence and React context 
      // to fully synchronize before we trigger the top-level route change.
      await new Promise(r => setTimeout(r, 100));

      // Redirect to the appropriate dashboard
      if (targetMode === "DELIVERER") {
        navigate(ROUTES.DELIVERY.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.CUSTOMER.HOME, { replace: true });
      }
    } catch (error) {
      console.error("Failed to toggle mode:", error);
    }
  };

  const isActive = user?.activeMode === "DELIVERER";

  return (
    <div className="mx-5 mt-6 mb-2">
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
              {isActive ? <Truck size={20} /> : <User size={20} />}
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">
                {isActive ? "Deliverer Mode" : "Customer Mode"}
              </p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                Switch to your {isActive ? "customer" : "delivery"} profile
              </p>
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 disabled:opacity-50 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-orange-600 text-white shadow-lg shadow-orange-200'
            }`}
          >
            {isLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            {isActive ? "Switch to Customer" : "Switch to Deliverer"}
          </button>
        </div>

        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${isActive ? 'bg-orange-500 w-full' : 'bg-blue-500 w-0'}`} 
          />
        </div>
      </div>
    </div>
  );
}
