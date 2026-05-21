import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";
import { UserRoles } from "@/types/user.types";

// Dashboard & Analytics
const VendorDashboard = lazy(
  () => import("@/features/vendor2/pages/VendorDashboard"),
);
// const VendorAnalyticsPage = lazy(
//   () => import("@/features/vendor2/pages/AnalyticsPage"),
// );
// const VendorEarningsDetailsPage = lazy(
//   () => import("@/features/vendor2/pages/EarningsDetailsPage"),
// );

// Restaurant Management
// const VendorRestaurantProfilePage = lazy(
//   () => import("@/features/vendor2/pages/RestaurantProfilePage"),
// );
// const VendorRestaurantEditPage = lazy(
//   () => import("@/features/vendor2/pages/RestaurantEditPage"),
// );
// const VendorRestaurantHoursPage = lazy(
//   () => import("@/features/vendor2/pages/RestaurantHoursPage"),
// );
// const VendorRestaurantLocationPage = lazy(
//   () => import("@/features/vendor2/pages/RestaurantLocationPage"),
// );
// const VendorRestaurantGalleryPage = lazy(
//   () => import("@/features/vendor2/pages/RestaurantGalleryPage"),
// );

// // Menu Management (CRUD)
// const VendorMenuPage = lazy(() => import("@/features/vendor2/pages/MenuPage"));
// const VendorAddFoodPage = lazy(
//   () => import("@/features/vendor2/pages/AddFoodPage"),
// );
// const VendorEditFoodPage = lazy(
//   () => import("@/features/vendor2/pages/EditFoodPage"),
// );
// const VendorDuplicateFoodPage = lazy(
//   () => import("@/features/vendor2/pages/DuplicateFoodPage"),
// );
// const VendorCategoriesPage = lazy(
//   () => import("@/features/vendor2/pages/CategoriesPage"),
// );
// const VendorAddCategoryPage = lazy(
//   () => import("@/features/vendor2/pages/AddCategoryPage"),
// );
// const VendorEditCategoryPage = lazy(
//   () => import("@/features/vendor2/pages/EditCategoryPage"),
// );
// const VendorBulkEditPage = lazy(
//   () => import("@/features/vendor2/pages/BulkEditPage"),
// );
// const VendorImportPage = lazy(
//   () => import("@/features/vendor2/pages/ImportPage"),
// );
// const VendorExportPage = lazy(
//   () => import("@/features/vendor2/pages/ExportPage"),
// );

// Inventory Management
// const VendorInventoryPage = lazy(
//   () => import("@/features/vendor2/pages/InventoryPage"),
// );
// const VendorLowStockPage = lazy(
//   () => import("@/features/vendor2/pages/LowStockPage"),
// );
// const VendorOutOfStockPage = lazy(
//   () => import("@/features/vendor2/pages/OutOfStockPage"),
// );
// const VendorAdjustInventoryPage = lazy(
//   () => import("@/features/vendor2/pages/AdjustInventoryPage"),
// );

// Order Management
// const VendorOrdersPage = lazy(
//   () => import("@/features/vendor2/pages/OrdersPage"),
// );
// const VendorOrderDetailsPage = lazy(
//   () => import("@/features/vendor2/pages/OrderDetailsPage"),
// );
// const VendorPendingOrdersPage = lazy(
//   () => import("@/features/vendor2/pages/PendingOrdersPage"),
// );
// const VendorPreparingOrdersPage = lazy(
//   () => import("@/features/vendor2/pages/PreparingOrdersPage"),
// );
// const VendorReadyOrdersPage = lazy(
//   () => import("@/features/vendor2/pages/ReadyOrdersPage"),
// );
// const VendorCompletedOrdersPage = lazy(
//   () => import("@/features/vendor2/pages/CompletedOrdersPage"),
// );
// const VendorCancelledOrdersPage = lazy(
//   () => import("@/features/vendor2/pages/CancelledOrdersPage"),
// );
// const VendorOrderHistoryPage = lazy(
//   () => import("@/features/vendor2/pages/OrderHistoryPage"),
// );

