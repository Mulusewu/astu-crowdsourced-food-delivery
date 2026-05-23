import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/common/BottomNav";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";

const TIME_FILTERS = [
  { id: "today", label: "Today" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

export default function VendorAnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { vendor, analytics, isLoading, fetchVendorData } = useVendorStore();
  const [activeFilter, setActiveFilter] = useState("month");

  useEffect(() => {
    if (user?.id && !vendor) {
      fetchVendorData(user.id);
    }
  }, [fetchVendorData, user?.id, vendor]);

  const data = analytics ? analytics[activeFilter as keyof typeof analytics] : null;

  const handleExport = () => {
    toast.success("Preparing your report...", {
      description: `Your ${activeFilter} report is being generated and will download shortly.`,
    });
    // Mock export delay
    setTimeout(() => {
      toast.success("Download started!");
    }, 2000);
  };

  if (isLoading || !vendor || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 font-outfit">
      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-2xl font-black text-black tracking-tight">Analytics</h1>
        </div>
      </div>

      {/* Time Filters */}
      <div className="px-5 mb-8">
        <div className="flex bg-orange-100/50 p-1.5 rounded-2xl">
          {TIME_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 py-3 px-2 rounded-xl text-sm font-black transition-all ${
                activeFilter === filter.id
                  ? "bg-white text-orange-600 shadow-md scale-[1.02]"
                  : "text-gray-500"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-5 space-y-4">
        {/* Main Revenue Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-150">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-orange-100 rounded-2xl">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              data.revenueGrowing ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              {data.revenueGrowing ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {data.revenueChange}
            </div>
          </div>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-1">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-black">{data.revenue}</h2>
            <span className="text-gray-400 font-bold text-lg">ETB</span>
          </div>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-150">
            <div className="p-2.5 bg-blue-100 w-fit rounded-xl mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Orders</p>
            <h3 className="text-xl font-black text-black">{data.orders}</h3>
          </div>
          <div className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-150">
            <div className="p-2.5 bg-purple-100 w-fit rounded-xl mb-4">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Customers</p>
            <h3 className="text-xl font-black text-black">{data.customers}</h3>
          </div>
        </div>
      </div>

      {/* Chart Mockup */}
      <div className="px-5 mt-8">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-150 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-black text-lg">Performance</h3>
            <BarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Mock Graph Bars */}
          <div className="flex items-end justify-between h-40 gap-2 mb-2">
            {[40, 70, 45, 90, 65, 80, 55, 75].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-orange-100 rounded-t-lg relative group transition-all"
                style={{ height: `${height}%` }}
              >
                <div className="absolute inset-0 bg-orange-500 rounded-t-lg scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500" />
              </div>
            ))}
          </div>
          <div className="flex justify-between px-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <span key={i} className="text-[10px] font-black text-gray-400 uppercase">{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-12 mb-6 flex justify-center">
        <button
          onClick={handleExport}
          className="bg-white text-orange-500 flex items-center justify-center gap-2.5 py-3 px-8 rounded-full font-black text-sm shadow-[0_15px_35px_rgba(242,106,28,0.15)] border-2 border-orange-50 active:scale-95 transition-all hover:bg-orange-50/50"
        >
          <Download className="w-4 h-4 stroke-[3]" />
          Export Data
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
