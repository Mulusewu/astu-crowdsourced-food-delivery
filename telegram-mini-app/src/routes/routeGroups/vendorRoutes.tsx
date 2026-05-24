import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";
import { UserRoles } from "@/types/user.types";

// Dashboard & Analytics
const VendorDashboard = lazy(
  () => import("@/features/vendor3/pages/VendorDashboard"),
);
const VendorAnalyticsPage = lazy(
  () => import("@/features/vendor3/pages/VendorAnalyticsPage"),
);
const VendorEarningsPage = lazy(
  () => import("@/features/vendor3/pages/EarningsPage"),
);
const VendorSignupPage = lazy(
  () => import("@/features/vendor3/pages/VendorSignupPage"),
);
const PendingApprovalPage = lazy(
  () => import("@/features/vendor3/pages/PendingApprovalPage"),
);
// const VendorEarningsDetailsPage = lazy(
//   () => import("@/features/vendor3/pages/EarningsDetailsPage"),
// );

// Restaurant Management
// const VendorRestaurantProfilePage = lazy(
//   () => import("@/features/vendor3/pages/RestaurantProfilePage"),
// );
// const VendorRestaurantEditPage = lazy(
//   () => import("@/features/vendor3/pages/RestaurantEditPage"),
// );
// const VendorRestaurantHoursPage = lazy(
//   () => import("@/features/vendor3/pages/RestaurantHoursPage"),
// );
// const VendorRestaurantLocationPage = lazy(
//   () => import("@/features/vendor3/pages/RestaurantLocationPage"),
// );
// const VendorRestaurantGalleryPage = lazy(
//   () => import("@/features/vendor3/pages/RestaurantGalleryPage"),
// );

// Menu Management (CRUD)
const VendorMenuPage = lazy(() => import("@/features/vendor3/pages/MenuPage"));
const VendorMenuFormPage = lazy(
  () => import("@/features/vendor3/pages/MenuFormPage"),
);
// const VendorSavedItemsPage = lazy(() => import("@/features/vendor3/pages/VendorSavedItemsPage"));
// const VendorAddFoodPage = lazy(
//   () => import("@/features/vendor3/pages/AddFoodPage"),
// );
// const VendorEditFoodPage = lazy(
//   () => import("@/features/vendor3/pages/EditFoodPage"),
// );
// const VendorDuplicateFoodPage = lazy(
//   () => import("@/features/vendor3/pages/DuplicateFoodPage"),
// );
// const VendorCategoriesPage = lazy(
//   () => import("@/features/vendor3/pages/CategoriesPage"),
// );
// const VendorAddCategoryPage = lazy(
//   () => import("@/features/vendor3/pages/AddCategoryPage"),
// );
// const VendorEditCategoryPage = lazy(
//   () => import("@/features/vendor3/pages/EditCategoryPage"),
// );
// const VendorBulkEditPage = lazy(
//   () => import("@/features/vendor3/pages/BulkEditPage"),
// );
// const VendorImportPage = lazy(
//   () => import("@/features/vendor3/pages/ImportPage"),
// );
// const VendorExportPage = lazy(
//   () => import("@/features/vendor3/pages/ExportPage"),
// );

// Inventory Management
// const VendorInventoryPage = lazy(
//   () => import("@/features/vendor3/pages/InventoryPage"),
// );
// const VendorLowStockPage = lazy(
//   () => import("@/features/vendor3/pages/LowStockPage"),
// );
// const VendorOutOfStockPage = lazy(
//   () => import("@/features/vendor3/pages/OutOfStockPage"),
// );
// const VendorAdjustInventoryPage = lazy(
//   () => import("@/features/vendor3/pages/AdjustInventoryPage"),
// );

// Order Management
const VendorOrderDetailsPage = lazy(
  () => import("@/features/vendor3/pages/OrderDetailsPage"),
);
const VendorOrderListsPage = lazy(
  () => import("@/features/vendor3/pages/OrdersPage"),
);
const VendorOrderStatusPage = lazy(
  () => import("@/features/vendor3/pages/OrderStatusPage"),
);
// const VendorPendingOrdersPage = lazy(
//   () => import("@/features/vendor3/pages/PendingOrdersPage"),
// );
// const VendorPreparingOrdersPage = lazy(
//   () => import("@/features/vendor3/pages/PreparingOrdersPage"),
// );
// const VendorReadyOrdersPage = lazy(
//   () => import("@/features/vendor3/pages/ReadyOrdersPage"),
// );
// const VendorCompletedOrdersPage = lazy(
//   () => import("@/features/vendor3/pages/CompletedOrdersPage"),
// );
// const VendorCancelledOrdersPage = lazy(
//   () => import("@/features/vendor3/pages/CancelledOrdersPage"),
// );
const VendorOrderHistoryPage = lazy(
  () => import("@/features/vendor3/pages/OrderHistoryPage"),
);

