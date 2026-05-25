import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Lock,
  Camera,
  Mail,
  Phone,
  ClipboardList,
  Star,
  Check,
  X,
  ShieldCheck,
  Package,
  Banknote,
  UserPen,
} from "lucide-react";

import { useAuthStore } from "@/store/auth/authStore";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header, ActionButton } from "@/features/shared/components/ProfileShared";
import { ROUTES } from "@/routes/routePaths";
import RoleSwitcher from "@/components/common/RoleSwitcher";
import { toast } from "sonner";

export default function ProfileMain() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Unified State Hooks
  const { user, logout, updateProfile, refreshProfile } = useAuthStore();
  const { delivererProfile, fetchDashboardData } = useDeliveryDashboardStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.fullName || "");
  const [isSaving, setIsSaving] = useState(false);

  // 2. Hydration
  useEffect(() => {
    // Ensures the latest deliverer stats (earnings, deliveries) are fetched from the DB
    if (user?.id) fetchDashboardData();
  }, [user?.id, fetchDashboardData]);

  // 3. Handlers
  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.info("Image upload disabled in V1. Please use the web portal.");
      // In V2, you will upload `file` to Cloudinary here, get the URL, and call:
      // await updateProfile({ avatarUrl: cloudinaryUrl });
    }
  };

  const handleSaveName = async () => {
    if (newName.trim() === user?.fullName) {
      setIsEditingName(false);
      return;
    }

    if (newName.trim()) {
      setIsSaving(true);
      try {
        await updateProfile({ fullName: newName.trim() });
        await refreshProfile(); // Sync new name globally
        setIsEditingName(false);
        toast.success("Name updated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to update name.");
        setNewName(user?.fullName || "");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelName = () => {
    setNewName(user?.fullName || "");
    setIsEditingName(false);
  };

  // 4. Dynamic Menu Links
  const profileActions = [
    {
      label: "Payout Account",
      value: delivererProfile?.payoutProvider || "Not Set",
      icon: ClipboardList,
      onClick: () => navigate(ROUTES.DELIVERY.PAYMENT),
    },
    {
      label: "Password",
      value: "Secure access",
      icon: Lock,
      onClick: () => navigate(ROUTES.DELIVERY.PASSWORD),
    }
  ];

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-28 min-h-screen">
      <Header
        title="Profile"
        showBack
        onBackClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
      />

      {/* ─── Avatar & Identity Section ─── */}
      <div className="flex flex-col items-center mt-6 mb-2 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F26A1C] rounded-full scale-105" />
          <Avatar className="relative w-28 h-28 border-[4px] border-white dark:border-gray-950 shadow-md">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#F26A1C] text-white text-3xl font-bold">
              {user?.fullName?.[0] || "D"}
            </AvatarFallback>
          </Avatar>
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 active:scale-95 hover:scale-110 transition-transform cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full border border-[#F26A1C] flex items-center justify-center text-[#F26A1C] group-hover:bg-[#F26A1C] group-hover:text-white transition-colors">
              <Camera size={12} strokeWidth={3} />
            </div>
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        </div>

        {/* Name Editing Block */}
        {isEditingName ? (
          <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isSaving}
              className="bg-white dark:bg-gray-900 border-2 border-[#F26A1C] rounded-xl px-4 py-1 text-lg font-bold text-gray-900 dark:text-white focus:outline-none w-48 shadow-sm disabled:opacity-50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') handleCancelName();
              }}
            />
            <button onClick={handleSaveName} disabled={isSaving} className="p-2 bg-[#F26A1C] text-white rounded-full hover:bg-orange-600 active:scale-95 transition-all shadow-md disabled:opacity-50">
              <Check size={16} strokeWidth={3} />
            </button>
            <button onClick={handleCancelName} disabled={isSaving} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-50">
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4 group">
            <h2 className="text-[22px] font-black text-gray-900 dark:text-white">
              {user?.fullName || "Deliverer"}
            </h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="p-1.5 text-gray-400 hover:text-[#F26A1C] transition-all active:scale-95"
              aria-label="Edit name"
            >
              <UserPen  size={16} />
            </button>
          </div>
        )}

        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
          <ShieldCheck size={14} />
          Verified Deliverer
        </div>
      </div>

      {/* ─── Role Switcher ─── */}
      <RoleSwitcher />

      {/* ─── Operational Stats Row ─── */}
      {delivererProfile && (
        <div className="mx-5 mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 px-2 py-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center border border-gray-100/50 dark:border-gray-800 transition-all hover:scale-[1.02]">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Package size={12}/> Jobs</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">
              {delivererProfile.totalDeliveries || 0}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 px-2 py-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center border border-gray-100/50 dark:border-gray-800 transition-all hover:scale-[1.02]">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Banknote size={12}/> Earned</span>
            <span className="text-lg font-black text-[#F26A1C]">
              {Number(delivererProfile.totalEarnings || 0).toLocaleString()}
              <span className="text-[10px] ml-1 font-bold">ETB</span>
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 px-2 py-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center border border-gray-100/50 dark:border-gray-800 transition-all hover:scale-[1.02]">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Star size={12}/> Rating</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-gray-900 dark:text-white">
                {Number(delivererProfile.rating || 5.0).toFixed(1)}
              </span>
              <Star size={14} className="fill-[#F26A1C] text-[#F26A1C]" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-5 mt-6 bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          onClick={() => navigate(ROUTES.DELIVERY.EDIT_PROFILE)}
        >
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-500" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-gray-400">Primary Email (ASTU)</p>
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                {user?.astuEmail ?? user?.email ?? "No email provided"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user?.status === "ACTIVE" && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">Verified</span>
            )}
          </div>
        </div>

        <div 
          className="flex items-center justify-between p-4 border-b border-brand-primary/30 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          onClick={() => navigate(ROUTES.DELIVERY.EDIT_PROFILE)}
        >
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-gray-500" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
              {user?.phoneNumber || "No phone provided"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user?.status === "ACTIVE" && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">Verified</span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Settings Card ─── */}
      <div className="mx-5 mt-5 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 p-2">
        {profileActions.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === profileActions.length - 1;
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors ${
                isLast ? "rounded-b-[20px]" : "border-b border-gray-100 dark:border-gray-800"
              } ${index === 0 ? "rounded-t-[20px]" : ""}`}
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-gray-500" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold capitalize text-gray-400 truncate max-w-[100px]">{item.value}</span>
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