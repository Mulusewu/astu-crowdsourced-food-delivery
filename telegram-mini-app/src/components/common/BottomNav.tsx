import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/user.types";

// Icons (you can use lucide-react or any icon library)
import { Home, ShoppingBag, User, Package, DollarSign } from "lucide-react";

function BottomNav() {
  const { role } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case UserRole.CUSTOMER:
        return [
          { path: "/", icon: Home, label: "Home" },
          { path: "/orders", icon: Package, label: "Orders" },
          { path: "/cart", icon: ShoppingBag, label: "Cart" },
          { path: "/profile", icon: User, label: "Profile" },
        ];
      case UserRole.VENDOR:
        return [
          { path: "/vendor/dashboard", icon: Home, label: "Dashboard" },
          { path: "/vendor/orders", icon: Package, label: "Orders" },
          { path: "/vendor/earnings", icon: DollarSign, label: "Earnings" },
          { path: "/vendor/settings", icon: User, label: "Settings" },
        ];
      case UserRole.DELIVERY:
        return [
          { path: "/delivery/dashboard", icon: Home, label: "Dashboard" },
          { path: "/delivery/available", icon: Package, label: "Available" },
          { path: "/delivery/active", icon: ShoppingBag, label: "Active" },
          { path: "/delivery/earnings", icon: DollarSign, label: "Earnings" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? "text-[#F26A1C]" : "text-gray-600"
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
