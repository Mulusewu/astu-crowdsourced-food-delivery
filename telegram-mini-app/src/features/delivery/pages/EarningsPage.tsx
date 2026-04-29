import { useEffect, useState } from "react";
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Clock, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/routes/routePaths";
import { useDeliveryDashboardStore } from "@/store/deliveryDashboardStore";
import { useLedgerStore } from "@/store/delivery/ledgerStore";

export default function EarningsPage() {
  const navigate = useNavigate();
  const { delivererProfile } = useDeliveryDashboardStore();
  const { entries, fetchDelivererLedger, isLoading } = useLedgerStore();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { requestWithdrawal } = useLedgerStore();

  useEffect(() => {
    fetchDelivererLedger();
  }, [fetchDelivererLedger]);

  const totalEarnings = Number(delivererProfile?.totalEarnings ?? 0);
  const totalDeliveries = delivererProfile?.totalDeliveries ?? 0;

  // Calculate available balance (total earnings - total withdrawals)
  const availableBalance = entries.reduce((acc, entry) => {
    return acc + entry.amount;
  }, 0);

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;
    await requestWithdrawal(Number(withdrawAmount), "Telebirr");
    setShowWithdraw(false);
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans px-5 pt-6 pb-28">
      {/* Header */}
      <header className="relative flex items-center justify-center mb-8">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#FFEFE5] text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Earnings</h1>
      </header>

      {/* Main Balance Card */}
      <div className="rounded-[28px] bg-gradient-to-br from-[#F26A1C] to-[#E05D15] p-6 shadow-[0_8px_30px_rgba(242,106,28,0.25)] text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <p className="text-sm font-semibold text-white/80">Available Balance</p>
        </div>
        <p className="text-3xl font-black mb-6">
          {availableBalance.toFixed(2)} ETB
        </p>
        
        <button 
          onClick={() => setShowWithdraw(!showWithdraw)}
          className="w-full bg-white text-[#F26A1C] font-bold py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-transform"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Withdraw Section */}
      {showWithdraw && (
        <div className="mt-4 p-5 bg-white rounded-[24px] border border-gray-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Withdraw via Telebirr/CBE</h3>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Amount" 
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-[14px] px-4 py-3 text-sm font-semibold outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C]"
            />
            <button 
              onClick={handleWithdraw}
              className="bg-gray-900 text-white font-bold px-5 rounded-[14px] active:scale-95 transition-transform"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[20px] bg-white border border-gray-100 p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total Earned
          </p>
          <p className="text-[18px] font-black text-gray-900">
            {totalEarnings.toFixed(0)} ETB
          </p>
        </div>
        <div className="rounded-[20px] bg-white border border-gray-100 p-4 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total Deliveries
          </p>
          <p className="text-[18px] font-black text-gray-900">
            {totalDeliveries}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-lg font-black text-gray-900 mb-4 px-1">Transaction History</h2>
        
        {isLoading ? (
          <div className="text-center py-10 text-sm font-bold text-gray-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="bg-gray-50 rounded-[24px] p-8 text-center border border-gray-100">
            <p className="text-sm font-semibold text-gray-500">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isIncome = entry.amount > 0;
              const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
              return (
                <div key={entry.id} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isIncome ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {entry.description || (isIncome ? "Delivery Payment" : "Withdrawal")}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {entry.status === 'PENDING' ? (
                          <Clock size={12} className="text-orange-500" />
                        ) : (
                          <Building2 size={12} className="text-gray-400" />
                        )}
                        <span className="text-[11px] font-semibold text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                          {entry.status === 'PENDING' && " · Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[15px] font-black ${isIncome ? 'text-green-500' : 'text-gray-900'}`}>
                      {isIncome ? "+" : ""}{entry.amount.toFixed(2)} ETB
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
