import db from "./database.json";

export default db;

// ── Flat collections aligned with the new database.json structure ──────────────

export const users = db.users;
export const restaurants = db.restaurants;
export const orders = db.orders;
export const menuItems = db.menuItems;
export const orderItems = db.orderItems;
export const notifications = db.notifications ?? [];
export const payments = db.payments ?? [];

// ── Typed helpers ──────────────────────────────────────────────────────────────

export const getRestaurantById = (id: string) =>
  restaurants.find((r) => r.id === id) ?? null;

export const getUserById = (id: string) =>
  users.find((u) => u.id === id) ?? null;

export const getOrdersByStatus = (status: string) =>
  orders.filter((o) => o.status === status);

export const getOrderById = (id: string) =>
  orders.find((o) => o.id === id) ?? null;

export const getMenuItemsByRestaurant = (restaurantId: string) =>
  menuItems.filter((m) => m.restaurantId === restaurantId);

export const getOrderItemsByOrder = (orderId: string) =>
  orderItems.filter((i) => i.orderId === orderId);

// ── Mock API shim (replaced later with real axios calls) ───────────────────────

export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  login: async (email: string, _password: string) => {
    await delay();
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid credentials");
    return { user, token: "mock-jwt-token" };
  },

  getAvailableOrders: async () => {
    await delay();
    return getOrdersByStatus("AWAITING_ACCEPT");
  },

  getActiveOrders: async (delivererId: string) => {
    await delay();
    return orders.filter(
      (o) =>
        o.delivererId === delivererId &&
        ["ASSIGNED", "PICKED_UP", "EN_ROUTE", "ARRIVED"].includes(o.status),
    );
  },

  acceptOrder: async (orderId: string) => {
    await delay();
    const order = getOrderById(orderId);
    if (!order) throw new Error("Order not found");
    return { success: true, order };
  },

  updateDeliveryStatus: async (_deliveryId: string, _status: string) => {
    await delay();
    return { success: true };
  },

  updateLocation: async (_deliveryId: string, _location: unknown) => {
    await delay();
    return { success: true };
  },
};

// ── Currency constant (was db.currency in legacy code) ────────────────────────
export const CURRENCY = "ETB";
export const BASE_DELIVERY_FEE = 15;
export const MOCK_DISCOUNT = 0;
