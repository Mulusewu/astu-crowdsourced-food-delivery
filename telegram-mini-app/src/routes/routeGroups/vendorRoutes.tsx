import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";
import { UserRoles } from "@/types/user.types";

// Dashboard & Analytics
const VendorDashboard = lazy(
  () => import("@/features/vendor/pages/VendorDashboard"),
);
const VendorAnalyticsPage = lazy(
  () => import("@/features/vendor/pages/VendorAnalyticsPage"),
);
const VendorEarningsPage = lazy(
  () => import("@/features/vendor/pages/EarningsPage"),
);
const VendorSignupPage = lazy(
  () => import("@/features/vendor/pages/VendorSignupPage"),
);
const PendingApprovalPage = lazy(
  () => import("@/features/vendor/pages/PendingApprovalPage"),
);

// Menu Management (CRUD)
const VendorMenuPage = lazy(() => import("@/features/vendor/pages/MenuPage"));
const VendorMenuFormPage = lazy(
  () => import("@/features/vendor/pages/MenuFormPage"),
);
const VendorSavedItemsPage = lazy(
  () => import("@/features/vendor/pages/VendorSavedItemsPage"),
);

// Order Management
const VendorOrderDetailsPage = lazy(
  () => import("@/features/vendor/pages/OrderDetailsPage"),
);
const VendorOrderListsPage = lazy(
  () => import("@/features/vendor/pages/OrdersPage"),
);
const VendorOrderStatusPage = lazy(
  () => import("@/features/vendor/pages/OrderStatusPage"),
);

// Settings
const VendorProfilePage = lazy(
  () => import("@/features/vendor/pages/VendorProfilePage"),
);
const VendorIssueReportPage = lazy(
  () => import("@/features/vendor/pages/VendorIssueReportPage"),
);
const VendorEditProfilePage = lazy(
  () => import("@/features/vendor/pages/VendorEditProfilePage"),
);
const VendorChangePasswordPage = lazy(
  () => import("@/features/vendor/pages/VendorChangePasswordPage"),
);

export const vendorRoutes: RouteGroup[] = [
  // ==================== DASHBOARD & ANALYTICS ====================
  {
    path: ROUTES.VENDOR.DASHBOARD,
    element: <VendorDashboard />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.SIGNUP,
    element: <VendorSignupPage />,
  },
  {
    path: ROUTES.VENDOR.PENDING,
    element: <PendingApprovalPage />,
  },
  {
    path: ROUTES.VENDOR.ANALYTICS,
    element: <VendorAnalyticsPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.EARNINGS,
    element: <VendorEarningsPage />,
    roles: [UserRoles.VENDOR],
  },

  // ==================== MENU MANAGEMENT (CRUD) ====================
  {
    path: ROUTES.VENDOR.SAVED,
    element: <VendorSavedItemsPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.MENU.LIST,
    element: <VendorMenuPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.MENU.ADD,
    element: <VendorMenuFormPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.MENU.EDIT,
    element: <VendorMenuFormPage isEdit />,
    roles: [UserRoles.VENDOR],
  },

  // ==================== ORDER MANAGEMENT ====================
  {
    path: ROUTES.VENDOR.ORDERS.LIST,
    element: <VendorOrderListsPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.ORDERS.DETAILS,
    element: <VendorOrderDetailsPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.ORDERS.STATUS,
    element: <VendorOrderStatusPage />,
    roles: [UserRoles.VENDOR],
  },

  // ==================== SETTINGS ====================
  {
    path: ROUTES.VENDOR.SETTINGS.PROFILE,
    element: <VendorProfilePage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.SETTINGS.EDIT_PROFILE,
    element: <VendorEditProfilePage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.SETTINGS.CHANGE_PASSWORD,
    element: <VendorChangePasswordPage />,
    roles: [UserRoles.VENDOR],
  },
  {
    path: ROUTES.VENDOR.SETTINGS.REPORT_ISSUE,
    element: <VendorIssueReportPage />,
    roles: [UserRoles.VENDOR],
  },
];
