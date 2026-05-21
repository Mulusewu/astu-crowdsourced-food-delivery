import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./src/data/database.json', 'utf8'));

const buildCustomerOrder = (rawOrder: any): any => {
  const restaurant = db.restaurants.find((r: any) => r.id === rawOrder.restaurantId);
  const orderItems = db.orderItems
    .filter((oi: any) => oi.orderId === rawOrder.id)
    .map((oi: any) => {
      const menuItem = db.menuItems.find((m: any) => m.id === oi.menuId);
      return {
        id: oi.id,
        menuId: oi.menuId,
        name: menuItem?.name ?? "Item",
        quantity: oi.quantity,
        unitPrice: Number(oi.unitPrice),
        imageUrl: menuItem?.imageUrl ?? null,
      };
    });

  const statusHistory = (db.orderStatusHistories ?? [])
    .filter((h: any) => h.orderId === rawOrder.id)
    .map((h: any) => ({
      oldStatus: h.oldStatus ?? null,
      newStatus: h.newStatus,
      createdAt: h.createdAt,
    }))
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let deliverer: any = null;
  if (rawOrder.delivererId) {
    const delivererProfile = (db.delivererProfiles as any[]).find(
      (dp: any) => dp.userId === rawOrder.delivererId,
    );
    const delivererUser = delivererProfile
      ? db.users.find((u: any) => u.id === delivererProfile.userId)
      : null;
    if (delivererUser) {
      deliverer = {
        name: delivererUser.fullName,
        phone: delivererUser.phoneNumber ?? "",
        avatarUrl: delivererUser.avatarUrl ?? null,
        rating: Number(delivererProfile?.rating ?? 4.5),
      };
    }
  }

  return {
    id: rawOrder.id,
  };
};

try {
  const abebeOrders = db.orders.filter((o: any) => o.customerId === "550e8400-e29b-41d4-a716-446655440000");
  abebeOrders.map(buildCustomerOrder);
  console.log("Successfully built customer orders. Count:", abebeOrders.length);
} catch (e) {
  console.error("Error building customer orders:", e);
}
