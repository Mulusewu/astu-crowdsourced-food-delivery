import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  ChevronRight,
  Lock,
  Camera,
  Mail,
  Phone,
  ClipboardList,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/features/shared/components/ProfileShared";

export default function ProfileMain() {
  const navigate = useNavigate();
  const { user, logout, updateAvatar } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header
        title="Profile"
        showBack
        onBackClick={() => navigate("/delivery/dashboard")}
      />

      <div className="flex flex-col items-center mt-6 mb-2 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 rounded-full scale-105" />
          <Avatar className="relative w-28 h-28 border-[4px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&fit=crop"
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-[#F26A1C] text-white text-3xl font-bold">
              {user?.name?.[0] || "N"}
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            type="button"
            onClick={handleCameraClick}
            className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 active:scale-95 hover:scale-110 transition-transform cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full border border-[#F26A1C] flex items-center justify-center text-[#F26A1C] group-hover:bg-[#F26A1C] group-hover:text-white transition-colors">
              <Camera size={12} strokeWidth={3} />
            </div>
          </button>
        </div>
        <h2 className="text-[22px] font-black text-gray-900 dark:text-white mt-4">
          {user?.name || "User"}
        </h2>
      </div>

      <div className="mx-5 mt-6 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-500" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
              {user?.email || "No email provided"}
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-4 border-b border-[#F26A1C]/30">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-gray-500" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
              {user?.phone || "No phone provided"}
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div
          className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          onClick={() => navigate("/delivery/profile/password")}
        >
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-gray-500" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
              Password
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div
          className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors rounded-b-[20px]"
          onClick={() => navigate("/delivery/profile/payment")}
        >
          <div className="flex items-center gap-3">
            <ClipboardList
              size={20}
              className="text-gray-500"
              strokeWidth={1.5}
            />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
              Payment Method
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
          className="w-full text-center text-red-500 font-bold text-sm p-4 active:opacity-70 transition-opacity"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
