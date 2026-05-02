import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const verifyEmailSchema = z.object({
  otp: z.string().length(4, "Please enter a valid 4-digit code"),
});

type VerifyEmailData = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { token } = useParams(); // token might be the email encoded
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
  } = useForm<VerifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp") || "";

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

  // Handle individual input changes to update the hidden react-hook-form field
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtpArr = otpValue.padEnd(4, " ").split("");
    newOtpArr[index] = value.slice(-1) || " ";
    
    const newOtpStr = newOtpArr.join("").trim();
    setValue("otp", newOtpStr, { shouldValidate: true });

    // Auto-focus next input
    if (value && index < 3) {
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
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 4);
    setValue("otp", pastedNumbers, { shouldValidate: true });
    
    // Auto-focus last filled input
    const focusIndex = Math.min(3, pastedNumbers.length - 1);
    const input = document.getElementById(`otp-${Math.max(0, focusIndex)}`);
    input?.focus();
  };

  const onSubmit = async (data: VerifyEmailData) => {
    setApiError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock verification
      if (data.otp === "1234" || token) {
        toast.success("Email verified successfully! Please log in.");
        navigate(ROUTES.AUTH);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (err: any) {
      setApiError(err.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setApiError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimer(60);
      setIsResendActive(false);
      setValue("otp", "");
      document.getElementById("otp-0")?.focus();
      toast.success("Code resent successfully!");
    } catch (err) {
      setApiError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const displayEmail = token ? decodeURIComponent(token) : "your email";

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center pt-8 px-4">
      <style>{`
        @keyframes ride {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes dash {
          0% { stroke-dashoffset: 20; opacity: 0.4; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.4; }
        }
        .scooter-ride { animation: ride 0.25s ease-in-out infinite; }
        .motion-line { 
          stroke-dasharray: 10 5; 
          animation: dash 0.4s linear infinite; 
        }
      `}</style>

      {/* Back Button */}
      <div className="w-full max-w-[340px] flex justify-start mb-4">
        <Link to={ROUTES.AUTH} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="w-full max-w-[340px] flex flex-col items-center">
        {/* LOGO SECTION */}
        <div className="relative flex items-center justify-center w-full mb-8 mt-2 pr-6">
          <div className="flex flex-col items-start mr-2">
            <span className="text-[44px] font-black text-black leading-[0.8] tracking-tight drop-shadow-md">
              ASTU
            </span>
            <span className="text-[52px] font-black text-[#F26A1C] leading-[0.8] tracking-tight drop-shadow-md">
              EATS
            </span>
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
                <path d="M28 42H50" stroke="white" strokeWidth="1" opacity="0.4" />
                <circle cx="42" cy="80" r="10" stroke="currentColor" strokeWidth="6" />
                <circle cx="95" cy="80" r="10" stroke="currentColor" strokeWidth="6" />
                <circle cx="42" cy="80" r="2" fill="white" />
                <circle cx="95" cy="80" r="2" fill="white" />
              </svg>
              <span className="text-[#F26A1C] text-[26px] font-black italic tracking-tight -mt-2">
                Delivery
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Email Verification</h1>
          <p className="text-[15px] font-medium text-gray-500">
            We've sent a code to <br/>
            <span className="font-bold text-gray-800">{displayEmail}</span>
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-4">
            <label className="text-[17px] font-bold text-gray-900 ml-1 block text-center">
              Enter 4-digit code
            </label>
            
            <input type="hidden" {...register("otp")} />
            
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {[0, 1, 2, 3].map((index) => (
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
                    w-14 h-14 text-center text-2xl font-black bg-white
                    border rounded-[10px] transition-all
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
            <span className="font-medium text-gray-500">Didn't receive code?</span>
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
              disabled={isSubmitting || otpValue.length !== 4}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
