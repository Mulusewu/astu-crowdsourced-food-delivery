import { Home, Bookmark, Package, Newspaper, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Robust active state calculation
  const isActive = (routePattern: string) => path.includes(routePattern);
  const isHomeActive = path === "/delivery/dashboard" || path === "/delivery";

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="relative w-full h-[65px]">
        {/* Wavy SVG Background (Brand Orange) */}
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

        {/* Navigation Items */}
        <div className="absolute inset-0 flex justify-between items-center px-6">
          <NavIconButton
            icon={Home}
            isActive={isHomeActive}
            onClick={() => navigate("/delivery/dashboard")}
          />

          <NavIconButton
            icon={Bookmark}
            isActive={isActive("bookmark")}
            onClick={() => navigate("/delivery/saved")}
          />

          {/* Invisible spacer for the center button */}
          <div className="w-[60px]" />

          <NavIconButton
            icon={Newspaper}
            isActive={isActive("messages")}
            onClick={() => navigate("/delivery/messages")}
          />

          {/* Profile (Uses the Shared route!) */}
          <button
            onClick={() => navigate("/delivery/profile")}
            className="relative flex items-center justify-center p-1 transition-transform active:scale-95"
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-[2.5px] transition-colors p-1",
                isActive("profile")
                  ? "border-white bg-white/20"
                  : "border-white/80",
              )}
            >
              <User
                size={20}
                className={cn(
                  "transition-colors",
                  isActive("profile")
                    ? "fill-white text-white"
                    : "fill-white/80 text-white/80",
                )}
              />
            </div>
          </button>
        </div>

        {/* Floating Center Action Button (Active Orders) */}
        {/* Floating Center Action Button (Active Orders) */}
        <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => navigate("/delivery/active")} // 👈 Changed navigation path
            className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform active:scale-95"
          >
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[2px] border-[#F26A1C] bg-orange-50">
              <Package
                size={24}
                className={cn(
                  "text-[#F26A1C] transition-transform duration-300",
                  isActive("active") // 👈 Changed active state check to match
                    ? "scale-110 fill-[#F26A1C]/20"
                    : "scale-100",
                )}
              />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavIconButton({
  icon: Icon,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
    >
      <Icon
        size={26}
        className={cn(
          "transition-all duration-300",
          isActive
            ? "fill-white text-white drop-shadow-md"
            : "fill-white/80 text-white/80",
        )}
      />
      {isActive && (
        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-white" />
      )}
    </button>
  );
}
