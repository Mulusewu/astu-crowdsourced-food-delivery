import { useState } from "react";
import { Check, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { getRoleIcon, getRoleDisplayName } from "@/types/user.types";

export default function RoleDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { roles, activeRole, switchRole } = useAuthStore();

  // If user only has 1 role, don't show the dropdown at all
  if (!roles || roles.length <= 1) return null;

  return (
    <div className="absolute right-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
      >
        <UserCircle size={22} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800/50 mb-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Switch Profile
              </p>
            </div>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setIsOpen(false);
                  switchRole(role);
                  // Note: Your store already handles window.location.href redirect!
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
  );
}
