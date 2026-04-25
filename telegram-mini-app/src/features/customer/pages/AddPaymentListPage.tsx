import { useNavigate } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import { Header } from "../components/profileShared"; // Adjust path to your shared components

export default function AddPaymentListPage() {
  const navigate = useNavigate();

  return (
    <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Add Payment Method" showBack />

      <p className="text-xs font-semibold text-gray-500 mt-2 mb-6 px-1">
        Choose Payment Method To Add
      </p>

      <div className="flex-1 space-y-4">
        {/* Telebirr (Already added state) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default">
          <div className="flex items-center gap-3">
            <img
              src="https://telebirr.et/wp-content/uploads/2021/05/telebirr-logo.png"
              alt="Telebirr"
              className="h-8 object-contain"
            />
          </div>
          <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* CBE (Already added state) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default">
          <div className="flex items-center gap-3">
            <img
              src="https://combanketh.et/cbe_logo.png"
              alt="CBE"
              className="h-8 object-contain bg-orange-50/50 p-1 rounded-md"
            />
          </div>
          <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Awash Birr / New Method (Available to add) */}
        <button
          onClick={() => navigate("/payment/telebirr-form")}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://awashbank.com/wp-content/uploads/2020/11/awash-logo.png"
              alt="Awash Birr"
              className="h-8 object-contain"
            />
          </div>
          <div className="w-5 h-5 bg-[#F26A1C] rounded-full flex items-center justify-center">
            <Plus size={14} className="text-white" strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  );
}
