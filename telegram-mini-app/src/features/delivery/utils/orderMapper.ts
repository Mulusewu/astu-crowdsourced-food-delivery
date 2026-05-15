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

const statusMap: Record<string, string> = {
  in_transit: "On Transit",
  pending: "Pending",
  accepted: "Accepted",
  picked_up: "Picked Up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const getActiveOrders = (): ActiveOrder[] => {
  return database.orders.active.map((order: any) => ({
    id: order.id,
    orderNo: order.orderNumber?.replace("ORD-", "") || order.id,
    date: order.createdAt,
    timeRemaining: order.estimatedDeliveryTime || "30:00",
    status: statusMap[order.status] || order.status,
    items: order.items.map((item: any) => ({
      name: item.name,
      quantity: `${item.quantity} Pcs`,
      price: item.total || item.price,
    })),
    phone: order.customer?.phone || "N/A",
    total: order.totalAmount,
  }));
};
