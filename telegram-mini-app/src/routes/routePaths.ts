export const ROUTES = {
  // ==================== PUBLIC ROUTES ====================
  AUTH: "/auth",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  VERIFY_EMAIL: "/verify-email/:token",
  TEST: "/test",

  // ==================== CUSTOMER ROUTES ====================
  CUSTOMER: {
    // Core navigation
    HOME: "/",
    SEARCH: "/search",
    NOTIFICATIONS: "/notifications",

    // Restaurant & Food discovery
    RESTAURANT: {
      LIST: "/restaurants",
      DETAILS: "/restaurant/:restaurantId",
      MENU: "/restaurant/:restaurantId/menu",
      REVIEWS: "/restaurant/:restaurantId/reviews",
    },

    // Food items
    FOOD: {
      DETAILS: "/food/:foodId",
      SEARCH: "/food/search",
      CATEGORY: "/food/category/:categoryId",
      OFFERS: "/offers",
    },

    // Order management
    CART: "/cart",
    CHECKOUT: "/checkout",
    CHECKOUT_SUCCESS: "/checkout/success/:orderId",
    ORDERS: {
      LIST: "/orders",
      DETAILS: "/order/:orderId",
      TRACK: "/order/:orderId/track",
      HISTORY: "/orders/history",
      REVIEW: "/order/:orderId/review",
    },

    // Payment & Wallet
    PAYMENT: {
      METHODS: "/payment/methods",
      ADD_METHOD: "/payment/methods/add",
      WALLET: "/wallet",
      TRANSACTIONS: "/wallet/transactions",
    },

    // User profile
    PROFILE: "/profile",
    ADDRESSES: "/profile/addresses",
    ADD_ADDRESS: "/profile/addresses/add",
    EDIT_ADDRESS: "/profile/addresses/:addressId/edit",
    FAVORITES: "/favorites",
    SETTINGS: "/settings",
  },

  // ==================== VENDOR ROUTES ====================
  VENDOR: {
    // Dashboard & Analytics
    DASHBOARD: "/vendor/dashboard",
    ANALYTICS: "/vendor/analytics",
    EARNINGS: "/vendor/earnings",
    EARNINGS_DETAILS: "/vendor/earnings/:period",

    // Restaurant Management
    RESTAURANT: {
      PROFILE: "/vendor/restaurant",
      EDIT: "/vendor/restaurant/edit",
      HOURS: "/vendor/restaurant/hours",
      LOCATION: "/vendor/restaurant/location",
      GALLERY: "/vendor/restaurant/gallery",
    },

    // Menu Management (CRUD)
    MENU: {
      LIST: "/vendor/menu",
      ADD: "/vendor/menu/add",
      EDIT: "/vendor/menu/:foodId/edit",
      DUPLICATE: "/vendor/menu/:foodId/duplicate",
      CATEGORIES: "/vendor/menu/categories",
      ADD_CATEGORY: "/vendor/menu/categories/add",
      EDIT_CATEGORY: "/vendor/menu/categories/:categoryId/edit",
    },

    // Food Item Management (CRUD)
    FOOD: {
      ADD: "/vendor/food/add",
      EDIT: "/vendor/food/:foodId/edit",
      BULK_EDIT: "/vendor/food/bulk-edit",
      IMPORT: "/vendor/food/import",
      EXPORT: "/vendor/food/export",
    },

    // Inventory Management
    INVENTORY: {
      DASHBOARD: "/vendor/inventory",
      LOW_STOCK: "/vendor/inventory/low-stock",
      OUT_OF_STOCK: "/vendor/inventory/out-of-stock",
      ADJUST: "/vendor/inventory/:foodId/adjust",
    },

    // Order Management
    ORDERS: {
      LIST: "/vendor/orders",
      DETAILS: "/vendor/order/:orderId",
      PENDING: "/vendor/orders/pending",
      PREPARING: "/vendor/orders/preparing",
      READY: "/vendor/orders/ready",
      COMPLETED: "/vendor/orders/completed",
      CANCELLED: "/vendor/orders/cancelled",
      HISTORY: "/vendor/orders/history",
    },

    // Order Processing
    ORDER_ACTIONS: {
      ACCEPT: "/vendor/order/:orderId/accept",
      REJECT: "/vendor/order/:orderId/reject",
      START_PREPARING: "/vendor/order/:orderId/start-preparing",
      MARK_READY: "/vendor/order/:orderId/mark-ready",
      CANCEL: "/vendor/order/:orderId/cancel",
    },

    // Reviews & Ratings
    REVIEWS: {
      LIST: "/vendor/reviews",
      DETAILS: "/vendor/review/:reviewId",
      REPLY: "/vendor/review/:reviewId/reply",
    },

    // Offers & Promotions
    OFFERS: {
      LIST: "/vendor/offers",
      CREATE: "/vendor/offers/create",
      EDIT: "/vendor/offers/:offerId/edit",
      STATS: "/vendor/offers/:offerId/stats",
    },

    // Staff Management
    STAFF: {
      LIST: "/vendor/staff",
      ADD: "/vendor/staff/add",
      EDIT: "/vendor/staff/:staffId/edit",
      ROLES: "/vendor/staff/roles",
    },

    // Settings
    SETTINGS: {
      PROFILE: "/vendor/settings",
      PAYMENT: "/vendor/settings/payment",
      TAX: "/vendor/settings/tax",
      SHIPPING: "/vendor/settings/shipping",
      NOTIFICATIONS: "/vendor/settings/notifications",
      INTEGRATIONS: "/vendor/settings/integrations",
    },
  },

  // ==================== DELIVERY PERSON ROUTES ====================
  DELIVERY: {
    // Dashboard & Status
    DASHBOARD: "/delivery/dashboard",
    STATUS: "/delivery/status",
    AVAILABILITY: "/delivery/availability",

    // Available Deliveries
    AVAILABLE: {
      LIST: "/delivery/available",
      DETAILS: "/delivery/available/:orderId",
      FILTERS: "/delivery/available/filters",
    },

    // Active Deliveries
    ACTIVE: {
      LIST: "/delivery/active",
      DETAILS: "/delivery/active/:deliveryId",
      TRACK: "/delivery/active/:deliveryId/track",
    },

    // Delivery Actions (CRUD for delivery process)
    DELIVERY_ACTIONS: {
      ACCEPT: "/delivery/accept/:orderId",
      PICKUP: "/delivery/:deliveryId/pickup",
      START: "/delivery/:deliveryId/start",
      COMPLETE: "/delivery/:deliveryId/complete",
      FAIL: "/delivery/:deliveryId/fail",
      CANCEL: "/delivery/:deliveryId/cancel",
      UPDATE_LOCATION: "/delivery/:deliveryId/location",
    },

    // Earnings
    EARNINGS: {
      SUMMARY: "/delivery/earnings",
      DETAILS: "/delivery/earnings/details",
      HISTORY: "/delivery/earnings/history",
      WITHDRAW: "/delivery/earnings/withdraw",
      STATEMENT: "/delivery/earnings/statement/:month",
    },

    // Delivery History
    HISTORY: {
      LIST: "/delivery/history",
      DETAILS: "/delivery/history/:deliveryId",
      STATS: "/delivery/history/stats",
    },

    // Customer Communication
    COMMUNICATION: {
      CALL: "/delivery/call/:customerId",
      MESSAGE: "/delivery/message/:customerId",
      REPORT: "/delivery/report/:deliveryId",
    },

    // Vehicle Management
    VEHICLE: {
      INFO: "/delivery/vehicle",
      UPDATE: "/delivery/vehicle/update",
      DOCUMENTS: "/delivery/vehicle/documents",
    },

    // Profile & Settings
    PROFILE: "/delivery/profile",
    DOCUMENTS: "/delivery/documents",
    SETTINGS: "/delivery/settings",
    NOTIFICATIONS: "/delivery/notifications",
    SUPPORT: "/delivery/support",
  },

  // ==================== SHARED ROUTES ====================
  // These routes are accessible by multiple roles based on permissions

  // Order tracking (Customer, Vendor, Delivery)
  ORDER: {
    DETAILS: "/order/:orderId",
    TRACK: "/track/:orderId",
    INVOICE: "/order/:orderId/invoice",
    RECEIPT: "/order/:orderId/receipt",
  },

  // Payment processing
  PAYMENT: {
    PROCESS: "/payment/process",
    SUCCESS: "/payment/success",
    FAILED: "/payment/failed",
    METHODS: "/payment/methods",
    HISTORY: "/payment/history",
  },

  // Notifications (all users)
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_DETAILS: "/notifications/:notificationId",

  // Chat/Messaging
  CHAT: {
    LIST: "/chat",
    ROOM: "/chat/:roomId",
    SUPPORT: "/chat/support",
  },

  // Support & Help
  SUPPORT: {
    CENTER: "/support",
    FAQ: "/faq",
    CONTACT: "/contact",
    REPORT: "/report",
  },

  // Legal & Terms
  LEGAL: {
    TERMS: "/terms",
    PRIVACY: "/privacy",
    COOKIES: "/cookies",
  },
} as const;

// Type for route parameters
export type RouteParams = {
  // Customer params
  restaurantId?: string;
  foodId?: string;
  categoryId?: string;
  addressId?: string;

  // Vendor params
  orderId?: string;
  reviewId?: string;
  offerId?: string;
  staffId?: string;
  period?: string;

  // Delivery params
  deliveryId?: string;
  customerId?: string;

  // Shared params
  token?: string;
  notificationId?: string;
  roomId?: string;
  month?: string;
};

// Helper function to build dynamic routes
export function buildRoute(route: string, params: RouteParams): string {
  let builtRoute = route;

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      builtRoute = builtRoute.replace(`:${key}`, String(value));
    }
  });

  return builtRoute;
}

// Usage examples:
// buildRoute(ROUTES.CUSTOMER.RESTAURANT.DETAILS, { restaurantId: "123" })
// Returns: "/restaurant/123"
//
// buildRoute(ROUTES.VENDOR.FOOD.EDIT, { foodId: "456" })
// Returns: "/vendor/food/456/edit"
