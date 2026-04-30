import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandCard } from "@/components/brand/BrandCard";
import { Badge } from "@/components/ui/badge";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL if present
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock verification - replace with actual API
      if (otpString === "1234" || token) {
        setSuccess(true);
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        throw new Error("Invalid verification code");
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimer(60);
      setIsResendActive(false);
      setOtp(["", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - matching ActiveDeliveryPage style */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20"
          >
            Email Verification
          </Badge>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* Brand - centered */}
        <div className="flex justify-center mb-8">
          <BrandCard />
        </div>

        {/* Main Content Card - matching delivery card style */}
        <Card className="w-full max-w-md mx-auto overflow-hidden border border-gray-100 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Icon and Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mx-auto">
                <Mail size={32} className="text-primary" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Verification Code
              </h1>
              <p className="text-sm text-gray-600">
                We've sent a verification code to
              </p>
              <p className="text-sm font-medium text-primary bg-primary/5 py-2 px-4 rounded-lg inline-block">
                a***e@gmail.com
              </p>
            </div>

            {/* Timer Badge */}
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5"
              >
                <Clock size={14} className="mr-1" />
                Code expires in {formatTime(timer)}
              </Badge>
            </div>

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

              {/* Error/Success Messages - matching delivery page style */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={16} className="flex-shrink-0" />
                  <span>Email verified successfully! Redirecting...</span>
                </div>
              )}
            </div>

            {/* Resend Section */}
            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600">Haven't received the code?</span>
              {isResendActive ? (
                <button
                  onClick={handleResend}
                  disabled={isResending || isVerifying || success}
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

            {/* Confirm Button - matching delivery page button style */}
            <Button
              onClick={handleVerify}
              disabled={isVerifying || success || otp.join("").length !== 4}
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
              Didn't receive the code? Check your spam folder or{" "}
              <button
                onClick={() => navigate("/support")}
                className="text-primary hover:underline font-medium"
              >
                contact support
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
