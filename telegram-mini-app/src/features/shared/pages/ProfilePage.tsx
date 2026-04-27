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
} from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { useThemeStore } from "@/store/ui/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Header, ActionButton } from "../components/ProfileShared";

export default function SharedProfilePage() {
  const navigate = useNavigate();
  const { user, activeRole, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  const handleBack = () => {
    navigate(`/${activeRole}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 flex flex-col relative pb-28 font-sans">
      <Header title="Profile" showBack onBackClick={handleBack} />

      {/* Avatar Section conforming to Figma design */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <div className="relative">
          {/* Red/Orange abstract background ring behind user */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full scale-[1.02]" />

          <Avatar className="relative w-28 h-28 border-[3px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage src={user?.avatar} className="object-cover" />
            <AvatarFallback className="bg-[#F26A1C] text-white text-3xl font-bold">
              {user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Overlapping Camera Icon */}
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-[2px] border-white dark:border-gray-900 active:scale-95 transition-transform z-10">
            <Camera size={14} className="text-[#F26A1C]" strokeWidth={2.5} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
          {user?.name || "Natnael Abebe"}
        </h2>
        {/* Subtle role indicator */}
        <p className="text-xs font-semibold text-gray-400 capitalize mt-1 tracking-wide">
          {activeRole}
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white dark:bg-gray-900 rounded-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 py-2">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800/60">
          <div className="flex items-center gap-3">
            <Mail
              size={20}
              className="text-gray-600 dark:text-gray-400"
              strokeWidth={1.5}
            />
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
              {user?.email || "Johndoe@Gmail.Com"}
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between px-4 py-3.5 border-b border-orange-100 dark:border-orange-900/30">
          <div className="flex items-center gap-3">
            <Phone
              size={20}
              className="text-gray-600 dark:text-gray-400"
              strokeWidth={1.5}
            />
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
              {user?.phone || "0949486753"}
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div
          className="flex items-center justify-between px-4 py-3.5 border-b border-orange-100 dark:border-orange-900/30 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          onClick={toggleTheme}
        >
          <div className="flex items-center gap-3">
            {mode === "dark" ? (
              <Moon
                size={20}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={1.5}
              />
            ) : (
              <Sun
                size={20}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={1.5}
              />
            )}
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
              Theme
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-medium text-gray-400 capitalize pr-1">
              {mode}
            </span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        <div
          className="flex items-center justify-between px-4 py-3.5 border-b border-orange-100 dark:border-orange-900/30 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          onClick={() => navigate("/profile/password")}
        >
          <div className="flex items-center gap-3">
            <Lock
              size={20}
              className="text-gray-600 dark:text-gray-400"
              strokeWidth={1.5}
            />
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
              Password
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div
          className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors rounded-b-[20px]"
          onClick={() => navigate("/profile/payment")}
        >
          <div className="flex items-center gap-3">
            <ClipboardList
              size={20}
              className="text-gray-600 dark:text-gray-400"
              strokeWidth={1.5}
            />
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
              Payment Method
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>

      {/* Solid Orange Logout Button at bottom */}
      <div className="mt-auto pt-8 pb-4">
        <ActionButton onClick={handleLogout}>Log Out</ActionButton>
      </div>
    </div>
  );
}
