import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Bookmark,
  Package,
  User,
  LayoutList,
  ClipboardList,
  Bell,
  History
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

/**
 * CustomerBottomNav
 * Primary navigation component for the application.
 * Switches configuration based on the user's active mode (Customer/Deliverer).
 */
function CustomerBottomNav() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => path.startsWith(route) || path === route;

  const getNavConfig = () => {
    // Deliverer Mode Navigation
    if (user?.activeMode === "DELIVERER") {
      return {
        items: [
          { id: "home", icon: Home, path: ROUTES.DELIVERY.DASHBOARD },
          { id: "saved", icon: Bookmark, path: ROUTES.DELIVERY.SAVED },
          { id: "history", icon: ClipboardList, path: ROUTES.DELIVERY.HISTORY.LIST },
          { id: "profile", icon: User, path: ROUTES.DELIVERY.PROFILE },
        ],
        center: { id: "active", icon: Package, path: ROUTES.DELIVERY.ACTIVE.LIST },
      };
    }

    // Vendor Staff Navigation
    if (user?.role === "VENDOR_STAFF") {
      return {
        items: [
          { id: "home", icon: Home, path: "/vendor/dashboard" },
          { id: "menu", icon: LayoutList, path: "/vendor/menu" },
          { id: "history", icon: ClipboardList, path: "/vendor/history" },
          { id: "profile", icon: User, path: "/profile" },
        ],
        center: { id: "orders", icon: Bell, path: "/vendor/orders/active" },
      };
    }

    // Customer Navigation (Default)
    return {
      items: [
        { id: "home", icon: Home, path: ROUTES.CUSTOMER.HOME },
        { id: "favs", icon: Bookmark, path: ROUTES.CUSTOMER.FAVORITES },
        { id: "history", icon: History, path: ROUTES.CUSTOMER.HISTORY },
        { id: "profile", icon: User, path: ROUTES.CUSTOMER.PROFILE },
      ],
      center: { id: "orders", icon: Package, path: ROUTES.CUSTOMER.ORDERS.LIST },
    };
  };

  const config = getNavConfig();

  // Primary top-level routes where BottomNav should be visible
  const primaryRoutes = [
    ROUTES.DELIVERY.DASHBOARD,
    ROUTES.DELIVERY.SAVED,
    ROUTES.DELIVERY.HISTORY.LIST,
    ROUTES.DELIVERY.ACTIVE.LIST,
    ROUTES.DELIVERY.PROFILE,
    ROUTES.VENDOR.DASHBOARD,
    ROUTES.VENDOR.MENU.LIST,
    ROUTES.VENDOR.ORDERS.LIST,
    ROUTES.VENDOR.ORDERS.HISTORY,
    ROUTES.CUSTOMER.HOME,
    ROUTES.CUSTOMER.FAVORITES,
    ROUTES.CUSTOMER.ORDERS.LIST,
    ROUTES.CUSTOMER.PROFILE,
    ROUTES.CUSTOMER.HISTORY,
  ];

  const shouldShow = primaryRoutes.some(
    (route) => path === route || path === `${route}/`,
  );

  if (!shouldShow) return null;

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-[375px]">
      <div className="relative w-full h-[70px]">
        {/* Wavy Background */}
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

        {/* Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-5 pt-1">
          <div className="flex w-[40%] justify-around">
            <NavIconButton icon={config.items[0].icon} active={isActive(config.items[0].path)} onClick={() => navigate(config.items[0].path)} />
            <NavIconButton icon={config.items[1].icon} active={isActive(config.items[1].path)} onClick={() => navigate(config.items[1].path)} />
          </div>

          <div className="w-[20%] max-w-[80px]" />

          <div className="flex w-[40%] justify-around">
            <NavIconButton icon={config.items[2].icon} active={isActive(config.items[2].path)} onClick={() => navigate(config.items[2].path)} />
            <NavIconButton icon={config.items[3].icon} active={isActive(config.items[3].path)} onClick={() => navigate(config.items[3].path)} />
          </div>
        </div>

        {/* Center Button */}
        <div className="absolute left-1/2 top-[-26px] z-20 -translate-x-1/2">
          <button
            type="button"
            onClick={() => navigate(config.center.path)}
            className="relative flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white shadow-xl transition-transform active:scale-90"
          >
            <div
              className={cn(
                "flex h-[52px] w-[52px] items-center justify-center rounded-full border-[2.5px] border-[#F26A1C] bg-white transition-all",
                isActive(config.center.path) && "bg-orange-50",
              )}
            >
              <config.center.icon size={26} className="text-[#F26A1C]" strokeWidth={2.5} fill={isActive(config.center.path) ? "currentColor" : "none"} />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavIconButton({ icon: Icon, active, onClick }: { icon: React.ElementType; active: boolean; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] items-center justify-center transition-all duration-300 active:scale-95",
        active ? "bg-white rounded-full shadow-md scale-105" : "bg-transparent scale-100",
      )}
    >
      <Icon
        size={24}
        strokeWidth={2.5}
        className={cn(
          "transition-all duration-300",
          active ? "text-[#F26A1C] fill-[#F26A1C]" : "text-white fill-none opacity-80",
        )}
      />
    </button>
  );
}

export default CustomerBottomNav;