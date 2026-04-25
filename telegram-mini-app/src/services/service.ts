// /src/services/userService.ts
import data from "../data/database.json";
import type { Database } from "../types/database";

// Casting through unknown bypasses the "sufficient overlap" error
// while still giving you full type safety for 'db'
const db = data as unknown as Database;

export const getCustomers = () => db.users.customers;
export const getVendors = () => db.users.vendors;
export const getDeliveries = () => db.users.delivery;

export const getRestaurantDetails = (id: string) => {
  const restaurant = db.restaurants.find((r) => r.id === id);
  // Ensure we return an empty array if menu[id] is undefined
  const menu = db.menu && db.menu[id] ? db.menu[id] : [];
  return { ...restaurant, menu };
};

export const getCustomerOrders = (customerName: string) => {
  // Your JSON currently stores customer.name in orders, not ID
  return db.orders.active.filter(
    (order) => (order as any).customer.name === customerName,
  );
};
