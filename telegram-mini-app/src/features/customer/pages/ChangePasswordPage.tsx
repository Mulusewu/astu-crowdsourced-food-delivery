import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Header, SoftInput, ActionButton } from "../components/profileShared";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="px-5 font-sans flex flex-col h-full bg-[#FDFDFD] dark:bg-gray-950">
      <Header title="Change Password" showBack />

      <div className="flex-1 mt-6 space-y-6">
        <div>
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            Enter Old Password
          </label>
          <SoftInput icon={Lock} type="password" placeholder="••••••••" />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-2 block px-2">
            Create New Password
          </label>
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="Create New Password"
          />
          <SoftInput
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
          />
        </div>
      </div>

      <div className="mt-8 mb-4">
        <ActionButton onClick={() => navigate(-1)}>
          Change Password
        </ActionButton>
      </div>
    </div>
  );
}
