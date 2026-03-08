import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
// import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "../types/user.types";
import OrderDetailsPage from "@/features/delivery/pages/OrderDetailsPage";

// Lazy load pages for better performance
const SigninPage = lazy(() => import("../features/auth/pages/SigninPage"));
const SignupPage = lazy(() => import("../features/auth/pages/SignupPage"));
const AuthPage = lazy(() => import("../features/auth/pages/authPage"));
const TestPage = lazy(() => import("@/../testTimeFolder/TestPage"));
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage"),
);
const AvailableOrdersPage = lazy(
  () => import("../features/delivery/pages/AvailableOrdersPage"),
);
// Customer pages
const CustomerHomePage = lazy(
  () => import("../features/customer/pages/HomePage"),
);
const RestaurantPage = lazy(
  () => import("../features/customer/pages/RestaurantPage"),
);
const CartPage = lazy(() => import("../features/customer/pages/CartPage"));
const CheckoutPage = lazy(
  () => import("../features/customer/pages/CheckoutPage"),
);
const OrderHistoryPage = lazy(
  () => import("../features/customer/pages/OrderHistoryPage"),
);
const CustomerProfilePage = lazy(
  () => import("../features/customer/pages/ProfilePage"),
);

// Vendor pages
const VendorDashboard = lazy(
  () => import("../features/vendor/pages/VendorDashboard"),
);
const VendorOrdersPage = lazy(
  () => import("../features/vendor/pages/OrdersPage"),
);
const VendorMenuPage = lazy(() => import("../features/vendor/pages/MenuPage"));
const VendorEarningsPage = lazy(
  () => import("../features/vendor/pages/EarningsPage"),
);
const VendorSettingsPage = lazy(
  () => import("../features/vendor/pages/SettingsPage"),
);

// Delivery pages
const DeliveryDashboard = lazy(
  () => import("../features/delivery/pages/DeliveryDashboard"),
);
const AvailableDeliveriesPage = lazy(
  () => import("../features/delivery/pages/AvailableDeliveries"),
);
const ActiveDeliveryPage = lazy(
  () => import("../features/delivery/pages/ActiveDelivery"),
);
const DeliveryEarningsPage = lazy(
  () => import("../features/delivery/pages/EarningsPage"),
);

// Payment page
const PaymentPage = lazy(() => import("../features/payment/pages/PaymentPage"));

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.SIGNIN} element={<SigninPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.AUTH} element={<AuthPage />} />
      <Route path={ROUTES.TEST} element={<TestPage />} />
      {/* Customer Routes */}
      {/* <Route element={<ProtectedRoute allowedRoles={[UserRole.CUSTOMER]} />}> */}
      <Route path={ROUTES.CUSTOMER.HOME} element={<CustomerHomePage />} />
      <Route path={ROUTES.CUSTOMER.RESTAURANT} element={<RestaurantPage />} />
      <Route path={ROUTES.CUSTOMER.CART} element={<CartPage />} />
      <Route path={ROUTES.CUSTOMER.CHECKOUT} element={<CheckoutPage />} />
      <Route path={ROUTES.CUSTOMER.ORDERS} element={<OrderHistoryPage />} />
      <Route path={ROUTES.CUSTOMER.PROFILE} element={<CustomerProfilePage />} />
      {/* </Route> */}
      {/* Vendor Routes */}
      {/* <Route element={<ProtectedRoute allowedRoles={[UserRole.VENDOR]} />}> */}
      <Route path={ROUTES.VENDOR.DASHBOARD} element={<VendorDashboard />} />
      <Route path={ROUTES.VENDOR.ORDERS} element={<VendorOrdersPage />} />
      <Route path={ROUTES.VENDOR.MENU} element={<VendorMenuPage />} />
      <Route path={ROUTES.VENDOR.EARNINGS} element={<VendorEarningsPage />} />
      <Route path={ROUTES.VENDOR.SETTINGS} element={<VendorSettingsPage />} />
      {/* </Route> */}
      {/* Delivery Routes */}
      {/* <Route element={<ProtectedRoute allowedRoles={[UserRole.DELIVERY]} />}> */}
      <Route path={ROUTES.DELIVERY.DASHBOARD} element={<DeliveryDashboard />} />
      <Route
        path={ROUTES.DELIVERY.AVAILABLE}
        element={<AvailableOrdersPage />}
      />
      <Route path={ROUTES.DELIVERY.ACTIVE} element={<ActiveDeliveryPage />} />
      <Route
        path={ROUTES.DELIVERY.EARNINGS}
        element={<DeliveryEarningsPage />}
      />
      {/* In your AppRoutes.tsx */}
      <Route path="/order/:orderId" element={<OrderDetailsPage />} />
      {/* </Route> */}
      {/* Payment Route (accessible to multiple roles) */}
      {/* <Route
        element={
          <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.VENDOR]} />
        }
      > */}
      <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
      {/* </Route> */}
      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.SIGNIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.SIGNIN} replace />} />
    </Routes>
  );
}

export default AppRoutes;
