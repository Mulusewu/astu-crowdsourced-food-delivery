import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { usePaymentStore } from "@/store/paymentStore";
import {
  Header,
  BorderedInput,
  ActionButton,
} from "../components/profileShared";
import { ROUTES } from "@/routes/routePaths";

const telebirrSchema = z.object({
  accountName: z.string().trim().min(2, "Account Name is required"),
  phoneNumber: z.string().trim().regex(/^(09|07)\d{8}$|^\+251(9|7)\d{8}$/, "Valid Ethiopian phone number required"),
  otp: z.string().trim().min(4, "OTP must be at least 4 digits"),
});

type TelebirrData = z.infer<typeof telebirrSchema>;

export default function AddTelebirrFormPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider") || "telebirr";
  const isCBE = provider === "cbe_birr";

  const providerName = isCBE ? "CBE Birr" : "Telebirr";
  const providerLogo = isCBE 
    ? "https://combanketh.et/cbe_logo.png" 
    : "https://telebirr.et/wp-content/uploads/2021/05/telebirr-logo.png";
  const providerIdPrefix = isCBE ? "cbe" : "tb";

  const addPaymentMethod = usePaymentStore((state) => state.addPaymentMethod);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TelebirrData>({
    resolver: zodResolver(telebirrSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: TelebirrData) => {
    setApiError(null);
    try {
      // Simulate API call for OTP verification
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Send to Zustand Store (which mimics backend)
      addPaymentMethod({
        id: `${providerIdPrefix}_${Date.now()}`,
        type: providerName,
        accountInfo: data.phoneNumber,
      });

      setIsSubmitted(true);
    } catch {
      setApiError(`Failed to add ${providerName} account.`);
    }
  };

  // --- SUCCESS STATE VIEW ---
  if (isSubmitted) {
    return (
      <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
        <Header title={`Add ${providerName}`} showBack />

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
          <ActionButton onClick={() => navigate(ROUTES.CUSTOMER.PAYMENT.METHODS)}>
            Return to Payment Methods
          </ActionButton>
        </div>
      </div>
    );
  }

  // --- FORM STATE VIEW ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
      <Header title={`Add ${providerName}`} showBack />

      <div className="flex-1 mt-2">
        {/* Logo & Warning */}
        <div className="flex flex-col items-center mb-8 px-4 text-center">
          <img
            src={providerLogo}
            alt={providerName}
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
            <BorderedInput 
              {...register("accountName")}
              placeholder="Enter Your Name" 
              error={!!errors.accountName}
            />
            {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName.message}</p>}
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
              Phone Number
            </label>
            <BorderedInput 
              {...register("phoneNumber")}
              placeholder="Enter Your Phone Number" 
              error={!!errors.phoneNumber}
            />
            {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-900 dark:text-white mb-2 block">
              Enter OTP For Verification
            </label>
            <BorderedInput 
              {...register("otp")}
              placeholder="Enter OTP" 
              error={!!errors.otp}
            />
            {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>}
            <div className="flex flex-col items-center mt-1.5 gap-0.5">
              <p className="text-[10px] text-gray-500 font-medium">
                Haven't Received OTP Yet?{" "}
                <span className="text-[#F26A1C] font-bold cursor-pointer hover:underline">
                  Resend
                </span>
              </p>
            </div>
          </div>

          {apiError && <p className="text-xs font-bold text-red-500 text-center">{apiError}</p>}
        </div>
      </div>

      <div className="mt-8 mb-4">
        <ActionButton type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Verifying..." : "Add Payment Method"}
        </ActionButton>
      </div>
    </form>
  );
}
