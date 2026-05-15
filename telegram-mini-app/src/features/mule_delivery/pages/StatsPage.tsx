import { ArrowLeft, BarChart3, Star, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";

export default function StatsPage() {
  const navigate = useNavigate();
  const { delivererProfile } = useDeliveryDashboardStore();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6 pb-28">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] dark:bg-orange-950/30 text-[#F26A1C] transition hover:bg-orange-200 dark:hover:bg-orange-900/50 active:scale-95"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Delivery Statistics</h1>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-[28px] bg-white dark:bg-gray-900 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-[#F26A1C]" />
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Deliveries Today</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {delivererProfile?.totalDeliveries ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[28px] bg-white dark:bg-gray-900 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
            <Star className="text-[#F26A1C]" />
            <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Rating</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{delivererProfile?.rating ?? 0}</p>
          </div>
          <div className="rounded-[28px] bg-white dark:bg-gray-900 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
            <Truck className="text-[#F26A1C]" />
            <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Shift Status</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              {delivererProfile?.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
