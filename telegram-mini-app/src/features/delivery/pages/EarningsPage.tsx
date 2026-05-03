import { useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { useLedgerStore } from "@/store/delivery/ledgerStore";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTelegram } from "@/contexts/TelegramContext";

/**
 * EarningsPage
 * Delivery earnings history with TMA BackButton and Haptic integration.
 */
export default function EarningsPage() {
  const navigate = useNavigate();
  const { showBackButton, hideBackButton, hapticFeedback } = useTelegram();
  const { entries, fetchUserLedger, isLoading } = useLedgerStore();
  const { user } = useAuthStore();

  const handleBack = useCallback(() => {
    hapticFeedback.impact("light");
    navigate(ROUTES.DELIVERY.PROFILE);
  }, [navigate, hapticFeedback]);

  useEffect(() => {
    showBackButton(handleBack);
    return () => hideBackButton();
  }, [showBackButton, hideBackButton, handleBack]);

  useEffect(() => {
    fetchUserLedger();
  }, [fetchUserLedger]);

  const availableBalance = entries.reduce((acc, entry) => acc + entry.amount, 0);
  const totalEarnings = entries.filter(e => e.amount > 0 && e.type !== "WITHDRAWAL").reduce((acc, e) => acc + e.amount, 0);
  const totalDeliveries = entries.filter(e => e.type === "REIMBURSEMENT_PAYMENT").length;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-10">
      <header className="px-5 pt-8 pb-4 flex items-center gap-4 sticky top-0 bg-[#FDFDFD]/80 dark:bg-gray-950/80 backdrop-blur-md z-20">
        <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-900 dark:text-white active:scale-90 transition-transform"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Earnings History</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Account Owner: {user?.fullName?.split(" ")[0] || "User"}</p>
        </div>
      </header>

      <main className="px-5 mt-6">
        <div className="bg-[#F26A1C] rounded-[32px] p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden mb-8">
          <div className="relative z-10">
            <p className="text-xs font-bold text-white/70 uppercase tracking-[2px] mb-2">Available Balance</p>
            <h2 className="text-4xl font-black mb-6">{availableBalance.toLocaleString()} <span className="text-xl font-medium">ETB</span></h2>
            <div className="flex gap-4">
              <button onClick={() => hapticFeedback.impact("medium")} className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/30 py-3 rounded-2xl font-bold text-sm transition-colors active:scale-95">Withdraw</button>
              <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center"><ArrowUpRight size={20} /></button>
            </div>
          </div>
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-[28px] shadow-sm border border-gray-50 dark:border-gray-800"><div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 mb-3"><TrendingUp size={20} /></div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Earned</p><h3 className="text-lg font-black text-gray-900 dark:text-white">{totalEarnings.toLocaleString()} ETB</h3></div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-[28px] shadow-sm border border-gray-50 dark:border-gray-800"><div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-500 mb-3"><History size={20} /></div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Deliveries</p><h3 className="text-lg font-black text-gray-900 dark:text-white">{totalDeliveries} Trips</h3></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>

        <div className="space-y-3">
          {isLoading ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-[24px]" />) : entries.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800"><Wallet className="mx-auto text-gray-300 mb-3" size={32} /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No transactions found</p></div>
          ) : entries.map((entry) => (
            <div key={entry.id} onClick={() => hapticFeedback.impact("light")} className="bg-white dark:bg-gray-900 p-4 rounded-[24px] shadow-sm border border-gray-50 dark:border-gray-800 flex items-center justify-between active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", entry.amount > 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500")}>{entry.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}</div>
                <div><h4 className="text-sm font-black text-gray-900 dark:text-white truncate max-w-[150px]">{entry.description}</h4><div className="flex items-center gap-2"><p className="text-[10px] font-medium text-gray-400">{new Date(entry.createdAt).toLocaleDateString()}</p><span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest", entry.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>{entry.status}</span></div></div>
              </div>
              <div className="text-right text-sm font-black text-gray-900 dark:text-white">{entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()} ETB<ChevronRight size={14} className="text-gray-300 ml-auto mt-1" /></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
