import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";

export default function VendorAnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("This Week");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden pb-24 font-outfit">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-gray-50 sticky top-0 z-10">
        <button 
          onClick={() => navigate("/vendor/dashboard")}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center pr-10">
          <h1 className="text-2xl font-extrabold text-[#0B1E40] ml-4 tracking-tight">Analytics</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["This Week", "This Month", "This Year"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Earnings Card */}
          <div className="col-span-1 bg-[#F26A1C] rounded-[20px] p-4 text-white shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-medium opacity-90">Total Earnings</span>
            <div className="mt-1 mb-2">
              <span className="text-[22px] font-extrabold tracking-tight">151,000 ETB</span>
            </div>
            <div className="flex items-center text-[10px] font-bold">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+18% from last week</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="col-span-1 bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-gray-400">Total Orders</span>
            <div className="mt-1 mb-2">
              <span className="text-[22px] font-extrabold text-[#0B1E40] tracking-tight">441</span>
            </div>
            <div className="flex items-center text-[10px] font-bold text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% from last week</span>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="col-span-1 bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-gray-400">Avg Order Value</span>
            <div className="mt-1 mb-2">
              <span className="text-[22px] font-extrabold text-[#0B1E40] tracking-tight">342 ETB</span>
            </div>
            <div className="flex items-center text-[10px] font-bold text-red-500">
              <TrendingDown className="w-3 h-3 mr-1" />
              <span>-3% from last week</span>
            </div>
          </div>

          {/* Customer Rating */}
          <div className="col-span-1 bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-gray-400">Customer Rating</span>
            <div className="mt-1 mb-2 flex items-center">
              <span className="text-[22px] font-extrabold text-[#0B1E40] mr-1 tracking-tight">4.5</span>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex items-center text-[10px] font-bold text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+0.2 from last week</span>
            </div>
          </div>
        </div>

        {/* Earnings Overview Chart Placeholder */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-[#0B1E40] text-[15px] mb-4">Earnings Overview</h3>
          <div className="h-[180px] w-full relative">
             <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 mb-[20px]">
                <div className="w-full flex items-center"><span className="w-8">30000</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-8">22500</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-8">15000</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-8">7500</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-8">0</span><div className="flex-1 border-b border-gray-300"></div></div>
             </div>
             <div className="absolute inset-0 left-8 bottom-[20px]">
                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 65 Q 10 40 18 50 T 40 60 T 60 25 T 80 35 T 100 20" fill="none" stroke="#F26A1C" strokeWidth="2.5" />
                    <circle cx="0" cy="65" r="3.5" fill="#F26A1C" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="21" cy="45" r="3.5" fill="#F26A1C" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="40" cy="55" r="3.5" fill="#F26A1C" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="58" cy="27" r="3.5" fill="#F26A1C" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="80" cy="35" r="3.5" fill="#F26A1C" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="100" cy="22" r="3.5" fill="#F26A1C" stroke="#fff" strokeWidth="1.5" />
                 </svg>
             </div>
             <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-gray-400 font-medium">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </div>
        </div>

        {/* Orders Overview Chart */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 mt-6">
          <h3 className="font-extrabold text-[#0B1E40] text-[15px] mb-4">Orders Overview</h3>
          <div className="h-[180px] w-full relative">
             <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 mb-[20px]">
                <div className="w-full flex items-center"><span className="w-6">100</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-6">75</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-6">50</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-6">25</span><div className="flex-1 border-b border-dashed border-gray-200"></div></div>
                <div className="w-full flex items-center"><span className="w-6">0</span><div className="flex-1 border-b border-gray-300"></div></div>
             </div>
             <div className="absolute inset-0 left-6 bottom-[20px] flex items-end justify-around pb-[1px]">
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '45%' }}></div>
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '52%' }}></div>
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '48%' }}></div>
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '68%' }}></div>
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '64%' }}></div>
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '85%' }}></div>
                 <div className="w-[12%] bg-[#F26A1C] rounded-t-[4px]" style={{ height: '78%' }}></div>
             </div>
             <div className="absolute bottom-0 left-6 right-0 flex justify-around text-[10px] text-gray-400 font-medium">
                 <span className="w-[12%] text-center">Mon</span>
                 <span className="w-[12%] text-center">Tue</span>
                 <span className="w-[12%] text-center">Wed</span>
                 <span className="w-[12%] text-center">Thu</span>
                 <span className="w-[12%] text-center">Fri</span>
                 <span className="w-[12%] text-center">Sat</span>
                 <span className="w-[12%] text-center">Sun</span>
             </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 mt-6">
          <h3 className="font-extrabold text-[#0B1E40] text-[17px] mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Ethiopian Macchiato", orders: 245, revenue: "11,025 ETB", trend: "+12%", up: true },
              { rank: 2, name: "Traditional Coffee", orders: 198, revenue: "39,600 ETB", trend: "-5%", up: false },
              { rank: 3, name: "Spris Tea", orders: 156, revenue: "7,800 ETB", trend: "+8%", up: true },
              { rank: 4, name: "Avocado Juice", orders: 134, revenue: "10,720 ETB", trend: "+15%", up: true },
            ].map((item) => (
              <div key={item.rank} className="flex items-center bg-gray-50 rounded-2xl p-4">
                <div className="w-7 font-bold text-gray-300 text-sm">#{item.rank}</div>
                <div className="flex-1 ml-1">
                  <h4 className="font-extrabold text-[#0B1E40] text-[15px] tracking-tight">{item.name}</h4>
                  <div className="text-[11px] text-gray-500 font-medium mt-1">{item.orders} orders • {item.revenue}</div>
                </div>
                <div className={`flex items-center text-[11px] font-bold ${item.up ? 'text-green-500' : 'text-red-500'}`}>
                  {item.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
