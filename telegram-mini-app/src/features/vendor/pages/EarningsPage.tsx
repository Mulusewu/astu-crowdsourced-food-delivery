import { useEffect } from "react";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/auth/authStore";
import { DollarSign, Wallet, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

export default function EarningsPage() {
    const { user } = useAuthStore();
    const { vendor, fetchVendorData, isLoading } = useVendorStore();

    useEffect(() => {
        if (user?.id) {
            fetchVendorData(user.id);
        }
    }, [fetchVendorData, user?.id]);

    if (isLoading || !vendor) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4 pb-24 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                    <Calendar className="h-4 w-4" /> This Month
                </button>
            </div>

            {/* Main Balance Card */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                <div className="relative z-10 flex flex-col gap-2 relative">
                    <p className="text-sm font-medium text-gray-300">Available Balance</p>
                    <div className="flex items-end gap-2">
                        <h2 className="text-4xl font-extrabold">{(vendor.stats.totalRevenue * 0.15).toFixed(2)}</h2>
                        <span className="text-xl font-medium text-gray-400 mb-1">ETB</span>
                    </div>
                </div>

                <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Total Lifetime Earnings</p>
                        <p className="font-semibold">{vendor.stats.totalRevenue.toLocaleString()} ETB</p>
                    </div>
                    <button className="flex items-center gap-1 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-100 transition-colors">
                        Withdraw <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Pending Clearance</p>
                        <p className="text-lg font-bold text-gray-900">1,250 ETB</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Last Withdrawal</p>
                        <p className="text-lg font-bold text-gray-900">4,500 ETB</p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Skeleton */}
            <div className="mt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-50 hover:border-gray-100 hover:shadow-sm transition-all">
                            <div className="rounded-full bg-green-100 p-2.5 text-green-600">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">Order Revenue</h4>
                                <p className="text-xs text-gray-500">Today, 2:30 PM</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-green-600">+450 ETB</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

