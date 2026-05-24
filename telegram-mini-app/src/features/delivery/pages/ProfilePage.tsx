import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import {
  ChevronRight,
  Lock,
  Camera,
  Mail,
  Phone,
  ClipboardList,
  ArrowLeftRight,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/features/shared/components/ProfileShared";
import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";

export default function ProfileMain() {
  const navigate = useNavigate();
  const { user, logout, updateAvatar, updateName, switchRole } = useAuthStore();
  const { deliveryPerson, fetchDashboardData } = useDeliveryDashboardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData(user.id);
    }
  }, [user?.id, fetchDashboardData]);

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

  const handleSaveName = () => {
    if (newName.trim()) {
      updateName(newName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelName = () => {
    setNewName(user?.name || "");
    setIsEditingName(false);
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
          <div className="absolute inset-0 bg-red-600 rounded-full scale-105" />
          <Avatar className="relative w-28 h-28 border-[4px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&fit=crop"
              }
              className="object-cover"
            />
            <AvatarFallback className="bg-brand-primary text-white text-3xl font-bold">
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
            <div className="w-6 h-6 rounded-full border border-brand-primary flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <Camera size={12} strokeWidth={3} />
            </div>
          </button>
        </div>
        {isEditingName ? (
          <div className="flex items-center gap-2 mt-4 anime-in fade-in slide-in-from-top-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-white dark:bg-gray-900 border-2 border-brand-primary rounded-xl px-4 py-1 text-lg font-bold text-gray-900 dark:text-white focus:outline-none w-48 shadow-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') handleCancelName();
              }}
            />
            <button
              onClick={handleSaveName}
              className="p-2 bg-brand-primary text-white rounded-full hover:bg-brand-primary-dark active:scale-95 transition-all shadow-md"
            >
              <Check size={16} strokeWidth={3} />
            </button>
            <button
              onClick={handleCancelName}
              className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4 group">
            <h2 className="text-[22px] font-black text-gray-900 dark:text-white">
              {user?.name || "User"}
            </h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="p-1.5 text-gray-400 hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all active:scale-95"
              aria-label="Edit name"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="mx-5 mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 px-2 py-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center border border-gray-100/50 dark:border-gray-800 transition-all hover:scale-[1.02]">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Deliveries</span>
          <span className="text-lg font-black text-gray-900 dark:text-white">
            {deliveryPerson?.stats?.totalDeliveries || 0}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 px-2 py-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center border border-gray-100/50 dark:border-gray-800 transition-all hover:scale-[1.02]">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Earnings</span>
          <span className="text-lg font-black text-brand-primary">
            {deliveryPerson?.stats?.totalEarnings?.toLocaleString() || 0}
            <span className="text-[10px] ml-1 font-bold">ETB</span>
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 px-2 py-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center border border-gray-100/50 dark:border-gray-800 transition-all hover:scale-[1.02]">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Rating</span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-gray-900 dark:text-white">
              {deliveryPerson?.stats?.rating || "0.0"}
            </span>
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
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

        <div className="flex items-center justify-between p-4 border-b border-brand-primary/30">
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
          onClick={() => navigate(ROUTES.DELIVERY.PASSWORD)}
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
          onClick={() => navigate(ROUTES.DELIVERY.PAYMENT)}
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

      <div className="mt-8 px-5 flex flex-col gap-3">
        <div className="flex justify-center mb-2">
          <button
            onClick={() => {
              switchRole("customer");
              navigate(ROUTES.CUSTOMER.HOME);
            }}
            className="flex items-center gap-2 px-6 py-3 border-2 border-brand-primary/10 rounded-full text-[12px] font-bold text-brand-primary hover:bg-brand-primary/5 active:scale-95 transition-all w-fit shadow-sm shadow-brand-primary/5"
          >
            <ArrowLeftRight size={14} strokeWidth={2.5} />
            Switch to Customer Mode
          </button>
        </div>

        <button
          onClick={() => {
            logout();
            navigate(ROUTES.AUTH);
          }}
          className="w-full text-center text-red-500 font-bold text-sm p-3 active:opacity-70 transition-opacity"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
