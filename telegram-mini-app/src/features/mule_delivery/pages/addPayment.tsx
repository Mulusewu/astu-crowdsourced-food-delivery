import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Header } from "@/features/shared/components/ProfileShared";
import { usePaymentStore } from "@/store/paymentStore";
import { ROUTES } from "@/routes/routePaths";

const AVAILABLE_BANKS = [
  {
    id: "telebirr",
    name: "Telebirr",
    short: "TB",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
  },
  {
    id: "cbe-birr",
    name: "CBE Birr",
    short: "CBE",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
  },
];

export default function AddPayment() {
  const navigate = useNavigate();
  const { paymentMethods, addPaymentMethod } = usePaymentStore();
  const [selectedBankId, setSelectedBankId] = useState(AVAILABLE_BANKS[0].id);
  const [accountInfo, setAccountInfo] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const selectedBank = useMemo(
    () => AVAILABLE_BANKS.find((bank) => bank.id === selectedBankId) ?? AVAILABLE_BANKS[0],
    [selectedBankId],
  );

  const handleAddPayment = () => {
    if (!accountInfo.trim() || !accountHolder.trim()) return;



    addPaymentMethod({
      id: `payment_${Date.now()}`,
      providerId: selectedBank.id,
      type: selectedBank.name,
      accountInfo: accountInfo.trim(),
      accountHolder: accountHolder.trim(),
      status: "active",
    });
    navigate(ROUTES.DELIVERY.PAYMENT);
  };

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header
        title="Add Payment Method"
        showBack
        onBackClick={() => navigate(ROUTES.DELIVERY.PAYMENT)}
      />

      <div className="px-5 pt-4">
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Payer Account</h2>
          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-1">
            Choose a wallet or bank to receive your delivery earnings.
          </p>
        </div>

        <div className="flex-1 space-y-4">
          {AVAILABLE_BANKS.map((bank) => {
            const isAdded = paymentMethods.some(

              (method) => method.providerId === bank.id || method.type === bank.name,

            );
            const isSelected = selectedBankId === bank.id;

            if (isAdded) {
              return (
                <div
                  key={bank.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black ${bank.color}`}>
                      {bank.short}
                    </div>
                    <div>
                      <span className="block font-bold text-sm text-gray-900 dark:text-white">
                        {bank.name}
                      </span>
                      <span className="text-[11px] font-medium text-gray-400">Already Added</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              );
            }

            return (
              <button
                key={bank.id}
                type="button"
                onClick={() => setSelectedBankId(bank.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all cursor-pointer border-2 ${isSelected
                    ? "border-[#F26A1C] ring-4 ring-orange-500/10"
                    : "border-transparent dark:border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black ${bank.color}`}>
                    {bank.short}
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {bank.name}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? "bg-[#F26A1C]" : "bg-gray-200 dark:bg-gray-800"
                }`}>
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              </button>
            );
          })}

          <div className="mt-8 space-y-5 rounded-[28px] bg-white dark:bg-gray-900 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
            <div className="space-y-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-gray-400 px-1">
                Account Holder
              </label>
              <input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4 text-[15px] font-bold text-gray-900 dark:text-white outline-none transition-all focus:border-[#F26A1C] focus:ring-2 focus:ring-orange-500/10 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-gray-400 px-1">
                Account / Phone Number
              </label>
              <input
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                placeholder="+2519..."
                className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4 text-[15px] font-bold text-gray-900 dark:text-white outline-none transition-all focus:border-[#F26A1C] focus:ring-2 focus:ring-orange-500/10 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleAddPayment}
              disabled={!accountInfo.trim() || !accountHolder.trim()}
              className="w-full rounded-full bg-[#F26A1C] py-[18px] text-base font-black text-white shadow-[0_8px_24px_rgba(242,106,28,0.3)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Payout Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
