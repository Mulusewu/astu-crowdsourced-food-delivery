import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Import all slice types
import { createAuthSlice, AuthSlice } from "./auth/authStore";
import { createUserSlice, UserSlice } from "./user/userStore";
import { createCustomerSlice, CustomerSlice } from "./customer/customerStore";
import { createVendorSlice, VendorSlice } from "./vendor/vendorStore";
import { createDeliverySlice, DeliverySlice } from "./delivery/deliveryStore";
import { createOrderSlice, OrderSlice } from "./orders/orderStore";
import { createCartSlice, CartSlice } from "./cart/cartStore";
import { createPaymentSlice, PaymentSlice } from "./payment/paymentStore";
import { createLocationSlice, LocationSlice } from "./location/locationStore";
import {
  createNotificationSlice,
  NotificationSlice,
} from "./notifications/notificationStore";
import { createUISlice, UISlice } from "./ui/uiStore";

// Combined store type
export type RootState = AuthSlice &
  UserSlice &
  CustomerSlice &
  VendorSlice &
  DeliverySlice &
  OrderSlice &
  CartSlice &
  PaymentSlice &
  LocationSlice &
  NotificationSlice &
  UISlice;

// Root store with all slices
export const useRootStore = create<RootState>()(
  devtools(
    immer((...a) => ({
      ...createAuthSlice(...a),
      ...createUserSlice(...a),
      ...createCustomerSlice(...a),
      ...createVendorSlice(...a),
      ...createDeliverySlice(...a),
      ...createOrderSlice(...a),
      ...createCartSlice(...a),
      ...createPaymentSlice(...a),
      ...createLocationSlice(...a),
      ...createNotificationSlice(...a),
      ...createUISlice(...a),
    })),
    { name: "AstuEatsStore" },
  ),
);

// Selector hooks for better performance
export const useAuth = () =>
  useRootStore((state) => ({
    user: state.user,
    role: state.role,
    isAuthenticated: state.isAuthenticated,
    login: state.login,
    logout: state.logout,
  }));

export const useOrders = () =>
  useRootStore((state) => ({
    orders: state.orders,
    activeOrders: state.activeOrders,
    loadOrders: state.loadOrders,
    acceptOrder: state.acceptOrder,
  }));
