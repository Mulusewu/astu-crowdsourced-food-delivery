import { useState } from "react";
import OtpInput from "react-otp-input";
import BackButton from "@/components/ui/BackButton";
import PageContainer from "@/components/ui/PageContainer";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (otp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    if (otp !== "1234") {
      setError("Incorrect OTP entered");
      return;
    }

    setError("");
    alert("OTP Verified!");
  };

  const handleResend = () => {
    setOtp("");
    setError("");
  };

  return (
    <PageContainer>

      {/* Header */}
      <BackButton />

      <h2 className="text-2xl font-semibold mt-6">
        Verification Code
      </h2>

      <p className="text-gray-500 text-sm mt-2">
        We have sent a verification code to your email
      </p>

      {/* Centered Content */}
      <div className="flex flex-col items-center mt-12">

        <div className="w-full max-w-sm mx-auto px-6 mb-6">
         <div className="flex justify-between gap-3">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            containerStyle={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              gap: "8px",
            }}
            renderInput={(props) => (
              <input
                {...props}
                inputMode="numeric"
                className="w-full aspect-square border-2 border-gray-300 rounded-xl text-center text-5xl font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
           )}
         />
        </div>
      </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          className="w-40 bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600"
        >
          Confirm
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Haven’t received the OTP?
          <span
            onClick={handleResend}
            className="text-orange-500 cursor-pointer ml-1 font-medium"
          >
            RESEND
          </span>
        </p>

      </div>

    </PageContainer>
  );
}