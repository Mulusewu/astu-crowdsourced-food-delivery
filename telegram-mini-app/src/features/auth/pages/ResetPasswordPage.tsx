import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner"; 

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password Is Too Short!")
      .regex(/[A-Z]/, "Must Contain Uppercase!")
      .regex(/[0-9]/, "Must Contain Number!"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password Doesn't Match!",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Simulate API call to reset password using token and new password
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast.success("Password reset successfully! Please sign in.");
      navigate(ROUTES.AUTH);
    } catch (err: any) {
      setApiError("Failed to reset password. The link might be expired.");
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
                {/* Motion Lines (Behind) */}
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
          <h1 className="text-2xl font-black text-gray-900 mb-2">Create New Password</h1>
          <p className="text-[15px] font-medium text-gray-500">
            Your new password must be different from previous used passwords.
          </p>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Password */}
          <div className="space-y-2">
            <label className="text-[17px] font-bold text-gray-900 ml-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="***********"
                className={`w-full h-14 bg-white border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-semibold ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[17px] font-bold text-gray-900 ml-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="***********"
                className={`w-full h-14 bg-white border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-semibold ml-1">
                {errors.confirmPassword.message}
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
              {isLoading || isSubmitting ? "Wait..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
