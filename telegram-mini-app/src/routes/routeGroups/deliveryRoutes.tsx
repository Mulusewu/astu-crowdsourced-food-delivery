import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";
import { UserRoles } from "@/types/user.types";

// ================= DASHBOARD =================
const DeliveryDashboard = lazy(
  () => import("../../features/delivery/pages/DeliveryDashboard"),
);

const SavedItemsPage = lazy(
  () => import("../../features/delivery/pages/SavedItemsPage"),
);

const DeliveryPaymentPage = lazy(
  () => import("../../features/delivery/pages/paymentMethod"),
);

const DeliveryPasswordChangePage = lazy(
  () => import("../../features/delivery/pages/changePassword"),
);

const OfflinePage = lazy(
  () => import("../../features/delivery/pages/OfflinePage"),
);

// ================= STATUS =================
const DeliveryStatusPage = lazy(
  () => import("../../features/delivery/pages/StatusPage"),
);

// ================= AVAILABILITY =================
const DeliveryAvailabilityPage = lazy(
  () => import("../../features/delivery/pages/AvailabilityPage"),
);

// ================= AVAILABLE DELIVERIES =================
const AvailableDeliveriesPage = lazy(
  () => import("../../features/delivery/pages/AvailableDeliveriesPage"),
);

const AvailableDeliveryDetailsPage = lazy(
  () => import("../../features/delivery/pages/AvailableDeliveryDetailsPage"),
);

// ================= ACTIVE DELIVERIES =================
const ActiveDeliveriesPage = lazy(
  () => import("../../features/delivery/pages/ActiveDeliveriesPage"),
);

const ActiveDeliveryDetailsPage = lazy(
  () => import("../../features/delivery/pages/ActiveDeliveryDetailsPage"),
);

const ActiveDeliveryTrackPage = lazy(
  () => import("../../features/delivery/pages/ActiveDeliveryTrackPage"),
);

// ================= HISTORY =================
const DeliveryStatsPage = lazy(
  () => import("../../features/delivery/pages/StatsPage"),
);
const DeliveryHistoryPage = lazy(
  () => import("../../features/delivery/pages/history"),
);

// ================= EARNINGS =================
const DeliveryEarningsPage = lazy(
  () => import("../../features/delivery/pages/EarningsPage"),
);

// ================= PROFILE =================
const DeliveryProfilePage = lazy(
  () => import("../../features/delivery/pages/ProfilePage"),
);

const DeliveryEditProfilePage = lazy(
  () => import("../../features/delivery/pages/EditProfilePage"),
);

// ================= DELIVERY ACTIONS =================
const AcceptDeliveryPage = lazy(
  () => import("../../features/delivery/pages/AcceptDeliveryPage"),
);

const UpdateLocationPage = lazy(
  () => import("../../features/delivery/pages/UpdateLocationPage"),
);

const ReportIssuePage = lazy(
  () => import("../../features/delivery/pages/ReportIssuePage"),
);
const OTPVerificationPage = lazy(
  () => import("../../features/delivery/pages/OTPVerificationPage"),
);

const AddPaymentPage = lazy(
  () => import("../../features/delivery/pages/addPayment"),
);

// Single role value for all delivery routes
const DELIVERER = UserRoles.DELIVERER;

export const deliveryRoutes: RouteGroup[] = [
  // ================= DASHBOARD =================
  { path: ROUTES.DELIVERY.DASHBOARD, element: <DeliveryDashboard />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.PASSWORD, element: <DeliveryPasswordChangePage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.OFFLINE, element: <OfflinePage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.PAYMENT, element: <DeliveryPaymentPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.SAVED, element: <SavedItemsPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.PAYMENT_ADD, element: <AddPaymentPage />, roles: [DELIVERER] },

  // ================= STATUS =================
  { path: ROUTES.DELIVERY.STATUS, element: <DeliveryStatusPage />, roles: [DELIVERER] },

  // ================= AVAILABILITY =================
  { path: ROUTES.DELIVERY.AVAILABILITY, element: <DeliveryAvailabilityPage />, roles: [DELIVERER] },

  // ================= AVAILABLE DELIVERIES =================
  { path: ROUTES.DELIVERY.AVAILABLE.LIST, element: <AvailableDeliveriesPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.AVAILABLE.DETAILS, element: <AvailableDeliveryDetailsPage />, roles: [DELIVERER] },

  // ================= ACTIVE DELIVERIES =================
  { path: ROUTES.DELIVERY.ACTIVE.LIST, element: <ActiveDeliveriesPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.ACTIVE.DETAILS, element: <ActiveDeliveryDetailsPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.ACTIVE.TRACK, element: <ActiveDeliveryTrackPage />, roles: [DELIVERER] },

  // ================= DELIVERY ACTIONS =================
  { path: ROUTES.DELIVERY.DELIVERY_ACTIONS.ACCEPT, element: <AcceptDeliveryPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.DELIVERY_ACTIONS.UPDATE_LOCATION, element: <UpdateLocationPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE, element: <OTPVerificationPage />, roles: [DELIVERER] },

  // ================= EARNINGS =================
  { path: ROUTES.DELIVERY.EARNINGS.SUMMARY, element: <DeliveryEarningsPage />, roles: [DELIVERER] },

  // ================= HISTORY =================
  { path: ROUTES.DELIVERY.HISTORY.LIST, element: <DeliveryHistoryPage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.HISTORY.STATS, element: <DeliveryStatsPage />, roles: [DELIVERER] },

  // ================= PROFILE & SETTINGS =================
  { path: ROUTES.DELIVERY.PROFILE, element: <DeliveryProfilePage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.EDIT_PROFILE, element: <DeliveryEditProfilePage />, roles: [DELIVERER] },
  { path: ROUTES.DELIVERY.COMMUNICATION.REPORT, element: <ReportIssuePage />, roles: [DELIVERER] },
];
