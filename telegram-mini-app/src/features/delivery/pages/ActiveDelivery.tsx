import React from "react";
import { Truck, Phone } from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";

// Types
interface OrderItemProps {
  name: string;
  qty: number;
  price: number;
}

const OrderItem: React.FC<OrderItemProps> = ({ name, qty, price }) => (
  <div className="flex justify-between py-2 text-sm">
    <span className="text-gray-800">{name}</span>
    <span className="text-gray-600">{qty} Pcs</span>
    <span className="text-gray-800">{price} Birr</span>
  </div>
);

const ActiveOrderCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      {/* Date & Timer */}
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-orange-500 font-medium">03 June 2026</span>
        <span className="text-green-500 font-semibold">30:00</span>
      </div>

      <hr className="my-2" />

      {/* Order Info */}
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-orange-500 font-semibold">Order #123</span>
        <div className="flex items-center gap-2 text-gray-600">
          <Truck size={16} />
          <span>On Transit</span>
        </div>
      </div>

      <hr className="my-2" />

      {/* Items */}
      <OrderItem name="Beyayenet"    qty={1} price={100} />
      <OrderItem name="pasta Besego" qty={1} price={90} />
      <OrderItem name="Pasta Besego" qty={1} price={110} />

      <hr className="my-2" />

      {/* Contact & Total */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2 text-orange-500 text-sm">
          <Phone size={16} />
          <span>0934768909</span>
        </div>
        <span className="font-semibold text-gray-800">
          Total 300 Birr
        </span>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-full text-sm font-medium">
          Report Issue
        </button>
      </div>
    </div>
  );
};

export default function ActiveDelivery(): React.ReactElement {
  return (
    <div className="min-h-screen w-full pb-24">
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Active Orders
        </h1>

        <ActiveOrderCard />
      </div>

      {/* Bottom Navigation (Fixed) */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center">
        <div className="w-full max-w-md">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}


