import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Fingerprint,
  Camera,
  LogOut,
  Loader2,
  DollarSign,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Edit2
} from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";
import BottomNav from "@/components/common/BottomNav";

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
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file (JPG or PNG)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
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

  const menuItems = [
    {
      icon: DollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      title: "Earnings & Transactions",
      subtitle: "View transaction history",
      path: ROUTES.VENDOR.EARNINGS
    },
    {
      icon: Clock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Store Hours",
      subtitle: "Manage availability",
      path: ROUTES.VENDOR.RESTAURANT.HOURS
    },
    {
      icon: AlertCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      title: "Report Issue",
      subtitle: "Report operational issues",
      path: ROUTES.VENDOR.SETTINGS.REPORT_ISSUE
    },
    {
      icon: HelpCircle,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      title: "Change Password",
      subtitle: "Update account security",
      path: ROUTES.VENDOR.SETTINGS.CHANGE_PASSWORD
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit max-w-md mx-auto relative overflow-hidden pb-24">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Header */}
      <div className="flex items-center justify-center px-4 pt-8 pb-2">
        <h1 className="text-[22px] font-extrabold text-[#0B1E40] tracking-tight">Profile</h1>
      </div>

      {/* Profile Header (Avatar & Name) */}
      <div className="flex flex-col items-center mt-2">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 border-2 border-white shadow-sm relative flex items-center justify-center">
            {user?.avatar || vendor.avatar ? (
              <img
                src={user?.avatar || vendor.avatar}
                alt={vendor.businessName}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              />
            ) : (
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=chef&backgroundColor=f26a1c" alt="Avatar" className="w-full h-full p-2" />
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>
        <h2 className="mt-4 text-[19px] font-extrabold text-[#0B1E40] tracking-tight">
          {vendor.businessName || "Kaldi's Coffee"}
        </h2>
        <button
          onClick={() => navigate(ROUTES.VENDOR.SETTINGS.EDIT_PROFILE)}
          className="mt-2 text-[#F26A1C] text-[13px] font-bold hover:text-orange-600 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="px-5 mt-6">
        {/* Contact Info Card */}
        <div className="bg-gray-50 rounded-[20px] p-5 mb-5 border border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <User className="w-[18px] h-[18px] text-gray-400 mr-4" />
              <span className="text-[14px] text-[#0B1E40] font-medium">{vendor.businessName || "Kaldi's Coffee"}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-[18px] h-[18px] text-gray-400 mr-4" />
              <span className="text-[14px] text-[#0B1E40] font-medium">{vendor.phone || "+251911789012"}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-[18px] h-[18px] text-gray-400 mr-4" />
              <span className="text-[14px] text-[#0B1E40] font-medium">Bole Gate</span>
            </div>
            <div className="flex items-center">
              <Fingerprint className="w-[18px] h-[18px] text-gray-400 mr-4" />
              <span className="text-[14px] text-[#0B1E40] font-medium">#{vendor.restaurantId || "rest_001"}</span>
            </div>
          </div>
        </div>

        {/* Menu Options Card */}
        <div className="bg-white rounded-[20px] p-2 mb-5 border border-gray-100 shadow-sm">
          <div className="flex flex-col">
            {menuItems.map((item, index) => (
              <div key={index}>
                <div 
                  onClick={() => navigate(item.path)}
                  className="flex items-center py-3 px-2 cursor-pointer active:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mr-4`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-extrabold text-[#0B1E40]">{item.title}</h3>
                    <p className="text-[12px] text-gray-500 font-medium mt-0.5">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
                {index < menuItems.length - 1 && (
                  <div className="h-[1px] bg-gray-100 mx-4 my-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-extrabold text-[15px] rounded-[16px] hover:bg-red-100 transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-[18px] h-[18px]" />
          SIGN OUT
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
