import { useLocation, useNavigate } from "react-router-dom";
import { Home, Bookmark, Package, User, History } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

function DeliveryBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Robust active state calculation
  const isActive = (route: string) => path.startsWith(route) || path === route;

  // Whitelist of primary top-level routes where DeliveryBottomNav should be visible
  const primaryRoutes = [
    ROUTES.DELIVERY.DASHBOARD,
    ROUTES.DELIVERY.SAVED,
    ROUTES.DELIVERY.HISTORY.LIST,
    ROUTES.DELIVERY.ACTIVE.LIST,
    ROUTES.DELIVERY.PROFILE,
  ];

  // Check if current path matches any of the primary routes (exact or base path)
  const shouldShow = primaryRoutes.some(
    (route) => path === route || path === `${route}/`,
  );

  if (!shouldShow) {
    return null;
  }

  return (
    // Replaced hardcoded left/right with proper mobile-first constraints
    <nav className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-[375px]">
      <div className="relative w-full h-[70px]">
        {/* Wavy SVG Background (Brand Orange Solid) */}
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_8px_16px_rgba(242,106,28,0.3)]"
          viewBox="0 0 375 70"
          preserveAspectRatio="none"
        >
          <path
            d="M30,0 H135 C150,0 155,42 187.5,42 C220,42 225,0 240,0 H345 C361.5,0 375,13.5 375,35 V35 C375,56.5 361.5,70 345,70 H30 C13.5,70 0,56.5 0,35 V35 C0,13.5 13.5,0 30,0 Z"
            fill="#F26A1C"
          />
        </svg>

        {/* Navigation Items - Fluid layout */}
        <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-5 pt-1">
          <div className="flex w-[40%] justify-around">
            <NavIconButton
              icon={Home}
              active={isActive(ROUTES.DELIVERY.DASHBOARD)}
              onClick={() => navigate(ROUTES.DELIVERY.DASHBOARD)}
            />
            <NavIconButton
              icon={Bookmark}
              active={isActive(ROUTES.DELIVERY.SAVED)}
              onClick={() => navigate(ROUTES.DELIVERY.SAVED)}
            />
          </div>

          {/* Invisible Spacer exactly matching the gap of the SVG curve */}
          <div className="w-[20%] max-w-[80px]" />

          <div className="flex w-[40%] justify-around">
            <NavIconButton
              icon={History}
              active={isActive(ROUTES.DELIVERY.HISTORY.LIST)}
              onClick={() => navigate(ROUTES.DELIVERY.HISTORY.LIST)}
            />
            <NavIconButton
              icon={User}
              active={isActive(ROUTES.DELIVERY.PROFILE)}
              onClick={() => navigate(ROUTES.DELIVERY.PROFILE)}
            />
          </div>
        </div>

        {/* Floating Center Action Button (Active Deliveries) */}
        <div className="absolute left-1/2 top-[-26px] z-20 -translate-x-1/2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DELIVERY.ACTIVE.LIST)}
            className="relative flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white shadow-xl transition-transform active:scale-90"
          >
            <div
              className={cn(
                "flex h-[52px] w-[52px] items-center justify-center rounded-full border-[2.5px] border-[#F26A1C] bg-white transition-all",
                isActive(ROUTES.DELIVERY.ACTIVE.LIST) && "bg-orange-50",
              )}
            >
              <Package
                size={26}
                className="text-[#F26A1C]"
                strokeWidth={2.5}
                fill={
                  isActive(ROUTES.DELIVERY.ACTIVE.LIST)
                    ? "currentColor"
                    : "none"
                }
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
  active,
  onClick,
}: {
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] items-center justify-center transition-all duration-300 active:scale-95",
        active
          ? "bg-white rounded-full shadow-md scale-105"
          : "bg-transparent scale-100",
      )}
    >
      <Icon
        size={24}
        strokeWidth={2.5}
        className={cn(
          "transition-all duration-300",
          active
            ? "text-[#F26A1C] fill-[#F26A1C]"
            : "text-white fill-none opacity-80",
        )}
      />
    </button>
  );
}

export default DeliveryBottomNav;