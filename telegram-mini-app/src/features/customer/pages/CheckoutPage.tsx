import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../components/BottomNavBar";

type CartItem = {
  id: string;
  name: string;
  priceBirr: number;
  qty: number;
  image?: string;
  restaurantName?: string;
};

const CART_STORAGE_KEY = "astu_eats_cart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useMemo(() => readCart(), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + it.priceBirr * it.qty, 0);
    const deliveryFee = items.length ? 25 : 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  }, [items]);

  const [deliveryLocation, setDeliveryLocation] = useState("In-Campus");
  const [payment, setPayment] = useState("Telebirr");

  return (
    <div className="bg-gray-100 min-h-screen pb-24 flex justify-center">
      <div className="w-full max-w-[420px] bg-[#FAFAFA] min-h-screen relative shadow-sm font-sans flex flex-col">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 flex items-center relative bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F46424] hover:bg-orange-100 transition-colors shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Checkout
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 space-y-4">
          {/* Delivery */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/60">
            <h2 className="text-sm font-extrabold text-gray-900">Delivery</h2>
            <div className="mt-4">
              <label className="text-[11px] font-extrabold text-gray-400">Location</label>
              <div className="mt-2 relative">
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-extrabold text-gray-900 appearance-none"
                >
                  <option>In-Campus</option>
                  <option>Main Gate</option>
                  <option>Geda Gate</option>
                  <option>Bole Gate</option>
                  <option>Kereyu Gate</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/60">
            <h2 className="text-sm font-extrabold text-gray-900">Payment</h2>
            <div className="mt-4">
              <label className="text-[11px] font-extrabold text-gray-400">Method</label>
              <div className="mt-2 relative">
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-extrabold text-gray-900 appearance-none"
                >
                  <option>Telebirr</option>
                  <option>CBE</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/60">
            <h2 className="text-sm font-extrabold text-gray-900">Summary</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm font-extrabold text-gray-900">
                <span className="text-gray-500">Items</span>
                <span>{items.reduce((sum, it) => sum + it.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900">
                <span className="text-gray-500">Subtotal</span>
                <span>{totals.subtotal} Birr</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900">
                <span className="text-gray-500">Delivery fee</span>
                <span>{totals.deliveryFee} Birr</span>
              </div>
              <div className="h-px bg-orange-100/70 my-3" />
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-[#F46424]">{totals.total} Birr</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/history")}
              className="mt-5 w-full inline-flex items-center justify-center bg-[#F46424] text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-[0_10px_18px_rgba(244,100,36,0.25)] active:scale-95"
            >
              Place order
            </button>
            <p className="mt-3 text-[11px] text-gray-400 font-semibold text-center">
              Telegram mini app: this is a UI flow demo.
            </p>
          </div>
        </div>

        <BottomNavBar bgColor="bg-[#FAFAFA]" />
      </div>
    </div>
  );
};

export default CheckoutPage;
