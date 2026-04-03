import React from "react";

type OrderItem = {
  name: string;
  quantity: number;
  img: string;
};

type Order = {
  id: number;
  restaurant: string;
  items?: OrderItem[];
  status: "Delivered" | "Canceled";
  date: string;
  price: string;
  rating?: number; // optional
};

export default function OrderCard({ order }: { order: Order }) {
  const totalItems = order.items
    ? order.items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <div className="border rounded-xl p-4 shadow-md w-full max-w-xs mx-auto mb-4 bg-white">
      {/* Order ID top-right */}
      <div className="flex justify-end text-xs text-gray-400 mb-2">
        Order #{order.id}
      </div>

      {/* Restaurant & Date */}
      <div className="mb-2">
        <h2 className="font-semibold">{order.restaurant}</h2>
        <p className="text-sm text-gray-500">{order.date}</p>
      </div>

      {/* Food items (if any) */}
      {order.items && (
        <div className="flex items-center gap-3 mb-2">
          {order.items.map((item) => (
            <img
              key={item.name}
              src={item.img}
              alt={item.name}
              className="w-12 h-12 rounded-md object-cover"
            />
          ))}
          <div className="text-sm">
            {order.items.map((item) => (
              <div key={item.name}>
                {item.quantity} pcs {item.name}
              </div>
            ))}
            <div className="text-gray-400 text-xs">Total: {totalItems} pcs</div>
          </div>
        </div>
      )}

      {/* Customer rating */}
      {order.rating !== undefined && (
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-yellow-400 mr-1 ${
                i < order.rating ? "fas" : "far"
              } fa-star`}
            />
          ))}
        </div>
      )}

      {/* Status & Price */}
      <div className="flex justify-between items-center mt-2">
        <p
          className={`font-semibold text-sm ${
            order.status === "Delivered" ? "text-green-500" : "text-red-500"
          }`}
        >
          {order.status}
        </p>
        <p className="font-semibold">{order.price}</p>
      </div>
    </div>
  );
}