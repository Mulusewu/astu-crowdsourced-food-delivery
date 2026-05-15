import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Bookmark,
  Package,
  FileText,
  User,
  LayoutList,
  ClipboardList,
  Bell,
  BarChart2
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { useCartStore } from "@/store/cart/cartStore";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

function BottomNav() {
  const { activeRole } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const cartCount = getTotalItems();
  const isActive = (route: string) => path.startsWith(route);

  // Define navigation items based on role
  const getNavConfig = () => {
    switch (activeRole) {
      case "delivery":
        return {
          items: [
            { id: "home", icon: Home, path: ROUTES.DELIVERY.DASHBOARD, label: "Home" },
            { id: "saved", icon: Bookmark, path: ROUTES.DELIVERY.SAVED, label: "Saved" },
            { id: "history", icon: ClipboardList, path: ROUTES.DELIVERY.HISTORY.LIST, label: "History" },
            { id: "profile", icon: User, path: ROUTES.DELIVERY.PROFILE, label: "Profile" },
          ],
          center: { id: "active", icon: Package, path: ROUTES.DELIVERY.ACTIVE.LIST, label: "Deliveries" }
        };
      case "vendor":
        return {
          items: [
            { id: "home", icon: Home, path: ROUTES.VENDOR.DASHBOARD, label: "Home" },
            { id: "analytics", icon: BarChart2, path: ROUTES.VENDOR.ANALYTICS, label: "Analytics" },
            { id: "menu", icon: FileText, path: ROUTES.VENDOR.MENU.LIST, label: "Menu" },
            { id: "profile", icon: User, path: ROUTES.VENDOR.SETTINGS.PROFILE, label: "Profile" },
          ],
          center: { id: "orders", icon: Package, path: ROUTES.VENDOR.ORDERS.LIST, label: "Order Status" }
        };
      case "customer":
      default:
        return {
          items: [
            { id: "home", icon: Home, path: ROUTES.CUSTOMER.HOME, label: "Home" },
            { id: "favs", icon: Bookmark, path: ROUTES.CUSTOMER.FAVORITES, label: "Favs" },
            { id: "orders", icon: FileText, path: ROUTES.CUSTOMER.ORDERS.LIST, label: "Orders" },
            { id: "profile", icon: User, path: ROUTES.CUSTOMER.PROFILE, label: "Profile" },
          ],
          center: { id: "cart", icon: Package, path: ROUTES.CUSTOMER.CART, label: "Cart", count: cartCount }
        };
    }
  };

  const config = getNavConfig();

  // Whitelist of primary top-level routes where BottomNav should be visible
  const primaryRoutes = [
    // Delivery Routes
    ROUTES.DELIVERY.DASHBOARD,
    ROUTES.DELIVERY.SAVED,
    ROUTES.DELIVERY.HISTORY.LIST,
    ROUTES.DELIVERY.ACTIVE.LIST,
    ROUTES.DELIVERY.PROFILE,

    // Vendor Routes
    ROUTES.VENDOR.DASHBOARD,
    ROUTES.VENDOR.ANALYTICS,
    ROUTES.VENDOR.MENU.LIST,
    ROUTES.VENDOR.ORDERS.LIST,
    ROUTES.VENDOR.ORDERS.HISTORY,
    ROUTES.VENDOR.SETTINGS.PROFILE,

    // Customer Routes
    ROUTES.CUSTOMER.HOME,
    ROUTES.CUSTOMER.FAVORITES,
    ROUTES.CUSTOMER.ORDERS.LIST,
    ROUTES.CUSTOMER.PROFILE,
    ROUTES.CUSTOMER.CART
  ];

  // Check if current path matches any of the primary routes (exact or base path)
  const shouldShow = primaryRoutes.some(route => path === route || path === `${route}/`);

  if (!shouldShow) {
    return null;
  }

  return (
    <nav className="fixed bottom-6 left-[100px] right-[100px] z-50 mx-auto max-w-sm">
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

        {/* Navigation Items */}
        <div className="absolute inset-0 flex items-center justify-around px-1 pt-1">
          <NavIconButton
            icon={config.items[0].icon}
            active={isActive(config.items[0].path)}
            onClick={() => navigate(config.items[0].path)}
          />
          <NavIconButton
            icon={config.items[1].icon}
            active={isActive(config.items[1].path)}
            onClick={() => navigate(config.items[1].path)}
          />

          {/* Spacer for the center button */}
          <div className="w-10" />

          <NavIconButton
            icon={config.items[2].icon}
            active={isActive(config.items[2].path)}
            onClick={() => navigate(config.items[2].path)}
          />
          <NavIconButton
            icon={config.items[3].icon}
            active={isActive(config.items[3].path)}
            onClick={() => navigate(config.items[3].path)}
          />
        </div>

        {/* Floating Center Action Button */}
        <div className="absolute left-1/2 top-[-28px] z-20 -translate-x-1/2">
          <button
            type="button"
            onClick={() => navigate(config.center.path)}
            className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full bg-white shadow-xl transition-transform active:scale-90"
          >
            <div className={cn(
              "flex h-[54px] w-[54px] items-center justify-center rounded-full border-[2.5px] border-[#F26A1C] bg-white transition-all",
              isActive(config.center.path) && "bg-orange-50"
            )}>
              <config.center.icon
                size={30}
                className="text-[#F26A1C]"
                strokeWidth={2.5}
                fill={isActive(config.center.path) ? "currentColor" : "none"}
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
        "relative flex h-[52px] w-[52px] items-center justify-center transition-all duration-300 active:scale-95",
        active ? "bg-white rounded-full shadow-md scale-105" : "bg-transparent scale-100"
      )}
    >
      <Icon
        size={24}
        strokeWidth={2.5}
        className={cn(
          "transition-all duration-300",
          active ? "text-[#F26A1C] fill-[#F26A1C]" : "text-white fill-none opacity-80"
        )}
      />
    </button>
  );
}

export default BottomNav;
