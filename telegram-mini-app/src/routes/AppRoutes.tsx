// src/routes/AppRoutes.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useAuthStore } from "@/store/auth/authStore";
import ProtectedRoute from "./ProtectedRoute";

// Import Layouts
import CustomerLayout from "@/features/layouts/CustomerLayout";
import DeliveryLayout from "@/features/layouts/DeliveryLayout";
import VendorLayout from "@/features/layouts/VendorLayout";

// Import Route Groups
import { authRoutes } from "./routeGroups/authRoutes";
import { customerRoutes } from "./routeGroups/customerRoutes";
import { vendorRoutes } from "./routeGroups/vendorRoutes";
import { deliveryRoutes } from "./routeGroups/deliveryRoutes";
import { sharedRoutes } from "./routeGroups/sharedRoutes";

function FallbackRoute() {
  const { user } = useAuthStore();

  if (user) {
    if (user.activeMode === "DELIVERER") {
      return <Navigate to={ROUTES.DELIVERY.DASHBOARD} replace />;
    }
    if (user.activeMode === "CUSTOMER") {
      return <Navigate to={ROUTES.CUSTOMER.HOME} replace />;
    }
    if (user.role === "VENDOR_STAFF") {
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

        {/* CUSTOMER ZONE */}
        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} requiredMode="CUSTOMER" />}>
          <Route element={<CustomerLayout />}>
            {customerRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* DELIVERY ZONE */}
        <Route element={<ProtectedRoute allowedRoles={["DELIVERER"]} requiredMode="DELIVERER" />}>
          <Route element={<DeliveryLayout />}>
            {deliveryRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* VENDOR ZONE */}
        <Route element={<ProtectedRoute allowedRoles={["VENDOR_STAFF"]} />}>
          <Route element={<VendorLayout />}>
            {vendorRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* ====================== FALLBACK ROUTES ====================== */}
        <Route path="*" element={<FallbackRoute />} />
      </Routes>
    </Suspense>
  );
}
