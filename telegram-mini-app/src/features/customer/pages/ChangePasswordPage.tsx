import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Header, SoftInput, ActionButton } from "../components/profileShared";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

type PasswordData = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordData) => {
    setApiError(null);
    try {
      await updatePassword(data.oldPassword, data.newPassword);
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      setApiError("Failed to update password. Please check your current password.");
    }
  };

  if (success) {
    return (
      <div className="px-5 font-sans flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-gray-950 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Password Updated!</h2>
          <p className="text-sm text-gray-500 text-center">Your password has been changed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-5 font-sans flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Change Password" showBack />

      <div className="flex-1 mt-6 space-y-6">
        <div>
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            Current Password
          </label>
          <SoftInput
            {...register("oldPassword")}
            icon={Lock}
            type="password"
            placeholder="••••••••"
          />
          {errors.oldPassword && <p className="text-xs text-red-500 font-semibold px-2 -mt-2">{errors.oldPassword.message}</p>}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            New Password
          </label>
          <SoftInput
            {...register("newPassword")}
            icon={Lock}
            type="password"
            placeholder="Min. 8 characters"
          />
          {errors.newPassword && <p className="text-xs text-red-500 font-semibold px-2 -mt-2">{errors.newPassword.message}</p>}
          
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2 mt-4">
            Confirm New Password
          </label>
          <SoftInput
            {...register("confirmPassword")}
            icon={Lock}
            type="password"
            placeholder="Repeat new password"
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 font-semibold px-2 -mt-2">{errors.confirmPassword.message}</p>}
        </div>

        {apiError && (
          <p className="text-sm font-semibold text-red-500 px-2 -mt-2">
            {apiError}
          </p>
        )}
      </div>

      <div className="mt-8 mb-6">
        <ActionButton type="submit" disabled={!isValid || isSubmitting || isLoading}>
          {isLoading || isSubmitting ? "Updating..." : "Change Password"}
        </ActionButton>
      </div>
    </form>
  );
}
