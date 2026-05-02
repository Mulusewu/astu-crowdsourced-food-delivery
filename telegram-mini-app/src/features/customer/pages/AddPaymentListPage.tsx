import { useNavigate } from "react-router-dom";
import { Check, Plus, Wallet } from "lucide-react";
import { Header } from "../components/profileShared";
import { usePaymentStore } from "@/store/paymentStore";
import { ROUTES } from "@/routes/routePaths";

const SUPPORTED_PROVIDERS = [
  {
    id: "telebirr",
    name: "Telebirr",
    logo: "https://telebirr.et/wp-content/uploads/2021/05/telebirr-logo.png",
    route: `${ROUTES.CUSTOMER.PAYMENT.TELEBIRR_FORM || "/customer/profile/payment/add/telebirr"}?provider=telebirr`,
  },
  {
    id: "cbe_birr",
    name: "CBE Birr",
    logo: "https://combanketh.et/cbe_logo.png",
    route: `${ROUTES.CUSTOMER.PAYMENT.TELEBIRR_FORM || "/customer/profile/payment/add/telebirr"}?provider=cbe_birr`,
  },
];

export default function AddPaymentListPage() {
  const navigate = useNavigate();
  const { paymentMethods } = usePaymentStore();

  return (
    <div className="px-5 font-sans flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-10">
      <Header title="Add Payment Method" showBack />

      <div className="flex-1 mt-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Wallet size={16} className="text-[#F26A1C]" />
            <p className="text-[13px] font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Available Methods
            </p>
          </div>

          <div className="space-y-3">
            {SUPPORTED_PROVIDERS.map((provider) => {
              // Check if already added
              const isAdded = paymentMethods.some(
                (m) => m.type.toLowerCase() === provider.name.toLowerCase()
              );

              return (
                <button
                  key={provider.id}
                  onClick={() => !isAdded && provider.route !== "#" && navigate(provider.route)}
                  disabled={isAdded || provider.route === "#"}
                  className={`w-full flex items-center justify-between p-4 rounded-[22px] border transition-all ${
                    isAdded
                      ? "bg-gray-50/50 dark:bg-gray-900/50 border-transparent cursor-default"
                      : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(242,106,28,0.08)] active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-[16px] shadow-sm flex items-center justify-center p-2 border border-gray-50 dark:border-gray-700">
                      <img
                        src={provider.logo}
                        alt={provider.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-black text-[15px] ${isAdded ? "text-gray-500" : "text-gray-900 dark:text-white"}`}>
                        {provider.name}
                      </h3>
                      <p className="text-[12px] font-semibold text-gray-400">
                        {isAdded ? "Already linked" : "Link account"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isAdded
                        ? "bg-gray-200 dark:bg-gray-800"
                        : "bg-[#FFF4ED] dark:bg-orange-900/30 text-[#F26A1C]"
                    }`}
                  >
                    {isAdded ? (
                      <Check size={16} className="text-gray-400" strokeWidth={3} />
                    ) : (
                      <Plus size={18} strokeWidth={3} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
