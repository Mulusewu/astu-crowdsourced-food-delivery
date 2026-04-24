import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9CA3AF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const PaymentInformationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("telebirr");

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6">

      {/* Header */}
      <div className="mt-14 mb-12 flex items-center">
        <button
          onClick={handleBack}
          className="w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-orange-100 border border-orange-200 text-orange-500 hover:bg-orange-200 transition-colors flex-shrink-0"
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[22px] font-bold text-black pr-10 tracking-tight">
          Payment Information
        </h1>
      </div>

      {/* Payment Methods List */}
      <div className="flex flex-col gap-8">

        {/* Telebirr Option */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setSelectedMethod("telebirr")}
        >
          {/* Radio Button */}
          <div className="flex-shrink-0 mr-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'telebirr' ? 'border-[#f97316]' : 'border-gray-400'}`}>
              {selectedMethod === 'telebirr' && (
                <div className="w-3 h-3 bg-[#f97316] rounded-full"></div>
              )}
            </div>
          </div>

          {/* Logo (Placeholder representation) */}
          <div className="flex items-center justify-center mr-auto">
            {/* Replace with actual image: <img src="/telebirr.png" alt="Telebirr" className="h-8 object-contain" /> */}
            <div className="flex flex-col ml-1">
              <span className="text-[#0077b6] font-bold text-xs leading-none">ቴሌብር</span>
              <span className="text-[#fb8500] font-bold text-[14px] leading-tight">telebirr</span>
            </div>
            {/* Mocking the blue star logo element visually */}
            <div className="w-8 h-8 ml-[-65px] mr-[35px] opacity-20 bg-blue-500 rounded-full blur-sm absolute -z-10"></div>
          </div>

          {/* Account Detail */}
          <span className="text-gray-500 text-[15px] mr-4">
            +251912345678
          </span>
          <ChevronRight />
        </div>

        {/* CBE Option */}
        <div
          className="flex items-center cursor-pointer pt-2"
          onClick={() => setSelectedMethod("cbe")}
        >
          {/* Radio Button */}
          <div className="flex-shrink-0 mr-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cbe' ? 'border-[#f97316]' : 'border-[#f97316]'}`}>
              {selectedMethod === 'cbe' && (
                <div className="w-3 h-3 bg-[#f97316] rounded-full"></div>
              )}
            </div>
          </div>

          {/* Logo (Placeholder representation) */}
          <div className="flex items-center justify-center mr-auto">
            {/* Replace with actual image: <img src="/cbe.png" alt="CBE" className="h-10 object-contain" /> */}
            <div className="flex flex-col justify-center items-start">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#8c6b4a] opacity-80 mr-2 flex items-center justify-center text-[8px] text-white font-serif">CBE</div>
                <div className="flex flex-col">
                  <span className="text-[#8c6b4a] font-serif text-[6px] uppercase leading-none">የኢትዮጵያ ንግድ ባንክ</span>
                  <span className="text-[#8c6b4a] font-serif text-[8px] font-bold uppercase leading-tight">Commercial Bank of Ethiopia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Detail */}
          <span className="text-gray-500 text-[15px] mr-4">
            1000123456789
          </span>
          <ChevronRight />
        </div>

        {/* Add Payment Method */}
        <div
          className="flex items-center cursor-pointer mt-6"
          onClick={() => navigate(ROUTES.DELIVERY.PAYMENT_ADD)}
        >
          <span className="text-gray-500 text-[16px] mr-auto pl-10 font-medium">
            Add Payment Method
          </span>
          <ChevronRight />
        </div>

      </div>

    </div>
  );
};

export default PaymentInformationPage;
