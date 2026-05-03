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
  ShieldAlert,
  ShieldX,
  Star,
  Bike,
  Wallet,
  Circle,
  UserPen,
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

  const dp = user?.delivererProfile;

  // Verification badge config
  const verificationConfig = {
    APPROVED: {
      icon: ShieldCheck,
      label: "Verified",
      className: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    PENDING: {
      icon: ShieldAlert,
      label: "Pending Review",
      className: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
    REJECTED: {
      icon: ShieldX,
      label: "Rejected",
      className: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
  };
  const verif =
    verificationConfig[dp?.verificationStatus ?? "PENDING"] ??
    verificationConfig.PENDING;
  const VerifIcon = verif.icon;

  const payoutLabel = dp?.payoutProvider
    ? `${dp.payoutProvider} • ••${(dp.payoutAccount ?? "").slice(-4)}`
    : "No payout method";

  const profileActions = [
    {
      label: "Edit Profile",
      value: "Personal details",
      icon: UserPen,
      onClick: () => navigate(ROUTES.DELIVERY.EDIT_PROFILE),
    },
    {
      label: "Password",
      value: "Secure access",
      icon: Lock,
      onClick: () => navigate(ROUTES.DELIVERY.PASSWORD),
    },
    {
      label: "Theme",
      value: mode === "dark" ? "Dark" : "Light",
      icon: mode === "dark" ? Moon : Sun,
      onClick: toggleTheme,
    },
    {
      label: "Payment Method",
      value: payoutLabel,
      icon: ClipboardList,
      onClick: () => navigate(ROUTES.DELIVERY.PAYMENT),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-28">
      <Header
        title="Profile"
        showBack
        onBackClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
      />

      {/* ─── Avatar section ─── */}
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

        {/* Role + Verification badges */}
        <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-bold text-[#F26A1C]">
            <ShieldCheck size={14} />
            Delivery Account
          </div>
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${verif.className}`}
          >
            <VerifIcon size={13} />
            {verif.label}
          </div>
        </div>

        {/* Online status */}
        <div className="mt-2 inline-flex items-center gap-1.5">
          <Circle
            size={8}
            className={dp?.isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"}
          />
          <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
            {dp?.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* ─── Stats row ─── */}
      {dp && (
        <div className="mx-5 mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-[18px] p-3 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Bike size={14} className="text-[#F26A1C]" />
            </div>
            <p className="text-[18px] font-black text-gray-900 dark:text-white">
              {dp.totalDeliveries}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              Deliveries
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[18px] p-3 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} className="text-[#F26A1C]" />
            </div>
            <p className="text-[18px] font-black text-gray-900 dark:text-white">
              {dp.rating.toFixed(1)}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              Rating
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[18px] p-3 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wallet size={14} className="text-[#F26A1C]" />
            </div>
            <p className="text-[14px] font-black text-gray-900 dark:text-white leading-tight">
              {dp.totalEarnings.toLocaleString()}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              ETB Earned
            </p>
          </div>
        </div>
      )}

      {/* ─── Contact info card ─── */}
      <div className="mx-5 mt-5 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 rounded-t-[20px]">
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
            {user?.isEmailVerified && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                Verified
              </span>
            )}
            {/* <ChevronRight size={18} className="text-gray-400" /> */}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-b-[20px]">
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
            {user?.isPhoneVerified && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                Verified
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
              className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors ${isLast
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
                <span className="text-[12px] font-semibold capitalize text-gray-400 max-w-[140px] truncate text-right">
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
