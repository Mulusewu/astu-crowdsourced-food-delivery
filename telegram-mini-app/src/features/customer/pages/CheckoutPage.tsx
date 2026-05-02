import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  CreditCard,
  Loader2,
  ShoppingBag,
  Bike,
  ReceiptText,
  StickyNote,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/authStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useCustomerStore } from "@/store/customer/customerStore";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { TMAStatusBar } from "../components/layout/TMAStatusBar";

// ─── Fee constants aligned with Prisma schema ────────────────────────────────
const SERVICE_FEE_RATE = 0.02; // 2% platform service fee
const TRANSACTION_FEE = 5; // Fixed transaction processing fee (ETB)

export default function CartCheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore((s) => s.getSubtotal());
  const cartDiscount = useCartStore((s) => s.getDiscountAmount());
  const cartDeliveryFee = useCartStore((s) => s.getDeliveryFee());
  const clearCart = useCartStore((s) => s.clearCart);

  const selectedAddress = useCustomerStore(
    (s) => s.getDefaultAddress?.() ?? s.addresses[0],
  );
  const selectedPaymentMethod = useCustomerStore(
    (s) => s.paymentMethods.find((pm) => pm.isDefault) ?? s.paymentMethods[0],
  );

  const { placeOrder, isLoading: orderLoading } = useCustomerOrderStore();

  const [noteToDriver, setNoteToDriver] = useState("");
  const [tip, setTip] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);

  // ─── Prisma-aligned fee calculation ────────────────────────────────────────
  const foodPrice = cartSubtotal - cartDiscount;
  const deliveryFee = cartDeliveryFee;
  const serviceFee = Math.round(foodPrice * SERVICE_FEE_RATE * 100) / 100;
  const transactionFee = TRANSACTION_FEE;
  const totalAmount = foodPrice + deliveryFee + serviceFee + transactionFee + tip;

  // Restaurant ID from cart
  const restaurantId = cartItems[0]?.restaurantId ?? "";

  const tipOptions = [0, 10, 20, 50];

  // Delivery address string
  const deliveryAddress = useMemo(() => {
    if (selectedAddress) {
      return [selectedAddress.street, selectedAddress.area, selectedAddress.city]
        .filter(Boolean)
        .join(", ");
    }
    return "ASTU Block 40, Adama";
  }, [selectedAddress]);

  // Role guard
  if (user?.role !== "CUSTOMER") {
    navigate(ROUTES.AUTH);
    return null;
  }

  if (cartItems.length === 0) {
    navigate(ROUTES.CUSTOMER.CART);
    return null;
  }

  const handlePlaceOrder = async () => {
    if (isPlacing) return;
    setIsPlacing(true);
    try {
      const order = await placeOrder({
        restaurantId,
        items: cartItems.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          name: item.name,
          imageUrl: item.image ?? null,
        })),
        foodPrice,
        deliveryFee,
        serviceFee,
        transactionFee,
        tip,
        totalAmount,
        deliveryAddress,
      });
      clearCart();
      navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.TRACK, { orderId: order.id }));
    } catch {
      // error is already set in store
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col antialiased">
      <TMAStatusBar />

      {/* ── Header ── */}
      <header className="relative flex items-center justify-center px-5 pt-4 pb-6 bg-[#FDFDFD] dark:bg-gray-950">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 w-10 h-10 bg-[#FFF4ED] dark:bg-gray-900 rounded-[12px] flex items-center justify-center border border-[#F26A1C]/20 text-[#F26A1C] active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-black text-gray-900 dark:text-white tracking-wide">
          Checkout
        </h1>
      </header>

      <div className="flex-1 px-5 pb-40 space-y-5 overflow-y-auto">

        {/* ── Section 1: Delivery Address ── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#F26A1C]">
              <MapPin size={16} strokeWidth={2.5} />
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
                Delivery Address
              </h3>
            </div>
            <button
              onClick={() => navigate(ROUTES.CUSTOMER.ADDRESSES)}
              className="text-xs font-bold text-[#F26A1C] active:opacity-70"
            >
              Change
            </button>
          </div>
          <button
            className="w-full flex items-center gap-4 text-left active:opacity-70 transition-opacity"
            onClick={() => navigate(ROUTES.CUSTOMER.ADDRESSES)}
          >
            <div className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-[#F26A1C] shrink-0">
              <MapPin size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {selectedAddress?.street || "ASTU Block 40, Adama"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {selectedAddress?.area || "Ground Floor, Room 12"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400 shrink-0" />
          </button>
        </div>

        {/* ── Section 2: Order Summary ── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#F26A1C]">
              <ShoppingBag size={16} strokeWidth={2.5} />
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
                Order Summary
              </h3>
            </div>
            <button
              onClick={() => navigate(ROUTES.CUSTOMER.CART)}
              className="text-xs font-bold text-[#F26A1C] active:opacity-70"
            >
              Edit Cart
            </button>
          </div>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <span className="font-black text-[#F26A1C] w-7">{item.quantity}x</span>
                <span className="flex-1 text-gray-800 dark:text-gray-200 truncate">{item.name}</span>
                <span className="font-bold text-gray-900 dark:text-white shrink-0">
                  {(item.price * item.quantity).toFixed(0)} ETB
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Payment Method ── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-4">
            <CreditCard size={16} strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
              Payment Method
            </h3>
          </div>
          <button
            className="w-full flex items-center gap-4 text-left active:opacity-70 transition-opacity"
            onClick={() => navigate(ROUTES.CUSTOMER.PAYMENT.METHODS)}
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <CreditCard size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                {selectedPaymentMethod?.brand
                  ? `${selectedPaymentMethod.brand.toUpperCase()} Card`
                  : selectedPaymentMethod?.type === "cash"
                    ? "Cash on Delivery"
                    : "Telebirr"}
              </p>
              <p className="text-xs text-gray-500">
                {selectedPaymentMethod?.last4
                  ? `**** ${selectedPaymentMethod.last4}`
                  : "+25191****753"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400 shrink-0" />
          </button>
        </div>

        {/* ── Section 4: Tip for Driver ── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-4">
            <Bike size={16} strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
              Tip for Driver
            </h3>
          </div>
          <div className="flex gap-2">
            {tipOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setTip(opt)}
                className={cn(
                  "flex-1 py-2.5 rounded-[14px] text-sm font-bold transition-all active:scale-95",
                  tip === opt
                    ? "bg-[#F26A1C] text-white shadow-md"
                    : "bg-[#FFF4ED] dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-700",
                )}
              >
                {opt === 0 ? "None" : `${opt} ETB`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 5: Note to Driver ── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-3">
            <StickyNote size={16} strokeWidth={2.5} />
            <label htmlFor="driverNote" className="text-[15px] font-bold text-gray-900 dark:text-white">
              Note to Driver{" "}
              <span className="text-gray-400 text-xs font-medium">(Optional)</span>
            </label>
          </div>
          <textarea
            id="driverNote"
            value={noteToDriver}
            onChange={(e) => setNoteToDriver(e.target.value)}
            rows={2}
            className="w-full bg-[#FFF4ED]/50 dark:bg-gray-800 border border-[#F26A1C]/20 rounded-xl p-3 text-sm focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] outline-none transition-all resize-none"
            placeholder="e.g., Please ring the bell when you arrive"
          />
        </div>

        {/* ── Section 6: Full Fee Breakdown (Prisma-aligned) ── */}
        <div className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 text-[#F26A1C] mb-4">
            <ReceiptText size={16} strokeWidth={2.5} />
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
              Price Breakdown
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Food Subtotal", value: foodPrice },
              { label: "Delivery Fee", value: deliveryFee },
              { label: `Service Fee (${(SERVICE_FEE_RATE * 100).toFixed(0)}%)`, value: serviceFee },
              { label: "Transaction Fee", value: transactionFee },
              ...(tip > 0 ? [{ label: "Driver Tip", value: tip }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {value.toFixed(2)} ETB
                </span>
              </div>
            ))}
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-black text-[#F26A1C]">
                {totalAmount.toFixed(2)} ETB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Button ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing || orderLoading}
          className="w-full bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[20px] font-bold text-[15px] py-4 shadow-[0_8px_20px_rgba(242,106,28,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPlacing || orderLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <ShoppingBag size={18} />
              Confirm Order · {totalAmount.toFixed(0)} ETB
            </>
          )}
        </button>
      </div>
    </div>
  );
}
