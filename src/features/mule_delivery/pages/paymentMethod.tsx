import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronRight, ShieldCheck, Trash2, ArrowLeft, Plus } from "lucide-react";


import { usePaymentStore } from "@/store/paymentStore";
import { ROUTES } from "@/routes/routePaths";

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { paymentMethods, setSelectedPayment, removePaymentMethod } = usePaymentStore();
  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.isSelected),
    [paymentMethods],
  );

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col min-h-screen">
      <header className="px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6">
        <div className="relative flex items-center justify-center h-12">
          <button
            onClick={() => navigate(ROUTES.DELIVERY.PROFILE)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#FFEFE5] dark:bg-orange-950/30 text-[#F26A1C] transition hover:bg-orange-200 dark:hover:bg-orange-900/50 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="text-[22px] font-black text-black dark:text-white tracking-tight">
            Payout Settings
          </h1>
        </div>
      </header>

      <div className="flex-1 mt-2 space-y-4 px-5">
        <div className="rounded-[28px] bg-white dark:bg-gray-900 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
              <ShieldCheck className="text-[#F26A1C]" size={24} />
            </div>
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">
                Active Payout Method
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                {selectedMethod
                  ? `${selectedMethod.type} • ${selectedMethod.accountInfo}`
                  : "Setup a payment account to receive funds."}
              </p>
            </div>
          </div>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="font-bold text-gray-900 dark:text-white">No payment methods yet</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add a payout option before connecting this screen to live backend settlement.
            </p>
          </div>
        ) : null}

        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-[28px] border-2 transition-all ${method.isSelected
                ? "border-[#F26A1C] shadow-[0_8px_24px_rgba(242,106,28,0.08)]"
                : "border-gray-50 dark:border-gray-800"
              }`}
          >
            <button
              type="button"
              onClick={() => setSelectedPayment(method.id)}
              className="flex flex-1 items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${method.isSelected
                      ? "border-[#F26A1C]"
                      : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {method.isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F26A1C]" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xs ${method.type.includes("CBE") ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      }`}
                  >
                    {method.type.includes("CBE") ? "CBE" : "TB"}
                  </div>
                  <div>
                    <span className="block font-black text-[15px] text-gray-900 dark:text-white">
                      {method.type}
                    </span>
                    <span className="block text-xs font-bold text-gray-400 mt-0.5 tracking-tight">
                      {method.accountInfo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isSelected && (
                  <span className="rounded-full bg-[#FFF0E6] px-2.5 py-1 text-[11px] font-bold text-[#F26A1C]">
                    Default
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => removePaymentMethod(method.id)}
              className="ml-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500"
              aria-label={`Remove ${method.type}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button
          onClick={() => navigate(ROUTES.DELIVERY.PAYMENT_ADD)}
          className="w-full flex items-center justify-between rounded-[24px] bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 active:opacity-70 transition-opacity mt-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
              <Plus className="text-[#F26A1C]" size={18} />
            </div>
            <span className="font-black text-sm text-gray-700 dark:text-gray-300">
              Add Payment Method
            </span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>


      </div>
    </div>
  );
}
