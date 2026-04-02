// src/features/auth/pages/SignupForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Building, MapPin, Eye, EyeOff } from "lucide-react";

import { BrandCard } from "@/components/brand/BrandCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { useAuthStore } from "@/store/auth/authStore";

// Base schema for all users
const baseSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
  role: z.enum(["customer", "vendor", "delivery"], {
    required_error: "Please select a role",
  }),
});

// Vendor-specific schema
const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name is required").max(100),
  businessAddress: z.string().min(5, "Address is required"),
  businessPhone: z.string().min(10, "Valid phone number required"),
  businessLicense: z.string().min(1, "Business license is required"),
  taxId: z.string().optional(),
  description: z.string().optional(),
});

// Combined schema
const signupSchema = baseSignupSchema
  .extend({
    vendorData: vendorSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [apiError, setApiError] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "customer" },
    mode: "onChange",
  });

  const selectedRole = watch("role");
  const isVendor = selectedRole === "vendor";

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLicensePreview(url);
      setValue("vendorData.businessLicense", url);
      trigger("vendorData.businessLicense");
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setApiError(null);
    clearError();
    try {
      await signup(data);
      navigate("/verify-email");
    } catch (err: any) {
      setApiError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Brand */}
        <div className="flex justify-center mb-10">
          <BrandCard />
        </div>

        <div className="space-y-8">
          <div className="text-center">
            {/* <h2 className="text-3xl font-semibold text-gray-900">
              Create Account
            </h2> */}
            <p className="text-gray-500 mt-2">
              Join ASTUEATS and start ordering today
            </p>
          </div>

          {/* Error Message */}
          {(apiError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {apiError || error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your full name"
                className="mt-1.5 h-12 rounded-2xl border-gray-200 focus:border-[#F26A1C] focus:ring-[#F26A1C]"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className="mt-1.5 h-12 rounded-2xl border-gray-200 focus:border-[#F26A1C] focus:ring-[#F26A1C]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <Label className="text-gray-700 font-medium mb-3 block">
                I want to join as
              </Label>
              <RadioGroup
                defaultValue="customer"
                onValueChange={(value) => setValue("role", value as any)}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { value: "customer", label: "Customer" },
                  { value: "vendor", label: "Vendor" },
                  { value: "delivery", label: "Delivery" },
                ].map((role) => (
                  <div
                    key={role.value}
                    className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedRole === role.value
                        ? "border-[#F26A1C] bg-[#F26A1C]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setValue("role", role.value as any)}
                  >
                    <RadioGroupItem value={role.value} id={role.value} />
                    <Label
                      htmlFor={role.value}
                      className="cursor-pointer font-medium flex items-center gap-2 mr-5"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Vendor Fields - Conditionally Rendered */}
            {isVendor && (
              <div className="space-y-5 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-2 text-[#F26A1C]">
                  <Building size={20} />
                  <h3 className="font-semibold text-gray-900">
                    Business Information
                  </h3>
                </div>

                <div>
                  <Label htmlFor="businessName">Business / Cafe Name</Label>
                  <Input
                    id="businessName"
                    {...register("vendorData.businessName")}
                    placeholder="e.g., Kaldi's Coffee"
                    className="mt-1.5 h-12 rounded-2xl"
                  />
                  {errors.vendorData?.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorData.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <div className="relative mt-1.5">
                    <MapPin
                      className="absolute left-4 top-4 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="businessAddress"
                      {...register("vendorData.businessAddress")}
                      placeholder="Bole Atlas, Addis Ababa"
                      className="pl-11 h-12 rounded-2xl"
                    />
                  </div>
                  {errors.vendorData?.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorData.businessAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    {...register("vendorData.businessPhone")}
                    placeholder="+251 911 123 456"
                    className="mt-1.5 h-12 rounded-2xl"
                  />
                  {errors.vendorData?.businessPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vendorData.businessPhone.message}
                    </p>
                  )}
                </div>

                {/* Business License Upload */}
                <div>
                  <Label className="text-gray-700 mb-2 block">
                    Business License / Registration
                  </Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#F26A1C] transition-colors bg-white">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLicenseUpload}
                    />
                  </label>

                  {licensePreview && (
                    <div className="mt-3 relative">
                      <img
                        src={licensePreview}
                        alt="License preview"
                        className="w-full h-32 object-cover rounded-2xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLicensePreview(null);
                          setValue("vendorData.businessLicense", "");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password Field with Toggle */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Create strong password"
                  className="h-12 rounded-2xl border-gray-200 focus:border-[#F26A1C] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field with Toggle */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="h-12 rounded-2xl border-gray-200 focus:border-[#F26A1C] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold bg-[#F26A1C] hover:bg-[#F26A1C]/90 rounded-2xl mt-2"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth?tab=signin")}
              className="text-[#F26A1C] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
