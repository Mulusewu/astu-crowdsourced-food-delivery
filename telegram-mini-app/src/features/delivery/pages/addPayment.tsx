import { useNavigate } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import { Header } from "@/components/profile/ProfileShared";
import { usePaymentStore } from "@/store/paymentStore";

const AVAILABLE_BANKS = [
  {
    id: "cbe-birr",
    name: "CBE Birr",
    logo: "https://combanketh.et/cbe_logo.png",
  },
  {
    id: "amole",
    name: "Amole",
    logo: "https://dashenbanksc.com/wp-content/uploads/2021/04/amole-logo.png",
  },
  {
    id: "awash-birr",
    name: "Awash Birr",
    logo: "https://awashbank.com/wp-content/uploads/2020/11/awash-logo.png",
  },
];

export default function AddPayment() {
  const navigate = useNavigate();
  const { paymentMethods, addPaymentMethod } = usePaymentStore();

  const handleAddPayment = (bank: typeof AVAILABLE_BANKS[0]) => {
    addPaymentMethod({
      id: Math.random().toString(36).substr(2, 9),
      type: bank.name,
      accountInfo: "Linked Account", // Placeholder as per requirements
    });
    navigate(-1);
  };

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
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
          {AVAILABLE_BANKS.map((bank) => {
            const isAdded = paymentMethods.some(
              (method) => method.type === bank.name
            );

            if (isAdded) {
              return (
                <div
                  key={bank.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 cursor-default shadow-sm border border-gray-50 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="h-8 object-contain bg-orange-50/50 p-1 rounded-md"
                    />
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
                onClick={() => handleAddPayment(bank)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-sm border border-gray-50 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="h-8 object-contain"
                  />
                </div>
                <div className="w-5 h-5 bg-[#F26A1C] rounded-full flex items-center justify-center">
                  <Plus size={14} className="text-white" strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
