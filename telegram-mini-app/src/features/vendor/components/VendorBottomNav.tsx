import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList,
  Wallet, 
  Settings
} from "lucide-react";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

export default function VendorBottomNav() {
  const location = useLocation();
  
  const navItems = [
    { 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      path: ROUTES.VENDOR.DASHBOARD 
    },
    { 
      label: "Orders", 
      icon: ClipboardList, 
      path: ROUTES.VENDOR.ORDERS.LIST 
    },
    { 
      label: "Menu", 
      icon: ShoppingBag, 
      path: ROUTES.VENDOR.MENU.LIST 
    },
    { 
      label: "Earnings", 
      icon: Wallet, 
      path: ROUTES.VENDOR.EARNINGS 
    },
    { 
      label: "Settings", 
      icon: Settings, 
      path: ROUTES.VENDOR.SETTINGS.PROFILE 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4">
      <nav className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-[28px] px-2 py-2 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-500 flex-1 gap-1",
                isActive ? "text-[#F26A1C]" : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-[#F26A1C] rounded-full shadow-[0_0_10px_#F26A1C]" />
              )}
              <div className={cn(
                "transition-transform duration-300",
                isActive && "scale-110"
              )}>
                <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter leading-none transition-all duration-300",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
