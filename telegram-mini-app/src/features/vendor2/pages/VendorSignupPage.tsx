import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Upload, CheckCircle2, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

const vendorSignupSchema = z
  .object({
    vendorName: z.string().min(2, "Vendor Name Is Too Short!").max(50, "Vendor Name Is Too Long!"),
    email: z.string().email("Please Enter A Valid Email!"),
    businessAddress: z.string().min(5, "Address Is Too Short!"),
    contactNumber: z.string().min(10, "Contact Number Is Too Short!"),
    category: z.string().min(1, "Please Select A Category!"),
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

type VendorSignupFormData = z.infer<typeof vendorSignupSchema>;

export default function VendorSignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, clearError } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [licenseUploaded, setLicenseUploaded] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VendorSignupFormData>({
    resolver: zodResolver(vendorSignupSchema),
    mode: "onChange",
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data: VendorSignupFormData) => {
    setApiError(null);
    clearError();
    
    if (!licenseUploaded) {
      setApiError("Please Upload Your Business License!");
      return;
    }

    try {
      // Simulate signup with 'pending' status
      // We'll pass extra data that the signup function can handle or we'll just navigate to pending
      await signup({
        name: data.vendorName,
        email: data.email,
        password: data.password,
        role: "vendor",
        businessAddress: data.businessAddress,
        contactNumber: data.contactNumber,
        category: data.category,
        status: "pending"
      });
      
      // The signup function in authStore currently redirects to various dashboards
      // But we want it to go to /vendor/pending
      navigate(ROUTES.VENDOR.PENDING);
    } catch (err: any) {
      setApiError(err.message || "An Error Occurred During Signup!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result as string);
        setLicenseUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    "Fast Food",
    "Traditional",
    "Cafe",
    "Bakery",
    "Fine Dining",
    "Pizza & Burger",
    "Juice & Smoothies"
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center pt-8 pb-12">
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

      <div className="w-full max-w-[360px] px-4 flex flex-col items-center">
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
                Vendor
              </span>
            </div>
          </div>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Vendor Name */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Vendor Name</label>
            <input
              {...register("vendorName")}
              placeholder="Restaurant or Shop Name"
              className={cn(
                "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all",
                errors.vendorName ? "border-red-500" : "border-gray-200"
              )}
            />
            {errors.vendorName && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.vendorName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Contact Email"
              className={cn(
                "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all",
                errors.email ? "border-red-500" : "border-gray-200"
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Business Address */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Business Address</label>
            <input
              {...register("businessAddress")}
              placeholder="Location Details"
              className={cn(
                "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all",
                errors.businessAddress ? "border-red-500" : "border-gray-200"
              )}
            />
            {errors.businessAddress && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.businessAddress.message}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Contact Number</label>
            <input
              {...register("contactNumber")}
              placeholder="09..."
              className={cn(
                "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all",
                errors.contactNumber ? "border-red-500" : "border-gray-200"
              )}
            />
            {errors.contactNumber && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.contactNumber.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Category</label>
            <div className="relative">
              <select
                {...register("category")}
                className={cn(
                  "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 appearance-none focus:border-[#F26A1C] focus:outline-none bg-white transition-all",
                  errors.category ? "border-red-500" : "border-gray-200",
                  !selectedCategory && "text-gray-300"
                )}
              >
                <option value="" disabled selected>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.category && (
              <p className="text-xs text-red-500 font-semibold ml-1">{errors.category.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="***********"
                className={cn(
                  "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all",
                  errors.password ? "border-red-500" : "border-gray-200"
                )}
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
                className={cn(
                  "w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all",
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                )}
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

          {/* License Upload Section */}
          <div className="space-y-2 pt-2">
            <label className="text-[17px] font-bold text-gray-900 ml-1">Business License</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full border-2 border-dashed rounded-[15px] p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-orange-50/30",
                licenseUploaded ? "border-green-400 bg-green-50/30" : "border-gray-200"
              )}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {licenseUploaded ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 size={32} className="text-green-500 mb-2" />
                  <span className="text-[14px] font-bold text-green-600">License Uploaded Successfully</span>
                  {licensePreview && (
                    <img src={licensePreview} alt="Preview" className="mt-3 h-20 w-32 object-cover rounded-md border border-green-200 shadow-sm" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={32} className="mb-2" />
                  <span className="text-[14px] font-medium">Click to upload license</span>
                  <span className="text-[11px] opacity-70 mt-1">(Image format only)</span>
                </div>
              )}
            </div>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs text-red-500 font-bold text-center">{apiError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-16 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 min-w-[200px]"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate(ROUTES.AUTH)}
            className="text-[15px] font-bold text-gray-400 hover:text-[#F26A1C] transition-colors"
          >
            Already Have An Account? <span className="text-[#F26A1C]">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
