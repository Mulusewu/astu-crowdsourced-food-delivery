import { useNavigate } from "react-router-dom";
import { CreditCard, ChevronRight } from "lucide-react";
import { Header } from "@/components/profile/ProfileShared";
import { usePaymentStore } from "@/store/paymentStore";

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { paymentMethods, setSelectedPayment } = usePaymentStore();

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header
        title="Payment Information"
        showBack
        onBackClick={() => navigate(-1)}
      />

      <div className="flex-1 mt-6 space-y-4 px-5">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            onClick={() => setSelectedPayment(method.id)}
            className={`flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[20px] border ${method.isSelected
              ? "border-[#F26A1C] dark:border-[#F26A1C]/60 shadow-sm"
              : "border-gray-100 dark:border-gray-800"
              } cursor-pointer active:scale-[0.98] transition-all`}
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
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${method.type === "CBE Birr" ? "bg-blue-50" : "bg-orange-50"
                  }`}>
                  <CreditCard
                    size={16}
                    className={
                      method.type === "CBE Birr"
                        ? "text-blue-600"
                        : "text-[#F26A1C]"
                    }
                  />
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {method.type}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                {method.accountInfo}
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </label>
        ))}

        <button
          onClick={() => navigate("/delivery/profile/payment/add")}
          className="w-full flex items-center justify-between p-4 bg-transparent active:opacity-70 transition-opacity mt-4"
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

