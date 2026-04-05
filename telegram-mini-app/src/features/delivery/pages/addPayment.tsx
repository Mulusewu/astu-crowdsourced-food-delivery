import { useNavigate } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";
import { Header } from "@/components/profile/ProfileShared";

export default function AddPayment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans flex flex-col">
      <Header
        title="Add Payment Method"
        showBack
        onBackClick={() => navigate(-1)}
      />

      <div className="px-5">
        <p className="text-[11px] font-bold text-gray-500 mt-2 mb-6 px-1">
          Choose Payment Method To Add
        </p>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default shadow-sm border border-gray-50 dark:border-gray-800">
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

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default shadow-sm border border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src="https://dashenbanksc.com/wp-content/uploads/2021/04/amole-logo.png"
                alt="Amole"
                className="h-8 object-contain"
              />
            </div>
            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
          </div>

          <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-sm border border-gray-50 dark:border-gray-800">
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
      <BottomNav />
    </div>
  );
}
