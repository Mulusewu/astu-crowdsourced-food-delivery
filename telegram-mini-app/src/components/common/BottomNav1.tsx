import {
  Home,
  Bookmark,
  Package,
  Newspaper,
  User,
  type LucideIcon,
} from "lucide-react";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

type NavItemConfig = {
  id: string;
  icon: LucideIcon;
  label: string;
  center?: boolean;
};

const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "bookmark", icon: Bookmark, label: "Bookmarks" },
  { id: "wallet", icon: Package, label: "Orders", center: true },
  { id: "messages", icon: Newspaper, label: "Updates" },
  { id: "profile", icon: User, label: "Profile" },
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

const BottomNav = ({ activeTab = "home", onTabChange }: BottomNavProps) => {
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
                activeTab={activeTab}
                onTabChange={onTabChange}
              />
            ))}

            {/* Center Floating Button */}
            <div className="pointer-events-none relative flex items-center justify-center">
              <div className="pointer-events-auto absolute left-1/2 top-0 z-[2] -translate-x-1/2 -translate-y-[115%]">
                <NavCenterButton
                  item={centerItem}
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                />
              </div>
            </div>

            {rightPair.map((item) => (
              <NavSideButton
                key={item.id}
                item={item}
                activeTab={activeTab}
                onTabChange={onTabChange}
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
  activeTab,
  onTabChange,
}: {
  item: NavItemConfig;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}) {
  const Icon = item.icon;

  return (
    <div className="flex h-full items-center justify-center">
      <button
        type="button"
        onClick={() => onTabChange?.(item.id)}
        className="flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2} />
      </button>
    </div>
  );
}

function NavCenterButton({
  item,
  activeTab,
  onTabChange,
}: {
  item: NavItemConfig;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onTabChange?.(item.id)}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 shadow-[0_12px_30px_rgba(0,0,0,0.2),0_4px_10px_rgba(242,106,28,0.25)] transition-all duration-200 hover:scale-110 active:scale-95 sm:h-14 sm:w-14 md:h-[3.5rem] md:w-[3.5rem]"
    >
      <Icon
        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-orange-500"
        strokeWidth={2.5}
      />
    </button>
  );
}

export default BottomNav;