import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header, ActionButton } from "../components/profileShared";
// Note: CustomerLayout handles BottomNav, so we don't import it here.

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="px-5 font-sans flex flex-col h-full">
      <Header title="Customer Profile" />

      <div className="flex flex-col items-center mt-4 mb-8">
        <Avatar className="w-24 h-24 border-[3px] border-white dark:border-gray-900 shadow-md mb-3">
          <AvatarImage
            src={user?.avatar || "https://i.pravatar.cc/150?u=gray"}
          />
          <AvatarFallback className="bg-[#F26A1C] text-white text-2xl font-bold">
            {user?.name?.[0] || "G"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-black text-gray-900 dark:text-white">
          {user?.name || "Gray Johnson"}
        </h2>
        <p className="text-gray-500 text-sm font-medium mt-0.5">
          +251912345678
        </p>
      </div>

      <div className="flex-1 space-y-2">
        {[
          { label: "Profile", path: "/customer/profile/edit" },
          {
            label: "Change Password",
            path: "/customer/profile/change-password",
          },
          { label: "Payment Information", path: "/payment/methods" },
          { label: "Notification", path: "/customer/notifications" },
          { label: "About Us", path: "/about" },
          { label: "Contact Us", path: "/contact" },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800/60 active:opacity-70 transition-opacity"
          >
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {item.label}
            </span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        ))}
      </div>

      <div className="mt-8 mb-4">
        <ActionButton onClick={handleLogout}>Log Out</ActionButton>
      </div>
    </div>
  );
}
