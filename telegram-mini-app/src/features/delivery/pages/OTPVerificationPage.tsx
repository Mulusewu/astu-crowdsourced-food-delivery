import React, { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useOrderStore } from "@/store/orders/orderStore";

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { activeOrders, currentOrder, fetchOrderById, completeOrder, isLoading } =
    useOrderStore();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const order =
    activeOrders.find((item) => item.id === orderId) ??
    (currentOrder?.id === orderId ? currentOrder : null);

  useEffect(() => {
    if (orderId && !order) {
      fetchOrderById(orderId);
    }
  }, [orderId, order, fetchOrderById]);

  const handleBack = () => {
    navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, { orderId }));
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste scenario roughly
      const pasted = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (index + i < 4) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus the last filled input
      const lastIndex = Math.min(index + pasted.length, 3);
      inputRefs[lastIndex]?.current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Auto-focus previous input on Backspace
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleConfirm = async () => {
    const otpValue = otp.join("");
    if (!orderId) return;

    if (otpValue.length !== 6) {
      setError("Enter the full 6-digit OTP.");
      return;
    }

    setError("");
    await completeOrder(orderId, otpValue);
    navigate(ROUTES.DELIVERY.HISTORY.LIST);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6">
      {/* Top Header - Back Button */}
      <div className="mt-14 mb-10">
        <button
          onClick={handleBack}
          className="w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-orange-100 border border-orange-200 text-orange-500 hover:bg-orange-200 transition-colors"
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
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-black mb-4">
        Enter OTP
      </h1>

      {/* Description */}
      <p className="text-gray-500 text-base leading-snug mb-10">
        {order ? `Verify order #${order.shortId}.` : "Confirm this delivery."}
        <br />
        Confirm Delivery
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-between items-center mb-6 max-w-sm w-full mx-auto">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(index, e.target.value.replace(/[^0-9]/g, ""))
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-[65px] h-[65px] border border-gray-400 rounded-2xl text-center text-3xl font-semibold text-gray-800 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
        ))}
      </div>

      {error && (
        <p className="mb-4 text-center text-sm font-medium text-red-500">{error}</p>
      )}

      {/* Resend Prompt */}
      <div className="text-center mb-10">
        <span className="text-gray-500 font-semibold text-base mr-1">
          Haven't Received The OTP?
        </span>
        <button
          type="button"
          onClick={() => setError("Ask the customer to share the latest OTP.")}
          className="text-gray-400 font-bold text-base hover:text-gray-600 focus:outline-none transition-colors tracking-wide"
        >
          RESEND
        </button>
      </div>

      {/* Confirm Button */}
      <div className="mt-auto mb-16 flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full max-w-[280px] bg-[#f97316] hover:bg-orange-600 text-white font-bold text-xl py-[16px] rounded-[30px] shadow-sm transition-colors active:scale-[0.98]"
        >
          {isLoading ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
