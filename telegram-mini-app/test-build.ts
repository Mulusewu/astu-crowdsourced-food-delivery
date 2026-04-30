import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./src/data/database.json', 'utf8'));

const buildOrderView = (raw: any): any => {
  const restaurant = db.restaurants.find((r: any) => r.id === raw.restaurantId);
  const customerUser = db.users.find((u: any) => u.id === raw.customerId);
  const customerProfile = db.customerProfiles.find(
    (cp: any) => cp.userId === raw.customerId,
  );
  const rawItems = db.orderItems.filter((oi: any) => oi.orderId === raw.id);

  const items = rawItems.map((oi: any) => {
    const mi = db.menuItems.find((m: any) => m.id === oi.menuId);
    return {
      id: oi.id,
      menuId: oi.menuId,
      name: mi?.name ?? "Unknown Item",
      unitPrice: oi.unitPrice,
      quantity: oi.quantity,
      imageUrl: mi?.imageUrl ?? null,
    };
  });

  return {
    id: raw.id,
    shortId: raw.shortId,
    status: raw.status,
    paymentStatus: raw.paymentStatus,
    restaurant: {
      id: restaurant?.id ?? raw.restaurantId,
      name: restaurant?.name ?? "Unknown Restaurant",
      imageUrl: restaurant?.imageUrl ?? null,
      location: restaurant?.location ?? "",
      lat: restaurant?.lat ?? 0,
      lng: restaurant?.lng ?? 0,
      phone: restaurant?.phone ?? "",
    },
    customer: {
      id: customerUser?.id ?? raw.customerId,
      fullName: customerUser?.fullName ?? "Customer",
      phoneNumber: customerUser?.phoneNumber ?? null,
      avatarUrl: customerUser?.avatarUrl ?? null,
      deliveryAddress: customerProfile?.defaultLocation ?? null,
    },
    delivererId: raw.delivererId ?? null,
    items,
    foodPrice: raw.foodPrice,
    deliveryFee: raw.deliveryFee,
    transactionFee: raw.transactionFee,
    serviceFee: raw.serviceFee,
    tip: raw.tip,
    totalAmount: raw.totalAmount,
    pickupLat: raw.pickupLat ?? null,
    pickupLng: raw.pickupLng ?? null,
    estimatedDeliveryTime: raw.estimatedDeliveryTime ?? null,
    estimatedReadyAt: raw.estimatedReadyAt ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    otpCode: raw.otpCode,
    otpVerifiedAt: raw.otpVerifiedAt ?? null,
    isBookmarked: false,
    distance: null,
  };
};

try {
  const available = db.orders.filter((o: any) => o.status === "AWAITING_ACCEPT");
  const views = available.map(buildOrderView);
  console.log("Successfully built views. Count:", views.length);
} catch (e) {
  console.error("Error building views:", e);
}
