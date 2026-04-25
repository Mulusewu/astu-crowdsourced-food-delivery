import { useLocation, useNavigate } from "react-router-dom";
import { Home, Bookmark, Package, FileText, User } from "lucide-react";
import { useCartStore } from "@/store/cart/cartStore";
import { ROUTES } from "@/routes/routePaths";

function CustomerBottomNav() {
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

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
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <NavIconButton
            icon={Home}
            active={isActive(ROUTES.CUSTOMER.HOME)}
            onClick={() => navigate(ROUTES.CUSTOMER.HOME)}
          />

          <NavIconButton
            icon={Bookmark}
            active={isActive(ROUTES.CUSTOMER.FAVORITES)}
            onClick={() => navigate(ROUTES.CUSTOMER.FAVORITES)}
          />

          {/* Invisible spacer for the center cutout */}
          <div className="w-[60px]" />

          <NavIconButton
            icon={FileText}
            active={
              isActive(ROUTES.CUSTOMER.ORDERS.TRACK) ||
              isActive(ROUTES.CUSTOMER.ORDERS.HISTORY)
            }
            onClick={() => navigate(ROUTES.CUSTOMER.ORDERS.LIST)}
          />

          <NavIconButton
            icon={User}
            active={isActive(ROUTES.CUSTOMER.PROFILE)}
            onClick={() => navigate(ROUTES.CUSTOMER.PROFILE)}
          />
        </div>

        {/* Floating Center Action Button (Cart) */}
        <div className="absolute left-1/2 top-[-22px] z-20 -translate-x-1/2">
          <button
            type="button"
            aria-label="Cart"
            onClick={() => navigate(ROUTES.CUSTOMER.CART)}
            className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform active:scale-95"
          >
            {/* Inner orange border ring matching the design */}
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[2.5px] border-[#F26A1C] bg-white">
              <Package size={22} className="text-[#F26A1C]" strokeWidth={2.5} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -right-1 top-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
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
      className="relative flex items-center justify-center transition-transform active:scale-95"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
          active ? "bg-white" : "bg-transparent"
        }`}
      >
        <Icon
          size={24}
          strokeWidth={active ? 2.5 : 2.5}
          fill="currentColor"
          className={active ? "text-[#F26A1C]" : "text-white"}
        />
      </div>
    </button>
  );
}

export default CustomerBottomNav;
