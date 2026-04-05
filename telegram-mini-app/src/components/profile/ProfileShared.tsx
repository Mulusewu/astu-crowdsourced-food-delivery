import { useState } from "react";
import { ArrowLeft, UserCircle, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import {
  getRoleIcon,
  getRoleDisplayName,
  getAvailableRoles,
} from "@/types/user.types";

export const Header = ({
  title,
  showBack,
  onBackClick,
  showRoleSwitcher = false,
}: {
  title: string;
  showBack?: boolean;
  onBackClick?: () => void;
  showRoleSwitcher?: boolean;
}) => {
  const { user, activeRole, switchRole } = useAuthStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const availableRoles = getAvailableRoles(user);
  const hasMultipleRoles = availableRoles.length > 1;

  return (
    <div className="relative flex items-center justify-center pt-6 pb-4">
      {showBack && (
        <button
          onClick={onBackClick}
          className="absolute left-5 w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="font-bold text-lg text-gray-900 dark:text-white tracking-wide">
        {title}
      </h1>

      {showRoleSwitcher && hasMultipleRoles && (
        <div className="absolute right-5">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
          >
            <UserCircle size={22} />
          </button>
          {showRoleMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRoleMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800/50 mb-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Profile
                  </p>
                </div>
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role as any);
                      setShowRoleMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span
                      className={
                        activeRole === role ? "text-[#F26A1C]" : "text-gray-500"
                      }
                    >
                      {getRoleIcon(role)}
                    </span>
                    <span
                      className={`font-medium ${activeRole === role ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                    >
                      {getRoleDisplayName(role)}
                    </span>
                    {activeRole === role && (
                      <Check size={16} className="ml-auto text-[#F26A1C]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const SoftInput = ({ icon: Icon, ...props }: any) => (
  <div className="relative flex items-center mb-4">
    {Icon && <Icon size={18} className="absolute left-4 text-gray-400" />}
    <input
      className={`w-full bg-[#FFF4ED] dark:bg-gray-900 border border-transparent focus:border-[#F26A1C] rounded-[20px] ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 text-[13px] font-medium text-gray-900 dark:text-white outline-none transition-colors shadow-sm`}
      {...props}
    />
  </div>
);

export const ActionButton = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[20px] font-bold text-[15px] py-4 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
  >
    {children}
  </button>
);
