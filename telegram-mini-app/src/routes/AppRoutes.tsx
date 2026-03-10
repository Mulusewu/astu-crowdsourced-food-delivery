import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
// import ProtectedRoute from "./ProtectedRoute";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import type { RouteGroup } from "./types/routes.types";

// Import route groups
import { authRoutes } from "./routeGroups/authRoutes";
// import { customerRoutes } from "./routeGroups/customerRoutes";
// import { vendorRoutes } from "./routeGroups/vendorRoutes";
import { deliveryRoutes } from "./routeGroups/deliveryRoutes";
// import { sharedRoutes } from "./routeGroups/sharedRoutes";

// Helper to render routes with protection
const renderRouteGroup = (routes: RouteGroup[]) => {
  return routes.map((route) => {
    // If route has roles, wrap with ProtectedRoute
    if (route.roles && route.roles.length > 0) {
      return (
        <Route
          key={route.path}
          // element={<ProtectedRoute allowedRoles={route.roles} />}
        >
          <Route path={route.path} element={route.element} />
        </Route>
      );
    }

    // Public route - no protection
    return <Route key={route.path} path={route.path} element={route.element} />;
  });
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        {/* Public Auth Routes */}
        {renderRouteGroup(authRoutes)}

        {/* Customer Routes
        {renderRouteGroup(customerRoutes)}

        {/* Vendor Routes */}
        {/* {renderRouteGroup(vendorRoutes)} */}

        {/* Delivery Routes */}
        {renderRouteGroup(deliveryRoutes)}

        {/* Shared Routes */}
        {/* {renderRouteGroup(sharedRoutes)} */}

        {/* Fallback Routes */}
        <Route path="/" element={<Navigate to={ROUTES.AUTH} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.AUTH} replace />} />
      </Routes>
    </Suspense>
  );
}
