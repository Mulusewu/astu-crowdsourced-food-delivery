import {
  Home,
  Bookmark,
  Package,
  Newspaper,
  User,
  type LucideIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type NavItemConfig = {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  center?: boolean;
};

const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", path: "/delivery/dashboard", icon: Home, label: "Home" },
  { id: "bookmark", path: "/delivery/saved", icon: Bookmark, label: "Bookmarks" },
  { id: "active", path: "/delivery/active", icon: Package, label: "Active", center: true },
  { id: "updates", path: "/delivery/history", icon: Newspaper, label: "Updates" },
  { id: "profile", path: "/delivery/profile", icon: User, label: "Profile" },
];

function NotchedBarBg() {
  const d = [
    "M 30 0",
    "L 116 0",
    "C 140 0 172 28 200 28",
    "C 228 28 260 0 284 0",
    "L 370 0",
    "A 30 30 0 0 1 400 30",
    "A 30 30 0 0 1 370 60",
    "L 30 60",
    "A 30 30 0 0 1 0 30",
    "A 30 30 0 0 1 30 0",
    "Z",
  ].join(" ");

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-primary"
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}

const BottomNav = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const sideItems = NAV_ITEMS.filter((i) => !i.center);
  const centerItem = NAV_ITEMS.find((i) => i.center)!;

  const leftPair = sideItems.slice(0, 2);
  const rightPair = sideItems.slice(2, 4);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto w-full max-w-[min(92vw,296px)] px-2 pt-4 sm:max-w-[316px] sm:px-3 md:max-w-[336px] md:px-3.5">
        <div className="relative h-[3.75rem] w-full overflow-visible rounded-[1.875rem] shadow-[0_-6px_32px_rgba(0,0,0,0.12),0_8px_24px_rgba(242,106,28,0.18)] sm:h-16">
          <NotchedBarBg />

          {/* Navigation Items */}
          <div className="absolute inset-0 z-[1] grid grid-cols-5 items-center px-1 sm:px-1.5">
            {leftPair.map((item) => (
              <NavSideButton
                key={item.id}
                item={item}
                activePath={activePath}
              />
            ))}

            {/* Center Floating Button */}
            <div className="pointer-events-none relative flex items-center justify-center">
              <div className="pointer-events-auto absolute left-1/2 top-0 z-[2] -translate-x-1/2 -translate-y-[115%]">
                <NavCenterButton
                  item={centerItem}
                  activePath={activePath}
                />
              </div>
            </div>

            {rightPair.map((item) => (
              <NavSideButton
                key={item.id}
                item={item}
                activePath={activePath}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

function NavSideButton({
  item,
  activePath,
}: {
  item: NavItemConfig;
  activePath: string;
}) {
  const Icon = item.icon;
  const navigate = useNavigate();
  // Check if current route starts with or precisely matches path
  const isActive = activePath === item.path || activePath.startsWith(item.path + '/');

  return (
    <div className="flex h-full items-center justify-center">
      <button
        type="button"
        onClick={() => navigate(item.path)}
        className={`flex h-[42px] w-[42px] items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${isActive ? "bg-white shadow-sm scale-110" : "bg-transparent"
          }`}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300 ${isActive ? "text-[#f97316]" : "text-white"}`}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </button>
    </div>
  );
}

function NavCenterButton({
  item,
  activePath,
}: {
  item: NavItemConfig;
  activePath: string;
}) {
  const Icon = item.icon;
  const navigate = useNavigate();
  const isActive = activePath === item.path || activePath.startsWith(item.path + '/');

  return (
    <button
      type="button"
      onClick={() => navigate(item.path)}
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 transition-all duration-300 hover:scale-110 active:scale-95 sm:h-14 sm:w-14 md:h-[3.5rem] md:w-[3.5rem] ${isActive
          ? "shadow-[0_12px_30px_rgba(242,106,28,0.4),0_6px_15px_rgba(242,106,28,0.4)] scale-110 border-2 border-orange-100"
          : "shadow-[0_12px_30px_rgba(0,0,0,0.2),0_4px_10px_rgba(242,106,28,0.25)]"
        }`}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#f97316]"
        strokeWidth={isActive ? 3 : 2.5}
      />
    </button>
  );
}

export default BottomNav;