// Order Actions
// const VendorAcceptOrderPage = lazy(
//   () => import("@/features/vendor3/pages/AcceptOrderPage"),
// );
// const VendorRejectOrderPage = lazy(
//   () => import("@/features/vendor3/pages/RejectOrderPage"),
// );
// const VendorStartPreparingPage = lazy(
//   () => import("@/features/vendor3/pages/StartPreparingPage"),
// );
// const VendorMarkReadyPage = lazy(
//   () => import("@/features/vendor3/pages/MarkReadyPage"),
// );
// const VendorCancelOrderPage = lazy(
//   () => import("@/features/vendor3/pages/CancelOrderPage"),
// );

// Reviews
// const VendorReviewsPage = lazy(
//   () => import("@/features/vendor3/pages/ReviewsPage"),
// );
// const VendorReviewDetailsPage = lazy(
//   () => import("@/features/vendor3/pages/ReviewDetailsPage"),
// );
// const VendorReplyReviewPage = lazy(
//   () => import("@/features/vendor3/pages/ReplyReviewPage"),
// );

// Offers
// const VendorOffersPage = lazy(
//   () => import("@/features/vendor3/pages/OffersPage"),
// );
// const VendorCreateOfferPage = lazy(
//   () => import("@/features/vendor3/pages/CreateOfferPage"),
// );
// const VendorEditOfferPage = lazy(
//   () => import("@/features/vendor3/pages/EditOfferPage"),
// );
// const VendorOfferStatsPage = lazy(
//   () => import("@/features/vendor3/pages/OfferStatsPage"),
// );

// Staff
// const VendorStaffPage = lazy(() => import("@/features/vendor3/pages/StaffPage"));
// const VendorAddStaffPage = lazy(
//   () => import("@/features/vendor3/pages/AddStaffPage"),
// );
// const VendorEditStaffPage = lazy(
//   () => import("@/features/vendor3/pages/EditStaffPage"),
// );
// const VendorStaffRolesPage = lazy(
//   () => import("@/features/vendor3/pages/StaffRolesPage"),
// );

// Settings
const VendorProfilePage = lazy(
  () => import("@/features/vendor3/pages/VendorProfilePage"),
);
const VendorEditProfilePage = lazy(
  () => import("@/features/vendor3/pages/VendorEditProfilePage"),
);
const VendorChangePasswordPage = lazy(
  () => import("@/features/vendor3/pages/VendorChangePasswordPage"),
);
const VendorReportIssuePage = lazy(
  () => import("@/features/vendor3/pages/VendorReportIssuePage"),
);
// const VendorPaymentSettingsPage = lazy(
//   () => import("@/features/vendor3/pages/PaymentSettingsPage"),
// );
// const VendorTaxSettingsPage = lazy(
//   () => import("@/features/vendor3/pages/TaxSettingsPage"),
// );
// const VendorShippingSettingsPage = lazy(
//   () => import("@/features/vendor3/pages/ShippingSettingsPage"),
// );
// const VendorNotificationSettingsPage = lazy(
//   () => import("@/features/vendor3/pages/NotificationSettingsPage"),
// );
// const VendorIntegrationsPage = lazy(
//   () => import("@/features/vendor3/pages/IntegrationsPage"),
// );

// const VendorPendingPage = lazy(
//   () => import("@/features/vendor3/pages/VendorPendingPage"),
// );

