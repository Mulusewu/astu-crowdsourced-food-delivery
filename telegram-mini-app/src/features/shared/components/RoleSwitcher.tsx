// src/components/common/RoleSwitcher.tsx
import { useAuthStore } from "@/store/auth/authStore";
import {type UserRole } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  customer: "Customer",
  vendor: "Vendor",
  delivery: "Delivery",
  admin: "Admin",
};

const roleColors: Record<UserRole, string> = {
  customer: "bg-blue-100 text-blue-700",
  vendor: "bg-purple-100 text-purple-700",
  delivery: "bg-orange-100 text-orange-700",
  admin: "bg-red-100 text-red-700",
};

export default function RoleSwitcher() {
  const { user, roles, activeRole, switchRole, logout } = useAuthStore();

  if (!user || roles.length <= 1) return null; // Hide if user has only one role

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-white">
      <p className="text-xs text-gray-500 mb-2 font-medium">Switch Role</p>
      
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Button
            key={role}
            variant={activeRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => switchRole(role)}
            className={`rounded-2xl text-sm font-medium transition-all ${
              activeRole === role 
                ? "bg-[#F26A1C] text-white hover:bg-[#F26A1C]/90" 
                : ""
            }`}
          >
            {roleLabels[role]}
            {activeRole === role && (
              <Badge className="ml-1.5 bg-white/20 text-white text-[10px] px-1.5 py-0">Active</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl"
      >
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </div>
  );
}