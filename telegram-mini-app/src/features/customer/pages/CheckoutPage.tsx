import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  CreditCard,
  TicketPercent,
} from "lucide-react";

import { cn } from "@/lib/utils";
import db from "@/data/database.json";
import { useAuthStore } from "@/store/auth/authStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useCustomerStore } from "@/store/customer/customerStore"; // Assuming this handles addresses/saved payments

// Reusing shared components we built earlier
import { ActionButton } from "@/features/shared/components/ProfileShared";
import { TMAStatusBar } from "../components/layout/TMAStatusBar"; // Assuming this exists for TMA header

export default function CartCheckoutPage() {
  const navigate = useNavigate();

  // 1. Context & Stores
  const { user } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartSubtotal = useCartStore((state) => state.getSubtotal());

  // Assuming these exist in a customer store to manage selections
  // Use selectors for default address and payment method
  const selectedAddress = useCustomerStore(
    (state) => state.getDefaultAddress?.() ?? state.addresses[0],
  );
  const selectedPaymentMethod = useCustomerStore(
    (state) =>
      state.paymentMethods.find((pm) => pm.isDefault) ??
      state.paymentMethods[0],
  );

  // 2. Local State for UI interactions
  const [noteToDriver, setNoteToDriver] = useState("");

  // 3. Logic & Calculations (Consistent with Adama context)
  const deliveryFee = db.baseDeliveryFee; // In Adama, maybe a flat fee based on distance logic
  const discount = db.mockDiscount; // Assuming a voucher is applied
  const total = cartSubtotal + deliveryFee - discount;
  const finalTotal = total > 0 ? total : 0;

  // 4. Role Guard (Safety)
  if (user?.activeRole !== "customer") {
    navigate("/auth");
    return null;
  }

  // Fallbacks if cart is somehow empty on checkout
  if (cartItems.length === 0) {
    navigate("/customer/cart");
    return null;
  }

  // --- Header Component (Consistent styled back button) ---
  const CheckoutHeader = () => (
    <header className="relative flex items-center justify-center pt-4 pb-6 bg-white dark:bg-gray-950">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-0 w-10 h-10 bg-[#FFF4ED] dark:bg-gray-900 rounded-[12px] flex items-center justify-center border border-[#F26A1C]/30 text-[#F26A1C] active:scale-95 transition-transform"
        aria-label="Go back to cart"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </button>
      <h1 className="text-[18px] font-black text-gray-900 dark:text-white tracking-wide">
        Checkout
      </h1>
    </header>
  );

  // --- Section Card Wrapper (Consistent with Profile designs) ---
  const SectionCard = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800 p-5 mb-5",
        className,
      )}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 px-5 pb-32 font-sans flex flex-col relative antialiased">
      <TMAStatusBar />
      <CheckoutHeader />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-2">
        {/* ── Section 1: Delivery Address ── */}
        <SectionCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
              Delivery Address
            </h3>
            {/* Added for consistency with Figma patterns */}
            <span className="text-xs font-bold text-[#F26A1C] cursor-pointer active:opacity-70">
              Edit Address
            </span>
          </div>
          <button
            className="w-full flex items-center gap-4 text-left active:opacity-70 transition-opacity"
            onClick={() => navigate("/customer/profile/address")}
          >
            <div className="w-10 h-10 bg-orange-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-[#F26A1C]">
              <MapPin size={20} />
            </div>
            <div className="flex-1 min-w-0">
              {/* Adama context address */}
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {selectedAddress?.street || "ASTU Block 40, Adama"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {/* Show area/building/floor as details fallback */}
                {selectedAddress?.area ||
                  selectedAddress?.building ||
                  selectedAddress?.floor ||
                  "Ground Floor, Room 12"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400 shrink-0" />
          </button>
        </SectionCard>

        {/* ── Section 2: Order Summary Mini-View ── */}
        <SectionCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
              Order Summary
            </h3>
            <span
              className="text-xs font-bold text-[#F26A1C] cursor-pointer active:opacity-70"
              onClick={() => navigate("/customer/cart")}
            >
              Edit Cart
            </span>
          </div>

          <div className="space-y-3">
            {/* Show up to 2 items, then collapse the rest to keep page clean */}
            {cartItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <p className="font-black text-[#F26A1C] w-6">
                  {item.quantity}x
                </p>
                <p className="flex-1 text-gray-800 dark:text-gray-200 truncate">
                  {item.name}
                </p>
                <p className="font-bold text-gray-900 dark:text-white shrink-0">
                  {item.price * item.quantity} {db.currency}
                </p>
              </div>
            ))}

            {cartItems.length > 2 && (
              <p className="text-xs font-semibold text-gray-500 text-center pt-2">
                + {cartItems.length - 2} more items
              </p>
            )}
          </div>
        </SectionCard>

        {/* ── Section 3: Payment Method ── */}
        <SectionCard>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">
            Payment Method
          </h3>
          <button
            className="w-full flex items-center gap-4 text-left active:opacity-70 transition-opacity"
            onClick={() => navigate("/profile/payment")} // Shared page
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-600">
              <CreditCard size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                {/* Show type/brand as payment method name */}
                {selectedPaymentMethod?.brand
                  ? `${selectedPaymentMethod.brand.toUpperCase()} Card`
                  : selectedPaymentMethod?.type === "cash"
                    ? "Cash"
                    : selectedPaymentMethod?.type === "telegram_stars"
                      ? "Telegram Stars"
                      : "Telebirr"}
              </p>
              <p className="text-xs text-gray-500">
                {/* Show last4, balance, or fallback */}
                {selectedPaymentMethod?.last4
                  ? `**** ${selectedPaymentMethod.last4}`
                  : selectedPaymentMethod?.balance
                    ? `Balance: ${selectedPaymentMethod.balance}`
                    : "+25191****753"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400 shrink-0" />
          </button>
        </SectionCard>

        {/* ── Section 4: Note to Driver (Optional) ── */}
        <SectionCard>
          <label
            htmlFor="driverNote"
            className="text-[15px] font-bold text-gray-900 dark:text-white mb-2 block"
          >
            Note to Driver{" "}
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            id="driverNote"
            value={noteToDriver}
            onChange={(e) => setNoteToDriver(e.target.value)}
            rows={2}
            className="w-full bg-[#FFF4ED]/50 dark:bg-gray-800 border border-[#F26A1C]/20 rounded-xl p-3 text-sm focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] outline-none transition-all resize-none"
            placeholder="e.g., Please ring the bell when you arrive"
          />
        </SectionCard>

        {/* ── Section 5: Price Breakdown ── */}
        <div className="px-1 space-y-3 mb-8">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-white">
              {cartSubtotal} {db.currency}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Fee (Adama)
            </span>
            <span className="text-gray-900 dark:text-white">
              {deliveryFee} {db.currency}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-green-600">
            <div className="flex items-center gap-1.5">
              <TicketPercent size={14} />
              <span>Discount applied</span>
            </div>
            <span>
              - {discount} {db.currency}
            </span>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-2" />

          <div className="flex justify-between items-center pt-1">
            <span className="text-[16px] font-bold text-gray-900 dark:text-white">
              Total
            </span>
            <span className="text-[20px] font-black text-[#F26A1C]">
              {finalTotal} {db.currency}
            </span>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Button Container (image_3.png pattern) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] z-40">
        <ActionButton
          onClick={() => navigate("/customer/orders/tracking/ord_004")}
        >
          Confirm Order
        </ActionButton>
      </div>
    </div>
  );
}