export const vendorRoutes: RouteGroup[] = [
  // ==================== DASHBOARD & ANALYTICS ====================
  {
    path: ROUTES.VENDOR.DASHBOARD,
    element: <VendorDashboard />,
    roles: [UserRoles.VENDOR_STAFF],
  },

  {
    path: ROUTES.VENDOR.SIGNUP,
    element: <VendorSignupPage />,
    // Signup is public, but we group it here or in authRoutes.
    // Given the prompt, I'll put it here but it might need to be accessible without VENDOR role depending on how it's used.
  },

  // {
  //   path: ROUTES.VENDOR.PENDING,
  //   element: <VendorPendingPage />,
  // },
  {
    path: ROUTES.VENDOR.ANALYTICS,
    element: <VendorAnalyticsPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.EARNINGS,
    element: <VendorEarningsPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  //   {
  //     path: ROUTES.VENDOR.EARNINGS_DETAILS,
  //     element: <VendorEarningsDetailsPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },

  //   // ==================== RESTAURANT MANAGEMENT ====================
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.PROFILE,
  //     element: <VendorRestaurantProfilePage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.EDIT,
  //     element: <VendorRestaurantEditPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.HOURS,
  //     element: <VendorRestaurantHoursPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.LOCATION,
  //     element: <VendorRestaurantLocationPage />,
  //     roles: [UserRoless.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.GALLERY,
  //     element: <VendorRestaurantGalleryPage />,
  //     roles: [UserRoless.VENDOR_STAFF],
  //   },

  // ==================== MENU MANAGEMENT (CRUD) ====================
  // {
  //   path: ROUTES.VENDOR.SAVED,
  //   element: <VendorSavedItemsPage />,
  //   roles: [UserRoles.VENDOR_STAFF],
  // },
  {
    path: ROUTES.VENDOR.MENU.LIST,
    element: <VendorMenuPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.MENU.ADD,
    element: <VendorMenuFormPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.MENU.EDIT,
    element: <VendorMenuFormPage isEdit />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  //   {
  //     path: ROUTES.VENDOR.FOOD.DUPLICATE,
  //     element: <VendorDuplicateFoodPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.MENU.CATEGORIES,
  //     element: <VendorCategoriesPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.MENU.ADD_CATEGORY,
  //     element: <VendorAddCategoryPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.MENU.EDIT_CATEGORY,
  //     element: <VendorEditCategoryPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.BULK_EDIT,
  //     element: <VendorBulkEditPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.IMPORT,
  //     element: <VendorImportPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.EXPORT,
  //     element: <VendorExportPage />,
  //     roles: [UserRoles.VENDOR_STAFF],
  //   },

  // ==================== INVENTORY MANAGEMENT ====================
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.DASHBOARD,
  //     element: <VendorInventoryPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.LOW_STOCK,
  //     element: <VendorLowStockPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.OUT_OF_STOCK,
  //     element: <VendorOutOfStockPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.ADJUST,
  //     element: <VendorAdjustInventoryPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },

  // ==================== ORDER MANAGEMENT ====================
  {
    path: ROUTES.VENDOR.ORDERS.LIST,
    element: <VendorOrderListsPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.ORDERS.DETAILS,
    element: <VendorOrderDetailsPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.ORDERS.STATUS,
    element: <VendorOrderStatusPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.PENDING,
  //     element: <VendorPendingOrdersPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.PREPARING,
  //     element: <VendorPreparingOrdersPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.READY,
  //     element: <VendorReadyOrdersPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },

  //   {
  //     path: ROUTES.VENDOR.ORDERS.COMPLETED,
  //     element: <VendorCompletedOrdersPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.CANCELLED,
  //     element: <VendorCancelledOrdersPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  {
    path: ROUTES.VENDOR.ORDERS.HISTORY,
    element: <VendorOrderHistoryPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },

  // ==================== ORDER ACTIONS ====================
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.ACCEPT,
  //     element: <VendorAcceptOrderPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.REJECT,
  //     element: <VendorRejectOrderPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.START_PREPARING,
  //     element: <VendorStartPreparingPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.MARK_READY,
  //     element: <VendorMarkReadyPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.CANCEL,
  //     element: <VendorCancelOrderPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },

  // ==================== REVIEWS ====================
  //   {
  //     path: ROUTES.VENDOR.REVIEWS.LIST,
  //     element: <VendorReviewsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.REVIEWS.DETAILS,
  //     element: <VendorReviewDetailsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.REVIEWS.REPLY,
  //     element: <VendorReplyReviewPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },

  // ==================== OFFERS ====================
  //   {
  //     path: ROUTES.VENDOR.OFFERS.LIST,
  //     element: <VendorOffersPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.OFFERS.CREATE,
  //     element: <VendorCreateOfferPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.OFFERS.EDIT,
  //     element: <VendorEditOfferPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.OFFERS.STATS,
  //     element: <VendorOfferStatsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },

  // ==================== STAFF ====================
  //   {
  //     path: ROUTES.VENDOR.STAFF.LIST,
  //     element: <VendorStaffPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.STAFF.ADD,
  //     element: <VendorAddStaffPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.STAFF.EDIT,
  //     element: <VendorEditStaffPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.STAFF.ROLES,
  //     element: <VendorStaffRolesPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },

  // ==================== SETTINGS ====================
  {
    path: ROUTES.VENDOR.PROFILE.GENERAL,
    element: <VendorProfilePage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.PROFILE.EDIT_PROFILE,
    element: <VendorEditProfilePage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.PROFILE.CHANGE_PASSWORD,
    element: <VendorChangePasswordPage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  {
    path: ROUTES.VENDOR.PROFILE.REPORT_ISSUE,
    element: <VendorReportIssuePage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  //   {
  //     path: ROUTES.VENDOR.PAYMENT_SETTINGS,
  //     element: <VendorPaymentSettingsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.TAX_SETTINGS,
  //     element: <VendorTaxSettingsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.SHIPPING_SETTINGS,
  //     element: <VendorShippingSettingsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.NOTIFICATION_SETTINGS,
  //     element: <VendorNotificationSettingsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INTEGRATIONS,
  //     element: <VendorIntegrationsPage />,
  //     roles: [UserRole.VENDOR_STAFF],
  //   },
];
