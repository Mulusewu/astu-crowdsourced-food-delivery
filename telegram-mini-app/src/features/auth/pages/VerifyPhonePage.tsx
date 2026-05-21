/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/endpoints/auth"; 

// Backend OTP is 6 digits long.
const verifyPhoneSchema = z.object({
  otp: z.string().length(6, "Please enter a valid 6-digit code"),
});

type VerifyPhoneData = z.infer<typeof verifyPhoneSchema>;

export default function VerifyPhonePage() {
  const navigate = useNavigate();
  // Extract the phone number from the URL parameter (e.g. /verify-phone/0911223344)
  const { token: phoneNumber } = useParams<{ token: string }>(); 
  
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VerifyPhoneData>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp") || "";
  const displayPhone = phoneNumber ? decodeURIComponent(phoneNumber) : "your phone";

  // Timer for resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0 && !isResendActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendActive(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isResendActive]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    // Pad to 6
    const newOtpArr = otpValue.padEnd(6, " ").split("");
    newOtpArr[index] = value.slice(-1) || " ";
    
    const newOtpStr = newOtpArr.join("").trim();
    setValue("otp", newOtpStr, { shouldValidate: true });

    // Auto-focus next input (up to index 5)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6);
    setValue("otp", pastedNumbers, { shouldValidate: true });
    
    // Auto-focus last filled input
    const focusIndex = Math.min(5, pastedNumbers.length - 1);
    const input = document.getElementById(`otp-${Math.max(0, focusIndex)}`);
    input?.focus();
  };

  const onSubmit = async (data: VerifyPhoneData) => {
    setApiError(null);
    if (!phoneNumber) {
      setApiError("Phone identifier missing from URL.");
      return;
    }

    try {
      // Connect directly to backend authentication endpoint
      await authApi.verifyPhone({ phoneNumber: decodeURIComponent(phoneNumber), otp: data.otp });
      
      toast.success("Phone verified successfully! Please log in.");
      navigate(ROUTES.AUTH); // Route back to the Sign-in page
    } catch (err: any) {
      // Extract specific backend error (e.g. "OTP expired or invalid")
      setApiError(err.response?.data?.message || err.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) return;
    setIsResending(true);
    setApiError(null);

    try {
      // Connect directly to backend resend endpoint
      // Our backend resendVerification uses unified `identifier` (Email OR Phone)
      await authApi.resendVerification(decodeURIComponent(phoneNumber));
      
      setTimer(60);
      setIsResendActive(false);
      setValue("otp", "");
      document.getElementById("otp-0")?.focus();
      toast.success("A new 6-digit code was sent successfully via SMS!");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center pt-8 px-4">
      <style>{`
        @keyframes ride { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes dash { 0% { stroke-dashoffset: 20; opacity: 0.4; } 50% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0.4; } }
        .scooter-ride { animation: ride 0.25s ease-in-out infinite; }
        .motion-line { stroke-dasharray: 10 5; animation: dash 0.4s linear infinite; }
      `}</style>

      {/* Back Button */}
      <div className="w-full max-w-[340px] flex justify-start mb-4">
        <Link to={ROUTES.AUTH} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="w-full max-w-[340px] flex flex-col items-center">
        {/* LOGO SECTION - Vendor Specific */}
        <div className="relative flex items-center justify-center w-full mb-8 mt-2 pr-6">
          <div className="flex flex-col items-start mr-2">
            <span className="text-[44px] font-black text-black leading-[0.8] tracking-tight drop-shadow-md">ASTU</span>
            <span className="text-[52px] font-black text-[#F26A1C] leading-[0.8] tracking-tight drop-shadow-md">EATS</span>
          </div>
          <div className="flex flex-col items-center -mt-12 -mb-2">
            <div className="flex flex-col items-center">
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F26A1C] scooter-ride">
                <path d="M5 45H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0s' }} />
                <path d="M2 55H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0.1s' }} />
                <path d="M8 65H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0.25s' }} />
                <path d="M95 75V45L88 40H75L68 55H35V65C35 70 40 75 45 75H95Z" fill="currentColor" />
                <path d="M95 45L105 45L108 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M102 40H112" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <circle cx="65" cy="22" r="7" fill="currentColor" />
                <path d="M58 29H72L75 45L68 60H55L52 45L58 29Z" fill="currentColor" />
                <path d="M72 40L88 43" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="28" y="35" width="22" height="22" rx="2" fill="currentColor" />
                <circle cx="42" cy="80" r="10" stroke="currentColor" strokeWidth="6" />
                <circle cx="95" cy="80" r="10" stroke="currentColor" strokeWidth="6" />
                <circle cx="42" cy="80" r="2" fill="white" />
                <circle cx="95" cy="80" r="2" fill="white" />
              </svg>
              <span className="text-[#F26A1C] text-[24px] font-black italic tracking-tight -mt-2">Vendor</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Phone Verification</h1>
          <p className="text-[15px] font-medium text-gray-500">
            We've sent an SMS code to <br/>
            <span className="font-bold text-gray-800">{displayPhone}</span>
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-4">
            <label className="text-[17px] font-bold text-gray-900 ml-1 block text-center">
              Enter 6-digit code
            </label>
            
            <input type="hidden" {...register("otp")} />
            
            <div className="flex justify-center gap-1.5" onPaste={handlePaste}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={otpValue[index] || ""}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`
                    w-11 h-12 text-center text-xl font-black bg-white
                    border rounded-[8px] transition-all
                    focus:outline-none focus:border-[#F26A1C] text-gray-900
                    ${errors.otp || apiError ? "border-red-500" : "border-gray-200"}
                  `}
                  disabled={isSubmitting}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="flex justify-center text-center h-4">
              {errors.otp ? (
                <p className="text-xs text-red-500 font-semibold">{errors.otp.message}</p>
              ) : apiError ? (
                <p className="text-xs text-red-500 font-semibold">{apiError}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-sm">
            <span className="font-medium text-gray-500">Didn't receive SMS?</span>
            {isResendActive ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || isSubmitting}
                className="font-bold text-[#F26A1C] hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            ) : (
              <span className="font-semibold text-gray-400">
                Resend in {formatTime(timer)}
              </span>
            )}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || otpValue.length !== 6}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm SMS"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}