// Order Actions
// const VendorAcceptOrderPage = lazy(
//   () => import("@/features/vendor2/pages/AcceptOrderPage"),
// );
// const VendorRejectOrderPage = lazy(
//   () => import("@/features/vendor2/pages/RejectOrderPage"),
// );
// const VendorStartPreparingPage = lazy(
//   () => import("@/features/vendor2/pages/StartPreparingPage"),
// );
// const VendorMarkReadyPage = lazy(
//   () => import("@/features/vendor2/pages/MarkReadyPage"),
// );
// const VendorCancelOrderPage = lazy(
//   () => import("@/features/vendor2/pages/CancelOrderPage"),
// );

// Reviews
// const VendorReviewsPage = lazy(
//   () => import("@/features/vendor2/pages/ReviewsPage"),
// );
// const VendorReviewDetailsPage = lazy(
//   () => import("@/features/vendor2/pages/ReviewDetailsPage"),
// );
// const VendorReplyReviewPage = lazy(
//   () => import("@/features/vendor2/pages/ReplyReviewPage"),
// );

// Offers
// const VendorOffersPage = lazy(
//   () => import("@/features/vendor2/pages/OffersPage"),
// );
// const VendorCreateOfferPage = lazy(
//   () => import("@/features/vendor2/pages/CreateOfferPage"),
// );
// const VendorEditOfferPage = lazy(
//   () => import("@/features/vendor2/pages/EditOfferPage"),
// );
// const VendorOfferStatsPage = lazy(
//   () => import("@/features/vendor2/pages/OfferStatsPage"),
// );

// Staff
// const VendorStaffPage = lazy(() => import("@/features/vendor2/pages/StaffPage"));
// const VendorAddStaffPage = lazy(
//   () => import("@/features/vendor2/pages/AddStaffPage"),
// );
// const VendorEditStaffPage = lazy(
//   () => import("@/features/vendor2/pages/EditStaffPage"),
// );
// const VendorStaffRolesPage = lazy(
//   () => import("@/features/vendor2/pages/StaffRolesPage"),
// );

// Settings
// const VendorSettingsPage = lazy(
//   () => import("@/features/vendor2/pages/SettingsPage"),
// );
const VendorProfilePage = lazy(
  () => import("@/features/vendor2/pages/VendorProfilePage"),
);
// const VendorPaymentSettingsPage = lazy(
//   () => import("@/features/vendor2/pages/PaymentSettingsPage"),
// );
// const VendorTaxSettingsPage = lazy(
//   () => import("@/features/vendor2/pages/TaxSettingsPage"),
// );
// const VendorShippingSettingsPage = lazy(
//   () => import("@/features/vendor2/pages/ShippingSettingsPage"),
// );
// const VendorNotificationSettingsPage = lazy(
//   () => import("@/features/vendor2/pages/NotificationSettingsPage"),
// );
// const VendorIntegrationsPage = lazy(
//   () => import("@/features/vendor2/pages/IntegrationsPage"),
// );

