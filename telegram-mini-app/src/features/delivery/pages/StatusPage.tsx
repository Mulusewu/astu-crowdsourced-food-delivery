import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, Truck } from "lucide-react";

import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useOrderStore } from "@/store/orders/orderStore";

export default function StatusPage() {
  const navigate = useNavigate();
  const { delivererProfile } = useDeliveryDashboardStore();
  const { activeOrders } = useOrderStore();

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-5 pt-6">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] text-[#F26A1C]"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black text-gray-900">Driver Status</h1>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-[28px] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#F26A1C]" />
            <div>
              <p className="text-sm font-semibold text-gray-500">Availability</p>
              <p className="text-lg font-black text-gray-900">
                {delivererProfile?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <Truck className="text-[#F26A1C]" />
            <div>
              <p className="text-sm font-semibold text-gray-500">Active Deliveries</p>
              <p className="text-lg font-black text-gray-900">{activeOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <Clock3 className="text-[#F26A1C]" />
            <div>
              <p className="text-sm font-semibold text-gray-500">Response State</p>
              <p className="text-lg font-black text-gray-900">
                Ready for backend status sync
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
