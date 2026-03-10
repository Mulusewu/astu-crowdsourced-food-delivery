import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";
import { UserRole } from "@/types/user.types";

// ================= DASHBOARD =================
const DeliveryDashboard = lazy(
  () => import("../../features/delivery/pages/DeliveryDashboard"),
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

// ================= PROFILE =================
const DeliveryProfilePage = lazy(
  () => import("../../features/delivery/pages/ProfilePage"),
);

export const deliveryRoutes: RouteGroup[] = [
  // ================= DASHBOARD =================
  {
    path: ROUTES.DELIVERY.DASHBOARD,
    element: <DeliveryDashboard />,
    roles: [UserRole.DELIVERY],
  },

  // ================= STATUS =================
  {
    path: ROUTES.DELIVERY.STATUS,
    element: <DeliveryStatusPage />,
    roles: [UserRole.DELIVERY],
  },

  // ================= AVAILABILITY =================
  {
    path: ROUTES.DELIVERY.AVAILABILITY,
    element: <DeliveryAvailabilityPage />,
    roles: [UserRole.DELIVERY],
  },

  // ================= AVAILABLE DELIVERIES =================
  {
    path: ROUTES.DELIVERY.AVAILABLE.LIST,
    element: <AvailableDeliveriesPage />,
    roles: [UserRole.DELIVERY],
  },
  {
    path: ROUTES.DELIVERY.AVAILABLE.DETAILS,
    element: <AvailableDeliveryDetailsPage />,
    roles: [UserRole.DELIVERY],
  },

  // ================= ACTIVE DELIVERIES =================
  {
    path: ROUTES.DELIVERY.ACTIVE.LIST,
    element: <ActiveDeliveriesPage />,
    roles: [UserRole.DELIVERY],
  },
  {
    path: ROUTES.DELIVERY.ACTIVE.DETAILS,
    element: <ActiveDeliveryDetailsPage />,
    roles: [UserRole.DELIVERY],
  },
  {
    path: ROUTES.DELIVERY.ACTIVE.TRACK,
    element: <ActiveDeliveryTrackPage />,
    roles: [UserRole.DELIVERY],
  },

  // ================= HISTORY =================
  {
    path: ROUTES.DELIVERY.HISTORY.STATS,
    element: <DeliveryStatsPage />,
    roles: [UserRole.DELIVERY],
  },

  // ================= PROFILE =================
  {
    path: ROUTES.DELIVERY.PROFILE,
    element: <DeliveryProfilePage />,
    roles: [UserRole.DELIVERY],
  },
];
