import { Home, Bookmark, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import orderTrackingIcon from "/orderTrackingIcon.png"; // ← Image from public folder

import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  activeTab?: "home" | "bookmark" | "orders" | "messages" | "profile";
  onTabChange?: (
    tab: "home" | "bookmark" | "orders" | "messages" | "profile",
  ) => void;
}

const BottomNav = ({ activeTab = "home", onTabChange }: BottomNavProps) => {
  const navigate = useNavigate();

  const navigateToActiveOrders = () => {
    navigate("/delivery/active");
  };
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "#F26A1C",
          boxShadow:
            "0 12px 35px -10px rgba(242, 106, 28, 0.4), 0 4px 12px -4px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="flex items-center justify-between px-2 py-3 relative">
          {/* Home */}
          <NavButton
            icon={Home}
            label="Home"
            isActive={activeTab === "home"}
            onClick={() => onTabChange?.("home")}
          />

          {/* Bookmark */}
          <NavButton
            icon={Bookmark}
            label="Bookmark"
            isActive={activeTab === "bookmark"}
            onClick={() => onTabChange?.("bookmark")}
          />

          {/* Center Order Tracking Button - Using Your Exact Image */}
          <div className="relative -mt-10 z-20">
            <button
              // onClick={() => onTabChange?.("orders")}
              onClick={navigateToActiveOrders}
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full transition-all active:scale-95 overflow-hidden",
                activeTab === "orders" ? "bg-white" : "bg-white",
              )}
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 6px 15px -6px rgba(242, 106, 28, 0.35)",
              }}
            >
              <img
                src={orderTrackingIcon}
                alt="Order Tracking"
                className={cn(
                  "h-10 w-10 transition-all duration-200 object-contain",
                  activeTab === "orders" ? "scale-110" : "scale-100",
                )}
              />
            </button>
          </div>

          {/* Messages */}
          <NavButton
            icon={MessageCircle}
            label="Messages"
            isActive={activeTab === "messages"}
            onClick={() => onTabChange?.("messages")}
          />

          {/* Profile */}
          <NavButton
            icon={User}
            label="Profile"
            isActive={activeTab === "profile"}
            onClick={() => onTabChange?.("profile")}
          />
        </div>
      </div>
    </nav>
  );
};

// Reusable Side Button (unchanged - clean & independent)
interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: NavButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center py-1 px-4 transition-all active:scale-95 relative min-w-[60px]"
    >
      {/* Active Indicator Dot */}
      {isActive && (
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white" />
      )}

      <Icon
        size={21}
        strokeWidth={isActive ? 2.75 : 2.25}
        className={cn(
          "transition-all duration-200",
          isActive ? "text-white scale-110" : "text-white/80",
        )}
      />

      <span
        className={cn(
          "text-[10px] font-medium mt-1 transition-all tracking-tight",
          isActive ? "text-white font-semibold" : "text-white/70",
        )}
      >
        {label}
      </span>

      {/* Subtle tap feedback */}
      <span className="absolute inset-0 rounded-2xl bg-white/15 opacity-0 active:opacity-30 transition-opacity duration-150" />
    </button>
  );
};

export default BottomNav;
