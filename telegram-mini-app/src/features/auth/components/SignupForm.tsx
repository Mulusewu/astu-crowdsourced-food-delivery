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

// Enhanced password validation rules
const passwordValidation = {
  minLength: 8,
  maxLength: 32,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

// Enhanced validation schema with more strict rules
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes",
      ),

    email: z
      .string()
      .email("Please enter a valid email address")
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email must be less than 100 characters")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email format",
      ),

    password: z
      .string()
      .min(
        passwordValidation.minLength,
        `Password must be at least ${passwordValidation.minLength} characters`,
      )
      .max(
        passwordValidation.maxLength,
        `Password must be less than ${passwordValidation.maxLength} characters`,
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

// API response types
interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export default function SignupForm() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setApiError(null);
      setSuccessMessage(null);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = data;

      // Make API call to your Express backend
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        // Handle field-specific errors from backend
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof SignupFormData, {
              type: "manual",
              message,
            });
          });
        }

        // Handle general error
        if (result.message) {
          setApiError(result.message);
        }

        throw new Error(result.message || "Signup failed");
      }

      // Handle successful signup
      setSuccessMessage(
        result.message ||
          "Account created successfully! Please check your email to verify your account.",
      );

      // Reset form on success
      reset();

      // You might want to redirect after a delay
      setTimeout(() => {
        // Handle navigation to signin or verification page
        window.location.href = "/signin?verified=false";
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSignInClick = () => {
    window.location.href = "/signin";
  };

  // Password strength checker
  const checkPasswordStrength = (
    password: string,
  ): { score: number; feedback: string } => {
    let score = 0;
    const checks = [
      { regex: /.{8,}/, message: "At least 8 characters", points: 1 },
      { regex: /[A-Z]/, message: "Uppercase letter", points: 1 },
      { regex: /[a-z]/, message: "Lowercase letter", points: 1 },
      { regex: /[0-9]/, message: "Number", points: 1 },
      { regex: /[^A-Za-z0-9]/, message: "Special character", points: 1 },
    ];

    checks.forEach((check) => {
      if (check.regex.test(password)) {
        score += check.points;
      }
    });

    let feedback = "";
    if (score <= 2) feedback = "Weak password";
    else if (score <= 3) feedback = "Fair password";
    else if (score <= 4) feedback = "Good password";
    else feedback = "Strong password";

    return { score, feedback };
  };

  // Watch password value for strength indicator
  const passwordValue = register("password").name
    ? (document.getElementById("password") as HTMLInputElement)?.value
    : "";

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex flex-col">
      {/* Brand Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-black">ASTU</span>
          <span style={{ color: "#F26A1C" }}>EATS</span>
        </h1>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        <FieldSet className="w-full">
          <FieldGroup className="space-y-4">
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Name Field */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
                className={`${errors.name ? "border-red-500" : ""} w-full`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </Field>

            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : ""} w-full`}
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
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register("password")}
                className={`${errors.password ? "border-red-500" : ""} w-full`}
              />

              {/* Password strength indicator */}
              {!errors.password && passwordValue && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          checkPasswordStrength(passwordValue).score <= 2
                            ? "bg-red-500"
                            : checkPasswordStrength(passwordValue).score <= 3
                              ? "bg-yellow-500"
                              : checkPasswordStrength(passwordValue).score <= 4
                                ? "bg-blue-500"
                                : "bg-green-500"
                        }`}
                        style={{
                          width: `${(checkPasswordStrength(passwordValue).score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        checkPasswordStrength(passwordValue).score <= 2
                          ? "text-red-600"
                          : checkPasswordStrength(passwordValue).score <= 3
                            ? "text-yellow-600"
                            : checkPasswordStrength(passwordValue).score <= 4
                              ? "text-blue-600"
                              : "text-green-600"
                      }`}
                    >
                      {checkPasswordStrength(passwordValue).feedback}
                    </span>
                  </div>
                </div>
              )}

              <FieldDescription className="text-xs mt-1">
                Password requirements:
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li
                    className={
                      passwordValue?.length >= 8
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(passwordValue || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • One uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(passwordValue || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • One lowercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(passwordValue || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • One number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(passwordValue || "")
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    • One special character
                  </li>
                </ul>
              </FieldDescription>

              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Confirm Password Field */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={`${errors.confirmPassword ? "border-red-500" : ""} w-full`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3 px-4 rounded-lg text-white font-medium transition-opacity disabled:opacity-50"
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
              Creating account...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Back to Sign In Link/Button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleSignInClick}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
