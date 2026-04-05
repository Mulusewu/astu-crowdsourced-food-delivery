import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { BrandCard } from "@/components/brand/BrandCard";
import { useAuthStore } from "@/store/auth/authStore";

const signinSchema = z.object({
  email: z.string().email("Please Enter A Valid Email Address!"),
  password: z.string().min(1, "Password Is Required!"),
});

type SigninFormData = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const navigate = useNavigate();
  const { signin, isLoading, error, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: SigninFormData) => {
    setApiError(null);
    clearError();

    try {
      await signin(data);
      // AuthStore handles the redirection upon success
    } catch (err: any) {
      // Mapping common errors to the design's exact strings
      const errorMsg = err.message || "";
      if (errorMsg.toLowerCase().includes("password")) {
        setApiError("Incorrect Password!");
      } else {
        setApiError("Email Doesn't Exist!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col items-center pt-8 px-6">
      <div className="w-full max-w-md">
        {/* TABS */}
        {/* <div className="flex w-full mb-10">
          <button 
            type="button"
            onClick={() => navigate("/auth?tab=signup")} // Ensure this matches your router setup
            className="flex-1 pb-3 text-center border-b-[3px] border-transparent font-bold text-gray-900 dark:text-white text-[15px]"
          >
            Sign Up
          </button>
          <button className="flex-1 pb-3 text-center border-b-[3px] border-[#F26A1C] font-bold text-gray-900 dark:text-white text-[15px]">
            Login
          </button>
        </div> */}

        {/* BRAND LOGO */}
        <div className="flex justify-center mb-16">
          <BrandCard />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Email Field */}
          <div>
            <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Johndoe@Gmail.Com"
              className={`w-full h-12 border ${errors.email || (apiError && apiError.includes("Email")) ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-[14px] px-4 text-[13px] font-medium bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#F26A1C] focus:outline-none transition-colors`}
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {errors.email.message}
              </p>
            )}
            {apiError && apiError.includes("Email") && !errors.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {apiError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="***********"
                className={`w-full h-12 border ${errors.password || (apiError && apiError.includes("Password")) ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-[14px] px-4 pr-10 text-[13px] font-medium bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#F26A1C] focus:outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {errors.password.message}
              </p>
            )}
            {apiError && apiError.includes("Password") && !errors.password && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {apiError}
              </p>
            )}
          </div>

          {/* Centered Pill Submit Button */}
          <div className="pt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[15px] px-12 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 min-w-[160px]"
            >
              {isLoading ? "Wait..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
