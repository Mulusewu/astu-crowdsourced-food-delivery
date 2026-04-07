import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  Star,
  ChevronRight,
  Calendar,
} from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalDeliveries: number;
  averageRating: number;
  pendingPayout: number;
}

interface EarningTransaction {
  id: string;
  orderNo: string;
  date: string;
  amount: number;
  tip: number;
  distance: string;
  status: "paid" | "pending";
}

const PERIOD_OPTIONS = ["Today", "This Week", "This Month"] as const;
type Period = (typeof PERIOD_OPTIONS)[number];

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1",
        highlight
          ? "bg-primary text-white ring-primary/20"
          : "bg-white text-gray-900 ring-gray-100",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          highlight ? "bg-white/20" : "bg-primary/10",
        )}
      >
        <Icon
          className={cn("h-5 w-5", highlight ? "text-white" : "text-primary")}
          strokeWidth={2}
        />
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          highlight ? "text-white/80" : "text-gray-500",
        )}
      >
        {label}
      </p>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export default function EarningsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("This Week");
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [transactions, setTransactions] = useState<EarningTransaction[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1000));

      setSummary({
        today: 320,
        thisWeek: 1850,
        thisMonth: 7400,
        totalDeliveries: 142,
        averageRating: 4.8,
        pendingPayout: 1850,
      });

      setTransactions([
        {
          id: "t1",
          orderNo: "2041",
          date: "Today, 2:30 PM",
          amount: 80,
          tip: 15,
          distance: "1.2 km",
          status: "paid",
        },
        {
          id: "t2",
          orderNo: "2039",
          date: "Today, 11:15 AM",
          amount: 65,
          tip: 10,
          distance: "0.8 km",
          status: "paid",
        },
        {
          id: "t3",
          orderNo: "2035",
          date: "Yesterday, 7:45 PM",
          amount: 120,
          tip: 20,
          distance: "2.1 km",
          status: "pending",
        },
        {
          id: "t4",
          orderNo: "2030",
          date: "Yesterday, 1:00 PM",
          amount: 55,
          tip: 0,
          distance: "0.6 km",
          status: "paid",
        },
        {
          id: "t5",
          orderNo: "2025",
          date: "Mon, 5:20 PM",
          amount: 95,
          tip: 15,
          distance: "1.7 km",
          status: "paid",
        },
      ]);

      setIsLoading(false);
    };

    load();
  }, [selectedPeriod]);

  const periodValue =
    selectedPeriod === "Today"
      ? summary?.today
      : selectedPeriod === "This Week"
        ? summary?.thisWeek
        : summary?.thisMonth;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white pb-32">
        <div className="sticky top-0 z-10 bg-white px-4 pb-3 pt-6">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex-1 space-y-4 px-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="mt-4 h-5 w-36" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white px-4 pb-3 pt-6 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Earnings
        </h1>

        {/* Period Selector */}
        <div className="mt-4 flex gap-2">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPeriod(p)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                selectedPeriod === p
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-5">
        {/* Hero Earnings Card */}
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-primary px-5 py-6 text-white shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
          <div>
            <p className="text-sm font-medium text-white/80">{selectedPeriod}</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {periodValue?.toLocaleString()} ETB
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
              <TrendingUp className="h-4 w-4" />
              <span>+12% from last week</span>
            </div>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <DollarSign className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard
            icon={Package}
            label="Total Deliveries"
            value={`${summary?.totalDeliveries}`}
          />
          <StatCard
            icon={Star}
            label="Avg. Rating"
            value={`${summary?.averageRating} ★`}
          />
          <StatCard
            icon={Calendar}
            label="Pending Payout"
            value={`${summary?.pendingPayout?.toLocaleString()} ETB`}
            highlight
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={`${summary?.thisMonth?.toLocaleString()} ETB`}
          />
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-gray-100"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      Order #{tx.orderNo}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      +{tx.amount + tx.tip} ETB
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-500">{tx.date}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        tx.status === "paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600",
                      )}
                    >
                      {tx.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  {tx.tip > 0 && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      Base {tx.amount} ETB + {tx.tip} ETB tip · {tx.distance}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
