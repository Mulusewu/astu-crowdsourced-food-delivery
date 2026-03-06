import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Signin validation schema
const signinSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type SigninFormData = z.infer<typeof signinSchema>;

// API response types
interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SigninForm() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      setApiError(null);

      // Make API call to your Express backend
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Important for cookies/sessions
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        // Handle field-specific errors from backend
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof SigninFormData, {
              type: "manual",
              message,
            });
          });
        }

        // Handle general error
        if (result.message) {
          setApiError(result.message);
        }

        throw new Error(result.message || "Signin failed");
      }

      // Handle successful signin
      console.log("Signin successful:", result);

      // Store token if returned (adjust based on your auth strategy)
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      // Store user data if needed
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Show success message
      setApiError(null);

      // Redirect to dashboard or home page
      setTimeout(() => {
        window.location.href = "/dashboard"; // or your desired redirect path
      }, 1000);
    } catch (error) {
      console.error("Signin error:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSignUpClick = () => {
    window.location.href = "/signup";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex flex-col">
      {/* Brand Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-black">ASTU</span>
          <span style={{ color: "#F26A1C" }}>EATS</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Welcome back!</p>
      </div>

      {/* Signin Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        <FieldSet className="w-full">
          <FieldGroup className="space-y-4">
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : "border-gray-300"} w-full focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-colors`}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`${errors.password ? "border-red-500" : "border-gray-300"} w-full pr-10 focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-colors`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    // Eye slash icon (password hidden)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    // Eye icon (password visible)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/forgot-password")}
                  className="text-xs text-gray-500 hover:text-[#F26A1C] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Remember me checkbox (optional) */}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-[#F26A1C] border-gray-300 rounded focus:ring-[#F26A1C]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
          </FieldGroup>
        </FieldSet>

        {/* Signin Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#F26A1C" }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Back to Sign Up Link/Button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleSignUpClick}
            className="text-sm text-gray-600 hover:text-[#F26A1C] transition-colors bg-transparent border-none cursor-pointer"
          >
            Don't have an account?{" "}
            <span style={{ color: "#F26A1C" }} className="font-medium">
              Sign up
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
