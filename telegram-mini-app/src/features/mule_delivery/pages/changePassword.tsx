import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";

import { useAuthStore } from "@/store/auth/authStore";
import {
  Header,
  SoftInput,
  ActionButton,
} from "@/features/shared/components/ProfileShared";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useAuthStore();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    // 1. Check all fields are filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // 2. Check that newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      // 3. Call updatePassword from store
      await updatePassword(oldPassword, newPassword);

      // 4. Success feedback
      alert("Password Updated Successfully!");
      console.log("✅ Password Update Success");

      // 5. Navigate back
      navigate("/delivery/profile");
    } catch (err) {
      console.error("Failed to update password", err);
    }
  };

  return (
    <div className="bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col">
      <Header
        title="Change Password"
        showBack
        onBackClick={() => navigate(ROUTES.DELIVERY.PROFILE)}
      />

      <div className="flex-1 mt-6 space-y-6 px-5">
        <div>
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            Enter Old Password
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
            Create New Password
          </label>
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="Create New Password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
          />
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
        </div>
      </div>

      <div className="mt-8 px-5">
        <ActionButton onClick={handlePasswordChange} disabled={isLoading}>
          {isLoading ? "Updating..." : "Change Password"}
        </ActionButton>
      </div>
    </div>
  );
}
