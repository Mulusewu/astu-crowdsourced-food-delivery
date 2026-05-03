import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LocateFixed, MapPin, Navigation, Loader2, CheckCircle2 } from "lucide-react";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";

export default function UpdateLocationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { delivererProfile, updateCurrentLocation, isLoading } = useDeliveryDashboardStore();
  const [newLocation, setNewLocation] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!newLocation.trim()) return;
    await updateCurrentLocation(newLocation.trim());
    setIsSuccess(true);
    setNewLocation("");
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleQuickUpdate = async (loc: string) => {
    await updateCurrentLocation(loc);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pt-6 font-sans">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.TRACK, { orderId }))}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEFE5] dark:bg-orange-950/30 text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Update Location</h1>
      </div>

      <div className="mt-8 space-y-6">
        {/* Current Position Card */}
        <section className="rounded-[28px] bg-white dark:bg-gray-900 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center">
              <LocateFixed className="text-[#F26A1C]" size={24} />
            </div>
            <div>
              <p className="text-[13px] font-black uppercase tracking-wider text-gray-400">Current Position</p>
              <p className="text-lg font-black text-gray-900 dark:text-white leading-tight mt-0.5">
                {delivererProfile?.currentLocation || "Location not available"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#FFF7F2] dark:bg-orange-950/10 p-4 border border-orange-100/50 dark:border-orange-900/20">
            <div className="flex items-center gap-2 text-[#F26A1C]">
              <MapPin size={16} strokeWidth={2.5} />
              <p className="text-sm font-black">Active Delivery Tracking</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
              Updating your location helps customers see your real-time progress and provides more accurate ETAs.
            </p>
          </div>
        </section>

        {/* Update Form */}
        <section className="rounded-[28px] bg-white dark:bg-gray-900 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-black text-gray-900 dark:text-white mb-4">Manual GPS Override</h2>
          
          <div className="space-y-4">
            <input
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter new location (e.g. Block 502)"
              className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4 text-[15px] font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#F26A1C]/20 focus:border-[#F26A1C] transition-all placeholder:text-gray-400"
            />
            
            <button
              onClick={handleUpdate}
              disabled={isLoading || !newLocation.trim()}
              className="w-full h-14 rounded-full bg-[#F26A1C] text-white font-black text-base shadow-[0_8px_24px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  Updated
                </>
              ) : (
                "Update Position"
              )}
            </button>
          </div>

          <div className="mt-8">
            <p className="text-[12px] font-black uppercase tracking-wider text-gray-400 mb-3 px-1">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {["Male Dorm", "Female Dorm", "Library", "Stadium", "Gate 1"].map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleQuickUpdate(loc)}
                  className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 active:scale-95 transition-all"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
          className="w-full h-14 flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-black active:scale-[0.98] transition-all"
        >
          <Navigation size={18} strokeWidth={2.5} />
          View Active Map
        </button>
      </div>
    </div>
  );
}
