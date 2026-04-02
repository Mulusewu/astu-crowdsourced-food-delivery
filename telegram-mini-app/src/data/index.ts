import db from "./database.json";

export default db;

// Export individual data sections
export const users = db.users;
export const customers = db.users.customers;
export const vendors = db.users.vendors;
export const deliveryPersons = db.users.delivery;
export const restaurants = db.restaurants;
export const menu = db.menu;
export const orders = db.orders;
export const earnings = db.earnings;
export const notifications = db.notifications;
export const payments = db.payments;

// Helper functions for common data operations
export const getAvailableOrders = () => orders.available;
export const getActiveOrders = () => orders.active;
export const getOrderHistory = () => orders.history;

export const getRestaurantById = (id: string) =>
  restaurants.find((r) => r.id === id);

export const getMenuByRestaurantId = (id: string) =>
  menu[id as keyof typeof menu] || [];

export const getDeliveryPersonById = (id: string) =>
  deliveryPersons.find((d) => d.id === id);

export const getCustomerById = (id: string) =>
  customers.find((c) => c.id === id);

export const getEarningsByDeliveryId = (id: string) =>
  earnings[id as keyof typeof earnings];

// Simulate API delay
export const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions (to be replaced with real API calls)
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay();
    const user = [...customers, ...vendors, ...deliveryPersons].find(
      (u) => u.email === email,
    );
    if (!user) throw new Error("Invalid credentials");
    return { user, token: "mock-jwt-token" };
  },

  // Orders
  getAvailableOrders: async () => {
    await delay();
    return orders.available;
  },

  getActiveOrders: async () => {
    await delay();
    return orders.active;
  },

  acceptOrder: async (orderId: string) => {
    await delay();
    const order = orders.available.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    return { success: true, order };
  },

  // Delivery
  updateDeliveryStatus: async (deliveryId: string, status: string) => {
    await delay();
    return { success: true };
  },

  updateLocation: async (deliveryId: string, location: any) => {
    await delay();
    return { success: true };
  },
};
