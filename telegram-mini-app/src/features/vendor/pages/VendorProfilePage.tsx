import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Sun, 
  MapPin, 
  Fingerprint, 
  ChevronRight, 
  ArrowLeft,
  Camera,
  LogOut
} from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { ROUTES } from "@/routes/routePaths";

export default function VendorProfilePage() {
  const navigate = useNavigate();
  const { vendor, fetchVendorData, isLoading, logout } = useVendorStore();

  useEffect(() => {
    if (!vendor && !isLoading) {
      fetchVendorData();
    }
  }, [fetchVendorData, vendor, isLoading]);

  if (isLoading || !vendor) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const profileItems = [
    { icon: User, label: vendor.businessName, path: "#" },
    { icon: Phone, label: vendor.phone, path: "#" },
    { icon: Sun, label: "Theme", path: "#" },
    { icon: MapPin, label: "Bole Gate", path: "#" }, // Mocked area for now
    { icon: Fingerprint, label: `#${vendor.restaurantId || "V1234"}`, path: "#" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-2xl font-black text-black tracking-tight">Profile</h1>
        </div>
      </div>

      {/* Profile Header (Avatar & Name) */}
      <div className="flex flex-col items-center mt-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img 
              src={vendor.avatar || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"} 
              alt={vendor.businessName} 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 active:scale-95 transition-all">
            <Camera className="w-5 h-5 text-orange-500" />
          </button>
        </div>
        <h2 className="mt-6 text-2xl font-black text-black tracking-tight">
          {vendor.businessName}
        </h2>
      </div>

      {/* Profile Card */}
      <div className="px-6 mt-10 mb-20">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex flex-col space-y-2">
            {profileItems.map((item, index) => (
              <div key={index} className="group">
                <button className="w-full flex items-center py-4 px-2 hover:bg-gray-50 rounded-2xl transition-all">
                  <div className="flex items-center justify-center w-8 h-8 mr-4">
                    <item.icon className="w-6 h-6 text-gray-700 stroke-[1.5]" />
                  </div>
                  <span className="flex-1 text-left text-gray-400 font-bold text-base tracking-tight">
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
                {index < profileItems.length - 1 && (
                  <div className="mx-2 h-[1.5px] bg-orange-100/50 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-4 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
