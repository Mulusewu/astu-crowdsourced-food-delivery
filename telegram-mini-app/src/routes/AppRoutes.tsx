// src/routes/AppRoutes.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
// import ProtectedRoute from "./ProtectedRoute";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import type { RouteGroup } from "./types/routes.types";

// Import route groups
import { authRoutes } from "./routeGroups/authRoutes";
import { customerRoutes } from "./routeGroups/customerRoutes";
// import { vendorRoutes } from "./routeGroups/vendorRoutes";
import { deliveryRoutes } from "./routeGroups/deliveryRoutes";
// import { sharedRoutes } from "./routeGroups/sharedRoutes";

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        {/* ====================== PUBLIC AUTH ROUTES ====================== */}
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* ====================== CUSTOMER ROUTES ====================== */}
        {customerRoutes.map((route) => (
          <Route
            key={route.path}
            // element={
            //   <ProtectedRoute 
            //     allowedRoles={["customer"]} 
            //     redirectPath={ROUTES.AUTH}
            //   />
            // }
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
        {deliveryRoutes.map((route) => (
          <Route
            key={route.path}
            // element={
            //   <ProtectedRoute 
            //     allowedRoles={["delivery"]} 
            //     redirectPath={ROUTES.AUTH}
            //   />
            // }
          >
            <Route path={route.path} element={route.element} />
          </Route>
        ))}

        {/* ====================== FALLBACK ROUTES ====================== */}
        <Route path="/" element={<Navigate to={ROUTES.AUTH} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.AUTH} replace />} />
      </Routes>
    </Suspense>
  );
}