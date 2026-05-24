import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Lock,
  Camera,
  Mail,
  Phone,
  Sun,
  Moon,
  Bell,
  CreditCard,
  UserPen,
  ShieldCheck,
  Star,
  Package,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useThemeStore } from "@/store/ui/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/routes/routePaths";
import { Header, ActionButton } from "../components/profileShared";
import RoleSwitcher from "@/components/common/RoleSwitcher";

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  const profile = user?.customerProfile;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  const profileActions = [
    {
      label: "Edit Profile",
      value: "Personal details",
      icon: UserPen,
      onClick: () => navigate(ROUTES.CUSTOMER.EDIT_PROFILE),
    },
    {
      label: "Address Book",
      value: "Delivery locations",
      icon: MapPin,
      onClick: () => navigate(ROUTES.CUSTOMER.ADDRESSES),
    },
    {
      label: "Password",
      value: "Secure access",
      icon: Lock,
      onClick: () => navigate(ROUTES.CUSTOMER.CHANGE_PASSWORD),
    },
    {
      label: "Payment Information",
      value: "Manage cards",
      icon: CreditCard,
      onClick: () => navigate(ROUTES.CUSTOMER.PAYMENT.METHODS),
    },
    {
      label: "Notifications",
      value: "Alerts & updates",
      icon: Bell,
      onClick: () => navigate(ROUTES.CUSTOMER.NOTIFICATIONS),
    },
    {
      label: "Theme",
      value: mode === "dark" ? "Dark" : "Light",
      icon: mode === "dark" ? Moon : Sun,
      onClick: toggleTheme,
    },
  ];

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-28">
      <Header title="Profile" />

      {/* ─── Avatar section ─── */}
      <div className="flex flex-col items-center mt-6 mb-2 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F26A1C] rounded-full scale-105" />
          <Avatar className="relative w-28 h-28 border-[4px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#F26A1C] text-white text-3xl font-bold">
              {user?.fullName?.[0] || "C"}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => navigate(ROUTES.CUSTOMER.UPLOAD_PROFILE)}
            className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 active:scale-95 transition-transform"
          >
            <div className="w-6 h-6 rounded-full border border-[#F26A1C] flex items-center justify-center text-[#F26A1C]">
              <Camera size={12} strokeWidth={3} />
            </div>
          </button>
        </div>
        <h2 className="text-[22px] font-black text-gray-900 dark:text-white mt-4">
          {user?.fullName || "Customer"}
        </h2>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-bold text-[#F26A1C]">
          <ShieldCheck size={14} />
          Customer Account
        </div>
      </div>

      {/* ─── Role Switcher ─── */}
      <RoleSwitcher />

      {/* ─── Stats row ─── */}
      {profile && (
        <div className="mx-5 mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-[18px] p-3 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package size={14} className="text-[#F26A1C]" />
            </div>
            <p className="text-[18px] font-black text-gray-900 dark:text-white">
              {profile.totalOrders}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              Orders
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[18px] p-3 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} className="text-[#F26A1C]" />
            </div>
            <p className="text-[18px] font-black text-gray-900 dark:text-white">
              {profile.rating}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              Rating
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[18px] p-3 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin size={14} className="text-[#F26A1C]" />
            </div>
            <p className="text-[12px] font-black text-gray-900 dark:text-white leading-tight">
              {profile.defaultLocation || "—"}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              Location
            </p>
          </div>
        </div>
      )}

      {/* ─── Contact info card ─── */}
      <div className="mx-5 mt-5 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors rounded-t-[20px]">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-500" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
                Primary Email (ASTU)
              </p>
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                {user?.astuEmail ?? user?.email ?? "No email provided"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* {user?.isEmailVerified && ( */}
            {user?.isEmailVerified === true ? (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                Not Verified
              </span>
            )}
            {/* <ChevronRight size={18} className="text-gray-400" /> */}
          </div>
        </div>

        <div
          className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors rounded-b-[20px]"
          // onClick={() => navigate(ROUTES.CUSTOMER.EDIT_PROFILE)}
        >
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
          <div className="flex items-center gap-2">
            {user?.status === "ACTIVE" && user?.isPhoneVerified === true ? (
              // {user?.isPhoneVerified && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                Not Verified
              </span>
            )}
            {/* <ChevronRight size={18} className="text-gray-400" /> */}
          </div>
        </div>
      </div>

      {/* ─── Settings card ─── */}
      <div className="mx-5 mt-5 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        {profileActions.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === profileActions.length - 1;
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors ${
                isLast
                  ? "rounded-b-[20px]"
                  : "border-b border-gray-100 dark:border-gray-800"
              } ${index === 0 ? "rounded-t-[20px]" : ""}`}
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

      {/* ─── Logout ─── */}
      <div className="mt-auto px-5 pt-8">
        <ActionButton onClick={handleLogout}>Log Out</ActionButton>
      </div>
    </div>
  );
}
