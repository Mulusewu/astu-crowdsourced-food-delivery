import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { BrandCard } from "@/components/brand/BrandCard";
import { useAuthStore } from "@/store/auth/authStore";

// Schema updated to match the specific error cases in the design
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
      // Redirect is handled by authStore after successful signup
    } catch (err: any) {
      // Simulate the "User Already Exists" error from the design
      setApiError(err.message || "User Already Exists With This Email!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col items-center pt-8 px-6">
      <div className="w-full max-w-md">
        {/* TABS */}
        {/* <div className="flex w-full mb-10">
          <button className="flex-1 pb-3 text-center border-b-[3px] border-[#F26A1C] font-bold text-gray-900 dark:text-white text-[15px]">
            Sign Up
          </button>
          <button 
            type="button"
            onClick={() => navigate("/auth?tab=login")} // Assuming you route based on query or setup
            className="flex-1 pb-3 text-center border-b-[3px] border-transparent font-bold text-gray-900 dark:text-white text-[15px]"
          >
            Login
          </button>
        </div> */}

        {/* BRAND LOGO */}
        <div className="flex justify-center mb-10">
          <BrandCard />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
          {/* Name Field */}
          <div>
            <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-2 block">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className={`w-full h-12 border ${errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-[14px] px-4 text-[13px] font-medium bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#F26A1C] focus:outline-none transition-colors`}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Johndoe@Gmail.Com"
              className={`w-full h-12 border ${errors.email || apiError ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-[14px] px-4 text-[13px] font-medium bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#F26A1C] focus:outline-none transition-colors`}
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {errors.email.message}
              </p>
            )}
            {apiError && !errors.email && (
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
                className={`w-full h-12 border ${errors.password ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-[14px] px-4 pr-10 text-[13px] font-medium bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#F26A1C] focus:outline-none transition-colors`}
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
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="***********"
                className={`w-full h-12 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-gray-800"} rounded-[14px] px-4 pr-10 text-[13px] font-medium bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-[#F26A1C] focus:outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Centered Pill Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-bold text-[15px] px-12 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 min-w-40"
            >
              {isLoading ? "Wait..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
