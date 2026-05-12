import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Sun,
  MapPin,
  Fingerprint,
  ArrowLeft,
  Camera,
  LogOut,
  Loader2
} from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

export default function VendorProfilePage() {
  const navigate = useNavigate();
  const { user, logout: authLogout, updateAvatar } = useAuthStore();
  const { vendor, fetchVendorData, isLoading, logout: vendorLogout, updateVendor } = useVendorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    vendorLogout();
    authLogout();
    navigate(ROUTES.AUTH);
  };

  useEffect(() => {
    if (user?.id) {
      fetchVendorData(user.id);
    }
  }, [fetchVendorData, user?.id]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file (JPG or PNG)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Update both local vendor store and global auth store for consistency
        updateAvatar(base64String);
        await updateVendor({ avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

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

    { icon: MapPin, label: "Bole Gate", path: "#" }, // Mocked area for now
    { icon: Fingerprint, label: `#${vendor.restaurantId || "V1234"}`, path: "#" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

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
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
            <img
              src={user?.avatar || vendor.avatar || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
              alt={vendor.businessName}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleCameraClick}
            disabled={isLoading}
            className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 active:scale-90 hover:scale-110 transition-all disabled:opacity-50"
          >
            <Camera className="w-5 h-5 text-orange-500" />
          </button>
        </div>
        <h2 className="mt-6 text-2xl font-black text-black tracking-tight">
          {vendor.businessName}
        </h2>
      </div>

      {/* Profile Card */}
      <div className="px-6 mt-10 mb-20">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-150">
          <div className="flex flex-col space-y-2">
            {profileItems.map((item, index) => (
              <div key={index} className="group">
                <div className="w-full flex items-center py-4 px-2">
                  <div className="flex items-center justify-center w-8 h-8 mr-4">
                    <item.icon className="w-6 h-6 text-gray-700 stroke-[1.5]" />
                  </div>
                  <span className="flex-1 text-left text-gray-600 font-bold text-base tracking-tight">
                    {item.label}
                  </span>
                </div>
                {index < profileItems.length - 1 && (
                  <div className="mx-2 h-[1.5px] bg-orange-100/50 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-4 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
