import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
  MinusCircle,
  PlusCircle,
  ShoppingCart
} from "lucide-react";
import { ROUTES } from "@/routes/routePaths";

import { useCartStore } from "@/store/cart/cartStore";
import { useAuthStore } from "@/store/auth/authStore";
import type { CartItem } from "@/store/cart/cartStore";


// ─── Main Cart Page Component ────────────────────────────────────────────────
export default function CartPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItemForMod, setSelectedItemForMod] = useState<CartItem | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateSpecialInstructions = useCartStore((state) => state.updateSpecialInstructions);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const total = useCartStore((state) => state.getTotal());
  const discount = useCartStore((state) => state.getDiscountAmount());

  useEffect(() => {
    if (user?.activeMode !== "CUSTOMER") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!selectedItemForMod) return;
    const refreshedItem = cartItems.find((item) => item.id === selectedItemForMod.id);
    if (!refreshedItem) {
      setSelectedItemForMod(null);
      setIsDetailModalOpen(false);
      return;
    }
    if (refreshedItem !== selectedItemForMod) {
      setSelectedItemForMod(refreshedItem);
    }
  }, [cartItems, selectedItemForMod]);

  if (user?.activeMode !== "CUSTOMER") return null;

  const handleOpenDetailModal = (itemId: string) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (item) {
      setSelectedItemForMod(item);
      setIsDetailModalOpen(true);
    }
  };

  const handleSaveInstructions = (foodId: string, instructions: string) => {
    updateSpecialInstructions(foodId, instructions);
  };

  const handleClearCartConfirmed = () => {
    clearCart();
    setIsClearConfirmOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-gray-950 font-sans antialiased text-black relative pb-56 w-full max-w-md mx-auto shadow-sm">

      {/* ── Header ── */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-white dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-[16px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform shadow-sm"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-black text-gray-900 dark:text-white">Your Cart</h1>
        <div className="w-11" /> {/* Spacer to center the title */}
      </header>

      {/* ── Cart Content ── */}
      {cartItems.length === 0 ? (
        <EmptyCartView />
      ) : (
        <>
          <main className="flex-1 space-y-4 px-5 pt-2">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                onCardClick={() => handleOpenDetailModal(item.id)}
              />
            ))}
          </main>

          {/* Floating Clear Cart Button - Bounded by a relative container trick */}
          <div className="fixed bottom-[240px] z-40 w-full max-w-md mx-auto pointer-events-none flex justify-end px-6">
            <button
              type="button"
              onClick={() => setIsClearConfirmOpen(true)}
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-gray-900 text-[#F26A1C] shadow-[0_8px_30px_rgba(242,106,28,0.15)] border border-orange-50 dark:border-gray-800 active:scale-95 transition-transform"
            >
              <Trash2 size={24} strokeWidth={2.5} />
            </button>
          </div>
        </>
      )}

      {/* ── Footer ── */}
      <CartFooter
        subtotal={subtotal}
        total={total}
        discount={discount}
        isCartEmpty={cartItems.length === 0}
        onPlaceOrder={() => navigate(ROUTES.CUSTOMER.CHECKOUT)}
      />

      {/* ── Modals ── */}
      <CartItemDetailModal
        item={selectedItemForMod}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleSaveInstructions}
      />

      <ClearCartConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearCartConfirmed}
      />
    </div>
  );
}

// ─── UI Sub-Components ───────────────────────────────────────────────────────

function CartItemCard({ item, onIncrement, onDecrement, onCardClick }: any) {
  return (
    <div
      onClick={onCardClick}
      className="bg-white dark:bg-gray-900 rounded-[28px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 flex items-center justify-between gap-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-4 w-full">
        <img src={item.image} alt={item.name} className="w-[60px] h-[60px] rounded-full object-cover shadow-sm shrink-0 bg-gray-100" />

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight mb-2 truncate pr-2">
            {item.name}
          </h3>

          <div className="flex items-center justify-between w-full">
            {/* Quantity Controls Pill */}
            <div className="flex items-center gap-3 bg-gray-50/80 dark:bg-gray-800 rounded-full px-2.5 py-1.5 w-max">
              <button onClick={(e) => { e.stopPropagation(); onDecrement(); }} className="text-gray-300 hover:text-gray-400 dark:text-gray-500 active:scale-90 transition-transform">
                <MinusCircle size={20} strokeWidth={2.5} />
              </button>
              <span className="font-black text-[14px] text-gray-900 dark:text-white w-4 text-center">{item.quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); onIncrement(); }} className="text-[#F26A1C] active:scale-90 transition-transform">
                <PlusCircle size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Price */}
            <div className="font-black text-[#F26A1C] text-[15px] shrink-0 whitespace-nowrap">
              {item.price.toFixed(0)} Birr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCartView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 animate-in fade-in pb-32">
      <ShoppingCart size={140} className="text-gray-400 dark:text-gray-700 mb-8 drop-shadow-sm" strokeWidth={1} fill="currentColor" />
      <h2 className="text-[22px] font-black text-gray-600 dark:text-gray-300 mb-2">Your Cart Is Empty</h2>
      <p className="text-[14px] font-bold text-gray-400">Browse Menus And Order</p>
    </div>
  );
}

