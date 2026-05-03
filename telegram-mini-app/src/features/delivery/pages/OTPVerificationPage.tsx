import { useEffect, useRef, useState, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

import { ROUTES, buildRoute } from "@/routes/routePaths";
import { useOrderStore } from "@/store/orders/orderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { 
    activeOrders, 
    currentOrder, 
    fetchOrderById, 
    completeOrder, 
    isLoading,
    error: storeError,
    clearError
  } = useOrderStore();
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const order = useMemo(() => 
    activeOrders.find((item) => item.id === orderId) ??
    (currentOrder?.id === orderId ? currentOrder : null),
  [activeOrders, currentOrder, orderId]);

  useEffect(() => {
    if (orderId && !order) {
      fetchOrderById(orderId);
    }
  }, [orderId, order, fetchOrderById]);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleBack = () => {
    navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, { orderId }));
  };

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    if (value.length > 1) {
      const pasted = value.slice(0, 6 - index).split("");
      pasted.forEach((char, i) => {
        newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pasted.length, 5);
      inputRefs[nextIndex]?.current?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleConfirm = async () => {
    const otpValue = otp.join("");
    if (!orderId) return;

    if (otpValue.length !== 6) {
      setLocalError("Please enter the 6-digit code provided by the customer.");
      return;
    }

    setLocalError("");
    await completeOrder(orderId, otpValue);
    
    // The store updates and if successful, we should navigate
    // Checking for error after completion
  };

  // Effect to navigate on success
  useEffect(() => {
    if (!isLoading && !storeError && otp.join("").length === 6 && order?.status === "DELIVERED") {
       navigate(ROUTES.DELIVERY.HISTORY.LIST);
    }
  }, [isLoading, storeError, order?.status, navigate]);

  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col items-center justify-center px-8 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Order Context Lost</h2>
        <Button onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)} className="mt-6 bg-[#F26A1C] text-white rounded-full px-8 py-3 font-bold">
          Back to Active Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col px-6 font-sans">
      {/* Header */}
      <header className="pt-[max(1.5rem,env(safe-area-inset-top))] pb-8">
        <button
          onClick={handleBack}
          className="h-11 w-11 flex items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
      </header>

      <div className="flex-1 max-w-[400px] mx-auto w-full">
        {/* Shield Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 rounded-[28px] bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600">
            <ShieldCheck size={40} strokeWidth={2} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Delivery Verification</h1>
          <p className="mt-3 text-base font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
            Please enter the 6-digit verification code from <b>{order?.customer.fullName}</b> to complete the delivery.
          </p>
        </div>

        {/* OTP Input Grid */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={cn(
                "w-full aspect-square border-2 rounded-2xl bg-white dark:bg-gray-900 text-center text-2xl font-black text-gray-900 dark:text-white transition-all outline-none",
                digit ? "border-[#F26A1C]" : "border-gray-100 dark:border-gray-800 focus:border-orange-200 dark:focus:border-orange-900/50"
              )}
            />
          ))}
        </div>

        {(localError || storeError) && (
          <div className="flex items-center gap-2 justify-center p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500 mb-8 border border-red-100 dark:border-red-900/30">
            <AlertCircle size={18} />
            <p className="text-sm font-bold">{localError || storeError}</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4">Verification Steps</p>
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Customer receives code on arrival</span>
             </div>
             <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Input code here to verify handover</span>
             </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pb-[max(2rem,env(safe-area-inset-bottom))] mt-8">
        <Button
          onClick={handleConfirm}
          disabled={isLoading || otp.join("").length < 6}
          className="w-full h-16 rounded-full bg-[#F26A1C] hover:bg-[#e05d15] text-white text-lg font-black shadow-[0_12px_32px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Verifying...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              Complete Delivery
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
