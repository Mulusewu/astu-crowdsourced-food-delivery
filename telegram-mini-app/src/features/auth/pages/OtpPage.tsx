import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Smartphone,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandCard } from "@/components/brand/BrandCard";
import { Badge } from "@/components/ui/badge";

// OTP verification types
export type OTPType = "delivery" | "email" | "phone" | "login" | "transaction";
export type UserRole = "customer" | "vendor" | "delivery" | "admin";

interface OTPPageProps {
  // Core props
  type?: OTPType;
  role?: UserRole;

  // Data props
  recipientInfo?: string;
  amount?: number;
  orderId?: string;

  // Callback props
  onVerify?: (otp: string) => Promise<boolean>;
  onResend?: () => Promise<boolean>;
  onCancel?: () => void;

  // UI customization
  title?: string;
  description?: string;
  showTimer?: boolean;
  timerDuration?: number; // in seconds
}

export default function OTPPage({
  type = "delivery",
  recipientInfo,
  amount,
  orderId,
  onVerify,
  onResend,
  onCancel,
  title,
  description,
  showTimer = true,
  timerDuration = 60,
}: OTPPageProps) {
  const navigate = useNavigate();

  // State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(timerDuration);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Get config based on type and role
  const getConfig = () => {
    const configs = {
      delivery: {
        icon: <Smartphone size={32} className="text-primary" />,
        defaultTitle: "Delivery Verification",
        defaultDescription:
          "Enter OTP provided by customer to confirm delivery",
        recipientLabel: "Customer",
        successMessage: "Delivery confirmed!",
      },
      email: {
        icon: <Mail size={32} className="text-primary" />,
        defaultTitle: "Email Verification",
        defaultDescription: "Enter verification code sent to your email",
        recipientLabel: "Email",
        successMessage: "Email verified successfully!",
      },
      phone: {
        icon: <Smartphone size={32} className="text-primary" />,
        defaultTitle: "Phone Verification",
        defaultDescription: "Enter verification code sent to your phone",
        recipientLabel: "Phone",
        successMessage: "Phone verified successfully!",
      },
      login: {
        icon: <User size={32} className="text-primary" />,
        defaultTitle: "Login Verification",
        defaultDescription: "Enter the verification code to continue",
        recipientLabel: "Account",
        successMessage: "Login verified!",
      },
      transaction: {
        icon: <Smartphone size={32} className="text-primary" />,
        defaultTitle: "Transaction Verification",
        defaultDescription: "Enter OTP to confirm transaction",
        recipientLabel: "Transaction",
        successMessage: "Transaction confirmed!",
      },
    };
    return configs[type] || configs.delivery;
  };

  const config = getConfig();

  // Timer for resend OTP
  useEffect(() => {
    if (!showTimer) return;

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
  }, [timer, isResendActive, showTimer]);

  // Auto-submit when all digits are entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && !isVerifying && !success) {
      handleVerify();
    }
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null); // Clear error on input

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 4).split("");

    const newOtp = [...otp];
    pastedNumbers.forEach((num, idx) => {
      if (idx < 4) newOtp[idx] = num;
    });
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setError("Please enter a valid 4-digit code");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      let isValid = false;

      if (onVerify) {
        // Use custom verification handler
        isValid = await onVerify(otpString);
      } else {
        // Mock verification - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        isValid = otpString === "1234"; // Mock valid OTP
      }

      if (isValid) {
        setSuccess(true);
        // Auto redirect after success
        setTimeout(() => {
          if (type === "delivery") {
            navigate("/delivery/active");
          } else if (type === "email") {
            navigate("/signin");
          } else {
            navigate(-1);
          }
        }, 2000);
      } else {
        setAttempts((prev) => prev + 1);
        throw new Error(
          `Invalid OTP${attempts >= 2 ? ". Too many attempts" : ""}`,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);

    try {
      if (onResend) {
        await onResend();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Reset timer
      setTimer(timerDuration);
      setIsResendActive(false);
      setOtp(["", "", "", ""]);
      setAttempts(0);
      document.getElementById("otp-0")?.focus();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get recipient display
  const getRecipientDisplay = () => {
    if (recipientInfo) return recipientInfo;

    switch (type) {
      case "delivery":
        return "Customer • Order #" + (orderId || "1234");
      case "email":
        return "a***e@gmail.com";
      case "phone":
        return "+251 *** *** 789";
      case "transaction":
        return amount ? `ETB ${amount}` : "Payment";
      default:
        return "User";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20"
          >
            {type === "delivery" ? "Delivery OTP" : "Verification"}
          </Badge>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* Brand */}
        <div className="flex justify-center mb-8">
          <BrandCard />
        </div>

        {/* Main Content Card */}
        <Card className="w-full max-w-md mx-auto overflow-hidden border border-gray-100 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Icon and Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mx-auto">
                {config.icon}
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {title || config.defaultTitle}
              </h1>
              <p className="text-sm text-gray-600">
                {description || config.defaultDescription}
              </p>
              <p className="text-sm font-medium text-primary bg-primary/5 py-2 px-4 rounded-lg inline-block">
                {getRecipientDisplay()}
              </p>
            </div>

            {/* Timer Badge */}
            {showTimer && (
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className={`px-3 py-1.5 ${
                    timer < 10
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  <Clock size={14} className="mr-1" />
                  Code expires in {formatTime(timer)}
                </Badge>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="space-y-4">
              <Label
                htmlFor="otp-0"
                className="text-sm font-medium text-gray-700 block text-center"
              >
                Enter 4-digit code
              </Label>

              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`
                      w-14 h-14 text-center text-2xl font-bold
                      border-2 rounded-xl transition-all
                      focus:border-primary focus:ring-2 focus:ring-primary/20
                      ${error ? "border-red-500" : otp[index] ? "border-primary" : "border-gray-200"}
                    `}
                    disabled={isVerifying || success}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={16} className="flex-shrink-0" />
                  <span>{config.successMessage} Redirecting...</span>
                </div>
              )}

              {/* Attempts Warning */}
              {attempts >= 2 && !error && (
                <p className="text-xs text-orange-600 text-center">
                  Too many failed attempts. Please request a new code.
                </p>
              )}
            </div>

            {/* Resend Section */}
            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600">Haven't received the code?</span>
              {!showTimer || isResendActive ? (
                <button
                  onClick={handleResend}
                  disabled={
                    isResending || isVerifying || success || attempts >= 3
                  }
                  className="font-semibold text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <span className="flex items-center gap-1">
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              ) : (
                <span className="text-gray-400">
                  Resend in {formatTime(timer)}
                </span>
              )}
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleVerify}
              disabled={
                isVerifying ||
                success ||
                otp.join("").length !== 4 ||
                attempts >= 3
              }
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Confirm"
              )}
            </Button>

            {/* Help Text */}
            <p className="text-xs text-center text-gray-500">
              By confirming, you agree to our{" "}
              <button className="text-primary hover:underline">Terms</button>{" "}
              and{" "}
              <button className="text-primary hover:underline">
                Privacy Policy
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
