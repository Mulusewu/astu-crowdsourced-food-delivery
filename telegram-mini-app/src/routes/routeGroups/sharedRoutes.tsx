// import { lazy } from "react";
// import { RouteGroup } from "../types/routes.types";
// import { ROUTES } from "../routePaths";
// import { UserRole } from "@/types/user.types";

// // Order Shared
// const OrderDetailsSharedPage = lazy(
//   () => import("@/features/shared/pages/OrderDetailsPage"),
// );
// const OrderTrackSharedPage = lazy(
//   () => import("@/features/shared/pages/OrderTrackPage"),
// );
// const OrderInvoicePage = lazy(
//   () => import("@/features/shared/pages/OrderInvoicePage"),
// );
// const OrderReceiptPage = lazy(
//   () => import("@/features/shared/pages/OrderReceiptPage"),
// );

// // Payment Shared
// const ProcessPaymentPage = lazy(
//   () => import("@/features/payment/pages/ProcessPaymentPage"),
// );
// const PaymentSuccessPage = lazy(
//   () => import("@/features/payment/pages/PaymentSuccessPage"),
// );
// const PaymentFailedPage = lazy(
//   () => import("@/features/payment/pages/PaymentFailedPage"),
// );
// const PaymentMethodsSharedPage = lazy(
//   () => import("@/features/payment/pages/PaymentMethodsPage"),
// );
// const PaymentHistoryPage = lazy(
//   () => import("@/features/payment/pages/PaymentHistoryPage"),
// );

// // Notifications Shared
// const NotificationsPage = lazy(
//   () => import("@/features/shared/pages/NotificationsPage"),
// );
// const NotificationDetailsPage = lazy(
//   () => import("@/features/shared/pages/NotificationDetailsPage"),
// );

// // Chat Shared
// const ChatListPage = lazy(() => import("@/features/chat/pages/ChatListPage"));
// const ChatRoomPage = lazy(() => import("@/features/chat/pages/ChatRoomPage"));
// const ChatSupportPage = lazy(
//   () => import("@/features/chat/pages/ChatSupportPage"),
// );

// // Support Shared
// const SupportCenterPage = lazy(
//   () => import("@/features/support/pages/SupportCenterPage"),
// );
// const FAQPage = lazy(() => import("@/features/support/pages/FAQPage"));
// const ContactPage = lazy(() => import("@/features/support/pages/ContactPage"));
// const ReportPage = lazy(() => import("@/features/support/pages/ReportPage"));

// // Legal Shared
// const TermsPage = lazy(() => import("@/features/legal/pages/TermsPage"));
// const PrivacyPage = lazy(() => import("@/features/legal/pages/PrivacyPage"));
// const CookiesPage = lazy(() => import("@/features/legal/pages/CookiesPage"));

// // All roles that can access shared routes
// const allRoles = [UserRole.CUSTOMER, UserRole.VENDOR, UserRole.DELIVERY];
// const customerVendorRoles = [UserRole.CUSTOMER, UserRole.VENDOR];

// export const sharedRoutes: RouteGroup[] = [
//   // Order Routes - Accessible by all roles
//   {
//     path: ROUTES.ORDER.DETAILS,
//     element: <OrderDetailsSharedPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.ORDER.TRACK,
//     element: <OrderTrackSharedPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.ORDER.INVOICE,
//     element: <OrderInvoicePage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.ORDER.RECEIPT,
//     element: <OrderReceiptPage />,
//     roles: allRoles,
//   },

//   // Payment Routes - Accessible by Customer and Vendor
//   {
//     path: ROUTES.PAYMENT.PROCESS,
//     element: <ProcessPaymentPage />,
//     roles: customerVendorRoles,
//   },
//   {
//     path: ROUTES.PAYMENT.SUCCESS,
//     element: <PaymentSuccessPage />,
//     roles: customerVendorRoles,
//   },
//   {
//     path: ROUTES.PAYMENT.FAILED,
//     element: <PaymentFailedPage />,
//     roles: customerVendorRoles,
//   },
//   {
//     path: ROUTES.PAYMENT.METHODS,
//     element: <PaymentMethodsSharedPage />,
//     roles: customerVendorRoles,
//   },
//   {
//     path: ROUTES.PAYMENT.HISTORY,
//     element: <PaymentHistoryPage />,
//     roles: customerVendorRoles,
//   },

//   // Notifications - Accessible by all roles
//   {
//     path: ROUTES.NOTIFICATIONS,
//     element: <NotificationsPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.NOTIFICATION_DETAILS,
//     element: <NotificationDetailsPage />,
//     roles: allRoles,
//   },

//   // Chat - Accessible by all roles
//   {
//     path: ROUTES.CHAT.LIST,
//     element: <ChatListPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.CHAT.ROOM,
//     element: <ChatRoomPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.CHAT.SUPPORT,
//     element: <ChatSupportPage />,
//     roles: allRoles,
//   },

//   // Support - Accessible by all roles
//   {
//     path: ROUTES.SUPPORT.CENTER,
//     element: <SupportCenterPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.SUPPORT.FAQ,
//     element: <FAQPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.SUPPORT.CONTACT,
//     element: <ContactPage />,
//     roles: allRoles,
//   },
//   {
//     path: ROUTES.SUPPORT.REPORT,
//     element: <ReportPage />,
//     roles: allRoles,
//   },

//   // Legal - Public routes (no roles needed)
//   {
//     path: ROUTES.LEGAL.TERMS,
//     element: <TermsPage />,
//   },
//   {
//     path: ROUTES.LEGAL.PRIVACY,
//     element: <PrivacyPage />,
//   },
//   {
//     path: ROUTES.LEGAL.COOKIES,
//     element: <CookiesPage />,
//   },
// ];
