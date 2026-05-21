import { useNavigate } from "react-router-dom";
import { ChevronRight, Lock, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function SharedProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleBack = () => {
    if (user?.role === "DELIVERER") navigate("/delivery/dashboard");
    else if (user?.role === "VENDOR_STAFF") navigate("/vendor/dashboard");
    else navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans flex flex-col">
      {/* Header Area */}
      <div className="relative flex items-center justify-center pt-6 pb-4">
        <button
          onClick={handleBack}
          className="absolute left-5 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white tracking-wide">
          Profile
        </h1>

        {/* Role indicator — no dropdown needed in single-role architecture */}
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mt-6 mb-2 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 rounded-full scale-105" />
          <Avatar className="relative w-28 h-28 border-[4px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage src={user?.avatarUrl ?? undefined} className="object-cover" />
            <AvatarFallback className="bg-[#F26A1C] text-white text-3xl font-bold">
              {user?.fullName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-[22px] font-black text-gray-900 dark:text-white mt-4">
          {user?.fullName}
        </h2>
        <p className="text-sm font-medium text-[#F26A1C] capitalize">
          {user?.role?.replace(/_/g, " ").toLowerCase() ?? "user"} Account
        </p>
      </div>

      {/* Settings List */}
      <div className="mx-5 mt-6 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        {/* ... (Your existing Mail & Phone rows) ... */}

        <div
          className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
          onClick={() => navigate("/profile/password")}
        >
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-gray-500" />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
              Password
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>

      <div className="mt-8 px-5">
        <button
          onClick={() => {
            logout();
            navigate("/auth");
          }}
          className="w-full text-center text-red-500 font-bold text-sm p-4"
        >
          Log Out
        </button>
      </div>

      {/* Bottom nav is rendered by the role-specific layout wrapper */}
    </div>
  );
}
