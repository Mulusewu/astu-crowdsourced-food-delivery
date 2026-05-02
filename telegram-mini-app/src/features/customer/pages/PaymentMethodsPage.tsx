import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard, ShieldCheck, Trash2, Plus } from "lucide-react";
import { Header } from "../components/profileShared";
import { usePaymentStore } from "@/store/paymentStore";
import { ROUTES } from "@/routes/routePaths";

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const { paymentMethods, setSelectedPayment, removePaymentMethod } = usePaymentStore();
  const selectedMethod = paymentMethods.find((m) => m.isSelected);

  return (
    <div className="px-5 font-sans flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-20">
      <Header title="Payment Information" showBack />

      <div className="flex-1 mt-6 space-y-6">
        {/* Active method banner */}
        <div className="rounded-[24px] bg-gradient-to-br from-[#F26A1C] to-[#e05d15] p-5 shadow-[0_8px_24px_rgba(242,106,28,0.25)] relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10" />
          <div className="absolute bottom-0 right-10 -mb-6 w-16 h-16 rounded-full bg-white opacity-10" />
          
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-white/80 uppercase tracking-wider mb-0.5">
                Default Payment
              </p>
              <p className="text-[16px] font-black text-white">
                {selectedMethod
                  ? `${selectedMethod.type} • ${selectedMethod.accountInfo}`
                  : "No default selected"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-[13px] font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Saved Methods
            </p>
          </div>

          {/* Empty state */}
          {paymentMethods.length === 0 && (
            <div className="rounded-[24px] border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <CreditCard size={28} className="text-gray-400" />
              </div>
              <p className="font-black text-[16px] text-gray-900 dark:text-white">No payment methods</p>
              <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 max-w-[200px]">
                Add a payment method to ensure seamless checkout.
              </p>
            </div>
          )}

          {/* Methods list */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`group flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[22px] border transition-all ${
                  method.isSelected
                    ? "border-[#F26A1C] shadow-[0_4px_16px_rgba(242,106,28,0.08)]"
                    : "border-gray-100 dark:border-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className="flex flex-1 items-center justify-between gap-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    {/* Radio dot */}
                    <div
                      className={`w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${
                        method.isSelected
                          ? "border-[#F26A1C]"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {method.isSelected && (
                         <div className="w-3 h-3 rounded-full bg-[#F26A1C]" />
                      )}
                    </div>
                    {/* Icon + label */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${
                          method.type === "CBE Birr" ? "bg-blue-50 text-blue-500" : "bg-[#FFF4ED] text-[#F26A1C]"
                        }`}
                      >
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <span className="block font-black text-[15px] text-gray-900 dark:text-white leading-tight">
                          {method.type}
                        </span>
                        <span className="block text-[12px] font-semibold text-gray-400 mt-0.5">
                          {method.accountInfo}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removePaymentMethod(method.id)}
                  className="ml-3 flex w-10 h-10 items-center justify-center rounded-[12px] text-gray-400 bg-gray-50 dark:bg-gray-800 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 active:scale-95 shrink-0"
                  aria-label={`Remove ${method.type}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Add new method */}
          <button
            onClick={() => navigate(ROUTES.CUSTOMER.PAYMENT.ADD_METHOD || "/customer/profile/payment/add")}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-[22px] border-2 border-dashed border-[#F26A1C]/30 bg-[#FFF4ED]/50 dark:bg-orange-900/10 p-5 text-[#F26A1C] hover:bg-[#FFF4ED] dark:hover:bg-orange-900/20 active:scale-[0.98] transition-all"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span className="font-bold text-[15px]">
              Add New Method
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
