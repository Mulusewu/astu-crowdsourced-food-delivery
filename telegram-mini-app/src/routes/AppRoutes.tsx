import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "./routePaths";
// import ProtectedRoute from "./ProtectedRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lazy load pages for better performance
const SigninPage = lazy(() => import("../features/auth/pages/SigninPage"));
const SignupPage = lazy(() => import("../features/auth/pages/SignupPage"));
const AuthPage = lazy(() => import("../features/auth/pages/authPage"));
const TestPage = lazy(() => import("@/../testTimeFolder/TestPage"));
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage"),
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
const DeliveryOrdersPage = lazy(
  () => import("../features/delivery/pages/DeliveryOrdersPage"),
);
const DeliveryOrderDetailPage = lazy(
  () => import("../features/delivery/pages/DeliveryOrderDetailPage"),
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
const DeliveryHistoryPage = lazy(
  () => import("../features/delivery/pages/history"),
);
const SavedItemsPage = lazy(
  () => import("../features/delivery/pages/SavedItemsPage"),
);
const DelivererProfilePage = lazy(
  () => import("../features/profiles/DelivererProfilePage"),
);
const OfflinePage = lazy(
  () => import("../features/delivery/pages/OfflinePage"),
);
const OTPVerificationPage = lazy(
  () => import("../features/delivery/pages/OTPVerificationPage"),
);
const ChangePasswordPage = lazy(
  () => import("../features/delivery/pages/ChangePasswordPage"),
);
const PaymentInformationPage = lazy(
  () => import("../features/delivery/pages/PaymentInformationPage"),
);
const IssueReportPage = lazy(
  () => import("../features/delivery/pages/IssueReportPage"),
);

// Payment page
const PaymentPage = lazy(() => import("../features/payment/pages/PaymentPage"));

/**
 * TEMPORARY — remove when delivery routes use `ProtectedRoute` and RR7 splat is stable:
 * React Router v7 can send some valid URLs to `path="*"`; render the real page here so we
 * do not redirect to sign-in. `DeliveryOrderDetailPage` reads order id from the URL when
 * `useParams` is empty.
 */
function isDeliveryOrderDetailPath(pathname: string): boolean {
  return /^\/delivery\/orders\/[^/]+$/.test(pathname);
}

function TempDevCatchAll() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (isDeliveryOrderDetailPath(normalized)) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <DeliveryOrderDetailPage />
      </Suspense>
    );
  }

  if (
    import.meta.env.DEV &&
    normalized === ROUTES.DELIVERY.PROFILE
  ) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <DelivererProfilePage />
      </Suspense>
    );
  }

  return <Navigate to={ROUTES.SIGNIN} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.SIGNIN} element={<SigninPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.AUTH} element={<AuthPage />} />
      <Route path={ROUTES.TEST} element={<TestPage />} />

      {/* TEMPORARY — dev/public access (no auth). Move under ProtectedRoute when delivery auth is on. */}
      <Route
        path={ROUTES.DELIVERY.PROFILE}
        element={<DelivererProfilePage />}
      />

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
      {/* More specific path first (RR7): list `/delivery/orders` must not shadow `:orderId`. */}
      <Route
        path={ROUTES.DELIVERY.ORDER_DETAIL} element={<DeliveryOrderDetailPage />}
      />
      <Route path={ROUTES.DELIVERY.ORDERS} element={<DeliveryOrdersPage />} />
      <Route
        path={ROUTES.DELIVERY.AVAILABLE}
        element={<AvailableDeliveriesPage />}
      />
      <Route path={ROUTES.DELIVERY.ACTIVE} element={<ActiveDeliveryPage />} />
      <Route
        path={ROUTES.DELIVERY.EARNINGS}
        element={<DeliveryEarningsPage />}
      />
      <Route
        path={ROUTES.DELIVERY.HISTORY}
        element={<DeliveryHistoryPage />}
      />
      <Route
        path={ROUTES.DELIVERY.SAVED}
        element={<SavedItemsPage />}
      />
      <Route
        path={ROUTES.DELIVERY.SignUp}
        element={<SignupPage />}
      />
      <Route
        path={ROUTES.DELIVERY.Offline}
        element={<OfflinePage />}
      />
      <Route
        path={ROUTES.DELIVERY.VERIFY_OTP}
        element={<OTPVerificationPage />}
      />
      <Route
        path={ROUTES.DELIVERY.CHANGE_PASSWORD}
        element={<ChangePasswordPage />}
      />
      <Route
        path={ROUTES.DELIVERY.PAYMENT_INFO}
        element={<PaymentInformationPage />}
      />
      <Route
        path={ROUTES.DELIVERY.REPORT_ISSUE}
        element={<IssueReportPage />}
      />
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
      <Route path="*" element={<TempDevCatchAll />} />
    </Routes>
  );
}

export default AppRoutes;
