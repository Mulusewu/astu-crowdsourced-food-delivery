import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Store } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Link, useNavigate } from "react-router-dom";

// const signinSchema = z.object({
//   identifier: z.string().trim().min(3, "Please enter your Email or Phone Number"),
//   password: z.string().min(1, "Password Is Required!"),
// });

const studentSchema = z.object({
  identifier: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9._%+-]+@astu\.edu\.et$/, "Please use your university provided email (@astu.edu.et)"),
  password: z.string().min(1, "Password Is Required!"),
});

const vendorSchema = z.object({
  identifier: z
    .string()
    .trim()
    .regex(/^(09|07)\d{8}$/, "Must be a valid Ethiopian phone number (e.g., 0911...)"),
  password: z.string().min(1, "Password Is Required!"),
});

type SigninFormData = z.infer<typeof studentSchema | typeof vendorSchema>;

export default function SigninForm() {
  const { signin, isLoading, clearError, error: storeError } = useAuthStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // NEW: State to manage the active login mode
  const [loginMode, setLoginMode] = useState<"student" | "vendor">("student");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginMode === "student" ? studentSchema : vendorSchema),
    mode: "onChange",
  });

  useEffect(() => {
    reset({ identifier: "", password: "" });
    setApiError(null);
    clearError();
  }, [loginMode, clearError]);


  const onSubmit = async (data: SigninFormData) => {
    setApiError(null);
    clearError();

    try {
      await signin({ ...data, intendedMode: loginMode }, navigate);
      console.log("signin form");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "An error occurred during sign in.";
      setApiError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans flex flex-col items-center pt-16">
      {/* Dynamic Keyframes for the moving effect */}
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

      <div className="w-full max-w-85 px-4 flex flex-col items-center">
        {/* LOGO SECTION */}
        <div className="relative flex items-center justify-center w-full mb-16 mt-4 pr-6">
          <div className="flex flex-col items-start mr-2">
            <span className="text-[44px] font-black text-black dark:text-white leading-[0.8] tracking-tight drop-shadow-md">
              ASTU
            </span>
            <span className="text-[52px] font-black text-[#F26A1C] dark:text-[#F26A1C] leading-[0.8] tracking-tight drop-shadow-md">
              EATS
            </span>
          </div>
          <div className="flex flex-col items-center -mt-12 -mb-2">
            {/* High-fidelity Scooter SVG matching provided image */}
            <div className="flex flex-col items-center">
              <svg
                width="120"
                height="100"
                viewBox="0 0 120 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#F26A1C] scooter-ride"
              >
                {/* Motion Lines (Behind) */}
                <path d="M5 45H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0s' }} />
                <path d="M2 55H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0.1s' }} />
                <path d="M8 65H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="motion-line" style={{ animationDelay: '0.25s' }} />

                {/* Scooter Main Frame */}
                <path
                  d="M95 75V45L88 40H75L68 55H35V65C35 70 40 75 45 75H95Z"
                  fill="currentColor"
                />
                <path
                  d="M95 45L105 45L108 40"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                /> {/* Control Column */}
                <path
                  d="M102 40H112"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                /> {/* Handlebars */}
                
                {/* Rider */}
                <circle cx="65" cy="22" r="7" fill="currentColor" /> {/* Head */}
                <path
                  d="M58 29H72L75 45L68 60H55L52 45L58 29Z"
                  fill="currentColor"
                /> {/* Torso */}
                <path
                  d="M72 40L88 43"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                /> {/* Arm */}

                {/* Delivery Box (Rear) */}
                <rect x="28" y="35" width="22" height="22" rx="2" fill="currentColor" />
                <path d="M28 42H50" stroke="white" strokeWidth="1" opacity="0.4" />

                {/* Wheels */}
                <circle cx="42" cy="80" r="10" stroke="currentColor" strokeWidth="6" />
                <circle cx="95" cy="80" r="10" stroke="currentColor" strokeWidth="6" />
                {/* Wheel Detail (spokes/axis) */}
                <circle cx="42" cy="80" r="2" fill="white" />
                <circle cx="95" cy="80" r="2" fill="white" />
              </svg>
              {/* "Delivery" text styled exactly as in image */}
              <span className="text-[#F26A1C] text-[26px] font-black italic tracking-tight -mt-2">
                Delivery
              </span>
            </div>
          </div>
        </div>

 <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 p-1 rounded-[14px] flex mb-8">
          <button
            type="button"
            onClick={() => setLoginMode("student")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-bold rounded-[10px] transition-all ${
              loginMode === "student"
                ? "bg-white dark:bg-gray-800 text-[#F26A1C] dark:text-[#ff650b] shadow-sm ring-1 ring-gray-200/50"
                : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <User size={16} strokeWidth={loginMode === "student" ? 2.5 : 2} />
            Student
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("vendor")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-bold rounded-[10px] transition-all ${
              loginMode === "vendor"
                ? "bg-white dark:bg-gray-800 text-[#F26A1C] dark:text-[#ff650b] shadow-sm ring-1 ring-gray-200/50"
                : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Store size={16} strokeWidth={loginMode === "vendor" ? 2.5 : 2} />
            Vendor
          </button>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">
              {loginMode === "student" ? "ASTU Email" : "Phone Number"}

            </label>
            <input
              type={loginMode === "student" ? "email" : "tel"}
              {...register("identifier")}
              placeholder={loginMode === "student" ? "name.surname@astu.edu.et" : "0911223344"}
              className={`w-full h-14 bg-white dark:bg-gray-800 border ${
                errors.identifier ? "border-red-500" : "border-gray-200 dark:border-gray-600"
              } rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:border-[#F26A1C] focus:outline-none transition-all`}
            />
            {errors.identifier && (
              <p className="text-xs text-red-500 font-semibold ml-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="***********"
                className={`w-full h-14 bg-white dark:bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                } rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:border-[#F26A1C] focus:outline-none transition-all`}
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
            {apiError || storeError && (
              <p className="text-xs text-red-500 font-semibold ml-1">
                {apiError || storeError}
              </p>
            )}
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#F26A1C] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-10 flex justify-center">
            <button
              type="submit"
              disabled={isLoading || isSubmitting || !isValid}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-16 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 min-w-[190px]"
            >
              {isLoading || isSubmitting ? "Wait..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

