import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";
import {
  Header,
  SoftInput,
  ActionButton,
} from "@/components/profile/ProfileShared";

export default function ChangePassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 pb-28 font-sans flex flex-col">
      <Header
        title="Change Password"
        showBack
        onBackClick={() => navigate(-1)}
      />

      <div className="flex-1 mt-6 space-y-6 px-5">
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

      <div className="mt-8 px-5">
        <ActionButton onClick={() => navigate("/delivery/profile")}>
          Change Password
        </ActionButton>
      </div>
      <BottomNav />
    </div>
  );
}
