import { useState } from "react";
import { MapPin, Bug } from "lucide-react";
import { useDeliveryDashboardStore } from "@/store/delivery/deliveryDashboardStore";
import { toast } from "sonner";

// Coordinates for ASTU Landmarks
const DEMO_LOCATIONS = [
  { name: "Block 40 (Near Lounge)", lat: 8.561, lng: 39.290 },
  { name: "Gate 2 (Juice Bar)", lat: 8.568, lng: 39.295 },
  { name: "Block 45 (Traditional)", lat: 8.565, lng: 39.288 },
  { name: "Addis Ababa (100km away)", lat: 9.032, lng: 38.748 }, // To test rejection
];

export default function DevLocationSpoofer() {
  const { isSpoofing, spoofedCoords, setSpoofedLocation } = useDeliveryDashboardStore();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-5 shadow-sm border-2 border-dashed border-indigo-200 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Bug size={18} className="text-indigo-500" />
        <h3 className="font-bold text-indigo-900 dark:text-indigo-400">Presentation Overrides</h3>
      </div>
      
      <p className="text-xs text-gray-500 mb-4">
        Overrides hardware GPS for presentation algorithms.
      </p>

      <div className="space-y-3">
        {DEMO_LOCATIONS.map((loc) => {
          const isActive = isSpoofing && spoofedCoords?.lat === loc.lat;
          return (
            <button
              key={loc.name}
              onClick={() => {
                setSpoofedLocation(true, { lat: loc.lat, lng: loc.lng });
                toast.success(`GPS Spoofed to: ${loc.name}`);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive 
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-sm font-bold">{loc.name}</span>
              </div>
              {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
            </button>
          );
        })}

        <button
          onClick={() => {
            setSpoofedLocation(false);
            toast.info("Hardware GPS restored.");
          }}
          className={`w-full py-3 rounded-xl border text-sm font-bold mt-2 ${
            !isSpoofing ? "bg-green-50 border-green-500 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"
          }`}
        >
          Use Real Hardware GPS
        </button>
      </div>
    </div>
  );
}