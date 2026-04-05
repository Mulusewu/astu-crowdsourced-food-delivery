import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";
// Import UserRole as a type only, and UserRoles for constants
import type { UserRole } from "@/types/user.types";
import { UserRoles } from "@/types/user.types";

// ================= DASHBOARD =================
const DeliveryDashboard = lazy(
  () => import("../../features/delivery/pages/DeliveryDashboard"),
);

const DeliveryPaymentPage = lazy(
  () => import("../../features/delivery/pages/paymentMethod"),
);

const DeliveryPasswordChangePage = lazy(
  () => import("../../features/delivery/pages/changePassword"),
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
// const DeliveryHistoryPage = lazy(
//   () => import("../../features/delivery/pages/HistoryPage"),
// );
// const DeliveryHistoryDetailsPage = lazy(
//   () => import("../../features/delivery/pages/HistoryDetailsPage"),
// );

// ================= EARNINGS =================
const DeliveryEarningsPage = lazy(
  () => import("../../features/delivery/pages/EarningsPage"),
);
// const DeliveryEarningsDetailsPage = lazy(
//   () => import("../../features/delivery/pages/EarningsDetailsPage"),
// );
// const DeliveryEarningsHistoryPage = lazy(
//   () => import("../../features/delivery/pages/EarningsHistoryPage"),
// );
// const WithdrawEarningsPage = lazy(
//   () => import("../../features/delivery/pages/WithdrawEarningsPage"),
// );

// ================= PROFILE =================
const DeliveryProfilePage = lazy(
  () => import("../../features/delivery/pages/ProfilePage"),
);
// const DeliveryDocumentsPage = lazy(
//   () => import("../../features/delivery/pages/DocumentsPage"),
// );
// const DeliverySettingsPage = lazy(
//   () => import("../../features/delivery/pages/SettingsPage"),
// );
// const DeliveryNotificationsPage = lazy(
//   () => import("../../features/delivery/pages/NotificationsPage"),
// );
// const DeliverySupportPage = lazy(
//   () => import("../../features/delivery/pages/SupportPage"),
// );

// ================= VEHICLE =================
// const VehicleInfoPage = lazy(
//   () => import("../../features/delivery/pages/VehicleInfoPage"),
// );
// const UpdateVehiclePage = lazy(
//   () => import("../../features/delivery/pages/UpdateVehiclePage"),
// );
// const VehicleDocumentsPage = lazy(
//   () => import("../../features/delivery/pages/VehicleDocumentsPage"),
// );

// ================= DELIVERY ACTIONS =================
const AcceptDeliveryPage = lazy(
  () => import("../../features/delivery/pages/AcceptDeliveryPage"),
);
// const PickupDeliveryPage = lazy(
//   () => import("../../features/delivery/pages/PickupDeliveryPage"),
// );
// const StartDeliveryPage = lazy(
//   () => import("../../features/delivery/pages/StartDeliveryPage"),
// );
// const CompleteDeliveryPage = lazy(
//   () => import("../../features/delivery/pages/CompleteDeliveryPage"),
// );
// const CancelDeliveryPage = lazy(
//   () => import("../../features/delivery/pages/CancelDeliveryPage"),
// );
// const FailDeliveryPage = lazy(
//   () => import("../../features/delivery/pages/FailDeliveryPage"),
// );
const UpdateLocationPage = lazy(
  () => import("../../features/delivery/pages/UpdateLocationPage"),
);

export const deliveryRoutes: RouteGroup[] = [
  // ================= DASHBOARD =================
  {
    path: ROUTES.DELIVERY.DASHBOARD,
    element: <DeliveryDashboard />,
    roles: [UserRoles.DELIVERY], // Use UserRoles.DELIVERY instead of UserRole.DELIVERY
  },
  {
    path: ROUTES.DELIVERY.PASSWORD,
    element: <DeliveryPasswordChangePage />,
    roles: [UserRoles.DELIVERY], // Use UserRoles.DELIVERY instead of UserRole.DELIVERY
  },

  {
    path: ROUTES.DELIVERY.PAYMENT,
    element: <DeliveryPaymentPage />,
    roles: [UserRoles.DELIVERY], // Use UserRoles.DELIVERY instead of UserRole.DELIVERY
  },

  // ================= STATUS =================
  {
    path: ROUTES.DELIVERY.STATUS,
    element: <DeliveryStatusPage />,
    roles: [UserRoles.DELIVERY],
  },

  // ================= AVAILABILITY =================
  {
    path: ROUTES.DELIVERY.AVAILABILITY,
    element: <DeliveryAvailabilityPage />,
    roles: [UserRoles.DELIVERY],
  },

  // ================= AVAILABLE DELIVERIES =================
  {
    path: ROUTES.DELIVERY.AVAILABLE.LIST,
    element: <AvailableDeliveriesPage />,
    roles: [UserRoles.DELIVERY],
  },
  {
    path: ROUTES.DELIVERY.AVAILABLE.DETAILS,
    element: <AvailableDeliveryDetailsPage />,
    roles: [UserRoles.DELIVERY],
  },

  // ================= ACTIVE DELIVERIES =================
  {
    path: ROUTES.DELIVERY.ACTIVE.LIST,
    element: <ActiveDeliveriesPage />,
    roles: [UserRoles.DELIVERY],
  },
  {
    path: ROUTES.DELIVERY.ACTIVE.DETAILS,
    element: <ActiveDeliveryDetailsPage />,
    roles: [UserRoles.DELIVERY],
  },
  {
    path: ROUTES.DELIVERY.ACTIVE.TRACK,
    element: <ActiveDeliveryTrackPage />,
    roles: [UserRoles.DELIVERY],
  },

  // ================= DELIVERY ACTIONS =================
  {
    path: ROUTES.DELIVERY.DELIVERY_ACTIONS.ACCEPT,
    element: <AcceptDeliveryPage />,
    roles: [UserRoles.DELIVERY],
  },
  // {
  //   path: ROUTES.DELIVERY.DELIVERY_ACTIONS.PICKUP,
  //   element: <PickupDeliveryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.DELIVERY_ACTIONS.START,
  //   element: <StartDeliveryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.DELIVERY_ACTIONS.COMPLETE,
  //   element: <CompleteDeliveryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.DELIVERY_ACTIONS.CANCEL,
  //   element: <CancelDeliveryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.DELIVERY_ACTIONS.FAIL,
  //   element: <FailDeliveryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  {
    path: ROUTES.DELIVERY.DELIVERY_ACTIONS.UPDATE_LOCATION,
    element: <UpdateLocationPage />,
    roles: [UserRoles.DELIVERY],
  },

  // ================= EARNINGS =================
  {
    path: ROUTES.DELIVERY.EARNINGS.SUMMARY,
    element: <DeliveryEarningsPage />,
    roles: [UserRoles.DELIVERY],
  },
  // {
  //   path: ROUTES.DELIVERY.EARNINGS.DETAILS,
  //   element: <DeliveryEarningsDetailsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.EARNINGS.HISTORY,
  //   element: <DeliveryEarningsHistoryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.EARNINGS.WITHDRAW,
  //   element: <WithdrawEarningsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },

  // ================= HISTORY =================
  // {
  //   path: ROUTES.DELIVERY.HISTORY.LIST,
  //   element: <DeliveryHistoryPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.HISTORY.DETAILS,
  //   element: <DeliveryHistoryDetailsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  {
    path: ROUTES.DELIVERY.HISTORY.STATS,
    element: <DeliveryStatsPage />,
    roles: [UserRoles.DELIVERY],
  },

  // ================= VEHICLE =================
  // {
  //   path: ROUTES.DELIVERY.VEHICLE.INFO,
  //   element: <VehicleInfoPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.VEHICLE.UPDATE,
  //   element: <UpdateVehiclePage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.VEHICLE.DOCUMENTS,
  //   element: <VehicleDocumentsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },

  // ================= PROFILE & SETTINGS =================
  {
    path: ROUTES.DELIVERY.PROFILE,
    element: <DeliveryProfilePage />,
    roles: [UserRoles.DELIVERY],
  },
  // {
  //   path: ROUTES.DELIVERY.DOCUMENTS,
  //   element: <DeliveryDocumentsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.SETTINGS,
  //   element: <DeliverySettingsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.NOTIFICATIONS,
  //   element: <DeliveryNotificationsPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
  // {
  //   path: ROUTES.DELIVERY.SUPPORT,
  //   element: <DeliverySupportPage />,
  //   roles: [UserRoles.DELIVERY],
  // },
];
