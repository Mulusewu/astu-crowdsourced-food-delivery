import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please Enter A Valid Email Address!"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Navigate to Reset Password page with a dummy token representing the email
      navigate(ROUTES.RESET_PASSWORD.replace(":token", encodeURIComponent(data.email)));
    } catch (err: any) {
      setApiError("Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-black text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-[15px] font-medium text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-[17px] font-bold text-gray-900 ml-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Johndoe@Gmail.Com"
              className={`w-full h-14 bg-white border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold ml-1">
                {errors.email.message}
              </p>
            )}
            {apiError && (
              <p className="text-xs text-red-500 font-semibold ml-1">
                {apiError}
              </p>
            )}
          </div>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading || isSubmitting || !isValid}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 w-full"
            >
              {isLoading || isSubmitting ? "Wait..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
