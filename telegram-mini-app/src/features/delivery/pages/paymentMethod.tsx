import { useNavigate } from "react-router-dom";
import { CreditCard, ChevronRight } from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";
import { Header } from "@/components/profile/ProfileShared";

export default function PaymentMethods() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans flex flex-col">
      <Header
        title="Payment Information"
        showBack
        onBackClick={() => navigate(-1)}
      />

      <div className="flex-1 mt-6 space-y-4 px-5">
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

        <label className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[20px] border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                <CreditCard size={16} className="text-[#F26A1C]" />
              </div>
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                Amole
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              1000123456789
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </label>

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
      <BottomNav />
    </div>
  );
}