export const vendorRoutes: RouteGroup[] = [
  // ==================== DASHBOARD & ANALYTICS ====================
  {
    path: ROUTES.VENDOR.DASHBOARD,
    element: <VendorDashboard />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  //   {
  //     path: ROUTES.VENDOR.ANALYTICS,
  //     element: <VendorAnalyticsPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.EARNINGS,
  //     element: <VendorEarningsPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.EARNINGS_DETAILS,
  //     element: <VendorEarningsDetailsPage />,
  //     roles: [UserRoles.VENDOR],
  //   },

  //   // ==================== RESTAURANT MANAGEMENT ====================
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.PROFILE,
  //     element: <VendorRestaurantProfilePage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.EDIT,
  //     element: <VendorRestaurantEditPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.HOURS,
  //     element: <VendorRestaurantHoursPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.LOCATION,
  //     element: <VendorRestaurantLocationPage />,
  //     roles: [UserRoless.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.RESTAURANT.GALLERY,
  //     element: <VendorRestaurantGalleryPage />,
  //     roles: [UserRoless.VENDOR],
  //   },

  // ==================== MENU MANAGEMENT (CRUD) ====================
  //   {
  //     path: ROUTES.VENDOR.MENU.LIST,
  //     element: <VendorMenuPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.ADD,
  //     element: <VendorAddFoodPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.EDIT,
  //     element: <VendorEditFoodPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.DUPLICATE,
  //     element: <VendorDuplicateFoodPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.MENU.CATEGORIES,
  //     element: <VendorCategoriesPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.MENU.ADD_CATEGORY,
  //     element: <VendorAddCategoryPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.MENU.EDIT_CATEGORY,
  //     element: <VendorEditCategoryPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.BULK_EDIT,
  //     element: <VendorBulkEditPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.IMPORT,
  //     element: <VendorImportPage />,
  //     roles: [UserRoles.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.FOOD.EXPORT,
  //     element: <VendorExportPage />,
  //     roles: [UserRoles.VENDOR],
  //   },

  // ==================== INVENTORY MANAGEMENT ====================
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.DASHBOARD,
  //     element: <VendorInventoryPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.LOW_STOCK,
  //     element: <VendorLowStockPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.OUT_OF_STOCK,
  //     element: <VendorOutOfStockPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INVENTORY.ADJUST,
  //     element: <VendorAdjustInventoryPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  // ==================== ORDER MANAGEMENT ====================
  //   {
  //     path: ROUTES.VENDOR.ORDERS.LIST,
  //     element: <VendorOrdersPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.DETAILS,
  //     element: <VendorOrderDetailsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.PENDING,
  //     element: <VendorPendingOrdersPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.PREPARING,
  //     element: <VendorPreparingOrdersPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.READY,
  //     element: <VendorReadyOrdersPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  //   {
  //     path: ROUTES.VENDOR.ORDERS.COMPLETED,
  //     element: <VendorCompletedOrdersPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.CANCELLED,
  //     element: <VendorCancelledOrdersPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDERS.HISTORY,
  //     element: <VendorOrderHistoryPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  // ==================== ORDER ACTIONS ====================
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.ACCEPT,
  //     element: <VendorAcceptOrderPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.REJECT,
  //     element: <VendorRejectOrderPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.START_PREPARING,
  //     element: <VendorStartPreparingPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.MARK_READY,
  //     element: <VendorMarkReadyPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.ORDER_ACTIONS.CANCEL,
  //     element: <VendorCancelOrderPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  // ==================== REVIEWS ====================
  //   {
  //     path: ROUTES.VENDOR.REVIEWS.LIST,
  //     element: <VendorReviewsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.REVIEWS.DETAILS,
  //     element: <VendorReviewDetailsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.REVIEWS.REPLY,
  //     element: <VendorReplyReviewPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  // ==================== OFFERS ====================
  //   {
  //     path: ROUTES.VENDOR.OFFERS.LIST,
  //     element: <VendorOffersPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.OFFERS.CREATE,
  //     element: <VendorCreateOfferPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.OFFERS.EDIT,
  //     element: <VendorEditOfferPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.OFFERS.STATS,
  //     element: <VendorOfferStatsPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  // ==================== STAFF ====================
  //   {
  //     path: ROUTES.VENDOR.STAFF.LIST,
  //     element: <VendorStaffPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.STAFF.ADD,
  //     element: <VendorAddStaffPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.STAFF.EDIT,
  //     element: <VendorEditStaffPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.STAFF.ROLES,
  //     element: <VendorStaffRolesPage />,
  //     roles: [UserRole.VENDOR],
  //   },

  // ==================== SETTINGS ====================
  {
    path: ROUTES.VENDOR.SETTINGS.PROFILE,
    element: <VendorProfilePage />,
    roles: [UserRoles.VENDOR_STAFF],
  },
  //   {
  //     path: ROUTES.VENDOR.PAYMENT_SETTINGS,
  //     element: <VendorPaymentSettingsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.TAX_SETTINGS,
  //     element: <VendorTaxSettingsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.SHIPPING_SETTINGS,
  //     element: <VendorShippingSettingsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.NOTIFICATION_SETTINGS,
  //     element: <VendorNotificationSettingsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
  //   {
  //     path: ROUTES.VENDOR.INTEGRATIONS,
  //     element: <VendorIntegrationsPage />,
  //     roles: [UserRole.VENDOR],
  //   },
];
