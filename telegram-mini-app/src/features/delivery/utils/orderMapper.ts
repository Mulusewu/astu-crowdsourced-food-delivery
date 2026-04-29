import database from "@/data/database.json";

export interface ActiveOrder {
  id: string;
  orderNo: string;
  date: string;
  timeRemaining: string;
  status: string;
  items: {
    name: string;
    quantity: string;
    price: number;
  }[];
  phone: string;
  total: number;
}

const ACTIVE_STATUSES = new Set(["ASSIGNED", "PICKED_UP", "EN_ROUTE", "ARRIVED"]);

const statusMap: Record<string, string> = {
  ASSIGNED: "Accepted",
  PICKED_UP: "Picked Up",
  EN_ROUTE: "On Transit",
  ARRIVED: "Arrived",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const menuItemMap = new Map(database.menuItems.map((m) => [m.id, m]));

export const getActiveOrders = (): ActiveOrder[] => {
  const activeOrders = database.orders.filter((o) => ACTIVE_STATUSES.has(o.status));

  return activeOrders.map((order) => {
    const customer = database.users.find((u) => u.id === order.customerId);
    const orderItems = database.orderItems.filter((i) => i.orderId === order.id);

    return {
      id: order.id,
      orderNo: order.shortId,
      date: order.createdAt,
      timeRemaining: order.estimatedDeliveryTime ?? "30:00",
      status: statusMap[order.status] ?? order.status,
      items: orderItems.map((i) => ({
        name: menuItemMap.get(i.menuId)?.name ?? "Item",
        quantity: `${i.quantity} Pcs`,
        price: Number(i.unitPrice) * i.quantity,
      })),
      phone: customer?.phoneNumber ?? "N/A",
      total: Number(order.totalAmount),
    };
  });
};
