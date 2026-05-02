import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  BarChart3, 
  UserCircle 
} from "lucide-react";
import { ROUTES } from "@/routes/routePaths";

export default function VendorBottomNav() {
  const navItems = [
    { 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      path: ROUTES.VENDOR.DASHBOARD 
    },
    { 
      label: "Orders", 
      icon: ShoppingBag, 
      path: ROUTES.VENDOR.ORDERS.LIST 
    },
    { 
      label: "Menu", 
      icon: UtensilsCrossed, 
      path: ROUTES.VENDOR.MENU.LIST 
    },
    { 
      label: "Earnings", 
      icon: BarChart3, 
      path: ROUTES.VENDOR.EARNINGS 
    },
    { 
      label: "Profile", 
      icon: UserCircle, 
      path: ROUTES.VENDOR.SETTINGS.PROFILE 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 transition-all duration-300
            ${isActive ? "text-[#F26A1C] scale-110" : "text-gray-400 dark:text-gray-500"}
          `}
        >
          <item.icon size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
