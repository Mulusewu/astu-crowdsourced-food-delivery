import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name Is Too Short!").max(50, "Name Is Too Long!"),
    email: z.string().email("Please Enter A Valid Email!"),
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

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, isLoading, clearError } = useAuthStore();

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    clearError();
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "customer",
      });
    } catch (err: any) {
      setApiError(err.message || "User Already Exists With This Email!");
    }
  };

  return (
    <div className="min-h-[80vh] bg-white font-sans flex flex-col items-center pt-8">
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

      <div className="w-full max-w-[340px] px-4 flex flex-col items-center">
        {/* LOGO SECTION */}
        <div className="relative flex items-center justify-center w-full mb-12 mt-2 pr-6">
          <div className="flex flex-col items-start mr-2">
            <span className="text-[44px] font-black text-black leading-[0.8] tracking-tight drop-shadow-md">
              ASTU
            </span>
            <span className="text-[52px] font-black text-[#F26A1C] leading-[0.8] tracking-tight drop-shadow-md">
              EATS
            </span>
          </div>
          <div className="flex flex-col items-center -mt-10 -mb-2">
            <div className="flex flex-col items-center">
              <svg
                width="110"
                height="80"
                viewBox="0 0 120 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#F26A1C] scooter-ride"
              >
                <path d="M5 45H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" />
                <path d="M2 55H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0.1s' }} />
                <path d="M8 65H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0.2s' }} />

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
              <span className="text-[#F26A1C] text-[24px] font-black italic tracking-tight -mt-1">
                Delivery
              </span>
            </div>
          </div>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Name</label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className={`w-full h-13 border ${errors.name ? "border-red-500" : "border-gray-200"} rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Johndoe@Gmail.Com"
              className={`w-full h-13 border ${errors.email || apiError ? "border-red-500" : "border-gray-200"} rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
            />
            {errors.email ? (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.email.message}</p>
            ) : apiError ? (
              <p className="text-xs text-red-500 font-semibold ml-1">{apiError}</p>
            ) : null}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="***********"
                className={`w-full h-13 border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="***********"
                className={`w-full h-13 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 flex flex-col items-center space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-16 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 min-w-[200px]"
            >
              {isLoading ? "Wait..." : "Sign Up"}
            </button>

            <p className="text-[15px] font-bold text-gray-400">
              Already Have An Account?{" "}
              <button
                type="button"
                onClick={() => navigate(ROUTES.SIGNIN)}
                className="text-[#F26A1C] font-black hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
