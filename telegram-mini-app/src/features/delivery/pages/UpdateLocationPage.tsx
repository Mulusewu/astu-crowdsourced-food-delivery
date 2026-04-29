import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LocateFixed, MapPin, Navigation } from "lucide-react";

import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";

export default function UpdateLocationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { delivererProfile } = useDeliveryDashboardStore();

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-5 pt-6">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] text-[#F26A1C]"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black text-gray-900">Update Location</h1>
      </div>

      <div className="mt-8 rounded-[28px] bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <LocateFixed className="text-[#F26A1C]" />
          <div>
            <p className="text-sm font-semibold text-gray-500">Current Position</p>
            <p className="text-lg font-black text-gray-900">
              {delivererProfile?.currentLocation || "Location not available"}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#FFF7F2] p-4">
          <div className="flex items-center gap-2 text-[#F26A1C]">
            <MapPin size={16} />
            <p className="text-sm font-bold">Delivery #{orderId || "..."}</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            This screen is ready to connect to device GPS or websocket location updates
            without changing the current delivery flow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#F26A1C] py-3.5 text-sm font-bold text-white"
        >
          <Navigation size={16} />
          Continue Delivery
        </button>
      </div>
    </div>
  );
}
