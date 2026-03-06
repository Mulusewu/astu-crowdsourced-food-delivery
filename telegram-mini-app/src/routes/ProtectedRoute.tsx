import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/user.types";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case UserRole.CUSTOMER:
        return <Navigate to="/" replace />;
      case UserRole.VENDOR:
        return <Navigate to="/vendor/dashboard" replace />;
      case UserRole.DELIVERY:
        return <Navigate to="/delivery/dashboard" replace />;
      default:
        return <Navigate to="/signin" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
