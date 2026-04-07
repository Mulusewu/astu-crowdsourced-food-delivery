export const ROUTES = {
  // Public
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  AUTH: "/auth",

  // Customer
  CUSTOMER: {
    HOME: "/",
    RESTAURANT: "/restaurant/:id",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    PROFILE: "/profile",
  },

  // Vendor
  VENDOR: {
    DASHBOARD: "/vendor/dashboard",
    ORDERS: "/vendor/orders",
    MENU: "/vendor/menu",
    EARNINGS: "/vendor/earnings",
    SETTINGS: "/vendor/settings",
  },

  // Delivery
  DELIVERY: {
    DASHBOARD: "/delivery/dashboard",
    ORDERS: "/delivery/orders",
    ORDER_DETAIL: "/delivery/orders/:orderId",
    AVAILABLE: "/delivery/available",
    ACTIVE: "/delivery/active",
    EARNINGS: "/delivery/earnings",
    HISTORY: "/delivery/history",
    SAVED: "/delivery/saved",
    PROFILE: "/delivery/profile",
    SignUp: "/delivery/signup",
    Offline: "/delivery/offline",
    VERIFY_OTP: "/delivery/verify-otp",
    CHANGE_PASSWORD: "/delivery/change-password",
    PAYMENT_INFO: "/delivery/payment-info",
    REPORT_ISSUE: "/delivery/report-issue"
  },
  TEST: "/test",

  // Payment
  PAYMENT: "/payment",
} as const;
