// import { lazy } from "react";
// import type { RouteGroup } from "../types/routes.types";
// import { ROUTES } from "../routePaths";
// import { UserRole } from "@/types/user.types";

// // Core
// const CustomerHomePage = lazy(
//   () => import("@/features/customer/pages/HomePage"),
// );
// const CustomerSearchPage = lazy(
//   () => import("@/features/customer/pages/SearchPage"),
// );
// const CustomerNotificationsPage = lazy(
//   () => import("@/features/customer/pages/NotificationsPage"),
// );

// // Restaurant & Food
// const RestaurantListPage = lazy(
//   () => import("@/features/customer/pages/RestaurantListPage"),
// );
// const RestaurantDetailsPage = lazy(
//   () => import("@/features/customer/pages/RestaurantDetailsPage"),
// );
// const RestaurantMenuPage = lazy(
//   () => import("@/features/customer/pages/RestaurantMenuPage"),
// );
// const RestaurantReviewsPage = lazy(
//   () => import("@/features/customer/pages/RestaurantReviewsPage"),
// );
// const FoodDetailsPage = lazy(
//   () => import("@/features/customer/pages/FoodDetailsPage"),
// );
// const FoodSearchPage = lazy(
//   () => import("@/features/customer/pages/FoodSearchPage"),
// );
// const FoodCategoryPage = lazy(
//   () => import("@/features/customer/pages/FoodCategoryPage"),
// );
// const OffersPage = lazy(() => import("@/features/customer/pages/OffersPage"));

// // Order Management
// const CartPage = lazy(() => import("@/features/customer/pages/CartPage"));
// const CheckoutPage = lazy(
//   () => import("@/features/customer/pages/CheckoutPage"),
// );
// const CheckoutSuccessPage = lazy(
//   () => import("@/features/customer/pages/CheckoutSuccessPage"),
// );
// const OrderListPage = lazy(
//   () => import("@/features/customer/pages/OrderListPage"),
// );
// const OrderDetailsPage = lazy(
//   () => import("@/features/customer/pages/OrderDetailsPage"),
// );
// const OrderTrackingPage = lazy(
//   () => import("@/features/customer/pages/OrderTrackingPage"),
// );
// const OrderHistoryPage = lazy(
//   () => import("@/features/customer/pages/OrderHistoryPage"),
// );
// const OrderReviewPage = lazy(
//   () => import("@/features/customer/pages/OrderReviewPage"),
// );

// // Payment & Wallet
// const PaymentMethodsPage = lazy(
//   () => import("@/features/customer/pages/PaymentMethodsPage"),
// );
// const AddPaymentMethodPage = lazy(
//   () => import("@/features/customer/pages/AddPaymentMethodPage"),
// );
// const WalletPage = lazy(() => import("@/features/customer/pages/WalletPage"));
// const TransactionsPage = lazy(
//   () => import("@/features/customer/pages/TransactionsPage"),
// );

// // Profile
// const CustomerProfilePage = lazy(
//   () => import("@/features/customer/pages/ProfilePage"),
// );
// const AddressesPage = lazy(
//   () => import("@/features/customer/pages/AddressesPage"),
// );
// const AddAddressPage = lazy(
//   () => import("@/features/customer/pages/AddAddressPage"),
// );
// const EditAddressPage = lazy(
//   () => import("@/features/customer/pages/EditAddressPage"),
// );
// const FavoritesPage = lazy(
//   () => import("@/features/customer/pages/FavoritesPage"),
// );
// const CustomerSettingsPage = lazy(
//   () => import("@/features/customer/pages/SettingsPage"),
// );

// export const customerRoutes: RouteGroup[] = [
//   // Core Navigation
//   {
//     path: ROUTES.CUSTOMER.HOME,
//     element: <CustomerHomePage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.SEARCH,
//     element: <CustomerSearchPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.NOTIFICATIONS,
//     element: <CustomerNotificationsPage />,
//     roles: [UserRole.CUSTOMER],
//   },

//   // Restaurant Discovery
//   {
//     path: ROUTES.CUSTOMER.RESTAURANT.LIST,
//     element: <RestaurantListPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.RESTAURANT.DETAILS,
//     element: <RestaurantDetailsPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.RESTAURANT.MENU,
//     element: <RestaurantMenuPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.RESTAURANT.REVIEWS,
//     element: <RestaurantReviewsPage />,
//     roles: [UserRole.CUSTOMER],
//   },

//   // Food Items
//   {
//     path: ROUTES.CUSTOMER.FOOD.DETAILS,
//     element: <FoodDetailsPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.FOOD.SEARCH,
//     element: <FoodSearchPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.FOOD.CATEGORY,
//     element: <FoodCategoryPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.FOOD.OFFERS,
//     element: <OffersPage />,
//     roles: [UserRole.CUSTOMER],
//   },

//   // Order Flow
//   {
//     path: ROUTES.CUSTOMER.CART,
//     element: <CartPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.CHECKOUT,
//     element: <CheckoutPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.CHECKOUT_SUCCESS,
//     element: <CheckoutSuccessPage />,
//     roles: [UserRole.CUSTOMER],
//   },

//   // Order History & Tracking
//   {
//     path: ROUTES.CUSTOMER.ORDERS.LIST,
//     element: <OrderListPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.ORDERS.DETAILS,
//     element: <OrderDetailsPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.ORDERS.TRACK,
//     element: <OrderTrackingPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.ORDERS.HISTORY,
//     element: <OrderHistoryPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.ORDERS.REVIEW,
//     element: <OrderReviewPage />,
//     roles: [UserRole.CUSTOMER],
//   },

//   // Payment Methods
//   {
//     path: ROUTES.CUSTOMER.PAYMENT.METHODS,
//     element: <PaymentMethodsPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.PAYMENT.ADD_METHOD,
//     element: <AddPaymentMethodPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.PAYMENT.WALLET,
//     element: <WalletPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.PAYMENT.TRANSACTIONS,
//     element: <TransactionsPage />,
//     roles: [UserRole.CUSTOMER],
//   },

//   // Profile Management
//   {
//     path: ROUTES.CUSTOMER.PROFILE,
//     element: <CustomerProfilePage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.ADDRESSES,
//     element: <AddressesPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.ADD_ADDRESS,
//     element: <AddAddressPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.EDIT_ADDRESS,
//     element: <EditAddressPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.FAVORITES,
//     element: <FavoritesPage />,
//     roles: [UserRole.CUSTOMER],
//   },
//   {
//     path: ROUTES.CUSTOMER.SETTINGS,
//     element: <CustomerSettingsPage />,
//     roles: [UserRole.CUSTOMER],
//   },
// ];
