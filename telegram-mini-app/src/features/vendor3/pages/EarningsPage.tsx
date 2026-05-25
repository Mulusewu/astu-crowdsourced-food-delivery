import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api/client/axiosInstance";
import { TrendingUp, ArrowLeft, Calendar, PackageX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TIME_FILTERS = [
  { id: "today", label: "Today" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

interface Transaction {
  id: string;
  type: string;
  time: string;
  amount: number;
}

interface EarningsSummary {
  earnings: number;
  orders: number;
  transactions: Transaction[];
}

type EarningsData = {
  today: EarningsSummary;
  month: EarningsSummary;
  year: EarningsSummary;
};

function buildEarningsFromOrders(orders: any[]): EarningsData {
  const completedStatuses = ["DELIVERED", "COMPLETED", "RECEIVED"];

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const toSummary = (filtered: any[]): EarningsSummary => {
    const completed = filtered.filter((o) =>
      completedStatuses.includes(o.status)
    );
    const earnings = completed.reduce(
      (sum: number, o: any) => sum + Number(o.totalAmount || 0),
      0
    );
    const transactions: Transaction[] = completed
      .slice(0, 10)
      .map((o: any) => ({
        id: o.id,
        type: `Order #${o.shortId}`,
        time: new Date(o.createdAt).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: Number(o.totalAmount || 0),
      }));
    return { earnings, orders: completed.length, transactions };
  };

  const todayOrders = orders.filter((o) =>
    o.createdAt?.startsWith(todayStr)
  );
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const yearOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === currentYear;
  });

  return {
    today: toSummary(todayOrders),
    month: toSummary(monthOrders),
    year: toSummary(yearOrders),
  };
}

export default function EarningsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"today" | "month" | "year">("month");

  useEffect(() => {
    const fetchEarnings = async () => {
      const restaurantId = user?.vendorProfile?.restaurantId;
      if (!restaurantId) {
        setError("No restaurant linked to this account.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await apiClient.get(`/orders`, {
          params: { restaurantId },
        });
        const rawOrders =
          Array.isArray(res.data.data?.orders)
            ? res.data.data.orders
            : res.data.data || res.data.orders || [];

        setEarnings(buildEarningsFromOrders(rawOrders));
      } catch (err: any) {
        console.error("Failed to fetch earnings", err);
        setError(err?.message || "Failed to load earnings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [user?.vendorProfile?.restaurantId]);

  const currentData = earnings?.[activeFilter];

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
              onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
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

        {/* Loading State */}
        {isLoading && (
          <>
            <Skeleton className="h-48 w-full rounded-[32px]" />
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-20 w-full rounded-[24px]" />
            <Skeleton className="h-20 w-full rounded-[24px]" />
          </>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <PackageX className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Data State */}
        {!isLoading && !error && currentData && (
          <>
            {/* Main Balance Card */}
            <div className="rounded-[32px] bg-gradient-to-br from-gray-900 to-black p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-[80px]" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-500/10 blur-[80px]" />

              <div className="relative z-10 flex flex-col gap-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Earnings</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black tracking-tighter">
                    {currentData.earnings.toLocaleString()}
                  </h2>
                  <span className="text-xl font-bold text-gray-500">ETB</span>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Completed Orders
                  </p>
                  <p className="text-2xl font-black tracking-tight">
                    {currentData.orders.toLocaleString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-white/10" />
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-2">
              <h3 className="text-xl font-black text-black mb-6 tracking-tight">
                Recent Transactions
              </h3>
              {currentData.transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <TrendingUp className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm font-medium">No transactions for this period.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {currentData.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-4 p-4 rounded-[24px] bg-white border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all group"
                    >
                      <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-900">{tx.type}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          {tx.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-green-600">
                          {tx.amount.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