function CartFooter({ subtotal, total, discount, isCartEmpty, onPlaceOrder }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-100/90 dark:bg-gray-900/95 backdrop-blur-md rounded-t-[40px] px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] w-full max-w-md mx-auto">
      <div className="flex justify-between items-center text-[15px] font-bold text-gray-700 dark:text-gray-300 mb-3 px-2">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(0)} Birr</span>
      </div>
      <div className="flex justify-between items-center text-[15px] font-bold text-gray-700 dark:text-gray-300 mb-5 px-2">
        <span>Discount</span>
        <span>{discount.toFixed(0)} Birr</span>
      </div>
      <div className="flex justify-between items-center text-[18px] font-black text-gray-900 dark:text-white mb-8 px-2">
        <span>Total</span>
        <span>{total.toFixed(0)} Birr</span>
      </div>

      <button
        disabled={isCartEmpty}
        onClick={onPlaceOrder}
        className="w-full py-4 bg-[#F26A1C] text-white font-black rounded-full text-[17px] tracking-wide shadow-[0_8px_24px_rgba(242,106,28,0.3)] active:scale-[0.98] transition-transform disabled:bg-gray-500 dark:disabled:bg-gray-700 disabled:shadow-none"
      >
        Place Order
      </button>
    </div>
  );
}

// ─── Modals (Bounded by Mobile Screen) ───────────────────────────────────────

function CartItemDetailModal({ item, isOpen, onClose, onSave }: any) {
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (item) setInstructions(item.specialInstructions || "");
  }, [item]);

  if (!isOpen || !item) return null;

  return (
    // Fixed inset 0, but forced to max-w-md mx-auto so it perfectly matches the mobile app container width
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 w-full max-w-md mx-auto">
      {/* Absolute backdrop inside the constrained container */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={onClose} />

      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-8 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl">
        <h3 className="text-[19px] font-black text-gray-900 dark:text-white mb-6 text-center">
          Cart Item Detail
        </h3>

        <div className="flex items-center gap-4 mb-8">
          <img src={item.image} alt={item.name} className="w-[52px] h-[52px] rounded-full object-cover shadow-sm bg-gray-100" />
          <div className="flex flex-col">
            <h4 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight mb-1">{item.name}</h4>
            <p className="font-black text-[15px] text-[#F26A1C] uppercase">{item.quantity}X</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[12px] font-bold text-gray-400 mb-2 px-1">Order Modification (If Any)</p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full h-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[20px] p-4 text-[14px] font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] resize-none shadow-sm"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 border-[2px] border-[#F26A1C] bg-white dark:bg-gray-900 text-[#F26A1C] font-black tracking-wide rounded-full text-[14px] active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(item.id, instructions); onClose(); }}
            className="flex-1 py-3.5 bg-[#F26A1C] text-white font-black tracking-wide rounded-full text-[14px] shadow-[0_6px_20px_rgba(242,106,28,0.25)] active:scale-95 transition-transform"
          >
            Edit Order
          </button>
        </div>
      </div>
    </div>
  );
}

function ClearCartConfirmModal({ isOpen, onClose, onConfirm }: any) {
  if (!isOpen) return null;

  return (
    // Fixed inset 0, but forced to max-w-md mx-auto so it perfectly matches the mobile app container width
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 w-full max-w-md mx-auto">
      {/* Absolute backdrop inside the constrained container */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={onClose} />

      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-8 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 text-center shadow-2xl">
        <h3 className="text-[19px] font-black text-gray-900 dark:text-white mb-2 leading-tight px-2">
          Are You Sure You Want To Clear Your Cart?
        </h3>
        <p className="text-[13px] font-bold text-gray-400 mb-8">
          All Cart Items Will Be Removed
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 border-[2px] border-[#F26A1C] bg-white dark:bg-gray-900 text-[#F26A1C] font-black tracking-wide rounded-full text-[14px] active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 bg-[#F26A1C] text-white font-black tracking-wide rounded-full text-[14px] shadow-[0_6px_20px_rgba(242,106,28,0.25)] active:scale-95 transition-transform"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}