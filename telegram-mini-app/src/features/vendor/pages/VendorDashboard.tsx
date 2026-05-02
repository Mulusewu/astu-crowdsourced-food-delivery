import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Star,
  ChevronRight,
  Plus
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    { label: "Today's Orders", value: "24", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Pending", value: "5", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Completed", value: "18", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Revenue", value: "4,250 ETB", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const recentOrders = [
    { id: "#ORD-7241", customer: "Abebe Kebede", items: 3, total: "450 ETB", status: "Preparing", time: "5m ago" },
    { id: "#ORD-7240", customer: "Sara Hailu", items: 1, total: "120 ETB", status: "New", time: "12m ago" },
    { id: "#ORD-7239", customer: "Dawit Alemu", items: 2, total: "310 ETB", status: "Ready", time: "25m ago" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-10">
      {/* ─── Top Header ─── */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/80 dark:bg-gray-950/80 backdrop-blur-md z-20">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {user?.fullName?.split(" ")[0] || "Vendor"}
          </h1>
        </div>
        <button 
          onClick={() => navigate(ROUTES.VENDOR.MENU.ADD)}
          className="w-12 h-12 bg-[#F26A1C] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <main className="px-5 mt-6">
        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 p-5 rounded-[28px] shadow-sm border border-gray-50 dark:border-gray-800">
              <div className={`w-10 h-10 ${stat.bg} dark:bg-gray-800 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* ─── Quick Actions ─── */}
        <div className="mt-8 flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Active Orders</h2>
          <button className="text-[11px] font-bold text-[#F26A1C] uppercase tracking-wider flex items-center gap-1">
            See All <ChevronRight size={14} />
          </button>
        </div>

        {/* ─── Orders List ─── */}
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-900 p-4 rounded-[24px] shadow-sm border border-gray-50 dark:border-gray-800 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs
                  ${order.status === "New" ? "bg-orange-50 text-orange-500" : 
                    order.status === "Preparing" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"}
                `}>
                  {order.id.split("-")[1]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">{order.customer}</h4>
                  <p className="text-[11px] font-medium text-gray-500">{order.items} items · {order.total}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase tracking-wider mb-1
                   ${order.status === "New" ? "text-orange-500" : 
                    order.status === "Preparing" ? "text-blue-500" : "text-green-500"}
                `}>{order.status}</p>
                <p className="text-[10px] font-medium text-gray-400">{order.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Store Performance ─── */}
        <div className="mt-8 bg-gray-900 dark:bg-white rounded-[32px] p-6 text-white dark:text-gray-900 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-1">Store Performance</h3>
            <p className="text-xs font-medium text-gray-400 mb-6">Your store is doing better than 85% of others!</p>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star size={14} className="fill-current" />
                  <span className="text-lg font-black">4.8</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rating</p>
              </div>
              <div className="w-px h-8 bg-gray-800 dark:bg-gray-200 mt-1" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-blue-400">
                  <Users size={14} />
                  <span className="text-lg font-black">120</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Followers</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#F26A1C] rounded-full opacity-20 blur-2xl" />
        </div>
      </main>
    </div>
  );
}
