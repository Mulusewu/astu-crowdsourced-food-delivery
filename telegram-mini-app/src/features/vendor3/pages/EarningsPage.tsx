import { useEffect, useState } from "react";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  ArrowLeft,
  Calendar
} from "lucide-react";

const TIME_FILTERS = [
  { id: "today", label: "Today" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

export default function EarningsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { vendor, earnings, fetchVendorData, isLoading } = useVendorStore();
    const [activeFilter, setActiveFilter] = useState("month");

    useEffect(() => {
        if (user?.id) {
            fetchVendorData(user.id);
        }
    }, [fetchVendorData, user?.id]);

    const currentData = earnings ? earnings[activeFilter as keyof typeof earnings] : null;

    if (isLoading || !vendor || !currentData) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FDFDFD]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-outfit pb-32">
            {/* Header */}
            <div className="flex items-center px-4 py-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-orange-200 text-orange-500 hover:bg-orange-50 transition-all active:scale-95 shadow-sm"
                >
                    <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
                <div className="flex-1 text-center pr-10">
                    <h1 className="text-2xl font-black text-black tracking-tight">Earnings</h1>
                </div>
            </div>

            <div className="flex flex-col gap-6 px-5 max-w-2xl mx-auto w-full">
                
                {/* Time Filters */}
                <div className="flex bg-orange-100/50 p-1.5 rounded-[22px]">
                  {TIME_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex-1 py-3 px-2 rounded-2xl text-[13px] font-black tracking-tight transition-all ${
                        activeFilter === filter.id
                          ? "bg-white text-orange-600 shadow-sm scale-[1.02]"
                          : "text-gray-500"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Main Balance Card */}
                <div className="rounded-[32px] bg-gradient-to-br from-gray-900 to-black p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-[80px]" />
                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-500/10 blur-[80px]" />

                    <div className="relative z-10 flex flex-col gap-2">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Earnings</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl font-black tracking-tighter">{currentData.earnings}</h2>
                            <span className="text-xl font-bold text-gray-500">ETB</span>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed Orders</p>
                          <p className="text-2xl font-black tracking-tight">{currentData.orders.toLocaleString()}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-white/10" />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-2">
                    <h3 className="text-xl font-black text-black mb-6 tracking-tight">Recent Transactions</h3>
                    <div className="flex flex-col gap-4">
                        {currentData.transactions.map((tx: any) => (
                            <div key={tx.id} className="flex items-center gap-4 p-4 rounded-[24px] bg-white border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all group">
                                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-gray-900">{tx.type}</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{tx.time}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-green-600">{tx.amount} ETB</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
