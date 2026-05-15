import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useOrderStore } from "@/store/orders/orderStore";
import { ROUTES } from "@/routes/routePaths";

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  
  // Backend Integration Hooks
  const { completeOrder } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CRITICAL FIX: Changed to 6 digits to match Backend schema
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Authorization/Route guard
  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid delivery session.");
      navigate(-1);
    }
  }, [orderId, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste scenario roughly (Adapted for 6 digits)
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus the last filled input
      const lastIndex = Math.min(index + pasted.length, 5);
      inputRefs[lastIndex]?.current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Auto-focus previous input on Backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleConfirm = async () => {
    const otpValue = otp.join('');
    
    // Zod Backend requires exactly 6 digits
    if (otpValue.length !== 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    if (!orderId) return;

    setIsSubmitting(true);
    try {
      // Execute the cryptographic handshake with the backend
      await completeOrder(orderId, otpValue);
      
      toast.success("Delivery Confirmed! Payout initiated.");
      
      // Navigate to a success screen or back to dashboard
      navigate(ROUTES.DELIVERY.DASHBOARD);
      
    } catch (error: any) {
      // The store catches the 422 or 409 error from the backend
      toast.error(error.message || "Invalid OTP Code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col px-6 font-sans">
      
      {/* Top Header - Back Button */}
      <div className="mt-14 mb-10">
        <button 
          onClick={handleBack}
          className="w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-orange-50 dark:bg-gray-900 border border-orange-100 dark:border-gray-800 text-[#F26A1C] hover:bg-orange-100 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
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
      <h1 className="text-[28px] font-black text-gray-900 dark:text-white leading-tight mb-3">
        Delivery Handshake
      </h1>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 text-[14px] font-medium leading-relaxed mb-10">
        Please ask the customer to read you the <strong className="text-[#F26A1C]">6-digit PIN</strong> displayed on their screen to confirm you have handed over the food.
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-between items-center mb-10 w-full max-w-md mx-auto gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-full aspect-square border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-[16px] text-center text-2xl font-black text-[#F26A1C] shadow-sm focus:border-[#F26A1C] focus:ring-4 focus:ring-orange-500/20 dark:focus:ring-orange-500/10 outline-none transition-all"
          />
        ))}
      </div>

      {/* Confirm Button */}
      <div className="mt-auto mb-16 flex justify-center w-full max-w-md mx-auto">
        <button 
          onClick={handleConfirm}
          disabled={isSubmitting || otp.join('').length !== 6}
          className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[17px] py-[18px] rounded-[20px] shadow-[0_8px_24px_rgba(242,106,28,0.25)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            "Confirm Handshake"
          )}
        </button>
      </div>

    </div>
  );
};

export default OTPVerificationPage;