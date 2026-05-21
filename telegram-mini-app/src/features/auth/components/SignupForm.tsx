import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, User, Store, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth/authStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// --- STRICT SCHEMAS ---
const studentSchema = z.object({
  fullName: z.string().trim().min(2, 'Name Is Too Short!').max(50),
  astuEmail: z.string().trim().toLowerCase().regex(/^[a-zA-Z0-9._%+-]+@astu\.edu\.et$/, 'Must be an @astu.edu.et email'),
  password: z.string().min(8, 'Password Is Too Short!').regex(/[A-Z]/, 'Must Contain Uppercase!').regex(/[0-9]/, 'Must Contain Number!'),
  confirmPassword: z.string(),
  // telegramId must be mapped as a default for the backend
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password Doesn't Match!",
  path: ['confirmPassword'],
});

const vendorSchema = z.object({
  vendorName: z.string().trim().min(2, 'Vendor Name Is Too Short!').max(50),
  email: z.string().email('Please Enter A Valid Email!'),
  contactNumber: z.string().regex(/^(09|07)\d{8}$/, 'Must be a valid Ethiopian phone number'),
  password: z.string().min(8, 'Password Is Too Short!').regex(/[A-Z]/, 'Must Contain Uppercase!').regex(/[0-9]/, 'Must Contain Number!'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password Doesn't Match!",
  path: ['confirmPassword'],
});

type StudentFormData = z.infer<typeof studentSchema>;
type VendorFormData = z.infer<typeof vendorSchema>;
type SignupFormData = StudentFormData | VendorFormData;

export default function SignupForm() {
  const { signup, signupVendor, isLoading, clearError, error: storeError } = useAuthStore();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [signupMode, setSignupMode] = useState<'student' | 'vendor'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [licenseUploaded, setLicenseUploaded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupMode === 'student' ? studentSchema : vendorSchema),
    mode: 'onChange',
  });

  // Clear form entirely when mode switches to prevent ghost validation errors
  useEffect(() => {
    reset();
    clearError();
    setApiError(null);
    setLicenseUploaded(false);
    setLicensePreview(null);
  }, [signupMode, reset, clearError]);

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

  const onSubmit = async (data: any) => {
    setApiError(null);
    clearError();
    try {
      if (signupMode === 'student') {
        // Backend mapping
        await signup({ // Fallback for web users
          astuEmail: data.astuEmail,
          fullName: data.fullName,
          phoneNumber: "0900000000", // Fallback required by backend
          password: data.password,
            intendedMode: "student"
        }, navigate);
      } else {
        if (!licenseUploaded) {
          setApiError('Business License is required for Vendors.');
          return;
        }
        await signupVendor({
          vendorName: data.vendorName,
          email: data.email,
          contactNumber: data.contactNumber,
          password: data.password,
          businessDocumentUrl: "https://example.com/license-placeholder.pdf", // Placeholder until AWS integration
          intendedMode: "vendor"
        }, navigate);
      }
    } catch (err: any) {
       // Error handled by store
    }
  };

  // Safe cast for strict TS rendering of conditional fields
  const studentErrors = errors as any;
  const vendorErrors = errors as any;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans flex flex-col items-center pt-16">
      <style>{`
        @keyframes ride { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes dash { 0% { stroke-dashoffset: 20; opacity: 0.4; } 50% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0.4; } }
        .scooter-ride { animation: ride 0.25s ease-in-out infinite; }
        .motion-line { stroke-dasharray: 10 5; animation: dash 0.4s linear infinite; }
      `}</style>

      <div className="w-full max-w-[340px] px-4 flex flex-col items-center pb-20">
        
        {/* LOGO SECTION */}
        <div className="relative flex items-center justify-center w-full mb-12 mt-2 pr-6">
          <div className="flex flex-col items-start mr-2">
            <span className="text-[44px] font-black text-black dark:text-white leading-[0.8] tracking-tight drop-shadow-md">ASTU</span>
            <span className="text-[52px] font-black text-[#F26A1C] leading-[0.8] tracking-tight drop-shadow-md">EATS</span>
          </div>
          <div className="flex flex-col items-center -mt-10 -mb-2">
            <div className="flex flex-col items-center">
              <svg width="110" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F26A1C] scooter-ride">
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
              <span className="text-[#F26A1C] text-[24px] font-black italic tracking-tight -mt-1">Delivery</span>
            </div>
          </div>
        </div>

        {/* MODE TOGGLE */}
        <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-1 rounded-[14px] flex mb-6">
          <button
            type="button"
            onClick={() => setSignupMode('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-bold rounded-[10px] transition-all ${
              signupMode === 'student' ? 'bg-white dark:bg-gray-800 text-[#F26A1C] dark:text-[#ff650b] shadow-sm ring-1 ring-gray-200/50' : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}>
            <User size={16} strokeWidth={signupMode === 'student' ? 2.5 : 2} /> Student
          </button>
          <button
            type="button"
            onClick={() => setSignupMode('vendor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-bold rounded-[10px] transition-all ${
              signupMode === 'vendor' ? 'bg-white dark:bg-gray-800 text-[#F26A1C] dark:text-[#ff650b] shadow-sm ring-1 ring-gray-200/50' : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}>
            <Store size={16} strokeWidth={signupMode === 'vendor' ? 2.5 : 2} /> Vendor
          </button>
        </div>

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">

          {/* Dynamic Name */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">
              {signupMode === 'student' ? 'Full Name' : 'Vendor Name'}
            </label>
            <input
              {...register(signupMode === 'student' ? "fullName" : "vendorName")}
              placeholder={signupMode === 'student' ? 'John Doe' : 'Restaurant Name'}
              className={cn("w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all", 
                (studentErrors.fullName || vendorErrors.vendorName) ? "border-red-500" : "border-gray-200 dark:border-gray-600"
              )}
            />
            {signupMode === 'student' && studentErrors.fullName && <p className="text-xs text-red-500 font-semibold ml-1">{studentErrors.fullName.message}</p>}
            {signupMode === 'vendor' && vendorErrors.vendorName && <p className="text-xs text-red-500 font-semibold ml-1">{vendorErrors.vendorName.message}</p>}
          </div>

          {/* Dynamic Email */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">
              {signupMode === 'student' ? 'ASTU Email' : 'Contact Email'}
            </label>
            <input
              type="email"
              {...register(signupMode === 'student' ? 'astuEmail' : 'email')}
              placeholder={signupMode === 'student' ? 'name.surname@astu.edu.et' : 'contact@business.com'}
              className={cn("w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all", 
                (studentErrors.astuEmail || vendorErrors.email) ? "border-red-500" : "border-gray-200 dark:border-gray-600"
              )}
            />
            {signupMode === 'student' && studentErrors.astuEmail && <p className="text-xs text-red-500 font-semibold ml-1">{studentErrors.astuEmail.message}</p>}
            {signupMode === 'vendor' && vendorErrors.email && <p className="text-xs text-red-500 font-semibold ml-1">{vendorErrors.email.message}</p>}
          </div>

          {/* Phone (Vendor Only) */}
          {signupMode === 'vendor' && (
            <div className="space-y-1">
              <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">Contact Number</label>
              <input
                {...register('contactNumber')}
                placeholder="0911223344"
                className={cn("w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all", vendorErrors.contactNumber ? "border-red-500" : "border-gray-200 dark:border-gray-600")}
              />
              {vendorErrors.contactNumber && <p className="text-xs text-red-500 font-semibold ml-1">{vendorErrors.contactNumber.message}</p>}
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="***********"
                className={cn("w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all", errors.password ? "border-red-500" : "border-gray-200 dark:border-gray-600")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 font-semibold ml-1">{errors.password.message as string}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="***********"
                className={cn("w-full h-13 border rounded-[10px] px-5 text-[15px] font-medium text-gray-900 dark:text-gray-300 focus:border-[#F26A1C] focus:outline-none transition-all", errors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-gray-600")}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 font-semibold ml-1">{errors.confirmPassword.message as string}</p>}
          </div>

          {/* License Upload (Vendor Only) */}
          {signupMode === 'vendor' && (
            <div className="space-y-2 pt-2">
              <label className="text-[17px] font-bold text-gray-900 dark:text-gray-300 ml-1">Business License</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'w-full border-2 border-dashed rounded-[15px] p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-orange-50/30',
                  licenseUploaded ? 'border-green-400 bg-green-50/30' : 'border-gray-200 dark:border-gray-600'
                )}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {licenseUploaded ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 size={32} className="text-green-500 mb-2" />
                    <span className="text-[14px] font-bold text-green-600">License Uploaded Successfully</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                    <Upload size={32} className="mb-2" />
                    <span className="text-[14px] font-medium">Click to upload license</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unified Error Rendering */}
          {(apiError || storeError) && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs text-red-500 font-bold text-center">{apiError || storeError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="bg-[#F26A1C] hover:bg-[#e05d15] text-white font-black text-[22px] px-16 py-3.5 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-70 min-w-[200px]">
              {isLoading ? 'Wait...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}