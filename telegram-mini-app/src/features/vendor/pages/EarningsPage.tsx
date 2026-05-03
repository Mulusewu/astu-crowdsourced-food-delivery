import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, ArrowUpRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/routes/routePaths";
import { useLedgerStore } from "@/store/delivery/ledgerStore";
import { cn } from "@/lib/utils";

export default function VendorEarningsPage() {
  const navigate = useNavigate();
  const { entries, fetchUserLedger, isLoading } = useLedgerStore();
  const [timeframe, setTimeframe] = useState("Weekly");

  useEffect(() => {
    fetchUserLedger();
  }, [fetchUserLedger]);

  // Calculate total revenue from ledger
  const totalRevenue = entries
    .filter(e => e.amount > 0)
    .reduce((acc, entry) => acc + entry.amount, 0);

  const pendingSettlement = entries
    .filter(e => e.status === "PENDING")
    .reduce((acc, entry) => acc + entry.amount, 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-28">
      {/* ─── Header ─── */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/80 dark:bg-gray-950/80 backdrop-blur-md z-30">
        <button
          onClick={() => navigate(ROUTES.VENDOR.DASHBOARD)}
          className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-900 dark:text-white shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[17px] font-black text-gray-900 dark:text-white">Financial Insights</h1>
        <button className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400">
          <Calendar size={18} />
        </button>
      </header>

      <main className="px-5 mt-4">
        {/* ─── Revenue Overview ─── */}
        <div className="bg-gray-900 dark:bg-[#F26A1C] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              {["Weekly", "Monthly", "Yearly"].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold transition-all",
                    timeframe === t ? "bg-white text-gray-900" : "bg-white/10 text-white/60 hover:bg-white/20"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Payouts</p>
            <h2 className="text-4xl font-black mb-8 tracking-tighter">
              {totalRevenue.toLocaleString()} <span className="text-lg opacity-60">ETB</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <p className="text-[10px] font-bold text-white/50 uppercase mb-1">Pending</p>
                <p className="text-lg font-black">{pendingSettlement.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <p className="text-[10px] font-bold text-white/50 uppercase mb-1">Orders</p>
                <p className="text-lg font-black">{entries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[#F26A1C] dark:bg-white rounded-full opacity-10 blur-[80px]" />
        </div>

        {/* ─── Analysis Section ─── */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-[28px] border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-500 mb-3">
              <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Growth</p>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">+12.5%</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-[28px] border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 mb-3">
              <DollarSign size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Order</p>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">185.0</h3>
          </div>
        </div>

        {/* ─── Settlement History ─── */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Payout History</h2>
            <button className="text-[11px] font-bold text-[#F26A1C] uppercase tracking-widest">Reports</button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-900 rounded-[24px] animate-pulse" />)}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900 p-10 rounded-[32px] text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
              <Building2 className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={40} />
              <p className="text-sm font-bold text-gray-400">No payout records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map(entry => (
                <div key={entry.id} className="bg-white dark:bg-gray-900 p-5 rounded-[24px] border border-gray-50 dark:border-gray-800 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#F26A1C] shadow-inner">
                      <ArrowUpRight size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-gray-900 dark:text-white leading-tight mb-1">
                        Order {entry.orderId ? `#${entry.orderId.split('_')[1]}` : 'Payout'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                          entry.status === 'COMPLETED' ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30"
                        )}>
                          {entry.status}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {entry.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-[-2px]">ETB</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
