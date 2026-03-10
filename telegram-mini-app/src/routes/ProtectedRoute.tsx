// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { UserRole } from "@/types/user.types";
// import { ROUTES } from "./routePaths";

// interface ProtectedRouteProps {
//   allowedRoles: UserRole[];
//   redirectPath?: string;
// }

// export default function ProtectedRoute({
//   allowedRoles,
//   redirectPath = ROUTES.AUTH,
// }: ProtectedRouteProps) {
//   const { user, isLoading } = useAuth();
//   const location = useLocation();

//   // Show loading state while checking authentication
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//       </div>
//     );
//   }

//   // Not authenticated - redirect to auth page with return URL
//   if (!user) {
//     return <Navigate to={redirectPath} state={{ from: location }} replace />;
//   }

//   // Check if user has required role
//   if (!allowedRoles.includes(user.role)) {
//     // Redirect to appropriate dashboard based on role
//     switch (user.role) {
//       case UserRole.CUSTOMER:
//         return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
//       case UserRole.VENDOR:
//         return <Navigate to={ROUTES.VENDOR.DASHBOARD} replace />;
//       case UserRole.DELIVERY:
//         return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
//       default:
//         return <Navigate to={ROUTES.AUTH} replace />;
//     }
//   }

//   // Authorized - render the protected route
//   return <Outlet />;
// }
