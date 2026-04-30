import type { RouteGroup } from "../types/routes.types";
// import { lazy } from "react";
// import { ROUTES } from "../routePaths";
// import { UserRoles } from "@/types/user.types";

// Dashboard & Analytics
// const VendorDashboard = lazy(
//   () => import("@/features/vendor/pages/VendorDashboardPage"),
// );
// const VendorAnalyticsPage = lazy(
//   () => import("@/features/vendor/pages/AnalyticsPage"),
// );
// const VendorEarningsPage = lazy(
//   () => import("@/features/vendor/pages/EarningsPage"),
// );
// const VendorEarningsDetailsPage = lazy(
//   () => import("@/features/vendor/pages/EarningsDetailsPage"),
// );

// Restaurant Management
// const VendorRestaurantProfilePage = lazy(
//   () => import("@/features/vendor/pages/RestaurantProfilePage"),
// );
// const VendorRestaurantEditPage = lazy(
//   () => import("@/features/vendor/pages/RestaurantEditPage"),
// );
// const VendorRestaurantHoursPage = lazy(
//   () => import("@/features/vendor/pages/RestaurantHoursPage"),
// );
// const VendorRestaurantLocationPage = lazy(
//   () => import("@/features/vendor/pages/RestaurantLocationPage"),
// );
// const VendorRestaurantGalleryPage = lazy(
//   () => import("@/features/vendor/pages/RestaurantGalleryPage"),
// );

// Menu Management (CRUD)
// const VendorMenuPage = lazy(() => import("@/features/vendor/pages/MenuPage"));
// const VendorAddFoodPage = lazy(
//   () => import("@/features/vendor/pages/AddFoodPage"),
// );
// const VendorEditFoodPage = lazy(
//   () => import("@/features/vendor/pages/EditFoodPage"),
// );
// const VendorDuplicateFoodPage = lazy(
//   () => import("@/features/vendor/pages/DuplicateFoodPage"),
// );
// const VendorCategoriesPage = lazy(
//   () => import("@/features/vendor/pages/CategoriesPage"),
// );
// const VendorAddCategoryPage = lazy(
//   () => import("@/features/vendor/pages/AddCategoryPage"),
// );
// const VendorEditCategoryPage = lazy(
//   () => import("@/features/vendor/pages/EditCategoryPage"),
// );
// const VendorBulkEditPage = lazy(
//   () => import("@/features/vendor/pages/BulkEditPage"),
// );
// const VendorImportPage = lazy(
//   () => import("@/features/vendor/pages/ImportPage"),
// );
// const VendorExportPage = lazy(
//   () => import("@/features/vendor/pages/ExportPage"),
// );

// Inventory Management
// const VendorInventoryPage = lazy(
//   () => import("@/features/vendor/pages/InventoryPage"),
// );
// const VendorLowStockPage = lazy(
//   () => import("@/features/vendor/pages/LowStockPage"),
// );
// const VendorOutOfStockPage = lazy(
//   () => import("@/features/vendor/pages/OutOfStockPage"),
// );
// const VendorAdjustInventoryPage = lazy(
//   () => import("@/features/vendor/pages/AdjustInventoryPage"),
// );

// Order Management
// const VendorOrdersPage = lazy(
//   () => import("@/features/vendor/pages/OrdersPage"),
// );
// const VendorOrderDetailsPage = lazy(
//   () => import("@/features/vendor/pages/OrderDetailsPage"),
// );
// const VendorPendingOrdersPage = lazy(
//   () => import("@/features/vendor/pages/PendingOrdersPage"),
// );
// const VendorPreparingOrdersPage = lazy(
//   () => import("@/features/vendor/pages/PreparingOrdersPage"),
// );
// const VendorReadyOrdersPage = lazy(
//   () => import("@/features/vendor/pages/ReadyOrdersPage"),
// );
// const VendorCompletedOrdersPage = lazy(
//   () => import("@/features/vendor/pages/CompletedOrdersPage"),
// );
// const VendorCancelledOrdersPage = lazy(
//   () => import("@/features/vendor/pages/CancelledOrdersPage"),
// );
// const VendorOrderHistoryPage = lazy(
//   () => import("@/features/vendor/pages/OrderHistoryPage"),
// );

// Order Actions
// const VendorAcceptOrderPage = lazy(
//   () => import("@/features/vendor/pages/AcceptOrderPage"),
// );
// const VendorRejectOrderPage = lazy(
//   () => import("@/features/vendor/pages/RejectOrderPage"),
// );
// const VendorStartPreparingPage = lazy(
//   () => import("@/features/vendor/pages/StartPreparingPage"),
// );
// const VendorMarkReadyPage = lazy(
//   () => import("@/features/vendor/pages/MarkReadyPage"),
// );
// const VendorCancelOrderPage = lazy(
//   () => import("@/features/vendor/pages/CancelOrderPage"),
// );

// Reviews
// const VendorReviewsPage = lazy(
//   () => import("@/features/vendor/pages/ReviewsPage"),
// );
// const VendorReviewDetailsPage = lazy(
//   () => import("@/features/vendor/pages/ReviewDetailsPage"),
// );
// const VendorReplyReviewPage = lazy(
//   () => import("@/features/vendor/pages/ReplyReviewPage"),
// );

// Offers
// const VendorOffersPage = lazy(
//   () => import("@/features/vendor/pages/OffersPage"),
// );
// const VendorCreateOfferPage = lazy(
//   () => import("@/features/vendor/pages/CreateOfferPage"),
// );
// const VendorEditOfferPage = lazy(
//   () => import("@/features/vendor/pages/EditOfferPage"),
// );
// const VendorOfferStatsPage = lazy(
//   () => import("@/features/vendor/pages/OfferStatsPage"),
// );

// Staff
// const VendorStaffPage = lazy(() => import("@/features/vendor/pages/StaffPage"));
// const VendorAddStaffPage = lazy(
//   () => import("@/features/vendor/pages/AddStaffPage"),
// );
// const VendorEditStaffPage = lazy(
//   () => import("@/features/vendor/pages/EditStaffPage"),
// );
// const VendorStaffRolesPage = lazy(
//   () => import("@/features/vendor/pages/StaffRolesPage"),
// );

// Settings
// const VendorSettingsPage = lazy(
//   () => import("@/features/vendor/pages/SettingsPage"),
// );
// const VendorPaymentSettingsPage = lazy(
//   () => import("@/features/vendor/pages/PaymentSettingsPage"),
// );
// const VendorTaxSettingsPage = lazy(
//   () => import("@/features/vendor/pages/TaxSettingsPage"),
// );
// const VendorShippingSettingsPage = lazy(
//   () => import("@/features/vendor/pages/ShippingSettingsPage"),
// );
// const VendorNotificationSettingsPage = lazy(
//   () => import("@/features/vendor/pages/NotificationSettingsPage"),
// );
// const VendorIntegrationsPage = lazy(
//   () => import("@/features/vendor/pages/IntegrationsPage"),
// );

export const vendorRoutes: RouteGroup[] = [
  // ==================== DASHBOARD & ANALYTICS ====================
  // {
  //   path: ROUTES.VENDOR.DASHBOARD,
  //   element: <VendorDashboard />,
  //   roles: [UserRoles.VENDOR],
  // },
];
