import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Header,
  BorderedInput,
  ActionButton,
} from "../components/profileShared"; // Adjust path

export default function AddTelebirrFormPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call for OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  // --- SUCCESS STATE VIEW ---
  if (isSubmitted) {
    return (
      <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
        <Header title="Add Telebirr" showBack />

        <div className="flex-1 flex flex-col items-center justify-center -mt-10 px-4 text-center">
          <div className="w-32 h-32 rounded-full border-[6px] border-[#34C759] flex items-center justify-center mb-8 bg-[#34C759]/5 animate-in zoom-in duration-300">
            <Check size={64} strokeWidth={3} className="text-[#34C759]" />
          </div>

          <h2 className="text-[15px] font-bold text-gray-800 dark:text-white leading-relaxed max-w-[280px]">
            We Have Successfully Received Your Submission And Processing It. We
            Will Let You Know Very Soon.
          </h2>
        </div>

        <div className="mt-8 mb-4">
          <ActionButton onClick={() => navigate("/customer/profile/payment")}>
            Return to Payment Methods
          </ActionButton>
        </div>
      </div>
    );
  }

  // --- FORM STATE VIEW ---
  return (
    <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Add Telebirr" showBack />

      <div className="flex-1 mt-2">
        {/* Logo & Warning */}
        <div className="flex flex-col items-center mb-8 px-4 text-center">
          <img
            src="https://telebirr.et/wp-content/uploads/2021/05/telebirr-logo.png"
            alt="Telebirr"
            className="h-16 object-contain mb-6"
          />
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            <b className="text-gray-900 dark:text-white">Warning:</b> Please
            Make Sure The Number You Enter Is Really Yours. Apart From Verifying
            The Number Via OTP, We Will Not Be Responsible For Any Inconvenience
            Regarding Your Account.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
              Account Name
            </label>
            <BorderedInput placeholder="Enter Your Name" />
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
              Phone Number
            </label>
            {/* Set error={true} if you want to show the red border validation */}
            <BorderedInput placeholder="Enter Your Phone Number" />
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
              Enter OTP For Verification
            </label>
            <BorderedInput placeholder="Enter OTP" />
            <div className="flex flex-col items-center mt-1.5 gap-0.5">
              <p className="text-[10px] text-gray-500 font-medium">
                Haven't Received OTP Yet?{" "}
                <span className="text-[#F26A1C] font-bold cursor-pointer hover:underline">
                  Resend
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <ActionButton onClick={handleSubmit}>
          {isLoading ? "Verifying..." : "Add Payment Method"}
        </ActionButton>
      </div>
    </div>
  );
}
