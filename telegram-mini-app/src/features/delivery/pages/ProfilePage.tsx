import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Lock,
  Camera,
  Mail,
  Phone,
  Sun,
  Moon,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useThemeStore } from "@/store/ui/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ROUTES } from "@/routes/routePaths";

import { Header, ActionButton } from "@/features/shared/components/ProfileShared";


export default function ProfileMain() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  const profileActions = [
    {
      label: "Password",
      value: "Secure access",
      icon: Lock,
      onClick: () => navigate(ROUTES.DELIVERY.PASSWORD),
    },
    {
      label: "Theme",
      value: mode,
      icon: mode === "dark" ? Moon : Sun,
      onClick: toggleTheme,
    },
    {
      label: "Payment Method",
      value: "Manage payouts",
      icon: ClipboardList,
      onClick: () => navigate(ROUTES.DELIVERY.PAYMENT),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header
        title="Profile"
        showBack

        onBackClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}

      />

      <div className="flex flex-col items-center mt-6 mb-2 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F26A1C] rounded-full scale-105" />
          <Avatar className="relative w-28 h-28 border-[4px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage
              src={
                user?.avatarUrl ||
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&fit=crop"
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-[#F26A1C] text-white text-3xl font-bold">
              {user?.fullName?.[0] || "N"}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 active:scale-95 transition-transform">
            <div className="w-6 h-6 rounded-full border border-[#F26A1C] flex items-center justify-center text-[#F26A1C]">
              <Camera size={12} strokeWidth={3} />
            </div>
          </button>
        </div>
        <h2 className="text-[22px] font-black text-gray-900 dark:text-white mt-4">
          {user?.fullName || "User"}
        </h2>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-bold text-[#F26A1C]">
          <ShieldCheck size={14} />
          Delivery account
        </div>
      </div>

      <div className="mx-5 mt-6 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-500" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
                Email
              </p>
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                {user?.email ?? user?.astuEmail ?? "No email provided"}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-4 border-b border-[#F26A1C]/30">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-gray-500" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
                Phone
              </p>
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                {user?.phoneNumber || "No phone provided"}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        {profileActions.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === profileActions.length - 1;

          return (
            <div
              key={item.label}
              className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors ${isLast ? "rounded-b-[20px]" : "border-b border-gray-100 dark:border-gray-800"
                }`}
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-gray-500" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold capitalize text-gray-400">
                  {item.value}
                </span>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-5 mt-5 rounded-[24px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Account status</p>
        <p className="mt-2 text-[13px] leading-6 text-gray-500 dark:text-gray-400">
          Your delivery profile is ready for backend integration. Identity, payment
          preference, password, and theme are now managed from this profile area.
        </p>
      </div>

      <div className="mt-auto px-5 pt-8">
        <ActionButton onClick={handleLogout}>Log Out</ActionButton>
      </div>
    </div>
  );
}
