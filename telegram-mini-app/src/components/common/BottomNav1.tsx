import { Home, Bookmark, Wallet, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNav = ({ activeTab = "home", onTabChange }: BottomNavProps) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "bookmark", icon: Bookmark, label: "Bookmark" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "messages", icon: MessageCircle, label: "Messages" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav
      className="w-[90%] mx-auto rounded-full py-3 px-5"
      style={{ backgroundColor: "#F26A1C" }}
    >
      <div className=" bg-[#F26A1C] flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className=" bg-[#F26A1C] flex flex-col items-center justify-center gap-3 min-w-[40px]"
            >
              {/* Icon with no background, just white color */}
              <Icon
                size={20}
                className={`text-white transition-all ${
                  isActive ? "opacity-100 scale-110" : "opacity-80"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Optional: tiny label if needed - remove if not wanted */}
              <span
                className={`text-[8px] font-medium text-white ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
