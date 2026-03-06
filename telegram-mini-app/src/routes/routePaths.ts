export const ROUTES = {
  // Public
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

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
    AVAILABLE: "/delivery/available",
    ACTIVE: "/delivery/active",
    EARNINGS: "/delivery/earnings",
  },

  // Payment
  PAYMENT: "/payment",
} as const;
