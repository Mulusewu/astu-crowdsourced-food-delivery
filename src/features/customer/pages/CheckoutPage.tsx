import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, ChevronRight, CreditCard, Loader2,
  ShoppingBag, Bike, ReceiptText, StickyNote, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/authStore";
import { useCartStore } from "@/store/cart/cartStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { toast } from "sonner";

export default function CartCheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // CRITICAL FIX: Rely purely on Backend Quote
  const { items: cartItems, quote, checkout, isLoading: cartLoading } = useCartStore();

  const [noteToDriver, setNoteToDriver] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  // Navigation Guards
  useEffect(() => {
    const isAuthorized = user && (user.role === "CUSTOMER" || user.role === "DELIVERER" || user.role === "ADMIN");
    if (!isAuthorized) {
      navigate(ROUTES.AUTH);
    } else if (cartItems.length === 0) {
      navigate(ROUTES.CUSTOMER.CART);
    }
  }, [user, cartItems.length, navigate]);

  const handlePlaceOrder = async () => {
    if (isPlacing || !quote) return;
    setIsPlacing(true);
    
    try {
      // Backend automatically maps cartItems and expectedUnitPrice, enforcing anti-spoofing.
      const orderId = await checkout();
      
      if (orderId) {
        toast.success("Order placed! Finding a deliverer...");
        // Redirect to Tracking Page. 
        // The tracking page handles the "AWAITING_ACCEPT" UI and waits for socket updates.
        navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.TRACK, { orderId }));
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#F26A1C]" /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-gray-950 font-sans antialiased text-black relative pb-40">
      {/* --- Header --- */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md z-30">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
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
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                {user?.customerProfile?.defaultDormBlock || "ASTU Campus"}
              </p>
            </div>
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
                <span className="text-gray-900 dark:text-white">ETB {Number(quote.foodPrice).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Bike size={14} className="text-[#F26A1C]" />
                  <span>Delivery Fee</span>
                </div>
                <span className="text-gray-900 dark:text-white">ETB {Number(quote.deliveryFee).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>Service Fee</span>
                <span className="text-gray-900 dark:text-white">ETB {Number(quote.serviceFee).toFixed(0)}</span>
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between">
                <span className="text-[15px] font-black text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-[17px] font-black text-[#F26A1C]">ETB {Number(quote.totalAmount).toFixed(0)}</span>
              </div>
            </div>
        </section>
      </main>

      {/* --- Footer Action --- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-6 pt-5 pb-8">
        <div className="flex items-center justify-between mb-4 px-2">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Final Amount</p>
              <p className="text-[19px] font-black text-gray-900 dark:text-white">ETB {Number(quote.totalAmount).toFixed(0)}</p>
           </div>
        </div>
        
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing || cartLoading}
          className={cn(
            "w-full h-14 bg-[#F26A1C] text-white font-black text-[17px] rounded-full shadow-[0_8px_24px_rgba(242,106,28,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50",
            (isPlacing || cartLoading) && "opacity-80"
          )}
        >
          {isPlacing || cartLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ShoppingBag size={20} strokeWidth={2.5} />
          )}
          <span>Confirm Order</span>
        </button>
      </footer>
    </div>
  );
}