import React, { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/common/BottomNav";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Fingerprint,
  ArrowLeft,
  Camera,
  LogOut,
  Loader2,
  Bookmark,
  Wallet,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

const MENU_ITEMS = [
  // {
  //   icon: Bookmark,
  //   label: "Saved for Later",
  //   path: ROUTES.VENDOR.SAVED,
  //   color: "text-blue-500",
  //   bg: "bg-blue-50",
  // },
  {
    icon: Wallet,
    label: "Earnings & Transactions",
    path: ROUTES.VENDOR.EARNINGS,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: AlertCircle,
    label: "Report an Issue",
    path: ROUTES.VENDOR.PROFILE.REPORT_ISSUE,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function VendorProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPG or PNG)");
        return;
      }

      setIsUpdating(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await updateProfile({ avatarUrl: base64String });
        } catch (err) {
          console.error("Failed to update avatar", err);
        } finally {
          setIsUpdating(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const vendorName = user?.fullName || "Vendor Business";
  const vendorPhone = user?.phoneNumber || "N/A";
  const vendorRestaurantId = user?.vendorProfile?.restaurantId || "V1234";
  const avatarUrl = user?.avatarUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";

  const profileItems = [
    { icon: User, label: vendorName, path: "#" },
    { icon: Phone, label: vendorPhone, path: "#" },
    { icon: MapPin, label: "Bole Gate", path: "#" },
    {
      icon: Fingerprint,
      label: `#${vendorRestaurantId}`,
      path: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden pb-10">
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
          <h1 className="text-2xl font-black text-black tracking-tight">
            Profile
          </h1>
        </div>
      </div>

      {/* Profile Header (Avatar & Name) */}
      <div className="flex flex-col items-center mt-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
            <img
              src={avatarUrl}
              alt={vendorName}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isUpdating ? "opacity-50" : "opacity-100"}`}
            />
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleCameraClick}
            disabled={isUpdating}
            className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 active:scale-90 hover:scale-110 transition-all disabled:opacity-50"
          >
            <Camera className="w-5 h-5 text-orange-500" />
          </button>
        </div>
        <h2 className="mt-6 text-2xl font-black text-black tracking-tight text-center px-4">
          {vendorName}
        </h2>
      </div>

      {/* Profile Details Card */}
      <div className="px-6 mt-10">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
            Account Details
          </h3>
          <button
            onClick={() => navigate(ROUTES.VENDOR.PROFILE.EDIT_PROFILE)}
            className="text-[11px] font-black text-orange-500 uppercase tracking-[1px] hover:text-orange-600 transition-colors bg-orange-50 px-3 py-1.5 rounded-full active:scale-95"
          >
            Edit
          </button>
        </div>
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-150">
          <div className="flex flex-col space-y-2">
            {profileItems.map((item, index) => (
              <div key={index} className="group">
                <div className="w-full flex items-center py-4 px-2">
                  <div className="flex items-center justify-center w-8 h-8 mr-4">
                    <item.icon className="w-6 h-6 text-gray-700 stroke-[1.5]" />
                  </div>
                  <span className="flex-1 text-left text-gray-600 font-bold text-base tracking-tight truncate">
                    {item.label}
                  </span>
                </div>
                {index < profileItems.length - 1 && (
                  <div className="mx-2 h-[1px] bg-orange-100/30 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Management Section */}
        <h3 className="mt-8 mb-4 px-2 text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
          Management
        </h3>
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-150">
          <div className="flex flex-col space-y-2">
            {MENU_ITEMS.map((item, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center py-4 px-2 hover:bg-gray-50 rounded-2xl transition-all"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 mr-4 rounded-xl ${item.bg}`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.color} stroke-[2.5]`}
                    />
                  </div>
                  <span className="flex-1 text-left text-gray-900 font-black text-base tracking-tight">
                    {item.label}
                  </span>
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </button>
                {index < MENU_ITEMS.length - 1 && (
                  <div className="mx-2 h-[1px] bg-gray-100 rounded-full my-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-5 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 rounded-[28px] transition-all border-2 border-red-50"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
