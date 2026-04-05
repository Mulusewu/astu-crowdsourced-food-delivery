import { Home, Bookmark, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import orderTrackingIcon from "/orderTrackingIcon.png";

interface BottomNavProps {
  activeTab?: "home" | "bookmark" | "orders" | "messages" | "profile";
  onTabChange?: (tab: "home" | "bookmark" | "orders" | "messages" | "profile") => void;
}

export default function BottomNav({ activeTab = "home", onTabChange }: BottomNavProps) {
  const navigate = useNavigate();

  const handleCenterClick = () => {
    onTabChange?.("orders");
    navigate("/delivery/active");
  };
  const handleHomeClick = () => {
    onTabChange?.("home");
    navigate("/delivery/dashboard");
  };

  const handleProfileClick = () => {
    onTabChange?.("profile");
    navigate("/delivery/profile");
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="relative w-full h-[65px]">
        
        {/* 1. Custom SVG Background for the Wavy Shape */}
        <svg 
          className="absolute inset-0 w-full h-full drop-shadow-[0_8px_16px_rgba(242,106,28,0.3)]" 
          viewBox="0 0 375 70" 
          preserveAspectRatio="none"
        >
          <path 
            d="M24,0 H132 C145,0 152,38 187.5,38 C223,38 230,0 243,0 H351 C364.25,0 375,10.75 375,24 V46 C375,59.25 364.25,70 351,70 H24 C10.75,70 0,59.25 0,46 V24 C0,10.75 10.75,0 24,0 Z" 
            fill="#F26A1C" 
          />
        </svg>

        {/* 2. Navigation Items */}
        <div className="absolute inset-0 flex justify-between items-center px-6">
          
          {/* Home */}
          <NavIconButton
            icon={Home}
            isActive={activeTab === "home"}
            // onClick={() => onTabChange?.("home")}
             onClick={handleHomeClick}
          />

          {/* Bookmark */}
          <NavIconButton
            icon={Bookmark}
            isActive={activeTab === "bookmark"}
            onClick={() => onTabChange?.("bookmark")}
          />

          {/* Invisible spacer for the center button */}
          <div className="w-[60px]" />

          {/* Messages / Orders list */}
          <NavIconButton
            icon={FileText}
            isActive={activeTab === "messages"}
            onClick={() => onTabChange?.("messages")}
          />

          {/* Profile (Wrapped in a circular border to match the design) */}
          <button
            // onClick={() => onTabChange?.("profile")  || handleProfileClick}
            onClick={ handleProfileClick}
            className="relative flex items-center justify-center p-1 transition-transform active:scale-95"
          >
            <div className={cn(
              "flex items-center justify-center rounded-full border-[2.5px] transition-colors p-1",
              activeTab === "profile" ? "border-white bg-white/20" : "border-white/80"
            )}>
              <User
                size={20}
                className={cn("transition-colors", activeTab === "profile" ? "fill-white text-white" : "fill-white/80 text-white/80")}
              />
            </div>
          </button>
        </div>

        {/* 3. Floating Center Action Button */}
        <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleCenterClick}
            className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform active:scale-95"
          >
            {/* Inner Orange Ring matching your design */}
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[2px] border-[#F26A1C]">
              <img
                src={orderTrackingIcon}
                alt="Track Order"
                className={cn(
                  "h-7 w-7 object-contain transition-transform duration-300",
                  activeTab === "orders" ? "scale-110" : "scale-100"
                )}
              />
            </div>
          </button>
        </div>

      </div>
    </nav>
  );
}

// --- Subcomponent for standard icons ---
interface NavIconButtonProps {
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

function NavIconButton({ icon: Icon, isActive, onClick }: NavIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
    >
      <Icon
        size={26}
        className={cn(
          "transition-all duration-300",
          isActive ? "fill-white text-white drop-shadow-md" : "fill-white/80 text-white/80"
        )}
      />
      {/* Subtle indicator dot (Optional, keeping it clean based on design) */}
      {isActive && (
        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-white" />
      )}
    </button>
  );
}