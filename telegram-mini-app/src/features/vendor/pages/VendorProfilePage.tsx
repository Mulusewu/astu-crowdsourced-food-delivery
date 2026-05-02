import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Store, 
  LogOut, 
  ChevronRight, 
  Settings, 
  ShieldCheck,
  Star,
  Clock,
  MapPin
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/routes/routePaths";

export default function VendorProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // In a real app, this would come from a vendor store
  const vendorInfo = {
    restaurantName: "Kaldi's Coffee",
    rating: 4.8,
    joinedDate: "Jan 2024",
    status: "Active",
    ordersCompleted: 1240
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  const menuItems = [
    { label: "Restaurant Settings", icon: Store, path: ROUTES.VENDOR.RESTAURANT.PROFILE },
    { label: "Account Settings", icon: Settings, path: ROUTES.VENDOR.SETTINGS.PROFILE },
    { label: "Business Hours", icon: Clock, path: ROUTES.VENDOR.RESTAURANT.HOURS },
    { label: "Store Location", icon: MapPin, path: ROUTES.VENDOR.RESTAURANT.LOCATION },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-28">
      {/* ─── Header ─── */}
      <header className="px-5 pt-8 pb-6 bg-[#F26A1C] rounded-b-[40px] shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white">Vendor Profile</h1>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback className="bg-orange-100 text-[#F26A1C] font-black text-xl">
                {user?.fullName?.[0] || "V"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#F26A1C] flex items-center justify-center">
               <ShieldCheck size={12} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{user?.fullName}</h2>
            <p className="text-white/80 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <Store size={14} />
              {vendorInfo.restaurantName}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* ─── Business Stats ─── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-[24px] shadow-sm border border-gray-50 dark:border-gray-800 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rating</p>
            <div className="flex items-center justify-center gap-1 text-[#F26A1C]">
              <Star size={14} className="fill-current" />
              <span className="text-lg font-black">{vendorInfo.rating}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-[24px] shadow-sm border border-gray-50 dark:border-gray-800 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</p>
            <span className="text-lg font-black text-gray-900 dark:text-white">{vendorInfo.ordersCompleted}</span>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-[24px] shadow-sm border border-gray-50 dark:border-gray-800 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <span className="text-[12px] font-black text-green-500 uppercase tracking-wider">{vendorInfo.status}</span>
          </div>
        </div>

        {/* ─── Contact Information ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-[28px] p-2 shadow-sm border border-gray-50 dark:border-gray-800">
          <div className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-gray-800">
            <div className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">ASTU Email</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.astuEmail || "Not verified"}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C]">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.phoneNumber || "Add phone"}</p>
            </div>
          </div>
        </div>

        {/* ─── Menu Options ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-[28px] p-2 shadow-sm border border-gray-50 dark:border-gray-800">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-gray-50 dark:border-gray-800" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
                  <item.icon size={18} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* ─── Logout ─── */}
        <button
          onClick={handleLogout}
          className="w-full py-4.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 text-red-500 font-black rounded-[24px] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <LogOut size={20} />
          Log Out Session
        </button>
      </main>
    </div>
  );
}
