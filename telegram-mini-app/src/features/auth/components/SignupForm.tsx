import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";

// ─── constants ────────────────────────────────────────────────────────────────
const ORANGE = "#F27420";

// ─── validation schema ────────────────────────────────────────────────────────
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function ASTULogo() {
  return (
    <div className="flex flex-col items-center select-none">
      <style>
        {`
          @keyframes drive {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3px) rotate(1deg); }
          }
          @keyframes spin-wheel {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes speed-line {
            0% { transform: translateX(0px); opacity: 1; }
            100% { transform: translateX(-15px); opacity: 0; }
          }
        `}
      </style>
      <div className="flex items-center gap-1">
        {/* Text block */}
        <div className="flex flex-col leading-none" style={{ filter: "drop-shadow(2px 3px 2px rgba(0,0,0,0.25))" }}>
          <span
            className="text-[2.8rem] font-black tracking-tight text-gray-900"
            style={{ fontFamily: "serif", lineHeight: 1 }}
          >
            ASTU
          </span>
          <span
            className="text-[2.8rem] font-black italic tracking-tight"
            style={{ color: ORANGE, fontFamily: "serif", lineHeight: 1 }}
          >
            EATS
          </span>
        </div>
        
        {/* Scooter & Delivery text block */}
        <div className="flex flex-col items-center">
          <div className="relative" style={{ animation: "drive 2s ease-in-out infinite" }}>
            <svg
              viewBox="0 0 120 90"
              className="w-24 h-[4.5rem]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {/* Package / box on back */}
              <rect x="14" y="22" width="22" height="18" rx="3" fill={ORANGE} />
              <line x1="25" y1="22" x2="25" y2="40" stroke="white" strokeWidth="1.5" />
              <line x1="14" y1="31" x2="36" y2="31" stroke="white" strokeWidth="1.5" />
              {/* Rider body */}
              <ellipse cx="60" cy="44" rx="12" ry="16" fill={ORANGE} />
              {/* Rider head */}
              <circle cx="60" cy="24" r="10" fill={ORANGE} />
              {/* Helmet shine */}
              <path d="M54 20 Q60 14 66 20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Arm reaching forward */}
              <path d="M68 40 Q82 36 88 42" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Scooter body */}
              <path d="M30 60 Q48 52 72 56 L88 60 Q94 62 96 68" stroke={ORANGE} strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Scooter underside */}
              <path d="M30 60 Q24 66 28 72" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Front fork */}
              <path d="M88 60 L90 72" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
              
              {/* Rear wheel */}
              <g style={{ transformOrigin: "30px 74px", animation: "spin-wheel 0.8s linear infinite" }}>
                <circle cx="30" cy="74" r="12" stroke={ORANGE} strokeWidth="4" strokeDasharray="10 6" />
                <circle cx="30" cy="74" r="4" fill={ORANGE} />
              </g>
              
              {/* Front wheel */}
              <g style={{ transformOrigin: "90px 74px", animation: "spin-wheel 0.8s linear infinite" }}>
                <circle cx="90" cy="74" r="12" stroke={ORANGE} strokeWidth="4" strokeDasharray="10 6" />
                <circle cx="90" cy="74" r="4" fill={ORANGE} />
              </g>
              
              {/* Speed lines */}
              <line x1="0" y1="56" x2="16" y2="56" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" style={{ animation: "speed-line 0.6s linear infinite" }} />
              <line x1="4" y1="64" x2="18" y2="64" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" style={{ animation: "speed-line 0.6s linear infinite 0.2s" }} />
              <line x1="8" y1="72" x2="20" y2="72" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" style={{ animation: "speed-line 0.6s linear infinite 0.4s" }} />
            </svg>
          </div>
          <span
            className="text-[1.1rem] font-bold italic tracking-wide"
            style={{ color: ORANGE, fontFamily: "serif", marginTop: "-6px" }}
          >
            Delivery
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── FormInput ────────────────────────────────────────────────────────────────
function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  rightElement,
  registration,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  rightElement?: React.ReactNode;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...registration}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#F27420] focus:ring-2 focus:ring-[#F27420]/20 hover:border-gray-300"
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── SignupForm (default export) ──────────────────────────────────────────────
export default function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setApiError(null);
      setSuccessMessage(null);
      const { confirmPassword: _, ...apiData } = data;
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });
      const result: ApiResponse = await response.json();
      if (!response.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            setError(field as keyof SignupFormData, { type: "manual", message });
          });
        }
        if (result.message) setApiError(result.message);
        throw new Error(result.message || "Signup failed");
      }
      setSuccessMessage(result.message || "Account created successfully!");
      reset();
      setTimeout(() => { window.location.href = "/signin?verified=false"; }, 3000);
    } catch (error) {
      if (error instanceof Error) setApiError(error.message);
      else setApiError("An unexpected error occurred. Please try again.");
    }
  };

  const EyeToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none"
      tabIndex={-1}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Tab Header ── */}
      <div className="flex border-b border-gray-200">
        {/* Sign Up tab — active */}
        <button
          type="button"
          className="flex-1 py-4 text-base font-bold transition-colors relative"
          style={{ color: ORANGE }}
          aria-current="page"
        >
          Sign Up
          {/* Active underline */}
          <span
            className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full"
            style={{ backgroundColor: ORANGE }}
          />
        </button>
        {/* Login tab */}
        <button
          type="button"
          className="flex-1 py-4 text-base font-bold text-gray-500 transition-colors hover:text-gray-700"
          onClick={() => navigate(ROUTES.SIGNIN)}
        >
          Login
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="px-5 pt-8 pb-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <ASTULogo />
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormInput
            id="name"
            label="Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            registration={register("name")}
          />

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="Johndoe@Gmail.Com"
            error={errors.email?.message}
            registration={register("email")}
          />

          <FormInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="············"
            error={errors.password?.message}
            registration={register("password")}
            rightElement={
              <EyeToggle
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            }
          />

          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="············"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
            rightElement={
              <EyeToggle
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((v) => !v)}
              />
            }
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-full py-4 text-base font-bold text-white shadow-[0_4px_20px_rgba(242,116,32,0.35)] transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]/40"
            style={{ backgroundColor: ORANGE }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account…
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
