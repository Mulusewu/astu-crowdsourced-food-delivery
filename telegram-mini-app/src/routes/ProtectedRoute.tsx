// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { type UserRole } from "@/types/user.types";
import { ROUTES } from "./routePaths";

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
    redirectPath?: string;
}

export default function ProtectedRoute({
    allowedRoles,
    redirectPath = ROUTES.AUTH,
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();

    // 1. Still loading authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26A1C]" />
            </div>
        );
    }

    // 2. Not authenticated at all
    if (!user) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // 3. Wrong role — redirect to their correct dashboard
    if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "CUSTOMER":
                return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
            case "VENDOR_STAFF":
                return <Navigate to={ROUTES.VENDOR.DASHBOARD} replace />;
            case "DELIVERER":
                return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
            default:
                return <Navigate to={ROUTES.AUTH} replace />;
        }
    }

    // 4. Authenticated with correct role → render protected content
    return <Outlet />;
}
