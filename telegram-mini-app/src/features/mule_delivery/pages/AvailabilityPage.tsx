import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ToggleRight } from "lucide-react";

import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const { delivererProfile, toggleActiveStatus } = useDeliveryDashboardStore();
  const isAvailable = delivererProfile?.isAvailable ?? false;

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
        <h1 className="text-xl font-black text-gray-900">Availability</h1>
      </div>

      <div className="mt-8 rounded-[28px] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <ToggleRight className="text-[#F26A1C]" />
          <div>
            <p className="text-sm font-semibold text-gray-500">Current State</p>
            <p className="text-lg font-black text-gray-900">
              {isAvailable ? "Available for orders" : "Offline"}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#FFF7F2] p-4">
          <div className="flex items-center gap-2 text-[#F26A1C]">
            <MapPin size={16} />
            <p className="text-sm font-bold">Location aware delivery mode</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            When backend presence is added, this screen can reflect shift status,
            service area, and live location permissions without restructuring the
            delivery feature.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toggleActiveStatus()}
          className="mt-5 w-full rounded-full bg-[#F26A1C] py-3.5 text-sm font-bold text-white"
        >
          {isAvailable ? "Go Offline" : "Go Online"}
        </button>
      </div>
    </div>
  );
}
