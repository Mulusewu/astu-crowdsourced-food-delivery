// src/routes/AppRoutes.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useAuthStore } from "@/store/auth/authStore";

// Import Layouts
import CustomerLayout from "@/features/layouts/CustomerLayout";
import DeliveryLayout from "@/features/layouts/DeliveryLayout";
import VendorLayout from "@/features/layouts/VendorLayout";
import AppLayout from "@/components/layout/AppLayout";

// Import Route Groups
import { authRoutes } from "./routeGroups/authRoutes";
import { customerRoutes } from "./routeGroups/customerRoutes";
import { vendorRoutes } from "./routeGroups/vendorRoutes";
import { deliveryRoutes } from "./routeGroups/deliveryRoutes";
import { sharedRoutes } from "./routeGroups/sharedRoutes";

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

        {/* ====================== SHARED ROUTES ====================== */}
        {sharedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* ====================== AUTHENTICATED ZONE ====================== */}
        <Route element={<AppLayout />}>
          {/* ====================== CUSTOMER ZONE ====================== */}
          <Route element={<CustomerLayout />}>
            {customerRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* ====================== DELIVERY ROUTES ====================== */}
          <Route element={<DeliveryLayout />}>
            {deliveryRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Route>

        </Route>

        {/* ====================== VENDOR ROUTES ====================== */}
        {/* Vendor has its own layout and navigation, so it stays outside AppLayout */}
        <Route element={<VendorLayout />}>
          {vendorRoutes.map((route) => (
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
