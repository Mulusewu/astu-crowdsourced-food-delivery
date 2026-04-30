import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard, ShieldCheck, Trash2 } from "lucide-react";
import { Header } from "../components/profileShared";
import { usePaymentStore } from "@/store/paymentStore";
import { ROUTES } from "@/routes/routePaths";

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const { paymentMethods, setSelectedPayment, removePaymentMethod } = usePaymentStore();
  const selectedMethod = paymentMethods.find((m) => m.isSelected);

  return (
    <div className="px-5 font-sans flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Payment Information" showBack />

      <div className="flex-1 mt-6 space-y-4">
        {/* Active method banner */}
        <div className="rounded-[22px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#F26A1C] shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Active payment method
              </p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                {selectedMethod
                  ? `${selectedMethod.type} • ${selectedMethod.accountInfo}`
                  : "No method selected — tap one below to set default"}
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {paymentMethods.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="font-bold text-gray-900 dark:text-white">No payment methods yet</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add a payment method to start placing orders.
            </p>
          </div>
        )}

        {/* Methods list */}
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[20px] border ${
              method.isSelected
                ? "border-[#F26A1C] dark:border-[#F26A1C]/60 shadow-sm"
                : "border-gray-100 dark:border-gray-800"
            } active:scale-[0.98] transition-all`}
          >
            <button
              type="button"
              onClick={() => setSelectedPayment(method.id)}
              className="flex flex-1 items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-4">
                {/* Radio dot */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    method.isSelected
                      ? "border-[#F26A1C]"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {method.isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F26A1C]" />
                  )}
                </div>
                {/* Icon + label */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      method.type === "CBE Birr" ? "bg-blue-50" : "bg-orange-50"
                    }`}
                  >
                    <CreditCard
                      size={16}
                      className={
                        method.type === "CBE Birr" ? "text-blue-600" : "text-[#F26A1C]"
                      }
                    />
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-gray-900 dark:text-white">
                      {method.type}
                    </span>
                    <span className="block text-xs font-semibold text-gray-500">
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
            {/* Remove */}
            <button
              type="button"
              onClick={() => removePaymentMethod(method.id)}
              className="ml-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove ${method.type}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* Add new method */}
        <button
          onClick={() => navigate(ROUTES.CUSTOMER.PAYMENT.ADD_METHOD)}
          className="w-full flex items-center justify-between rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-gray-800 dark:bg-gray-900 active:opacity-70 transition-opacity"
        >
          <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
            Add Payment Method
          </span>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
