import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Header, SoftInput, ActionButton } from "../components/profileShared";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useAuthStore();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setValidationError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setValidationError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match.");
      return;
    }

    try {
      await updatePassword(oldPassword, newPassword);
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      setValidationError("Failed to update password. Please try again.");
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
    <div className="px-5 font-sans flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Change Password" showBack />

      <div className="flex-1 mt-6 space-y-6">
        <div>
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            Current Password
          </label>
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOldPassword(e.target.value)
            }
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            New Password
          </label>
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
          />
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2 mt-4">
            Confirm New Password
          </label>
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>

        {validationError && (
          <p className="text-sm font-semibold text-red-500 px-2 -mt-2">
            {validationError}
          </p>
        )}
      </div>

      <div className="mt-8 mb-6">
        <ActionButton onClick={handleSubmit}>
          {isLoading ? "Updating..." : "Change Password"}
        </ActionButton>
      </div>
    </div>
  );
}
