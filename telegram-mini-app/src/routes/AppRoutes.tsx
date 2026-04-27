// src/routes/AppRoutes.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import ProtectedRoute from "./ProtectedRoute";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useAuthStore } from "@/store/auth/authStore";
import AppLayout from "@/components/layout/AppLayout";

// Import route groups
import { authRoutes } from "./routeGroups/authRoutes";
import { customerRoutes } from "./routeGroups/customerRoutes";
// import { vendorRoutes } from "./routeGroups/vendorRoutes";
import { deliveryRoutes } from "./routeGroups/deliveryRoutes";
// import { sharedRoutes } from "./routeGroups/sharedRoutes";

function FallbackRoute() {
  const { user, activeRole } = useAuthStore();

  if (user && activeRole) {
    if (activeRole === "delivery") {
      return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
    }
    if (activeRole === "vendor") {
      return <Navigate to={ROUTES.VENDOR.DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
  }

  return <Navigate to={ROUTES.AUTH} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        {/* ====================== PUBLIC AUTH ROUTES ====================== */}
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* ====================== CUSTOMER ROUTES ====================== */}
        {customerRoutes.map((route) => (
          <Route
            key={route.path}
            element={
              <ProtectedRoute
                allowedRoles={["customer"]}
                redirectPath={ROUTES.AUTH}
              />
            }
          >
            <Route path={route.path} element={route.element} />
          </Route>
        ))}

        {/* ====================== VENDOR ROUTES ====================== */}
        {/* {vendorRoutes.map((route) => (
          <Route
            key={route.path}
            element={
              <ProtectedRoute 
                allowedRoles={["vendor"]} 
                redirectPath={ROUTES.AUTH}
              />
            }
          >
            <Route path={route.path} element={route.element} />
          </Route>
        ))} */}

        {/* ====================== DELIVERY ROUTES ====================== */}
        <Route element={<AppLayout />}>
          {deliveryRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* ====================== FALLBACK ROUTES ====================== */}
        <Route path="*" element={<FallbackRoute />} />
      </Routes>
    </Suspense>
  );
}
