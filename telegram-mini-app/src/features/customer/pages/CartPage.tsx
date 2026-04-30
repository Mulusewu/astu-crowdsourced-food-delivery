import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { useCartStore } from "@/store/cart/cartStore";
import { useAuthStore } from "@/store/auth/authStore";
import type { CartItem } from "@/store/cart/cartStore";
import { TMAStatusBar } from "../components/layout/TMAStatusBar";
import { CartItemCard } from "../components/CartItemCard";
import { EmptyCartView } from "../components/EmptyCartView";
import { CartItemDetailModal } from "../components/CartItemDetailModal";
import { ClearCartConfirmModal } from "../components/ClearCartConfirmModal";
import { CartHeader } from "../components/CartHeader";
import { CartFooter } from "../components/CartFooter";

export default function CartPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItemForMod, setSelectedItemForMod] = useState<CartItem | null>(
    null,
  );
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateSpecialInstructions = useCartStore(
    (state) => state.updateSpecialInstructions,
  );
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
    if (!selectedItemForMod) {
      return;
    }

    const refreshedItem = cartItems.find(
      (item) => item.id === selectedItemForMod.id,
    );
    if (!refreshedItem) {
      setSelectedItemForMod(null);
      setIsDetailModalOpen(false);
      return;
    }

    if (refreshedItem !== selectedItemForMod) {
      setSelectedItemForMod(refreshedItem);
    }
  }, [cartItems, selectedItemForMod]);

  if (user?.activeMode !== "CUSTOMER") {
    return null;
  }

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
    <div className="flex h-full min-h-screen flex-col bg-white font-sans antialiased text-black TMA-mobile-container">
      <TMAStatusBar />
      <CartHeader onBackClick={() => navigate(-1)} />

      {cartItems.length === 0 ? (
        <EmptyCartView />
      ) : (
        <>
          <main className="flex-1 space-y-4 overflow-y-auto px-5 pb-8 pt-3">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                currency={"ETB"}
                onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                onCardClick={() => handleOpenDetailModal(item.id)}
              />
            ))}
          </main>

          <button
            type="button"
            onClick={() => setIsClearConfirmOpen(true)}
            className="fixed bottom-[130px] right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-[#F26A1C] shadow-lg ring-1 ring-gray-100 select-none"
            aria-label="Clear entire cart"
          >
            <Trash2 size={24} strokeWidth={2.5} />
          </button>
        </>
      )}

      <CartFooter
        subtotal={subtotal}
        total={total}
        discount={discount}
        currency={"ETB"}
        isCartEmpty={cartItems.length === 0}
        onPlaceOrder={() => navigate("/customer/checkout")}
      />

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
