import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard } from "lucide-react";
import { Header } from "../components/profileShared";

export default function PaymentMethodsPage() {
  const navigate = useNavigate();

  return (
    <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Payment Information" showBack />

      <div className="flex-1 mt-6 space-y-4">
        <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[20px] border border-orange-200 dark:border-orange-900/50 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-full border-2 border-[#F26A1C] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F26A1C]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <CreditCard size={16} className="text-blue-600" />
              </div>
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                CBE Birr
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              +251912345678
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </label>

        {/* ... Include the other payment method card here ... */}

        <button
          onClick={() => navigate("/payment/methods/add")}
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
