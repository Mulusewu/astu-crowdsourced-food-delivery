import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<CartItem[]>(() => readCart());

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + it.priceBirr * it.qty, 0);
    const deliveryFee = items.length ? 25 : 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  }, [items]);

  const updateQty = (id: string, nextQty: number) => {
    setItems((prev) => {
      const next = prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, nextQty) } : it))
        .filter((it) => it.qty > 0);
      writeCart(next);
      return next;
    });
  };

  const clear = () => {
    writeCart([]);
    setItems([]);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24 flex justify-center">
      <div className="w-full max-w-[420px] bg-[#FAFAFA] min-h-screen relative shadow-sm font-sans flex flex-col">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 flex items-center relative bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F46424] hover:bg-orange-100 transition-colors shadow-sm active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Cart
          </h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="ml-auto text-xs font-extrabold text-[#F46424] bg-orange-50 px-3 py-2 rounded-xl active:scale-95"
            >
              Clear
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8">
          {items.length === 0 ? (
            <div className="mt-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F46424]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-extrabold text-gray-900">Your cart is empty</h2>
              <p className="mt-1 text-sm text-gray-400 font-semibold">Add items from restaurants to see them here.</p>
              <Link
                to="/"
                className="inline-flex mt-6 bg-[#F46424] text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-[0_8px_16px_rgba(244,100,36,0.25)] active:scale-95"
              >
                Browse restaurants
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/60 flex gap-3"
                >
                  <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 leading-tight">{it.name}</h3>
                        {it.restaurantName && (
                          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{it.restaurantName}</p>
                        )}
                      </div>
                      <p className="text-sm font-extrabold text-[#F46424] whitespace-nowrap">
                        {it.priceBirr * it.qty} Birr
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1">
                        <button
                          onClick={() => updateQty(it.id, it.qty - 1)}
                          className="w-9 h-9 rounded-xl bg-white border border-gray-100 text-gray-800 font-extrabold active:scale-95"
                        >
                          -
                        </button>
                        <span className="px-4 text-sm font-extrabold text-gray-900">{it.qty}</span>
                        <button
                          onClick={() => updateQty(it.id, it.qty + 1)}
                          className="w-9 h-9 rounded-xl bg-[#F46424] text-white font-extrabold shadow-[0_6px_12px_rgba(244,100,36,0.22)] active:scale-95"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateQty(it.id, 0)}
                        className="text-xs font-extrabold text-gray-400 hover:text-red-500 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/60">
                <div className="flex justify-between text-sm font-extrabold text-gray-900">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{totals.subtotal} Birr</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 mt-2">
                  <span className="text-gray-500">Delivery fee</span>
                  <span>{totals.deliveryFee} Birr</span>
                </div>
                <div className="h-px bg-orange-100/70 my-4" />
                <div className="flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#F46424]">{totals.total} Birr</span>
                </div>

                <Link
                  to="/checkout"
                  className="mt-5 w-full inline-flex items-center justify-center bg-[#F46424] text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-[0_10px_18px_rgba(244,100,36,0.25)] active:scale-95"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>

        <BottomNavBar bgColor="bg-[#FAFAFA]" />
      </div>
    </div>
  );
};

export default CartPage;