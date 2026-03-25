import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNavBar from "../components/BottomNavBar";
import localDb from "@/lib/localDb.json";

type MenuItem = {
  id: string;
  name: string;
  priceBirr: number;
  image: string;
  desc?: string;
};

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

const RestaurantPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const restaurant = useMemo(() => {
    const list = (localDb as any).restaurants as Array<any>;
    return list?.find((r) => r.id === id) ?? null;
  }, [id]);

  const menu: MenuItem[] = useMemo(() => {
    const seedImg =
      restaurant?.image ??
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop";
    return [
      {
        id: "m-1",
        name: "Special Combo",
        priceBirr: 280,
        image: seedImg,
        desc: "Enough for 2 people",
      },
      {
        id: "m-2",
        name: "Burger + Fries",
        priceBirr: 240,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&auto=format&fit=crop",
        desc: "Crispy fries + sauce",
      },
      {
        id: "m-3",
        name: "Pasta",
        priceBirr: 210,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80&auto=format&fit=crop",
        desc: "Creamy & spicy",
      },
    ];
  }, [restaurant?.image]);

  const addToCart = (item: MenuItem) => {
    const current = readCart();
    const key = `${restaurant?.id ?? "rest"}:${item.id}`;
    const existing = current.find((c) => c.id === key);
    const next: CartItem[] = existing
      ? current.map((c) => (c.id === key ? { ...c, qty: c.qty + 1 } : c))
      : [
          ...current,
          {
            id: key,
            name: item.name,
            priceBirr: item.priceBirr,
            qty: 1,
            image: item.image,
            restaurantName: restaurant?.name ?? "Restaurant",
          },
        ];
    writeCart(next);
  };

  if (!restaurant) {
    return (
      <div className="bg-gray-100 min-h-screen pb-24 flex justify-center">
        <div className="w-full max-w-[420px] bg-[#FAFAFA] min-h-screen relative shadow-sm font-sans flex flex-col">
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
              Restaurant
            </h1>
          </div>
          <div className="flex-1 px-4 pt-10 text-center">
            <p className="text-gray-400 font-semibold">Restaurant not found.</p>
          </div>
          <BottomNavBar bgColor="bg-[#FAFAFA]" />
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-extrabold text-gray-900 absolute left-1/2 -translate-x-1/2 truncate max-w-[220px]">
            {restaurant.name}
          </h1>
          <button
            onClick={() => navigate("/cart")}
            className="ml-auto w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F46424] hover:bg-orange-100 transition-colors shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-10">
          {/* Hero */}
          <div className="relative rounded-3xl overflow-hidden h-[180px] bg-gray-900 border border-gray-100 shadow-sm">
            <img src={restaurant.image} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center bg-white/95 text-gray-900 text-xs font-extrabold px-3 py-1 rounded-full">
                  <span className="text-[#F46424] mr-1">★</span> {restaurant.rating}
                </span>
                <span className="inline-flex items-center bg-white/95 text-gray-900 text-xs font-extrabold px-3 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {restaurant.location}
                </span>
                {restaurant.deliveryTime && (
                  <span className="inline-flex items-center bg-white/95 text-gray-900 text-xs font-extrabold px-3 py-1 rounded-full">
                    {restaurant.deliveryTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-gray-900">Menu</h2>
              <span className="text-xs font-extrabold text-gray-400">{menu.length} items</span>
            </div>

            <div className="space-y-4">
              {menu.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100/60 flex gap-3"
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-[76px] h-[76px] rounded-2xl object-cover border border-gray-100 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 leading-tight">{m.name}</h3>
                        {m.desc && <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{m.desc}</p>}
                      </div>
                      <p className="text-sm font-extrabold text-[#F46424] whitespace-nowrap">{m.priceBirr} Birr</p>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => addToCart(m)}
                        className="bg-[#F46424] text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-[0_10px_18px_rgba(244,100,36,0.22)] active:scale-95"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomNavBar bgColor="bg-[#FAFAFA]" />
      </div>
    </div>
  );
};

export default RestaurantPage;
