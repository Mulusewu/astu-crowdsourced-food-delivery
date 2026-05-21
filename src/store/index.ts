// store/index.ts
// This barrel re-exports only the real, individual stores.
// The old combined-slice architecture (createAuthSlice, createOrderSlice, etc.)
// has been replaced by standalone Zustand stores.

export { useAuthStore } from "./auth/authStore";
export { useCartStore } from "./cart/cartStore";
export { useCustomerStore } from "./customer/customerStore";
export { useDeliveryDashboardStore } from "./deliveryDashboardStore";
export { useRestaurantStore } from "./restaurantStore";
export { useOrderStore } from "./orders/orderStore";
