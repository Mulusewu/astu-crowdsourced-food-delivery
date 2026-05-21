import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { ROUTES } from "./routePaths";
import type { UserRole, ActiveMode } from "@/types/user.types";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  requiredMode?: ActiveMode;
}

export default function ProtectedRoute({ allowedRoles, requiredMode }: ProtectedRouteProps) {
  const { user, token } = useAuthStore();
  const location = useLocation();

  // 1. Not logged in -> Redirect to Auth
  if (!user || !token) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  // 2. Account level block (Banned or Pending Email Verification)
  // if (user.status !== "ACTIVE" || (!user.isEmailVerified && !user.isPhoneVerified)) {
  //   // If they aren't verified, send them to the verification screen
  //   if (!user.isEmailVerified && !user.isPhoneVerified) {
  //      return <Navigate to={`/verify-email`} replace />;
  //   }
  //   // If banned, send to a static banned page
  //   return <Navigate to="/banned" replace />;
  // }

  // 3. Role-Based Access Control (RBAC)
  // Check if the user's permanent role is allowed to view this route
  // (Note: Admins can view everything)
  const hasAllowedRole = allowedRoles.includes(user.role) || user.role === "ADMIN";
  
  // Exception: If the route requires CUSTOMER role, ANY user can view it 
  // IF their activeMode is CUSTOMER (e.g., Deliverer buying food).
  const isBrowsingAsCustomer = allowedRoles.includes("CUSTOMER") && user.activeMode === "CUSTOMER";

  if (!hasAllowedRole && !isBrowsingAsCustomer) {
    // They are trying to access a dashboard they don't own. Kick them to their root.
    return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
  }

  // 4. Active Mode Enforcement (The "Deliverer App" guard)
  // If a route explicitly requires them to be in DELIVERER mode, but they are in CUSTOMER mode,
  // we either block them or auto-switch them. Since auto-switching requires a backend call,
  // we just block them and redirect to their current mode's home.
  if (requiredMode && user.activeMode !== requiredMode) {
    if (user.activeMode === "CUSTOMER") {
      return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
    }
    if (user.activeMode === "DELIVERER") {
      return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
    }
  }

  // All checks passed. Render the nested Layout/Routes.
  return <Outlet />;
}