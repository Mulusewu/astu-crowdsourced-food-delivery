import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import { Header } from "@/features/shared/components/ProfileShared";
import { usePaymentStore } from "@/store/paymentStore";
import { ROUTES } from "@/routes/routePaths";

const AVAILABLE_BANKS = [
  {
    id: "cbe-birr",
    name: "CBE Birr",
    short: "CBE",
  },
  {
    id: "amole",
    name: "Amole",
    short: "AM",
  },
  {
    id: "awash-birr",
    name: "Awash Birr",
    short: "AW",
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

      <div className="px-5">
        <p className="text-[11px] font-bold text-gray-500 mt-2 mb-6 px-1">
          Choose Payment Method To Add
        </p>

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
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default shadow-sm border border-gray-50 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-[#F26A1C]">
                      {bank.short}
                    </div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {bank.name}
                    </span>
                  </div>
                  <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
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
                className={`w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-sm border ${isSelected
                    ? "border-[#F26A1C]"
                    : "border-gray-50 dark:border-gray-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-[#F26A1C]">
                    {bank.short}
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {bank.name}
                  </span>
                </div>
                <div className="w-5 h-5 bg-[#F26A1C] rounded-full flex items-center justify-center">
                  {isSelected ? (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  ) : (
                    <Plus size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}

          <div className="rounded-[20px] bg-white p-4 shadow-sm border border-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <label className="block">
              <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
                Account Holder
              </span>
              <input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Enter account holder name"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#FFF8F4] px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#F26A1C]"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
                Account / Phone Number
              </span>
              <input
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                placeholder="Enter linked wallet or bank number"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#FFF8F4] px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#F26A1C]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleAddPayment}
            disabled={!accountInfo.trim() || !accountHolder.trim()}
            className="w-full rounded-[18px] bg-[#F26A1C] py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
