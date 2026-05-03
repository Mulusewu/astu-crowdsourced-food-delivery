// src/routes/ProtectedRoute.tsx
import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { type UserRole, type ActiveMode } from "@/types/user.types";
import { ROUTES } from "./routePaths";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  requiredMode?: ActiveMode; 
  redirectPath?: string;
}

export default function ProtectedRoute({
  allowedRoles,
  requiredMode,
  redirectPath = ROUTES.AUTH,
}: ProtectedRouteProps) {
  const { user, isLoading, toggleActiveMode } = useAuthStore();
  const location = useLocation();
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const lastFixedMode = useRef<string | null>(null);

  // --- Zone Identification ---
  const isDeliveryZone = requiredMode === "DELIVERER";
  const isCustomerZone = requiredMode === "CUSTOMER";
  const isVendorZone = allowedRoles.includes("VENDOR_STAFF");

  // --- Path Ownership ---
  // We explicitly define which paths belong to which security guard.
  const guardOwnsThisPath = 
    (isDeliveryZone && location.pathname.startsWith("/delivery")) ||
    (isCustomerZone && (
      location.pathname === "/" || // Root is always Customer Home
      location.pathname.startsWith("/customer") || 
      location.pathname.startsWith("/food") || 
      location.pathname.startsWith("/restaurants") ||
      location.pathname.startsWith("/order") ||
      location.pathname.startsWith("/track") ||
      location.pathname.startsWith("/cart") ||
      location.pathname.startsWith("/checkout")
    )) ||
    (isVendorZone && location.pathname.startsWith("/vendor"));

  // 1. Authorization check (Role-based)
  const isDelivererActingAsCustomer = 
    user && (user.role === "DELIVERER" || user.role === "ADMIN") && 
    allowedRoles.includes("CUSTOMER");
  
  const hasPermission = user && (allowedRoles.includes(user.role) || isDelivererActingAsCustomer);
  
  // 2. Mode Mismatch Detection
  const isWrongMode = !!(user && requiredMode && user.activeMode !== requiredMode);

  // --- Strict Mode Enforcement ---
  // If a user is in the WRONG mode for the zone they are trying to access, 
  // we either fix it (if they have permission) or bounce them.
  useEffect(() => {
    if (guardOwnsThisPath && user && hasPermission && isWrongMode && !isAutoFixing) {
      // Prevent loops
      if (lastFixedMode.current === requiredMode) return;

      console.log(`[Guard] Policy Enforcement: Mode switch required for ${location.pathname} (${user.activeMode} -> ${requiredMode})`);
      setIsAutoFixing(true);
      lastFixedMode.current = requiredMode || null;
      
      toggleActiveMode(requiredMode).finally(() => {
        setIsAutoFixing(false);
      });
    }
  }, [user, hasPermission, isWrongMode, requiredMode, toggleActiveMode, isAutoFixing, location.pathname, guardOwnsThisPath]);

  // 1. Loading/Syncing state
  if (isLoading || isAutoFixing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-[#F26A1C]" />
          <p className="text-xs font-bold text-[#F26A1C] animate-pulse">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  // 2. Authentication check
  if (!user) {
    if (guardOwnsThisPath) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
    return <Outlet />; 
  }

  // 3. Mode Consistency Check
  // This handles the case where a user is in a mode that should strictly be in another zone.
  // We only redirect if this guard DOES NOT own the path but we detect the user is in a mode 
  // that should be elsewhere.
  if (user.activeMode === "DELIVERER" && location.pathname.startsWith("/customer") && !guardOwnsThisPath) {
     console.warn(`[Guard] Cross-Zone Block: DELIVERER mode on customer path ${location.pathname}`);
     return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
  }

  if (user.activeMode === "CUSTOMER" && location.pathname.startsWith("/delivery") && !guardOwnsThisPath) {
     console.warn(`[Guard] Cross-Zone Block: CUSTOMER mode on delivery path ${location.pathname}`);
     return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
  }

  // 4. Role-based Access Control
  if (guardOwnsThisPath && !hasPermission) {
    console.warn(`[Guard] Role Access Denied: ${user.role} -> ${location.pathname}`);
    if (user.role === "VENDOR_STAFF") return <Navigate to={ROUTES.VENDOR.DASHBOARD} replace />;
    if (user.role === "DELIVERER") return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
    return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
  }

  // 5. Final guard for wrong mode (Wait for effect)
  if (guardOwnsThisPath && isWrongMode) {
    return null;
  }

  // 6. Access Granted
  return <Outlet />;
}
