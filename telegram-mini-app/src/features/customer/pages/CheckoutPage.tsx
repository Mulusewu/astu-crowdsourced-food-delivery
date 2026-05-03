import { useState, useMemo, useEffect } from "react";
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
  CheckCircle2,
  Lock
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/authStore";
import { useCartStore } from "@/store/cart/cartStore";
import { useCustomerStore } from "@/store/customer/customerStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useCustomerOrderStore } from "@/store/orders/customerOrderStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { TMAStatusBar } from "../components/layout/TMAStatusBar";

// --- Shadcn UI Components ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Fee constants aligned with Prisma schema
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
  
  const paymentMethods = usePaymentStore((s) => s.paymentMethods);
  const selectedPaymentMethod = paymentMethods.find((pm) => pm.isSelected);

  const { placeOrder, simulatePayment, isLoading: orderLoading } = useCustomerOrderStore();

  const [noteToDriver, setNoteToDriver] = useState("");
  const [tip] = useState(0); // Removed setTip since tipOptions was removed to fix TS error
  const [isPlacing, setIsPlacing] = useState(false);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);

  // Fee calculation
  const foodPrice = cartSubtotal - cartDiscount;
  const deliveryFee = cartDeliveryFee;
  const serviceFee = Math.round(foodPrice * SERVICE_FEE_RATE * 100) / 100;
  const transactionFee = TRANSACTION_FEE;
  const totalAmount = foodPrice + deliveryFee + serviceFee + transactionFee + tip;

  // Restaurant ID from cart
  const restaurantId = cartItems[0]?.restaurantId ?? "";

  const deliveryAddress = useMemo(() => {
    if (selectedAddress) {
      return [selectedAddress.street, selectedAddress.area, selectedAddress.city]
        .filter(Boolean)
        .join(", ");
    }
    return "ASTU Block 40, Adama";
  }, [selectedAddress]);

  // --- Navigation Guards ---
  useEffect(() => {
    // Deliverers and Admins are allowed to be in Customer mode
    const isAuthorized = user && (user.role === "CUSTOMER" || user.role === "DELIVERER" || user.role === "ADMIN");
    
    if (!isAuthorized) {
      navigate(ROUTES.AUTH);
    } else if (cartItems.length === 0 && !isWaitingPayment && !isPaymentReceived) {
      navigate(ROUTES.CUSTOMER.CART);
    }
  }, [user, cartItems.length, navigate, isWaitingPayment, isPaymentReceived]);

  // Handle place order with payment simulation
  const handlePlaceOrder = async () => {
    if (isPlacing || !selectedPaymentMethod) return;
    setIsPlacing(true);
    
    try {
      const order = await placeOrder({
        restaurantId,
        items: cartItems.map(item => ({
          menuId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          name: item.name,
          imageUrl: item.image || null // Fixed TS nullability issue
        })),
        foodPrice,
        deliveryFee,
        serviceFee,
        transactionFee,
        tip,
        totalAmount,
        deliveryAddress,
        paymentProvider: selectedPaymentMethod.id === "chapa" ? "chapa" : "cash"
      });

      setIsWaitingPayment(true);
      
      // Simulate real-time socket-like update for payment received
      await simulatePayment(order.id);
      
      setIsWaitingPayment(false);
      setIsPaymentReceived(true);
      
      // Clear cart ONLY after payment success as per requirement
      clearCart();
      
      // Navigate to tracking after success delay
      setTimeout(() => {
        navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.TRACK, { orderId: order.id }));
      }, 2000);
      
    } catch (e) {
      console.error("Order failed", e);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-gray-950 font-sans antialiased text-black relative pb-40">
      <TMAStatusBar />
      
      {/* --- Header --- */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-900 dark:text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-gray-900 dark:text-white">Checkout</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 space-y-6 px-5 pt-4">
        {/* --- Delivery Address Section --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center text-[#F26A1C]">
                <MapPin size={18} />
              </div>
              <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Delivery Location</h2>
            </div>
            <button 
              onClick={() => navigate(ROUTES.CUSTOMER.ADDRESSES)}
              className="text-xs font-bold text-[#F26A1C]"
            >
              Change
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                {selectedAddress?.street || "ASTU Campus"}
              </p>
              <p className="text-xs font-medium text-gray-400">
                {selectedAddress?.area ? `${selectedAddress.area}, ${selectedAddress.city}` : "Adama, Ethiopia"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </section>

        {/* --- Payment Method Section --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                <CreditCard size={18} />
              </div>
              <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Payment Method</h2>
            </div>
            <button 
              onClick={() => navigate(ROUTES.CUSTOMER.PAYMENT.METHODS)}
              className="text-xs font-bold text-blue-500"
            >
              Change
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-[10px] font-black uppercase text-gray-400">
                {selectedPaymentMethod?.id.slice(0, 4) || "CASH"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {selectedPaymentMethod?.type || "Cash on Delivery"}
                </p>
                <p className="text-xs font-medium text-gray-400">
                  {selectedPaymentMethod?.id === "chapa" ? "Secure digital payment" : "Pay at your door"}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </section>

        {/* --- Order Summary Section --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center justify-center text-green-500">
                <ReceiptText size={18} />
              </div>
              <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Price Details</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>Food Subtotal</span>
                <span className="text-gray-900 dark:text-white">ETB {foodPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Bike size={14} className="text-[#F26A1C]" />
                  <span>Delivery Fee</span>
                </div>
                <span className="text-gray-900 dark:text-white">ETB {deliveryFee.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>Service Fee (2%)</span>
                <span className="text-gray-900 dark:text-white">ETB {serviceFee.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>Processing Fee</span>
                <span className="text-gray-900 dark:text-white">ETB {transactionFee.toFixed(0)}</span>
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between">
                <span className="text-[15px] font-black text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-[17px] font-black text-[#F26A1C]">ETB {totalAmount.toFixed(0)}</span>
              </div>
            </div>
        </section>

        {/* --- Notes Section --- */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                <StickyNote size={18} />
              </div>
              <h2 className="text-[15px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Note to Driver</h2>
          </div>
          <textarea 
            value={noteToDriver}
            onChange={(e) => setNoteToDriver(e.target.value)}
            placeholder="e.g. Call me at the gate, don't ring the bell"
            className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl p-4 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-1 focus:ring-orange-100 outline-none min-h-[100px] resize-none"
          />
        </section>
      </main>

      {/* --- Footer Action --- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 pt-5 pb-8">
        <div className="flex items-center justify-between mb-4 px-2">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Final Amount</p>
              <p className="text-[19px] font-black text-gray-900 dark:text-white">ETB {totalAmount.toFixed(0)}</p>
           </div>
           <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
              <Lock size={12} strokeWidth={3} />
              <span>SECURE</span>
           </div>
        </div>
        
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing || orderLoading || !selectedPaymentMethod}
          className={cn(
            "w-full h-14 bg-[#F26A1C] text-white font-black text-[17px] rounded-full shadow-[0_8px_24px_rgba(242,106,28,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50",
            (isPlacing || orderLoading) && "opacity-80"
          )}
        >
          {isPlacing || orderLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ShoppingBag size={20} strokeWidth={2.5} />
              <span>Place Order</span>
            </>
          )}
        </button>
      </footer>

      {/* --- Waiting for Payment Modal --- */}
      <Dialog open={isWaitingPayment} onOpenChange={setIsWaitingPayment}>
        <DialogContent className="w-[85%] max-w-[320px] rounded-[32px] p-8 text-center animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-center text-[19px] font-black mb-2">Waiting for Payment</DialogTitle>
            <DialogDescription className="text-center text-[13px] font-bold text-gray-400">
              Please complete your payment via Chapa or TeleBirr to confirm your order.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
             <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-50 dark:border-orange-950/20 rounded-full flex items-center justify-center">
                   <Loader2 className="animate-spin text-[#F26A1C]" size={36} strokeWidth={3} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-white">
                   <Lock size={14} strokeWidth={3} />
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-sm font-black text-gray-900 dark:text-white">Securing your order...</p>
                <p className="text-xs font-bold text-gray-400">Estimated wait: <span className="text-[#F26A1C]">12s</span></p>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Payment Success Modal --- */}
      <Dialog open={isPaymentReceived} onOpenChange={setIsPaymentReceived}>
        <DialogContent className="w-[85%] max-w-[320px] rounded-[32px] p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center gap-6">
             <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-green-500" size={48} strokeWidth={3} />
             </div>
             <div className="space-y-2">
                <h3 className="text-[20px] font-black text-gray-900 dark:text-white">Payment Received!</h3>
                <p className="text-[13px] font-bold text-gray-400">
                   Your order has been confirmed. Redirecting you to tracking...
                </p>
             </div>
             <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-progress origin-left" />
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
